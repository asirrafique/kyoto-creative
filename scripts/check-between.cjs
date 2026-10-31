const fs = require('fs');
const html = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');

const stratIdx = html.indexOf('The Strategy');
const resultsIdx = html.indexOf('Results 30 days post-launch');

console.log('The Strategy index:', stratIdx);
console.log('Results 30 days post-launch index:', resultsIdx);

if (stratIdx !== -1 && resultsIdx !== -1) {
  const between = html.slice(stratIdx, resultsIdx);
  console.log('Distance between:', between.length);
  const sections = [...between.matchAll(/<section[^>]*class="([^"]*)"/g)];
  console.log('Sections between count:', sections.length);
  sections.forEach((s, i) => console.log(i, s[1].split(' ')[0]));
}
