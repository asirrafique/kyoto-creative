const fs = require('fs');
const cp = require('child_process');

const gitTree = cp.execSync('git show HEAD:reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', { encoding: 'utf8' });
const gitPushes = [...gitTree.matchAll(/<script[^>]*>\s*self\.__next_f\.push\((.*?)\)<\/script>/gs)];
const s15Git = JSON.parse(gitPushes.find(p => p[1].startsWith('[1,"e:[[['))[1])[1];
const parsedGit = JSON.parse(s15Git.slice(2));

const cbGit = parsedGit[2][3].children[3];
const blocksGit = cbGit[3].children;
console.log('Original Git cb blocks count:', blocksGit.length);
blocksGit.forEach((b, i) => {
  const str = JSON.stringify(b);
  const m = str.match(/https:[^"']+\.(?:mp4|png|jpg|webp)/);
  console.log(i + ' ' + b[1] + ' ' + (b[3] ? b[3].className : '') + ' -> ' + (m ? m[0] : 'no media'));
});
