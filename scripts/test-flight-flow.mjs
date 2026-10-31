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
console.log('contains 19156ade in localizedFlightOutput?:', localizedFlightOutput.includes('19156ade'));

const rscAnchor = 'online.</p>\\n<p><!-- notionvc: 19156ade-2704-48fe-a4bf-218bc2407ac1 --></p>\\n"}}]}]}],null]}]}]';
console.log('rscAnchor in localizedFlightOutput?:', localizedFlightOutput.includes(rscAnchor));
