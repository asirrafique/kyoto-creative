const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const card0HTML = await page.evaluate(() => {
    const card = document.querySelector('.work-react-archive-mount a[href^="/work/"]');
    return card ? card.innerHTML : 'none';
  });
  console.log('Card 0 HTML:');
  console.log(card0HTML);

  await browser.close();
})().catch(console.error);
