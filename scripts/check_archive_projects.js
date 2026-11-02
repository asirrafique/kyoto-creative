const fs = require('fs');

const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');

function getPushPayloads(h) {
  const pushes = [];
  let pos = 0;
  while ((pos = h.indexOf('self.__next_f.push([1,', pos)) !== -1) {
    const end = h.indexOf('</script>', pos);
    const raw = h.slice(pos + 'self.__next_f.push([1,'.length, end - 2);
    pushes.push(JSON.parse(raw));
    pos = end + 1;
  }
  return pushes;
}

const pushes = getPushPayloads(html);
const full = pushes.join('');

const ePrefix = '["$","$L2e",null,{"projects":';
const eIdx = full.indexOf(ePrefix);
const sub = full.slice(eIdx + ePrefix.length);
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

const rawProjects = JSON.parse(sub.slice(0, end));

// Let's see the transformation from work-archive-mount.js
const excludedSlugs = new Set([
  'ziipline',
  'isi-global',
  'incentive-games',
  'florence',
  'okopod',
  'tangerine',
  'bellsant',
  'wogan-coffee',
  'bms-performance',
  'anacap',
  'super-yachts-monaco',
  'hassan-allam',
  'patchwork-health',
  'martin-building'
]);

const mapped = rawProjects.map(p => {
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
  if (p.node.slug === 'bankrate') {
    return {
      ...p,
      node: {
        ...p.node,
        title: 'Leadcourt',
        slug: 'leadcourt',
        singleProject: {
          ...p.node.singleProject,
          hero: {
            ...p.node.singleProject?.hero,
            heading: 'From Early Traction to 10,000 Users in Six Months'
          },
          projectDetails: {
            ...p.node.singleProject?.projectDetails,
            previewText: 'A high-performance digital presence and marketing system'
          }
        }
      }
    };
  }
  if (p.node.slug === 'bipsync') {
    return {
      ...p,
      node: {
        ...p.node,
        title: 'Interact Financial',
        slug: 'interactfinancial.ca',
        singleProject: {
          ...p.node.singleProject,
          hero: {
            ...p.node.singleProject?.hero,
            heading: '43,000 Website Visits in 3 Months'
          },
          projectDetails: {
            ...p.node.singleProject?.projectDetails,
            previewText: '43,000 Website Visits in 3 Months'
          }
        }
      }
    };
  }
  if (p.node.slug === 'copper') {
    return {
      ...p,
      node: {
        ...p.node,
        title: 'John Ruggieri',
        slug: 'johnruggieri',
        singleProject: {
          ...p.node.singleProject,
          hero: {
            ...p.node.singleProject?.hero,
            heading: 'Turning Artistic Talent into a Stronger Digital Presence'
          },
          projectDetails: {
            ...p.node.singleProject?.projectDetails,
            previewText: 'Turning Artistic Talent into a Stronger Digital Presence'
          }
        }
      }
    };
  }
  return p;
}).filter(p => !excludedSlugs.has(p.node.slug));

console.log('Remaining mapped projects count:', mapped.length);
mapped.forEach((p, idx) => {
  console.log(idx, p.node.slug, ':', p.node.title, '(', p.node.singleProject?.hero?.heading, ')');
});
