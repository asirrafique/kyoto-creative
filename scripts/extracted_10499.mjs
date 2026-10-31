import fs from 'node:fs';

const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');

const targetStr = 'text = text.replaceAll(\'"title":"UPP","slug":"upp"\', \'"title":"Green Square Infra","slug":"green-square-infra"\');';
const addition = `text = text.replaceAll('A cinematic web experience for a Hollywood powerhouse.', 'Turning Digital Marketing into a Lead Generation Engine');
  text = text.replaceAll('A cinematic web\\nexperience for a Hollywood\\npowerhouse.', 'Turning Digital Marketing into a Lead Generation Engine');
  text = text.replaceAll('A cinematic web\\r\\nexperience for a Hollywood\\r\\npowerhouse.', 'Turning Digital Marketing into a Lead Generation Engine');`;

const updated = loc.replace(targetStr, `${targetStr}\n  ${addition}`);
fs.writeFileSync('src/lib/localize.mjs', updated, 'utf8');
console.log('localize.mjs updated with Green Square headline replacement.');
