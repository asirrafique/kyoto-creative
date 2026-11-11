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

function removeFlightElements(node, className) {
  let removed = 0;
  if (Array.isArray(node)) {
    for (let index = node.length - 1; index >= 0; index--) {
      const child = node[index];
      if (Array.isArray(child) && child[0] === '$' && child[3]?.className?.split(/\s+/).includes(className)) {
        node.splice(index, 1);
        removed++;
      } else {
        removed += removeFlightElements(child, className);
      }
    }
  } else if (node && typeof node === 'object') {
    for (const child of Object.values(node)) {
      removed += removeFlightElements(child, className);
    }
  }
  return removed;
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


const workArchiveStaticHtml = "<div class=\"work-react-archive-mount\" style=\"grid-column: span 12; width: 100%;\"><div class=\"Filters_filters__Q0lSM\"><div class=\"Filters_left__IQOv2\"><div class=\"Filters_triggers__mq2v7\"><button class=\"Filters_trigger__2suyY \">Sectors<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32.53 18.59\"><path fill=\"currentColor\" d=\"M16.26 18.59L0 2.32 2.32 0l13.94 13.94L30.21 0l2.32 2.32-16.26 16.26z\"></path></svg></button><button class=\"Filters_trigger__2suyY \">Services<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32.53 18.59\"><path fill=\"currentColor\" d=\"M16.26 18.59L0 2.32 2.32 0l13.94 13.94L30.21 0l2.32 2.32-16.26 16.26z\"></path></svg></button></div></div><div class=\"Filters_right__RxPXO\"><div class=\"ActiveFilters_filterList__7UN2U\"></div></div></div><div class=\"AnimatedWorkGrid_grid__4aD0h\"><div class=\"ProjectsList_projectList__H4dCn\"><a class=\"ProjectCard_project__d1wbY ProjectCard_small__xsL92\" data-animation=\"grid-item\" href=\"/work/88pilot\"><div class=\"ProjectCard_projectText__o770X\"><h3><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14.78 14.78\"><defs><linearGradient id=\"d\" x1=\"3.54\" x2=\"13.98\" y1=\"3.54\" y2=\"13.99\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#7c41f3\"></stop><stop offset=\"1\" stop-color=\"#ff6eff\"></stop></linearGradient></defs><path fill=\"url(#d)\" stroke-width=\"0\" d=\"M13.25 12.18L13.25 0.23 14.78 0.23 14.78 14.76 14.74 14.76 14.74 14.78 0.21 14.78 0.21 13.25 12.18 13.25 0 1.08 1.08 0 13.25 12.18z\"></path></svg>88Pilot</h3><p>2026</p></div><div class=\"ProjectCard_projectImage__Nfx9I\"><div class=\"ProjectCard_imageOverlay__OCawr\"><p class=\"ProjectCard_heading__1csIW\">Building an AI-Powered HR Compliance Platform</p><ul class=\"ProjectCard_tags__XdVcf\"><li>Branding</li><li>Website &amp; App Development</li><li>Brand strategy</li><li>Tone of voice</li><li>Brand identity</li><li>B2B tech, software &amp; SaaS</li><li>B2B transformation</li></ul></div><span class=\"Image_image__RAAdZ Image_fill__EiIzS\"><img data-srcset=\"/__assets/kota-content.b-cdn.net/app/uploads/2026/08/seas-featured-1400x788.jpg 1400w, /__assets/kota-content.b-cdn.net/app/uploads/2026/08/seas-featured-500x281.jpg 500w, /__assets/kota-content.b-cdn.net/app/uploads/2026/08/seas-featured-768x432.jpg 768w, /__assets/kota-content.b-cdn.net/app/uploads/2026/08/seas-featured-1536x864.jpg 1536w, /__assets/kota-content.b-cdn.net/app/uploads/2026/08/seas-featured.jpg 1920w\" data-src=\"/__assets/kota-content.b-cdn.net/app/uploads/2026/08/seas-featured.jpg\" alt=\"\" fetchpriority=\"low\" height=\"1080\" width=\"1920\" sizes=\"auto\" class=\"lazyload\"></span><video src=\"/__assets/kota-content.b-cdn.net/app/uploads/2026/08/Feature-Image.mp4\" class=\"ProjectCard_video__AheFz\" loop=\"\" preload=\"none\" playsinline=\"\"></video></div></a><a class=\"ProjectCard_project__d1wbY ProjectCard_small__xsL92\" data-animation=\"grid-item\" href=\"/work/leadcourt\"><div class=\"ProjectCard_projectText__o770X\"><h3><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14.78 14.78\"><defs><linearGradient id=\"d\" x1=\"3.54\" x2=\"13.98\" y1=\"3.54\" y2=\"13.99\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#7c41f3\"></stop><stop offset=\"1\" stop-color=\"#ff6eff\"></stop></linearGradient></defs><path fill=\"url(#d)\" stroke-width=\"0\" d=\"M13.25 12.18L13.25 0.23 14.78 0.23 14.78 14.76 14.74 14.76 14.74 14.78 0.21 14.78 0.21 13.25 12.18 13.25 0 1.08 1.08 0 13.25 12.18z\"></path></svg>Leadcourt</h3><p>2026</p></div><div class=\"ProjectCard_projectImage__Nfx9I\"><div class=\"ProjectCard_imageOverlay__OCawr\"><p class=\"ProjectCard_heading__1csIW\">From Early Traction to 10,000 Users in Six Months</p><ul class=\"ProjectCard_tags__XdVcf\"><li>Branding</li><li>Website &amp; App Development</li><li>Brand strategy</li><li>Tone of voice</li><li>Brand identity</li><li>Finance</li></ul></div><span class=\"Image_image__RAAdZ Image_fill__EiIzS\"><img data-srcset=\"/__assets/kota-content.b-cdn.net/app/uploads/2026/08/opt1-static-1400x788.jpg 1400w, /__assets/kota-content.b-cdn.net/app/uploads/2026/08/opt1-static-2000x1125.jpg 2000w, /__assets/kota-content.b-cdn.net/app/uploads/2026/08/opt1-static-500x281.jpg 500w, /__assets/kota-content.b-cdn.net/app/uploads/2026/08/opt1-static-768x432.jpg 768w, /__assets/kota-content.b-cdn.net/app/uploads/2026/08/opt1-static-1536x864.jpg 1536w, /__assets/kota-content.b-cdn.net/app/uploads/2026/08/opt1-static-2048x1152.jpg 2048w\" data-src=\"/__assets/kota-content.b-cdn.net/app/uploads/2026/08/opt1-static-2560x1440.jpg\" alt=\"\" fetchpriority=\"low\" height=\"1688\" width=\"3000\" sizes=\"auto\" class=\"lazyload\"></span><video src=\"/__assets/kota-content.b-cdn.net/app/uploads/2026/08/BR-featured.mp4\" class=\"ProjectCard_video__AheFz\" loop=\"\" preload=\"none\" playsinline=\"\"></video></div></a><a class=\"ProjectCard_project__d1wbY ProjectCard_small__xsL92\" data-animation=\"grid-item\" href=\"/work/interactfinancial.ca\"><div class=\"ProjectCard_projectText__o770X\"><h3><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14.78 14.78\"><defs><linearGradient id=\"d\" x1=\"3.54\" x2=\"13.98\" y1=\"3.54\" y2=\"13.99\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#7c41f3\"></stop><stop offset=\"1\" stop-color=\"#ff6eff\"></stop></linearGradient></defs><path fill=\"url(#d)\" stroke-width=\"0\" d=\"M13.25 12.18L13.25 0.23 14.78 0.23 14.78 14.76 14.74 14.76 14.74 14.78 0.21 14.78 0.21 13.25 12.18 13.25 0 1.08 1.08 0 13.25 12.18z\"></path></svg>Interact Financial</h3><p>2025</p></div><div class=\"ProjectCard_projectImage__Nfx9I\"><div class=\"ProjectCard_imageOverlay__OCawr\"><p class=\"ProjectCard_heading__1csIW\">43,000 Website Visits in 3 Months</p><ul class=\"ProjectCard_tags__XdVcf\"><li>Website &amp; App Development</li><li>B2B tech, software &amp; SaaS</li></ul></div><span class=\"Image_image__RAAdZ Image_fill__EiIzS\"><img data-srcset=\"/__assets/kota-content.b-cdn.net/app/uploads/2025/09/bipsync-featured-1400x788.jpg 1400w, /__assets/kota-content.b-cdn.net/app/uploads/2025/09/bipsync-featured-500x281.jpg 500w, /__assets/kota-content.b-cdn.net/app/uploads/2025/09/bipsync-featured-768x432.jpg 768w, /__assets/kota-content.b-cdn.net/app/uploads/2025/09/bipsync-featured.jpg 1440w\" data-src=\"/__assets/kota-content.b-cdn.net/app/uploads/2025/09/bipsync-featured.jpg\" alt=\"\" fetchpriority=\"low\" height=\"810\" width=\"1440\" sizes=\"auto\" class=\"lazyload\"></span><video src=\"/__assets/kota-content.b-cdn.net/app/uploads/2025/09/Company-Loop4-compressed-2.mp4\" class=\"ProjectCard_video__AheFz\" loop=\"\" preload=\"none\" playsinline=\"\"></video></div></a><a class=\"ProjectCard_project__d1wbY ProjectCard_small__xsL92\" data-animation=\"grid-item\" href=\"/work/green-square-infra\"><div class=\"ProjectCard_projectText__o770X\"><h3><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14.78 14.78\"><defs><linearGradient id=\"d\" x1=\"3.54\" x2=\"13.98\" y1=\"3.54\" y2=\"13.99\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#7c41f3\"></stop><stop offset=\"1\" stop-color=\"#ff6eff\"></stop></linearGradient></defs><path fill=\"url(#d)\" stroke-width=\"0\" d=\"M13.25 12.18L13.25 0.23 14.78 0.23 14.78 14.76 14.74 14.76 14.74 14.78 0.21 14.78 0.21 13.25 12.18 13.25 0 1.08 1.08 0 13.25 12.18z\"></path></svg>Green Square Infra</h3><p>2025</p></div><div class=\"ProjectCard_projectImage__Nfx9I\"><div class=\"ProjectCard_imageOverlay__OCawr\"><p class=\"ProjectCard_heading__1csIW\">A cinematic web experience and high-performance digital presence</p><ul class=\"ProjectCard_tags__XdVcf\"><li>Website &amp; App Development</li><li>Agencies</li></ul></div><span class=\"Image_image__RAAdZ Image_fill__EiIzS\"><img data-srcset=\"/__assets/kota-content.b-cdn.net/app/uploads/2025/04/upp-featured-mobile-1400x788.jpg 1400w, /__assets/kota-content.b-cdn.net/app/uploads/2025/04/upp-featured-mobile-500x281.jpg 500w, /__assets/kota-content.b-cdn.net/app/uploads/2025/04/upp-featured-mobile-768x432.jpg 768w, /__assets/kota-content.b-cdn.net/app/uploads/2025/04/upp-featured-mobile.jpg 1440w\" data-src=\"/__assets/kota-content.b-cdn.net/app/uploads/2025/04/upp-featured-mobile.jpg\" alt=\"\" fetchpriority=\"low\" height=\"810\" width=\"1440\" sizes=\"auto\" class=\"lazyload\"></span><video src=\"/__assets/kota-content.b-cdn.net/app/uploads/2025/04/Featured2-Compressed.mp4\" class=\"ProjectCard_video__AheFz\" loop=\"\" preload=\"none\" playsinline=\"\"></video></div></a><a class=\"ProjectCard_project__d1wbY ProjectCard_small__xsL92\" data-animation=\"grid-item\" href=\"/work/johnruggieri\"><div class=\"ProjectCard_projectText__o770X\"><h3><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14.78 14.78\"><defs><linearGradient id=\"d\" x1=\"3.54\" x2=\"13.98\" y1=\"3.54\" y2=\"13.99\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#7c41f3\"></stop><stop offset=\"1\" stop-color=\"#ff6eff\"></stop></linearGradient></defs><path fill=\"url(#d)\" stroke-width=\"0\" d=\"M13.25 12.18L13.25 0.23 14.78 0.23 14.78 14.76 14.74 14.76 14.74 14.78 0.21 14.78 0.21 13.25 12.18 13.25 0 1.08 1.08 0 13.25 12.18z\"></path></svg>John Ruggieri</h3><p>2026</p></div><div class=\"ProjectCard_projectImage__Nfx9I\"><div class=\"ProjectCard_imageOverlay__OCawr\"><p class=\"ProjectCard_heading__1csIW\">Turning Artistic Talent into a Stronger Digital Presence</p><ul class=\"ProjectCard_tags__XdVcf\"><li>Branding</li><li>Website &amp; App Development</li><li>Brand strategy</li><li>Tone of voice</li><li>Brand identity</li><li>Finance</li></ul></div><span class=\"Image_image__RAAdZ Image_fill__EiIzS\"><img data-srcset=\"/__assets/kota-content.b-cdn.net/app/uploads/2026/07/Copper-Feature-1400x788.png 1400w, /__assets/kota-content.b-cdn.net/app/uploads/2026/07/Copper-Feature-2000x1125.png 2000w, /__assets/kota-content.b-cdn.net/app/uploads/2026/07/Copper-Feature-500x281.png 500w, /__assets/kota-content.b-cdn.net/app/uploads/2026/07/Copper-Feature-768x432.png 768w, /__assets/kota-content.b-cdn.net/app/uploads/2026/07/Copper-Feature-1536x864.png 1536w, /__assets/kota-content.b-cdn.net/app/uploads/2026/07/Copper-Feature-2048x1152.png 2048w\" data-src=\"/__assets/kota-content.b-cdn.net/app/uploads/2026/07/Copper-Feature-2560x1440.png\" alt=\"\" fetchpriority=\"low\" height=\"1620\" width=\"2880\" sizes=\"auto\" class=\"lazyload\"></span><video src=\"/__assets/kota-content.b-cdn.net/app/uploads/2026/07/Copper-Feature-V3.mp4\" class=\"ProjectCard_video__AheFz\" loop=\"\" preload=\"none\" playsinline=\"\"></video></div></a><a class=\"ProjectCard_project__d1wbY ProjectCard_small__xsL92\" data-animation=\"grid-item\" href=\"/work/seven-gate-holdings\"><div class=\"ProjectCard_projectText__o770X\"><h3><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14.78 14.78\"><defs><linearGradient id=\"d\" x1=\"3.54\" x2=\"13.98\" y1=\"3.54\" y2=\"13.99\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#7c41f3\"></stop><stop offset=\"1\" stop-color=\"#ff6eff\"></stop></linearGradient></defs><path fill=\"url(#d)\" stroke-width=\"0\" d=\"M13.25 12.18L13.25 0.23 14.78 0.23 14.78 14.76 14.74 14.76 14.74 14.78 0.21 14.78 0.21 13.25 12.18 13.25 0 1.08 1.08 0 13.25 12.18z\"></path></svg>Seven Gate Holdings</h3><p>2026</p></div><div class=\"ProjectCard_projectImage__Nfx9I\"><div class=\"ProjectCard_imageOverlay__OCawr\"><p class=\"ProjectCard_heading__1csIW\">How Seven Gate Holdings found brand clarity through a new strategy with Kyoto Creative</p><ul class=\"ProjectCard_tags__XdVcf\"><li>Branding</li><li>Website &amp; App Development</li><li>Brand strategy</li><li>Tone of voice</li><li>Brand identity</li><li>B2B tech, software &amp; SaaS</li></ul></div><span class=\"Image_image__RAAdZ Image_fill__EiIzS\"><img data-srcset=\"/__assets/kota-content.b-cdn.net/app/uploads/2026/06/Featured-Image-1400x788.png 1400w, /__assets/kota-content.b-cdn.net/app/uploads/2026/06/Featured-Image-500x281.png 500w, /__assets/kota-content.b-cdn.net/app/uploads/2026/06/Featured-Image-768x432.png 768w, /__assets/kota-content.b-cdn.net/app/uploads/2026/06/Featured-Image-1536x864.png 1536w, /__assets/kota-content.b-cdn.net/app/uploads/2026/06/Featured-Image.png 1920w\" data-src=\"/__assets/kota-content.b-cdn.net/app/uploads/2026/06/Featured-Image.png\" alt=\"\" fetchpriority=\"low\" height=\"1080\" width=\"1920\" sizes=\"auto\" class=\"lazyload\"></span><video src=\"/__assets/kota-content.b-cdn.net/app/uploads/2026/06/Featured-Video.mp4\" class=\"ProjectCard_video__AheFz\" loop=\"\" preload=\"none\" playsinline=\"\"></video></div></a><a class=\"ProjectCard_project__d1wbY ProjectCard_small__xsL92\" data-animation=\"grid-item\" href=\"/work/finura\"><div class=\"ProjectCard_projectText__o770X\"><h3><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14.78 14.78\"><defs><linearGradient id=\"d\" x1=\"3.54\" x2=\"13.98\" y1=\"3.54\" y2=\"13.99\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#7c41f3\"></stop><stop offset=\"1\" stop-color=\"#ff6eff\"></stop></linearGradient></defs><path fill=\"url(#d)\" stroke-width=\"0\" d=\"M13.25 12.18L13.25 0.23 14.78 0.23 14.78 14.76 14.74 14.76 14.74 14.78 0.21 14.78 0.21 13.25 12.18 13.25 0 1.08 1.08 0 13.25 12.18z\"></path></svg>Finura</h3><p>2025</p></div><div class=\"ProjectCard_projectImage__Nfx9I\"><div class=\"ProjectCard_imageOverlay__OCawr\"><p class=\"ProjectCard_heading__1csIW\">A new vision for modern wealth management</p><ul class=\"ProjectCard_tags__XdVcf\"><li>Website &amp; App Development</li><li>Brand strategy</li><li>Tone of voice</li><li>Brand identity</li><li>Finance</li></ul></div><span class=\"Image_image__RAAdZ Image_fill__EiIzS\"><img data-srcset=\"/__assets/kota-content.b-cdn.net/app/uploads/2026/01/finura-logo-still.png 1174w, /__assets/kota-content.b-cdn.net/app/uploads/2026/01/finura-logo-still-500x282.png 500w, /__assets/kota-content.b-cdn.net/app/uploads/2026/01/finura-logo-still-768x432.png 768w\" data-src=\"/__assets/kota-content.b-cdn.net/app/uploads/2026/01/finura-logo-still.png\" alt=\"\" fetchpriority=\"low\" height=\"661\" width=\"1174\" sizes=\"auto\" class=\"lazyload\"></span><video src=\"/__assets/kota-content.b-cdn.net/app/uploads/2026/01/Finura_Logo_Animation.mp4\" class=\"ProjectCard_video__AheFz\" loop=\"\" preload=\"none\" playsinline=\"\"></video></div></a><a class=\"ProjectCard_project__d1wbY ProjectCard_small__xsL92\" data-animation=\"grid-item\" href=\"/work/navarino\"><div class=\"ProjectCard_projectText__o770X\"><h3><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14.78 14.78\"><defs><linearGradient id=\"d\" x1=\"3.54\" x2=\"13.98\" y1=\"3.54\" y2=\"13.99\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#7c41f3\"></stop><stop offset=\"1\" stop-color=\"#ff6eff\"></stop></linearGradient></defs><path fill=\"url(#d)\" stroke-width=\"0\" d=\"M13.25 12.18L13.25 0.23 14.78 0.23 14.78 14.76 14.74 14.76 14.74 14.78 0.21 14.78 0.21 13.25 12.18 13.25 0 1.08 1.08 0 13.25 12.18z\"></path></svg>Navarino</h3><p>2025</p></div><div class=\"ProjectCard_projectImage__Nfx9I\"><div class=\"ProjectCard_imageOverlay__OCawr\"><p class=\"ProjectCard_heading__1csIW\">Charting a new digital frontier for the future of maritime tech.</p><ul class=\"ProjectCard_tags__XdVcf\"><li>Website &amp; App Development</li><li>B2B tech, software &amp; SaaS</li></ul></div><span class=\"Image_image__RAAdZ Image_fill__EiIzS\"><img data-srcset=\"/__assets/kota-content.b-cdn.net/app/uploads/2025/09/featured-1400x788.jpg 1400w, /__assets/kota-content.b-cdn.net/app/uploads/2025/09/featured-500x281.jpg 500w, /__assets/kota-content.b-cdn.net/app/uploads/2025/09/featured-768x432.jpg 768w, /__assets/kota-content.b-cdn.net/app/uploads/2025/09/featured-1536x864.jpg 1536w, /__assets/kota-content.b-cdn.net/app/uploads/2025/09/featured.jpg 1920w\" data-src=\"/__assets/kota-content.b-cdn.net/app/uploads/2025/09/featured.jpg\" alt=\"\" fetchpriority=\"low\" height=\"1080\" width=\"1920\" sizes=\"auto\" class=\"lazyload\"></span><video src=\"/__assets/kota-content.b-cdn.net/app/uploads/2025/09/Featured-compressed.mp4\" class=\"ProjectCard_video__AheFz\" loop=\"\" preload=\"none\" playsinline=\"\"></video></div></a><a class=\"ProjectCard_project__d1wbY ProjectCard_small__xsL92\" data-animation=\"grid-item\" href=\"/work/mgn-events\"><div class=\"ProjectCard_projectText__o770X\"><h3><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14.78 14.78\"><defs><linearGradient id=\"d\" x1=\"3.54\" x2=\"13.98\" y1=\"3.54\" y2=\"13.99\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#7c41f3\"></stop><stop offset=\"1\" stop-color=\"#ff6eff\"></stop></linearGradient></defs><path fill=\"url(#d)\" stroke-width=\"0\" d=\"M13.25 12.18L13.25 0.23 14.78 0.23 14.78 14.76 14.74 14.76 14.74 14.78 0.21 14.78 0.21 13.25 12.18 13.25 0 1.08 1.08 0 13.25 12.18z\"></path></svg>MGN Events</h3><p>2025</p></div><div class=\"ProjectCard_projectImage__Nfx9I\"><div class=\"ProjectCard_imageOverlay__OCawr\"><p class=\"ProjectCard_heading__1csIW\">A brand built for the next chapter at MGN Events</p><ul class=\"ProjectCard_tags__XdVcf\"><li>Website &amp; App Development</li><li>Brand strategy</li><li>Tone of voice</li><li>Brand identity</li><li>Media &amp; Entertainment</li></ul></div><span class=\"Image_image__RAAdZ Image_fill__EiIzS\"><img data-srcset=\"/__assets/kota-content.b-cdn.net/app/uploads/2025/06/thumbnail-1400x788.jpg 1400w, /__assets/kota-content.b-cdn.net/app/uploads/2025/06/thumbnail-500x281.jpg 500w, /__assets/kota-content.b-cdn.net/app/uploads/2025/06/thumbnail-768x432.jpg 768w, /__assets/kota-content.b-cdn.net/app/uploads/2025/06/thumbnail-1536x864.jpg 1536w, /__assets/kota-content.b-cdn.net/app/uploads/2025/06/thumbnail.jpg 1920w\" data-src=\"/__assets/kota-content.b-cdn.net/app/uploads/2025/06/thumbnail.jpg\" alt=\"\" fetchpriority=\"low\" height=\"1080\" width=\"1920\" sizes=\"auto\" class=\"lazyload\"></span></div></a><a class=\"ProjectCard_project__d1wbY ProjectCard_small__xsL92\" data-animation=\"grid-item\" href=\"/work/the-goat-agency\"><div class=\"ProjectCard_projectText__o770X\"><h3><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14.78 14.78\"><defs><linearGradient id=\"d\" x1=\"3.54\" x2=\"13.98\" y1=\"3.54\" y2=\"13.99\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#7c41f3\"></stop><stop offset=\"1\" stop-color=\"#ff6eff\"></stop></linearGradient></defs><path fill=\"url(#d)\" stroke-width=\"0\" d=\"M13.25 12.18L13.25 0.23 14.78 0.23 14.78 14.76 14.74 14.76 14.74 14.78 0.21 14.78 0.21 13.25 12.18 13.25 0 1.08 1.08 0 13.25 12.18z\"></path></svg>The Goat Agency</h3><p>2025</p></div><div class=\"ProjectCard_projectImage__Nfx9I\"><div class=\"ProjectCard_imageOverlay__OCawr\"><p class=\"ProjectCard_heading__1csIW\">Influence everywhere: a future-ready website for The Goat Agency.</p><ul class=\"ProjectCard_tags__XdVcf\"><li>Website &amp; App Development</li><li>Agencies</li></ul></div><span class=\"Image_image__RAAdZ Image_fill__EiIzS\"><img data-srcset=\"/__assets/kota-content.b-cdn.net/app/uploads/2025/08/GOAT-FeaturedImage-1400x788.png 1400w, /__assets/kota-content.b-cdn.net/app/uploads/2025/08/GOAT-FeaturedImage-500x281.png 500w, /__assets/kota-content.b-cdn.net/app/uploads/2025/08/GOAT-FeaturedImage-768x432.png 768w, /__assets/kota-content.b-cdn.net/app/uploads/2025/08/GOAT-FeaturedImage-1536x864.png 1536w, /__assets/kota-content.b-cdn.net/app/uploads/2025/08/GOAT-FeaturedImage.png 1920w\" data-src=\"/__assets/kota-content.b-cdn.net/app/uploads/2025/08/GOAT-FeaturedImage.png\" alt=\"\" fetchpriority=\"low\" height=\"1080\" width=\"1920\" sizes=\"auto\" class=\"lazyload\"></span><video src=\"/__assets/kota-content.b-cdn.net/app/uploads/2025/08/GOAT-FeatureVideo.mp4\" class=\"ProjectCard_video__AheFz\" loop=\"\" preload=\"none\" playsinline=\"\"></video></div></a></div></div></div>";
function replaceWorkArchiveHtml(html) {
  const target = '<!--$!--><template data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING"></template><!--/$-->';
  if (html.includes(target)) {
    return html.replace(target, workArchiveStaticHtml);
  }
  return html;
}


function replaceHomepageServicesHtml(html) {
  const panel1Tags = '<div class="ServicesPanel_tags__6NQOl">' +
    '<a class="ServicesPanel_tag__JYwRk" href="service/brand-strategy-positioning">Brand Strategy & Positioning</a>' +
    '<a class="ServicesPanel_tag__JYwRk" href="service/content-campaigns-pr">Content Campaigns & PR</a>' +
    '<a class="ServicesPanel_tag__JYwRk" href="service/paid-media-performance">Paid Media & Performance</a>' +
    '<a class="ServicesPanel_tag__JYwRk" href="service/brand-identity-creative">Brand Identity & Creative</a>' +
    '</div>';

  const panel2Tags = '<div class="ServicesPanel_tags__6NQOl">' +
    '<a class="ServicesPanel_tag__JYwRk" href="service/website-design-development">Website Design & Development</a>' +
    '<a class="ServicesPanel_tag__JYwRk" href="service/product-design-ux">Product Design & UX</a>' +
    '<a class="ServicesPanel_tag__JYwRk" href="service/app-design-development">App Design & Development</a>' +
    '</div>';

  const panel3Tags = '<div class="ServicesPanel_tags__6NQOl">' +
    '<a class="ServicesPanel_tag__JYwRk" href="service/autonomous-ai-agents-copilots">Autonomous AI Agents &amp; Copilots</a>' +
    '<a class="ServicesPanel_tag__JYwRk" href="service/workflow-orchestration-api-integration">Workflow Orchestration &amp; API Integration</a>' +
    '<a class="ServicesPanel_tag__JYwRk" href="service/intelligent-document-data-processing">Intelligent Document &amp; Data Processing</a>' +
    '</div>';

  let count = 0;
  return html.replace(new RegExp('<div class="ServicesPanel_tags__6NQOl">[\\s\\S]*?</div>', 'g'), match => {
    count++;
    if (count === 1) return panel1Tags;
    if (count === 2) return panel2Tags;
    if (count === 3) return panel3Tags;
    return match;
  });
}

function replaceHomepageFaqHtml(html) {
  const section = /<section class="FaqsList_faqsList__[^"]*"[\s\S]*?<\/section>/;
  if (!section.test(html)) throw new Error('Homepage FAQ section was not found in HTML');
  return html.replace(section, homepageFaqMarkup());
}

