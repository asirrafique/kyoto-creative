const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const containerInfo = await page.evaluate(() => {
    const cont = document.querySelector('.Work_projectsWithFilters__mwDTM .container');
    const mount = document.querySelector('.work-react-archive-mount');
    const list = document.querySelector('.ProjectsList_projectList__H4dCn');
    const firstCard = document.querySelector('.ProjectCard_project__d1wbY');
    
    return {
      containerDisplay: cont ? getComputedStyle(cont).display : null,
      containerGridTemplate: cont ? getComputedStyle(cont).gridTemplateColumns : null,
      containerWidth: cont ? cont.clientWidth : null,
      mountDisplay: mount ? getComputedStyle(mount).display : null,
      mountWidth: mount ? mount.clientWidth : null,
      listDisplay: list ? getComputedStyle(list).display : null,
      listGridTemplate: list ? getComputedStyle(list).gridTemplateColumns : null,
      listWidth: list ? list.clientWidth : null,
      cardWidth: firstCard ? firstCard.clientWidth : null,
      cardHeight: firstCard ? firstCard.clientHeight : null
    };
  });
  console.log('Layout info:', JSON.stringify(containerInfo, null, 2));

  await browser.close();
})().catch(console.error);
