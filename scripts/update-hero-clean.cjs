const fs = require('fs');

let chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', 'utf8');

const targetOld = `const projects = JSON.parse(sub.slice(0, end)).map(p => {
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
                projectDetails: {
                  ...p.node.singleProject?.projectDetails,
                  previewText: 'Building an AI-Powered HR Compliance Platform for US Businesses'
                },
                projectDetailsExcerpt: {
                  excerpt: 'Building an AI-Powered HR Compliance Platform for US Businesses'
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
                  ...p.node.singleProject?.projectDetails,
                  previewText: 'A high-performance digital presence and marketing system for real estate infrastructure'
                },
                projectDetailsExcerpt: {
                  excerpt: 'A high-performance digital presence and marketing system for real estate infrastructure'
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
                  ...p.node.singleProject?.projectDetails,
                  previewText: 'How Seven Gate Holdings found brand clarity through a new strategy with Kyoto Creative'
                },
                hero: {
                  ...p.node.singleProject?.hero,
                  heading: 'How Seven Gate Holdings found brand clarity through a new strategy with Kyoto Creative'
                }
              }
            }
          };
        }
        return p;
      });`;

const targetNew = `const projects = JSON.parse(sub.slice(0, end)).map(p => {
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
        }
        return p;
      });`;

chunk = chunk.replace(targetOld, targetNew);
fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', chunk, 'utf8');
console.log('Successfully updated card mapping with hero.heading!');
