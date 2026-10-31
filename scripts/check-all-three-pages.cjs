const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000/work/88pilot', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  const h1 = await page.locator('h1').innerText();
  const title = await page.title();
  const text = (await page.locator('.prose').first().innerText()).trim();
  console.log('88Pilot h1:', h1);
  console.log('88Pilot title:', title);
  console.log('88Pilot prose excerpt:', text.slice(0, 200));

  await page.goto('http://127.0.0.1:3000/work/green-square-infra', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  const gsH1 = await page.locator('h1').innerText();
  const gsText = (await page.locator('.prose').first().innerText()).trim();
  console.log('Green Square Infra h1:', gsH1);
  console.log('Green Square Infra prose excerpt:', gsText.slice(0, 200));

  await page.goto('http://127.0.0.1:3000/work/seven-gate-holdings', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  const sgH1 = await page.locator('h1').innerText();
  const sgText = (await page.locator('.prose').first().innerText()).trim();
  console.log('Seven Gate Holdings h1:', sgH1);
  console.log('Seven Gate Holdings prose excerpt:', sgText.slice(0, 200));

  await browser.close();
})().catch(console.error);
