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
    window.webpackChunk_N_E.push([['render_test'], {}, (r) => { req = r; }]);
    const React = req(2265);
    const ReactDOMClient = req(24451);
    
    // Find CompArchive
    const CompArchive = req(60119).default;
    const CompFilters = req(78267).default;

    // Get projects data from flight row
    let rawData = null;
    for (const item of window.__next_f) {
      if (Array.isArray(item) && typeof item[1] === 'string' && item[1].includes('$L2e')) {
        rawData = item[1];
        break;
      }
    }

    // Try creating a test div and rendering with ReactDOM
    const testDiv = document.createElement('div');
    testDiv.id = 'test-render-target';
    document.body.appendChild(testDiv);

    // Check if ReactDOM has render or if we can use ReactDOM.render
    return {
      hasRawData: !!rawData,
      rawDataLen: rawData ? rawData.length : 0,
      ReactDOMClient
    };
  });
  console.log('Test result:', res);

  await browser.close();
})().catch(console.error);
