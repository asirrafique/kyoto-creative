import { optimizeBackgroundRuntime } from './runtime-performance.mjs';
const hosts = new Set(['kota.co.uk', 'content.kota.co.uk', 'kota-content.b-cdn.net', 'prod.spline.design', 'unpkg.com']);
const serviceRouteReplacements = [
  ['/service/brand-strategy-and-identity', '/service/marketing'],
  ['/service/web-design-development', '/service/web-app'],
  ['/service/brand-strategy', '/service/brand-strategy-positioning'],
  ['/service/brand-identity-design', '/service/content-campaigns-pr'],
  ['/service/tone-of-voice', '/service/paid-media-performance'],
  ['/service/creative-web-design', '/service/website-design-development'],
  ['/service/web-development', '/service/product-design-ux'],
  ['/service/wordpress-cms', '/service/app-design-development'],
  ['/service/seo-geo', '/service/autonomous-ai-agents-copilots'],
  ['/service/copywriting', '/service/workflow-orchestration-api-integration'],
  ['/service/sitecare', '/service/intelligent-document-data-processing'],
];
const serviceNavigationReplacements = [
  ['brand-strategy-and-identity', 'Marketing & Branding', 'marketing', 'Marketing'],
  ['brand-strategy-and-identity', 'Brand strategy & identity', 'marketing', 'Marketing'],
  ['web-design-development', 'Web design & development', 'web-app', 'Web & App'],
  ['web-design-development', 'Website & App Development', 'web-app', 'Web & App'],
  ['brand-strategy', 'Brand strategy', 'brand-strategy-positioning', 'Brand Strategy & Positioning'],
  ['brand-identity-design', 'Brand identity design', 'content-campaigns-pr', 'Content Campaigns & PR'],
  ['tone-of-voice', 'Tone of voice', 'paid-media-performance', 'Paid Media & Performance'],
  ['creative-web-design', 'Creative web design', 'website-design-development', 'Website Design & Development'],
  ['web-development', 'Web development', 'product-design-ux', 'Product Design & UX'],
  ['wordpress-cms', 'WordPress & CMS', 'app-design-development', 'App Design & Development'],
  ['seo-geo', 'SEO & GEO', 'autonomous-ai-agents-copilots', 'Autonomous AI Agents & Copilots'],
  ['copywriting', 'Copywriting', 'workflow-orchestration-api-integration', 'Workflow Orchestration & API Integration'],
  ['sitecare', 'SiteCare', 'intelligent-document-data-processing', 'Intelligent Document & Data Processing'],
];

function replaceServiceRoute(text, oldRoute, newRoute) {
  const escapedRoute = oldRoute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`${escapedRoute}(?=$|[/\\?#"'\\\\\\s])`, 'g'), newRoute);
}

