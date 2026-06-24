import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from 'playwright';

const TARGET_URL = process.argv[2] || 'http://localhost:4317/';

async function run(label, opts) {
  const chrome = await launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
  });
  try {
    const { lhr } = await lighthouse(TARGET_URL, {
      port: chrome.port, output: 'json', logLevel: 'error',
      onlyCategories: ['performance'], formFactor: 'mobile',
      screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
      ...opts,
    });
    const m = lhr.audits.metrics?.details?.items?.[0] || {};
    return {
      label,
      lcp_simulado_s: +(lhr.audits['largest-contentful-paint'].numericValue / 1000).toFixed(3),
      lcp_observado_s: m.observedLargestContentfulPaint != null ? +(m.observedLargestContentfulPaint / 1000).toFixed(3) : null,
      fcp_observado_s: m.observedFirstContentfulPaint != null ? +(m.observedFirstContentfulPaint / 1000).toFixed(3) : null,
      ttfb_observado_s: m.observedNavigationStart != null && m.timeToFirstByte != null ? null : null,
    };
  } finally {
    await chrome.kill();
  }
}

const conThrottle = await run('movil CON throttling simulado (default)', {});
const sinThrottle = await run('movil SIN throttling (throttlingMethod=provided)', { throttlingMethod: 'provided', throttling: { rttMs: 0, throughputKbps: 0, cpuSlowdownMultiplier: 1, requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0 } });

console.log(JSON.stringify({ conThrottle, sinThrottle }, null, 2));
