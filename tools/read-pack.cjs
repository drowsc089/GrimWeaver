'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),z=require('node:zlib'),HOME=path.resolve(__dirname,'..');
function pack(name){let result;vm.runInNewContext(fs.readFileSync(path.join(HOME,'app/data',name+'.js'),'utf8'),{DawnData:{register(n,s){result=JSON.parse(z.gunzipSync(Buffer.from(s,'base64')));}}});return result;}
module.exports={pack,HOME};
