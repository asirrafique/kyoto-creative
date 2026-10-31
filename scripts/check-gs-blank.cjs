const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to http://127.0.0.1:3000/work/green-square-infra ...');
  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'scripts/gs-blank-check.png', fullPage: true });

  const visibilityInfo = await page.evaluate(() => {
    const hero = document.querySelector('section[class*="Hero"]') || document.querySelector('h1');
    const bodyChildren = Array.from(document.body.children).map(c => ({
      tag: c.tagName,
      className: c.className,
      style: c.getAttribute('style'),
      opacity: window.getComputedStyle(c).opacity,
      visibility: window.getComputedStyle(c).visibility,
      display: window.getComputedStyle(c).display,
      rect: c.getBoundingClientRect()
    }));
    return {
      title: document.title,
      h1: hero ? hero.innerText : 'none',
      bodyChildren
    };
  });

  console.log('Visibility info:', JSON.stringify(visibilityInfo, null, 2));

  await browser.close();
})();
