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
    // In switch(a=e,t), add case 6:
    body = body.replace('case 2:case 3:case 5:break;', 'case 2:case 3:case 5:case 6:break;');
    // In o1 call, log when o1 executes
    body = body.replace('o1(a,l,oO,oU,oR,r,oF)', 'console.log("o1 EXECUTING! lanes=", r, "t was", t),o1(a,l,oO,oU,oR,r,oF)');
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
  await page.waitForTimeout(3000);

  await browser.close();
})();
