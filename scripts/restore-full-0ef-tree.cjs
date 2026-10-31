const fs = require('fs');
const cp = require('child_process');

const gitTree = cp.execSync('git show HEAD:reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', { encoding: 'utf8' });
const gitPushes = [...gitTree.matchAll(/<script[^>]*>\s*self\.__next_f\.push\((.*?)\)<\/script>/gs)];
let s15Git = JSON.parse(gitPushes.find(p => p[1].startsWith('[1,"e:[[['))[1])[1];

// Replace strings in flight stream
s15Git = s15Git.replace('A cinematic web experience for a Hollywood powerhouse.', 'Turning Digital Marketing into a Lead Generation Engine');
s15Git = s15Git.replace('UPP - KOTA', 'Green Square Infra - Kyoto Creative');

const parsedGit = JSON.parse(s15Git.slice(2));
console.log('Valid JSON! Sections count:', parsedGit[2][3].children.length);

let html0ef = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');
const pPushes0ef = [...html0ef.matchAll(/<script[^>]*>\s*self\.__next_f\.push\((.*?)\)<\/script>/gs)];
const currentScript15 = pPushes0ef[15][0];

const newScript15 = '<script>self.__next_f.push(' + JSON.stringify([1, s15Git]) + ')</script>';
html0ef = html0ef.replace(currentScript15, newScript15);

fs.writeFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', html0ef, 'utf8');
console.log('Saved 0ef with complete original 18-block ContentBuilder tree!');
