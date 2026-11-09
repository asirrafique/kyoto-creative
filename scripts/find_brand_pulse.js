const fs = require('fs');

const dir = 'reference/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const foundComponents = new Set();
const buttonParents = new Set();

for (const f of files) {
  const c = fs.readFileSync(dir + '/' + f, 'utf8');
  if (c.includes('brand-pulse') || c.includes('Brand Pulse')) {
    // Check BrandPulseBanner
    if (c.includes('BrandPulseBanner')) foundComponents.add('BrandPulseBanner');
    // Check TextImageRows button or section
    if (c.includes('Try the Brand Pulse Audit tool')) foundComponents.add('Try the Brand Pulse Audit tool (button text)');
    
    // Check what elements have href="/brand-pulse"
    let idx = 0;
    while ((idx = c.indexOf('/brand-pulse', idx)) !== -1) {
      const openTag = c.lastIndexOf('<', idx);
      const closeTag = c.indexOf('>', idx);
      const tagStr = c.substring(openTag, closeTag + 1);
      buttonParents.add(tagStr);
      idx += 12;
    }
  }
}

console.log('Components:', [...foundComponents]);
console.log('Tags with href="/brand-pulse":', [...buttonParents]);
