const fs = require('fs');
const html = fs.readFileSync('reference/pages/johnruggieri_project_page.html', 'utf8');

const pStart = html.indexOf('Cinematic storytelling through WebGL');
const pOutcome = html.indexOf('The Outcome');

console.log('--- DOM around pStart ---');
console.log(html.slice(pStart - 150, pStart + 150));

console.log('--- DOM around pOutcome ---');
console.log(html.slice(pOutcome - 150, pOutcome + 150));
