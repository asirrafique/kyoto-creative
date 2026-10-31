const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const navHtml = await page.evaluate(() => {
    const nav = document.querySelector('.PrimaryNavigation_primaryNavigation__2Wc3L') || document.querySelector('nav') || document.querySelector('aside');
    return {
      navOuter: nav ? nav.outerHTML : null
    };
  });

  console.log('Nav HTML on /work:');
  console.log(navHtml.navOuter ? navHtml.navOuter.slice(0, 1000) : 'None');

  await browser.close();
})();
