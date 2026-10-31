import fs from 'node:fs';

const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');

const targetStr = `text = text.replaceAll('A cinematic web\\r\\nexperience for a Hollywood\\r\\npowerhouse.', 'Turning Digital Marketing into a Lead Generation Engine');`;

const oldIntro1 = `<p>Universal Production Partners (UPP) is the VFX powerhouse behind some of Hollywood’s most visually stunning blockbusters, including <em>Barbie (2023)</em>, <em>Blade Runner 2049 (2017)</em>, and <em>Conclave (2024)</em>.</p>
<p>Their work pushes the boundaries of digital effects, crafting immersive, otherworldly visuals that elevate storytelling to an art form. When it came to their website, they needed something brave and equally ambitious—a digital experience that reflected the high-caliber artistry of their work.</p>`;

const oldIntroRsc = `<p>Universal Production Partners (UPP) is the VFX powerhouse behind some of Hollywood’s most visually stunning blockbusters, including <em>Barbie (2023)</em>, <em>Blade Runner 2049 (2017)</em>, and <em>Conclave (2024)</em>.</p>\\n<p>Their work pushes the boundaries of digital effects, crafting immersive, otherworldly visuals that elevate storytelling to an art form. When it came to their website, they needed something brave and equally ambitious—a digital experience that reflected the high-caliber artistry of their work.</p>`;

const newIntro = `<p>Green Square Infra operates in a competitive residential real estate market where reaching the right buyers and generating consistent property enquiries can make a real difference. Kyoto Creative partnered with Green Square Infra to strengthen its digital presence through a newly designed and developed website, supported by a targeted performance marketing strategy.</p>
<p>Our goal was to create more than an online presence. We wanted to build a digital foundation that could connect prospective homebuyers with Green Square Infra's residential projects and turn online interest into actionable enquiries.</p>`;

const newIntroRsc = `<p>Green Square Infra operates in a competitive residential real estate market where reaching the right buyers and generating consistent property enquiries can make a real difference. Kyoto Creative partnered with Green Square Infra to strengthen its digital presence through a newly designed and developed website, supported by a targeted performance marketing strategy.</p>\\n<p>Our goal was to create more than an online presence. We wanted to build a digital foundation that could connect prospective homebuyers with Green Square Infra's residential projects and turn online interest into actionable enquiries.</p>`;

const replacementCode = `${targetStr}
  text = text.replaceAll(${JSON.stringify(oldIntro1)}, ${JSON.stringify(newIntro)});
  text = text.replaceAll(${JSON.stringify(oldIntroRsc)}, ${JSON.stringify(newIntroRsc)});
  text = text.replace(/Universal Production Partners \\(UPP\\) is the VFX powerhouse[\\s\\S]*?reflected the high-caliber artistry of their work\\./g, ${JSON.stringify(
    `Green Square Infra operates in a competitive residential real estate market where reaching the right buyers and generating consistent property enquiries can make a real difference. Kyoto Creative partnered with Green Square Infra to strengthen its digital presence through a newly designed and developed website, supported by a targeted performance marketing strategy.\nOur goal was to create more than an online presence. We wanted to build a digital foundation that could connect prospective homebuyers with Green Square Infra's residential projects and turn online interest into actionable enquiries.`
  )});`;

const updated = loc.replace(targetStr, replacementCode);
fs.writeFileSync('src/lib/localize.mjs', updated, 'utf8');
console.log('Added UPP -> Green Square Infra introduction replacements!');
