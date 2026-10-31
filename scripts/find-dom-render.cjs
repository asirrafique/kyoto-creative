const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const res = await page.evaluate(() => {
    let req;
    window.webpackChunk_N_E.push([['find_root'], {}, (r) => { req = r; }]);
    const matches = [];
    for (const k of Object.keys(req.m)) {
      try {
        const mod = req(k);
        if (mod && mod.createRoot) {
          matches.push({ k, type: 'createRoot' });
        }
        if (mod && mod.render && typeof mod.render === 'function') {
          matches.push({ k, type: 'render' });
        }
      } catch (e) {}
    }
    return matches;
  });
  console.log('DOM render matches:', res);

  await browser.close();
})().catch(console.error);
