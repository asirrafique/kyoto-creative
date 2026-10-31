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
    const keys = Object.keys(window).filter(k => k.includes('webpack') || k.includes('next'));
    return {
      keys,
      next: !!window.next
    };
  });
  console.log('Window keys:', res);

  await browser.close();
})().catch(console.error);
