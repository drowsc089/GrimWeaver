'use strict';
Object.assign(WORDS,{brand:['GrimWeft','GrimWeft'],Legendary:['传奇','Legendary'],statModel:['数值模型 1.3 · 静态预估','Calculation model 1.3 · static estimate']});
const passiveStar13=s=>DawnCore.first(s?.fields,'Class','')==='Skill_Passive';
const affinity13=(values)=>Object.entries(values||{}).filter(([,v])=>v>0).map(([k,v])=>`<span class="affinity-chip" style="--affinity:${AFF[k]?.[2]||'var(--ink)'}"><i></i>${esc(pair(AFF[k]||[k,k]))}<b>${v}</b></span>`).join('')||`<span class="subtle">${tr('无','None')}</span>`;
function constellationInfo13(c){return `<section class="constellation-affinity" data-section="affinity"><h4>${tr('亲和需求','Affinity required')}</h4><div>${affinity13(c.req)}</div><h4>${tr('完整点亮奖励','Completed constellation rewards')}</h4><div>${affinity13(c.given)}</div><p>${c.stars.filter(s=>b.stars.includes(s.id)).length} / ${c.stars.length} ${tr('已点亮','stars selected')}</p></section>`;}
function setRecordName13(set,id){let r=set.__refs?.[id]||{};const linked=DawnCore.canon(DawnCore.first(r,'buffSkillName',''));if(!r.skillDisplayName&&linked)r=set.__refs?.[linked]||r;return{zh:lookupNameFor11(r,{zh:namedRecord12(id,tr('专精技能','Mastery skill')),en:namedRecord12(id,'Mastery skill')},'zh'),en:lookupNameFor11(r,{en:namedRecord12(id,'Mastery skill')},'en')};}
function setItem13(set,fields,id){const bonuses=[];for(let i=1;i<=12;i++)for(const type of ['Skill','Mastery']){const target=DawnCore.canon(DawnCore.first(fields,'augment'+type+'Name'+i,''));if(target&&fields['augment'+type+'Level'+i])bonuses.push({id:target,name:setRecordName13(set,target),levels:fields['augment'+type+'Level'+i]});}
 const modifiers=[];for(let i=1;i<=12;i++){const target=DawnCore.canon(DawnCore.first(fields,'modifiedSkillName'+i,'')),mod=DawnCore.canon(DawnCore.first(fields,'modifierSkillName'+i,''));if(target&&mod)modifiers.push({id:mod,target,name:globalThis.DawnPresentation?.skillNames?.[target]||{zh:namedRecord12(target),en:namedRecord12(target)},level:1});}
 return{id,fields,refs:set.__refs||{},skillBonuses:bonuses,modifiers,name:set.__name};}
