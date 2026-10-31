import fs from 'node:fs';

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

// In val1, the cut segment starts at pCutStart:
const pCutStart = 9425;
const pCutEnd = val1.indexOf('"$L32"');
console.log('pCutEnd:', pCutEnd);
const cut = val1.substring(pCutStart, pCutEnd);
console.log('cut starts with:', JSON.stringify(cut.substring(0, 40)));
console.log('cut ends with:', JSON.stringify(cut.substring(cut.length - 40)));
