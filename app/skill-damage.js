(function(g){
'use strict';
const C=g.DawnCore,B=g.DawnCombat,{first,at,canon}=C;
const types=B.DAMAGE,elemental=['Fire','Cold','Lightning'];
const dots={Physical:'SlowPhysical',Fire:'SlowFire',Cold:'SlowCold',Lightning:'SlowLightning',Poison:'SlowPoison',Life:'SlowLife'};
const weaponKinds=['sword','axe','mace','dagger','scepter','ranged1h','sword2h','axe2h','mace2h','ranged2h','spear','spear2h','staff','offhand','shield'];
const requiredWeapons=fields=>Object.entries(fields).filter(([k,a])=>weaponKinds.includes(k.toLowerCase())&&a[0]===true).map(([k])=>k.toLowerCase());
const directOf=Object.fromEntries(Object.entries(dots).map(([a,b])=>[b,a]));
const effectLink=k=>/^(buffSkillName|petSkillName|subSkillName|autoCastSkill|skillProjectileName|projectileName|projectileExplosion|projectileFragmentsName|projectileFragmentName|initialSkillName|attackSkillName|dyingSkillName|spawnObjects|modSpawnObjects)$/.test(k)||/^specialAttack\d*SkillName$/.test(k);
const damageField=k=>/^offensive(?:Physical|Pierce|Fire|Cold|Lightning|Poison|Life|Aether|Chaos|Elemental|Bleeding|SlowPhysical|SlowBleeding|SlowFire|SlowCold|SlowLightning|SlowPoison|SlowLife)(?:Min|Max)?$/.test(k);
const modifier=n=>n.isModifier||/Modifier|Transmuter/.test(first(n.fields,'Class',''));
const friendly=r=>first(r,'Class','')==='Skill_Passive'||/^(?:Skill_BuffSelf|Skill_BuffRadius|SkillBuff_Passive|SkillSecondary_BuffSelf)/.test(first(r,'Class',''))&&!/Attack/.test(first(r,'Class',''));
function amount(r,type,rank=1){const key='offensive'+type,lo=at(r,key+'Min',rank)+at(r,key,rank),hi=(r[key+'Max']?at(r,key+'Max',rank):at(r,key+'Min',rank))+at(r,key,rank);return{lo,hi};}
function conversions(sources){const out=[];for(const s of sources)for(const key of Object.keys(s.fields||{})){const m=/^conversionInType(\d*)$/.exec(key);if(!m)continue;const pct=at(s.fields,'conversionPercentage'+m[1],s.rank),from=String(first(s.fields,key,'')).split(';'),to=String(first(s.fields,'conversionOutType'+m[1],'')).split(';');if(pct<=0)continue;for(let i=0;i<from.length;i++){const source=from[i].replace(/^offensive/,''),dest=(to[i]||to[0]||'').replace(/^offensive/,'');if(source&&source!==dest)out.push({from:source,to:dest,pct,sourceId:s.id,name:s.name});}}return out;}
function applicable(c,type){if(c.from===type)return{...c,to:c.to};if(type.startsWith('Slow')&&directOf[type]===c.from&&dots[c.to])return{...c,to:dots[c.to]};if(c.from==='Elemental'&&elemental.includes(type))return c;if(c.from==='Elemental'&&['SlowFire','SlowCold','SlowLightning'].includes(type)&&dots[c.to])return{...c,to:dots[c.to]};return null;}
function splitElemental(p){if(p.type!=='Elemental')return[p];return elemental.map(type=>({...p,type,portion:p.portion/3,trace:[...p.trace,{from:'Elemental',to:type,pct:100/3,stage:'elemental'}]}));}
function convertStage(packets,rules,stage){const out=[];for(const p of packets){if(p.converted){out.push(p);continue;}const links=rules.map(c=>applicable(c,p.type)).filter(Boolean),sum=links.reduce((n,c)=>n+c.pct,0),den=Math.max(100,sum);if(sum<100)out.push({...p,portion:p.portion*(1-sum/100)});for(const c of links){if(!c.to)continue;out.push({...p,type:c.to,portion:p.portion*c.pct/den,converted:true,trace:[...p.trace,{...c,from:p.type,pct:c.pct/den*100,stage}]});}}return out;}
function convertPackets(packets,localRules=[],globalRules=[],pierce=0){
 let result=packets.flatMap(p=>splitElemental({...p,sourceType:p.sourceType||p.type,portion:p.portion??1,converted:false,trace:[]}));
 result=convertStage(result,localRules,'skill').flatMap(splitElemental);
 result=convertStage(result,globalRules,'global').flatMap(splitElemental);
 if(pierce>0){const ratio=Math.min(1,Math.max(0,pierce/100));result=result.flatMap(p=>p.origin==='weapon'&&p.type==='Physical'&&!p.converted?[{...p,portion:p.portion*(1-ratio)},{...p,type:'Pierce',portion:p.portion*ratio,converted:true,trace:[...p.trace,{from:'Physical',to:'Pierce',pct:ratio*100,stage:'pierce'}]}]:[p]);}
 return result.filter(p=>p.portion>1e-10&&p.modifiedHi!==0);
}
function percentage(fields,type,rank){return at(fields,'offensive'+type+'Modifier',rank)+at(fields,'offensiveTotalDamageModifier',rank)+(elemental.includes(type)||['SlowFire','SlowCold','SlowLightning'].includes(type)?at(fields,'offensiveElementalModifier',rank):0);}
function localPercent(sources,type){return sources.reduce((n,s)=>n+percentage(s.fields,type,s.rank),0);}
function globalSources(build,data,items,classes,result){
 const sources=C.bonuses(build,data,items),ids=new Set(result.ledger.filter(x=>x.scope==='character').map(x=>x.source)),known=new Map();
 for(const c of classes)for(const n of c.skills){known.set(n.id,n.fields);for(const[id,r]of Object.entries(n.refs||{}))known.set(id,r);if(build.skills[n.id]>0&&friendly(n.fields)&&(!/Buff/.test(first(n.fields,'Class',''))||build.buffs[n.id]))ids.add(n.id);}
 const seen=new Set(sources.map(s=>s.id));for(const id of ids){if(seen.has(id)||!known.has(id))continue;seen.add(id);const node=classes.flatMap(c=>c.skills).find(n=>n.id===id),c=classes.find(c=>c.skills.some(n=>n.id===id));let rank=node?C.skillRank(build,node,data,items,c):1;if(!node){const parent=classes.flatMap(c=>c.skills).find(n=>n.refs?.[id]&&(build.skills[n.id]||0)>0);if(parent)rank=C.skillRank(build,parent,data,items,classes.find(c=>c.skills.includes(parent)));}sources.push({id,fields:known.get(id),rank,name:node?.name});}
 return sources;
}
function rawWeapon(build,items,result,role='main'){
 const off=role==='off'||role==='shield',slot=(off?'offhand':'weapon')+build.weaponSet,item=items.get(build.equipment[slot]?.item),other=(off?'weapon':'offhand')+build.weaponSet;
 if(off&&(!item||item.type==='weapon_offhand'||items.get(build.equipment['weapon'+build.weaponSet]?.item)?.twoHanded||role==='shield'&&item.type!=='weaponarmor_shield'))return{slot,role,packets:[],pierce:0};
 const otherItem=items.get(build.equipment[other]?.item),otherIsWeapon=otherItem?.category==='weapon'||otherItem?.type==='weaponarmor_shield';
 const ledger=result.ledger.filter(x=>x.scope==='character'&&!(otherIsWeapon&&x.slot===other)),packets=[];
 for(const type of types){const key='offensive'+type,read=k=>ledger.filter(x=>x.key===k).reduce((n,x)=>n+x.value,0);let lo=read(key+'Min')+read(key)+at(item?.fields,'offensiveBase'+type+'Min'),hi=read(key+'Max')+read(key)+ledger.filter(x=>x.key===key+'Min'&&x.upperFallback).reduce((n,x)=>n+x.value,0)+(at(item?.fields,'offensiveBase'+type+'Max')||at(item?.fields,'offensiveBase'+type+'Min'));if(!item&&type==='Physical'){lo+=1;hi+=3;}if(lo||hi)packets.push({type,lo,hi,duration:at(item?.fields,key+'DurationMin')||3});}
 return{slot,role,itemId:item?.id||null,packets,pierce:Math.min(100,Math.max(0,(at(item?.fields,'offensivePierceRatioMin')||at(item?.fields,'offensivePierceRatio'))*(1+(result.totals.offensivePierceRatioModifier||0)/100)))};
}
function ancestors(node,nodes,seen=new Set()){if(!node||seen.has(node.id))return new Set();seen.add(node.id);const out=new Set(node.deps||[]);for(const id of node.deps||[])for(const parent of ancestors(nodes.get(id),nodes,seen))out.add(parent);return out;}
function weaponAllowed(build,items,fields){const required=requiredWeapons(fields);if(!required.length)return true;const main=items.get(build.equipment['weapon'+build.weaponSet]?.item),off=main?.twoHanded?null:items.get(build.equipment['offhand'+build.weaponSet]?.item);return[main,off].filter(Boolean).some(x=>required.includes(x.type.replace(/^weapon_|^weaponarmor_/,'')));}
function analyze(build,data,items,classes,devotions,records,result,options={}){
 result||=C.calculate(build,data,items,classes,devotions);
 const globalRules=conversions(globalSources(build,data,items,classes,result)),gearMods=C.bonuses(build,data,items).flatMap(s=>C.itemModifiers(s)),out=[],nodes=new Map(classes.flatMap(c=>c.skills.map(n=>[n.id,n]))),weapon=rawWeapon(build,items,result,options.hand||'main');
 const rankOf=n=>C.skillRank(build,n,data,items,classes.find(c=>c.skills.some(s=>s.id===n.id)));
 for(const c of classes)for(const root of c.skills){
  if(!(build.skills[root.id]>0)||modifier(root))continue;
  const required=requiredWeapons(root.fields),activeWeapon=required.length===1&&required[0]==='shield'?rawWeapon(build,items,result,'shield'):weapon;
  const rank=rankOf(root),learned=c.skills.filter(n=>(build.skills[n.id]||0)>0&&modifier(n)&&ancestors(n,nodes).has(root.id)),inherited=learned.filter(n=>!n.fields.petSkillName).map(n=>({...n,rank:rankOf(n)})),entries=[],missing=[],seen=new Set();
  function walk(raw,rk,relation='root',conditional=false,depth=0,summoned=false){const id=canon(raw),meta=records[id],fields=meta?.fields||nodes.get(id)?.fields;if(!fields){missing.push(id);return;}if(depth>24||seen.has(id))return;seen.add(id);const cls=first(fields,'Class','');if(['Pet','Monster'].includes(cls)){if(!/playerscaling/i.test(first(fields,'templateName','')))return;summoned=true;}
   const entry={id,fields,rank:rk,relation,conditional,name:meta?.name,summoned};entries.push(entry);
   for(const[key,a]of Object.entries(fields))if(effectLink(key)){const target=a[Math.min(rk-1,a.length-1)];if(typeof target!=='string'||!target.endsWith('.dbr'))continue;const childRank=key==='autoCastSkill'?at(fields,'autoCastSkillLevel',rk)||rk:rk;walk(target,childRank,key,conditional||key==='autoCastSkill'||key==='dyingSkillName',depth+1,summoned);}
   if(['Pet','Monster'].includes(cls))for(const key of Object.keys(fields)){const m=/^skillName(\d+)$/.exec(key);if(!m)continue;const n=first(fields,'skillLevel'+m[1],1),sr=typeof n==='number'?n:B.formula(n,{charLevel:build.level,CHARLEVEL:build.level,skillLevel:rk});if(sr>0)walk(first(fields,key,''),Math.floor(sr),key,conditional,depth+1,summoned);}
  }
  walk(root.id,rank,'root',/WeaponPool|PassiveOn|OnHit|OnCrit|OnKill/.test(first(root.fields,'Class','')));
  const hasRootDamage=Object.keys(root.fields).some(damageField)||at(root.fields,'weaponDamagePct',rank)>0;
  const hostId=hasRootDamage?root.id:entries.find(e=>!friendly(e.fields)&&(Object.keys(e.fields).some(damageField)||at(e.fields,'weaponDamagePct',e.rank)>0))?.id||root.id;
  const rootMods=gearMods.filter(m=>m.target===root.id),rootSources=[{id:root.id,fields:root.fields,rank},...inherited,...rootMods];
  const chargeCap=Math.max(1,at(root.fields,'skillChargeLevel',rank)),charges=Math.max(1,Math.min(chargeCap,options.charges?.[root.id]||1)),charge=root.fields.skillChargeMultipliers?.[charges-1]??100,groups=[];
  for(const entry of entries){
   if(friendly(entry.fields)||['Pet','Monster'].includes(first(entry.fields,'Class','')))continue;
   const exact=gearMods.filter(m=>m.target===entry.id&&!(entry.id===root.id&&hostId!==root.id)),applyInherited=entry.id===hostId,mods=[...(applyInherited?inherited:[]),...(applyInherited&&hostId!==root.id?rootMods:[]),...exact],sources=[entry,...mods];
   const uniqueKey=s=>(s.sourceId||s.id)+'|'+s.id+'|'+(s.slot||'');
   const pctSources=[entry,...(entry.id===root.id||!entry.conditional?rootSources:[]),...exact].filter((s,i,a)=>a.findIndex(x=>uniqueKey(x)===uniqueKey(s))===i),localRules=conversions(pctSources),packets=[];
   for(const type of types){const base=amount(entry.fields,type,entry.rank),modified=sources.map(s=>amount(s.fields,type,s.rank)).reduce((a,n)=>({lo:a.lo+n.lo,hi:a.hi+n.hi}),{lo:0,hi:0});if(!modified.lo&&!modified.hi)continue;packets.push({type,origin:'skill',baseLo:base.lo,baseHi:base.hi,modifiedLo:Math.max(0,modified.lo),modifiedHi:Math.max(0,modified.hi),duration:Math.max(0,...sources.map(s=>at(s.fields,'offensive'+type+'DurationMin',s.rank))),localPercent:localPercent(pctSources,type)});}
   const basePct=at(entry.fields,'weaponDamagePct',entry.rank),requestedWeaponPct=Math.max(0,sources.reduce((n,s)=>n+at(s.fields,'weaponDamagePct',s.rank),0)),weaponPct=entry.summoned?0:requestedWeaponPct,unmodeledSummonWeaponPct=entry.summoned?requestedWeaponPct:0;
   if(weaponPct)for(const p of activeWeapon.packets)packets.push({type:p.type,origin:'weapon',weaponRole:activeWeapon.role,baseLo:p.lo*basePct/100,baseHi:p.hi*basePct/100,modifiedLo:p.lo*weaponPct/100,modifiedHi:p.hi*weaponPct/100,duration:p.duration,localPercent:localPercent(pctSources,p.type)});
   const converted=convertPackets(packets,localRules,globalRules,activeWeapon.pierce).map(p=>{const percent=B.bonusPercent(result,p.type)+p.localPercent,scale=charge/100*Math.max(0,1+percent/100),duration=p.type.startsWith('Slow')?p.duration*Math.max(0,1+((result.totals['offensive'+p.type+'DurationModifier']||0)+pctSources.reduce((n,s)=>n+at(s.fields,'offensive'+p.sourceType+'DurationModifier',s.rank),0))/100):0;return{...p,convertedLo:p.modifiedLo*p.portion,convertedHi:p.modifiedHi*p.portion,finalLo:p.modifiedLo*p.portion*scale,finalHi:p.modifiedHi*p.portion*scale,globalPercent:B.bonusPercent(result,p.type),duration};});
   const percentLife=Math.max(0,sources.reduce((n,s)=>n+at(s.fields,'offensivePercentCurrentLifeMin',s.rank)+at(s.fields,'offensiveLifePercentMin',s.rank),0)),retaliationPct=Math.max(0,sources.reduce((n,s)=>n+at(s.fields,'retaliationDamagePct',s.rank)+at(s.fields,'retaliationAddedToAttack',s.rank),0));
   if(!converted.length&&!percentLife&&!retaliationPct&&!unmodeledSummonWeaponPct)continue;
   const direct=converted.filter(p=>!p.type.startsWith('Slow')),dot=converted.filter(p=>p.type.startsWith('Slow'));
   groups.push({id:entry.id,name:entry.name,relation:entry.relation,conditional:entry.conditional,rank:entry.rank,packets:converted,weaponPct,percentLife,retaliationPct,unmodeledSummonWeaponPct,directLo:direct.reduce((n,p)=>n+p.finalLo,0),directHi:direct.reduce((n,p)=>n+p.finalHi,0),dotLo:dot.reduce((n,p)=>n+p.finalLo,0),dotHi:dot.reduce((n,p)=>n+p.finalHi,0)});
  }
  if(!groups.length&&!missing.length)continue;
  const cooldownSources=[{fields:root.fields,rank},...inherited,...gearMods.filter(m=>m.target===root.id)],cooldown=Math.max(0,cooldownSources.reduce((n,s)=>n+at(s.fields,'skillCooldownTime',s.rank),0))*Math.max(0,1-(result.totals.skillCooldownReduction||0)/100);
  out.push({id:root.id,name:root.name,icon:root.icon,mastery:c.id,rank,spent:build.skills[root.id],class:first(root.fields,'Class',''),groups,modifiers:[...inherited.map(s=>({id:s.id,name:s.name,rank:s.rank})),...gearMods.filter(m=>m.target===root.id).map(m=>({id:m.id,name:m.name,rank:m.rank,sourceId:m.sourceId}))],cooldown,projectiles:at(root.fields,'skillProjectileNumber',rank)||at(root.fields,'numProjectiles',rank)||1,chargeCap,charges,chargeMultiplier:charge,hand:activeWeapon.slot,weaponAllowed:weaponAllowed(build,items,root.fields),missing,estimated:true});
 }
 return out;
}
g.GrimWeaverSkillDamage={analyze,convertPackets,conversions,globalSources,rawWeapon,effectLink,amount,percentage};
if(typeof module!=='undefined')module.exports=g.GrimWeaverSkillDamage;
})(globalThis);
