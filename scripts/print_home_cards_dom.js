const fs = require('fs');

const ref = fs.readFileSync('reference/pages/8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1.html', 'utf8');

const pUpp = ref.indexOf('href="/work/upp"');
const pGoat = ref.indexOf('href="/work/the-goat-agency"');
const cardEnd = ref.indexOf('</a>', pGoat) + 4;
console.log('Homepage work cards HTML:');
console.log(ref.slice(pUpp - 65, cardEnd));
