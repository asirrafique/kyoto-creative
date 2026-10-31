const fs = require('fs');
const refRoutes = JSON.parse(fs.readFileSync('reference/routes.json', 'utf8'));
const rscFile = refRoutes['/work'].replace('.html', '.rsc');
const rsc = fs.readFileSync('reference/pages/' + rscFile, 'utf8');
console.log('RSC file length:', rsc.length);
const slugs = rsc.match(/"slug":"([^"]+)"/g) || [];
console.log('RSC project slugs count:', slugs.length);
console.log('Sample slugs:', slugs.slice(0, 15));

const htmlFile = refRoutes['/work'];
const html = fs.readFileSync('reference/pages/' + htmlFile, 'utf8');
console.log('HTML mentions ProjectsArchive:', html.includes('ProjectsArchive'));
console.log('HTML mentions ProjectGrid:', html.includes('ProjectGrid'));
console.log('HTML mentions WorkGrid:', html.includes('WorkGrid'));
