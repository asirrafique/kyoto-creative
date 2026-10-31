const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000/work/seven-gate-holdings', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const text = await page.locator('body').innerText();
  console.log('Includes More Than a Website?', text.includes('More Than a Website') || text.includes('More than a Website'));
  console.log('Includes Five strategic?', text.includes('Five strategic pillars'));
  console.log('Includes Have a new project?', text.includes('Have a new project'));

  // Print section headings or texts
  const headings = await page.locator('h2, h3').allInnerTexts();
  console.log('Headings on page:', headings);

  await browser.close();
})().catch(console.error);
