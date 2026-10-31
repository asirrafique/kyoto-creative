const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const bodyChildren = await page.evaluate(() => {
    return Array.from(document.body.children).map(el => ({
      tagName: el.tagName,
      id: el.id,
      className: el.className
    }));
  });
  console.log('document.body.children:', bodyChildren);

  await browser.close();
})().catch(console.error);
