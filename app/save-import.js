(function(root){
'use strict';
async function convert(raw,manifest,load){
 const C=root.DawnCore,build=C.empty(manifest),core=await load('core'),issues=[],report={level:raw.level,blocks:raw.blocks,issues,gear:[],ignoredSkills:[],bindings:0};
 build.name=raw.name;build.level=raw.level;build.gender=raw.male?'male':'female';build.weaponSet=raw.inventory.alternate?2:1;
 build.difficulty=raw.info?.difficulty&128?'ascendant':['normal','elite','ultimate'][raw.info?.difficulty&127]||'ultimate';
 build.attributes=['physique','cunning','spirit'].map((key,i)=>{const field=['characterStrength','characterDexterity','characterIntelligence'][i],inc=['strengthIncrement','dexterityIncrement','intelligenceIncrement'][i],n=(raw.bio[key]-C.first(core.pc,field,50))/C.first(core.levels,inc,8);if(n<0||Math.abs(n-Math.round(n))>.01)throw Error('Unsupported saved attribute allocation');return Math.round(n);});
 build.questAttributePoints=Math.max(0,build.attributes.reduce((s,x)=>s+x,0)+raw.bio.attributeUnspent-(build.level-1));
 const rawSkills=new Map(raw.skills.map(s=>[C.canon(s.id),s]));const chosen=manifest.masteries.filter(m=>rawSkills.get(C.canon(m.training))?.level>0);if(chosen.length>2)throw Error('Unsupported multi-mastery save');build.masteries=chosen.map(m=>m.id);while(build.masteries.length<2)build.masteries.push(null);
 build.innateSkills=raw.skills.filter(s=>s.level>0&&/^records\/skills\/zenithuniversal\/dualwield_(?:melee|ranged)\.dbr$/i.test(C.canon(s.id))).map(s=>C.canon(s.id));
 const classes=[];for(const m of chosen)classes.push(await load('class-'+m.id));const known=new Set();
 for(const c of classes)for(const s of [c.training,...c.skills]){known.add(s.id);const saved=rawSkills.get(s.id);if(!saved?.level)continue;if(saved.level>s.max){issues.push({kind:'skillRank',id:s.id,saved:saved.level,maximum:s.max});continue;}build.skills[s.id]=saved.level;if(/BuffSelfToggled|BuffRadiusToggled/.test(C.first(s.fields,'Class','')))build.buffs[s.id]=true;}
 const points=Object.values(build.skills).reduce((s,n)=>s+n,0)+raw.bio.skillUnspent;build.questSkillPoints=0;build.questSkillPoints=Math.max(0,points-C.skillBudget(build,core));
 const devotions=(await load('devotions')).constellations,starMap=new Map(devotions.flatMap(c=>c.stars).map(s=>[s.id,s]));build.devotionLevels={};
 for(const s of raw.skills){const id=C.canon(s.id);if(!s.level)continue;if(starMap.has(id)){build.stars.push(id);build.devotionLevels[id]=Math.min(C.devotionMax(starMap.get(id)),Number.isInteger(s.devotionLevel)&&s.devotionLevel>0?s.devotionLevel:1);known.add(id);}else if(!known.has(id)){report.ignoredSkills.push(id);if(!/\/default\/|\/zenithuniversal\//.test(id))issues.push({kind:'unknownSkill',id});}}
 const cache=new Map();async function get(kind,id){id=C.canon(id);if(!cache.has(kind)){const pack=await load(kind);cache.set(kind,new Map((pack.items||[]).map(x=>[x.id,x])));}return cache.get(kind).get(id);}
 const slots=['head','amulet','chest','legs','feet','hands','ring1','ring2','belt','shoulders','medal','relic'];build.importedRolls={};
 async function equip(saved,slot){if(!saved?.base)return;const base=await get(C.slotCategory(slot),saved.base)||(/^offhand/.test(slot)?await get('weapon',saved.base):null);if(!base){issues.push({kind:'unknownItem',slot,id:saved.base});return;}const entry=build.equipment[slot]={item:base.id};build.importedRolls[slot]={seed:saved.seed,componentSeed:saved.componentSeed,augmentSeed:saved.augmentSeed,ascendedSeed:saved.ascendedSeed,completionLevel:saved.var1,illusion:saved.illusion};
  for(const kind of ['prefix','suffix','component','augment','ascended','completion'])if(saved[kind]){const item=await get(kind,saved[kind]);if(item)entry[kind]=item.id;else issues.push({kind:'unknownAttachment',slot,attachment:kind,id:saved[kind]});}
  if(saved.modifier)issues.push({kind:'unsupportedModifier',slot,id:saved.modifier});report.gear.push({slot,name:base.name,attachments:Object.keys(entry).filter(k=>k!=='item')});
 }
 for(let i=0;i<slots.length;i++)await equip(raw.inventory.equipment[i],slots[i]);for(let set=0;set<2;set++)for(let hand=0;hand<2;hand++)await equip(raw.inventory.weapons[set]?.[hand],(hand?'offhand':'weapon')+(set+1));
 for(const s of [...raw.skills,...raw.itemSkills]){if(!s.autoCastSkill)continue;const id=C.canon(s.autoCastSkill),c=devotions.find(c=>c.stars.some(star=>star.id===id||C.canon(C.first(star.fields,'skillName',''))===id));if(c){build.bindings[c.id]=C.canon(s.id);report.bindings++;}}
 report.masteries=classes.map(c=>c.name);report.skillPoints=Object.values(build.skills).reduce((s,n)=>s+n,0);report.devotionPoints=build.stars.length;report.attributePoints=build.attributes.reduce((s,n)=>s+n,0);report.buffState='常驻专精光环默认开启；存档未可靠保存当前临时战斗增益状态';report.rolls='保留物品种子供后续使用，当前按所选平均/近似范围计算，不伪装成存档实际掷值';C.validate(build,manifest);return{build,report};
}
root.DawnSaveImport={convert};if(typeof module!=='undefined')module.exports=root.DawnSaveImport;
})(globalThis);
