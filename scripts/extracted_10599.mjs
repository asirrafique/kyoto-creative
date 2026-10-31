import fs from 'node:fs';

const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');

const targetAnchor = `text = text.replaceAll('A cinematic web\\r\\nexperience for a Hollywood\\r\\npowerhouse.', 'Turning Digital Marketing into a Lead Generation Engine');`;

const oldStrategyHtml = `<h3>Cinematic storytelling through WebGL</h3>
<p><strong>Pushing the limits of web design</strong></p>
<p>To achieve this, we designed a site that fuses motion, interactivity, and storytelling into a seamless experience.</p>
<ul>
<li>We implemented fluid transitions, 3D effects, and motion-driven interactions that mimic the feeling of stepping into a movie universe.</li>
<li>Dynamic scrolling effects guide users through UPP’s portfolio, bringing their VFX work to life as they navigate.</li>
<li>The homepage unfolds seamlessly, instantly immersing visitors in UPP’s world of visual effects mastery.<br />
<!-- notionvc: ac4e158f-d8aa-4f18-8a0c-1a828e6de751 --></li>
</ul>`;

const oldStrategyRsc = `<h3>Cinematic storytelling through WebGL</h3>\\n<p><strong>Pushing the limits of web design</strong></p>\\n<p>To achieve this, we designed a site that fuses motion, interactivity, and storytelling into a seamless experience.</p>\\n<ul>\\n<li>We implemented fluid transitions, 3D effects, and motion-driven interactions that mimic the feeling of stepping into a movie universe.</li>\\n<li>Dynamic scrolling effects guide users through UPP’s portfolio, bringing their VFX work to life as they navigate.</li>\\n<li>The homepage unfolds seamlessly, instantly immersing visitors in UPP’s world of visual effects mastery.<br />\\n<!-- notionvc: ac4e158f-d8aa-4f18-8a0c-1a828e6de751 --></li>\\n</ul>`;

const newStrategyHtml = `<h2>The Strategy</h2>
<p>We brought website development and performance marketing together to create a connected digital experience. Our team designed and developed a new website to establish the brand's online presence and provide a destination for people interested in its residential projects.</p>
<p>Alongside the website, we ran targeted advertising campaigns across Facebook and Instagram using Meta Ads. The campaigns focused on reaching potential homebuyers and encouraging them to enquire about available property projects. With a focus on lead generation and cost-conscious campaign execution, we aimed to maximise the return from a limited advertising budget.</p>`;

const newStrategyRsc = `<h2>The Strategy</h2>\\n<p>We brought website development and performance marketing together to create a connected digital experience. Our team designed and developed a new website to establish the brand's online presence and provide a destination for people interested in its residential projects.</p>\\n<p>Alongside the website, we ran targeted advertising campaigns across Facebook and Instagram using Meta Ads. The campaigns focused on reaching potential homebuyers and encouraging them to enquire about available property projects. With a focus on lead generation and cost-conscious campaign execution, we aimed to maximise the return from a limited advertising budget.</p>`;

const addition = `${targetAnchor}
  text = text.replaceAll(${JSON.stringify(oldStrategyHtml)}, ${JSON.stringify(newStrategyHtml)});
  text = text.replaceAll(${JSON.stringify(oldStrategyRsc)}, ${JSON.stringify(newStrategyRsc)});`;

const updated = loc.replace(targetAnchor, addition);
fs.writeFileSync('src/lib/localize.mjs', updated, 'utf8');
console.log('Added The Strategy section replacement to localize.mjs');
