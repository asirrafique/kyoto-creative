const { execSync } = require('child_process');
const fs = require('fs');

const orig88 = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');
const p1Match = [...orig88.matchAll(/self\.__next_f\.push\(\[1,\s*"(.*?)"\]\)/gs)];
const p15 = p1Match[15][1];
const unescaped = JSON.parse('"' + p15 + '"');
const colonIdx = unescaped.indexOf(':');
const parsed88 = JSON.parse(unescaped.slice(colonIdx + 1));

const orig0ef = execSync('git show HEAD:reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', { maxBuffer: 10 * 1024 * 1024 }).toString('utf8');
const p0efMatch = [...orig0ef.matchAll(/self\.__next_f\.push\(\[1,\s*"(.*?)"\]\)/gs)];
const p14_0ef = p0efMatch[14][1];
const unescaped0ef = JSON.parse('"' + p14_0ef + '"');
const parsed0ef = JSON.parse(unescaped0ef.slice(unescaped0ef.indexOf(':') + 1));

// Let's test substituting sections one by one:
// Level 1: parsed88 with parsed0ef's Bento at index 1:
const testChildren = [...parsed88[2][3].children];
// Replace index 1 with 0ef's Bento:
testChildren.splice(1, 1, parsed0ef[2][3].children[1]); // Bento

parsed88[2][3].children = testChildren;

// Let's write this as e:[[[... into 0ef...html
const newTreeJson = JSON.stringify(parsed88);
const newPush = 'e:' + newTreeJson;
const newScriptTag = '<script>self.__next_f.push(' + JSON.stringify([1, newPush]).replaceAll('<', '\\u003c') + ')</script>';

// Take 0ef HTML, replace the e:[[[ script tag
let html = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');
html = html.replace(/<script>self\.__next_f\.push\(\[1,\s*"e:\[\[\[[\s\S]*?<\/script>/, newScriptTag);

fs.writeFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', html, 'utf8');
console.log('Saved test tree with 0ef Bento inserted!');
