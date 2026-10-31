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
    body = body.replace(
      'c.default.startTransition(()=>i.default.hydrateRoot(v,t,{...o,formState:R}))',
      'c.default.startTransition(()=>i.default.createRoot(v,o).render(t))'
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

  await page.route('**/app/work/page-*.js*', async route => {
    const response = await route.fetch();
    let body = await response.text();
    // In component 60119, log when it renders!
    body = body.replace(
      'function c(e){var t,r,l,c;let{projects:u}=e,',
      'function c(e){console.log("PROJECTS COMPONENT 60119 RENDERING! count:", e.projects && e.projects.length);var t,r,l,c;let{projects:u}=e,'
    );
    // In component 78267, log when it renders!
    body = body.replace(
      'function P(e){let{sectors:t,services:r}=e,',
      'function P(e){console.log("FILTERS COMPONENT 78267 RENDERING!");let{sectors:t,services:r}=e,'
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
  await page.waitForTimeout(3000);

  const containerHtml = await page.evaluate(() => {
    const el = document.querySelector('.Work_projectsWithFilters__mwDTM');
    return el ? el.innerHTML : 'NOT FOUND';
  });

  console.log('Container HTML after createRoot:\n', containerHtml.slice(0, 500));

  await browser.close();
})();
