const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  // Scroll to bento:
  await page.evaluate(() => {
    const bento = document.querySelector('.Bento_bento__pskN5');
    if (bento) bento.scrollIntoView({ behavior: 'instant', block: 'center' });
  });

  await page.waitForTimeout(1000);

  const bentoAfter = await page.evaluate(() => {
    const bento = document.querySelector('.Bento_bento__pskN5');
    return Array.from(bento.querySelectorAll('video')).map(v => ({
      videoSrc: v.src,
      sourceCount: v.querySelectorAll('source').length,
      sourceSrc: v.querySelector('source') ? v.querySelector('source').src : '',
      paused: v.paused,
      currentTime: v.currentTime,
      rect: v.getBoundingClientRect()
    }));
  });

  console.log('Bento after scroll:', bentoAfter);

  await browser.close();
})();
