const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const res = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const hydrated = [];
    for (const el of all) {
      const keys = Object.keys(el).filter(k => k.startsWith('__reactFiber'));
      if (keys.length > 0) {
        hydrated.push({
          tag: el.tagName,
          id: el.id,
          className: el.className
        });
      }
    }
    return hydrated;
  });
  console.log('Hydrated elements:', res);

  await browser.close();
})().catch(console.error);
