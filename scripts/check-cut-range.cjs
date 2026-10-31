const fs = require('fs');
const html = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');

const stratIdx = html.indexOf('The Strategy');
const resultsIdx = html.indexOf('Results 30 days post-launch');

// The Strategy section ends with </section>
const stratSecEnd = html.indexOf('</section>', stratIdx) + 10;
// Results section starts with <section class="Results_results__xMS5p"
const resultsSecStart = html.lastIndexOf('<section', resultsIdx);

console.log('Strategy section end:', stratSecEnd);
console.log('Results section start:', resultsSecStart);
console.log('Length of content between:', resultsSecStart - stratSecEnd);

console.log('Start of snippet to remove:');
console.log(html.slice(stratSecEnd, stratSecEnd + 200));

console.log('End of snippet to remove:');
console.log(html.slice(resultsSecStart - 200, resultsSecStart));
