const fs = require('fs');

const html = fs.readFileSync('reference/pages/8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1.html', 'utf8');
const p = html.indexOf('/work/upp');
console.log('p at /work/upp:', p);
console.log(html.slice(p - 300, p + 500));
