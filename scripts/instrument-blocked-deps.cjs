const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  await page.route('**/2117-ba8bcf71fc4483a9.js*', async route => {
    const response = await route.fetch();
    let body = await response.text();
    // Instrument C(e,t) or chunk loader in 2117
    // Where b("blocked", ...) is instantiated:
    body = body.replace(
      'new b("blocked",null,null,e)',
      '(console.log("CREATING BLOCKED CHUNK: id=", t, "data=", JSON.stringify(s)), new b("blocked",null,null,e))'
    );
    // When S is created in E(e):
    body = body.replace(
      'if(null!==S&&0<S.deps)S.value=o,e.status="blocked",e.value=null,e.reason=null;',
      'if(null!==S&&0<S.deps){console.log("BLOCKING ROW ON DEPS:", S.deps, "row value snippet:", r.slice(0, 100));S.value=o;e.status="blocked";e.value=null;e.reason=null;}'
    );
    // When $L reference is resolved:
    body = body.replace(
      'return function(r){t[n]=r,o.deps--',
      'return function(r){console.log("RESOLVED A DEP FOR ROW: remaining=", o.deps - 1);t[n]=r;o.deps--'
    );
    await route.fulfill({
      response,
      body,
      headers: {
        ...response.headers(),
        'content-length': Buffer.byteLength(body).toString()
      }
    });
  });

  page.on('console', msg => console.log(`[CONSOLE ${msg.type()}]:`, msg.text()));
  page.on('pageerror', err => console.log(`[PAGE ERROR]:`, err.message));

  console.log('Navigating to http://127.0.0.1:3000/work...');
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  await browser.close();
})();
