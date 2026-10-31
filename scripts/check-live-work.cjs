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

  const evalResult = await page.evaluate(() => {
    return {
      title: document.title,
      htmlLength: document.documentElement.outerHTML.length,
      containerHtml: document.querySelector('.Work_projectsWithFilters__mwDTM')?.innerHTML
    };
  });
  console.log('Result:', evalResult);

  await browser.close();
})();
