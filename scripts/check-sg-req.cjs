const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  await page.route('**/*', route => {
    console.log('Request:', route.request().method(), route.request().url());
    route.continue();
  });

  const res = await page.goto('http://127.0.0.1:3000/work/seven-gate-holdings', { waitUntil: 'load' });
  console.log('Status:', res.status());
  console.log('Final URL:', page.url());

  await browser.close();
})().catch(console.error);
