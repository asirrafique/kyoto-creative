const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  await page.goto('http://127.0.0.1:3000/work/upp');
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const heroH1 = document.querySelector('h1');
    const h1Fiber = heroH1 ? Object.keys(heroH1).some(k => k.startsWith('__reactFiber$')) : false;
    return {
      h1: heroH1 ? heroH1.innerText : null,
      h1Fiber,
      hasCanvas: !!canvas
    };
  });
  console.log('Original UPP state:', data);

  await browser.close();
})();
