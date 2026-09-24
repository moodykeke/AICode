# 趣像源码包 · 2026-09-24（r42）

## 这是什么

「趣像」单页应用的**全部源码与文档**：上游单文件应用 + 本仓库 26 个扩展 + 构建脚本 + 归档。

```
趣像-源码/
├── README.md               构建方式与两条约定（先读这个）
├── baseline.html           上游原件（只读，勿改）
├── build.cjs               构建：baseline + 字符串补丁 + 拼接扩展 → index.html
│                           node build.cjs          构建到 ../static/fun/quxiang/
│                           node build.cjs --verify 只做补丁契约检查（44 条锚点）
├── *.js（26 个）            扩展（按 build.cjs 内列表顺序拼接，同一 IIFE 作用域）
│   studio/atlas/folklore/portrait-evolution/new-faces/ensemble/curation/locale-lookbook
│   touch-feel/neck-mode/scale-play/dock-moves/wall-submit/gaze-life/audio-bank
│   panel-design/move-sound/memory-tame/gaze-hop-fix/group-photo/photo-lab
│   class-faces/pointer-turn/mobile-fit/mem-tag/bigscreen/i18n-fill
├── favicon.svg
├── 归档-r42/               最新批次归档：版本记录（r17→r42 全部批次）、验证说明、
│                           每批设计文档、manifest（哈希清单）、版本信息.json
└── README-打包说明.md      本文件
```

## 怎么构建

```bash
cd 趣像-源码
node build.cjs     # 需要 Node 18+；产物 index.html + favicon.svg 写到 ../static/fun/quxiang/
```

注意：`build.cjs` 的输出路径指向仓库内的 `../static/fun/quxiang/`；在本包独立使用时，
把末尾 `const OUT = path.join(__dirname, '..', 'static', 'fun', 'quxiang')` 改成任意目标目录即可。
构建产物（r42 线上版）在 `归档-r42/index.html` 可直接对照（约 720KB，双网线上就是这份）。

## 版本口径

- v13.0.0 · candidate-r42（2026-09-24），r17→r42 共 26 批，全部批次的设计与验收记录在 `归档-r42/版本记录.md`。
- 依赖：仅浏览器原生能力（Canvas 2D / WebAudio / pointer events），无任何外部库、无网络依赖
  （班级人像/情绪件走平台 `/avatars/unified/`，缺件自动退回本地玩法）。

## 配套（不在本包内，见仓库）

- 头像统一化管线 `bin/process-student-avatars.py`、情绪件生成 `bin/generate-avatar-emotions.py`、
  刷新流水线 `bin/refresh-avatars.sh`、回归套件 `bin/quxiang-regress.mjs`（均在 snapCloud 仓库 `bin/`）。
