const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  await page.goto('http://127.0.0.1:3000/work');
  await page.waitForTimeout(2000);

  console.log('Clicking on Green Square Infra on /work...');
  await Promise.all([
    page.waitForNavigation(),
    page.click('a[href="/work/green-square-infra"]')
  ]);
  console.log('Navigated to:', page.url());
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    return {
      h1: document.querySelector('h1')?.innerText,
      hasCanvas: !!document.querySelector('canvas')
    };
  });
  console.log('Result after navigation:', data);

  await browser.close();
})();
