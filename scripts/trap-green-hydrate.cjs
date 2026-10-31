const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message, err.stack));

  // Add script to trap React errors during hydration
  await page.addInitScript(() => {
    window.addEventListener('error', e => {
      console.log('WINDOW ERROR EVENT:', e.message, e.filename, e.lineno);
    });
  });

  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(3000);

  await browser.close();
})();
