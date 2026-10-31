const fs = require('fs');

const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');
const matches = [...html.matchAll(/self\.__next_f\.push\(\[1,"(.*?)"\]\)/gs)];
const p12 = JSON.parse('"' + matches[12][1] + '"');

// Let's find $L2d and $L2e in p12
const dStart = p12.indexOf('["$","$L2d",');
console.log('dStart:', dStart);

const eStart = p12.indexOf('["$","$L2e",');
console.log('eStart:', eStart);

// Let's find projects data
const projectsMatch = p12.slice(eStart).match(/\"projects\":(\[.*?\]\]\]\})/);
// Or parse the JSON structure starting around Work_projectsWithFilters
const wpIdx = p12.indexOf('Work_projectsWithFilters');
console.log('wpIdx:', wpIdx);
