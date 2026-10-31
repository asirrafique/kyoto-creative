const fs = require('fs');

const f = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html');
// read from git head
const { execSync } = require('child_process');
const gitBuf = execSync('git show HEAD:reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html');

console.log('Work file length:', f.length, 'Git buf length:', gitBuf.length);
console.log('Equal?', f.equals(gitBuf));
if (!f.equals(gitBuf)) {
  for (let i = 0; i < Math.min(f.length, gitBuf.length); i++) {
    if (f[i] !== gitBuf[i]) {
      console.log('First diff at byte', i, 'f:', f[i], 'git:', gitBuf[i]);
      break;
    }
  }
}
