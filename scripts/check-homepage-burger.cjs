const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  console.log('Testing menu button on homepage http://127.0.0.1:3000/ ...');
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const burgerBtn = page.locator('button.PrimaryNavigation_icon__qAQCe');
  console.log('Found on homepage:', await burgerBtn.count());
  await burgerBtn.click();
  await page.waitForTimeout(600);

  const flyoutState = await page.evaluate(() => {
    const flyout = document.querySelector('aside.PrimaryNavigation_flyout__nH7QV');
    const nav = document.querySelector('.PrimaryNavigation_primaryNavigation__2Wc3L');
    return {
      flyoutClasses: flyout ? flyout.className : null,
      parentClasses: nav ? nav.className : null,
      opacity: flyout ? window.getComputedStyle(flyout).opacity : null,
      transform: flyout ? window.getComputedStyle(flyout).transform : null
    };
  });
  console.log('Homepage flyout state after click:', flyoutState);

  await browser.close();
})();
