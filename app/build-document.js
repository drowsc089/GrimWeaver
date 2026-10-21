(function(g){
'use strict';
const VERSION=1,MAX_NOTES=30000;
function today(){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
function defaults(){return{author:'',idea:'',createdAt:today(),updatedAt:today(),modVersion:'v97d',gameVersion:'v1.3.1.1',videoUrl:'',videoPath:''};}
function validateMetadata(m){if(!m||typeof m!=='object'||Array.isArray(m))throw Error('Invalid build metadata');for(const[key,max]of Object.entries({author:256,idea:MAX_NOTES,createdAt:10,updatedAt:10,modVersion:128,gameVersion:128,videoUrl:4096,videoPath:4096})){if(m[key]!==undefined&&(typeof m[key]!=='string'||m[key].length>max))throw Error('Invalid build metadata: '+key);}
 for(const key of ['createdAt','updatedAt'])if(m[key]){if(!/^\d{4}-\d\d-\d\d$/.test(m[key])||new Date(m[key]+'T00:00:00Z').toISOString().slice(0,10)!==m[key])throw Error('Invalid build date');}
 if(m.videoUrl){let u;try{u=new URL(m.videoUrl);}catch{throw Error('Invalid video URL');}if(!['http:','https:'].includes(u.protocol)||u.username||u.password)throw Error('Invalid video URL');}return m;}
function normalize(input,manifest){if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Invalid build document');const source=input.build&&input.documentType==='GrimWeaverBuild'?input.build:input,out=structuredClone(source);
 if(out.schemaVersion!==1)throw Error('Unsupported build schema');
 out.documentVersion=out.documentVersion||VERSION;out.metadata={...defaults(),createdAt:'',updatedAt:'',...(out.metadata||{})};validateMetadata(out.metadata);
 // Preserve unknown fields verbatim. The allocation schema and DB1 codec remain stable.
 out.buildId=out.buildId||g.crypto?.randomUUID?.()||'build-'+Date.now().toString(36);
 if(manifest&&JSON.stringify(out.dataHashes)!==JSON.stringify(manifest.layers.map(x=>x.sha256))){
  if(!/^GAL-v[\w.-]+$/i.test(out.environment||''))throw Error('Environment / version mismatch');
  out.compatibility={...(out.compatibility||{}),sourceEnvironment:out.compatibility?.sourceEnvironment||out.environment,sourceDataHashes:out.compatibility?.sourceDataHashes||out.dataHashes,migrationRequired:true};
  out.environment=manifest.id;out.dataHashes=manifest.layers.map(x=>x.sha256);
 }
 return out;}
function rr(base,stacking=[],percent=[],flat=[]){const strongest=a=>Math.max(0,...a),sum=stacking.reduce((s,x)=>s+x,0),afterStack=base-sum,mult=strongest(percent),afterPercent=afterStack*(1-Math.sign(afterStack)*mult/100),fixed=strongest(flat);return{base,stacking:sum,percent:mult,flat:fixed,afterStack,afterPercent,final:afterPercent-fixed};}
const api={VERSION,defaults,today,validateMetadata,normalize,rr};g.GrimWeaverDocument=api;if(typeof module!=='undefined')module.exports=api;
if(g.DawnCore){const original=g.DawnCore.empty;g.DawnCore.empty=function(manifest){return normalize({...original(manifest),metadata:defaults()});};}
})(globalThis);
