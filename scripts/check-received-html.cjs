const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  const res = await page.goto('http://127.0.0.1:3000/work/green-square-infra');
  const text = await res.text();
  console.log('Received HTML length:', text.length);
  const nextFPushes = [...text.matchAll(/self\.__next_f\.push/g)];
  console.log('HTML contains self.__next_f.push count:', nextFPushes.length);
  const scriptTags = [...text.matchAll(/<script/g)];
  console.log('HTML contains <script count:', scriptTags.length);
  fs.writeFileSync('scripts/received-gs.html', text, 'utf8');
  await browser.close();
})();
