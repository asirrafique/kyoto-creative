import fs from 'fs';

let ms = fs.readFileSync('src/lib/media-scheduling.js', 'utf8');
const target = "{ selector: '.Bento_media1__Zf6n4 video', src: 'https://kota-content.b-cdn.net/app/uploads/2025/04/Square-Rotating-Cube2.mp4' },";

if (ms.includes(target)) {
  ms = ms.replace(target, '');
  fs.writeFileSync('src/lib/media-scheduling.js', ms, 'utf8');
  console.log('Successfully removed Square-Rotating-Cube2 from media-scheduling.js!');
} else {
  console.log('Target not found in media-scheduling.js');
}
