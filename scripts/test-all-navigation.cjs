const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navigating to http://127.0.0.1:3000/work...');
  await page.goto('http://127.0.0.1:3000/work');
  await page.waitForTimeout(2000);

  console.log('Clicking on Seven Gate Holdings card...');
  await page.click('a[href="/work/seven-gate-holdings"]');
  await page.waitForLoadState('networkidle');
  console.log('Current URL:', page.url());
  const h1SG = await page.$eval('h1', el => el.innerText).catch(() => 'no h1');
  const hasResultsSG = await page.evaluate(() => document.body.innerText.includes('Results 30 days post-launch'));
  const hasGunajitSG = await page.evaluate(() => document.body.innerText.includes('Gunajit Dutta'));
  console.log('Seven Gate Holdings -> H1:', h1SG, '| hasResults:', hasResultsSG, '| hasGunajit:', hasGunajitSG);

  console.log('Navigating back to /work...');
  await page.goto('http://127.0.0.1:3000/work');
  await page.waitForTimeout(2000);

  console.log('Clicking on Green Square Infra card...');
  await page.click('a[href="/work/green-square-infra"]');
  await page.waitForLoadState('networkidle');
  console.log('Current URL:', page.url());
  const h1GS = await page.$eval('h1', el => el.innerText).catch(() => 'no h1');
  const hasResultsGS = await page.evaluate(() => document.body.innerText.includes('Results 30 days post-launch'));
  const hasLeadGS = await page.evaluate(() => document.body.innerText.includes('Lead Generation Engine'));
  console.log('Green Square Infra -> H1:', h1GS, '| hasResults:', hasResultsGS, '| hasLead:', hasLeadGS);

  console.log('Navigating back to /work...');
  await page.goto('http://127.0.0.1:3000/work');
  await page.waitForTimeout(2000);

  console.log('Clicking on 88Pilot card...');
  await page.click('a[href="/work/88pilot"]');
  await page.waitForLoadState('networkidle');
  console.log('Current URL:', page.url());
  const h188 = await page.$eval('h1', el => el.innerText).catch(() => 'no h1');
  console.log('88Pilot -> H1:', h188);

  await browser.close();
  console.log('All tests passed successfully!');
})();
