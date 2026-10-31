const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  const text = await page.evaluate(() => {
    return document.querySelector('script[data-replica-runtime]').textContent;
  });
  const i1 = text.indexOf('(function installWorkArchiveMount()');
  const i2 = text.indexOf('setInterval(tryMount, 1000);\n})();', i1);
  const snippet = text.slice(i1, i2 + 'setInterval(tryMount, 1000);\n})();'.length);

  const testRun = await page.evaluate((code) => {
    let trace = [];
    const instrumented = code.replace(
      'function tryMount() {',
      'function tryMount() { window.__trace = window.__trace || []; const T = (m) => window.__trace.push(m); T("started");'
    )
    .replace('if (window.__work_mounted) return;', 'if (window.__work_mounted) { T("ret: mounted"); return; }')
    .replace("if (window.location.pathname !== '/work' && window.location.pathname !== '/work/') return;", 'if (window.location.pathname !== "/work" && window.location.pathname !== "/work/") { T("ret: pathname " + window.location.pathname); return; }')
    .replace('if (!container) return;', 'if (!container) { T("ret: no container"); return; }')
    .replace('if (!window.webpackChunk_N_E || !window.__next_f) return;', 'if (!window.webpackChunk_N_E || !window.__next_f) { T("ret: no webpack or next_f"); return; }')
    .replace('if (!req) return;', 'if (!req) { T("ret: no req"); return; }')
    .replace('} catch (e) {', '} catch (e) { T("req catch: " + e.message);')
    .replace('if (!React || !createRoot || !CompArchive || !appRouterMod || !pathContextMod) return;', 'if (!React || !createRoot || !CompArchive || !appRouterMod || !pathContextMod) { T("ret: missing mods " + JSON.stringify({React:!!React, createRoot:!!createRoot, CompArchive:!!CompArchive, appRouterMod:!!appRouterMod, pathContextMod:!!pathContextMod})); return; }')
    .replace('if (!rawData) return;', 'if (!rawData) { T("ret: no rawData"); return; }')
    .replace('if (eIdx === -1) return;', 'if (eIdx === -1) { T("ret: no eIdx"); return; }');

    window.eval(instrumented);
    return window.__trace;
  }, snippet);

  console.log('TRACE RESULT:', testRun);
  await browser.close();
})();
