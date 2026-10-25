'use strict';
const fs=require('node:fs'),path=require('node:path');
const {load,canon}=require('./load-db.cjs'),{pack,HOME}=require('./read-pack.cjs');
const C=require('../app/core.js');
const first=C.first;
const slots={armor_head:'head',armor_shoulders:'shoulders',armor_chest:'chest',armor_hands:'hands',armor_legs:'legs',armor_feet:'feet',armor_waist:'belt',jewelry_amulet:'amulet',jewelry_ring:'ring',jewelry_medal:'medal',itemartifact:'relic',weapon_offhand:'offhand',weaponarmor_shield:'offhand',itemrelic:'component',itemenchantment:'augment'};
const template=r=>canon(first(r,'templateName','')).split('/').at(-1).replace(/\.tpl$/,'');
const category=r=>slots[template(r)]||(template(r).startsWith('weapon_')?'weapon':template(r)==='lootrandomizer'?'affix':null);
function audit(){
 const db=load(),core=pack('core'),items=new Map(),groups={};
 for(const cat of Object.keys(core.manifest.counts)){let data;try{data=pack(cat);}catch{continue;}if(data.items){groups[cat]=data;for(const x of data.items)items.set(x.id,x);}}
 const candidates=Object.entries(db).filter(([id,r])=>category(r)),incoming=new Map();
 for(const[id,r]of Object.entries(db))for(const[key,a]of Object.entries(r))for(const v of a)if(typeof v==='string'&&items.has(canon(v))){const dest=canon(v);if(!incoming.has(dest))incoming.set(dest,[]);incoming.get(dest).push({id,key,template:template(r)});}
 const rawTypes={};for(const[id,r]of candidates){const t=template(r);rawTypes[t]||={count:0,missing:[],sample:[]};rawTypes[t].count++;if(!items.has(id))rawTypes[t].missing.push(id);if(rawTypes[t].sample.length<3)rawTypes[t].sample.push({id,fields:Object.fromEntries(Object.entries(r).filter(([k])=>/class|type|tag|level|name|style/i.test(k)&&!/sound|fx|mesh/i.test(k)))});}
 const awakened=[...items.values()].filter(x=>/awakened/.test(x.id)).map(x=>({id:x.id,name:x.name,category:x.category,obtainable:x.obtainable,incoming:incoming.get(x.id)||[]}));
 const report={rawRecords:Object.keys(db).length,rawTypes,counts:Object.fromEntries(Object.entries(groups).map(([k,v])=>[k,{total:v.items.length,obtainable:v.items.filter(x=>x.obtainable).length,awakened:v.items.filter(x=>/awakened/.test(x.id)).length}])),awakened,weaponFields:[...items.values()].filter(x=>x.category==='weapon').slice(0,6).map(x=>({id:x.id,type:x.type,name:x.name,fields:Object.fromEntries(Object.entries(db[x.id]||{}).filter(([k])=>/class|type|tag|level|name/i.test(k)&&!/sound|fx|mesh|modifiedskill|augment/i.test(k)))}))};
 fs.mkdirSync(path.join(HOME,'verification'),{recursive:true});fs.writeFileSync(path.join(HOME,'verification/v18-initial-audit.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({records:report.rawRecords,counts:report.counts,rawTypes:Object.fromEntries(Object.entries(rawTypes).map(([k,v])=>[k,{total:v.count,missing:v.missing.length}])),awakened:{total:awakened.length,obtainable:awakened.filter(x=>x.obtainable).length,hiddenWithReferences:awakened.filter(x=>!x.obtainable&&x.incoming.length).slice(0,5)},weaponFields:report.weaponFields.slice(0,2)},null,2));
 return {db,core,items,groups,incoming,report};
}
module.exports={audit,category,template};
if(require.main===module)audit();
