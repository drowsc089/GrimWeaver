/* GDC reader adapted from grim-save-parser, Copyright (c) 2024 Kirill Bulatov.
 * New block layouts also reference Grim Dawn Save Editor, Copyright (c) 2026 Zez (MIT).
 * MIT licenses are retained in the third-party source folders.
 * Read-only; no save writer or network transport is included. */
(function(root){
'use strict';
class Reader{
 constructor(buffer){this.bytes=new Uint8Array(buffer);this.dv=new DataView(buffer);this.pos=4;this.limit=this.bytes.length;if(this.limit<16||this.limit>5000000)throw Error('Invalid GDC size');this.key=(this.dv.getUint32(0,true)^0x55555555)>>>0;this.table=new Uint32Array(256);let k=this.key;for(let i=0;i<256;i++){k=Math.imul((k>>>1)|(k<<31),39916801)>>>0;this.table[i]=k;}}
 need(n){if(n<0||this.pos+n>this.limit)throw Error('Truncated GDC at '+this.pos);}
 u32(update=true){this.need(4);const p=this.pos,value=(this.dv.getUint32(p,true)^this.key)>>>0;if(update)for(let i=0;i<4;i++)this.key=(this.key^this.table[this.bytes[p+i]])>>>0;this.pos+=4;return value;}
 u8(){this.need(1);const raw=this.bytes[this.pos++],value=raw^(this.key&255);this.key=(this.key^this.table[raw])>>>0;return value;}
 f32(){const b=new ArrayBuffer(4),v=new DataView(b);v.setUint32(0,this.u32(),true);const x=v.getFloat32(0,true);if(!Number.isFinite(x))throw Error('Invalid GDC float');return x;}
 str(wide=false){const count=this.u32();if(count>32768)throw Error('Invalid GDC string');const bytes=new Uint8Array(count*(wide?2:1));this.need(bytes.length);for(let i=0;i<bytes.length;i++)bytes[i]=this.u8();return new TextDecoder(wide?'utf-16le':'utf-8',{fatal:true}).decode(bytes);}
 count(max=10000){const n=this.u32();if(n>max)throw Error('Invalid GDC collection');return n;}
 block(){const id=this.u32(),length=this.u32(false),end=this.pos+length;this.need(length+4);return{id,end,start:this.pos};}
 end(block,skip=false){if(this.pos>block.end)throw Error('GDC block overflow '+block.id);if(skip){/* An encoded zero trailer stores the current cipher state. */this.pos=block.end;this.key=this.dv.getUint32(this.pos,true);}else if(this.pos!==block.end)throw Error('Unexpected GDC block length '+block.id+' at '+this.pos+' expected '+block.end);if(this.u32(false)!==0)throw Error('Invalid GDC block trailer');}
 item(){const x={};for(const key of ['base','prefix','suffix','modifier','illusion'])x[key]=this.str();x.seed=this.u32();x.component=this.str();x.completion=this.str();x.componentSeed=this.u32();x.augment=this.str();x.unknown=this.u32();x.augmentSeed=this.u32();if(this.itemVersion>=8){x.ascended=this.str();x.ascendedSeed=this.u32();}x.var1=this.u32();x.stack=this.u32();if(this.itemVersion>=8)x.extra=[this.u32()];if(this.itemVersion>=11)x.extra.push(this.u32());return x;}
 equipment(){const x=this.item();x.attached=this.u8();return x;}
}
function parse(buffer){
 const r=new Reader(buffer),out={blocks:[]};if(r.u32()!==0x58434447||r.u32()!==2)throw Error('Unsupported GDC header');out.name=r.str(true);out.male=r.u8();out.classTag=r.str();out.level=r.u32();out.hardcore=r.u8();out.headerFlags=r.u8();if(![3,7].includes(out.headerFlags)||r.u32(false)!==0)throw Error('Invalid GDC header trailer');out.version=r.u32();if(out.version!==8)throw Error('Unsupported GDC body version '+out.version);for(let i=0;i<16;i++)r.u8();
 while(r.pos<r.limit){const block=r.block(),v=r.u32();out.blocks.push({id:block.id,version:v,bytes:block.end-block.start});
  if(block.id===1&&v===5){out.info={mainQuest:r.u8(),hasPlayed:r.u8(),difficulty:r.u8(),greatestDifficulty:r.u8(),money:r.u32(),survivalDifficulty:r.u8(),tribute:r.u32(),compass:r.u8(),skillHelp:r.u8(),weaponSwapActive:r.u8(),weaponSwapEnabled:r.u8()};r.end(block,true);}
  else if(block.id===2&&v===8){out.bio={};for(const k of ['level','experience','attributeUnspent','skillUnspent','devotionUnspent','devotionUnlocked'])out.bio[k]=r.u32();for(const k of ['physique','cunning','spirit','health','energy'])out.bio[k]=r.f32();r.end(block);}
  else if(block.id===3&&[4,8,11].includes(v)){r.itemVersion=v;const inv=out.inventory={equipment:[],weapons:[],bagItemCount:0};if(r.u8()){const bags=r.count(20);r.u32();r.u32();for(let i=0;i<bags;i++){const sack=r.block();if(sack.id!==0)throw Error('Invalid GDC bag');r.u8();const n=r.count();inv.bagItemCount+=n;for(let j=0;j<n;j++){r.item();r.u32();r.u32();}r.end(sack);}inv.alternate=r.u8();for(let i=0;i<12;i++)inv.equipment.push(r.equipment());for(let set=0;set<2;set++){r.u8();inv.weapons.push([r.equipment(),r.equipment()]);}}r.end(block);}
  else if(block.id===8&&v>=5&&v<=8){out.skills=[];let n=r.count();for(let i=0;i<n;i++){const s={id:r.str(),level:r.u32(),enabled:r.u8()};if(v>=7)r.u8();s.devotionLevel=r.u32();s.experience=r.u32();s.sublevel=r.u32();s.active=r.u8();s.transition=r.u8();s.autoCastSkill=r.str();s.autoCastController=r.str();out.skills.push(s);}out.masteriesAllowed=r.u32();r.u32();r.u32();out.itemSkills=[];n=r.count();for(let i=0;i<n;i++)out.itemSkills.push({id:r.str(),autoCastSkill:r.str(),autoCastController:r.str(),slot:r.u32(),item:r.str()});if(v>=6)r.u32();r.end(block);}
  else r.end(block,true);
 }
 if(!out.bio||!out.inventory||!out.skills)throw Error('Unsupported GDC data blocks: '+JSON.stringify(out.blocks));if(out.level!==out.bio.level||out.level<1||out.level>100)throw Error('Invalid GDC level');return out;
}
root.DawnSave={parse};if(typeof module!=='undefined')module.exports=root.DawnSave;
})(globalThis);
