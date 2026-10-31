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
    // Instrument function w(e)
    body = body.replace(
      'function w(e){try{var t=e.value,r=n(t[0]);',
      'function w(e){console.log("w(e) executing for module:", e.value && e.value[0]);try{var t=e.value,r=n(t[0]);'
    );
    // In catch of w(e)
    body = body.replace(
      '}catch(t){e.status="rejected",e.reason=t}}function T',
      '}catch(t){console.error("w(e) CAUGHT ERROR:", t);e.status="rejected",e.reason=t}}function T'
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
