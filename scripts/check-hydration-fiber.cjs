const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.addInitScript(() => {
    window.__comp_renders = 0;
  });

  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  const hydrationCheck = await page.evaluate(() => {
    // Check if React hydrated the bento videos by checking if any React Fiber is attached
    const video = document.querySelector('.Bento_bento__pskN5 video');
    if (!video) return 'no video';
    const keys = Object.keys(video);
    const fiberKey = keys.find(k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
    return {
      keys,
      hasFiber: !!fiberKey
    };
  });

  console.log('Hydration check on Bento video:', hydrationCheck);

  await browser.close();
})();
