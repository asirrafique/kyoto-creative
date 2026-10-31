const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const res = await page.evaluate(() => {
    let req;
    window.webpackChunk_N_E.push([['debug_chunk4'], {}, (r) => { req = r; }]);
    const React = req(2265);
    const ReactDOMClient = req(24451);
    const CompArchive = req(60119).default;
    const CompFilters = req(78267).default;

    // Find the container
    const container = document.querySelector('.Work_projectsWithFilters__mwDTM .container');
    if (!container) return 'no container';

    // Get projects data from __next_f
    let projectsData = null;
    let sectorsData = null;
    let servicesData = null;

    for (const item of window.__next_f) {
      if (Array.isArray(item) && typeof item[1] === 'string' && item[1].includes('$L2e')) {
        // extract using regex or JSON
        const str = item[1];
        const matchProj = str.match(/\"projects\":(\[.*?\]\]\]\})/);
      }
    }

    return {
      ReactDOMClientKeys: Object.keys(ReactDOMClient),
      createRoot: typeof ReactDOMClient.createRoot
    };
  });
  console.log('Result:', res);

  await browser.close();
})().catch(console.error);
