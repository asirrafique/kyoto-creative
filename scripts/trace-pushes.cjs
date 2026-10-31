const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  await page.addInitScript(() => {
    const origPush = window.__next_f ? window.__next_f.push : null;
    let count = 0;
    Object.defineProperty(window, '__next_f', {
      configurable: true,
      get() { return this._f; },
      set(val) {
        this._f = val;
        console.log('__next_f set to:', val);
        if (Array.isArray(val)) {
          const orig = val.push.bind(val);
          val.push = function(...args) {
            count++;
            console.log('PUSH #' + count + ':', JSON.stringify(args).slice(0, 80));
            return orig(...args);
          };
        }
      }
    });
  });

  page.on('console', msg => console.log('PAGE:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(3000);

  await browser.close();
})();
