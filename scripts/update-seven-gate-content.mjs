import fs from 'node:fs';

const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');

// 1. Hero Title
const oldHero = 'How Seven Gate Holdings found brand clarity through a new strategy with KOTA';
const newHero = 'A World-Class Digital Presence Built to Match the Vision';

// 2. Intro Prose
const oldIntroHtml = `<p>Seven Gate Holdings helps enterprise organisations get more from their contact centre platforms. They connect systems, improve performance and help CX teams make technology work harder for people, teams and customers.</p>
<p>The expertise was always there. The challenge was helping people see it faster.</p>
<p>B+S works in a category full of technical language, platform noise and plenty of AI chat. Their brand had depth, but the story had become harder to follow. The identity wasn’t always easy to apply consistently, and the website made visitors work a bit too hard to find the good stuff.</p>
<p>Before touching the logo, colours or website, we started with strategy.</p>`;

const oldIntroRsc = `<p>Seven Gate Holdings helps enterprise organisations get more from their contact centre platforms. They connect systems, improve performance and help CX teams make technology work harder for people, teams and customers.</p>\\n<p>The expertise was always there. The challenge was helping people see it faster.</p>\\n<p>B+S works in a category full of technical language, platform noise and plenty of AI chat. Their brand had depth, but the story had become harder to follow. The identity wasn’t always easy to apply consistently, and the website made visitors work a bit too hard to find the good stuff.</p>\\n<p>Before touching the logo, colours or website, we started with strategy.</p>`;

const newIntroHtml = `<h2>Bringing the Founder’s Vision to Life</h2>
<p>Seven Gate Holdings came to Kyoto Creative with a clear ambition: to build a world-class website that reflected the quality, credibility, and vision of the business. Our role was to translate that ambition into a refined digital experience, bringing together thoughtful design, clear messaging, and a polished user journey.</p>`;

const newIntroRsc = `<h2>Bringing the Founder’s Vision to Life</h2>\\n<p>Seven Gate Holdings came to Kyoto Creative with a clear ambition: to build a world-class website that reflected the quality, credibility, and vision of the business. Our role was to translate that ambition into a refined digital experience, bringing together thoughtful design, clear messaging, and a polished user journey.</p>`;

// 3. Project Details (Services)
const oldDetailsHtml = `<div class="Intro_projectDetails__UWcsm"><div class="Intro_left__d8bha"><span class="FadeIn_container__bjQVL" data-fill="false"><div><p class="Intro_smallHeading__gYXTn">Industry</p><p>SaaS</p></div><div><p class="Intro_smallHeading__gYXTn">Location</p><p>London, UK</p></div></span></div><div class="Intro_right__E3UWy"><span class="FadeIn_container__bjQVL" data-fill="false"></span></div></div>`;

const newDetailsHtml = `<div class="Intro_projectDetails__UWcsm" style="grid-column:8/span 4"><div class="Intro_left__d8bha" style="width:100%"><span class="FadeIn_container__bjQVL" data-fill="false"><div style="margin-bottom:0"><p class="Intro_smallHeading__gYXTn" style="font-weight:600;margin-bottom:0.75rem">Services &amp; Scope</p><ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.4rem"><li style="display:flex;align-items:center;gap:0.6rem;font-size:1.125rem;line-height:1.35"><span style="display:inline-block;width:5px;height:5px;border-radius:50%;background-color:currentColor;flex-shrink:0"></span><span>Website Design &amp; Development</span></li><li style="display:flex;align-items:center;gap:0.6rem;font-size:1.125rem;line-height:1.35"><span style="display:inline-block;width:5px;height:5px;border-radius:50%;background-color:currentColor;flex-shrink:0"></span><span>Brand Experience</span></li><li style="display:flex;align-items:center;gap:0.6rem;font-size:1.125rem;line-height:1.35"><span style="display:inline-block;width:5px;height:5px;border-radius:50%;background-color:currentColor;flex-shrink:0"></span><span>Digital Strategy</span></li></ul></div></span></div></div>`;

const oldDetailsRsc = `["$","div",null,{"className":"Intro_projectDetails__UWcsm","children":[["$","div",null,{"className":"Intro_left__d8bha","children":["$","$L1d",null,{"delay":0.15,"children":[["$","div",null,{"className":"$undefined","children":[["$","p",null,{"className":"Intro_smallHeading__gYXTn","children":"Industry"}],["$","p",null,{"children":"SaaS"}]]}],["$","div",null,{"className":"$undefined","children":[["$","p",null,{"className":"Intro_smallHeading__gYXTn","children":"Location"}],["$","p",null,{"children":"London, UK"}]]}]]}]}],["$","div",null,{"className":"Intro_right__E3UWy","children":["$","$L1d",null,{"delay":0.15,"children":null}]}]]}]`;

