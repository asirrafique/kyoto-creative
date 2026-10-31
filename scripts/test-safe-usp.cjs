const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  // Test replacing useSearchParams in work page chunk
  await page.route('**/app/work/page-*.js*', async route => {
    const response = await route.fetch();
    let body = await response.text();
    // In module 99376, export a safe useSearchParams:
    const oldExport = 'r.o(n,"useSearchParams")&&r.d(t,{useSearchParams:function(){return n.useSearchParams}})';
    const newExport = 'r.d(t,{useSearchParams:function(){return function(){if(typeof window==="undefined")return new URLSearchParams();return new URLSearchParams(window.location.search)}}})';
    body = body.replace(oldExport, newExport);
    console.log('Work page chunk intercepted and patched safe useSearchParams!');
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
  await page.waitForTimeout(3000);

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
      sampleCards: cards.slice(0, 10),
      bodyTextSnippet: document.body.innerText.slice(0, 300)
    };
  });

  console.log('Evaluation result:', JSON.stringify(evaluation, null, 2));
  console.log('Errors count:', errors.length);

  await page.screenshot({ path: 'scripts/test-safe-usp.png' });
  console.log('Screenshot saved to scripts/test-safe-usp.png');

  await browser.close();
})();
