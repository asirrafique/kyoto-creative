import fs from 'fs';

let ref = fs.readFileSync('src/lib/reference.js', 'utf8');

const targetStr = "      '.SingleImage_containedImage__N2jLD .Video_videoContainer__21JKT video {' +\n      '  object-fit: contain !important;' +\n      '}' +\n      '</style>'";
const replacementStr = "      '.SingleImage_containedImage__N2jLD .Video_videoContainer__21JKT video {' +\n      '  object-fit: contain !important;' +\n      '}' +\n      '.RelatedProjects_relatedProjects__opNhl {' +\n      '  display: none !important;' +\n      '}' +\n      '</style>'";

const targetStrCRLF = "      '.SingleImage_containedImage__N2jLD .Video_videoContainer__21JKT video {' +\r\n      '  object-fit: contain !important;' +\r\n      '}' +\r\n      '</style>'";
const replacementStrCRLF = "      '.SingleImage_containedImage__N2jLD .Video_videoContainer__21JKT video {' +\r\n      '  object-fit: contain !important;' +\r\n      '}' +\r\n      '.RelatedProjects_relatedProjects__opNhl {' +\r\n      '  display: none !important;' +\r\n      '}' +\r\n      '</style>'";

const startIdx = ref.indexOf('johnRuggieriVideoStyle');
const subRef = ref.slice(startIdx);

if (subRef.includes(targetStr)) {
  ref = ref.slice(0, startIdx) + subRef.replace(targetStr, replacementStr);
  fs.writeFileSync('src/lib/reference.js', ref, 'utf8');
  console.log('Successfully added RelatedProjects hide rule to johnRuggieriVideoStyle (LF)!');
} else if (subRef.includes(targetStrCRLF)) {
  ref = ref.slice(0, startIdx) + subRef.replace(targetStrCRLF, replacementStrCRLF);
  fs.writeFileSync('src/lib/reference.js', ref, 'utf8');
  console.log('Successfully added RelatedProjects hide rule to johnRuggieriVideoStyle (CRLF)!');
} else {
  console.error('Target string not found in johnRuggieriVideoStyle');
}
