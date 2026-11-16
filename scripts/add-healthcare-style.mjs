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

const anchor = "  const b2bTechPageStyle = (route === '/b2b-tech-software-saas'";

if (ref.includes(anchor)) {
  ref = ref.replace(anchor, targetSnippet + anchor);
  
  const headOld = "  html = html.replace('<head>', '<head>' + agenciesPageStyle + b2bTechPageStyle + partnersStyle";
  const headNew = "  html = html.replace('<head>', '<head>' + agenciesPageStyle + b2bTechPageStyle + healthcarePageStyle + partnersStyle";
  
  if (ref.includes(headOld)) {
    ref = ref.replace(headOld, headNew);
    fs.writeFileSync('src/lib/reference.js', ref, 'utf8');
    console.log('Successfully added healthcarePageStyle to reference.js!');
  } else {
    console.error('headOld not found in reference.js');
  }
} else {
  console.error('anchor not found in reference.js');
}
