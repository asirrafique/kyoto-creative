const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', 'utf8');

// We want to append an auto-mount runner at the bottom of page-5b3919766e28ce0e.js
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
      const projects = JSON.parse(sub.slice(0, end));

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
      console.log('Successfully mounted Work archive with ' + projects.length + ' projects!');
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
})();
`;

// Clean up chunk debug logs first
let cleanChunk = chunk.replace('console.log("CHUNK page-5b3919766e28ce0e.js EXECUTING!");\n', '')
  .replace('console.log("MODULE 48331 EXECUTING!");', '')
  .replace('console.log("60119 ARCHIVE CALLED with props:", e);', '');

cleanChunk += '\n' + mountScript;

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', cleanChunk, 'utf8');
console.log('Appended auto-mount script to work chunk!');
