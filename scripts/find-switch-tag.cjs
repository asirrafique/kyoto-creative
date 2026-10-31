const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const idx = chunk.indexOf('case 27:return $(t),null===e&&tZ&&(');

// Find the switch(t.tag) before this
const switchIdx = chunk.lastIndexOf('switch(t.tag)', idx);
console.log('switch(t.tag) at:', switchIdx);
console.log(chunk.slice(switchIdx, switchIdx + 800));
