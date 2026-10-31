const { execSync } = require('child_process');
const fs = require('fs');

// 1. Get original git version of 0ef...html
const original0ef = execSync('git show HEAD:reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', { maxBuffer: 10 * 1024 * 1024 }).toString('utf8');

// 2. In original 0ef, push 15 (35:I[57372...]) is AFTER push 14 (e:[[[...).
// Moving push 15 before push 14 so $L35 is available:
const p14Idx = original0ef.indexOf('self.__next_f.push([1,"e:[[[');
const p15Idx = original0ef.indexOf('self.__next_f.push([1,"35:I[57372');

let testHtml;
if (p15Idx > p14Idx) {
  const p15End = original0ef.indexOf('</script>', p15Idx) + 9;
  const p15Script = original0ef.slice(p15Idx - 8, p15End); // <script>self.__next_f.push...
  const withoutP15 = original0ef.slice(0, p15Idx - 8) + original0ef.slice(p15End);
  testHtml = withoutP15.replace('<script>self.__next_f.push([1,"e:[[[', p15Script + '<script>self.__next_f.push([1,"e:[[[');
} else {
  testHtml = original0ef;
}

// 3. Inject bento video autoPlay and sources
testHtml = testHtml.replace('Kota-Bento-Green2-1.mp4" playsinline="" loop="" preload="none"', 'Kota-Bento-Green2-1.mp4" playsinline="" loop="" autoPlay="" muted=""');
testHtml = testHtml.replace('<video playsinline="" loop="" preload="none" class="BentoGrid_itemVideo__vXq4V BentoGrid_videoSquare__lV6fR"></video>', '<video playsinline="" loop="" autoPlay="" muted="" class="BentoGrid_itemVideo__vXq4V BentoGrid_videoSquare__lV6fR" src="https://kota-content.b-cdn.net/app/uploads/2025/04/Square-Rotating-Cube2.mp4"></video>');
testHtml = testHtml.replace('<video playsinline="" loop="" preload="none" class="BentoGrid_itemVideo__vXq4V BentoGrid_videoSquareMobileRight__4vV96 BentoGrid_videoSquareMobile__d_9K5"></video>', '<video playsinline="" loop="" autoPlay="" muted="" class="BentoGrid_itemVideo__vXq4V BentoGrid_videoSquareMobileRight__4vV96 BentoGrid_videoSquareMobile__d_9K5" src="https://kota-content.b-cdn.net/app/uploads/2025/04/Bento-Right2.mp4"></video>');
testHtml = testHtml.replace('<video playsinline="" loop="" preload="none" class="BentoGrid_itemVideo__vXq4V BentoGrid_videoPortrait__D1V2g"></video>', '<video playsinline="" loop="" autoPlay="" muted="" class="BentoGrid_itemVideo__vXq4V BentoGrid_videoPortrait__D1V2g" src="https://kota-content.b-cdn.net/app/uploads/2025/04/Bento-Earth-Spin2.mp4"></video>');
testHtml = testHtml.replace('<video playsinline="" loop="" preload="none" class="BentoGrid_itemVideo__vXq4V BentoGrid_videoSquareMobileLeft__F20zU BentoGrid_videoSquareMobile__d_9K5"></video>', '<video playsinline="" loop="" autoPlay="" muted="" class="BentoGrid_itemVideo__vXq4V BentoGrid_videoSquareMobileLeft__F20zU BentoGrid_videoSquareMobile__d_9K5" src="https://kota-content.b-cdn.net/app/uploads/2025/04/Right-Side-Mobile-Devices5.mp4"></video>');

fs.writeFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', testHtml, 'utf8');
console.log('Wrote reordered original 0ef with bento videos!');
