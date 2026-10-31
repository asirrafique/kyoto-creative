const fs = require('fs');
let loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');
loc = loc.replaceAll(
  'div[style*="background: #efefef"], div[style*="background:#efefef"] { pointer-events: none !important; }',
  'div[style*="background: #efefef"], div[style*="background:#efefef"] { display: none !important; opacity: 0 !important; pointer-events: none !important; }'
);
fs.writeFileSync('src/lib/localize.mjs', loc, 'utf8');
console.log('Curtain fix ensured in localize.mjs');
