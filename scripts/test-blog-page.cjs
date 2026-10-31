const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));

  console.log('Testing /blog/5-cool-brands-in-characteristically-boring-industries...');
  await page.goto('http://127.0.0.1:3000/blog/5-cool-brands-in-characteristically-boring-industries', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  console.log('Errors on blog page:', errors);
  const title = await page.title();
  console.log('Title:', title);

  await browser.close();
})();
