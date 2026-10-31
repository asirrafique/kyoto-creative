const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 }
  });
  
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
      hasEngagementStat: text.includes('+40%') && text.includes('Increase in website engagement'),
      hasConversionsStat: text.includes('+30%') && text.includes('Increase in enquiry conversions'),
      hasPageSpeedStat: text.includes('92+') && text.includes('Google PageSpeed score'),
      hasNewImpactText: text.includes("The result was a bespoke digital experience that brought Seven Gate Holdings' vision to life"),
      hasNewQuoteText: text.includes("Kyoto Creative really understood the vision I had for our website"),
      hasAnkurSharma: text.includes('Ankur Sharma'),
      hasCeoSevenGate: text.includes('CEO, Seven Gate Holdings'),
      hasOldGunajit: text.includes('Gunajit Dutta'),
      hasOld800: text.includes('800+'),
      canScrollHorizontally: scrollWidth > clientWidth + 1,
      scrollWidth,
      clientWidth,
      hasClientError: text.includes('client-side exception')
    };
  });

  console.log('Evaluation:', JSON.stringify(evaluation, null, 2));

  // Scroll to Results & Impact
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Results 30 days'));
    if (el) el.scrollIntoView({ block: 'start' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scripts/seven-gate-results-updated.png' });
  console.log('Saved screenshot to scripts/seven-gate-results-updated.png');

  await browser.close();
})();
