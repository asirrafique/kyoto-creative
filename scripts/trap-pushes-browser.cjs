const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  await page.addInitScript(() => {
    window.__trapped = [];
    const origPush = Array.prototype.push;
    // trap __next_f
    let _next_f = window.__next_f;
    Object.defineProperty(window, '__next_f', {
      configurable: true,
      get() { return _next_f; },
      set(val) {
        _next_f = val;
        if (Array.isArray(val)) {
          const innerPush = val.push;
          val.push = function(...args) {
            window.__trapped.push(args);
            return innerPush.apply(this, args);
          };
        }
      }
    });
  });

  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  const pushes = await page.evaluate(() => {
    return window.__trapped ? window.__trapped.map(t => {
      const item = t[0];
      return {
        type: item ? item[0] : null,
        data: item && item[1] ? String(item[1]).slice(0, 40) : null
      };
    }) : [];
  });
  console.log('Trapped pushes count:', pushes.length);
  pushes.forEach((p, idx) => console.log(idx, p.type, p.data));

  await browser.close();
})();
