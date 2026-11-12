import fs from 'fs';

const htmlPath = 'reference/pages/interactfinancial_project_page.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const needle = '\"SingleImage_containedImage__N2jLD\\\",\\\"children\\\":[\\\"$\\\",\\\"$L2a\\\",null,{\\\"image\\\":{\\\"altText\\\":\\\"Interact Financial Responsive Devices\\\",\\\"srcSet\\\":\\\"/images/interact-financial-devices-mockup.jpg 1024w\\\",\\\"sourceUrl\\\":\\\"/images/interact-financial-devices-mockup.jpg\\\",\\\"mediaDetails\\\":{\\\"width\\\":1024,\\\"height\\\":1024}}}]}]}';

console.log('Includes needle:', html.includes(needle));

const replacement = '\"interactfinancial-dual-grid\\\",\\\"children\\\":[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"SingleImage_containedImage__N2jLD\\\",\\\"children\\\":[\\\"$\\\",\\\"$L2a\\\",null,{\\\"image\\\":{\\\"altText\\\":\\\"Interact Financial Responsive Devices\\\",\\\"srcSet\\\":\\\"/images/interact-financial-devices-mockup.jpg 1024w\\\",\\\"sourceUrl\\\":\\\"/images/interact-financial-devices-mockup.jpg\\\",\\\"mediaDetails\\\":{\\\"width\\\":1024,\\\"height\\\":1024}}}]}],[[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"SingleImage_containedImage__N2jLD\\\",\\\"children\\\":[\\\"$\\\",\\\"$L2a\\\",null,{\\\"image\\\":{\\\"altText\\\":\\\"Interact Financial Laptop Mockup\\\",\\\"srcSet\\\":\\\"/images/interact-financial-laptop-mockup.jpg 1024w\\\",\\\"sourceUrl\\\":\\\"/images/interact-financial-laptop-mockup.jpg\\\",\\\"mediaDetails\\\":{\\\"width\\\":1024,\\\"height\\\":1024}}}]}]]]}';

if (html.includes(needle)) {
  html = html.replace(needle, replacement);
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('Successfully updated HTML embedded flight data!');
}