function removeTestimonialsHtml(html) {
  const marker = 'class="Testimonials_testimonials__l4UZd"';
  const markerIndex = html.indexOf(marker);
  if (markerIndex < 0) throw new Error('Testimonial section was not found in HTML');
  const start = html.lastIndexOf('<section', markerIndex);
  if (start < 0) throw new Error('Testimonial section opening tag was not found in HTML');
  const tags = /<\/?section\b[^>]*>/gi;
  tags.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = tags.exec(html))) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) {
      return html.slice(0, start) + html.slice(tags.lastIndex);
    }
  }
  throw new Error('Testimonial section closing tag was not found in HTML');
}

/** Flight text rows carry UTF-8 byte lengths, not newline-delimited JSON. */
const lazyImageDimensions = new Map([
  ['/seven-gate-before-after.png', [655, 368]],
  ['/app/uploads/2023/11/preto-logo.svg', [300, 101]],
  ['/app/uploads/2023/11/aardvark-logo.svg', [300, 35]],
  ['/app/uploads/2024/05/wogan-logo.svg', [290, 150]],
  ['/app/uploads/2025/04/ISI_Global_Logo.svg', [300, 37]],
  ['/app/uploads/2023/11/Floan-Logo-Black.svg', [300, 64]],
  ['/app/uploads/2024/06/SteppingStone-logo-peach.svg', [150, 150]],
  ['/app/uploads/2023/11/pixelartworks-logo.svg', [300, 36]],
  ['/app/uploads/2024/05/dka-logo.svg', [300, 91]],
  ['/app/uploads/2023/10/saatchi.svg', [300, 117]],
  ['/app/uploads/2024/05/bms-logo.svg', [300, 142]],
  ['/app/uploads/2023/11/lovebrands-logo.svg', [300, 32]],
  ['/app/uploads/2023/10/Jamie-oliver.svg', [281, 150]],
  ['/app/uploads/2023/11/cynozure-logo.svg', [300, 105]],
  ['/app/uploads/2023/11/trace-logo.svg', [300, 39]],
  ['/app/uploads/2024/01/PixelArtworks-Logo-Black.svg', [300, 82]],
  ['/app/uploads/2023/11/Bellsant-Logo-Black.svg', [300, 52]],
  ['/app/uploads/2025/05/Florence-Logo-White.svg', [230, 68]],
  ['/app/uploads/2025/08/UPP-logo.svg', [65, 65]],
  ['/images/john-ruggieri-logo.png', [986, 234]],
  ['/images/interact-financial-logo.png', [308, 52]],
  ['/images/sevengate-logo.png', [253, 226]],
  ['/images/green-square-logo.png', [456, 234]],
  ['/images/leadcourt-logo.png', [463, 65]],
  ['/images/green-square-infra-logo.png', [456, 234]],
  ['/images/seven-gate-holdings-logo.png', [253, 226]],
]);

function imageDimensionsForSource(source) {
  if (typeof source !== 'string' || !source) return null;
  try {
    const pathname = new URL(source, 'https://www.kyotocreative.com').pathname;
    for (const [imagePath, dimensions] of lazyImageDimensions) {
      if (pathname === imagePath || pathname.endsWith(imagePath)) return dimensions;
    }
    return null;
  } catch {
    return null;
  }
}

