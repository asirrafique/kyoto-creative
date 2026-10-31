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
    window.webpackChunk_N_E.push([['debug_chunk2'], {}, (r) => { req = r; }]);
    const mod = req(60119);
    return {
      modKeys: Object.keys(mod),
      modDefault: typeof mod.default
    };
  });
  console.log('Component 60119 check:', res);

  await browser.close();
})().catch(console.error);
