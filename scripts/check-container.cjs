const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const html = await page.locator('.Work_projectsWithFilters__mwDTM').innerHTML();
  console.log('Work container innerHTML length:', html.length);
  console.log('Work container preview:', html.slice(0, 500));

  await browser.close();
})().catch(console.error);
