const fs = require('fs');

let html0ef = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

const bentoReplacements = [
  {
    target: '<div class="Bento_media1__Zf6n4" data-animation="grid-item"><span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR"><video loop="" muted="" playsInline=""></video></span></div>',
    replace: '<div class="Bento_media1__Zf6n4" data-animation="grid-item"><span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR"><video loop="" muted="" playsInline="" autoPlay="" src="https://kota-content.b-cdn.net/app/uploads/2025/04/Square-Rotating-Cube2.mp4"></video></span></div>'
  },
  {
    target: '<div class="Bento_media2__Z_9Z_" data-animation="grid-item"><span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR"><video loop="" muted="" playsInline=""></video></span></div>',
    replace: '<div class="Bento_media2__Z_9Z_" data-animation="grid-item"><span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR"><video loop="" muted="" playsInline="" autoPlay="" src="https://kota-content.b-cdn.net/app/uploads/2025/04/Bento-Right2.mp4"></video></span></div>'
  },
  {
    target: '<div class="Bento_media3__Je_Pc" data-animation="grid-item"><span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR"><video loop="" muted="" playsInline=""></video></span></div>',
    replace: '<div class="Bento_media3__Je_Pc" data-animation="grid-item"><span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR"><video loop="" muted="" playsInline="" autoPlay="" src="https://kota-content.b-cdn.net/app/uploads/2025/04/Bento-Earth-Spin2.mp4"></video></span></div>'
  },
  {
    target: '<div class="Bento_media4__xfRDt" data-animation="grid-item"><span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR"><video loop="" muted="" playsInline=""></video></span></div>',
    replace: '<div class="Bento_media4__xfRDt" data-animation="grid-item"><span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR"><video loop="" muted="" playsInline="" autoPlay="" src="https://kota-content.b-cdn.net/app/uploads/2025/04/Right-Side-Mobile-Devices5.mp4"></video></span></div>'
  }
];

bentoReplacements.forEach((r, idx) => {
  console.log('Target ' + idx + ' found: ' + html0ef.includes(r.target));
  if (html0ef.includes(r.target)) {
    html0ef = html0ef.replace(r.target, r.replace);
  }
});

fs.writeFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', html0ef, 'utf8');
console.log('Saved bento videos with src and autoplay in HTML!');
