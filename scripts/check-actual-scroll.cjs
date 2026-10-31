const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:3000/work/seven-gate-holdings');
  await page.waitForTimeout(2000);

  const scrollCheck = await page.evaluate(() => {
    // Attempt to scroll horizontally
    window.scrollTo(100, 0);
    const scrollX = window.scrollX;
    return {
      scrollX,
      canScrollHorizontally: scrollX > 0,
      docClientWidth: document.documentElement.clientWidth,
      docScrollWidth: document.documentElement.scrollWidth,
      windowInnerWidth: window.innerWidth
    };
  });

  console.log('Scroll check in browser:', scrollCheck);

  await browser.close();
})();
