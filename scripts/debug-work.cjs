const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to http://127.0.0.1:3000/work...');
  await page.goto('http://127.0.0.1:3000/work');
  
  await page.waitForTimeout(4000);

  const containerInfo = await page.evaluate(() => {
    const cont = document.querySelector('.Work_projectsWithFilters__mwDTM .container') || document.querySelector('.container');
    const mount = document.querySelector('.work-react-archive-mount');
    return {
      contFound: !!cont,
      contHTML: cont ? cont.innerHTML.slice(0, 300) : 'none',
      mountFound: !!mount,
      bodyHasError: document.body.innerText.includes('Application error')
    };
  });
  console.log('Container info:', containerInfo);

  await browser.close();
})();
