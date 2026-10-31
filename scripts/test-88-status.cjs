const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  console.log('Navigating to http://127.0.0.1:3000/work/88pilot ...');
  await page.goto('http://127.0.0.1:3000/work/88pilot');
  await page.waitForTimeout(3000);

  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Has Application error:', bodyText.includes('Application error'));
  const h1 = await page.$eval('h1', el => el.innerText).catch(() => 'no h1');
  console.log('H1 on page:', h1);

  await browser.close();
})();
