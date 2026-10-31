const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  const res88 = await page.goto('http://127.0.0.1:3000/work/88pilot');
  const html88 = await res88.text();

  const resGs = await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  const htmlGs = await resGs.text();

  fs.writeFileSync('scripts/live88.html', html88, 'utf8');
  fs.writeFileSync('scripts/liveGs.html', htmlGs, 'utf8');
  console.log('Saved live88.html (len=' + html88.length + ') and liveGs.html (len=' + htmlGs.length + ')');

  await browser.close();
})();
