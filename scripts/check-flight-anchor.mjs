import fs from 'fs';
import { localize } from '../src/lib/localize.mjs';
import { localizeFlight } from '../src/lib/reference.js';

const bsHtml = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

const parts = [];
bsHtml.replace(/<script[^>]*>\s*self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g, (script, data) => {
  let value;
  try { value = JSON.parse(data); } catch { return script; }
  if (value[0] !== 1) return script;
  parts.push(value[1]);
});
const joinedFlight = parts.join('');

const localizedFlightOutput = localizeFlight(joinedFlight, '/work/seven-gate-holdings');

const idx = localizedFlightOutput.indexOf('19156ade');
console.log('Snippet around 19156ade:');
console.log(JSON.stringify(localizedFlightOutput.slice(idx - 60, idx + 140)));
