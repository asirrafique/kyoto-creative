import fs from 'node:fs';

const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');

const targetAnchor = `text = text.replaceAll('A cinematic web\\r\\nexperience for a Hollywood\\r\\npowerhouse.', 'Turning Digital Marketing into a Lead Generation Engine');`;

const oldChallengeHtml = `<h3>A website worthy of Hollywood’s finest</h3>
<p>We wanted UPP’s site to reflect the cinematic depth, artistry, and innovation that define their work. It had to be an <span class="notion-enable-hover" data-token-index="1">immersive, seamless, and boundary-pushing website</span>—one that transports visitors into their world from the moment they land.</p>
<p>Far from a traditional website, it feels like stepping into an immersive corridor. As you navigate, you walk through a digital space filled with beautiful reflections, expansive skies, and cinematic lighting effects that echo the artistry of UPP’s work.</p>`;

const oldChallengeRsc = `<h3>A website worthy of Hollywood’s finest</h3>\\n<p>We wanted UPP’s site to reflect the cinematic depth, artistry, and innovation that define their work. It had to be an <span class=\\"notion-enable-hover\\" data-token-index=\\"1\\">immersive, seamless, and boundary-pushing website</span>—one that transports visitors into their world from the moment they land.</p>\\n<p>Far from a traditional website, it feels like stepping into an immersive corridor. As you navigate, you walk through a digital space filled with beautiful reflections, expansive skies, and cinematic lighting effects that echo the artistry of UPP’s work.</p>`;

const newChallengeHtml = `<h2>The Challenge</h2>
<p>Real estate marketing requires more than visibility. Potential buyers need to discover a project, understand its offering, and feel encouraged to take the next step. At the same time, advertising costs can quickly add up in a competitive market, making efficient lead generation essential.</p>
<p>Green Square Infra needed a digital approach that combined a professional online presence with targeted advertising, helping the brand reach prospective buyers and generate property enquiries while keeping the initial advertising budget lean.</p>`;

const newChallengeRsc = `<h2>The Challenge</h2>\\n<p>Real estate marketing requires more than visibility. Potential buyers need to discover a project, understand its offering, and feel encouraged to take the next step. At the same time, advertising costs can quickly add up in a competitive market, making efficient lead generation essential.</p>\\n<p>Green Square Infra needed a digital approach that combined a professional online presence with targeted advertising, helping the brand reach prospective buyers and generate property enquiries while keeping the initial advertising budget lean.</p>`;

const addition = `${targetAnchor}
  text = text.replaceAll(${JSON.stringify(oldChallengeHtml)}, ${JSON.stringify(newChallengeHtml)});
  text = text.replaceAll(${JSON.stringify(oldChallengeRsc)}, ${JSON.stringify(newChallengeRsc)});`;

const updated = loc.replace(targetAnchor, addition);
fs.writeFileSync('src/lib/localize.mjs', updated, 'utf8');
console.log('Added The Challenge section replacement to localize.mjs');
