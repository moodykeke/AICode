/* 趣像 06 (r20): 触感设计——把"看"变成"摸得到"
   设计意图：指针（手指）不只是光标，而是一盏提灯、一阵风、一颗投进池子的石子。
   五个动作各自独立、都不打断已有交互（拖动转身、长按开卡、双击收藏、动作键）：

   提灯    指针带一团会呼吸的暖光，走到哪儿把哪儿照亮（暗纸上尤其好看）。
   轻触    点一位角色：眨眼＋笑一下＋颔首；害羞的会脸红，快活的会笑得更开。
   抚过    快速划过：一串角色顺着你的方向依次倾倒再弹回，像风过麦田，身后留一道风痕。
   点水    点空白纸面：手绘质感的涟漪荡开，波到谁，谁轻轻颔首。
   凝视    指针停在同一张脸上约三秒：它注意到你了——抬眼、浮出一个小符号、一声轻铃。
   按住    按住一位角色：它自己的时间慢下来（呼吸变深、闭嘴屏息），周围也一起放缓。

   约束：系统"减少动态效果"时只保留轻触回应与提灯；不与 finales（SUPER）、绘制笔刷（BRUSH）、
   天演（breedFrom）、拖拽转身争抢事件；全部走既有的 tone/SFX/allow 音频助手与 reduceMotion() 判断。 */

var FEEL = {
  timeScale: 1, slowTarget: 1, hold: null,
  ripples: [], trail: [], watchHead: null, watchSince: 0, noticeUntil: {},
  last: { x: 0, y: 0, t: 0 },
};

/* 调试出口：heads 会在 layout 时重建，故用 getter 始终读当前值 */
try {
  window.__feel = FEEL;
  Object.defineProperty(window, '__heads', { get: function () { return heads; } });
  window.__feelProbe = function (x, y) { return { head: !!headAt(x, y), busy: feelBusy(), reduce: feelReduce(), card: !!cardOpen }; };
} catch (e) {}
function feelReduce() { return (typeof reduceMotion === 'function') ? reduceMotion() : false; }
function feelBusy() { return !!drag || !!BRUSH || !!SUPER || !!cardOpen; }
function feelState(h) {
  if (!h.__feel) h.__feel = { x: 0, vx: 0, y: 0, vy: 0, r: 0, rv: 0, applied: 0, pat: 0, notice: 0 };
  return h.__feel;
}
function feelImpulse(h, ix, iy, ir) {
  // 合影摆造型期间不收冲量：弹幕/音阶/点击都不该把队形弹歪（成片上会长出一片怪脖子）
  if (typeof PHOTO !== 'undefined' && PHOTO && PHOTO.active) return;
  FEEL.pulses = (FEEL.pulses || 0) + 1;
  var f = feelState(h);
  f.vx += ix; f.vy += iy; f.rv += (ir == null ? ix * 0.02 : ir);
  if (f.vx > 4) f.vx = 4; if (f.vx < -4) f.vx = -4;
}

/* ── ① 角色偏移：把触感叠在既有 update 之上（滚转单独记账，避免与基础回正打架）── */
var feelBaseUpdate = Head.prototype.update;
Head.prototype.update = function (dt, now, look) {
  var f = this.__feel;

  if (f) {
    var roll0 = this.roll - f.applied;                 // 还原上帧我加的那一份
    this.roll = roll0;
    f.vx += (-f.x * 30 - f.vx * 5.4) * dt; f.x += f.vx * dt;
    f.vy += (-f.y * 34 - f.vy * 5.8) * dt; f.y += f.vy * dt;
    f.rv += (-f.r * 26 - f.rv * 5.0) * dt; f.r += f.rv * dt;
  }
  var slowHold = (FEEL.hold === this && !feelReduce());
  var o = feelBaseUpdate.call(this, dt * (slowHold ? 0.45 : 1), now, look);
  if (f) {
    this.roll += f.r; f.applied = f.r;
    o.ox += f.x * this.s * 0.55; o.oy += f.y * this.s * 0.55;
    if (f.pat > 0) {                                   // 轻触回应
      f.pat = Math.max(0, f.pat - dt * 1.5);
      o.smile = Math.max(o.smile, 0.42 + 0.28 * f.pat);
      o.eye = Math.max(o.eye, f.pat > 0.45 ? 1 : 0);
      var tame = this.g.temper;
      if (tame === 'timid' || tame === 'aloof') o.flush = Math.max(o.flush || 0, f.pat * 0.7);
      if (tame === 'fiery') o.brow = Math.max(o.brow || 0, f.pat * 0.8);
    }
    if (f.notice > 0) {                                // 凝视回应
      f.notice = Math.max(0, f.notice - dt);
      o.brow = Math.max(o.brow || 0, Math.min(1, f.notice) * 0.7);
    }
    if (slowHold) { o.mouth = 0; o.brow = Math.max(o.brow || 0, 0.25); }
  }
  return o;
};

