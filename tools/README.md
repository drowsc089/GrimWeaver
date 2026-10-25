# Data Maintenance / 数据维护

Normal launcher builds use the bundled `app/data` and assets. No game extraction is required. The scripts below are optional incremental maintenance tools, not a complete from-scratch asset exporter.

For v1.82, `verify-v182.cjs` checks final-type aggregation and reconciliation with player/pet totals. `verify-browser-v182.cjs` checks composition tables, expandable source details and narrow-screen layouts. `release-docs-v182.cjs`, `package-v182.ps1` and `verify-package-v182.ps1` generate/check the current delivery.

正常构建直接使用随库数据与素材。以下仅为可选的增量维护工具，不是完整的从零素材导出流程。

| Environment variable | Input / 用途 |
| --- | --- |
| `DAWNBUILD_GAME` | Installed Grim Dawn directory / 游戏安装目录 |
| `DAWNBUILD_MOD` | Grimarillion mod directory; defaults to `mods/grimarillion` under the game / 模组目录 |
| `GRIMWEAVER_DATABASE_CACHE` | Merged database cache directory; defaults to `data-cache/` / 数据库缓存 |
| `GRIMWEAVER_SWAP_SCRIPTS` | Extracted GAL Lua directory containing `MI_tables_*.lua` / 已提取的转换脚本目录 |
| `GRIMWEAVER_LOCALIZATION_ROOT` | GAL localization parent containing `Text_EN_03` and `Text_ZH_03` / GAL 汉化父目录 |
| `GRIMWEAVER_VANILLA_ZH` | Extracted vanilla Chinese text directory / 原版简中目录 |
| `GRIMWEAVER_TEST_SAVE` | Optional private `.gdc` file for read-only tests / 可选只读测试存档 |
| `GRIMWEAVER_BASELINE_ROOT` | Optional extracted previous source/app folder for acquisition-diff reports / 可选旧版目录，用于获取性差异统计 |

Unconfigured source directories default to ignored `game-source/` and `data-source/` placeholders. Set the environment variables to your own legally obtained inputs. Never commit game installations, raw database caches, private saves or generated verification reports.

未配置的输入指向已忽略的本地占位目录。请通过环境变量指定自己合法取得的素材；不要提交游戏安装、原始数据库缓存、私人存档或核查报告。

- `export-database-cache.cjs`: exports installed ARZ layers to a local cache; includes the base game, expansions and GAL, and checks record counts.
- `build-data-v16.cjs`, `build-data-v17.cjs`, `build-research.cjs`, `upgrade-research-v16.cjs`: historical incremental data transformations. Review the version assumptions before running; they can change bundled packs.
- `update-data-v171.cjs`: refreshes celestial rank research from bundled data for v1.71.
- `build-data-v18.cjs --apply`: verifies installed ARZ fingerprints, refreshes acquisition flags, weapon labels, legality pools, effects and item research indexes. Requires the cache, localization, installed game and GAL swap-script inputs above. Running without `--apply` only writes the local audit.
- `verify-v18.cjs`: current model/catalog tests, including rank-indexed references, conversion ordering and set thresholds. `verify-browser-v18.cjs` uses Playwright and an installed Edge browser; set `PLAYWRIGHT_MODULE`, `GRIMWEAVER_BROWSER` or `GRIMWEAVER_TEST_URL` when needed. Browser tests use a fresh profile; the optional `.gdc` test is read-only.
- `package-v18.ps1`: builds curated v1.8 archives in an explicitly selected output directory without including reports, saves, preferences or compiler output. `verify-package-v18.ps1` checks archive entries and hashes.
- `verify-compatibility.cjs`, `verify-v171.cjs`: portable compatibility and rank-policy checks. The optional save test is skipped without `GRIMWEAVER_TEST_SAVE`.
- `package-v171.ps1`, `verify-package-v171.ps1`: original curated release packaging and verification. Repository-only Markdown documentation is not part of that historical whitelist. GitHub tag archives include the complete published repository.

Data extraction does not grant redistribution rights. See the root license and third-party notices.
# v1.81

`verify-v181.cjs` tests scoped conversion, pet damage, player-scaling summons and compatibility with the current acquisition catalogs. `verify-browser-v181.cjs` checks desktop/mobile English/Chinese UI; set `PLAYWRIGHT_MODULE` to a Playwright installation and optionally `GRIMWEAVER_TEST_SAVE` for read-only save checks.

`build-data-v181.cjs` expands summon effect references using `GRIMWEAVER_DATABASE_CACHE`, without changing item acquisition rules. `release-docs-v181.cjs` rebuilds the bilingual release guide. `package-v181.ps1` and `verify-package-v181.ps1` accept `-OutputDirectory` and produce/check the current formal archives.
