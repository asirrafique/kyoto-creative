const fs = require('fs');

const jsPath = 'public/__static/7113233e48e763ff/__assets/kota.co.uk/_next/static/chunks/app/agency/page-4ecdeefc9091d461.js';
let js = fs.readFileSync(jsPath, 'utf8');

const target = '_(222),_(244),{render:{sprite:{texture:"/matter/kota-logo.png",xScale:m<1920?.4:m/1400*.5,yScale:m<1920?.4:m/1400*.5}}}';
console.log('Target found index:', js.indexOf(target));

if (js.indexOf(target) !== -1) {
  // 666 x 375 aspect ratio is 1.776:1
  // Scale width slightly to match visual appearance and maintain proportional collision box
  const replacement = '_(266),_(150),{render:{sprite:{texture:"/matter/kota-logo.png",xScale:m<1920?.4:m/1400*.5,yScale:m<1920?.4:m/1400*.5}}}';
  js = js.replace(target, replacement);
  fs.writeFileSync(jsPath, js, 'utf8');
  console.log('Successfully updated hitbox dimensions!');
} else {
  console.log('Target not found or already updated.');
}
