const fs = require('fs');
const cp = require('child_process');

const gitTree = cp.execSync('git show HEAD:reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', { encoding: 'utf8' });
const gitPushes = [...gitTree.matchAll(/<script[^>]*>\s*self\.__next_f\.push\((.*?)\)<\/script>/gs)];

const html88 = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');
const pPushes88 = [...html88.matchAll(/<script[^>]*>\s*self\.__next_f\.push\((.*?)\)<\/script>/gs)];

const s15Git = JSON.parse(gitPushes.find(p => p[1].startsWith('[1,"e:[[['))[1])[1];
const s1588 = JSON.parse(pPushes88[15][1])[1];

console.log('s15Git len:', s15Git.length);
console.log('s1588 len:', s1588.length);

const parsedGit = JSON.parse(s15Git.slice(2));
const parsed88 = JSON.parse(s1588.slice(2));

const sectionsGit = parsedGit[2][3].children;
const sections88 = parsed88[2][3].children;

console.log('Git sections count:', sectionsGit.length);
console.log('88 sections count:', sections88.length);

sectionsGit.forEach((s, i) => {
  console.log('Git section ' + i + ': ' + (s ? s[1] : 'null') + ' ' + (s && s[3] ? s[3].className : ''));
});
console.log('---');
sections88.forEach((s, i) => {
  console.log('88 section ' + i + ': ' + (s ? s[1] : 'null') + ' ' + (s && s[3] ? s[3].className : ''));
});
