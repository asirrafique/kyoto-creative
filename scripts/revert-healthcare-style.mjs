import fs from 'fs';

let ref = fs.readFileSync('src/lib/reference.js', 'utf8');

const targetSnippet = `  const healthcarePageStyle = (route === '/healthcare' || route === '/healthcare/')
    ? '<style>' +
      '.Statistics_statistics__op_op, ' +
      '.RelatedProjects_relatedProjects__opNhl, ' +
      '.RelatedPosts_relatedPosts__xfLkb {' +
      '  display: none !important;' +
      '}' +
      '</style>'
    : '';\n`;

if (ref.includes(targetSnippet)) {
  ref = ref.replace(targetSnippet, '');
  ref = ref.replace('healthcarePageStyle + ', '');
  fs.writeFileSync('src/lib/reference.js', ref, 'utf8');
  console.log('Successfully reverted healthcarePageStyle from src/lib/reference.js!');
} else {
  console.error('Target snippet not found in reference.js');
}
