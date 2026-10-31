const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  await page.addInitScript(() => {
    window.addEventListener('load', () => {
      console.log('88Pilot WINDOW LOADED');
      console.log('88Pilot __next_f length:', window.__next_f ? window.__next_f.length : 'null');
      if (window.__next_f) {
        window.__next_f.forEach((item, idx) => {
          if (item[0] === 1) {
            const s = String(item[1]);
            const id = s.match(/^([0-9a-f]+):/)?.[1] || s.slice(0, 10);
            console.log(`88Pilot __next_f[${idx}] id=${id} len=${s.length}`);
          }
        });
      }
    });
  });

  page.on('console', msg => console.log('LOG:', msg.text()));
  await page.goto('http://127.0.0.1:3000/work/88pilot');
  await page.waitForTimeout(2000);
  await browser.close();
})();
