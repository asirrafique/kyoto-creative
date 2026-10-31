const fs = require('fs');

const filePath = 'reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html';
let html = fs.readFileSync(filePath, 'utf8');

// 1. Replace "More Than a Website" heading and copy
const oldIntroHtml = `<p><strong>More Than a Website</strong></p><p>We approached the project with a focus on how the brand should be perceived from the very first interaction. From the visual direction to the structure of the website, every element was designed to communicate professionalism, establish trust, and give the business a stronger digital identity.</p>
<p>The result was a bespoke website built around the founder’s vision, creating a more compelling way to present the business and engage its audience online.</p>`;

const oldIntroHtml_CRLF = `<p><strong>More Than a Website</strong></p><p>We approached the project with a focus on how the brand should be perceived from the very first interaction. From the visual direction to the structure of the website, every element was designed to communicate professionalism, establish trust, and give the business a stronger digital identity.</p>\r\n<p>The result was a bespoke website built around the founder’s vision, creating a more compelling way to present the business and engage its audience online.</p>`;

const newIntroHtml = `<h2>Bringing the Founder’s Vision to Life</h2>
<p>Seven Gate Holdings came to Kyoto Creative with a clear ambition: to build a world-class website that reflected the quality, credibility, and vision of the business. Our role was to translate that ambition into a refined digital experience, bringing together thoughtful design, clear messaging, and a polished user journey.</p>`;

console.log('Includes oldIntroHtml?:', html.includes(oldIntroHtml) || html.includes(oldIntroHtml_CRLF));
html = html.replace(oldIntroHtml_CRLF, newIntroHtml);
html = html.replace(oldIntroHtml, newIntroHtml);

// 2. Replace the tags:
// From:
// <div style="white-space:nowrap;font-size:1.1rem;font-weight:500;letter-spacing:-0.01em;padding:12px 0"><p>Website Design &amp; Development · Brand Experience · Digital Strategy</p></div>
// To multi-line:
// Website Design & Development · <br>Brand Experience · <br>Digital Strategy
const oldTagsHtml = `<div style="white-space:nowrap;font-size:1.1rem;font-weight:500;letter-spacing:-0.01em;padding:12px 0"><p>Website Design &amp; Development · Brand Experience · Digital Strategy</p></div>`;

const newTagsHtml = `<div style="font-size:1.1rem;font-weight:500;letter-spacing:-0.01em;padding:12px 0;line-height:1.7"><p style="margin:0">Website Design &amp; Development ·<br/>Brand Experience ·<br/>Digital Strategy</p></div>`;

console.log('Includes oldTagsHtml?:', html.includes(oldTagsHtml));
html = html.replace(oldTagsHtml, newTagsHtml);

// Hide or adjust the "Visit site" button to point to Seven Gate Holdings
html = html.replace('href="https://www.bucher-suter.com/"', 'href="#"');

fs.writeFileSync(filePath, html, 'utf8');

// Also update .rsc if needed
const rscPath = 'reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.rsc';
let rsc = fs.readFileSync(rscPath, 'utf8');
rsc = rsc.replaceAll('href="https://www.bucher-suter.com/"', 'href="#"');
fs.writeFileSync(rscPath, rsc, 'utf8');

console.log('Successfully updated Seven Gate Holdings content!');
