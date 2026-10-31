const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const res = await page.evaluate(() => {
    let req;
    window.webpackChunk_N_E.push([['test_render_archive'], {}, (r) => { req = r; }]);
    const React = req(2265);
    const { createRoot } = req(34040);
    const CompArchive = req(60119).default;
    const CompFilters = req(78267).default;

    // Find raw data
    let rawData = null;
    for (const item of window.__next_f) {
      if (Array.isArray(item) && typeof item[1] === 'string' && item[1].includes('$L2e')) {
        rawData = item[1];
        break;
      }
    }

    // Extract projects and taxonomy
    const eIdx = rawData.indexOf('["$","$L2e",null,{"projects":');
    const dIdx = rawData.indexOf('["$","$L2d",null,');
    
    // Parse projects
    const projStr = rawData.slice(eIdx + '["$","$L2e",null,{"projects":'.length - 1);
    // Find matching bracket
    let depth = 0;
    let projEnd = 0;
    for (let i = 0; i < projStr.length; i++) {
      if (projStr[i] === '[') depth++;
      else if (projStr[i] === ']') {
        depth--;
        if (depth === 0) {
          projEnd = i + 1;
          break;
        }
      }
    }
    const projects = JSON.parse(projStr.slice(0, projEnd));

    // Mount into container
    const container = document.querySelector('.Work_projectsWithFilters__mwDTM .container');
    const target = document.createElement('div');
    target.className = 'rendered-archive-mount';
    container.appendChild(target);

    const root = createRoot(target);
    root.render(React.createElement(CompArchive, { projects }));

    return {
      projectsCount: projects.length,
      firstProject: projects[0].node.title
    };
  });
  console.log('Mount result:', res);

  await page.waitForTimeout(1000);
  const linksCount = await page.locator('.rendered-archive-mount a[href^="/work/"]').count();
  console.log('Rendered project links count:', linksCount);

  await page.screenshot({ path: 'work_direct_rendered.png' });
  await browser.close();
})().catch(console.error);
