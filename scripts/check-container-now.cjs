const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const html = await page.evaluate(() => {
    const cont = document.querySelector('.Work_projectsWithFilters__mwDTM .container');
    return cont ? cont.innerHTML.slice(0, 500) : 'none';
  });
  console.log('Container HTML preview:');
  console.log(html);

  await browser.close();
})().catch(console.error);
