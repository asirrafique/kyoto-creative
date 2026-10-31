const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const debug = await page.evaluate(() => {
    return {
      next_f: window.__next_f ? window.__next_f.length : null,
      reactRoot: document.querySelector('#__next') || document.body.innerHTML.slice(0, 500)
    };
  });
  console.log('Debug info:', debug);

  await browser.close();
})().catch(console.error);
