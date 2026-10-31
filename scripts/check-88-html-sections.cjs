const fs = require('fs');

const orig88 = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');
const sections = [...orig88.matchAll(/<section[^>]*class="([^"]*)"/g)];
console.log('88 Static HTML sections count:', sections.length);
sections.forEach((s, idx) => {
  console.log(idx, s[1].split(' ')[0]);
});
