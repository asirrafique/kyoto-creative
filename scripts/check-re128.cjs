const fs = require('fs');
const ref = fs.readFileSync('reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.html', 'utf8');

// Check what lines in localize.mjs do to ref!
const re128 = /,(?:\\{1,3}"\$L(?:57|46|2c|1c)\\{1,3}"|"\$L(?:57|46|2c|1c)")/g;
const matches128 = [];
let m;
while ((m = re128.exec(ref)) !== null) {
  matches128.push({ index: m.index, match: m[0], surrounding: ref.slice(m.index - 30, m.index + 30) });
}
console.log('Matches for line 128 in agency page:', matches128);
