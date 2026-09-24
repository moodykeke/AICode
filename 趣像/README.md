# 趣像（Qu Xiang）· 源码与构建

拾趣馆第 11 件展品。上游是一个第三方单文件 canvas 应用（`baseline.html`），本仓库对它做
**字符串补丁 + 追加扩展** 的集成，不改上游结构——升级时可整包替换 baseline 再逐条核对补丁锚点。

## 构建

```bash
cd 趣像
node build.cjs              # 读 baseline.html → 打补丁 → 拼接扩展 → 产出 static/fun/quxiang/index.html
node build.cjs --verify     # 只做补丁契约检查：命中/失配清单（上游换版时先跑这个）
```

产物直接落到站内目录（内网 nginx 直出仓库工作树）：`static/fun/quxiang/{index.html,favicon.svg}`；
同时生成 `趣像/app-check.js`（产物里的脚本体，供检查用，不入库）。

## 目录

| 文件 | 作用 |
| --- | --- |
| `baseline.html` | 上游原件（只读，勿改） |
| `build.cjs` | 构建 + 补丁清单 + 资产版本注入 |
| `*.js` | 本仓库的扩展（按 build.cjs 里的顺序拼接；同一 IIFE 作用域） |
| `favicon.svg` | 产物图标 |
| `new-faces.js` / `myth-faces.js` | r43 人像：共用零件 + 逐个构图（新增角色的约定见 `docs/quxiang-r43/角色重绘-r43.md`） |
| `portrait-sprite.js` | r43 半身像位图缓存（舞台每帧只重画眼睛） |
| `ux-r43.js` | r43 词条索引、键位表分区、手机样式、弱机降分辨率 |
| `fun-r43.js` | r43 趣味合奏、合影队形 / 倒数 / 拍照瞬间 / 相框 |
| `card-words-r44.js` | r44 经典角色卡片的中文文字（名字、物种、特征、爱好与害怕）；`cardBio()` 登记卡片背面文字 |
| `evolve-r44.js` | r44 投放进化 · 生态缸（投放、繁衍、突变、气候选择、喂食、陨石、物种志） |
| `packs-r45.js` | r45 角色包登记表 `QX_PACKS`、角色包浏览器、整包上台 |
| `ui-r45.js` | r45 上下文层 `QX_CTX`、键位登记 `QX_KEYS`、工具栏浮层、手机底部五键 |
| `evolve-plus-r45.js` | r45 生态缸第二期：神话血统、分区、天灾、进化树、图鉴与成就、挑战、缸码、海报 |
| `gestures-r46.js` | r46 触屏手势收敛（轻触 / 长按 / 单指划 / 双指） |
| `power-a11y-r46.js` | r46 省电模式、无障碍（舞台说明、aria-live、键盘焦点） |
| `evolve-more-r46.js` | r46 生态缸第三期：时间倒带、食物链与共生、进化延时、海报送展墙 |
| `evolve-voice-r47.js` | r47 生态缸台词与气候声景 |
| `evolve-feel-r48.js` | r48 生态缸手感：投放淡影、手绘空窝、落地涟漪、悬停小签、D/F/M 键、纸感面板 |
| `gourd-r49.js` | r49 葫芦七子 Q 版大头重画，并入动画来客 |
| `bust-split-r49.js` | r49 半身像头肩分离（肩膀不跟着跳，补脖子） |
| `photo-r49.js` | r49 大合影：合影设置、入场动态、5 种新队形、烟花；修连拍变小 |
| `zodiac-r50.js` | r50 十二生肖（经典头像新物种，七个基因座全开）与剪纸风画风 |

## 两条约定

1. **只改扩展文件与 build.cjs**，不要直接改产物 `static/fun/quxiang/index.html`（下次构建会覆盖）；
2. **资产版本**：派生资源（基线头像、情绪件）的 URL 会拼 `?v=<拾趣馆卡片 v>`；
   发版时 bump `static/fun/manifest.json` 里 quxiang 的 `v`，卡片与派生资源一起换新。

## 相关文档

- 每批的验收与设计：`docs/fun/quxiang-rNN/`（含 `开发与验证/` 源码快照、版本记录、验证说明）
- 本仓库：`docs/quxiang-r42/`（r42 归档文档）、`docs/quxiang-r43/`（r43 设计、性能、界面方案、样张）、`docs/quxiang-r44/`（生态缸、角色包与分享互动设计）、`docs/quxiang-r45/`（生态缸第二期、界面 P1 与角色包）、`docs/quxiang-r46/`（界面 P2/P3、生态缸第三期）、`docs/quxiang-r47/`（台词与声景）、`docs/quxiang-r48/`（沉浸式舞台、生态缸手感）、`docs/quxiang-r49/`（大合影第三期、葫芦七子、头肩分离）、`docs/quxiang-r50/`（十二生肖、剪纸风）
- 高观点审查与增强方案：`docs/fun/趣像-高观点审查与增强方案-20260923.md`
- 头像管线：`bin/process-student-avatars.py`、情绪件：`bin/generate-avatar-emotions.py`
- 回归套件：`bin/quxiang-regress.mjs`
