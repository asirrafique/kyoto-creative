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
    return {
      hasResultsHeading: text.includes('Results 30 days post-launch'),
      has800Leads: text.includes('800+') && text.includes('leads generated in the first 30 days'),
      has1000Spend: text.includes('<$1,000') || text.includes('&lt;$1,000') || text.includes('advertising spend'),
      has600kRevenue: text.includes('$600k+') && text.includes('property pipeline revenue'),
      hasImpactHeading: text.includes('The Impact'),
      hasImpactText: text.includes("Kyoto Creative's approach to combining creative execution"),
      hasQuoteText: text.includes("Generating over 800 leads in just 30 days with less than $1,000 in ad spend"),
      hasGunajitDutta: text.includes('Gunajit Dutta'),
      hasFounderGreenSquare: text.includes('Founder - Green Square Infra'),
      hasClientError: text.includes('client-side exception')
    };
  });

  console.log('Evaluation Results:', JSON.stringify(evaluation, null, 2));
  if (pageErrors.length > 0) {
    console.log('Page Errors:', pageErrors);
  }
  const errorLogs = consoleLogs.filter(l => l.includes('Error') || l.includes('error'));
  if (errorLogs.length > 0) {
    console.log('Console Errors:', errorLogs);
  }

  await page.screenshot({ path: 'scripts/seven-gate-with-results.png', fullPage: false });
  console.log('Screenshot saved to scripts/seven-gate-with-results.png');

  await browser.close();
})();
