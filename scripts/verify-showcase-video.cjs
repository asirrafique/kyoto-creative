const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  const videoState = await page.evaluate(() => {
    const video = document.querySelector('section[class*="Video_video"] video');
    return {
      src: video ? video.src : null,
      paused: video ? video.paused : null,
      currentTime: video ? video.currentTime : null,
      rect: video ? video.getBoundingClientRect() : null
    };
  });
  console.log('3D Showcase Video State:', videoState);

  // Scroll to video and capture screenshot
  await page.evaluate(() => {
    const video = document.querySelector('section[class*="Video_video"]');
    if (video) video.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'scripts/showcase-video-screenshot.png', fullPage: false });

  console.log('Saved showcase video screenshot!');
  await browser.close();
})();
