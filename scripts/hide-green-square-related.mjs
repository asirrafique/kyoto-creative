import fs from 'fs';

let ref = fs.readFileSync('src/lib/reference.js', 'utf8');

const targetStr = "      '}' +\r\n      '</style>'\r\n    : '';\r\n  const johnRuggieriVideoStyle";
const replacementStr = "      '}' +\r\n      '.RelatedProjects_relatedProjects__opNhl {' +\r\n      '  display: none !important;' +\r\n      '}' +\r\n      '</style>'\r\n    : '';\r\n  const johnRuggieriVideoStyle";

const targetStrLF = "      '}' +\n      '</style>'\n    : '';\n  const johnRuggieriVideoStyle";
const replacementStrLF = "      '}' +\n      '.RelatedProjects_relatedProjects__opNhl {' +\n      '  display: none !important;' +\n      '}' +\n      '</style>'\n    : '';\n  const johnRuggieriVideoStyle";

const startIdx = ref.indexOf('greenSquareBannersStyle');
const subRef = ref.slice(startIdx);

if (subRef.includes(targetStr)) {
  ref = ref.slice(0, startIdx) + subRef.replace(targetStr, replacementStr);
  fs.writeFileSync('src/lib/reference.js', ref, 'utf8');
  console.log('Successfully added RelatedProjects hide rule to greenSquareBannersStyle (CRLF)!');
} else if (subRef.includes(targetStrLF)) {
  ref = ref.slice(0, startIdx) + subRef.replace(targetStrLF, replacementStrLF);
  fs.writeFileSync('src/lib/reference.js', ref, 'utf8');
  console.log('Successfully added RelatedProjects hide rule to greenSquareBannersStyle (LF)!');
} else {
  console.error('Target string not found in greenSquareBannersStyle');
}
