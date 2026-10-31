const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navigating to http://127.0.0.1:3000/work...');
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'networkidle' });
  
  const cardData = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[href^="/work/"]'));
    return cards.map(c => {
      const rect = c.getBoundingClientRect();
      const title = c.innerText.replace(/\s+/g, ' ').trim();
      return { href: c.getAttribute('href'), width: Math.round(rect.width), height: Math.round(rect.height), title };
    });
  });
  
  console.log('Found cards:', cardData.length);
  cardData.slice(0, 8).forEach((c, i) => console.log(i, c));
  
  console.log('Testing click on seven-gate-holdings...');
  await page.click('a[href="/work/seven-gate-holdings"]');
  await page.waitForLoadState('networkidle');
  console.log('Current URL:', page.url());
  const h1 = await page.$eval('h1', el => el.innerText).catch(() => 'no h1');
  const hasResults = await page.evaluate(() => document.body.innerText.includes('Results 30 days post-launch'));
  const hasGunajit = await page.evaluate(() => document.body.innerText.includes('Gunajit Dutta'));
  console.log('Seven Gate Holdings - H1:', h1, '| hasResults:', hasResults, '| hasGunajit:', hasGunajit);

  console.log('Testing click on green-square-infra...');
  await page.goto('http://127.0.0.1:3000/work/green-square-infra', { waitUntil: 'networkidle' });
  const h1G = await page.$eval('h1', el => el.innerText).catch(() => 'no h1');
  const hasResultsG = await page.evaluate(() => document.body.innerText.includes('Results 30 days post-launch'));
  const hasLeadG = await page.evaluate(() => document.body.innerText.includes('Lead Generation Engine'));
  console.log('Green Square Infra - H1:', h1G, '| hasResults:', hasResultsG, '| hasLeadG:', hasLeadG);

  await browser.close();
})();
