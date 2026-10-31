const fs = require('fs');

let f = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');

// The contained video section between Challenge and Strategy:
const oldContainedVideo = `<div class="SingleImage_containedImage__N2jLD"><section class="Video_video__2erdW"><div class="ImageEnter_image__FSEP_" data-fill="false"><div class="Video_videoContainer__21JKT"><div class="Video_loopVideo__1G4By"><span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR"><video loop="" muted="" playsInline=""></video></span></div></div></div></section></div>`;

const newContainedVideo = `<div class="SingleImage_containedImage__N2jLD"><section class="Video_video__2erdW"><div class="ImageEnter_image__FSEP_" data-fill="false"><div class="Video_videoContainer__21JKT"><div class="Video_loopVideo__1G4By"><span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR"><video loop="" muted="" playsinline="" autoplay="" preload="auto" onloadeddata="this.play()" src="https://kota-content.b-cdn.net/app/uploads/2025/04/Zoom-In-New.mp4"></video></span></div></div></div></section></div>`;

console.log('Includes oldContainedVideo?:', f.includes(oldContainedVideo));
f = f.replace(oldContainedVideo, newContainedVideo);

fs.writeFileSync('reference/pages/green_square_infra_project_page.html', f, 'utf8');
console.log('Successfully added Zoom-In-New video between The Challenge and The Strategy!');
