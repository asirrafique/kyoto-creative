const fs = require('fs');

let chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', 'utf8');

const mountScript = `
;(function() {
  if (typeof window === "undefined") return;
  function tryMount() {
    if (window.__work_mounted) return;
    const container = document.querySelector('.Work_projectsWithFilters__mwDTM .container');
    if (!container) return;

    if (!window.webpackChunk_N_E || !window.__next_f) return;

    let req;
    window.webpackChunk_N_E.push([['work_auto_mount'], {}, (r) => { req = r; }]);
    if (!req) return;

    const React = req(2265);
    const { createRoot } = req(34040) || {};
    const CompArchive = req(60119)?.default;
    const CompFilters = req(78267)?.default;

    if (!React || !createRoot || !CompArchive) return;

    // Extract data from __next_f
    let rawData = null;
    for (const item of window.__next_f) {
      if (Array.isArray(item) && typeof item[1] === 'string' && item[1].includes('$L2e')) {
        rawData = item[1];
        break;
      }
    }
    if (!rawData) return;

    try {
      const ePrefix = '["$","$L2e",null,{"projects":';
      const eIdx = rawData.indexOf(ePrefix);
      if (eIdx === -1) return;
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

      window.__work_mounted = true;
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
      console.log('Successfully mounted Work archive with ' + projects.length + ' projects at full 12-column width!');
    } catch (err) {
      console.error('Work mount error:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryMount);
  } else {
    tryMount();
  }
  setTimeout(tryMount, 50);
  setTimeout(tryMount, 200);
  setTimeout(tryMount, 600);
  setTimeout(tryMount, 1200);
})();
`;

chunk += '\n' + mountScript;
fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', chunk, 'utf8');
console.log('Appended auto-mount script with span 12 and custom projects to work chunk!');
