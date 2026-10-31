const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  await page.goto('http://127.0.0.1:3000/agency', { waitUntil: 'load' });
  
  const inspected = await page.evaluate(() => {
    // Look in window.__next_f
    const res = [];
    for (let i = 0; i < window.__next_f.length; i++) {
      const item = window.__next_f[i];
      if (Array.isArray(item) && typeof item[1] === 'string') {
        const s = item[1];
        if (s.includes('["$",null')) {
          res.push({ i, snippet: s.slice(s.indexOf('["$",null') - 40, s.indexOf('["$",null') + 60) });
        }
      }
    }
    return res;
  });
  
  console.log('Inspected in browser __next_f:', inspected);
  await browser.close();
})();
