import fs from 'fs';

let ms = fs.readFileSync('src/lib/media-scheduling.js', 'utf8');
const target = "{ selector: '.Video_loopVideo__1G4By video', src: 'https://kota-content.b-cdn.net/app/uploads/2025/04/All-Pages-3D-2.mp4' },";

if (ms.includes(target)) {
  ms = ms.replace(target, '');
  fs.writeFileSync('src/lib/media-scheduling.js', ms, 'utf8');
  console.log('Successfully removed from media-scheduling.js!');
} else {
  console.error('Target not found in media-scheduling.js');
}
