const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://127.0.0.1:3000/work/seven-gate-holdings');
  await page.waitForTimeout(2000);

  const sgFibers = await page.evaluate(() => {
    function findFiber(el) {
      if (!el) return false;
      return Object.keys(el).some(k => k.startsWith('__reactFiber'));
    }
    return {
      h1: findFiber(document.querySelector('h1')),
      header: findFiber(document.querySelector('header')),
      hero: findFiber(document.querySelector('section[class*="Hero"]')),
      footer: findFiber(document.querySelector('footer'))
    };
  });
  console.log('Seven Gate fibers:', sgFibers);

  await page.goto('http://127.0.0.1:3000/work/88pilot');
  await page.waitForTimeout(2000);

  const pilotFibers = await page.evaluate(() => {
    function findFiber(el) {
      if (!el) return false;
      return Object.keys(el).some(k => k.startsWith('__reactFiber'));
    }
    return {
      h1: findFiber(document.querySelector('h1')),
      header: findFiber(document.querySelector('header')),
      hero: findFiber(document.querySelector('section[class*="Hero"]')),
      footer: findFiber(document.querySelector('footer'))
    };
  });
  console.log('88Pilot fibers:', pilotFibers);

  await browser.close();
})();
