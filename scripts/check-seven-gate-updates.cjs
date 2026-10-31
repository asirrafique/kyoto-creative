const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  const consoleLogs = [];
  const pageErrors = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => pageErrors.push(err.toString()));

  const url = 'http://127.0.0.1:3000/work/seven-gate-holdings';
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'load', timeout: 15000 });
  await page.waitForTimeout(2000);

  const evaluation = await page.evaluate(() => {
    const text = document.body ? document.body.innerText : '';
    const scrollWidth = document.documentElement.scrollWidth;
    const clientWidth = document.documentElement.clientWidth;
    return {
      hasHeroTitle: text.includes('A World-Class Digital Presence Built to Match the Vision') || text.includes('A World- Class Digital Presence Built to Match the Vision'),
      hasVisionHeading: text.includes('Bringing the Founder’s Vision to Life') || text.includes("Bringing the Founder's Vision to Life"),
      hasVisionBody: text.includes('Seven Gate Holdings came to Kyoto Creative with a clear ambition'),
      hasStackedTags: text.includes('Website Design & Development ·') && text.includes('Brand Experience ·') && text.includes('Digital Strategy'),
      canScrollHorizontally: scrollWidth > clientWidth + 1,
      scrollWidth,
      clientWidth,
      hasClientError: text.includes('client-side exception')
    };
  });

  console.log('Evaluation Results:', JSON.stringify(evaluation, null, 2));
  if (pageErrors.length > 0) {
    console.log('Page Errors:', pageErrors);
  }

  await page.screenshot({ path: 'scripts/seven-gate-updated-check.png', fullPage: false });
  console.log('Screenshot saved to scripts/seven-gate-updated-check.png');

  await browser.close();
})();
