const fs = require('fs');

// We use 88pilot_project_page.html as base because it hydrates cleanly!
const base88 = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');

let gs = base88;

// 1. Title & URL metadata
gs = gs.replaceAll('88Pilot - Kyoto Creative', 'Green Square Infra - Kyoto Creative');
gs = gs.replaceAll('/work/88pilot', '/work/green-square-infra');

// 2. Hero Headline
gs = gs.replaceAll('Building an AI-Powered HR\nCompliance Platform', 'Turning Digital Marketing\ninto a Lead Generation\nEngine');
gs = gs.replaceAll('Building an AI-Powered HR Compliance Platform', 'Turning Digital Marketing into a Lead Generation Engine');

// 3. Project Overview
const p88Overview = `<p style="font-size:clamp(1.25rem, 1.8vw, 1.75rem);line-height:1.35;max-width:58ch">88Pilot is an AI-powered HR compliance platform built to help US businesses navigate the complexities of workplace regulations. Kyoto Creative worked on creating a digital product that brings compliance intelligence, policy management, and essential HR workflows into one connected experience, making a traditionally complex process feel simpler and more accessible.</p>`;
const gsOverview = `<p style="font-size:clamp(1.25rem, 1.8vw, 1.75rem);line-height:1.35;max-width:58ch">Green Square Infra is an innovative infrastructure and property development firm delivering high-value residential and commercial assets. Kyoto Creative partnered with Green Square Infra to design a high-converting digital presence and performance-driven marketing strategy that turns online engagement into qualified property buyers.</p>`;
gs = gs.replace(p88Overview, gsOverview);

// 4. Intro section
gs = gs.replaceAll('Building a Smarter Future for HR Compliance', 'Results 30 days post-launch');

// Replace key focus areas with the 3 Stats:
const p88Focus = `<p class="Intro_smallHeading__gYXTn" style="font-weight:600;font-size:1.1rem;margin-bottom:1rem">Key focus areas</p><ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.75rem"><li style="font-size:1rem;color:rgba(0,0,0,0.75);display:flex;align-items:center;gap:0.5rem"><span style="width:6px;height:6px;border-radius:50%;background:#000;display:inline-block"></span>AI-powered compliance workflows</li><li style="font-size:1rem;color:rgba(0,0,0,0.75);display:flex;align-items:center;gap:0.5rem"><span style="width:6px;height:6px;border-radius:50%;background:#000;display:inline-block"></span>SaaS platform experience</li><li style="font-size:1rem;color:rgba(0,0,0,0.75);display:flex;align-items:center;gap:0.5rem"><span style="width:6px;height:6px;border-radius:50%;background:#000;display:inline-block"></span>HR technology integrations</li><li style="font-size:1rem;color:rgba(0,0,0,0.75);display:flex;align-items:center;gap:0.5rem"><span style="width:6px;height:6px;border-radius:50%;background:#000;display:inline-block"></span>Compliance monitoring and reporting</li><li style="font-size:1rem;color:rgba(0,0,0,0.75);display:flex;align-items:center;gap:0.5rem"><span style="width:6px;height:6px;border-radius:50%;background:#000;display:inline-block"></span>Workflow automation</li></ul>`;

const gsStatsHtml = `<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:2rem;width:100%;margin-top:2rem">
  <div style="background:#000;color:#fff;border-radius:24px 24px 24px 0;padding:3rem 2rem;display:flex;flex-direction:column;justifyContent:center;aspect-ratio:1/1">
    <div style="font-size:clamp(3rem, 5vw, 4.5rem);font-weight:500;line-height:1;margin-bottom:1rem">800+</div>
    <div style="font-size:1rem;color:rgba(255,255,255,0.75);line-height:1.4">leads generated in the first 30 days.</div>
  </div>
  <div style="background:#000;color:#fff;border-radius:24px 24px 24px 0;padding:3rem 2rem;display:flex;flex-direction:column;justifyContent:center;aspect-ratio:1/1">
    <div style="font-size:clamp(3rem, 5vw, 4.5rem);font-weight:500;line-height:1;margin-bottom:1rem">&lt;$1,000</div>
    <div style="font-size:1rem;color:rgba(255,255,255,0.75);line-height:1.4">in total advertising spend.</div>
  </div>
  <div style="background:#000;color:#fff;border-radius:24px 24px 24px 0;padding:3rem 2rem;display:flex;flex-direction:column;justifyContent:center;aspect-ratio:1/1">
    <div style="font-size:clamp(3rem, 5vw, 4.5rem);font-weight:500;line-height:1;margin-bottom:1rem">$600k+</div>
    <div style="font-size:1rem;color:rgba(255,255,255,0.75);line-height:1.4">in property pipeline revenue.</div>
  </div>
</div>`;

