const fs = require('fs');

const pilotHtml = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');
const gsHtml = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

function getBodyDom(html) {
  const bodyStart = html.indexOf('<body>') + 6;
  const scriptStart = html.indexOf('<script', bodyStart);
  return html.slice(bodyStart, scriptStart);
}

const pilotDom = getBodyDom(pilotHtml);
const gsDom = getBodyDom(gsHtml);

console.log('pilotDom length:', pilotDom.length);
console.log('gsDom length:', gsDom.length);

fs.writeFileSync('scripts/pilotDom.html', pilotDom, 'utf8');
fs.writeFileSync('scripts/gsDom.html', gsDom, 'utf8');
console.log('Saved pilotDom and gsDom!');
