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
    const d4 = document.body.children[4];
    return {
      innerHTML: d4 ? d4.innerHTML.slice(0, 400) : null
    };
  });
  console.log('document.body.children[4]:', res);

  await browser.close();
})().catch(console.error);
