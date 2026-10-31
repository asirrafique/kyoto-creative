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
    window.webpackChunk_N_E.push([['debug_chunk5'], {}, (r) => { req = r; }]);
    const matches = [];
    for (const k of Object.keys(req.m)) {
      const code = req.m[k].toString();
      if (code.includes('createRoot(')) {
        matches.push(k);
      }
    }
    return {
      matches,
      exported: matches.map(k => {
        try {
          const mod = req(k);
          return { k, keys: Object.keys(mod), hasCreateRoot: typeof mod.createRoot };
        } catch (e) {
          return { k, error: e.message };
        }
      })
    };
  });
  console.log('Result:', JSON.stringify(res, null, 2));

  await browser.close();
})().catch(console.error);
