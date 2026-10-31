const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
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
    const video = document.querySelector('video[src="/Homepage-Hero-Loop.mp4"]');
    const scrollWidth = document.documentElement.scrollWidth;
    const clientWidth = document.documentElement.clientWidth;
    return {
      hasVideo: !!video,
      videoSrc: video ? video.src : null,
      videoPoster: video ? video.poster : null,
      canScrollHorizontally: scrollWidth > clientWidth + 1,
      scrollWidth,
      clientWidth
    };
  });

  console.log('Evaluation:', JSON.stringify(evaluation, null, 2));

  // Take screenshot of the top hero and media section
  await page.screenshot({ path: 'scripts/seven-gate-hero-updated.png', fullPage: false });
  console.log('Saved screenshot to scripts/seven-gate-hero-updated.png');

  await browser.close();
})();
