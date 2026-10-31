const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const idx = chunk.indexOf('function t9(e){');
const patched = chunk.replace(
  'function t7(e){console.log("t7 called, moving up fiber from:", e.type, "tX will be:", e.return?.type);for(tX=e.return;tX;)switch(tX.tag){case 3:case 27:t0=!0;return;case 5:case 13:t0=!1;return;default:tX=tX.return}}',
  'function t7(e){for(tX=e.return;tX;)switch(tX.tag){case 3:case 27:t0=!0;return;case 5:case 13:t0=!1;return;default:tX=tX.return}}'
).replace(
  'else{tG=tX?ca(e.stateNode):null;console.log("t9 set tG to:", tG?.nodeName, tG?.className, "for fiber:", e.type);};return!0}',
  'else{tG=tX?ca(e.stateNode):null;if(!tX)console.log("t9 REACHED ROOT for fiber:", e.type, "tG is:", tG?.nodeName);};return!0}'
);

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', patched, 'utf8');
console.log('Patched t9 root log!');
