import fs from 'node:fs';

const rsc = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.rsc', 'utf8');

const line2Start = 24939;
const line2End = 54421;
const line2 = rsc.substring(line2Start, line2End);

const pCutStart = 9425;
const p24 = 29471;

const cutSegment = line2.substring(pCutStart, p24);
console.log('cutSegment length:', cutSegment.length);
console.log('cutSegment starts with:', JSON.stringify(cutSegment.substring(0, 40)));
console.log('cutSegment ends with:', JSON.stringify(cutSegment.substring(cutSegment.length - 40)));
