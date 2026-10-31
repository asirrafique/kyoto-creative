const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const consoleLogs = [];
  const pageErrors = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => pageErrors.push(err.toString()));

  console.log('Testing menu button on http://127.0.0.1:3000/work ...');
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const menuInfo = await page.evaluate(() => {
    const burger = document.querySelector('button[class*="burger"], button[class*="Burger"], button[class*="PrimaryNavigation"], [aria-label*="menu" i]');
    const allButtons = Array.from(document.querySelectorAll('button')).map(b => ({
      className: b.className,
      ariaLabel: b.getAttribute('aria-label'),
      innerHTML: b.innerHTML.slice(0, 100),
      rect: b.getBoundingClientRect()
    }));
    return {
      burgerFound: !!burger,
      allButtons
    };
  });

  console.log('Menu info:', JSON.stringify(menuInfo, null, 2));

  // Try clicking the burger button
  const burgerBtn = page.locator('button[class*="burger"], button[class*="Burger"], button[class*="PrimaryNavigation"]');
  if (await burgerBtn.count() > 0) {
    console.log('Found burger button, clicking...');
    await burgerBtn.first().click();
    await page.waitForTimeout(500);

    const isFlyoutOpen = await page.evaluate(() => {
      const flyout = document.querySelector('[class*="flyout"], [class*="Flyout"], aside');
      return {
        flyoutFound: !!flyout,
        className: flyout ? flyout.className : null,
        visible: flyout ? window.getComputedStyle(flyout).visibility : null,
        transform: flyout ? window.getComputedStyle(flyout).transform : null,
        opacity: flyout ? window.getComputedStyle(flyout).opacity : null
      };
    });
    console.log('Flyout state after click:', isFlyoutOpen);
  }

  console.log('Console logs:', consoleLogs);
  console.log('Page errors:', pageErrors);

  await browser.close();
})();
