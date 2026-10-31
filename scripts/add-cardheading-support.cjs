const fs = require('fs');

let chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', 'utf8');

const targetOld = `dangerouslySetInnerHTML:{__html:(null==j?void 0:null===(c=j.singleProject)||void 0===c?void 0:null===(i=c.hero)||void 0===i?void 0:i.heading)||(null==j?void 0:j.title)||""}}`;

const targetNew = `dangerouslySetInnerHTML:{__html:(null==j?void 0:j.cardHeading)||(null==j?void 0:null===(c=j.singleProject)||void 0===c?void 0:null===(i=c.hero)||void 0===i?void 0:i.heading)||(null==j?void 0:j.title)||""}}`;

chunk = chunk.replace(targetOld, targetNew);

// And in auto-mount:
chunk = chunk.replace(
  `title: '88Pilot',\n              slug: '88pilot'`,
  `title: '88Pilot',\n              cardHeading: 'Building an AI-Powered HR Compliance Platform',\n              slug: '88pilot'`
).replace(
  `title: 'Green Square Infra',\n              slug: 'green-square-infra'`,
  `title: 'Green Square Infra',\n              cardHeading: 'A cinematic web experience and high-performance digital presence',\n              slug: 'green-square-infra'`
).replace(
  `title: 'Seven Gate Holdings',\n              slug: 'seven-gate-holdings'`,
  `title: 'Seven Gate Holdings',\n              cardHeading: 'How Seven Gate Holdings found brand clarity through a new strategy with Kyoto Creative',\n              slug: 'seven-gate-holdings'`
);

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', chunk, 'utf8');
console.log('Successfully added cardHeading support!');
