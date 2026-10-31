import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { installHeroVideoControls } from './hero-video.js';
import { installFaqControls } from './faq-controls.js';
import { installLinkControls } from './link-controls.js';
import { installNavigationControls } from './navigation-controls.js';
import { installWorkArchiveMount } from './work-archive-mount.js';
import { installMediaScheduling } from './media-scheduling.js';
import { capturePage, pageKey, readIndex } from './page-cache.js';

import { localize } from './localize.mjs';
export { localize } from './localize.mjs';
const root = process.cwd();
const homepageFaqs = [
  {
    question: 'How long does a project usually take?',
    answer: 'Timelines vary by scope. A focused website project typically takes 3 –8 weeks. Full branding + website projects usually take 1–3 months. AI automation projects can move faster once the process is mapped. We’ll always give you a realistic timeline with clear milestones upfront.',
  },
  {
    question: 'Can you work with tight deadlines?',
    answer: 'Yes. When timelines are compressed, we prioritise the highest-impact work first and phase the rest. We’ll be honest about what’s realistically possible without compromising quality.',
  },
  {
    question: 'What kind of support do you offer after launch?',
    answer: 'We offer ongoing support packages that cover website maintenance, performance monitoring, content updates, and continued optimisation of your AI automations. You can choose the level of support that fits your needs after the project goes live.',
  },
  {
    question: 'How do you handle feedback and revisions?',
    answer: 'Feedback is a core part of our process. We build in structured review rounds at every major stage so your input is incorporated cleanly. This keeps the project moving forward while making sure the final work reflects your vision.',
  },
  {
    question: 'Can marketing, website, and AI automation work be combined in one project?',
    answer: 'Absolutely. Many of our clients work with us across multiple areas. We can run branding, website/app development, and AI automation as a single coordinated project or as separate phases — whichever makes more sense for your goals and budget.',
  },
  {
    question: 'Do you work with businesses outside our industry?',
    answer: 'Yes. While we have experience across several sectors, our approach is built around understanding your specific business, audience, and goals — not forcing a one-size-fits-all solution.',
  },
  {
    question: 'What happens after we finish the project?',
    answer: 'You’ll own everything we create. We also provide clear documentation and training so your team can manage day-to-day needs. If you want continued support, we have flexible retainers available.',
  },
];

function escapeHtml(text) {
  return text.replace(/[&<>"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
  })[character]);
}

function homepageFaqMarkup() {
  const entries = homepageFaqs.map(({ question, answer }) => `<div class="FaqsList_faq__US_6Y"><span class="FadeInUp_container___uxva" data-fill="false"><label class="FaqsList_question__6fKon"><span class="FaqsList_icon__54ODy"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path fill="#fff" d="M17.5 40V22.5H0v-5h17.5V0h5v17.5H40v5H22.5V40h-5z"></path></svg></span>${escapeHtml(question)}<input type="checkbox"/></label><div class="FaqsList_answer__XAnT2 prose"><div><p>${escapeHtml(answer)}</p>
</div></div></span></div>`).join('');
  return `<section class="FaqsList_faqsList__3yyiS"><div class="DarkThemeSwitch_cover__hn_xc"></div><div class="container"><div class="FaqsList_heading__kirHR"><p><span class="FadeInUp_container___uxva" data-fill="false">FAQ&#x27;s</span></p></div>${entries}</div></section>`;
}

function findFlightElement(node, className) {
  if (Array.isArray(node)) {
    if (node[0] === '$' && node[3]?.className?.split(/\s+/).includes(className)) return node;
  } else if (node && typeof node === 'object') {
    for (const child of Object.values(node)) {
      const found = findFlightElement(child, className);
      if (found) return found;
    }
    return null;
  } else {
    return null;
  }
  for (const child of node) {
    const found = findFlightElement(child, className);
    if (found) return found;
  }
  return null;
}

function homepageFaqFlightItems(originalItems) {
  const template = originalItems[0];
  if (!template) throw new Error('Homepage FAQ template was not found in Flight data');
  return homepageFaqs.map(({ question, answer }, index) => {
    const item = JSON.parse(JSON.stringify(originalItems[index] || template));
    item[2] = String(index);
    const label = findFlightElement(item, 'FaqsList_question__6fKon');
    const labelChildren = label?.[3].children;
    const questionIndex = labelChildren?.findIndex(child => typeof child === 'string');
    if (!labelChildren || questionIndex === undefined || questionIndex < 0) {
      throw new Error('Homepage FAQ question was not found in Flight data');
    }
    labelChildren[questionIndex] = question;
    const answerElement = findFlightElement(item, 'FaqsList_answer__XAnT2');
    const answerContainer = answerElement?.[3].children?.[3];
    if (!answerContainer?.dangerouslySetInnerHTML) {
      throw new Error('Homepage FAQ answer was not found in Flight data');
    }
    answerContainer.dangerouslySetInnerHTML.__html = `<p>${escapeHtml(answer)}</p>\n`;
    return item;
  });
}

function replaceHomepageFaqFlightRow(line) {
  if (!line.includes('"FaqsList_faqsList__3yyiS"')) return line;
  const prefix = line.match(/^(\d+:)/)?.[1];
  if (!prefix) throw new Error('Homepage FAQ Flight row has an unexpected format');
  const newline = line.endsWith('\n') ? '\n' : '';
  const document = JSON.parse(line.slice(prefix.length));
  const section = findFlightElement(document, 'FaqsList_faqsList__3yyiS');
  const container = section && findFlightElement(section[3].children, 'container');
  const containerChildren = container?.[3].children;
  const listIndex = containerChildren?.findIndex(child =>
    Array.isArray(child) && child[0]?.[3]?.className === 'FaqsList_faq__US_6Y');
  if (listIndex === undefined || listIndex < 0) throw new Error('Homepage FAQ list was not found in Flight data');
  containerChildren[listIndex] = homepageFaqFlightItems(containerChildren[listIndex]);
  return prefix + JSON.stringify(document) + newline;
}

const brandProcess = {
  heading: 'Our Process',
  subheading: 'How we work — We don’t start with ads, posts, or pretty visuals. We start with clarity — then build everything on top of it.',
  steps: [
    {
      heading: '1. Discovery',
      text: 'We dig into your business, audience, competitors, and current marketing. What’s working. What’s not. Where the real opportunity sits. This is where the guessing stops.',
      workInvolved: ['Business review', 'Audience review', 'Competitor review', 'Current marketing audit'],
    },
    {
      heading: '2. Strategy',
      text: 'We define your positioning, messaging, and marketing direction. This becomes the foundation for everything that follows — brand, content, PR, and paid.',
      workInvolved: ['Positioning', 'Messaging', 'Marketing direction'],
    },
    {
      heading: '3. Brand & Creative System',
      text: 'We shape how your brand looks and sounds. Visual identity, tone of voice, and core creative tools — so everything you put out feels consistent and intentional.',
      workInvolved: ['Visual identity', 'Tone of voice', 'Core creative tools'],
    },
    {
      heading: '4. Activation',
      text: 'This is where strategy turns into action. Campaigns, content, PR, and paid media — all connected, all working toward the same goal.',
      workInvolved: ['Campaigns', 'Content', 'PR', 'Paid media'],
    },
    {
      heading: '5. Optimise & Scale',
      text: 'We track what’s landing, refine what isn’t, and keep improving. Marketing shouldn’t reset every month. It should compound.',
      workInvolved: ['Performance tracking', 'Ongoing optimisation', 'Growth'],
    },
  ],
};

