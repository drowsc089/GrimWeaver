/* Devotion domain engine: Copyright (c) 2026 Ted Naleid, MIT. See THIRD_PARTY_LICENSES.txt. */
(function(g){const mods={"model":(require,exports)=>{function buildModel(doc              )                {
  const stars = new Map              ();
  const constellations = new Map                       ();

  for (const c of doc.constellations) {
    const starIds           = c.stars.map((s) => `${c.id}:${s.index}`);
    for (const s of c.stars) {
      const id = `${c.id}:${s.index}`;
      stars.set(id, {
        id,
        constellationId: c.id,
        index: s.index,
        predecessors: s.predecessors.map((p) => `${c.id}:${p}`),
        position: s.position,
        bonuses: s.bonuses,
        celestialPower: s.celestial_power?.name_tag
          ? {
              nameTag: s.celestial_power.name_tag,
              descriptionTag: s.celestial_power.description_tag ?? null,
              proc: s.celestial_power.proc
                ? { chance: s.celestial_power.proc.chance, triggerKey: s.celestial_power.proc.trigger_key }
                : null,
              level: s.celestial_power.level ?? 0,
              stats: s.celestial_power.stats ?? {},
              pet: s.celestial_power.pet
                ? {
                    nameTag: s.celestial_power.pet.name_tag,
                    count: s.celestial_power.pet.count,
                    duration: s.celestial_power.pet.duration,
                    attackStats: s.celestial_power.pet.attack_stats ?? {},
                  }
                : null,
            }
          : null,
        weaponRequirement: s.weapon_requirement
          ? { weapons: s.weapon_requirement.weapons, descriptionTag: s.weapon_requirement.description_tag ?? null }
          : null,
        racialTarget: s.racial_target ?? undefined,
        petBonuses: s.pet_bonuses ?? undefined,
      });
    }
    constellations.set(c.id, {
      id: c.id,
      nameTag: c.name_tag,
      descriptionTag: c.description_tag ?? null,
      tier: c.tier,
      affinityRequired: c.affinity_required,
      affinityBonus: c.affinity_bonus,
      background: c.background,
      starIds,
    });
  }
  return { stars, constellations };
}
Object.assign(exports,{buildModel});
},"reachability":(require,exports)=>{const {AFFINITIES}=require("types");
const {gateBuildOrder,gateTransition}=require("orderLegality");
const {transitionOrderPath}=require("transitionOrder");
const CAP_MAX      = [20, 8, 20, 10, 20];
const NOCOST = 65535;
const INF = 1e9;
const BUDGET = 55;
function crossroadsColor(c          )         {
  if (c.size !== 1 || c.req[0] || c.req[1] || c.req[2] || c.req[3] || c.req[4]) return -1;
  let color = -1;
  for (let k = 0; k < 5; k++) {
    if (c.grant[k] === 0) continue;
    if (c.grant[k] !== 1 || color >= 0) return -1;
    color = k;
  }
  return color;
}
function seedFor(cons            , counted                          )      {
  const seed = zero();
  for (const c of cons) {
    const k = crossroadsColor(c);
    if (k >= 0 && !counted(c)) seed[k] = 1;
  }
  return seed;
}
const PEAK_WITNESS_TRIES = 32;
const PEAK_NODE_CAP = 3000;
const GATE_WITNESS_TRIES = 0;
const zero = ()      => [0, 0, 0, 0, 0];
const covers = (g     , d     )          =>
  g[0] >= d[0] && g[1] >= d[1] && g[2] >= d[2] && g[3] >= d[3] && g[4] >= d[4];
const addCap = (g     , x     )      => [
  Math.min(g[0] + x[0], CAP_MAX[0] ),
  Math.min(g[1] + x[1], CAP_MAX[1] ),
  Math.min(g[2] + x[2], CAP_MAX[2] ),
  Math.min(g[3] + x[3], CAP_MAX[3] ),
  Math.min(g[4] + x[4], CAP_MAX[4] ),
];
const addV = (g     , x     )      => [g[0] + x[0], g[1] + x[1], g[2] + x[2], g[3] + x[3], g[4] + x[4]];
const maxV = (a     , b     )      => [
  Math.max(a[0], b[0]),
  Math.max(a[1], b[1]),
  Math.max(a[2], b[2]),
  Math.max(a[3], b[3]),
  Math.max(a[4], b[4]),
];
function vecOf(m                                                      )      {
  return AFFINITIES.map((a) => m[a] ?? 0)       ;
}
function buildReachCons(model               )             {
  const out             = [];
  for (const c of model.constellations.values()) {
    out.push({ id: c.id, size: c.starIds.length, req: vecOf(c.affinityRequired), grant: vecOf(c.affinityBonus) });
  }
  return out;
}
function coverDims(cons            )                              {
  const caps      = zero();
  for (const c of cons) for (let i = 0; i < 5; i++) caps[i] = Math.max(caps[i] , c.req[i] );
  for (let i = 0; i < 5; i++) caps[i] = Math.min(caps[i] , CAP_MAX[i] );
  const sizes = caps.map((c) => c + 1);
  const strides = sizes.map((_, i) => sizes.slice(i + 1).reduce((a, b) => a * b, 1))       ;
  return { caps, strides };
}
function buildCoverTable(cons            )             {
  const { caps, strides } = coverDims(cons);
  const sizes = caps.map((c) => c + 1);
  const maxKey = sizes.reduce((a, b) => a * b, 1);
  const cost = new Uint16Array(maxKey).fill(NOCOST);
  cost[0] = 0;
  for (const c of cons) {
    if (!(c.grant[0] || c.grant[1] || c.grant[2] || c.grant[3] || c.grant[4])) continue;
    const [g0, g1, g2, g3, g4] = c.grant;
    for (let a = caps[0] ; a >= 0; a--)
      for (let ch = caps[1] ; ch >= 0; ch--)
        for (let e = caps[2] ; e >= 0; e--)
          for (let o = caps[3] ; o >= 0; o--)
            for (let p = caps[4] ; p >= 0; p--) {
              const k = a * strides[0]  + ch * strides[1]  + e * strides[2]  + o * strides[3]  + p;
              const pc = cost[k] ;
              if (pc === NOCOST) continue;
              const nc = pc + c.size;
              if (nc > BUDGET) continue;
              const nk =
                Math.min(a + g0, caps[0] ) * strides[0]  +
                Math.min(ch + g1, caps[1] ) * strides[1]  +
                Math.min(e + g2, caps[2] ) * strides[2]  +
                Math.min(o + g3, caps[3] ) * strides[3]  +
                Math.min(p + g4, caps[4] );
              if (nc < cost[nk] ) cost[nk] = nc;
            }
  }
  for (let i = 0; i < 5; i++) {
    const st = strides[i] ;
    for (let k = maxKey - 1; k >= 0; k--)
      if (Math.floor(k / st) % sizes[i]  < caps[i] ) {
        const up = cost[k + st] ;
        if (up < cost[k] ) cost[k] = up;
      }
  }
  return { cost, caps, strides };
}
function claimSummary(claimed            ) {
  let req = zero(),
    grant = zero(),
    grantUncapped = zero(),
    own = 0;
  for (const c of claimed) {
    req = maxV(req, c.req);
    grant = addCap(grant, c.grant);
    grantUncapped = addV(grantUncapped, c.grant);
    own += c.size;
  }
  return { req, grant, grantUncapped, own };
}
function selectionSummary(model               , selected             )             {
  const selByCon = new Map                ();
  let own = 0;
  for (const sid of selected) {
    const star = model.stars.get(sid);
    if (!star) continue;
    own++;
    selByCon.set(star.constellationId, (selByCon.get(star.constellationId) ?? 0) + 1);
  }
  let supply = zero(),
    supplyUncapped = zero(),
    target = zero();
  const startedIds = new Set        ();
  const partialFinish                              = [];
  const built             = [];
  for (const [conId, count] of selByCon) {
    const c = model.constellations.get(conId);
    if (!c) continue;
    startedIds.add(conId);
    const req = vecOf(c.affinityRequired);
    target = maxV(target, req);
    const grant = vecOf(c.affinityBonus);
    if (count >= c.starIds.length) {
      supply = addCap(supply, grant);
      supplyUncapped = addV(supplyUncapped, grant);
      built.push({ id: conId, size: c.starIds.length, req, grant });
    } else {
      built.push({ id: conId, size: count, req, grant: zero() });
      if (grant[0] || grant[1] || grant[2] || grant[3] || grant[4])
        partialFinish.push({ id: conId, remaining: c.starIds.length - count, grant, req });
    }
  }
  return { own, supply, supplyUncapped, target, startedIds, partialFinish, built };
}
function pathToStar(model               , selected             , starId        )              {
  const path = new Set        ();
  const stack           = [starId];
  while (stack.length) {
    const id = stack.pop() ;
    if (path.has(id) || selected.has(id)) continue;
    path.add(id);
    const star = model.stars.get(id);
    if (star) for (const p of star.predecessors) stack.push(p);
  }
  return path;
}
function stateFromClaimed(claimed            )             {
  const { req, grant, grantUncapped, own } = claimSummary(claimed);
  return {
    own,
    supply: grant,
    supplyUncapped: grantUncapped,
    target: req,
    startedIds: new Set(claimed.map((c) => c.id)),
    partialFinish: [],
    built: claimed.map((c) => ({ id: c.id, size: c.size, req: c.req, grant: c.grant })),
  };
}
function lowerBoundFrom(table            , st            )         {
  const fins = st.partialFinish;
  let best = INF;
  for (let mask = 0; mask < 1 << fins.length; mask++) {
    let supply = st.supply,
      extra = 0;
    for (let i = 0; i < fins.length; i++)
      if (mask & (1 << i)) {
        supply = addCap(supply, fins[i] .grant);
        extra += fins[i] .remaining;
      }
    const deficit      = [
      Math.max(0, st.target[0] - supply[0]),
      Math.max(0, st.target[1] - supply[1]),
      Math.max(0, st.target[2] - supply[2]),
      Math.max(0, st.target[3] - supply[3]),
      Math.max(0, st.target[4] - supply[4]),
    ];
    const cov = coverCostAt(table, deficit);
    if (cov >= INF) continue; // uncoverable for this subset; the INF must not be added to own
    const bound = st.own + extra + cov;
    if (bound < best) best = bound;
  }
  return best;
}
function coverLowerBound(table            , claimed            )         {
  return lowerBoundFrom(table, stateFromClaimed(claimed));
}
function fillerFor(cons            , st            )             {
  const filler = cons.filter(
    (c) => !st.startedIds.has(c.id) && (c.grant[0] || c.grant[1] || c.grant[2] || c.grant[3] || c.grant[4]),
  );
  for (const p of st.partialFinish)
    filler.push({ id: `${p.id}#finish`, size: p.remaining, req: p.req, grant: p.grant });
  return filler;
}
function greedyMinCost(cons            , claimedIds          , budget = BUDGET)         {
  const byId = new Map(cons.map((c) => [c.id, c]));
  const claimed = claimedIds.map((id) => byId.get(id) );
  return greedyFrom(cons, stateFromClaimed(claimed), budget);
}
let greedyBootColors = 0;
function lastGreedyBootColors()         {
  return greedyBootColors;
}
const popcount5 = (m        )         => (m & 1) + ((m >> 1) & 1) + ((m >> 2) & 1) + ((m >> 3) & 1) + ((m >> 4) & 1);
function greedyFrom(cons            , st            , budget = BUDGET)         {
  greedyBootColors = 0;
  const built = st.built;
  const pool = [...built, ...fillerFor(cons, st)];
  const placed = new Array(pool.length).fill(false);
  // Every crossroads-like constellation is in the pool (started ones in built, the rest as filler); the
  // seed offers a color only while one of its crossroads is unplaced, so a crossroads is never counted
  // twice (once as the transient seed, again as a placed member or filler).
  const seedLeft = zero();
  for (const c of pool) {
    const k = crossroadsColor(c);
    if (k >= 0) seedLeft[k] ++;
  }
  const seed = ()      => seedLeft.map((n) => (n > 0 ? 1 : 0))       ;
  const place = (i        )       => {
    placed[i] = true;
    const k = crossroadsColor(pool[i] );
    if (k >= 0) seedLeft[k] --;
  };
  let build = zero(); // affinity from placed constellations (excludes the transient seed)
  let maxReqPlaced = zero(); // every placed constellation must stand under this once seed is gone
  let cost = 0,
    builtLeft = built.length;
  let bootMask = 0; // colors any placement needed the seed crossroads for (req[c] > build[c] at placement)
  for (;;) {
    let did = false;
    // Auto-place the committed members as they unlock; filler is added selectively below.
    for (let i = 0; i < built.length; i++) {
      if (placed[i] || !covers(addCap(seed(), build), built[i] .req)) continue;
      for (let c = 0; c < 5; c++) if (built[i] .req[c]  > build[c] ) bootMask |= 1 << c;
      place(i);
      cost += built[i] .size;
      build = addCap(build, built[i] .grant);
      maxReqPlaced = maxV(maxReqPlaced, built[i] .req);
      builtLeft--;
      did = true;
    }
    if (builtLeft === 0 && covers(build, maxReqPlaced)) {
      greedyBootColors = popcount5(bootMask);
      return cost <= budget ? cost : INF;
    }
    if (did) continue;
    const g2 = addCap(seed(), build);
    const target = covers(build, maxReqPlaced) ? st.target : maxReqPlaced; // close self-sustain first, then started reqs
    const deficit      = [
      Math.max(0, target[0]  - build[0]),
      Math.max(0, target[1]  - build[1]),
      Math.max(0, target[2]  - build[2]),
      Math.max(0, target[3]  - build[3]),
      Math.max(0, target[4]  - build[4]),
    ];
    let best = -1,
      bestScore = 0;
    for (let i = built.length; i < pool.length; i++) {
      if (placed[i] || !covers(g2, pool[i] .req)) continue;
      let red = 0;
      for (let j = 0; j < 5; j++) red += Math.min(pool[i] .grant[j] , deficit[j] );
      const score = red / pool[i] .size;
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    }
    if (best < 0 || bestScore === 0) return INF;
    for (let c = 0; c < 5; c++) if (pool[best] .req[c]  > build[c] ) bootMask |= 1 << c;
    place(best);
    cost += pool[best] .size;
    build = addCap(build, pool[best] .grant);
    maxReqPlaced = maxV(maxReqPlaced, pool[best] .req);
    if (cost > budget) return INF;
  }
}
function classify(cons            , table            , claimedIds          , budget = BUDGET)        {
  const byId = new Map(cons.map((c) => [c.id, c]));
  const claimed = claimedIds.map((id) => byId.get(id) );
  if (coverLowerBound(table, claimed) > budget) return "dim";
  // Sound reachable proof that charges the transient crossroads peak (greedyMinCost's refunded cost did
  // not, so it false-reached tight builds). The tight band it cannot decide stays "unknown" for the
  // exact resolver, which models the peak.
  if (peakGateReachable(cons, claimed, budget)) return "reachable";
  return "unknown";
}
function reachabilitySweep(
  cons            ,
  table            ,
  claimedIds          ,
  budget = BUDGET,
)                     {
  const out = new Map               ();
  const claimedSet = new Set(claimedIds);
  for (const c of cons) {
    if (claimedSet.has(c.id)) continue;
    out.set(c.id, classify(cons, table, [...claimedIds, c.id], budget));
  }
  return out;
}
function coverCostAt(table            , deficit     )         {
  let k = 0;
  for (let i = 0; i < 5; i++) k += Math.min(Math.max(0, deficit[i] ), table.caps[i] ) * table.strides[i] ;
  const v = table.cost[k] ;
  return v === NOCOST ? INF : v;
}
function constructible(cons            , B            )          {
  const inB = new Set(B.map((m) => m.id));
  let gain = seedFor(cons, (c) => inB.has(c.id));
  const done = B.map(() => false);
  let placed = 0,
    changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < B.length; i++) {
      if (done[i] || !covers(gain, B[i] .req)) continue;
      done[i] = true;
      placed++;
      gain = addCap(gain, B[i] .grant);
      changed = true;
    }
  }
  return placed === B.length;
}
function peakGateReachable(cons            , B            , budget        )          {
  let size = 0;
  let grant = zero(),
    req = zero();
  for (const m of B) {
    size += m.size;
    grant = addCap(grant, m.grant);
    req = maxV(req, m.req);
  }
  if (!covers(grant, req)) return false; // not self-covering: needs permanent support, this gate cannot decide it
  let colors = 0;
  for (let i = 0; i < 5; i++) if (req[i]  > 0) colors++;
  if (size + colors > budget) return false; // peak may exceed budget; defer to the witness
  return constructible(cons, B); // a seeded order must exist, else the peak bound is not valid
}
function peakToReach(
  cons            ,
  table            ,
  deficit     ,
  base      = [0, 0, 0, 0, 0],
  peakNodeCap = 300_000,
  opts                                                  ,
)         {
  const need      = [
    Math.max(0, deficit[0]),
    Math.max(0, deficit[1]),
    Math.max(0, deficit[2]),
    Math.max(0, deficit[3]),
    Math.max(0, deficit[4]),
  ];
  if (need[0] === 0 && need[1] === 0 && need[2] === 0 && need[3] === 0 && need[4] === 0) {
    if (opts?.collect) opts.collect.length = 0;
    return 0;
  }
  const grants = (c          ) => c.grant[0] || c.grant[1] || c.grant[2] || c.grant[3] || c.grant[4];
  const ratio = (c          ) => (c.grant[0] + c.grant[1] + c.grant[2] + c.grant[3] + c.grant[4]) / c.size;
  const scaffolds = cons.filter(grants).sort(
    opts?.preferSmall
      ? (a, b) => {
          const reqFree = (c          ) =>
            c.req[0] === 0 && c.req[1] === 0 && c.req[2] === 0 && c.req[3] === 0 && c.req[4] === 0;
          return (reqFree(b) ? 1 : 0) - (reqFree(a) ? 1 : 0) || a.size - b.size || ratio(b) - ratio(a);
        }
      : (a, b) => ratio(b) - ratio(a),
  );
  const used = new Array(scaffolds.length).fill(false);
  let bestUsed                    = null;
  let best = INF;
  let nodes = 0;
  const NODE_CAP = peakNodeCap;
  // `path` tracks the DFS pick order for collect; must reflect actual pick sequence so req-dependent
  // scaffolds follow the scaffolds that supply their requirements (not just sorted-array order).
  const path = opts?.collect ? ([]              ) : null;
  // `a` is the scaffold affinity built so far; `base` is affinity already held from the permanent build,
  // which legally bootstraps a scaffold (covers its requirement) without counting toward the deficit.
  function dfs(a     , size        )       {
    if (size >= best || nodes++ > NODE_CAP) return;
    const rem      = [
      Math.max(0, need[0] - a[0]),
      Math.max(0, need[1] - a[1]),
      Math.max(0, need[2] - a[2]),
      Math.max(0, need[3] - a[3]),
      Math.max(0, need[4] - a[4]),
    ];
    if (rem[0] === 0 && rem[1] === 0 && rem[2] === 0 && rem[3] === 0 && rem[4] === 0) {
      best = size;
      if (path) bestUsed = [...path];
      return;
    }
    if (size + coverCostAt(table, rem) >= best) return; // cover table: cheapest extra subset, ignoring bootstrap
    const avail = addCap(base, a);
    for (let i = 0; i < scaffolds.length; i++) {
      const c = scaffolds[i] ;
      if (used[i] || size + c.size >= best || !covers(avail, c.req)) continue;
      used[i] = true;
      if (path) path.push(c);
      dfs(addCap(a, c.grant), size + c.size);
      if (path) path.pop();
      used[i] = false;
    }
  }
  dfs(zero(), 0);
  if (opts?.collect && bestUsed) {
    opts.collect.length = 0;
    opts.collect.push(...(bestUsed              ));
  }
  return best;
}
function buildParts(cons            , B            )                                                                {
  let tot = zero();
  let mreq = zero();
  let totalSize = 0;
  for (const m of B) {
    tot = addCap(tot, m.grant);
    mreq = maxV(mreq, m.req);
    totalSize += m.size;
  }
  if (!covers(tot, mreq)) return null; // not self-covering
  const grants = (c          ) => c.grant[0] || c.grant[1] || c.grant[2] || c.grant[3] || c.grant[4];
  const inB = new Set(B.map((b) => b.id));
  return { G: B.filter(grants), totalSize, pool: cons.filter((c) => !inB.has(c.id)) };
}
function peelOrder(G            , zeroReqFirst         )             {
  const reqFree = (c          ) =>
    zeroReqFirst && c.req[0] === 0 && c.req[1] === 0 && c.req[2] === 0 && c.req[3] === 0 && c.req[4] === 0;
  const front = G.filter(reqFree);
  const rest = G.filter((c) => !reqFree(c));
  let base = zero();
  for (const m of front) base = addCap(base, m.grant);
  const peeled             = [];
  while (rest.length) {
    let mreq = zero();
    for (const m of rest) mreq = maxV(mreq, m.req);
    let pick = -1;
    let pickDef = Infinity;
    let pickSize = -1;
    for (let i = 0; i < rest.length; i++) {
      let others = base;
      for (let j = 0; j < rest.length; j++) if (j !== i) others = addCap(others, rest[j] .grant);
      let def = 0;
      for (let k = 0; k < 5; k++) def += Math.max(0, mreq[k]  - others[k] );
      const size = rest[i] .size;
      if (def < pickDef || (def === pickDef && size > pickSize)) {
        pick = i;
        pickDef = def;
        pickSize = size;
      }
    }
    peeled.unshift(rest[pick] );
    rest.splice(pick, 1);
  }
  return [...front, ...peeled];
}
function sampledConstruction(
  cons            ,
  table            ,
  B            ,
  budget        ,
  tries        ,
  peakNodeCap        ,
)                      {
  const grants = (c          ) => c.grant[0] || c.grant[1] || c.grant[2] || c.grant[3] || c.grant[4];
  const tail = B.filter((c) => !grants(c));
  const parts = buildParts(cons, B);
  if (!parts) return { peak: INF, order: [], tail, steps: null };
  const { G, totalSize, pool } = parts;
  if (totalSize > budget) return { peak: INF, order: [], tail, steps: null };
  const reqsum = (c          ) => c.req[0] + c.req[1] + c.req[2] + c.req[3] + c.req[4];
  const ratio = (c          ) => (c.grant[0] + c.grant[1] + c.grant[2] + c.grant[3] + c.grant[4]) / c.size;
  const order = [...G].sort((a, b) => reqsum(a) - reqsum(b) || ratio(b) - ratio(a));
  let best = INF;
  let bestOrder             = [];
  let bestSteps                     = null;
  // Score a candidate; true when it fits the budget (the caller stops sampling).
  const consider = (candidate            )          => {
    const sched = emitSchedule(candidate, tail, pool, table, budget, peakNodeCap);
    const peak = sched ? sched.peak : INF;
    if (peak < best) {
      best = peak;
      bestOrder = [...candidate];
      bestSteps = sched?.steps ?? null;
    }
    return best <= budget;
  };
  const done = ()                      => ({ peak: best, order: bestOrder, tail, steps: bestSteps });
  if (consider(order)) return done();
  for (const zeroReqFirst of [true, false]) if (consider(peelOrder(G, zeroReqFirst))) return done();
  let seed = (totalSize * 2654435761 + G.length * 40503) >>> 0; // deterministic per build
  const rnd = () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let attempt = 0; attempt < tries && best > budget; attempt++) {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const tmp = order[i] ;
      order[i] = order[j] ;
      order[j] = tmp;
    }
    consider(order);
  }
  return done();
}
function minPeakSampled(
  cons            ,
  table            ,
  B            ,
  budget = BUDGET,
  tries = 8,
  peakNodeCap = 3000,
)         {
  return sampledConstruction(cons, table, B, budget, tries, peakNodeCap).peak;
}
function minPeakSampledOrder(
  cons            ,
  table            ,
  B            ,
  budget = BUDGET,
  tries = 16,
  peakNodeCap = 3000,
)                    {
  const { peak, order, tail } = sampledConstruction(cons, table, B, budget, tries, peakNodeCap);
  return peak <= budget ? [...order, ...tail] : null;
}
function needDrivenOrder(cons            , B            )                                                 {
  B = [...B].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)); // canonical: a function of the SET
  const parts = buildParts(cons, B);
  if (!parts) return null; // not self-covering
  const { G } = parts;
  const grants = (c          ) => c.grant[0] || c.grant[1] || c.grant[2] || c.grant[3] || c.grant[4];
  const tail = B.filter((c) => !grants(c));
  let seed = zero();
  for (const c of cons) if (c.id.startsWith("crossroads_")) seed = addCap(seed, c.grant);
  const placed = new Array(G.length).fill(false);
  const order             = [];
  let grant = zero();
  while (order.length < G.length) {
    const avail = addCap(grant, seed);
    // Deficient colors: what unplaced members still demand beyond the accumulated grants.
    const deficit = zero();
    for (let i = 0; i < G.length; i++) {
      if (placed[i]) continue;
      for (let k = 0; k < 5; k++) {
        const short = G[i] .req[k]  - grant[k] ;
        if (short > deficit[k] ) deficit[k] = short;
      }
    }
    let pick = -1;
    let pickPts = 0;
    let pickSize = 1;
    for (let i = 0; i < G.length; i++) {
      if (placed[i] || !covers(avail, G[i] .req)) continue;
      let pts = 0;
      for (let k = 0; k < 5; k++) if (deficit[k]  > 0) pts += G[i] .grant[k] ;
      if (
        pick < 0 ||
        pts * pickSize > pickPts * G[i] .size ||
        (pts * pickSize === pickPts * G[i] .size && G[i] .id < G[pick] .id)
      ) {
        pick = i;
        pickPts = pts;
        pickSize = G[i] .size;
      }
    }
    if (pick < 0) {
      // Genuinely stuck: place the member with the smallest summed deficit; the emission replay's
      // peakToReach buys exactly that gap (crossroads-biased, minimal) and refunds it legally.
      let pickDef = Infinity;
      for (let i = 0; i < G.length; i++) {
        if (placed[i]) continue;
        let d = 0;
        for (let k = 0; k < 5; k++) d += Math.max(0, G[i] .req[k]  - grant[k] );
        if (d < pickDef || (d === pickDef && G[i] .id < G[pick] .id)) {
          pick = i;
          pickDef = d;
        }
      }
    }
    placed[pick] = true;
    order.push(G[pick] );
    grant = addCap(grant, G[pick] .grant);
  }
  return { order, tail };
}
function churnPoints(steps             )         {
  let pts = 0;
  for (const s of steps) if (s.kind === "scaffold-add" && !s.conId.startsWith("crossroads_")) pts += s.points;
  return pts;
}
const REPLAY_CAP = 300_000;
function emitSchedule(
  order            ,
  tail            ,
  pool            ,
  table            ,
  budget        ,
  peakNodeCap = REPLAY_CAP,
)                  {
  const steps              = [];
  let peak = 0;
  const step = (kind                   , conId        , points        , heldAfter        )       => {
    steps.push({ kind, conId, points, heldAfter });
    if (heldAfter > peak) peak = heldAfter;
  };
  let grant      = zero();
  let mreq      = zero(); // max requirement incl. the member being placed (drives the scaffold need-set)
  let creq      = zero(); // max requirement over COMPLETED members only (drives refund legality)
  let held             = [];
  let running = 0;
  const over = ()           => ({ peak: running, steps: null });
  // In-game refund rule: a scaffold may be refunded only if everything still standing (completed
  // members plus the other held scaffolds) keeps its requirement covered without the scaffold's grant.
  const canRefund = (s          , keep            )          => {
    let g = grant;
    let r = maxV(creq, s.req);
    for (const k of keep) {
      g = addCap(g, k.grant);
      r = maxV(r, k.req);
    }
    return covers(g, r);
  };
  // Refund every held scaffold outside `needIds` that is safe to drop; unsafe ones stay held and are
  // retried after later adds supply replacement grants. Fixed point: one refund can unlock another.
  const drainRefunds = (needIds             )       => {
    for (let progress = true; progress; ) {
      progress = false;
      for (const s of [...held]) {
        if (needIds.has(s.id)) continue;
        const keep = held.filter((k) => k.id !== s.id);
        if (!canRefund(s, keep)) continue;
        held = keep;
        running -= s.size;
        step("scaffold-refund", s.id, -s.size, running);
        progress = true;
      }
    }
  };
  for (const m of order) {
    mreq = maxV(mreq, m.req);
    const def      = [
      Math.max(0, mreq[0] - grant[0]),
      Math.max(0, mreq[1] - grant[1]),
      Math.max(0, mreq[2] - grant[2]),
      Math.max(0, mreq[3] - grant[3]),
      Math.max(0, mreq[4] - grant[4]),
    ];
    const need             = [];
    const sz = peakToReach(pool, table, def, grant, peakNodeCap, { collect: need, preferSmall: true });
    if (sz >= INF) return null;
    const needIds = new Set(need.map((s) => s.id));
    drainRefunds(needIds);
    const heldIds = new Set(held.map((s) => s.id));
    for (const s of need)
      if (!heldIds.has(s.id)) {
        held.push(s);
        running += s.size;
        if (running > budget) return over(); // an over-cap add is illegal: no steps, never an illegal step
        step("scaffold-add", s.id, s.size, running);
      }
    drainRefunds(needIds); // retry refunds the new scaffolds' grants may have made safe
    running += m.size;
    step("complete", m.id, m.size, running);
    if (running > budget) return over();
    grant = addCap(grant, m.grant);
    creq = maxV(creq, m.req);
  }
  drainRefunds(new Set());
  if (held.length) return null; // a scaffold no drain can legally refund: honest null, never an illegal step
  for (const t of tail) {
    running += t.size;
    step("complete", t.id, t.size, running);
    if (running > budget) return over();
  }
  return { peak, steps };
}
function buildOrderPath(
  cons            ,
  table            ,
  B            ,
  budget = BUDGET,
  tries = 16,
  peakNodeCap = 3000,
)                     {
  B = [...B].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)); // canonical: the order is a function of the build SET
  const parts = buildParts(cons, B);
  if (!parts) return null; // not self-covering
  if (parts.totalSize > budget) return null;
  const nd = needDrivenOrder(cons, B);
  const viaGreedy = nd ? (emitSchedule(nd.order, nd.tail, parts.pool, table, budget)?.steps ?? null) : null;
  // The sampled witness comes with its own legal schedule (at the sampling cap); re-emitting its order at
  // the cold-path cap usually finds smaller scaffolds, but the witness's schedule is the fallback so a lit
  // build always has an order.
  const sc = sampledConstruction(cons, table, B, budget, tries, peakNodeCap);
  const viaSampler =
    sc.steps === null ? null : (emitSchedule(sc.order, sc.tail, parts.pool, table, budget)?.steps ?? sc.steps);
  if (!viaGreedy || !viaSampler) return viaGreedy ?? viaSampler;
  const g = churnPoints(viaGreedy);
  const s = churnPoints(viaSampler);
  if (g !== s) return g < s ? viaGreedy : viaSampler;
  return viaGreedy.length <= viaSampler.length ? viaGreedy : viaSampler;
}
function buildOrderEscalated(
  cons            ,
  table            ,
  B            ,
  budget = BUDGET,
)                     {
  return buildOrderPath(cons, table, B, budget, 4096, 3000);
}
function minBuildableCap(
  cons            ,
  table            ,
  B            ,
  fromCap        ,
  budget = BUDGET,
  tries = 256,
)                {
  for (let cap = Math.max(fromCap, 0); cap <= budget; cap++) {
    if (buildOrderPath(cons, table, B, cap, tries)) return cap;
  }
  return null;
}
function reachableExact(cons            , table            , claimedIds          , budget = BUDGET)          {
  const byId = new Map(cons.map((c) => [c.id, c]));
  const claimed = claimedIds.map((id) => byId.get(id) );
  return reachableExactFrom(cons, table, stateFromClaimed(claimed), budget);
}
let exactNodes = 0;
function lastExactNodes()         {
  return exactNodes;
}
function reachableExactFrom(cons            , table            , st            , budget = BUDGET)          {
  exactNodes = 0;
  const ratio = (c          ) => (c.grant[0] + c.grant[1] + c.grant[2] + c.grant[3] + c.grant[4]) / c.size;
  const wholeFiller = cons
    .filter((c) => !st.startedIds.has(c.id) && (c.grant[0] || c.grant[1] || c.grant[2] || c.grant[3] || c.grant[4]))
    .sort((a, b) => ratio(b) - ratio(a));
  const pf = st.partialFinish;
  const grantById = new Map(pf.map((p) => [p.id, p.grant]));
  const remainingById = new Map(pf.map((p) => [p.id, p.remaining]));
  let found = false;
  const chosen             = [];
  // Whole-constellation DFS for one finish-choice; the cover prune is admissible (no finishes left).
  function rec(i        , build     , cost        , maxReqPlaced     , builtCons            )       {
    if (found) return;
    exactNodes++;
    if (covers(build, maxReqPlaced)) {
      // A covering node is self-covering (build covers maxReqPlaced), so every remaining filler is optional
      // and refundable. The peak witness already models using such affinity as a transient refundable
      // scaffold, which is never worse for the peak than keeping it permanent - so the gate-then-witness
      // verdict HERE is FINAL: adding more filler cannot lower the construction peak. Decide and RETURN,
      // pruning the entire post-covering superset subtree (the dominant search cost). Because covering nodes
      // are now bounded, every one is witnessed (no call cap), which makes the verdict order-independent so
      // the Rust/WASM port stays verdict-equivalent. The cheap ladder gate is a sound sufficient proof; the
      // witness models the scaffold-then-refund peak. constructible alone is NOT sufficient - it ignores the
      // transient crossroads peak and was the source of the off-by-one false-reaches.
      const members = [...builtCons, ...chosen];
      if (
        peakGateReachable(cons, members, budget) ||
        minPeakSampled(cons, table, members, budget, GATE_WITNESS_TRIES, PEAK_NODE_CAP) <= budget
      )
        found = true;
      return;
    }
    if (i >= wholeFiller.length) return;
    const target = maxV(maxReqPlaced, st.target);
    const deficit      = [
      Math.max(0, target[0] - build[0]),
      Math.max(0, target[1] - build[1]),
      Math.max(0, target[2] - build[2]),
      Math.max(0, target[3] - build[3]),
      Math.max(0, target[4] - build[4]),
    ];
    if (cost + coverCostAt(table, deficit) > budget) return; // even the cheapest completion overflows
    const c = wholeFiller[i] ;
    if (cost + c.size <= budget) {
      chosen.push(c);
      rec(i + 1, addCap(build, c.grant), cost + c.size, maxV(maxReqPlaced, c.req), builtCons);
      chosen.pop();
    }
    if (!found) rec(i + 1, build, cost, maxReqPlaced, builtCons);
  }
  // Decide every subset of partial finishes to complete (2^k with k tiny - usually 0 or 1).
  for (let mask = 0; mask < 1 << pf.length && !found; mask++) {
    let build0      = [...st.supply],
      cost0 = st.own;
    const finished = new Set        ();
    for (let j = 0; j < pf.length; j++)
      if (mask & (1 << j)) {
        build0 = addCap(build0, pf[j] .grant);
        cost0 += pf[j] .remaining;
        finished.add(pf[j] .id);
      }
    if (cost0 > budget) continue;
    // A finished partial carries its full grant AND its full size (selected + remaining): the witness peak
    // math reads member.size, so a finished partial must count its whole constellation, not just the stars
    // already selected, or the peak is undercounted and an over-budget build wrongly looks reachable.
    const builtCons = st.built.map((b) =>
      finished.has(b.id) ? { ...b, grant: grantById.get(b.id) , size: b.size + remainingById.get(b.id)  } : b,
    );
    chosen.length = 0;
    rec(0, build0, cost0, st.target, builtCons);
  }
  return found;
}
let exactResolver                = reachableExactFrom;
function setExactResolver(fn                      )       {
  exactResolver = fn ?? reachableExactFrom;
}
function classifyForSelection(cons            , table            , st            , budget = BUDGET)        {
  if (lowerBoundFrom(table, st) > budget) return "dim";
  // Cheap SOUND reachable proof, charging the transient crossroads peak greedy's refunded cost ignores.
  // greedy's seed-unlock order is realizable while holding one crossroads per color it had to bootstrap,
  // so its peak is greedyCost + lastGreedyBootColors() - a sound, tight upper bound (Ted's ladder: each
  // color is a one-time bottom-of-ladder cost, often far below 5). This both restores the old greedy's
  // O(1) reach for near-ceiling builds AND dims the false-reaches: a tier-1 constellation at budget 3 has
  // greedyCost 3 + 1 bootstrapped color = 4 > 3, so it defers to the witness, which dims it. The narrow
  // band where the peak still overflows falls through to the witness and exact resolver, which model it.
  const g = greedyFrom(cons, st, budget);
  if (g + lastGreedyBootColors() <= budget) return "reachable";
  // Peak-bounded witness for the exact resolver's blind spot. Its constructibility check models only
  // the transient crossroads seed, so it wrongly dims tight self-covering builds that are reachable only by
  // holding transient refundable scaffolding (a crossroads or constellation beyond the seed) until the
  // build self-covers, then refunding it. When the started set is itself a complete whole-constellation
  // build (no partials), minPeakSampled samples real construction orders: a sampled peak <= budget is a
  // genuine build order, so this only ever flips a false-dim to reachable and never introduces a
  // false-reach. It early-exits on the first witness (fast for reachable builds) and tries a bounded
  // number of orders otherwise, so even a sweep of dozens of near-budget candidates stays in the ms.
  //
  // Run BEFORE the exact resolver: the witness is ~0.1ms and the resolver is the expensive (WASM/DFS)
  // call, so a witness hit short-circuits it. Verdict-identical - the witness only returns reachable on a
  // real order the definitive resolver would also accept - it just saves the resolver on self-covering
  // reachable candidates. Applies only to a complete started build (no partials); minPeakSampled itself
  // returns instantly for a non-self-covering build, so no budget-proximity gate is needed (an own>=49
  // gate was measured to wrongly exclude ~6% of the false-dim region, self-covering builds at own 44-48).
  if (st.partialFinish.length === 0) {
    if (minPeakSampled(cons, table, st.built, budget, PEAK_WITNESS_TRIES, PEAK_NODE_CAP) <= budget) return "reachable";
  }
  if (exactResolver(cons, table, st, budget)) return "reachable";
  return "dim";
}
function classifyComplete(
  cons            ,
  table            ,
  claimedIds          ,
  budget = BUDGET,
)                      {
  const verdict = classify(cons, table, claimedIds, budget);
  if (verdict !== "unknown") return verdict;
  return reachableExact(cons, table, claimedIds, budget) ? "reachable" : "dim";
}
function completionMinCost(
  model               ,
  cons            ,
  table            ,
  selected             ,
  conId        ,
  maxBudget = BUDGET,
)         {
  const con = model.constellations.get(conId);
  if (!con) return INF;
  const withCon = new Set(selected);
  for (const sid of con.starIds) withCon.add(sid);
  const st = selectionSummary(model, withCon);
  let lo = st.own; // cannot cost less than the stars already required
  if (lo > maxBudget) return INF;
  if (exactResolver(cons, table, st, maxBudget) === false) return INF;
  let hi = maxBudget;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (exactResolver(cons, table, st, mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
function selectionMinCost(
  model               ,
  cons            ,
  table            ,
  selected             ,
  maxBudget = BUDGET,
)         {
  const st = selectionSummary(model, selected);
  if (st.own === 0) return 0;
  if (st.own >= maxBudget) return maxBudget;
  return minCostFrom(cons, table, st, maxBudget) ?? maxBudget;
}
function minCostFrom(cons            , table            , st            , maxBudget        )                {
  let lo = st.own; // cannot cost less than the stars already selected
  if (lo > maxBudget) return null;
  if (classifyForSelection(cons, table, st, maxBudget) !== "reachable") return null;
  let hi = maxBudget;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (classifyForSelection(cons, table, st, mid) === "reachable") hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
function reachabilityForSelection(
  model               ,
  cons            ,
  table            ,
  selected             ,
  budget = BUDGET,
)            {
  const st = selectionSummary(model, selected);
  const completable = new Set        ();
  const reachableStars = new Set        ();
  // A constellation already fully selected "completes" to the current selection unchanged, so its
  // verdict is the current selection's - classify that once and reuse it instead of re-running the
  // (sometimes costly) resolver per complete constellation.
  const selfReachable = classifyForSelection(cons, table, st, budget) === "reachable";
  for (const c of model.constellations.values()) {
    const size = c.starIds.length;
    let selCount = 0;
    for (const sid of c.starIds) if (selected.has(sid)) selCount++;
    if (selCount === size) {
      if (selfReachable) completable.add(c.id);
      continue;
    }
    // The verdict for "selection + k stars of c" depends only on the count k (selectionSummary reduces
    // a selection to per-constellation counts), so the probe set is the selection plus unselected stars
    // of c in index order until the count reaches k - WHICH stars is immaterial to the verdict.
    const reachableAt = (k        )          => {
      const withK = new Set(selected);
      let count = selCount;
      for (const sid of c.starIds) {
        if (count >= k) break;
        if (!withK.has(sid)) {
          withK.add(sid);
          count++;
        }
      }
      return classifyForSelection(cons, table, selectionSummary(model, withK), budget) === "reachable";
    };
    if (reachableAt(size)) {
      completable.add(c.id);
      for (const sid of c.starIds) if (!selected.has(sid)) reachableStars.add(sid);
      continue;
    }
    // Not completable: find maxK, the largest star count that stays reachable. Probe the cheapest
    // entry (selCount+1) first - most non-completable constellations admit nothing, and that probe is
    // the same dim proof the old per-frontier-star pass paid - then binary search the rest (the
    // verdict is monotone in k: a bigger proper prefix costs more and grants nothing until complete).
    let lo = selCount + 1;
    const last = size - 1; // k = size is the completable question, already answered above
    if (lo > last || !reachableAt(lo)) continue;
    let hi = last;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (reachableAt(mid)) lo = mid;
      else hi = mid - 1;
    }
    const maxK = lo;
    for (const sid of c.starIds) {
      if (selected.has(sid)) continue;
      if (selCount + pathToStar(model, selected, sid).size <= maxK) reachableStars.add(sid);
    }
  }
  // panel: have = supplyUncapped (the true total, not the engine's CAP_MAX-clamped supply),
  // need = target, needSource = started cons defining each color's max.
  const needSource = new Map                  ();
  for (let i = 0; i < 5; i++) {
    if (st.target[i] === 0) continue;
    const src           = [];
    for (const conId of st.startedIds) {
      const c = model.constellations.get(conId) ;
      if ((vecOf(c.affinityRequired)[i] ?? 0) === st.target[i]) src.push(conId);
    }
    needSource.set(i, src);
  }
  return { completable, reachableStars, have: st.supplyUncapped, need: st.target, needSource };
}
function selectionView(
  model               ,
  cons            ,
  table            ,
  selected             ,
  cap = BUDGET,
  baseline                     = null,
)                {
  const minCost = selectionMinCost(model, cons, table, selected);
  const reach = reachabilityForSelection(model, cons, table, selected, Math.max(cap, minCost));
  const members = selectionSummary(model, selected).built;
  // Compare mode: the transition REPLACES the from-scratch computation (roughly flat per-click
  // cost); a none pair falls back to the from-scratch order so compare never shows less than today.
  if (baseline && baseline.size > 0) {
    const baseMembers = selectionSummary(model, baseline).built;
    const raw = transitionOrderPath(cons, table, baseMembers, members, cap, 16);
    const gated = raw ? gateTransition(cons, baseMembers, members, raw.steps, cap) : null;
    if (gated) {
      return {
        minCost,
        reach,
        buildOrder: null,
        buildOrderStates: null,
        transition: { steps: gated.steps, states: gated.states, rung: raw .rung },
      };
    }
  }
  // Verified or absent: render only orders the independent oracle proves legal at every step;
  // anything else is withheld and the panel shows its honest empty state instead. The verifying
  // replay's per-step states ride along for the step popup - one walk, two outputs.
  const raw = members.length ? buildOrderPath(cons, table, members, cap, 16) : null;
  const gated = gateBuildOrder(cons, members, raw, cap);
  return {
    minCost,
    reach,
    buildOrder: gated?.steps ?? null,
    buildOrderStates: gated?.states ?? null,
    transition: null,
  };
}
Object.assign(exports,{INF,BUDGET,crossroadsColor,buildReachCons,coverDims,buildCoverTable,selectionSummary,pathToStar,stateFromClaimed,lowerBoundFrom,coverLowerBound,greedyMinCost,lastGreedyBootColors,greedyFrom,classify,reachabilitySweep,peakToReach,minPeakSampled,minPeakSampledOrder,needDrivenOrder,churnPoints,buildOrderPath,buildOrderEscalated,minBuildableCap,reachableExact,lastExactNodes,reachableExactFrom,setExactResolver,classifyForSelection,classifyComplete,completionMinCost,selectionMinCost,minCostFrom,reachabilityForSelection,selectionView});
},"types":(require,exports)=>{const AFFINITIES             = ["ascendant", "chaos", "eldritch", "order", "primordial"];
Object.assign(exports,{AFFINITIES});
},"orderLegality":(require,exports)=>{const zero = ()      => [0, 0, 0, 0, 0];
const addV = (g     , x     )      => g.map((n, i) => n + x[i] )       ;
const maxV = (a     , b     )      => a.map((n, i) => Math.max(n, b[i] ))       ;
const covers = (g     , d     )          => g.every((n, i) => n >= d[i] );
function replayBuildOrder(
  allCons            ,
  target            ,
  steps             ,
  cap        ,
)                                                {
  const conOf = new Map(allCons.map((c) => [c.id, c]));
  for (const t of target) conOf.set(t.id, t);
  const standing = new Set        ();
  const states              = [];
  let running = 0;
  const fail = (error        ) => ({ error, states });
  // The post-step standing state (fresh structures per call). covers(have, need) IS the post-step
  // legality check, so what the popup renders is literally what the judge saw.
  const standingState = ()                                                              => {
    let have = zero();
    let need = zero();
    const needSource = new Map                  ();
    for (const id of standing) {
      const c = conOf.get(id) ;
      have = addV(have, c.grant);
      need = maxV(need, c.req);
      for (let i = 0; i < 5; i++)
        if (c.req[i]  > 0) {
          const list = needSource.get(i) ?? [];
          list.push(id);
          needSource.set(i, list);
        }
    }
    return { have, need, needSource };
  };
  // Mid-step validity; `pending` is a constellation whose requirement must count but whose grant
  // must not (the conservative mid-step point).
  const check = (label        , pending        )                => {
    let grant = zero();
    let req = zero();
    for (const id of standing) {
      const c = conOf.get(id) ;
      req = maxV(req, c.req);
      if (id !== pending) grant = addV(grant, c.grant);
    }
    if (!standing.has(pending)) req = maxV(req, conOf.get(pending) .req);
    return covers(grant, req) ? null : `${label}: requirement uncovered`;
  };
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i] ;
    const c = conOf.get(s.conId);
    if (!c) return fail(`step ${i}: unknown constellation ${s.conId}`);
    let st                                                             ;
    if (s.kind === "scaffold-refund") {
      if (!standing.has(s.conId)) return fail(`step ${i} (${s.conId}): refund of a constellation not standing`);
      if (s.points !== -c.size) return fail(`step ${i} (${s.conId}): refund points ${s.points}, expected ${-c.size}`);
      const mid = check(`step ${i} (${s.conId}) mid-refund`, s.conId);
      if (mid) return fail(mid);
      standing.delete(s.conId);
      running -= c.size;
      st = standingState();
      if (!covers(st.have, st.need)) return fail(`step ${i} (${s.conId}) post-refund: requirement uncovered`);
    } else {
      if (standing.has(s.conId)) return fail(`step ${i} (${s.conId}): added while already standing`);
      if (s.points !== c.size) return fail(`step ${i} (${s.conId}): add points ${s.points}, expected ${c.size}`);
      const mid = check(`step ${i} (${s.conId}) pre-add`, s.conId);
      if (mid) return fail(mid);
      standing.add(s.conId);
      running += c.size;
      if (running > cap) return fail(`step ${i} (${s.conId}): cap exceeded (${running} > ${cap})`);
      st = standingState();
      if (!covers(st.have, st.need)) return fail(`step ${i} (${s.conId}) post-add: requirement uncovered`);
    }
    if (s.heldAfter !== running)
      return fail(`step ${i} (${s.conId}): heldAfter=${s.heldAfter}, running total is ${running}`);
    // Push only after every check: a state exists exactly for each step that completed its checks.
    states.push({ ...st, conReq: c.req, conGrant: c.grant });
  }
  const want = new Set(target.map((c) => c.id));
  if (want.size !== standing.size) return fail(`end state: ${standing.size} standing, ${want.size} wanted`);
  for (const id of want) if (!standing.has(id)) return fail(`end state: ${id} missing`);
  return { error: null, states };
}
function verifyBuildOrder(
  allCons            ,
  target            ,
  steps             ,
  cap        ,
)                {
  return replayBuildOrder(allCons, target, steps, cap).error;
}
function gateBuildOrder(
  allCons            ,
  target            ,
  steps                    ,
  cap        ,
)                    {
  if (!steps) return null;
  const r = replayBuildOrder(allCons, target, steps, cap);
  return r.error === null ? { steps, states: r.states } : null;
}
function replayTransition(
  allCons            ,
  base            ,
  cur            ,
  steps             ,
  cap        ,
)                                                {
  const conOf = new Map(allCons.map((c) => [c.id, c]));
  const counts = new Map                (base.map((b) => [b.id, b.size]));
  const states              = [];
  const total = () => [...counts.values()].reduce((a, b) => a + b, 0);
  const fail = (error        ) => ({ error, states });
  // Standing validity with the conservative override: `pending` is a con whose requirement must
  // count but whose grant must not (add completing / refund starting).
  const check = (label        , pending               )                => {
    let grant = zero();
    let req = zero();
    for (const [id, n] of counts) {
      if (n <= 0) continue;
      const c = conOf.get(id) ;
      req = maxV(req, c.req);
      if (n >= c.size && id !== pending) grant = addV(grant, c.grant);
    }
    if (pending) {
      const pc = conOf.get(pending);
      if (pc) req = maxV(req, pc.req);
    }
    return covers(grant, req) ? null : `${label}: requirement uncovered`;
  };
  // The post-step standing state (fresh structures per call), the popup's data source.
  const standingState = ()                                                              => {
    let have = zero();
    let need = zero();
    const needSource = new Map                  ();
    for (const [id, n] of counts) {
      if (n <= 0) continue;
      const c = conOf.get(id) ;
      need = maxV(need, c.req);
      if (n >= c.size) have = addV(have, c.grant);
      for (let i = 0; i < 5; i++)
        if (c.req[i]  > 0) {
          const list = needSource.get(i) ?? [];
          list.push(id);
          needSource.set(i, list);
        }
    }
    return { have, need, needSource };
  };
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i] ;
    const c = conOf.get(s.conId);
    if (!c) return fail(`step ${i}: unknown constellation ${s.conId}`);
    const cur0 = counts.get(s.conId) ?? 0;
    if (cur0 !== s.from) return fail(`step ${i} (${s.conId}): from=${s.from} but standing count is ${cur0}`);
    if (s.to < 0 || s.to > c.size) return fail(`step ${i} (${s.conId}): to=${s.to} out of range`);
    if (s.kind === "add" && s.to <= s.from) return fail(`step ${i} (${s.conId}): add must increase count`);
    if (s.kind === "refund" && s.to >= s.from) return fail(`step ${i} (${s.conId}): refund must decrease count`);
    counts.set(s.conId, s.to);
    const mid = check(`step ${i} (${s.conId}) mid`, s.conId);
    if (mid) return fail(mid);
    const end = check(`step ${i} (${s.conId}) end`, null);
    if (end) return fail(end);
    const t = total();
    if (s.kind === "add" && t > cap) return fail(`step ${i} (${s.conId}): cap exceeded (${t} > ${cap})`);
    if (t !== s.heldAfter) return fail(`step ${i} (${s.conId}): heldAfter=${s.heldAfter} but total is ${t}`);
    // Grant delta the popup shows: only a step that completes (add to full size) or un-completes
    // (refund from full size) the constellation moves its grant.
    const conGrant =
      (s.kind === "add" && s.to === c.size) || (s.kind === "refund" && s.from === c.size) ? c.grant : zero();
    const st = standingState();
    states.push({ ...st, conReq: c.req, conGrant });
    if (s.to === 0) counts.delete(s.conId);
  }
  if (total() > cap) return fail(`end state over cap (${total()} > ${cap})`);
  const want = new Map(cur.map((c) => [c.id, c.size]));
  if (want.size !== counts.size) return fail(`end state mismatch: ${counts.size} standing, ${want.size} wanted`);
  for (const [id, n] of want) if (counts.get(id) !== n) return fail(`end state mismatch at ${id}`);
  return { error: null, states };
}
function verifyTransition(
  allCons            ,
  base            ,
  cur            ,
  steps             ,
  cap        ,
)                {
  return replayTransition(allCons, base, cur, steps, cap).error;
}
function gateTransition(
  allCons            ,
  base            ,
  cur            ,
  steps                    ,
  cap        ,
)                         {
  if (!steps) return null;
  const r = replayTransition(allCons, base, cur, steps, cap);
  return r.error === null ? { steps, states: r.states } : null;
}
Object.assign(exports,{replayBuildOrder,verifyBuildOrder,gateBuildOrder,replayTransition,verifyTransition,gateTransition});
},"transitionOrder":(require,exports)=>{const {peakToReach,buildOrderPath,INF}=require("reachability");
const {verifyTransition}=require("orderLegality");
const CAP_MAX      = [20, 8, 20, 10, 20];
const zero = ()      => [0, 0, 0, 0, 0];
const add = (g     , x     )      => [g[0] + x[0], g[1] + x[1], g[2] + x[2], g[3] + x[3], g[4] + x[4]];
const addCap = (g     , x     )      => g.map((n, i) => Math.min(n + x[i] , CAP_MAX[i] ))       ;
const maxV = (a     , b     )      => a.map((n, i) => Math.max(n, b[i] ))       ;
const covers = (g     , d     )          => g.every((n, i) => n >= d[i] );
const deficit = (req     , grant     )      => req.map((n, i) => Math.max(0, n - grant[i] ))       ;
const reqSum = (c          ) => c.req[0] + c.req[1] + c.req[2] + c.req[3] + c.req[4];
const grantRatio = (c          ) => (c.grant[0] + c.grant[1] + c.grant[2] + c.grant[3] + c.grant[4]) / c.size;
const REPLAY_CAP = 300_000;
function diffBuilds(base            , cur            , conById                       )        {
  const b = new Map(base.map((c) => [c.id, c]));
  const c2 = new Map(cur.map((c) => [c.id, c]));
  const sharedFull             = [];
  const baseOnly             = [];
  const curOnly             = [];
  const resize                  = [];
  for (const [id, bc] of b) {
    const cc = c2.get(id);
    if (!cc) baseOnly.push(bc);
    else if (bc.size === cc.size) sharedFull.push(bc);
    else resize.push({ con: conById.get(id) , from: bc.size, to: cc.size });
  }
  for (const [id, cc] of c2) if (!b.has(id)) curOnly.push(cc);
  return { sharedFull, baseOnly, curOnly, resize };
}
function seededReplay(
  cons            ,
  table            ,
  conById                       ,
  delta       ,
  cap        ,
  tries        ,
)                     {
  const kept = delta.sharedFull;
  const grows = delta.resize.filter((r) => r.to > r.from);
  const shrinks = delta.resize.filter((r) => r.to < r.from);

  // Members added over time.
  const toPlace               = [
    ...delta.curOnly.map((c) => ({ con: c, from: 0, to: c.size, grants: true })),
    ...grows.map((r) => ({ con: r.con, from: r.from, to: r.to, grants: r.to === r.con.size })),
  ];

  // Standing counts at each endpoint (drives from/to bookkeeping and the validity mirror).
  const baseCounts = new Map                ();
  const curCounts = new Map                ();
  for (const c of delta.sharedFull) {
    baseCounts.set(c.id, c.size);
    curCounts.set(c.id, c.size);
  }
  for (const c of delta.baseOnly) baseCounts.set(c.id, c.size);
  for (const c of delta.curOnly) curCounts.set(c.id, c.size);
  for (const r of delta.resize) {
    baseCounts.set(r.con.id, r.from);
    curCounts.set(r.con.id, r.to);
  }

  // Scaffold pool for peakToReach: baseline-only members first (prefer-held), then external scaffolds.
  const heldIds = new Set(delta.baseOnly.map((c) => c.id));
  const fresh = cons.filter((c) => !curCounts.has(c.id) && !baseCounts.has(c.id) && !heldIds.has(c.id));
  const pool = [...delta.baseOnly, ...fresh];

  // Refund targets for every transient support (what star count it must end at). Fresh scaffolds added
  // mid-replay register a target of 0 when placed.
  const refundTarget = new Map                ();
  for (const c of delta.baseOnly) refundTarget.set(c.id, 0);
  for (const r of shrinks) refundTarget.set(r.con.id, r.to);

  let keptGrant      = zero();
  for (const c of kept) keptGrant = addCap(keptGrant, c.grant);
  let seedMreq      = zero();
  for (const c of kept) seedMreq = maxV(seedMreq, c.req);
  for (const r of delta.resize) seedMreq = maxV(seedMreq, r.con.req);

  // Forward pass: the per-step scaffold need-sets for one add order (null if a member cannot be supported).
  const forward = (order              )                      => {
    let permGrant = keptGrant;
    let mreq = seedMreq;
    const needHistory               = [];
    for (const p of order) {
      mreq = maxV(mreq, p.con.req);
      const need             = [];
      const sz = peakToReach(pool, table, deficit(mreq, permGrant), permGrant, REPLAY_CAP, {
        collect: need,
        preferSmall: true,
      });
      if (sz >= INF) return null;
      needHistory.push(need);
      if (p.grants) permGrant = addCap(permGrant, p.con.grant);
    }
    return needHistory;
  };

  // Emit steps for one add order under a refund policy (two-pass or eager). Every step is validated with
  // the oracle's standing-state rule, so a returned sequence is oracle-clean by construction.
  const emit = (order              , needHistory              , eager         )                     => {
    const standing = new Map(baseCounts);
    let running = [...standing.values()].reduce((a, b) => a + b, 0);
    const steps              = [];

    // Standing-state validity, mirroring verifyTransition.check: grants from COMPLETE members (excluding an
    // optional `pending` whose grant is not yet / no longer counted) must cover the max requirement of every
    // started member (including `pending`'s).
    const valid = (pending               )          => {
      let grant = zero();
      let req = zero();
      for (const [id, n] of standing) {
        if (n <= 0) continue;
        const c = conById.get(id) ;
        req = maxV(req, c.req);
        if (n >= c.size && id !== pending) grant = add(grant, c.grant);
      }
      if (pending) {
        const pc = conById.get(pending);
        if (pc) req = maxV(req, pc.req);
      }
      return covers(grant, req);
    };
    const emitAdd = (id        , to        )          => {
      const from = standing.get(id) ?? 0;
      if (to <= from) return false;
      standing.set(id, to);
      if (!valid(id) || !valid(null) || running + (to - from) > cap) {
        if (from === 0) standing.delete(id);
        else standing.set(id, from);
        return false;
      }
      running += to - from;
      steps.push({ kind: "add", conId: id, from, to, heldAfter: running });
      return true;
    };
    const emitRefund = (id        , to        )          => {
      const from = standing.get(id) ?? 0;
      if (to >= from) return false;
      standing.set(id, to);
      if (!valid(id) || !valid(null)) {
        standing.set(id, from);
        return false;
      }
      running -= from - to;
      steps.push({ kind: "refund", conId: id, from, to, heldAfter: running });
      if (to === 0) standing.delete(id);
      return true;
    };

    const needIdSets = needHistory.map((ns) => new Set(ns.map((s) => s.id)));
    const lastUse = new Map                ();
    for (let i = 0; i < needHistory.length; i++) for (const s of needHistory[i] ) lastUse.set(s.id, i);

    const pending = new Set        ();
    const drain = () => {
      for (let progress = true; progress; ) {
        progress = false;
        for (const id of [...pending]) {
          const target = refundTarget.get(id) ?? 0;
          if ((standing.get(id) ?? 0) <= target) {
            pending.delete(id);
            continue;
          }
          if (emitRefund(id, target)) {
            pending.delete(id);
            progress = true;
          }
        }
      }
    };
    // Schedule (then safely drain) refunds for supports whose usefulness ends at step `i` (-1 = pre-add).
    const scheduleAndDrain = (i        ) => {
      const next = i + 1 < needIdSets.length ? needIdSets[i + 1]  : new Set        ();
      for (const id of refundTarget.keys()) {
        if ((standing.get(id) ?? 0) <= (refundTarget.get(id) ?? 0)) continue;
        const done = eager ? !next.has(id) : i >= (lastUse.get(id) ?? -1);
        if (done) pending.add(id);
      }
      drain();
    };

    scheduleAndDrain(-1); // free never-needed baseline members up front
    for (let i = 0; i < order.length; i++) {
      for (const s of needHistory[i] ) {
        if ((standing.get(s.id) ?? 0) <= 0) {
          if (!emitAdd(s.id, s.size)) return null; // fresh scaffold / re-added held member
          if (!refundTarget.has(s.id)) refundTarget.set(s.id, 0);
        }
      }
      const p = order[i] ;
      if (p.to > (standing.get(p.con.id) ?? 0) && !emitAdd(p.con.id, p.to)) return null;
      scheduleAndDrain(i);
    }
    for (const id of refundTarget.keys()) pending.add(id);
    drain();

    if (standing.size !== curCounts.size) return null;
    for (const [id, n] of curCounts) if (standing.get(id) !== n) return null;
    return steps;
  };

  // Order candidates: the deterministic heuristic, then seeded shuffles (LCG seeded from sizes, like
  // sampledConstruction) - tried until one produces a valid two-pass or eager schedule.
  const heuristic = [...toPlace].sort((a, b) => reqSum(a.con) - reqSum(b.con) || grantRatio(b.con) - grantRatio(a.con));
  const orders                 = [heuristic];
  let seed = (toPlace.reduce((a, p) => a + p.con.size, 0) * 2654435761 + toPlace.length * 40503) >>> 0 || 1;
  const rnd = () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let a = 0; a < tries; a++) {
    const o = [...heuristic];
    for (let i = o.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const tmp = o[i] ;
      o[i] = o[j] ;
      o[j] = tmp;
    }
    orders.push(o);
  }
  for (const order of orders) {
    const needHistory = forward(order);
    if (!needHistory) continue;
    const twoPass = emit(order, needHistory, false);
    if (twoPass) return twoPass;
    const eager = emit(order, needHistory, true);
    if (eager) return eager;
  }
  return null;
}
function incrementalTransition(
  cons            ,
  table            ,
  base            ,
  cur            ,
  cap        ,
  tries = 16,
)                     {
  const conById = new Map(cons.map((c) => [c.id, c]));
  return seededReplay(cons, table, conById, diffBuilds(base, cur, conById), cap, tries);
}
function teardownRebuild(
  cons            ,
  table            ,
  base            ,
  cur            ,
  cap        ,
)                     {
  const down                     = buildOrderPath(cons, table, base, cap, 64);
  const up                     = buildOrderPath(cons, table, cur, cap, 64);
  if (!down || !up) return null;
  const steps              = [];
  let held = base.reduce((a, c) => a + c.size, 0);
  for (const s of [...down].reverse()) {
    const size = Math.abs(s.points);
    const wasAdd = s.kind === "complete" || s.kind === "scaffold-add";
    held += wasAdd ? -size : size;
    steps.push(
      wasAdd
        ? { kind: "refund", conId: s.conId, from: size, to: 0, heldAfter: held }
        : { kind: "add", conId: s.conId, from: 0, to: size, heldAfter: held },
    );
  }
  for (const s of up) {
    const size = Math.abs(s.points);
    const isAdd = s.kind === "complete" || s.kind === "scaffold-add";
    held += isAdd ? size : -size;
    steps.push(
      isAdd
        ? { kind: "add", conId: s.conId, from: 0, to: size, heldAfter: held }
        : { kind: "refund", conId: s.conId, from: size, to: 0, heldAfter: held },
    );
  }
  return steps;
}
function stateWalkTransition(
  cons            ,
  table            ,
  base            ,
  cur            ,
  cap        ,
)                     {
  const conById = new Map(cons.map((c) => [c.id, c]));
  const want = new Map(cur.map((c) => [c.id, c.size]));
  const counts = new Map                (base.map((c) => [c.id, c.size]));
  const steps              = [];
  const tornOnce = new Set        ();
  let running = [...counts.values()].reduce((a, b) => a + b, 0);
  let theoreticalMin = 0;
  for (const [id, n] of counts) theoreticalMin += Math.abs(n - (want.get(id) ?? 0));
  for (const [id, n] of want) if (!counts.has(id)) theoreticalMin += n;
  const budget = Math.max(theoreticalMin, 1) * 4;
  let movedTotal = 0;

  // The oracle's standing rule (capped here where the oracle sums uncapped - verdict-equivalent,
  // since no requirement exceeds CAP_MAX): complete grants cover every started
  // requirement, with `pending` counted as requirement but not grant (the mid-step point).
  const valid = (pending               )          => {
    let grant = zero();
    let req = zero();
    for (const [id, n] of counts) {
      if (n <= 0) continue;
      const c = conById.get(id) ;
      req = maxV(req, c.req);
      if (n >= c.size && id !== pending) grant = addCap(grant, c.grant);
    }
    if (pending) {
      const pc = conById.get(pending);
      if (pc) req = maxV(req, pc.req);
    }
    return covers(grant, req);
  };
  const restore = (id        , from        )       => {
    if (from === 0) counts.delete(id);
    else counts.set(id, from);
  };
  // Would this move be legal? Mutates and restores; emit() re-applies for real.
  const probe = (kind                  , id        , to        )          => {
    const from = counts.get(id) ?? 0;
    if (kind === "add" ? to <= from : to >= from) return false;
    if (kind === "add" && running + (to - from) > cap) return false;
    counts.set(id, to);
    const ok = valid(id) && valid(null);
    restore(id, from);
    return ok;
  };
  const emit = (kind                  , id        , to        )       => {
    const from = counts.get(id) ?? 0;
    counts.set(id, to);
    running += to - from;
    movedTotal += Math.abs(to - from);
    steps.push({ kind, conId: id, from, to, heldAfter: running });
    if (to === 0) counts.delete(id);
  };
  const standingGrant = (excl                = null)      => {
    let g = zero();
    for (const [id, n] of counts) {
      if (id === excl) continue;
      const c = conById.get(id) ;
      if (n >= c.size) g = addCap(g, c.grant);
    }
    return g;
  };
  // What the not-yet-at-target members still demand beyond the standing complete grants
  // (optionally pretending one standing member is gone, to ask whether it is load-bearing).
  const deficitVec = (excl                = null)      => {
    const g = standingGrant(excl);
    const d = zero();
    for (const [id, size] of want) {
      if ((counts.get(id) ?? 0) === size) continue;
      const c = conById.get(id) ;
      for (let i = 0; i < 5; i++) d[i] = Math.max(d[i] , Math.max(0, c.req[i]  - g[i] ));
    }
    return d;
  };
  const done = ()          => {
    if (counts.size !== want.size) return false;
    for (const [id, n] of want) if (counts.get(id) !== n) return false;
    return true;
  };
  const grantSum = (c          ) => c.grant[0] + c.grant[1] + c.grant[2] + c.grant[3] + c.grant[4];

  while (!done()) {
    if (movedTotal > budget) return null;
    const d = deficitVec();
    // 1. Complete a target member: never-torn candidates before re-adds of torn ones (re-adding
    // a just-torn member would recreate the state the teardown escaped), then granting adds
    // before zero-effective-grant ones (a tier 3 or a partial grants nothing; its points stay
    // liquid until the end), then densest deficit contribution per moved star, ties by id.
    {
      let pick                = null;
      let pickPts = 0;
      let pickDelta = 1;
      let pickTorn = 1;
      let pickGrants = 0;
      for (const [id, size] of want) {
        const at = counts.get(id) ?? 0;
        if (at >= size || !probe("add", id, size)) continue;
        const c = conById.get(id) ;
        let pts = 0;
        if (size === c.size) for (let i = 0; i < 5; i++) if (d[i]  > 0) pts += c.grant[i] ;
        const delta = size - at;
        const torn = tornOnce.has(id) ? 1 : 0;
        const grants = size === c.size && grantSum(c) > 0 ? 1 : 0;
        if (
          pick === null ||
          torn < pickTorn ||
          (torn === pickTorn &&
            (grants > pickGrants ||
              (grants === pickGrants &&
                (pts * pickDelta > pickPts * delta || (pts * pickDelta === pickPts * delta && id < pick)))))
        ) {
          pick = id;
          pickPts = pts;
          pickDelta = delta;
          pickTorn = torn;
          pickGrants = grants;
        }
      }
      if (pick !== null) {
        emit("add", pick, want.get(pick) );
        continue;
      }
    }
    // 2. Free points: refund anything standing above its target whose grant no outstanding
    // deficit leans on (a load-bearing scaffold would only be re-bought; it waits until its
    // beneficiary completes and self-sustains). Zero-effective-grant members first (a partial
    // grants nothing, the Ghoul observation), then the grant least useful to the remaining
    // deficits, ties by id. Covers leftovers, spent scaffolds, and shrink-resizes alike
    // (refund toward target, not just to zero).
    {
      const cands                                                 = [];
      for (const [id, n] of counts) {
        const target = want.get(id) ?? 0;
        if (n <= target || !probe("refund", id, target)) continue;
        const c = conById.get(id) ;
        const granting = n >= c.size; // only a complete member's grant is standing
        if (granting) {
          const dx = deficitVec(id);
          if (dx.some((x, i) => x > d[i] )) continue; // load-bearing: not free
        }
        let useful = 0;
        if (granting) for (let i = 0; i < 5; i++) if (d[i]  > 0) useful += c.grant[i] ;
        cands.push({ id, free: granting && grantSum(c) > 0 ? 1 : 0, useful });
      }
      if (cands.length) {
        cands.sort((a, b) => a.free - b.free || a.useful - b.useful || (a.id < b.id ? -1 : 1));
        const r = cands[0] ;
        emit("refund", r.id, want.get(r.id) ?? 0);
        continue;
      }
    }
    // 3. Scaffold: one constellation from peakToReach's minimal set for the binding deficit.
    {
      const need             = [];
      const pool = cons.filter((c) => !want.has(c.id) && (counts.get(c.id) ?? 0) === 0);
      const sz = peakToReach(pool, table, d, standingGrant(), REPLAY_CAP, {
        collect: need,
        preferSmall: true,
      });
      if (sz < INF && sz > 0) {
        let added = false;
        for (const s of need)
          if (probe("add", s.id, s.size)) {
            emit("add", s.id, s.size);
            added = true;
            break;
          }
        if (added) continue;
      }
    }
    // 4. Teardown, only when stuck: zero-effective-grant members first (nothing can lean on
    // them), then smallest, ties by id; each torn at most once.
    {
      const tearCands = [...counts.keys()]
        .filter((id) => {
          const t = want.get(id) ?? 0;
          return t > 0 && (counts.get(id) ?? 0) === t && !tornOnce.has(id);
        })
        .map((id) => conById.get(id) )
        .sort((a, b) => {
          const ga = want.get(a.id) === a.size && grantSum(a) > 0 ? 1 : 0;
          const gb = want.get(b.id) === b.size && grantSum(b) > 0 ? 1 : 0;
          return ga - gb || a.size - b.size || (a.id < b.id ? -1 : 1);
        });
      let torn = false;
      for (const c of tearCands)
        if (probe("refund", c.id, 0)) {
          emit("refund", c.id, 0);
          tornOnce.add(c.id);
          torn = true;
          break;
        }
      if (torn) continue;
    }
    return null; // no legal move of any kind: genuinely stuck
  }
  return steps;
}
function reverseSteps(steps             , startTotal        )              {
  const rev              = [];
  let running = startTotal;
  for (let i = steps.length - 1; i >= 0; i--) {
    const s = steps[i] ;
    running += s.from - s.to;
    rev.push({
      kind: s.kind === "add" ? "refund" : "add",
      conId: s.conId,
      from: s.to,
      to: s.from,
      heldAfter: running,
    });
  }
  return rev;
}
function simplifySteps(
  cons            ,
  base            ,
  cur            ,
  steps             ,
  cap        ,
)              {
  const baseTotal = base.reduce((a, c) => a + c.size, 0);
  let out = steps;
  let changed = true;
  while (changed) {
    changed = false;
    outer: for (let i = 0; i < out.length; i++) {
      const a = out[i] ;
      for (let j = i + 1; j < out.length; j++) {
        const b = out[j] ;
        if (b.conId !== a.conId) continue;
        if (a.from === b.to && a.to === b.from) {
          const kept = out.filter((_, k) => k !== i && k !== j);
          let running = baseTotal;
          const rebuilt = kept.map((s) => {
            running += s.to - s.from;
            return { ...s, heldAfter: running };
          });
          if (verifyTransition(cons, base, cur, rebuilt, cap) === null) {
            out = rebuilt;
            changed = true;
            break outer;
          }
        }
        break; // an intervening move of the same constellation blocks the pair with i
      }
    }
  }
  return out;
}
function respecRung(steps             , base            )                 {
  const zeroed = new Set(steps.filter((s) => s.kind === "refund" && s.to === 0).map((s) => s.conId));
  return base.every((c) => zeroed.has(c.id)) ? "full-respec" : "incremental";
}
function transitionOrderPath(
  cons            ,
  table            ,
  base            ,
  cur            ,
  cap        ,
  tries = 16,
)                                                      {
  const conById = new Map(cons.map((c) => [c.id, c]));
  const delta = diffBuilds(base, cur, conById);
  if (!delta.baseOnly.length && !delta.curOnly.length && !delta.resize.length) {
    const size = cur.reduce((a, c) => a + c.size, 0);
    return size <= cap ? { steps: [], rung: "incremental" } : null;
  }
  // Best of all verified candidates by (moved points, steps, candidate order). Every earlier
  // engine's candidate is still generated and only ever shrunk by the verify-gated peephole,
  // so no pair can do worse than any earlier engine.
  const clean = (steps                    ) => steps && verifyTransition(cons, base, cur, steps, cap) === null;
  const moved = (steps             ) => steps.reduce((a, s) => a + Math.abs(s.to - s.from), 0);
  // simplifySteps preserves verification (the input is verified and every reduction re-verifies),
  // so consider needs no second verify after simplification.
  const candidates                                                 = [];
  const consider = (steps                    , rung                )       => {
    if (!clean(steps)) return;
    const simplified = simplifySteps(cons, base, cur, steps , cap);
    candidates.push({
      steps: simplified,
      rung: rung === "full-respec" ? respecRung(simplified, base) : rung,
    });
  };
  consider(stateWalkTransition(cons, table, base, cur, cap), "incremental");
  const back = stateWalkTransition(cons, table, cur, base, cap);
  consider(
    back &&
      reverseSteps(
        back,
        base.reduce((a, c) => a + c.size, 0),
      ),
    "incremental",
  );
  consider(seededReplay(cons, table, conById, delta, cap, tries), "incremental");
  consider(teardownRebuild(cons, table, base, cur, cap), "full-respec");
  if (!candidates.length) return null;
  let best = candidates[0] ;
  for (const c of candidates.slice(1))
    if (
      moved(c.steps) < moved(best.steps) ||
      (moved(c.steps) === moved(best.steps) && c.steps.length < best.steps.length)
    )
      best = c;
  return best;
}
Object.assign(exports,{incrementalTransition,teardownRebuild,stateWalkTransition,simplifySteps,transitionOrderPath});
}};const cache={};function req(n){if(cache[n])return cache[n];const e=cache[n]={};mods[n](req,e);return e;}g.DawnDevotion={...req('model'),...req('reachability'),...req('orderLegality')};if(typeof module!=='undefined')module.exports=g.DawnDevotion;})(globalThis);
