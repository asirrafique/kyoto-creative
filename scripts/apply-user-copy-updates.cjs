const fs = require('fs');

let f = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');
let rsc = fs.readFileSync('reference/pages/green_square_infra_project_page.rsc', 'utf8');

// ==========================================
// 1. Introduction text change
// ==========================================
const oldIntroHtmlP1 = `<p>Green Square Infra is an innovative infrastructure and property development firm delivering high-value residential and commercial assets.</p>
<p>Their work pushes the boundaries of digital effects, crafting immersive, otherworldly visuals that elevate storytelling to an art form. When it came to their website, they needed something brave and equally ambitious—a digital experience that reflected the high-caliber artistry of their work.</p>`;

const oldIntroHtmlP1_CRLF = `<p>Green Square Infra is an innovative infrastructure and property development firm delivering high-value residential and commercial assets.</p>\r\n<p>Their work pushes the boundaries of digital effects, crafting immersive, otherworldly visuals that elevate storytelling to an art form. When it came to their website, they needed something brave and equally ambitious—a digital experience that reflected the high-caliber artistry of their work.</p>`;

const newIntroHtml = `<p>Green Square Infra operates in a competitive residential real estate market where reaching the right buyers and generating consistent property enquiries can make a real difference. Kyoto Creative partnered with Green Square Infra to strengthen its digital presence through a newly designed and developed website, supported by a targeted performance marketing strategy.</p>
<p>Our goal was to create more than an online presence. We wanted to build a digital foundation that could connect prospective homebuyers with Green Square Infra&#x27;s residential projects and turn online interest into actionable enquiries.</p>`;

f = f.replace(oldIntroHtmlP1_CRLF, newIntroHtml);
f = f.replace(oldIntroHtmlP1, newIntroHtml);

// In Flight / RSC, introduction text is inside dangerouslySetInnerHTML
const oldIntroFlightHtml = `<h2>Introduction</h2>\\n<p>Universal Production Partners (UPP) is the VFX powerhouse behind some of Hollywood’s most visually stunning blockbusters, including <em>Barbie (2023)</em>, <em>Blade Runner 2049 (2017)</em>, and <em>Conclave (2024)</em>.</p>\\n<p>Their work pushes the boundaries of digital effects, crafting immersive, otherworldly visuals that elevate storytelling to an art form. When it came to their website, they needed something brave and equally ambitious—a digital experience that reflected the high-caliber artistry of their work.</p>`;

const newIntroFlightHtml = `<h2>Introduction</h2>\\n<p>Green Square Infra operates in a competitive residential real estate market where reaching the right buyers and generating consistent property enquiries can make a real difference. Kyoto Creative partnered with Green Square Infra to strengthen its digital presence through a newly designed and developed website, supported by a targeted performance marketing strategy.</p>\\n<p>Our goal was to create more than an online presence. We wanted to build a digital foundation that could connect prospective homebuyers with Green Square Infra's residential projects and turn online interest into actionable enquiries.</p>`;

f = f.replace(oldIntroFlightHtml, newIntroFlightHtml);
rsc = rsc.replace(oldIntroFlightHtml.replace(/\\\\n/g, '\\n'), newIntroFlightHtml.replace(/\\\\n/g, '\\n'));


// ==========================================
// 2. Project Details / Tags change
// Industry -> Website Development -
// Location -> Performance Marketing -
// Featured by -> Real Estate Marketing
// ==========================================
const oldDetailsHtml = `<div class="Intro_projectDetails__UWcsm"><div class="Intro_left__d8bha"><span class="FadeIn_container__bjQVL" data-fill="false"><div><p class="Intro_smallHeading__gYXTn">Industry</p><p>Film &amp; TV Production</p></div><div><p class="Intro_smallHeading__gYXTn">Location</p><p>Global</p></div></span></div><div class="Intro_right__E3UWy"><span class="FadeIn_container__bjQVL" data-fill="false"><div><p class="Intro_smallHeading__gYXTn">Featured by</p><div class="Intro_list__65yay"><a href="https://www.itsnicethat.com/articles/kota-universal-production-partners-website-sponsored-content-240925" target="_blank">It&#x27;s Nice That</a><a href="https://www.awwwards.com/sites/upp" target="_blank">Awwwards</a></div></div></span></div></div>`;

const newDetailsHtml = `<div class="Intro_projectDetails__UWcsm"><div class="Intro_left__d8bha" style="width:100%"><span class="FadeIn_container__bjQVL" data-fill="false"><div style="display:flex;flex-direction:column;gap:0.75rem;font-size:1.15rem;font-weight:500;color:#000"><p style="margin:0">Website Development —</p><p style="margin:0">Performance Marketing —</p><p style="margin:0">Real Estate Marketing</p></div></span></div></div>`;

f = f.replace(oldDetailsHtml, newDetailsHtml);

// Hide or adjust the "Visit site" button to point to Green Square Infra or clean up
f = f.replace('href="https://www.upp.cz/"', 'href="#"');


