const fs = require('fs');
const path = 'public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/2117-ba8bcf71fc4483a9.js';
let content = fs.readFileSync(path, 'utf8');

const target = 'function s(){let e=(0,r.useContext)(u.SearchParamsContext),t=(0,r.useMemo)(()=>e?new i.ReadonlyURLSearchParams(e):null,[e]);';
console.log('Target found:', content.includes(target));

if (content.includes(target)) {
  const replacement = 'function s(){let e=(0,r.useContext)(u.SearchParamsContext),t=(0,r.useMemo)(()=>e?new i.ReadonlyURLSearchParams(e):("undefined"!=typeof window?new URLSearchParams(window.location.search):new URLSearchParams()),[e]);';
  content = content.replace(target, replacement);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully patched useSearchParams fallback!');
}
