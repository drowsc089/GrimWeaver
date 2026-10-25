'use strict';
Object.assign(WORDS,{statModel:['数值模型 1.82 · 静态预估','Calculation model 1.82 · static estimate']});
const damageColors182={Physical:'#adb7bd',Pierce:'#dcab78',Fire:'#f17d65',Cold:'#8fc9e8',Lightning:'#e7d16b',Poison:'#94ca7c',Life:'#cf7d91',Aether:'#79cfbb',Chaos:'#bb94da',SlowPhysical:'#a6aeb5',SlowBleeding:'#db8994',SlowFire:'#e9a075',SlowCold:'#abc5e6',SlowLightning:'#d9cf8b',SlowPoison:'#a0c984',SlowLife:'#c798b4'};
const unavailableComposition182=()=>`<p class="damage-limit18" role="status">${tr('伤害区间异常，暂不汇总；原计算明细保留。','Invalid damage range; composition is unavailable. Original calculations are retained.')}</p>`;
function finalComposition182(group){
 let summary;try{summary=GrimWeaverDamageSummary.summarize(group.packets);}catch{return unavailableComposition182();}
 return ['direct','dot'].map(kind=>{const part=summary[kind];if(!part.rows.length)return'';const title=kind==='dot'?tr('最终持续伤害构成 / 秒','Final damage-over-time composition / s'):tr('最终直接伤害构成','Final direct-damage composition');
  return`<section class="final-composition182" data-composition-kind182="${kind}"><h6>${title}</h6><div class="composition-bar182" aria-hidden="true">${part.rows.map(r=>`<span style="width:${r.share}%;background:${damageColors182[r.type]||'var(--accent)'}"></span>`).join('')}</div><table class="composition-table182"><thead><tr><th>${tr('类型','Type')}</th><th>${tr('最终伤害','Final damage')}</th><th title="${tr('按伤害区间中点计算','Based on damage-range midpoints')}">${tr('平均占比','Mean share')}</th></tr></thead><tbody>${part.rows.map(r=>`<tr data-final-type182="${esc(r.type)}"><th scope="row"><span class="damage-swatch182" style="background:${damageColors182[r.type]||'var(--accent)'}"></span>${esc(typeName18(r.type))}</th><td data-final-range182>${range18(r.lo,r.hi)}</td><td>${r.share.toLocaleString(language==='zh'?'zh-CN':'en-US',{maximumFractionDigits:1})}%</td></tr>`).join('')}</tbody><tfoot><tr><th>${tr('合计','Total')}</th><td>${range18(part.lo,part.hi)}</td><td>100%</td></tr></tfoot></table></section>`;
 }).join('');
}
const packetTableBefore182=packetTable18;
packetTable18=function(group,detailed){const table=packetTableBefore182(group,detailed);if(!table)return'';return finalComposition182(group)+`<details class="source-calculation182"><summary>${tr('各来源计算明细','Per-source calculations')}</summary>${table}</details>`;};
const handsBefore182=handsPanel12;
handsPanel12=function(r,details){
 const container=document.createElement('div');container.innerHTML=handsBefore182(r,details);
 for(const hand of r.hands.rows){const el=container.querySelector(`[data-hand="${hand.role}"]`);if(!el)continue;
  let summary;try{summary=GrimWeaverDamageSummary.summarize(GrimWeaverDamageSummary.handPackets(hand));}catch{el.insertAdjacentHTML('beforeend',unavailableComposition182());continue;}const hit=el.querySelector(`[data-stat-key="hit-${hand.role}"]`),dps=el.querySelector(`[data-stat-key="dps-${hand.role}"]`);
  if(hit){hit.querySelector('.stat-label').textContent=tr('直接伤害 / 次','Direct damage / hit');hit.querySelector('strong').textContent=range18(summary.direct.lo,summary.direct.hi);hit.insertAdjacentHTML('afterend',summary.dot.rows.length?row11('dot-'+hand.role,tr('持续伤害 / 秒','Damage over time / s'),range18(summary.dot.lo,summary.dot.hi)):'');}
  if(dps){const label=dps.querySelector('.stat-label');label.textContent=tr('直接伤害 DPS','Direct-damage DPS');label.dataset.statHelp=tr('直接伤害区间均值乘以攻击频率；持续伤害不重复乘攻速。','Mean direct hit multiplied by attack rate; DoT is not multiplied by attack speed.');dps.querySelector('strong').textContent=range18((summary.direct.lo+summary.direct.hi)/2*hand.aps,(summary.direct.lo+summary.direct.hi)/2*hand.aps);}
  el.querySelectorAll('[data-stat-key^="packet-"]').forEach(row=>row.remove());const html=finalComposition182({packets:GrimWeaverDamageSummary.handPackets(hand)});if(html)el.insertAdjacentHTML('beforeend',details?html:`<details class="hand-composition182"><summary>${tr('最终伤害构成','Final damage composition')}</summary>${html}</details>`);
 }
 return container.innerHTML;
};
const renderBefore182=render;
render=function(){renderBefore182();$('.version').textContent='1.82';document.title='GrimWeaver 1.82 | GAL';};
