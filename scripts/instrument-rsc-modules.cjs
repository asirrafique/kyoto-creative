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
    // In case 73, log what module is being loaded!
    body = body.replace(
      'case 73:!function(e,t,r){',
      'case 73:!function(e,t,r){console.log("RSC MODULE ROW I: id=", t, "data=", r);'
    );
    // In g(e), log which chunk ID e is!
    body = body.replace(
      'function g(e){switch(e.status){case"resolved_model":E(e);break;case"resolved_module":w(e)}switch(e.status){case"fulfilled":return e.value;case"pending":case"blocked":case"cyclic":throw e;default:throw e.reason}}',
      'function g(e){switch(e.status){case"resolved_model":E(e);break;case"resolved_module":w(e)}if(e.status==="blocked"||e.status==="pending"){console.log("g(e) waiting for chunk:", e._id || e.id || e);throw e;}switch(e.status){case"fulfilled":return e.value;case"pending":case"blocked":case"cyclic":throw e;default:throw e.reason}}'
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