export function localize(text) {
  text = optimizeBackgroundRuntime(text);
  // Keep SSR, Flight and client JSX in agreement. Autoplay overrides preload=none
  // and was downloading distant project videos before the hero was ready.
  text = text.replaceAll('autoPlay:!0,muted:!0,loop:!0,preload:"none"', 'autoPlay:!1,muted:!0,loop:!0,preload:"none"');
  text = text.replaceAll('"autoPlay":true,"muted":true,"loop":true,"preload":"none"', '"autoPlay":false,"muted":true,"loop":true,"preload":"none"');
  text = text.replace(/<video\b[^>]*>/gi, tag => /preload="none"/.test(tag) && /\bloop(?:=|\s|>)/.test(tag)
    ? tag.replace(/\sautoplay(?:="[^"]*")?/i, '') : tag);
  // Apply the same substitutions to server HTML, Flight data, and client modules.
  // Matching all three is essential to avoid React hydration mismatches.
  for (const host of hosts) {
    if (host !== 'kota.co.uk') text = text.replaceAll('https://' + host, '/__assets/' + host);
  }
  text = text.replaceAll('https://www.googletagmanager.com', '/__analytics');
  text = text.replaceAll('https://static.hotjar.com', '/__analytics');
  text = text.replaceAll('https://kota.co.uk/', '/');
  text = text.replaceAll('© KOTA', '© Kyoto Creative');
  text = text.replaceAll('KOTA’s', "Kyoto Creative's");
  text = text.replaceAll("KOTA's", "Kyoto Creative's");
  text = text.replaceAll('About KOTA', 'About Kyoto Creative');
  text = text.replaceAll('KOTA Agency', 'Kyoto Creative Agency');
  text = text.replaceAll('KOTA creative', 'Kyoto Creative');
  text = text.replaceAll('KOTA Creative', 'Kyoto Creative');
  text = text.replaceAll('KOTAverse', 'Kyotoverse');
  text = text.replaceAll('\\u003eKOTA', '\\u003eKyoto Creative');
  text = text.replaceAll('&gt;KOTA', '&gt;Kyoto Creative');
  text = text.replaceAll('>KOTA', '>Kyoto Creative');
  text = text.replace(/(?<![a-zA-Z0-9_/@\.\-])KOTA(?![a-zA-Z0-9_\-])(?!\.(?:png|jpe?g|webp|svg|gif|mp4|webm|co\.uk))/g, 'Kyoto Creative');
  text = text.replaceAll("I'm happy to receive a monthly newsletter from KOTA", "I'm happy to receive a monthly newsletter from Kyoto Creative");
  text = text.replaceAll('I understand that KOTA will securely hold my data in accordance with their privacy policy.', 'I understand that Kyoto Creative will securely hold my data in accordance with their privacy policy.');
  text = text.replaceAll('On-going support', 'AI Automations');
  text = text.replaceAll('>Development</span>', '>App Development</span>');
  text = text.replaceAll('children:"Development"', 'children:"App Development"');
  text = text.replace(/Keep the momentum(?: <em>| \\u003cem\\u003e)going\.(?:<\/em>|\\u003c\/em\\u003e)\s*/g, "<span style='font-size:.9em'>Put repetitive work on autopilot. Keep momentum <em>going.</em></span>");
  text = text.replaceAll('Growth built around your brand.', 'Automation engineered around your actual workflows.');
  text = text.replaceAll('SEO & GEO.', 'Autonomous AI Agents & Copilots');
  text = text.replaceAll('Copywriting.', 'Workflow Orchestration & API Integration');
  text = text.replaceAll('SiteCare (our growth retainer).', 'Intelligent Document & Data Processing (IDP)');
  text = text.replaceAll('A website needs care after launch. Our SiteCare growth retainer keeps your site secure, stable and performing properly, with ongoing technical support, updates, monitoring and improvements handled by the team who know it best.', 'Stop paying knowledge workers to extract unstructured data. We deploy vision and language models to read PDFs, invoices, contracts, and receipts—validating and structuring the output directly into your operational databases.');
  text = text.replaceAll('Our growth marketing process.', 'Our AI Automation Process');
  text = text.replaceAll('Growth marketing works best when it is consistent, focused and connected to the website underneath it. We look at where your digital presence is today, what your audience needs next and how your content, search visibility and website performance can work harder together.', 'Automations fail when deployed haphazardly onto fractured processes. Our process is structured, deliberate, and engineered to solve root bottlenecks before writing a line of code.');
  text = text.replaceAll('Search is changing fast. We help brands improve visibility across AI search, LLMs and generative engine results through structured content, stronger authority signals, technical foundations and ongoing optimisation.', 'Siloed data slows down teams. We connect disparate legacy systems, CRMs, ERPs, and cloud apps into bi-directional, event-driven pipelines that eliminate double data entry and human handoff delays.');
  text = text.replaceAll('We write the words that make the work land. From content audits and strategy to ongoing copywriting support, we help brands explain themselves properly, make a stronger case and show up with something worth saying.', 'Static rules break easily. We engineer task-specific LLM agents with deterministic guardrails to autonomously handle customer inquiries, triage inbound leads, run research workflows, and generate draft deliverables.');
  text = text.replace(/A strong brand and website gives you the platform\. Growth marketing helps it keep earning attention\. We provide packages that connect visibility, content and ongoing website support\. From SEO and GEO to copywriting and technical support, we help your brand stay active, findable and ready for what’s next\./g, 'Off-the-shelf software gives your team tools, but AI automations make them work for you. We build end-to-end operational pipelines that connect your CRM, databases, communication channels, and internal software. From autonomous AI agents to real-time syncs and automated document extraction, we ensure your operations run seamlessly in the background.');
  text = text.replaceAll('Launch day is just the beginning. We help ambitious brands stay visible, useful and competitive after websites go live, with ongoing support across AI search, SEO, content and website performance.', 'We help ambitious companies eliminate manual bottlenecks, deploy autonomous agents, and scale operational capacity without bloating headcount—connecting your tech stack with reliable, intelligent workflows.');
  text = text.replaceAll('We bring brand, UX, SEO, content and development together from day one, combining creative ambition with strategic thinking and technical excellence. The result is a digital experience that feels distinctive, works intuitively and delivers measurable impact long after launch.', 'We bring strategy, design, and development together from day one. The result is a website or app that feels distinctive, works effortlessly, and keeps delivering long after launch.');
  text = text.replaceAll('+44(0)20 3951 0562', '+91 7031853012');
  text = text.replaceAll('+44 (0)20 3951 0562', '+91 7031853012');
  text = text.replaceAll('href=\"tel:business@kyotocreative.com\"', 'href=\"tel:+917031853012\"');
  text = text.replaceAll('\"href\":\"tel:business@kyotocreative.com\"', '\"href\":\"tel:+917031853012\"');
  text = text.replaceAll('/__assets/kota-content.b-cdn.net/app/uploads/2025/04/Wogan-Logo-White.svg', '/images/green-square-logo.png');
  text = text.replaceAll('https://kota-content.b-cdn.net/app/uploads/2025/04/Wogan-Logo-White.svg', '/images/green-square-logo.png');
  text = text.replaceAll('67.6%', '43,000');
  text = text.replaceAll('rise in engaged sessions per user after 1 month.', 'Website Visits in 3 Months');
  text = text.replaceAll('rise in engaged sessions per user after 1 month', 'Website Visits in 3 Months');
  text = text.replaceAll('/__assets/kota-content.b-cdn.net/app/uploads/2025/04/Pison-Logo-White.svg', '/images/interact-financial-logo.png');
  text = text.replaceAll('https://kota-content.b-cdn.net/app/uploads/2025/04/Pison-Logo-White.svg', '/images/interact-financial-logo.png');
  text = text.replaceAll('70.8%', '+40%');
  text = text.replaceAll('increase in average engagement time after 3 months.', 'Increase in website engagement');
  text = text.replaceAll('increase in average engagement time after 3 months', 'Increase in website engagement');
  text = text.replaceAll('/__assets/kota-content.b-cdn.net/app/uploads/2025/04/DKA-Logo-White.svg', '/images/sevengate-logo.png');
  text = text.replaceAll('https://kota-content.b-cdn.net/app/uploads/2025/04/DKA-Logo-White.svg', '/images/sevengate-logo.png');
  text = text.replaceAll('83.14%', '800+');
  text = text.replaceAll('increase in sales after 1 year.', 'leads generated in the first 30 days.');
  text = text.replaceAll('increase in sales after 1 year', 'leads generated in the first 30 days.');
  text = text.replaceAll('/images/green-square-logo.png', '/images/green-square-logo.png');
  text = text.replace(/<li><a href="\/culture\/?">Culture<\/a><\/li>/g, '');
  text = text.replace(/,\["\$","li",null,\{"children":\["\$","[^"]*",null,\{"href":"\/culture\/?","children":"Culture"\}\]\}\]/g, '');
  text = text.replace(/,\\\[\\"\\\$\\",\\"li\\",null,\\{\\"children\\":\\\[\\"\\\$\\",\\"[^\"]*\\",null,\\{\\"href\\":\\"\/culture\/?\\",\\"children\\":\\"Culture\\"\\\}\\\]\\\}\\\]/g, '');
  text = text.replaceAll('Websites that do more.', 'Digital experiences that do more.');
  text = text.replaceAll('Making brands a damn site better.', 'From bold marketing campaigns to powerful tech solutions.');
  text = text.replaceAll('Dive into our projects and the decisions that shaped them.', 'Explore the work we build to help businesses grow.');
  text = text.replaceAll('Creative web design and development, combining brand clarity, craft and commercial momentum to create distinctive digital experiences that help ambitious brands grow.', 'We design and build world class websites and apps that look sharp, feel intuitive, and drive real business results — not just digital decoration.');
  text = text.replaceAll('Creative web design.', 'Website Design & Development');
  text = text.replaceAll('Web development.', 'Product Design & UX');
  text = text.replaceAll('Wordpress & CMS.', 'App Design & Development');
  text = text.replace(/Translate your brand into a digital experience with its own rhythm, personality and point of view\. Creative thinking\s+and intuitive UX come together to create experiences that feel effortless to use and impossible to confuse with anyone else\./g, 'We design and build fast, conversion-focused websites that reflect your brand and turn visitors into customers. Clean design, solid performance, and systems your team can actually manage.');
  text = text.replace(/We build fast, flexible websites that deliver on the creative idea, rather than compromising it\. Clean code, thoughtful interactions and robust technical foundations keep everything running beautifully behind the scenes\./g, 'From concept to launch, we design and develop apps that are simple to use and built for real user behaviour. Mobile-first thinking, clear flows, and technical foundations that scale.');
  text = text.replace(/Your team shouldn’t need a developer every time a sentence changes\. We create flexible, modular content systems that make pages easy to build, edit and evolve without letting the design descend into chaos\./g, 'Before a single screen is designed, we map the experience. User flows, information architecture, and interaction design — so your website or app feels effortless instead of complicated.');
  text = text.replaceAll('Our web design and development process.', 'Our design & development process');
  text = text.replaceAll('Every project is different, but the thinking stays joined up. We move from discovery and digital strategy through UX, creative design and development without losing the thread (or the big idea) along the way.', 'Every project is different, but the thinking stays connected. We move from clarity to craft without losing the plot along the way.');
  text = text.replaceAll('Welcome to \\u003cbr /\\u003e\\\\r\\\\nthe \\u003cem\\u003edigital\\u003c/em\\u003e\\u003cbr /\\u003e\\\\r\\\\nrenaissance.', 'Digital products that perform.');
  text = text.replace(/Welcome to <br\s*\/>(?:\\r?\\n|\s)*the <em>digital<\/em><br\s*\/>(?:\\r?\\n|\s)*renaissance\./g, 'Digital products that perform.');
  text = text.replaceAll('Welcome to the digital renaissance.', 'Digital products that perform.');
  text = text.replaceAll('Introducing the Brand Pulse Audit tool. See where your brand’s thriving—and where it needs a little CPR.', 'We plan and run paid advertising that stays rooted in your brand strategy. Creative, messaging, and targeting work together — so your spend actually drives results instead of noise.');
  text = text.replaceAll('Audit your brand in minutes', 'Paid Media & Performance');
  text = text.replaceAll('In a world overrun by AI-sameness, a unique brand voice is more important than ever. We’ll help you sound unmistakably like you, with a voice your team can write from confidently.', 'From campaign ideas to content systems and PR angles, we help you show up with clarity and presence. The goal isn’t just visibility — it’s the right kind of attention.');
  text = text.replaceAll('Tone of voice.', 'Paid Media & Performance');
  text = text.replaceAll('Everything earns its place. We create brand identity systems with intent behind every decision, built to be recognisable, flexible, and credible wherever you show up.', 'We build the visual system and creative assets that make your brand recognisable and consistent — across your website, ads, content, and campaigns.');
  text = text.replaceAll('Brand identity design.', 'Content Campaigns & PR');
  text = text.replaceAll('Strong brands start with clear decisions. We find what makes your brand worth choosing, then turn it into positioning, messaging and strategic direction your team can actually use.', 'We define what makes your business worth choosing — then turn it into clear positioning and messaging your marketing, sales, and content can all run on.');
  text = text.replaceAll('Brand strategy.', 'Brand Strategy & Positioning');
  text = text.replaceAll('>Brand strategy</a>', '>Brand Strategy & Positioning</a>');
  text = text.replaceAll('"children":"Brand strategy"', '"children":"Brand Strategy & Positioning"');
  text = text.replaceAll('>Brand identity design</a>', '>Content Campaigns & PR</a>');
  text = text.replaceAll('"children":"Brand identity design"', '"children":"Content Campaigns & PR"');
  text = text.replaceAll('>Tone of voice</a>', '>Paid Media & Performance</a>');
  text = text.replaceAll('"children":"Tone of voice"', '"children":"Paid Media & Performance"');
  text = text.replaceAll('>Creative web design</a>', '>Website Design & Development</a>');
  text = text.replaceAll('"children":"Creative web design"', '"children":"Website Design & Development"');
  text = text.replaceAll('>Web development</a>', '>Product Design & UX</a>');
  text = text.replaceAll('"children":"Web development"', '"children":"Product Design & UX"');
  text = text.replaceAll('>WordPress &amp; CMS</a>', '>App Design & Development</a>');
  text = text.replaceAll('"children":"WordPress & CMS"', '"children":"App Design & Development"');
  text = text.replaceAll('>SEO &amp; GEO</a>', '>Autonomous AI Agents &amp; Copilots</a>');
  text = text.replaceAll('"children":"SEO & GEO"', '"children":"Autonomous AI Agents & Copilots"');
  text = text.replaceAll('>Copywriting</a>', '>Workflow Orchestration &amp; API Integration</a>');
  text = text.replaceAll('"children":"Copywriting"', '"children":"Workflow Orchestration & API Integration"');
  text = text.replaceAll('>SiteCare</a>', '>Intelligent Document &amp; Data Processing</a>');
  text = text.replaceAll('"children":"SiteCare"', '"children":"Intelligent Document & Data Processing"');
  text = text.replaceAll('Brand strategy \\u0026 identity', 'Marketing');
  text = text.replaceAll('Web design \\u0026 development', 'Web & App');
  const escapedQuote = '\\' + '"';
  for (const [oldSlug, oldTitle, newSlug, newTitle] of serviceNavigationReplacements) {
    text = text.replaceAll(
      `"slug":"${oldSlug}","title":"${oldTitle}"`,
      `"slug":"${newSlug}","title":"${newTitle}"`,
    );
    text = text.replaceAll(
      `${escapedQuote}slug${escapedQuote}:${escapedQuote}${oldSlug}${escapedQuote},${escapedQuote}title${escapedQuote}:${escapedQuote}${oldTitle}${escapedQuote}`,
      `${escapedQuote}slug${escapedQuote}:${escapedQuote}${newSlug}${escapedQuote},${escapedQuote}title${escapedQuote}:${escapedQuote}${newTitle}${escapedQuote}`,
    );
  }
  for (const [oldRoute, newRoute] of serviceRouteReplacements) {
    text = replaceServiceRoute(text, oldRoute, newRoute);
  }
  text = text.replaceAll('As Dolly Parton once said: “Find out who you are and do it on purpose.” We’ll give your brand the clarity, conviction, and creativity to do exactly that, then build the identity to prove it.', 'Most brands look and sound the same, and most marketing feels generic. We help you find what actually makes you different, then build the positioning, messaging, creative, and campaigns that turn attention into results.');
  text = text.replaceAll('Brand foundations for businesses ready to grow.', 'Four ways we help you show up and grow.');
  text = text.replaceAll('Strategic branding, brand identity design and tone of voice for businesses ready to define what makes them different and show up with confidence. Based in London, operating globally.', 'Strategic marketing and branding for businesses ready to define what makes them different — and turn that clarity into campaigns, content, and growth that actually perform.');
  text = text.replaceAll('hello@kota.co.uk', 'business@kyotocreative.com');
  text = text.replaceAll("https://www.linkedin.com/company/kota-creative/mycompany/", "https://in.linkedin.com/company/kyoto-creative");
  text = text.replaceAll("https://www.linkedin.com/company/kota-creative/", "https://in.linkedin.com/company/kyoto-creative");
  text = text.replaceAll("https://www.linkedin.com/company/kota-creative", "https://in.linkedin.com/company/kyoto-creative");
  text = text.replaceAll("https://linkedin.com/company/kota-creative/", "https://in.linkedin.com/company/kyoto-creative");
  text = text.replaceAll("https://linkedin.com/company/kota-creative", "https://in.linkedin.com/company/kyoto-creative");
  text = text.replaceAll("https://www.facebook.com/kotacreative/", "https://www.facebook.com/kyotocreativeco?mibextid=wwXIfr&rdid=YxsJji4pz710I1HQ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DwJnbkNXL%2F%3Fmibextid%3DwwXIfr#");
  text = text.replaceAll("https://www.facebook.com/kotacreative", "https://www.facebook.com/kyotocreativeco?mibextid=wwXIfr&rdid=YxsJji4pz710I1HQ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DwJnbkNXL%2F%3Fmibextid%3DwwXIfr#");
  text = text.replaceAll("https://facebook.com/kotacreative/", "https://www.facebook.com/kyotocreativeco?mibextid=wwXIfr&rdid=YxsJji4pz710I1HQ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DwJnbkNXL%2F%3Fmibextid%3DwwXIfr#");
  text = text.replaceAll("https://facebook.com/kotacreative", "https://www.facebook.com/kyotocreativeco?mibextid=wwXIfr&rdid=YxsJji4pz710I1HQ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DwJnbkNXL%2F%3Fmibextid%3DwwXIfr#");
  text = text.replaceAll("https://www.instagram.com/kotalondon/", "https://www.instagram.com/kyotocreativeco?mdxt=MWhhemd6MGJiZHhxOQ%3D%3D");
  text = text.replaceAll("https://www.instagram.com/kotalondon", "https://www.instagram.com/kyotocreativeco?mdxt=MWhhemd6MGJiZHhxOQ%3D%3D");
  text = text.replaceAll("https://instagram.com/kotalondon/", "https://www.instagram.com/kyotocreativeco?mdxt=MWhhemd6MGJiZHhxOQ%3D%3D");
  text = text.replaceAll("https://instagram.com/kotalondon", "https://www.instagram.com/kyotocreativeco?mdxt=MWhhemd6MGJiZHhxOQ%3D%3D");
  text = text.replace(/Strategy first\.(?:\\r?\\n|\s)+Always\.?/g, 'Convert & Build');
  text = text.replace(/Find the(?:\\r?\\n|\s)+bold idea\.?/g, 'Automate & Scale');
  text = text.replace(/Nail the(?:\\r?\\n|\s)+process\.?/g, 'Launch & Grow');
  text = text.replace(/Create to(?:\\r?\\n|\s)+convert\.?/gi, 'Clarity First. Always');
  text = text.replaceAll('We\u2019re ready for your growth. In fact, we\u2019re rooting for it. Whether it\u2019s a new product, campaign, or pivot, we make sure your digital presence is set up to flex with you', 'We cut through the noise and define exactly how your brand should look, sound, and show up. The result? Messaging and identity that feel sharp, consistent, and impossible to ignore.');
  text = text.replaceAll('We sweat the small stuff. That means from brand visuals to SEO and UX flow, every creative decision is designed to boost engagement, drive conversions, and build brand equity.', 'No guesswork. No wasted effort. We dig deep into your business, audience, and goals — then lock in clear direction before a single design, website, or automation is built.');
  text = text.replaceAll('We\u2019re collaborative, decisive, and clear from day one. You\u2019ll feel the momentum. You\u2019ll know where you stand. You\u2019ll have a team that knows when to lead, and when to listen.', 'Going live is just the beginning. We support the launch, track what\u2019s working, and keep refining your marketing, website, and automations so performance compounds over time.');
  text = text.replaceAll('We\u2019ll push you creatively, but we\u2019ll always ground our ideas in strategy. From brand identity design to website interactions and immersion, every detail earns its place.', 'We find the repetitive work slowing you down and replace it with smart AI systems. Lead follow-ups, onboarding, reporting, internal processes — handled so your team can focus on growth.');
  text = text.replaceAll('Brand strategy &amp; identity', 'Marketing & Branding');
  text = text.replaceAll('Brand strategy & identity', 'Marketing & Branding');
  text = text.replace(/Enabling (?:<em>|\\u003cem\\u003e)brand(?:<\/em>|\\u003c\/em\\u003e)\s*(?:<br \/>|\\u003cbr \/>|\\u003cbr \/\\u003e)(?:\\\\r\\\\n|\\r\\n|\r?\n)\s*(?:<span>|\\u003cspan\\u003e)(?:<em>|\\u003cem\\u003e)mavericks(?:<\/em>|\\u003c\/em\\u003e)(?:<\/span>|\\u003c\/span\\u003e)?\s*(?:<br \/>|\\u003cbr \/>|\\u003cbr \/\\u003e)(?:\\\\r\\\\n|\\r\\n|\r?\n)\s*(?:<span>|\\u003cspan\\u003e)since 2013\.(?:<\/span>|\\u003c\/span\\u003e)?/g, 'Building brands that stand out and sell.');
  text = text.replaceAll('Web design &amp; development', 'Website & App Development');
  text = text.replaceAll('Web design & development', 'Website & App Development');
  text = text.replaceAll('Growth marketing', 'AI Automations');
  text = text.replaceAll('SEO &amp; AI search, content creation, copywriting, and ongoing support. Whatever you need, get seen and make it count with work that moves, connects and performs.', 'We implement practical AI systems that reduce manual work — lead follow-ups, client onboarding, reporting, internal workflows, and more. Real automation that actually saves time.');
  text = text.replaceAll('SEO & AI search, content creation, copywriting, and ongoing support. Whatever you need, get seen and make it count with work that moves, connects and performs.', 'We implement practical AI systems that reduce manual work — lead follow-ups, client onboarding, reporting, internal workflows, and more. Real automation that actually saves time.');
  text = text.replaceAll('It all starts with clear thinking. Through stakeholder interviews and workshops, we immerse ourselves in your world to sharpen your positioning, messaging and direction before anyone touches the visuals.', 'Pretty isn’t enough. We design and build websites and apps that actually perform — guiding users, removing friction, and turning attention into real business results.');
  text = text.replaceAll('Crafting digital experiences where beauty meets ROI, turning heads and unlocking revenue potential with every click.', 'We design and build websites and apps that don’t just look good — they perform. Fast, user-friendly, and focused on converting visitors into customers.');
  text = text.replaceAll('A global branding agency and creative web design studio based in London, <strong>where strategic-thinkers give bold brands their edge.</strong>', 'We help businesses grow with sharp<br />marketing &amp; branding, high-converting<br />websites &amp; apps, and practical AI automations<br />that save time and drive results.');
  text = text.replace(/Shaping how global(?:\\r?\\n|\s)+brands are seen, trusted,(?:\\r?\\n|\s)+and remembered\./g, 'Shaping how businesses get seen, trusted, and scaled.');
  text = text.replaceAll('There are moments of change for every brand, whether it’s rapid growth, new goals, or new expectations. That’s where our work begins.', 'Most agencies overcomplicate things. We focus on clarity, strong systems, and measurable outcomes — whether we’re building your brand, launching a website, or automating key parts of your business.');
  text = text.replaceAll('When growth pulls at it, new audiences dilute it, and good intentions blur it, we’ll strengthen your brand with clear decisions that feel inevitable.', 'We help you define how your brand shows up in the market. From strategy and positioning to messaging and visual identity — everything is built to be clear, consistent, and commercially effective.');
  // Approach item 01 heading: Marketing on line 1, and & Branding together on line 2
  text = text.replaceAll('>Brand Clarity<', '>Marketing &amp;&nbsp;Branding<');
  text = text.replaceAll('\\"children\\\":\\\"Brand Clarity\\\"', '\\"children\\\":\\\"Marketing &\\u00A0Branding\\\"');
  text = text.replaceAll('"children":"Brand Clarity"', '"children":"Marketing &\u00A0Branding"');
  text = text.replaceAll('Brand Clarity', 'Marketing & Branding');
  text = text.replaceAll('Decisions that help brands re-position and commit.', 'Positioning, messaging, and brand systems that cut through the noise and convert.');
  text = text.replace(/Build for(?:\\+r\\+n|\s)+scale\.?/gi, 'Brand Clarity');
  text = text.replaceAll('Creative Craft', 'Websites & Apps');
  text = text.replaceAll('Visually confident design built to stand out.', 'Fast, clean, conversion-focused digital products built for real business goals.');
  text = text.replaceAll('Commercial Momentum', 'AI Automations');
  text = text.replace(/Scalable systems with(?:\\r?\\n|\s)+growth in mind\./g, 'Practical systems that handle repetitive work so your team can focus on growth.');
  text = text.replaceAll('Someone from the KOTA team will be contacting you shortly. In the meantime, how about checking out some of our latest projects :', 'Someone from the Kyoto Creative team will be contacting you shortly. In the meantime, explore some of our latest projects :');
  text = text.replaceAll('Keep an eye out for your first KOTA newsletter.', 'Your subscription has been saved locally. Newsletter delivery is not connected.');
  text = text.replaceAll("Follow the link below. We've also emailed it for future reference..", 'Follow the link below to view your results. Your responses have been saved locally.');
  // Remove showreel / play video section from the Agency page
  text = text.replace(/<section class="Video_video__ODG2u"><div class="ImageEnter_image__FSEP_" data-fill="false"><div class="Video_videoContainer__SQ5UJ">[\s\S]*?<\/video><\/span><\/div><\/div><\/div><\/section>/g, '');
  text = text.replace(/,\[\\?"\$[^\\]*\\?",\\?"\$L\w+\\?",null,\{\\?"data\\"?:\{\\?"fullVideo\\"?:[^\]]*?Short-Preview-Agency\.mp4[^\]]*?\}\}\]/g, '');
  text = text.replace(/,\["\$","\$L\w+",null,\{"data":\{"fullVideo":[^\]]*?Short-Preview-Agency\.mp4[^\]]*?\}\}\]/g, '');

  // Remove homepage hero floating showreel video button & popup player
  text = text.replace(/,\[\\?"\$[^\\]*\\?",\\?"\$L\w+\\?",null,\{\\?"loopVideoSrc\\"?:\\?"[^"]*?Short-Preview-homepage\.mp4[^"]*?\\",\\?"fullVideoSrc\\"?:\\?"[^"]*?00-Kota-Showreel-2025-Final\.mp4[^"]*?\\"\}\]/g, '');
  text = text.replace(/,\["\$","\$L\w+",null,\{"loopVideoSrc":"[^"]*?Short-Preview-homepage\.mp4[^"]*?","fullVideoSrc":"[^"]*?00-Kota-Showreel-2025-Final\.mp4"\}\]/g, '');

  // Fix GSAP ScrollTrigger crash in FloatingStartButton across all pages:
  // kota's bundled JS had a minified bug: `...r&&{endTrigger:r},endTrigger:"#kotaverceCta"` (also using `n` or `i`).
  // When #kotaverceCta is not in the DOM, GSAP throws an unhandled exception during mount.
  // We match any variable name (r, n, i, etc.) and remove the hardcoded endTrigger:"#kotaverceCta".
  text = text.replace(/,endTrigger:"#kotaverceCta"/g, '');

  // Retain an invisible #kotaverceCta anchor element before the footer across all pages so that
  // any querySelector("#kotaverceCta") or existing CSS/JS finds it cleanly without rendering any UI.
  if (text.includes('<footer') && !text.includes('id="kotaverceCta"')) {
    text = text.replace('<footer', '<div id="kotaverceCta" style="height:0;overflow:hidden;pointer-events:none"></div><footer');
  }

  // Remove SHOWREEL / Watch Now motion section above the footer on pages where it exists
  if (text.includes('KotaverseCta_kotaverseCta__bBpWa')) {
    text = text.replace(/<section class="KotaverseCta_kotaverseCta__bBpWa" id="kotaverceCta">[\s\S]*?<\/section>/g, '');
    text = text.replace(/,(?:\\{1,3}"\$L(?:57|46|1c)\\{1,3}"|"\$L(?:57|46|1c)")/g, '');
    text = text.replace(/<script[^>]*>\s*self\.__next_f\.push\(\[1,"(?:57|46|1c):\[\\?"\\\$\\?",\\?"section\\?",null,\{\\?"className\\?":\\?"KotaverseCta_kotaverseCta__bBpWa\\?"[\s\S]*?"\]\)\s*<\/script>/g, '');
    text = text.replace(/(?:^|[\r\nZ])(?:46|1c|57):\["\\\$","section",null,\{"className":"KotaverseCta_kotaverseCta__bBpWa"[\s\S]*?(?=[\r\n]+\w+:|$)/g, match => match.startsWith('Z') ? 'Z' : '');
  }

  // Remove "Celebrating 13 years : 2013 - 2026" banner from the homepage and all pages
  text = text.replace(/<p class="Celebrating_celebrating[^"]*"[^>]*>[\s\S]*?<\/p>/g, '');
  text = text.replace(
    'function s(){let e=(0,i.usePathname)();return e.includes("/service/")||e.includes("/b2b-transformation")||e.includes("/b2b-tech-software-saas")||e.includes("/agencies")||e.includes("/healthcare")||e.includes("/media-entertainment")||e.includes("/retail")?null:(0,r.jsx)("p",{className:o().celebrating,"data-modal-hide":!0,children:(0,r.jsxs)("a",{href:"https://10-years.kota.co.uk/",target:"_blank",children:["Celebrating 13 years : 2013 - ",new Date().getFullYear()]})})}',
    'function s(){return null}'
  );

  // Remove Bluesky link from the footer across all pages (HTML, unescaped RSC, and escaped inlined RSC)
  const footerBlueskyHtml = '<a href="https://bsky.app/profile/kotacreative.bsky.social" target="_blank" rel="noopener noreferrer">Bluesky<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.69 12.69"><path fill="#fff" stroke-width="0" d="M12.65.31a.504.504 0 00-.46-.31H.5C.22 0 0 .22 0 .5s.22.5.5.5h10.49L.55 11.43c-.2.2-.2.51 0 .71a.485.485 0 00.7 0L11.69 1.71v10.47c0 .28.22.5.5.5s.5-.22.5-.5V.52c0-.07 0-.14-.04-.21z"></path></svg></a>';
  const footerBlueskyRsc = ',["$","a","3",{"href":"https://bsky.app/profile/kotacreative.bsky.social","target":"_blank","rel":"noopener noreferrer","children":["Bluesky",["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 12.69 12.69","children":["$","path",null,{"fill":"#fff","strokeWidth":"0","d":"M12.65.31a.504.504 0 00-.46-.31H.5C.22 0 0 .22 0 .5s.22.5.5.5h10.49L.55 11.43c-.2.2-.2.51 0 .71a.485.485 0 00.7 0L11.69 1.71v10.47c0 .28.22.5.5.5s.5-.22.5-.5V.52c0-.07 0-.14-.04-.21z"}]}]]}]';
  const escFooterBlueskyRsc = footerBlueskyRsc.replaceAll('"', '\\\"');

  text = text.replaceAll(footerBlueskyHtml, '');
  text = text.replaceAll(footerBlueskyRsc, '');
  text = text.replaceAll(escFooterBlueskyRsc, '');

    // Fix page transition preloader curtain covering the screen on navigation
  text = text.replaceAll('<div style="position:fixed;z-index:50;width:100vw;height:100vh;background:#efefef"></div>', '');
  text = text.replace("let l=()=>{let{loading:e,setLoading:t}=_(),n=(0,s.useRef)(null),r=()=>{i.ZP.set(n.current,{clipPath:\"polygon(0 100%, 100% 100%, 100% 100%, 0 100%)\"})},l=()=>{i.ZP.to(n.current,{clipPath:\"polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)\",duration:1,ease:\"power4.inOut\"})},u=()=>{i.ZP.to(n.current,{opacity:0,duration:.6,ease:\"none\",onComplete:()=>{i.ZP.set(n.current,{clipPath:\"polygon(0 100%, 100% 100%, 100% 100%, 0 100%)\",opacity:1})}})};return(0,s.useEffect)(()=>{r()},[]),(0,s.useEffect)(()=>{switch(e){case a.LOADING:l();break;case a.LOADED:u()}},[e]),(0,o.jsx)(\"div\",{ref:n,style:{position:\"fixed\",zIndex:50,width:\"100vw\",height:\"100vh\",background:\"#efefef\"}})}", "let l=()=>{let{loading:e,setLoading:t}=_(),n=(0,s.useRef)(null),r=()=>{i.ZP.set(n.current,{clipPath:\"polygon(0 100%, 100% 100%, 100% 100%, 0 100%)\",pointerEvents:\"none\"})},l=()=>{i.ZP.to(n.current,{clipPath:\"polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)\",duration:.8,ease:\"power4.inOut\"})},u=()=>{i.ZP.to(n.current,{opacity:0,duration:.4,ease:\"none\",onComplete:()=>{i.ZP.set(n.current,{clipPath:\"polygon(0 100%, 100% 100%, 100% 100%, 0 100%)\",opacity:1})}})};return(0,s.useEffect)(()=>{r();let timer=setTimeout(()=>u(),300);return()=>clearTimeout(timer)},[]),(0,s.useEffect)(()=>{switch(e){case a.LOADING:l();break;case a.LOADED:u()}},[e]),(0,o.jsx)(\"div\",{ref:n,style:{position:\"fixed\",zIndex:50,width:\"100vw\",height:\"100vh\",background:\"#efefef\",pointerEvents:\"none\"}})}");

    // Remove awards and agency network badges (DAN, Clutch, Awwwards, CSSDA) from the footer
  text = text.replace(/<div class="Footer_logos__jFNys">[\s\S]*?<\/div>/g, '');
  text = text.replace(/,\[\\?"\$[^\\]*\\?",\\?"div\\?",null,\{\\?"className\\"?:\\?"Footer_logos__jFNys\\"?,\s*\\?"children\\"?:\[[\s\S]*?\]\}\]/g, '');
  text = text.replace(/,\["\$","div",null,\{"className":"Footer_logos__jFNys",\s*"children":\[[\s\S]*?\]\}\]/g, '');
  text = text.replace(/<link rel="preload" as="image" href="(?:https:\/\/kota-content\.b-cdn\.net|\/__assets\/kota-content\.b-cdn\.net)\/app\/uploads\/(?:2024\/06\/DAN-1-500x167\.png|2023\/10\/(?:clutch|awwwards|cssda)\.svg)"\/>/g, '');

  // Remove awards and agency network badges (DAN, Clutch, Awwwards, CSSDA) from Hero (homepage & services)
  text = text.replace(/<div class="Hero_logos__jC9k_" data-modal-hide="true">[\s\S]*?<\/div><\/span><\/div>/g, '');
  text = text.replace(/,\[\\?"\$[^\\]*\\?",\\?"div\\?",null,\{\\?"className\\"?:\\?"Hero_logos__jC9k_\\"?,\s*\\?"data-modal-hide\\"?:true[\s\S]*?cssda\.svg[\s\S]*?\}\]\}\]\}\]/g, '');
  text = text.replace(/,\["\$","div",null,\{"className":"Hero_logos__jC9k_","data-modal-hide":true[\s\S]*?cssda\.svg[\s\S]*?\}\]\}\]\}\]/g, '');
  text = text.replace(/<link rel="preload" as="image" href="(?:https:\/\/kota-content\.b-cdn\.net|\/__assets\/kota-content\.b-cdn\.net)\/app\/uploads\/2024\/03\/Digital-Agency-Network\.svg"\/>/g, '');

  // Replace KOTA brand logo with Kyoto Creative logo
  const kotaLogoPath = 'M5 5h80v80H5V5zM0 90h90V0H0v90zm64.66-15.67l-5.15-16.61h-.1l-5.35 16.61H47.6l9.49-24.09h4.74l9.39 24.09h-6.56zm-39.77 0V55.67h-6.66v-5.43H37.6v5.43h-6.66v18.66h-6.06zm34.52-59.16c-3.94-.1-7.67 1.74-9.99 4.92-.64.81-1.15 1.7-1.52 2.67-.6 1.64-.9 3.38-.9 5.13v.05c.07 6.78 5.62 12.22 12.4 12.15h.56c6.88-.29 12.22-6.1 11.93-12.97-.28-6.69-5.79-11.96-12.48-11.94m.1 19.48c-3.94 0-6.56-3.38-6.56-7.18s2.62-6.97 6.46-6.97 6.46 3.38 6.46 7.07-2.52 7.08-6.36 7.08m-28.87 5.02l-6.46-10.35h-.1v10.35h-6.06v-24.1h6.06v10.87h.1l6.66-10.87h6.36l-7.87 12 8.38 12.1h-7.06z';
  
  // Footer logo: Kyoto Creative logo styled to match the exact size of the KOTA logo on all pages
  const kyotoFooterSvgHtml = '<image href="/images/kyoto-creative-footer-white.png" width="618" height="237" preserveAspectRatio="xMidYMid meet"></image>';
  const kyotoFooterSvgRsc = '["$","image",null,{"href":"/images/kyoto-creative-footer-white.png","width":618,"height":237,"preserveAspectRatio":"xMidYMid meet"}]';

  // Header logo
  const kyotoHeaderSvgHtml = '<image href="/images/kyoto-creative-logo.png" width="618" height="237" preserveAspectRatio="xMidYMid meet"></image>';
  const kyotoHeaderSvgRsc = '["$","image",null,{"href":"/images/kyoto-creative-logo.png","width":618,"height":237,"preserveAspectRatio":"xMidYMid meet"}]';

  // 1. HTML markup replacements
  text = text.replaceAll(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90"><path fill="currentColor" d="' + kotaLogoPath + '"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 618 237">' + kyotoHeaderSvgHtml + '</svg>'
  );
  text = text.replaceAll(
    '<svg class="Footer_logo__fUEOF" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90"><path fill="#fff" stroke-width="0" d="' + kotaLogoPath + '"></path></svg>',
    '<svg class="Footer_logo__fUEOF" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 618 237" >' + kyotoFooterSvgHtml + '</svg>'
  );

  // 2. Unescaped RSC Flight payloads
  const oldHeaderRsc = '["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 90 90","children":["$","path",null,{"fill":"currentColor","d":"' + kotaLogoPath + '"}]}]';
  const newHeaderRsc = '["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 618 237","children":' + kyotoHeaderSvgRsc + '}]';
  text = text.replaceAll(oldHeaderRsc, newHeaderRsc);

  const oldFooterRsc = '["$","svg",null,{"className":"Footer_logo__fUEOF","xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 90 90","children":["$","path",null,{"fill":"#fff","strokeWidth":"0","d":"' + kotaLogoPath + '"}]}]';
  const newFooterRsc = '["$","svg",null,{"className":"Footer_logo__fUEOF","xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 618 237","children":' + kyotoFooterSvgRsc + '}]';
  text = text.replaceAll(oldFooterRsc, newFooterRsc);

  // 3. Escaped RSC Flight payloads (inlined script tags in HTML)
  const escOldHeaderRsc = oldHeaderRsc.replaceAll('"', '\\"');
  const escNewHeaderRsc = newHeaderRsc.replaceAll('"', '\\"');
  text = text.replaceAll(escOldHeaderRsc, escNewHeaderRsc);

  const escOldFooterRsc = oldFooterRsc.replaceAll('"', '\\"');
  const escNewFooterRsc = newFooterRsc.replaceAll('"', '\\"');
  text = text.replaceAll(escOldFooterRsc, escNewFooterRsc);

  // Replace homepage hero headline "Rebel against boring" with "Marketing that works. Websites that convert. AI that delivers."
  const targetHeroSplitHtml = '<div class="Hero_splitText__diMTw">';
  const replacementHeroSplitHtml = '<div class="Hero_splitText__diMTw">' +
    '<h1 class="kyoto-hero-title">' +
      '<span class="kyoto-hero-line">Marketing that works.</span>' +
      '<span class="kyoto-hero-line">Websites that convert.</span>' +
      '<span class="kyoto-hero-line">AI that delivers.</span>' +
    '</h1>';
  text = text.replace(targetHeroSplitHtml, replacementHeroSplitHtml);

  const targetHeroSplitRsc = '["$","div",null,{"className":"Hero_splitText__diMTw","children":[';
  const headlineRscObj = '["$","h1",null,{"className":"kyoto-hero-title","children":[["$","span",null,{"className":"kyoto-hero-line","children":"Marketing that works."}],["$","span",null,{"className":"kyoto-hero-line","children":"Websites that convert."}],["$","span",null,{"className":"kyoto-hero-line","children":"AI that delivers."}]]}],';

  const escTargetHeroSplitRsc = targetHeroSplitRsc.replaceAll('"', '\\"');
  const escHeadlineRscObj = headlineRscObj.replaceAll('"', '\\"');

  text = text.replaceAll(targetHeroSplitRsc, targetHeroSplitRsc + headlineRscObj);
  text = text.replaceAll(escTargetHeroSplitRsc, escTargetHeroSplitRsc + escHeadlineRscObj);

  // Ensure responsive sizing matches design cleanly and prevent undesirable 3-line heading breaks
  if (text.includes('</head>')) {
    const customStyle = '<style>' +
      'header.Header_header__KwdYD{position:absolute!important;top:0!important;left:50%!important;transform:translateX(-50%)!important;width:100%!important;max-width:2470px!important;box-sizing:border-box!important;}.Header_logo____uDV{width:clamp(120px, 12vw, 170px)!important;height:auto!important;display:inline-block!important;background:transparent!important;}.Header_logo____uDV svg{width:100%!important;height:auto!important;max-height:55px!important;display:block!important;}.Footer_top__YBhK_{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:2rem!important;margin-bottom:3.5rem!important;}.Footer_logo__fUEOF{height:clamp(3.5rem, 6vw, 4.75rem)!important;width:auto!important;max-width:260px!important;display:block!important;}.Footer_email__nLajh{font-size:clamp(2.25rem, 5.5vw, 5rem)!important;line-height:1.1!important;}.CopyText_tooltip__HuxWa, .Footer_footer__pQtti .CopyText_tooltip__HuxWa, .Footer_footer__pQtti a .CopyText_tooltip__HuxWa { background-color: #fff !important; color: #000 !important; -webkit-text-fill-color: #000 !important; background-image: none !important; }.CopyText_tooltip__HuxWa:after, .Footer_footer__pQtti .CopyText_tooltip__HuxWa:after { border-bottom-color: #fff !important; }' +
      '.Hero_introText__wboFn{max-width:520px!important;width:max-content!important;}.Heading_heading__fhmAd{max-width:20ch!important;white-space:normal!important;}' +
      '.Approach_item__5N2E6 h3{width:min-content!important;max-width:100%!important;}' +
      '.KotaverseCta_kotaverseCta__bBpWa, .Footer_newsletterButton__wp2hz, .Footer_cyberEssestials__2qh89 { display: none !important; }' +
      '.HeroSplitTextDesktop_desktop__Bey7n, .Hero_mobile__VkWXK, .HeroVideo_video__OoWDY { display: none !important; }' +

      '.kyoto-hero-title { display: flex; flex-direction: column; font-family: var(--montreal), sans-serif; font-size: clamp(2.75rem, 5.25vw, 5.5rem); font-weight: 400; line-height: 1; letter-spacing: -0.02em; color: #000; text-transform: none; margin: 0 0 2.5rem; pointer-events: auto; }' +
      '.leadcourt-logo-wrapper, .StatisticsPanel_logo__Y5wQT:has(img[src*="leadcourt"]), .StatisticsPanel_logo__Y5wQT:has(img[alt*="Leadcourt"]) { height: 50px !important; display: flex !important; align-items: center !important; }' +
      '.leadcourt-logo-img, img[src*="leadcourt-logo"], img[data-src*="leadcourt-logo"], .StatisticsPanel_logo__Y5wQT img[alt*="Leadcourt"], .StatisticsPanel_logo__Y5wQT img[src*="leadcourt"] { position: relative !important; width: auto !important; height: auto !important; max-width: 190px !important; max-height: 38px !important; min-width: 0 !important; min-height: 0 !important; object-fit: contain !important; display: block !important; } .greensquare-logo-wrapper, .StatisticsPanel_logo__Y5wQT:has(img[src*="green-square"]), .StatisticsPanel_logo__Y5wQT:has(img[alt*="Green Square"]) { height: 60px !important; display: flex !important; align-items: center !important; } .greensquare-logo-img, img[src*="green-square-logo"], img[data-src*="green-square-logo"], .StatisticsPanel_logo__Y5wQT img[alt*="Green Square"], .StatisticsPanel_logo__Y5wQT img[src*="green-square"] { position: relative !important; width: auto !important; height: auto !important; max-width: 170px !important; max-height: 55px !important; min-width: 0 !important; min-height: 0 !important; object-fit: contain !important; display: block !important; } .sevengate-logo-wrapper, .StatisticsPanel_logo__Y5wQT:has(img[src*="sevengate"]), .StatisticsPanel_logo__Y5wQT:has(img[alt*="Seven Gate"]) { height: 60px !important; display: flex !important; align-items: center !important; } .sevengate-logo-img, img[src*="sevengate-logo"], img[data-src*="sevengate-logo"], .StatisticsPanel_logo__Y5wQT img[alt*="Seven Gate"], .StatisticsPanel_logo__Y5wQT img[src*="sevengate"] { position: relative !important; width: auto !important; height: auto !important; max-width: 75px !important; max-height: 60px !important; min-width: 0 !important; min-height: 0 !important; object-fit: contain !important; display: block !important; } .interact-logo-wrapper, .StatisticsPanel_logo__Y5wQT:has(img[src*="interact"]), .StatisticsPanel_logo__Y5wQT:has(img[alt*="Interact"]) { height: 60px !important; display: flex !important; align-items: center !important; } .interact-logo-img, img[src*="interact-financial-logo"], img[data-src*="interact-financial-logo"], .StatisticsPanel_logo__Y5wQT img[alt*="Interact"], .StatisticsPanel_logo__Y5wQT img[src*="interact"] { position: relative !important; width: auto !important; height: auto !important; max-width: 175px !important; max-height: 48px !important; min-width: 0 !important; min-height: 0 !important; object-fit: contain !important; display: block !important; }' +
      '@media (max-width: 768px) { .TestimonialsPanel_description__njfi8 { font-size: 16px !important; line-height: 1.45 !important; } .TestimonialsPanel_name__Spm5c { font-size: 14px !important; line-height: 1.3 !important; } .Testimonials_heading__k0Yyf { font-size: clamp(2rem, 7vw, 2.75rem) !important; } .Work_rightText__zx_Y0 h3 { font-size: clamp(1.75rem, 6.5vw, 2.25rem) !important; line-height: 1.15 !important; } }' +
      'body:has(.StartYourProject_startYourProject__k9Ery) .Header_logo____uDV, header:has(+ .StartYourProject_startYourProject__k9Ery) .Header_logo____uDV { display: none !important; } a[href="/culture"], a[href="/culture/"], li:has(> a[href="/culture"]), li:has(> a[href="/culture/"]) { display: none !important; } .Form_uploads__8vsGL, [class*="Form_uploads"], div:has(> input[name="attachments"]) { display: none !important; } .Culture_text__tkIGz, .Culture_buttonContainer__YAvTa, .BigUps_partners__xRCBU, .LargeCta_mainText__6MrpN, .Team_team__Z__z1, .Culture_culture__lmpEt + .Partners_partners__jBo8y, .TextImageRows_buttonContainer___PqVy:has(a[href*="/brand-pulse"]), .Button_button__JJiqJ:has(a[href*="/brand-pulse"]), a.Button_inner__fnyH6[href*="/brand-pulse"] { display: none !important; } .TestimonialsPanel_logo__m6tmz img[src*="john-ruggieri"], .TestimonialsPanel_logo__m6tmz img[data-src*="john-ruggieri"] { width: auto !important; max-width: 220px !important; max-height: 55px !important; object-fit: contain !important; } .Articles_articlesList__CXW8a > :nth-child(n+4), .Articles_articlesList__CXW8a > a:nth-of-type(n+4), .RelatedPosts_relatedPosts__xfLkb .AnimatedGrid_grid__otAMD .container > :nth-child(n+4), .RelatedPosts_relatedPosts__xfLkb .AnimatedGrid_grid__otAMD .container > a:nth-of-type(n+4) { display: none !important; }' +
      '.kyoto-hero-line { display: block; }' +
      '@media (max-width: 768px) { .kyoto-hero-title { font-size: clamp(2.25rem, 9vw, 3.5rem); line-height: 1.05; margin-bottom: 1.5rem; } }' +
      '</style><script src="/js/web3forms-client.js" defer></script></head>';
    text = text.replace('</head>', customStyle);
  }

  text = text.replace(/(href="\/service\/marketing\/?">)Marketing (?:&amp;|&) Branding(<\/a>)/g, '$1Marketing$2');
  text = text.replace(/(href="\/service\/web-app\/?">)Website (?:&amp;|&) App Development(<\/a>)/g, '$1Web &amp; App$2');
  text = text.replaceAll('"label":"Marketing & Branding"', '"label":"Marketing"');
  text = text.replaceAll('"label":"Website & App Development"', '"label":"Web & App"');
  text = text.replaceAll(
    `${escapedQuote}label${escapedQuote}:${escapedQuote}Marketing & Branding${escapedQuote}`,
    `${escapedQuote}label${escapedQuote}:${escapedQuote}Marketing${escapedQuote}`,
  );
  text = text.replaceAll(
    `${escapedQuote}label${escapedQuote}:${escapedQuote}Website & App Development${escapedQuote}`,
    `${escapedQuote}label${escapedQuote}:${escapedQuote}Web & App${escapedQuote}`,
  );

  return text;
}
