const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 }
  });

  await page.goto('http://127.0.0.1:3000/work/seven-gate-holdings', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const img = document.querySelector('img[src="/seven-gate-before-after.png"]');
    if (img) img.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(1000);

  const imgInfo = await page.evaluate(() => {
    const img = document.querySelector('img[src="/seven-gate-before-after.png"]');
    return {
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      renderedWidth: img.clientWidth,
      renderedHeight: img.clientHeight
    };
  });
  console.log('Image details:', imgInfo);

  await page.screenshot({ path: 'scripts/seven-gate-before-after-rendered.png' });
  console.log('Saved screenshot to scripts/seven-gate-before-after-rendered.png');
  await browser.close();
})();
