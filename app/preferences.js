(function(g){
'use strict';
const valid=x=>x==='zh'||x==='en',key='dawnbuild-language';
let current='zh',revision=0,queue=Promise.resolve();
try{const cached=g.localStorage.getItem(key);if(valid(cached))current=cached;}catch{}
const cache=()=>{try{g.localStorage.setItem(key,current);}catch{}};
async function write(language){try{const r=await fetch('/api/preferences',{method:'POST',headers:{'Content-Type':'application/json','X-GrimWeaver-Action':'preferences'},body:JSON.stringify({language}),signal:AbortSignal.timeout(2000)});return r.ok;}catch{return false;}}
const ready=(async()=>{try{const r=await fetch('/api/preferences',{cache:'no-store',signal:AbortSignal.timeout(1500)});if(r.ok){const saved=await r.json();if(!revision&&valid(saved.language))current=saved.language;else if(!revision)await write(current);}}catch{}cache();return current;})();
g.GrimWeaverPreferences={get language(){return current;},ready,set(language){if(!valid(language))return Promise.resolve(false);revision++;current=language;cache();queue=queue.then(()=>ready).then(()=>write(language));return queue;},flush(){return queue.then(()=>ready);}};
})(globalThis);
