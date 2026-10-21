'use strict';
Object.assign(WORDS,{
 brand:['GrimWeft','GrimWeft'],statModel:['数值模型 1.4 · 静态预估','Calculation model 1.4 · static estimate'],
 ranges:['变量范围','Item ranges'],allowOvercap:['超上限等级','Overcap ranks'],showPetStats:['战宠属性','Pet attributes'],showPetSkills:['战宠技能','Pet skills'],ignoreSkillLimits:['忽略加点约束','Ignore allocation rules']
});
const setting14=key=>b.settings[key]??({allowOvercap:false,showPetStats:true,showPetSkills:false}[key]);
const toggle14=(key,help='')=>`<label class="inline-setting" title="${esc(help)}"><input type="checkbox" data-setting="${key}" ${setting14(key)?'checked':''}><span>${t(key)}</span></label>`;
DawnText.setNameResolver((id,locale)=>findSkill(id)?.node?.name?.[locale]||globalThis.DawnPresentation?.skillNames?.[id]?.[locale]);
function rangeSuffix14(row){
 const tidy=s=>s?.replace(/[-+]?\d+\.\d{4,}/g,n=>String(Number(Number(n).toFixed(3))));
 const low=tidy(row.minimumText),high=tidy(row.maximumText);if(!low||!high||low===high)return'';
 const numbers=s=>s.match(/[-+]?\d+(?:\.\d+)?%?/g)||[],a=numbers(low),z=numbers(high);if(a.length!==z.length)return'';
 const changes=a.map((value,i)=>{if(value===z[i])return'';const lo=Number.parseFloat(value),hi=Number.parseFloat(z[i]),unit=value.endsWith('%')&&z[i].endsWith('%')?'%':'';return `${fmt(Math.min(lo,hi))}–${fmt(Math.max(lo,hi))}${unit}`;}).filter(Boolean);
 return changes.length?`<small class="inline-roll" title="${esc(tr('近似下界：','Approximate minimum: ')+low+'\n'+tr('近似上界：','Approximate maximum: ')+high)}">≈${esc(changes.join(' / '))}</small>`:'';
}
function propertyLines14(fields,refs,rank,kind){
 const api=statAPI11(refs),rolled=mode=>Object.fromEntries(Object.entries(fields||{}).map(([k,a])=>[k,a.map(x=>typeof x==='number'?DawnCore.rollValue(x,k,{kind},mode):x)])),actual=rolled(b.settings.rollMode);
 const result=b.settings.ranges&&['item','prefix','suffix'].includes(kind)?api.rangeRows(actual,rank,rolled('minimum'),rolled('maximum')):api.rows(actual,rank);
 const render=list=>list.map(row=>`<div class="stat-line property-line" data-property-key="${esc(row.key)}"><span>${esc(row.text)}</span>${rangeSuffix14(row)}</div>`).join('');
 return{own:render(result.own),pet:render(result.pet)};
}
fieldSections12=function(item,rank=1){
 const fields=item.fields||{},kind=item.category?(['prefix','suffix','component','augment','ascended','completion'].includes(item.category)?item.category:'item'):'skill',split=DawnBuildModel.baseFields(item);
 const base=propertyLines14(split.base,{},rank,kind),own=propertyLines14(cleanOwnFields12(split.other),item.refs,rank,kind),petId=DawnCore.canon(DawnCore.first(fields,'petBonusName','')),pet=item.refs?.[petId];
 let baseRows=base.own;if(item.category==='weapon')baseRows+=`<div class="stat-line">${tr('基础攻击频率','Base attack rate')} ${fmt(Number(DawnCore.first(data.pc,'characterAttackSpeed',1.25))+DawnCore.at(fields,'characterBaseAttackSpeed'))}${tr(' 次/秒',' attacks/s')}</div>`;
 let html=section12('base',tr('基础属性','Base properties'),baseRows)+section12('stats',item.category?tr('角色属性','Character bonuses'):tr('技能效果','Skill effects'),own.own)+ranks12(item,rank);
 if(pet&&(!fields.petBonusLevel||DawnCore.at(fields,'petBonusLevel',rank)>0)){const lines=propertyLines14(pet,item.refs,DawnCore.at(fields,'petBonusLevel',rank)||rank,kind);html+=section12('pet',t('petBonuses'),lines.own+lines.pet);}else if(own.pet)html+=section12('pet',t('petBonuses'),own.pet);
 const ownModifiers=DawnCore.itemModifiers({id:item.id,name:item.name,fields,refs:item.refs,rank});
 for(const mod of ownModifiers){const metadata=item.modifiers?.find(m=>m.id===mod.id),title=tr('物品技能修正','Item skill modifier')+' · '+(metadata?name(metadata.name):namedRecord12(mod.target,tr('专精技能','Mastery skill'))),url=sourceIcon12(mod.target);
  const text=formatted12(mod.fields,mod.refs,mod.rank);html+=`<section class="tip-section tip-modifier" data-section="modifier"><h4>${url?`<img class="modifier-icon" src="${esc(url)}" alt="">`:''}${esc(title)}</h4>${lines12([...text.own,...text.pet])}</section>`;
 }
 if(!item.category)for(const source of DawnCore.bonuses(b,data,items))for(const mod of DawnCore.itemModifiers(source,item.id))html+=`<section class="tip-section tip-modifier" data-section="modifier" data-modifier-source="${esc(mod.sourceId)}"><h4>${sourceIcon12(item.id)?`<img class="modifier-icon" src="${esc(sourceIcon12(item.id))}" alt="">`:''}${tr('物品技能修正','Item skill modifier')}</h4><div class="tip-source">${esc(name(source.name))}</div>${lines12([...formatted12(mod.fields,mod.refs,mod.rank).own,...formatted12(mod.fields,mod.refs,mod.rank).pet])}</section>`;
 return html+grants12(item,rank);
};
fieldLines=fieldSections12;
const renderSkillsBefore14=renderSkills;
renderSkills=function(r){renderSkillsBefore14(r);const bar=$('.mastery-tabbar');bar?.insertAdjacentHTML('afterend',`<div class="skill-options" aria-label="${tr('技能预览选项','Skill preview options')}">${toggle14('allowOvercap',tr('手动预览最高常规上限+10，并受技能终极上限约束。仍检查技能点和前置条件。','Preview up to normal cap +10, bounded by the skill ultimate cap. Point budgets and prerequisites still apply.'))}${toggle14('showPetStats')}${toggle14('showPetSkills')}</div>`);
 const c=classes[skillClass];if(c)document.querySelectorAll('.skill-node[data-skill-id]').forEach(el=>{const n=c.skills.find(x=>x.id===el.dataset.skillId);if(!n)return;el.dataset.manualCap=setting14('allowOvercap')?DawnCore.skillHardCap(n,c):n.max;el.classList.toggle('overcap',(b.skills[n.id]||0)>n.max);});
};
const equipmentBefore14=equipmentUI;
equipmentUI=function(){equipmentBefore14();$('.gear-display-options')?.remove();$('.gear-toolbar')?.insertAdjacentHTML('beforeend',`<div class="gear-display-options">${toggle14('ranges',tr('范围采用近似模型，并非存档种子的精确还原。','Ranges are approximate, not exact seeded rolls.'))}</div>`);};
const catalogBefore14=renderCatalog;
renderCatalog=function(){catalogBefore14();if($('#catalogDialog').open){$('.catalog-range-setting')?.remove();$('#catalogContent')?.insertAdjacentHTML('afterbegin',`<div class="catalog-range-setting">${toggle14('ranges',tr('显示词条右侧的近似变量范围','Show approximate ranges beside properties'))}</div>`);}};
const settingsBefore14=settingsUI;
settingsUI=function(){settingsBefore14();$('#settingsFields').insertAdjacentHTML('beforeend',`<h3 class="settings-section">${tr('技能预览','Skill preview')}</h3>${['allowOvercap','showPetStats','showPetSkills'].map(key=>`<div class="setting-row">${toggle14(key)}</div>`).join('')}`);};
let buffGroup14='all';
function enabledBuff14(s){return s.id.startsWith('pet-aura:')?!!s.enabled:!!b.buffs[s.id];}
compactBuffs11=function(){
 let el=$('#quickBuffs');if(el?.tagName==='DETAILS'){el.remove();el=null;}if(!el){el=document.createElement('section');el.id='quickBuffs';el.className='quick-buffs buff-panel';$('#gearPanel').append(el);}
 const list=buffList(),visible=list.filter(s=>buffGroup14==='all'||s.group===buffGroup14),groups=['permanent','temporary','triggered'];
 el.innerHTML=`<header class="buff-panel-head"><h3>${symbol('flame')}${t('buffs')}<small>${list.filter(enabledBuff14).length} / ${list.length}</small></h3><div class="buff-commands"><button class="icon-button" data-buff-command="permanent" title="${tr('启用全部常驻增益','Enable permanent buffs')}" aria-label="${tr('启用全部常驻增益','Enable permanent buffs')}">${symbol('check-check')}</button><button class="icon-button" data-buff-command="off" title="${tr('关闭全部增益','Disable all buffs')}" aria-label="${tr('关闭全部增益','Disable all buffs')}">${symbol('power')}</button></div></header><div class="segmented buff-filters" role="group" aria-label="${tr('增益分类','Buff category')}">${['all',...groups].map(group=>`<button data-buff-group-filter="${group}" class="${group===buffGroup14?'active':''}">${group==='all'?tr('全部','All'):t(group)}</button>`).join('')}</div><div class="buff-panel-scroll">${groups.map(group=>{const rows=visible.filter(s=>s.group===group);return rows.length?`<section class="buff-group" data-buff-group="${group}"><h4>${t(group)} <span>${rows.filter(enabledBuff14).length} / ${rows.length}</span></h4><div class="quick-buff-list">${rows.map(s=>`<label class="quick-buff ${enabledBuff14(s)?'enabled':''}" data-skill-id="${esc(s.id)}">${icon(s)}<span>${esc(name(s.name))}</span><input aria-label="${esc(name(s.name))}" type="checkbox" data-buff="${esc(s.id)}" ${enabledBuff14(s)?'checked':''}></label>`).join('')}</div></section>`:'';}).join('')||`<div class="empty-buffs">${t('noBuffs')}</div>`}</div>`;icons();
};
document.addEventListener('click',e=>{const filter=e.target.closest('[data-buff-group-filter]'),command=e.target.closest('[data-buff-command]');if(!filter&&!command)return;e.stopImmediatePropagation();if(filter){buffGroup14=filter.dataset.buffGroupFilter;compactBuffs11();return;}const next=structuredClone(b);for(const s of buffList())if(command.dataset.buffCommand==='off'||s.group==='permanent')next.buffs[s.id]=command.dataset.buffCommand!=='off';snapshot(next);},true);
document.addEventListener('pointerover',e=>{const label=e.target.closest('#quickBuffs [data-skill-id]');if(!label||findSkill(label.dataset.skillId))return;const source=buffList().find(s=>s.id===label.dataset.skillId);if(source)showTooltip({...source,id:source.skillId||source.id},e,source.rank);},true);
appendSummonPreview11=async function(item,rank,el){
 const showStats=setting14('showPetStats'),showSkills=setting14('showPetSkills');if(!showStats&&!showSkills)return;
 if(!item.fields.spawnObjects?.length&&!Object.values(item.refs||{}).some(r=>r.spawnObjects?.length))return;
 const placeholder=document.createElement('section');placeholder.className='summon-preview';placeholder.dataset.petPreviewFor=item.id;placeholder.innerHTML=`<div class="subtle">${t('loading')}</div>`;el.append(placeholder);
 try{
  const bundle=await ensurePets11();if(el.hidden||!placeholder.isConnected||placeholder.parentElement!==el)return;
  const preview=structuredClone(b),found=findSkill(item.id);if(found?.c&&!preview.skills[item.id])preview.skills[item.id]=1;
  const list=DawnCombat.petList(preview,data,items,classes,devotions,bundle,{skillRanks:{[item.id]:rank}}).filter(p=>p.sourceId===item.id||name(p.source)===name(item.name));
  const cells=(label,base,final,percent=false)=>`<tr><th>${esc(label)}</th><td>${fmt(base||0)}${percent?'%':''}</td><td>${fmt(final||0)}${percent?'%':''}</td></tr>`;
  const content=list.map(p=>`<article class="summon-preview-entry"><h4>${esc(name(p.name))}<small>${t('level')} ${p.level} · ×${p.count} · ${tr('静态预估','Static estimate')}</small></h4>${showStats?`<table class="pet-preview-table"><thead><tr><th>${tr('属性','Attribute')}</th><th>${tr('基础','Base')}</th><th>${tr('当前加成','Modified')}</th></tr></thead><tbody>${['characterLife','characterMana','characterOffensiveAbility','characterDefensiveAbility','defensiveProtection'].map(key=>cells(rawLabel(key),p.base[key],p.final[key])).join('')}${p.resistances.map(x=>cells(pair(TYPES[x.type]),x.base,x.value,true)).join('')}</tbody></table>`:''}${showSkills?`<div class="pet-preview-skills"><h4>${tr('战宠技能','Pet skills')}</h4>${p.skills.map(s=>{const lines=formatted12(s.fields,s.refs,s.rank),damage=DawnCombat.petDamage(p,s),title=lookupName11(s.fields,tr('固有属性','Innate properties'));return lines.own.length||lines.pet.length||damage.length?`<details class="pet-preview-skill" open><summary>${sourceIcon12(s.id)?`<img src="${esc(sourceIcon12(s.id))}" alt="">`:''}${esc(title)} <small>${t('level')} ${s.rank}</small></summary>${lines12([...lines.own,...lines.pet])}${damage.length?`<table class="pet-preview-table"><thead><tr><th>${tr('伤害','Damage')}</th><th>${tr('基础','Base')}</th><th>${tr('当前加成','Modified')}</th></tr></thead><tbody>${damage.map(d=>`<tr><th>${esc(pair(DAMAGE[d.type]||[d.type,d.type]))}</th><td>${fmt(d.lo)}–${fmt(d.hi)}</td><td>${fmt(d.finalLo)}–${fmt(d.finalHi)}</td></tr>`).join('')}</tbody></table>`:''}</details>`:'';}).join('')}</div>`:''}</article>`).join('');
  if(!content){placeholder.remove();return;}placeholder.innerHTML=content;icons();clampTooltip13();
 }catch(error){if(placeholder.isConnected)placeholder.innerHTML=`<div class="warning">${tr('战宠预览读取失败','Pet preview could not be loaded')}</div>`;}
};
document.addEventListener('change',e=>{if(e.target.dataset.setting&&['allowOvercap','showPetStats','showPetSkills','ranges'].includes(e.target.dataset.setting))hideTip13();});
const renderBefore14=render;
render=function(){renderBefore14();$('.version').textContent='1.4';document.title='GrimWeft 1.4 | GAL';};
if(data)render();
