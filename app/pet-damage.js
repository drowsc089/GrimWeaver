(function(g){
'use strict';
const C=g.DawnCore,B=g.DawnCombat,D=g.GrimWeaverSkillDamage,V=g.GrimWeaverConversions,S=g.GrimWeaverSummons,{at,first,canon}=C;
function analyze(p,skill){
 if(S.passive(skill.fields))return{groups:[],missing:[]};
 const groups=[],missing=[],seen=new Set(),rootMods=(p.modifiers||[]).filter(m=>m.target===skill.id),baseFields=Object.fromEntries(Object.entries(p.base).map(([k,v])=>[k,[v]])),finalFields=Object.fromEntries(Object.entries(p.final).map(([k,v])=>[k,[v]]));
 function visit(id,fields,rank,depth=0){
  if(!fields){missing.push(id);return;}if(depth>20||seen.has(id))return;seen.add(id);
  const mods=(p.modifiers||[]).filter(m=>m.target===id),sources=[{id,fields,rank},...mods],local=[...sources,...(id===skill.id?[]:rootMods)],packets=[];
  const pct=local.reduce((n,s)=>n+at(s.fields,'weaponDamagePct',s.rank),0),basePct=at(fields,'weaponDamagePct',rank);
  for(const type of B.DAMAGE){
   const base=D.amount(fields,type,rank),modified=sources.reduce((n,s)=>{const a=D.amount(s.fields,type,s.rank);return{lo:n.lo+a.lo,hi:n.hi+a.hi};},{lo:0,hi:0});
   if(modified.lo||modified.hi)packets.push({type,origin:'skill',baseLo:base.lo,baseHi:base.hi,modifiedLo:modified.lo,modifiedHi:modified.hi,duration:at(fields,'offensive'+type+'DurationMin',rank)});
   if(pct){const lo=D.amount(baseFields,type),hi=D.amount(finalFields,type),native={lo:lo.lo+at(p.fields,'offensiveBase'+type+'Min'),hi:lo.hi+(at(p.fields,'offensiveBase'+type+'Max')||at(p.fields,'offensiveBase'+type+'Min'))},modifiedWeapon={lo:hi.lo+at(p.fields,'offensiveBase'+type+'Min'),hi:hi.hi+(at(p.fields,'offensiveBase'+type+'Max')||at(p.fields,'offensiveBase'+type+'Min'))};if(modifiedWeapon.lo||modifiedWeapon.hi)packets.push({type,origin:'weapon',baseLo:native.lo*basePct/100,baseHi:native.hi*basePct/100,modifiedLo:modifiedWeapon.lo*pct/100,modifiedHi:modifiedWeapon.hi*pct/100,duration:at(fields,'offensive'+type+'DurationMin',rank)||3});}
  }
  const localRules=[...V.rules(local),...V.rules(p.passiveSources||[])],converted=D.convertPackets(packets,localRules,p.conversionSources||[]).map(x=>{
   const own=local.reduce((n,s)=>n+D.percentage(s.fields,x.sourceType,s.rank),0),bonus=B.bonusPercent({totals:p.final,attributes:{characterDexterity:p.final.characterDexterity||0,characterIntelligence:p.final.characterIntelligence||0}},x.type),more=Math.max(0,1+((p.final.offensiveDamageMultModifier||0)+local.reduce((n,s)=>n+at(s.fields,'offensiveDamageMultModifier',s.rank),0))/100),scale=Math.max(0,1+(bonus+own)/100)*more;
   return{...x,convertedLo:x.modifiedLo*x.portion,convertedHi:x.modifiedHi*x.portion,finalLo:x.modifiedLo*x.portion*scale,finalHi:x.modifiedHi*x.portion*scale,globalPercent:bonus,duration:x.type.startsWith('Slow')?(x.duration||0)*Math.max(0,1+(p.final['offensive'+x.type+'DurationModifier']||0)/100):0};
  });
  if(converted.length){const direct=converted.filter(x=>!x.type.startsWith('Slow')),dot=converted.filter(x=>x.type.startsWith('Slow'));groups.push({id,name:{en:'',zh:''},rank,packets:converted,weaponPct:pct,directLo:direct.reduce((n,x)=>n+x.finalLo,0),directHi:direct.reduce((n,x)=>n+x.finalHi,0),dotLo:dot.reduce((n,x)=>n+x.finalLo,0),dotHi:dot.reduce((n,x)=>n+x.finalHi,0)});}
  for(const[key,a]of Object.entries(fields))if(D.effectLink(key)&&!['spawnObjects','modSpawnObjects'].includes(key)){const raw=a[Math.min(rank-1,a.length-1)];if(typeof raw!=='string'||!raw.endsWith('.dbr'))continue;const child=canon(raw),r=p.refs[child];if(r&&!S.passive(r)&&!S.creature(r))visit(child,r,key==='autoCastSkill'?at(fields,'autoCastSkillLevel',rank)||rank:rank,depth+1);else if(!r)missing.push(child);}
 }
 visit(skill.id,skill.fields,skill.rank);return{groups,missing};
}
const basic=p=>({id:p.id+'#basic',fields:{Class:['Skill_AttackWeapon'],weaponDamagePct:[100]},rank:1,name:{en:'Basic pet attack',zh:'战宠普通攻击'}});
B.petDamage=(p,skill)=>analyze(p,skill).groups.flatMap(group=>group.packets.map(x=>({...x,lo:x.baseLo*x.portion,hi:x.baseHi*x.portion,effectId:group.id})));
g.GrimWeaverPetDamage={analyze,basic};
if(typeof module!=='undefined')module.exports=g.GrimWeaverPetDamage;
})(globalThis);
