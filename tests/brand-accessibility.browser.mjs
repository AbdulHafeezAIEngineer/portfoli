import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const source=fs.readFileSync('node_modules/axe-core/axe.min.js','utf8');
const css=process.env.INJECT_BRAND_CSS==='1'?fs.readFileSync('app/field-notes.css','utf8'):'';
const results=[];
try {
 for(const theme of ['light','dark'])for(const route of ['/','/ai-bots','/contact','/about']) {
  const context=await browser.newContext({viewport:{width:390,height:844}});
  await context.addInitScript(t=>localStorage.setItem('portfolio-theme',t),theme);
  const page=await context.newPage();await page.goto('http://127.0.0.1:3016'+route);
  await page.getByRole('button',{name:'Reject All',exact:true}).click();
  if(route==='/ai-bots')await page.locator('.field-extra-demos summary').click();
  await page.evaluate(({source,css})=>{const nonce=document.querySelector('script[nonce]').nonce;if(css){const style=document.createElement('style');style.nonce=nonce;style.textContent=css;document.head.append(style);}const script=document.createElement('script');script.nonce=nonce;script.textContent=source;document.head.append(script);},{source,css});
  const audit=await page.evaluate(()=>axe.run(document.querySelector('main'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
  results.push({theme,route,violations:audit.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
  await context.close();
 }
 const report={injectedStyles:Boolean(css),results};
 console.log(JSON.stringify(report,null,2));
 if(!css)fs.writeFileSync('docs/brand-audit/accessibility-results.json',JSON.stringify(report,null,2)+'\n');
 assert.equal(results.flatMap(r=>r.violations).length,0);
} finally {await browser.close();}
