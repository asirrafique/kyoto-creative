const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('http://127.0.0.1:3000/work/seven-gate-holdings');
  await page.waitForTimeout(2000);

  const heroH1 = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? h1.innerText.replace(/\n/g, ' ') : null;
  });

  console.log('Seven Gate Holdings H1:', heroH1);
  console.log('Client errors:', errors.length ? errors : 'none');

  await page.screenshot({ path: 'scripts/seven-gate-h1-check.png', fullPage: false });
  console.log('Saved screenshot of updated Seven Gate Holdings header!');

  await browser.close();
})();