// ==========================================
// 3. A website worthy of Hollywood's finest -> The Challenge
// ==========================================
const oldChallengeHtml = `<h3>A website worthy of Hollywood’s finest</h3>
<p>We wanted UPP’s site to reflect the cinematic depth, artistry, and innovation that define their work. It had to be an <span class="notion-enable-hover" data-token-index="1">immersive, seamless, and boundary-pushing website</span>—one that transports visitors into their world from the moment they land.</p>
<p>Far from a traditional website, it feels like stepping into an immersive corridor. As you navigate, you walk through a digital space filled with beautiful reflections, expansive skies, and cinematic lighting effects that echo the artistry of UPP’s work.</p>`;

const oldChallengeHtml_CRLF = `<h3>A website worthy of Hollywood’s finest</h3>\r\n<p>We wanted UPP’s site to reflect the cinematic depth, artistry, and innovation that define their work. It had to be an <span class="notion-enable-hover" data-token-index="1">immersive, seamless, and boundary-pushing website</span>—one that transports visitors into their world from the moment they land.</p>\r\n<p>Far from a traditional website, it feels like stepping into an immersive corridor. As you navigate, you walk through a digital space filled with beautiful reflections, expansive skies, and cinematic lighting effects that echo the artistry of UPP’s work.</p>`;

const newChallengeHtml = `<h2>The Challenge</h2>
<p>Real estate marketing requires more than visibility. Potential buyers need to discover a project, understand its offering, and feel encouraged to take the next step. At the same time, advertising costs can quickly add up in a competitive market, making efficient lead generation essential.</p>
<p>Green Square Infra needed a digital approach that combined a professional online presence with targeted advertising, helping the brand reach prospective buyers and generate property enquiries while keeping the initial advertising budget lean.</p>`;

f = f.replace(oldChallengeHtml_CRLF, newChallengeHtml);
f = f.replace(oldChallengeHtml, newChallengeHtml);

// Flight stream replacement
f = f.replaceAll('A website worthy of Hollywood’s finest', 'The Challenge');
f = f.replaceAll('A website worthy of Hollywood&#x27;s finest', 'The Challenge');
f = f.replaceAll('A website worthy of Hollywood\'s finest', 'The Challenge');


// ==========================================
// 4. Cinematic storytelling through WebGL -> The Strategy
// ==========================================
const oldStrategyHtml = `<h3>Cinematic storytelling through WebGL</h3>
<p><strong>Pushing the limits of web design</strong></p>
<p>To achieve this, we designed a site that fuses motion, interactivity, and storytelling into a seamless experience.</p>
<ul>
<li>We implemented fluid transitions, 3D effects, and motion-driven interactions that mimic the feeling of stepping into a movie universe.</li>
<li>Dynamic scrolling effects guide users through UPP’s portfolio, bringing their VFX work to life as they navigate.</li>
<li>The homepage unfolds seamlessly, instantly immersing visitors in UPP’s world of visual effects mastery.<br />
<!-- notionvc: ac4e158f-d8aa-4f18-8a0c-1a828e6de751 --></li>
</ul>`;

const oldStrategyHtml_CRLF = `<h3>Cinematic storytelling through WebGL</h3>\r\n<p><strong>Pushing the limits of web design</strong></p>\r\n<p>To achieve this, we designed a site that fuses motion, interactivity, and storytelling into a seamless experience.</p>\r\n<ul>\r\n<li>We implemented fluid transitions, 3D effects, and motion-driven interactions that mimic the feeling of stepping into a movie universe.</li>\r\n<li>Dynamic scrolling effects guide users through UPP’s portfolio, bringing their VFX work to life as they navigate.</li>\r\n<li>The homepage unfolds seamlessly, instantly immersing visitors in UPP’s world of visual effects mastery.<br />\r\n<!-- notionvc: ac4e158f-d8aa-4f18-8a0c-1a828e6de751 --></li>\r\n</ul>`;

const newStrategyHtml = `<h2>The Strategy</h2>
<p>We brought website development and performance marketing together to create a connected digital experience. Our team designed and developed a new website to establish the brand&#x27;s online presence and provide a destination for people interested in its residential projects.</p>
<p>Alongside the website, we ran targeted advertising campaigns across Facebook and Instagram using Meta Ads. The campaigns focused on reaching potential homebuyers and encouraging them to enquire about available property projects. With a focus on lead generation and cost-conscious campaign execution, we aimed to maximise the return from a limited advertising budget.</p>`;

f = f.replace(oldStrategyHtml_CRLF, newStrategyHtml);
f = f.replace(oldStrategyHtml, newStrategyHtml);

// Flight stream replacement
f = f.replaceAll('Cinematic storytelling through WebGL', 'The Strategy');

// Also update .rsc file for client navigations
rsc = rsc.replaceAll('A website worthy of Hollywood’s finest', 'The Challenge');
rsc = rsc.replaceAll('Cinematic storytelling through WebGL', 'The Strategy');

fs.writeFileSync('reference/pages/green_square_infra_project_page.html', f, 'utf8');
fs.writeFileSync('reference/pages/green_square_infra_project_page.rsc', rsc, 'utf8');

console.log('Successfully applied all text changes to Green Square Infra!');
