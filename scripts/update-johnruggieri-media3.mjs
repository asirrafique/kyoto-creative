import fs from 'fs';

let ref = fs.readFileSync('src/lib/reference.js', 'utf8');

const targetStyle = `  const johnRuggieriVideoStyle = (route === '/work/johnruggieri' || route === '/work/johnruggieri/')
    ? '<style>' +
      '.Bento_bento__pskN5 .Bento_media1__Zf6n4 {' +
      '  background: #000 url("/images/johnruggieri-bento-cube.jpg") center center / cover no-repeat !important;' +
      '  border-radius: 20px !important;' +
      '  overflow: hidden !important;' +
      '  box-shadow: 0 16px 36px -10px rgba(0,0,0,0.18) !important;' +
      '}' +
      '.Bento_bento__pskN5 .Bento_media1__Zf6n4 video,' +
      '.Bento_bento__pskN5 .Bento_media1__Zf6n4 span {' +
      '  display: none !important;' +
      '  opacity: 0 !important;' +
      '  visibility: hidden !important;' +
      '  pointer-events: none !important;' +
      '}' +
      '.Bento_bento__pskN5 .Bento_media2__Z_9Z_ {' +
      '  background: #000 url("/images/johnruggieri-bento-signature.jpg") center center / cover no-repeat !important;' +
      '  border-radius: 20px !important;' +
      '  overflow: hidden !important;' +
      '  box-shadow: 0 16px 36px -10px rgba(0,0,0,0.18) !important;' +
      '}' +
      '.Bento_bento__pskN5 .Bento_media2__Z_9Z_ video,' +
      '.Bento_bento__pskN5 .Bento_media2__Z_9Z_ span {' +
      '  display: none !important;' +
      '  opacity: 0 !important;' +
      '  visibility: hidden !important;' +
      '  pointer-events: none !important;' +
      '}' +
      '.Bento_bento__pskN5 .Bento_media3__Je_Pc {' +
      '  background: #fff url("/images/johnruggieri-bento-signature-clean.jpg") center center / contain no-repeat !important;' +
      '  border-radius: 20px !important;' +
      '  overflow: hidden !important;' +
      '  box-shadow: 0 16px 36px -10px rgba(0,0,0,0.18) !important;' +
      '}' +
      '.Bento_bento__pskN5 .Bento_media3__Je_Pc video,' +
      '.Bento_bento__pskN5 .Bento_media3__Je_Pc span {' +
      '  display: none !important;' +
      '  opacity: 0 !important;' +
      '  visibility: hidden !important;' +
      '  pointer-events: none !important;' +
      '}' +
      '.Bento_bento__pskN5 .Bento_media4__xfRDt {' +
      '  background: #000 url("/images/johnruggieri-bento-portrait.jpg") center top / cover no-repeat !important;' +
      '  border-radius: 20px !important;' +
      '  overflow: hidden !important;' +
      '  box-shadow: 0 16px 36px -10px rgba(0,0,0,0.18) !important;' +
      '}' +
      '.Bento_bento__pskN5 .Bento_media4__xfRDt video,' +
      '.Bento_bento__pskN5 .Bento_media4__xfRDt span {' +
      '  display: none !important;' +
      '  opacity: 0 !important;' +
      '  visibility: hidden !important;' +
      '  pointer-events: none !important;' +
      '}' +
      '.ContentBuilder_contentBuilder__FAKQG > section:first-child {' +
      '  padding: 0 1.5rem !important;' +
      '  margin: 2rem 0 4rem 0 !important;' +
      '}' +
      '.ContentBuilder_contentBuilder__FAKQG > section:first-child .Video_videoContainer__21JKT {' +
      '  max-width: 1100px !important;' +
      '  width: 100% !important;' +
      '  margin: 0 auto !important;' +
      '  aspect-ratio: 1024 / 796 !important;' +
      '  background: #111 url("/images/johnruggieri-artwork.jpg") center center / contain no-repeat !important;' +
      '  border-radius: 24px !important;' +
      '  overflow: hidden !important;' +
      '  box-shadow: 0 20px 50px -15px rgba(0,0,0,0.18) !important;' +
      '}' +
      '.ContentBuilder_contentBuilder__FAKQG > section:first-child .Video_videoContainer__21JKT video,' +
      '.ContentBuilder_contentBuilder__FAKQG > section:first-child .Video_videoContainer__21JKT span {' +
      '  display: none !important;' +
      '}' +
      '.SingleImage_containedImage__N2jLD .Video_videoContainer__21JKT {' +
      '  background: #000 !important;' +
      '  border-radius: 24px !important;' +
      '  overflow: hidden !important;' +
      '  box-shadow: 0 20px 45px -10px rgba(0,0,0,0.18) !important;' +
      '}' +
      '.SingleImage_containedImage__N2jLD .Video_videoContainer__21JKT video {' +
      '  object-fit: contain !important;' +
      '}' +
      '.johnruggieri-outcome-portrait-wrap {' +
      '  display: flex !important;' +
      '  justify-content: center !important;' +
      '  margin: 3.5rem auto 1.5rem auto !important;' +
      '  width: 100% !important;' +
      '}' +
      '.johnruggieri-outcome-portrait-card {' +
      '  max-width: 520px !important;' +
      '  width: 100% !important;' +
      '  border-radius: 24px !important;' +
      '  overflow: hidden !important;' +
      '  box-shadow: 0 24px 60px -15px rgba(0,0,0,0.18) !important;' +
      '}' +
      '.johnruggieri-outcome-portrait-card img {' +
      '  width: 100% !important;' +
      '  height: auto !important;' +
      '  display: block !important;' +
      '  border-radius: 24px !important;' +
      '}' +
      '</style>'
    : '';`;

const startMarker = "  const johnRuggieriVideoStyle = (route === '/work/johnruggieri'";
const endMarker = "  html = html.replace('<head>', '<head>' + partnersStyle";

const startIdx = ref.indexOf(startMarker);
const endIdx = ref.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  ref = ref.slice(0, startIdx) + targetStyle + '\n' + ref.slice(endIdx);
  fs.writeFileSync('src/lib/reference.js', ref, 'utf8');
  console.log('Successfully updated johnRuggieriVideoStyle with media3 signature in reference.js');
} else {
  console.error('Markers not found');
}
