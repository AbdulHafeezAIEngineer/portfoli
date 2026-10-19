import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
const base='http://127.0.0.1:3016';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const routes=['/','/websites','/ai-bots','/bunch-of-work','/about','/journey','/skills','/certificates','/testimonials','/services','/contact','/services/chat','/work/kovo','/technical-domains','/ai-bots/how-i-embed-bots'];
const failures=[];let cases=0;
fs.mkdirSync('docs/brand-audit',{recursive:true});
try {
 for(const width of [390,768,1440]) for(const theme of ['light','dark']) {
  const context=await browser.newContext({viewport:{width,height:950},isMobile:width<768,hasTouch:width<768});
  await context.addInitScript(theme=>{localStorage.setItem('portfolio-theme',theme);localStorage.setItem('elvora-motion','reduced');},theme);
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const route of routes) {
   try {
    const r=await page.goto(base+route);assert.equal(r.status(),200);
    const consent=page.getByRole('button',{name:'Reject All',exact:true});if(await consent.isVisible())await consent.click();
    await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('main h1').count(),1,'One page heading');
    const overflow=await page.evaluate(()=>({body:document.documentElement.scrollWidth,viewport:innerWidth,offenders:[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().right>innerWidth+2).slice(0,5).map(e=>e.className)}));
    assert.ok(overflow.body<=width+1,JSON.stringify(overflow));
    assert.equal(await page.locator('canvas').count(),0,'No decorative WebGL canvas');
    const text=await page.locator('main').innerText();
    assert.ok(!/Nora Vale|Ethan Reed|Maya Lane|Omar Vale|seamless|cutting.edge|game.changer|supercharge/i.test(text),'No fictional endorsements/banned sales buzzwords');
    if(route==='/testimonials') {assert.ok(text.includes('No client reviews published yet.'));assert.equal(await page.locator('blockquote').count(),0);}
    if(route==='/') {assert.equal(await page.locator('.portfolio-shell').evaluate(e=>getComputedStyle(e).backgroundColor),theme==='light'?'rgb(243, 239, 229)':'rgb(36, 37, 31)');assert.ok(text.includes('$70'));assert.ok(text.includes('$75'));assert.equal(await page.locator('.hero-emblem,.expertise-marquee').count(),0);}
    if(route==='/ai-bots') {assert.equal(await page.locator('.bot-showcase-image').count(),0);assert.equal(await page.locator('.bot-feature').count(),3);}
    if(route==='/contact') {assert.equal(await page.locator('#faq').count(),0);assert.ok(await page.getByLabel('Your name',{exact:true}).isEditable());}
    if([390,1440].includes(width)&&theme==='light'&&['/','/websites','/ai-bots','/about','/contact','/testimonials'].includes(route))await page.screenshot({path:`docs/brand-audit/${route==='/'?'home':route.slice(1)}-${width}.png`,fullPage:true});
    cases++;
   } catch(e) {failures.push({width,theme,route,error:e.message});}
  }
  if(errors.length)failures.push({width,theme,pageErrors:errors});
  await context.close();
 }
 // Conversations are mocked explicitly: test UI wiring without spending the owner's provider quota.
 const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();
 await page.route('**/api/chat',route=>route.fulfill({json:{reply:'Local UI fixture: the policy threshold is $75.'}}));
 await page.goto(base+'/ai-bots');await page.getByRole('button',{name:'Reject All',exact:true}).click();
 for(const [id,name] of [['veldt','Veldt Support'],['northline','Northline Assistant'],['solenne','Solenne Concierge']]) {
  await page.getByRole('button',{name:'Open chat preview: '+name,exact:true}).click();
  assert.equal(await page.locator(`.chat-header .business-bot-avatar-${id} img`).count(),1);
  const field=page.getByLabel('Your message',{exact:true});await field.fill('Can you help me?');await field.press('Enter');
  await page.getByText('Local UI fixture: the policy threshold is $75.',{exact:true}).waitFor();
  assert.ok(await page.getByRole('link',{name:'View demo knowledge',exact:true}).isVisible());
  await page.keyboard.press('Escape');
 }
 await context.close();
 // Retain the functional concept interactions after their copy rewrite.
 for(const slug of ['solenne','vanta','aster','kovo']) {
  const p=await browser.newPage({viewport:{width:1440,height:900}});await p.goto(base+'/demo/'+slug);
  const filter=p.locator('.concept-filters button').nth(1);await filter.click();assert.equal(await filter.getAttribute('aria-pressed'),'true');
  if(slug==='vanta'||slug==='kovo') {await p.locator('.concept-plan-form button[type=submit]').click();assert.ok((await p.locator('.concept-summary').count())>0);}
  await p.close();
 }
 // Refresh six real study captures; these replace outdated slogans in previews.
 for(const slug of ['noma','orbit','elsewhere','form','offscript','aura']) {
  const p=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});await p.goto(base+'/studies/'+slug);const reject=p.getByRole('button',{name:'Reject All',exact:true});if(await reject.isVisible())await reject.click();await p.evaluate(()=>document.fonts.ready);
  await p.getByRole('button',{name:'Maximize preview window',exact:true}).click();await sharp(await p.locator('.demo-window-content').screenshot({animations:'disabled'})).webp({quality:88}).toFile(`public/studies/${slug}.webp`);await p.close();
 }
 console.log(JSON.stringify({passedLayoutCases:cases,total:routes.length*6,failures,chatCases:3,mockedReplies:true,conceptFilterCases:4,refreshedStudyCaptures:6},null,2));
 fs.writeFileSync('docs/brand-audit/browser-results.json',JSON.stringify({passedLayoutCases:cases,total:routes.length*6,failures,chatCases:3,mockedReplies:true,conceptFilterCases:4,refreshedStudyCaptures:6},null,2)+'\n');
 assert.deepEqual(failures,[]);
} finally {await browser.close();}