const webDesignProcess = {
  heading: 'Our design & development process',
  subheading: 'Every project is different, but the thinking stays connected. We move from clarity to craft without losing the plot along the way.',
  steps: [
    {
      heading: '1. Discovery',
      text: 'We dig into your business, users, and goals. What’s working, what’s broken, and what the product actually needs to achieve. Research, stakeholder conversations, and a clear picture before anything gets designed.',
    },
    {
      heading: '2. Digital Strategy',
      text: 'We turn business goals into a plan for the product. What the website or app needs to achieve, which journeys matter most, and how content, conversion, and performance should work together.',
    },
    {
      heading: '3. UX & Information Architecture',
      text: 'We organise the experience. Sitemaps, user flows, and structure that make complex things feel simple — so people can find what they need without fighting the interface.',
    },
    {
      heading: '4. Creative Direction',
      text: 'We decide how the product should feel. Visual direction, interaction ideas, and the creative rules that will shape the entire experience before detailed design begins.',
    },
    {
      heading: '5. UI & Product Design',
      text: 'We design the full interface system. Screens, components, and interactions that feel cohesive, responsive, and recognisably yours — balancing brand, usability, and conversion.',
    },
    {
      heading: '6. Development',
      text: 'We build with care. Clean, high-performance code for websites and apps, with flexible systems and thoughtful front-end interactions. Design and development stay aligned throughout.',
    },
    {
      heading: '7. Testing & Refinement',
      text: 'We put everything through its paces. Content population, cross-device testing, performance checks, accessibility, and quality assurance — small details get the same attention as the big moments.',
    },
    {
      heading: '8. Launch & Support',
      text: 'We launch carefully and stay available. Deployment, monitoring, training, and ongoing support so your team can manage and improve the product with confidence.',
    },
  ],
};

const growthMarketingProcess = {
  heading: 'Our AI Automation Process',
  subheading: 'Automations fail when deployed haphazardly onto fractured processes. Our process is structured, deliberate, and engineered to solve root bottlenecks before writing a line of code.',
  steps: [
    {
      heading: 'The Operational Bottleneck Audit',
      text: 'We analyze your existing operational architecture, tool stack, and human touchpoints to pinpoint where high-friction, repetitive work drains time, causes errors, and limits revenue capacity.',
    },
    {
      heading: 'Workflow Blueprint & Systems Architecture',
      text: 'We design the blueprint before implementing systems, mapping clear trigger-action diagrams, model routing mechanisms, API protocols, and fallback logic so every stakeholder understands how data flows.',
    },
    {
      heading: 'Agent Engineering & Core Build',
      text: 'We assemble the pipelines using modern orchestration platforms combined with custom scripts, function calling, vector embeddings, and API webhooks tailored to your infrastructure.',
    },
    {
      heading: 'Guardrail Testing & Shadow Execution',
      text: 'We run historical data and synthetic edge cases through the pipeline in shadow mode alongside your team, stress-testing deterministic outputs and catching edge cases before going live.',
    },
    {
      heading: 'AutoCare: Orchestration & Continuous Improvement',
      text: 'We act as your embedded automation engineering team—monitoring system reliability 24/7, patching breaking API changes, and iteratively shipping workflow upgrades.',
    },
  ],
};

const webDesignFaqs = [
  {
    question: 'Do you build both websites and apps?',
    answer: 'Yes. We design and develop marketing websites, product websites, web applications, and mobile apps. Many projects involve both a website and an app working together.',
  },
  {
    question: 'How long does a typical project take?',
    answer: 'Most website projects take 2–10 weeks. App projects or more complex platforms usually take longer depending on scope and features. We’ll give you a clear timeline once we understand what you need.',
  },
  {
    question: 'How much does a project cost?',
    answer: 'Pricing depends on the size and complexity of the work. After an initial conversation, we provide a fixed-price proposal with clear milestones. We prefer transparency over open-ended hourly billing.',
  },
  {
    question: 'What if we already have a website or app that needs improving?',
    answer: 'We can audit what you have, identify the highest-impact improvements, and either refine the existing product or rebuild where it makes more sense. Not every project needs to start from zero.',
  },
  {
    question: 'Do you offer support after launch?',
    answer: 'Yes. We provide ongoing support options covering maintenance, performance monitoring, updates, and continued improvements. Many clients stay on in a lighter support arrangement after the main project ends.',
  },
  {
    question: 'Will my team be able to update the website or app after launch?',
    answer: 'Yes. We build with practical content systems and clear documentation so your team can manage day-to-day updates without needing a developer for every small change.',
  },
];

const marketingBrandingFaqs = [
  {
    question: 'What does your Marketing & Branding service include?',
    answer: 'We cover the full spectrum: brand strategy and positioning, visual identity, tone of voice and messaging, content and campaigns, PR angles, and paid advertising. The goal is to create clarity first, then turn that clarity into marketing that performs.',
  },
  {
    question: 'Do I need a full rebrand, or can you work with what I already have?',
    answer: 'Not every business needs a complete rebrand. Sometimes the biggest gains come from sharper positioning, better messaging, refined creative, or stronger campaign direction. We’ll recommend what’s actually useful for your stage and goals — not the biggest possible project.',
  },
  {
    question: 'How is this different from just running ads or posting content?',
    answer: 'Most marketing fails because the foundation is weak. We start with strategy and positioning so your ads, content, and PR all pull in the same direction. Without that, you’re usually just spending money on noise.',
  },
  {
    question: 'How long does a typical project take?',
    answer: 'It depends on scope. A focused strategy + messaging project can take a few weeks. A fuller engagement that includes identity, campaigns, and paid media usually runs 8–16 weeks. We’ll give you a clear timeline once we understand what you need.',
  },
  {
    question: 'How much does it cost?',
    answer: 'Pricing depends on the scope of work. After an initial conversation, we provide a clear fixed-price proposal with milestones. We prefer transparency over vague retainers or open-ended hourly work.',
  },
  {
    question: 'Do you handle paid advertising as well?',
    answer: 'Yes. We plan and run paid campaigns (Meta, Google, LinkedIn and others) that stay connected to your brand strategy. Creative, messaging, and targeting work together instead of being treated as separate activities.',
  },
  {
    question: 'Can you help with PR and content too?',
    answer: 'Yes. We develop campaign ideas, content direction, and PR angles that align with your positioning. The focus is on the right kind of visibility — not just more output.',
  },
  {
    question: 'How do you measure success?',
    answer: 'We look at clarity and commercial impact: stronger messaging, better conversion, higher-quality leads, improved engagement, and more consistent brand presence. Strong brands reduce hesitation — that’s where the real value shows up.',
  },
  {
    question: 'Will my team be able to use what you create after the project?',
    answer: 'Yes. We build practical systems — positioning, messaging frameworks, brand guidelines, and creative direction — that your team can actually use day to day. The work is designed to live beyond the project.',
  },
  {
    question: 'Do you work with startups or only established companies?',
    answer: 'We work with both. What matters more than size is clarity of ambition and readiness to invest in doing the work properly. Whether you’re refining an existing brand or building from a stronger foundation, the approach stays the same: clarity first, then execution.',
  },
];

