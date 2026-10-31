const fs = require('fs');

let f = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');

// Replace Impact in HTML
const oldImpactHtml = `<h3>The future of web as an experience</h3>\r\n<p>This project redefines what a website can be. UPP’s site is not just a portfolio—it’s a statement. As the web continues to evolve into a more interactive, experiential space, brands have the opportunity to captivate users in ways that go beyond traditional web design.</p>\r\n<p>For UPP, it was about creating a digital experience worthy of the cinematic masterpieces they help bring to life.</p>`;

const newImpactHtml = `<h2>The Impact</h2>\r\n<p>This project demonstrates Kyoto Creative's approach to combining creative execution with performance-driven marketing. By bringing together a newly developed website and targeted social media campaigns, we helped Green Square Infra establish its digital presence and generate a significant volume of property enquiries within its first month.</p>\r\n<p>The result was a measurable starting point for future marketing efforts, with a digital foundation in place to support continued campaign optimisation and growth.</p>`;

console.log('Includes oldImpactHtml (CRLF)?:', f.includes(oldImpactHtml));
f = f.replace(oldImpactHtml, newImpactHtml);

// Populate Bento videos with src and autoPlay
f = f.replace('Kota-Bento-Green2-1.mp4" playsinline="" loop="" preload="none"', 'Kota-Bento-Green2-1.mp4" playsinline="" loop="" autoPlay="" muted=""');
f = f.replace('<video playsinline="" loop="" preload="none" class="BentoGrid_itemVideo__vXq4V BentoGrid_videoSquare__lV6fR"></video>', '<video playsinline="" loop="" autoPlay="" muted="" class="BentoGrid_itemVideo__vXq4V BentoGrid_videoSquare__lV6fR" src="https://kota-content.b-cdn.net/app/uploads/2025/04/Square-Rotating-Cube2.mp4"></video>');
f = f.replace('<video playsinline="" loop="" preload="none" class="BentoGrid_itemVideo__vXq4V BentoGrid_videoSquareMobileRight__4vV96 BentoGrid_videoSquareMobile__d_9K5"></video>', '<video playsinline="" loop="" autoPlay="" muted="" class="BentoGrid_itemVideo__vXq4V BentoGrid_videoSquareMobileRight__4vV96 BentoGrid_videoSquareMobile__d_9K5" src="https://kota-content.b-cdn.net/app/uploads/2025/04/Bento-Right2.mp4"></video>');
f = f.replace('<video playsinline="" loop="" preload="none" class="BentoGrid_itemVideo__vXq4V BentoGrid_videoPortrait__D1V2g"></video>', '<video playsinline="" loop="" autoPlay="" muted="" class="BentoGrid_itemVideo__vXq4V BentoGrid_videoPortrait__D1V2g" src="https://kota-content.b-cdn.net/app/uploads/2025/04/Bento-Earth-Spin2.mp4"></video>');
f = f.replace('<video playsinline="" loop="" preload="none" class="BentoGrid_itemVideo__vXq4V BentoGrid_videoSquareMobileLeft__F20zU BentoGrid_videoSquareMobile__d_9K5"></video>', '<video playsinline="" loop="" autoPlay="" muted="" class="BentoGrid_itemVideo__vXq4V BentoGrid_videoSquareMobileLeft__F20zU BentoGrid_videoSquareMobile__d_9K5" src="https://kota-content.b-cdn.net/app/uploads/2025/04/Right-Side-Mobile-Devices5.mp4"></video>');

fs.writeFileSync('reference/pages/green_square_infra_project_page.html', f, 'utf8');
console.log('Saved updated green_square_infra_project_page.html!');
