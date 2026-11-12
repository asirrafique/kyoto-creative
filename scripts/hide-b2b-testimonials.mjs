import fs from 'fs';

let ref = fs.readFileSync('src/lib/reference.js', 'utf8');

const targetStyle = `  const b2bTechPageStyle = (route === '/b2b-tech-software-saas' || route === '/b2b-tech-software-saas/' || route === '/b2b-transformation' || route === '/b2b-transformation/')
    ? '<style>' +
      '.Statistics_statistics__op_op, ' +
      '.RelatedProjects_relatedProjects__opNhl, ' +
      (route.startsWith('/b2b-transformation') ? '.Testimonials_testimonials__l4UZd, ' : '') +
      '.dummy-class-end {' +
      '  display: none !important;' +
      '}' +
      '</style>'
    : '';`;

// Cleaner way without dummy-class:
const cleanStyle = `  const b2bTechPageStyle = (route === '/b2b-tech-software-saas' || route === '/b2b-tech-software-saas/' || route === '/b2b-transformation' || route === '/b2b-transformation/')
    ? '<style>' +
      '.Statistics_statistics__op_op, ' +
      '.RelatedProjects_relatedProjects__opNhl' +
      (route.startsWith('/b2b-transformation') ? ', .Testimonials_testimonials__l4UZd' : '') +
      ' {' +
      '  display: none !important;' +
      '}' +
      '</style>'
    : '';`;

const oldCode = `  const b2bTechPageStyle = (route === '/b2b-tech-software-saas' || route === '/b2b-tech-software-saas/' || route === '/b2b-transformation' || route === '/b2b-transformation/')
    ? '<style>' +
      '.Statistics_statistics__op_op, ' +
      '.RelatedProjects_relatedProjects__opNhl {' +
      '  display: none !important;' +
      '}' +
      '</style>'
    : '';`;

if (ref.includes(oldCode)) {
  ref = ref.replace(oldCode, cleanStyle);
  fs.writeFileSync('src/lib/reference.js', ref, 'utf8');
  console.log('Successfully updated b2bTechPageStyle to hide Testimonials on /b2b-transformation!');
} else {
  console.error('oldCode not found');
}
