import fs from 'fs';

let html = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');

const targetStr = '<section class="ContentBuilder_contentBuilder__FAKQG"><section data-margin="default"><div><section class="Video_video__2erdW"><div class="ImageEnter_image__FSEP_" data-fill="false"><div class="Video_videoContainer__21JKT"><div class="Video_loopVideo__1G4By"><span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR"><video loop="" muted="" playsinline="" autoplay="" src="https://kota-content.b-cdn.net/app/uploads/2025/04/All-Pages-3D-2.mp4" preload="auto" onloadeddata="this.play()"></video></span></div></div></div></section></div></section>';

const replacementStr = '<section class="ContentBuilder_contentBuilder__FAKQG">';

console.log('Found target in HTML:', html.includes(targetStr));
if (html.includes(targetStr)) {
  html = html.replace(targetStr, replacementStr);
  fs.writeFileSync('reference/pages/green_square_infra_project_page.html', html, 'utf8');
  console.log('Removed video from HTML successfully!');
} else {
  // Try finding by All-Pages-3D-2.mp4
  const idx = html.indexOf('All-Pages-3D-2.mp4');
  if (idx !== -1) {
    const secStart = html.lastIndexOf('<section data-margin="default">', idx);
    const secEnd = html.indexOf('</section>', html.indexOf('</div></section>', idx) + 16);
    console.log('secStart:', secStart, 'secEnd:', secEnd);
    if (secStart !== -1 && secEnd !== -1) {
      html = html.slice(0, secStart) + html.slice(secEnd + '</section>'.length);
      fs.writeFileSync('reference/pages/green_square_infra_project_page.html', html, 'utf8');
      console.log('Sliced out video section from HTML!');
    }
  }
}
