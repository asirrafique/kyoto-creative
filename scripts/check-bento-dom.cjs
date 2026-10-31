const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  const bentoState = await page.evaluate(() => {
    const bento = document.querySelector('.Bento_bento__pskN5');
    if (!bento) return 'no bento found';
    const videos = Array.from(bento.querySelectorAll('video')).map(v => ({
      src: v.src,
      currentSrc: v.currentSrc,
      paused: v.paused,
      rect: v.getBoundingClientRect(),
      parentRect: v.parentElement.getBoundingClientRect(),
      cs: {
        opacity: window.getComputedStyle(v).opacity,
        display: window.getComputedStyle(v).display,
        visibility: window.getComputedStyle(v).visibility
      }
    }));
    return {
      bentoRect: bento.getBoundingClientRect(),
      videos
    };
  });

  console.log(JSON.stringify(bentoState, null, 2));

  // Now scroll to bento
  console.log('Scrolling down...');
  await page.evaluate(() => {
    const bento = document.querySelector('.Bento_bento__pskN5');
    if (bento) bento.scrollIntoView();
  });
  await page.waitForTimeout(1500);

  const bentoAfterScroll = await page.evaluate(() => {
    const bento = document.querySelector('.Bento_bento__pskN5');
    if (!bento) return 'no bento';
    return Array.from(bento.querySelectorAll('video')).map(v => ({
      src: v.src,
      paused: v.paused,
      currentTime: v.currentTime
    }));
  });
  console.log('After scroll videos:', bentoAfterScroll);

  await browser.close();
})();
