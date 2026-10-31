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
    // Find all DOM elements with __reactFiber or __reactInternalInstance
    const all = Array.from(document.querySelectorAll('*'));
    let fiberCount = 0;
    let workFiber = null;
    for (const el of all) {
      const keys = Object.keys(el).filter(k => k.startsWith('__reactFiber'));
      if (keys.length > 0) {
        fiberCount++;
        if (el.className && typeof el.className === 'string' && el.className.includes('Work_')) {
          workFiber = keys[0];
        }
      }
    }
    return {
      totalElements: all.length,
      fiberCount,
      workFiber
    };
  });
  console.log('DOM React Fiber check:', res);

  await browser.close();
})().catch(console.error);
