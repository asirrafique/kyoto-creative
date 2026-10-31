const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  const t0 = Date.now();
  await page.goto('http://127.0.0.1:3000/work/green-square-infra', { waitUntil: 'load' });
  const loadTime = Date.now() - t0;
  console.log('Green Square Infra Load time:', loadTime, 'ms');
  console.log('Errors:', errors);

  await page.screenshot({ path: 'green_square_infra_verified.png' });
  await browser.close();
})().catch(console.error);
