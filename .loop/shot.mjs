import { chromium } from 'playwright';

const URL = process.argv[2] || 'http://localhost:4317/';
const browser = await chromium.launch({ executablePath: chromium.executablePath(), args: ['--no-sandbox'] });
try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await desktop.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await desktop.waitForTimeout(2800);
  await desktop.screenshot({ path: '.loop/preview-desktop.png' });
  console.log('desktop OK');

  const mobile = await browser.newPage({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 2, isMobile: true });
  await mobile.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await mobile.waitForTimeout(2800);
  await mobile.screenshot({ path: '.loop/preview-mobile.png' });
  console.log('mobile OK');
} finally {
  await browser.close();
}
