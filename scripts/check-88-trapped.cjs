const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('LOG:', msg.text()));

  await page.goto('http://127.0.0.1:3000/work/88pilot');
  await page.waitForTimeout(2000);

  await browser.close();
})();
