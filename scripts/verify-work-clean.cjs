const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
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
  console.log('Load time:', loadTime, 'ms');

  // Wait a short moment for render
  await page.waitForSelector('.work-react-archive-mount a[href^="/work/"]', { timeout: 3000 });
  const links = await page.locator('.work-react-archive-mount a[href^="/work/"]').all();
  console.log('Total project links rendered:', links.length);

  const previews = [];
  for (const l of links.slice(0, 5)) {
    previews.push({
      href: await l.getAttribute('href'),
      title: (await l.innerText()).trim().replace(/\n+/g, ' - ')
    });
  }
  console.log('First 5 projects:');
  console.log(JSON.stringify(previews, null, 2));
  console.log('Errors:', errors);

  await page.screenshot({ path: 'work_final_verified.png' });
  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
