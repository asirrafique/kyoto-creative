const fs = require('fs');
const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');

const scripts = html.match(/<script[\s\S]*?<\/script>/gi);
console.log('Total scripts:', scripts.length);
scripts.forEach((s, i) => {
  const isNextF = s.includes('__next_f');
  const srcM = s.match(/src="([^"]+)"/);
  console.log(i, isNextF ? '__next_f' : srcM ? srcM[1] : 'inline script');
});
