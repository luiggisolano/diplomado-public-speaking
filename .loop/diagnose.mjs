import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const TARGET_URL = process.argv[2] || 'http://localhost:4317/';
const OUT = fileURLToPath(new URL('./lcp-diag.json', import.meta.url));

const chrome = await launch({
  chromePath: chromium.executablePath(),
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
});
try {
  const { lhr } = await lighthouse(TARGET_URL, {
    port: chrome.port, output: 'json', logLevel: 'error',
    onlyCategories: ['performance'], formFactor: 'mobile',
    screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
  });
  const a = lhr.audits;
  const lcpAudit = a['largest-contentful-paint-element'];
  writeFileSync(fileURLToPath(new URL('./lcp-element-raw.json', import.meta.url)), JSON.stringify(lcpAudit?.details ?? {}, null, 2));
  const findNode = (obj) => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.type === 'node' && obj.snippet) return obj.snippet;
    for (const v of Object.values(obj)) { const r = findNode(v); if (r) return r; }
    return null;
  };
  const lcpElement = findNode(lcpAudit?.details);
  const lcpPhases = (lcpAudit?.details?.items || []).find((i) => i.type === 'table')?.items
    || lcpAudit?.details?.items?.[1]?.items || null;
  const renderBlocking = (a['render-blocking-resources']?.details?.items || []).map((i) => ({ url: i.url, ms: i.wastedMs, kb: Math.round((i.totalBytes || 0) / 1024) }));
  const opportunities = Object.entries(a)
    .filter(([, v]) => v?.details?.type === 'opportunity' && v.numericValue > 0)
    .map(([id, v]) => ({ id, savings_ms: Math.round(v.numericValue), title: v.title }))
    .sort((x, y) => y.savings_ms - x.savings_ms);

  const diag = {
    lcp_s: +(a['largest-contentful-paint'].numericValue / 1000).toFixed(3),
    lcp_element: lcpElement,
    lcp_phases: lcpPhases,
    render_blocking: renderBlocking,
    top_opportunities: opportunities.slice(0, 8),
  };
  writeFileSync(OUT, JSON.stringify(diag, null, 2) + '\n');
  console.log(JSON.stringify(diag, null, 2));
} finally {
  await chrome.kill();
}
