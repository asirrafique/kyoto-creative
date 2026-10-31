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
    const img = document.querySelector('img[src="/seven-gate-before-after.png"]');
    const scrollWidth = document.documentElement.scrollWidth;
    const clientWidth = document.documentElement.clientWidth;
    const bodyText = document.body ? document.body.innerText : '';
    
    // Check order in DOM
    const visionEl = Array.from(document.querySelectorAll('h2, h3, p')).find(el => el.textContent.includes('Bringing the Founder’s Vision to Life') || el.textContent.includes("Bringing the Founder's Vision to Life"));
    const resultsEl = Array.from(document.querySelectorAll('h2, h3, span')).find(el => el.textContent.includes('Results 30 days post-launch'));
    
    let positionCorrect = false;
    if (visionEl && img && resultsEl) {
      const vTop = visionEl.getBoundingClientRect().top + window.scrollY;
      const imgTop = img.getBoundingClientRect().top + window.scrollY;
      const rTop = resultsEl.getBoundingClientRect().top + window.scrollY;
      positionCorrect = (vTop < imgTop) && (imgTop < rTop);
    }

    return {
      hasImg: !!img,
      imgNaturalWidth: img ? img.naturalWidth : null,
      positionCorrect,
      canScrollHorizontally: scrollWidth > clientWidth + 1,
      scrollWidth,
      clientWidth,
      hasClientError: bodyText.includes('client-side exception')
    };
  });

  console.log('Evaluation:', JSON.stringify(evaluation, null, 2));

  // Scroll to the before-after image
  await page.evaluate(() => {
    const img = document.querySelector('img[src="/seven-gate-before-after.png"]');
    if (img) img.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scripts/seven-gate-before-after-view.png' });
  console.log('Saved screenshot to scripts/seven-gate-before-after-view.png');

  await browser.close();
})();
