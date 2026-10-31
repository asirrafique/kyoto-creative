import fs from 'fs';
import { localize } from '../src/lib/localize.mjs';

const targetHtml = fs.readFileSync('scripts/target_html.txt', 'utf8');
const targetRsc = fs.readFileSync('scripts/adapted_rsc_snippet.txt', 'utf8');

// Let's test on the actual raw BS files
const bsHtml = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');
const bsRsc = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.rsc', 'utf8');

let locHtml = localize(bsHtml);
let locRsc = localize(bsRsc);

console.log('locHtml includes More Than a Website?:', locHtml.includes('More Than a Website'));
console.log('locRsc includes More Than a Website?:', locRsc.includes('More Than a Website'));

// HTML insertion anchor:
const htmlAnchor = 'online.</p>\n<p><!-- notionvc: 19156ade-2704-48fe-a4bf-218bc2407ac1 --></p>\n</div></span></div></div></section>';
const htmlAnchorCrlf = 'online.</p>\r\n<p><!-- notionvc: 19156ade-2704-48fe-a4bf-218bc2407ac1 --></p>\r\n</div></span></div></div></section>';

console.log('htmlAnchor in locHtml?:', locHtml.includes(htmlAnchor), 'crlf:', locHtml.includes(htmlAnchorCrlf));

// RSC insertion anchor:
const rscAnchor = 'online.</p>\\n<p><!-- notionvc: 19156ade-2704-48fe-a4bf-218bc2407ac1 --></p>\\n"}}]}]}],null]}]}]';
console.log('rscAnchor in locRsc?:', locRsc.includes(rscAnchor));

if (locRsc.includes(rscAnchor)) {
  const insertedRsc = locRsc.replace(rscAnchor, rscAnchor + ',' + targetRsc);
  console.log('Successfully inserted into RSC! Check syntax:');
  const anchorIdx = insertedRsc.indexOf(rscAnchor);
  console.log(insertedRsc.slice(anchorIdx + rscAnchor.length - 20, anchorIdx + rscAnchor.length + 120));
}
