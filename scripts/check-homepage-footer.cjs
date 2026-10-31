const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const url = 'http://127.0.0.1:3000/';
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'load', timeout: 15000 });
  await page.waitForTimeout(2000);

  // Scroll to footer
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(1000);

  const footerInfo = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (!footer) return { hasFooter: false };
    const style = window.getComputedStyle(footer);
    const links = Array.from(footer.querySelectorAll('a, p, span, li')).map(el => {
      const s = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        text: el.innerText.slice(0, 30),
        color: s.color,
        background: s.backgroundColor
      };
    });
    return {
      hasFooter: true,
      className: footer.className,
      backgroundColor: style.backgroundColor,
      color: style.color,
      sampleElements: links.slice(0, 15)
    };
  });

  console.log('Footer Info:', JSON.stringify(footerInfo, null, 2));

  await page.screenshot({ path: 'scripts/homepage-footer-check.png' });
  console.log('Screenshot saved to scripts/homepage-footer-check.png');

  await browser.close();
})();
