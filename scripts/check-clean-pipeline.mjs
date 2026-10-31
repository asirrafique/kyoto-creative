import fs from 'fs';
import { localize } from '../src/lib/localize.mjs';

const htmlSection = fs.readFileSync('scripts/final_html_section.txt', 'utf8');
const htmlFlightSection = fs.readFileSync('scripts/final_html_flight_section.txt', 'utf8');
const rscFlightSection = fs.readFileSync('scripts/final_rsc_flight_section.txt', 'utf8');

const bsHtml = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');
const bsRsc = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.rsc', 'utf8');

// Extract parts
const parts = [];
const placeholder = '<!--replica-flight-stream-->';
let first = true;
let html = bsHtml.replace(/<script[^>]*>\s*self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g, (script, data) => {
  let value;
  try { value = JSON.parse(data); } catch { return script; }
  if (value[0] !== 1) return script;
  parts.push(value[1]);
  const result = first ? placeholder : '';
  first = false;
  return result;
});

html = localize(html);
let flightText = localize(parts.join(''));

console.log('html contains htmlAnchorCrlf?:', html.includes('online.</p>\r\n<p><!-- notionvc: 19156ade-2704-48fe-a4bf-218bc2407ac1 --></p>\r\n</div></span></div></div></section>'));
console.log('flightText contains rscFlightAnchor?:', flightText.includes('ness and engage its audience online.</p>\\n<p><!-- notionvc: 19156ade-2704-48fe-a4bf-218bc2407ac1 --></p>\\n"}}]}]}],null]}]}]'));

let rscText = localize(bsRsc);
console.log('rscText contains rscFlightAnchor?:', rscText.includes('ness and engage its audience online.</p>\\n<p><!-- notionvc: 19156ade-2704-48fe-a4bf-218bc2407ac1 --></p>\\n"}}]}]}],null]}]}]'));
