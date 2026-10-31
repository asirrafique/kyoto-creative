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

  const url = 'http://127.0.0.1:3000/work';
  console.log(`Navigating to ${url}...`);
  const t0 = Date.now();
  await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  const loadTime = Date.now() - t0;
  console.log(`Page 'load' event fired in ${loadTime}ms`);

  await page.waitForTimeout(2000);

  const evaluation = await page.evaluate(() => {
    const text = document.body ? document.body.innerText : '';
    const cards = Array.from(document.querySelectorAll('a[href*="/work/"]')).map(a => ({
      href: a.getAttribute('href'),
      text: a.innerText.replace(/\n+/g, ' ').trim(),
      rect: a.getBoundingClientRect(),
      visible: a.offsetParent !== null && window.getComputedStyle(a).display !== 'none' && window.getComputedStyle(a).visibility !== 'hidden' && window.getComputedStyle(a).opacity !== '0'
    }));

    const preloader = Array.from(document.querySelectorAll('div')).filter(d => {
      const s = window.getComputedStyle(d);
      return s.position === 'fixed' && (s.zIndex > 10 || s.width === `${window.innerWidth}px`);
    }).map(d => ({
      styleAttr: d.getAttribute('style'),
      bg: window.getComputedStyle(d).backgroundColor,
      zIndex: window.getComputedStyle(d).zIndex,
      display: window.getComputedStyle(d).display,
      opacity: window.getComputedStyle(d).opacity,
      pointerEvents: window.getComputedStyle(d).pointerEvents
    }));

    return {
      title: document.title,
      totalCards: cards.length,
      visibleCards: cards.filter(c => c.visible).length,
      sampleCards: cards.slice(0, 5),
      preloader,
      hasClientError: text.includes('client-side exception')
    };
  });

  console.log('Evaluation:', JSON.stringify(evaluation, null, 2));
  if (pageErrors.length > 0) {
    console.log('Page Errors:', pageErrors);
  }
  const errorLogs = consoleLogs.filter(l => l.startsWith('[error]'));
  if (errorLogs.length > 0) {
    console.log('Console Errors:', errorLogs);
  }

  await page.screenshot({ path: 'scripts/work-page-check.png' });
  console.log('Screenshot saved to scripts/work-page-check.png');

  await browser.close();
})();
