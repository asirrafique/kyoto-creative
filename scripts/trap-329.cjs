const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  // Intercept the JS chunk fd9d1056 and replace minified react error throw
  // or catch right when Error is created
  await page.addInitScript(() => {
    const origError = window.Error;
    window.Error = function(message) {
      if (typeof message === 'string' && message.includes('329')) {
        console.error('TRAPPED REACT 329 ERROR:', new origError().stack);
      }
      return new origError(message);
    };
  });

  page.on('console', msg => console.log(`[CONSOLE ${msg.type()}]:`, msg.text()));
  page.on('pageerror', err => console.log(`[PAGE ERROR]:`, err.stack));

  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  await browser.close();
})();
