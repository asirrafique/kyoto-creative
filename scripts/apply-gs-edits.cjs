const fs = require('fs');

let html = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');

// 1. Overview
const oldOverview = `88Pilot is an AI-powered HR compliance platform built to help US businesses navigate the complexities of workplace regulations. Kyoto Creative worked on creating a digital product that brings compliance intelligence, policy management, and essential HR workflows into one connected experience, making a traditionally complex process feel simpler and more accessible.`;
const newOverview = `Green Square Infra is an innovative infrastructure and property development firm delivering high-value residential and commercial assets. Kyoto Creative partnered with Green Square Infra to design a high-converting digital presence and performance-driven marketing strategy that turns online engagement into qualified property buyers.`;
html = html.replaceAll(oldOverview, newOverview);

// 2. Intro Heading
html = html.replaceAll('Building a Smarter Future for HR Compliance', 'Results 30 days post-launch');

// 3. Intro Right Side (Key focus areas -> 3 Stat Cards)
// Find the exact snippet
const oldFocusStart = '<p class="Intro_smallHeading__gYXTn" style="font-weight:600;margin-bottom:0.75rem">Key focus areas</p>';
const oldFocusEnd = 'Workflow automation</li></ul>';
const focusStartIdx = html.indexOf(oldFocusStart);
const focusEndIdx = html.indexOf(oldFocusEnd) + oldFocusEnd.length;

if (focusStartIdx !== -1 && focusEndIdx !== -1) {
  const oldSnippet = html.slice(focusStartIdx, focusEndIdx);
  const newCards = `<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:1.5rem;width:100%;margin-top:1rem">
    <div style="background:#000;color:#fff;border-radius:24px 24px 24px 0;padding:2.5rem 1.75rem;display:flex;flex-direction:column;justify-content:center;aspect-ratio:1/1">
      <div style="font-size:clamp(2.75rem, 4vw, 4rem);font-weight:500;line-height:1;margin-bottom:1rem">800+</div>
      <div style="font-size:0.95rem;color:rgba(255,255,255,0.75);line-height:1.4">leads generated in the first 30 days.</div>
    </div>
    <div style="background:#000;color:#fff;border-radius:24px 24px 24px 0;padding:2.5rem 1.75rem;display:flex;flex-direction:column;justify-content:center;aspect-ratio:1/1">
      <div style="font-size:clamp(2.75rem, 4vw, 4rem);font-weight:500;line-height:1;margin-bottom:1rem">&lt;$1,000</div>
      <div style="font-size:0.95rem;color:rgba(255,255,255,0.75);line-height:1.4">in total advertising spend.</div>
    </div>
    <div style="background:#000;color:#fff;border-radius:24px 24px 24px 0;padding:2.5rem 1.75rem;display:flex;flex-direction:column;justify-content:center;aspect-ratio:1/1">
      <div style="font-size:clamp(2.75rem, 4vw, 4rem);font-weight:500;line-height:1;margin-bottom:1rem">$600k+</div>
      <div style="font-size:0.95rem;color:rgba(255,255,255,0.75);line-height:1.4">in property pipeline revenue.</div>
    </div>
  </div>`;
  html = html.replace(oldSnippet, newCards);
  console.log('Replaced Key focus areas with Stat Cards!');
}

// 4. The Challenge -> The Impact
const oldChallengeHeading = '<h3>The Challenge</h3>';
const newImpactHeading = '<h2 style="font-size:clamp(2.5rem, 3.5vw, 3.25rem);font-weight:400;margin-bottom:1.5rem">The Impact</h2>';
html = html.replace(oldChallengeHeading, newImpactHeading);

const oldChallengeText = `<p>HR compliance is rarely straightforward. Constantly changing regulations, scattered documentation, employee training requirements, and state-specific rules can leave businesses struggling to stay organised and prepared. The challenge was to bring these moving parts together in a way that reduces complexity, improves visibility, and helps teams move from reactive compliance management to a more proactive approach.</p>`;
const newImpactText = `<p style="font-size:1.15rem;line-height:1.6;margin-bottom:1.25rem">This project demonstrates Kyoto Creative's approach to combining creative execution with performance-driven marketing. By bringing together a newly developed website and targeted social media campaigns, we helped Green Square Infra establish its digital presence and generate a significant volume of property enquiries within its first month.</p>
<p style="font-size:1.15rem;line-height:1.6">The result was a measurable starting point for future marketing efforts, with a digital foundation in place to support continued campaign optimisation and growth.</p>`;
html = html.replace(oldChallengeText, newImpactText);

// 5. The Solution -> Gunajit Dutta Quote
const oldSolutionHeading = '<h3>The Solution</h3>';
const quoteMark = '<div style="font-size:3.5rem;line-height:1;font-weight:900;letter-spacing:0.2em;margin-bottom:1.5rem">“</div>';
html = html.replace(oldSolutionHeading, quoteMark);

const oldSolutionStart = '<p>We helped shape a connected SaaS experience that brings AI-powered assistance';
const solutionStartIdx = html.indexOf(oldSolutionStart);
const solutionEndIdx = html.indexOf('</p>', solutionStartIdx) + 4;
if (solutionStartIdx !== -1) {
  const oldSolutionSnippet = html.slice(solutionStartIdx, solutionEndIdx);
  const newQuoteSnippet = `<blockquote style="font-size:clamp(1.35rem, 2.2vw, 2rem);line-height:1.4;font-weight:400;margin:0 0 2rem;color:#000">
  “Honestly, we weren't expecting results like this in the very first month. Generating over 800 leads in just 30 days with less than $1,000 in ad spend was genuinely impressive. Kyoto Creative understood what we wanted to achieve and brought our website and marketing together in a way that delivered results beyond our expectations. What stood out most was how efficiently they managed the budget while generating so much interest in our projects. We're really pleased with the work and excited about what we can achieve together moving forward.”
</blockquote>
<div style="margin-top:1.5rem">
  <div style="font-size:1.15rem;font-weight:600;color:#000">Gunajit Dutta</div>
  <div style="font-size:0.95rem;color:rgba(0,0,0,0.6);margin-top:0.25rem">Founder - Green Square Infra</div>
</div>`;
  html = html.replace(oldSolutionSnippet, newQuoteSnippet);
  console.log('Replaced The Solution with Gunajit Dutta Quote!');
}

fs.writeFileSync('reference/pages/green_square_infra_project_page.html', html, 'utf8');

// Also update .rsc
let rsc = fs.readFileSync('reference/pages/green_square_infra_project_page.rsc', 'utf8');
rsc = rsc.replaceAll(oldOverview, newOverview);
rsc = rsc.replaceAll('Building a Smarter Future for HR Compliance', 'Results 30 days post-launch');
fs.writeFileSync('reference/pages/green_square_infra_project_page.rsc', rsc, 'utf8');

console.log('Saved updated green_square_infra_project_page files!');
