const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  page.on('console', async msg => {
    console.log(`[CONSOLE ${msg.type()}]:`, msg.text());
    try {
      const args = await Promise.all(msg.args().map(a => a.jsonValue().catch(() => null)));
      if (args.length > 1) {
        console.log(`[CONSOLE ARGS]:`, JSON.stringify(args).slice(0, 300));
      }
    } catch {}
  });
  page.on('pageerror', err => {
    console.log(`[PAGE ERROR]:`, err.message);
  });

  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  
  await browser.close();
})();
