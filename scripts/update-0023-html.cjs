const fs = require('fs');

let f = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

// 1. Replace Intro Heading/Title if Bucher + Suter
f = f.replaceAll('Bucher + Suter', 'Seven Gate Holdings');

// 2. Replace Intro Prose
const oldIntroProse = f.substring(
  f.indexOf('<div class="prose"><p>Seven Gate Holdings helps enterprise'),
  f.indexOf('</div></span></div><div class="Intro_projectDetails__UWcsm">')
);

const newIntroProse = `<div class="prose"><p><strong>More Than a Website</strong></p><p>We approached the project with a focus on how the brand should be perceived from the very first interaction. From the visual direction to the structure of the website, every element was designed to communicate professionalism, establish trust, and give the business a stronger digital identity.</p>
<p>The result was a bespoke website built around the founder’s vision, creating a more compelling way to present the business and engage its audience online.</p>`;

f = f.replace(oldIntroProse, newIntroProse);

// 3. Replace Industry / Location
const oldDetails = f.substring(
  f.indexOf('<div class="Intro_left__d8bha"><span class="FadeIn_container__bjQVL" data-fill="false"><div><p class="Intro_smallHeading__gYXTn">Industry</p>'),
  f.indexOf('</span></div><div class="Intro_right__E3UWy">')
);

const newDetails = `<div class="Intro_left__d8bha"><span class="FadeIn_container__bjQVL" data-fill="false"><div style="white-space:nowrap;font-size:1.1rem;font-weight:500;letter-spacing:-0.01em;padding:12px 0"><p>Website Design &amp; Development · Brand Experience · Digital Strategy</p></div>`;

f = f.replace(oldDetails, newDetails);

// 4. Read Results / Impact / Quote HTML section
const resultsSection = fs.readFileSync('scripts/final_html_section.txt', 'utf8');

// 5. Replace everything inside ContentBuilder with our resultsSection!
const cbStart = f.indexOf('<section class="ContentBuilder_contentBuilder__FAKQG">') + '<section class="ContentBuilder_contentBuilder__FAKQG">'.length;
const cbEnd = f.indexOf('</section><section class="LargeCta_largeCta__ylf5C">');

console.log('cbStart:', cbStart, 'cbEnd:', cbEnd);
f = f.substring(0, cbStart) + resultsSection + f.substring(cbEnd);

fs.writeFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', f, 'utf8');
console.log('Successfully updated 00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html!');
