const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'scripts/gs-animated-now.png', fullPage: false });
  console.log('Saved screenshot of animated Green Square Infra!');

  const animationState = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const heroH1 = document.querySelector('h1');
    const video = document.querySelector('section[class*="Hero"] video');
    return {
      hasCanvas: !!canvas,
      canvasRect: canvas ? canvas.getBoundingClientRect() : null,
      heroH1Text: heroH1 ? heroH1.innerText : null,
      videoPlaying: video ? !video.paused && video.currentTime > 0 : false
    };
  });
  console.log('Animation state:', animationState);

  await browser.close();
})();
