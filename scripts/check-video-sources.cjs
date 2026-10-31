const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  // Scroll down smoothly
  await page.evaluate(async () => {
    for (let i = 0; i < 5; i++) {
      window.scrollBy(0, 400);
      await new Promise(r => setTimeout(r, 200));
    }
  });
  await page.waitForTimeout(2000);

  const sources = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('video')).map(v => ({
      videoSrc: v.src,
      sourceCount: v.querySelectorAll('source').length,
      sources: Array.from(v.querySelectorAll('source')).map(s => s.src),
      paused: v.paused,
      currentTime: v.currentTime,
      rect: v.getBoundingClientRect()
    }));
  });

  console.log('Videos with sources:', sources);

  await browser.close();
})();
