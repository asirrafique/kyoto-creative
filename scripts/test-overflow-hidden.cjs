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
    const style = document.createElement('style');
    style.innerHTML = `
      html, body {
        overflow-x: hidden !important;
        max-width: 100vw !important;
      }
      .container {
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
    `;
    document.head.appendChild(style);

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

  console.log('Result with style:', testResults);

  await browser.close();
})();
