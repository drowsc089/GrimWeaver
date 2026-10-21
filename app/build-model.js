(function(root){
'use strict';
const C=root.DawnCore, B=root.DawnCombat;
const weaponSlot=s=>/^weapon|^offhand/.test(s||'');
const direct=B.DAMAGE.filter(k=>!k.startsWith('Slow'));
const isWeapon=x=>x?.category==='weapon';
function sumFields(sources,key,build){return sources.reduce((n,s)=>{const actual=/Max$/.test(key)&&!s.fields[key]?key.replace(/Max$/,'Min'):key;return n+C.rollValue(C.at(s.fields,actual,s.rank),actual,s,build.settings.rollMode);},0);}
function hands(build,data,items,result){
 const all=C.bonuses(build,data,items),local=all.filter(s=>weaponSlot(s.slot)&&['weapon','offhand'].includes(items.get(build.equipment[s.slot]?.item)?.category)&&items.get(build.equipment[s.slot]?.item)?.type!=='weapon_offhand');
 const globalFlat=key=>{const fallback=/Max$/.test(key)?(result.ledger?result.ledger.filter(x=>x.scope==='character'&&x.key===key.replace(/Max$/,'Min')&&x.upperFallback).reduce((n,x)=>n+x.value,0):result.totals[key]?0:result.totals[key.replace(/Max$/,'Min')]||0):0;return(result.totals[key]||0)+fallback-sumFields(local,key,build);};
 const main=items.get(build.equipment['weapon'+build.weaponSet]?.item);
 const off=main?.twoHanded?null:items.get(build.equipment['offhand'+build.weaponSet]?.item);
 const mode=main?.twoHanded?'twoHanded':isWeapon(off)?'dualWield':off?.type==='weaponarmor_shield'?'shield':off?'caster':'single';
 const calculate=(slot,item,role)=>{
  const sources=local.filter(s=>s.slot===slot),map={};
  for(const type of B.DAMAGE){const lo='offensive'+type+'Min',hi='offensive'+type+'Max',base='offensiveBase'+type;
   map[type]={lo:globalFlat(lo)+sumFields(sources,lo,build)+C.at(item?.fields,base+'Min'),hi:globalFlat(hi)+sumFields(sources,hi,build)+C.at(item?.fields,base+'Max')};
   if(!map[type].hi)map[type].hi=map[type].lo;
  }
  const elementalLo=globalFlat('offensiveElementalMin')+sumFields(sources,'offensiveElementalMin',build),elementalHi=globalFlat('offensiveElementalMax')+sumFields(sources,'offensiveElementalMax',build)||elementalLo;
  for(const t of ['Fire','Cold','Lightning']){map[t].lo+=elementalLo/3;map[t].hi+=elementalHi/3;}
  delete map.Elemental;
  // Convert a snapshot simultaneously; a converted packet cannot convert again.
  const before=structuredClone(map),links=[];
  for(const s of all)for(const suffix of ['','1','2','3','4','5','6','7','8']){
   const from=String(C.first(s.fields,'conversionInType'+suffix,'')).replace(/^offensive/,'');const to=String(C.first(s.fields,'conversionOutType'+suffix,'')).replace(/^offensive/,'');
   const amount=C.at(s.fields,'conversionPercentage'+suffix,s.rank);if(map[from]&&map[to]&&from!==to&&amount>0)links.push({from,to,amount});
  }
  for(const from of new Set(links.map(x=>x.from))){const list=links.filter(x=>x.from===from),total=list.reduce((n,x)=>n+x.amount,0),scale=Math.min(100,total)/total/100;
   for(const link of list)for(const k of ['lo','hi']){const n=before[from][k]*link.amount*scale;map[from][k]-=n;map[link.to][k]+=n;}
  }
  const pierce=Math.min(100,(C.at(item?.fields,'offensivePierceRatioMin')||C.at(item?.fields,'offensivePierceRatio'))*(1+(result.totals.offensivePierceRatioModifier||0)/100))/100;
  for(const k of ['lo','hi']){const n=map.Physical[k]*pierce;map.Physical[k]-=n;map.Pierce[k]+=n;}
  const detail=Object.entries(map).filter(([,x])=>x.lo||x.hi).map(([type,x])=>({type,lo:x.lo*(1+B.bonusPercent(result,type)/100),hi:x.hi*(1+B.bonusPercent(result,type)/100)}));
  const directLo=detail.filter(x=>direct.includes(x.type)).reduce((n,x)=>n+x.lo,0),directHi=detail.filter(x=>direct.includes(x.type)).reduce((n,x)=>n+x.hi,0);
  const dotLo=detail.filter(x=>x.type.startsWith('Slow')).reduce((n,x)=>n+x.lo,0),dotHi=detail.filter(x=>x.type.startsWith('Slow')).reduce((n,x)=>n+x.hi,0);
  const lo=directLo+dotLo,hi=directHi+dotHi;
  const speed=Math.max(.1,Number(C.first(data.pc,'characterAttackSpeed',1.25))+C.at(item?.fields,'characterBaseAttackSpeed'));
  const aps=speed*Math.min(200,Math.max(10,100+(result.totals.characterAttackSpeedModifier||0)+(result.totals.characterTotalSpeedModifier||0)))/100;
  return{slot,role,item:item?.id||null,lo,hi,directLo,directHi,dotLo,dotHi,aps,dps:(lo+hi)/2*aps,detail,estimate:true};
 };
 const rows=[calculate('weapon'+build.weaponSet,main,'main')];
 if(isWeapon(off))rows.push(calculate('offhand'+build.weaponSet,off,'off'));
 else if(off?.type==='weaponarmor_shield')rows.push({...calculate('offhand'+build.weaponSet,off,'shield'),aps:null,dps:null});
 return{mode,rows,offhand:off?.id||null,combinedDps:mode==='dualWield'?null:rows[0].dps};
}
function masteryRanks(build,data,items,manifest){
 const sources=C.bonuses(build,data,items),all=sumFields(sources,'augmentAllLevel',build),map=new Map();
 for(const m of manifest.masteries){let specific=0;for(const s of sources)for(const[k,vs]of Object.entries(s.fields)){const n=/^augmentMasteryName(\d+)$/.exec(k);if(n&&C.canon(vs[0])===C.canon(m.training))specific+=C.at(s.fields,'augmentMasteryLevel'+n[1],s.rank);}
  if(specific)map.set(m.id,{id:m.id,name:m.name,specific,total:specific+all,selected:build.masteries.includes(m.id)});
 }
 return{all,masteries:[...map.values()].sort((a,b)=>Number(b.selected)-Number(a.selected)||Number(a.id)-Number(b.id))};
}
function baseFields(item){const fields={},other={};for(const[k,v]of Object.entries(item.fields||{})){
 const base=/^offensiveBase.*(?:Min|Max)$|^characterBaseAttackSpeed$|^offensivePierceRatio(?:Min|Max)?$|^defensiveProtection$|^defensiveBlockAmount$|^blockRecoveryTime$/.test(k);
 (base?fields:other)[k]=v;
 }return{base:fields,other};}
function dualAllowed(build,items,classes,ranged){
 if(build.innateSkills?.includes('records/skills/zenithuniversal/dualwield_'+(ranged?'ranged':'melee')+'.dbr'))return true;
 const check=r=>/PassiveDual(?:Wield|Ranged)/i.test(C.first(r,'Class',''))&&(!ranged?!/DualRanged/i.test(C.first(r,'Class','')):true);
 for(const c of classes)for(const s of c.skills)if(build.skills[s.id]>0&&(check(s.fields)||Object.values(s.refs||{}).some(check)))return true;
 for(const entry of Object.values(build.equipment))for(const id of Object.values(entry)){const x=items.get(id);if(x&&(check(x.fields)||Object.values(x.refs||{}).some(check)))return true;}
 return false;
}
const oldCalculate=C.calculate;
C.calculate=function(build,data,items,classes,devotions){const result=oldCalculate(build,data,items,classes,devotions);result.hands=hands(build,data,items,result);result.hit=result.hands.rows[0];
 if(result.hands.mode==='dualWield'&&!dualAllowed(build,items,classes,/ranged/i.test(items.get(result.hands.rows[0].item)?.type||'')))result.warnings.push('dualWieldRequired');
 return result;
};
const oldEquip=C.equip;
C.equip=function(build,slot,kind,item,items){
 if(kind==='item'&&/^offhand/.test(slot)&&isWeapon(item)){
  const main=items.get(build.equipment['weapon'+slot.slice(-1)]?.item);if(item.twoHanded)throw Error('wrongSlot');if(main?.twoHanded)throw Error('twoHanded');
  if(main&&/ranged/i.test(main.type)!==/ranged/i.test(item.type))throw Error('mixedWeapons');
  const out=structuredClone(build);out.equipment[slot]={item:item.id};return out;
 }
 if(kind==='item'&&/^weapon/.test(slot)&&item&&!item.twoHanded){const off=items.get(build.equipment['offhand'+slot.slice(-1)]?.item);if(isWeapon(off)&&/ranged/i.test(off.type)!==/ranged/i.test(item.type))throw Error('mixedWeapons');}
 return oldEquip(build,slot,kind,item,items);
};
root.DawnBuildModel={hands,masteryRanks,baseFields,dualAllowed,starCenter:32};
if(typeof module!=='undefined')module.exports=root.DawnBuildModel;
})(globalThis);
