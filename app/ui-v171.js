'use strict';
Object.assign(WORDS,{statModel:['数值模型 1.71 · 静态预估','Calculation model 1.71 · static estimate']});
const celestialStar171=id=>devotions.flatMap(c=>c.stars).find(s=>s.id===id&&DawnCore.first(s.fields,'Class','')!=='Skill_Passive');
function rankControl171(star){const max=DawnCore.devotionMax(star);return`<div class="celestial-rank171">${star.icon?icon(star,26):''}<span>${esc(name(star.name))}</span><label>${tr('技能等级','Skill rank')}<input type="number" min="1" max="${max}" step="1" value="${DawnCore.devotionRank(b,star)}" data-celestial-rank171="${esc(star.id)}" aria-label="${esc(name(star.name)+' · '+tr('技能等级','Skill rank'))}"><span>/ ${max}</span></label><button type="button" class="icon-button" data-celestial-max171="${esc(star.id)}" title="${tr('设为满级','Set to maximum rank')}" aria-label="${tr('设为满级','Set to maximum rank')}">${symbol('chevrons-up')}</button></div>`;}
const renderDevotionsBefore171=renderDevotions;
renderDevotions=function(){renderDevotionsBefore171();const c=devotions.find(c=>c.id===activeConstellation),target=$('.map-selection');if(c&&target)target.insertAdjacentHTML('beforeend',c.stars.filter(s=>!passiveStar13(s)).map(rankControl171).join(''));icons();};
const tooltipBefore171=itemTooltip;
itemTooltip=function(item,event,rank=1){const star=celestialStar171(item.id);if(star)rank=DawnCore.devotionRank(b,star);const shell=document.createElement('div');shell.innerHTML=tooltipBefore171(item,event,rank);if(star){const meta=shell.querySelector('.tooltip-head .tip-meta');if(meta)meta.textContent=tr('等级','Rank')+' '+rank+' / '+DawnCore.devotionMax(star);shell.querySelector('.tooltip-head')?.insertAdjacentHTML('afterend',rankControl171(star));}return shell.innerHTML;};
function updateCelestial171(id,value){const star=celestialStar171(id);if(!star)return;const rank=Math.max(1,Math.min(DawnCore.devotionMax(star),Math.trunc(Number(value)||1)));snapshot(DawnCore.changeDevotionRank(b,star,rank));const tip=$('#tooltip');if(!tip.hidden){const source=$('[data-star="'+CSS.escape(id)+'"]');if(source)showTooltip({...star,name:devotions.find(c=>c.stars.some(s=>s.id===id)).name},{target:source,clientX:tip.getBoundingClientRect().left,clientY:tip.getBoundingClientRect().top},rank);}}
window.addEventListener('change',async e=>{const el=e.target;
 if(el.id==='language')GrimWeaverPreferences.set(el.value);
 if(el.dataset.celestialRank171){try{updateCelestial171(el.dataset.celestialRank171,el.value);}catch(error){fail(error);}return;}
 const file=el.id==='fileInput'&&el.files?.[0];if(!file||/\.gdc$/i.test(file.name))return;e.stopImmediatePropagation();
 try{if(file.size>5000000)throw Error('File is too large');await hydrate(JSON.parse(await file.text()),{devotionPolicy:'maximum'});}catch(error){fail(error);}finally{el.value='';}
},true);
window.addEventListener('click',async e=>{const el=e.target.closest('button');if(!el)return;
 if(el.dataset.celestialMax171){e.preventDefault();try{const s=celestialStar171(el.dataset.celestialMax171);if(s)updateCelestial171(s.id,DawnCore.devotionMax(s));}catch(error){fail(error);}return;}
 if(el.id!=='loadCode')return;e.preventDefault();e.stopImmediatePropagation();try{await hydrate(await codec($('#shareCode').value,false),{devotionPolicy:'maximum'});$('#shareDialog').close();}catch(error){fail(error);}
},true);
const renderBefore171=render;
render=function(){renderBefore171();$('.version').textContent='1.71';document.title='GrimWeaver 1.71 | GAL';};
if(data)render();
