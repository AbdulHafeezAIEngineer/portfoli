import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from '@playwright/test';
const base=process.env.PUBLIC_TEST_URL || 'http://127.0.0.1:3016';
if(!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base)) throw Error('Local production app required');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
const names={veldt:'Veldt Support',northline:'Northline Assistant',solenne:'Solenne Concierge'};
fs.mkdirSync('docs/business-assistants',{recursive:true});
try{
 let layouts=0;
 for(const width of (process.env.SHADER_ONLY ? [] : [360,390,768,1440])){
  for(const theme of ['dark','light']){
   const c=await browser.newContext({viewport:{width,height:950},isMobile:width<768,hasTouch:width<768});
   await c.addInitScript(theme=>{localStorage.setItem('portfolio-theme',theme);localStorage.setItem('elvora-motion','reduced');},theme);
   const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
   await p.goto(base+'/ai-bots');await p.getByRole('button',{name:'Reject All',exact:true}).click();await p.evaluate(()=>document.fonts.ready);
   assert.equal(await p.locator('.page-shader-background').count(),0,'Old full-page shader replaced only on bots');
   assert.equal(await p.locator('.bot-feature').count(),3);assert.equal(await p.locator('.bot-extra').count(),2);
   for(const [id,name]of Object.entries(names)){
    const image=p.locator('.bot-feature-'+id+' .bot-showcase-visual');await image.scrollIntoViewIfNeeded();
    await p.waitForFunction(id=>{const i=document.querySelector('.bot-feature-'+id+' img');return i?.complete&&i.naturalWidth>0;},id);
    assert.ok(await image.locator('.bot-chat-mock').isVisible());
    await image.click();await p.locator('.chat-dialog[open]').waitFor();
    assert.equal(await p.locator('.chat-header h2').innerText(),name);
    assert.ok(await p.getByRole('link',{name:'View demo knowledge',exact:true}).isVisible());
    await p.keyboard.press('Escape');assert.ok(await image.evaluate(e=>e===document.activeElement));
    if(width===390&&theme==='dark'){
     await image.scrollIntoViewIfNeeded();await p.evaluate(()=>window.scrollBy(0,-110));
     await p.screenshot({path:`docs/business-assistants/editorial-${id}-390.png`});
    }
   }
   const details=p.locator('.bot-integration-item').first();await details.locator('summary').click();assert.ok(await details.locator('pre').isVisible());
   assert.ok(await p.locator('#bot-build-title').isVisible());
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1), `Overflow at ${width}px / ${theme}`);
   assert.deepEqual(errors,[]);layouts++;await c.close();
  }
 }
 if(layouts)console.log(`PASS ${layouts} viewport/theme layouts: original images decoded, 3 image-to-chat links, capability copy, preserved extra bots/process/integrations, no overflow or JS errors.`);
 // Actual GPU output, not a CSS/background approximation.
 const c=await browser.newContext({viewport:{width:1440,height:950}});const p=await c.newPage();
 await p.goto(base+'/ai-bots');await p.getByRole('button',{name:'Reject All',exact:true}).click();
 await p.waitForFunction(()=>document.querySelector('.bot-prism')?.dataset.state==='running');
 const sample=()=>p.locator('.bot-prism-canvas').evaluate(c=>c.toDataURL());
 const a=await sample();await p.waitForTimeout(350);const b=await sample();assert.notEqual(a,b,'Fragment output animates');
 const bounds=await p.locator('.bot-prism-canvas').evaluate(c=>[c.width,c.height]);assert.ok(bounds[0]<=1100&&bounds[1]<=800);
 await p.getByLabel('Animation preference',{exact:true}).selectOption('reduced');await p.waitForFunction(()=>document.querySelector('.bot-prism')?.dataset.state==='still');
 const still=await sample();await p.waitForTimeout(250);assert.equal(await sample(),still,'Motion Off stops animation');
 await p.getByLabel('Animation preference',{exact:true}).selectOption('full');await p.waitForFunction(()=>document.querySelector('.bot-prism')?.dataset.state==='running');
 await p.evaluate(()=>window.scrollTo(0,3000));await p.waitForFunction(()=>document.querySelector('.bot-prism')?.dataset.state==='still');
 await p.evaluate(()=>window.scrollTo(0,0));await p.waitForFunction(()=>document.querySelector('.bot-prism')?.dataset.state==='running');
 await p.screenshot({path:'docs/business-assistants/editorial-hero-1440.png'});
 await p.locator('.bot-prism-canvas').evaluate(c=>c.getContext('webgl').getExtension('WEBGL_lose_context').loseContext());await p.waitForFunction(()=>document.querySelector('.bot-prism')?.dataset.state==='fallback');
 assert.ok(await p.locator('#bots-title').isVisible());await c.close();
 console.log('PASS actual WebGL animation, bounded render buffer, Motion Off/On, offscreen stop/resume and context-loss fallback.');
 // Verify the same actual fragment output moves on a high-DPR touch viewport.
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3});const m=await mobile.newPage();
 await m.goto(base+'/ai-bots');await m.getByRole('button',{name:'Reject All',exact:true}).click();await m.waitForFunction(()=>document.querySelector('.bot-prism')?.dataset.state==='running');
 const first=await m.locator('.bot-prism-canvas').evaluate(c=>c.toDataURL());await m.waitForTimeout(350);assert.notEqual(await m.locator('.bot-prism-canvas').evaluate(c=>c.toDataURL()),first);
 assert.ok(await m.locator('.bot-prism-canvas').evaluate(c=>c.width<=1100&&c.height<=800));await m.getByLabel('Animation preference',{exact:true}).selectOption('reduced');await m.waitForFunction(()=>document.querySelector('.bot-prism')?.dataset.state==='still');await mobile.close();
 console.log('PASS actual moving shader and Motion Off on a DPR-3 touch viewport.');
 // No WebGL still has an artwork fallback and usable content.
 const f=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await f.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type==='webgl')return null;return get.call(this,type,...args);};});
 const q=await f.newPage();await q.goto(base+'/ai-bots');assert.equal(await q.locator('.bot-prism').getAttribute('data-state'),'fallback');assert.ok(await q.getByRole('link',{name:'Meet the assistants',exact:true}).isVisible());
 await q.goto(base+'/');assert.equal(await q.locator('.bot-prism,.bot-experience').count(),0,'Home unchanged');await f.close();
 console.log('PASS mobile no-WebGL fallback and no bot effects on home.');
}finally{await browser.close();}
