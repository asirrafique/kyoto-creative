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
const containerStart = full.indexOf('{"className":"container","children":', idx);
const arrayStart = containerStart + '{"className":"container","children":'.length;

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

const containerChildren = JSON.parse(full.slice(arrayStart, arrayEnd));
const projectCards = containerChildren[0];
console.log('Project card 0 full AST:');
console.log(JSON.stringify(projectCards[0], null, 2));
