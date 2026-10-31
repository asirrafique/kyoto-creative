const fs = require('fs');

let f = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');

// Replace remaining occurrences in static and JSON flight stream
f = f.replaceAll('Universal Production Partners (UPP) is the VFX powerhouse behind some of Hollywood’s most visually stunning blockbusters, including <em>Barbie (2023)</em>, <em>Blade Runner 2049 (2017)</em>, and <em>Conclave (2024)</em>.', 'Green Square Infra is an innovative infrastructure and property development firm delivering high-value residential and commercial assets.');

f = f.replaceAll('Their work pushes the boundaries of digital effects, crafting immersive, otherworldly visuals that elevate modern cinema.', 'Kyoto Creative partnered with Green Square Infra to design a high-converting digital presence and performance-driven marketing strategy that turns online engagement into qualified property buyers.');

f = f.replaceAll('Shaun Obanion', 'Gunajit Dutta');
f = f.replaceAll('Social Media and PR Manager of Universal Production Partners', 'Founder - Green Square Infra');

fs.writeFileSync('reference/pages/green_square_infra_project_page.html', f, 'utf8');

// Also in .rsc
let rsc = fs.readFileSync('reference/pages/green_square_infra_project_page.rsc', 'utf8');
rsc = rsc.replaceAll('Shaun Obanion', 'Gunajit Dutta');
rsc = rsc.replaceAll('Social Media and PR Manager of Universal Production Partners', 'Founder - Green Square Infra');
fs.writeFileSync('reference/pages/green_square_infra_project_page.rsc', rsc, 'utf8');

console.log('Cleaned all remaining references!');
