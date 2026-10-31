const fs = require('fs');
const ref = fs.readFileSync('reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.html', 'utf8');

const s = 144762;
console.log('Surrounding:\n', ref.slice(s - 300, s + 100));
