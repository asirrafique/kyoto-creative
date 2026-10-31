const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  // Take screenshot of the top viewport
  await page.screenshot({ path: 'scripts/top-space-check.png', fullPage: false });

  // Inspect the top elements and their positions/margins/paddings
  const topDetails = await page.evaluate(() => {
    const hero = document.querySelector('section[class*="Hero"]');
    const header = document.querySelector('header');
    const heroRect = hero ? hero.getBoundingClientRect() : null;
    const headerRect = header ? header.getBoundingClientRect() : null;
    
    // Check elements near top
    const all = Array.from(document.body.children).map(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        className: el.className,
        rect: { top: rect.top, height: rect.height, bottom: rect.bottom },
        paddingTop: style.paddingTop,
        marginTop: style.marginTop,
        position: style.position
      };
    });

    return { heroRect, headerRect, children: all };
  });

  console.log('Top Details:', JSON.stringify(topDetails, null, 2));

  await browser.close();
})();
