const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    const text = document.body.innerText;
    const canvas = document.querySelector('canvas');
    const heroH1 = document.querySelector('h1');
    const heroVideo = document.querySelector('section[class*="Hero"] video');
    return {
      h1: heroH1 ? heroH1.innerText : null,
      hasCanvas: !!canvas,
      canvasRect: canvas ? canvas.getBoundingClientRect() : null,
      videoPlaying: heroVideo ? !heroVideo.paused && heroVideo.currentTime > 0 : false,
      has800Leads: text.includes('800+'),
      has1000Spend: text.includes('<$1,000') || text.includes('$1,000'),
      has600k: text.includes('$600k+'),
      hasImpact: text.includes('The Impact'),
      hasGunajit: text.includes('Gunajit Dutta')
    };
  });
  console.log('Green Square Infra Full Audit:', data);

  await page.screenshot({ path: 'scripts/gs-full-audit.png', fullPage: false });

  await browser.close();
})();
