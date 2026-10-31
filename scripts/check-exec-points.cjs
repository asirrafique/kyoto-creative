const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  const runCode = await page.evaluate(() => {
    let req;
    window.webpackChunk_N_E.push([['work_auto_mount_check'], {}, (r) => { req = r; }]);
    let React, createRoot, CompArchive;
    try {
      React = req(2265);
      const reactDom = req(34040);
      createRoot = reactDom ? reactDom.createRoot : null;
      CompArchive = req(60119) ? req(60119).default : null;
    } catch (e) {
      return 'Catch 1: ' + e.message;
    }
    if (!React || !createRoot || !CompArchive) return 'Null components';

    let rawData = null;
    for (const item of window.__next_f) {
      if (Array.isArray(item) && typeof item[1] === 'string' && item[1].includes('$L2e')) {
        rawData = item[1];
        break;
      }
    }
    if (!rawData) return 'No rawData';

    const ePrefix = '["$","$L2e",null,{"projects":';
    const eIdx = rawData.indexOf(ePrefix);
    if (eIdx === -1) return 'No eIdx';

    return 'ALL_GOOD: ' + eIdx;
  });
  console.log('runCode return:', runCode);
  await browser.close();
})();
