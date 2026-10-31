const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:3000/work/seven-gate-holdings');
  await page.waitForTimeout(2000);

  const testResults = await page.evaluate(() => {
    // Test 1: set overflow-x: clip on html, body
    document.documentElement.style.overflowX = 'clip';
    document.body.style.overflowX = 'clip';

    const docWidth = document.documentElement.offsetWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    const bodyScrollWidth = document.body.scrollWidth;

    return {
      docWidth,
      scrollWidth,
      bodyScrollWidth,
      hasHorizontalScroll: scrollWidth > docWidth || bodyScrollWidth > docWidth
    };
  });

  console.log('Result with overflow-x: clip:', testResults);

  await browser.close();
})();
