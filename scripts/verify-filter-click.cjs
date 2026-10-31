const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  
  const sectorBtn = page.locator('button.Filters_trigger__2suyY', { hasText: 'Sectors' });
  await sectorBtn.click();
  await page.waitForTimeout(500);
  
  const state = await page.evaluate(() => {
    const triggers = Array.from(document.querySelectorAll('button.Filters_trigger__2suyY')).map(b => ({
      text: b.textContent.trim(),
      className: b.className
    }));
    const drawers = Array.from(document.querySelectorAll('.Filters_drawer__1_z_C, [class*="drawer"]')).map(d => ({
      className: d.className,
      style: d.getAttribute('style')
    }));
    return { triggers, drawers };
  });
  console.log('Filter state after click:', state);

  // Take screenshot of work page showing the project grid
  await page.screenshot({ path: 'scripts/work-page-final.png', fullPage: false });
  console.log('Saved screenshot to scripts/work-page-final.png');

  await browser.close();
})();
