const fs = require('fs');

const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');
const matches = [...html.matchAll(/self\.__next_f\.push\(\[1,"(.*?)"\]\)/gs)];
const p12 = matches[12][1];

// Let's unescape JSON string
const unescaped = JSON.parse('"' + p12 + '"');
console.log('Unescaped p12 length:', unescaped.length);

// Let's find $L2d and $L2e or Work_projectsWithFilters in unescaped
const idx = unescaped.indexOf('Work_projectsWithFilters');
if (idx !== -1) {
  console.log('Surrounding Work_projectsWithFilters:');
  console.log(unescaped.slice(Math.max(0, idx - 200), idx + 600));
} else {
  console.log('Work_projectsWithFilters not found in p12');
}
