import fs from 'fs';

let ref = fs.readFileSync('src/lib/reference.js', 'utf8');

const broken = `      '.RelatedProjects_relatedProjects__opNhl {' +
      '  display: none !important;' +
      '</style>'`;

const fixed = `      '.RelatedProjects_relatedProjects__opNhl {' +
      '  display: none !important;' +
      '}' +
      '</style>'`;

// Handle both CRLF and LF
ref = ref.replace(
  "'.RelatedProjects_relatedProjects__opNhl {' +\r\n      '  display: none !important;' +\r\n      '</style>'",
  "'.RelatedProjects_relatedProjects__opNhl {' +\r\n      '  display: none !important;' +\r\n      '}' +\r\n      '</style>'"
);

ref = ref.replace(
  "'.RelatedProjects_relatedProjects__opNhl {' +\n      '  display: none !important;' +\n      '</style>'",
  "'.RelatedProjects_relatedProjects__opNhl {' +\n      '  display: none !important;' +\n      '}' +\n      '</style>'"
);

fs.writeFileSync('src/lib/reference.js', ref, 'utf8');
console.log('Fixed closing brace in leadcourtMockupStyle!');
