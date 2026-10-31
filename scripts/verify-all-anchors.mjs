import fs from 'fs';
import { localize } from '../src/lib/localize.mjs';

const htmlSection = fs.readFileSync('scripts/final_html_section.txt', 'utf8');
const htmlFlightSection = fs.readFileSync('scripts/final_html_flight_section.txt', 'utf8');
const rscFlightSection = fs.readFileSync('scripts/final_rsc_flight_section.txt', 'utf8');

// The HTML anchor:
// In localize.mjs, after More Than a Website was replaced:
const htmlAnchor = 'online.</p>\n<p><!-- notionvc: 19156ade-2704-48fe-a4bf-218bc2407ac1 --></p>\n</div></span></div></div></section>';
const htmlAnchorCrlf = 'online.</p>\r\n<p><!-- notionvc: 19156ade-2704-48fe-a4bf-218bc2407ac1 --></p>\r\n</div></span></div></div></section>';

// In HTML Flight (inside <script>self.__next_f.push):
// ...ness and engage its audience online.</p>\n<p><!-- notionvc: 19156ade-2704-48fe-a4bf-218bc2407ac1 --></p>\n"}}]}]}],null]}]}
const htmlFlightAnchor = 'ness and engage its audience online.</p>\\n<p><!-- notionvc: 19156ade-2704-48fe-a4bf-218bc2407ac1 --></p>\\n"}}]}]}],null]}]}';

// In raw RSC:
const rscFlightAnchor = 'ness and engage its audience online.</p>\\n<p><!-- notionvc: 19156ade-2704-48fe-a4bf-218bc2407ac1 --></p>\\n"}}]}]}],null]}]}]';

console.log('Testing anchors on raw files...');
const bsHtml = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');
const bsRsc = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.rsc', 'utf8');

let testHtml = localize(bsHtml);
let testRsc = localize(bsRsc);

console.log('htmlAnchor in testHtml?:', testHtml.includes(htmlAnchorCrlf));
console.log('htmlFlightAnchor in testHtml?:', testHtml.includes(htmlFlightAnchor));
console.log('rscFlightAnchor in testRsc?:', testRsc.includes(rscFlightAnchor));
