import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TARGET_URL = process.argv[2] || 'http://localhost:4317/';
const STATE_PATH = fileURLToPath(new URL('./state.json', import.meta.url));

const GATES = {
  lcp_s: 2.5,
  inp_proxy_tbt_ms: 200,
  cls: 0.1,
  js_kb: 365,
  delta_heap_mb: 1,
};

const CHROME_PATH = chromium.executablePath();

function fail(metric, err) {
  console.error(`[MEDICION FALLIDA] ${metric}: ${err?.message || err}`);
  return null;
}

function median(values) {
  const v = values.filter((x) => x != null).sort((a, b) => a - b);
  if (!v.length) return null;
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : +((v[mid - 1] + v[mid]) / 2).toFixed(3);
}

async function runLighthouseMedian(runs = 3) {
  const samples = [];
  for (let i = 0; i < runs; i++) {
    samples.push(await runLighthouseOnce());
    console.error(`  corrida lighthouse ${i + 1}/${runs}: lcp=${samples[i].lcp_s}s tbt=${samples[i].inp_proxy_tbt_ms}ms`);
  }
  return {
    lcp_s: median(samples.map((s) => s.lcp_s)),
    inp_proxy_tbt_ms: median(samples.map((s) => s.inp_proxy_tbt_ms)),
    cls: median(samples.map((s) => s.cls)),
    js_kb: median(samples.map((s) => s.js_kb)),
    seo_score: median(samples.map((s) => s.seo_score)),
    _muestras_lcp: samples.map((s) => s.lcp_s),
  };
}

async function runLighthouseOnce() {
  let chrome;
  try {
    chrome = await launch({
      chromePath: CHROME_PATH,
      chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
    });
    const result = await lighthouse(TARGET_URL, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'seo'],
      formFactor: 'mobile',
      screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
    });
    const a = result.lhr.audits;
    const scriptBytes = (a['resource-summary']?.details?.items || [])
      .find((i) => i.resourceType === 'script')?.transferSize || null;
    return {
      lcp_s: a['largest-contentful-paint']?.numericValue != null ? +(a['largest-contentful-paint'].numericValue / 1000).toFixed(3) : fail('lcp'),
      inp_proxy_tbt_ms: a['total-blocking-time']?.numericValue != null ? Math.round(a['total-blocking-time'].numericValue) : fail('tbt'),
      cls: a['cumulative-layout-shift']?.numericValue != null ? +a['cumulative-layout-shift'].numericValue.toFixed(4) : fail('cls'),
      js_kb: scriptBytes != null ? +(scriptBytes / 1024).toFixed(1) : fail('js'),
      seo_score: result.lhr.categories.seo?.score != null ? +result.lhr.categories.seo.score.toFixed(2) : fail('seo'),
    };
  } catch (e) {
    return { lcp_s: fail('lcp', e), inp_proxy_tbt_ms: fail('tbt', e), cls: fail('cls', e), js_kb: fail('js', e), seo_score: fail('seo', e) };
  } finally {
    if (chrome) await chrome.kill();
  }
}

async function measureHeapDelta() {
  let browser;
  try {
    browser = await chromium.launch({ executablePath: CHROME_PATH, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const cdp = await page.context().newCDPSession(page);

    await page.goto('about:blank');
    await cdp.send('HeapProfiler.collectGarbage');
    const baseline = await page.evaluate(() => performance.memory?.usedJSHeapSize ?? null);

    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
    });

    await page.goto('about:blank');
    await cdp.send('HeapProfiler.collectGarbage');
    await page.waitForTimeout(500);
    const afterUnmount = await page.evaluate(() => performance.memory?.usedJSHeapSize ?? null);

    if (baseline == null || afterUnmount == null) return fail('heap', 'performance.memory no disponible');
    return +(((afterUnmount - baseline) / (1024 * 1024))).toFixed(3);
  } catch (e) {
    return fail('heap', e);
  } finally {
    if (browser) await browser.close();
  }
}

function scoreOf(m) {
  const terms = [
    ['lcp_s', m.lcp_s], ['inp_proxy_tbt_ms', m.inp_proxy_tbt_ms],
    ['cls', m.cls], ['js_kb', m.js_kb], ['delta_heap_mb', m.delta_heap_mb],
  ];
  let score = 0;
  for (const [k, v] of terms) {
    if (v == null) { score += 1; continue; }
    score += Math.max(0, (v - GATES[k]) / GATES[k]);
  }
  return +score.toFixed(4);
}

const lh = await runLighthouseMedian(3);
const delta_heap_mb = await measureHeapDelta();
const metrics = { ...lh, delta_heap_mb };

const cond = {
  perf: metrics.lcp_s != null && metrics.lcp_s <= GATES.lcp_s &&
        metrics.inp_proxy_tbt_ms != null && metrics.inp_proxy_tbt_ms <= GATES.inp_proxy_tbt_ms &&
        metrics.js_kb != null && metrics.js_kb <= GATES.js_kb,
  leak: metrics.delta_heap_mb != null && metrics.delta_heap_mb <= GATES.delta_heap_mb,
  visual: metrics.cls != null && metrics.cls <= GATES.cls,
  seo: metrics.seo_score != null && metrics.seo_score >= 0.95,
};

const state = JSON.parse(readFileSync(STATE_PATH, 'utf8'));
const score = scoreOf(metrics);
const prevHeap = state.ultimas_metricas?.delta_heap_mb ?? null;

state.iteracion += 1;
state.score_anterior = state.historial.length ? state.historial[state.historial.length - 1].score : null;
state.heap_anterior_mb = prevHeap;
state.ultimas_metricas = metrics;
state.condiciones = { ...state.condiciones, ...cond };
state.historial.push({ iteracion: state.iteracion, score, metrics, condiciones: cond });

writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n');

console.log(JSON.stringify({ iteracion: state.iteracion, score, score_anterior: state.score_anterior, metrics, condiciones: cond, gates: GATES }, null, 2));
