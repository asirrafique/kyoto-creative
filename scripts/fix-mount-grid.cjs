const fs = require('fs');

let chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', 'utf8');

const targetOld = `const mountDiv = document.createElement('div');
      mountDiv.className = 'work-react-archive-mount';
      container.innerHTML = '';
      container.appendChild(mountDiv);`;

const targetNew = `const mountDiv = document.createElement('div');
      mountDiv.className = 'work-react-archive-mount';
      mountDiv.style.gridColumn = 'span 12';
      mountDiv.style.width = '100%';
      container.innerHTML = '';
      container.appendChild(mountDiv);`;

chunk = chunk.replace(targetOld, targetNew);

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', chunk, 'utf8');
console.log('Fixed mountDiv width and gridColumn!');
