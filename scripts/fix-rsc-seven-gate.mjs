import fs from 'fs';

const rscFile = 'reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.rsc';
let rsc = fs.readFileSync(rscFile, 'utf8');

const idx = rsc.indexOf('/seven-gate-before-after.png');
console.log('idx:', idx);
if (idx !== -1) {
  const start = rsc.lastIndexOf('["$","section",null,{"className":"SingleImage_singleImage__NY3zv"', idx);
  const end = rsc.indexOf('false]}]}],', idx) + 'false]}]}],'.length;
  console.log('start:', start, 'end:', end);
  if (start !== -1 && end !== -1) {
    console.log('Slice to remove:', rsc.slice(start, start + 80), '...', rsc.slice(end - 40, end));
    rsc = rsc.slice(0, start) + rsc.slice(end);
    fs.writeFileSync(rscFile, rsc, 'utf8');
    console.log('Successfully removed SingleImage from RSC!');
  }
}
