const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  await page.addInitScript(() => {
    window.addEventListener('error', e => {
      console.log('INIT ERROR:', e.message, e.filename, e.lineno);
    });
    const origError = console.error;
    console.error = function(...args) {
      console.log('INIT CONSOLE ERROR:', ...args);
      origError.apply(this, args);
    };
  });

  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.stack || err.message));

  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  const diag = await page.evaluate(() => {
    return {
      nextF: window.__next_f ? window.__next_f.length : null,
      errors: window.__next_f ? window.__next_f.map(x => x[0]) : null
    };
  });
  console.log('Diag:', diag);

  await browser.close();
})();
