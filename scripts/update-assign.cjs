const fs = require('fs');

let chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', 'utf8');

const targetOld = `if (p.node.slug === 'seas-geosciences') {
          return {
            ...p,
            node: {
              ...p.node,
              title: '88Pilot',
              slug: '88pilot',
              singleProject: {
                ...p.node.singleProject,
                projectDetails: {
                  ...p.node.singleProject?.projectDetails
                },
                hero: {
                  ...p.node.singleProject?.hero,
                  heading: 'Building an AI-Powered HR Compliance Platform for US Businesses'
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
                projectDetails: {
                  ...p.node.singleProject?.projectDetails
                },
                hero: {
                  ...p.node.singleProject?.hero,
                  heading: 'A high-performance digital presence and marketing system for real estate infrastructure'
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
                projectDetails: {
                  ...p.node.singleProject?.projectDetails
                },
                hero: {
                  ...p.node.singleProject?.hero,
                  heading: 'How Seven Gate Holdings found brand clarity through a new strategy with Kyoto Creative'
                }
              }
            }
          };
        }`;

const targetNew = `if (p.node.slug === 'seas-geosciences') {
          return Object.assign({}, p, {
            node: Object.assign({}, p.node, {
              title: '88Pilot',
              slug: '88pilot',
              singleProject: Object.assign({}, p.node.singleProject, {
                hero: { heading: 'Building an AI-Powered HR Compliance Platform for US Businesses' }
              })
            })
          });
        }
        if (p.node.slug === 'upp') {
          return Object.assign({}, p, {
            node: Object.assign({}, p.node, {
              title: 'Green Square Infra',
              slug: 'green-square-infra',
              singleProject: Object.assign({}, p.node.singleProject, {
                hero: { heading: 'A high-performance digital presence and marketing system for real estate infrastructure' }
              })
            })
          });
        }
        if (p.node.slug === 'bucher-suter') {
          return Object.assign({}, p, {
            node: Object.assign({}, p.node, {
              title: 'Seven Gate Holdings',
              slug: 'seven-gate-holdings',
              singleProject: Object.assign({}, p.node.singleProject, {
                hero: { heading: 'How Seven Gate Holdings found brand clarity through a new strategy with Kyoto Creative' }
              })
            })
          });
        }`;

chunk = chunk.replace(targetOld, targetNew);
fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', chunk, 'utf8');
console.log('Updated with Object.assign!');
