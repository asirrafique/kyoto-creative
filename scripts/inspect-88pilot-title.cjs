const fs = require('fs');

const f = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');

// Find title, intro, etc.
const title = f.match(/<title>(.*?)<\/title>/);
console.log('Title:', title ? title[1] : null);

// Look for intro text
const intro = f.match(/<div class="prose">([\s\S]*?)<\/div>/);
console.log('Intro prose:', intro ? intro[1].slice(0, 300) : null);