function findFlightBrandProcess(node) {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findFlightBrandProcess(child);
      if (found) return found;
    }
    return null;
  }
  if (!node || typeof node !== 'object') return null;
  if (node.data?.heading === 'Our brand process' && Array.isArray(node.data.blocks)) return node.data;
  for (const child of Object.values(node)) {
    const found = findFlightBrandProcess(child);
    if (found) return found;
  }
  return null;
}

function findFlightWebDesignProcess(node) {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findFlightWebDesignProcess(child);
      if (found) return found;
    }
    return null;
  }
  if (!node || typeof node !== 'object') return null;
  if (node.data?.heading === 'Our web design and development process.' && Array.isArray(node.data.blocks)) return node.data;
  for (const child of Object.values(node)) {
    const found = findFlightWebDesignProcess(child);
    if (found) return found;
  }
  return null;
}

function findFlightGrowthMarketingProcess(node) {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findFlightGrowthMarketingProcess(child);
      if (found) return found;
    }
    return null;
  }
  if (!node || typeof node !== 'object') return null;
  if (node.data?.heading === 'Our growth marketing process.' && Array.isArray(node.data.blocks)) return node.data;
  for (const child of Object.values(node)) {
    const found = findFlightGrowthMarketingProcess(child);
    if (found) return found;
  }
  return null;
}

function replaceGrowthMarketingProcessFlightRow(line) {
  if (!line.includes('"heading":"Our growth marketing process."')) return line;
  const prefix = line.match(/^(\d+:)/)?.[1];
  if (!prefix) throw new Error('Growth marketing process Flight row has an unexpected format');
  const newline = line.endsWith('\n') ? '\n' : '';
  const document = JSON.parse(line.slice(prefix.length));
  const data = findFlightGrowthMarketingProcess(document);
  if (!data || data.blocks.length < growthMarketingProcess.steps.length) {
    throw new Error('Growth marketing process data was not found in Flight row');
  }
  data.heading = growthMarketingProcess.heading;
  data.subheading = growthMarketingProcess.subheading;
  data.blocks = data.blocks.slice(0, growthMarketingProcess.steps.length).map((block, index) => ({
    ...block,
    ...growthMarketingProcess.steps[index],
  }));
  return prefix + JSON.stringify(document) + newline;
}

function replaceWebDesignProcessFlightRow(line) {
  if (!line.includes('"heading":"Our web design and development process."')) return line;
  const prefix = line.match(/^(\d+:)/)?.[1];
  if (!prefix) throw new Error('Web design process Flight row has an unexpected format');
  const newline = line.endsWith('\n') ? '\n' : '';
  const document = JSON.parse(line.slice(prefix.length));
  const data = findFlightWebDesignProcess(document);
  if (!data || data.blocks.length < webDesignProcess.steps.length) {
    throw new Error('Web design process data was not found in Flight row');
  }
  data.heading = webDesignProcess.heading;
  data.subheading = webDesignProcess.subheading;
  data.blocks = data.blocks.slice(0, webDesignProcess.steps.length).map((block, index) => ({
    ...block,
    ...webDesignProcess.steps[index],
  }));
  return prefix + JSON.stringify(document) + newline;
}

function replaceBrandProcessFlightRow(line) {
  if (!line.includes('"heading":"Our brand process"')) return line;
  const prefix = line.match(/^(\d+:)/)?.[1];
  if (!prefix) throw new Error('Brand process Flight row has an unexpected format');
  const newline = line.endsWith('\n') ? '\n' : '';
  const document = JSON.parse(line.slice(prefix.length));
  const data = findFlightBrandProcess(document);
  if (!data || data.blocks.length < brandProcess.steps.length) {
    throw new Error('Brand process data was not found in Flight row');
  }
  data.heading = brandProcess.heading;
  data.subheading = brandProcess.subheading;
  data.blocks = data.blocks.slice(0, brandProcess.steps.length).map((block, index) => ({
    ...block,
    ...brandProcess.steps[index],
    duration: '',
    weekNumber: index + 1,
    workInvolved: brandProcess.steps[index].workInvolved.map(item => ({ item })),
  }));
  return prefix + JSON.stringify(document) + newline;
}

function findFlightElementByClassPrefix(node, prefix) {
  if (Array.isArray(node)) {
    if (node[0] === '$' && node[3]?.className?.startsWith(prefix)) return node;
    for (const child of node) {
      const found = findFlightElementByClassPrefix(child, prefix);
      if (found) return found;
    }
    return null;
  }
  if (!node || typeof node !== 'object') return null;
  for (const child of Object.values(node)) {
    const found = findFlightElementByClassPrefix(child, prefix);
    if (found) return found;
  }
  return null;
}

function findFlightFaqItems(node) {
  if (Array.isArray(node)) {
    if (node.some(child =>
      Array.isArray(child) && child[0] === '$' && child[3]?.className?.startsWith('FaqsList_faq__'))) {
      return node;
    }
    for (const child of node) {
      const found = findFlightFaqItems(child);
      if (found) return found;
    }
  } else if (node && typeof node === 'object') {
    for (const child of Object.values(node)) {
      const found = findFlightFaqItems(child);
      if (found) return found;
    }
  }
  return null;
}

function replaceFlightFaqAnswer(node, html) {
  if (Array.isArray(node)) {
    if (node[3]?.dangerouslySetInnerHTML) {
      node[3].dangerouslySetInnerHTML.__html = html;
      return true;
    }
    return node.some(child => replaceFlightFaqAnswer(child, html));
  }
  if (!node || typeof node !== 'object') return false;
  if (node.dangerouslySetInnerHTML) {
    node.dangerouslySetInnerHTML.__html = html;
    return true;
  }
  return Object.values(node).some(child => replaceFlightFaqAnswer(child, html));
}

