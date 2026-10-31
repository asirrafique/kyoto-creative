const fs = require('fs');

const sgHtml = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

const scriptTags = [...sgHtml.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[0]);
const eScript = scriptTags.find(s => s.includes('"e:['));
console.log('eScript length:', eScript?.length);

const flightText = JSON.parse(eScript.slice('<script>self.__next_f.push(['.length + 1, eScript.lastIndexOf('])</script>')));
const rowContent = flightText.slice(flightText.indexOf(':') + 1).trim();

// Find where sections are in 0023 Flight
const parsed = JSON.parse(rowContent);
console.log('Successfully parsed 0023 Flight AST!');

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

const cb = findNode(parsed, n => n && n[1] === 'section' && n[3]?.className?.includes('ContentBuilder_contentBuilder'));
console.log('ContentBuilder in 0023 AST:', !!cb);
if (cb) {
  console.log('CB children in 0023 AST:', cb[3].children.map(c => c ? c[3]?.className || c[1] : null));
}
