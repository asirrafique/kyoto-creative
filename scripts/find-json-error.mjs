import fs from 'fs';
import { localize } from '../src/lib/localize.mjs';

const bsHtml = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

const parts = [];
let first = true;
let html = bsHtml.replace(/<script[^>]*>\s*self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g, (script, data) => {
  let value;
  try { value = JSON.parse(data); } catch { return script; }
  if (value[0] !== 1) return script;
  parts.push(value[1]);
  return '';
});

const joinedFlight = parts.join('');
const localizedFlight = localize(joinedFlight);

console.log('Testing flight parts parsing...');
// Next.js parses each flight line that starts with prefix:JSON
localizedFlight.split('\n').forEach((line, lineIdx) => {
  const match = line.match(/^([a-f0-9]+):(.*)$/i);
  if (match) {
    const id = match[1];
    const rest = match[2];
    if (rest.startsWith('["$') || rest.startsWith('{"') || rest.startsWith('[')) {
      try {
        JSON.parse(rest);
      } catch (err) {
        console.log(`JSON parse error at line ${lineIdx} (id ${id}): ${err.message}`);
        // Let's print around position 12681
        const pos = 12681;
        console.log('Snippet around 12681:');
        console.log(JSON.stringify(rest.slice(pos - 60, pos + 60)));
      }
    }
  }
});
