const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });
  await page.goto('http://127.0.0.1:3000/work', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const mountResult = await page.evaluate(() => {
    let req;
    window.webpackChunk_N_E.push([['test_mount_now'], {}, (r) => { req = r; }]);
    if (!req) return { error: 'No webpack req' };

    let React, createRoot, CompArchive, CompFilters;
    try {
      React = req(2265);
      const reactDom = req(34040);
      createRoot = reactDom ? reactDom.createRoot : null;
      CompArchive = req(60119) ? req(60119).default : null;
      CompFilters = req(78267) ? req(78267).default : null;
    } catch (e) {
      return { error: 'Module load error: ' + e.message };
    }

    if (!React || !createRoot || !CompArchive) {
      return { error: 'Missing React or CompArchive' };
    }

    const container = document.querySelector('.Work_projectsWithFilters__mwDTM .container');
    if (!container) return { error: 'No container' };

    const rawData = window.__next_f[2][1];
    const ePrefix = '["$","$L2e",null,{"projects":';
    const eIdx = rawData.indexOf(ePrefix);
    if (eIdx === -1) return { error: 'No ePrefix in rawData' };

    const sub = rawData.slice(eIdx + ePrefix.length);
    let depth = 0;
    let end = 0;
    for (let i = 0; i < sub.length; i++) {
      if (sub[i] === '[') depth++;
      else if (sub[i] === ']') {
        depth--;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }
    const projects = JSON.parse(sub.slice(0, end)).map(p => {
      if (!p || !p.node) return p;
      if (p.node.slug === 'seas-geosciences') {
        return {
          ...p,
          node: {
            ...p.node,
            title: '88Pilot',
            slug: '88pilot',
            singleProject: {
              ...p.node.singleProject,
              hero: {
                ...p.node.singleProject?.hero,
                heading: 'Building an AI-Powered HR Compliance Platform'
              },
              projectDetails: {
                ...p.node.singleProject?.projectDetails,
                previewText: 'Building an AI-Powered HR Compliance Platform for US Businesses'
              }
            }
          }
        };
      }
      if (p.node.slug === 'upp') {
        return {
          ...p,
          node: {
            ...p.node,
            title: 'Green Square Infra',
            slug: 'green-square-infra',
            singleProject: {
              ...p.node.singleProject,
              hero: {
                ...p.node.singleProject?.hero,
                heading: 'A cinematic web experience and high-performance digital presence'
              },
              projectDetails: {
                ...p.node.singleProject?.projectDetails,
                previewText: 'A high-performance digital presence and marketing system for real estate infrastructure'
              }
            }
          }
        };
      }
      if (p.node.slug === 'bucher-suter') {
        return {
          ...p,
          node: {
            ...p.node,
            title: 'Seven Gate Holdings',
            slug: 'seven-gate-holdings',
            singleProject: {
              ...p.node.singleProject,
              hero: {
                ...p.node.singleProject?.hero,
                heading: 'How Seven Gate Holdings found brand clarity through a new strategy with Kyoto Creative'
              },
              projectDetails: {
                ...p.node.singleProject?.projectDetails,
                previewText: 'How Seven Gate Holdings found brand clarity through a new strategy with Kyoto Creative'
              }
            }
          }
        };
      }
      return p;
    });

    let filtersProps = null;
    const dPrefix = '["$","$L2d",null,';
    const dIdx = rawData.indexOf(dPrefix);
    if (dIdx !== -1) {
      const subD = rawData.slice(dIdx + dPrefix.length);
      let depthD = 0;
      let endD = 0;
      for (let i = 0; i < subD.length; i++) {
        if (subD[i] === '{') depthD++;
        else if (subD[i] === '}') {
          depthD--;
          if (depthD === 0) {
            endD = i + 1;
            break;
          }
        }
      }
      filtersProps = JSON.parse(subD.slice(0, endD));
    }

    const mountDiv = document.createElement('div');
    mountDiv.className = 'work-react-archive-mount';
    mountDiv.style.gridColumn = 'span 12';
    mountDiv.style.width = '100%';
    container.innerHTML = '';
    container.appendChild(mountDiv);

    const root = createRoot(mountDiv);
    root.render(
      React.createElement(
        React.Fragment,
        null,
        filtersProps && CompFilters ? React.createElement(CompFilters, filtersProps) : null,
        React.createElement(CompArchive, { projects })
      )
    );

    return {
      success: true,
      projectsCount: projects.length,
      sampleProjects: projects.slice(0, 3).map(p => p.node.title)
    };
  });

  console.log('Mount result:', mountResult);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scripts/work-mounted-live.png' });
  console.log('Screenshot saved to scripts/work-mounted-live.png');
  await browser.close();
})();
