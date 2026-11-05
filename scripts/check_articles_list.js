const fs = require('fs');

const homeHtml = fs.readFileSync('reference/pages/8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1.html', 'utf8');
const p = homeHtml.indexOf('Articles_articlesList__CXW8a');
const end = homeHtml.indexOf('</section>', p);
const block = homeHtml.substring(p, end);
const matches = block.match(/href="\/blog\/[^"]+"/g);
console.log('Homepage Latest articles count:', matches.length);
console.log('Articles:', matches);

// Check if any other pages have Articles_articlesList
const dir = 'reference/pages';
for (const f of fs.readdirSync(dir)) {
  if (f.endsWith('.html')) {
    const c = fs.readFileSync(dir + '/' + f, 'utf8');
    if (c.includes('Articles_articlesList__CXW8a')) {
      console.log('Found Articles_articlesList in:', f);
    }
  }
}
