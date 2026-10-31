const fs = require('fs');

const sgHtml = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

const startTag = '<section class="Results_results__xMS5p"';
const endTag = '</section></section><section class="LargeCta_largeCta__ylf5C">';

const sIdx = sgHtml.indexOf(startTag);
const eIdx = sgHtml.indexOf(endTag);

console.log('sIdx:', sIdx, 'eIdx:', eIdx);
const snippet = sgHtml.slice(sIdx, eIdx + '</section>'.length);
console.log('Snippet length:', snippet.length);
console.log('Starts with:\n', snippet.slice(0, 100));
console.log('Ends with:\n', snippet.slice(-100));

fs.writeFileSync('temp_seven_gate_part.html', snippet, 'utf8');
