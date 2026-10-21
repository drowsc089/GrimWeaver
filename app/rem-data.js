// Adapted data/formula helpers from Rem Skill Planner release 4.7.
// Project-specific permission confirmed by supplied Discord reply, 2026-10-17; see third_party/Rem-PERMISSION.txt. No GrimTools code.
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
function evalFormula(expr, vars) {
  if (!expr) return null;
  const src = String(expr).toUpperCase();
  let pos = 0;
  function peek() { return src[pos]; }
  function skipWs() { while (pos < src.length && /\s/.test(src[pos])) pos++; }
  function parseExpr() {
    let v = parseTerm();
    skipWs();
    while (peek() === '+' || peek() === '-') {
      const op = src[pos++]; skipWs();
      const rhs = parseTerm();
      v = op === '+' ? v + rhs : v - rhs;
      skipWs();
    }
    return v;
  }
  function parseTerm() {
    let v = parsePow();
    skipWs();
    while (peek() === '*' || peek() === '/') {
      const op = src[pos++]; skipWs();
      const rhs = parsePow();
      v = op === '*' ? v * rhs : v / rhs;
      skipWs();
    }
    return v;
  }
  function parsePow() {
    let v = parseUnary();
    skipWs();
    if (peek() === '^') {
      pos++; skipWs();
      const rhs = parsePow(); // right-associative
      v = Math.pow(v, rhs);
    }
    return v;
  }
  function parseUnary() {
    skipWs();
    if (peek() === '-') { pos++; return -parseUnary(); }
    if (peek() === '+') { pos++; return parseUnary(); }
    return parseAtom();
  }
  function parseArgs() {
    const args = [parseExpr()];
    skipWs();
    while (peek() === ',') { pos++; skipWs(); args.push(parseExpr()); skipWs(); }
    return args;
  }
  function parseAtom() {
    skipWs();
    if (peek() === '(') {
      pos++; const v = parseExpr(); skipWs();
      if (peek() === ')') pos++;
      return v;
    }
    if (/[0-9.]/.test(peek())) {
      const start = pos;
      while (pos < src.length && /[0-9.]/.test(src[pos])) pos++;
      return parseFloat(src.slice(start, pos));
    }
    if (/[A-Z_]/.test(peek())) {
      const start = pos;
      while (pos < src.length && /[A-Z0-9_]/.test(src[pos])) pos++;
      const ident = src.slice(start, pos);
      skipWs();
      if (peek() === '(') {
        pos++; const args = parseArgs(); skipWs();
        if (peek() === ')') pos++;
        switch (ident) {
          case 'MIN': return Math.min(...args);
          case 'MAX': return Math.max(...args);
          case 'FLOOR': return Math.floor(args[0]);
          case 'CEIL': return Math.ceil(args[0]);
          case 'ROUND': return Math.round(args[0]);
          case 'ABS': return Math.abs(args[0]);
          case 'SQRT': return Math.sqrt(args[0]);
          case 'POW': return Math.pow(args[0], args[1]);
          default: throw new Error("Unsupported function "+ident);
        }
      }
      if (vars && Object.prototype.hasOwnProperty.call(vars, ident)) return vars[ident];
      throw new Error("Unknown variable "+ident);
    }
    pos++; // unrecognized char - skip to avoid infinite loop
    return 0;
  }
  try {
    const result = parseExpr();
    skipWs();
    if (pos !== src.length || !Number.isFinite(result)) return null;
    return result;
  } catch (e) {
    return null;
  }
}
function pathMatchesFilter(fileNameLower, filterLower) {
  if (fileNameLower.includes(filterLower)) return true;
  if (!filterLower.startsWith('records/')) return false;
  const suffix = filterLower.slice('records/'.length).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('(^|records/)_[^/]+/' + suffix).test(fileNameLower);
}
const DIRECT_PET_TEMPLATES = new Set([
  'database/templates/pet.tpl',
  'database/templates/petplayerscaling.tpl',
  'database/templates/characterattributeequations.tpl',
]);
const DIRECT_DATA_OFFSET_ADJUST = 24;
const DIRECT_MAX_STRING_LEN = 8192;
const directDecoder = new TextDecoder('latin1');
class DirectParseAbort extends Error {}
function directLz4Decompress(src, srcOffset, srcSize, dstSize) {
  const dst = new Uint8Array(dstSize);
  let sp = srcOffset, dp = 0;
  const srcEnd = srcOffset + srcSize;
  while (sp < srcEnd && dp < dstSize) {
    const token = src[sp++];
    let litLen = token >> 4;
    if (litLen === 15) { let b; do { b = src[sp++]; litLen += b; } while (b === 255); }
    for (let i = 0; i < litLen; i++) dst[dp++] = src[sp++];
    if (sp >= srcEnd || dp >= dstSize) break;
    const matchOffset = src[sp] | (src[sp + 1] << 8); sp += 2;
    let matchLen = token & 0x0f;
    if (matchLen === 15) { let b; do { b = src[sp++]; matchLen += b; } while (b === 255); }
    matchLen += 4;
    let matchPos = dp - matchOffset;
    for (let i = 0; i < matchLen && dp < dstSize; i++) dst[dp++] = dst[matchPos++];
  }
  return dst;
}
function directReadLenString32(dv, bytes, offset) {
  if (offset + 4 > bytes.length) throw new DirectParseAbort(`offset ${offset} past end of file reading a u32-length string`);
  const len = dv.getUint32(offset, true);
  if (len > DIRECT_MAX_STRING_LEN) throw new DirectParseAbort(`string at offset ${offset} claims length ${len} — misread field`);
  if (offset + 4 + len > bytes.length) throw new DirectParseAbort(`string at offset ${offset} (len ${len}) runs past end of file`);
  return { value: directDecoder.decode(bytes.subarray(offset + 4, offset + 4 + len)), nextOffset: offset + 4 + len };
}
function directReadCString(dv, bytes, offset) {
  let end = offset;
  while (end < bytes.length && bytes[end] !== 0) end++;
  return { value: directDecoder.decode(bytes.subarray(offset, end)), nextOffset: end + 1 };
}
async function directParseArz(file, pathFilters) {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  const dv = new DataView(buf);

  const unknown = dv.getUint16(0, true), version = dv.getUint16(2, true);
  if (unknown !== 2 || version !== 3) throw new Error(`Unsupported .arz header (unknown=${unknown} version=${version})`);
  const recStart = dv.getUint32(4, true);
  const recNum = dv.getUint32(12, true);
  const strStart = dv.getUint32(16, true);

  // strings table
  const stringCount = dv.getUint32(strStart, true);
  const stringsTable = new Array(stringCount);
  let off = strStart + 4;
  for (let i = 0; i < stringCount; i++) {
    const r = directReadLenString32(dv, bytes, off);
    stringsTable[i] = r.value;
    off = r.nextOffset;
    if (i % 4000 === 0) await new Promise(res => setTimeout(res, 0));
  }

  const filters = pathFilters ? pathFilters.map(f => f.toLowerCase()) : null;
  const result = {};

  off = recStart;
  for (let i = 0; i < recNum; i++) {
    const strId = dv.getUint32(off, true); off += 4;
    const typeR = directReadLenString32(dv, bytes, off); off = typeR.nextOffset; // record "type" string - unused here, matches Python
    const dataOffset = dv.getUint32(off, true); off += 4;
    const compSize = dv.getUint32(off, true); off += 4;
    const decompSize = dv.getUint32(off, true); off += 4;
    off += 8; // unused/checksum

    const fileName = stringsTable[strId];
    // includes(), not startsWith(): mods like Grimarillion nest record roots under extra prefixes
    // ("records/_d3/records/skills/...", "records/_priest/records/items/..."). pathMatchesFilter also
    // allows the "_xxx/" segment right after "records/".
    if (filters && !filters.some(f => pathMatchesFilter(fileName.toLowerCase(), f))) {
      if (i % 2000 === 0) await new Promise(res => setTimeout(res, 0));
      continue;
    }

    const compBytes = bytes.subarray(dataOffset + DIRECT_DATA_OFFSET_ADJUST, dataOffset + DIRECT_DATA_OFFSET_ADJUST + compSize);
    let decomp;
    try {
      decomp = directLz4Decompress(compBytes, 0, compSize, decompSize);
    } catch (ex) {
      continue;
    }

    const attrs = {};
    let o = 0;
    const ddv = new DataView(decomp.buffer, decomp.byteOffset, decomp.byteLength);
    while (o < decomp.length) {
      const varType = ddv.getUint16(o, true);
      const count = ddv.getUint16(o + 2, true);
      const strIdx = ddv.getUint32(o + 4, true);
      o += 8;
      const attribName = stringsTable[strIdx];
      const values = [];
      for (let k = 0; k < count; k++) {
        if (varType === 0) values.push(ddv.getInt32(o, true));
        else if (varType === 1) values.push(Math.round(ddv.getFloat32(o, true) * 1e6) / 1e6);
        else if (varType === 2) values.push(stringsTable[ddv.getUint32(o, true)]);
        else if (varType === 3) values.push(decomp[o] !== 0 || decomp[o + 1] !== 0 || decomp[o + 2] !== 0 || decomp[o + 3] !== 0);
        else throw new Error(`Unknown var type ${varType} in ${fileName}`);
        o += 4;
      }
      if (!attrs[attribName]) attrs[attribName] = [];
      attrs[attribName].push(...values);
    }
    result[fileName] = attrs;

    if (i % 2000 === 0) await new Promise(res => setTimeout(res, 0));
  }

  // records/creatures/ pruning (only kept if that filter was actually requested)
  if (filters && filters.some(f => f.startsWith('records/creatures/'))) {
    for (const fileName of Object.keys(result)) {
      if (fileName.toLowerCase().startsWith('records/creatures/')) {
        const tname = (result[fileName].templateName || [null])[0];
        if (!DIRECT_PET_TEMPLATES.has(tname)) delete result[fileName];
      }
    }
  }

  return result;
}
async function directParseArcIndex(file) {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  const dv = new DataView(buf);

  const version = dv.getInt32(4, true);
  const numFiles = dv.getInt32(8, true);
  const numRecords = dv.getInt32(12, true);
  const sizeRecords = dv.getUint32(16, true);
  const sizeStrings = dv.getUint32(20, true);
  const offsetRecords = dv.getUint32(24, true);
  if (version !== 3) throw new Error(`Unsupported .arc version ${version}`);

  let off = offsetRecords;
  const parts = new Array(numRecords);
  for (let i = 0; i < numRecords; i++) {
    parts[i] = [dv.getInt32(off, true), dv.getInt32(off + 4, true), dv.getInt32(off + 8, true)];
    off += 12;
  }

  off = offsetRecords + sizeRecords;
  const names = new Array(numFiles);
  for (let i = 0; i < numFiles; i++) {
    const r = directReadCString(dv, bytes, off);
    names[i] = r.value;
    off = r.nextOffset;
  }

  off = offsetRecords + sizeRecords + sizeStrings;
  const tocs = new Array(numFiles);
  for (let i = 0; i < numFiles; i++) {
    const type = dv.getInt32(off, true);
    const tOffset = dv.getInt32(off + 4, true);
    const lenComp = dv.getInt32(off + 8, true);
    const lenDecomp = dv.getInt32(off + 12, true);
    // + hash(i32, off+16) + fileTime(i64, off+20..27) = 12 bytes skipped — fileTime is 8 bytes, not 4
    const numParts = dv.getInt32(off + 28, true);
    const index = dv.getInt32(off + 32, true);
    // + lenString(i32) + offsetString(i32) = 8 bytes skipped
    tocs[i] = { type, offset: tOffset, lenComp, lenDecomp, numParts, index };
    off += 44; // 4*8 fields + 8-byte fileTime = 44, not 40
  }

  return { bytes, names, tocs, parts };
}
function directDetermineTocIndexes(names, tocs) {
  const numUnused = tocs.filter(t => t.numParts === 0).length;
  let skipTocs = false;
  if (numUnused > 0) {
    for (let i = 0; i < numUnused; i++) {
      const s = names[names.length - i - 1];
      const pos1 = s.lastIndexOf('/'), pos2 = s.lastIndexOf('.');
      if (pos2 === -1 || pos1 > pos2) continue;
      let allowed = true;
      for (const c of s) {
        if (/[0-9A-Za-z_\-/\\]/.test(c)) continue;
        allowed = false; break;
      }
      if (!allowed) continue;
      skipTocs = true; break;
    }
  }
  if (skipTocs) return names.map((_, i) => i);

  const tocOf = new Array(names.length).fill(null);
  let tocIndex = -1, fileIndex = -1;
  const tocMax = tocs.length - 1, fileMax = names.length - 1;
  while (tocIndex < tocMax && fileIndex < fileMax) {
    tocIndex++;
    if (tocs[tocIndex].lenDecomp === 0 && tocs[tocIndex].numParts === 0) continue;
    fileIndex++;
    tocOf[fileIndex] = tocIndex;
  }
  return tocOf;
}
const DIRECT_MAX_ARC_ENTRY_BYTES = 200 * 1024 * 1024;
function directExtractArcEntry(raw, tocs, parts, tocIndex) {
  const toc = tocs[tocIndex];
  if (toc.lenDecomp < 0 || toc.lenDecomp > DIRECT_MAX_ARC_ENTRY_BYTES) {
    throw new DirectParseAbort(`toc entry ${tocIndex} claims lenDecomp=${toc.lenDecomp} — almost certainly a misread field, not a real size`);
  }
  if (toc.type === 1 && toc.lenComp === toc.lenDecomp) {
    return raw.subarray(toc.offset, toc.offset + toc.lenDecomp);
  }
  const data = new Uint8Array(toc.lenDecomp);
  let offDecomp = 0;
  for (let j = 0; j < toc.numParts; j++) {
    const part = parts[toc.index + j];
    if (!part) throw new DirectParseAbort(`toc entry ${tocIndex} references part ${toc.index + j}, out of range (parts has ${parts.length})`);
    const [pOffset, pLenComp, pLenDecomp] = part;
    const comp = raw.subarray(pOffset, pOffset + pLenComp);
    if (pLenComp === pLenDecomp) {
      data.set(comp, offDecomp);
    } else {
      const dec = directLz4Decompress(comp, 0, pLenComp, pLenDecomp);
      data.set(dec, offDecomp);
    }
    offDecomp += pLenDecomp;
  }
  return data;
}
async function directParseTextArc(file) {
  const { bytes, names, tocs, parts } = await directParseArcIndex(file);
  const tocOf = directDetermineTocIndexes(names, tocs);
  const tagsOut = {};
  const textDecoderUtf8 = new TextDecoder('utf-8', { fatal: false });
  for (let i = 0; i < names.length; i++) {
    const fname = names[i];
    if (!fname.toLowerCase().endsWith('.txt')) continue;
    const tocIdx = tocOf[i];
    if (tocIdx === null || tocIdx === undefined) continue;
    let data;
    try { data = directExtractArcEntry(bytes, tocs, parts, tocIdx); }
    catch (ex) { continue; }
    const text = textDecoderUtf8.decode(data);
    for (let line of text.split(/\r?\n/)) {
      line = line.replace(/\x00+$/, '').trim();
      if (!line || line.startsWith('//') || !line.includes('=')) continue;
      const eq = line.indexOf('=');
      const tag = line.slice(0, eq).trim();
      const value = line.slice(eq + 1).trim().replace(/\x00+$/, '');
      if (tag) tagsOut[tag] = value;
    }
    if (i % 500 === 0) await new Promise(res => setTimeout(res, 0));
  }
  return tagsOut;
}

const RemData={directParseArz,directParseArcIndex,directDetermineTocIndexes,directExtractArcEntry,directParseTextArc,evalFormula,TAG_INFO,GD_TEXT};
if(typeof module!=="undefined") module.exports=RemData;else globalThis.RemData=RemData;
