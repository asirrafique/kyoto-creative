const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  const gsFlight = await page.evaluate(() => window.__next_f[2][1]);
  
  await page.goto('http://127.0.0.1:3000/work/88pilot');
  const pilotFlight = await page.evaluate(() => window.__next_f[2][1]);

  fs.writeFileSync('scripts/gsFlight.txt', gsFlight, 'utf8');
  fs.writeFileSync('scripts/pilotFlight.txt', pilotFlight, 'utf8');
  console.log('Saved gsFlight and pilotFlight!');

  await browser.close();
})();
