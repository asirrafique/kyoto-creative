import fs from 'fs';

let ref = fs.readFileSync('src/lib/reference.js', 'utf8');

const targetStr = "'  pointer-events: none !important;' +";
const leadIdx = ref.indexOf('leadcourtMockupStyle');
const ruleIdx = ref.indexOf(targetStr, ref.indexOf('leadcourt-analytics', leadIdx));

if (ruleIdx !== -1) {
  const insertPos = ruleIdx + targetStr.length;
  const insertContent = "\r\n      '}' +\r\n      '.RelatedProjects_relatedProjects__opNhl {' +\r\n      '  display: none !important;' +";
  const oldClosing = "\r\n      '}' +";
  // Check if oldClosing follows immediately
  if (ref.startsWith(oldClosing, insertPos)) {
    ref = ref.slice(0, insertPos) + insertContent + ref.slice(insertPos + oldClosing.length);
    fs.writeFileSync('src/lib/reference.js', ref, 'utf8');
    console.log('Successfully updated leadcourtMockupStyle with RelatedProjects hide rule!');
  } else {
    console.log('Old closing does not follow insertPos');
  }
} else {
  console.log('ruleIdx not found');
}
