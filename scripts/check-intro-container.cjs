const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:3000/work/seven-gate-holdings');
  await page.waitForTimeout(2000);

  const containerChildren = await page.evaluate(() => {
    const container = document.querySelector('section[class*="Intro"] .container');
    if (!container) return null;
    return Array.from(container.children).map(child => {
      const rect = child.getBoundingClientRect();
      const style = window.getComputedStyle(child);
      return {
        tag: child.tagName,
        className: child.className,
        rect: { left: rect.left, right: rect.right, width: rect.width },
        gridColumn: style.gridColumn,
        styleAttr: child.getAttribute('style'),
        subChildren: Array.from(child.children).map(sc => ({
          tag: sc.tagName,
          className: sc.className,
          rect: sc.getBoundingClientRect(),
          styleAttr: sc.getAttribute('style')
        }))
      };
    });
  });

  console.log('Intro container children:', JSON.stringify(containerChildren, null, 2));

  await browser.close();
})();
