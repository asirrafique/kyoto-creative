const fs = require('fs');
const cp = require('child_process');

const gitTree = cp.execSync('git show HEAD:reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', { encoding: 'utf8' });
const gitPushes = [...gitTree.matchAll(/<script[^>]*>\s*self\.__next_f\.push\((.*?)\)<\/script>/gs)];
const s15Git = JSON.parse(gitPushes.find(p => p[1].startsWith('[1,"e:[[['))[1])[1];
const parsedGit = JSON.parse(s15Git.slice(2));

const html88 = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');
const pPushes88 = [...html88.matchAll(/<script[^>]*>\s*self\.__next_f\.push\((.*?)\)<\/script>/gs)];
const s1588 = JSON.parse(pPushes88[15][1])[1];
const parsed88 = JSON.parse(s1588.slice(2));

console.log('e[0] equal:', JSON.stringify(parsedGit[0]) === JSON.stringify(parsed88[0]));
console.log('e[1] equal:', JSON.stringify(parsedGit[1]) === JSON.stringify(parsed88[1]));

const secGit = parsedGit[2][3].children;
const sec88 = parsed88[2][3].children;

console.log('secGit.length:', secGit.length, 'sec88.length:', sec88.length);
for (let i = 0; i < secGit.length; i++) {
  console.log('Section ' + i + ' equal: ' + (JSON.stringify(secGit[i]) === JSON.stringify(sec88[i])));
}
