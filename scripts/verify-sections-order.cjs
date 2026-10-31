const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  const sectionsReport = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section'));
    return sections.map(s => {
      const h = s.querySelector('h1, h2, h3, h4');
      const p = s.querySelector('p');
      return {
        className: s.className.split(' ')[0],
        heading: h ? h.innerText.replace(/\n/g, ' ') : null,
        snippet: p ? p.innerText.slice(0, 60) : null
      };
    });
  });

  console.log('Page Sections in Order:');
  console.table(sectionsReport);
  console.log('Client errors:', errors.length ? errors : 'none');

  // Capture screenshot of Strategy followed immediately by Results
  await page.evaluate(() => {
    const h2s = Array.from(document.querySelectorAll('h2, h3'));
    const st = h2s.find(h => h.innerText.includes('The Strategy'));
    if (st) st.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scripts/strategy-to-results.png', fullPage: false });

  await browser.close();
})();
