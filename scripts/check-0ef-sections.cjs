const { execSync } = require('child_process');
const fs = require('fs');

const orig0ef = execSync('git show HEAD:reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', { maxBuffer: 10 * 1024 * 1024 }).toString('utf8');

function getParts(html) {
  const parts = [];
  html.replace(/<script[^>]*>\s*self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g, (script, data) => {
    try {
      const value = JSON.parse(data);
      if (value[0] === 1) parts.push(value[1]);
    } catch {}
  });
  return parts.join('');
}

const flight0ef = getParts(orig0ef);
const eIdx = flight0ef.indexOf('e:[[[');
const next35Idx = flight0ef.indexOf('\n35:I[', eIdx);
const eStr = flight0ef.slice(eIdx + 2, next35Idx);
const parsedE = JSON.parse(eStr);
console.log('Original 0ef parsedE sections in parsedE[2][3].children:');
parsedE[2][3].children.forEach((c, i) => {
  console.log(i, c ? c[0] : null, c && c[3] ? c[3].className : null);
});
