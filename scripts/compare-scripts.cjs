const fs = require('fs');
const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');

const regex = /<script[^>]*src="([^"]*)"[^>]*><\/script>/g;
let match;
const srcList = [];
while ((match = regex.exec(html)) !== null) {
  srcList.push(match[1]);
}
console.log('Scripts in /work:', srcList);

const homeHtml = fs.readFileSync('reference/pages/8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1.html', 'utf8');
const homeSrcList = [];
while ((match = regex.exec(homeHtml)) !== null) {
  homeSrcList.push(match[1]);
}
console.log('Scripts in homepage:', homeSrcList);