function addImageDimensionAttributes(tag, dimensions) {
  const setAttribute = (html, name, value) => {
    const attribute = new RegExp(`(^|\\s)(${name})\\s*=\\s*(["'])(.*?)\\3`, 'i');
    if (attribute.test(html)) {
      return html.replace(attribute, (match, prefix, attributeName, quote) =>
        `${prefix}${attributeName}=${quote}${value}${quote}`);
    }
    return html.replace(/\/?>$/, suffix => ` ${name}="${value}"${suffix}`);
  };
  const width = Number(/\bwidth\s*=\s*(["'])(.*?)\1/i.exec(tag)?.[2]);
  const height = Number(/\bheight\s*=\s*(["'])(.*?)\1/i.exec(tag)?.[2]);
  if (width > 0 && height > 0) return tag;
  return setAttribute(setAttribute(tag, 'width', dimensions[0]), 'height', dimensions[1]);
}

function reserveLazyImageDimensionsInMarkup(markup) {
  return markup.replace(/<img\b[^>]*>/gi, tag => {
    if (!/\bloading\s*=\s*(["'])lazy\1/i.test(tag) && !/\bclass\s*=\s*(["'])[^"']*\blazyload\b[^"']*\1/i.test(tag)) {
      return tag;
    }
    const sources = [...tag.matchAll(/\b(?:src|data-src)\s*=\s*(["'])(.*?)\1/gi)]
      .map(match => match[2])
      .filter(Boolean);
    const dimensions = sources.map(imageDimensionsForSource).find(Boolean);
    return dimensions ? addImageDimensionAttributes(tag, dimensions) : tag;
  });
}

function rewriteFlightRows(text, transformText, transformRow) {
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
        if (end <= source.length) {
          const value = source.subarray(comma + 1, end).toString();
          const transformed = transformText(value, id);
          rows.push(transformed === value
            ? source.subarray(cursor, end).toString()
            : id + ':T' + Buffer.byteLength(transformed).toString(16) + ',' + transformed);
          cursor = end;
          continue;
        }
      }
    }
    const newline = source.indexOf(10, cursor);
    const end = newline === -1 ? source.length : newline + 1;
    const row = source.subarray(cursor, end).toString();
    rows.push(transformRow(row, row.match(/^([a-f\d]+):/i)?.[1]?.toLowerCase()));
    cursor = end;
  }
  return rows.join('');
}

function visitFlightImageData(value, referenceDimensions, dimensionsByReference) {
  if (Array.isArray(value)) {
    if (value[0] === '$' && value[1] === 'img' && value[3] && typeof value[3] === 'object') {
      const dimensions = imageDimensionsForSource(value[3].src) || imageDimensionsForSource(value[3]['data-src']);
      if (dimensions && !(Number(value[3].width) > 0 && Number(value[3].height) > 0)) {
        value[3].width = dimensions[0];
        value[3].height = dimensions[1];
      }
    }
    for (let index = 0; index < value.length; index++) {
      value[index] = visitFlightImageData(value[index], referenceDimensions, dimensionsByReference);
    }
    return value;
  }
  if (typeof value === 'string') return reserveLazyImageDimensionsInMarkup(value);
  if (!value || typeof value !== 'object') return value;

  const dimensions = imageDimensionsForSource(value.sourceUrl) ||
    imageDimensionsForSource(value.src) ||
    imageDimensionsForSource(value['data-src']);
  if (dimensions && value.mediaDetails && typeof value.mediaDetails === 'object') {
    value.mediaDetails.width = dimensions[0];
    value.mediaDetails.height = dimensions[1];
  } else if (dimensions && typeof value.mediaDetails === 'string') {
    const reference = /^\$([a-f\d]+)$/i.exec(value.mediaDetails)?.[1]?.toLowerCase();
    if (reference) dimensionsByReference.set(reference, dimensions);
  }
  if (referenceDimensions) {
    value.width = referenceDimensions[0];
    value.height = referenceDimensions[1];
  }
  for (const [key, child] of Object.entries(value)) {
    value[key] = visitFlightImageData(child, null, dimensionsByReference);
  }
  return value;
}

function parseFlightModelRow(row) {
  const prefix = row.match(/^([a-f\d]+:)/i)?.[1];
  if (!prefix) return null;
  const suffix = row.endsWith('\r\n') ? '\r\n' : row.endsWith('\n') ? '\n' : '';
  const payload = row.slice(prefix.length, suffix ? -suffix.length : undefined);
  const firstCharacter = payload.trimStart()[0];
  if (firstCharacter !== '{' && firstCharacter !== '[') return null;
  return { prefix, suffix, model: JSON.parse(payload) };
}


function replaceHomepageServicesFlightRow(row) {
  if (!row.includes('"Services_services__YnZAs"')) return row;
  const parsed = parseFlightModelRow(row);
  if (!parsed) return row;

  const visit = value => {
    if (Array.isArray(value)) {
      for (const child of value) visit(child);
    } else if (value && typeof value === 'object') {
      if (Array.isArray(value.services) && value.services.length === 3) {
        value.services[0].heading = 'Marketing';
        value.services[0].link = { slug: "marketing", parent: null };
        value.services[0].tags = [
          { id: "cG9zdDo4ODg=", slug: "brand-strategy-positioning", title: "Brand Strategy & Positioning" },
          { id: "cG9zdDo4ODY=", slug: "content-campaigns-pr", title: "Content Campaigns & PR" },
          { id: "cG9zdDo4ODc=", slug: "paid-media-performance", title: "Paid Media & Performance" },
          { id: "cG9zdDo4ODk=", slug: "brand-identity-creative", title: "Brand Identity & Creative" }
        ];

        value.services[1].heading = 'Web & App';
        value.services[1].link = { slug: "web-app", parent: null };
        value.services[1].tags = [
          { id: "cG9zdDoxMzM1", slug: "website-design-development", title: "Website Design & Development" },
          { id: "cG9zdDo4NzA=", slug: "product-design-ux", title: "Product Design & UX" },
          { id: "cG9zdDo4NzE=", slug: "app-design-development", title: "App Design & Development" }
        ];

        value.services[2].heading = 'AI Automations';
        value.services[2].tags = [
          { id: "cG9zdDo4OTQ=", slug: "autonomous-ai-agents-copilots", title: "Autonomous AI Agents & Copilots" },
          { id: "cG9zdDo4OTA=", slug: "workflow-orchestration-api-integration", title: "Workflow Orchestration & API Integration" },
          { id: "cG9zdDo4OTM=", slug: "intelligent-document-data-processing", title: "Intelligent Document & Data Processing" }
        ];
      }
      for (const child of Object.values(value)) visit(child);
    }
  };

  visit(parsed.model);
  return parsed.prefix + JSON.stringify(parsed.model) + parsed.suffix;
}

function replaceHomepageStatisticsFlightRow(row) {
  const statistic = '"mainStatistic":"104.9% "';
  const description = '"description":"increase in organic visits after 1 month"';
  if (!row.includes(statistic) || !row.includes(description)) return row;

  const parsed = parseFlightModelRow(row);
  if (!parsed) throw new Error('Homepage statistics Flight row has an unexpected format');

  let replacements = 0;
  const visit = value => {
    if (Array.isArray(value)) {
      for (const child of value) visit(child);
    } else if (value && typeof value === 'object') {
      if (value.mainStatistic === '104.9% ' &&
          value.description === 'increase in organic visits after 1 month') {
        value.mainStatistic = '10,000 ';
        value.description = 'users in six months';
        replacements++;
      }
      for (const child of Object.values(value)) visit(child);
    }
  };
  visit(parsed.model);
  if (replacements !== 1) {
    throw new Error(`Expected one homepage statistics Flight record, found ${replacements}`);
  }
  return parsed.prefix + JSON.stringify(parsed.model) + parsed.suffix;
}

function containsKnownImageSource(text) {
  for (const sourcePath of lazyImageDimensions.keys()) {
    if (text.includes(sourcePath)) return true;
  }
  return false;
}

function reserveLazyImageDimensionsInFlight(text) {
  const dimensionsByReference = new Map();
  rewriteFlightRows(text, value => value, row => {
    const parsed = parseFlightModelRow(row);
    if (parsed && containsKnownImageSource(row)) {
      visitFlightImageData(parsed.model, null, dimensionsByReference);
    }
    return row;
  });
  return rewriteFlightRows(
    text,
    value => reserveLazyImageDimensionsInMarkup(value),
    (row, id) => {
      const parsed = parseFlightModelRow(row);
      if (!parsed || (!containsKnownImageSource(row) && (!id || !dimensionsByReference.has(id)))) {
        return reserveLazyImageDimensionsInMarkup(row);
      }
      visitFlightImageData(
        parsed.model,
        id ? dimensionsByReference.get(id) : null,
        dimensionsByReference,
      );
      return parsed.prefix + JSON.stringify(parsed.model) + parsed.suffix;
    },
  );
}

export function localizeFlight(text, route) {
  route = getCanonicalServiceRoute(route);
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
        if (route === '/work/leadcourt') value = removeLeadCourtServiceLabelDashes(value);
        if (route === '/work/interactfinancial.ca') value = removeInteractFinancialServiceLabelDots(value);
        if (route === '/work/green-square-infra') value = removeGreenSquareServiceLabelDashes(value);
        if (route === '/work/johnruggieri') value = removeJohnRuggieriServiceLabelDots(value);
        if (route === '/work/seven-gate-holdings') value = removeSevenGateServiceLabelDots(value);
        if (route === '/service/brand-strategy-positioning') value = replaceBrandStrategyCopy(value);
        if (route === '/service/content-campaigns-pr') value = replaceBrandIdentityDesignCopy(value);
        if (route === '/service/paid-media-performance') value = replaceToneOfVoiceCopy(value);
        if (route === '/service/brand-identity-creative') value = replaceBrandIdentityCreativeCopy(value);
        if (route === '/service/website-design-development') value = replaceCreativeWebDesignCopy(value);
        if (route === '/service/product-design-ux') value = replaceWebDevelopmentCopy(value);
        if (route === '/service/app-design-development') value = replaceWordPressCmsCopy(value);
        if (route === '/service/autonomous-ai-agents-copilots') value = replaceSeoGeoCopy(value);
        if (route === '/service/workflow-orchestration-api-integration') value = replaceCopywritingCopy(value);
        if (route === '/service/intelligent-document-data-processing') value = replaceSitecareCopy(value);
        value = replaceServicePageName(value, route);
        let tLine = id + ':T' + Buffer.byteLength(value).toString(16) + ',' + value;
        tLine = replaceFlightMetadataRow(tLine, route);
        rows.push(tLine);
        cursor = end;
        continue;
      }
    }
    const newline = source.indexOf(10, cursor);
    const end = newline === -1 ? source.length : newline + 1;
    let row = source.subarray(cursor, end).toString();
    if (route === '/service/brand-strategy-positioning') row = replaceBrandStrategyCopy(row);
    if (route === '/service/content-campaigns-pr') row = replaceBrandIdentityDesignCopy(row);
    if (route === '/service/paid-media-performance') row = replaceToneOfVoiceCopy(row);
    if (route === '/service/brand-identity-creative') row = replaceBrandIdentityCreativeCopy(row);
    if (route === '/service/website-design-development') row = replaceCreativeWebDesignCopy(row);
    if (route === '/service/product-design-ux') row = replaceWebDevelopmentCopy(row);
    if (route === '/service/app-design-development') row = replaceWordPressCmsCopy(row);
    if (route === '/service/autonomous-ai-agents-copilots') row = replaceSeoGeoCopy(row);
    if (route === '/service/workflow-orchestration-api-integration') row = replaceCopywritingCopy(row);
    if (route === '/service/intelligent-document-data-processing') row = replaceSitecareCopy(row);
    if (route === '/') {
      row = replaceHomepageFaqFlightRow(row);
      row = replaceHomepageStatisticsFlightRow(row);
      row = replaceHomepageServicesFlightRow(row);
    }
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
    if ((route === '/b2b-tech-software-saas' || route === '/healthcare' || route === '/retail') && row.includes('Testimonials_testimonials__l4UZd')) {
      const prefix = row.match(/^(\d+:)/)?.[1];
      if (!prefix) throw new Error('Testimonial Flight row has an unexpected format');
      const document = JSON.parse(row.slice(prefix.length));
      if (removeFlightElements(document, 'Testimonials_testimonials__l4UZd') !== 1) {
        throw new Error('Testimonial section was not found in Flight data');
      }
      row = prefix + JSON.stringify(document) + (row.endsWith('\n') ? '\n' : '');
    }
    row = replaceWebDesignFaqFlightRow(row);
    row = replaceBrandFaqFlightRow(row);
    row = localize(row);
    if (route === '/work/leadcourt') row = removeLeadCourtServiceLabelDashes(row);
    if (route === '/work/interactfinancial.ca') row = removeInteractFinancialServiceLabelDots(row);
    if (route === '/work/green-square-infra') row = removeGreenSquareServiceLabelDashes(row);
    if (route === '/work/johnruggieri') row = removeJohnRuggieriServiceLabelDots(row);
    if (route === '/work/seven-gate-holdings') row = removeSevenGateServiceLabelDots(row);
    if (route === '/service/brand-strategy-positioning') row = replaceBrandStrategyCopy(row);
    if (route === '/service/content-campaigns-pr') row = replaceBrandIdentityDesignCopy(row);
    if (route === '/service/paid-media-performance') row = replaceToneOfVoiceCopy(row);
    if (route === '/service/brand-identity-creative') row = replaceBrandIdentityCreativeCopy(row);
    if (route === '/service/website-design-development') row = replaceCreativeWebDesignCopy(row);
    if (route === '/service/product-design-ux') row = replaceWebDevelopmentCopy(row);
    if (route === '/service/app-design-development') row = replaceWordPressCmsCopy(row);
    if (route === '/service/autonomous-ai-agents-copilots') row = replaceSeoGeoCopy(row);
    if (route === '/service/workflow-orchestration-api-integration') row = replaceCopywritingCopy(row);
    if (route === '/service/intelligent-document-data-processing') row = replaceSitecareCopy(row);
    row = replaceServicePageName(row, route);
    row = replaceFlightMetadataRow(row, route);
    rows.push(row);
    cursor = end;
  }
  return rows.join('');
}

function replaceToneOfVoiceCopy(text) {
  return text.replace(
    'Make every word feel like yours.',
    'Turn marketing spend into measurable growth.',
  ).replace(
    'Distinctive brands take more than an AI prompt. We create tone of voice systems that give brands more character, more confidence and fewer reasons to sound like everyone else.',
    'We help businesses reach the right audiences, generate qualified leads and drive conversions through strategic paid advertising. By combining compelling creatives, precise targeting and continuous optimisation, we make every campaign work harder towards your business goals.',
  ).replace(
    'Find your verbal edge.',
    "Stop spending on clicks that don't convert.",
  ).replace(
    'Where AI has filled every channel with polished, forgettable copy, we build voices that people can recognise, teams can use and competitors can’t easily imitate. From the big brand statement to the tiny button label, every word pulling in the same direction.',
    "High advertising costs, inconsistent leads and campaigns that fail to deliver measurable returns can hold your business back. At Kyoto Creative, we identify what's holding your campaigns back, optimise your advertising strategy and build performance-driven campaigns that turn your budget into meaningful business results.",
  ).replace(
    'Tone of voice strategy.',
    'Google Ads Management',
  ).replace(
    'Before we choose the words, we decide what the voice needs to do. We connect your tone to your positioning, USPs, audience and ambitions, then define the character behind it. Sharp or understated. Warm or straight-talking. Playful where it counts. Serious when it matters.',
    'We plan, launch and optimise Google Search, Display and Shopping campaigns to connect your business with high-intent customers and generate qualified leads.',
  ).replace(
    'Brand language development.',
    'Meta Ads Management',
  ).replace(
    'This is where your voice starts to sound like a real person rather than a brand workshop. We develop the vocabulary, phrasing, sentence styles and verbal quirks that make your writing recognisable. We also identify the tired category language you can happily leave to everyone else.',
    'We manage Facebook and Instagram advertising campaigns through audience targeting, creative testing and continuous optimisation to drive engagement, leads and conversions.',
  ).replace(
    'Messaging principles.',
    'LinkedIn Advertising',
  ).replace(
    'Strong writing needs something solid underneath it. We create clear principles for how you explain what you do, what you believe and why anyone should care. Enough structure to keep the message consistent, without forcing everyone to repeat the same approved paragraph forever.',
    'We develop targeted LinkedIn campaigns that put your business in front of decision-makers, generate B2B leads and create meaningful business opportunities.',
  ).replace(
    'Audience and brand voice workshops.',
    'YouTube & Video Advertising',
  ).replace(
    'Everyone has an opinion on copy. Workshops stop those opinions becoming the strategy. We get the right people talking about your audience, your culture and the kind of brand you want to become. Then we turn that conversation into decisions your team can actually use.',
    'We create and manage video advertising campaigns that capture attention, increase brand awareness and move viewers towards meaningful action.',
  ).replace(
    'Real-world applications.',
    'Paid Media Strategy & Planning',
  ).replace(
    'A few adjectives on a slide won’t change how your brand sounds. We show the voice working across real touchpoints, including website copy, campaigns, social posts, decks, emails and calls to action. Your team sees exactly how the principles translate into everyday writing.',
    'We develop data-backed advertising strategies, identify the right platforms and allocate budgets effectively to maximise campaign performance and return on investment.',
  ).replace(
    'Do’s and don’ts documentation.',
    'Conversion Rate Optimisation',
  ).replace(
    'Know what sounds right. Spot what doesn’t. We create straightforward guidance with side-by-side examples, preferred language and phrases to avoid. No cryptic brand theory. No ‘bold yet approachable’. Just practical direction that helps people write better.',
    'We analyse landing pages, website experiences and customer journeys to identify conversion barriers and turn more visitors into leads and customers.',
  ).replace(
    'Audit your brand in minutes',
    'Performance Tracking & Analytics',
  ).replace(
    'Introducing the Brand Pulse Audit tool. See where your brand’s thriving—and where it needs a little CPR.',
    'We implement conversion tracking, monitor campaign metrics and translate performance data into actionable insights that help improve advertising results.',
  );
}

function replaceBrandIdentityCreativeCopy(text) {
  return replaceToneOfVoiceCopy(text).replace(
    'Turn marketing spend into measurable growth.',
    'Creative fuel for brands that refuse to look ordinary.',
  ).replace(
    'We help businesses reach the right audiences, generate qualified leads and drive conversions through strategic paid advertising. By combining compelling creatives, precise targeting and continuous optimisation, we make every campaign work harder towards your business goals.',
    "Your brand deserves more than just a good-looking logo. We build distinctive visual identities and creative experiences that bring your brand's personality to life, create recognition and leave a lasting impression across every customer touchpoint.",
  ).replace(
    "Stop spending on clicks that don't convert.",
    'Turn inconsistent visuals into a recognisable brand identity.',
  ).replace(
    "High advertising costs, inconsistent leads and campaigns that fail to deliver measurable returns can hold your business back. At Kyoto Creative, we identify what's holding your campaigns back, optimise your advertising strategy and build performance-driven campaigns that turn your budget into meaningful business results.",
    "Does your brand look different across platforms? Are your visuals failing to communicate the quality of your business? At Kyoto Creative, we bring your brand together through cohesive design systems, distinctive creative assets and thoughtful visual storytelling that make your business instantly recognisable.",
  ).replace(
    'Google Ads Management',
    'Logo Design & Visual Identity',
  ).replace(
    'We plan, launch and optimise Google Search, Display and Shopping campaigns to connect your business with high-intent customers and generate qualified leads.',
    "We create distinctive logos and visual identity systems that capture your brand's personality. From typography and colours to visual elements, we make your brand instantly recognisable.",
  ).replace(
    'Meta Ads Management',
    'Brand Guidelines & Design Systems',
  ).replace(
    'We manage Facebook and Instagram advertising campaigns through audience targeting, creative testing and continuous optimisation to drive engagement, leads and conversions.',
    'We establish comprehensive brand guidelines covering typography, colours, visual elements and usage standards. This ensures consistency across every platform, campaign and customer interaction.',
  ).replace(
    'LinkedIn Advertising',
    'Creative Direction & Art Direction',
  ).replace(
    'We develop targeted LinkedIn campaigns that put your business in front of decision-makers, generate B2B leads and create meaningful business opportunities.',
    "We define the creative vision behind your brand's visual communication. Our art direction ensures every design, campaign and visual asset works together to tell a cohesive brand story.",
  ).replace(
    'YouTube & Video Advertising',
    'Graphic Design & Marketing Collateral',
  ).replace(
    'We create and manage video advertising campaigns that capture attention, increase brand awareness and move viewers towards meaningful action.',
    'We design compelling presentations, advertisements, brochures, business stationery and other marketing materials that communicate your value and strengthen your brand presence.',
  ).replace(
    'Paid Media Strategy & Planning',
    'Social Media Creatives',
  ).replace(
    'We develop data-backed advertising strategies, identify the right platforms and allocate budgets effectively to maximise campaign performance and return on investment.',
    'We create engaging, on-brand social media graphics and campaign visuals that capture attention, maintain consistency and make your business stand out across social platforms.',
  ).replace(
    'Conversion Rate Optimisation',
    'Video & Motion Graphics',
  ).replace(
    'We analyse landing pages, website experiences and customer journeys to identify conversion barriers and turn more visitors into leads and customers.',
    'We bring your ideas to life through engaging videos, animations and motion graphics. Our creative approach helps communicate complex messages, capture attention and make your brand more memorable.',
  ).replace(
    'We plan and run paid advertising that stays rooted in your brand strategy. Creative, messaging, and targeting work together — so your spend actually drives results instead of noise.',
    "We design thoughtful packaging and product visuals that reflect your brand's quality and personality. From shelf appeal to the unboxing experience, we help create stronger connections with customers.",
  ).replace(
    'Performance Tracking & Analytics',
    'Packaging & Product Design',
  );
}

function replaceCreativeWebDesignCopy(text) {
  return text.replace(
    'Designed for <em>attention.</em>',
    'Digital experiences built to move businesses forward.',
  ).replace(
    'Some websites give you the information and get out of the way. Others yank you in by the collar. We design the latter.',
    'Your website is more than just an online presence. It\'s where your brand makes its first impression, communicates its value and turns visitors into customers. At Kyoto Creative, we design and develop high-performing websites that combine thoughtful design, seamless functionality and scalable technology to support your business goals.',
  ).replace(
    'Creative that carries the business.',
    'Turn underperforming websites into your strongest business asset.',
  ).replace(
    'Your website should create atmosphere, build momentum and give people a reason to keep going. We bring brand thinking, UX and visual design together to create digital experiences with a clear point of view, a commercial purpose, and enough confidence to stand out.',
    'An outdated design, slow loading speeds or a confusing user experience can cost you potential customers. At Kyoto Creative, we help businesses overcome these challenges with modern website experiences, intuitive navigation and reliable development that improve usability, build trust and drive conversions.',
  ).replace(
    'Brand-to-build web design.',
    'Website Strategy & Architecture',
  ).replace(
    'We take the thinking behind your brand and turn it into a digital experience with purpose, personality and momentum. Every page connected to the strategy, not decorated after the fact.',
    'We plan your website around your business objectives, audience needs and customer journeys. From information architecture to page structure, we create a clear foundation that makes your website easy to navigate and built for growth.',
  ).replace(
    ' Conversion-led UX.',
    'UI/UX Design & Prototyping',
  ).replace(
    'We shape the interface people actually use, from page layouts and component systems to buttons, navigation, forms and micro-interactions. Every detail has a job: make the experience clearer, sharper and more recognisably yours.',
    'We design intuitive, visually engaging website experiences that make it easier for visitors to find information and take action. Through wireframes, interactive prototypes and user-focused design, we bring your website experience to life before development begins.',
  ).replace(
    'Front-end design and UI.',
    'Custom Website Development',
  ).replace(
    'We shape the visual world of your website through layout, typography, imagery, motion and interaction. The goal is simple: make the experience feel clear, considered, and unmistakably yours from the first second.',
    'We build tailored websites using modern technologies and scalable development frameworks. Whether you need a business website, a complex platform or a custom web experience, we develop solutions around your specific requirements.',
  ).replace(
    'Figma prototyping.',
    'E-commerce Development',
  ).replace(
    'We use Figma to explore, test and refine key interactions before development begins. Prototypes help everyone understand how the website will move, flow and behave, so the experience feels considered before it’s built.',
    'We build e-commerce experiences that make online shopping simple and intuitive. From product catalogues and shopping carts to payment integrations and checkout optimisation, we create online stores designed to support sales and growth.',
  ).replace(
    'Immersive website animation.',
    'CMS & Website Management Systems',
  ).replace(
    'We love designing animation, transitions and interactive moments that make your website feel alive. Motion adds pace, depth and atmosphere to the experience, helping your brand land emotionally as well as functionally.',
    'We develop flexible content management systems that give your team control over website content without depending on developers for every update. From custom CMS solutions to platform integrations, we make website management easier.',
  ).replace(
    'WebGL.',
    'Website Optimisation & Maintenance',
  ).replace(
    'For brands that want to break away from the expected, we create WebGL experiences that feel impossible to ignore. Rich 3D environments, cinematic motion and interactive storytelling combine to create digital experiences that pull people in.',
    'We improve website speed, responsiveness, technical performance and reliability. Through ongoing maintenance, security updates and performance optimisation, we keep your website running smoothly as your business evolves.',
  );
}

function replaceWebDevelopmentCopy(text) {
  return text.replace(
    /Clean code[\s\S]{0,300}?heart\./,
    'Great products begin with experiences designed around people.',
  ).replace(
    'Fast, flexible websites with clean code, sharp interactions and technical foundations that keep the experience feeling as good as it looks.',
    'We help businesses turn complex ideas into intuitive digital products that people understand, enjoy and keep coming back to. Through user research, product thinking and experience design, we create thoughtful digital experiences that connect user needs with business objectives.',
  ).replace(
    'Built to behave beautifully.',
    'Bridge the gap between what your product does and what users actually need.',
  ).replace(
    'Ambitious designs often lose something in development. Movement becomes clunky, systems become restrictive, and the experience starts to feel compromised. We create websites with thoughtful engineering, refined interactions and flexible foundations that make every experience feel effortless.',
    'Even the most powerful product can struggle when users find it confusing, difficult to navigate or frustrating to use. At Kyoto Creative, we identify experience gaps, simplify complex workflows and redesign product interactions to make your digital products more intuitive, accessible and engaging.',
  ).replace(
    'Front-end development.',
    'Product Discovery & UX Research',
  ).replace(
    'We turn creative designs into responsive, polished digital experiences that feel smooth across devices. From layouts and components to transitions, hover states and micro-interactions, every detail is built to support the idea, not flatten it.',
    'We help you understand your users, validate product ideas and identify opportunities before investing heavily in development. Through user research, competitor analysis, journey mapping and product discovery, we establish a clear direction for your product.',
  ).replace(
    'Back-end development.',
    'UX Strategy & Experience Design',
  ).replace(
    'We build robust back-end systems that make websites easy to manage, scale and evolve. From CMS architecture to APIs and custom functionality, we create foundations that stay powerful without becoming complicated.',
    'We design user journeys, information architecture and interaction flows that make complex products easier to understand and use. Our approach focuses on reducing friction, improving usability and creating experiences that support your product objectives.',
  ).replace(
    'Animations & interaction.',
    'UI Design & Design Systems',
  ).replace(
    'Motion brings pace, personality and focus to a website when it’s done properly. We build animations and interactive moments that guide attention, add depth and make the experience feel more memorable without getting in the way.',
    'We create visually engaging interfaces and scalable design systems that bring consistency to your digital product. From interface components and typography to interactive prototypes, we build cohesive experiences that are ready for development.',
  );
}

function replaceWordPressCmsCopy(text) {
  return text.replace(
    'Create, update, repeat.',
    'From ambitious ideas to applications people love to use.',
  ).replace(
    'From WordPress to Sanity and headless CMS architecture, we give teams the freedom to update content, launch campaigns and build new pages without calling a developer.',
    'We turn business ideas into powerful mobile applications that solve real problems and create meaningful user experiences. From initial app design to development, integrations and deployment, we build scalable iOS and Android applications that bring your vision to life.',
  ).replace(
    'Give your team the keys.',
    'Don\'t let technical complexity hold your idea back.',
  ).replace(
    'Your website should grow with the business, not become a beautiful thing nobody wants to touch. We create CMS platforms that make content easy to manage, pages easy to build and updates easy to make.',
    'Building an app involves more than writing code. Poor usability, disconnected systems, technical limitations and scalability challenges can prevent even great ideas from succeeding. At Kyoto Creative, we help you navigate the entire development journey, transforming complex requirements into reliable, intuitive applications built around your users and business goals.',
  ).replace(
    'CMS strategy.',
    'Mobile App Design & Prototyping',
  ).replace(
    'The right CMS depends on how your team works. We help define the content structure, editing experience, permissions, page types and integrations your website needs, then build a system that supports the real people managing it.',
    'We design intuitive mobile experiences that balance usability, functionality and visual appeal. From user flows and wireframes to interactive prototypes, we help you visualise and validate your app before development.',
  ).replace(
    'WordPress development.',
    'iOS App Development',
  ).replace(
    'Custom WordPress websites with flexible editing systems, clean component libraries and enough control for your team to move quickly. No bloated templates. No page builder chaos. Just a CMS that feels practical, scalable and properly built.',
    'We build high-quality iOS applications designed for Apple\'s ecosystem. From feature-rich applications to custom mobile solutions, we focus on performance, reliability and experiences that feel natural to Apple users.',
  ).replace(
    'Sanity CMS.',
    'Android App Development',
  ).replace(
    'For projects that need more flexibility, we build with Sanity CMS to create structured content systems that are fast, scalable and easy to manage. Ideal for brands with complex content, multiple channels or more advanced publishing needs.',
    'We develop Android applications that deliver seamless experiences across a wide range of devices. Our development approach focuses on performance, compatibility, functionality and scalability.',
  ).replace(
    'Headless CMS.',
    'Cross-Platform App Development',
  ).replace(
    'Headless CMS gives you more freedom in how content is created, managed and delivered. We design and develop headless websites where the content system and front-end work together beautifully, without tying your brand to a single rigid platform.',
    'We build applications for multiple platforms using shared codebases and modern cross-platform technologies. This helps businesses reduce development complexity while delivering consistent experiences across iOS and Android.',
  ).replace(
    'Page builders.',
    'Backend Development & API Integrations',
  ).replace(
    'We create controlled, modular page-building systems that let your team create new pages confidently, while keeping your layouts, components and brand standards intact.',
    'We build the underlying infrastructure that powers your application, including databases, authentication, APIs and third-party integrations. We ensure your app\'s systems communicate reliably and can support future growth.',
  );
}

function replaceSeoGeoCopy(text) {
  return text.replace(
    'Keep up with <em> search.</em>',
    'Build AI that doesn\'t just respond. It gets things done.',
  ).replace(
    'Search is changing. We help brands with authority-led SEO and GEO through sharper content, stronger structure and ongoing optimisation built around how people discover businesses now.',
    'We design and develop intelligent AI agents and copilots that can understand instructions, reason through tasks and take actions across your business systems. From autonomous workflows to specialised AI assistants, we build solutions that extend your team\'s capabilities and help businesses work more intelligently.',
  ).replace(
    'Visibility is changing. Your strategy should too.',
    'Move beyond basic chatbots to AI that actually works for your business.',
  ).replace(
    'People are asking AI tools for recommendations, summaries, comparisons and expert answers before they ever reach your website. We help brands build the foundations to show up in those moments, with improvements that make your expertise easier to find, easier to trust, and easier to cite.',
    'Traditional automation follows fixed instructions, while basic chatbots often stop at answering questions. At Kyoto Creative, we build intelligent agents that can interpret context, use connected tools, retrieve information and execute multi-step tasks within defined permissions. This helps businesses reduce manual workloads and unlock new levels of productivity.',
  ).replace(
    'SEO strategy.',
    'Custom AI Agent Development',
  ).replace(
    'We define the search opportunities that matter most for your brand, audience and commercial goals. That means looking beyond vanity rankings to understand intent, competition, content gaps and the pages most likely to drive useful traffic.',
    'We build custom AI agents designed around your business requirements and workflows. From handling specific operational tasks to coordinating complex processes, our agents use AI models and connected tools to perform meaningful work.',
  ).replace(
    'GEO strategy.',
    'AI Copilots & Virtual Assistants',
  ).replace(
    'Generative engine optimisation helps your brand become easier for AI search tools and LLMs to understand, reference and recommend. We improve content clarity, entity signals, topical authority and structured information so your brand has a better chance of appearing in AI-led discovery.',
    'We develop intelligent assistants that help your employees access information, complete tasks and make better-informed decisions. Whether integrated into internal systems or business applications, our copilots act as practical AI support for your team.',
  ).replace(
    'Content optimisation.',
    'Multi-Agent Systems & Orchestration',
  ).replace(
    'Good content needs to answer the right questions with enough depth, clarity and credibility to earn attention. We optimise pages, blogs and service content around search intent, audience needs, internal linking, metadata and AI search visibility.',
    'We design interconnected AI agents that collaborate to complete complex tasks. By assigning specialised responsibilities and coordinating their actions, we build systems capable of handling multi-stage business processes.',
  ).replace(
    'Technical SEO.',
    'Knowledge-Based AI & RAG Systems',
  ).replace(
    'A strong visibility engine needs solid technical foundations. We review site structure, performance, crawlability, indexation, redirects, metadata, schema, accessibility and Core Web Vitals to help your website work harder behind the scenes.',
    'We build AI systems that retrieve information from your internal documents, databases and knowledge sources to provide relevant, context-aware responses. This makes organisational knowledge easier to access while keeping AI outputs grounded in your business information.',
  ).replace(
    'Ongoing SEO support.',
    'AI Agent Integration & Deployment',
  ).replace(
    'Our ongoing support keeps you up to date with the latest changes and gives you regular recommendations, content opportunities, performance reviews and practical improvements that keep your visibility moving in the right direction.',
    'We integrate AI agents into your existing applications, platforms and business workflows. From tool connections and access controls to deployment and monitoring, we help bring AI capabilities into your everyday operations.',
  );
}

function replaceCopywritingCopy(text) {
  return text.replace(
    'Words that feel <em>alive.</em>',
    'Make your business operations work smarter, not harder.',
  ).replace(
    'Good copy still has a pulse. We write strategic, brand-led copy that gives your website a voice, your message more weight and your audience a reason to keep reading.',
    'We help businesses eliminate repetitive tasks, connect disconnected systems and streamline complex operations through intelligent automation. By combining workflow orchestration, AI capabilities and seamless API integrations, we build connected business processes that save time, reduce manual effort and improve operational efficiency.',
  ).replace(
    'Captivating motion graphics that turn heads.',
    'Stop letting disconnected systems and repetitive tasks slow you down.',
  ).replace(
    'Wow your audience with seamless motion graphics that bring your brand to life. From subtle flickers of movement to advanced 3D rendering, our expert team can integrate a variety of animated effects into your website without compromising on functionality.',
    'Managing multiple tools, transferring information manually and relying on repetitive processes can drain your team\'s time and create unnecessary errors. At Kyoto Creative, we connect your existing systems, automate everyday workflows and build intelligent processes that allow your business to operate faster, with less manual intervention.',
  ).replace(
    'Strategic messaging.',
    'Business Process Automation',
  ).replace(
    'Copywriting starts long before the fingers hit the keyboard. First, we get clear on what your brand stands for, who it needs to reach and what people need to take away. Then we turn that thinking into language with a clear role.',
    'We identify repetitive business processes and turn them into automated workflows. From routine administrative tasks to complex operational processes, we help your team spend less time on manual work and more time on what matters.',
  ).replace(
    'Website copywriting.',
    'Workflow Orchestration & Automation',
  ).replace(
    'Too many websites are designed first and written later, leaving copy to squeeze into whatever space is left. We do it differently. The words develop alongside the strategy, UX and design, so the whole experience pulls in the same direction.',
    'We design and connect multi-step workflows across your business operations. By coordinating tasks, triggers, conditions and actions across different platforms, we ensure processes run smoothly from start to finish.',
  ).replace(
    'Brand-led messaging.',
    'API Development & Integrations',
  ).replace(
    'Your copy should sound like it belongs to your brand, not a competitor with the logo swapped out. We use your positioning, tone of voice and audience insight to create language that feels distinctive, credible and easy to trust.',
    'We connect your business applications, databases and third-party platforms through custom API integrations. This allows different systems to communicate, exchange information and work together without disconnected processes.',
  ).replace(
    'SEO copywriting.',
    'CRM & Business Systems Automation',
  ).replace(
    'Search visibility comes from being the best answer, not just the most optimised page. We create authoritative, audience-focused content built around genuine expertise, helping brands earn visibility across search engines, AI platforms, and whatever comes next.',
    'We automate everyday activities across CRM, sales, marketing and business management systems. From lead routing and customer updates to data synchronisation and task assignments, we make your business tools work together more efficiently.',
  ).replace(
    'Thought leadership and editorial content.',
    'AI-Powered Workflow Automation',
  ).replace(
    'Lead the conversation rather than adding to the noise. As part of our ongoing SEO support, we plan and write content that builds topical authority over time: useful, well-argued and grounded in real expertise.',
    'We integrate AI into business workflows to handle tasks that require more than simple rules. From intelligent categorisation and information extraction to content generation and decision support, we make workflows more adaptive and capable.',
  ).replace(
    'Content audits and strategy.',
    'Automation Monitoring & Optimisation',
  ).replace(
    'Sometimes the words are nearly there, but the page still isn’t doing enough. We audit what exists, find the gaps, cut what is dragging the experience down and build a practical content plan around your brand, audience and growth goals.',
    'We monitor automated workflows, identify bottlenecks and improve process reliability. Through ongoing optimisation, error handling and performance monitoring, we ensure your automation continues to deliver value as your business grows.',
  );
}

function replaceSitecareCopy(text) {
  return text.replace(
    'Keep your website <em>sharp.</em>',
    'Turn complex information into actionable intelligence.',
  ).replace(
    'Launch isn’t the finish line.',
    'Stop spending hours searching, sorting and processing information manually.',
  ).replace(
    'SiteCare keeps your website in good shape after launch, giving you the technical support, monitoring and development time to keep improving it over time.',
    'We help businesses extract, organise and understand information trapped in documents, files and unstructured data. Using AI-powered extraction, classification and processing systems, we transform scattered information into structured, accessible data that supports faster and smarter business decisions.',
  ).replace(
    'A good website needs proper care. KOTA’s SiteCare package keeps your site secure, stable, supported and moving forward, with ongoing maintenance, hosting, performance checks and development hours built around your needs.',
    'Manual document handling, scattered data and repetitive information processing can create bottlenecks across your business. At Kyoto Creative, we build intelligent systems that read documents, extract relevant information, classify data and automate information-heavy processes, helping your team work faster with greater accuracy.',
  ).replace(
    "A good website needs proper care. Kyoto Creative's SiteCare package keeps your site secure, stable, supported and moving forward, with ongoing maintenance, hosting, performance checks and development hours built around your needs.",
    'Manual document handling, scattered data and repetitive information processing can create bottlenecks across your business. At Kyoto Creative, we build intelligent systems that read documents, extract relevant information, classify data and automate information-heavy processes, helping your team work faster with greater accuracy.',
  ).replace(
    'Website maintenance.',
    'Intelligent Document Processing',
  ).replace(
    'Our SiteCare team keeps the essential technical upkeep proactive and under control, including CMS and plugin updates, bug fixes, and general website checks, so your site stays healthier behind the scenes.',
    'We build AI-powered systems that read and process documents such as invoices, contracts, forms and reports. Using document understanding and extraction technologies, we convert unstructured content into organised, usable information.',
  ).replace(
    'Hosting and security.',
    'Data Extraction & Structuring',
  ).replace(
    'Reliable hosting makes a big difference to how your website performs. SiteCare can include secure hosting setup, monitoring, uptime alerts and security support, helping your site stay stable, protected and ready for traffic.',
    'We extract relevant information from PDFs, spreadsheets, scanned files, emails and other data sources. We transform scattered information into structured datasets that can be searched, analysed and integrated into your business systems.',
  ).replace(
    ' Performance monitoring.',
    'AI-Powered Classification & Validation',
  ).replace(
    'A slow website hurts user experience, search visibility and conversion. We monitor performance and carry out regular checks in the background, keeping an eye on speed, stability and how the site behaves across devices.',
    'We automate the classification, categorisation and validation of incoming information. Our systems identify document types, detect inconsistencies, flag missing details and help ensure data is organised and reliable.',
  ).replace(
    'Priority support.',
    'Intelligent Data Pipelines & Processing',
  ).replace(
    'Get direct access to the team behind your website for fixes, updates, or changes. We’ll log requests, prioritise urgent issues, and keep things moving without your team having to chase multiple suppliers.',
    'We build automated pipelines that collect, process, transform and transfer information between different systems. From data ingestion to downstream integrations, we make information flow efficiently across your business operations.',
  );
}

function toneOfVoiceHeadlineStyle(route) {
  return (route === '/service/paid-media-performance' || route === '/service/brand-identity-creative')
    ? '<style>@media (min-width:769px){.Hero_hero__18Xqo h2{font-size:clamp(2.25rem,5vw,4.5rem)!important;width:65%!important}.Hero_hero__18Xqo div.Hero_video__IHL3y{width:30%!important;aspect-ratio:1/1!important;clip-path:circle(50% at 50% 50%)}.Hero_hero__18Xqo div.Hero_video__IHL3y>span{width:100%!important;height:100%!important;border-radius:50%;overflow:hidden}.Hero_hero__18Xqo div.Hero_video__IHL3y video,.Hero_hero__18Xqo div.Hero_video__IHL3y img{width:100%!important;height:100%!important;border-radius:50%;object-fit:cover}}</style>'
    : '';
}

function replaceBrandIdentityDesignCopy(text) {
  return text.replace(
    'Look like you <em>mean it.</em>',
    'Make your brand part of the conversation.',
  ).replace(
    'Most industries are filled with visual sameness. The same palettes. The same layouts. The same safe decisions. We help brands break out of that cycle.',
    'We create content and communication strategies that help businesses build visibility, establish credibility and connect with the audiences that matter. From SEO-driven content to media outreach and strategic partnerships, we turn your brand story into meaningful reach.',
  ).replace(
    'Design systems with sharper edges.',
    "Don't just publish content. Build a brand people recognise and trust.",
  ).replace(
    'Your brand identity should feel recognisable wherever it shows up, from your website and social content, to decks, campaigns and product experiences. We create visual systems designed to scale with your business, not fall apart the moment they leave your brand guidelines.',
    'Inconsistent publishing, limited reach and a lack of industry visibility can make it difficult to build authority. At Kyoto Creative, we help you create purposeful content, earn relevant media exposure and build strategic relationships that put your brand in front of the right people.',
  ).replace(
    'Brand identity systems.',
    'Content Strategy & Planning',
  ).replace(
    'We create cohesive identity systems that define how your brand looks, feels and behaves across every touchpoint.',
    'We develop strategic content plans and editorial calendars aligned with your brand objectives, audience interests and business goals. Every piece of content has a purpose and a clear direction.',
  ).replace(
    'Typography, colour and art direction.',
    'SEO Content & Thought Leadership',
  ).replace(
    'We shape flexible visual languages through typography, colour, imagery, motion design and creative direction, giving your brand a recognisable look that can stretch without losing itself.',
    'We create search-optimised blogs, articles and industry insights that improve organic visibility, attract relevant audiences and establish your business as an authority in its space.',
  ).replace(
    'Online brand guidelines.',
    'Social Media Campaigns',
  ).replace(
    'We’ve built our own online brand guidelines platform, so your brand can live in your browser rather than inside another forgotten PDF. Easily access, share and download everything from one always-up-to-date system.',
    "We plan and execute creative social media campaigns that increase engagement, build communities and strengthen your brand's digital presence through meaningful content.",
  ).replace(
    'Motion and digital-first branding.',
    'Public Relations & Media Outreach',
  ).replace(
    'Modern brands don’t sit still. We design identity systems with motion, interaction and digital experiences in mind from the start.',
    'We connect your brand with relevant publications, journalists and media opportunities. Through strategic PR campaigns, we help build credibility, expand visibility and strengthen your industry presence.',
  ).replace(
    'Audit your brand in minutes',
    'Influencer, Podcast & Partnership Outreach',
  ).replace(
    'Introducing the Brand Pulse Audit tool. See where your brand’s thriving—and where it needs a little CPR.',
    'We identify and connect your business with relevant influencers, podcast hosts and strategic partners to expand your reach, build credibility and create valuable business relationships.',
  );
}

function replaceBrandStrategyCopy(text) {
  return text.replace(
    /Creative fuel <br \/>(?:\\r\\n|\r?\n)for brand <br \/>(?:\\r\\n|\r?\n)breakthroughs\./,
    'Build a brand that knows what it stands for.',
  ).replace(
    'Strong brands start with clear decisions. We help you define what makes yours different, then build the strategy, voice and identity system to prove it.',
    'We help businesses define who they are, what makes them different and why customers should choose them. Through research, strategic positioning and purposeful messaging, we build the foundation for brands that stand out and grow with direction.',
  ).replace(
    'Strategic clarity that creates sharper brands.',
    'Start giving customers a reason to choose you.',
  ).replace(
    'At KOTA, we treat brand as infrastructure. Not surface-level aesthetics. Not vague purpose statements hidden in a slide deck. A strategic system that influences how you show up, scale up, and compete.',
    'Unclear positioning, inconsistent messaging and a lack of brand direction can make it difficult to earn customer trust. At Kyoto Creative, we help you uncover your competitive advantage, clarify your brand identity and build a positioning strategy that makes your business memorable.',
  ).replace(
    'At Kyoto Creative, we treat brand as infrastructure. Not surface-level aesthetics. Not vague purpose statements hidden in a slide deck. A strategic system that influences how you show up, scale up, and compete.',
    'Unclear positioning, inconsistent messaging and a lack of brand direction can make it difficult to earn customer trust. At Kyoto Creative, we help you uncover your competitive advantage, clarify your brand identity and build a positioning strategy that makes your business memorable.',
  ).replace(
    'Positioning and differentiation.',
    'Brand Discovery & Research',
  ).replace(
    'We’ll uncover the signals, stories and tensions that make your brand different, then turn them into a strategic foundation for how you should exist in the market, where you can own space, and how to avoid blending into a sea of category clichés.',
    'We uncover the insights behind your market, competitors and audience. Our research helps identify opportunities, understand customer expectations and make informed brand decisions.',
  ).replace(
    'Messaging and narrative systems.',
    'Brand Positioning & Differentiation',
  ).replace(
    'From your value proposition to your messaging pillars, we create language systems that bring consistency across every touchpoint, helping your brand sound clearer, sharper and more recognisable.',
    'We define your unique value proposition and establish a distinctive market position. This gives customers a clear reason to choose your business over the competition.',
  ).replace(
    'Brand & product architecture.',
    'Brand Strategy & Architecture',
  ).replace(
    'Launching new products? Expanding services? Managing multiple audiences? We structure your brand in a way that feels intentional, scalable and easy for customers to understand and navigate.',
    'We develop a cohesive brand strategy built around your vision, values and long-term objectives. From brand structure to strategic direction, we create a foundation that supports sustainable growth.',
  ).replace(
    'Strategic creative direction.',
    'Audience & Brand Messaging',
  ).replace(
    'Your brand identity should reinforce your positioning, not fight against it. We’ll align your new strategy and creative output to build a brand that feels cohesive, distinctive and commercially effective.',
    'We identify your ideal audience and develop messaging that speaks directly to their needs. From brand voice to communication frameworks, we make sure your brand sounds consistent, relevant and recognisable.',
  );
}

function localizeDocument(html, route) {
  const rawRoute = route;
  route = getCanonicalServiceRoute(route);
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
  if (route === '/work/leadcourt') html = removeLeadCourtServiceLabelDashes(html);
  if (route === '/work/interactfinancial.ca') html = removeInteractFinancialServiceLabelDots(html);
  if (route === '/work/green-square-infra') html = removeGreenSquareServiceLabelDashes(html);
  if (route === '/work/johnruggieri') html = removeJohnRuggieriServiceLabelDots(html);
  if (route === '/work/seven-gate-holdings') html = removeSevenGateServiceLabelDots(html);
  if (route === '/service/brand-strategy-positioning') html = replaceBrandStrategyCopy(html);
  if (route === '/service/content-campaigns-pr') html = replaceBrandIdentityDesignCopy(html);
  if (route === '/service/paid-media-performance') html = replaceToneOfVoiceCopy(html);
  if (route === '/service/brand-identity-creative') html = replaceBrandIdentityCreativeCopy(html);
  if (route === '/service/website-design-development') html = replaceCreativeWebDesignCopy(html);
  if (route === '/service/product-design-ux') html = replaceWebDevelopmentCopy(html);
  if (route === '/service/app-design-development') html = replaceWordPressCmsCopy(html);
  if (route === '/service/autonomous-ai-agents-copilots') html = replaceSeoGeoCopy(html);
  if (route === '/service/workflow-orchestration-api-integration') html = replaceCopywritingCopy(html);
  if (route === '/service/intelligent-document-data-processing') html = replaceSitecareCopy(html);
  if (route === '/b2b-tech-software-saas' || route === '/healthcare' || route === '/retail') html = removeTestimonialsHtml(html);
  if (route === '/contact') html = replaceContactNewsletterCopy(html);
  html = replaceWebDesignProcessHtml(html);
  html = replaceGrowthMarketingProcessHtml(html);
  html = replaceBrandProcessHtml(html);
  html = replaceWebDesignFaqHtml(html);
  html = replaceBrandFaqHtml(html);
  html = replaceServicePageName(html, route);
  if (route === '/contact') {
    html = replaceContactEmailsHtml(html);
    html = removeCareersEmailHtml(html);
    html = html.replace('<section class="Hero_hero___ImMv">', '<section class="Hero_hero___ImMv"><h1 class="visually-hidden">Let’s Talk About Your Next Project</h1>');
  }
  if (route === '/our-agency' || route === '/agency') {
    html = html.replace('<h1><span class="MaskInUp_container__0AW5i" data-fill="false"><div><span><i></i>Agency</span></div></span></h1>', '<h1><span class="MaskInUp_container__0AW5i" data-fill="false"><div><span><i></i>The Agency Behind the Work</span></div></span></h1>');
  }
  if (route === '/work') {
    html = replaceWorkArchiveHtml(html);
    html = html.replace('<h1><span class="MaskInUp_container__0AW5i" data-fill="false"><div><span><i></i>Work</span></div></span></h1>', '<h1><span class="MaskInUp_container__0AW5i" data-fill="false"><div><span><i></i>Selected Work &amp; Client Results</span></div></span></h1>');
  }
  if (route === '/') {
    html = html.replace('<h1 class="Hero_introText__wboFn">', '<p class="Hero_introText__wboFn">');
    const introPIdx = html.indexOf('<p class="Hero_introText__wboFn">');
    if (introPIdx !== -1) {
      const closingH1 = html.indexOf('</h1>', introPIdx);
      if (closingH1 !== -1) {
        html = html.slice(0, closingH1) + '</p>' + html.slice(closingH1 + 5);
      }
    }
    html = replaceHomepageFaqHtml(html);
    html = replaceHomepageServicesHtml(html);
    html = html
      .replace(
        '<svg class="Footer_logo__fUEOF" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 618 237" ><image href="/images/kyoto-creative-footer-white.png" width="618" height="237" preserveAspectRatio="xMidYMid meet"></image></svg>',
        '<svg class="Footer_logo__fUEOF" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 666 375"><image href="/images/kyoto-creative-home-footer.png" width="666" height="375" preserveAspectRatio="xMidYMid meet"></image></svg>'
      )
      .replaceAll('/images/kyoto-creative-footer-white.png', '/images/kyoto-creative-home-footer.png');
  }
  if (parts.length) {
    const flightText = reserveLazyImageDimensionsInFlight(localizeFlight(parts.join(''), route));
    const data = JSON.stringify([1, flightText]).replaceAll('<', '\\u003c');
    html = html.replace(placeholder, '<script>self.__next_f.push(' + data + ')</script>');
  }
  return reserveLazyImageDimensionsInMarkup(html);
}

function removeLeadCourtServiceLabelDashes(text) {
  return text.replace(/(Growth Marketing|SEO|Paid Advertising)(?:\s|&nbsp;)*(?:&#8211;|&ndash;|–|-)/g, '$1');
}

function removeInteractFinancialServiceLabelDots(text) {
  return text.replace(/(Website Development|Search Engine Optimisation|Answer Engine Optimisation) ·/g, '$1');
}

function removeGreenSquareServiceLabelDashes(text) {
  return text.replace(/(Website Development|Performance Marketing|Real Estate Marketing) —/g, '$1');
}

function removeJohnRuggieriServiceLabelDots(text) {
  return text.replace(/(Personal Branding|Digital Marketing|Lead Generation) ·/g, '$1');
}

function removeSevenGateServiceLabelDots(text) {
  return text.replace(/(Website Design &amp; Development|Brand Experience) ·/g, '$1');
}

const pageSEOMap = new Map([
  ['/', {
    title: 'Kyoto Creative | Marketing, Web & AI Automation Agency',
    description: 'Kyoto Creative is a marketing, web & AI automation agency. Brand strategy, high-converting websites and practical AI systems that drive real growth.',
    h1: 'Marketing that works. Websites that convert. AI that delivers.',
    canonical: 'https://www.kyotocreative.com/',
  }],
  ['/work', {
    title: 'Our Work & Case Studies | Kyoto Creative',
    description: 'Explore selected work from Kyoto Creative — branding, websites, apps and AI automations that delivered measurable results for our clients.',
    h1: 'Selected Work & Client Results',
    canonical: 'https://www.kyotocreative.com/work',
  }],
  ['/contact', {
    title: 'Contact Us | Start Your Project | Kyoto Creative',
    description: 'Ready to grow? Contact Kyoto Creative to discuss brand strategy, website development or AI automation. Let’s start your next project.',
    h1: 'Let’s Talk About Your Next Project',
    canonical: 'https://www.kyotocreative.com/contact',
  }],
  ['/faqs', {
    title: 'FAQs - Frequently Asked Questions',
    description: 'Got questions on web design, branding, or digital marketing? Our FAQ page is your go-to guide for clear, jargon-free answers.',
    h1: 'FAQs',
    canonical: 'https://www.kyotocreative.com/faqs',
  }],
  ['/our-agency', {
    title: 'About Our Agency | Team, Story & Values | Kyoto Creative',
    description: 'Meet the team behind Kyoto Creative. Our story, values and process for delivering brand strategy, high-converting websites and practical AI automations.',
    h1: 'The Agency Behind the Work',
    canonical: 'https://www.kyotocreative.com/our-agency',
  }],
  ['/agency', {
    title: 'About Our Agency | Team, Story & Values | Kyoto Creative',
    description: 'Meet the team behind Kyoto Creative. Our story, values and process for delivering brand strategy, high-converting websites and practical AI automations.',
    h1: 'The Agency Behind the Work',
    canonical: 'https://www.kyotocreative.com/our-agency',
  }],
  ['/marketing', {
    title: 'Marketing Agency | Brand Strategy & Performance | Kyoto Creative',
    description: 'Full-service marketing from Kyoto Creative: brand strategy & positioning, content campaigns & PR, paid media, and brand identity. Results-driven growth.',
    h1: 'Marketing Services That Drive Growth',
    canonical: 'https://www.kyotocreative.com/marketing',
  }],
  ['/service/marketing', {
    title: 'Marketing Agency | Brand Strategy & Performance | Kyoto Creative',
    description: 'Full-service marketing from Kyoto Creative: brand strategy & positioning, content campaigns & PR, paid media, and brand identity. Results-driven growth.',
    h1: 'Marketing Services That Drive Growth',
    canonical: 'https://www.kyotocreative.com/marketing',
  }],
  ['/brand-strategy-positioning', {
    title: 'Brand Strategy & Positioning Services | Kyoto Creative',
    description: 'Clear brand strategy and positioning that differentiates you in the market. Kyoto Creative builds frameworks that attract the right clients.',
    h1: 'Brand Strategy & Positioning',
    canonical: 'https://www.kyotocreative.com/brand-strategy-positioning',
  }],
  ['/service/brand-strategy-positioning', {
    title: 'Brand Strategy & Positioning Services | Kyoto Creative',
    description: 'Clear brand strategy and positioning that differentiates you in the market. Kyoto Creative builds frameworks that attract the right clients.',
    h1: 'Brand Strategy & Positioning',
    canonical: 'https://www.kyotocreative.com/brand-strategy-positioning',
  }],
  ['/content-campaigns-pr', {
    title: 'Content Campaigns & PR Services | Kyoto Creative',
    description: 'Strategic content campaigns and PR that build authority and visibility. Kyoto Creative creates stories that earn attention and trust.',
    h1: 'Content Campaigns & PR',
    canonical: 'https://www.kyotocreative.com/content-campaigns-pr',
  }],
  ['/service/content-campaigns-pr', {
    title: 'Content Campaigns & PR Services | Kyoto Creative',
    description: 'Strategic content campaigns and PR that build authority and visibility. Kyoto Creative creates stories that earn attention and trust.',
    h1: 'Content Campaigns & PR',
    canonical: 'https://www.kyotocreative.com/content-campaigns-pr',
  }],
  ['/paid-media-performance', {
    title: 'Paid Media & Performance Marketing | Kyoto Creative',
    description: 'High-ROI paid media and performance marketing. Google Ads, Meta, LinkedIn and more — managed for measurable results by Kyoto Creative.',
    h1: 'Paid Media & Performance Marketing',
    canonical: 'https://www.kyotocreative.com/paid-media-performance',
  }],
  ['/service/paid-media-performance', {
    title: 'Paid Media & Performance Marketing | Kyoto Creative',
    description: 'High-ROI paid media and performance marketing. Google Ads, Meta, LinkedIn and more — managed for measurable results by Kyoto Creative.',
    h1: 'Paid Media & Performance Marketing',
    canonical: 'https://www.kyotocreative.com/paid-media-performance',
  }],
  ['/service/brand-identity-creative', {
    title: 'Brand Identity & Creative Design | Kyoto Creative',
    description: 'Complete brand identity and creative systems — logo, visual language, guidelines. Distinctive creative that makes your brand unforgettable.',
    h1: 'Brand Identity & Creative',
    canonical: 'https://www.kyotocreative.com/brand-identity-creative',
  }],
  ['/brand-identity-creative', {
    title: 'Brand Identity & Creative Design | Kyoto Creative',
    description: 'Complete brand identity and creative systems — logo, visual language, guidelines. Distinctive creative that makes your brand unforgettable.',
    h1: 'Brand Identity & Creative',
    canonical: 'https://www.kyotocreative.com/brand-identity-creative',
  }],
  ['/service/branding', {
    title: 'Brand Identity & Creative Design | Kyoto Creative',
    description: 'Complete brand identity and creative systems — logo, visual language, guidelines. Distinctive creative that makes your brand unforgettable.',
    h1: 'Brand Identity & Creative',
    canonical: 'https://www.kyotocreative.com/brand-identity-creative',
  }],
  ['/web-app', {
    title: 'Web & App Design and Development Agency | Kyoto Creative',
    description: 'Website design & development, product design & UX, and app design & development from Kyoto Creative. Beautiful, high-performing digital products.',
    h1: 'Web & App Design and Development',
    canonical: 'https://www.kyotocreative.com/web-app',
  }],
  ['/service/web-app', {
    title: 'Web & App Design and Development Agency | Kyoto Creative',
    description: 'Website design & development, product design & UX, and app design & development from Kyoto Creative. Beautiful, high-performing digital products.',
    h1: 'Web & App Design and Development',
    canonical: 'https://www.kyotocreative.com/web-app',
  }],
  ['/website-design-development', {
    title: 'Website Design & Development Agency | Kyoto Creative',
    description: 'Conversion-focused website design and development. Fast, modern, SEO-ready sites built to grow your business by Kyoto Creative.',
    h1: 'Website Design & Development',
    canonical: 'https://www.kyotocreative.com/website-design-development',
  }],
  ['/service/website-design-development', {
    title: 'Website Design & Development Agency | Kyoto Creative',
    description: 'Conversion-focused website design and development. Fast, modern, SEO-ready sites built to grow your business by Kyoto Creative.',
    h1: 'Website Design & Development',
    canonical: 'https://www.kyotocreative.com/website-design-development',
  }],
  ['/product-design-ux', {
    title: 'Product Design & UX Services | Kyoto Creative',
    description: 'User-centered product design and UX that improves activation, retention and conversion. Expert UX/UI for SaaS and digital products.',
    h1: 'Product Design & UX',
    canonical: 'https://www.kyotocreative.com/product-design-ux',
  }],
  ['/service/product-design-ux', {
    title: 'Product Design & UX Services | Kyoto Creative',
    description: 'User-centered product design and UX that improves activation, retention and conversion. Expert UX/UI for SaaS and digital products.',
    h1: 'Product Design & UX',
    canonical: 'https://www.kyotocreative.com/product-design-ux',
  }],
  ['/app-design-development', {
    title: 'App Design & Development Services | Kyoto Creative',
    description: 'End-to-end app design and development for iOS, Android and web. Beautiful, scalable mobile and web apps from Kyoto Creative.',
    h1: 'App Design & Development',
    canonical: 'https://www.kyotocreative.com/app-design-development',
  }],
  ['/service/app-design-development', {
    title: 'App Design & Development Services | Kyoto Creative',
    description: 'End-to-end app design and development for iOS, Android and web. Beautiful, scalable mobile and web apps from Kyoto Creative.',
    h1: 'App Design & Development',
    canonical: 'https://www.kyotocreative.com/app-design-development',
  }],
  ['/ai-automations', {
    title: 'AI Automations & Intelligent Agents | Kyoto Creative',
    description: 'Practical AI automations: intelligent document processing, autonomous AI agents & copilots, and workflow orchestration. Scale smarter with Kyoto Creative.',
    h1: 'AI Automations That Actually Work',
    canonical: 'https://www.kyotocreative.com/ai-automations',
  }],
  ['/service/growth-marketing', {
    title: 'AI Automations & Intelligent Agents | Kyoto Creative',
    description: 'Practical AI automations: intelligent document processing, autonomous AI agents & copilots, and workflow orchestration. Scale smarter with Kyoto Creative.',
    h1: 'AI Automations That Actually Work',
    canonical: 'https://www.kyotocreative.com/ai-automations',
  }],
  ['/intelligent-document-data-processing', {
    title: 'Intelligent Document & Data Processing | Kyoto Creative',
    description: 'AI-powered document and data processing that extracts, validates and routes information automatically. Cut manual work with Kyoto Creative.',
    h1: 'Intelligent Document & Data Processing',
    canonical: 'https://www.kyotocreative.com/intelligent-document-data-processing',
  }],
  ['/service/intelligent-document-data-processing', {
    title: 'Intelligent Document & Data Processing | Kyoto Creative',
    description: 'AI-powered document and data processing that extracts, validates and routes information automatically. Cut manual work with Kyoto Creative.',
    h1: 'Intelligent Document & Data Processing',
    canonical: 'https://www.kyotocreative.com/intelligent-document-data-processing',
  }],
  ['/autonomous-ai-agents-copilots', {
    title: 'Autonomous AI Agents & Copilots | Kyoto Creative',
    description: 'Build autonomous AI agents and copilots that handle complex tasks, decisions and workflows. Practical agentic AI solutions from Kyoto Creative.',
    h1: 'Autonomous AI Agents & Copilots',
    canonical: 'https://www.kyotocreative.com/autonomous-ai-agents-copilots',
  }],
  ['/service/autonomous-ai-agents-copilots', {
    title: 'Autonomous AI Agents & Copilots | Kyoto Creative',
    description: 'Build autonomous AI agents and copilots that handle complex tasks, decisions and workflows. Practical agentic AI solutions from Kyoto Creative.',
    h1: 'Autonomous AI Agents & Copilots',
    canonical: 'https://www.kyotocreative.com/autonomous-ai-agents-copilots',
  }],
  ['/workflow-orchestration-api-integration', {
    title: 'Workflow Orchestration & API Integration | Kyoto Creative',
    description: 'Seamless workflow orchestration and API integrations powered by AI. Connect systems, automate processes and scale operations with Kyoto Creative.',
    h1: 'Workflow Orchestration & API Integration',
    canonical: 'https://www.kyotocreative.com/workflow-orchestration-api-integration',
  }],
  ['/service/workflow-orchestration-api-integration', {
    title: 'Workflow Orchestration & API Integration | Kyoto Creative',
    description: 'Seamless workflow orchestration and API integrations powered by AI. Connect systems, automate processes and scale operations with Kyoto Creative.',
    h1: 'Workflow Orchestration & API Integration',
    canonical: 'https://www.kyotocreative.com/workflow-orchestration-api-integration',
  }],
]);

function getCanonicalServiceRoute(route) {
  const mapping = {
    '/marketing': '/service/marketing',
    '/brand-strategy-positioning': '/service/brand-strategy-positioning',
    '/content-campaigns-pr': '/service/content-campaigns-pr',
    '/paid-media-performance': '/service/paid-media-performance',
    '/brand-identity-creative': '/service/brand-identity-creative',
    '/service/brand-identity-creative': '/service/brand-identity-creative',
    '/web-app': '/service/web-app',
    '/website-design-development': '/service/website-design-development',
    '/product-design-ux': '/service/product-design-ux',
    '/app-design-development': '/service/app-design-development',
    '/ai-automations': '/service/growth-marketing',
    '/intelligent-document-data-processing': '/service/intelligent-document-data-processing',
    '/autonomous-ai-agents-copilots': '/service/autonomous-ai-agents-copilots',
    '/workflow-orchestration-api-integration': '/service/workflow-orchestration-api-integration',
  };
  return mapping[route] || route;
}

const servicePageNameReplacements = new Map([
  ['/service/marketing', [
    ['href="/service/marketing">Marketing &amp; Branding</a>', 'href="/service/marketing">Marketing</a>'],
    ['href="/service/marketing">Marketing & Branding</a>', 'href="/service/marketing">Marketing</a>'],
    ['<h1>Branding agency in London</h1>', '<h1>Marketing Services That Drive Growth</h1>'],
    ['"children":"Branding agency in London"', '"children":"Marketing Services That Drive Growth"'],
  ]],
  ['/service/web-app', [
    ['href="/service/web-app">Website &amp; App Development</a>', 'href="/service/web-app">Web &amp; App</a>'],
    ['href="/service/web-app">Website & App Development</a>', 'href="/service/web-app">Web & App</a>'],
    ['<h1>Web design and development services</h1>', '<h1>Web &amp; App Design and Development</h1>'],
    ['"children":"Web design and development services"', '"children":"Web & App Design and Development"'],
  ]],
  ['/service/brand-strategy-positioning', [
    ['Brand Strategy Agency | London &amp; NYC | Kyoto Creative', 'Brand Strategy &amp; Positioning Services | Kyoto Creative'],
    ['Brand Strategy Agency | London & NYC | Kyoto Creative', 'Brand Strategy & Positioning Services | Kyoto Creative'],
    ['<h1>Brand Strategy Services</h1>', '<h1>Brand Strategy &amp; Positioning</h1>'],
    ['"children":"Brand Strategy Services"', '"children":"Brand Strategy & Positioning"'],
  ]],
  ['/service/content-campaigns-pr', [
    ['Brand Identity Design Services | London &amp; NYC | Kyoto Creative', 'Content Campaigns &amp; PR Services | Kyoto Creative'],
    ['Brand Identity Design Services | London & NYC | Kyoto Creative', 'Content Campaigns & PR Services | Kyoto Creative'],
    ['<h1>Brand identity design services</h1>', '<h1>Content Campaigns &amp; PR</h1>'],
    ['"children":"Brand identity design services"', '"children":"Content Campaigns & PR"'],
  ]],
  ['/service/brand-identity-creative', [
    ['Brand Tone of Voice Guidelines | London &amp; NYC | Kyoto Creative', 'Brand Identity &amp; Creative Design | Kyoto Creative'],
    ['Brand Tone of Voice Guidelines | London & NYC | Kyoto Creative', 'Brand Identity & Creative Design | Kyoto Creative'],
    ['Paid Media &amp; Performance Marketing | Kyoto Creative', 'Brand Identity &amp; Creative Design | Kyoto Creative'],
    ['Paid Media & Performance Marketing | Kyoto Creative', 'Brand Identity & Creative Design | Kyoto Creative'],
    ['<h1>Tone of voice development services</h1>', '<h1>Brand Identity &amp; Creative</h1>'],
    ['"children":"Tone of voice development services"', '"children":"Brand Identity & Creative"'],
    ['<h1>Paid Media &amp; Performance Marketing</h1>', '<h1>Brand Identity &amp; Creative</h1>'],
    ['"children":"Paid Media & Performance Marketing"', '"children":"Brand Identity & Creative"'],
    ['<h1>Branding agency in London</h1>', '<h1>Brand Identity &amp; Creative</h1>'],
    ['"children":"Branding agency in London"', '"children":"Brand Identity & Creative"'],
  ]],
  ['/service/paid-media-performance', [
    ['Brand Tone of Voice Guidelines | London &amp; NYC | Kyoto Creative', 'Paid Media &amp; Performance Marketing | Kyoto Creative'],
    ['Brand Tone of Voice Guidelines | London & NYC | Kyoto Creative', 'Paid Media & Performance Marketing | Kyoto Creative'],
    ['<h1>Tone of voice development services</h1>', '<h1>Paid Media &amp; Performance Marketing</h1>'],
    ['"children":"Tone of voice development services"', '"children":"Paid Media & Performance Marketing"'],
  ]],
  ['/service/branding', [
    ['<h1>Branding agency in London</h1>', '<h1>Brand Identity &amp; Creative</h1>'],
    ['"children":"Branding agency in London"', '"children":"Brand Identity & Creative"'],
  ]],
  ['/service/website-design-development', [
    ['Creative Web Design Agency | London &amp; NYC | Kyoto Creative', 'Website Design &amp; Development Agency | Kyoto Creative'],
    ['Creative Web Design Agency | London & NYC | Kyoto Creative', 'Website Design & Development Agency | Kyoto Creative'],
    ['<h1>Award-winning creative web design agency</h1>', '<h1>Website Design &amp; Development</h1>'],
    ['"children":"Award-winning creative web design agency"', '"children":"Website Design & Development"'],
  ]],
  ['/service/product-design-ux', [
    ['Web Development Services | London &amp; NYC | Kyoto Creative', 'Product Design &amp; UX Services | Kyoto Creative'],
    ['Web Development Services | London & NYC | Kyoto Creative', 'Product Design & UX Services | Kyoto Creative'],
    ['<h1>Award-winning web development agency</h1>', '<h1>Product Design &amp; UX</h1>'],
    ['"children":"Award-winning web development agency"', '"children":"Product Design & UX"'],
  ]],
  ['/service/app-design-development', [
    ['WordPress Web Design &amp; Development | London &amp; NYC | Kyoto Creative', 'App Design &amp; Development Services | Kyoto Creative'],
    ['WordPress Web Design & Development | London & NYC | Kyoto Creative', 'App Design & Development Services | Kyoto Creative'],
    ['<h1>Award-winning WordPress and Sanity CMS agency</h1>', '<h1>App Design &amp; Development</h1>'],
    ['"children":"Award-winning WordPress and Sanity CMS agency"', '"children":"App Design & Development"'],
  ]],
  ['/service/growth-marketing', [
    ['<h1>Growth marketing services</h1>', '<h1>AI Automations That Actually Work</h1>'],
    ['<h1>AI Automations services</h1>', '<h1>AI Automations That Actually Work</h1>'],
    ['"children":"Growth marketing services"', '"children":"AI Automations That Actually Work"'],
    ['"children":"AI Automations services"', '"children":"AI Automations That Actually Work"'],
  ]],
  ['/service/autonomous-ai-agents-copilots', [
    ['SEO &amp; GEO Services | London &amp; NYC | Kyoto Creative', 'Autonomous AI Agents &amp; Copilots | Kyoto Creative'],
    ['SEO & GEO Services | London & NYC | Kyoto Creative', 'Autonomous AI Agents & Copilots | Kyoto Creative'],
    ['<h1>SEO &amp; GEO services</h1>', '<h1>Autonomous AI Agents &amp; Copilots</h1>'],
    ['<h1>SEO & GEO services</h1>', '<h1>Autonomous AI Agents & Copilots</h1>'],
    ['"children":"SEO &amp; GEO services"', '"children":"Autonomous AI Agents & Copilots"'],
    ['"children":"SEO & GEO services"', '"children":"Autonomous AI Agents & Copilots"'],
  ]],
  ['/service/workflow-orchestration-api-integration', [
    ['Copywriting services | London &amp; NYCC', 'Workflow Orchestration &amp; API Integration | Kyoto Creative'],
    ['Copywriting services | London & NYCC', 'Workflow Orchestration & API Integration | Kyoto Creative'],
    ['<h1>Professional copywriting services</h1>', '<h1>Workflow Orchestration &amp; API Integration</h1>'],
    ['"children":"Professional copywriting services"', '"children":"Workflow Orchestration & API Integration"'],
  ]],
  ['/service/intelligent-document-data-processing', [
    ['SiteCare | London &amp; NYC | Kyoto Creative', 'Intelligent Document &amp; Data Processing | Kyoto Creative'],
    ['SiteCare | London & NYC | Kyoto Creative', 'Intelligent Document & Data Processing | Kyoto Creative'],
    ['<h1>SiteCare </h1>', '<h1>Intelligent Document &amp; Data Processing</h1>'],
    ['"children":"SiteCare "', '"children":"Intelligent Document & Data Processing"'],
  ]],
]);

function replaceServicePageName(text, route) {
  const canonicalRoute = getCanonicalServiceRoute(route);
  for (const [source, replacement] of servicePageNameReplacements.get(canonicalRoute) || []) {
    text = text.replaceAll(source, replacement);
  }
  return text;
}

const retiredServiceRoutes = new Set([
  '/service/brand-strategy-and-identity',
  '/service/web-design-development',
  '/service/brand-strategy',
  '/service/brand-identity-design',
  '/service/tone-of-voice',
  '/service/creative-web-design',
  '/service/web-development',
  '/service/wordpress-cms',
  '/service/seo-geo',
  '/service/copywriting',
  '/service/sitecare',
]);

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

function updateFlightAstMetadata(node, seo) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    if (node[0] === "$") {
      const tag = node[1];
      const props = node[3];
      if (props) {
        if (tag === "title") {
          props.children = seo.title;
        } else if (tag === "meta") {
          if (props.name === "description") props.content = seo.description;
          if (props.property === "og:title") props.content = seo.title;
          if (props.property === "og:description") props.content = seo.description;
          if (props.property === "og:url") props.content = seo.canonical;
        } else if (tag === "link" && props.rel === "canonical") {
          props.href = seo.canonical;
        }
      }
    }
    for (let i = 0; i < node.length; i++) {
      updateFlightAstMetadata(node[i], seo);
    }
  } else {
    for (const key of Object.keys(node)) {
      updateFlightAstMetadata(node[key], seo);
    }
  }
}

function updateYoastSchemaGraph(data, route, seo) {
  if (!data || !Array.isArray(data['@graph'])) return data;
  for (const item of data['@graph']) {
    if (seo && item['@type'] === 'WebPage') {
      item.name = seo.title;
      item.description = seo.description;
      item.url = seo.canonical;
      if (item['@id']) item['@id'] = seo.canonical;
    }
    if (item['@type'] === 'BreadcrumbList') {
      const canonicalOrigin = 'https://www.kyotocreative.com';
      if (item['@id']) {
        if (item['@id'].startsWith('#') || item['@id'].startsWith('/#')) {
          item['@id'] = canonicalOrigin + (item['@id'].startsWith('/') ? item['@id'] : '/' + item['@id']);
        } else if (item['@id'].startsWith('/')) {
          item['@id'] = canonicalOrigin + item['@id'];
        }
      }
      if (Array.isArray(item.itemListElement)) {
        for (const element of item.itemListElement) {
          if (element['@type'] === 'ListItem') {
            if (element.position === 1 && element.name === 'Home') {
              element.item = canonicalOrigin + '/';
            } else if (element.item) {
              if (element.item.startsWith('/')) {
                element.item = canonicalOrigin + element.item;
              } else if (!element.item.startsWith('http')) {
                element.item = canonicalOrigin + '/' + element.item;
              }
            }
          }
        }
      }
    }
  }
  return data;
}

function replaceFlightMetadataRow(line, route) {
  const seo = pageSEOMap.get(route);

  const tMatch = line.match(/^([a-f\d]+):T([a-f\d]+),(.*)$/i);
  if (tMatch && tMatch[3].includes("@context") && tMatch[3].includes("schema.org")) {
    try {
      const data = JSON.parse(tMatch[3]);
      updateYoastSchemaGraph(data, route, seo);
      const newJson = JSON.stringify(data);
      const newHex = Buffer.byteLength(newJson).toString(16);
      return tMatch[1] + ":T" + newHex + "," + newJson;
    } catch (_) {}
  }

  if (seo && (line.includes('["$","title"') || line.includes('"og:title"'))) {
    const prefixMatch = line.match(/^([a-f\d]+:)/i);
    if (prefixMatch) {
      const prefix = prefixMatch[1];
      const newline = line.endsWith("\r\n") ? "\r\n" : (line.endsWith("\n") ? "\n" : "");
      try {
        const doc = JSON.parse(line.slice(prefix.length).trimEnd());
        updateFlightAstMetadata(doc, seo);
        return prefix + JSON.stringify(doc) + newline;
      } catch (_) {}
    }
  }

  return line;
}

function configureDocumentMetadata(html, route) {
  const faviconLinks = [
    '<link rel="icon" href="/favicon.ico" sizes="any">',
    '<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">',
    '<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">',
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
    '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
  ].join('');

  const seo = pageSEOMap.get(route);

  // Update Yoast schema graph in HTML if present (for both mapped and unmapped routes)
  html = html.replace(/<script\b[^>]*class=["']yoast-schema-graph["'][^>]*>([\s\S]*?)<\/script>/gi, (match, jsonStr) => {
    try {
      const data = JSON.parse(jsonStr);
      updateYoastSchemaGraph(data, route, seo);
      return '<script type="application/ld+json" class="yoast-schema-graph">' + JSON.stringify(data) + '</script>';
    } catch (_) {
      return match;
    }
  });

  if (seo) {
    // Strip any existing title, description, og:title, og:description, canonical
    html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '');
    html = html.replace(/<meta\b[^>]*name=["']description["'][^>]*>/gi, '');
    html = html.replace(/<meta\b[^>]*property=["']og:title["'][^>]*>/gi, '');
    html = html.replace(/<meta\b[^>]*property=["']og:description["'][^>]*>/gi, '');
    html = html.replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi, '');

    // Strip legacy favicon links from original markup
    html = html.replace(/<link\b[^>]*>/gi, link => {
      const rel = link.match(/\brel\s*=\s*["']([^"']+)["']/i)?.[1].toLowerCase().split(/\s+/) || [];
      if (rel.some(value => ['icon', 'shortcut', 'apple-touch-icon', 'apple-touch-icon-precomposed'].includes(value))) return '';
      return link;
    });

    const escapedTitle = escapeHtml(seo.title);
    const escapedDesc = escapeHtml(seo.description);
    const seoTags = [
      `<title>${escapedTitle}</title>`,
      `<meta name="description" content="${escapedDesc}">`,
      `<link rel="canonical" href="${seo.canonical}">`,
      `<meta property="og:title" content="${escapedTitle}">`,
      `<meta property="og:description" content="${escapedDesc}">`,
    ].join('\n');

    if (!/<\/head>/i.test(html)) throw new Error('Cannot add site metadata: document head is missing');
    return html.replace(/<\/head>/i, `${seoTags}\n${faviconLinks}</head>`);
  }

  let hasCanonical = false;
  html = html.replace(/<link\b[^>]*>/gi, link => {
    const rel = link.match(/\brel\s*=\s*["']([^"']+)["']/i)?.[1].toLowerCase().split(/\s+/) || [];
    if (rel.some(value => ['icon', 'shortcut', 'apple-touch-icon', 'apple-touch-icon-precomposed'].includes(value))) return '';
    if (!rel.includes('canonical')) return link;
    hasCanonical = true;
    if (route === '/') return '<link rel="canonical" href="https://www.kyotocreative.com/">';
    return link.replace(/\bhref\s*=\s*(["'])(.*?)\1/i, (attribute, quote, href) => {
      const canonical = new URL(href, 'https://www.kyotocreative.com');
      if (['kota.co.uk', 'www.kota.co.uk', 'kyotocreative.com', 'www.kyotocreative.com'].includes(canonical.hostname)) {
        canonical.protocol = 'https:';
        canonical.hostname = 'www.kyotocreative.com';
        canonical.port = '';
      }
      return `href=${quote}${canonical.href}${quote}`;
    });
  });
  if (!/<\/head>/i.test(html)) throw new Error('Cannot add site metadata: document head is missing');
  const canonicalLink = route === '/' && !hasCanonical
    ? '<link rel="canonical" href="https://www.kyotocreative.com/">'
    : '';
  return html.replace(/<\/head>/i, `${canonicalLink}${faviconLinks}</head>`);
}

function adjustJohnRuggieriQuote(content, route) {
  if (route !== '/work/johnruggieri') return content;

  const htmlQuote = '<p class="Quote_quoteText__isGTS">';
  const flightQuote = '"className":"Quote_quoteText__isGTS","children":';
  if (content.includes(htmlQuote)) {
    return content.replace(
      htmlQuote,
      '<p class="Quote_quoteText__isGTS" style="font-size:clamp(1.25rem, 2.2vw, 2rem);line-height:1.35">',
    );
  }
  if (content.includes(flightQuote)) {
    return content.replace(
      flightQuote,
      '"className":"Quote_quoteText__isGTS","style":{"fontSize":"clamp(1.25rem, 2.2vw, 2rem)","lineHeight":1.35},"children":',
    );
  }
  throw new Error('John Ruggieri quote markup was not found');
}

export async function documentResponse(request, route) {
  const routes = await readIndex('routes.json');
  route = route.replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '') || '/';
  if (retiredServiceRoutes.has(route)) return new Response('Page not found.', { status: 404 });
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
        text = reserveLazyImageDimensionsInFlight(localizeFlight(text, route));
        return adjustJohnRuggieriQuote(text, route);
      });
      return new Response(flight, { headers: { 'Content-Type': 'text/x-component', 'Cache-Control': 'no-cache', Vary: 'RSC, Next-Router-State-Tree, Next-Router-Prefetch' } });
    } catch { /* Next's client falls back to document navigation if uncaptured. */ }
  }
  let html = await memoize(cacheable && route + ':' + file, async () => {
  const { version } = await readIndex('static-assets.json');
  let html = await readPage(file, temporary);
  html = localizeDocument(html, route);
  html = adjustJohnRuggieriQuote(html, route);
  html = configureDocumentMetadata(html, route);
  html = html.replace(/((?:src|href)="\/_next\/static\/[^"?]+\.(?:js|css))"/g, '$1?replica=' + version + '"');
  const lazyLogoSelectors = [...lazyImageDimensions.keys()]
    .filter(imagePath => imagePath !== '/seven-gate-before-after.png')
    .map(imagePath => `img[src$="${imagePath}"],img[data-src$="${imagePath}"]`)
    .join(',');
  const lazyImageLayoutStyle = `<style>${lazyLogoSelectors}{object-fit:contain!important}</style>`;
  // Fresh principal pages use untouched source markup. Older mirrored documents
  // have rewritten relative URLs; a base restores their original directory.
  const base = route === '/' ? '/' : route.slice(0, route.lastIndexOf('/') + 1);
  const partnersStyle = route === '/' ? '<style>.Partners_partners__jBo8y{display:none!important}</style>' : '';
  const homepageFooterStyle = route === '/'
    ? '<style>' +
      '.Footer_footer__pQtti, .Footer_footer__pQtti a:not(.CopyText_tooltip__HuxWa), .Footer_footer__pQtti p, .Footer_footer__pQtti span, .Footer_footer__pQtti li { color: #000 !important; }' +
      '.Footer_email__nLajh { color: #000 !important; -webkit-text-fill-color: #000 !important; background: none !important; animation: none !important; background-clip: border-box !important; -webkit-background-clip: border-box !important; }' +
      '.Footer_email__nLajh:hover { color: #222 !important; -webkit-text-fill-color: #222 !important; }' +
      '.Footer_socialLinks__tA7gt a { color: #000 !important; }' +
      '.Footer_socialLinks__tA7gt svg path { fill: #000 !important; }' +
      '.Footer_lastNav__at6Kh a { color: #000 !important; }' +
      '.Footer_lastNav__at6Kh svg path { fill: #000 !important; }' +
      '.Footer_newsletterButton__wp2hz { color: #000 !important; border-color: #000 !important; }' +
      '.Footer_newsletterButton__wp2hz:hover { background-color: rgba(0,0,0,0.06) !important; color: #000 !important; border-color: #000 !important; }' +
      '.Footer_sectorTitle__yEZhb { color: #000 !important; }' +
      '.Footer_sectorItem__0Cx14 { color: #000 !important; border-color: rgba(0,0,0,0.3) !important; }' +
      '.Footer_sectorItem__0Cx14:hover { border-color: #000 !important; background-color: rgba(0,0,0,0.05) !important; }' +
      '.Footer_copyright__j4atB, .Footer_copyrightText__f_Lte { color: #000 !important; }' +
      '.Footer_top__YBhK_ { border-top-color: rgba(0,0,0,0.2) !important; }' +
      '.CopyText_tooltip__HuxWa, .Footer_footer__pQtti .CopyText_tooltip__HuxWa, .Footer_footer__pQtti a .CopyText_tooltip__HuxWa { background-color: #000 !important; color: #fff !important; -webkit-text-fill-color: #fff !important; }' +
      '.CopyText_tooltip__HuxWa:after, .Footer_footer__pQtti .CopyText_tooltip__HuxWa:after { border-bottom-color: #000 !important; }' +
      'body section.FaqsList_faqsList__3yyiS { padding-bottom: 2rem !important; }' +
      'body footer.Footer_footer__pQtti { padding-top: 0 !important; }' +
      'body footer.Footer_footer__pQtti .Footer_top__YBhK_ { gap: 0.5rem !important; padding-top: 0 !important; }' +
      'body footer.Footer_footer__pQtti svg.Footer_logo__fUEOF { height: clamp(8rem, 13vw, 12rem) !important; max-width: 600px !important; width: auto !important; aspect-ratio: 666 / 375 !important; display: block !important; margin-left: -4rem !important; margin-top: -1.5rem !important; margin-bottom: -1rem !important; }' +
      '@media (max-width: 768px) {' +
      '  header.Header_header__KwdYD .header-logo-desktop { display: none !important; }' +
      '  header.Header_header__KwdYD .header-logo-mobile { display: block !important; width: auto !important; height: 38px !important; max-height: 42px !important; }' +
      '  header.Header_header__KwdYD .Header_logo____uDV { width: auto !important; height: auto !important; display: inline-flex !important; align-items: center !important; background: transparent !important; }' +
      '}' +
      '@media (min-width: 769px) {' +
      '  header.Header_header__KwdYD .header-logo-mobile { display: none !important; }' +
      '  header.Header_header__KwdYD .header-logo-desktop { display: block !important; }' +
      '}' +
      '</style>'
    : '';
  const serviceHeroLabelStyle = (route.startsWith('/service/') || (Boolean(pageSEOMap.get(route)) && route !== '/' && route !== '/work' && route !== '/contact'))
    ? '<style>.Hero_hero__18Xqo h1{opacity:0!important}</style>'
    : '';
  const cRoute = getCanonicalServiceRoute(route);
  const processStyle = cRoute === '/service/growth-marketing' || cRoute === '/service/web-app'
    ? '<style>.growth-marketing-process-timeline [class^="Timeline_workInvolved__"],.growth-marketing-process-timeline [class*=" Timeline_workInvolved__"],.growth-marketing-process-timeline [class^="Timeline_duration__"],.growth-marketing-process-timeline [class*=" Timeline_duration__"],.growth-marketing-process-timeline [class^="Timeline_bottomTimeline__"],.growth-marketing-process-timeline [class*=" Timeline_bottomTimeline__"],.web-design-process-timeline [class^="Timeline_workInvolved__"],.web-design-process-timeline [class*=" Timeline_workInvolved__"],.web-design-process-timeline [class^="Timeline_duration__"],.web-design-process-timeline [class*=" Timeline_duration__"],.web-design-process-timeline [class^="Timeline_bottomTimeline__"],.web-design-process-timeline [class*=" Timeline_bottomTimeline__"]{display:none!important}</style>'
    : '';
  const contactEmailStyle = (route === '/contact' || route === '/contact/')
    ? '<style>' +
      '.ContactDetails_contactDetails__KiaCK .ContactDetails_right__D3SFA>div:first-child>.ContactDetails_email__X5toE:nth-child(-n+2) .CopyText_copyText__OtWNq{font-size:.8em}' +
      /* Premium styling for contact Thanks / Success state */
      '.Form_successMessage__nGL57, .Form_successMessage__s5YQz {' +
      '  position: relative !important;' +
      '  background: linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 249, 252, 0.92) 100%) !important;' +
      '  border: 1px solid rgba(0, 0, 0, 0.08) !important;' +
      '  border-radius: 28px !important;' +
      '  padding: clamp(2.5rem, 5vw, 4.5rem) clamp(2rem, 4vw, 4rem) !important;' +
      '  box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.8) inset !important;' +
      '  backdrop-filter: blur(20px) !important;' +
      '  -webkit-backdrop-filter: blur(20px) !important;' +
      '  width: 100% !important;' +
      '  max-width: 1100px !important;' +
      '  grid-column: span 12 !important;' +
      '  margin: 2rem auto 5rem auto !important;' +
      '  text-align: left !important;' +
      '  animation: kyotoThanksFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;' +
      '}' +
      '.Form_successTitle__gqNPY, .Form_successTitle__i_e7P {' +
      '  font-size: clamp(2.5rem, 5vw, 4.25rem) !important;' +
      '  font-weight: 400 !important;' +
      '  line-height: 1.06 !important;' +
      '  letter-spacing: -0.03em !important;' +
      '  color: #050505 !important;' +
      '  margin: 0 0 1.25rem 0 !important;' +
      '  max-width: 32ch !important;' +
      '}' +
      '.Form_successText__oDeUM, .Form_successText__j47jL {' +
      '  font-size: clamp(1.1rem, 1.4vw, 1.3rem) !important;' +
      '  line-height: 1.55 !important;' +
      '  color: #555 !important;' +
      '  max-width: 75ch !important;' +
      '  margin: 0 0 2.5rem 0 !important;' +
      '}' +
      '.Form_buttonWrap__iVNPZ, .kyoto-success-actions {' +
      '  text-align: left !important;' +
      '  margin-top: 2rem !important;' +
      '  display: flex !important;' +
      '  flex-wrap: wrap !important;' +
      '  gap: 1rem !important;' +
      '  align-items: center !important;' +
      '}' +
      '.Form_buttonWrap__iVNPZ a, .kyoto-success-btn-primary {' +
      '  display: inline-flex !important;' +
      '  align-items: center !important;' +
      '  gap: 10px !important;' +
      '  padding: 0.95rem 2.2rem !important;' +
      '  border-radius: 9999px !important;' +
      '  background: #000 !important;' +
      '  color: #fff !important;' +
      '  text-decoration: none !important;' +
      '  font-weight: 500 !important;' +
      '  font-size: 0.95rem !important;' +
      '  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3) !important;' +
      '  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease !important;' +
      '}' +
      '.Form_buttonWrap__iVNPZ a:hover, .kyoto-success-btn-primary:hover {' +
      '  transform: translateY(-2px) !important;' +
      '  box-shadow: 0 14px 30px -5px rgba(0, 0, 0, 0.4) !important;' +
      '}' +
      '@keyframes kyotoThanksFadeUp {' +
      '  0% { opacity: 0; transform: translateY(24px) scale(0.98); }' +
      '  100% { opacity: 1; transform: translateY(0) scale(1); }' +
      '}' +
      '</style>'
    : ''
  const agencyEmailStyle = (route === '/agency' || route === '/our-agency')
    ? '<style>.LargeCta_subHeading__Cs6d8 a{font-size:clamp(1.25rem,3vw,2.5rem)!important}</style>'
    : '';
  const brandStrategyResultsStyle = cRoute === '/service/marketing'
    ? '<style>.Statistics_statistics__GKCxB{display:none!important}</style>'
    : '';
  const brandStrategyTestimonialsStyle = cRoute === '/service/marketing'
    ? '<style>.Testimonials_testimonials__J0bdm{display:none!important}</style>'
    : '';
  const toneHeadlineStyle = toneOfVoiceHeadlineStyle(cRoute);
  const brandIdentityHeadlineStyle = cRoute === '/service/content-campaigns-pr'
    ? '<style>.Hero_hero__18Xqo h2{font-size:clamp(2.25rem,6.4vw,6.75rem)!important}.Hero_hero__18Xqo .Hero_introText__HLM02{font-size:clamp(1.125rem,1.35vw,1.35rem)!important}@media (min-width:769px){.Hero_hero__18Xqo .Hero_introText__HLM02{max-width:40ch!important;grid-column:5/span 8!important}}</style>'
    : '';
  const creativeWebDesignHeadlineStyle = cRoute === '/service/website-design-development'
    ? '<style>.Hero_hero__18Xqo h2{font-size:clamp(2.25rem,5vw,4.5rem)!important}</style>'
    : '';
  const webDevelopmentHeadlineStyle = cRoute === '/service/product-design-ux'
    ? '<style>.Hero_hero__18Xqo h2{font-size:clamp(2.25rem,5vw,4.5rem)!important;width:44%!important}</style>'
    : '';
  const wordPressCmsHeadlineStyle = cRoute === '/service/app-design-development'
    ? '<style>@media (min-width:769px){.Hero_hero__18Xqo h2{font-size:clamp(2rem,4.5vw,4rem)!important;width:38%!important}}</style>'
    : '';
  const seoGeoHeadlineStyle = cRoute === '/service/autonomous-ai-agents-copilots'
    ? '<style>.Hero_hero__18Xqo h2{font-size:clamp(2.15rem,4.4vw,4.4rem)!important}</style>'
    : '';
  const copywritingHeadlineStyle = cRoute === '/service/workflow-orchestration-api-integration'
    ? '<style>.Hero_hero__18Xqo h2{font-size:clamp(1.95rem,3.85vw,3.85rem)!important}@media (min-width:769px){.Hero_hero__18Xqo .Hero_introText__HLM02{grid-column:6/span 7!important;max-width:427px!important}}</style>'
    : '';
  const sitecareHeadlineStyle = cRoute === '/service/intelligent-document-data-processing'
    ? '<style>.Hero_hero__18Xqo h2{font-size:clamp(2.5rem,6.6vw,6rem)!important}</style>'
    : '';
    const leadcourtQuoteStyle = (route === '/work/leadcourt' || route === '/work/interactfinancial.ca' || route === '/work/interactfinancial.ca/' || route === '/work/green-square-infra' || route === '/work/green-square-infra/' || route === '/work/seven-gate-holdings' || route === '/work/seven-gate-holdings/')
    ? '<style>' +
      '.Quote_quote__8BTRS .Quote_quoteText__isGTS { font-size: clamp(1.25rem, 2.2vw, 2.1rem) !important; line-height: 1.35 !important; max-width: 58ch !important; margin: 0 auto !important; }' +
      '.Quote_quote__8BTRS .Quote_attributionName__ABzkp { font-size: clamp(1rem, 1.4vw, 1.25rem) !important; }' +
      '.Quote_quote__8BTRS .Quote_attributionByline__d9bMk { font-size: clamp(0.9rem, 1.2vw, 1.1rem) !important; }' +
      '.Quote_quote__8BTRS svg { width: clamp(1.5rem, 2.5vw, 2rem) !important; margin-bottom: 1rem !important; }' +
      '</style>'
    : '';
  html = html.replace('<head>', '<head>' + partnersStyle + homepageFooterStyle + serviceHeroLabelStyle + processStyle + contactEmailStyle + agencyEmailStyle + brandStrategyResultsStyle + brandStrategyTestimonialsStyle + toneHeadlineStyle + brandIdentityHeadlineStyle + creativeWebDesignHeadlineStyle + webDevelopmentHeadlineStyle + wordPressCmsHeadlineStyle + seoGeoHeadlineStyle + copywritingHeadlineStyle + sitecareHeadlineStyle + leadcourtQuoteStyle + lazyImageLayoutStyle + '<base href="' + base + '">' + boot);
  html = html.replace(/<script[^>]*src="https:\/\/(?:www\.)?(?:googletagmanager\.com|vercel\.live)[^>]*><\/script>/g, '');
  return html;
  });
  if (route === '/') {
    html = html
      .replaceAll('/images/kyoto-creative-footer-white.png', '/images/kyoto-creative-home-footer.png')
      .replaceAll('viewBox="0 0 618 237" ><image href="/images/kyoto-creative-home-footer.png" width="618" height="237"', 'viewBox="0 0 666 375"><image href="/images/kyoto-creative-home-footer.png" width="666" height="375"')
      .replaceAll('viewBox\\":\\"0 0 618 237\\",\\"children\\":[\\"$\",\\"image\\",null,{\\"href\\":\\"/images/kyoto-creative-home-footer.png\\",\\"width\\":618,\\"height\\":237', 'viewBox\\":\\"0 0 666 375\\",\\"children\\":[\\"$\",\\"image\\",null,{\\"href\\":\\"/images/kyoto-creative-home-footer.png\\",\\"width\\":666,\\"height\\":375');

    // Homepage header: responsive logo (desktop keeps original, mobile uses green-arrow logo)
    const desktopHeaderSvg = '<svg class="header-logo-desktop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 618 237"><image href="/images/kyoto-creative-logo.png" width="618" height="237" preserveAspectRatio="xMidYMid meet"></image></svg>';
    const mobileHeaderSvg = '<svg class="header-logo-mobile" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 610 229"><image href="/images/kyoto-creative-mobile-header.png" width="610" height="229" preserveAspectRatio="xMidYMid meet"></image></svg>';
    const standardHeaderAnchor = '<a class="Header_logo____uDV" href="/"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 618 237"><image href="/images/kyoto-creative-logo.png" width="618" height="237" preserveAspectRatio="xMidYMid meet"></image></svg></a>';
    const responsiveHeaderAnchor = `<a class="Header_logo____uDV" href="/">${desktopHeaderSvg}${mobileHeaderSvg}</a>`;

    html = html.replace(standardHeaderAnchor, responsiveHeaderAnchor);

    // Sync serialized Flight data in HTML to avoid hydration mismatch
    const desktopFlightSvg = '[\\"$\\",\\"svg\\",null,{\\"className\\":\\"header-logo-desktop\\",\\"xmlns\\":\\"http://www.w3.org/2000/svg\\",\\"viewBox\\":\\"0 0 618 237\\",\\"children\\":[\\"$\\",\\"image\\",null,{\\"href\\":\\"/images/kyoto-creative-logo.png\\",\\"width\\":618,\\"height\\":237,\\"preserveAspectRatio\\":\\"xMidYMid meet\\"}]}]';
    const mobileFlightSvg = '[\\"$\\",\\"svg\\",null,{\\"className\\":\\"header-logo-mobile\\",\\"xmlns\\":\\"http://www.w3.org/2000/svg\\",\\"viewBox\\":\\"0 0 610 229\\",\\"children\\":[\\"$\\",\\"image\\",null,{\\"href\\":\\"/images/kyoto-creative-mobile-header.png\\",\\"width\\":610,\\"height\\":229,\\"preserveAspectRatio\\":\\"xMidYMid meet\\"}]}]';
    const targetFlight = '\\"className\\":\\"Header_logo____uDV\\",\\"href\\":\\"/\\",\\"children\\":[\\"$\\",\\"svg\\",null,{\\"xmlns\\":\\"http://www.w3.org/2000/svg\\",\\"viewBox\\":\\"0 0 618 237\\",\\"children\\":[\\"$\\",\\"image\\",null,{\\"href\\":\\"/images/kyoto-creative-logo.png\\",\\"width\\":618,\\"height\\":237,\\"preserveAspectRatio\\":\\"xMidYMid meet\\"}]}]';
    const replacementFlight = `\\"className\\":\\"Header_logo____uDV\\",\\"href\\":\\"/\\",\\"children\\":[${desktopFlightSvg},${mobileFlightSvg}]`;

    html = html.replace(targetFlight, replacementFlight);
  }
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
