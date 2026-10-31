const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', 'utf8');

const idx = chunk.indexOf('ProjectCard_heading__1csIW');
console.log(chunk.slice(idx - 100, idx + 400));
