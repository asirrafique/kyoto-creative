const fs = require('fs');

const upp = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');
const uppRsc = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.rsc', 'utf8');

const startStr = '<section class="Results_results__xMS5p"';
const startIdx = upp.indexOf(startStr);
console.log('HTML Start index:', startIdx);

const quoteIdx = upp.indexOf('Gunajit Dutta');
console.log('HTML Gunajit index:', quoteIdx);
if (quoteIdx !== -1) {
  const quoteSectionEnd = upp.indexOf('</section>', quoteIdx);
  const fullHtml = upp.slice(startIdx, quoteSectionEnd + '</section>'.length);
  console.log('Length of target html:', fullHtml.length);
  fs.writeFileSync('scripts/extracted_section.html', fullHtml, 'utf8');
}

// Now let's inspect the RSC stream of UPP around Results / Gunajit
const rscResultsIdx = uppRsc.indexOf('Results 30 days post-launch');
console.log('RSC Results index:', rscResultsIdx);
const rscGunajitIdx = uppRsc.indexOf('Gunajit Dutta');
console.log('RSC Gunajit index:', rscGunajitIdx);

if (rscResultsIdx !== -1 && rscGunajitIdx !== -1) {
  // Let's find the RSC boundaries
  console.log('RSC snippet around results:', uppRsc.slice(rscResultsIdx - 200, rscResultsIdx + 200));
  console.log('RSC snippet around gunajit:', uppRsc.slice(rscGunajitIdx - 200, rscGunajitIdx + 300));
}
