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
    // In g(e), log when e is thrown or has error status
    body = body.replace(
      'function g(e){switch(e.status){case"resolved_model":E(e);break;case"resolved_module":w(e)}switch(e.status){case"fulfilled":return e.value;case"pending":case"blocked":case"cyclic":throw e;default:throw e.reason}}',
      'function g(e){switch(e.status){case"resolved_model":E(e);break;case"resolved_module":w(e)}if(e.status==="pending"||e.status==="blocked"||e.status==="cyclic"){console.warn("g(e) SUSPENDING ON CHUNK: status=", e.status, "value=", e.value, "reason=", e.reason);throw e;}if(e.status==="fulfilled")return e.value;console.error("g(e) THROWING REASON:", e.status, e.reason);throw e.reason;}'
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
