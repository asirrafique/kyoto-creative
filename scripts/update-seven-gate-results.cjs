const fs = require('fs');

const htmlPath = 'reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Stat cards updates:
// 800+ leads generated in the first 30 days. -> +40% Increase in website engagement
// <$1,000 in total advertising spend. -> +30% Increase in enquiry conversions
// $600k+ in property pipeline revenue. -> 92+ Google PageSpeed score

const oldCard1 = '<span class="Results_figure__t8hvp">800+</span><span class="Results_description__KhIC1">leads generated in the first 30 days.</span>';
const newCard1 = '<span class="Results_figure__t8hvp">+40%</span><span class="Results_description__KhIC1">Increase in website engagement</span>';

const oldCard2 = '<span class="Results_figure__t8hvp">&lt;$1,000</span><span class="Results_description__KhIC1">in total advertising spend.</span>';
const newCard2 = '<span class="Results_figure__t8hvp">+30%</span><span class="Results_description__KhIC1">Increase in enquiry conversions</span>';

const oldCard3 = '<span class="Results_figure__t8hvp">$600k+</span><span class="Results_description__KhIC1">in property pipeline revenue.</span>';
const newCard3 = '<span class="Results_figure__t8hvp">92+</span><span class="Results_description__KhIC1">Google PageSpeed score</span>';

console.log('Has oldCard1?', html.includes(oldCard1));
console.log('Has oldCard2?', html.includes(oldCard2));
console.log('Has oldCard3?', html.includes(oldCard3));

html = html.replace(oldCard1, newCard1);
html = html.replace(oldCard2, newCard2);
html = html.replace(oldCard3, newCard3);

// 2. The Impact section text update:
// From:
// <h2>The Impact</h2>
// <p>This project demonstrates Kyoto Creative's approach to combining creative execution with performance-driven marketing. By bringing together a newly developed website and targeted social media campaigns, we helped Green Square Infra establish its digital presence and generate a significant volume of property enquiries within its first month.</p>
// <p>The result was a measurable starting point for future marketing efforts, with a digital foundation in place to support continued campaign optimisation and growth.</p>
// To:
// <h2>The Impact</h2>
// <p>The result was a bespoke digital experience that brought Seven Gate Holdings&#x27; vision to life through premium design, thoughtful storytelling, and a polished user journey. Built to reflect the founder&#x27;s ambitions, the website gives the brand a stronger digital presence and a professional platform to showcase its business. For Kyoto Creative, this project demonstrates how the right combination of design, strategy, and development can transform a vision into a compelling online experience.</p>

const oldImpact = `<h2>The Impact</h2>
<p>This project demonstrates Kyoto Creative's approach to combining creative execution with performance-driven marketing. By bringing together a newly developed website and targeted social media campaigns, we helped Green Square Infra establish its digital presence and generate a significant volume of property enquiries within its first month.</p>
<p>The result was a measurable starting point for future marketing efforts, with a digital foundation in place to support continued campaign optimisation and growth.</p>`;

const newImpact = `<h2>The Impact</h2>
<p>The result was a bespoke digital experience that brought Seven Gate Holdings' vision to life through premium design, thoughtful storytelling, and a polished user journey. Built to reflect the founder's ambitions, the website gives the brand a stronger digital presence and a professional platform to showcase its business. For Kyoto Creative, this project demonstrates how the right combination of design, strategy, and development can transform a vision into a compelling online experience.</p>`;

console.log('Has oldImpact?', html.includes(oldImpact));
html = html.replace(oldImpact, newImpact);

// 3. Quote text update:
const oldQuote = '“Honestly, we weren\'t expecting results like this in the very first month. Generating over 800 leads in just 30 days with less than $1,000 in ad spend was genuinely impressive. Kyoto Creative understood what we wanted to achieve and brought our website and marketing together in a way that delivered results beyond our expectations. What stood out most was how efficiently they managed the budget while generating so much interest in our projects. We\'re really pleased with the work and excited about what we can achieve together moving forward.”';

const newQuote = '“Kyoto Creative really understood the vision I had for our website and translated it into something beyond what I had imagined. The design feels premium, the experience is polished, and the overall presentation reflects the standard we wanted for Seven Gate Holdings. I was particularly impressed by their ability to understand what we wanted as a brand and bring it to life digitally. The team made the entire process straightforward, and we\'re proud of the final result.”';

console.log('Has oldQuote?', html.includes(oldQuote));
html = html.replace(oldQuote, newQuote);

// 4. Quote attribution:
// Gunajit Dutta -> Ankur Sharma
// Founder - Green Square Infra -> CEO, Seven Gate Holdings
const oldAttribution = '<p class="Quote_attributionName__ABzkp">Gunajit Dutta</p><p class="Quote_attributionByline__d9bMk">Founder - Green Square Infra</p>';
const newAttribution = '<p class="Quote_attributionName__ABzkp">Ankur Sharma</p><p class="Quote_attributionByline__d9bMk">CEO, Seven Gate Holdings</p>';

console.log('Has oldAttribution?', html.includes(oldAttribution));
html = html.replace(oldAttribution, newAttribution);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Updated Seven Gate HTML successfully!');
