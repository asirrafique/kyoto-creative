import fs from 'fs';

let ref = fs.readFileSync('src/lib/reference.js', 'utf8');

const targetStyle = `  const interactHeroStyle = (route === '/work/interactfinancial.ca' || route === '/work/interactfinancial.ca/')
    ? '<style>' +
      '.Bento_bento__pskN5 .Bento_contained__4KAWy {' +
      '  aspect-ratio: 1024 / 460 !important;' +
      '  height: auto !important;' +
      '  max-width: 1100px !important;' +
      '  margin: 0 auto !important;' +
      '  background: transparent !important;' +
      '  border-radius: 22px !important;' +
      '  overflow: hidden !important;' +
      '  box-shadow: 0 20px 45px -12px rgba(0,0,0,0.18) !important;' +
      '}' +
      '.Bento_bento__pskN5 .Bento_contained__4KAWy > div {' +
      '  aspect-ratio: 1024 / 460 !important;' +
      '  height: 100% !important;' +
      '  border-radius: 22px !important;' +
      '  background: #000 url("/images/interact-financial-hero-preview.jpg") center center / cover no-repeat !important;' +
      '}' +
      '.Bento_bento__pskN5 .Bento_contained__4KAWy video {' +
      '  opacity: 0 !important;' +
      '  visibility: hidden !important;' +
      '  pointer-events: none !important;' +
      '}' +
      '.SingleImage_singleImage__NY3zv.interactfinancial-gallery {' +
      '  width: 100% !important;' +
      '  max-width: 100% !important;' +
      '  margin: 3.5rem 0 !important;' +
      '  display: block !important;' +
      '}' +
      '.SingleImage_singleImage__NY3zv.interactfinancial-gallery .container {' +
      '  display: block !important;' +
      '  width: 100% !important;' +
      '  max-width: 1400px !important;' +
      '  margin: 0 auto !important;' +
      '  padding: 0 4% !important;' +
      '  box-sizing: border-box !important;' +
      '}' +
      '.SingleImage_singleImage__NY3zv .interactfinancial-dual-grid {' +
      '  display: grid !important;' +
      '  grid-template-columns: 1fr 1fr !important;' +
      '  grid-column: 1 / -1 !important;' +
      '  gap: 2.5rem !important;' +
      '  width: 100% !important;' +
      '  margin: 0 auto !important;' +
      '}' +
      '@media (max-width: 768px) {' +
      '  .SingleImage_singleImage__NY3zv .interactfinancial-dual-grid {' +
      '    grid-template-columns: 1fr !important;' +
      '    gap: 1.5rem !important;' +
      '  }' +
      '}' +
      '.SingleImage_singleImage__NY3zv .interactfinancial-dual-grid .SingleImage_containedImage__N2jLD {' +
      '  grid-column: auto !important;' +
      '  width: 100% !important;' +
      '  aspect-ratio: 1 / 1 !important;' +
      '  height: auto !important;' +
      '  margin: 0 !important;' +
      '  border-radius: 24px !important;' +
      '  overflow: hidden !important;' +
      '  box-shadow: 0 20px 45px -10px rgba(0,0,0,0.15) !important;' +
      '  background: #ececec !important;' +
      '}' +
      '.SingleImage_singleImage__NY3zv .interactfinancial-dual-grid .SingleImage_containedImage__N2jLD img {' +
      '  width: 100% !important;' +
      '  height: 100% !important;' +
      '  object-fit: cover !important;' +
      '  display: block !important;' +
      '  border-radius: 24px !important;' +
      '}' +
      '</style>'
    : '';`;

const startMarker = "  const interactHeroStyle = (route === '/work/interactfinancial.ca'";
const endMarker = "  const greenSquareBannersStyle = (route === '/work/green-square-infra'";

const startIdx = ref.indexOf(startMarker);
const endIdx = ref.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  ref = ref.slice(0, startIdx) + targetStyle + '\n' + ref.slice(endIdx);
  fs.writeFileSync('src/lib/reference.js', ref, 'utf8');
  console.log('Successfully adjusted Bento hero size to 1100px in interactHeroStyle');
} else {
  console.error('Markers not found');
}
