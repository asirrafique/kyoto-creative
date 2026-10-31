const fs = require('fs');

let html = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');

// 1. Remove the accidental prepended markup before <!DOCTYPE html>
const dtIdx = html.indexOf('<!DOCTYPE html>');
if (dtIdx > 0) {
  html = html.slice(dtIdx);
  console.log('Removed stray markup before <!DOCTYPE html>!');
}

// 2. Now find the exact Key focus areas inside the Intro section and replace it with the 3 Stat Cards:
const oldFocusStart = '<p class="Intro_smallHeading__gYXTn" style="font-weight:600;margin-bottom:0.75rem">Key focus areas</p>';
const oldFocusEnd = '<span>Workflow automation</span></li></ul>';

const focusStartIdx = html.indexOf(oldFocusStart);
const focusEndIdx = html.indexOf(oldFocusEnd);

console.log('focusStartIdx:', focusStartIdx, 'focusEndIdx:', focusEndIdx);

if (focusStartIdx !== -1 && focusEndIdx !== -1) {
  const fullOldSnippet = html.slice(focusStartIdx, focusEndIdx + oldFocusEnd.length);
  const newCards = `<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1.5rem;width:100%;margin-top:1rem">
    <div style="background:#000;color:#fff;border-radius:24px 24px 24px 0;padding:2.5rem 1.5rem;display:flex;flex-direction:column;justify-content:center;aspect-ratio:1/1">
      <div style="font-size:clamp(2.5rem, 3.5vw, 3.75rem);font-weight:500;line-height:1;margin-bottom:1rem">800+</div>
      <div style="font-size:0.9rem;color:rgba(255,255,255,0.75);line-height:1.4">leads generated in the first 30 days.</div>
    </div>
    <div style="background:#000;color:#fff;border-radius:24px 24px 24px 0;padding:2.5rem 1.5rem;display:flex;flex-direction:column;justify-content:center;aspect-ratio:1/1">
      <div style="font-size:clamp(2.5rem, 3.5vw, 3.75rem);font-weight:500;line-height:1;margin-bottom:1rem">&lt;$1,000</div>
      <div style="font-size:0.9rem;color:rgba(255,255,255,0.75);line-height:1.4">in total advertising spend.</div>
    </div>
    <div style="background:#000;color:#fff;border-radius:24px 24px 24px 0;padding:2.5rem 1.5rem;display:flex;flex-direction:column;justify-content:center;aspect-ratio:1/1">
      <div style="font-size:clamp(2.5rem, 3.5vw, 3.75rem);font-weight:500;line-height:1;margin-bottom:1rem">$600k+</div>
      <div style="font-size:0.9rem;color:rgba(255,255,255,0.75);line-height:1.4">in property pipeline revenue.</div>
    </div>
  </div>`;
  html = html.replace(fullOldSnippet, newCards);
  console.log('Successfully placed Stat Cards in place of Key focus areas!');
}

fs.writeFileSync('reference/pages/green_square_infra_project_page.html', html, 'utf8');
console.log('Updated green_square_infra_project_page.html!');
