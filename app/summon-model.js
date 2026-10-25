(function(g){
'use strict';
const C=g.DawnCore,B=g.DawnCombat,{first,at,canon}=C;
const creature=f=>['Pet','PetPlayerScaling','Monster'].includes(first(f,'Class',''));
const playerScaling=f=>first(f,'Class','')==='PetPlayerScaling'||/petplayerscaling/i.test(first(f,'templateName',''));
const passive=f=>['Skill_Passive','Skill_Modifier'].includes(first(f,'Class',''));
function skills(fields,rank,charLevel,modifiers=[],gear=[],learned=[]){
 const out=new Map(),vars={charLevel,CHARLEVEL:charLevel,monsterLevel:charLevel,skillLevel:rank};
 for(const key of Object.keys(fields)){const m=/^skillName(\d+)$/.exec(key);if(!m)continue;const id=canon(first(fields,key,'')),raw=first(fields,'skillLevel'+m[1],0),level=Math.max(0,Math.floor(B.formula(raw,vars)||0));if(id)out.set(id,Math.max(level,out.get(id)||0));}
 for(const m of modifiers){const id=canon(first(m.fields,'petSkillName',''));if(id)out.set(id,(out.get(id)||0)+(m.rank||1));}
 for(const n of learned){const id=canon(first(n.fields,'petSkillName',''));if(id)out.set(id,Math.max(out.get(id)||0,n.rank||0));}
 for(const s of gear)for(const key of Object.keys(s.fields)){const m=/^augmentSkillName(\d+)$/.exec(key);if(!m)continue;const id=canon(first(s.fields,key,''));if(out.has(id))out.set(id,Math.max(0,out.get(id)+at(s.fields,'augmentSkillLevel'+m[1],s.rank)));}
 return out;
}
g.GrimWeaverSummons={creature,playerScaling,passive,skills};
if(typeof module!=='undefined')module.exports=g.GrimWeaverSummons;
})(globalThis);
