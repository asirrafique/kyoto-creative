const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const heroObj = await page.evaluate(() => {
    let rawData;
    for (const item of window.__next_f) {
      if (Array.isArray(item) && typeof item[1] === 'string' && item[1].includes('$L2e')) {
        rawData = item[1];
        break;
      }
    }
    const ePrefix = '["$","$L2e",null,{"projects":';
    const eIdx = rawData.indexOf(ePrefix);
    const sub = rawData.slice(eIdx + ePrefix.length);
    let depth = 0, end = 0;
    for (let i = 0; i < sub.length; i++) {
      if (sub[i] === '[') depth++;
      else if (sub[i] === ']') {
        depth--;
        if (depth === 0) { end = i + 1; break; }
      }
    }
    const projects = JSON.parse(sub.slice(0, end));
    return projects[0].node.singleProject.hero;
  });
  console.log('Original hero object:', heroObj);

  await browser.close();
})().catch(console.error);
