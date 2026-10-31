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
    // Check webpack require
    const w = window.__webpack_require__;
    return {
      hasWebpack: !!w,
      modules: w && w.m ? Object.keys(w.m).filter(k => k === '60119' || k === '78267') : []
    };
  });
  console.log('Webpack evaluation:', res);

  await browser.close();
})().catch(console.error);
