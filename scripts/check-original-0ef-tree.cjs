const fs = require('fs');
const cp = require('child_process');

const gitTree = cp.execSync('git show HEAD:reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', { encoding: 'utf8' });
const gitPushes = [...gitTree.matchAll(/<script[^>]*>\s*self\.__next_f\.push\((.*?)\)<\/script>/gs)];
const s15Git = JSON.parse(gitPushes.find(p => p[1].startsWith('[1,"e:[[['))[1])[1];
const parsedGit = JSON.parse(s15Git.slice(2));

console.log('Original 0ef title:', parsedGit[0][0][3].children);
console.log('Original 0ef h1:', JSON.stringify(parsedGit[2][3].children[0][3].children[3].children[0]));
