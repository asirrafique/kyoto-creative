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
          for (const item of args) {
            if (Array.isArray(item) && typeof item[1] === 'string') {
              if (item[1].includes('["$",null')) {
                console.log('PUSH CONTAINS ["$",null:');
                console.log(item[1].slice(item[1].indexOf('["$",null') - 50, item[1].indexOf('["$",null') + 100));
              }
              if (item[1].includes('$L2c')) {
                console.log('PUSH CONTAINS $L2c:');
                console.log(item[1].slice(item[1].indexOf('$L2c') - 20, item[1].indexOf('$L2c') + 50));
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
