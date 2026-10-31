const fs = require('fs');

const rsc = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.rsc', 'utf8');
const pRscCutStart = rsc.indexOf('],["$","section",null,{"className":"MediaGallery_mediaGallery');
const pRscCutEnd = rsc.indexOf('"$L24"');
console.log('pRscCutStart:', pRscCutStart, 'pRscCutEnd:', pRscCutEnd);
const beforeCut = rsc.slice(pRscCutStart - 40, pRscCutStart);
const afterCut = rsc.slice(pRscCutEnd, pRscCutEnd + 40);
console.log('RSC Before cut:', JSON.stringify(beforeCut));
console.log('RSC After cut:', JSON.stringify(afterCut));

const html = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');
const regex = /<script[^>]*>\s*self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g;
let m;
let val1;
while ((m = regex.exec(html)) !== null) {
  if (m[1].includes('bs-after.jpg')) {
    val1 = JSON.parse(m[1])[1];
    break;
  }
}
const pClientCutStart = val1.indexOf('],["$","section",null,{"className":"MediaGallery_mediaGallery');
const pClientCutEnd = val1.indexOf('"$L32"');
console.log('Client Before cut:', JSON.stringify(val1.slice(pClientCutStart - 40, pClientCutStart)));
console.log('Client After cut:', JSON.stringify(val1.slice(pClientCutEnd, pClientCutEnd + 40)));