function replaceBrandFaqFlightRow(line) {
  if (!line.includes('How does branding influence online visibility and growth?')) return line;
  const prefix = line.match(/^(\d+:)/)?.[1];
  if (!prefix) throw new Error('Brand FAQ Flight row has an unexpected format');
  const newline = line.endsWith('\n') ? '\n' : '';
  const document = JSON.parse(line.slice(prefix.length));
  const section = findFlightElementByClassPrefix(document, 'FaqsList_faqsList__');
  const faqItems = section && findFlightFaqItems(section);
  if (!faqItems || faqItems.length !== marketingBrandingFaqs.length) {
    throw new Error('Brand FAQ items were not found in Flight data');
  }
  const template = faqItems[0];
  const updatedItems = marketingBrandingFaqs.map(({ question, answer }, index) => {
    const item = JSON.parse(JSON.stringify(faqItems[index] || template));
    item[2] = String(index);
    const label = findFlightElementByClassPrefix(item, 'FaqsList_question__');
    const labelChildren = label?.[3]?.children;
    const questionIndex = labelChildren?.findIndex(child => typeof child === 'string');
    if (!labelChildren || questionIndex === undefined || questionIndex < 0) {
      throw new Error('Brand FAQ question was not found in Flight data');
    }
    labelChildren[questionIndex] = question;
    const answerElement = findFlightElementByClassPrefix(item, 'FaqsList_answer__');
    if (!answerElement || !replaceFlightFaqAnswer(answerElement, `<p>${escapeHtml(answer)}</p>\n`)) {
      throw new Error('Brand FAQ answer was not found in Flight data');
    }
    return item;
  });
  faqItems.splice(0, faqItems.length, ...updatedItems);
  return prefix + JSON.stringify(document) + newline;
}

function replaceWebDesignFaqFlightRow(line) {
  if (!line.includes('What makes KOTA’s approach to web design different?')) return line;
  const prefix = line.match(/^(\d+:)/)?.[1];
  if (!prefix) throw new Error('Web design FAQ Flight row has an unexpected format');
  const newline = line.endsWith('\n') ? '\n' : '';
  const document = JSON.parse(line.slice(prefix.length));
  const section = findFlightElementByClassPrefix(document, 'FaqsList_faqsList__');
  const faqItems = section && findFlightFaqItems(section);
  if (!faqItems || faqItems.length !== webDesignFaqs.length) {
    throw new Error('Web design FAQ items were not found in Flight data');
  }
  const updatedItems = webDesignFaqs.map(({ question, answer }, index) => {
    const item = JSON.parse(JSON.stringify(faqItems[index]));
    item[2] = String(index);
    const label = findFlightElementByClassPrefix(item, 'FaqsList_question__');
    const labelChildren = label?.[3]?.children;
    const questionIndex = labelChildren?.findIndex(child => typeof child === 'string');
    if (!labelChildren || questionIndex === undefined || questionIndex < 0) {
      throw new Error('Web design FAQ question was not found in Flight data');
    }
    labelChildren[questionIndex] = question;
    const answerElement = findFlightElementByClassPrefix(item, 'FaqsList_answer__');
    if (!answerElement || !replaceFlightFaqAnswer(answerElement, `<p>${escapeHtml(answer)}</p>\n`)) {
      throw new Error('Web design FAQ answer was not found in Flight data');
    }
    return item;
  });
  faqItems.splice(0, faqItems.length, ...updatedItems);
  return prefix + JSON.stringify(document) + newline;
}

function removeCareersEmailFlightNode(node) {
  if (Array.isArray(node)) {
    for (let index = node.length - 1; index >= 0; index--) {
      const child = node[index];
      if (Array.isArray(child)
        && child[0] === '$'
        && child[3]?.className?.startsWith('ContactDetails_email__')
        && JSON.stringify(child).includes('careers@kota.co.uk')) {
        node.splice(index, 1);
      } else {
        removeCareersEmailFlightNode(child);
      }
    }
  } else if (node && typeof node === 'object') {
    for (const child of Object.values(node)) removeCareersEmailFlightNode(child);
  }
}

function updateContactEmailFlightNode(node, heading, oldEmail, email) {
  if (Array.isArray(node)) {
    for (const child of node) updateContactEmailFlightNode(child, heading, oldEmail, email);
    return;
  }
  if (!node || typeof node !== 'object') return;
  if (node.className?.startsWith('ContactDetails_heading__') && node.children === heading.old) {
    node.children = heading.next;
  }
  if (node.text === oldEmail) node.text = email;
  for (const child of Object.values(node)) updateContactEmailFlightNode(child, heading, oldEmail, email);
}

function replaceContactEmailsFlightNode(node) {
  if (Array.isArray(node)) {
    for (const child of node) {
      if (!Array.isArray(child) || child[0] !== '$' || !child[3]?.className?.startsWith('ContactDetails_email__')) continue;
      const source = JSON.stringify(child);
      if (source.includes('hello@kota.co.uk')) {
        updateContactEmailFlightNode(child, { old: 'General', next: 'General Inquiry' }, 'hello@kota.co.uk', 'business@kyotocreative.com');
      } else if (source.includes('newbiz@kota.co.uk')) {
        updateContactEmailFlightNode(child, { old: 'New business', next: 'Founder & CEO' }, 'newbiz@kota.co.uk', 'adhiraj@kyotocreative.com');
      }
    }
    for (const child of node) replaceContactEmailsFlightNode(child);
  } else if (node && typeof node === 'object') {
    for (const child of Object.values(node)) replaceContactEmailsFlightNode(child);
  }
}

function removeContactAddressesFlightNode(node) {
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      const child = node[i];
      if (Array.isArray(child) && child[0] === '$' && child[3]?.className?.startsWith('ContactDetails_addresses__')) {
        node.splice(i, 1);
        return true;
      }
      if (removeContactAddressesFlightNode(child)) return true;
    }
  } else if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) {
      if (removeContactAddressesFlightNode(node[key])) return true;
    }
  }
  return false;
}

function updateContactFollowsFlightNode(node) {
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      const child = node[i];
      if (Array.isArray(child) && child[0] === '$' && child[3]?.className?.startsWith('ContactDetails_follows__')) {
        const linksArray = child[3].children && child[3].children[1];
        if (Array.isArray(linksArray)) {
          for (const linkWrapper of linksArray) {
            const aTag = linkWrapper && linkWrapper[3] && linkWrapper[3].children;
            if (aTag && aTag[3] && aTag[3].children === 'awwwards') {
              aTag[3].children = 'Instagram';
              aTag[3].href = 'https://www.instagram.com/kyotocreativeco?mdxt=MWhhemd6MGJiZHhxOQ%3D%3D';
            }
          }
          const clutchIdx = linksArray.findIndex(linkWrapper => {
            const aTag = linkWrapper && linkWrapper[3] && linkWrapper[3].children;
            return aTag && aTag[3] && aTag[3].children === 'Clutch';
          });
          if (clutchIdx !== -1) {
            linksArray.splice(clutchIdx, 1);
          }
        }
        return true;
      }
      if (updateContactFollowsFlightNode(child)) return true;
    }
  } else if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) {
      if (updateContactFollowsFlightNode(node[key])) return true;
    }
  }
  return false;
}

