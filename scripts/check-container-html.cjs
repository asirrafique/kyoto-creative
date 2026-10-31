const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const containerHTML = await page.evaluate(() => {
    const el = document.querySelector('.Work_projectsWithFilters__mwDTM');
    return el ? el.outerHTML : 'NOT FOUND';
  });
  console.log('Work container outerHTML:');
  console.log(containerHTML);

  await browser.close();
})().catch(console.error);
