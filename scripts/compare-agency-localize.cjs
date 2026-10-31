const fs = require('fs');
const ref = fs.readFileSync('reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.html', 'utf8');

const { localize } = require('./src/lib/localize.mjs');

const localized = localize(ref);

// Check if ["$", null appears in localized
const idx = localized.indexOf('["$",null');
console.log('["$",null in localized?:', idx);
if (idx !== -1) {
  console.log(localized.slice(idx - 60, idx + 80));
}

// Compare with original ref
const origIdx = ref.indexOf('["$",null');
console.log('["$",null in original ref?:', origIdx);
