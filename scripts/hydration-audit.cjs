const { chromium } = require('playwright');
const fs = require('node:fs/promises');

(async () => {
  const routes = Object.keys(JSON.parse(await fs.readFile('reference/routes.json', 'utf8')));
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true,
    args: ['--enable-unsafe-swiftshader'],
  });
  const results = [];
  let cursor = 0;
  const compareOnly = process.argv.includes('--compare-warnings');
  if (compareOnly) {
    const previous = JSON.parse(await fs.readFile('reports/hydration-audit.json', 'utf8'));
    results.push(...previous.results);
    cursor = routes.length;
  }
  try {
    async function worker() {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      while (cursor < routes.length) {
        const route = routes[cursor++];
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        let result;
        try {
          const response = await page.goto('http://127.0.0.1:3101' + route, { waitUntil: 'domcontentloaded', timeout: 20000 });
          // Lenis is installed by the captured React layout after client hydration.
          // This catches pages whose HTML succeeds but whose controls never mount.
          await page.waitForFunction(() => !!window.lenis, { timeout: 10000 });
          result = { route, status: response.status(), hydrated: true, errors };
        } catch (error) { result = { route, hydrated: false, error: error.message, errors }; }
        results.push(result);
        await page.close();
        if (results.length % 30 === 0) console.log('Hydrated', results.length, '/', routes.length);
      }
      await context.close();
    }
    if (!compareOnly) await Promise.all([worker(), worker()]);
    for (const result of results.filter(item => item.hydrated && item.errors.length)) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, ignoreHTTPSErrors: true });
      const page = await context.newPage();
      const upstreamErrors = [];
      page.on('pageerror', error => upstreamErrors.push(error.message));
      await page.goto('https://kota.co.uk' + result.route, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2500);
      result.upstreamErrors = upstreamErrors;
      result.matchesOriginalWarnings = JSON.stringify([...result.errors].sort()) === JSON.stringify([...upstreamErrors].sort());
      await context.close();
    }
  } finally {
    await browser.close();
    const failures = results.filter(result => !result.hydrated || result.status >= 400 || result.errors.length && !result.matchesOriginalWarnings);
    const upstreamWarnings = results.filter(result => result.matchesOriginalWarnings).map(result => result.route);
    await fs.writeFile('reports/hydration-audit.json', JSON.stringify({ total: routes.length, checked: results.length, failures, upstreamWarnings, results }, null, 2));
    console.log(JSON.stringify({ checked: results.length, failures, upstreamWarnings }, null, 2));
    if (failures.length) process.exitCode = 1;
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