function replaceContactBrandFlightNode(node) {
  if (Array.isArray(node)) {
    if (node[0] === '$' && node[3]?.className?.startsWith('ContactDetails_contactDetails__')) {
      const replaceText = value => {
        if (typeof value === 'string') return value.replaceAll('KOTA', 'Kyoto Creative');
        if (Array.isArray(value)) return value.map(replaceText);
        if (value && typeof value === 'object') {
          for (const [key, child] of Object.entries(value)) value[key] = replaceText(child);
        }
        return value;
      };
      replaceText(node[3]);
      return;
    }
    for (const child of node) replaceContactBrandFlightNode(child);
  } else if (node && typeof node === 'object') {
    for (const child of Object.values(node)) replaceContactBrandFlightNode(child);
  }
}

function replaceContactEmailsFlightRow(line) {
  if ((!line.includes('ContactDetails_email__') || !line.includes('newbiz@kota.co.uk'))
    && !line.includes('+44(0)20 3951 0562')
    && !line.includes('1-5 Clerkenwell Rd')) return line;
  const prefix = line.match(/^(\d+:)/)?.[1];
  if (!prefix) throw new Error('Contact email Flight row has an unexpected format');
  const newline = line.endsWith('\n') ? '\n' : '';
  const document = JSON.parse(line.slice(prefix.length));
  replaceContactEmailsFlightNode(document);
  const replacePhone = node => {
    if (Array.isArray(node)) {
      for (const child of node) replacePhone(child);
    } else if (node && typeof node === 'object') {
      if (node.children === '+44(0)20 3951 0562') node.children = '+91 7031853012';
      if (node.href === 'tel:+44(0)20 3951 0562') node.href = 'tel:+91 7031853012';
      for (const child of Object.values(node)) replacePhone(child);
    }
  };
  replacePhone(document);
  removeContactAddressesFlightNode(document);
  replaceContactBrandFlightNode(document);
  updateContactFollowsFlightNode(document);
  return prefix + JSON.stringify(document) + newline;
}

function removeCareersEmailFlightRow(line) {
  if (!line.includes('careers@kota.co.uk') || !line.includes('Work with us')) return line;
  const prefix = line.match(/^(\d+:)/)?.[1];
  if (!prefix) throw new Error('Careers email Flight row has an unexpected format');
  const newline = line.endsWith('\n') ? '\n' : '';
  const document = JSON.parse(line.slice(prefix.length));
  removeCareersEmailFlightNode(document);
  return prefix + JSON.stringify(document) + newline;
}

function findDivEnd(markup, start) {
  const tags = /<\/?div\b[^>]*>/gi;
  tags.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = tags.exec(markup))) {
    if (match[0].startsWith('</')) depth--;
    else if (!match[0].endsWith('/>')) depth++;
    if (depth === 0) return tags.lastIndex;
  }
  throw new Error('Brand process markup contains an unclosed div');
}

function replaceWebDesignProcessHtml(html) {
  const sectionPattern = /<section class="Timeline_timeline__[^"]*"[\s\S]*?<\/section>/g;
  return html.replace(sectionPattern, section => {
    if (!section.includes('Our web design and development process.') && !section.includes(webDesignProcess.heading)) return section;
    section = section.replace(/<section class="([^"]*)"/, '<section class="$1 web-design-process-timeline"');
    section = section.replace('Our web design and development process.', escapeHtml(webDesignProcess.heading));
    section = section.replace(
      'Every project is different, but the thinking stays joined up. We move from discovery and digital strategy through UX, creative design and development without losing the thread (or the big idea) along the way.',
      escapeHtml(webDesignProcess.subheading),
    );

    const blockPattern = /<div class="Timeline_block__[^"]*"[^>]*>/g;
    const blocks = [];
    let match;
    while ((match = blockPattern.exec(section))) {
      const end = findDivEnd(section, match.index);
      blocks.push({ start: match.index, end, markup: section.slice(match.index, end) });
      blockPattern.lastIndex = end;
    }
    if (blocks.length < webDesignProcess.steps.length) {
      throw new Error('Web design process HTML is missing timeline blocks');
    }

    const updatedBlocks = blocks.slice(0, webDesignProcess.steps.length).map(({ markup }, index) => {
      let block = markup.replace(
        /(<p class="Timeline_blockHeading__[^"]*"><span>)[\s\S]*?(<\/span>)/,
        `$1${escapeHtml(webDesignProcess.steps[index].heading)}$2`,
      );
      block = block.replace(
        /(<p class="Timeline_blockText__[^"]*">)[\s\S]*?(<\/p>)/,
        `$1${escapeHtml(webDesignProcess.steps[index].text)}$2`,
      );
      return block;
    });

    section = section.slice(0, blocks[0].start) + updatedBlocks.join('') + section.slice(blocks.at(-1).end);
    return section;
  });
}

function replaceGrowthMarketingProcessHtml(html) {
  const sectionPattern = /<section class="Timeline_timeline__[^"]*"[\s\S]*?<\/section>/g;
  return html.replace(sectionPattern, section => {
    if (!section.includes(growthMarketingProcess.heading)) return section;
    section = section.replace(/<section class="([^"]*)"/, '<section class="$1 growth-marketing-process-timeline"');
    const blockPattern = /<div class="Timeline_block__[^"]*"[^>]*>/g;
    const blocks = [];
    let match;
    while ((match = blockPattern.exec(section))) {
      const end = findDivEnd(section, match.index);
      blocks.push({ start: match.index, end, markup: section.slice(match.index, end) });
      blockPattern.lastIndex = end;
    }
    if (blocks.length < growthMarketingProcess.steps.length) {
      throw new Error('Growth marketing process HTML is missing timeline blocks');
    }

    const updatedBlocks = blocks.slice(0, growthMarketingProcess.steps.length).map(({ markup }, index) => {
      let block = markup.replace(
        /(<p class="Timeline_blockHeading__[^"]*"><span>)[\s\S]*?(<\/span>)/,
        `$1${escapeHtml(growthMarketingProcess.steps[index].heading)}$2`,
      );
      block = block.replace(
        /(<p class="Timeline_blockText__[^"]*">)[\s\S]*?(<\/p>)/,
        `$1${escapeHtml(growthMarketingProcess.steps[index].text)}$2`,
      );
      return block;
    });

    section = section.slice(0, blocks[0].start) + updatedBlocks.join('') + section.slice(blocks.at(-1).end);
    return section;
  });
}

