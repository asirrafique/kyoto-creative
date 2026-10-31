const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  const fiberReport = await page.evaluate(() => {
    function findFiber(el) {
      if (!el) return false;
      return Object.keys(el).some(k => k.startsWith('__reactFiber'));
    }

    const h1 = document.querySelector('h1');
    const header = document.querySelector('header');
    const hero = document.querySelector('section[class*="Hero"]');
    const bento = document.querySelector('.Bento_bento__pskN5');
    const footer = document.querySelector('footer');

    return {
      h1HasFiber: findFiber(h1),
      headerHasFiber: findFiber(header),
      heroHasFiber: findFiber(hero),
      bentoHasFiber: findFiber(bento),
      footerHasFiber: findFiber(footer)
    };
  });

  console.log('Fiber report:', fiberReport);

  await browser.close();
})();
