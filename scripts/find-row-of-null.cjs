const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  await page.addInitScript(() => {
    let internalArr = [];
    Object.defineProperty(window, '__next_f', {
      configurable: true,
      enumerable: true,
      get() { return internalArr; },
      set(val) {
        internalArr = val;
        const origPush = val.push.bind(val);
        val.push = function(...args) {
          for (let k = 0; k < args.length; k++) {
            const item = args[k];
            if (Array.isArray(item) && typeof item[1] === 'string') {
              if (item[1].includes('["$",null')) {
                const s = item[1];
                const idx = s.indexOf('["$",null');
                console.log('Script tag text length:', s.length);
                console.log('Row around idx:', s.slice(Math.max(0, idx - 100), idx + 200));
              }
            }
          }
          return origPush(...args);
        };
      }
    });
  });

  page.on('console', msg => console.log('INTERCEPT:', msg.text()));
  await page.goto('http://127.0.0.1:3000/agency', { waitUntil: 'load' });
  await browser.close();
})();
