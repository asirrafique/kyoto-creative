const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:3000/work/seven-gate-holdings');
  await page.waitForTimeout(2000);

  const culprits = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('*').forEach(el => {
      if (el.scrollWidth > 1425) {
        list.push({
          tag: el.tagName,
          className: el.className,
          scrollWidth: el.scrollWidth,
          offsetWidth: el.offsetWidth,
          style: el.getAttribute('style')
        });
      }
    });
    return list;
  });

  console.log('All elements with scrollWidth > 1425:', culprits);

  await browser.close();
})();
