const fs = require('fs');

const routes = JSON.parse(fs.readFileSync('reference/routes.json', 'utf8'));
console.log('routes["/work/seven-gate-holdings"]:', routes['/work/seven-gate-holdings']);
console.log('routes["/work/bucher-suter"]:', routes['/work/bucher-suter']);

const file = routes['/work/seven-gate-holdings'];
const content = fs.readFileSync('reference/pages/' + file, 'utf8');
console.log('File length:', content.length);
console.log('File has Results 30 days?', content.includes('Results 30 days post-launch'));
console.log('File has More Than a Website?', content.includes('More Than a Website'));
