import fs from 'fs';

let ref = fs.readFileSync('src/lib/reference.js', 'utf8');

// 1. Add agenciesPageStyle
const agenciesStyleCode = `  const agenciesPageStyle = (route === '/agencies' || route === '/agencies/')
    ? '<style>' +
      '.Statistics_statistics__op_op, ' +
      '.RelatedProjects_relatedProjects__opNhl, ' +
      '.Testimonials_testimonials__l4UZd {' +
      '  display: none !important;' +
      '}' +
      '</style>'
    : '';\n`;

// Place before html = html.replace('<head>'
const headTarget = "  html = html.replace('<head>', '<head>' + partnersStyle";

if (ref.includes(headTarget)) {
  ref = ref.replace(headTarget, agenciesStyleCode + "  html = html.replace('<head>', '<head>' + agenciesPageStyle + partnersStyle");
  fs.writeFileSync('src/lib/reference.js', ref, 'utf8');
  console.log('Successfully added agenciesPageStyle to reference.js!');
} else {
  console.error('headTarget not found');
}
