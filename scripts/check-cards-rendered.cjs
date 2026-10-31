const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  const links = await page.locator('.work-react-archive-mount a[href^="/work/"]').all();
  console.log('Total project links rendered on /work:', links.length);
  for (let i = 0; i < Math.min(10, links.length); i++) {
    const href = await links[i].getAttribute('href');
    const text = (await links[i].innerText()).trim().replace(/\n+/g, ' | ');
    console.log(`Card ${i}: href=${href} | text=${text}`);
  }
  await browser.close();
})().catch(console.error);
