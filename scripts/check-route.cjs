const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  // Intercept chunk
  await page.route('**/page-5b3919766e28ce0e.js', route => {
    console.log('Intercepted work chunk request:', route.request().url());
    route.continue();
  });

  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await browser.close();
})().catch(console.error);
