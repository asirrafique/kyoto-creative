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
    const overflowing = [];
    const all = document.querySelectorAll('*');
    all.forEach(el => {
      // Check offsetWidth or scrollWidth relative to parent or document
      if (el.scrollWidth > docWidth || el.offsetWidth > docWidth) {
        overflowing.push({
          tag: el.tagName,
          className: String(el.className).slice(0, 60),
          id: el.id,
          offsetWidth: el.offsetWidth,
          scrollWidth: el.scrollWidth,
          parent: el.parentElement ? el.parentElement.tagName + '.' + String(el.parentElement.className).slice(0, 30) : null
        });
      }
    });

    return overflowing;
  });

  console.log('Elements with scrollWidth > docWidth:', JSON.stringify(overflowInfo, null, 2));

  await browser.close();
})();
