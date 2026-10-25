(function(g){
'use strict';
const C=g.DawnCore,B=g.DawnCombat,{first,at,canon}=C;
const elements=['Fire','Cold','Lightning'];
function rules(sources){
 const out=[];
 for(const s of sources)for(const key of Object.keys(s.fields||{})){
  const m=/^conversionInType(\d*)$/.exec(key);if(!m)continue;
  const pct=at(s.fields,'conversionPercentage'+m[1],s.rank||1),from=String(first(s.fields,key,'')).split(';'),to=String(first(s.fields,'conversionOutType'+m[1],'')).split(';');
  if(!(pct>0))continue;
  for(let i=0;i<from.length;i++){const a=from[i].replace(/^offensive/,'').trim(),z=(to[i]||to[0]||'').replace(/^offensive/,'').trim();if(a&&z&&a!==z)out.push({...s,fields:undefined,refs:undefined,from:a,to:z,pct,sourceId:s.sourceId||s.id,effectId:s.id});}
 }
 return out;
}
function collect(build,data,items,classes=[],devotions=[]){
 const sources=[],nodes=new Map(classes.flatMap(c=>c.skills.map(n=>[n.id,{...n,rank:C.skillRank(build,n,data,items,c)}]))),gear=C.bonuses(build,data,items),granted=new Map();
 const friendly=f=>!first(f,'debufSkill',false)&&!/Debuf|AttackBuff/.test(first(f,'Class',''));
 function visit(s,scope='character',seen=new Set()){
  const key=s.id+'|'+scope;if(seen.has(key)||!s.fields||!friendly(s.fields))return;seen.add(key);s={...s,sourceId:s.sourceId||s.id};sources.push({...s,scope,context:'global',active:s.active!==false});
  for(const link of ['buffSkillName','modifierSkillName','petBonusName']){const id=canon(first(s.fields,link,'')),fields=s.refs?.[id];if(!fields)continue;const rank=link==='petBonusName'&&s.fields.petBonusLevel?at(s.fields,'petBonusLevel',s.rank):s.rank;if(rank<=0)continue;visit({...s,id,fields,rank},link==='petBonusName'?'pet':scope,seen);}
 }
 function enabled(n,seen=new Set()){
  if(!n||!n.rank||seen.has(n.id)||!friendly(n.fields))return false;seen.add(n.id);const cls=first(n.fields,'Class','');
  if(/PetModifier/.test(cls))return false;if(cls==='Skill_Passive')return true;if(/^Skill_(?:Buff|Aura)/.test(cls))return !!build.buffs[n.id];
  return n.isModifier&&n.deps?.some(id=>enabled(nodes.get(id),new Set(seen)));
 }
 function radiusParent(n,seen=new Set()){if(!n||seen.has(n.id))return false;seen.add(n.id);return /^Skill_BuffRadius/.test(first(n.fields,'Class',''))||n.isModifier&&n.deps?.some(id=>radiusParent(nodes.get(id),seen));}
 for(const s of gear){visit(s);for(const key of ['itemSkillName','autoCastSkill']){const id=canon(first(s.fields,key,'')),fields=s.refs?.[id],setRank=s.kind==='set'&&s.fields.itemSkillLevel?at(s.fields,'itemSkillLevel',s.rank):null;if(!fields||setRank!==null&&setRank<=0)continue;const cls=first(fields,'Class','');if(cls!=='Skill_Passive'&&!/^Skill_(?:Buff|Aura)/.test(cls))continue;const next={...s,id,fields,rank:setRank||B.grantRank(s.fields),active:cls==='Skill_Passive'||!!build.buffs[id]};const old=granted.get(id);if(!old||old.rank<next.rank)granted.set(id,next);}}
 for(const s of granted.values())visit(s);
 for(const n of nodes.values())if(n.rank){const cls=first(n.fields,'Class','');if(enabled(n)||/^Skill_(?:Buff|Aura)/.test(cls)&&friendly(n.fields)){visit({...n,active:enabled(n),sourceId:n.id});if(radiusParent(n))visit({...n,active:enabled(n),sourceId:n.id},'pet');}}
 for(const c of devotions)for(const n of c.stars)if(build.stars.includes(n.id)){const cls=first(n.fields,'Class','');if(cls==='Skill_Passive'||/^Skill_(?:Buff|Aura)/.test(cls))visit({...n,name:c.name,rank:C.devotionRank(build,n),active:cls==='Skill_Passive'||!!build.buffs[n.id]});}
 for(const aura of g.RiftScenario?.sources(build,data,items,classes,devotions)||[]){visit({...aura,active:!!aura.enabled});visit({...aura,active:!!aura.enabled},'pet');}
 const local=[];
 for(const s of gear)for(const m of C.itemModifiers(s)){local.push({...m,scope:'character',context:'skill',active:!!nodes.get(m.target)?.rank});const id=canon(first(m.fields,'petSkillName',''));if(id&&m.refs?.[id])local.push({...m,id,fields:m.refs[id],scope:'summon',context:'skill',active:!!nodes.get(m.target)?.rank});}
 for(const n of nodes.values())if(n.rank&&!enabled(n)&&n.isModifier){const id=canon(first(n.fields,'petSkillName',''));local.push({...n,target:n.deps?.[0],scope:id?'summon':'character',context:'skill',active:true});if(id&&n.refs?.[id])local.push({...n,id,fields:n.refs[id],target:n.deps?.[0],scope:'summon',context:'skill',active:true});}
 return{character:rules(sources.filter(s=>s.scope==='character')),pet:rules(sources.filter(s=>s.scope==='pet')),local:rules(local)};
}
function summarize(rows){
 const active=rows.filter(r=>r.active!==false),froms=[...new Set(active.flatMap(r=>r.from==='Elemental'?elements:[r.from]))];
 return froms.map(from=>{const list=active.filter(r=>r.from===from||r.from==='Elemental'&&elements.includes(from)),total=list.reduce((n,r)=>n+r.pct,0),to=new Map();for(const r of list)for(const type of r.to==='Elemental'?elements:[r.to])to.set(type,(to.get(type)||0)+r.pct/Math.max(100,total)*100/(r.to==='Elemental'?3:1));return{from,total,remaining:Math.max(0,100-total),normalized:total>100,destinations:[...to].map(([type,pct])=>({type,pct})),sources:list};});
}
g.GrimWeaverConversions={rules,collect,summarize};
if(typeof module!=='undefined')module.exports=g.GrimWeaverConversions;
})(globalThis);