/* ── ② 轻触：点一位角色（沿用既有"旋转"手感，再叠一次回应）── */
function feelPat(h) {
  if (!h) return;
  var f = feelState(h);
  f.pat = 1;
  feelImpulse(h, 0, -1.9, 0);                          // 弹起来（脖子会跟着伸长）
  if (typeof SOUND !== 'undefined' && SOUND && allow('feelPat', 90, 3)) {
    // 轻触也按当前音色回一声（音高取该角色在音阶格子里的音，招呼与弹奏同调）
    if (typeof playNote === 'function' && typeof scaleSlot === 'function') playNote(pitchAt(scaleSlot(h)), panOf(h), 0.07);
    else tone({ f: 620 + Math.random() * 180, f2: 320, dur: 0.16, gain: 0.05, type: 'triangle', pan: panOf(h) });
  }
  if (navigator.vibrate && typeof SOUND !== 'undefined' && SOUND) { try { navigator.vibrate(8); } catch (e) {} }
}
/* 轻触判定自己记账：既有 pointerup 早在本文件之前就注册好了，包 endDrag 不会被调用 */
cv.addEventListener('pointerdown', function (e) {
  if (BRUSH || SUPER || cardOpen || breedFrom) { FEEL.tap = null; return; }
  var p = local(e), h = headAt(p.x, p.y);
  FEEL.tap = h ? { h: h, x: p.x, y: p.y, moved: 0, t: performance.now() } : null;
}, { passive: true });
cv.addEventListener('pointermove', function (e) {
  if (!FEEL.tap) return;
  var p = local(e);
  FEEL.tap.moved += Math.abs(p.x - FEEL.tap.x) + Math.abs(p.y - FEEL.tap.y);
  FEEL.tap.x = p.x; FEEL.tap.y = p.y;
}, { passive: true });
cv.addEventListener('pointerup', function () {
  var t = FEEL.tap; FEEL.tap = null;
  if (!t) return;
  var held = performance.now() - t.t;
  if (t.moved < 6 && held < 520) feelPat(t.h);        // 短按＝招呼；长按交给既有的开卡
});

/* ── ③ 按住：这一位的时间慢下来 ── */
cv.addEventListener('pointerdown', function (e) {
  // 注意：按在角色上时既有逻辑会立刻置 drag，故这里只排除笔刷/终章/开卡
  if (feelReduce() || BRUSH || SUPER || cardOpen) return;
  if (e.pointerType === 'touch' && e.button !== 0 && e.buttons === 0) return;   // 触屏长按另有开卡，交给既有逻辑
  var p = local(e), h = headAt(p.x, p.y);
  if (!h) return;
  FEEL.hold = h; FEEL.slowTarget = 0.42;
  if (e.pointerType === 'touch') FEEL.holdFrom = 'touch';
}, { passive: true });
document.addEventListener('pointerup', function () {
  FEEL.hold = null; FEEL.slowTarget = 1;
  if (typeof cardOpen !== 'undefined' && cardOpen) FEEL.timeScale = 1;   // 长按开卡时直接归位
}, { passive: true });

/* ── ④ 抚过：快速划过 → 一串角色顺着你的方向倾倒（风过麦田）＋风痕 ── */
var feelPos = { x: 0, y: 0, t: 0 };
cv.addEventListener('pointermove', function (e) {
  var p = local(e), now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  var dt = Math.max(0.008, (now - feelPos.t) / 1000);
  var vx = (p.x - feelPos.x) / dt, vy = (p.y - feelPos.y) / dt;
  var sp = Math.hypot(vx, vy);
  if (feelPos.t) { FEEL.last.x = p.x; FEEL.last.y = p.y; FEEL.last.t = now; }
  feelPos.x = p.x; feelPos.y = p.y; feelPos.t = now;
  if (feelReduce() || drag || BRUSH || SUPER || cardOpen) return;
  if (e.pointerType === 'touch' && e.buttons === 0 && sp < 160) return;
  // 慢划＝在水里拖手指：一路留下小小的水滴涟漪（密排舞台上"点空白"几乎无处可点）
  if (sp < 620 && sp > 40 && !e.buttons) {
    var movedFar = !FEEL.dropAt || Math.hypot(p.x - FEEL.dropAt.x, p.y - FEEL.dropAt.y) > 46;
    if (movedFar && now - (FEEL.dropT || 0) > 460) {
      FEEL.dropT = now; FEEL.dropAt = { x: p.x, y: p.y };
      FEEL.ripples.push({ x: p.x, y: p.y, r: 4, t0: now, hit: [], soft: true });
      if (FEEL.ripples.length > 3) FEEL.ripples.shift();
      FEEL.drops = (FEEL.drops || 0) + 1;
    }
  }
  if (sp > 620) {                                      // 起风的阈值：太快才成浪，免得处处乱动
    var reach = 150 + Math.min(120, sp * 0.06), power = Math.min(1.5, sp / 1400);
    for (var i = 0; i < heads.length; i++) {
      var h = heads[i], dx = h.x - p.x, dy = (h.y - h.s * 0.2) - p.y, d = Math.hypot(dx, dy);
      if (d > reach) continue;
      var fall = Math.pow(1 - d / reach, 1.6);
      feelImpulse(h, vx / 900 * power * fall, vy / 1400 * power * fall * 0.5, dx / 900 * power * fall);
    }
    FEEL.trail.push({ x: p.x, y: p.y, t: now });
    if (FEEL.trail.length > 14) FEEL.trail.shift();
  }
});

