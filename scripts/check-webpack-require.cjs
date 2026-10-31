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
    // Find webpack require inside webpackChunk_N_E
    let req;
    window.webpackChunk_N_E.push([['debug_chunk'], {}, (r) => { req = r; }]);
    if (!req) return 'no req';
    return {
      has60119: !!req.m[60119],
      has78267: !!req.m[78267],
      allKeys: Object.keys(req.m).slice(0, 20)
    };
  });
  console.log('Chunk require check:', res);

  await browser.close();
})().catch(console.error);
