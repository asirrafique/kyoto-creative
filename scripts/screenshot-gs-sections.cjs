const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  // Take hero screenshot
  await page.screenshot({ path: 'scripts/gs-hero.png', fullPage: false });

  // Scroll to stats
  await page.evaluate(() => {
    const el = document.querySelector('div[style*="aspect-ratio"]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scripts/gs-stats.png', fullPage: false });

  // Scroll to impact & quote
  await page.evaluate(() => {
    const el = document.querySelector('blockquote');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scripts/gs-quote.png', fullPage: false });

  console.log('Saved all screenshots!');
  await browser.close();
})();
