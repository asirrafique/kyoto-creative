const fs = require('fs');
const cp = require('child_process');

const html0ef = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');
const pPushes0ef = [...html0ef.matchAll(/<script[^>]*>\s*self\.__next_f\.push\((.*?)\)<\/script>/gs)];
const s15_0ef = JSON.parse(pPushes0ef[15][1])[1];
const parsed = JSON.parse(s15_0ef.slice(2));
const e2 = parsed[2];

const gitTree = cp.execSync('git show HEAD:reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', { encoding: 'utf8' });
const gitPushes = [...gitTree.matchAll(/<script[^>]*>\s*self\.__next_f\.push\((.*?)\)<\/script>/gs)];
const s15Git = JSON.parse(gitPushes.find(p => p[1].startsWith('[1,"e:[[['))[1])[1];
const parsedGit = JSON.parse(s15Git.slice(2));

const bentoGit = parsedGit[2][3].children[1];
console.log('bentoGit className:', bentoGit[3].className);

e2[3].children[1] = bentoGit;

const newS15 = 'e:' + JSON.stringify(parsed);
console.log('New s15 valid JSON? Length:', newS15.length);

const oldScript = pPushes0ef[15][0];
const newScript = '<script>self.__next_f.push(' + JSON.stringify([1, newS15]) + ')</script>';

const updatedHtml = html0ef.replace(oldScript, newScript);
fs.writeFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', updatedHtml, 'utf8');
console.log('Successfully placed Bento section back into 0ef flight tree!');
