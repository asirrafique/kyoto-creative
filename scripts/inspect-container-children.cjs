const fs = require('fs');

const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');
const matches = [...html.matchAll(/self\.__next_f\.push\(\[1,"(.*?)"\]\)/gs)];
const unescaped = JSON.parse('"' + matches[12][1] + '"');

const idx = unescaped.indexOf('Work_projectsWithFilters');
console.log(unescaped.slice(idx, idx + 1500));
