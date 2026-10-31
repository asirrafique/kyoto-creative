const fs = require('fs');

const baseHtml = fs.readFileSync('reference/pages/leadcourt_project_page.html', 'utf8');
const pStart = baseHtml.lastIndexOf('self.__next_f.push([1,');
const push = baseHtml.slice(pStart);
const end = push.lastIndexOf('])</script>');
const flightText = JSON.parse(push.slice('self.__next_f.push([1,'.length, end));
const colonIdx = flightText.indexOf(':');
const rowId = flightText.slice(0, colonIdx);
const rowContent = flightText.slice(colonIdx + 1).trim();

const tree = JSON.parse(rowContent);

// Traverse to find ContentBuilder in tree
function findNode(node, pred) {
  if (pred(node)) return node;
  if (Array.isArray(node)) {
    for (const item of node) {
      const f = findNode(item, pred);
      if (f) return f;
    }
  } else if (node && typeof node === 'object') {
    for (const v of Object.values(node)) {
      const f = findNode(v, pred);
      if (f) return f;
    }
  }
  return null;
}

const cb = findNode(tree, n => n && n[1] === 'section' && n[3]?.className?.includes('ContentBuilder_contentBuilder'));
console.log('ContentBuilder found:', !!cb);
if (cb) {
  console.log('ContentBuilder children count:', cb[3].children.length);
  // cb[3].children has:
  // 0: Video loop
  // 1: The Strategy
  // 2: SingleImage Video loop
  // 3: The Results
}
