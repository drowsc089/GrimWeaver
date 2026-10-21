(function(g){
'use strict';
const C=g.DawnCore,{first,at,canon}=C;let bundle=null;
function install(data){bundle=data;}
function sources(b,data,items,classes,devotions){
 if(!bundle)return[];
 const gear=C.bonuses(b,data,items),nodes=classes.flatMap(c=>c.skills.map(s=>({...s,rank:C.skillRank(b,s,data,items,c)}))).filter(s=>s.rank>0),summons=[];
 for(const n of nodes)if(!n.fields.modSpawnObjects)summons.push(n);
 for(const s of gear)for(const key of ['itemSkillName','autoCastSkill']){const id=canon(first(s.fields,key,''));if(id&&!(s.kind==='set'&&s.fields.itemSkillLevel&&at(s.fields,'itemSkillLevel',s.rank)<=0))summons.push({id,fields:s.refs?.[id],refs:s.refs,rank:g.DawnCombat.grantRank(s.fields)});}
 for(const c of devotions||[])for(const s of c.stars)if(b.stars.includes(s.id))summons.push({...s,rank:C.devotionRank(b,s)});
 const found=new Map();
 for(const summon of summons){
  const def=bundle.summons[summon.id];if(!def)continue;
  const transmuter=nodes.find(n=>n.fields.modSpawnObjects&&n.deps?.includes(summon.id));
  const paths=transmuter?.fields.modSpawnObjects||def.fields.spawnObjects||[],pet=bundle.pets[canon(paths[Math.min(summon.rank-1,paths.length-1)])];if(!pet)continue;
  for(const skill of pet.skills){const fields=bundle.refs[skill.id],child=bundle.refs[canon(first(fields,'buffSkillName',''))];
   if(!/^Skill_BuffRadius(?:Toggled)?$/.test(first(fields,'Class',''))||first(child,'Class','')!=='SkillBuff_Passive')continue;
   let rank=Math.floor(g.DawnCombat.formula(skill.level,{CHARLEVEL:b.level})||0);
   for(const s of gear)for(let i=1;i<=12;i++)if(canon(first(s.fields,'augmentSkillName'+i,''))===skill.id)rank+=at(s.fields,'augmentSkillLevel'+i,s.rank);
   const modifier=nodes.find(n=>canon(first(n.fields,'petSkillName',''))===skill.id);if(modifier)rank=modifier.rank;
   if(rank<=0)continue;
   const id='pet-aura:'+skill.id,tag=canon(first(child,'skillDisplayName','')),name={zh:data.tags.zh[tag]||skill.name?.zh||pet.name.zh,en:data.tags.en[tag]||skill.name?.en||pet.name.en},permanent=first(fields,'Class','').endsWith('Toggled');
   const row={id,skillId:skill.id,name,petName:pet.playerScaled?summon.name||pet.name:pet.name,rank,fields,refs:bundle.refs,kind:'aura',permanent,icon:summon.icon,enabled:permanent?b.buffs[id]!==false:!!b.buffs[id]};
   if(!found.has(id)||found.get(id).rank<rank)found.set(id,row);
  }
 }
 return[...found.values()];
}
const before=C.calculate;
C.calculate=function(b,data,items,classes,devotions){const r=before(b,data,items,classes,devotions),v=r.totals;
 r.energyReserved=Math.max(0,(v.characterManaLimitReserve||0)*(1-(v.characterManaLimitReserveReduction||0)/100));r.energyAvailable=Math.max(0,r.mana-r.energyReserved);
 r.healthRegen=(Number(first(data.pc,'characterLifeRegen',1))+(r.attributes.characterStrength-50)*.05+(v.characterLifeRegen||0))*(1+(v.characterLifeRegenModifier||0)/100);
 r.energyRegen=(Number(first(data.pc,'characterManaRegen',1))+(r.attributes.characterIntelligence-50)*.01+(v.characterManaRegen||0))*(1+(v.characterManaRegenModifier||0)/100+(r.attributes.characterIntelligence-50)*.0026);
 r.speeds={attack:Math.min(first(data.engine,'playerAttackSpeedCapMax',200),100+(v.characterAttackSpeedModifier||0)+(v.characterTotalSpeedModifier||0)),cast:Math.min(first(data.engine,'playerSpellCastSpeedCapMax',200),100+(v.characterSpellCastSpeedModifier||0)+(v.characterTotalSpeedModifier||0)),run:Math.min(first(data.engine,'playerRunSpeedCapMax',135),100+(v.characterRunSpeedModifier||0)+(v.characterTotalSpeedModifier||0))};
 r.control=Object.fromEntries(['Stun','Trap','Petrify','Freeze','Sleep','TotalSpeedResistance','SlowLifeLeach','SlowManaLeach','Disruption','Reflection'].map(type=>[type,Math.min(first(data.engine,'playerDefenseCap',80),Math.max(0,v['defensive'+type]||0)+(data.penalties['defensive'+type]?.[{normal:0,elite:4,ultimate:8,ascendant:8}[b.difficulty]]||0))]));
 return r;
};
g.RiftScenario={install,sources,get data(){return bundle;}};
if(typeof module!=='undefined')module.exports=g.RiftScenario;
})(globalThis);
