const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const routes = [
    { url: 'http://127.0.0.1:3000/work', name: 'work' },
    { url: 'http://127.0.0.1:3000/work/88pilot', name: '88pilot' },
    { url: 'http://127.0.0.1:3000/work/green-square-infra', name: 'green-square-infra' },
    { url: 'http://127.0.0.1:3000/work/seven-gate-holdings', name: 'seven-gate-holdings' }
  ];

  for (const r of routes) {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.goto(r.url);
    await page.waitForTimeout(2000);
    const data = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const canvas = document.querySelector('canvas');
      const cards = document.querySelectorAll('a[class*="ProjectCard"]');
      return {
        h1: h1 ? h1.innerText.replace(/\n/g, ' ') : null,
        hasCanvas: !!canvas,
        cardCount: cards.length
      };
    });
    console.log(`Route [${r.name}]:`, data, 'errors:', errors.length ? errors : 'none');
  }

  await browser.close();
})();
