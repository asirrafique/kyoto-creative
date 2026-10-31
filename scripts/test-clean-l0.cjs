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
    // Test: when $! bailout comment is encountered, call l0 WITHOUT error a!
    const target = 'if("$!"===a.data){if(a=a.nextSibling&&a.nextSibling.dataset)var s=a.dgst;return a=s,(r=Error(i(419))).digest=a,l0(e,t,u,a=lN(r,a,void 0))}';
    const replacement = 'if("$!"===a.data){return l0(e,t,u,null)}';
    body = body.replace(target, replacement);
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
    const container = document.querySelector('.Work_projectsWithFilters__mwDTM');
    return {
      title: document.title,
      totalCards: cards.length,
      visibleCards: cards.filter(c => c.visible).length,
      sampleCards: cards.slice(0, 10),
      containerSnippet: container ? container.innerHTML.slice(0, 300) : 'none'
    };
  });

  console.log('Evaluation:', JSON.stringify(evaluation, null, 2));
  console.log('Errors count:', errors.length);

  await page.screenshot({ path: 'scripts/test-clean-l0.png' });
  console.log('Screenshot saved to scripts/test-clean-l0.png');

  await browser.close();
})();
