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
    window.webpackChunk_N_E.push([['debug_chunk3'], {}, (r) => { req = r; }]);
    const React = req(2265);
    const ReactDOM = req(86258); // or find ReactDOM in req.m
    const CompArchive = req(60119).default;
    const CompFilters = req(78267).default;

    // Let's inspect where ReactDOM is
    let reactDomKey = Object.keys(req.m).find(k => req.m[k].toString().includes('createRoot') || req.m[k].toString().includes('.render('));

    return {
      hasReact: !!React,
      reactDomKey,
      archiveCode: CompArchive.toString().slice(0, 300)
    };
  });
  console.log('React check:', res);

  await browser.close();
})().catch(console.error);
