import {newestFirst, validLaunch, safeLink} from './ledger.js';
const tabs = [...document.querySelectorAll('[data-filter]')];
const search = document.querySelector('#search');
const upcoming = document.querySelector('#launch');
const published = document.querySelector('#published');
const empty = document.querySelector('#empty');
const dialog = document.querySelector('#details');
const originalDetails = dialog.innerHTML;
let filter = 'all', launches = [], failed = false;
function node(tag, text, className) {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (className) el.className = className;
  return el;
}
function proofLink(label, url) {
  const href = safeLink(url); if (!href) return null;
  const link = node('a', label); link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer'; return link;
}
function closeHandler() { dialog.querySelector('.close').addEventListener('click', () => dialog.close()); }
function details(record) {
  dialog.replaceChildren();
  const close = node('button', 'Close', 'close'); close.type = 'button'; dialog.append(close);
  dialog.append(node('div', 'Launch record', 'eyebrow'), node('h2', record.name));
  const table = node('div', undefined, 'record');
  const fields = [['Ticker',record.ticker],['Blockchain',record.chain],['Contract address',record.address],['Launch date',new Date(record.launchedAt).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'})],['Planned supply lock','40%'],['Reported locked supply',record.lockPercent != null ? `${record.lockPercent}%` : null],['Lock provider',record.provider],['Lock start',record.lockStart],['Unlock / release schedule',record.unlock],['Cancellation rights',record.cancellation]];
  fields.forEach(([label,value])=>table.append(node('span',label),node('span',value || 'Not published'))); dialog.append(table);
  const links = node('div',undefined,'proof-links');
  for (const [label,url] of [['Inspect lock ↗',record.lockUrl],['View transaction ↗',record.transactionUrl],['View token ↗',record.tokenUrl]]) {const link=proofLink(label,url);if(link)links.append(link);}
  dialog.append(links,node('p','Lock details are team-published records, not an automated on-chain verification. Inspect the linked evidence and current release terms.'));
  closeHandler();dialog.showModal();
}
function card(record, index) {
  const article=node('article',undefined,`launch${index===0?' latest':''}`);
  const art=node('div',undefined,'launch-art');art.append(node('span',index===0?'LATEST DROP':'PREVIOUS DROP','issue'));
  const emblem=node('div',record.ticker||record.name.slice(0,3).toUpperCase(),'seal');emblem.style.fontSize='36px';emblem.style.letterSpacing='-1px';art.append(emblem);
  const info=node('div',undefined,'launch-info');
  const hasProof=Boolean(safeLink(record.lockUrl));
  info.append(node('span',hasProof?'LAUNCHED · LOCK RECORD AVAILABLE':'LAUNCHED · LOCK DETAILS PENDING','status'),node('h3',record.name),node('p',record.description||'Explore the token and its published lock details.','sub'));
  const facts=node('div',undefined,'facts');
  for(const [label,value] of [['LAUNCHED',new Date(record.launchedAt).toLocaleDateString(undefined,{dateStyle:'medium'})],['PLANNED LOCK','40% of supply']]) {const fact=node('div');fact.append(node('span',label),node('b',value));facts.append(fact);}
  const button=node('button','View launch details ↗','text-button');button.addEventListener('click',()=>details(record));info.append(facts,button);article.append(art,info);return article;
}
function render() {
  const term=search.value.trim().toLowerCase();published.replaceChildren();
  let count=0;
  launches.forEach((record,index)=>{
    if(filter==='upcoming'||(filter==='locked'&&!safeLink(record.lockUrl))) return;
    if(!`${record.name} ${record.ticker||''} ${record.address||''}`.toLowerCase().includes(term))return;
    published.append(card(record,index));count++;
  });
  const showUpcoming=!launches.length&&filter!=='locked'&&filter!=='launched'&&'the first meme is coming upcoming week 001 first drop saturday'.includes(term);
  upcoming.hidden=!showUpcoming;empty.hidden=count>0||showUpcoming;
  empty.textContent=failed?'Launch records could not be loaded. Please refresh to try again.':filter==='locked'?'No lock records match this view yet. Published lock evidence will appear here.':'No launches match this view. Follow Telegram for Saturday drop announcements.';
  document.querySelector('#lockcount').textContent=String(launches.filter(x=>safeLink(x.lockUrl)).length);
}
tabs.forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;tabs.forEach(tab=>{const active=tab===button;tab.classList.toggle('active',active);tab.setAttribute('aria-pressed',String(active));});render();}));
search.addEventListener('input',render);
document.querySelector('#view').addEventListener('click',()=>{dialog.innerHTML=originalDetails;closeHandler();dialog.showModal();});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
try {
  const response=await fetch('./launches.json',{cache:'no-store'});if(!response.ok)throw Error('Unable to load launch records');
  const data=await response.json();if(!Array.isArray(data)||!data.every(validLaunch))throw Error('Invalid launch records');
  launches=newestFirst(data);
} catch(error){failed=true;console.error('Launch records unavailable');}
render();
