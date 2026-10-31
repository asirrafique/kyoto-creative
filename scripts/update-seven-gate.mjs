import fs from 'node:fs';

const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');

const targetAnchor = `text = text.replaceAll('"title":"UPP","slug":"upp"', '"title":"Green Square Infra","slug":"green-square-infra"');`;

const additions = `${targetAnchor}
  text = text.replaceAll('"title":"Bucher + Suter","slug":"bucher-suter"', '"title":"Seven Gate Holdings","slug":"seven-gate-holdings"');
  text = text.replaceAll('\\"title\\":\\"Bucher + Suter\\",\\"slug\\":\\"bucher-suter\\"', '\\"title\\":\\"Seven Gate Holdings\\",\\"slug\\":\\"seven-gate-holdings\\"');
  text = text.replaceAll('Bucher + Suter', 'Seven Gate Holdings');
  text = text.replaceAll('/work/bucher-suter', '/work/seven-gate-holdings');`;

const updated = loc.replace(targetAnchor, additions);
fs.writeFileSync('src/lib/localize.mjs', updated, 'utf8');
console.log('Added Seven Gate Holdings replacements to localize.mjs');
