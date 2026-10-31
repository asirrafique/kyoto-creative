const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const urls = [
    'http://127.0.0.1:3000/work',
    'http://127.0.0.1:3000/work/green-square-infra',
    'http://127.0.0.1:3000/work/seven-gate-holdings',
    'http://127.0.0.1:3000/'
  ];

  for (const url of urls) {
    console.log(`\nTesting burger menu on ${url}...`);
    await page.goto(url, { waitUntil: 'load', timeout: 15000 });
    await page.waitForTimeout(1000);

    const btn = page.locator('button.PrimaryNavigation_icon__qAQCe');
    const count = await btn.count();
    if (count === 0) {
      console.log('No burger button found on', url);
      continue;
    }

    // Check state before click
    const beforeState = await page.evaluate(() => {
      const flyout = document.querySelector('aside.PrimaryNavigation_flyout__nH7QV');
      return {
        opacity: flyout ? window.getComputedStyle(flyout).opacity : null,
        pointerEvents: flyout ? window.getComputedStyle(flyout).pointerEvents : null
      };
    });

    // Click burger button
    await btn.first().click();
    await page.waitForTimeout(600);

    // Check state after click
    const afterClick = await page.evaluate(() => {
      const flyout = document.querySelector('aside.PrimaryNavigation_flyout__nH7QV');
      const container = document.querySelector('.PrimaryNavigation_page__DgiUM');
      return {
        isActive: container ? container.classList.contains('PrimaryNavigation_active__gdInn') : false,
        opacity: flyout ? window.getComputedStyle(flyout).opacity : null,
        pointerEvents: flyout ? window.getComputedStyle(flyout).pointerEvents : null,
        transform: flyout ? window.getComputedStyle(flyout).transform : null
      };
    });

    console.log(`Result on ${url}:`);
    console.log('Before click:', beforeState);
    console.log('After click:', afterClick);

    if (afterClick.isActive && afterClick.opacity === '1' && afterClick.pointerEvents === 'all') {
      console.log(`=> SUCCESS: Menu opened on ${url}`);
    } else {
      console.log(`=> FAILED on ${url}`);
    }

    // Click overlay or close button to close
    await btn.first().click();
    await page.waitForTimeout(400);
  }

  // Take screenshot of /work with menu open
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.locator('button.PrimaryNavigation_icon__qAQCe').first().click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'scripts/work-menu-open.png' });
  console.log('\nScreenshot of /work with menu open saved to scripts/work-menu-open.png');

  await browser.close();
})();
