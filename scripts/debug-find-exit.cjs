const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  const text = await page.evaluate(() => {
    return document.querySelector('script[data-replica-runtime]').textContent;
  });
  const i1 = text.indexOf('installWorkArchiveMount');
  const i2 = text.indexOf('setInterval(tryMount, 1000);', i1);
  const snippet = text.slice(i1 - 10, i2 + 40);

  const res = await page.evaluate((code) => {
    const fnStr = code;
    // test step by step
    const stepLog = [];
    function tryMountTest() {
      if (window.__work_mounted) { stepLog.push('already mounted'); return; }
      if (window.location.pathname !== '/work' && window.location.pathname !== '/work/') { stepLog.push('wrong path: ' + window.location.pathname); return; }
      const container = document.querySelector('.Work_projectsWithFilters__mwDTM .container');
      if (!container) { stepLog.push('no container'); return; }
      if (!window.webpackChunk_N_E) { stepLog.push('no webpackChunk_N_E'); return; }
      if (!window.__next_f) { stepLog.push('no __next_f'); return; }
      
      let req;
      try {
        window.webpackChunk_N_E.push([['test_run'], {}, (r) => { req = r; }]);
      } catch(e) {
        stepLog.push('push error: ' + e.message);
        return;
      }
      if (!req) { stepLog.push('no req'); return; }
      
      let React, createRoot, CompArchive, CompFilters, appRouterMod, pathContextMod;
      try {
        React = req(2265);
        const reactDom = req(34040);
        createRoot = reactDom ? reactDom.createRoot : null;
        CompArchive = req(60119) ? req(60119).default : null;
        CompFilters = req(78267) ? req(78267).default : null;
        appRouterMod = req(61956);
        pathContextMod = req(79060);
      } catch (e) {
        stepLog.push('req modules catch: ' + e.message);
        return;
      }

      if (!React) { stepLog.push('no React'); return; }
      if (!createRoot) { stepLog.push('no createRoot'); return; }
      if (!CompArchive) { stepLog.push('no CompArchive'); return; }
      if (!appRouterMod) { stepLog.push('no appRouterMod'); return; }
      if (!pathContextMod) { stepLog.push('no pathContextMod'); return; }

      let rawData = null;
      for (const item of window.__next_f) {
        if (Array.isArray(item) && typeof item[1] === 'string' && item[1].includes('$L2e')) {
          rawData = item[1];
          break;
        }
      }
      if (!rawData) { stepLog.push('no rawData'); return; }

      const ePrefix = '["$","$L2e",null,{"projects":';
      const eIdx = rawData.indexOf(ePrefix);
      if (eIdx === -1) { stepLog.push('no ePrefix'); return; }

      stepLog.push('ALL CHECKS PASSED!');
    }
    tryMountTest();
    return stepLog;
  });
  console.log('Step log:', res);
  await browser.close();
})();
