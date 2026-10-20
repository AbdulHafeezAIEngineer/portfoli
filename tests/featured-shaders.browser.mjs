import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const base=process.env.PUBLIC_TEST_URL || 'http://127.0.0.1:3018';
if(!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base))throw Error('Use the local app');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
const routes=[['websites','accretion'],['testimonials','tunnel']];
const results=[];
const sample=p=>p.locator('.featured-page-shader canvas').evaluate(c=>c.toDataURL());
async function ready(p,state='running'){await p.waitForFunction(state=>document.querySelector('.featured-page-shader')?.dataset.state===state,state);}
try{
 for(const [route,effect] of routes){
  const context=await browser.newContext({viewport:{width:1440,height:950}});
  await context.addInitScript(()=>{localStorage.setItem('portfolio-theme','dark');localStorage.setItem('elvora-motion','full');});
  const p=await context.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+'/'+route,{waitUntil:'domcontentloaded'});
  await p.getByRole('button',{name:'Reject All',exact:true}).click();
  await ready(p);
  assert.equal(await p.locator('.featured-page-shader').getAttribute('data-effect'),effect);
  const a=await sample(p);await p.waitForTimeout(250);assert.notEqual(await sample(p),a,'Actual pixels animate');
  assert.ok(await p.locator('.featured-page-shader canvas').evaluate(c=>c.width<=960&&c.height<=720));
  await p.getByLabel('Animation preference',{exact:true}).selectOption('reduced');await ready(p,'still');
  const still=await sample(p);await p.waitForTimeout(250);assert.equal(await sample(p),still,'Motion Off freezes pixels');
  await p.getByLabel('Animation preference',{exact:true}).selectOption('full');await ready(p);
  if(route==='testimonials'){
   await p.getByRole('button',{name:'Pause testimonial animations',exact:true}).click();await ready(p,'still');
   const paused=await sample(p);await p.waitForTimeout(250);assert.equal(await sample(p),paused,'Testimonials Pause freezes the tunnel');
   await p.getByRole('button',{name:'Resume testimonial animations',exact:true}).click();await ready(p);
  }
  await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
  await ready(p,'still');
  const hidden=await sample(p);await p.waitForTimeout(250);assert.equal(await sample(p),hidden,'Hidden tab stops rendering');
  await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'));});await ready(p);
  // Leaving the entire main region for the footer stops the fixed decoration.
  await p.locator('footer').scrollIntoViewIfNeeded();
  await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await ready(p,'still');
  await p.evaluate(()=>window.scrollTo(0,0));await ready(p);
  await p.locator('.featured-page-shader canvas').evaluate(c=>{c.__restore=c.getContext('webgl').getExtension('WEBGL_lose_context');c.__restore.loseContext();});
  await ready(p,'fallback');
  const poster=await p.request.get(base+'/shaders/'+effect+'.webp');assert.equal(poster.status(),200);
  assert.ok(await p.getByRole('heading',{level:1}).isVisible(),'Context loss leaves real content intact');
  await p.locator('.featured-page-shader canvas').evaluate(c=>c.__restore.restoreContext());await ready(p);
  const restored=await sample(p);await p.waitForTimeout(250);assert.notEqual(await sample(p),restored,'Restored context animates again');
  assert.deepEqual(errors,[]);
  results.push({route,effect,movingPixels:true,motionOff:true,pause:route==='testimonials',offscreenStop:true,hiddenTabStop:true,contextFallback:true,contextRestored:true});
  await context.close();
 }
 for(const width of [390,1440])for(const theme of ['light','dark']){
  const c=await browser.newContext({viewport:{width,height:844},deviceScaleFactor:width===390?3:1,isMobile:width===390,hasTouch:width===390});
  await c.addInitScript(theme=>{localStorage.setItem('portfolio-theme',theme);localStorage.setItem('elvora-motion','reduced');},theme);
  const p=await c.newPage();
  for(const [route] of routes){
   await p.goto(base+'/'+route,{waitUntil:'domcontentloaded'});await ready(p,'still');
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal overflow');
   assert.ok(await p.locator('.featured-page-shader canvas').evaluate(c=>c.width<=960&&c.height<=720),'DPR buffer bounded');
  }
  await c.close();
 }
 // Unsupported WebGL uses the real poster, without blocking page interaction.
 const c=await browser.newContext({viewport:{width:390,height:844}});
 await c.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl'?null:get.call(this,type,...args);};});
 const p=await c.newPage();
 for(const [route] of routes){await p.goto(base+'/'+route,{waitUntil:'domcontentloaded'});assert.equal(await p.locator('.featured-page-shader').getAttribute('data-state'),'fallback');assert.ok(await p.getByRole('heading',{level:1}).isVisible());}
 await p.goto(base+'/ai-bots',{waitUntil:'domcontentloaded'});
 assert.ok(await p.locator('nav').getByRole('link',{name:'AI Agents',exact:true}).count()>0);
 assert.equal(await p.getByText('AI Bots',{exact:true}).count(),0);
 await p.goto(base+'/skills',{waitUntil:'domcontentloaded'});
 assert.equal(await p.locator('main').getByText(/Claude|ChatGPT|Copilot|Gemini/).count(),0,'AI tool promotion removed');
 await c.close();
 fs.mkdirSync('docs/featured-shaders',{recursive:true});
 fs.writeFileSync('docs/featured-shaders/checks.json',JSON.stringify({effects:results,responsiveLayouts:8,noWebGL:true,agentRename:true,toolPromotionRemoved:true},null,2));
 console.log('PASS moving WebGL pixels for both effects; Motion Off, testimonial Pause, footer stop/resume, context-loss fallback; 8 mobile/desktop/theme layouts; AI Agents labels and no AI-tool promotions.');
}finally{await browser.close();}
