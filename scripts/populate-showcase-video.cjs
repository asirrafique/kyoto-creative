const fs = require('fs');

let f = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');

// Replace the video tag inside the Video_video__2erdW section right before The Challenge
const target = `<section class="Video_video__2erdW"><div class="ImageEnter_image__FSEP_" data-fill="false"><div class="Video_videoContainer__21JKT"><div class="Video_loopVideo__1G4By"><span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR"><video loop="" muted="" playsInline=""></video></span></div></div></div></section>`;

const populated = `<section class="Video_video__2erdW"><div class="ImageEnter_image__FSEP_" data-fill="false"><div class="Video_videoContainer__21JKT"><div class="Video_loopVideo__1G4By"><span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR"><video loop="" muted="" playsinline="" autoplay="" src="https://kota-content.b-cdn.net/app/uploads/2025/04/All-Pages-3D-2.mp4"></video></span></div></div></div></section>`;

console.log('Includes target?:', f.includes(target));
f = f.replace(target, populated);

fs.writeFileSync('reference/pages/green_square_infra_project_page.html', f, 'utf8');
console.log('Populated 3D pages showcase video between Introduction and The Challenge!');
