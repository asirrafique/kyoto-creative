const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://127.0.0.1:3000/work');
  await page.waitForTimeout(3000);
  
  const cards = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href^="/work/"]')).map(a => {
      const rect = a.getBoundingClientRect();
      return {
        href: a.getAttribute('href'),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        text: a.innerText.replace(/\s+/g, ' ').trim()
      };
    });
  });
  
  console.log('Total cards found on /work:', cards.length);
  cards.slice(0, 10).forEach((c, idx) => console.log(idx, c));

  await browser.close();
})();
