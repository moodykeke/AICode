/* 趣像 23 (r46): 省电模式与无障碍（《界面与键位-高观点改造方案-r43》P3）
   ─────────────────────────────────────────────────────────────
   省电模式（设置 → 省电模式：自动 / 开 / 关）
     开：舞台按 1 倍分辨率画；每秒约 30 帧；没人碰、也没有动作在演的时候降到约 12 帧（头照样会轻轻晃，只是更省）。
     自动：电池低于 25% 且没在充电，或系统"省流量"打开时自动开；r43 的弱机降分辨率照常叠加。
   无障碍
     · 舞台是一张会动的画：给它一个随阵容更新的说明（"舞台：7×5，35 位角色：人类 8、猫 5……"）；
     · 屏幕阅读器能听到所有提示（toast 同步进一个隐藏的 aria-live 区域）；
     · 键盘可以走到舞台（Tab 顺序里有它），方向键在脸之间移动一个焦点圈，Enter 打开这张脸的卡片，空格照旧"看镜头"；
     · 生态缸、天灾、礼花等新动画都走"减少动态效果"。 */

/* ========== 省电 ========== */
var POWER = { on: false, why: '', skip: 0, battery: null };
function powerWanted() {
  var m = CFG.power || 'auto';
  if (m === 'on') return 'setting'; if (m === 'off') return '';
  if (POWER.battery && !POWER.battery.charging && POWER.battery.level < .25) return 'battery';
  try { if (navigator.connection && navigator.connection.saveData) return 'saveData'; } catch (e) {}
  return '';
}
function powerApply() {
  var why = powerWanted(), on = !!why;
  if (on === POWER.on && why === POWER.why) return;
  POWER.on = on; POWER.why = why;
  document.documentElement.classList.toggle('qx-power', on);
  try { layout(); } catch (e) {}
}
/* 分辨率：省电时 1 倍 */
var powerBaseLayout = layout;
layout = function () {
  var saved = typeof QX_DPR_SCALE === 'number' ? QX_DPR_SCALE : 1;
  if (POWER.on) QX_DPR_SCALE = .01;                      // build.cjs 的 DPR 公式里会夹到 1
  try { return powerBaseLayout.apply(this, arguments); } finally { if (POWER.on) QX_DPR_SCALE = saved; }
};
function powerIdle() {
  if (pointer.inside && performance.now() - pointer.last < 6000) return false;
  if (SUPER || cardOpen || (typeof PHOTO !== 'undefined' && PHOTO.active) || (typeof EVO !== 'undefined' && EVO.on)) return false;
  if (typeof FUN !== 'undefined' && (FUN.ff || FUN.dance || FUN.bubbles.length || FUN.parts.length)) return false;
  if (particles.length) return false;
  for (var i = 0; i < heads.length; i++) { var a = heads[i].acts; if (a && a.length) return false; if (heads[i].spinning) return false; }
  return true;
}
var powerBaseThrottle = autoThrottle;
autoThrottle = function () {
  if (powerBaseThrottle.apply(this, arguments)) return true;
  if (!POWER.on) return false;
  POWER.skip = (POWER.skip + 1) % 60;
  if (powerIdle()) return POWER.skip % 5 !== 0;          // 约 12 帧
  return POWER.skip % 2 !== 0;                          // 约 30 帧
};
(function powerInit() {
  try { if (navigator.getBattery) navigator.getBattery().then(function (b) { POWER.battery = b; powerApply(); b.addEventListener('levelchange', powerApply); b.addEventListener('chargingchange', powerApply); }); } catch (e) {}
  var grp = null;
  PANEL.forEach(function (G) { if ((G.items || []).some(function (it) { return it.id === 'reduce'; })) grp = G; });
  if (grp) {
    var at = grp.items.findIndex(function (it) { return it.id === 'reduce'; });
    grp.items.splice(at + 1, 0, { id: 'power', label: '省电模式', type: 'seg', opts: [['auto', '自动'], ['on', '开'], ['off', '关']] });
  }
  UI_PAIRS.push(['省电模式', 'Power saving'], ['自动', 'Auto'], ['开', 'On'], ['关', 'Off']);
  var baseSet = setCfg;
  setCfg = function (id) { var r = baseSet.apply(this, arguments); if (id === 'power') { powerApply(); toast(POWER.on ? qxLocal('省电模式开：1 倍分辨率、约 30 帧，闲着时更省。', 'Power saving on: 1× resolution, ~30 fps, less when idle.') : qxLocal('省电模式关。', 'Power saving off.'), 2200); } return r; };
  powerApply();
})();