function replaceBrandProcessHtml(html) {
  const sectionPattern = /<section class="Timeline_timeline__[^"]*"[\s\S]*?<\/section>/g;
  return html.replace(sectionPattern, section => {
    if (!section.includes('Our brand process')) return section;
    if (!section.includes('Every stage is built to uncover what makes you different')) {
      throw new Error('Brand process HTML has an unexpected heading');
    }

    section = section.replace('Our brand process', brandProcess.heading);
    section = section.replace(
      'Every stage is built to uncover what makes you different, sharpen how you communicate it, and turn it into a system that works in the real world.',
      brandProcess.subheading,
    );

    const blockPattern = /<div class="Timeline_block__[^"]*"[^>]*>/g;
    const blocks = [];
    let match;
    while ((match = blockPattern.exec(section))) {
      const end = findDivEnd(section, match.index);
      blocks.push({ start: match.index, end, markup: section.slice(match.index, end) });
      blockPattern.lastIndex = end;
    }
    if (blocks.length < brandProcess.steps.length) {
      throw new Error('Brand process HTML is missing timeline blocks');
    }

    const updatedBlocks = blocks.slice(0, brandProcess.steps.length).map(({ markup }, index) => {
      let block = markup.replace(
        /(<p class="Timeline_blockHeading__[^"]*"><span>)[\s\S]*?(<\/span>)/,
        `$1${escapeHtml(brandProcess.steps[index].heading)}$2`,
      );
      block = block.replace(
        /(<span class="Timeline_duration__[^"]*">)[\s\S]*?(<\/span>)/,
        '$1$2',
      );
      block = block.replace(
        /(<p class="Timeline_blockText__[^"]*">)[\s\S]*?(<\/p>)/,
        `$1${escapeHtml(brandProcess.steps[index].text)}$2`,
      );
      block = block.replace(
        /(<div class="Timeline_workInvolvedList__[^"]*">)[\s\S]*?(<\/div>)/,
        `$1${brandProcess.steps[index].workInvolved.map(item => `<span>${escapeHtml(item)}</span>`).join('')}$2`,
      );
      return block;
    });

    section = section.slice(0, blocks[0].start) + updatedBlocks.join('') + section.slice(blocks.at(-1).end);

    const timelinePattern = /<div class="Timeline_bottomTimeline__[^"]*"[^>]*>/;
    const timeline = timelinePattern.exec(section);
    if (!timeline) throw new Error('Brand process timeline footer was not found');
    const timelineEnd = findDivEnd(section, timeline.index);
    const timelineMarkup = section.slice(timeline.index, timelineEnd);
    const blockTimeClass = timelineMarkup.match(/class="(Timeline_blockTime__[^"]*)"/)?.[1];
    const weekNumberClass = timelineMarkup.match(/class="(Timeline_weekNumber__[^"]*)"/)?.[1];
    if (!blockTimeClass || !weekNumberClass) throw new Error('Brand process timeline footer has an unexpected format');
    const footer = `${timeline[0]}${brandProcess.steps.map((_, index) =>
      `<div class="${blockTimeClass}"><span class="${weekNumberClass}">Week <!-- -->${index + 1}</span></div>`).join('')}</div>`;
    return section.slice(0, timeline.index) + footer + section.slice(timelineEnd);
  });
}

function replaceBrandFaqHtml(html) {
  const sectionPattern = /<section class="FaqsList_faqsList__[^"]*"[\s\S]*?<\/section>/g;
  return html.replace(sectionPattern, section => {
    if (!section.includes('How does branding influence online visibility and growth?')) return section;
    const faqPattern = /<div class="FaqsList_faq__[^"]*"[^>]*>/g;
    const faqItems = [];
    let match;
    while ((match = faqPattern.exec(section))) {
      const end = findDivEnd(section, match.index);
      faqItems.push({ start: match.index, end, markup: section.slice(match.index, end) });
      faqPattern.lastIndex = end;
    }
    if (faqItems.length !== marketingBrandingFaqs.length) {
      throw new Error('Brand FAQ items were not found in HTML');
    }

    const updatedItems = marketingBrandingFaqs.map(({ question, answer }, index) => {
      let item = faqItems[index].markup.replace(
        /(<label class="FaqsList_question__[^"]*">[\s\S]*?<\/span>)[\s\S]*?(<input\b[^>]*\/?>[\s\S]*?<\/label>)/,
        (_, prefix, suffix) => `${prefix}${escapeHtml(question)}${suffix}`,
      );
      const answerStart = item.search(/<div class="FaqsList_answer__[^"]*"[^>]*>/);
      if (answerStart < 0) throw new Error('Brand FAQ answer container was not found in HTML');
      const answerEnd = findDivEnd(item, answerStart);
      const answerOpenEnd = item.indexOf('>', answerStart) + 1;
      item = item.slice(0, answerOpenEnd)
        + `<div><p>${escapeHtml(answer)}</p>\n</div>`
        + item.slice(answerEnd - 6);
      return item;
    });

    return section.slice(0, faqItems[0].start)
      + updatedItems.join('')
      + section.slice(faqItems.at(-1).end);
  });
}

function replaceWebDesignFaqHtml(html) {
  const sectionPattern = /<section class="FaqsList_faqsList__[^"]*"[\s\S]*?<\/section>/g;
  return html.replace(sectionPattern, section => {
    if (!section.includes('What makes KOTA’s approach to web design different?')) return section;
    const faqPattern = /<div class="FaqsList_faq__[^"]*"[^>]*>/g;
    const faqItems = [];
    let match;
    while ((match = faqPattern.exec(section))) {
      const end = findDivEnd(section, match.index);
      faqItems.push({ start: match.index, end, markup: section.slice(match.index, end) });
      faqPattern.lastIndex = end;
    }
    if (faqItems.length !== webDesignFaqs.length) {
      throw new Error('Web design FAQ items were not found in HTML');
    }

    const updatedItems = webDesignFaqs.map(({ question, answer }, index) => {
      let item = faqItems[index].markup.replace(
        /(<label class="FaqsList_question__[^"]*">[\s\S]*?<\/span>)[\s\S]*?(<input\b[^>]*\/?>[\s\S]*?<\/label>)/,
        (_, prefix, suffix) => `${prefix}${escapeHtml(question)}${suffix}`,
      );
      const answerStart = item.search(/<div class="FaqsList_answer__[^"]*"[^>]*>/);
      if (answerStart < 0) throw new Error('Web design FAQ answer container was not found in HTML');
      const answerEnd = findDivEnd(item, answerStart);
      const answerOpenEnd = item.indexOf('>', answerStart) + 1;
      item = item.slice(0, answerOpenEnd)
        + `<div><p>${escapeHtml(answer)}</p>\n</div>`
        + item.slice(answerEnd - 6);
      return item;
    });

    return section.slice(0, faqItems[0].start)
      + updatedItems.join('')
      + section.slice(faqItems.at(-1).end);
  });
}

