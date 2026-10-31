const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  for (const url of ['http://127.0.0.1:3000/', 'http://127.0.0.1:3000/work']) {
    console.log(`Testing navigation on ${url}...`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    
    // 1. Click burger icon
    await page.click('button.PrimaryNavigation_icon__qAQCe', { force: true });
    await page.waitForTimeout(300);

    const isNavActive = await page.evaluate(() => 
      document.querySelector('.PrimaryNavigation_page__DgiUM')?.classList.contains('PrimaryNavigation_active__gdInn')
    );
    console.log(`Burger menu active on ${url}:`, isNavActive);

    // 2. Click Services +
    await page.click('.PrimaryNavigation_parent__bfX37', { force: true });
    await page.waitForTimeout(300);

    const submenuState = await page.evaluate(() => {
      const submenu = document.querySelector('.PrimaryNavigation_submenu__ryGWu');
      const toggleSign = document.querySelector('.PrimaryNavigation_toggleSign__XESvT');
      return {
        hasSubmenuOpen: submenu?.classList.contains('PrimaryNavigation_submenuOpen__uJhU7'),
        hasToggleOpen: toggleSign?.classList.contains('PrimaryNavigation_toggleOpen__b_ys6'),
        submenuHeight: submenu?.offsetHeight,
        visibleLinks: Array.from(document.querySelectorAll('.PrimaryNavigation_submenu__ryGWu a')).map(a => a.textContent.trim())
      };
    });
    console.log(`Submenu state on ${url}:`, submenuState);
  }

  await page.screenshot({ path: 'scripts/services-open-test.png' });
  console.log('Saved screenshot of open Services menu to scripts/services-open-test.png');

  await browser.close();
})();
