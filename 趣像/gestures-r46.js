/* 趣像 23 (r46): 触屏手势收敛（《界面与键位-高观点改造方案-r43》P2）
   ─────────────────────────────────────────────────────────────
   以前同一根手指有六种含义：轻触＝招呼、快划＝浪、慢划＝涟漪、按住＝慢放、再久＝开卡、拖动＝转头。
   在手机上"拖动转头"和"快划成浪"抢同一个动作——按在脸上划，永远只转头、起不了浪；"按住慢放"又和"长按开卡"叠在一起。
   现在触屏只有四种，每种一个意思：
     轻触        打招呼（点头、眨眼，顺手转一圈）
     长按        开卡片
     单指划      起浪（按在脸上划也一样：一动超过 12px 就放下这张脸，交给"风过麦田"）
     双指        转头（两指左右挪＝转、上下挪＝点头；落在谁身上转谁）
   "按住慢放"在触屏上取消（鼠标仍保留）；慢划涟漪在触屏上本来就不触发。只处理 pointerType === 'touch'，鼠标与笔不变。 */

var GEST = { pts: {}, n: 0, two: null };
function gestLocal(e) { var r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
window.addEventListener('pointerdown', function (e) {
  if (e.pointerType !== 'touch' || e.target !== cv) return;
  var p = gestLocal(e);
  GEST.pts[e.pointerId] = { x: p.x, y: p.y, x0: p.x, y0: p.y };
  GEST.n = Object.keys(GEST.pts).length;
  if (GEST.n === 2 && !SUPER && !BRUSH && !cardOpen && !(typeof EVO !== 'undefined' && EVO.on)) {
    /* 第二根手指落下：进入双指转头；把第一根手指可能开始的"按住开卡/拖动"取消掉 */
    var ids = Object.keys(GEST.pts), a = GEST.pts[ids[0]], b = GEST.pts[ids[1]];
    var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, h = headAt(a.x, a.y) || headAt(mx, my);
    clearTimeout(pressTimer);
    if (drag) { drag.head.dragging = false; drag = null; }
    if (h) { h.dragging = true; h.spinning = false; userTakeover(h); }
    GEST.two = { h: h, mx: mx, my: my };
    e.stopImmediatePropagation();
  }
}, true);
window.addEventListener('pointermove', function (e) {
  if (e.pointerType !== 'touch') return;
  var P = GEST.pts[e.pointerId]; if (!P) return;
  var p = gestLocal(e); P.x = p.x; P.y = p.y;
  if (GEST.two) {
    var ids = Object.keys(GEST.pts); if (ids.length < 2) return;
    var a = GEST.pts[ids[0]], b = GEST.pts[ids[1]], mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, T = GEST.two;
    if (T.h) { T.h.yaw += (mx - T.mx) * .016; T.h.pitch = clamp(T.h.pitch + (my - T.my) * .007, -.45, .5); }
    T.mx = mx; T.my = my;
    e.stopImmediatePropagation();
    return;
  }
  /* 单指：按在脸上一划超过 12px，就放下这张脸，让它成为一阵风 */
  if (drag && Math.hypot(p.x - P.x0, p.y - P.y0) > 12 && !breedFrom) {
    clearTimeout(pressTimer);
    drag.head.dragging = false; drag = null;
  }
  /* 手机屏小，手指划得没鼠标快：300–620px/s 这一段由这里补上"风过麦田"（更快的交给 touch-feel） */
  var now = performance.now(), dt = Math.max(.008, (now - (P.t || now - 16)) / 1000), vx = (p.x - (P.px == null ? P.x0 : P.px)) / dt, vy = (p.y - (P.py == null ? P.y0 : P.py)) / dt, sp = Math.hypot(vx, vy);
  P.px = p.x; P.py = p.y; P.t = now;
  if (!drag && sp > 300 && sp <= 620 && !SUPER && !BRUSH && !cardOpen && !(typeof EVO !== 'undefined' && EVO.on) && typeof feelImpulse === 'function' && !(typeof feelReduce === 'function' && feelReduce())) {
    var reach = 130, power = Math.min(1, sp / 900);
    for (var i = 0; i < heads.length; i++) {
      var h = heads[i], dx = h.x - p.x, dy = (h.y - h.s * .2) - p.y, d = Math.hypot(dx, dy); if (d > reach) continue;
      var fall = Math.pow(1 - d / reach, 1.6);
      feelImpulse(h, vx / 700 * power * fall, vy / 1100 * power * fall * .5, dx / 700 * power * fall);
    }
    FEEL.trail.push({ x: p.x, y: p.y, t: now }); if (FEEL.trail.length > 14) FEEL.trail.shift();
  }
}, true);
function gestUp(e) {
  if (e.pointerType !== 'touch') return;
  delete GEST.pts[e.pointerId];
  GEST.n = Object.keys(GEST.pts).length;
  if (GEST.two) {
    if (GEST.n === 0) { if (GEST.two.h) GEST.two.h.dragging = false; GEST.two = null; }
    e.stopImmediatePropagation();
  }
}
window.addEventListener('pointerup', gestUp, true);
window.addEventListener('pointercancel', gestUp, true);
/* 触屏上"按住慢放"取消：touch-feel 的按住监听先跑，这里随后把它复位 */
cv.addEventListener('pointerdown', function (e) {
  if (e.pointerType === 'touch' && typeof FEEL !== 'undefined') { FEEL.hold = null; FEEL.slowTarget = 1; }
}, { passive: true });
try { cv.style.touchAction = 'none'; } catch (e) {}
try { window.__gest = { get state() { return { touches: GEST.n, two: !!GEST.two, head: GEST.two && GEST.two.h ? GEST.two.h.col + ',' + GEST.two.h.row : null }; } }; } catch (e) {}
