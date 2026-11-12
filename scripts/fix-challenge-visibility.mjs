import fs from 'fs';

let ref = fs.readFileSync('src/lib/reference.js', 'utf8');

const targetStyle = `  const greenSquareBannersStyle = (route === '/work/green-square-infra' || route === '/work/green-square-infra/')
    ? '<style>' +
      '.Bento_bento__pskN5 {' +
      '  margin-top: 1.5rem !important;' +
      '  margin-bottom: 0 !important;' +
      '  padding-bottom: 0 !important;' +
      '}' +
      '.Bento_bento__pskN5 .container {' +
      '  max-width: 1200px !important;' +
      '  margin: 0 auto !important;' +
      '  padding: 0 1.5rem !important;' +
      '}' +
      '.Bento_bento__pskN5 .Bento_bentoGrid__25th6 {' +
      '  display: grid !important;' +
      '  grid-template-columns: repeat(3, 1fr) !important;' +
      '  grid-template-rows: none !important;' +
      '  gap: 2.25rem !important;' +
      '  width: 100% !important;' +
      '  aspect-ratio: auto !important;' +
      '  background: transparent !important;' +
      '  border: none !important;' +
      '  border-radius: 0 !important;' +
      '  box-shadow: none !important;' +
      '  padding: 0 !important;' +
      '  margin-bottom: 0 !important;' +
      '}' +
      '.Bento_bento__pskN5 .Bento_bentoGrid__25th6 > div {' +
      '  display: block !important;' +
      '  grid-column: auto !important;' +
      '  grid-row: auto !important;' +
      '  width: 100% !important;' +
      '  aspect-ratio: 270 / 479 !important;' +
      '  border-radius: 20px !important;' +
      '  overflow: hidden !important;' +
      '  box-shadow: 0 16px 36px -10px rgba(0,0,0,0.18) !important;' +
      '  background-size: cover !important;' +
      '  background-position: center !important;' +
      '  background-repeat: no-repeat !important;' +
      '  transition: transform 0.3s ease, box-shadow 0.3s ease !important;' +
      '}' +
      '.Bento_bento__pskN5 .Bento_bentoGrid__25th6 > div:hover {' +
      '  transform: translateY(-4px) !important;' +
      '  box-shadow: 0 24px 48px -12px rgba(0,0,0,0.25) !important;' +
      '}' +
      '.Bento_bento__pskN5 .Bento_bentoGrid__25th6 .Bento_media1__Zf6n4 {' +
      '  background-image: url("/images/green-square-banner-1-hd.jpg") !important;' +
      '}' +
      '.Bento_bento__pskN5 .Bento_bentoGrid__25th6 .Bento_media2__Z_9Z_ {' +
      '  background-image: url("/images/green-square-banner-2-hd.jpg") !important;' +
      '}' +
      '.Bento_bento__pskN5 .Bento_bentoGrid__25th6 .Bento_media3__Je_Pc {' +
      '  background-image: url("/images/green-square-banner-3-hd.jpg") !important;' +
      '}' +
      '.Bento_bento__pskN5 .Bento_bentoGrid__25th6 .Bento_media4__xfRDt {' +
      '  display: none !important;' +
      '}' +
      '.Bento_bento__pskN5 .Bento_bentoGrid__25th6 video {' +
      '  display: none !important;' +
      '}' +
      'section.Intro_intro__kvY3Y,' +
      '.Intro_intro__kvY3Y {' +
      '  padding-top: 1.5rem !important;' +
      '  padding-bottom: 2.5rem !important;' +
      '  margin-top: 0 !important;' +
      '}' +
      '@media (min-width: 769px) {' +
      '  .Bento_bento__pskN5 .Bento_bentoGrid__25th6 {' +
      '    grid-template-columns: repeat(3, 1fr) !important;' +
      '    grid-template-rows: none !important;' +
      '  }' +
      '  section.Intro_intro__kvY3Y,' +
      '  .Intro_intro__kvY3Y {' +
      '    padding-top: 1.5rem !important;' +
      '  }' +
      '}' +
      '@media (min-width: 850px) {' +
      '  section.Intro_intro__kvY3Y,' +
      '  .Intro_intro__kvY3Y {' +
      '    padding-top: 1.5rem !important;' +
      '  }' +
      '}' +
      '@media (max-width: 768px) {' +
      '  .Bento_bento__pskN5 .Bento_bentoGrid__25th6 {' +
      '    grid-template-columns: 1fr !important;' +
      '    grid-template-rows: none !important;' +
      '    max-width: 360px !important;' +
      '    margin: 0 auto !important;' +
      '    gap: 1.75rem !important;' +
      '  }' +
      '  section.Intro_intro__kvY3Y,' +
      '  .Intro_intro__kvY3Y {' +
      '    padding-top: 1.5rem !important;' +
      '  }' +
      '}' +
      '</style>'
    : '';`;

const startMarker = "  const greenSquareBannersStyle = (route === '/work/green-square-infra'";
const endMarker = "  const johnRuggieriVideoStyle = (route === '/work/johnruggieri'";

const startIdx = ref.indexOf(startMarker);
const endIdx = ref.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  ref = ref.slice(0, startIdx) + targetStyle + '\n' + ref.slice(endIdx);
  fs.writeFileSync('src/lib/reference.js', ref, 'utf8');
  console.log('Successfully removed first-child display:none rule from greenSquareBannersStyle!');
} else {
  console.error('Markers not found');
}