function setTooltip13(item){const id=DawnCore.canon(DawnCore.first(item.fields,'itemSetName','')),set=data.sets[id];if(!set)return'';
 const members=set.setMembers||[],equipped=new Set(DawnCore.bonuses(b,data,items).filter(x=>x.kind==='item').map(x=>x.id)),count=members.filter(x=>equipped.has(DawnCore.canon(x))).length;
 let html=`<h4 class="set-title">${esc(name(set.__name))} <span>${count} / ${members.length}</span></h4>`;
 const descTag=DawnCore.canon(DawnCore.first(set,'setDescription','')),description=data.tags[language]?.[descTag];if(description)html+=`<p class="set-description">${esc(description.replace(/\{\^[^}]*\}|\^[A-Za-z-]/g,''))}</p>`;
 html+=`<ul class="set-members">${members.map(raw=>{const key=DawnCore.canon(raw),member=items.get(key)||RiftScenario.data?.members[key];return `<li class="${equipped.has(key)?'equipped':''}">${equipped.has(key)?symbol('check'):symbol('minus')}<span>${esc(member?name(member.name):tr('套装部件','Set member'))}</span></li>`;}).join('')}</ul>`;
 for(let n=1;n<=members.length;n++){
  const delta={},numeric=Object.entries(set).filter(([k,a])=>Array.isArray(a)&&typeof a[0]==='number');
  for(const[k,a]of numeric){const now=DawnCore.at(set,k,n),prev=n>1?DawnCore.at(set,k,n-1):0;if(now!==prev)delta[k]=[now-prev];}
  for(const[k,a]of Object.entries(set))if(/^(?:augment(?:Skill|Mastery)Name|modifiedSkillName|modifierSkillName)\d+$/.test(k))delta[k]=a;
  for(const[k,a]of Object.entries(set))if(/^petBonusName$|^itemSkillName$|^itemSkillAutoController$/.test(k))delta[k]=a;
  if(!delta.petBonusLevel)delete delta.petBonusName;
  if(!delta.itemSkillLevel){delete delta.itemSkillName;delete delta.itemSkillAutoController;}
  if(!delta.itemSkillModifierControl){for(const key of Object.keys(delta))if(/^(modified|modifier)SkillName/.test(key))delete delta[key];}
  const content=fieldSections12(setItem13(set,delta,id+'#'+n),1);if(!content)continue;
  html+=`<details class="set-threshold ${count>=n?'active':''}" data-set-count="${n}" open><summary>${n} ${tr('件套奖励','piece bonus')} · ${count>=n?tr('已激活','Active'):tr('未激活','Inactive')}</summary><div>${content}</div></details>`;
 }
 return `<section class="tip-set" data-section="set">${html}</section>`;
}
const fieldsBefore13=fieldSections12;
fieldSections12=function(item,rank=1){let html=fieldsBefore13(item,rank);for(const m of item.modifiers||[]){const url=sourceIcon12(m.target||m.id),title=tr('物品技能修正','Item skill modifier')+' · '+name(m.name);if(url)html=html.replace(`<h4>${esc(title)}</h4>`,`<h4><img class="modifier-icon" src="${esc(url)}" alt="">${esc(title)}</h4>`);}return html;};
fieldLines=fieldSections12;
const tipBefore13=itemTooltip;
itemTooltip=function(item,event,rank=1){let html=tipBefore13(item,event,rank),star=event?.target?.closest?.('[data-star]'),c=star&&devotions.find(c=>c.stars.some(s=>s.id===item.id));
 if(item.category){html=html.replace('class="tooltip-head"',`class="tooltip-head rarity-${esc(item.rarity)}"`);html+=setTooltip13(item);}
 if(c){if(passiveStar13(item)){html=html.replace(/<section class="tip-section tip-binding"[^]*?<\/section>/,'').replaceAll(tr('技能效果','Skill effects'),tr('被动属性','Passive bonuses')).replace(/<div class="tip-meta">[^]*?<\/div>/,'');}html+=constellationInfo13(c);}
 return html;
};
function clampTooltip13(){const el=$('#tooltip');if(el.hidden)return;const r=el.getBoundingClientRect();const left=Math.max(8,Math.min(r.left,innerWidth-r.width-8)),top=Math.max(8,Math.min(r.top,innerHeight-r.height-8));if(Math.abs(r.left-left)>.1)el.style.left=left+'px';if(Math.abs(r.top-top)>.1)el.style.top=top+'px';}
let tipSource13=null,tipTimer13=null,tipSwitch13=null,tipDispatch13=false;
const hideTip13=()=>{$('#tooltip').hidden=true;tipSource13=null;};
const cancelTip13=()=>{clearTimeout(tipTimer13);tipTimer13=null;};
const scheduleTip13=()=>{cancelTip13();tipTimer13=setTimeout(hideTip13,280);};
const showBefore13=showTooltip;
showTooltip=function(item,event,rank=1){cancelTip13();showBefore13(item,event,rank);if(!event.target.closest?.('#catalogList')){tipSource13=event.target.closest?.('[data-slot],[data-item-id],[data-skill-id],[data-star],[data-stat-help]');const el=$('#tooltip');el.insertAdjacentHTML('afterbegin',`<div class="tip-toolbar"><button data-tip-close class="icon-button" aria-label="${tr('关闭提示','Close tooltip')}" title="${tr('关闭提示','Close tooltip')}">${symbol('x')}</button></div>`);const source=tipSource13?.getBoundingClientRect(),r=el.getBoundingClientRect();if(source){el.style.left=(source.right+8+r.width<=innerWidth?source.right+8:source.left-8-r.width>=0?source.left-8-r.width:Math.max(8,innerWidth-r.width-8))+'px';el.style.top=Math.max(8,source.top)+'px';}clampTooltip13();}};
const tipObserver13=new ResizeObserver(clampTooltip13);tipObserver13.observe($('#tooltip'));
const shownBefore13=showTooltip;
showTooltip=function(item,event,rank=1){shownBefore13(item,event,rank);if(!event.target.closest?.('#catalogList')){$('#tooltip').scrollTop=0;icons();}};
window.addEventListener('resize',hideTip13);
window.addEventListener('pointerout',e=>{const selector='[data-slot],[data-item-id],[data-skill-id],[data-star],[data-stat-help],#tooltip';if(!e.target.closest?.(selector))return;const related=e.relatedTarget instanceof Element?e.relatedTarget:null;e.stopImmediatePropagation();if(related?.closest('#tooltip')||tipSource13?.contains(related))cancelTip13();else scheduleTip13();},true);
window.addEventListener('pointerover',e=>{
 if(e.target.closest?.('#tooltip')){cancelTip13();clearTimeout(tipSwitch13);return;}
 const source=e.target.closest?.('[data-slot],[data-item-id],[data-skill-id],[data-star],[data-stat-help]');
 if(tipDispatch13||!source||!tipSource13||source===tipSource13||$('#tooltip').hidden)return;
 e.stopImmediatePropagation();clearTimeout(tipSwitch13);const x=e.clientX,y=e.clientY;
 tipSwitch13=setTimeout(()=>{if(!source.matches(':hover'))return;tipDispatch13=true;try{source.dispatchEvent(new PointerEvent('pointerover',{bubbles:true,clientX:x,clientY:y}));}finally{tipDispatch13=false;}},220);
},true);
window.addEventListener('pointermove',e=>{if($('#tooltip').hidden||!tipSource13)return;const source=tipSource13.getBoundingClientRect(),tip=$('#tooltip').getBoundingClientRect(),inside=r=>e.clientX>=r.left-12&&e.clientX<=r.right+12&&e.clientY>=r.top-12&&e.clientY<=r.bottom+12;if(inside(source)||inside(tip))cancelTip13();else if(!tipTimer13)scheduleTip13();},true);
window.addEventListener('keydown',e=>{if(e.key==='Escape')hideTip13();},true);
window.addEventListener('pointerdown',e=>{if(!e.target.closest?.('#tooltip')&&!tipSource13?.contains(e.target))hideTip13();},true);
window.addEventListener('click',e=>{if(e.target.closest?.('[data-tip-close]')){e.stopImmediatePropagation();hideTip13();}},true);
document.addEventListener('scroll',e=>{if(e.target!==$('#tooltip')&&!e.target.closest?.('#tooltip'))hideTip13();},true);
const buffsBefore13=buffList;
buffList=function(){return [...buffsBefore13().filter(x=>{const source=DawnCore.bonuses(b,data,items).find(s=>s.kind==='set'&&DawnCore.canon(DawnCore.first(s.fields,'itemSkillName',''))===x.id);return !source||!source.fields.itemSkillLevel||DawnCore.at(source.fields,'itemSkillLevel',source.rank)>0;}),...RiftScenario.sources(b,data,items,classes,devotions).map(s=>({...s,group:s.permanent?'permanent':'temporary',name:{zh:lookupNameFor11(s.refs[DawnCore.canon(DawnCore.first(s.fields,'buffSkillName',''))],s.name,'zh')+' · '+s.petName.zh,en:s.name.en+' · '+s.petName.en},icon:sourceIcon12(s.skillId,s.icon)}))];};
const compactBefore13=compactBuffs11;
compactBuffs11=function(){compactBefore13();const states=new Map(RiftScenario.sources(b,data,items,classes,devotions).map(x=>[x.id,x.enabled]));$('#quickBuffs')?.querySelectorAll('[data-buff^="pet-aura:"]').forEach(el=>el.checked=!!states.get(el.dataset.buff));const checks=[...$('#quickBuffs').querySelectorAll('[data-buff]')];$('#quickBuffs summary b').textContent=checks.filter(x=>x.checked).length+' / '+checks.length;};
function rowUpdate13(root,key,value,suffix=''){const el=root.querySelector(`[data-stat-key="${key}"] strong`);if(el)el.textContent=(typeof value==='string'?value:fmt(value))+suffix;}
function supplemental13(r){const v=r.totals;return group(tr('人物与资源','Character and resources'),row11('healing-human',tr('强化治疗','Healing increase'),r.healing-100,'%')+row11('speed-attack',tr('攻击速度','Attack speed'),r.speeds.attack,'%')+row11('speed-cast',tr('施法速度','Cast speed'),r.speeds.cast,'%')+row11('speed-run',tr('奔跑速度','Run speed'),r.speeds.run,'%')+row11('health-regen',tr('生命回复','Health regeneration'),r.healthRegen)+row11('energy-regen',tr('能量回复','Energy regeneration'),r.energyRegen)+row11('energy-absorb',tr('能量吸收','Energy absorption'),v.characterEnergyAbsorptionPercent||0,'%')+row11('energy-available',tr('可用能量 / 总能量','Available / total energy'),fmt(r.energyAvailable)+' / '+fmt(r.mana))+row11('constitution',tr('体力加成','Constitution bonus'),v.characterConstitutionModifier||0,'%')+row11('experience',tr('经验获取加成','Experience bonus'),v.characterExperienceModifier||0,'%')+row11('light-radius',tr('光照范围加成','Light radius bonus'),v.characterLightRadiusModifier||0,'%'));}
const resultBefore13=resultUI;
resultUI=function(r){resultBefore13(r);const root=$('#summaryStats'),v=r.totals;
 if(statTab==='overview')root.insertAdjacentHTML('beforeend',supplemental13(r));
 if(statTab==='offense'){
  for(const key of ['characterAttackSpeedModifier','characterSpellCastSpeedModifier','characterRunSpeedModifier'])rowUpdate13(root,key,r.speeds[{characterAttackSpeedModifier:'attack',characterSpellCastSpeedModifier:'cast',characterRunSpeedModifier:'run'}[key]],'%');
  rowUpdate13(root,'offensiveLifeLeech',v.offensiveLifeLeechMin||0,'%');
  root.insertAdjacentHTML('beforeend',group(tr('反击加成','Retaliation bonuses'),Object.entries(DAMAGE).filter(([k])=>k!=='Elemental').map(([k,p])=>row11('retaliation-bonus-'+k,pair(p),(v['retaliation'+k+'Modifier']||0)+(v.retaliationTotalDamageModifier||0),'%')).join('')));
 }
 if(statTab==='defense'){
  rowUpdate13(root,'regen-life',r.healthRegen);rowUpdate13(root,'regen-energy',r.energyRegen);for(const[k,value]of Object.entries(r.control))rowUpdate13(root,'control-'+k,value,'%');
  rowUpdate13(root,'defensiveDodge',v.characterDodgePercent||0,'%');rowUpdate13(root,'defensiveDeflectProjectile',v.characterDeflectProjectile||0,'%');
 }
 if(statTab==='pets')root.insertAdjacentHTML('beforeend',group(tr('战宠控制抗性与速度加成','Pet control resistance and speed bonuses'),Object.entries(CONTROL).filter(([k])=>!['Knockdown','Confusion','Fear','Convert'].includes(k)).map(([k,p])=>row11('pet-control-'+k,pair(p),r.pet['defensive'+k]||0,'%')).join('')+['characterSpellCastSpeedModifier','characterRunSpeedModifier','offensiveCritDamageModifier'].map(k=>row11('pet-extra-'+k,rawLabel(k),(r.pet[k]||0)+(/Speed/.test(k)?r.pet.characterTotalSpeedModifier||0:0),'%')).join('')));
 $('#vitals .energy b').textContent=fmt(r.energyAvailable)+' / '+fmt(r.mana);
 return r;
};
const devoBefore13=renderDevotions;
renderDevotions=function(){devoBefore13();const c=devotions.find(c=>c.id===activeConstellation);if(c){const el=$('.map-selection');el?.querySelector('.affinity-need')?.remove();el?.insertAdjacentHTML('beforeend',constellationInfo13(c));}};
const equipmentBefore13=equipmentUI;
equipmentUI=function(){equipmentBefore13();document.querySelectorAll('.equipment-slot[data-slot]').forEach(el=>{const item=items.get(b.equipment[el.dataset.slot]?.item);if(item)el.dataset.rarity=item.rarity;});};
const renderBefore13=render;
render=function(){const scroll=$('#summaryStats').scrollTop;renderBefore13();$('.version').textContent='1.3';document.title='GrimWeft 1.3 | GAL';$('#summaryStats').scrollTop=scroll;};
DawnData.run('scenarios','data').then(bundle=>{RiftScenario.install(bundle);if(data)render();}).catch(fail);
if(data)render();
