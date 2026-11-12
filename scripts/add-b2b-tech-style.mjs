import fs from 'fs';

let ref = fs.readFileSync('src/lib/reference.js', 'utf8');

const targetStyle = `  const agenciesPageStyle = (route === '/agencies' || route === '/agencies/')
    ? '<style>' +
      '.Statistics_statistics__op_op, ' +
      '.RelatedProjects_relatedProjects__opNhl, ' +
      '.Testimonials_testimonials__l4UZd {' +
      '  display: none !important;' +
      '}' +
      '</style>'
    : '';
  const b2bTechPageStyle = (route === '/b2b-tech-software-saas' || route === '/b2b-tech-software-saas/')
    ? '<style>' +
      '.Statistics_statistics__op_op, ' +
      '.RelatedProjects_relatedProjects__opNhl {' +
      '  display: none !important;' +
      '}' +
      '</style>'
    : '';`;

const oldAgenciesStyle = `  const agenciesPageStyle = (route === '/agencies' || route === '/agencies/')
    ? '<style>' +
      '.Statistics_statistics__op_op, ' +
      '.RelatedProjects_relatedProjects__opNhl, ' +
      '.Testimonials_testimonials__l4UZd {' +
      '  display: none !important;' +
      '}' +
      '</style>'
    : '';`;

const oldHead = "  html = html.replace('<head>', '<head>' + agenciesPageStyle + partnersStyle";
const newHead = "  html = html.replace('<head>', '<head>' + agenciesPageStyle + b2bTechPageStyle + partnersStyle";

if (ref.includes(oldAgenciesStyle) && ref.includes(oldHead)) {
  ref = ref.replace(oldAgenciesStyle, targetStyle);
  ref = ref.replace(oldHead, newHead);
  fs.writeFileSync('src/lib/reference.js', ref, 'utf8');
  console.log('Successfully added b2bTechPageStyle to reference.js!');
} else {
  console.error('Target not found in reference.js');
}
