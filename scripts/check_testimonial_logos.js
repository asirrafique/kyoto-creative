const fs = require('fs');

const html = fs.readFileSync('reference/pages/8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1.html', 'utf8');
const p = html.indexOf('Testimonials_testimonials');
const end = html.indexOf('</section>', p);
const block = html.substring(p, end);

const reg = /<figure class="TestimonialsPanel_logo__m6tmz">[\s\S]*?<\/figure>/g;
const figures = block.match(reg) || [];
figures.forEach((f, i) => {
  console.log(`Figure ${i}:`, f);
});
