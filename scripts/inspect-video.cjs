const { chromium } = require('playwright');
const sharp = require('sharp');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--allow-file-access-from-files']});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 await page.goto('file:///C:/Users/paagu/AppData/Local/Packages/Microsoft.ScreenSketch_8wekyb3d8bbwe/TempState/Recordings/20261020-1715-31.0113439.mp4');
 const video=page.locator('video');await video.waitFor();
 await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
 const meta=await video.evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight}));console.log(meta);
 const frames=[];
 for(let i=0;i<15;i++){
 const time=(meta.duration-1)*i/14;
 await video.evaluate((v,t)=>new Promise(r=>{v.pause();v.onseeked=()=>r();v.currentTime=t||0.01;}),time);
 const data=await video.evaluate(v=>{const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);return c.toDataURL('image/jpeg').split(',')[1]});
 const buf=await sharp(Buffer.from(data,'base64')).resize(480,270,{fit:'contain'}).jpeg().toBuffer();
 frames.push({input:buf,left:(i%3)*480,top:Math.floor(i/3)*270});
 }
 await sharp({create:{width:1440,height:1350,channels:3,background:'#222'}}).composite(frames).jpeg().toFile('reports/recording-contact-sheet.jpg');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
