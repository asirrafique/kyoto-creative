const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:3000/work/seven-gate-holdings');
  await page.waitForTimeout(2000);

  const containerInfo = await page.evaluate(() => {
    const container = document.querySelector('section[class*="Intro"] .container');
    const intro = document.querySelector('section[class*="Intro"]');
    
    // Check computed styles on container
    const cs = window.getComputedStyle(container);

    return {
      containerPaddingLeft: cs.paddingLeft,
      containerPaddingRight: cs.paddingRight,
      containerMarginLeft: cs.marginLeft,
      containerMarginRight: cs.marginRight,
      containerWidth: cs.width,
      containerMaxWidth: cs.maxWidth,
      containerBoxSizing: cs.boxSizing,
      containerClientWidth: container.clientWidth,
      containerScrollWidth: container.scrollWidth,
      introClientWidth: intro.clientWidth,
      introScrollWidth: intro.scrollWidth,
      windowInnerWidth: window.innerWidth
    };
  });

  console.log('Container details:', containerInfo);

  // Now test fixing the container
  const fixTest = await page.evaluate(() => {
    const container = document.querySelector('section[class*="Intro"] .container');
    container.style.maxWidth = '100%';
    container.style.overflow = 'hidden';

    return {
      bodyScrollWidth: document.body.scrollWidth,
      htmlScrollWidth: document.documentElement.scrollWidth,
      containerScrollWidth: container.scrollWidth
    };
  });
  console.log('After container style fix:', fixTest);

  await browser.close();
})();
