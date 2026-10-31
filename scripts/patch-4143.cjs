const fs = require('fs');

const path = 'public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/4143-6b83e17252ec01c2.js';
let content = fs.readFileSync(path, 'utf8');

const target1 = 'this.activeBackground=m[Number(this.container.dataset.background)],';
console.log('Target1 found:', content.includes(target1));

if (content.includes(target1)) {
  const replacement1 = 'this.activeBackground=m[Number(this.container.dataset.background)]||m[0]||{timeStart:0},';
  content = content.replace(target1, replacement1);
}

const target2 = 'this.time=this.activeBackground.timeStart,';
console.log('Target2 found:', content.includes(target2));

if (content.includes(target2)) {
  const replacement2 = 'this.time=(this.activeBackground&&this.activeBackground.timeStart)||0,';
  content = content.replace(target2, replacement2);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully patched activeBackground in 4143 chunk!');
