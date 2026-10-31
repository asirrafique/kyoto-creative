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
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  const result = await page.evaluate(() => {
    // Check what self.webpackChunk_N_E has or require modules
    return {
      title: document.title,
      chunks: window.self.__next_f ? window.self.__next_f.length : 0
    };
  });
  console.log('Result:', result);

  await browser.close();
})();