function removeCareersEmailHtml(html) {
  const emailIndex = html.indexOf('careers@kota.co.uk');
  if (emailIndex < 0) return html;
  const blockStart = html.lastIndexOf('<div class="ContactDetails_email__', emailIndex);
  if (blockStart < 0) throw new Error('Careers email container was not found in HTML');
  return html.slice(0, blockStart) + html.slice(findDivEnd(html, blockStart));
}

function replaceContactEmailsHtml(html) {
  const sectionPattern = /<section class="ContactDetails_contactDetails__[^"]*"[\s\S]*?<\/section>/g;
  return html.replace(sectionPattern, section => {
    section = section.replaceAll('KOTA', 'Kyoto Creative');
    section = section.replaceAll('+44(0)20 3951 0562', '+91 7031853012');
    section = section.replace(/<div class="ContactDetails_addresses__[^\"]*\"[\s\S]*?<\/div>\s*<\/div>/, '');
    const emailPattern = /<div class="ContactDetails_email__[^"]*"[^>]*>/g;
    const blocks = [];
    let match;
    while ((match = emailPattern.exec(section))) {
      const end = findDivEnd(section, match.index);
      blocks.push({ start: match.index, end, markup: section.slice(match.index, end) });
      emailPattern.lastIndex = end;
    }
    const updates = blocks.map(({ markup }) => {
      if (markup.includes('business@kyotocreative.com')) {
        return markup.replace(
          /(<p class="ContactDetails_heading__[^"]*">)[\s\S]*?(<\/p>)/,
          '$1General Inquiry$2',
        );
      }
      if (markup.includes('newbiz@kota.co.uk')) {
        return markup
          .replace(
            /(<p class="ContactDetails_heading__[^"]*">)[\s\S]*?(<\/p>)/,
            '$1Founder &amp; CEO$2',
          )
          .replace(
            /(<a class="[^"]*CopyText_copyText__[^"]*">)[\s\S]*?(<div class="CopyText_tooltip__)/,
            '$1adhiraj@kyotocreative.com$2',
          );
      }
      return markup;
    });
    for (let index = blocks.length - 1; index >= 0; index--) {
      section = section.slice(0, blocks[index].start) + updates[index] + section.slice(blocks[index].end);
    }
    section = section.replace(/href="https:\/\/www\.awwwards\.com\/kota\/" target="_blank">awwwards<\/a>/, 'href="https://www.instagram.com/kyotocreativeco?mdxt=MWhhemd6MGJiZHhxOQ%3D%3D" target="_blank">Instagram</a>');
    section = section.replace(/<span class="FadeIn_container__bjQVL" data-fill="false"><a class="ContactDetails_follow__WB_uR" href="https:\/\/clutch\.co\/profile\/kota#highlights" target="_blank">Clutch<\/a><\/span>/, '');
    return section;
  });
}

function replaceContactNewsletterCopy(html) {
  return html
    .replace(
    "I&#x27;m happy to receive a monthly newsletter from KOTA",
    "I&#x27;m happy to receive a monthly newsletter from Kyoto Creative",
    )
    .replace(
      'I understand that KOTA will securely hold my data in accordance with their privacy policy.',
      'I understand that Kyoto Creative will securely hold my data in accordance with their privacy policy.',
    );
}

function replaceHomepageFaqHtml(html) {
  const section = /<section class="FaqsList_faqsList__[^"]*"[\s\S]*?<\/section>/;
  if (!section.test(html)) throw new Error('Homepage FAQ section was not found in HTML');
  return html.replace(section, homepageFaqMarkup());
}

/** Flight text rows carry UTF-8 byte lengths, not newline-delimited JSON. */
export function localizeFlight(text, route) {
  const source = Buffer.from(text);
  const rows = [];
  let cursor = 0;
  while (cursor < source.length) {
    const colon = source.indexOf(58, cursor);
    if (colon !== -1 && source[colon + 1] === 84) {
      const id = source.subarray(cursor, colon).toString();
      const comma = source.indexOf(44, colon + 2);
      const hex = source.subarray(colon + 2, comma).toString();
      if (/^[a-f\d]+$/i.test(id) && /^[a-f\d]+$/i.test(hex)) {
        const end = comma + 1 + parseInt(hex, 16);
        let value = localize(source.subarray(comma + 1, end).toString());
        rows.push(id + ':T' + Buffer.byteLength(value).toString(16) + ',' + value);
        cursor = end;
        continue;
      }
    }
    const newline = source.indexOf(10, cursor);
    const end = newline === -1 ? source.length : newline + 1;
    let row = source.subarray(cursor, end).toString();
    if (route === '/') row = replaceHomepageFaqFlightRow(row);
    row = replaceWebDesignProcessFlightRow(row);
    row = replaceGrowthMarketingProcessFlightRow(row);
    row = replaceBrandProcessFlightRow(row);
    if (route === '/contact') {
      row = replaceContactEmailsFlightRow(row);
      row = removeCareersEmailFlightRow(row);
      const prefix = row.match(/^(\d+:)/)?.[1];
      if (prefix && (row.includes('ContactDetails_contactDetails__') || row.includes('ContactDetails_addresses__'))) {
        const document = JSON.parse(row.slice(prefix.length));
        replaceContactBrandFlightNode(document);
        removeContactAddressesFlightNode(document);
        updateContactFollowsFlightNode(document);
        row = prefix + JSON.stringify(document) + (row.endsWith('\n') ? '\n' : '');
      }
    }
    row = replaceWebDesignFaqFlightRow(row);
    row = replaceBrandFaqFlightRow(row);
    row = localize(row);
    rows.push(row);
    cursor = end;
  }
  return rows.join('');
}

function localizeDocument(html, route) {
  const parts = [];
  const placeholder = '<!--replica-flight-stream-->';
  let first = true;
  html = html.replace(/<script[^>]*>\s*self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g, (script, data) => {
    let value;
    try { value = JSON.parse(data); } catch { return script; }
    if (value[0] !== 1) return script;
    parts.push(value[1]);
    const result = first ? placeholder : '';
    first = false;
    return result;
  });
  html = localize(html);
  if (route === '/contact') html = replaceContactNewsletterCopy(html);
  html = replaceWebDesignProcessHtml(html);
  html = replaceGrowthMarketingProcessHtml(html);
  html = replaceBrandProcessHtml(html);
  html = replaceWebDesignFaqHtml(html);
  html = replaceBrandFaqHtml(html);
  if (route === '/contact') {
    html = replaceContactEmailsHtml(html);
    html = removeCareersEmailHtml(html);
  }
  if (route === '/') html = replaceHomepageFaqHtml(html);
  if (parts.length) {
    let flightText;
    if (route === '/work' || route.startsWith('/work/')) {
      flightText = localize(parts.join(''));
    } else {
      flightText = localizeFlight(parts.join(''), route);
    }
    const data = JSON.stringify([1, flightText]).replaceAll('<', '\\u003c');
    html = html.replace(placeholder, '<script>self.__next_f.push(' + data + ')</script>');
  }
  return html;
}

