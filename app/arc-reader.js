// ARC v3 stores an explicit string offset for every TOC record, including empty records.
(function(root){
'use strict';
const parser=typeof module!=='undefined'?require('./rem-data.js'):root.RemData;
async function parse(file){
 const buffer=await file.arrayBuffer(),bytes=new Uint8Array(buffer),dv=new DataView(buffer);
 if(bytes.length<28||dv.getUint32(0,true)!==0x435241||dv.getInt32(4,true)!==3)throw Error('Unsupported ARC header');
 const count=dv.getUint32(8,true),partsCount=dv.getUint32(12,true),partsBytes=dv.getUint32(16,true),stringsBytes=dv.getUint32(20,true),partsOffset=dv.getUint32(24,true),stringsOffset=partsOffset+partsBytes,tocOffset=stringsOffset+stringsBytes;
 if(count>1000000||partsCount>10000000||partsBytes<partsCount*12||tocOffset+count*44>bytes.length)throw Error('Invalid ARC index bounds');
 const parts=Array.from({length:partsCount},(_,i)=>{const p=partsOffset+i*12;return[dv.getUint32(p,true),dv.getUint32(p+4,true),dv.getUint32(p+8,true)];});
 const names=[],tocs=[],decoder=new TextDecoder('utf-8',{fatal:true});
 for(let i=0;i<count;i++){
  const p=tocOffset+i*44,type=dv.getUint32(p,true),lenDecomp=dv.getUint32(p+12,true),numParts=dv.getUint32(p+28,true),nameLength=dv.getUint32(p+36,true),nameOffset=dv.getUint32(p+40,true);
  if(nameOffset>stringsBytes||nameLength>stringsBytes-nameOffset)throw Error('Invalid ARC filename offset');
  const start=stringsOffset+nameOffset;let end=start;while(end<stringsOffset+stringsBytes&&bytes[end]!==0)end++;
  names.push(decoder.decode(bytes.subarray(start,end)));
  tocs.push({type,offset:dv.getUint32(p+4,true),lenComp:dv.getUint32(p+8,true),lenDecomp,numParts,index:dv.getUint32(p+32,true),nameLength,nameOffset,explicitName:true});
 }
 return{bytes,names,tocs,parts};
}
function indexes(names,tocs){if(names.length!==tocs.length||tocs.some(t=>!t.explicitName))throw Error('ARC index must be read with explicit filename offsets');return tocs.map((t,i)=>t.lenDecomp>0?i:null);}
async function text(file){const arc=await parse(file),out={},decoder=new TextDecoder('utf-8');for(let i=0;i<arc.names.length;i++){if(!/\.txt$/i.test(arc.names[i])||!arc.tocs[i].lenDecomp)continue;const bytes=parser.directExtractArcEntry(arc.bytes,arc.tocs,arc.parts,i);for(let line of decoder.decode(bytes).split(/\r?\n/)){line=line.replace(/\0/g,'').trim();if(!line||line.startsWith('//'))continue;const eq=line.indexOf('=');if(eq>0)out[line.slice(0,eq).trim()]=line.slice(eq+1).trim();}}return out;}
parser.directParseArcIndex=parse;parser.directDetermineTocIndexes=indexes;parser.directParseTextArc=text;
root.RemData=parser;if(typeof module!=='undefined')module.exports=parser;
})(globalThis);
