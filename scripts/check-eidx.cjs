const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });

  const raw = await page.evaluate(() => {
    return window.__next_f[2][1];
  });

  const eIdx = raw.indexOf('$L2e');
  console.log('eIdx:', eIdx);
  if (eIdx !== -1) {
    console.log('Snippet around target:');
    console.log(raw.slice(Math.max(0, eIdx - 60), eIdx + 120));
  } else {
    console.log('Target not found, searching for projects:');
    const pIdx = raw.indexOf('projects');
    console.log('pIdx:', pIdx);
    if (pIdx !== -1) console.log(raw.slice(Math.max(0, pIdx - 40), pIdx + 80));
  }
  await browser.close();
})();
