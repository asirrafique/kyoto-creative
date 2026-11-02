const fs = require('fs');

const html = fs.readFileSync('reference/pages/8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1.html', 'utf8');
const p = html.indexOf('Work_projects__A5q77');
const end = html.indexOf('View all projects', p);
const sectionHtml = html.slice(p, end + 200);

console.log('--- WORK SECTION IN HOMEPAGE ---');
console.log(sectionHtml);
