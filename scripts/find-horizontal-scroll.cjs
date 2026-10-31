const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:3000/work/seven-gate-holdings');
  await page.waitForTimeout(2000);

  const overflowInfo = await page.evaluate(() => {
    const docWidth = document.documentElement.offsetWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    const bodyScrollWidth = document.body.scrollWidth;
    const windowInnerWidth = window.innerWidth;

    const overflowingElements = [];
    const all = document.querySelectorAll('*');
    all.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > windowInnerWidth + 1 || rect.left < -1) {
        overflowingElements.push({
          tag: el.tagName,
          className: String(el.className).slice(0, 50),
          id: el.id,
          right: rect.right,
          left: rect.left,
          width: rect.width,
          scrollWidth: el.scrollWidth,
          overflowX: window.getComputedStyle(el).overflowX
        });
      }
    });

    return {
      docWidth,
      scrollWidth,
      bodyScrollWidth,
      windowInnerWidth,
      hasHorizontalScroll: scrollWidth > docWidth || bodyScrollWidth > docWidth,
      overflowingCount: overflowingElements.length,
      overflowingElements: overflowingElements.slice(0, 15)
    };
  });

  console.log('Horizontal Overflow Diagnostics:', JSON.stringify(overflowInfo, null, 2));

  await browser.close();
})();
