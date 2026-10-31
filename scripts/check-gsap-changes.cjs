const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const changes = await page.evaluate(() => {
    const btn = document.querySelector('button.PrimaryNavigation_icon__qAQCe');
    const flyout = document.querySelector('aside.PrimaryNavigation_flyout__nH7QV');
    const body = document.body;
    const html = document.documentElement;

    const before = {
      flyoutInline: flyout.getAttribute('style'),
      bodyClass: body.className,
      htmlClass: html.className
    };

    btn.click();

    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          before,
          after: {
            flyoutInline: flyout.getAttribute('style'),
            bodyClass: body.className,
            htmlClass: html.className,
            flyoutTransform: window.getComputedStyle(flyout).transform,
            flyoutOpacity: window.getComputedStyle(flyout).opacity,
            flyoutClipPath: window.getComputedStyle(flyout).clipPath
          }
        });
      }, 500);
    });
  });

  console.log('Homepage GSAP / CSS changes on click:', JSON.stringify(changes, null, 2));

  await browser.close();
})();
