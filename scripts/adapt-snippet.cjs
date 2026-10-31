const fs = require('fs');
const rscSnippet = fs.readFileSync('scripts/target_rsc_clean.txt', 'utf8');

// Replace "$L1c" with "$L1d", and "$L1e" with "$L21"
const adapted = rscSnippet.replaceAll('"$L1c"', '"$L1d"').replaceAll('"$L1e"', '"$L21"');
console.log('Adapted snippet length:', adapted.length);
console.log('Any $L1c or $L1e remaining?:', adapted.includes('$L1c') || adapted.includes('$L1e'));
console.log('Contains $L1d?:', adapted.includes('$L1d'));
console.log('Contains $L21?:', adapted.includes('$L21'));
fs.writeFileSync('scripts/adapted_rsc_snippet.txt', adapted, 'utf8');
