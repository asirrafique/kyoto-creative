const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  
  const loadMoreBtn = await page.$('button.Work_loadMore__d96u4, button[class*="loadMore"]');
  console.log('Load more button found:', !!loadMoreBtn);
  if (loadMoreBtn) {
    const text = await loadMoreBtn.textContent();
    console.log('Load more button text:', text.trim());
    await loadMoreBtn.click();
    await page.waitForTimeout(1000);
    const countAfter = await page.evaluate(() => document.querySelectorAll('.ProjectCard_project__d1wbY').length);
    console.log('Cards after click load more:', countAfter);
  }
  
  await browser.close();
})();
