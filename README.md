# GrimWeaver

![GrimWeaver](app/assets/brand/weaver.png)

**Offline build planner for Grimarillion v97d (GAL).**

[Download](https://github.com/drowsc089/GrimWeaver/releases/latest) · [v1.82](https://github.com/drowsc089/GrimWeaver/releases/tag/v1.82) · [Changelog](docs/CHANGELOG.html) · [Notices](docs/NOTICE.html)

## English

### New in v1.82

- Added final damage-type composition below player/pet damage totals, merging all converted sources that end in the same type.
- Direct hits and DoT per second have separate totals, type breakdowns and mean shares. The same display is used in the compact character panel, skill dialog, pet page and pet previews.
- Original per-source calculations remain available as expandable details. Weapon hands stay separate; basic attack DPS now uses only direct damage, without multiplying DoT again by attack speed.
- Fixed flat pet damage bonuses contributing to the lower bound but not the upper bound when combined with native damage ranges.

[v1.82 details](docs/RELEASE_1_82.html). Existing build formats and read-only save import are unchanged.

### New in v1.81

- Pet damage now applies pet-only conversion before destination-type bonuses, with base, modified, converted and pet-scaled breakdowns in the pet page and skill previews.
- Player-scaling summons, including Blade Spirit, appear in **Offense > Learned skill damage** and use player conversion and destination bonuses, separately from pet-only properties.
- Added player/pet conversion summaries and a full source inventory, separating global, skill-specific, inactive and current-pet-specific properties. Sources include equipped items, affixes, unlocked sets, learned passives, devotions and enabled buffs in the active weapon set.
- Fixed inactive summon modifier slots being treated as rank one. Conversion over 100% is normalized and converted damage never converts twice.
- Fixed Chinese conversion-source labels, including **Elemental → 元素**, across summaries and damage breakdowns.

The [v1.81 notes](docs/RELEASE_1_81.html) describe the remaining static-model limits. Build formats, old links and read-only character import remain compatible.

### New in v1.8

- Re-audited all equipment and affix catalogs against merged game/mod records, positive-weight source tables, crafting, vendors, quests and GAL NPC exchanges. Restored supported items outside the old `records/items` path restriction.
- Equipment/loot references from creatures with explicit `dropItems=false` do not count as acquisition sources. A separate real crafting, vendor, quest or droppable-monster source can still make the item available. Developer inspection cannot equip records marked unavailable.
- Weapon selection now has 13 database-derived families, including spears, two-handed spears and staves. Off-hand weapon searches exclude two-handed weapons.
- Added an Awakened filter and a separate character-level filter. All 126 source-backed Awakened records remain available; two require level 101 in the actual data, so their visibility does not imply a level-100 character can equip them.
- Learned attack skills now have an offense-panel damage preview and expanded breakdown: base, skill-modified, converted and character-scaled damage, with weapon portions, DoT, active modifiers and conversion paths.
- Fixed intermittent mastery-data loss when importing builds after browsing many equipment categories.

### Download and Run

Download `GrimWeaver_v1.82_GAL_Offline.zip` from [Releases](https://github.com/drowsc089/GrimWeaver/releases/latest), extract the complete folder and run `GrimWeaver.exe`. Requires Windows x64 and a modern browser. The launcher is self-contained; no .NET installation or Internet connection is required. The local address is `http://127.0.0.1:15688/`. Exit from the system tray to stop the service.

SHA-256 sidecars accompany release archives. The application is not code-signed and Windows may display a first-run warning. Download from this repository's Releases and verify the checksum; do not disable system security protections.

### Features

- Equipment, affixes, components, augments, sets and item skill modifiers, with approximate roll ranges.
- Masteries, devotions, editable celestial power ranks, buffs, pets and current-build debuffs.
- Skill modifier lookup, resistance-reduction calculator and enemy resistance statistics with difficulty/content/encounter filters.
- Build notes, author, dates, game/mod versions and online or local video references.
- Local saves, file import/export, self-contained DB1 codes and full share links, Chinese/English UI and remembered language.
- Read-only `.gdc` import, without changing character saves or game databases.

### Celestial Rank Imports

Build-file, code and link imports set allocated celestial powers to maximum rank. Native `.gdc` imports retain actual character ranks. Local saves, session restoration, undo and redo preserve explicit ranks; missing legacy ranks default to maximum. All 63 powers use experience-table growth caps, consistently across tooltips, buffs, summons and build debuffs.

The DB1 codec and `schemaVersion=1` remain stable, with unknown extension fields retained. File-format compatibility is separate from compatibility with unknown future mod datasets; retain original exports. Local video files are not embedded or transferred.

### Build from Source

Install the **.NET 8 SDK**, then run `./tools/build-launcher.ps1` in PowerShell from the repository root. Run the resulting `GrimWeaver.exe`. Bundled UI, data and assets are sufficient; rebuilding the launcher does not require extracting game databases.

With **Node.js 22+**, run `node tools/verify-compatibility.cjs` and `node tools/verify-v182.cjs`. Set `GRIMWEAVER_TEST_SAVE` to opt into read-only browser/native-save checks. Generated reports are ignored under `verification/`. See [tools/README.md](tools/README.md) for optional data-maintenance inputs.

### Scope and Rights

This is an unofficial community tool, not a complete game-engine simulation. DPS, attack rates, random rolls, some modifiers and pet statistics require further in-game calibration. Enemy random gear, temporary effects and mutators are not fully simulated.

Skill previews are per effect, not an automatic total-DPS calculation. Projectile overlap, proc rates, target defenses, critical hits, target-dependent current-health damage and added retaliation are excluded from flat totals. Missing linked records are flagged rather than fabricated. Acquisition checks do not simulate every actor placement or runtime quest condition. [v1.8 details](docs/RELEASE_1_8.html)

Independently authored GrimWeaver code and the original application mark are [MIT-licensed](LICENSE.txt). Game/mod data, art, localization and third-party code retain their respective ownership and are **not relicensed under MIT**. Rem's project-specific permission is recorded in [Rem-PERMISSION.txt](third_party/Rem-PERMISSION.txt). Read [NOTICE.html](docs/NOTICE.html) before redistribution.

Author: **drchan089** · Contact: **drowsc@gmail.com**

## 简体中文

### v1.82 更新

- 总伤害下新增最终类型构成，将转换后类型相同的所有来源合并。
- 直接伤害和每秒持续伤害分别显示合计、类型组成和平均占比，角色侧栏、技能弹窗、战宠页及技能预览统一展示。
- 原逐来源计算保留为可展开明细。主副手分开；普通攻击DPS只使用直接伤害，不再把持续伤害重复乘攻速。
- 修正战宠固定伤害与原生伤害区间叠加时，上限漏加固定加成的问题。

[v1.82 详细说明](docs/RELEASE_1_82.html)。构筑格式与只读存档导入不变。

### v1.81 更新

- 战宠先应用专用转换，再按转换后的伤害类型加成；战宠页和技能预览分列基础、修正、转换后与战宠加成后数值。
- 刀灵等角色加成类召唤物进入“攻击 > 已学技能伤害”，读取角色转换与转换后加成，不混入战宠专用词条。
- 增加角色/战宠转换汇总及完整来源表，区分全局、技能专用、未启用及当前战宠自身转换，覆盖当前武器组的装备、词缀、生效套装、已学被动、星座与已启用增益。
- 修正召唤物未激活修正槽位被当成1级生效的问题。超过100%的竞争转换归一，已转换部分不会再次转换。
- 补齐转换来源与伤害明细的中文类型名称，包括 **Elemental → 元素**。

仍为静态预估，限制见 [v1.81 说明](docs/RELEASE_1_81.html)。构筑格式、旧链接和只读存档导入保持兼容。

### v1.8 更新

- 重新复核全部装备和词缀目录，按合并数据库、正权重来源表、制作、商店、任务与 GAL NPC 转换判断获取来源，补回旧 `records/items` 路径限制误排除的有效条目。
- 明确设置 `dropItems=false` 的生物装备/掉落引用不作为获取来源；同物品另有有效制作、商店、任务或正常怪物掉落来源时保留。未纳入正常来源的记录在开发者查看中也不可选装。
- 武器增加 13 类数据库分类，包含单手长矛、双手长矛、法杖；副手武器筛选不显示双手武器。
- 增加“仅觉醒”和独立等级筛选。126 条有来源的觉醒记录保留；其中两件数据库需求等级为 101，可见不代表 100 级角色可装备。
- 攻击面板增加已学技能伤害及展开明细，分列基础、技能修正、转换后、人物加成后数值，区分武器部分和持续伤害，并列出生效修正与转换路径。
- 修复浏览多个装备分类后，导入构筑偶发专精数据丢失的问题。

### 下载与运行

1. 在 Releases 下载 `GrimWeaver_v1.82_GAL_Offline.zip`，解压整个文件夹。
2. 运行 `GrimWeaver.exe`。需要 Windows x64 和现代浏览器，无需安装 .NET，也无需联网。
3. 本机页面为 `http://127.0.0.1:15688/`。从系统托盘退出程序可结束本机服务。

正式包附 SHA-256 校验文件。程序尚未进行代码签名，首次启动可能出现 Windows 安全提示。仅从本仓库 Releases 下载并校验文件；不建议关闭系统安全防护。

### 功能

- 装备、词缀、镶嵌物、附魔、套装与物品技能修正；变量范围为近似值。
- 多专精技能、星座、自定义星座触发技能等级、增益、战宠及构筑对敌削弱。
- 技能修正查找、对敌降抗计算、敌人抗性统计与难度/内容/遭遇类型筛选。
- 构筑思路、作者、日期、游戏与模组版本、网络视频链接或本地视频路径。
- 本地构筑保存、导入导出、DB1 分享码与完整分享链接；中英双语及语言记忆。
- 只读导入 `.gdc` 角色存档，不修改存档或游戏数据库。

### 星座等级导入规则

- 导入构筑文件、分享码或分享链接：已分配的星座触发技能默认满级。
- 导入游戏 `.gdc`：使用角色当前实际星座触发技能等级。
- 本地保存、启动恢复、撤销和重做：保留手动等级；旧数据缺少等级时默认满级。
- 63 个触发技能的成长上限来自经验表，技能说明、增益、召唤物和构筑削弱使用同一等级。

DB1 编码和 `schemaVersion=1` 保持兼容，保留未知扩展字段。软件格式兼容不代表未知未来模组数据的数值兼容，请保留原始导出文件。本地视频不会随构筑文件传输，其他电脑须重新指定路径。

### 源码与构建

源码已经包含运行所需的界面、数据和素材。安装 **.NET 8 SDK** 后，在源码根目录执行：

```powershell
./tools/build-launcher.ps1
./GrimWeaver.exe
```

模型测试需 **Node.js 22 或更新版本**：

```powershell
node tools/verify-compatibility.cjs
node tools/verify-v182.cjs
```

可选的只读存档测试通过环境变量 `GRIMWEAVER_TEST_SAVE` 指定自己的 `.gdc` 文件；未指定则跳过该项。测试输出在忽略的 `verification/` 目录。数据维护说明见 [tools/README.md](tools/README.md)。不需要重新提取游戏数据库即可构建启动器。

### 范围与版权

这是社区静态构筑工具，不是官方产品，也不等同于完整游戏引擎。DPS、攻击频率、随机变量、部分技能修正与战宠数值仍需游戏内校准；敌人随机装备、临时效果和变异等并未全部模拟。

技能按单次效果预估，不自动合并总 DPS；弹体重叠、触发率、目标防御、暴击、依赖目标当前生命的伤害与反击附加不计入固定伤害合计。缺失关联记录会明确提示，不补造效果。获取性检查未模拟所有地图实体放置和运行时任务条件。[v1.8 详细说明](docs/RELEASE_1_8.html)

独立编写的 GrimWeaver 代码及原创应用标记采用 [MIT](LICENSE.txt)。游戏、模组、美术、汉化与第三方代码仍归原权利人所有，不因本仓库公开而获得 MIT 授权。Rem Skill Planner 的项目用途授权与归属见 [Rem-PERMISSION.txt](third_party/Rem-PERMISSION.txt) 和 [NOTICE.html](docs/NOTICE.html)。请勿将整个素材集合视为可任意再授权资源。

作者：**大包** · 邮箱：**drowsc@gmail.com** · QQ 群：**972328019**
