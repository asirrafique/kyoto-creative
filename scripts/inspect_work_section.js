const fs = require('fs');

const html = fs.readFileSync('reference/pages/8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1.html', 'utf8');
const p = html.indexOf('Work_projects__A5q77');
console.log('Work_projects__A5q77 at:', p);

// Let's find the container of this section
const start = html.lastIndexOf('<div', p);
console.log('Before Work_projects:');
console.log(html.slice(p - 400, p));

// Find all project cards in this section
const end = html.indexOf('View all projects', p);
console.log('Length of work section in DOM:', end - p);
const sectionHtml = html.slice(p, end + 200);

const cardRegex = /<a class="ProjectCard_project__[^"]*"[^>]*href="([^"]*)"/g;
let m;
while ((m = cardRegex.exec(sectionHtml)) !== null) {
  console.log('Card href:', m[1]);
}
