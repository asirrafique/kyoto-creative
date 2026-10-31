const fs = require('fs');
const refRoutes = JSON.parse(fs.readFileSync('reference/routes.json', 'utf8'));
const rscFile = refRoutes['/work'].replace('.html', '.rsc');
const rsc = fs.readFileSync('reference/pages/' + rscFile, 'utf8');

const matches = [];
let pos = 0;
while ((pos = rsc.indexOf('seas-geosciences', pos)) !== -1) {
  matches.push(pos);
  pos += 'seas-geosciences'.length;
}
console.log('Matches count for seas-geosciences in RSC:', matches.length);
matches.forEach((p, i) => {
  const lineStart = rsc.lastIndexOf('\n', p);
  console.log(`Match ${i+1}: pos=${p}, prefix=${JSON.stringify(rsc.slice(lineStart + 1, lineStart + 40))}`);
});

const htmlFile = refRoutes['/work'];
const html = fs.readFileSync('reference/pages/' + htmlFile, 'utf8');
const htmlMatches = [];
pos = 0;
while ((pos = html.indexOf('seas-geosciences', pos)) !== -1) {
  htmlMatches.push(pos);
  pos += 'seas-geosciences'.length;
}
console.log('Matches count for seas-geosciences in HTML:', htmlMatches.length);
htmlMatches.forEach((p, i) => {
  const lineStart = html.lastIndexOf('\n', p);
  console.log(`HTML Match ${i+1}: pos=${p}, prefix=${JSON.stringify(html.slice(lineStart + 1, lineStart + 40))}`);
});
