const fs = require('fs');
const ref = fs.readFileSync('reference/pages/4eb950636535d637ee743743cfbc75724f464688f94a426d3dedea4097aeb993.html', 'utf8');

const sIdx = ref.indexOf('ContactDetails_follows__KzlYU');
const endIdx = ref.indexOf('</div></div></div></section>', sIdx);
const markup = ref.slice(sIdx - 12, endIdx + 6);
console.log('Original markup:\n', markup);

// Replace awwwards with Instagram, and remove Clutch
let updated = markup
  .replace(/href="https:\/\/www\.awwwards\.com\/kota\/" target="_blank">awwwards<\/a>/, 'href="https://www.instagram.com/kotalondon/" target="_blank">Instagram</a>')
  .replace(/<span class="FadeIn_container__bjQVL" data-fill="false"><a class="ContactDetails_follow__WB_uR" href="https:\/\/clutch\.co\/profile\/kota#highlights" target="_blank">Clutch<\/a><\/span>/, '');

console.log('\nUpdated markup:\n', updated);
