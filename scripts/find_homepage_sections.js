const fs = require('fs');

const html = fs.readFileSync('reference/pages/8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1.html', 'utf8');
const dom = html.slice(0, html.indexOf('self.__next_f'));

const sectionMatches = dom.match(/<section[^>]*>/g) || [];
console.log('Sections in homepage DOM:');
sectionMatches.forEach(s => console.log(s));

// Also let's search for ProjectCard or links to /work
const workLinks = dom.match(/href="\/work\/[^"]*"/g) || [];
console.log('Work links in homepage DOM:');
console.log([...new Set(workLinks)]);
