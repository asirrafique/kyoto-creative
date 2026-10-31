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

    const visionEl = Array.from(document.querySelectorAll('h2, h3')).find(el => el.textContent.includes('Bringing the Founder'));
    const imgEl = document.querySelector('img[src="/seven-gate-before-after.png"]');
    const moreEl = Array.from(document.querySelectorAll('h2, h3')).find(el => el.textContent.includes('More Than a Website'));
    const resultsEl = Array.from(document.querySelectorAll('h2, h3, span')).find(el => el.textContent.includes('Results 30 days post-launch'));

    let orderCorrect = false;
    if (visionEl && imgEl && moreEl && resultsEl) {
      const vTop = visionEl.getBoundingClientRect().top + window.scrollY;
      const iTop = imgEl.getBoundingClientRect().top + window.scrollY;
      const mTop = moreEl.getBoundingClientRect().top + window.scrollY;
      const rTop = resultsEl.getBoundingClientRect().top + window.scrollY;
      orderCorrect = (vTop < iTop) && (iTop < mTop) && (mTop < rTop);
    }

    return {
      hasMoreHeading: text.includes('More Than a Website'),
      hasMoreBody: text.includes('We approached the project with a focus on how the brand should be perceived'),
      hasVisionHeading: text.includes('Bringing the Founder'),
      hasResultsHeading: text.includes('Results 30 days post-launch'),
      orderCorrect,
      canScrollHorizontally: scrollWidth > clientWidth + 1,
      scrollWidth,
      clientWidth,
      hasClientError: text.includes('client-side exception')
    };
  });

  console.log('Evaluation:', JSON.stringify(evaluation, null, 2));

  // Scroll to "More Than a Website"
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('More Than a Website'));
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scripts/seven-gate-more-than-website-view.png' });
  console.log('Saved screenshot to scripts/seven-gate-more-than-website-view.png');

  await browser.close();
})();
