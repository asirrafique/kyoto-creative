const fs = require('fs');
const ref = require('./src/lib/reference.js');
const file = 'reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html';
let html = fs.readFileSync(file, 'utf8');

const placeholder = '<!--replica-flight-stream-->';
let first = true;
const parts = [];
html = html.replace(/<script[^>]*>\s*self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g, (script, data) => {
  let value;
  try { value = JSON.parse(data); } catch { return script; }
  if (value[0] !== 1) return script;
  parts.push(value[1]);
  const result = first ? placeholder : '';
  first = false;
  return result;
});
html = ref.localize(html);
let flightText = ref.localize(parts.join(''));
const data = JSON.stringify([1, flightText]).replaceAll('<', '\\u003c');
console.log('data length:', data.length);
console.log('Includes $L2e?:', data.includes('$L2e'));
console.log('Includes Bucher?:', data.includes('Bucher') || data.includes('bucher'));
console.log('Includes UPP?:', data.includes('UPP') || data.includes('upp'));
