const fs = require('fs');
const ref = fs.readFileSync('reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.html', 'utf8');

const s = ref.indexOf('$L2c');
console.log('Index of $L2c on agency page:', s);
console.log('Slice around $L2c on agency page:\n', ref.slice(s - 10, s + 30));