/* ── ⑤ 点水：点空白纸面 → 手绘涟漪，波到谁谁颔首 ── */
cv.addEventListener('pointerdown', function (e) {
  if (feelReduce() || feelBusy()) return;
  var p = local(e);
  if (headAt(p.x, p.y)) return;                        // 点在角色身上交给既有交互
  FEEL.ripples.push({ x: p.x, y: p.y, r: 6, t0: performance.now(), hit: [] });
  FEEL.drops = (FEEL.drops || 0) + 1;
  if (FEEL.ripples.length > 4) FEEL.ripples.shift();
  if (typeof SOUND !== 'undefined' && SOUND && allow('feelDrop', 160, 2)) {
    tone({ f: 300, f2: 120, dur: 0.28, gain: 0.05, type: 'sine', pan: panOf({ x: p.x }) });
  }
}, { passive: true });

/* ── ⑥ 凝视：停在同一张脸上 → 它注意到你 ── */
function feelNotice(h, now) {
  var f = feelState(h);
  f.notice = 1.8;
  feelImpulse(h, 0, -0.6, 0);
  FEEL.noticeUntil[h.code] = now + 12000;
  FEEL.glyphs = FEEL.glyphs || [];
  FEEL.glyphs.push({ h: h, t0: now, kind: ['♥', '✦', '♪', '?'][(h.g.seed >>> 3) % 4] });
  if (typeof SOUND !== 'undefined' && SOUND && allow('feelNotice', 400, 2)) {
    var p = panOf(h);
    tone({ f: 880, dur: 0.5, gain: 0.035, type: 'sine', pan: p });
    tone({ f: 1320, dur: 0.4, gain: 0.02, type: 'sine', pan: p, when: 0.08 });
  }
}