const newDetailsRsc = `["$","div",null,{"className":"Intro_projectDetails__UWcsm","style":{"gridColumn":"8/span 4"},"children":["$","div",null,{"className":"Intro_left__d8bha","style":{"width":"100%"},"children":["$","$L1d",null,{"delay":0.15,"children":["$","div",null,{"style":{"marginBottom":0},"children":[["$","p",null,{"className":"Intro_smallHeading__gYXTn","style":{"fontWeight":600,"marginBottom":"0.75rem"},"children":"Services & Scope"}],["$","ul",null,{"style":{"listStyle":"none","padding":0,"margin":0,"display":"flex","flexDirection":"column","gap":"0.4rem"},"children":[["$","li","0",{"style":{"display":"flex","alignItems":"center","gap":"0.6rem","fontSize":"1.125rem","lineHeight":1.35},"children":[["$","span",null,{"style":{"display":"inline-block","width":"5px","height":"5px","borderRadius":"50%","backgroundColor":"currentColor","flexShrink":0}}],["$","span",null,{"children":"Website Design & Development"}]]}],["$","li","1",{"style":{"display":"flex","alignItems":"center","gap":"0.6rem","fontSize":"1.125rem","lineHeight":1.35},"children":[["$","span",null,{"style":{"display":"inline-block","width":"5px","height":"5px","borderRadius":"50%","backgroundColor":"currentColor","flexShrink":0}}],["$","span",null,{"children":"Brand Experience"}]]}],["$","li","2",{"style":{"display":"flex","alignItems":"center","gap":"0.6rem","fontSize":"1.125rem","lineHeight":1.35},"children":[["$","span",null,{"style":{"display":"inline-block","width":"5px","height":"5px","borderRadius":"50%","backgroundColor":"currentColor","flexShrink":0}}],["$","span",null,{"children":"Digital Strategy"}]]}]]}]]}]}]}]}]`;

// 4. Strategy -> More Than a Website
const oldStratHtml = `<h2>The strategy</h2>
<p>We built the strategy around one clear idea: <em>Seven Gate Holdings makes the whole contact centre system perform as one, then keeps it performing over time.</em></p>
<p>That moved the story away from long lists of technical capabilities and towards the problems customers actually recognise: disconnected systems, underused platforms, stretched teams, complex environments and pressure to make AI genuinely useful.</p>
<p>Five strategic pillars became the foundation:</p>
<ul>
<li>Connect the whole contact centre system</li>
<li>Own performance beyond launch</li>
<li>Proven in complex environments</li>
<li>Make your platform investment pay off</li>
<li>Make AI work for people</li>
</ul>
<p>They gave the team a practical filter for every decision. If something didn’t make the value clearer or speak to the customer’s reality, it didn’t make the cut.</p>`;

const oldStratRsc = `<h2>The strategy</h2>\\n<p>We built the strategy around one clear idea: <em>Seven Gate Holdings makes the whole contact centre system perform as one, then keeps it performing over time.</em></p>\\n<p>That moved the story away from long lists of technical capabilities and towards the problems customers actually recognise: disconnected systems, underused platforms, stretched teams, complex environments and pressure to make AI genuinely useful.</p>\\n<p>Five strategic pillars became the foundation:</p>\\n<ul>\\n<li>Connect the whole contact centre system</li>\\n<li>Own performance beyond launch</li>\\n<li>Proven in complex environments</li>\\n<li>Make your platform investment pay off</li>\\n<li>Make AI work for people</li>\\n</ul>\\n<p>They gave the team a practical filter for every decision. If something didn’t make the value clearer or speak to the customer’s reality, it didn’t make the cut.</p>`;

const newStratHtml = `<h2>More Than a Website</h2>
<p>We approached the project with a focus on how the brand should be perceived from the very first interaction. From the visual direction to the structure of the website, every element was designed to communicate professionalism, establish trust, and give the business a stronger digital identity.</p>
<p>The result was a bespoke website built around the founder’s vision, creating a more compelling way to present the business and engage its audience online.</p>`;

const newStratRsc = `<h2>More Than a Website</h2>\\n<p>We approached the project with a focus on how the brand should be perceived from the very first interaction. From the visual direction to the structure of the website, every element was designed to communicate professionalism, establish trust, and give the business a stronger digital identity.</p>\\n<p>The result was a bespoke website built around the founder’s vision, creating a more compelling way to present the business and engage its audience online.</p>`;

const targetAnchor = `text = text.replaceAll('Bucher + Suter', 'Seven Gate Holdings');`;

const additions = `${targetAnchor}
  // Seven Gate Holdings hero and sections
  text = text.replaceAll(${JSON.stringify(oldHero)}, ${JSON.stringify(newHero)});
  text = text.replaceAll(${JSON.stringify(oldIntroHtml)}, ${JSON.stringify(newIntroHtml)});
  text = text.replaceAll(${JSON.stringify(oldIntroRsc)}, ${JSON.stringify(newIntroRsc)});
  text = text.replaceAll(${JSON.stringify(oldDetailsHtml)}, ${JSON.stringify(newDetailsHtml)});
  text = text.replaceAll(${JSON.stringify(oldDetailsRsc)}, ${JSON.stringify(newDetailsRsc)});
  text = text.replaceAll(${JSON.stringify(oldStratHtml)}, ${JSON.stringify(newStratHtml)});
  text = text.replaceAll(${JSON.stringify(oldStratRsc)}, ${JSON.stringify(newStratRsc)});`;

const updated = loc.replace(targetAnchor, additions);
fs.writeFileSync('src/lib/localize.mjs', updated, 'utf8');
console.log('Added Seven Gate Holdings content updates to localize.mjs');
