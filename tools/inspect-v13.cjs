'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),z=require('node:zlib');
const HOME=path.resolve(__dirname,'..'),APP=path.join(HOME,'app');
function pack(n){let out;vm.runInNewContext(fs.readFileSync(path.join(APP,'data',n+'.js'),'utf8'),{DawnData:{register(k,s){out=JSON.parse(z.gunzipSync(Buffer.from(s,'base64')));}}});return out;}
global.RemData=require(path.join(APP,'arc-reader.js'));global.DawnCore=require(path.join(APP,'core.js'));require(path.join(APP,'combat.js'));require(path.join(APP,'build-model.js'));
if(fs.existsSync(path.join(APP,'scenario-model.js')))require(path.join(APP,'scenario-model.js'));
async function fixture(){
 const data=pack('core'),ctx={TextDecoder,Uint8Array,Uint32Array,DataView,ArrayBuffer};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(APP,'save-reader.js'),'utf8'),ctx);
 const file=process.env.GRIMWEAVER_TEST_SAVE||'',bytes=fs.readFileSync(file),raw=ctx.DawnSave.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
 const out=await require(path.join(APP,'save-import.js')).convert(raw,data.manifest,pack),b=out.build,ids=new Set(Object.values(b.equipment).flatMap(Object.values)),items=new Map();
 for(const cat of new Set([...Object.keys(b.equipment).map(DawnCore.slotCategory),'component','augment','prefix','suffix','ascended','completion']))for(const x of pack(cat).items)if(ids.has(x.id))items.set(x.id,x);
 const classes=b.masteries.filter(Boolean).map(x=>pack('class-'+x)),devotions=pack('devotions').constellations;
 if(global.RiftScenario)RiftScenario.install(pack('scenarios'));
 return{b,data,items,classes,devotions,raw,report:out.report,pack};
}
module.exports={fixture,pack,HOME};
if(require.main===module)fixture().then(f=>{
 const {b,data,items,classes,devotions}=f,C=DawnCore;
 for(const c of classes)for(const s of c.skills)if(b.skills[s.id]&&/Buff|Aura/.test(s.class))b.buffs[s.id]=true;
 const r=C.calculate(b,data,items,classes,devotions);
 console.log(JSON.stringify({buffs:b.buffs,attributes:r.attributes,life:r.life,mana:r.mana,oa:r.oa,da:r.da,armor:r.armor,hit:r.hit,totals:r.totals,pet:r.pet,auras:r.auras,sets:C.bonuses(b,data,items).filter(s=>s.kind==='set').map(s=>({id:s.id,rank:s.rank,fields:s.fields})),learned:classes.flatMap(c=>c.skills.filter(s=>b.skills[s.id]).map(s=>({id:s.id,rank:b.skills[s.id],effective:C.skillRank(b,s,data,items,c),class:s.class,fields:Object.fromEntries(Object.entries(s.fields).filter(([k])=>/petSkill|buffSkill|spawnObject|skillDuration|Reserve|buffRadius/.test(k)))})))},null,2));
});