const rendered = new Map();
async function readPage(file, temporary) {
  if (temporary) return fs.readFile(path.join(/* turbopackIgnore: true */ os.tmpdir(), 'kota-pages', path.basename(file)), 'utf8');
  return fs.readFile(path.join(root, 'reference/pages', path.basename(file)), 'utf8');
}
async function memoize(key, render) {
  if (!key) return render();
  // cache disabled for live dev updates
  // if (rendered.has(key)) return rendered.get(key);
  const pending = render();
  rendered.set(key, pending);
  // Bound warm-instance memory; do not retain all 335 documents and streams.
  if (rendered.size > 64) rendered.delete(rendered.keys().next().value);
  try { return await pending; } catch (error) { rendered.delete(key); throw error; }
}

const boot = `<script data-replica-runtime>
(${installMediaScheduling.toString()})();
(${installHeroVideoControls.toString()})();
(${installFaqControls.toString()})();
(${installLinkControls.toString()})();
(${installNavigationControls.toString()})();
(${installWorkArchiveMount.toString()})();
(() => {
  // Scroll-triggered videos may leave the viewport while play() is pending.
  // A browser AbortError in that case is expected and must not become an
  // unhandled rejection; retain real decoding/network failures.
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function() {
    const pending = play.call(this);
    return pending && pending.catch(error => { if (error.name !== 'AbortError') throw error; });
  };
  // Keep marketing analytics from sending replica visitors to the original account.
  const append = Node.prototype.appendChild;
  Node.prototype.appendChild = function(node) {
    if (node.tagName === 'SCRIPT' && /googletagmanager|google-analytics|vercel.live|hotjar/.test(node.src)) return node;
    return append.call(this, node);
  };
})();
</script>`;

export async function documentResponse(request, route) {
  const routes = await readIndex('routes.json');
  route = route.replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '') || '/';
  const key = pageKey(route, new URL(request.url).search);
  const redirects = await readIndex('redirects.json');
  if (redirects[key]) return Response.redirect(new URL(redirects[key], request.url), 307);
  const variants = await readIndex('variants.json');
  let file = key === route ? routes[route] : variants[key];
  let temporary = false;
  const cacheable = key === route && Boolean(file);
  if (!file) {
    const captured = await capturePage(key);
    if (captured.redirect) return Response.redirect(new URL(captured.redirect, request.url), 307);
    if (!captured.filename) return new Response(captured.status === 404 ? 'Page not found.' : 'This page could not be loaded. Please try again.', { status: captured.status });
    file = captured.filename;
    temporary = Boolean(captured.temporary);
  }
  if (request.headers.get('rsc') === '1') {
    try {
      const flight = await memoize(cacheable && file + ':rsc', async () => {
        let text = await readPage(file.replace('.html', '.rsc'), temporary);
        if (route === '/work' || route.startsWith('/work/')) {
          return localize(text);
        }
        return localizeFlight(text, route);
      });
      return new Response(flight, { headers: { 'Content-Type': 'text/x-component', 'Cache-Control': 'no-cache', Vary: 'RSC, Next-Router-State-Tree, Next-Router-Prefetch' } });
    } catch { /* Next's client falls back to document navigation if uncaptured. */ }
  }
  const html = await memoize(cacheable && route + ':' + file, async () => {
  const { version } = await readIndex('static-assets.json');
  let html = await readPage(file, temporary);
  html = localizeDocument(html, route);
  html = html.replace(/((?:src|href)="\/_next\/static\/[^"?]+\.(?:js|css))"/g, '$1?replica=' + version + '"');
  // Fresh principal pages use untouched source markup. Older mirrored documents
  // have rewritten relative URLs; a base restores their original directory.
  const base = route === '/' ? '/' : route.slice(0, route.lastIndexOf('/') + 1);
  const partnersStyle = route === '/' ? '<style>.Partners_partners__jBo8y{display:none!important}</style>' : '';
  const processStyle = route === '/service/growth-marketing' || route === '/service/web-design-development'
    ? '<style>.growth-marketing-process-timeline [class^="Timeline_workInvolved__"],.growth-marketing-process-timeline [class*=" Timeline_workInvolved__"],.growth-marketing-process-timeline [class^="Timeline_duration__"],.growth-marketing-process-timeline [class*=" Timeline_duration__"],.growth-marketing-process-timeline [class^="Timeline_bottomTimeline__"],.growth-marketing-process-timeline [class*=" Timeline_bottomTimeline__"],.web-design-process-timeline [class^="Timeline_workInvolved__"],.web-design-process-timeline [class*=" Timeline_workInvolved__"],.web-design-process-timeline [class^="Timeline_duration__"],.web-design-process-timeline [class*=" Timeline_duration__"],.web-design-process-timeline [class^="Timeline_bottomTimeline__"],.web-design-process-timeline [class*=" Timeline_bottomTimeline__"]{display:none!important}</style>'
    : '';
  const contactEmailStyle = route === '/contact'
    ? '<style>.ContactDetails_contactDetails__KiaCK .ContactDetails_right__D3SFA>div:first-child>.ContactDetails_email__X5toE:nth-child(-n+2) .CopyText_copyText__OtWNq{font-size:.8em}</style>'
    : '';
  html = html.replace('<head>', '<head>' + partnersStyle + processStyle + contactEmailStyle + '<base href="' + base + '">' + boot);
  html = html.replace(/<script[^>]*src="https:\/\/(?:www\.)?(?:googletagmanager\.com|vercel\.live)[^>]*><\/script>/g, '');
  return html;
  });
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache', Vary: 'RSC, Next-Router-State-Tree, Next-Router-Prefetch' } });
}

export async function assetResponse(request, host, asset) {
  const hosts = new Set(['kota.co.uk', 'content.kota.co.uk', 'kota-content.b-cdn.net', 'prod.spline.design', 'unpkg.com']);
  if (!hosts.has(host)) return new Response('Unknown asset host', { status: 404 });
  const url = new URL('https://' + host + '/' + asset);
  if (url.hostname !== host) return new Response('Invalid asset path', { status: 400 });
  url.search = new URL(request.url).search;
  const [index, manifest] = await Promise.all([readIndex('assets.json'), readIndex('static-assets.json')]);
  const filename = index[url.href] || index[url.origin + url.pathname]
    || 'reference/assets/' + crypto.createHash('sha256').update(url.href).digest('hex') + (path.extname(url.pathname) || '.bin');
  const destination = manifest.files?.[path.basename(filename)];
  if (destination) return new Response(null, { status: 307, headers: {
    Location: destination, 'Cache-Control': 'public, max-age=3600',
  } });
  // Uncaptured public assets stream from their existing CDN. Never download an
  // entire video into server memory or try to write to Vercel's deployment disk.
  return new Response(null, { status: 307, headers: {
    Location: url.href, 'Cache-Control': 'public, max-age=300',
  } });
}
