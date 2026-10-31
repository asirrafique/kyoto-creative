const fs = require('fs');

let f = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

// 1. Move push 35 before push e in HTML
const p35Idx = f.indexOf('35:I[57372');
const peIdx = f.indexOf('e:[[[');

if (p35Idx > peIdx) {
  const p35ScriptStart = f.lastIndexOf('<script', p35Idx);
  const p35ScriptEnd = f.indexOf('</script>', p35Idx) + 9;
  const p35Script = f.slice(p35ScriptStart, p35ScriptEnd);
  
  // remove p35Script
  f = f.slice(0, p35ScriptStart) + f.slice(p35ScriptEnd);
  // insert before peScript
  const peScriptStart = f.lastIndexOf('<script', peIdx);
  f = f.slice(0, peScriptStart) + p35Script + f.slice(peScriptStart);
  console.log('Reordered push 35 before push e!');
}

// 2. Also in .rsc file, check if 27:I[57372 is after 2:[[[
let rsc = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.rsc', 'utf8');
const rsc27Idx = rsc.indexOf('27:I[57372');
const rsc2Idx = rsc.indexOf('2:[[[');
if (rsc27Idx > rsc2Idx) {
  const rsc27LineStart = rsc.lastIndexOf('\n', rsc27Idx) + 1;
  const rsc27LineEnd = rsc.indexOf('\n', rsc27Idx) + 1;
  const line27 = rsc.slice(rsc27LineStart, rsc27LineEnd);
  rsc = rsc.slice(0, rsc27LineStart) + rsc.slice(rsc27LineEnd);
  const rsc2LineStart = rsc.lastIndexOf('\n', rsc2Idx) + 1;
  rsc = rsc.slice(0, rsc2LineStart) + line27 + rsc.slice(rsc2LineStart);
  console.log('Reordered 27:I[57372 before 2:[[[ in .rsc!');
}

// 3. In HTML, update content to Green Square Infra:
f = f.replaceAll('UPP - KOTA', 'Green Square Infra - Kyoto Creative');
f = f.replaceAll('A cinematic web experience for a Hollywood powerhouse.', 'Turning Digital Marketing into a Lead Generation Engine');

// Intro
const oldIntro = `<h2>Introduction</h2>
<p>Universal Production Partners (UPP) is the VFX powerhouse behind some of Hollywood’s most visually stunning blockbusters, including <em>Barbie (2023)</em>, <em>Blade Runner 2049 (2017)</em>, and <em>Conclave (2024)</em>.</p>
<p>Their work pushes the boundaries of digital effects, crafting immersive, otherworldly visuals that elevate modern cinema.</p>`;

const newIntro = `<h2>Introduction</h2>
<p>Green Square Infra is an innovative infrastructure and property development firm delivering high-value residential and commercial assets.</p>
<p>Kyoto Creative partnered with Green Square Infra to design a high-converting digital presence and performance-driven marketing strategy that turns online engagement into qualified property buyers.</p>`;
f = f.replace(oldIntro, newIntro);

// Results stat cards
const oldStat1 = `<span class="Results_figure__t8hvp">+44.8%</span><span class="Results_description__KhIC1"> increase in sessions from Google.</span>`;
const newStat1 = `<span class="Results_figure__t8hvp">800+</span><span class="Results_description__KhIC1">leads generated in the first 30 days.</span>`;

const oldStat2 = `<span class="Results_figure__t8hvp">+101.4%</span><span class="Results_description__KhIC1">increase in users from referrals.</span>`;
const newStat2 = `<span class="Results_figure__t8hvp">&lt;$1,000</span><span class="Results_description__KhIC1">in total advertising spend.</span>`;

const oldStat3 = `<span class="Results_figure__t8hvp">+150.6%</span><span class="Results_description__KhIC1">increase in user stickiness.</span>`;
const newStat3 = `<span class="Results_figure__t8hvp">$600k+</span><span class="Results_description__KhIC1">in property pipeline revenue.</span>`;

f = f.replace(oldStat1, newStat1);
f = f.replace(oldStat2, newStat2);
f = f.replace(oldStat3, newStat3);

// The Impact
const oldImpact = `<h3>The future of web as an experience</h3>
<p>This project redefines what a website can be. UPP’s site is not just a portfolio—it’s a statement. As the web continues to evolve into a more interactive, experiential space, brands have the opportunity to captivate users in ways that go beyond traditional web design.</p>
<p>For UPP, it was about creating a digital experience worthy of the cinematic masterpieces they help bring to life.</p>`;

const newImpact = `<h2>The Impact</h2>
<p>This project demonstrates Kyoto Creative's approach to combining creative execution with performance-driven marketing. By bringing together a newly developed website and targeted social media campaigns, we helped Green Square Infra establish its digital presence and generate a significant volume of property enquiries within its first month.</p>
<p>The result was a measurable starting point for future marketing efforts, with a digital foundation in place to support continued campaign optimisation and growth.</p>`;
f = f.replace(oldImpact, newImpact);

// Quote
const oldQuote = `From the very first conversations, James, KOTA’s Creative Director, understood our vision. He didn’t just meet the brief—he transformed it. The concept he delivered was beyond what we had imagined: a bold, elegant experience that positions UPP at the leading edge of both design and digital storytelling. It’s no exaggeration to say the final product redefines what a website can be. We’ve even adopted a new line in talking about it: “It’s not a website, it’s an experience.&quot;`;
const newQuote = `“Honestly, we weren't expecting results like this in the very first month. Generating over 800 leads in just 30 days with less than $1,000 in ad spend was genuinely impressive. Kyoto Creative understood what we wanted to achieve and brought our website and marketing together in a way that delivered results beyond our expectations. What stood out most was how efficiently they managed the budget while generating so much interest in our projects. We're really pleased with the work and excited about what we can achieve together moving forward.”`;
f = f.replace(oldQuote, newQuote.replaceAll('"', '&quot;'));

// Attribution
const oldAttr = '<p class="Quote_attributionName__ABzkp">Shaun Obanion</p><p class="Quote_attributionByline__d9bMk">Social Media and PR Manager of Universal Production Partners</p>';
const newAttr = '<p class="Quote_attributionName__ABzkp">Gunajit Dutta</p><p class="Quote_attributionByline__d9bMk">Founder - Green Square Infra</p>';
f = f.replace(oldAttr, newAttr);

// Save to green_square_infra_project_page.html and .rsc
fs.writeFileSync('reference/pages/green_square_infra_project_page.html', f, 'utf8');
fs.writeFileSync('reference/pages/green_square_infra_project_page.rsc', rsc, 'utf8');
console.log('Saved green_square_infra_project_page.html and .rsc based on pristine UPP layout!');
