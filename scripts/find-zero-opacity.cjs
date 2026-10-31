const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  const hiddenElements = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const zeroOpacity = all.filter(el => {
      const cs = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return cs.opacity === '0' && r.width > 20 && r.height > 20;
    }).map(el => ({
      tag: el.tagName,
      className: el.className,
      rect: el.getBoundingClientRect(),
      text: el.innerText ? el.innerText.slice(0, 50) : ''
    }));
    return zeroOpacity;
  });

  console.log('Zero opacity elements count:', hiddenElements.length);
  hiddenElements.slice(0, 15).forEach((el, i) => console.log(i, el));

  await browser.close();
})();
