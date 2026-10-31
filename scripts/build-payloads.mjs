import fs from 'fs';
import { localize } from '../src/lib/localize.mjs';

// 1. Read the extracted HTML sections
const htmlSection = fs.readFileSync('scripts/target_html.txt', 'utf8');

// 2. Read the raw UPP HTML flight section
let htmlFlightSection = fs.readFileSync('scripts/target_html_flight_section.txt', 'utf8');
// Localize it so Green Square text is present
htmlFlightSection = localize(htmlFlightSection);
// Map $L2a -> $L2b (component 2941) and $L2c -> $L2f (component 32743)
htmlFlightSection = htmlFlightSection.replaceAll('"$L2a"', '"$L2b"').replaceAll('"$L2c"', '"$L2f"');

// 3. Read the raw UPP RSC flight section
let rscFlightSection = fs.readFileSync('scripts/target_rsc_clean.txt', 'utf8');
// Localize it so Green Square text is present
rscFlightSection = localize(rscFlightSection);
// Map $L1c -> $L1d (component 2941) and $L1e -> $L21 (component 32743)
rscFlightSection = rscFlightSection.replaceAll('"$L1c"', '"$L1d"').replaceAll('"$L1e"', '"$L21"');

console.log('htmlSection length:', htmlSection.length);
console.log('htmlFlightSection length:', htmlFlightSection.length);
console.log('rscFlightSection length:', rscFlightSection.length);

fs.writeFileSync('scripts/final_html_section.txt', htmlSection, 'utf8');
fs.writeFileSync('scripts/final_html_flight_section.txt', htmlFlightSection, 'utf8');
fs.writeFileSync('scripts/final_rsc_flight_section.txt', rscFlightSection, 'utf8');
