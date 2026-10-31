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

  const homeClasses = await page.evaluate(() => {
    const btn = document.querySelector('button.PrimaryNavigation_icon__qAQCe');
    const flyout = document.querySelector('aside.PrimaryNavigation_flyout__nH7QV');
    const overlay = document.querySelector('.PrimaryNavigation_pageOverlay__QD6me');
    const parent = btn.parentElement;

    const before = {
      btn: btn ? btn.className : null,
      flyout: flyout ? flyout.className : null,
      overlay: overlay ? overlay.className : null,
      parent: parent ? parent.className : null
    };

    btn.click();

    const after = {
      btn: btn ? btn.className : null,
      flyout: flyout ? flyout.className : null,
      overlay: overlay ? overlay.className : null,
      parent: parent ? parent.className : null
    };

    return { before, after };
  });

  console.log('Homepage click classes:', JSON.stringify(homeClasses, null, 2));

  await browser.close();
})();
