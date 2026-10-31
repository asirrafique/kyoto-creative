const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log(`[CONSOLE ${msg.type()}]:`, msg.text()));
  page.on('pageerror', err => console.log(`[PAGE ERROR]:`, err.message));

  console.log('Navigating to http://127.0.0.1:3000/work...');
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'domcontentloaded' });
  
  const status = await page.evaluate(() => {
    return {
      readyState: document.readyState,
      next_f_len: window.self.__next_f ? window.self.__next_f.length : 0,
      isPushFn: typeof window.self.__next_f.push === 'function' && window.self.__next_f.push !== Array.prototype.push
    };
  });
  console.log('DOM status:', status);

  await page.waitForTimeout(2000);

  await browser.close();
})();
