const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  await page.route('**/fd9d1056-2f07626ddf804ce1.js*', async route => {
    const response = await route.fetch();
    let body = await response.text();
    body = body.replace('function t8(e){return 0!=(1&e.mode)&&0==(128&e.flags)}', 'function t8(e){return false}');
    body = body.replace('case 2:case 3:case 5:break;', 'case 2:case 3:case 5:case 6:break;');
    await route.fulfill({
      response,
      body,
      headers: {
        ...response.headers(),
        'content-length': Buffer.byteLength(body).toString()
      }
    });
  });

  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  const containerHtml = await page.evaluate(() => {
    const el = document.querySelector('.Work_projectsWithFilters__mwDTM');
    return el ? el.outerHTML : 'NOT FOUND';
  });

  console.log('Container HTML:\n', containerHtml);

  await browser.close();
})();
