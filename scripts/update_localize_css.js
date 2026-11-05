const fs = require('fs');

let code = fs.readFileSync('src/lib/localize.mjs', 'utf8');
const target = 'a[href="/culture"], li:has(> a[href="/culture"]) { display: none !important; }';
const replacement = 'a[href="/culture"], li:has(> a[href="/culture"]) { display: none !important; } .Culture_text__tkIGz, .Culture_buttonContainer__YAvTa { display: none !important; }';

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/lib/localize.mjs', code, 'utf8');
  console.log('localize.mjs successfully updated!');
} else {
  console.log('Target not found in localize.mjs');
}
