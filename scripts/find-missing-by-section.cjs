const fs = require('fs');
const cp = require('child_process');

const html0ef = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');
const pPushes0ef = [...html0ef.matchAll(/<script[^>]*>\s*self\.__next_f\.push\((.*?)\)<\/script>/gs)];

const defined = new Set();
pPushes0ef.forEach(p => {
  const s = JSON.parse(p[1])[1];
  [...s.matchAll(/([0-9a-f]+):I\[/g)].forEach(m => defined.add(m[1]));
});
console.log('Defined component IDs count:', defined.size);

const gitTree = cp.execSync('git show HEAD:reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', { encoding: 'utf8' });
const gitPushes = [...gitTree.matchAll(/<script[^>]*>\s*self\.__next_f\.push\((.*?)\)<\/script>/gs)];
const s15Git = JSON.parse(gitPushes.find(p => p[1].startsWith('[1,"e:[[['))[1])[1];
const parsedGit = JSON.parse(s15Git.slice(2));
const sections = parsedGit[2][3].children;

sections.forEach((sec, idx) => {
  const str = JSON.stringify(sec);
  const used = [...str.matchAll(/"\$L([0-9a-f]+)"/g)].map(m => m[1]);
  const missing = [...new Set(used)].filter(id => !defined.has(id));
  console.log('Section ' + idx + ' missing components: ' + missing.join(', '));
});
