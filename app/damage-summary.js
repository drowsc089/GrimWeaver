(function(g){
'use strict';
function summarize(packets){
 const buckets={direct:new Map(),dot:new Map()};
 for(const p of packets||[]){
  const type=p.type,lo=p.finalLo??p.lo,hi=p.finalHi??p.hi??lo;
  if(typeof type!=='string'||!Number.isFinite(lo)||!Number.isFinite(hi)||lo<0||hi<lo)throw Error('Invalid final damage packet');
  if(lo===0&&hi===0)continue;
  const bucket=buckets[type.startsWith('Slow')?'dot':'direct'],row=bucket.get(type)||{type,lo:0,hi:0,sources:0};
  row.lo+=lo;row.hi+=hi;row.sources++;bucket.set(type,row);
 }
 return Object.fromEntries(Object.entries(buckets).map(([kind,bucket])=>{
  const rows=[...bucket.values()].sort((a,b)=>(b.lo+b.hi)-(a.lo+a.hi)||a.type.localeCompare(b.type)),lo=rows.reduce((n,r)=>n+r.lo,0),hi=rows.reduce((n,r)=>n+r.hi,0),mean=(lo+hi)/2;
  return[kind,{lo,hi,rows:rows.map(r=>({...r,share:mean>0?(r.lo+r.hi)/2/mean*100:0}))}];
 }));
}
function handPackets(hand){return(hand.detail||[]).map(r=>({type:r.type,finalLo:r.lo,finalHi:r.hi}));}
g.GrimWeaverDamageSummary={summarize,handPackets};
if(typeof module!=='undefined')module.exports=g.GrimWeaverDamageSummary;
})(globalThis);
