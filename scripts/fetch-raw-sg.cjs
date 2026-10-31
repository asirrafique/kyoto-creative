const http = require('http');

http.get('http://127.0.0.1:3000/work/seven-gate-holdings', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Response length:', body.length);
    console.log('Includes Results 30 days?', body.includes('Results 30 days post-launch'));
    console.log('Includes More Than a Website?', body.includes('More Than a Website'));
    console.log('Includes Gunajit Dutta?', body.includes('Gunajit Dutta'));
    console.log('Includes Five strategic pillars?', body.includes('Five strategic pillars'));
  });
});
