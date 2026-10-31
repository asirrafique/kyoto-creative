const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  const heroDetails = await page.evaluate(() => {
    const hero = document.querySelector('section[class*="Hero"]');
    const bento = document.querySelector('section[class*="Bento"]');
    const heroFiberKey = hero ? Object.keys(hero).find(k => k.startsWith('__reactFiber$')) : null;
    const bentoFiberKey = bento ? Object.keys(bento).find(k => k.startsWith('__reactFiber$')) : null;
    return {
      heroFiberKey,
      bentoFiberKey,
      heroChildrenFibers: hero ? Array.from(hero.querySelectorAll('*')).filter(el => Object.keys(el).some(k => k.startsWith('__reactFiber$'))).length : 0,
      bentoChildrenFibers: bento ? Array.from(bento.querySelectorAll('*')).filter(el => Object.keys(el).some(k => k.startsWith('__reactFiber$'))).length : 0
    };
  });
  console.log('Hero and Bento fiber details:', heroDetails);

  await browser.close();
})();
