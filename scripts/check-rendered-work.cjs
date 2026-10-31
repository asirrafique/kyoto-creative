const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log(`[CONSOLE ${msg.type()}]:`, msg.text()));
  page.on('pageerror', err => console.log(`[PAGE ERROR]:`, err.message));

  console.log('Navigating to http://127.0.0.1:3000/work...');
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  const dump = await page.evaluate(() => {
    const el = document.querySelector('.Work_projectsWithFilters__mwDTM');
    return {
      exists: !!el,
      childCount: el ? el.children.length : 0,
      innerHTML: el ? el.innerHTML : 'none'
    };
  });

  console.log('DOM dump:', dump);

  await browser.close();
})();
