const fs = require('fs');
const upp = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');
const bsHtml = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');
const rscSnippet = fs.readFileSync('scripts/target_rsc_clean.txt', 'utf8');

const regex = /\$L([a-f0-9]+)/gi;
let m;
const refs = new Set();
while ((m = regex.exec(rscSnippet)) !== null) {
  refs.add(m[1]);
}
console.log('References in RSC snippet:', Array.from(refs));

refs.forEach(ref => {
  const uppDef = upp.match(new RegExp('(?:"|^|\\s)' + ref + ':I\\[(\\d+),', 'i'));
  const bsDef = bsHtml.match(new RegExp('(?:"|^|\\s)' + ref + ':I\\[(\\d+),', 'i'));
  console.log(`Ref $L${ref}: UPP=${uppDef ? uppDef[1] : 'none'}, BS=${bsDef ? bsDef[1] : 'none'}`);
});
