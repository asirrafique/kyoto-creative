import fs from 'node:fs';
import { localize } from '../src/lib/localize.mjs';

const ref = fs.readFileSync('reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.html', 'utf8');

const origIdx = ref.indexOf('["$",null');
console.log('["$",null in original ref?:', origIdx);

const localized = localize(ref);
const idx = localized.indexOf('["$",null');
console.log('["$",null in localized?:', idx);
if (idx !== -1) {
  console.log('Surroundings:\n', localized.slice(idx - 60, idx + 80));
  console.log('\nCorresponding original slice:\n', ref.slice(idx - 60, idx + 80));
}
