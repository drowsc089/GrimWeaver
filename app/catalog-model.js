(function(g){
'use strict';
function createCatalog(){
 const attachments=new Set(['component','augment']);
 function normal(item){return item.obtainable===true&&item.availability?.status!=='unavailable'&&!item.empty&&!item.cosmetic&&(!attachments.has(item.category)||item.installable===true);}
 function filter(list,args,compatible=()=>true){
  const q=String(args.q||'').trim().toLowerCase();
  let matches=list.filter(x=>(args.allData||normal(x))&&(!q||[x.name?.en,x.name?.zh,x.searchText?.en,x.searchText?.zh,...x.aliases||[],...(args.allData?[x.id]:[])].some(v=>String(v||'').toLowerCase().includes(q)))&&(!args.rarity||x.rarity===args.rarity)&&(!args.weaponType||x.type===args.weaponType)&&(!args.awakenedOnly||x.awakened)&&(!args.levelOnly||x.level<=args.level)&&compatible(x,args));
  // Keep distinct records and acquisition variants; a shared name does not imply the same item.
  matches.sort((a,b)=>b.level-a.level||a.id.localeCompare(b.id));
  if(args.highest){const variants=new Map();for(const x of matches){const key=x.id.replace(/([a-z]\d{3})[a-z](?=_)/g,'$1#');const old=variants.get(key);if(!old||old.level<x.level)variants.set(key,x);}matches=[...variants.values()];}
  const offset=Math.max(0,Math.trunc(args.offset||0));
  return{items:matches.slice(offset,offset+60),total:matches.length};
 }
 return{normal,filter};
}
g.GrimWeaverCatalogFactory=createCatalog;
g.GrimWeaverCatalog=createCatalog();
if(typeof module!=='undefined')module.exports=g.GrimWeaverCatalog;
})(globalThis);
