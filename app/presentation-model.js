(function(g){
'use strict';
const COLORS=new Set('a b c d e f g h i k l m o p r s t w y'.split(' '));
const rarities=new Set(['Common','Broken','Magical','Rare','Epic','Legendary','Quest']);
const escape=s=>String(s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
function fragments(raw){const text=String(raw||'').replace(/\[ms\]([^]*?)\[fs\][^]*/g,'$1').replace(/\[(?:ms|fs|ns|mp|fp|np)\]/g,'');const out=[];let offset=0,color=null;
 for(const m of text.matchAll(/\{\^([a-zA-Z])\}|\^([a-zA-Z])/g)){if(m.index>offset)out.push({text:text.slice(offset,m.index),color});const code=(m[1]||m[2]).toLowerCase();if(COLORS.has(code))color=code;offset=m.index+m[0].length;}
 if(offset<text.length)out.push({text:text.slice(offset),color});return out;
}
function itemName(item,locale,fallback){const rarity=rarities.has(item?.rarity)?item.rarity:'Common',raw=item?.displayName?.[locale];const parts=raw&&!item.generatedName?fragments(raw):[{text:fallback||item?.name?.[locale]||'',color:null}];return parts.map(p=>`<span class="item-name-part17" style="color:var(--${p.color?'item-color-'+p.color:'rarity-'+rarity})">${escape(p.text)}</span>`).join('');}
function target(entries,controller={}){const first=(r,k,d='')=>r?.[k]?.[0]??d,root=entries[0]?.fields||{},cls=first(root,'Class'),explicit=first(controller,'targetType');
 if(/Enemy|Attacker/i.test(explicit))return'enemy';if(/Self|Player/i.test(explicit))return'self';
 if(/SpawnPet/.test(cls))return'summon';
 if(entries.some(e=>e.enemyTarget||first(e.fields,'debufSkill',false)||/Debuf/.test(first(e.fields,'Class'))))return'enemy';
 if(/BuffRadius|Aura/.test(cls))return'allies';if(/BuffSelf|HealSelf/.test(cls))return'self';if(/Attack|Projectile|Beam/.test(cls))return'enemy';return'skill';
}
const api={fragments,itemName,target,COLORS};g.GrimWeaverPresentation=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
