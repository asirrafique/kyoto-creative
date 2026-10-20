const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:900}});const page=await context.newPage();const errors=[],failed=[],external=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push([r.status(),r.url()])});
await context.route('https://**/*',r=>{external.push(r.request().url());return r.abort()});
await page.goto('http://127.0.0.1:3101',{waitUntil:'networkidle'});await page.getByText('Reject',{exact:true}).click().catch(()=>{});
await page.locator('button[class*="PrimaryNavigation_icon"]').click();await page.waitForTimeout(1400);await page.screenshot({path:'reports/production-menu.png'});
checks.push({name:'Menu opens',pass:await page.locator('aside[class*="PrimaryNavigation_flyout"]').evaluate(x=>x.getBoundingClientRect().right>500)});
await page.locator('button[class*="PrimaryNavigation_icon"]').click();await page.waitForTimeout(1000);
await page.locator('div[class*="HeroVideo_video"]').click();await page.waitForTimeout(1500);await page.screenshot({path:'reports/production-video-modal.png'});console.log('VIDEO OPEN',await page.locator('video').evaluateAll(xs=>xs.map(x=>({src:x.currentSrc,visible:x.getBoundingClientRect().width,state:x.readyState}))))
const close=page.locator('[class*="HeroVideo"]').filter({has:page.locator('video')});
checks.push({name:'Hero video opens fullscreen',pass:await page.locator('div[class*="HeroVideo_video"]').evaluate(x=>x.getBoundingClientRect().width>1000)});const closeBox=await page.locator('button[class*="HeroVideo_icon"]').boundingBox();await page.mouse.click(closeBox.x+closeBox.width/2,closeBox.y+closeBox.height/2);await page.waitForTimeout(1200);checks.push({name:'Hero video closes from visual close control',pass:await page.locator('div[class*="HeroVideo_video"]').getAttribute('data-fullscreen').then(x=>x==='false')});
await page.goto('http://127.0.0.1:3101',{waitUntil:'networkidle'});
const cardNav=page.locator('[class*="CarouselSlides_carouselNavigationButton"]').nth(2);await cardNav.scrollIntoViewIfNeeded();await cardNav.click();await page.waitForTimeout(1500);
checks.push({name:'Framework carousel changes slide',pass:await cardNav.getAttribute('class').then(x=>x.includes('active'))});
const resultNext=page.locator('.swiper-panel-next').first();await resultNext.scrollIntoViewIfNeeded();await page.waitForTimeout(1200);const before=await page.locator('[class*="StatisticsCarousel"] .swiper-slide-active').first().innerText().catch(()=>null);await resultNext.click();await page.waitForTimeout(1500);const after=await page.locator('[class*="StatisticsCarousel"] .swiper-slide-active').first().innerText().catch(()=>null);checks.push({name:'Results carousel advances',pass:before!==after,detail:{before,after}});
for(let y=0;y<18000;y+=550){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(100)}
checks.push({name:'Homepage runs with external requests blocked',pass:external.length===0,detail:external});
const video='http://127.0.0.1:3101/__assets/kota-content.b-cdn.net/app/uploads/2025/10/Short-Preview-homepage.mp4';let r=await context.request.get(video,{headers:{Range:'bytes=0-99'}});checks.push({name:'Video byte-range streaming',pass:r.status()===206&&(await r.body()).length===100});
let missing=await context.request.get('http://127.0.0.1:3101/does-not-exist');checks.push({name:'Unknown route returns 404',pass:missing.status()===404});
const report={checks,errors,failed,external};fs.writeFileSync('reports/production-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();if(errors.length||failed.length||checks.some(x=>!x.pass))process.exit(1)
})().catch(e=>{console.error(e);process.exit(1)});
