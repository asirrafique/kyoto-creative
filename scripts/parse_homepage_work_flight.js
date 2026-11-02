const fs = require('fs');

const html = fs.readFileSync('reference/pages/8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1.html', 'utf8');

function getPushPayloads(h) {
  const pushes = [];
  let pos = 0;
  while ((pos = h.indexOf('self.__next_f.push([1,', pos)) !== -1) {
    const end = h.indexOf('</script>', pos);
    const raw = h.slice(pos + 'self.__next_f.push([1,'.length, end - 2);
    pushes.push(JSON.parse(raw));
    pos = end + 1;
  }
  return pushes;
}

const pushes = getPushPayloads(html);
const full = pushes.join('');

const idx = full.indexOf('Work_projects__A5q77');
// Find container children array start
const containerStart = full.indexOf('{"className":"container","children":', idx);
const arrayStart = containerStart + '{"className":"container","children":'.length;

console.log('container children array start:', arrayStart);
console.log('first 100 chars:', full.slice(arrayStart, arrayStart + 100));

// Find matching bracket for container children array
let depth = 0;
let inStr = false;
let esc = false;
let arrayEnd = -1;
for (let i = arrayStart; i < full.length; i++) {
  const c = full[i];
  if (esc) { esc = false; continue; }
  if (c === '\\') { esc = true; continue; }
  if (c === '"') { inStr = !inStr; continue; }
  if (!inStr) {
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) {
        arrayEnd = i + 1;
        break;
      }
    }
  }
}

console.log('arrayEnd:', arrayEnd);
const containerChildrenStr = full.slice(arrayStart, arrayEnd);
const parsed = JSON.parse(containerChildrenStr);
console.log('Parsed container children count:', parsed.length);
parsed.forEach((item, i) => {
  console.log(i, JSON.stringify(item).slice(0, 80));
});
