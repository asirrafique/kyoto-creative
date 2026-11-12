import fs from 'fs';

let ref = fs.readFileSync('src/lib/reference.js', 'utf8');

const targetRule = `      '.SingleImage_containedImage__N2jLD .Video_loopVideo__1G4By video,' +
      '.SingleImage_containedImage__N2jLD .Video_videoContainer__21JKT video {' +
      '  opacity: 0 !important;' +
      '  visibility: hidden !important;' +
      '  pointer-events: none !important;' +
      '}' +
      '.RelatedProjects_relatedProjects__opNhl {' +
      '  display: none !important;' +
      '}' +
      '</style>'`;

const oldRule = `      '.SingleImage_containedImage__N2jLD .Video_loopVideo__1G4By video,' +
      '.SingleImage_containedImage__N2jLD .Video_videoContainer__21JKT video {' +
      '  opacity: 0 !important;' +
      '  visibility: hidden !important;' +
      '  pointer-events: none !important;' +
      '}' +
      '</style>'`;

if (ref.includes(oldRule)) {
  ref = ref.replace(oldRule, targetRule);
  fs.writeFileSync('src/lib/reference.js', ref, 'utf8');
  console.log('Successfully added RelatedProjects display:none to leadcourtMockupStyle!');
} else {
  console.error('Old rule not found in reference.js');
}
