const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:3000/work/seven-gate-holdings');
  await page.waitForTimeout(2000);

  const containerDetails = await page.evaluate(() => {
    const container = document.querySelector('section[class*="Intro"] .container');
    const intro = document.querySelector('section[class*="Intro"]');
    
    // Check computed grid tracks
    const cs = window.getComputedStyle(container);
    const cols = cs.gridTemplateColumns.split(' ');

    return {
      columnsCount: cols.length,
      columns: cols,
      gap: cs.gap,
      columnGap: cs.columnGap,
      paddingLeft: cs.paddingLeft,
      paddingRight: cs.paddingRight
    };
  });

  console.log('Grid tracks info:', containerDetails);

  await browser.close();
})();
