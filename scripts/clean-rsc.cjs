const fs = require('fs');
const rsc = fs.readFileSync('scripts/target_rsc.txt', 'utf8');
const targetEnd = ',["$","section",null,{"className":"RelatedPosts_relatedPosts__xfLkb"';
const idx = rsc.indexOf(targetEnd);
console.log('Target end index:', idx);
const cleaned = rsc.slice(0, idx);
console.log('Cleaned length:', cleaned.length);
console.log('Cleaned ends with:', cleaned.slice(cleaned.length - 120));
fs.writeFileSync('scripts/target_rsc_clean.txt', cleaned, 'utf8');
