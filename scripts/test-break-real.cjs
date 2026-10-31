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
    // Test: when 6===t, o3(e,r,0);break;
    body = body.replace('for(var a=l;;){if(6===t)o3(e,r,0);else{', 'for(var a=l;;){if(6===t){o3(e,r,0);break;}else{');
    await route.fulfill({
      response,
      body,
      headers: {
        ...response.headers(),
        'content-length': Buffer.byteLength(body).toString()
      }
    });
  });

  const errors = [];
  page.on('console', msg => console.log(`[CONSOLE ${msg.type()}]:`, msg.text()));
  page.on('pageerror', err => {
    console.log(`[PAGE ERROR]:`, err.message);
    errors.push(err.message);
  });

  console.log('Navigating to http://127.0.0.1:3000/work...');
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(4000);

  const evaluation = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[href*="/work/"]')).map(a => ({
      href: a.getAttribute('href'),
      text: a.innerText.replace(/\n+/g, ' ').trim(),
      visible: a.offsetParent !== null && window.getComputedStyle(a).display !== 'none'
    }));
    return {
      title: document.title,
      totalCards: cards.length,
      visibleCards: cards.filter(c => c.visible).length,
      sampleCards: cards.slice(0, 5)
    };
  });

  console.log('Evaluation:', JSON.stringify(evaluation, null, 2));
  console.log('Errors count:', errors.length);

  await page.screenshot({ path: 'scripts/test-break-real.png' });
  console.log('Screenshot saved to scripts/test-break-real.png');

  await browser.close();
})();
