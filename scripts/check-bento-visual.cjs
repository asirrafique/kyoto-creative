const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  const bentoState = await page.evaluate(() => {
    const bento = document.querySelector('section[class*="Bento"]');
    if (!bento) return { exists: false };
    const videos = Array.from(bento.querySelectorAll('video')).map(v => ({
      src: v.src,
      paused: v.paused,
      currentTime: v.currentTime,
      rect: v.getBoundingClientRect()
    }));
    return {
      exists: true,
      rect: bento.getBoundingClientRect(),
      videos
    };
  });
  console.log('Bento State:', JSON.stringify(bentoState, null, 2));

  // Scroll to Bento and take screenshot
  await page.evaluate(() => {
    const bento = document.querySelector('section[class*="Bento"]');
    if (bento) bento.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'scripts/bento-visual.png', fullPage: false });

  // Scroll to Results and take screenshot
  await page.evaluate(() => {
    const res = document.querySelector('section[class*="Results"]');
    if (res) res.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scripts/results-visual.png', fullPage: false });

  // Scroll to Quote and take screenshot
  await page.evaluate(() => {
    const q = document.querySelector('section[class*="Quote"]');
    if (q) q.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scripts/quote-visual.png', fullPage: false });

  console.log('All screenshots captured!');
  await browser.close();
})();
