const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const pushes = await page.evaluate(() => {
    return window.__next_f ? window.__next_f.map(x => (Array.isArray(x) ? x[1].slice(0, 80) : x)) : [];
  });
  console.log('Window __next_f elements:', pushes.length);
  pushes.forEach((p, idx) => console.log(`[${idx}]:`, p));

  await browser.close();
})().catch(console.error);
