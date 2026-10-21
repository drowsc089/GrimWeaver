// Stat presentation adapted from the authorized Rem Skill Planner 4.7 reference.
// Independent DawnBuild UI and calculations; no GrimTools implementation.
(function(g){
const factories={};
factories.en=function(records,tags,externalName){
function resolveText(v){return tags[String(v||'').toLowerCase()]||v||'';}
function resolveSkillName(r){const raw=r?.skillDisplayName?.[0]||r?.description?.[0]||'',value=resolveText(raw);return /^tag/i.test(raw)&&value===raw?'':value;}
function colorizeStatName(type,text){return text||'';}
const GD_TEXT = {
  "TXT_DEF_PERC": "Increases {0} by {1,number,integer}%",
  "TXT_DEF_DUR": "{1,number,integer}% Reduction in {0}",
  "TXT_DEF_MAX": "+{1,number,integer}% Maximum {0}",
  "TXT_DEF_UNI_SHIELD_BLOCK": "{1,number,integer}% Chance to Block {0,number,integer} Damage",
  "DEF_ARMOR_ABSORPTION": "Armor Absorption",
  "DEF_AETHER": "Aether Resistance",
  "DEF_ALL": "All Resistances",
  "DEF_BLEED": "Bleeding Resistance",
  "DEF_BLEED_DOT": "Bleeding Duration",
  "DEF_BLOCK_CHANCE": "Shield Block Chance",
  "DEF_BLOCK_AMOUNT": "Shield Damage Blocked",
  "DEF_CHAOS": "Chaos Resistance",
  "DEF_COLD": "Cold Resistance",
  "DEF_COLD_DOT": "Frostburn Duration",
  "DEF_CONFUSION": "Reduced Confusion Duration",
  "DEF_CONFUSION_DOT": "Confusion Duration",
  "DEF_CONVERT": "Reduced Mind Control Duration",
  "DEF_CONVERT_DOT": "Mind Control Duration",
  "DEF_DISRUPTION": "Skill Disruption Protection",
  "DEF_DISRUPTION_DOT": "Skill Disruption Duration",
  "DEF_ELEMENTAL": "Elemental Resistance",
  "DEF_FEAR": "Reduced Fear Duration",
  "DEF_FEAR_DOT": "Fear Duration",
  "DEF_FIRE": "Fire Resistance",
  "DEF_FIRE_DOT": "Burn Duration",
  "DEF_FREEZE": "Reduced Freeze Duration",
  "DEF_FREEZE_DOT": "Freeze Duration",
  "DEF_KNOCKDOWN": "Reduced Knockdown Duration",
  "DEF_KNOCKDOWN_DOT": "Knockdown Duration",
  "DEF_LIFE": "Vitality Resistance",
  "DEF_LIFE_DOT": "Vitality Decay Duration",
  "DEF_LIFE_PERC": "Life Reduction Resistance",
  "DEF_REFLECT_PERC": "Reflected Damage Reduction",
  "DEF_LIGHTNING": "Lightning Resistance",
  "DEF_LIGHTNING_DOT": "Electrocute Duration",
  "DEF_MANA_BURN": "Mana Burn Resistance",
  "DEF_MANA_BURN_DOT": "Mana Burn Duration",
  "DEF_PETRIFY": "Petrification Resistance",
  "DEF_PETRIFY_DOT": "Petrification Duration",
  "DEF_PHYSICAL": "Physical Resistance",
  "DEF_PHYSICAL_DOT": "Internal Trauma Duration",
  "DEF_PIERCE": "Pierce Resistance",
  "DEF_POISON": "Acid & Poison Resistance",
  "DEF_POISON_DOT": "Poison Duration",
  "DEF_PROTECTION": "Armor",
  "DEF_REFLECT": "Damage Reflection %",
  "DEF_SLEEP": "Sleep Resistance",
  "DEF_SLEEP_DOT": "Sleep Duration",
  "DEF_SLOW_LIFE_LEECH": "Life Leech Resistance",
  "DEF_SLOW_LIFE_LEECH_DOT": "Life Leech Duration",
  "DEF_SLOW_MANA_LEECH": "Mana Leech Resistance",
  "DEF_SLOW_MANA_LEECH_DOT": "Mana Leech Duration",
  "DEF_STUN": "Reduced Stun Duration",
  "DEF_STUN_DOT": "Stun Duration",
  "DEF_TAUNT": "Protection from Taunting",
  "DEF_TAUNT_DOT": "Taunt Duration",
  "DEF_TOTALSPEED_RES": "Slow Resistance",
  "DEF_TOTALSPEED_RES_DOT": "Slow Duration",
  "DEF_TRAP": "Reduced Entrapment Duration",
  "STAT_HP_ACTIVATE": "Activates when Health drops below",
  "DEF_TRAP_DOT": "Entrapment Duration",
  "DEF_DAMAGE_ABSORB": "Damage Absorption",
  "TXT_CONVERT_FROM_TO": "{0,number,integer}% {1} converted to {2}",
  "TXT_OFF_ABS": "{1,number,integer} {0}",
  "TXT_OFF_ABS_CHANCE": "{2,number,integer}% Chance of {1,number,integer} {0}",
  "TXT_OFF_ABS_DUR": "{1,number,integer} {0} Over {3,number,integer} Seconds ({2,number,integer} Per Second)",
  "TXT_OFF_ABS_DUR_CHANCE": "{4,number,integer}% Chance of {1,number,integer} {0} Over {3,number,integer} Seconds ({2,number,integer} Per Second)",
  "TXT_OFF_ABS_RANGE": "{1,number,integer} - {2,number,integer} {0}",
  "TXT_OFF_ABS_RANGE_CHANCE": "{3,number,integer}% Chance of {1,number,integer} - {2,number,integer} {0}",
  "TXT_OFF_ABS_RANGE_DUR": "{1,number,integer} - {3,number,integer} {0} Over {5,number,integer} Seconds ({2,number,integer}-{4,number,integer} Per Second)",
  "TXT_OFF_ABS_PERC": "{1,number,integer}% {0}",
  "TXT_OFF_ABS_PERC_CHANCE": "{2,number,integer}% Chance of {1,number,integer}% {0}",
  "TXT_OFF_ABS_PERC_DUR": "{1,number,integer}% {0} for {2,number,integer} Seconds",
  "TXT_OFF_ABS_PERC_DUR_CHANCE": "{3,number,integer}% Chance of +{1,number,integer}% {0} for {2,number,integer} Seconds",
  "TXT_OFF_ABS_PERC_RANGE": "{1,number,integer}% - {2,number,integer}% {0}",
  "TXT_OFF_ABS_PERC_RANGE_CHANCE": "{3,number,integer}% Chance of {1,number,integer}% - {2,number,integer}% {0}",
  "TXT_OFF_ABS_PERC_RANGE_DUR": "{1,number,integer}% - {2,number,integer}% {0} Over {5,number,integer} Seconds ({2,number,integer}-{4,number,integer} Per Second)",
  "TXT_OFF_ABS_RANGE_DUR_CHANCE": "{6,number,integer}% Chance of {1,number,integer} - {3,number,integer} {0} Over {5,number,integer} Seconds ({2,number,integer}-{4,number,integer} Per Second)",
  "TXT_OFF_ABS_TIME": "{0} for {1,number,integer} Seconds",
  "TXT_OFF_ABS_TIME_CHANCE": "{2,number,integer}% Chance of {0} for {1,number,integer} Seconds",
  "TXT_OFF_ABS_TIME_CHANCE_FOR": "{2,number,integer}% Chance for {0} for {1,number,integer} Seconds",
  "TXT_OFF_ABS_TIME_RANGE": "{0} for {1,number,integer} - {2,number,integer} Seconds",
  "TXT_OFF_ABS_TIME_RANGE_CHANCE": "{3,number,integer}% Chance of {0} for {1,number,integer} - {2,number,integer} Seconds",
  "TXT_OFF_PERC": "+{1,number,integer}% {0}",
  "TXT_OFF_PERC_CHANCE": "{2,number,integer}% Chance of +{1,number,integer}% {0}",
  "TXT_OFF_PERC_DUR": "+{1,number,integer}% {0} With +{2,number,integer}% Improved Duration",
  "TXT_OFF_PERC_DUR_CHANCE": "{3,number,integer}% Chance of {1,number,integer}% {0} With +{2,number,integer}% Improved Duration",
  "STAT_PROJECTILE_PIERCE": "Chance for projectile to pass through enemies",
  "STAT_ABSORB": "Damage Absorption",
  "OFF_WEAPON_DAMAGE": "Weapon Damage",
  "OFF_AETHER": "Aether Damage",
  "OFF_CHAOS": "Chaos Damage",
  "OFF_COLD": "Cold Damage",
  "OFF_CONFUSION": "Confuse target",
  "OFF_CONVERT": "Control target's mind",
  "OFF_CRITICAL": "Critical Damage",
  "OFF_DISRUPTION": "Disrupt target's skills",
  "OFF_ELEMENTAL": "Elemental Damage",
  "OFF_ELEM_DMG_RED": "Reduced target's Elemental Damage",
  "OFF_ELEM_RES_RED_ABS": "Reduced target's Elemental Resistance",
  "OFF_FEAR": "Terrify target",
  "OFF_FIRE": "Fire Damage",
  "OFF_FREEZE": "Freeze target",
  "OFF_FUMBLE": "Fumble Attacks for target",
  "OFF_KNOCKDOWN": "Knockdown target",
  "OFF_LIFE": "Vitality Damage",
  "OFF_LIFE_PERC": "Reduction to Enemy's Health",
  "OFF_LIFE_LEECH": "Attack Damage converted to Health",
  "OFF_LIGHTNING": "Lightning Damage",
  "OFF_MANA_BURN_RATIO": "Energy Burn",
  "OFF_MANA_BURN_DRAIN": "Energy Drain",
  "OFF_PETRIFY": "Petrify target",
  "OFF_PHYSICAL": "Physical Damage",
  "OFF_PHYSICAL_BONUS": "Bonus Damage",
  "OFF_PHYS_DMG_RED": "Reduced target's Physical Damage",
  "OFF_PHYS_RES_RED_ABS": "Reduced target's Physical Resistance",
  "OFF_PIERCE": "Pierce Damage",
  "OFF_PIERCE_RATIO": "Armor Piercing",
  "OFF_POISON": "Acid Damage",
  "OFF_SLEEP": "Put target to Sleep",
  "OFF_SLOW_ATTACK": "Slower Enemy Attack",
  "OFF_SLOW_BLEED": "Bleeding Damage",
  "OFF_SLOW_COLD": "Frostburn Damage",
  "OFF_SLOW_DEFENSE": "Reduced target's Defensive Ability",
  "OFF_SLOW_DEF_RED": "Reduced target's Armor",
  "OFF_SLOW_FIRE": "Burn Damage",
  "OFF_SLOW_LIFE": "Vitality Decay",
  "OFF_SLOW_LIFE_LEECH": "Life Leech",
  "OFF_SLOW_LIGHTNING": "Electrocute Damage",
  "OFF_SLOW_MANA_LEECH": "Energy Leech",
  "OFF_SLOW_OFFENSE": "Reduced target's Offensive Ability",
  "OFF_SLOW_OFF_RED": "Reduced target's Physical Damage",
  "OFF_SLOW_PHYSICAL": "Internal Trauma Damage",
  "OFF_SLOW_POISON": "Poison Damage",
  "OFF_SLOW_RUNSPEED": "Slower Target Movement",
  "OFF_SLOW_TOTALSPEED": "Slow Target",
  "OFF_DMGMULT": "Total Damage Modified",
  "OFF_RETMULT": "Total Retaliation Damage Modified",
  "OFF_STUN": "Stun target",
  "OFF_FUMBLE": "target to Fumble attacks",
  "OFF_IMPAIRED_AIM": "Impaired Aim to target",
  "OFF_TOTALDAMAGE": "Total Damage",
  "OFF_TOTALDMGRED": "Reduced target's Damage",
  "OFF_TOTALRESRED": "Reduced target's Resistance",
  "OFF_TRAP": "Immobilize target",
  "RET_AETHER": "Aether Retaliation",
  "RET_CHAOS": "Chaos Retaliation",
  "RET_COLD": "Cold Retaliation",
  "RET_CONFUSION": "Confuse Retaliation",
  "RET_CONVERT": "Mind Control Retaliation",
  "RET_DAMAGE_PCT": "of Retaliation Damage added to Attack",
  "RET_ELEMENTAL": "Elemental Retaliation",
  "RET_FEAR": "Terrify Retaliation",
  "RET_FIRE": "Fire Retaliation",
  "RET_FREEZE": "Freeze Retaliation",
  "RET_LIFE": "Vitality Retaliation",
  "RET_LIFE_PERC": "Enemy Health Retaliation",
  "RET_LIGHTNING": "Lightning Retaliation",
  "RET_PETRIFY": "Petrify Retaliation",
  "RET_PHYSICAL": "Physical Damage Retaliation",
  "RET_PIERCE": "Piercing Retaliation",
  "RET_POISON": "Acid Retaliation",
  "RET_SLEEP": "Sleep Retaliation",
  "RET_SLOW_ATTACK": "Reduced Attack Speed Retaliation",
  "RET_SLOW_BLEED": "Bleeding Retaliation",
  "RET_SLOW_COLD": "Frostburn Retaliation",
  "RET_SLOW_DEFENSE": "Reduced target's DA Retaliation",
  "RET_SLOW_FIRE": "Burn Retaliation",
  "RET_SLOW_LIFE": "Vitality Decay Retaliation",
  "RET_SLOW_LIFE_LEECH": "Life Leech Retaliation",
  "RET_SLOW_LIGHTNING": "Electrocute Retaliation",
  "RET_SLOW_MANA_LEECH": "Mana Leech Retaliation",
  "RET_SLOW_OFFENSE": "Reduced OA Retaliation",
  "RET_SLOW_OFF_RED": "Damage Reduction Retaliation",
  "RET_SLOW_PHYSICAL": "Internal Trauma Retaliation",
  "RET_SLOW_POISON": "Poison Retaliation",
  "RET_SLOW_RUNSPEED": "Slowed Movement Retaliation",
  "RET_STUN": "Stun Retaliation",
  "RET_TOTALDAMAGE": "to All Retaliation Damage",
  "RET_TRAP": "Immobilize target Retaliation",
  "TXT_INT": "{1,number,integer} {0}",
  "TXT_INT_PLUS": "+{1,number,integer} {0}",
  "TXT_INT_CHANCE": "{2,number,integer}% Chance of {1,number,integer} {0}",
  "TXT_INT_PLUS_CHANCE": "+{2,number,integer}% Chance of {1,number,integer} {0}",
  "TXT_INT_PERC": "{1,number,integer}% {0}",
  "TXT_INT_PERC_CHANCE": "{2,number,integer}% Chance of {1,number,integer}% {0}",
  "TXT_FLOAT": "{1,number,#.#} {0}",
  "TXT_PERC": "{1,number,integer}% {0}",
  "TXT_PERC_CHANCE": "{2,number,integer}% Chance of {1,number,integer}% {0}",
  "TXT_TRIGGER_HEALTH": "Activates when Health drops below {0,number,integer}%",
  "TXT_UNI_RACE_DAMAGE": "+{0,number,integer}% Damage to {1}",
  "STAT_ENERGY": "Energy",
  "STAT_HEALTH": "Health",
  "STAT_CUNNING": "Cunning",
  "STAT_PHYSIQUE": "Physique",
  "STAT_SPIRIT": "Spirit",
  "STAT_DEF_ABIL_SHORT": "Defensive Ability",
  "STAT_OFF_ABIL_SHORT": "Offensive Ability",
  "STAT_AVOID_PROJECTILE": "Chance to Avoid Projectiles",
  "STAT_AVOID_MELEE": "Chance to Avoid Melee Attacks",
  "STAT_SPEED_ATTACK": "Attack Speed",
  "STAT_SPEED_CAST": "Casting Speed",
  "STAT_SPEED_RUN": "Run Speed",
  "STAT_SPEED_TOTAL": "Total Speed",
  "STAT_SPEED_ATTACK_MAX": "Max Attack Speed",
  "STAT_SPEED_CAST_MAX": "Max Casting Speed",
  "STAT_SPEED_RUN_MAX": "Max Movement Speed",
  "STAT_SHIELD_RECOVERY_RED": "Reduced Shield Recovery Time",
  "STAT_SHIELD_RECOVERY_TIME": "Seconds Shield Recovery",
  "STAT_REGEN_ENERGY": "Energy Regen per Second",
  "STAT_HEAL_INC": "Increased Healing Effects",
  "STAT_REGEN_HEALTH": "Health Regen per Second",
  "STAT_CONSTITUTION": "Constitution",
  "STAT_SKILL_HEALTH": "Health Restored",
  "STAT_ENERGY_LIMIT": "Energy Reserved",
  "STAT_ENERGY_RESERVE": "Energy Reserve",
  "STAT_LIGHT_RADIUS": "Light Radius",
  "STAT_CD_CHARGES": "Charges",
  "STAT_XP_INCREASE": "XP Increase",
  "STAT_REQ_REDUCTION": "Requirement Reduction",
  "STAT_RED_LEVEL_REQ": "Reduced Player Level Requirement for all Items",
  "STAT_RED_ARMOR_STR": "Reduced Physique Requirement for Armor",
  "STAT_RED_RANGED_DEX": "Reduced Cunning Requirement for Ranged Weapons",
  "STAT_RED_WEAPON_INT": "Reduced Spirit Requirement for all Weapons",
  "STAT_RED_MELEE_DEX": "Reduced Cunning Requirement for Melee Weapons",
  "STAT_RED_MELEE_STR": "Reduced Physique Requirement for Melee Weapons",
  "STAT_RED_JEWELRY_INT": "Reduced Spirit Requirement for Jewelry",
  "STAT_RED_SHIELD_STR": "Reduced Physique Requirement for Shields",
  "STAT_ENERGY_ABSORB": "Energy Absorption",
  "STAT_COOLDOWN_REDUCTION": "Cooldown Reduction",
  "STAT_SKILL_RECHARGE_REDUCTION": "Second Skill Recharge",
  "STAT_SKILL_DURATION": "Second Duration",
  "STAT_MANACOST_REDUCTION": "Energy Cost Reduction",
  "STAT_SKILL_RADIUS": "Meter Target Area",
  "STAT_PET_SUMMON": "Summon",
  "STAT_PET_LIMIT": "Summon Limit",
  "STAT_MAX_LEVEL_INC": "Max. Level",
  "STAT_TARGET_INC": "Targets",
};
const TAG_INFO = {
  "defensiveReflect": {tag:"DEF_REFLECT",prio:495,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveBlock": {tag:"DEF_BLOCK_CHANCE",prio:490,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:true,infoType:1},
  "blockRecoveryTime": {tag:"STAT_SHIELD_RECOVERY_TIME",prio:485,valueType:"FLOAT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:true,infoType:4},
  "defensiveProtection": {tag:"DEF_PROTECTION",prio:480,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:true,infoType:1},
  "defensiveBonusProtection": {tag:"DEF_PROTECTION",prio:475,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveAbsorption": {tag:"DEF_ARMOR_ABSORPTION",prio:470,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveBlockAmount": {tag:"DEF_BLOCK_AMOUNT",prio:465,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveAll": {tag:"DEF_ALL",prio:385,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensivePhysical": {tag:"DEF_PHYSICAL",prio:380,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensivePierce": {tag:"DEF_PIERCE",prio:370,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveElemental": {tag:"DEF_ELEMENTAL",prio:360,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveElementalResistance": {tag:"DEF_ELEMENTAL",prio:360,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensivePoison": {tag:"DEF_POISON",prio:355,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveAether": {tag:"DEF_AETHER",prio:350,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveChaos": {tag:"DEF_CHAOS",prio:345,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveCold": {tag:"DEF_COLD",prio:340,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveFire": {tag:"DEF_FIRE",prio:335,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveLightning": {tag:"DEF_LIGHTNING",prio:330,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveLife": {tag:"DEF_LIFE",prio:325,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveStun": {tag:"DEF_STUN",prio:95,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveFreeze": {tag:"DEF_FREEZE",prio:90,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensivePetrify": {tag:"DEF_PETRIFY",prio:85,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveSleep": {tag:"DEF_SLEEP",prio:80,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveTrap": {tag:"DEF_TRAP",prio:75,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:1},
  "defensiveDisruption": {tag:"DEF_DISRUPTION",prio:70,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveKnockdown": {tag:"DEF_KNOCKDOWN",prio:65,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveConvert": {tag:"DEF_CONVERT",prio:60,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveConfusion": {tag:"DEF_CONFUSION",prio:55,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveFear": {tag:"DEF_FEAR",prio:50,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensivePercentCurrentLife": {tag:"DEF_LIFE_PERC",prio:45,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensivePercentReflectionResistance": {tag:"DEF_REFLECT_PERC",prio:40,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveSlowLifeLeach": {tag:"DEF_SLOW_LIFE_LEECH",prio:35,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveBleeding": {tag:"DEF_BLEED",prio:30,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveTotalSpeedResistance": {tag:"DEF_TOTALSPEED_RES",prio:25,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveSlowManaLeach": {tag:"DEF_SLOW_MANA_LEECH",prio:20,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveManaBurnRatio": {tag:"DEF_MANA_BURN",prio:15,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveTaunt": {tag:"DEF_TAUNT",prio:10,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "weaponDamagePct": {tag:"OFF_WEAPON_DAMAGE",prio:398,valueType:"INT",flatCat:"PERCENTAGE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "damageAbsorptionPercent": {tag:"DEF_DAMAGE_ABSORB",prio:397,valueType:"INT",flatCat:"PERCENTAGE",randCat:"SCALE_JITTER",baseStat:false,infoType:1},
  "piercingProjectile": {tag:"STAT_PROJECTILE_PIERCE",prio:396,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:4},
  "offensivePhysical": {tag:"OFF_PHYSICAL",prio:395,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:true,infoType:2},
  "offensivePierceRatio": {tag:"OFF_PIERCE_RATIO",prio:390,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:true,infoType:2},
  "offensiveBasePoison": {tag:"OFF_POISON",prio:385,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:true,infoType:2},
  "offensiveBaseAether": {tag:"OFF_AETHER",prio:380,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:true,infoType:2},
  "offensiveBaseChaos": {tag:"OFF_CHAOS",prio:375,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:true,infoType:2},
  "offensiveBaseCold": {tag:"OFF_COLD",prio:370,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:true,infoType:2},
  "offensiveBaseFire": {tag:"OFF_FIRE",prio:365,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:true,infoType:2},
  "offensiveBaseLightning": {tag:"OFF_LIGHTNING",prio:360,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:true,infoType:2},
  "offensiveBaseLife": {tag:"OFF_LIFE",prio:355,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:true,infoType:2},
  "offensiveLifeLeech": {tag:"OFF_LIFE_LEECH",prio:350,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:2},
  "offensiveTotalDamage": {tag:"OFF_TOTALDAMAGE",prio:345,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveBonusPhysical": {tag:"OFF_PHYSICAL_BONUS",prio:340,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "retaliationDamagePct": {tag:"RET_DAMAGE_PCT",prio:338,valueType:"INT",flatCat:"PERCENTAGE",randCat:"SCALE_JITTER",baseStat:false,infoType:3},
  "offensivePierce": {tag:"OFF_PIERCE",prio:335,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveElemental": {tag:"OFF_ELEMENTAL",prio:330,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensivePoison": {tag:"OFF_POISON",prio:325,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveAether": {tag:"OFF_AETHER",prio:320,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveChaos": {tag:"OFF_CHAOS",prio:315,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveCold": {tag:"OFF_COLD",prio:310,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveFire": {tag:"OFF_FIRE",prio:308,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveLightning": {tag:"OFF_LIGHTNING",prio:306,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveLife": {tag:"OFF_LIFE",prio:304,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveCritDamage": {tag:"OFF_CRITICAL",prio:302,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveSlowLifeLeach": {tag:"OFF_SLOW_LIFE_LEECH",prio:295,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowPhysical": {tag:"OFF_SLOW_PHYSICAL",prio:290,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowBleeding": {tag:"OFF_SLOW_BLEED",prio:285,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowCold": {tag:"OFF_SLOW_COLD",prio:280,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowFire": {tag:"OFF_SLOW_FIRE",prio:275,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowLightning": {tag:"OFF_SLOW_LIGHTNING",prio:270,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowPoison": {tag:"OFF_SLOW_POISON",prio:265,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowLife": {tag:"OFF_SLOW_LIFE",prio:260,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensivePercentCurrentLife": {tag:"OFF_LIFE_PERC",prio:255,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveTotalDamageReductionPercent": {tag:"OFF_TOTALDMGRED",prio:195,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveSlowTotalSpeed": {tag:"OFF_SLOW_TOTALSPEED",prio:190,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveDamageMult": {tag:"OFF_DMGMULT",prio:188,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:2},
  "retaliationDamageMult": {tag:"OFF_RETMULT",prio:188,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveSlowAttackSpeed": {tag:"OFF_SLOW_ATTACK",prio:185,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveSlowOffensiveReduction": {tag:"OFF_SLOW_OFF_RED",prio:180,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensivePhysicalReductionPercent": {tag:"OFF_PHYS_DMG_RED",prio:175,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveElementalReductionPercent": {tag:"OFF_ELEM_DMG_RED",prio:170,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveSlowOffensiveAbility": {tag:"OFF_SLOW_OFFENSE",prio:165,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowDefensiveAbility": {tag:"OFF_SLOW_DEFENSE",prio:160,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowDefensiveReduction": {tag:"OFF_SLOW_DEF_RED",prio:155,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowRunSpeed": {tag:"OFF_SLOW_RUNSPEED",prio:150,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveTotalResistanceReductionAbsolute": {tag:"OFF_TOTALRESRED",prio:145,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveTotalResistanceReductionPercent": {tag:"OFF_TOTALRESRED",prio:140,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensivePhysicalResistanceReductionAbsolute": {tag:"OFF_PHYS_RES_RED_ABS",prio:135,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensivePhysicalResistanceReductionPercent": {tag:"OFF_PHYS_RES_RED_ABS",prio:130,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveElementalResistanceReductionAbsolute": {tag:"OFF_ELEM_RES_RED_ABS",prio:125,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveElementalResistanceReductionPercent": {tag:"OFF_ELEM_RES_RED_ABS",prio:120,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveManaBurnDamageRatio": {tag:"OFF_MANA_BURN_RATIO",prio:115,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveManaBurnDrain": {tag:"OFF_MANA_BURN_DRAIN",prio:110,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveSlowManaLeach": {tag:"OFF_SLOW_MANA_LEECH",prio:105,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveStun": {tag:"OFF_STUN",prio:95,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveFumble": {tag:"OFF_FUMBLE",prio:95,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveProjectileFumble": {tag:"OFF_IMPAIRED_AIM",prio:95,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveFreeze": {tag:"OFF_FREEZE",prio:90,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensivePetrify": {tag:"OFF_PETRIFY",prio:85,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveSleep": {tag:"OFF_SLEEP",prio:80,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveTrap": {tag:"OFF_TRAP",prio:75,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveDisruption": {tag:"OFF_DISRUPTION",prio:70,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveKnockdown": {tag:"OFF_KNOCKDOWN",prio:65,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveConvert": {tag:"OFF_CONVERT",prio:60,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveConfusion": {tag:"OFF_CONFUSION",prio:55,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveFear": {tag:"OFF_FEAR",prio:50,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "retaliationTotalDamage": {tag:"RET_TOTALDAMAGE",prio:390,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationPhysical": {tag:"RET_PHYSICAL",prio:380,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationPierce": {tag:"RET_PIERCE",prio:370,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationElemental": {tag:"RET_ELEMENTAL",prio:360,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationPoison": {tag:"RET_POISON",prio:355,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationAether": {tag:"RET_AETHER",prio:350,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationChaos": {tag:"RET_CHAOS",prio:345,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationCold": {tag:"RET_COLD",prio:340,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationFire": {tag:"RET_FIRE",prio:335,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationLightning": {tag:"RET_LIGHTNING",prio:330,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationLife": {tag:"RET_LIFE",prio:325,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowLifeLeach": {tag:"RET_SLOW_LIFE_LEECH",prio:295,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowPhysical": {tag:"RET_SLOW_PHYSICAL",prio:290,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowBleeding": {tag:"RET_SLOW_BLEED",prio:285,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowCold": {tag:"RET_SLOW_COLD",prio:280,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowFire": {tag:"RET_SLOW_FIRE",prio:275,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowLightning": {tag:"RET_SLOW_LIGHTNING",prio:270,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowPoison": {tag:"RET_SLOW_POISON",prio:265,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowLife": {tag:"RET_SLOW_LIFE",prio:260,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationPercentCurrentLife": {tag:"RET_LIFE_PERC",prio:255,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationSlowAttackSpeed": {tag:"RET_SLOW_ATTACK",prio:185,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationSlowOffensiveReduction": {tag:"RET_SLOW_OFF_RED",prio:180,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowOffensiveAbility": {tag:"RET_SLOW_OFFENSE",prio:170,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowDefensiveAbility": {tag:"RET_SLOW_DEFENSE",prio:165,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowRunSpeed": {tag:"RET_SLOW_RUNSPEED",prio:155,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationStun": {tag:"RET_STUN",prio:95,valueType:"INT",flatCat:"DURATION",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationFreeze": {tag:"RET_FREEZE",prio:90,valueType:"INT",flatCat:"DURATION",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationPetrify": {tag:"RET_PETRIFY",prio:85,valueType:"INT",flatCat:"DURATION",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationSleep": {tag:"RET_SLEEP",prio:80,valueType:"INT",flatCat:"DURATION",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationTrap": {tag:"RET_TRAP",prio:75,valueType:"INT",flatCat:"DURATION",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationConvert": {tag:"RET_CONVERT",prio:60,valueType:"INT",flatCat:"DURATION",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationConfusion": {tag:"RET_CONFUSION",prio:55,valueType:"INT",flatCat:"DURATION",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationFear": {tag:"RET_FEAR",prio:50,valueType:"INT",flatCat:"DURATION",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationSlowManaLeach": {tag:"RET_SLOW_MANA_LEECH",prio:40,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "characterTotalSpeed": {tag:"STAT_SPEED_TOTAL",prio:998,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "skillCooldownReduction": {tag:"STAT_COOLDOWN_REDUCTION",prio:996,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:4},
  "skillCooldownTime": {tag:"STAT_SKILL_RECHARGE_REDUCTION",prio:994,valueType:"FLOAT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterAttackSpeed": {tag:"STAT_SPEED_ATTACK",prio:992,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterSpellCastSpeed": {tag:"STAT_SPEED_CAST",prio:990,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterRunSpeed": {tag:"STAT_SPEED_RUN",prio:988,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  // Max speed caps (e.g. +10% Max Attack/Casting/Movement Speed) exist only in expansion data, not the
  // base game. Field names are derived from Text_EN's tagChar<X> <-> character<X> naming; not verified
  // against a real expansion .dbr yet.
  "characterAttackSpeedMax": {tag:"STAT_SPEED_ATTACK_MAX",prio:987,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterSpellCastSpeedMax": {tag:"STAT_SPEED_CAST_MAX",prio:986,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterRunSpeedMax": {tag:"STAT_SPEED_RUN_MAX",prio:985,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterDefensiveBlockRecoveryReduction": {tag:"STAT_SHIELD_RECOVERY_RED",prio:988,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterIncreasedExperience": {tag:"STAT_XP_INCREASE",prio:898,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterGlobalReqReduction": {tag:"STAT_REQ_REDUCTION",prio:888,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterLevelReqReduction": {tag:"STAT_RED_LEVEL_REQ",prio:884,valueType:"INT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterArmorStrengthReqReduction": {tag:"STAT_RED_ARMOR_STR",prio:878,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterWeaponStrengthReqReduction": {tag:"STAT_RED_WEAPON_INT",prio:856,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterHuntingDexterityReqReduction": {tag:"STAT_RED_RANGED_DEX",prio:848,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterMeleeDexterityReqReduction": {tag:"STAT_RED_MELEE_DEX",prio:838,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterMeleeStrengthReqReduction": {tag:"STAT_RED_MELEE_STR",prio:836,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterJewelryIntelligenceReqReduction": {tag:"STAT_RED_JEWELRY_INT",prio:828,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterShieldStrengthReqReduction": {tag:"STAT_RED_SHIELD_STR",prio:818,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterDexterity": {tag:"STAT_CUNNING",prio:798,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterStrength": {tag:"STAT_PHYSIQUE",prio:796,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterIntelligence": {tag:"STAT_SPIRIT",prio:794,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterOffensiveAbility": {tag:"STAT_OFF_ABIL_SHORT",prio:698,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterDefensiveAbility": {tag:"STAT_DEF_ABIL_SHORT",prio:696,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterDeflectProjectile": {tag:"STAT_AVOID_PROJECTILE",prio:688,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterDodgePercent": {tag:"STAT_AVOID_MELEE",prio:686,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "skillLifeBonus": {tag:"STAT_SKILL_HEALTH",prio:598,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "skillLifePercent": {tag:"STAT_SKILL_HEALTH",prio:597,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterHealIncreasePercent": {tag:"STAT_HEAL_INC",prio:596,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterLifeRegen": {tag:"STAT_REGEN_HEALTH",prio:595,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterLife": {tag:"STAT_HEALTH",prio:594,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterConstitution": {tag:"STAT_CONSTITUTION",prio:592,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "racialBonusPercentDamage": {tag:"TXT_UNI_RACE_DAMAGE",prio:498,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:0},
  "characterManaRegen": {tag:"STAT_REGEN_ENERGY",prio:488,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "skillManaCostReduction": {tag:"STAT_MANACOST_REDUCTION",prio:478,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterEnergyAbsorptionPercent": {tag:"STAT_ENERGY_ABSORB",prio:468,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterMana": {tag:"STAT_ENERGY",prio:398,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterManaLimitReserve": {tag:"STAT_ENERGY_LIMIT",prio:396,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterManaLimitReserveReduction": {tag:"STAT_ENERGY_RESERVE",prio:394,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "skillTargetRadius": {tag:"STAT_SKILL_RADIUS",prio:392,valueType:"FLOAT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:false,infoType:4},
  "petBurstSpawn": {tag:"STAT_PET_SUMMON",prio:390,valueType:"INT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:false,infoType:4},
  "petLimit": {tag:"STAT_PET_LIMIT",prio:388,valueType:"INT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:false,infoType:4},
  "skillActiveDuration": {tag:"STAT_SKILL_DURATION",prio:386,valueType:"FLOAT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:false,infoType:4},
  "skillMaxLevel": {tag:"STAT_MAX_LEVEL_INC",prio:384,valueType:"INT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:false,infoType:4},
  "skillTargetNumber": {tag:"STAT_TARGET_INC",prio:382,valueType:"INT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:false,infoType:4},
  "sparkMaxNumber": {tag:"STAT_TARGET_INC",prio:380,valueType:"INT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterLightRadius": {tag:"STAT_LIGHT_RADIUS",prio:298,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "cooldownCharges": {tag:"STAT_CD_CHARGES",prio:58,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:1},
  "lifeMonitorPercent": {tag:"STAT_HP_ACTIVATE",prio:90,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:1},
  "damageAbsorption": {tag:"STAT_ABSORB",prio:58,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:1},
};
function attr(rec, name) {
  const v = rec[name];
  return (v && v.length) ? v[0] : undefined;
}
function attrList(rec, name) {
  return rec[name] || [];
}
function resolveTagValue(rawValue) {
  if (!rawValue) return rawValue;
  return resolveText('tag' + rawValue);
}
const STAT_SUFFIXES = [
  ['DurationModifierChance', 'durationModifierChance'],
  ['DurationModifier', 'durationModifier'],
  ['DurationChance', 'durationChance'],
  ['ModifierChance', 'modifierChance'],
  ['DurationMax', 'maxDuration'],
  ['DurationMin', 'minDuration'],
  ['MaxResist', 'maxResist'],
  ['Modifier', 'modifier'],
  ['Duration', 'minDuration'],
  ['Chance', 'chance'],
  ['Global', 'global'],
  ['XOR', 'xor'],
  ['Max', 'max'],
  ['Min', 'min'],
  ['', 'min'],
];
TAG_INFO.defensiveAllResistance = {...TAG_INFO.defensiveAll};
const STAT_TYPE_KEYS_BY_LENGTH = Object.keys(TAG_INFO).sort((a, b) => b.length - a.length);
const STAT_TYPE_EXCLUDE = new Set(['skillMaxLevel', 'skillTargetNumber']);
function parseSkillStats(skillRec) {
  const result = {};
  for (const statType of STAT_TYPE_KEYS_BY_LENGTH) {
    if (STAT_TYPE_EXCLUDE.has(statType)) continue;
    const perLevelFields = {};
    let foundAny = false;
    for (const [suffix, field] of STAT_SUFFIXES) {
      const fullKey = statType + suffix;
      const arr = skillRec[fullKey];
      if (!Array.isArray(arr) || arr.length === 0) continue;
      foundAny = true;
      perLevelFields[field] = arr;
    }
    if (foundAny) result[statType] = perLevelFields;
  }
  return result;
}
function getStatAtLevel(perLevelFields, targetLevel) {
  const result = {};
  for (const field of Object.keys(perLevelFields)) {
    const arr = perLevelFields[field];
    if (field === 'global' || field === 'xor') {
      result[field] = arr[0] === true || arr[0] === 1;
      continue;
    }
    const idx = Math.min(targetLevel, arr.length) - 1;
    if (idx < 0) continue;
    const v = parseFloat(arr[idx]);
    if (!isNaN(v)) result[field] = v;
  }
  return result;
}
function tagText(tagKey) {
  return GD_TEXT[tagKey] !== undefined ? GD_TEXT[tagKey] : null;
}
function formatTag(tagKey, args) {
  const template = GD_TEXT[tagKey];
  if (template === undefined) return null;
  return template.replace(/\{(\d+)(,[^}]*)?\}/g, (m, idx) => {
    const v = args[parseInt(idx, 10)];
    return v !== undefined ? String(v) : '';
  });
}
function round1(n) { return Math.round(n * 10) / 10; }
const CAT = {
  ACTIVATION: 0, ENERGY_COST: 1, SKILL_RECHARGE: 2, DURATION: 3, CHANCE_PASS: 4,
  MECHANIC: 5, CORE_ABILITY: 6, CORE_DEFENSE: 7, WEAPON_DAMAGE: 8,
  NORMAL_FLAT: 9, CONVERSION: 10, DURATION_FLAT: 11, NORMAL_PCT: 12,
  DURATION_PCT: 13, RESIST_REDUCTION: 14, OTHER: 15,
};
function sortedLineTexts(lineObjs) {
  return lineObjs.slice().sort((a, b) => a.cat - b.cat).map(l => l.text);
}
const FLAT_DEBUFF_TAGS = new Set(['OFF_SLOW_DEFENSE', 'OFF_SLOW_OFFENSE']);
const FLAT_DEBUFF_ABS_TAGS = new Set(['OFF_TOTALRESRED', 'OFF_PHYS_RES_RED_ABS', 'OFF_ELEM_RES_RED_ABS']);
function buildOffenseLines(stat, tagInfo, globalChance) {
  const lines = [];
  const statDesc = colorizeStatName(tagInfo.tag, tagText(tagInfo.tag));
  if (statDesc === '' || statDesc === null) return lines;
  const isWeaponDmg = tagInfo.tag === 'OFF_WEAPON_DAMAGE';
  // A stat in a shared "global" chance roll (e.g. Terrifying Gaze's "5% Chance for one of the
  // following: Stun / Confuse") displays the skill's offensiveGlobalChance, not its own Chance field
  // (which can hold an unrelated value).
  const effChance = (stat.global && globalChance != null) ? globalChance : stat.chance;
  // Stats flagged Global share ONE roll (offensiveGlobalChance) and are listed under a single "N%
  // Chance of:" / "N% Chance for one of the following:" header instead of each carrying its own
  // chance; see groupGlobalChanceLines.
  const grouped = !!(stat.global && globalChance);
  // Text_EN tagDamageModifierDamageMult: "Total Damage Modified by 18%" (value after the label). The
  // value may live in .min or .modifier.
  if (tagInfo.tag === 'OFF_DMGMULT') {
    const lo = stat.modifier || stat.min;
    const hi = stat.modifier ? stat.modifierMax : stat.max;
    if (!lo) return lines;
    const amt = hi && hi !== lo ? `${round1(lo)}% - ${round1(hi)}%` : `${round1(lo)}%`;
    lines.push({ text: `${statDesc} by ${amt}`, cat: CAT.NORMAL_PCT });
    return lines;
  }

  if (stat.min) {
    // OFF_FUMBLE/OFF_IMPAIRED_AIM (Searing Light) put the % chance in the base Min field and the
    // duration in DurationMax, leaving DurationMin/Chance empty (unlike Stun/Confuse, which use a real
    // Chance field), so they are handled directly instead of through the generic
    // min/minDuration/chance logic.
    if (tagInfo.tag === 'OFF_FUMBLE' || tagInfo.tag === 'OFF_IMPAIRED_AIM') {
      const durVal = stat.maxDuration || stat.minDuration;
      if (durVal) {
        const tag = tagInfo.tag === 'OFF_FUMBLE' ? 'TXT_OFF_ABS_TIME_CHANCE_FOR' : 'TXT_OFF_ABS_TIME_CHANCE';
        const text = formatTag(tag, [statDesc, durVal, round1(stat.min)]);
        if (text) lines.push({ text, cat: CAT.DURATION_FLAT });
      }
      return lines;
    }
    // OA/DA reductions are a flat debuff HELD for the duration ("110 Reduced target's Defensive
    // Ability for 3 Seconds"), not damage ticking per second, so the generic "_DUR" path (multiplies
    // by duration, adds "Per Second") doesn't apply. Absolute resistance reductions read the same way.
    if (stat.minDuration && (FLAT_DEBUFF_TAGS.has(tagInfo.tag) || (FLAT_DEBUFF_ABS_TAGS.has(tagInfo.tag) && tagInfo.flatCat === 'ABSOLUTE'))) {
      const amt = stat.max && stat.max !== stat.min
        ? `${round1(stat.min)} - ${round1(stat.max)}` : `${round1(stat.min)}`;
      // total resistance reduction reads plural in-game
      const descShown = tagInfo.tag === 'OFF_TOTALRESRED' ? statDesc.replace(/Resistance(?!s)/, 'Resistances') : statDesc;
      let text = `${amt} ${descShown} for ${round1(stat.minDuration)} Seconds`;
      if (!grouped && effChance && (!stat.global || stat.xor)) text = `${round1(effChance)}% Chance of ${text}`;
      lines.push({ text, cat: CAT.DURATION_FLAT });
      return lines;
    }
    const isPerc = tagInfo.flatCat === 'PERCENTAGE';
    // Percentage debuff with a duration AND a roll range (e.g. Malady's "Slow Target"): the
    // TXT_OFF_ABS_PERC_RANGE_DUR template is DoT-style with mismatched argument slots, so format like
    // TXT_OFF_ABS_PERC_DUR ("15% Slow Target for 2 Seconds") with a range.
    if (isPerc && stat.minDuration && stat.max !== undefined && stat.max !== stat.min && !isWeaponDmg) {
      let text = `${round1(stat.min)}% - ${round1(stat.max)}% ${statDesc} for ${round1(stat.minDuration)} Seconds`;
      if (!grouped && effChance && (!stat.global || stat.xor)) text = `${round1(effChance)}% Chance of ${text}`;
      lines.push({ text, cat: CAT.DURATION_FLAT });
    } else {
    let tag = 'TXT_OFF_ABS';
    const lArgs = [statDesc];
    if (!stat.minDuration) {
      lArgs.push(round1(stat.min));
    } else if (isPerc) {
      lArgs.push(round1(stat.min));
    } else {
      lArgs.push(round1(stat.min * stat.minDuration));
      lArgs.push(round1(stat.min));
    }
    if (isPerc) tag += '_PERC';
    if (tagInfo.flatCat === 'DURATION') tag += '_TIME';
    if (stat.max) {
      tag += '_RANGE';
      if (!stat.minDuration) lArgs.push(round1(stat.max));
      else if (isPerc) lArgs.push(round1(stat.max));
      else { lArgs.push(round1(stat.max * stat.minDuration)); lArgs.push(round1(stat.max)); }
    }
    if (stat.minDuration) { tag += '_DUR'; lArgs.push(stat.minDuration); }
    if (!grouped && effChance && (!stat.global || stat.xor)) { tag += '_CHANCE'; lArgs.push(effChance); }
    const text = formatTag(tag, lArgs);
    if (text) {
      const cat = isWeaponDmg ? CAT.WEAPON_DAMAGE : (stat.minDuration ? CAT.DURATION_FLAT : CAT.NORMAL_FLAT);
      lines.push({ text, cat });
    }
    }
  }
  const modChance = grouped ? 0 : stat.modifierChance;
  if (stat.modifier) {
    if (stat.modifierMax !== undefined && stat.modifierMax !== stat.modifier && !stat.durationModifier && !modChance) {
      // No template exists for this range case either; formatted directly instead of via formatTag.
      lines.push({ text: `+${round1(stat.modifier)}% - ${round1(stat.modifierMax)}% ${statDesc}`, cat: isWeaponDmg ? CAT.WEAPON_DAMAGE : CAT.NORMAL_PCT });
    } else {
      let tag = 'TXT_OFF_PERC';
      const lArgs = [statDesc, round1(stat.modifier)];
      if (stat.durationModifier) { tag += '_DUR'; lArgs.push(stat.durationModifier); }
      if (modChance) { tag += '_CHANCE'; lArgs.push(modChance); }
      const text = formatTag(tag, lArgs);
      if (text) {
        const cat = isWeaponDmg ? CAT.WEAPON_DAMAGE : (stat.durationModifier ? CAT.DURATION_PCT : CAT.NORMAL_PCT);
        lines.push({ text, cat });
      }
    }
  }
  if (grouped) for (const l of lines) { l.globalGroup = true; l.xor = !!stat.xor; }
  return lines;
}
function groupGlobalChanceLines(lineObjs, globalChance) {
  const members = lineObjs.filter(l => l.globalGroup);
  if (!members.length || !globalChance) return lineObjs;
  const rest = lineObjs.filter(l => !l.globalGroup);
  const sortedMembers = members.slice().sort((a, b) => a.cat - b.cat);
  const cat = sortedMembers[0].cat;
  const anyXor = members.some(l => l.xor);
  const header = `${round1(globalChance)}% Chance ${anyXor ? 'for one of the following' : 'of'}:`;
  const block = [{ text: header, cat }];
  for (const m of sortedMembers) block.push({ text: `<span style="display:inline-block; margin-left:14px;">${m.text}</span>`, cat });
  return rest.concat(block);
}
function buildDefenseLines(stat, tagInfo) {
  const lines = [];
  const statDesc = colorizeStatName(tagInfo.tag, tagText(tagInfo.tag));
  if (statDesc === null) return lines;
  // STAT_CD_CHARGES ("Charges") and STAT_ABSORB ("Damage Absorption") are core mechanic/defense
  // descriptors and sort much earlier. STAT_HP_ACTIVATE is a passive "Activates when Health drops
  // below X%" trigger: it needs its own early slot (before Energy Cost/Skill Recharge) and text first,
  // then the number (TXT_TRIGGER_HEALTH template).
  let cat = CAT.RESIST_REDUCTION;
  if (tagInfo.tag === 'STAT_CD_CHARGES') cat = CAT.MECHANIC;
  else if (tagInfo.tag === 'STAT_ABSORB') cat = CAT.CORE_DEFENSE;
  else if (tagInfo.tag === 'STAT_HP_ACTIVATE') cat = CAT.ACTIVATION;
  if (stat.min) {
    if (tagInfo.tag === 'STAT_HP_ACTIVATE') {
      const text = formatTag('TXT_TRIGGER_HEALTH', [round1(stat.min)]);
      if (text) lines.push({ text, cat });
    } else if (stat.max !== undefined && stat.max !== stat.min && !stat.chance) {
      // No TXT_INT_RANGE/TXT_FLOAT_RANGE templates exist in GD_TEXT (the game formats item roll ranges
      // outside the tag-template system), so ranges are formatted directly. Plain case only; a
      // combined block chance+amount range isn't handled (falls through to the flat path).
      const isFloat = tagInfo.valueType === 'FLOAT';
      const minVal = isFloat ? round1(stat.min) : Math.round(stat.min);
      const maxVal = isFloat ? round1(stat.max) : Math.round(stat.max);
      const pct = tagInfo.flatCat === 'PERCENTAGE' ? '%' : '';
      const prefix = tagInfo.tag === 'STAT_CD_CHARGES' ? '+' : '';
      lines.push({ text: `${prefix}${minVal}${pct} - ${maxVal}${pct} ${statDesc}`, cat });
    } else {
      // STAT_CD_CHARGES shows a leading "+" in-game ("+1 Charges"); other plain defense int stats
      // don't.
      let tag = tagInfo.tag === 'STAT_CD_CHARGES' ? 'TXT_INT_PLUS' : 'TXT_INT';
      let lArgs = [statDesc, round1(stat.min)];
      if (tagInfo.flatCat === 'PERCENTAGE') tag += '_PERC';
      if (stat.chance) {
        tag += '_CHANCE';
        lArgs.push(stat.chance);
        if (tagInfo.tag === 'DEF_BLOCK_CHANCE') {
          tag = 'TXT_DEF_UNI_SHIELD_BLOCK';
          lArgs = [round1(stat.min), stat.chance];
        }
      }
      const text = formatTag(tag, lArgs);
      if (text) lines.push({ text, cat });
    }
  }
  if (stat.modifier) {
    if (stat.modifierMax !== undefined && stat.modifierMax !== stat.modifier) {
      lines.push({ text: `${round1(stat.modifier)}% - ${round1(stat.modifierMax)}% ${statDesc}`, cat });
    } else {
      const text = formatTag('TXT_DEF_PERC', [statDesc, round1(stat.modifier)]);
      if (text) lines.push({ text, cat });
    }
  }
  if (stat.minDuration) {
    const dotDesc = colorizeStatName(tagInfo.tag, tagText(tagInfo.tag + '_DOT')) || statDesc;
    const text = formatTag('TXT_DEF_DUR', [dotDesc, stat.minDuration]);
    if (text) lines.push({ text, cat });
  }
  if (stat.maxResist) {
    const text = formatTag('TXT_DEF_MAX', [statDesc, stat.maxResist]);
    if (text) lines.push({ text, cat });
  }
  return lines;
}
function buildCharStatLines(stat, tagInfo) {
  const lines = [];
  // Character stats (STAT_ prefix) don't get damage-type coloring: some contain a damage-type word
  // (e.g. a "Life"/Health stat) without being about that type.
  let statDesc = tagText(tagInfo.tag);
  if (statDesc === null) return lines;
  // STAT_SKILL_RADIUS is a mechanic descriptor like attack arc/target max, sorted right after Energy
  // Cost/Skill Recharge/Duration/Chance to pass. Label: a buff (global effect around the caster) says
  // "Meter Radius", a targeted/active skill (aimed area) says "Meter Target Area"; buff-ness comes
  // from the field's own "Global" companion flag (stat.global).
  if (tagInfo.tag === 'STAT_SKILL_RADIUS') statDesc = stat.global ? 'Meter Radius' : 'Meter Target Area';
  // Text_EN SkillManaCostReduction(Modifier): "-20% Skill Energy Cost" - leading minus and a different
  // label.
  if (tagInfo.tag === 'STAT_MANACOST_REDUCTION') {
    const lo = stat.min || stat.modifier;
    const hi = stat.min ? stat.max : stat.modifierMax;
    if (!lo) return lines;
    const amt = hi !== undefined && hi !== lo ? `-${round1(lo)}% - ${round1(hi)}%` : `-${round1(lo)}%`;
    lines.push({ text: `${amt} Skill Energy Cost`, cat: CAT.OTHER });
    return lines;
  }
  // STAT_SKILL_RECHARGE_REDUCTION ("Skill Recharge") gets its own early slot after Energy Cost.
  // STAT_OFF_ABIL_SHORT/STAT_DEF_ABIL_SHORT (Offensive/Defensive Ability) are core stats sorted early,
  // before Weapon/flat/percent damage and resistances.
  let cat = CAT.OTHER;
  if (tagInfo.tag === 'STAT_SKILL_DURATION') cat = CAT.DURATION;
  else if (tagInfo.tag === 'STAT_SKILL_RADIUS') cat = CAT.MECHANIC;
  else if (tagInfo.tag === 'STAT_SKILL_RECHARGE_REDUCTION') cat = CAT.SKILL_RECHARGE;
  else if (tagInfo.tag === 'STAT_OFF_ABIL_SHORT' || tagInfo.tag === 'STAT_DEF_ABIL_SHORT') cat = CAT.CORE_ABILITY;
  if (stat.min) {
    if (stat.max !== undefined && stat.max !== stat.min && !stat.chance) {
      // No range template exists for plain character stats (OA/DA etc); formatted directly.
      const isFloat = tagInfo.valueType === 'FLOAT';
      const minVal = isFloat ? round1(stat.min) : Math.round(stat.min);
      const maxVal = isFloat ? round1(stat.max) : Math.round(stat.max);
      const pct = tagInfo.flatCat === 'PERCENTAGE' ? '%' : '';
      lines.push({ text: `${minVal}${pct} - ${maxVal}${pct} ${statDesc}`, cat });
    } else {
      let tag = tagInfo.valueType === 'FLOAT' ? 'TXT_FLOAT' : 'TXT_INT';
      const lArgs = [statDesc, tagInfo.valueType === 'FLOAT' ? round1(stat.min) : Math.round(stat.min)];
      if (tagInfo.flatCat === 'PERCENTAGE') tag += '_PERC';
      if (stat.chance) { tag += '_CHANCE'; lArgs.push(stat.chance); }
      const text = formatTag(tag, lArgs);
      if (text) lines.push({ text, cat });
    }
  }
  if (stat.modifier) {
    if (stat.modifierMax !== undefined && stat.modifierMax !== stat.modifier && !stat.chance) {
      lines.push({ text: `${round1(stat.modifier)}% - ${round1(stat.modifierMax)}% ${statDesc}`, cat });
    } else {
      let tag = 'TXT_PERC';
      const lArgs = [statDesc, round1(stat.modifier)];
      if (stat.chance) { tag += '_CHANCE'; lArgs.push(stat.chance); }
      const text = formatTag(tag, lArgs);
      if (text) lines.push({ text, cat });
    }
  }
  return lines;
}
function getRacialLines(rec, level) {
  const races = attrList(rec, 'racialBonusRace').filter(Boolean);
  if (!races.length) return [];
  // Text_EN has a PLURAL form per race: tagRace004 = "Chthonic",
  // tagRace004P = "Chthonics" (the in-game tooltip uses the plural).
  const names = races.map(r => { const pl = tags['tag' + r + 'P']; return pl || resolveTagValue(r); });
  const raceText = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0];
  const lines = [];
  const pctDmg = getSkillLevelValue(rec, 'racialBonusPercentDamage', level);
  if (pctDmg) lines.push({ text: formatTag('TXT_UNI_RACE_DAMAGE', [Math.round(pctDmg), raceText]), cat: CAT.OTHER });
  const absDmg = getSkillLevelValue(rec, 'racialBonusAbsoluteDamage', level);
  if (absDmg) lines.push({ text: `+${Math.round(absDmg)} Damage to ${raceText}`, cat: CAT.OTHER });
  const pctDef = getSkillLevelValue(rec, 'racialBonusPercentDefense', level);
  if (pctDef) lines.push({ text: `${Math.round(pctDef)}% Less Damage from ${raceText}`, cat: CAT.OTHER });
  const absDef = getSkillLevelValue(rec, 'racialBonusAbsoluteDefense', level);
  if (absDef) lines.push({ text: `${Math.round(absDef)} Less Damage from ${raceText}`, cat: CAT.OTHER });
  return lines;
}
function buildStatLines(statType, statAtLevel, globalChance) {
  const tagInfo = TAG_INFO[statType];
  if (!tagInfo) return [];
  if (tagInfo.infoType === 1) return buildDefenseLines(statAtLevel, tagInfo);
  if (tagInfo.infoType === 2 || tagInfo.infoType === 3) return buildOffenseLines(statAtLevel, tagInfo, globalChance);
  if (tagInfo.infoType === 4) return buildCharStatLines(statAtLevel, tagInfo);
  return [];
}
const DAMAGE_TYPE_TAG = {
  Aether: 'OFF_AETHER', Chaos: 'OFF_CHAOS', Cold: 'OFF_COLD', Elemental: 'OFF_ELEMENTAL',
  Fire: 'OFF_FIRE', Life: 'OFF_LIFE', Lightning: 'OFF_LIGHTNING', Physical: 'OFF_PHYSICAL',
  Pierce: 'OFF_PIERCE', Poison: 'OFF_POISON',
};
function getSkillLevelValue(skillRec, field, level) {
  const arr = skillRec[field];
  if (!Array.isArray(arr) || !arr.length) return null;
  const idx = Math.min(level, arr.length) - 1;
  if (idx < 0) return null;
  const v = parseFloat(arr[idx]);
  return isNaN(v) ? null : v;
}
const REFRESH_COOLDOWN_TRIGGER_TEXT = {
  AttackEnemy: { text: 'Chance on Attack' },
  AttackEnemyCrit: { text: 'Chance on Critical Attack' },
  Block: { text: 'Chance on Block' },
  OnKill: { text: 'Chance on Enemy Death' },
  HitByEnemy: { text: 'Chance when Hit' },
  HitByMelee: { text: 'Chance when Hit by Melee Attacks' },
  HitByProjectile: { text: 'Chance when Hit by Ranged Attacks' },
  HitByCrit: { text: 'Chance when Hit by a Critical' },
  CastBuff: { text: 'Chance when a Buff is Cast' },
  OnEquip: { text: 'Active while Equipped', noChance: true },
};
function getExtraSkillInfoLines(skillRec, level) {
  const lines = [];
  const activationChance = getSkillLevelValue(skillRec, 'onHitActivationChance', level);
  if (activationChance) lines.push({ text: formatTag('TXT_INT_PERC', ['Chance of Activating', round1(activationChance)]), cat: CAT.ACTIVATION });
  // Weapon-attack procs that replace default attacks (Class Skill_WPAttack_BasicAttack, e.g. Scorch
  // Reality) roll against each other by weight, shown as "X% Chance to be Used" (skillChanceWeight
  // "15;20" -> "20%" at level 2).
  const chanceWeight = getSkillLevelValue(skillRec, 'skillChanceWeight', level);
  if (chanceWeight) lines.push({ text: formatTag('TXT_PERC', ['Chance to be Used', round1(chanceWeight)]), cat: CAT.ACTIVATION });
  // offensiveTauntMin (e.g. 100 on item_bestialrage_petbonus.dbr) has no TAG_INFO entry; the tooltip
  // shows just "Taunt target", without a number.
  if (getSkillLevelValue(skillRec, 'offensiveTauntMin', level)) lines.push({ text: 'Taunt target', cat: CAT.MECHANIC });
  // summons with a lifetime (spawnObjectsTimeToLive, e.g. 8 on Nightbringer)
  const ttl = getSkillLevelValue(skillRec, 'spawnObjectsTimeToLive', level);
  if (ttl) lines.push({ text: `Lives for ${round1(ttl)} Seconds`, cat: CAT.DURATION });
  // Skill_RefreshCooldown (skill_refreshcooldown.tpl, e.g. Markovian's
  // Vigilance/Fortress, Carnage relic, Aeon's Hourglass): refreshTime =
  // seconds taken off every currently active cooldown. In-game text
  // confirmed: "-1.2 Seconds to All Currently Active Skill Cooldowns",
  // shown above Skill Recharge.
  const refreshTime = getSkillLevelValue(skillRec, 'refreshTime', level);
  if (refreshTime) lines.push({ text: `-${round1(refreshTime)} Seconds to All Currently Active Skill Cooldowns`, cat: CAT.ACTIVATION });
  // Conditional cooldown refresh (skill_modifier.tpl / weapon-attack / potion
  // records): refreshCooldownSkill + refreshCooldownTrigger + Chance + Amount.
  // Wording from Text_EN tagSkillCooldownRefreshName ("{trigger} to reduce
  // cooldown of {skill} by N Seconds") with trigger phrases from
  // tagRefreshSkillCondition07/10/11/12/03/04/05/06/09/08. Template-default
  // records carry the whole enum list ("OnEquip;OnKill;...") with no amount -
  // those never match REFRESH_COOLDOWN_TRIGGER_TEXT, so they stay silent.
  const rcAmount = getSkillLevelValue(skillRec, 'refreshCooldownAmount', level);
  const rcTrigger = attr(skillRec, 'refreshCooldownTrigger');
  const rcSkillPath = attr(skillRec, 'refreshCooldownSkill');
  if (rcAmount && rcTrigger && rcSkillPath && REFRESH_COOLDOWN_TRIGGER_TEXT[rcTrigger]) {
    const rcChance = getSkillLevelValue(skillRec, 'refreshCooldownChance', level);
    const trig = REFRESH_COOLDOWN_TRIGGER_TEXT[rcTrigger];
    const trigText = trig.noChance ? trig.text : `${round1(rcChance || 100)}% ${trig.text}`;
    const rcRec = records[rcSkillPath];
    const rcName = (rcRec && resolveSkillName(rcRec)) || externalName(rcSkillPath);
    lines.push({ text: `${trigText} to reduce cooldown of ${rcName} by ${round1(rcAmount)} Seconds`, cat: CAT.OTHER }); // sorts last, after block chance/amount - matches the reference tooltip
  }
  // Conditional duration refresh (refreshDuration* fields, same trigger enum as
  // refreshCooldown*). Text_EN: with a cap (refreshDurationMax) "{trigger} to
  // refresh duration of {skill} by N Seconds (Max M Seconds)"
  // (tagSkillDurationRefreshNameMax), without one "... to extend duration of
  // {skill} by N Seconds" (tagSkillDurationRefreshName).
  const rdAmount = getSkillLevelValue(skillRec, 'refreshDurationAmount', level);
  const rdTrigger = attr(skillRec, 'refreshDurationTrigger');
  const rdSkillPath = attr(skillRec, 'refreshDurationSkill');
  if (rdAmount && rdTrigger && rdSkillPath && REFRESH_COOLDOWN_TRIGGER_TEXT[rdTrigger]) {
    const rdChance = getSkillLevelValue(skillRec, 'refreshDurationChance', level);
    const rdMax = getSkillLevelValue(skillRec, 'refreshDurationMax', level);
    const trig = REFRESH_COOLDOWN_TRIGGER_TEXT[rdTrigger];
    const trigText = trig.noChance ? trig.text : `${round1(rdChance || 100)}% ${trig.text}`;
    const rdRec = records[rdSkillPath];
    const rdName = (rdRec && resolveSkillName(rdRec)) || externalName(rdSkillPath);
    const text = rdMax
      ? `${trigText} to refresh duration of ${rdName} by ${round1(rdAmount)} Seconds (Max ${round1(rdMax)} Seconds)`
      : `${trigText} to extend duration of ${rdName} by ${round1(rdAmount)} Seconds`;
    lines.push({ text, cat: CAT.OTHER });
  }
  // Health cost while the skill is active (item_vampirism 120,
  // relic_sacrifice 200, item_bloodrite 50) - Text_EN "ActiveLifeCost":
  // "Active Health Cost per Second".
  const lifeCost = getSkillLevelValue(skillRec, 'skillActiveLifeCost', level);
  if (lifeCost) lines.push({ text: `${Math.round(lifeCost)} Active Health Cost per Second`, cat: CAT.ENERGY_COST });
  // Energy restored as % of max (item_homebrewedpotion 25%), paired with
  // skillLifePercent which already renders as "N% Health Restored"
  // (Text_EN "SkillManaPercent": "N% Energy Restored" - confirmed).
  const manaPct = getSkillLevelValue(skillRec, 'skillManaPercent', level);
  if (manaPct) lines.push({ text: `${round1(manaPct)}% Energy Restored`, cat: CAT.OTHER });
  // Projectile speed bonus (guns: c020 +33%, c005/c035 +50%) - Text_EN
  // "SkillProjectileSpeedModifier": "+N% Increase in Projectile Speed". A
  // range variant (...ModifierR) exists too, so it may roll on some items;
  // shown flat until an in-game range confirms that.
  const projSpeed = getSkillLevelValue(skillRec, 'skillProjectileSpeedModifier', level);
  if (projSpeed) lines.push({ text: `+${round1(projSpeed)}% Increase in Projectile Speed`, cat: CAT.OTHER });
  lines.push(...getRacialLines(skillRec, level));
  const manaCost = getSkillLevelValue(skillRec, 'skillManaCost', level);
  if (manaCost) lines.push({ text: formatTag('TXT_INT', ['Energy Cost', Math.round(manaCost)]), cat: CAT.ENERGY_COST });
  // skillProjectileNumber is the other projectile-count field (e.g. 8 on
  // Perforator Round); a value of 1 isn't shown in-game (Murmur's Kiss /
  // Scorch Reality both have 1 and no line), so only >1 is listed.
  const projCount = getSkillLevelValue(skillRec, 'projectileLaunchNumber', level)
    ?? ((n => (n > 1 ? n : null))(getSkillLevelValue(skillRec, 'skillProjectileNumber', level)));
  if (projCount) lines.push({ text: formatTag('TXT_INT', ['Projectile(s)', Math.round(projCount)]), cat: CAT.MECHANIC });
  const fragMin = getSkillLevelValue(skillRec, 'projectileFragmentsLaunchNumberMin', level);
  const fragMax = getSkillLevelValue(skillRec, 'projectileFragmentsLaunchNumberMax', level);
  if (fragMin || fragMax) {
    const lo = Math.round(fragMin ?? fragMax);
    const hi = Math.round(fragMax ?? fragMin);
    const fragText = lo === hi ? `${lo} Fragments` : `${lo} - ${hi} Fragments`;
    lines.push({ text: fragText, cat: CAT.MECHANIC });
  }
  // two distinct raw fields both surface as "Meter Radius" depending on the
  // skill (projectileExplosionRadius for most, explosionRadius for others
  // like Full Spread) - only one is ever populated on a given skill.
  const radius = getSkillLevelValue(skillRec, 'projectileExplosionRadius', level)
    ?? getSkillLevelValue(skillRec, 'explosionRadius', level);
  if (radius) lines.push({ text: formatTag('TXT_FLOAT', ['Meter Radius', round1(radius)]), cat: CAT.MECHANIC });
  const angle = getSkillLevelValue(skillRec, 'skillTargetAngle', level);
  if (angle) lines.push({ text: formatTag('TXT_INT', ['Degree Attack Arc', Math.round(angle)]), cat: CAT.MECHANIC });
  const num = getSkillLevelValue(skillRec, 'skillTargetNumber', level);
  if (num) lines.push({ text: formatTag('TXT_INT', ['Target Maximum', Math.round(num)]), cat: CAT.MECHANIC });
  // The real field name is "projectilePiercing" (bare); "projectilePiercingChance" is only the UI
  // tag's name.
  const pierce = getSkillLevelValue(skillRec, 'projectilePiercing', level)
    ?? getSkillLevelValue(skillRec, 'projectilePiercingChance', level);
  if (pierce) lines.push({ text: formatTag('TXT_PERC', ['Chance to pass through Enemies', round1(pierce)]), cat: CAT.CHANCE_PASS });
  const comboSpendReduction = getSkillLevelValue(skillRec, 'skillComboChargeSpendReduction', level);
  if (comboSpendReduction) lines.push({ text: formatTag('TXT_PERC', ['Chance to not consume Onslaught Stacks', round1(comboSpendReduction)]), cat: CAT.MECHANIC });
  const comboLevel = getSkillLevelValue(skillRec, 'skillComboChargeLevel', level);
  // the per-stack percentages (15%, 30%, 45%...) shown next to the stack
  // count in-game don't come from any .dbr field either of us could find -
  // they may be hardcoded in the engine specifically for this skill, so
  // only the confirmed stack COUNT is shown here, not that breakdown
  if (comboLevel) lines.push({ text: formatTag('TXT_INT', ['Onslaught Stacks', Math.round(comboLevel)]), cat: CAT.MECHANIC });
  // Savagery-style "charge" mechanic: N charge levels, each with its own
  // damage multiplier %, refreshing every D seconds
  const chargeLevel = getSkillLevelValue(skillRec, 'skillChargeLevel', level);
  if (chargeLevel) {
    const multArr = skillRec['skillChargeMultipliers'];
    let listText = '';
    if (Array.isArray(multArr) && multArr.length) {
      listText = ': ' + multArr.map(v => Math.round(parseFloat(v)) + '%').join(', ');
    }
    lines.push({ text: `${Math.round(chargeLevel)} Charge Levels${listText}`, cat: CAT.MECHANIC });
  }
  const chargeDuration = getSkillLevelValue(skillRec, 'skillChargeDuration', level);
  if (chargeDuration) lines.push({ text: formatTag('TXT_INT', ['Second Charge Level Duration', round1(chargeDuration)]), cat: CAT.MECHANIC });
  return lines;
}
function getConversionLines(skillRec, level, itemJitterCtx) {
  const lines = [];
  for (const suffix of ['', '2']) {
    const inType = attr(skillRec, 'conversionInType' + suffix);
    const outType = attr(skillRec, 'conversionOutType' + suffix);
    const percArr = skillRec['conversionPercentage' + suffix];
    if (!inType || !outType || !Array.isArray(percArr) || !percArr.length) continue;
    const idx = Math.min(level, percArr.length) - 1;
    if (idx < 0) continue;
    let perc = parseFloat(percArr[idx]);
    if (!perc) continue;
    const inText = colorizeStatName(inType, tagText(DAMAGE_TYPE_TAG[inType]));
    const outText = colorizeStatName(outType, tagText(DAMAGE_TYPE_TAG[outType]));
    if (!inText || !outText) continue;
    // Conversion percentage rolls with the same jitter formula as other item stats (Base=30 ->
    // "24/36%" with Jitter=20, Scale=0). Only for a flat single value (percArr.length === 1, the item
    // case); skills pass a level-indexed array and never hit this (itemJitterCtx is only passed by the
    // top-level item render).
    if (itemJitterCtx && percArr.length === 1) {
      const min = Math.round(perc * 0.8);
      const max = Math.round(perc * 1.2);
      const text = `${min}% - ${max}% ${inText} converted to ${outText}`;
      lines.push({ text, cat: CAT.CONVERSION });
      continue;
    }
    const text = formatTag('TXT_CONVERT_FROM_TO', [Math.round(perc), inText, outText]);
    if (text) lines.push({ text, cat: CAT.CONVERSION });
  }
  return lines;
}
function getSkillStatLines(skillRec, level, depth) {
  if (!skillRec || depth > 4 || level <= 0) return { own: [], pet: [] };
  const parsed = parseSkillStats(skillRec);
  let own = getExtraSkillInfoLines(skillRec, level).map((line,i)=>({...line,key:'extra:'+i}));
  const globalChance = getSkillLevelValue(skillRec, 'offensiveGlobalChance', level);
  for (const statType of Object.keys(parsed)) {
    own.push(...buildStatLines(statType, getStatAtLevel(parsed[statType], level), globalChance).map((line,i)=>({...line,key:'stat:'+statType+':'+i})));
  }
  own = own.concat(getConversionLines(skillRec, level).map((line,i)=>({...line,key:'conversion:'+i})));
  own = groupGlobalChanceLines(own, globalChance);
  let pet = [];
  const buffPath = attr(skillRec, 'buffSkillName');
  if (buffPath && records[buffPath]) {
    const sub = getSkillStatLines(records[buffPath], level, depth + 1);
    own = own.concat(sub.own.map(line=>({...line,key:'buff:'+buffPath+'/'+line.key})));
    pet = pet.concat(sub.pet.map(line=>({...line,key:'buff:'+buffPath+'/'+line.key})));
  }
  const petPath = attr(skillRec, 'petSkillName');
  if (petPath && records[petPath]) {
    const sub = getSkillStatLines(records[petPath], level, depth + 1);
    pet = pet.concat([...sub.own,...sub.pet].map(line=>({...line,key:'pet:'+petPath+'/'+line.key})));
  }
  const petBonusPath = attr(skillRec, 'petBonusName');
  if (petBonusPath && records[petBonusPath]) {
    const sub = getSkillStatLines(records[petBonusPath], level, depth + 1);
    pet = pet.concat([...sub.own,...sub.pet].map(line=>({...line,key:'bonus:'+petBonusPath+'/'+line.key})));
  }
  return { own, pet };
}
return {getSkillStatLines,sortedLineTexts,TAG_INFO,GD_TEXT};};
factories.zh=function(records,tags,externalName){
function resolveText(v){return tags[String(v||'').toLowerCase()]||v||'';}
function resolveSkillName(r){const raw=r?.skillDisplayName?.[0]||r?.description?.[0]||'',value=resolveText(raw);return /^tag/i.test(raw)&&value===raw?'':value;}
function colorizeStatName(type,text){return text||'';}
const GD_TEXT = {
  "TXT_DEF_PERC": "{0} 提升 {1,number,integer}%",
  "TXT_DEF_DUR": "{0} 降低 {1,number,integer}%",
  "TXT_DEF_MAX": "+{1,number,integer}% 最大 {0}",
  "TXT_DEF_UNI_SHIELD_BLOCK": "{1,number,integer}% 几率格挡 {0,number,integer} 伤害",
  "DEF_ARMOR_ABSORPTION": "护甲吸收",
  "DEF_AETHER": "虚化抗性",
  "DEF_ALL": "全抗性",
  "DEF_BLEED": "流血抗性",
  "DEF_BLEED_DOT": "流血持续时间",
  "DEF_BLOCK_CHANCE": "盾牌格挡几率",
  "DEF_BLOCK_AMOUNT": "盾牌格挡值",
  "DEF_CHAOS": "混乱抗性",
  "DEF_COLD": "冰冷抗性",
  "DEF_COLD_DOT": "霜燃效果持续时间",
  "DEF_CONFUSION": "受迷惑持续时间减少",
  "DEF_CONFUSION_DOT": "迷惑持续时间",
  "DEF_CONVERT": "受思维控制持续时间减少",
  "DEF_CONVERT_DOT": "思维控制持续时间",
  "DEF_DISRUPTION": "技能干扰抗性",
  "DEF_DISRUPTION_DOT": "技能干扰持续时间",
  "DEF_ELEMENTAL": "元素抗性",
  "DEF_FEAR": "恐惧抗性",
  "DEF_FEAR_DOT": "恐惧持续时间",
  "DEF_FIRE": "火焰抗性",
  "DEF_FIRE_DOT": "燃烧效果持续时间",
  "DEF_FREEZE": "受冻结持续时间减少",
  "DEF_FREEZE_DOT": "冻结持续时间",
  "DEF_KNOCKDOWN": "受击倒持续时间减少",
  "DEF_KNOCKDOWN_DOT": "击倒持续时间",
  "DEF_LIFE": "活力抗性",
  "DEF_LIFE_DOT": "活力衰减效果持续时间",
  "DEF_LIFE_PERC": "生命值百分比减少抗性",
  "DEF_REFLECT_PERC": "受反弹伤害降低",
  "DEF_LIGHTNING": "闪电抗性",
  "DEF_LIGHTNING_DOT": "电击效果持续时间",
  "DEF_MANA_BURN": "能量燃烧抗性",
  "DEF_MANA_BURN_DOT": "能量燃烧持续时间",
  "DEF_PETRIFY": "石化抗性",
  "DEF_PETRIFY_DOT": "石化持续时间",
  "DEF_PHYSICAL": "物理抗性",
  "DEF_PHYSICAL_DOT": "创伤持续时间",
  "DEF_PIERCE": "穿刺抗性",
  "DEF_POISON": "毒酸抗性",
  "DEF_POISON_DOT": "毒素效果持续时间",
  "DEF_PROTECTION": "护甲",
  "DEF_REFLECT": "伤害反弹 %",
  "DEF_SLEEP": "昏睡抗性",
  "DEF_SLEEP_DOT": "昏睡持续时间",
  "DEF_SLOW_LIFE_LEECH": "生命吸取抗性",
  "DEF_SLOW_LIFE_LEECH_DOT": "生命吸取持续时间",
  "DEF_SLOW_MANA_LEECH": "能量吸取抗性",
  "DEF_SLOW_MANA_LEECH_DOT": "能量吸取持续时间",
  "DEF_STUN": "受眩晕持续时间减少",
  "DEF_STUN_DOT": "眩晕持续时间",
  "DEF_TAUNT": "抵抗嘲讽",
  "DEF_TAUNT_DOT": "嘲讽持续时间",
  "DEF_TOTALSPEED_RES": "减速抗性",
  "DEF_TOTALSPEED_RES_DOT": "减速持续时间",
  "DEF_TRAP": "受禁锢持续时间减少",
  "STAT_HP_ACTIVATE": "生命值低于以下时激活",
  "DEF_TRAP_DOT": "禁锢持续时间",
  "DEF_DAMAGE_ABSORB": "伤害吸收",
  "TXT_CONVERT_FROM_TO": "{0,number,integer}% {1} 转换为 {2}",
  "TXT_OFF_ABS": "{1,number,integer} {0}",
  "TXT_OFF_ABS_CHANCE": "{2,number,integer}% 几率造成 {1,number,integer} {0}",
  "TXT_OFF_ABS_DUR": "{1,number,integer} {0} 持续 {3,number,integer} 秒（每秒 {2,number,integer}）",
  "TXT_OFF_ABS_DUR_CHANCE": "{4,number,integer}% 几率造成 {1,number,integer} {0} 持续 {3,number,integer} 秒（每秒 {2,number,integer}）",
  "TXT_OFF_ABS_RANGE": "{1,number,integer} - {2,number,integer} {0}",
  "TXT_OFF_ABS_RANGE_CHANCE": "{3,number,integer}% 几率造成 {1,number,integer} - {2,number,integer} {0}",
  "TXT_OFF_ABS_RANGE_DUR": "{1,number,integer} - {3,number,integer} {0} 持续 {5,number,integer} 秒（每秒 {2,number,integer}-{4,number,integer}）",
  "TXT_OFF_ABS_PERC": "{1,number,integer}% {0}",
  "TXT_OFF_ABS_PERC_CHANCE": "{2,number,integer}% 几率造成 {1,number,integer}% {0}",
  "TXT_OFF_ABS_PERC_DUR": "{1,number,integer}% {0} 持续 {2,number,integer} 秒",
  "TXT_OFF_ABS_PERC_DUR_CHANCE": "{3,number,integer}% 几率造成 +{1,number,integer}% {0} 持续 {2,number,integer} 秒",
  "TXT_OFF_ABS_PERC_RANGE": "{1,number,integer}% - {2,number,integer}% {0}",
  "TXT_OFF_ABS_PERC_RANGE_CHANCE": "{3,number,integer}% 几率造成 {1,number,integer}% - {2,number,integer}% {0}",
  "TXT_OFF_ABS_PERC_RANGE_DUR": "{1,number,integer}% - {2,number,integer}% {0} 持续 {5,number,integer} 秒（每秒 {2,number,integer}-{4,number,integer}）",
  "TXT_OFF_ABS_RANGE_DUR_CHANCE": "{6,number,integer}% 几率造成 {1,number,integer} - {3,number,integer} {0} 持续 {5,number,integer} 秒（每秒 {2,number,integer}-{4,number,integer}）",
  "TXT_OFF_ABS_TIME": "{0} 持续 {1,number,integer} 秒",
  "TXT_OFF_ABS_TIME_CHANCE": "{2,number,integer}% 几率造成 {0} 持续 {1,number,integer} 秒",
  "TXT_OFF_ABS_TIME_CHANCE_FOR": "{2,number,integer}% 几率造成 {0} 持续 {1,number,integer} 秒",
  "TXT_OFF_ABS_TIME_RANGE": "{0} 持续 {1,number,integer} - {2,number,integer} 秒",
  "TXT_OFF_ABS_TIME_RANGE_CHANCE": "{3,number,integer}% 几率造成 {0} 持续 {1,number,integer} - {2,number,integer} 秒",
  "TXT_OFF_PERC": "+{1,number,integer}% {0}",
  "TXT_OFF_PERC_CHANCE": "{2,number,integer}% 几率造成 +{1,number,integer}% {0}",
  "TXT_OFF_PERC_DUR": "+{1,number,integer}% {0} 持续时间 +{2,number,integer}%",
  "TXT_OFF_PERC_DUR_CHANCE": "{3,number,integer}% 几率造成 {1,number,integer}% {0}，持续时间 +{2,number,integer}%",
  "STAT_PROJECTILE_PIERCE": "投射物穿透敌人的几率",
  "STAT_ABSORB": "伤害吸收",
  "OFF_WEAPON_DAMAGE": "武器伤害",
  "OFF_AETHER": "虚化伤害",
  "OFF_CHAOS": "混乱伤害",
  "OFF_COLD": "冰冷伤害",
  "OFF_CONFUSION": "迷惑目标",
  "OFF_CONVERT": "控制目标思维",
  "OFF_CRITICAL": "暴击伤害",
  "OFF_DISRUPTION": "干扰目标技能",
  "OFF_ELEMENTAL": "元素伤害",
  "OFF_ELEM_DMG_RED": "降低目标元素伤害",
  "OFF_ELEM_RES_RED_ABS": "降低目标元素抗性",
  "OFF_FEAR": "恐惧目标",
  "OFF_FIRE": "火焰伤害",
  "OFF_FREEZE": "冻结目标",
  "OFF_FUMBLE": "目标近战攻击失误",
  "OFF_KNOCKDOWN": "击倒目标",
  "OFF_LIFE": "活力伤害",
  "OFF_LIFE_PERC": "减少敌人当前生命值",
  "OFF_LIFE_LEECH": "攻击伤害转化为生命值",
  "OFF_LIGHTNING": "闪电伤害",
  "OFF_MANA_BURN_RATIO": "能量燃烧",
  "OFF_MANA_BURN_DRAIN": "能量吸取",
  "OFF_PETRIFY": "石化目标",
  "OFF_PHYSICAL": "物理伤害",
  "OFF_PHYSICAL_BONUS": "额外伤害",
  "OFF_PHYS_DMG_RED": "降低目标物理伤害",
  "OFF_PHYS_RES_RED_ABS": "降低目标物理抗性",
  "OFF_PIERCE": "穿刺伤害",
  "OFF_PIERCE_RATIO": "穿刺转换",
  "OFF_POISON": "酸性伤害",
  "OFF_SLEEP": "使目标昏睡",
  "OFF_SLOW_ATTACK": "降低敌人攻击速度",
  "OFF_SLOW_BLEED": "流血伤害",
  "OFF_SLOW_COLD": "霜燃伤害",
  "OFF_SLOW_DEFENSE": "降低目标防御能力",
  "OFF_SLOW_DEF_RED": "降低目标护甲",
  "OFF_SLOW_FIRE": "燃烧伤害",
  "OFF_SLOW_LIFE": "活力衰减",
  "OFF_SLOW_LIFE_LEECH": "生命吸取",
  "OFF_SLOW_LIGHTNING": "电击伤害",
  "OFF_SLOW_MANA_LEECH": "能量吸取",
  "OFF_SLOW_OFFENSE": "降低目标攻击能力",
  "OFF_SLOW_OFF_RED": "降低目标物理伤害",
  "OFF_SLOW_PHYSICAL": "创伤伤害",
  "OFF_SLOW_POISON": "毒素伤害",
  "OFF_SLOW_RUNSPEED": "降低目标移动速度",
  "OFF_SLOW_TOTALSPEED": "减速目标",
  "OFF_DMGMULT": "总伤害修正",
  "OFF_RETMULT": "总反击伤害修正",
  "OFF_STUN": "眩晕目标",
  "OFF_FUMBLE": "目标近战攻击失误",
  "OFF_IMPAIRED_AIM": "目标远程瞄准障碍",
  "OFF_TOTALDAMAGE": "所有类型伤害",
  "OFF_TOTALDMGRED": "降低目标伤害",
  "OFF_TOTALRESRED": "降低目标抗性",
  "OFF_TRAP": "禁锢目标",
  "RET_AETHER": "虚化反击",
  "RET_CHAOS": "混乱反击",
  "RET_COLD": "冰冷反击",
  "RET_CONFUSION": "迷惑反击",
  "RET_CONVERT": "思维控制反击",
  "RET_DAMAGE_PCT": "的反击伤害附加至攻击",
  "RET_ELEMENTAL": "元素反击",
  "RET_FEAR": "恐惧反击",
  "RET_FIRE": "火焰反击",
  "RET_FREEZE": "冻结反击",
  "RET_LIFE": "活力反击",
  "RET_LIFE_PERC": "敌人生命值百分比减少反击",
  "RET_LIGHTNING": "闪电反击",
  "RET_PETRIFY": "石化反击",
  "RET_PHYSICAL": "物理反击",
  "RET_PIERCE": "穿刺反击",
  "RET_POISON": "酸性反击",
  "RET_SLEEP": "昏睡反击",
  "RET_SLOW_ATTACK": "降低攻击速度反击",
  "RET_SLOW_BLEED": "流血反击",
  "RET_SLOW_COLD": "霜燃反击",
  "RET_SLOW_DEFENSE": "降低目标防御能力反击",
  "RET_SLOW_FIRE": "燃烧反击",
  "RET_SLOW_LIFE": "活力衰减反击",
  "RET_SLOW_LIFE_LEECH": "生命吸取反击",
  "RET_SLOW_LIGHTNING": "电击反击",
  "RET_SLOW_MANA_LEECH": "能量吸取反击",
  "RET_SLOW_OFFENSE": "降低目标攻击能力反击",
  "RET_SLOW_OFF_RED": "降低伤害反击",
  "RET_SLOW_PHYSICAL": "创伤反击",
  "RET_SLOW_POISON": "毒素反击",
  "RET_SLOW_RUNSPEED": "降低移动速度反击",
  "RET_STUN": "眩晕反击",
  "RET_TOTALDAMAGE": "所有类型反击伤害",
  "RET_TRAP": "禁锢目标反击",
  "TXT_INT": "{1,number,integer} {0}",
  "TXT_INT_PLUS": "+{1,number,integer} {0}",
  "TXT_INT_CHANCE": "{2,number,integer}% 几率造成 {1,number,integer} {0}",
  "TXT_INT_PLUS_CHANCE": "+{2,number,integer}% 几率造成 {1,number,integer} {0}",
  "TXT_INT_PERC": "{1,number,integer}% {0}",
  "TXT_INT_PERC_CHANCE": "{2,number,integer}% 几率造成 {1,number,integer}% {0}",
  "TXT_FLOAT": "{1,number,#.#} {0}",
  "TXT_PERC": "{1,number,integer}% {0}",
  "TXT_PERC_CHANCE": "{2,number,integer}% 几率造成 {1,number,integer}% {0}",
  "TXT_TRIGGER_HEALTH": "生命值低于 {0,number,integer}% 时激活",
  "TXT_UNI_RACE_DAMAGE": "+{0,number,integer}% 对 {1} 的伤害",
  "STAT_ENERGY": "能量",
  "STAT_HEALTH": "生命",
  "STAT_CUNNING": "灵巧",
  "STAT_PHYSIQUE": "体格",
  "STAT_SPIRIT": "精神",
  "STAT_DEF_ABIL_SHORT": "防御能力",
  "STAT_OFF_ABIL_SHORT": "攻击能力",
  "STAT_AVOID_PROJECTILE": "几率回避投射物",
  "STAT_AVOID_MELEE": "几率回避近战攻击",
  "STAT_SPEED_ATTACK": "攻击速度(AS)",
  "STAT_SPEED_CAST": "施法速度(CS)",
  "STAT_SPEED_RUN": "奔跑速度",
  "STAT_SPEED_TOTAL": "所有速度",
  "STAT_SPEED_ATTACK_MAX": "最大攻击速度",
  "STAT_SPEED_CAST_MAX": "最大施法速度",
  "STAT_SPEED_RUN_MAX": "最大移动速度",
  "STAT_SHIELD_RECOVERY_RED": "盾牌恢复时间缩短",
  "STAT_SHIELD_RECOVERY_TIME": "秒盾牌恢复时间",
  "STAT_REGEN_ENERGY": "每秒能量回复",
  "STAT_HEAL_INC": "治疗效果提升",
  "STAT_REGEN_HEALTH": "每秒生命回复",
  "STAT_CONSTITUTION": "体力",
  "STAT_SKILL_HEALTH": "生命回复",
  "STAT_ENERGY_LIMIT": "预留能量",
  "STAT_ENERGY_RESERVE": "能量储备",
  "STAT_LIGHT_RADIUS": "照亮半径",
  "STAT_CD_CHARGES": "充能数",
  "STAT_XP_INCREASE": "经验值提升",
  "STAT_REQ_REDUCTION": "属性需求降低",
  "STAT_RED_LEVEL_REQ": "降低所有物品的玩家等级需求",
  "STAT_RED_ARMOR_STR": "降低护甲的体格需求",
  "STAT_RED_RANGED_DEX": "降低远程武器的灵巧需求",
  "STAT_RED_WEAPON_INT": "降低所有武器的精神需求",
  "STAT_RED_MELEE_DEX": "降低近战武器的灵巧需求",
  "STAT_RED_MELEE_STR": "降低近战武器的体格需求",
  "STAT_RED_JEWELRY_INT": "降低首饰的精神需求",
  "STAT_RED_SHIELD_STR": "降低盾牌的体格需求",
  "STAT_ENERGY_ABSORB": "能量吸收",
  "STAT_COOLDOWN_REDUCTION": "冷却时间缩短(CDR)",
  "STAT_SKILL_RECHARGE_REDUCTION": "秒技能冷却时间",
  "STAT_SKILL_DURATION": "秒持续时间",
  "STAT_MANACOST_REDUCTION": "能量消耗降低",
  "STAT_SKILL_RADIUS": "米目标区域",
  "STAT_PET_SUMMON": "召唤数量",
  "STAT_PET_LIMIT": "召唤上限",
  "STAT_MAX_LEVEL_INC": "最高等级",
  "STAT_TARGET_INC": "目标数量",
};
const TAG_INFO = {
  "defensiveReflect": {tag:"DEF_REFLECT",prio:495,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveBlock": {tag:"DEF_BLOCK_CHANCE",prio:490,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:true,infoType:1},
  "blockRecoveryTime": {tag:"STAT_SHIELD_RECOVERY_TIME",prio:485,valueType:"FLOAT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:true,infoType:4},
  "defensiveProtection": {tag:"DEF_PROTECTION",prio:480,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:true,infoType:1},
  "defensiveBonusProtection": {tag:"DEF_PROTECTION",prio:475,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveAbsorption": {tag:"DEF_ARMOR_ABSORPTION",prio:470,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveBlockAmount": {tag:"DEF_BLOCK_AMOUNT",prio:465,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveAll": {tag:"DEF_ALL",prio:385,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensivePhysical": {tag:"DEF_PHYSICAL",prio:380,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensivePierce": {tag:"DEF_PIERCE",prio:370,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveElemental": {tag:"DEF_ELEMENTAL",prio:360,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveElementalResistance": {tag:"DEF_ELEMENTAL",prio:360,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensivePoison": {tag:"DEF_POISON",prio:355,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveAether": {tag:"DEF_AETHER",prio:350,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveChaos": {tag:"DEF_CHAOS",prio:345,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveCold": {tag:"DEF_COLD",prio:340,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveFire": {tag:"DEF_FIRE",prio:335,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveLightning": {tag:"DEF_LIGHTNING",prio:330,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveLife": {tag:"DEF_LIFE",prio:325,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveStun": {tag:"DEF_STUN",prio:95,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveFreeze": {tag:"DEF_FREEZE",prio:90,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensivePetrify": {tag:"DEF_PETRIFY",prio:85,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveSleep": {tag:"DEF_SLEEP",prio:80,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveTrap": {tag:"DEF_TRAP",prio:75,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:1},
  "defensiveDisruption": {tag:"DEF_DISRUPTION",prio:70,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveKnockdown": {tag:"DEF_KNOCKDOWN",prio:65,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveConvert": {tag:"DEF_CONVERT",prio:60,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveConfusion": {tag:"DEF_CONFUSION",prio:55,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveFear": {tag:"DEF_FEAR",prio:50,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensivePercentCurrentLife": {tag:"DEF_LIFE_PERC",prio:45,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensivePercentReflectionResistance": {tag:"DEF_REFLECT_PERC",prio:40,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveSlowLifeLeach": {tag:"DEF_SLOW_LIFE_LEECH",prio:35,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveBleeding": {tag:"DEF_BLEED",prio:30,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveTotalSpeedResistance": {tag:"DEF_TOTALSPEED_RES",prio:25,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveSlowManaLeach": {tag:"DEF_SLOW_MANA_LEECH",prio:20,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveManaBurnRatio": {tag:"DEF_MANA_BURN",prio:15,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "defensiveTaunt": {tag:"DEF_TAUNT",prio:10,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:1},
  "weaponDamagePct": {tag:"OFF_WEAPON_DAMAGE",prio:398,valueType:"INT",flatCat:"PERCENTAGE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "damageAbsorptionPercent": {tag:"DEF_DAMAGE_ABSORB",prio:397,valueType:"INT",flatCat:"PERCENTAGE",randCat:"SCALE_JITTER",baseStat:false,infoType:1},
  "piercingProjectile": {tag:"STAT_PROJECTILE_PIERCE",prio:396,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:4},
  "offensivePhysical": {tag:"OFF_PHYSICAL",prio:395,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:true,infoType:2},
  "offensivePierceRatio": {tag:"OFF_PIERCE_RATIO",prio:390,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:true,infoType:2},
  "offensiveBasePoison": {tag:"OFF_POISON",prio:385,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:true,infoType:2},
  "offensiveBaseAether": {tag:"OFF_AETHER",prio:380,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:true,infoType:2},
  "offensiveBaseChaos": {tag:"OFF_CHAOS",prio:375,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:true,infoType:2},
  "offensiveBaseCold": {tag:"OFF_COLD",prio:370,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:true,infoType:2},
  "offensiveBaseFire": {tag:"OFF_FIRE",prio:365,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:true,infoType:2},
  "offensiveBaseLightning": {tag:"OFF_LIGHTNING",prio:360,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:true,infoType:2},
  "offensiveBaseLife": {tag:"OFF_LIFE",prio:355,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:true,infoType:2},
  "offensiveLifeLeech": {tag:"OFF_LIFE_LEECH",prio:350,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:2},
  "offensiveTotalDamage": {tag:"OFF_TOTALDAMAGE",prio:345,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveBonusPhysical": {tag:"OFF_PHYSICAL_BONUS",prio:340,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "retaliationDamagePct": {tag:"RET_DAMAGE_PCT",prio:338,valueType:"INT",flatCat:"PERCENTAGE",randCat:"SCALE_JITTER",baseStat:false,infoType:3},
  "offensivePierce": {tag:"OFF_PIERCE",prio:335,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveElemental": {tag:"OFF_ELEMENTAL",prio:330,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensivePoison": {tag:"OFF_POISON",prio:325,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveAether": {tag:"OFF_AETHER",prio:320,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveChaos": {tag:"OFF_CHAOS",prio:315,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveCold": {tag:"OFF_COLD",prio:310,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveFire": {tag:"OFF_FIRE",prio:308,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveLightning": {tag:"OFF_LIGHTNING",prio:306,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveLife": {tag:"OFF_LIFE",prio:304,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveCritDamage": {tag:"OFF_CRITICAL",prio:302,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveSlowLifeLeach": {tag:"OFF_SLOW_LIFE_LEECH",prio:295,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowPhysical": {tag:"OFF_SLOW_PHYSICAL",prio:290,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowBleeding": {tag:"OFF_SLOW_BLEED",prio:285,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowCold": {tag:"OFF_SLOW_COLD",prio:280,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowFire": {tag:"OFF_SLOW_FIRE",prio:275,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowLightning": {tag:"OFF_SLOW_LIGHTNING",prio:270,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowPoison": {tag:"OFF_SLOW_POISON",prio:265,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowLife": {tag:"OFF_SLOW_LIFE",prio:260,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensivePercentCurrentLife": {tag:"OFF_LIFE_PERC",prio:255,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveTotalDamageReductionPercent": {tag:"OFF_TOTALDMGRED",prio:195,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveSlowTotalSpeed": {tag:"OFF_SLOW_TOTALSPEED",prio:190,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveDamageMult": {tag:"OFF_DMGMULT",prio:188,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:2},
  "retaliationDamageMult": {tag:"OFF_RETMULT",prio:188,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveSlowAttackSpeed": {tag:"OFF_SLOW_ATTACK",prio:185,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveSlowOffensiveReduction": {tag:"OFF_SLOW_OFF_RED",prio:180,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensivePhysicalReductionPercent": {tag:"OFF_PHYS_DMG_RED",prio:175,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveElementalReductionPercent": {tag:"OFF_ELEM_DMG_RED",prio:170,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveSlowOffensiveAbility": {tag:"OFF_SLOW_OFFENSE",prio:165,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowDefensiveAbility": {tag:"OFF_SLOW_DEFENSE",prio:160,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowDefensiveReduction": {tag:"OFF_SLOW_DEF_RED",prio:155,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveSlowRunSpeed": {tag:"OFF_SLOW_RUNSPEED",prio:150,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveTotalResistanceReductionAbsolute": {tag:"OFF_TOTALRESRED",prio:145,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveTotalResistanceReductionPercent": {tag:"OFF_TOTALRESRED",prio:140,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensivePhysicalResistanceReductionAbsolute": {tag:"OFF_PHYS_RES_RED_ABS",prio:135,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensivePhysicalResistanceReductionPercent": {tag:"OFF_PHYS_RES_RED_ABS",prio:130,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveElementalResistanceReductionAbsolute": {tag:"OFF_ELEM_RES_RED_ABS",prio:125,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveElementalResistanceReductionPercent": {tag:"OFF_ELEM_RES_RED_ABS",prio:120,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveManaBurnDamageRatio": {tag:"OFF_MANA_BURN_RATIO",prio:115,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveManaBurnDrain": {tag:"OFF_MANA_BURN_DRAIN",prio:110,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveSlowManaLeach": {tag:"OFF_SLOW_MANA_LEECH",prio:105,valueType:"INT",flatCat:"ABSOLUTE",randCat:"SCALE_JITTER",baseStat:false,infoType:2},
  "offensiveStun": {tag:"OFF_STUN",prio:95,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveFumble": {tag:"OFF_FUMBLE",prio:95,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveProjectileFumble": {tag:"OFF_IMPAIRED_AIM",prio:95,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveFreeze": {tag:"OFF_FREEZE",prio:90,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensivePetrify": {tag:"OFF_PETRIFY",prio:85,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveSleep": {tag:"OFF_SLEEP",prio:80,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveTrap": {tag:"OFF_TRAP",prio:75,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveDisruption": {tag:"OFF_DISRUPTION",prio:70,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveKnockdown": {tag:"OFF_KNOCKDOWN",prio:65,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveConvert": {tag:"OFF_CONVERT",prio:60,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveConfusion": {tag:"OFF_CONFUSION",prio:55,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "offensiveFear": {tag:"OFF_FEAR",prio:50,valueType:"INT",flatCat:"DURATION",randCat:"JITTER",baseStat:false,infoType:2},
  "retaliationTotalDamage": {tag:"RET_TOTALDAMAGE",prio:390,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationPhysical": {tag:"RET_PHYSICAL",prio:380,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationPierce": {tag:"RET_PIERCE",prio:370,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationElemental": {tag:"RET_ELEMENTAL",prio:360,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationPoison": {tag:"RET_POISON",prio:355,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationAether": {tag:"RET_AETHER",prio:350,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationChaos": {tag:"RET_CHAOS",prio:345,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationCold": {tag:"RET_COLD",prio:340,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationFire": {tag:"RET_FIRE",prio:335,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationLightning": {tag:"RET_LIGHTNING",prio:330,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationLife": {tag:"RET_LIFE",prio:325,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowLifeLeach": {tag:"RET_SLOW_LIFE_LEECH",prio:295,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowPhysical": {tag:"RET_SLOW_PHYSICAL",prio:290,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowBleeding": {tag:"RET_SLOW_BLEED",prio:285,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowCold": {tag:"RET_SLOW_COLD",prio:280,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowFire": {tag:"RET_SLOW_FIRE",prio:275,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowLightning": {tag:"RET_SLOW_LIGHTNING",prio:270,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowPoison": {tag:"RET_SLOW_POISON",prio:265,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowLife": {tag:"RET_SLOW_LIFE",prio:260,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationPercentCurrentLife": {tag:"RET_LIFE_PERC",prio:255,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationSlowAttackSpeed": {tag:"RET_SLOW_ATTACK",prio:185,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationSlowOffensiveReduction": {tag:"RET_SLOW_OFF_RED",prio:180,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowOffensiveAbility": {tag:"RET_SLOW_OFFENSE",prio:170,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowDefensiveAbility": {tag:"RET_SLOW_DEFENSE",prio:165,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "retaliationSlowRunSpeed": {tag:"RET_SLOW_RUNSPEED",prio:155,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationStun": {tag:"RET_STUN",prio:95,valueType:"INT",flatCat:"DURATION",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationFreeze": {tag:"RET_FREEZE",prio:90,valueType:"INT",flatCat:"DURATION",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationPetrify": {tag:"RET_PETRIFY",prio:85,valueType:"INT",flatCat:"DURATION",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationSleep": {tag:"RET_SLEEP",prio:80,valueType:"INT",flatCat:"DURATION",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationTrap": {tag:"RET_TRAP",prio:75,valueType:"INT",flatCat:"DURATION",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationConvert": {tag:"RET_CONVERT",prio:60,valueType:"INT",flatCat:"DURATION",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationConfusion": {tag:"RET_CONFUSION",prio:55,valueType:"INT",flatCat:"DURATION",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationFear": {tag:"RET_FEAR",prio:50,valueType:"INT",flatCat:"DURATION",randCat:"FIXED",baseStat:false,infoType:3},
  "retaliationSlowManaLeach": {tag:"RET_SLOW_MANA_LEECH",prio:40,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:3},
  "characterTotalSpeed": {tag:"STAT_SPEED_TOTAL",prio:998,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "skillCooldownReduction": {tag:"STAT_COOLDOWN_REDUCTION",prio:996,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:4},
  "skillCooldownTime": {tag:"STAT_SKILL_RECHARGE_REDUCTION",prio:994,valueType:"FLOAT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterAttackSpeed": {tag:"STAT_SPEED_ATTACK",prio:992,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterSpellCastSpeed": {tag:"STAT_SPEED_CAST",prio:990,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterRunSpeed": {tag:"STAT_SPEED_RUN",prio:988,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  // Max speed caps (e.g. +10% Max Attack/Casting/Movement Speed) exist only in expansion data, not the
  // base game. Field names are derived from Text_EN's tagChar<X> <-> character<X> naming; not verified
  // against a real expansion .dbr yet.
  "characterAttackSpeedMax": {tag:"STAT_SPEED_ATTACK_MAX",prio:987,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterSpellCastSpeedMax": {tag:"STAT_SPEED_CAST_MAX",prio:986,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterRunSpeedMax": {tag:"STAT_SPEED_RUN_MAX",prio:985,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterDefensiveBlockRecoveryReduction": {tag:"STAT_SHIELD_RECOVERY_RED",prio:988,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterIncreasedExperience": {tag:"STAT_XP_INCREASE",prio:898,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterGlobalReqReduction": {tag:"STAT_REQ_REDUCTION",prio:888,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterLevelReqReduction": {tag:"STAT_RED_LEVEL_REQ",prio:884,valueType:"INT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterArmorStrengthReqReduction": {tag:"STAT_RED_ARMOR_STR",prio:878,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterWeaponStrengthReqReduction": {tag:"STAT_RED_WEAPON_INT",prio:856,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterHuntingDexterityReqReduction": {tag:"STAT_RED_RANGED_DEX",prio:848,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterMeleeDexterityReqReduction": {tag:"STAT_RED_MELEE_DEX",prio:838,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterMeleeStrengthReqReduction": {tag:"STAT_RED_MELEE_STR",prio:836,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterJewelryIntelligenceReqReduction": {tag:"STAT_RED_JEWELRY_INT",prio:828,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterShieldStrengthReqReduction": {tag:"STAT_RED_SHIELD_STR",prio:818,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterDexterity": {tag:"STAT_CUNNING",prio:798,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterStrength": {tag:"STAT_PHYSIQUE",prio:796,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterIntelligence": {tag:"STAT_SPIRIT",prio:794,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterOffensiveAbility": {tag:"STAT_OFF_ABIL_SHORT",prio:698,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterDefensiveAbility": {tag:"STAT_DEF_ABIL_SHORT",prio:696,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterDeflectProjectile": {tag:"STAT_AVOID_PROJECTILE",prio:688,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterDodgePercent": {tag:"STAT_AVOID_MELEE",prio:686,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "skillLifeBonus": {tag:"STAT_SKILL_HEALTH",prio:598,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "skillLifePercent": {tag:"STAT_SKILL_HEALTH",prio:597,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterHealIncreasePercent": {tag:"STAT_HEAL_INC",prio:596,valueType:"INT",flatCat:"PERCENTAGE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterLifeRegen": {tag:"STAT_REGEN_HEALTH",prio:595,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterLife": {tag:"STAT_HEALTH",prio:594,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterConstitution": {tag:"STAT_CONSTITUTION",prio:592,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "racialBonusPercentDamage": {tag:"TXT_UNI_RACE_DAMAGE",prio:498,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:0},
  "characterManaRegen": {tag:"STAT_REGEN_ENERGY",prio:488,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "skillManaCostReduction": {tag:"STAT_MANACOST_REDUCTION",prio:478,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterEnergyAbsorptionPercent": {tag:"STAT_ENERGY_ABSORB",prio:468,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterMana": {tag:"STAT_ENERGY",prio:398,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterManaLimitReserve": {tag:"STAT_ENERGY_LIMIT",prio:396,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "characterManaLimitReserveReduction": {tag:"STAT_ENERGY_RESERVE",prio:394,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:4},
  "skillTargetRadius": {tag:"STAT_SKILL_RADIUS",prio:392,valueType:"FLOAT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:false,infoType:4},
  "petBurstSpawn": {tag:"STAT_PET_SUMMON",prio:390,valueType:"INT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:false,infoType:4},
  "petLimit": {tag:"STAT_PET_LIMIT",prio:388,valueType:"INT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:false,infoType:4},
  "skillActiveDuration": {tag:"STAT_SKILL_DURATION",prio:386,valueType:"FLOAT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:false,infoType:4},
  "skillMaxLevel": {tag:"STAT_MAX_LEVEL_INC",prio:384,valueType:"INT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:false,infoType:4},
  "skillTargetNumber": {tag:"STAT_TARGET_INC",prio:382,valueType:"INT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:false,infoType:4},
  "sparkMaxNumber": {tag:"STAT_TARGET_INC",prio:380,valueType:"INT",flatCat:"ABSOLUTE",randCat:"FIXED",baseStat:false,infoType:4},
  "characterLightRadius": {tag:"STAT_LIGHT_RADIUS",prio:298,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:4},
  "cooldownCharges": {tag:"STAT_CD_CHARGES",prio:58,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:1},
  "lifeMonitorPercent": {tag:"STAT_HP_ACTIVATE",prio:90,valueType:"INT",flatCat:"PERCENTAGE",randCat:"FIXED",baseStat:false,infoType:1},
  "damageAbsorption": {tag:"STAT_ABSORB",prio:58,valueType:"INT",flatCat:"ABSOLUTE",randCat:"JITTER",baseStat:false,infoType:1},
};
function attr(rec, name) {
  const v = rec[name];
  return (v && v.length) ? v[0] : undefined;
}
function attrList(rec, name) {
  return rec[name] || [];
}
function resolveTagValue(rawValue) {
  if (!rawValue) return rawValue;
  return resolveText('tag' + rawValue);
}
const STAT_SUFFIXES = [
  ['DurationModifierChance', 'durationModifierChance'],
  ['DurationModifier', 'durationModifier'],
  ['DurationChance', 'durationChance'],
  ['ModifierChance', 'modifierChance'],
  ['DurationMax', 'maxDuration'],
  ['DurationMin', 'minDuration'],
  ['MaxResist', 'maxResist'],
  ['Modifier', 'modifier'],
  ['Duration', 'minDuration'],
  ['Chance', 'chance'],
  ['Global', 'global'],
  ['XOR', 'xor'],
  ['Max', 'max'],
  ['Min', 'min'],
  ['', 'min'],
];
TAG_INFO.defensiveAllResistance = {...TAG_INFO.defensiveAll};
const STAT_TYPE_KEYS_BY_LENGTH = Object.keys(TAG_INFO).sort((a, b) => b.length - a.length);
const STAT_TYPE_EXCLUDE = new Set(['skillMaxLevel', 'skillTargetNumber']);
function parseSkillStats(skillRec) {
  const result = {};
  for (const statType of STAT_TYPE_KEYS_BY_LENGTH) {
    if (STAT_TYPE_EXCLUDE.has(statType)) continue;
    const perLevelFields = {};
    let foundAny = false;
    for (const [suffix, field] of STAT_SUFFIXES) {
      const fullKey = statType + suffix;
      const arr = skillRec[fullKey];
      if (!Array.isArray(arr) || arr.length === 0) continue;
      foundAny = true;
      perLevelFields[field] = arr;
    }
    if (foundAny) result[statType] = perLevelFields;
  }
  return result;
}
function getStatAtLevel(perLevelFields, targetLevel) {
  const result = {};
  for (const field of Object.keys(perLevelFields)) {
    const arr = perLevelFields[field];
    if (field === 'global' || field === 'xor') {
      result[field] = arr[0] === true || arr[0] === 1;
      continue;
    }
    const idx = Math.min(targetLevel, arr.length) - 1;
    if (idx < 0) continue;
    const v = parseFloat(arr[idx]);
    if (!isNaN(v)) result[field] = v;
  }
  return result;
}
function tagText(tagKey) {
  return GD_TEXT[tagKey] !== undefined ? GD_TEXT[tagKey] : null;
}
function formatTag(tagKey, args) {
  const template = GD_TEXT[tagKey];
  if (template === undefined) return null;
  return template.replace(/\{(\d+)(,[^}]*)?\}/g, (m, idx) => {
    const v = args[parseInt(idx, 10)];
    return v !== undefined ? String(v) : '';
  });
}
function round1(n) { return Math.round(n * 10) / 10; }
const CAT = {
  ACTIVATION: 0, ENERGY_COST: 1, SKILL_RECHARGE: 2, DURATION: 3, CHANCE_PASS: 4,
  MECHANIC: 5, CORE_ABILITY: 6, CORE_DEFENSE: 7, WEAPON_DAMAGE: 8,
  NORMAL_FLAT: 9, CONVERSION: 10, DURATION_FLAT: 11, NORMAL_PCT: 12,
  DURATION_PCT: 13, RESIST_REDUCTION: 14, OTHER: 15,
};
function sortedLineTexts(lineObjs) {
  return lineObjs.slice().sort((a, b) => a.cat - b.cat).map(l => l.text);
}
const FLAT_DEBUFF_TAGS = new Set(['OFF_SLOW_DEFENSE', 'OFF_SLOW_OFFENSE']);
const FLAT_DEBUFF_ABS_TAGS = new Set(['OFF_TOTALRESRED', 'OFF_PHYS_RES_RED_ABS', 'OFF_ELEM_RES_RED_ABS']);
function buildOffenseLines(stat, tagInfo, globalChance) {
  const lines = [];
  const statDesc = colorizeStatName(tagInfo.tag, tagText(tagInfo.tag));
  if (statDesc === '' || statDesc === null) return lines;
  const isWeaponDmg = tagInfo.tag === 'OFF_WEAPON_DAMAGE';
  // A stat in a shared "global" chance roll (e.g. Terrifying Gaze's "5% Chance for one of the
  // following: Stun / Confuse") displays the skill's offensiveGlobalChance, not its own Chance field
  // (which can hold an unrelated value).
  const effChance = (stat.global && globalChance != null) ? globalChance : stat.chance;
  // Stats flagged Global share ONE roll (offensiveGlobalChance) and are listed under a single "N%
  // Chance of:" / "N% Chance for one of the following:" header instead of each carrying its own
  // chance; see groupGlobalChanceLines.
  const grouped = !!(stat.global && globalChance);
  // Text_EN tagDamageModifierDamageMult: "Total Damage Modified by 18%" (value after the label). The
  // value may live in .min or .modifier.
  if (tagInfo.tag === 'OFF_DMGMULT') {
    const lo = stat.modifier || stat.min;
    const hi = stat.modifier ? stat.modifierMax : stat.max;
    if (!lo) return lines;
    const amt = hi && hi !== lo ? `${round1(lo)}% - ${round1(hi)}%` : `${round1(lo)}%`;
    lines.push({ text: `${statDesc} ${amt}`, cat: CAT.NORMAL_PCT });
    return lines;
  }

  if (stat.min) {
    // OFF_FUMBLE/OFF_IMPAIRED_AIM (Searing Light) put the % chance in the base Min field and the
    // duration in DurationMax, leaving DurationMin/Chance empty (unlike Stun/Confuse, which use a real
    // Chance field), so they are handled directly instead of through the generic
    // min/minDuration/chance logic.
    if (tagInfo.tag === 'OFF_FUMBLE' || tagInfo.tag === 'OFF_IMPAIRED_AIM') {
      const durVal = stat.maxDuration || stat.minDuration;
      if (durVal) {
        const tag = tagInfo.tag === 'OFF_FUMBLE' ? 'TXT_OFF_ABS_TIME_CHANCE_FOR' : 'TXT_OFF_ABS_TIME_CHANCE';
        const text = formatTag(tag, [statDesc, durVal, round1(stat.min)]);
        if (text) lines.push({ text, cat: CAT.DURATION_FLAT });
      }
      return lines;
    }
    // OA/DA reductions are a flat debuff HELD for the duration ("110 Reduced target's Defensive
    // Ability for 3 Seconds"), not damage ticking per second, so the generic "_DUR" path (multiplies
    // by duration, adds "Per Second") doesn't apply. Absolute resistance reductions read the same way.
    if (stat.minDuration && (FLAT_DEBUFF_TAGS.has(tagInfo.tag) || (FLAT_DEBUFF_ABS_TAGS.has(tagInfo.tag) && tagInfo.flatCat === 'ABSOLUTE'))) {
      const amt = stat.max && stat.max !== stat.min
        ? `${round1(stat.min)} - ${round1(stat.max)}` : `${round1(stat.min)}`;
      // total resistance reduction reads plural in-game
      const descShown = tagInfo.tag === 'OFF_TOTALRESRED' ? statDesc.replace(/Resistance(?!s)/, 'Resistances').replace('目标抗性', '目标所有抗性') : statDesc;
      let text = `${amt} ${descShown}，持续 ${round1(stat.minDuration)} 秒`;
      if (!grouped && effChance && (!stat.global || stat.xor)) text = `${round1(effChance)}% 的几率：${text}`;
      lines.push({ text, cat: CAT.DURATION_FLAT });
      return lines;
    }
    const isPerc = tagInfo.flatCat === 'PERCENTAGE';
    // Percentage debuff with a duration AND a roll range (e.g. Malady's "Slow Target"): the
    // TXT_OFF_ABS_PERC_RANGE_DUR template is DoT-style with mismatched argument slots, so format like
    // TXT_OFF_ABS_PERC_DUR ("15% Slow Target for 2 Seconds") with a range.
    if (isPerc && stat.minDuration && stat.max !== undefined && stat.max !== stat.min && !isWeaponDmg) {
      let text = `${round1(stat.min)}% - ${round1(stat.max)}% ${statDesc}，持续 ${round1(stat.minDuration)} 秒`;
      if (!grouped && effChance && (!stat.global || stat.xor)) text = `${round1(effChance)}% 的几率：${text}`;
      lines.push({ text, cat: CAT.DURATION_FLAT });
    } else {
    let tag = 'TXT_OFF_ABS';
    const lArgs = [statDesc];
    if (!stat.minDuration) {
      lArgs.push(round1(stat.min));
    } else if (isPerc) {
      lArgs.push(round1(stat.min));
    } else {
      lArgs.push(round1(stat.min * stat.minDuration));
      lArgs.push(round1(stat.min));
    }
    if (isPerc) tag += '_PERC';
    if (tagInfo.flatCat === 'DURATION') tag += '_TIME';
    if (stat.max) {
      tag += '_RANGE';
      if (!stat.minDuration) lArgs.push(round1(stat.max));
      else if (isPerc) lArgs.push(round1(stat.max));
      else { lArgs.push(round1(stat.max * stat.minDuration)); lArgs.push(round1(stat.max)); }
    }
    if (stat.minDuration) { tag += '_DUR'; lArgs.push(stat.minDuration); }
    if (!grouped && effChance && (!stat.global || stat.xor)) { tag += '_CHANCE'; lArgs.push(effChance); }
    const text = formatTag(tag, lArgs);
    if (text) {
      const cat = isWeaponDmg ? CAT.WEAPON_DAMAGE : (stat.minDuration ? CAT.DURATION_FLAT : CAT.NORMAL_FLAT);
      lines.push({ text, cat });
    }
    }
  }
  const modChance = grouped ? 0 : stat.modifierChance;
  if (stat.modifier) {
    if (stat.modifierMax !== undefined && stat.modifierMax !== stat.modifier && !stat.durationModifier && !modChance) {
      // No template exists for this range case either; formatted directly instead of via formatTag.
      lines.push({ text: `+${round1(stat.modifier)}% - ${round1(stat.modifierMax)}% ${statDesc}`, cat: isWeaponDmg ? CAT.WEAPON_DAMAGE : CAT.NORMAL_PCT });
    } else {
      let tag = 'TXT_OFF_PERC';
      const lArgs = [statDesc, round1(stat.modifier)];
      if (stat.durationModifier) { tag += '_DUR'; lArgs.push(stat.durationModifier); }
      if (modChance) { tag += '_CHANCE'; lArgs.push(modChance); }
      const text = formatTag(tag, lArgs);
      if (text) {
        const cat = isWeaponDmg ? CAT.WEAPON_DAMAGE : (stat.durationModifier ? CAT.DURATION_PCT : CAT.NORMAL_PCT);
        lines.push({ text, cat });
      }
    }
  }
  if (grouped) for (const l of lines) { l.globalGroup = true; l.xor = !!stat.xor; }
  return lines;
}
function groupGlobalChanceLines(lineObjs, globalChance) {
  const members = lineObjs.filter(l => l.globalGroup);
  if (!members.length || !globalChance) return lineObjs;
  const rest = lineObjs.filter(l => !l.globalGroup);
  const sortedMembers = members.slice().sort((a, b) => a.cat - b.cat);
  const cat = sortedMembers[0].cat;
  const anyXor = members.some(l => l.xor);
  const header = `${round1(globalChance)}% ${anyXor ? '的几率随机触发下列效果之一' : '的几率'}：`;
  const block = [{ text: header, cat }];
  for (const m of sortedMembers) block.push({ text: `<span style="display:inline-block; margin-left:14px;">${m.text}</span>`, cat });
  return rest.concat(block);
}
function buildDefenseLines(stat, tagInfo) {
  const lines = [];
  const statDesc = colorizeStatName(tagInfo.tag, tagText(tagInfo.tag));
  if (statDesc === null) return lines;
  // STAT_CD_CHARGES ("Charges") and STAT_ABSORB ("Damage Absorption") are core mechanic/defense
  // descriptors and sort much earlier. STAT_HP_ACTIVATE is a passive "Activates when Health drops
  // below X%" trigger: it needs its own early slot (before Energy Cost/Skill Recharge) and text first,
  // then the number (TXT_TRIGGER_HEALTH template).
  let cat = CAT.RESIST_REDUCTION;
  if (tagInfo.tag === 'STAT_CD_CHARGES') cat = CAT.MECHANIC;
  else if (tagInfo.tag === 'STAT_ABSORB') cat = CAT.CORE_DEFENSE;
  else if (tagInfo.tag === 'STAT_HP_ACTIVATE') cat = CAT.ACTIVATION;
  if (stat.min) {
    if (tagInfo.tag === 'STAT_HP_ACTIVATE') {
      const text = formatTag('TXT_TRIGGER_HEALTH', [round1(stat.min)]);
      if (text) lines.push({ text, cat });
    } else if (stat.max !== undefined && stat.max !== stat.min && !stat.chance) {
      // No TXT_INT_RANGE/TXT_FLOAT_RANGE templates exist in GD_TEXT (the game formats item roll ranges
      // outside the tag-template system), so ranges are formatted directly. Plain case only; a
      // combined block chance+amount range isn't handled (falls through to the flat path).
      const isFloat = tagInfo.valueType === 'FLOAT';
      const minVal = isFloat ? round1(stat.min) : Math.round(stat.min);
      const maxVal = isFloat ? round1(stat.max) : Math.round(stat.max);
      const pct = tagInfo.flatCat === 'PERCENTAGE' ? '%' : '';
      const prefix = tagInfo.tag === 'STAT_CD_CHARGES' ? '+' : '';
      lines.push({ text: `${prefix}${minVal}${pct} - ${maxVal}${pct} ${statDesc}`, cat });
    } else {
      // STAT_CD_CHARGES shows a leading "+" in-game ("+1 Charges"); other plain defense int stats
      // don't.
      let tag = tagInfo.tag === 'STAT_CD_CHARGES' ? 'TXT_INT_PLUS' : 'TXT_INT';
      let lArgs = [statDesc, round1(stat.min)];
      if (tagInfo.flatCat === 'PERCENTAGE') tag += '_PERC';
      if (stat.chance) {
        tag += '_CHANCE';
        lArgs.push(stat.chance);
        if (tagInfo.tag === 'DEF_BLOCK_CHANCE') {
          tag = 'TXT_DEF_UNI_SHIELD_BLOCK';
          lArgs = [round1(stat.min), stat.chance];
        }
      }
      const text = formatTag(tag, lArgs);
      if (text) lines.push({ text, cat });
    }
  }
  if (stat.modifier) {
    if (stat.modifierMax !== undefined && stat.modifierMax !== stat.modifier) {
      lines.push({ text: `${round1(stat.modifier)}% - ${round1(stat.modifierMax)}% ${statDesc}`, cat });
    } else {
      const text = formatTag('TXT_DEF_PERC', [statDesc, round1(stat.modifier)]);
      if (text) lines.push({ text, cat });
    }
  }
  if (stat.minDuration) {
    const dotDesc = colorizeStatName(tagInfo.tag, tagText(tagInfo.tag + '_DOT')) || statDesc;
    const text = formatTag('TXT_DEF_DUR', [dotDesc, stat.minDuration]);
    if (text) lines.push({ text, cat });
  }
  if (stat.maxResist) {
    const text = formatTag('TXT_DEF_MAX', [statDesc, stat.maxResist]);
    if (text) lines.push({ text, cat });
  }
  return lines;
}
function buildCharStatLines(stat, tagInfo) {
  const lines = [];
  // character stats (STAT_ prefix) don't get damage-type coloring - some
  // legitimately contain a damage-type word (e.g. a "Life"/Health stat) in
  // their name without actually being about that damage type, which was
  // getting miscolored (a Health-related stat showing Vitality's maroon)
  let statDesc = tagText(tagInfo.tag);
  if (statDesc === null) return lines;
  // STAT_SKILL_RADIUS is a mechanic descriptor like attack arc/target max,
  // not a generic other-stat - belongs right after Energy Cost/Skill
  // Recharge/Duration/Chance to pass. Its label depends on whether the
  // skill is a buff (global effect around the caster = "Meter Radius") or
  // a targeted/active skill (an aimed area = "Meter Target Area") -
  // confirmed against real tooltips; buff-ness is read off the SAME field's
  // own "Global" companion flag (stat.global), exactly like the shared-
  // chance mechanism elsewhere in this function's sibling (buildOffenseLines).
  if (tagInfo.tag === 'STAT_SKILL_RADIUS') statDesc = stat.global ? "米作用半径" : "米目标区域";
  // Text_EN SkillManaCostReduction(Modifier): "-20% Skill Energy Cost" - a
  // leading minus and a different label (confirmed via reference tooltips:
  // Empowered Rituals "-20%", Iskandra's Balance "-8/12%").
  if (tagInfo.tag === 'STAT_MANACOST_REDUCTION') {
    const lo = stat.min || stat.modifier;
    const hi = stat.min ? stat.max : stat.modifierMax;
    if (!lo) return lines;
    const amt = hi !== undefined && hi !== lo ? `-${round1(lo)}% - ${round1(hi)}%` : `-${round1(lo)}%`;
    lines.push({ text: `${amt} 技能能量消耗`, cat: CAT.OTHER });
    return lines;
  }
  // STAT_SKILL_RECHARGE_REDUCTION ("Skill Recharge") gets its own early
  // slot, right after Energy Cost. STAT_OFF_ABIL_SHORT/STAT_DEF_ABIL_SHORT
  // (Offensive/Defensive Ability) are core stats that consistently show up
  // early too, before Weapon/flat/percent damage and before resistances.
  let cat = CAT.OTHER;
  if (tagInfo.tag === 'STAT_SKILL_DURATION') cat = CAT.DURATION;
  else if (tagInfo.tag === 'STAT_SKILL_RADIUS') cat = CAT.MECHANIC;
  else if (tagInfo.tag === 'STAT_SKILL_RECHARGE_REDUCTION') cat = CAT.SKILL_RECHARGE;
  else if (tagInfo.tag === 'STAT_OFF_ABIL_SHORT' || tagInfo.tag === 'STAT_DEF_ABIL_SHORT') cat = CAT.CORE_ABILITY;
  if (stat.min) {
    if (stat.max !== undefined && stat.max !== stat.min && !stat.chance) {
      // Same gap as buildDefenseLines above - no range template exists for
      // plain character stats (OA/DA etc), formatted directly.
      const isFloat = tagInfo.valueType === 'FLOAT';
      const minVal = isFloat ? round1(stat.min) : Math.round(stat.min);
      const maxVal = isFloat ? round1(stat.max) : Math.round(stat.max);
      const pct = tagInfo.flatCat === 'PERCENTAGE' ? '%' : '';
      lines.push({ text: `${minVal}${pct} - ${maxVal}${pct} ${statDesc}`, cat });
    } else {
      let tag = tagInfo.valueType === 'FLOAT' ? 'TXT_FLOAT' : 'TXT_INT';
      const lArgs = [statDesc, tagInfo.valueType === 'FLOAT' ? round1(stat.min) : Math.round(stat.min)];
      if (tagInfo.flatCat === 'PERCENTAGE') tag += '_PERC';
      if (stat.chance) { tag += '_CHANCE'; lArgs.push(stat.chance); }
      const text = formatTag(tag, lArgs);
      if (text) lines.push({ text, cat });
    }
  }
  if (stat.modifier) {
    if (stat.modifierMax !== undefined && stat.modifierMax !== stat.modifier && !stat.chance) {
      lines.push({ text: `${round1(stat.modifier)}% - ${round1(stat.modifierMax)}% ${statDesc}`, cat });
    } else {
      let tag = 'TXT_PERC';
      const lArgs = [statDesc, round1(stat.modifier)];
      if (stat.chance) { tag += '_CHANCE'; lArgs.push(stat.chance); }
      const text = formatTag(tag, lArgs);
      if (text) lines.push({ text, cat });
    }
  }
  return lines;
}
function getRacialLines(rec, level) {
  const races = attrList(rec, 'racialBonusRace').filter(Boolean);
  if (!races.length) return [];
  // Text_EN has a PLURAL form per race: tagRace004 = "Chthonic",
  // tagRace004P = "Chthonics" (the in-game tooltip uses the plural).
  const names = races.map(r => { const pl = tags['tag' + r + 'P']; return pl || resolveTagValue(r); });
  const raceText = names.length > 1 ? `${names.slice(0, -1).join('、')}和${names[names.length - 1]}` : names[0];
  const lines = [];
  const pctDmg = getSkillLevelValue(rec, 'racialBonusPercentDamage', level);
  if (pctDmg) lines.push({ text: formatTag('TXT_UNI_RACE_DAMAGE', [Math.round(pctDmg), raceText]), cat: CAT.OTHER });
  const absDmg = getSkillLevelValue(rec, 'racialBonusAbsoluteDamage', level);
  if (absDmg) lines.push({ text: `+${Math.round(absDmg)} 对${raceText}的伤害`, cat: CAT.OTHER });
  const pctDef = getSkillLevelValue(rec, 'racialBonusPercentDefense', level);
  if (pctDef) lines.push({ text: `来自${raceText}的伤害降低 ${Math.round(pctDef)}%`, cat: CAT.OTHER });
  const absDef = getSkillLevelValue(rec, 'racialBonusAbsoluteDefense', level);
  if (absDef) lines.push({ text: `来自${raceText}的伤害降低 ${Math.round(absDef)}`, cat: CAT.OTHER });
  return lines;
}
function buildStatLines(statType, statAtLevel, globalChance) {
  const tagInfo = TAG_INFO[statType];
  if (!tagInfo) return [];
  if (tagInfo.infoType === 1) return buildDefenseLines(statAtLevel, tagInfo);
  if (tagInfo.infoType === 2 || tagInfo.infoType === 3) return buildOffenseLines(statAtLevel, tagInfo, globalChance);
  if (tagInfo.infoType === 4) return buildCharStatLines(statAtLevel, tagInfo);
  return [];
}
const DAMAGE_TYPE_TAG = {
  Aether: 'OFF_AETHER', Chaos: 'OFF_CHAOS', Cold: 'OFF_COLD', Elemental: 'OFF_ELEMENTAL',
  Fire: 'OFF_FIRE', Life: 'OFF_LIFE', Lightning: 'OFF_LIGHTNING', Physical: 'OFF_PHYSICAL',
  Pierce: 'OFF_PIERCE', Poison: 'OFF_POISON',
};
function getSkillLevelValue(skillRec, field, level) {
  const arr = skillRec[field];
  if (!Array.isArray(arr) || !arr.length) return null;
  const idx = Math.min(level, arr.length) - 1;
  if (idx < 0) return null;
  const v = parseFloat(arr[idx]);
  return isNaN(v) ? null : v;
}
const REFRESH_COOLDOWN_TRIGGER_TEXT = {
  AttackEnemy: { text: "发动攻击时有几率触发" },
  AttackEnemyCrit: { text: "造成暴击时有几率触发" },
  Block: { text: "格挡时有几率触发" },
  OnKill: { text: "杀死怪物时有几率触发" },
  HitByEnemy: { text: "受击时有几率触发" },
  HitByMelee: { text: "受到近战攻击时有几率触发" },
  HitByProjectile: { text: "受到远程攻击时有几率触发" },
  HitByCrit: { text: "受到暴击时有几率触发" },
  CastBuff: { text: "施加增益效果时有几率触发" },
  OnEquip: { text: "装备时生效", noChance: true },
};
function getExtraSkillInfoLines(skillRec, level) {
  const lines = [];
  const activationChance = getSkillLevelValue(skillRec, 'onHitActivationChance', level);
  if (activationChance) lines.push({ text: formatTag('TXT_INT_PERC', ["几率触发", round1(activationChance)]), cat: CAT.ACTIVATION });
  // Weapon-attack procs that replace default attacks (Class Skill_WPAttack_BasicAttack, e.g. Scorch
  // Reality) roll against each other by weight, shown as "X% Chance to be Used" (skillChanceWeight
  // "15;20" -> "20%" at level 2).
  const chanceWeight = getSkillLevelValue(skillRec, 'skillChanceWeight', level);
  if (chanceWeight) lines.push({ text: formatTag('TXT_PERC', ["的几率使用", round1(chanceWeight)]), cat: CAT.ACTIVATION });
  // offensiveTauntMin (e.g. 100 on item_bestialrage_petbonus.dbr) has no TAG_INFO entry; the tooltip
  // shows just "Taunt target", without a number.
  if (getSkillLevelValue(skillRec, 'offensiveTauntMin', level)) lines.push({ text: "嘲讽目标", cat: CAT.MECHANIC });
  // summons with a lifetime (spawnObjectsTimeToLive, e.g. 8 on Nightbringer)
  const ttl = getSkillLevelValue(skillRec, 'spawnObjectsTimeToLive', level);
  if (ttl) lines.push({ text: `存在时间 ${round1(ttl)} 秒`, cat: CAT.DURATION });
  // Skill_RefreshCooldown (skill_refreshcooldown.tpl, e.g. Markovian's
  // Vigilance/Fortress, Carnage relic, Aeon's Hourglass): refreshTime =
  // seconds taken off every currently active cooldown. In-game text
  // confirmed: "-1.2 Seconds to All Currently Active Skill Cooldowns",
  // shown above Skill Recharge.
  const refreshTime = getSkillLevelValue(skillRec, 'refreshTime', level);
  if (refreshTime) lines.push({ text: `所有当前冷却中的技能冷却时间减少 ${round1(refreshTime)} 秒`, cat: CAT.ACTIVATION });
  // Conditional cooldown refresh (skill_modifier.tpl / weapon-attack / potion
  // records): refreshCooldownSkill + refreshCooldownTrigger + Chance + Amount.
  // Wording from Text_EN tagSkillCooldownRefreshName ("{trigger} to reduce
  // cooldown of {skill} by N Seconds") with trigger phrases from
  // tagRefreshSkillCondition07/10/11/12/03/04/05/06/09/08. Template-default
  // records carry the whole enum list ("OnEquip;OnKill;...") with no amount -
  // those never match REFRESH_COOLDOWN_TRIGGER_TEXT, so they stay silent.
  const rcAmount = getSkillLevelValue(skillRec, 'refreshCooldownAmount', level);
  const rcTrigger = attr(skillRec, 'refreshCooldownTrigger');
  const rcSkillPath = attr(skillRec, 'refreshCooldownSkill');
  if (rcAmount && rcTrigger && rcSkillPath && REFRESH_COOLDOWN_TRIGGER_TEXT[rcTrigger]) {
    const rcChance = getSkillLevelValue(skillRec, 'refreshCooldownChance', level);
    const trig = REFRESH_COOLDOWN_TRIGGER_TEXT[rcTrigger];
    const trigText = trig.noChance ? trig.text : `${trig.text.replace('有几率', '有 ' + round1(rcChance || 100) + '% 几率')}`;
    const rcRec = records[rcSkillPath];
    const rcName = (rcRec && resolveSkillName(rcRec)) || externalName(rcSkillPath);
    lines.push({ text: `${trigText}，${rcName}的冷却时间减少 ${round1(rcAmount)} 秒`, cat: CAT.OTHER }); // sorts last, after block chance/amount - matches the reference tooltip
  }
  // Conditional duration refresh (refreshDuration* fields, same trigger enum as
  // refreshCooldown*). Text_EN: with a cap (refreshDurationMax) "{trigger} to
  // refresh duration of {skill} by N Seconds (Max M Seconds)"
  // (tagSkillDurationRefreshNameMax), without one "... to extend duration of
  // {skill} by N Seconds" (tagSkillDurationRefreshName).
  const rdAmount = getSkillLevelValue(skillRec, 'refreshDurationAmount', level);
  const rdTrigger = attr(skillRec, 'refreshDurationTrigger');
  const rdSkillPath = attr(skillRec, 'refreshDurationSkill');
  if (rdAmount && rdTrigger && rdSkillPath && REFRESH_COOLDOWN_TRIGGER_TEXT[rdTrigger]) {
    const rdChance = getSkillLevelValue(skillRec, 'refreshDurationChance', level);
    const rdMax = getSkillLevelValue(skillRec, 'refreshDurationMax', level);
    const trig = REFRESH_COOLDOWN_TRIGGER_TEXT[rdTrigger];
    const trigText = trig.noChance ? trig.text : `${trig.text.replace('有几率', '有 ' + round1(rdChance || 100) + '% 几率')}`;
    const rdRec = records[rdSkillPath];
    const rdName = (rdRec && resolveSkillName(rdRec)) || externalName(rdSkillPath);
    const text = rdMax
      ? `${trigText}，${rdName}的持续时间刷新 ${round1(rdAmount)} 秒，最多 ${round1(rdMax)} 秒`
      : `${trigText}，${rdName}的持续时间增加 ${round1(rdAmount)} 秒`;
    lines.push({ text, cat: CAT.OTHER });
  }
  // Health cost while the skill is active (item_vampirism 120,
  // relic_sacrifice 200, item_bloodrite 50) - Text_EN "ActiveLifeCost":
  // "Active Health Cost per Second".
  const lifeCost = getSkillLevelValue(skillRec, 'skillActiveLifeCost', level);
  if (lifeCost) lines.push({ text: `${Math.round(lifeCost)} 每秒激活生命消耗`, cat: CAT.ENERGY_COST });
  // Energy restored as % of max (item_homebrewedpotion 25%), paired with
  // skillLifePercent which already renders as "N% Health Restored"
  // (Text_EN "SkillManaPercent": "N% Energy Restored" - confirmed).
  const manaPct = getSkillLevelValue(skillRec, 'skillManaPercent', level);
  if (manaPct) lines.push({ text: `${round1(manaPct)}% 能量回复`, cat: CAT.OTHER });
  // Projectile speed bonus (guns: c020 +33%, c005/c035 +50%) - Text_EN
  // "SkillProjectileSpeedModifier": "+N% Increase in Projectile Speed". A
  // range variant (...ModifierR) exists too, so it may roll on some items;
  // shown flat until an in-game range confirms that.
  const projSpeed = getSkillLevelValue(skillRec, 'skillProjectileSpeedModifier', level);
  if (projSpeed) lines.push({ text: `+${round1(projSpeed)}% 投射物飞行速度`, cat: CAT.OTHER });
  lines.push(...getRacialLines(skillRec, level));
  const manaCost = getSkillLevelValue(skillRec, 'skillManaCost', level);
  if (manaCost) lines.push({ text: formatTag('TXT_INT', ["能量消耗", Math.round(manaCost)]), cat: CAT.ENERGY_COST });
  // skillProjectileNumber is the other projectile-count field (e.g. 8 on
  // Perforator Round); a value of 1 isn't shown in-game (Murmur's Kiss /
  // Scorch Reality both have 1 and no line), so only >1 is listed.
  const projCount = getSkillLevelValue(skillRec, 'projectileLaunchNumber', level)
    ?? ((n => (n > 1 ? n : null))(getSkillLevelValue(skillRec, 'skillProjectileNumber', level)));
  if (projCount) lines.push({ text: formatTag('TXT_INT', ["枚投射物", Math.round(projCount)]), cat: CAT.MECHANIC });
  const fragMin = getSkillLevelValue(skillRec, 'projectileFragmentsLaunchNumberMin', level);
  const fragMax = getSkillLevelValue(skillRec, 'projectileFragmentsLaunchNumberMax', level);
  if (fragMin || fragMax) {
    const lo = Math.round(fragMin ?? fragMax);
    const hi = Math.round(fragMax ?? fragMin);
    const fragText = lo === hi ? `${lo} 枚碎片` : `${lo} - ${hi} 枚碎片`;
    lines.push({ text: fragText, cat: CAT.MECHANIC });
  }
  // two distinct raw fields both surface as "Meter Radius" depending on the
  // skill (projectileExplosionRadius for most, explosionRadius for others
  // like Full Spread) - only one is ever populated on a given skill.
  const radius = getSkillLevelValue(skillRec, 'projectileExplosionRadius', level)
    ?? getSkillLevelValue(skillRec, 'explosionRadius', level);
  if (radius) lines.push({ text: formatTag('TXT_FLOAT', ["米作用半径", round1(radius)]), cat: CAT.MECHANIC });
  const angle = getSkillLevelValue(skillRec, 'skillTargetAngle', level);
  if (angle) lines.push({ text: formatTag('TXT_INT', ["度攻击角度", Math.round(angle)]), cat: CAT.MECHANIC });
  const num = getSkillLevelValue(skillRec, 'skillTargetNumber', level);
  if (num) lines.push({ text: `最多 ${Math.round(num)} 个目标`, cat: CAT.MECHANIC });
  // The real field name is "projectilePiercing" (bare); "projectilePiercingChance" is only the UI
  // tag's name.
  const pierce = getSkillLevelValue(skillRec, 'projectilePiercing', level)
    ?? getSkillLevelValue(skillRec, 'projectilePiercingChance', level);
  if (pierce) lines.push({ text: formatTag('TXT_PERC', ["几率穿过敌人", round1(pierce)]), cat: CAT.CHANCE_PASS });
  const comboSpendReduction = getSkillLevelValue(skillRec, 'skillComboChargeSpendReduction', level);
  if (comboSpendReduction) lines.push({ text: formatTag('TXT_PERC', ["几率不消耗冲击层数", round1(comboSpendReduction)]), cat: CAT.MECHANIC });
  const comboLevel = getSkillLevelValue(skillRec, 'skillComboChargeLevel', level);
  // the per-stack percentages (15%, 30%, 45%...) shown next to the stack
  // count in-game don't come from any .dbr field either of us could find -
  // they may be hardcoded in the engine specifically for this skill, so
  // only the confirmed stack COUNT is shown here, not that breakdown
  if (comboLevel) lines.push({ text: formatTag('TXT_INT', ["层冲击", Math.round(comboLevel)]), cat: CAT.MECHANIC });
  // Savagery-style "charge" mechanic: N charge levels, each with its own
  // damage multiplier %, refreshing every D seconds
  const chargeLevel = getSkillLevelValue(skillRec, 'skillChargeLevel', level);
  if (chargeLevel) {
    const multArr = skillRec['skillChargeMultipliers'];
    let listText = '';
    if (Array.isArray(multArr) && multArr.length) {
      listText = ': ' + multArr.map(v => Math.round(parseFloat(v)) + '%').join(', ');
    }
    lines.push({ text: `${Math.round(chargeLevel)} 个充能等级${listText}`, cat: CAT.MECHANIC });
  }
  const chargeDuration = getSkillLevelValue(skillRec, 'skillChargeDuration', level);
  if (chargeDuration) lines.push({ text: formatTag('TXT_INT', ["秒充能等级持续时间", round1(chargeDuration)]), cat: CAT.MECHANIC });
  return lines;
}
function getConversionLines(skillRec, level, itemJitterCtx) {
  const lines = [];
  for (const suffix of ['', '2']) {
    const inType = attr(skillRec, 'conversionInType' + suffix);
    const outType = attr(skillRec, 'conversionOutType' + suffix);
    const percArr = skillRec['conversionPercentage' + suffix];
    if (!inType || !outType || !Array.isArray(percArr) || !percArr.length) continue;
    const idx = Math.min(level, percArr.length) - 1;
    if (idx < 0) continue;
    let perc = parseFloat(percArr[idx]);
    if (!perc) continue;
    const inText = colorizeStatName(inType, tagText(DAMAGE_TYPE_TAG[inType]));
    const outText = colorizeStatName(outType, tagText(DAMAGE_TYPE_TAG[outType]));
    if (!inText || !outText) continue;
    // Conversion percentage rolls with the same jitter formula as other
    // item stats - confirmed exact match (Base=30 -> "24/36%") via a real
    // reference tooltip, Jitter=20/Scale=0. Only applies when this is a
    // flat single value (percArr.length===1, the item case) - skills passing
    // a real level-indexed array never hit this (itemJitterCtx is only
    // passed by the top-level item render, never by skill tooltip code).
    if (itemJitterCtx && percArr.length === 1) {
      const min = Math.round(perc * 0.8);
      const max = Math.round(perc * 1.2);
      const text = `${min}% - ${max}% ${inText} 转换为 ${outText}`;
      lines.push({ text, cat: CAT.CONVERSION });
      continue;
    }
    const text = formatTag('TXT_CONVERT_FROM_TO', [Math.round(perc), inText, outText]);
    if (text) lines.push({ text, cat: CAT.CONVERSION });
  }
  return lines;
}
function getSkillStatLines(skillRec, level, depth) {
  if (!skillRec || depth > 4 || level <= 0) return { own: [], pet: [] };
  const parsed = parseSkillStats(skillRec);
  let own = getExtraSkillInfoLines(skillRec, level).map((line,i)=>({...line,key:'extra:'+i}));
  const globalChance = getSkillLevelValue(skillRec, 'offensiveGlobalChance', level);
  for (const statType of Object.keys(parsed)) {
    own.push(...buildStatLines(statType, getStatAtLevel(parsed[statType], level), globalChance).map((line,i)=>({...line,key:'stat:'+statType+':'+i})));
  }
  own = own.concat(getConversionLines(skillRec, level).map((line,i)=>({...line,key:'conversion:'+i})));
  own = groupGlobalChanceLines(own, globalChance);
  let pet = [];
  const buffPath = attr(skillRec, 'buffSkillName');
  if (buffPath && records[buffPath]) {
    const sub = getSkillStatLines(records[buffPath], level, depth + 1);
    own = own.concat(sub.own.map(line=>({...line,key:'buff:'+buffPath+'/'+line.key})));
    pet = pet.concat(sub.pet.map(line=>({...line,key:'buff:'+buffPath+'/'+line.key})));
  }
  const petPath = attr(skillRec, 'petSkillName');
  if (petPath && records[petPath]) {
    const sub = getSkillStatLines(records[petPath], level, depth + 1);
    pet = pet.concat([...sub.own,...sub.pet].map(line=>({...line,key:'pet:'+petPath+'/'+line.key})));
  }
  const petBonusPath = attr(skillRec, 'petBonusName');
  if (petBonusPath && records[petBonusPath]) {
    const sub = getSkillStatLines(records[petBonusPath], level, depth + 1);
    pet = pet.concat([...sub.own,...sub.pet].map(line=>({...line,key:'bonus:'+petBonusPath+'/'+line.key})));
  }
  return { own, pet };
}
return {getSkillStatLines,sortedLineTexts,TAG_INFO,GD_TEXT};};
const plain=s=>String(s||'').replace(/<[^>]*>/g,'').replace(/\{\^[^}]+\}|\^[A-Za-z-]/g,'');
let nameResolver=null;const unresolved=new Set();
function create(locale,refs={},tags={}){
 const lang=locale==='zh'?'zh':'en',records=new Proxy(refs,{get:(o,k)=>o[String(k).replaceAll('\\','/').toLowerCase()]||o[k]}),localizedTags=new Proxy(tags,{get:(o,k)=>o[String(k).toLowerCase()]||o[k]});
 const externalName=path=>{const id=String(path||'').replaceAll('\\','/').toLowerCase(),value=nameResolver?.(id,lang)||g.DawnPresentation?.skillNames?.[id]?.[lang];if(value)return value;unresolved.add(id);return lang==='zh'?'关联技能':'Referenced skill';};
 const api=factories[lang](records,localizedTags,externalName);
 function rows(fields,rank=1){const raw=api.getSkillStatLines(fields,Math.max(1,rank),0),sort=list=>{const seen=new Set();return list.slice().sort((a,b)=>a.cat-b.cat).map((line,i)=>({...line,key:line.key||'group:'+i,text:plain(line.text)})).filter(line=>line.text&&!seen.has(line.text)&&seen.add(line.text));};return{own:sort(raw.own),pet:sort(raw.pet)};}
 function rangeRows(fields,rank,minimumFields,maximumFields){const current=rows(fields,rank),low=rows(minimumFields,rank),high=rows(maximumFields,rank),result={};for(const scope of ['own','pet']){const lo=new Map(low[scope].map(x=>[x.key,x.text])),hi=new Map(high[scope].map(x=>[x.key,x.text]));result[scope]=current[scope].map(x=>({...x,minimumText:lo.get(x.key),maximumText:hi.get(x.key)}));}return result;}
 return {...api,rows,rangeRows,lines(fields,rank=1){const result=rows(fields,rank);return{own:result.own.map(x=>x.text),pet:result.pet.map(x=>x.text)};}};
}
g.DawnText={create,setNameResolver:fn=>nameResolver=fn,unresolved};if(typeof module!=='undefined')module.exports=g.DawnText;
})(globalThis);
