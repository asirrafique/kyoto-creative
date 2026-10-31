import fs from 'node:fs';

const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');

// Replace any occurrence of London, UK in Seven Gate Holdings
let updated = loc.replace(
  `text = text.replaceAll('Bucher + Suter', 'Seven Gate Holdings');`,
  `text = text.replaceAll('Bucher + Suter', 'Seven Gate Holdings');
  text = text.replaceAll('London, UK', '');`
);

fs.writeFileSync('src/lib/localize.mjs', updated, 'utf8');
console.log('Replaced London, UK globally in localize.mjs');
