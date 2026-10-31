const fs = require('fs');

let f = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');
f = f.replace(
  'src="https://kota-content.b-cdn.net/app/uploads/2025/04/All-Pages-3D-2.mp4"></video>',
  'src="https://kota-content.b-cdn.net/app/uploads/2025/04/All-Pages-3D-2.mp4" preload="auto" onloadeddata="this.play()"></video>'
);
fs.writeFileSync('reference/pages/green_square_infra_project_page.html', f, 'utf8');
console.log('Added preload and play trigger to showcase video!');
