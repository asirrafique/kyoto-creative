const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  const heroVideo = await page.evaluate(() => {
    const v = document.querySelector('section[class*="Hero"] video');
    if (!v) return 'No hero video';
    return {
      src: v.src,
      currentSrc: v.currentSrc,
      paused: v.paused,
      currentTime: v.currentTime,
      videoWidth: v.videoWidth,
      videoHeight: v.videoHeight,
      readyState: v.readyState,
      networkState: v.networkState
    };
  });
  console.log('Hero video state:', heroVideo);

  await browser.close();
})();
