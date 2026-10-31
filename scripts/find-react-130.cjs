const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  // Intercept and log everything in webpack chunks and __next_f
  await page.goto('http://127.0.0.1:3000/agency', { waitUntil: 'load' });
  
  const debugInfo = await page.evaluate(() => {
    // Check __next_f
    const flightRows = [];
    if (window.__next_f) {
      for (const item of window.__next_f) {
        if (Array.isArray(item) && typeof item[1] === 'string') {
          flightRows.push(item[1]);
        }
      }
    }
    const combined = flightRows.join('');
    // Look for ["$", null
    const hasDollarNull = combined.includes('["$",null');
    const dollarNullMatches = [];
    let idx = 0;
    while ((idx = combined.indexOf('["$",null', idx)) !== -1) {
      dollarNullMatches.push(combined.slice(Math.max(0, idx - 50), idx + 100));
      idx += 10;
    }
    return {
      hasDollarNull,
      dollarNullMatches,
      combinedLength: combined.length
    };
  });
  
  console.log('Flight inspection on /agency:', debugInfo);
  await browser.close();
})();
