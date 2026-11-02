const fs = require('fs');

const ref = fs.readFileSync('reference/pages/8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1.html', 'utf8');
const p = ref.indexOf('Work_bottom__rzrzH');
console.log('Work_bottom found at', p);
console.log('Context before:');
console.log(ref.slice(p - 250, p));
