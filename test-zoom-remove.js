const fs = require('fs');
let html = fs.readFileSync('reference/pages/johnruggieri_project_page.html', 'utf8');

const pZoom = html.indexOf('Zoom-In-New');
const needle = '[\\"$\\"';
const pApproach = html.indexOf('Our Approach', 50000);

const secZoom = html.indexOf(needle, pApproach + 200);
const secOutcome = html.lastIndexOf(needle, html.indexOf('TextLeftListRight_textLeftListRight__i5dfy', pZoom));

console.log('secZoom:', secZoom, 'secOutcome:', secOutcome);
console.log('before secZoom:', JSON.stringify(html.slice(secZoom - 5, secZoom + 50)));
console.log('before secOutcome:', JSON.stringify(html.slice(secOutcome - 5, secOutcome + 50)));

const slice = html.slice(secZoom, secOutcome);
console.log('slice length:', slice.length);
console.log('starts with:', JSON.stringify(slice.slice(0, 50)));
console.log('ends with:', JSON.stringify(slice.slice(-50)));
