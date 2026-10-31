const fs = require('fs');

const routes = JSON.parse(fs.readFileSync('reference/routes.json', 'utf8'));
const file = routes['/work/green-square-infra'];
console.log('routes["/work/green-square-infra"]:', file);

const content = fs.readFileSync('reference/pages/' + file, 'utf8');
console.log('File has Green Square Infra title?', content.includes('Green Square Infra - Kyoto Creative'));
console.log('File has Gunajit Dutta?', content.includes('Gunajit Dutta'));
console.log('File length:', content.length);
