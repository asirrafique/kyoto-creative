const fs = require('fs');
const upp = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');
const { localize } = require('./src/lib/localize.mjs');
const locHtml = localize(upp);

const idx1 = locHtml.lastIndexOf('Results 30 days post-launch');
const idx2 = locHtml.lastIndexOf('Founder - Green Square Infra');

const start = locHtml.lastIndexOf('["$","section"', idx1);
const end = locHtml.indexOf(']', idx2 + 100);
console.log('Start:', start, 'End:', end);
const flightSnippet = locHtml.slice(start, end + 1);
console.log('Length:', flightSnippet.length);
console.log('Snippet starts with:', flightSnippet.slice(0, 150));
console.log('Snippet ends with:', flightSnippet.slice(flightSnippet.length - 150));
fs.writeFileSync('scripts/target_html_flight.txt', flightSnippet, 'utf8');
