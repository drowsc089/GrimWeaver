'use strict';
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const ROOT=process.env.GRIMWEAVER_DATABASE_CACHE||path.resolve(__dirname,'../data-cache');
const canon=p=>String(p||'').replaceAll('\\','/').toLowerCase();
function load(provenance){const db={};if(provenance){provenance.introduced={};provenance.last={};}for(const layer of ['原版本体','原版AOM','原版FG','原版FOA','GAL']){const data=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(ROOT,layer+'全量数据库.json.gz'))));for(const[id,r]of Object.entries(data)){const key=canon(id);db[key]=r;if(provenance){provenance.introduced[key]??=layer;provenance.last[key]=layer;}}}return db;}
module.exports={load,canon,ROOT};
if(require.main===module){const db=load(),q=process.argv[2]||'',field=process.argv[3];let found=Object.entries(db).filter(([id,r])=>id.includes(q)||Object.values(r).some(a=>a.some(v=>typeof v==='string'&&v.includes(q))));if(process.argv.includes('--paths'))console.log(found.slice(0,100).map(([id,r])=>[id,r.Class,r.templateName]));else console.log(JSON.stringify(found.slice(0,15).map(([id,r])=>[id,field?Object.fromEntries(Object.entries(r).filter(([k])=>new RegExp(field,'i').test(k))):r]),null,2));}
