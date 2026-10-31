const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:3000/work/seven-gate-holdings');
  await page.waitForTimeout(2000);

  const containerDetails = await page.evaluate(() => {
    const container = document.querySelector('section[class*="Intro"] .container');
    const style = window.getComputedStyle(container);
    return {
      offsetWidth: container.offsetWidth,
      scrollWidth: container.scrollWidth,
      clientWidth: container.clientWidth,
      display: style.display,
      gridTemplateColumns: style.gridTemplateColumns,
      gridColumnGap: style.gridColumnGap,
      gap: style.gap,
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
      width: style.width,
      maxWidth: style.maxWidth
    };
  });

  console.log('Intro container computed styles:', containerDetails);

  await browser.close();
})();
