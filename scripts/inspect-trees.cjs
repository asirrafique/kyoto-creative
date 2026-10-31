const fs = require('fs');

const orig88 = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');
const p1Match = [...orig88.matchAll(/self\.__next_f\.push\(\[1,\s*"(.*?)"\]\)/gs)];
const p15 = p1Match[15][1];
const unescaped = JSON.parse('"' + p15 + '"');
const colonIdx = unescaped.indexOf(':');
const jsonStr = unescaped.slice(colonIdx + 1);
const parsed = JSON.parse(jsonStr);

// In parsed[2][3].children:
// parsed[2][3].children[0] is Hero
// parsed[2][3].children[1] is TextLeftListRight
// parsed[2][3].children[2] is Intro
// parsed[2][3].children[3] is ContentBuilder
// parsed[2][3].children[4] is RelatedPosts
// parsed[2][3].children[5] is RelatedProjects
// parsed[2][3].children[6] is $L34

// Let's inspect the Bento component from original 0ef:
const { execSync } = require('child_process');
const orig0ef = execSync('git show HEAD:reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', { maxBuffer: 10 * 1024 * 1024 }).toString('utf8');
const p0efMatch = [...orig0ef.matchAll(/self\.__next_f\.push\(\[1,\s*"(.*?)"\]\)/gs)];
const p14_0ef = p0efMatch[14][1];
const unescaped0ef = JSON.parse('"' + p14_0ef + '"');
const jsonStr0ef = unescaped0ef.slice(unescaped0ef.indexOf(':') + 1);
const parsed0ef = JSON.parse(jsonStr0ef);

console.log('Original 0ef children types:');
parsed0ef[2][3].children.forEach((c, i) => {
  console.log(i, c ? c[0] : null, c && c[3] ? c[3].className : null);
});

// Let's create a combined tree with 0ef's Bento, Intro, ContentBuilder!
