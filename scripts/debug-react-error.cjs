const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log(`[BROWSER ${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => console.log(`[PAGE ERROR]`, err.stack || err));

  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const html = await page.content();
  console.log('Body length:', html.length);
  
  await browser.close();
})();
