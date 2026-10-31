import fs from 'fs';
import { localize } from '../src/lib/localize.mjs';

const uppRsc = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.rsc', 'utf8');
const processedRsc = localize(uppRsc);

const idx1 = processedRsc.indexOf('Results 30 days post-launch');
const idx2 = processedRsc.indexOf('Founder - Green Square Infra');
console.log('RSC idx1:', idx1, 'idx2:', idx2);

if (idx1 !== -1 && idx2 !== -1) {
  const start = processedRsc.lastIndexOf('["$","section"', idx1);
  const end = processedRsc.indexOf(']', idx2 + 100);
  console.log('Start index:', start, 'End index:', end);
  const snippet = processedRsc.slice(start, end + 1);
  fs.writeFileSync('scripts/target_rsc.txt', snippet, 'utf8');
  console.log('Saved snippet length:', snippet.length);
}