gs = gs.replace(p88Focus, gsStatsHtml);

// 5. The Challenge & The Solution -> The Impact & Gunajit Dutta Quote
const p88ChallengeHeading = `<h3 style="font-size:var(--fs-40);font-weight:400;margin-bottom:1rem">The Challenge</h3>`;
const gsImpactHeading = `<h2 style="font-size:clamp(2.5rem, 4vw, 3.5rem);font-weight:400;line-height:1.1;margin-bottom:1.5rem">The Impact</h2>`;
gs = gs.replace(p88ChallengeHeading, gsImpactHeading);

const p88ChallengeText = `<p style="font-size:1.15rem;line-height:1.6;color:rgba(0,0,0,0.8);max-width:60ch">HR compliance is rarely straightforward. Constantly changing regulations, scattered documentation, employee training requirements, and state-specific rules can leave businesses struggling to stay organised and prepared. The challenge was to bring these moving parts together in a way that reduces complexity, improves visibility, and helps teams move from reactive compliance management to a more proactive approach.</p>`;
const gsImpactText = `<p style="font-size:1.15rem;line-height:1.6;color:rgba(0,0,0,0.8);max-width:60ch;margin-bottom:1.5rem">This project demonstrates Kyoto Creative&#x27;s approach to combining creative execution with performance-driven marketing. By bringing together a newly developed website and targeted social media campaigns, we helped Green Square Infra establish its digital presence and generate a significant volume of property enquiries within its first month.</p><p style="font-size:1.15rem;line-height:1.6;color:rgba(0,0,0,0.8);max-width:60ch">The result was a measurable starting point for future marketing efforts, with a digital foundation in place to support continued campaign optimisation and growth.</p>`;
gs = gs.replace(p88ChallengeText, gsImpactText);

const p88SolutionHeading = `<h3 style="font-size:var(--fs-40);font-weight:400;margin-bottom:1rem">The Solution</h3>`;
const quoteSymbol = `<div style="text-align:center;font-size:3rem;line-height:1;margin:4rem 0 2rem;font-weight:900;letter-spacing:0.2em">“</div>`;
gs = gs.replace(p88SolutionHeading, quoteSymbol);

const p88SolutionText = `<p style="font-size:1.15rem;line-height:1.6;color:rgba(0,0,0,0.8);max-width:60ch">We helped shape a connected SaaS experience that brings AI-powered assistance, compliance workflows, and document oversight into a single unified platform. Designed with intuitive interaction models and clear visual hierarchy, the product provides clarity at every step—giving companies the confidence to manage compliance with speed, accuracy, and ease.</p>`;
const gsQuoteText = `<div style="max-width:850px;margin:0 auto;text-align:center">
  <blockquote style="font-size:clamp(1.5rem, 2.5vw, 2.25rem);line-height:1.35;font-weight:400;margin:0 0 2rem;color:#000">
    “Honestly, we weren't expecting results like this in the very first month. Generating over 800 leads in just 30 days with less than $1,000 in ad spend was genuinely impressive. Kyoto Creative understood what we wanted to achieve and brought our website and marketing together in a way that delivered results beyond our expectations. What stood out most was how efficiently they managed the budget while generating so much interest in our projects. We're really pleased with the work and excited about what we can achieve together moving forward.”
  </blockquote>
  <div style="margin-top:2rem">
    <div style="font-size:1.1rem;font-weight:600;color:#000">Gunajit Dutta</div>
    <div style="font-size:0.95rem;color:rgba(0,0,0,0.6);margin-top:0.25rem">Founder - Green Square Infra</div>
  </div>
</div>`;
gs = gs.replace(p88SolutionText, gsQuoteText);

// Also sync with green_square_infra_project_page.rsc for client navigations!
fs.writeFileSync('reference/pages/green_square_infra_project_page.html', gs, 'utf8');

// For .rsc, we generate the matching RSC text from 88pilot_project_page.rsc:
let rsc = fs.readFileSync('reference/pages/88pilot_project_page.rsc', 'utf8');
rsc = rsc.replaceAll('88Pilot - Kyoto Creative', 'Green Square Infra - Kyoto Creative');
rsc = rsc.replaceAll('/work/88pilot', '/work/green-square-infra');
rsc = rsc.replaceAll('Building an AI-Powered HR\nCompliance Platform', 'Turning Digital Marketing\ninto a Lead Generation\nEngine');
rsc = rsc.replaceAll('Building an AI-Powered HR Compliance Platform', 'Turning Digital Marketing into a Lead Generation Engine');

fs.writeFileSync('reference/pages/green_square_infra_project_page.rsc', rsc, 'utf8');
console.log('Successfully generated dedicated green_square_infra_project_page.html and .rsc!');