/* ── ⑦ 覆盖层：提灯、涟漪、风痕、浮起的符号、慢镜头与凝视判定 ── */
var feelDrawGrid = drawGrid;
drawGrid = function (dt, now) {
  FEEL.timeScale += (FEEL.slowTarget - FEEL.timeScale) * Math.min(1, dt * 6);
  var out = feelDrawGrid.call(this, dt * FEEL.timeScale, now);
  if (typeof ctx === 'undefined' || !heads.length) return out;

  // 凝视判定：指针停住且停在同一张脸上
  if (hovered && !drag && !feelBusy() && pointer.inside) {
    var still = (now - pointer.last) / 1000;
    if (FEEL.watchHead !== hovered) { FEEL.watchHead = hovered; FEEL.watchSince = now; }
    else if (!feelReduce() && still > 0.25 && now - FEEL.watchSince > 2600 && !(FEEL.noticeUntil[hovered.code] > now)) {
      feelNotice(hovered, now);
      FEEL.watchSince = now + 1e9;                     // 一次凝视只回应一次
    }
  } else { FEEL.watchHead = null; }

  var TAU2 = Math.PI * 2, t = now / 1000;

  // 提灯：一团会呼吸的暖光
  if (pointer.inside && !feelReduce()) {
    var breathe = 0.86 + 0.14 * Math.sin(t * 1.1);
    var R = (150 + 34 * Math.sin(t * 0.6)) * (FEEL.hold ? 1.25 : 1);
    var g2 = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, R);
    g2.addColorStop(0, 'rgba(255,228,168,' + (0.13 * breathe).toFixed(3) + ')');
    g2.addColorStop(0.45, 'rgba(255,228,168,' + (0.05 * breathe).toFixed(3) + ')');
    g2.addColorStop(1, 'rgba(255,228,168,0)');
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(pointer.x, pointer.y, R, 0, TAU2); ctx.fill();
    ctx.restore();
  }

  // 点水涟漪：手绘双环，波到谁谁颔首一次
  for (var i = FEEL.ripples.length - 1; i >= 0; i--) {
    var rp = FEEL.ripples[i];
    rp.r += dt * (rp.soft ? 190 : 300);
    var life = 1 - (now - rp.t0) / (rp.soft ? 2600 : 2200);
    if (life <= 0 || rp.r > Math.max(W, H) * 0.8) { FEEL.ripples.splice(i, 1); continue; }
    // 淡入 → 淡出：圈刚落下时几乎看不见，随后浮出来再散掉
    var grow = 1 - life;
    var fade = Math.min(1, grow / 0.18) * Math.min(1, life / 0.55);
    ctx.save();
    ctx.globalAlpha = fade * 0.30;
    stroke(ring(rp.x, rp.y, rp.r, rp.r * 0.52, 46), { close: true, w: 1.05, jit: 1.1, seed: (rp.t0 | 0) % 997 });
    ctx.globalAlpha = fade * 0.13;
    stroke(ring(rp.x, rp.y, rp.r * 0.68, rp.r * 0.34, 40), { close: true, w: 0.8, jit: 1.2, seed: (rp.t0 | 0) % 811 });
    ctx.restore();
    if (!feelReduce()) {
      for (var k = 0; k < heads.length; k++) {
        var hh = heads[k];
        if (rp.hit.indexOf(hh) >= 0) continue;
        var dd = Math.hypot(hh.x - rp.x, (hh.y - hh.s * 0.2) - rp.y);
        if (dd <= rp.r && dd > rp.r - (rp.soft ? 64 : 46)) {
          rp.hit.push(hh);
          var nx = (hh.x - rp.x) / Math.max(1, dd), ny = ((hh.y - hh.s * 0.2) - rp.y) / Math.max(1, dd);
          feelImpulse(hh, nx * 0.55, -0.75 - Math.abs(ny) * 0.2, nx * 0.05);
        }
      }
    }
  }

  // 风痕：一串渐隐的短线，像草叶刚被拂过
  if (FEEL.trail.length > 1) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    for (var q = 1; q < FEEL.trail.length; q++) {
      var a = FEEL.trail[q - 1], b = FEEL.trail[q];
      var age = (now - b.t) / 420;
      if (age > 1) continue;
      ctx.globalAlpha = (1 - age) * 0.3;
      stroke([[a.x, a.y], [b.x, b.y]], { w: 1.1, jit: 0.9, seed: q * 37 });
    }
    ctx.restore();
    while (FEEL.trail.length && (now - FEEL.trail[0].t) / 420 > 1) FEEL.trail.shift();
  }

  // 凝视浮起的符号：缓缓上升、淡出
  if (FEEL.glyphs && FEEL.glyphs.length) {
    for (var gi = FEEL.glyphs.length - 1; gi >= 0; gi--) {
      var gl = FEEL.glyphs[gi], age2 = (now - gl.t0) / 1600;
      if (age2 >= 1) { FEEL.glyphs.splice(gi, 1); continue; }
      var hx = gl.h.x, hy = gl.h.y - gl.h.s * (1.5 + age2 * 0.9);
      ctx.save();
      ctx.globalAlpha = (1 - age2) * 0.85;
      ctx.fillStyle = window.INK || '#2a2420';
      ctx.font = (13 * (window.DPR || 1)) + 'px "Noto Serif SC", "STSong", serif';
      ctx.textAlign = 'center';
      ctx.fillText(gl.kind, hx, hy);
      ctx.restore();
    }
  }
  return out;
};

/* ── ⑧ 手势提示：只在帮助面板里说一次，不打扰画面 ── */
(function feelHint() {
  try {
    if (localStorage.getItem('quxiang.feelHint')) return;
    localStorage.setItem('quxiang.feelHint', '1');
  } catch (e) { return; }
  setTimeout(function () {
    if (typeof toast !== 'function') return;
    var en = (typeof UI_LANG !== 'undefined' && UI_LANG === 'en');
    toast(en ? 'It is tactile now: tap to greet · sweep to make a wave · tap the paper for ripples · hold to slow down · stare and someone notices.'
             : '现在可以摸：轻触打招呼 · 快划成浪 · 慢划起涟漪 · 按住慢下来 · 盯着谁，谁会注意到你', 6800);
  }, 2600);
})();
