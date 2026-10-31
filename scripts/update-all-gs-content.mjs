import fs from 'node:fs';

const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');

const targetAnchor = `text = text.replaceAll('A cinematic web\\r\\nexperience for a Hollywood\\r\\npowerhouse.', 'Turning Digital Marketing into a Lead Generation Engine');`;

// Stat 1: +44.8% increase in sessions from Google. -> 800+ leads
const oldStat1Html = `<span class="Results_figure__t8hvp">+44.8%</span><span class="Results_description__KhIC1"> increase in sessions from Google.</span>`;
const newStat1Html = `<span class="Results_figure__t8hvp">800+</span><span class="Results_description__KhIC1">leads generated in the first 30 days.</span>`;

// Stat 2: +101.4% increase in users from referrals. -> $1,000 in advertising spend
const oldStat2Html = `<span class="Results_figure__t8hvp">+101.4%</span><span class="Results_description__KhIC1">increase in users from referrals.</span>`;
const newStat2Html = `<span class="Results_figure__t8hvp">&lt;$1,000</span><span class="Results_description__KhIC1">in total advertising spend.</span>`;

// Stat 3: +150.6% increase in user stickiness. -> $600,000 in revenue
const oldStat3Html = `<span class="Results_figure__t8hvp">+150.6%</span><span class="Results_description__KhIC1">increase in user stickiness.</span>`;
const newStat3Html = `<span class="Results_figure__t8hvp">$600k+</span><span class="Results_description__KhIC1">in property pipeline revenue.</span>`;

// The future of web as an experience -> The Impact
const oldImpactHtml = `<h3>The future of web as an experience</h3>
<p>This project redefines what a website can be. UPP’s site is not just a portfolio—it’s a statement. As the web continues to evolve into a more interactive, experiential space, brands have the opportunity to captivate users in ways that go beyond traditional web design.</p>
<p>For UPP, it was about creating a digital experience worthy of the cinematic masterpieces they help bring to life.</p>`;

const oldImpactRsc = `<h3>The future of web as an experience</h3>\\n<p>This project redefines what a website can be. UPP’s site is not just a portfolio—it’s a statement. As the web continues to evolve into a more interactive, experiential space, brands have the opportunity to captivate users in ways that go beyond traditional web design.</p>\\n<p>For UPP, it was about creating a digital experience worthy of the cinematic masterpieces they help bring to life.</p>`;

const newImpactHtml = `<h2>The Impact</h2>
<p>This project demonstrates Kyoto Creative's approach to combining creative execution with performance-driven marketing. By bringing together a newly developed website and targeted social media campaigns, we helped Green Square Infra establish its digital presence and generate a significant volume of property enquiries within its first month.</p>
<p>The result was a measurable starting point for future marketing efforts, with a digital foundation in place to support continued campaign optimisation and growth.</p>`;

const newImpactRsc = `<h2>The Impact</h2>\\n<p>This project demonstrates Kyoto Creative's approach to combining creative execution with performance-driven marketing. By bringing together a newly developed website and targeted social media campaigns, we helped Green Square Infra establish its digital presence and generate a significant volume of property enquiries within its first month.</p>\\n<p>The result was a measurable starting point for future marketing efforts, with a digital foundation in place to support continued campaign optimisation and growth.</p>`;

// Quote
const oldQuoteTextHtml = `From the very first conversations, James, KOTA’s Creative Director, understood our vision. He didn’t just meet the brief—he transformed it. The concept he delivered was beyond what we had imagined: a bold, elegant experience that positions UPP at the leading edge of both design and digital storytelling. It’s no exaggeration to say the final product redefines what a website can be. We’ve even adopted a new line in talking about it: “It’s not a website, it’s an experience.&quot;`;
const oldQuoteTextRsc = `From the very first conversations, James, KOTA’s Creative Director, understood our vision. He didn’t just meet the brief—he transformed it. The concept he delivered was beyond what we had imagined: a bold, elegant experience that positions UPP at the leading edge of both design and digital storytelling. It’s no exaggeration to say the final product redefines what a website can be. We’ve even adopted a new line in talking about it: “It’s not a website, it’s an experience.\\"`;

const newQuoteText = `“Honestly, we weren't expecting results like this in the very first month. Generating over 800 leads in just 30 days with less than $1,000 in ad spend was genuinely impressive. Kyoto Creative understood what we wanted to achieve and brought our website and marketing together in a way that delivered results beyond our expectations. What stood out most was how efficiently they managed the budget while generating so much interest in our projects. We're really pleased with the work and excited about what we can achieve together moving forward.”`;

const additions = `${targetAnchor}
  // Stats
  text = text.replaceAll(${JSON.stringify(oldStat1Html)}, ${JSON.stringify(newStat1Html)});
  text = text.replaceAll(${JSON.stringify(oldStat2Html)}, ${JSON.stringify(newStat2Html)});
  text = text.replaceAll(${JSON.stringify(oldStat3Html)}, ${JSON.stringify(newStat3Html)});
  text = text.replaceAll('"children":"+44.8%"', '"children":"800+"');
  text = text.replaceAll('"children":" increase in sessions from Google."', '"children":"leads generated in the first 30 days."');
  text = text.replaceAll('"children":"+101.4%"', '"children":"<$1,000"');
  text = text.replaceAll('"children":"increase in users from referrals."', '"children":"in total advertising spend."');
  text = text.replaceAll('"children":"+150.6%"', '"children":"$600k+"');
  text = text.replaceAll('"children":"increase in user stickiness."', '"children":"in property pipeline revenue."');

  // The Impact
  text = text.replaceAll(${JSON.stringify(oldImpactHtml)}, ${JSON.stringify(newImpactHtml)});
  text = text.replaceAll(${JSON.stringify(oldImpactRsc)}, ${JSON.stringify(newImpactRsc)});

  // Quote
  text = text.replaceAll(${JSON.stringify(oldQuoteTextHtml)}, ${JSON.stringify(newQuoteText.replaceAll('"', '&quot;'))});
  text = text.replaceAll(${JSON.stringify(oldQuoteTextRsc)}, ${JSON.stringify(newQuoteText.replaceAll('"', '\\"'))});

  // Author & Attribution
  text = text.replaceAll('<p class="Quote_attributionName__ABzkp">Shaun Obanion</p><p class="Quote_attributionByline__d9bMk">Social Media and PR Manager of Universal Production Partners</p>', '<p class="Quote_attributionName__ABzkp">Gunajit Dutta</p><p class="Quote_attributionByline__d9bMk">Founder - Green Square Infra</p>');
  text = text.replaceAll('"children":"Shaun Obanion"}],["$","p",null,{"className":"Quote_attributionByline__d9bMk","children":"Social Media and PR Manager of Universal Production Partners"', '"children":"Gunajit Dutta"}],["$","p",null,{"className":"Quote_attributionByline__d9bMk","children":"Founder - Green Square Infra"');
`;

const updated = loc.replace(targetAnchor, additions);
fs.writeFileSync('src/lib/localize.mjs', updated, 'utf8');
console.log('Successfully updated stats, impact, quote and author in localize.mjs');
