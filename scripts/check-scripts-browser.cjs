const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const scripts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('script')).map(s => s.innerText).filter(t => t.includes('self.__next_f'));
  });
  console.log('Number of self.__next_f script tags:', scripts.length);
  scripts.forEach((s, idx) => console.log(`Script ${idx} len: ${s.length}, preview: ${s.slice(0, 100)}`));

  await browser.close();
})().catch(console.error);
