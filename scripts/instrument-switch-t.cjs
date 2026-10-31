const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  await page.route('**/fd9d1056-2f07626ddf804ce1.js*', async route => {
    const response = await route.fetch();
    let body = await response.text();
    // Instrument right before switch(a=e,t)
    body = body.replace(
      'e.finishedWork=l,e.finishedLanes=r;e:{switch(a=e,t){',
      'console.log("REACHED SWITCH: t is", t, "r is", r);e.finishedWork=l,e.finishedLanes=r;e:{switch(a=e,t){'
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
