const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to http://127.0.0.1:3000/work/green-square-infra ...');
  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(4000);

  const debug = await page.evaluate(() => {
    return {
      fLen: window.__next_f ? window.__next_f.length : 'none',
      webpackChunks: window.webpackChunk_N_E ? window.webpackChunk_N_E.length : 'none',
      title: document.title
    };
  });
  console.log('Page eval debug:', debug);

  await browser.close();
})();
