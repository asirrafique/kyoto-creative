const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  const titles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.ProjectCard_project__d1wbY')).map(card => {
      const h = card.querySelector('h3, h2, [class*="title"]');
      return h ? h.textContent.trim() : card.textContent.trim().slice(0, 30);
    });
  });
  console.log('Total cards:', titles.length);
  console.log('Sample titles:', titles.slice(0, 10));
  const has88 = titles.some(t => t.includes('88Pilot'));
  const hasGs = titles.some(t => t.includes('Green Square Infra'));
  const hasSeven = titles.some(t => t.includes('Seven Gate Holdings'));
  console.log({ has88, hasGs, hasSeven });
  await browser.close();
})();
