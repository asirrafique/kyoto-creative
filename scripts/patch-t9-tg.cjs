const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const patched = chunk.replace(
  'else tG=tX?ca(e.stateNode):null;return!0}',
  'else{tG=tX?ca(e.stateNode):null;console.log("t9 set tG to:", tG?.nodeName, tG?.className, "for fiber:", e.type);};return!0}'
);

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', patched, 'utf8');
console.log('Patched t9 tG log!');
