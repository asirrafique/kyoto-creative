const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  await page.goto('http://127.0.0.1:3000/work/88pilot');
  await page.waitForTimeout(2000);

  const allFibers = await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    const withFibers = [];
    all.forEach(el => {
      const k = Object.keys(el).find(key => key.startsWith('__reactFiber$'));
      if (k) {
        withFibers.push({
          tag: el.tagName,
          className: String(el.className),
          id: el.id
        });
      }
    });
    return withFibers;
  });
  console.log('88Pilot elements with fibers count:', allFibers.length);
  allFibers.slice(0, 20).forEach((f, i) => console.log(i, f.tag, f.className.slice(0, 50)));

  await browser.close();
})();
