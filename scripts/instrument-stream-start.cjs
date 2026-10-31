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
    // In function start(e){ ... }
    body = body.replace(
      'start(e){r&&(r.forEach(t=>{e.enqueue(b.encode(t))}),g&&!m&&(e.close(),m=!0,r=void 0)),o=e}',
      'start(e){console.log("ReadableStream START called! r len=", r && r.length, "g=", g, "m=", m);r&&(r.forEach(t=>{e.enqueue(b.encode(t))}),g&&!m&&(console.log("STREAM CLOSED in start!"),e.close(),m=!0,r=void 0)),o=e}'
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
