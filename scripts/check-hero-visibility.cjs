const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  const heroDetails = await page.evaluate(() => {
    const hero = document.querySelector('section[class*="Hero"]');
    if (!hero) return 'No hero found';
    
    // Check all elements inside hero
    const elements = Array.from(hero.querySelectorAll('*')).map(el => {
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        className: el.className,
        opacity: cs.opacity,
        visibility: cs.visibility,
        transform: cs.transform,
        color: cs.color,
        bg: cs.backgroundColor,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        text: el.children.length === 0 ? el.innerText : undefined
      };
    });

    return {
      heroRect: hero.getBoundingClientRect(),
      heroOpacity: window.getComputedStyle(hero).opacity,
      elements: elements.filter(e => e.height > 0 || e.text)
    };
  });

  console.log(JSON.stringify(heroDetails, null, 2));

  await browser.close();
})();
