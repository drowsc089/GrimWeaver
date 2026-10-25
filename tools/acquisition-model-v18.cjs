'use strict';
const first=(r,k,d)=>r?.[k]?.[0]??d;
const canon=s=>String(s||'').replaceAll('\\','/').toLowerCase();
function noDropReference(r,key,equipment=false){if(/^(merchant|vendor|shop|craft|trade|blueprint)/i.test(key))return false;return first(r,'dropItems',null)===false&&(equipment||/loot|equipment|inventory|weapon|armor/i.test(key));}
function activeReference(r,key,equipment=false){
 if(noDropReference(r,key,equipment))return false;
 let m=/^(lootName|randomizerName)(\d+)$/.exec(key);
 if(m){const w=r[(m[1]==='lootName'?'lootWeight':'randomizerWeight')+m[2]];if(w?.length&&w.every(x=>Number(x)<=0))return false;}
 m=/^(rarePrefix|prefix|rareSuffix|suffix)TableName(\d+)$/.exec(key);
 if(m&&r[m[1]+'TableWeight'+m[2]]?.every(x=>Number(x)<=0))return false;
 return !/reagent|itemSetName|setMembers|detectableNames|default.*Piece|templateName|^modifiedSkill|^modifierSkill|^augmentSkill|^augmentMastery|^petBonus|^itemSkill|^autoCast|^characterAttribute/i.test(key);
}
function references(r,db,category=()=>null){const out=[];for(const[key,a]of Object.entries(r))if(activeReference(r,key))for(const v of a){if(typeof v!=='string'||!v.toLowerCase().endsWith('.dbr'))continue;const id=canon(v);if(db[id]&&activeReference(r,key,!!category(db[id])))out.push({id,key});}return out;}
module.exports={activeReference,noDropReference,references};