/* ========== 无障碍 ========== */
(function a11y() {
  var live = document.createElement('div'); live.id = 'qxLive'; live.setAttribute('aria-live', 'polite'); live.setAttribute('role', 'status');
  live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;left:-9999px';
  document.body.appendChild(live);
  var baseToast = toast;
  toast = function (msg) { var r = baseToast.apply(this, arguments); try { live.textContent = ''; setTimeout(function () { live.textContent = String(msg || ''); }, 30); } catch (e) {} return r; };
  cv.setAttribute('tabindex', '0'); cv.setAttribute('role', 'img');
  var describe = function () {
    var n = {}, order = [];
    heads.forEach(function (h) { if (h.hidden) return; var k = (typeof QX_PACKS !== 'undefined' ? QX_PACKS.short(h.g.sp) : h.g.sp); if (!n[k]) { n[k] = 0; order.push(k); } n[k]++; });
    order.sort(function (a, b) { return n[b] - n[a]; });
    var en = typeof UI_LANG !== 'undefined' && UI_LANG === 'en', total = order.reduce(function (s, k) { return s + n[k]; }, 0);
    var list = order.slice(0, 6).map(function (k) { return k + ' ' + n[k]; }).join(en ? ', ' : '、') + (order.length > 6 ? (en ? '…' : '……') : '');
    cv.setAttribute('aria-label', en ? 'Stage: ' + cols + '×' + rows + ', ' + total + ' characters: ' + list + '. Arrow keys move between faces, Enter opens a card.'
      : '舞台：' + cols + '×' + rows + '，' + total + ' 位角色：' + list + '。方向键在脸之间移动，Enter 打开卡片。');
  };
  var t = 0; var later = function () { clearTimeout(t); t = setTimeout(describe, 400); };
  var baseLayout2 = layout; layout = function () { var r = baseLayout2.apply(this, arguments); later(); return r; };
  var baseSet2 = Head.prototype.setDNA; Head.prototype.setDNA = function () { var r = baseSet2.apply(this, arguments); later(); return r; };
  later();
  /* 键盘焦点圈 */
  var F = { i: -1 };
  window.__a11yFocus = F;
  cv.addEventListener('focus', function () { if (F.i < 0) F.i = 0; });
  cv.addEventListener('blur', function () { F.i = -1; });
  window.addEventListener('keydown', function (e) {
    if (document.activeElement !== cv || F.i < 0 || cardOpen || e.ctrlKey || e.metaKey || e.altKey) return;
    var c = F.i % cols, r = Math.floor(F.i / cols), moved = true;
    if (e.key === 'ArrowLeft') c = (c + cols - 1) % cols; else if (e.key === 'ArrowRight') c = (c + 1) % cols;
    else if (e.key === 'ArrowUp') r = (r + rows - 1) % rows; else if (e.key === 'ArrowDown') r = (r + 1) % rows;
    else if (e.key === 'Enter') { var h = heads[F.i]; if (h && !h.hidden) { e.preventDefault(); e.stopImmediatePropagation(); openCard(h); } return; }
    else moved = false;
    if (!moved) return;
    e.preventDefault();
    F.i = r * cols + c; var hh = heads[F.i];
    if (hh) { pointer.x = hh.x; pointer.y = hh.y - hh.s * .2; pointer.inside = true; pointer.last = performance.now(); hovered = hh;
      try { live.textContent = hh.hidden ? qxLocal('空格子', 'empty cell') : hh.id().name + ' · ' + hh.id().species; } catch (e2) {} }
  }, true);
  var baseGrid = drawGrid;
  drawGrid = function (dt, now) {
    var r = baseGrid.apply(this, arguments);
    if (F.i < 0 || document.activeElement !== cv) return r;
    var h = heads[F.i]; if (!h) return r;
    try { ctx = gctx; ctx.save(); ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.strokeStyle = '#c2412d'; ctx.lineWidth = 2.5; ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.arc(h.x, h.y, h.s * 1.25, 0, TAU); ctx.stroke(); ctx.restore(); } catch (e) { try { ctx.restore(); } catch (e2) {} }
    return r;
  };
  var st = document.createElement('style');
  st.textContent = '#c:focus{outline:none}#c:focus-visible{outline:2px solid #c2412d;outline-offset:-3px}' +
    '@media(prefers-reduced-motion:reduce){#toolDeck{transition:none}}';
  document.head.appendChild(st);
})();
try { window.__power = { get state() { return { on: POWER.on, why: POWER.why, dpr: DPR }; }, apply: powerApply }; } catch (e) {}
