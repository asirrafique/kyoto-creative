const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  const initialCanvas = await page.evaluate(() => {
    const canvas = document.querySelectorAll('canvas');
    const videos = Array.from(document.querySelectorAll('video')).map(v => ({
      src: v.src,
      paused: v.paused,
      currentTime: v.currentTime,
      rect: v.getBoundingClientRect()
    }));
    return {
      canvasCount: canvas.length,
      videos
    };
  });
  console.log('Initial media:', initialCanvas);

  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.waitForTimeout(1000);

  const scrolledCanvas = await page.evaluate(() => {
    const canvas = document.querySelectorAll('canvas');
    return { canvasCount: canvas.length };
  });
  console.log('Scrolled canvas:', scrolledCanvas);

  await browser.close();
})();
