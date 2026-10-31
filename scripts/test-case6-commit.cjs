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
    // In switch(a=e,t): allow case 6 to fall through to o1 call
    body = body.replace('case 2:case 3:case 5:break;', 'case 2:case 3:case 5:case 6:break;');
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
  await page.waitForTimeout(5000);

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

  await page.screenshot({ path: 'scripts/test-case6-commit.png' });
  console.log('Screenshot saved to scripts/test-case6-commit.png');

  await browser.close();
})();
