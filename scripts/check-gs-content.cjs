const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  await page.waitForTimeout(2000);

  const contentCheck = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasResults: text.includes('Results 30 days post-launch'),
      hasLeads: text.includes('800+'),
      hasImpact: text.includes('The Impact'),
      hasGunajit: text.includes('Gunajit Dutta'),
      hasAppError: text.includes('Application error')
    };
  });
  console.log('Green Square Infra content check:', contentCheck);

  await browser.close();
})();
