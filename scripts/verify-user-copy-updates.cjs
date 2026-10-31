const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  const audit = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasCompetitiveRealEstate: text.includes('competitive residential real estate market'),
      hasActionableEnquiries: text.includes('turn online interest into actionable enquiries'),
      hasWebsiteDevTag: text.includes('Website Development'),
      hasPerformanceMktgTag: text.includes('Performance Marketing'),
      hasRealEstateMktgTag: text.includes('Real Estate Marketing'),
      hasChallenge: text.includes('The Challenge'),
      hasKeepingInitialBudgetLean: text.includes('keeping the initial advertising budget lean'),
      hasStrategy: text.includes('The Strategy'),
      hasMetaAds: text.includes('Meta Ads'),
      hasMaximiseReturn: text.includes('maximise the return from a limited advertising budget'),
      has800Leads: text.includes('800+'),
      hasGunajit: text.includes('Gunajit Dutta')
    };
  });

  console.log('Audit Results:', JSON.stringify(audit, null, 2));

  // Capture screenshot of Introduction and tags
  await page.evaluate(() => {
    const el = document.querySelector('section[class*="Intro"]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scripts/intro-and-tags.png', fullPage: false });

  // Capture screenshot of The Challenge
  await page.evaluate(() => {
    const h2s = Array.from(document.querySelectorAll('h2, h3'));
    const ch = h2s.find(h => h.innerText.includes('The Challenge'));
    if (ch) ch.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scripts/challenge-section.png', fullPage: false });

  // Capture screenshot of The Strategy
  await page.evaluate(() => {
    const h2s = Array.from(document.querySelectorAll('h2, h3'));
    const st = h2s.find(h => h.innerText.includes('The Strategy'));
    if (st) st.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scripts/strategy-section.png', fullPage: false });

  console.log('All section screenshots captured successfully!');
  await browser.close();
})();
