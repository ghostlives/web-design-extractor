import { chromium, type Browser, type Page } from "playwright";
import type { PageCapture } from "./types.js";

export interface CaptureOptions { viewports:{width:number;height:number}[]; maxElements:number; timeoutMs:number; screenshotDir?:string; }
const properties=["color","backgroundColor","fontFamily","fontSize","fontWeight","lineHeight","letterSpacing","marginTop","marginRight","marginBottom","marginLeft","paddingTop","paddingRight","paddingBottom","paddingLeft","borderRadius","borderWidth","borderColor","boxShadow","display","position","gap","transition","animationName"];

async function capturePage(page:Page,url:string,maxElements:number):Promise<PageCapture>{
  await page.goto(url,{waitUntil:"networkidle"});
  return page.evaluate(({properties,maxElements})=>{
    const root=getComputedStyle(document.documentElement); const cssVariables:Record<string,string>={};
    for(const name of Array.from(root)){if(name.startsWith("--")){const value=root.getPropertyValue(name).trim();if(value)cssVariables[name]=value;}}
    const mediaQueries=new Set<string>();
    for(const sheet of Array.from(document.styleSheets)){try{for(const rule of Array.from(sheet.cssRules)){if(rule instanceof CSSMediaRule)mediaQueries.add(rule.conditionText);}}catch{/* cross-origin stylesheet */}}
    const visible=(el:Element)=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&s.display!=="none"&&s.visibility!=="hidden";};
    const nodes=Array.from(document.querySelectorAll("body *")).filter(visible).slice(0,maxElements);
    const elements=nodes.map(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect(),styles:Record<string,string>={};for(const p of properties){styles[p]=s.getPropertyValue(p.replace(/[A-Z]/g,m=>`-${m.toLowerCase()}`)).trim();}return {tag:el.tagName.toLowerCase(),role:el.getAttribute("role"),classes:Array.from(el.classList).slice(0,8),text:(el.textContent??"").trim().replace(/\s+/g," ").slice(0,80),width:Math.round(r.width),height:Math.round(r.height),styles};});
    return {url:location.href,title:document.title,viewport:{width:innerWidth,height:innerHeight},cssVariables,mediaQueries:[...mediaQueries].sort(),elements};
  },{properties,maxElements});
}

export async function capture(url:string,options:CaptureOptions):Promise<PageCapture[]>{
  let browser:Browser|undefined;
  try{browser=await chromium.launch({headless:true});const output:PageCapture[]=[];for(const viewport of options.viewports){const context=await browser.newContext({viewport});const page=await context.newPage();page.setDefaultTimeout(options.timeoutMs);output.push(await capturePage(page,url,options.maxElements));if(options.screenshotDir)await page.screenshot({path:`${options.screenshotDir}/${viewport.width}x${viewport.height}.png`,fullPage:true});await context.close();}return output;}finally{await browser?.close();}
}
