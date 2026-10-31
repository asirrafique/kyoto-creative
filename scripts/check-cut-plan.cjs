const fs = require('fs');

let f = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

// 1. Replace the text after Intro:
// Find Intro prose
const pIntroProseStart = f.indexOf('<div class="prose"><p>Bucher + Suter helps');
const pIntroProseEnd = f.indexOf('</div></span></div><div class="Intro_projectDetails__UWcsm">');

const newIntroProse = `<div class="prose"><p>We approached the project with a focus on how the brand should be perceived from the very first interaction. From the visual direction to the structure of the website, every element was designed to communicate professionalism, establish trust, and give the business a stronger digital identity.</p>
<p>The result was a bespoke website built around the founder’s vision, creating a more compelling way to present the business and engage its audience online.</p>
</div></span></div><div class="Intro_projectDetails__UWcsm">`;

console.log('pIntroProseStart:', pIntroProseStart, 'pIntroProseEnd:', pIntroProseEnd);

// 2. Change Industry / Location
const tOld1 = `<p class="Intro_smallHeading__gYXTn">Industry</p><p>SaaS</p></div><div><p class="Intro_smallHeading__gYXTn">Location</p><p>London, UK</p>`;
const tNew1 = `<p class="Intro_smallHeading__gYXTn">Services</p><p>Website Design &amp; Development · Brand Experience · Digital Strategy</p>`;

// 3. Cut from after Intro / Link till LargeCta
const pCutStart = f.indexOf('</section><section class="StickyImageContent_stickyImageContent__hNfUv');
const pCutEnd = f.indexOf('<section class="LargeCta_largeCta__ylf5C">');

console.log('pCutStart:', pCutStart, 'pCutEnd:', pCutEnd);

// Read the target html section (Results, The Impact, Quote)
const htmlSection = fs.readFileSync('scripts/final_html_section.txt', 'utf8');

// Also update the client flight data in the script tags!
