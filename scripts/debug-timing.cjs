const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
  const page = await browser.newPage();
  
  // Watch console
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER PAGEERROR:', err.message));

  // Let's inspect when <script data-replica-runtime> is placed in the HTML
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'domcontentloaded' });

  const scriptExecuted = await page.evaluate(() => {
    // Check if installMediaScheduling ran
    return {
      hasWindow__work_mounted: window.__work_mounted,
      scriptCount: document.querySelectorAll('script').length,
      scriptReplica: !!document.querySelector('script[data-replica-runtime]')
    };
  });
  console.log('DOM CONTENT LOADED:', scriptExecuted);

  await page.waitForTimeout(2000);

  const afterWait = await page.evaluate(() => {
    return {
      hasWindow__work_mounted: window.__work_mounted,
      cards: document.querySelectorAll('.ProjectCard_project__d1wbY').length
    };
  });
  console.log('AFTER WAIT:', afterWait);

  await browser.close();
})();
