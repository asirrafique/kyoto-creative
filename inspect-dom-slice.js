const fs = require('fs');
const html = fs.readFileSync('reference/pages/johnruggieri_project_page.html', 'utf8');

const pStart = html.indexOf('Cinematic storytelling through WebGL');
const secStart = html.lastIndexOf('<section', pStart);

const pOutcome = html.indexOf('The Outcome');
const secOutcome = html.lastIndexOf('<section', pOutcome);

console.log('secStart:', secStart, 'secOutcome:', secOutcome);
const removedDom = html.slice(secStart, secOutcome);
console.log('removedDom length:', removedDom.length);
console.log('starts with:', removedDom.slice(0, 80));
console.log('ends with:', removedDom.slice(-80));
