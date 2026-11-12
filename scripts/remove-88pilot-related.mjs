import fs from 'fs';

let html = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');
let rsc = fs.readFileSync('reference/pages/88pilot_project_page.rsc', 'utf8');
let ref = fs.readFileSync('src/lib/reference.js', 'utf8');

// 1. Add CSS hide rule to pilot88MockupStyle as a bulletproof safeguard
const targetStyle = `  const pilot88MockupStyle = (route === '/work/88pilot' || route === '/work/88pilot/')
    ? '<style>' +
      '.ContentBuilder_contentBuilder__FAKQG > section:first-child {' +
      '  padding: 0 1.5rem !important;' +
      '  margin: 2rem 0 4rem 0 !important;' +
      '}' +
      '.ContentBuilder_contentBuilder__FAKQG > section:first-child .Video_videoContainer__21JKT {' +
      '  max-width: 1000px !important;' +
      '  width: 100% !important;' +
      '  margin: 0 auto !important;' +
      '  aspect-ratio: 16 / 9 !important;' +
      '  background: #000 url("/images/88pilot-mockup-laptop.jpg") center center / contain no-repeat !important;' +
      '  border-radius: 24px !important;' +
      '  overflow: hidden !important;' +
      '  box-shadow: 0 20px 50px -15px rgba(0,0,0,0.22) !important;' +
      '}' +
      '.ContentBuilder_contentBuilder__FAKQG > section:first-child .Video_loopVideo__1G4By {' +
      '  background: transparent !important;' +
      '}' +
      '.ContentBuilder_contentBuilder__FAKQG > section:first-child .Video_loopVideo__1G4By video,' +
      '.ContentBuilder_contentBuilder__FAKQG > section:first-child .Video_videoContainer__21JKT video {' +
      '  opacity: 0 !important;' +
      '  visibility: hidden !important;' +
      '  pointer-events: none !important;' +
      '}' +
      '.RelatedProjects_relatedProjects__opNhl {' +
      '  display: none !important;' +
      '}' +
      '</style>'
    : '';`;

const startMarker = "  const pilot88MockupStyle = (route === '/work/88pilot'";
const endMarker = "  const leadcourtMockupStyle = (route === '/work/leadcourt'";

const startIdx = ref.indexOf(startMarker);
const endIdx = ref.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  ref = ref.slice(0, startIdx) + targetStyle + '\n' + ref.slice(endIdx);
  fs.writeFileSync('src/lib/reference.js', ref, 'utf8');
  console.log('Updated pilot88MockupStyle in reference.js!');
} else {
  console.error('Markers not found in reference.js');
}

// 2. Remove RelatedProjects from HTML DOM markup
const relHtmlIdx = html.indexOf('RelatedProjects_relatedProjects__opNhl');
if (relHtmlIdx !== -1) {
  const start = html.lastIndexOf('<section class="RelatedProjects_relatedProjects__opNhl"', relHtmlIdx);
  // Find matching closing </section>
  const end = html.indexOf('</section>', start) + '</section>'.length;
  console.log('HTML start:', start, 'end:', end);
  if (start !== -1 && end !== -1) {
    html = html.slice(0, start) + html.slice(end);
    console.log('Removed RelatedProjects section from HTML DOM!');
  }
}

// 3. Remove from RSC
const relRscIdx = rsc.indexOf('RelatedProjects_relatedProjects__opNhl');
if (relRscIdx !== -1) {
  const start = rsc.lastIndexOf('["$","section",null,{"className":"RelatedProjects_relatedProjects__opNhl"', relRscIdx);
  const end = rsc.indexOf('}],false,false]}', start) + '}],false,false]}'.length;
  console.log('RSC start:', start, 'end:', end);
  if (start !== -1 && end !== -1) {
    console.log('RSC preview to remove:', rsc.slice(start, start + 80), '...', rsc.slice(end - 30, end));
    rsc = rsc.slice(0, start) + rsc.slice(end);
    console.log('Removed RelatedProjects from RSC!');
  }
}

// 4. Remove from HTML embedded Flight scripts
const relFlightIdx = html.indexOf('RelatedProjects_relatedProjects__opNhl');
if (relFlightIdx !== -1) {
  const start = html.lastIndexOf('[\\\"$\\\",\\\"section\\\",null,{\\\"className\\\":\\\"RelatedProjects_relatedProjects__opNhl\\\"', relFlightIdx);
  const end = html.indexOf('}],false,false]}', start) + '}],false,false]}'.length;
  console.log('Flight start:', start, 'end:', end);
  if (start !== -1 && end !== -1) {
    html = html.slice(0, start) + html.slice(end);
    console.log('Removed RelatedProjects from HTML flight scripts!');
  }
}

fs.writeFileSync('reference/pages/88pilot_project_page.html', html, 'utf8');
fs.writeFileSync('reference/pages/88pilot_project_page.rsc', rsc, 'utf8');
console.log('All files saved successfully!');
