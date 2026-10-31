const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.addInitScript(() => {
    // Intercept when React throws inside root
    window.addEventListener('error', e => console.log('INTERCEPTED ERROR:', e.message, e.error?.stack));
  });

  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message, err.stack));

  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(3000);

  await browser.close();
})();
