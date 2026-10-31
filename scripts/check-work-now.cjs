const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  const t0 = Date.now();
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  const loadTime = Date.now() - t0;
  await page.waitForTimeout(1000);

  const links = await page.locator('a[href^="/work/"]').all();
  console.log('Load time:', loadTime, 'ms. Project links found:', links.length);

  const titles = [];
  for (const l of links.slice(0, 10)) {
    const text = (await l.innerText()).trim().replace(/\n+/g, ' - ');
    const href = await l.getAttribute('href');
    titles.push({ href, text });
  }
  console.log('Projects preview:', JSON.stringify(titles, null, 2));
  console.log('Errors:', errors);

  await page.screenshot({ path: 'work_loaded.png' });
  await browser.close();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
