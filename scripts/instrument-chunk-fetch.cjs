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
    // In function(e) chunk loader, instrument n.e(c)
    body = body.replace(
      'void 0===f?(i.set(c,s),s=n.e(c),r.push(s),f=u.set.bind(u,c,null),s.then(f,a),u.set(c,s)):null!==f&&r.push(f)',
      'void 0===f?(i.set(c,s),console.log("TRIGGERING n.e chunk load for chunk ID:", c, "path:", s),s=n.e(c),s.then(()=>console.log("CHUNK LOADED:", c), (err)=>console.error("CHUNK LOAD FAILED:", c, err)),r.push(s),f=u.set.bind(u,c,null),s.then(f,a),u.set(c,s)):null!==f&&r.push(f)'
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
