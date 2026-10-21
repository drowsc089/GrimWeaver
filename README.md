# GrimWeaver

![GrimWeaver](app/assets/brand/weaver.png)

**Offline build planner for Grimarillion v97d (GAL).**

[Download](https://github.com/drowsc089/GrimWeaver/releases/latest) · [v1.71](https://github.com/drowsc089/GrimWeaver/releases/tag/v1.71) · [Changelog](docs/CHANGELOG.html) · [Notices](docs/NOTICE.html)

## English

### Download and Run

Download `GrimWeaver_v1.71_GAL_Offline.zip` from [Releases](https://github.com/drowsc089/GrimWeaver/releases/latest), extract the complete folder and run `GrimWeaver.exe`. Requires Windows x64 and a modern browser. The launcher is self-contained; no .NET installation or Internet connection is required. The local address is `http://127.0.0.1:15688/`. Exit from the system tray to stop the service.

SHA-256 sidecars accompany release archives. The application is not code-signed and Windows may display a first-run warning. Download from this repository's Releases and verify the checksum; do not disable system security protections.

### Features

- Equipment, affixes, components, augments, sets and item skill modifiers, with approximate roll ranges.
- Masteries, devotions, editable celestial power ranks, buffs, pets and current-build debuffs.
- Skill modifier lookup, resistance-reduction calculator and enemy resistance statistics with difficulty/content/encounter filters.
- Build notes, author, dates, game/mod versions and online or local video references.
- Local saves, file import/export, self-contained DB1 codes and full share links, Chinese/English UI and remembered language.
- Read-only `.gdc` import, without changing character saves or game databases.

### v1.71 Rank Behavior

Build-file, code and link imports set allocated celestial powers to maximum rank. Native `.gdc` imports retain actual character ranks. Local saves, session restoration, undo and redo preserve explicit ranks; missing legacy ranks default to maximum. All 63 powers use experience-table growth caps, consistently across tooltips, buffs, summons and build debuffs.

The DB1 codec and `schemaVersion=1` remain stable, with unknown extension fields retained. File-format compatibility is separate from compatibility with unknown future mod datasets; retain original exports. Local video files are not embedded or transferred.

### Build from Source

Install the **.NET 8 SDK**, then run `./tools/build-launcher.ps1` in PowerShell from the repository root. Run the resulting `GrimWeaver.exe`. Bundled UI, data and assets are sufficient; rebuilding the launcher does not require extracting game databases.

With **Node.js 22+**, run `node tools/verify-compatibility.cjs` and `node tools/verify-v171.cjs`. Set `GRIMWEAVER_TEST_SAVE` to opt into a read-only native-save test. Generated reports are ignored under `verification/`. See [tools/README.md](tools/README.md) for optional data-maintenance inputs.

### Scope and Rights

This is an unofficial community tool, not a complete game-engine simulation. DPS, attack rates, random rolls, some modifiers and pet statistics require further in-game calibration. Enemy random gear, temporary effects and mutators are not fully simulated.

Independently authored GrimWeaver code and the original application mark are [MIT-licensed](LICENSE.txt). Game/mod data, art, localization and third-party code retain their respective ownership and are **not relicensed under MIT**. Rem's project-specific permission is recorded in [Rem-PERMISSION.txt](third_party/Rem-PERMISSION.txt). Read [NOTICE.html](docs/NOTICE.html) before redistribution.

Author: **drchan089** · Contact: **drowsc@gmail.com**

## 简体中文

### 下载与运行

1. 在 Releases 下载 `GrimWeaver_v1.71_GAL_Offline.zip`，解压整个文件夹。
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

### v1.71 导入规则

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
node tools/verify-v171.cjs
```

可选的只读存档测试通过环境变量 `GRIMWEAVER_TEST_SAVE` 指定自己的 `.gdc` 文件；未指定则跳过该项。测试输出在忽略的 `verification/` 目录。数据维护说明见 [tools/README.md](tools/README.md)。不需要重新提取游戏数据库即可构建启动器。

### 范围与版权

这是社区静态构筑工具，不是官方产品，也不等同于完整游戏引擎。DPS、攻击频率、随机变量、部分技能修正与战宠数值仍需游戏内校准；敌人随机装备、临时效果和变异等并未全部模拟。

独立编写的 GrimWeaver 代码及原创应用标记采用 [MIT](LICENSE.txt)。游戏、模组、美术、汉化与第三方代码仍归原权利人所有，不因本仓库公开而获得 MIT 授权。Rem Skill Planner 的项目用途授权与归属见 [Rem-PERMISSION.txt](third_party/Rem-PERMISSION.txt) 和 [NOTICE.html](docs/NOTICE.html)。请勿将整个素材集合视为可任意再授权资源。

作者：**大包** · 邮箱：**drowsc@gmail.com** · QQ 群：**972328019**
