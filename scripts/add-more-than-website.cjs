const fs = require('fs');

const htmlPath = 'reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html';
const rscPath = 'reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.rsc';

let html = fs.readFileSync(htmlPath, 'utf8');
let rsc = fs.readFileSync(rscPath, 'utf8');

// Build the "More Than a Website" section
const moreThanAWebsiteSection = `
<section class="TextLeftListRight_textLeftListRight__i5dfy" data-margin="default" data-right-empty="true" style="margin-top:2.5rem;margin-bottom:3.5rem;">
  <div class="container">
    <div class="TextLeftListRight_left__fjEbB">
      <span class="FadeIn_container__bjQVL" data-fill="false">
        <div class="prose">
          <h2>More Than a Website</h2>
          <p>We approached the project with a focus on how the brand should be perceived from the very first interaction. From the visual direction to the structure of the website, every element was designed to communicate professionalism, establish trust, and give the business a stronger digital identity.</p>
          <p>The result was a bespoke website built around the founder’s vision, creating a more compelling way to present the business and engage its audience online.</p>
        </div>
      </span>
    </div>
  </div>
</section>
`;

// Insert directly before <section class="Results_results__xMS5p"
const target = '<section class="Results_results__xMS5p"';

if (html.includes(target)) {
  html = html.replace(target, moreThanAWebsiteSection + target);
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('HTML updated with More Than a Website!');
} else {
  console.error('Target not found in HTML!');
}
