const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  // Click on 88Pilot card
  console.log('Clicking 88Pilot card...');
  await page.locator('a[href="/work/88pilot"]').first().click();
  await page.waitForURL('**/work/88pilot', { timeout: 5000 });
  console.log('Navigated to:', page.url());

  // Go back
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  // Click on Seven Gate Holdings
  console.log('Clicking Seven Gate Holdings card...');
  await page.locator('a[href="/work/seven-gate-holdings"]').first().click();
  await page.waitForURL('**/work/seven-gate-holdings', { timeout: 5000 });
  console.log('Navigated to:', page.url());

  // Go back
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  // Click on Green Square Infra
  console.log('Clicking Green Square Infra card...');
  await page.locator('a[href="/work/green-square-infra"]').first().click();
  await page.waitForURL('**/work/green-square-infra', { timeout: 5000 });
  console.log('Navigated to:', page.url());

  await browser.close();
  console.log('All card navigation tests succeeded!');
})().catch(console.error);
