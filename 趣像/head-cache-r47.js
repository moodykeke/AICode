/* 趣像 24 (r47): 经典半身像的逐头帧缓存（《界面与键位-高观点改造方案-r43》P3 "静止帧跳画"）
   ─────────────────────────────────────────────────────────────
   默认首屏是上游 Head Cases 的 3D 头：随指针三维转动、逐笔水彩，r43 的半身像位图缓存管不到它，4 倍降速下每帧最贵。
   观察：大多数时候大多数头只是在"闲着"——慢慢晃、慢慢转向指针、偶尔眨眼；这些变化 30 帧/秒和 60 帧/秒肉眼分不出。
   做法：每个头有一张自己的小画布（身体＋头，按舞台坐标对齐，纸纹不错位）。闲着的头隔帧（弱机隔两帧）才真正重画，
   其余帧直接贴上一次的图；相邻的头错开重画，整台每帧只重画一半（或三分之一）的头。
   立刻按实时画（不走缓存）的情况：有动作在演、被拖/在转圈、指针就在它身上、刚被摸过还在晃、弹出/缩小中、
   半透明、终章、大合影、卡片/导出（不是舞台画布）、神话与民间角色（它们已有 r43 的位图缓存）。
   任何会改变画法的东西（尺寸、分辨率、纸、画风、配色、线宽、颜色开关）一变，全部作废重画。
   内存：每头约 (4.2s×3.6s)×DPR² 像素，7×5 舞台 DPR 2 约 3MB；页面隐藏即释放。 */

var HC = { on: true, frame: 0, sig: '', every: 2, stats: { blit: 0, render: 0, live: 0 } };
function hcSig() { return [W, H, DPR, cellW, cellH, PAPER, CFG.line, CFG.wobble, CFG.mono ? 1 : 0, (CFG.styles || []).join(','), (CFG.palettes || []).join(','), CFG.density, CFG.pigment, CFG.wetness, CFG.scale].join('|'); }
function hcClear() { heads.forEach(function (h) { if (h._hc) { h._hc.c.width = h._hc.c.height = 1; h._hc = null; } }); }
function hcEligible(h, o) {
  if (!HC.on || ctx !== gctx || SUPER || h.hidden || h.g.natural) return false;
  if (typeof PHOTO !== 'undefined' && PHOTO && PHOTO.active) return false;
  if ((h.acts && h.acts.length) || h.queue || h.spinning || h.dragging) return false;
  if (Math.abs((h.pop || 1) - 1) > .01 || GALPHA < .999) return false;
  if (o && (o.neck || o.melt || o.ice || o.ghost || o.stump)) return false;
  if (hovered === h || (breedFrom && (breedFrom === h))) return false;
  var f = h.__feel; if (f && (Math.abs(f.vx) + Math.abs(f.vy) + Math.abs(f.rv) + Math.abs(f.x) + Math.abs(f.y) + Math.abs(f.r)) > .01) return false;
  if (typeof EVO !== 'undefined' && EVO.on) return false;
  return true;
}
function hcBox(h) { var s = h.s; return { x: h.x - 2.1 * s, y: h.y - 1.95 * s, w: 4.2 * s, h: 3.65 * s }; }

var hcBaseBody = Head.prototype.drawBodyAt, hcBaseHead = Head.prototype.drawHeadAt;
Head.prototype.drawBodyAt = function (o) {
  if (!hcEligible(this, o)) { this._hcMode = 'live'; return hcBaseBody.apply(this, arguments); }
  var c = this._hc, idx = this.row * cols + this.col;
  var due = !c || c.sig !== HC.sig || c.x !== this.x || c.y !== this.y || c.s !== this.s || (HC.frame + idx) % HC.every === 0;
  this._hcMode = due ? 'render' : 'blit';
  /* 身体留到头那一遍和头一起画进缓存 */
};
Head.prototype.drawHeadAt = function (o) {
  var mode = this._hcMode; this._hcMode = null;
  if (mode !== 'render' && mode !== 'blit') { HC.stats.live++; return hcBaseHead.apply(this, arguments); }
  var B = hcBox(this), c = this._hc;
  if (mode === 'render') {
    var pw = Math.ceil(B.w * DPR), ph = Math.ceil(B.h * DPR);
    if (!c) { var cv2 = document.createElement('canvas'); if (typeof MEM_TAG === 'function') MEM_TAG(cv2, 'head-cache'); c = this._hc = { c: cv2 }; }
    if (c.c.width !== pw || c.c.height !== ph) { c.c.width = pw; c.c.height = ph; } else c.c.getContext('2d').clearRect(0, 0, pw, ph);
    var x2 = c.c.getContext('2d'), self = this, args = arguments;
    x2.setTransform(DPR, 0, 0, DPR, -B.x * DPR, -B.y * DPR);
    renderTo(x2, PAT, LINE_K, function () { hcBaseBody.apply(self, args); hcBaseHead.apply(self, args); });
    c.sig = HC.sig; c.x = this.x; c.y = this.y; c.s = this.s; c.bx = B.x; c.by = B.y; c.bw = B.w; c.bh = B.h;
    HC.stats.render++;
  } else HC.stats.blit++;
  ctx.drawImage(c.c, c.bx, c.by, c.bw, c.bh);
};
var hcBaseGrid = drawGrid;
drawGrid = function (dt, now) {
  HC.frame++;
  var sig = hcSig(); if (sig !== HC.sig) { hcClear(); HC.sig = sig; }
  /* 弱机隔两帧：最近几帧舞台绘制仍很慢时，把重画间隔拉长 */
  HC.every = (typeof perfDraw !== 'undefined' && perfDraw > 28) ? 3 : 2;
  return hcBaseGrid.apply(this, arguments);
};
var hcBaseLayout = layout;
layout = function () { var r = hcBaseLayout.apply(this, arguments); HC.sig = ''; return r; };
document.addEventListener('visibilitychange', function () { if (document.hidden) hcClear(); });
try { window.__headCache = { get stats() { var n = 0, px = 0; heads.forEach(function (h) { if (h._hc) { n++; px += h._hc.c.width * h._hc.c.height; } }); return { on: HC.on, every: HC.every, entries: n, MB: Math.round(px * 4 / 104857.6) / 10, blit: HC.stats.blit, render: HC.stats.render, live: HC.stats.live }; }, set on(v) { HC.on = !!v; if (!v) hcClear(); } }; } catch (e) {}
