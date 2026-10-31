const fs = require('fs');

let f = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');

// Replace the Bento section with exact media and layout from the user screenshot:
const bentoRegex = /<section class="Bento_bento__pskN5">[\s\S]*?<\/section>/;

const bentoHtml = `<section class="Bento_bento__pskN5"><div class="container"><div class="StaggeredItems_grid__5Yycm"><div class="Bento_bentoGrid__25th6">
  <div class="Bento_media1__Zf6n4" data-animation="grid-item">
    <span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR">
      <video loop="" muted="" playsinline="" autoplay="" src="https://kota-content.b-cdn.net/app/uploads/2025/04/Square-Rotating-Cube2.mp4"></video>
    </span>
  </div>
  <div class="Bento_media2__Z_9Z_" data-animation="grid-item">
    <span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR">
      <video loop="" muted="" playsinline="" autoplay="" src="https://kota-content.b-cdn.net/app/uploads/2025/04/Bento-Right2.mp4"></video>
    </span>
  </div>
  <div class="Bento_media3__Je_Pc" data-animation="grid-item">
    <span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR">
      <video loop="" muted="" playsinline="" autoplay="" src="https://kota-content.b-cdn.net/app/uploads/2025/04/Bento-Earth-Spin2.mp4"></video>
    </span>
  </div>
  <div class="Bento_media4__xfRDt" data-animation="grid-item">
    <span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR">
      <video loop="" muted="" playsinline="" autoplay="" src="https://kota-content.b-cdn.net/app/uploads/2025/04/Right-Side-Mobile-Devices5.mp4"></video>
    </span>
  </div>
</div></div></div></section>`;

f = f.replace(bentoRegex, bentoHtml);
fs.writeFileSync('reference/pages/green_square_infra_project_page.html', f, 'utf8');
console.log('Successfully injected populated Bento HTML into green_square_infra_project_page.html!');
