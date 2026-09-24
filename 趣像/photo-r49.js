/* 趣像 26 (r49): 大合影第三期——配置、动态入场、更多队形、烟花；修"连拍越拍越小"
   ─────────────────────────────────────────────────────────────
   修复  连续点"大合照"时，人物越来越小：新一张照片按"当前的头"定尺寸，而上一张的队形还没散（头已缩小）——
         越叠越小。现在：①拍摄中再按不响应；②队形一律按"回到格子里时的尺寸"计算；③表演条菜单里的按钮
         以前直接绑着最早的函数，绕过了倒数/拍照瞬间，现改为走完整流程。
   配置  "合影设置"面板（表演条"更多动作 → 合影"、暗房里、手机长按"拍"）：队形 / 入场动态 / 拍照瞬间 / 烟花 / 倒数 / 相框，
         选完直接"拍一张"。同样的选项也在设置面板的"合影"组里。
   入场动态（摆队形之前先闹一会儿，约 2 秒）
     追赶      排成一串绕着舞台跑圈，一个追一个，边跑边蹦
     乱跑      各自冲向两个随机的地方，忽大忽小、东倒西歪
     跳跳      原地连跳，落地压扁、起跳拉长，一边跳一边往中间凑
     忽大忽小  一波一波地缩小又鼓起（像呼吸，也像吹气球）
     人浪      从左到右掀起两道人浪
   新队形  自拍（一位举着"手机"凑到镜头前，其余挤在后面探头）/ 靠头（挤成一团、头都歪向中间）/
           高矮排（从小到大排一排，按脚底对齐）/ C 位（中间最大、两边渐小的 V 字）/ 阶梯（一排比一排高、往右错开）
   烟花    可选：开 / 关 / 随机。快门前几百毫秒升空，快门那一刻正好在头顶绽开（画在人物后面，成片里有）。 */

/* ========== 一、尺寸按"格子里"的算；拍摄中不重复开拍 ========== */
var P49 = { prelude: null, fw: [], fwOn: false };
var p49BaseLayout = layout;
layout = function () { var r = p49BaseLayout.apply(this, arguments); heads.forEach(function (h) { h._home = { x: h.x, y: h.y, s: h.s }; }); return r; };
heads.forEach(function (h) { h._home = { x: h.x, y: h.y, s: h.s }; });
var p49BasePose = photoPose;
photoPose = function (style) {
  var saved = heads.map(function (h) { return h.s; });
  heads.forEach(function (h) { if (h._home) h.s = h._home.s; });
  try {
    if (P49_STYLES[style]) return P49_STYLES[style]();
    return p49BasePose.apply(this, arguments);
  } finally { heads.forEach(function (h, i) { h.s = saved[i]; }); }
};

/* ========== 二、新队形 ========== */
function p49List() { return heads.filter(function (h) { return !h.hidden; }); }
function p49Base(list) { var s = 0; list.forEach(function (h) { s += h.s; }); return list.length ? s / list.length : 40; }
function p49Clamp(out) { out.forEach(function (o) { var pad = o.s * .9; o.x = Math.max(pad, Math.min(W - pad, o.x)); o.y = Math.max(pad * .8, Math.min(H - pad * .5, o.y)); }); return out; }
var P49_STYLES = {
  selfie: function () {
    var list = p49List().sort(function () { return Math.random() - .5; }), n = list.length, b = p49Base(list), out = [];
    var me = list[0];
    out.push({ h: me, x: W * .30, y: H * .74, s: b * 2.1, roll: .16 });
    var rest = list.slice(1), perRow = Math.max(4, Math.ceil(Math.sqrt(rest.length * 2.2))), rowsN = Math.ceil(rest.length / perRow);
    rest.forEach(function (h, i) {
      var r = Math.floor(i / perRow), c = i % perRow, inRow = Math.min(perRow, rest.length - r * perRow);
      var depth = r / Math.max(1, rowsN - 1), sz = b * (1.02 - depth * .3);
      out.push({ h: h, x: W * .50 + (c - (inRow - 1) / 2) * sz * 1.02 + (r % 2) * sz * .4, y: H * .58 - r * sz * 1.0, s: sz, roll: (Math.random() - .5) * .3 - .08 });
    });
    return p49Clamp(out);
  },
  huddle: function () {
    var list = p49List(), n = list.length, b = p49Base(list), out = [], cx = W / 2, cy = H * .54;
    list.forEach(function (h, i) {
      var r = b * .95 * Math.sqrt(i + .3), a = i * 2.39996, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a) * .72;
      out.push({ h: h, x: x, y: y, s: b * (1.05 - .25 * Math.sqrt(i / n)), roll: clamp((cx - x) / (b * 6), -.35, .35) });
    });
    return p49Clamp(out);
  },
  tallshort: function () {
    var list = p49List().sort(function () { return Math.random() - .5; }), n = list.length, b = p49Base(list), out = [], foot = H * .78;
    var per = Math.min(n, 18), rowsN = Math.ceil(n / per);
    list.forEach(function (h, i) {
      var r = Math.floor(i / per), c = i % per, inRow = Math.min(per, n - r * per), k = inRow > 1 ? c / (inRow - 1) : .5;
      var sz = b * (.62 + k * .78) * (1 - r * .12), span = Math.min(W * .92, inRow * b * 1.15);
      var x = W / 2 - span / 2 + (c + .5) * span / inRow;
      out.push({ h: h, x: x, y: foot - r * b * 2.3 - sz * 1.2, s: sz, roll: (Math.random() - .5) * .06 });
    });
    return p49Clamp(out);
  },
  vshape: function () {
    var list = p49List().sort(function () { return Math.random() - .5; }), n = list.length, b = p49Base(list), out = [];
    list.forEach(function (h, i) {
      var side = i === 0 ? 0 : (i % 2 ? -1 : 1), step = Math.ceil(i / 2), perArm = Math.ceil((n - 1) / 2);
      var arm = Math.min(3, Math.ceil(n / 12)), lane = step % arm, pos = Math.ceil(step / arm);
      var sz = b * (1.55 - Math.min(.8, pos * .07));
      out.push({ h: h, x: W / 2 + side * (pos * b * 1.25 + lane * b * .6), y: H * .70 - pos * b * .42 - lane * b * 1.05, s: sz, roll: side * .06 });
    });
    return p49Clamp(out);
  },
  stairs: function () {
    var list = p49List(), n = list.length, b = p49Base(list), out = [], rowsN = n > 20 ? 4 : 3, per = Math.ceil(n / rowsN);
    list.forEach(function (h, i) {
      var r = Math.floor(i / per), c = i % per, inRow = Math.min(per, n - r * per);
      var sz = b * (1.1 - r * .08), span = Math.min(W * .7, inRow * sz * 1.2);
      out.push({ h: h, x: W * .44 + r * b * 1.1 - span / 2 + (c + .5) * span / inRow, y: H * .76 - r * b * 1.5, s: sz, roll: -.03 });
    });
    return p49Clamp(out);
  }
};
var P49_STYLE_NAMES = { selfie: ['自拍', 'Selfie'], huddle: ['靠头', 'Huddle'], tallshort: ['高矮排', 'Shortest to tallest'], vshape: ['C 位', 'Centre stage'], stairs: ['阶梯', 'Stairs'] };
Object.keys(P49_STYLE_NAMES).forEach(function (k) { PHOTO_STYLES.push(k); PHOTO_STYLE_ZH[k] = P49_STYLE_NAMES[k][0]; });

/* ========== 三、入场动态（摆队形前先闹一会儿） ========== */
var P49_DYN = { chase: ['追赶', 'Chase'], scramble: ['乱跑', 'Scramble'], hop: ['跳跳', 'Hop'], grow: ['忽大忽小', 'Grow & shrink'], wave: ['人浪', 'Wave'] };
['photoDyn', 'photoFirework'].forEach(function (k) { if (CFG_DEFAULT[k] == null) CFG_DEFAULT[k] = 'random'; if (CFG[k] == null) CFG[k] = CFG_DEFAULT[k]; if (SHARE_KEYS.indexOf(k) < 0) SHARE_KEYS.push(k); });
function p49PickDyn() {
  var v = String(CFG.photoDyn || 'random'); if (v === 'none') return null;
  if (P49_DYN[v]) return v;
  var ks = Object.keys(P49_DYN); return Math.random() < .8 ? ks[(Math.random() * ks.length) | 0] : null;
}
function p49Prelude(mode, done) {
  var list = p49List(), D = (reduceMotion() ? 900 : 2200) / Math.max(.5, CFG.speed || 1), t0 = performance.now(), cx = W / 2, cy = H * .52;
  var S = list.map(function (h, i) {
    var home = h._home || { x: h.x, y: h.y, s: h.s };
    return { h: h, x0: home.x, y0: home.y, s0: home.s, i: i, w1: [W * (.12 + Math.random() * .76), H * (.18 + Math.random() * .64)], w2: [W * (.12 + Math.random() * .76), H * (.18 + Math.random() * .64)], ph: Math.random() * TAU };
  });
  var n = list.length, RX = W * .36, RY = H * .30;
  P49.prelude = { mode: mode, t0: t0, D: D };
  if (SOUND) try { if (mode === 'hop') SFX.boingUp(0); else SFX.whoosh(0, .8); } catch (e) {}
  var step = function () {
    if (!P49.prelude) return;
    var now = performance.now(), u = Math.min(1, (now - t0) / D), soft = reduceMotion() ? .35 : 1;
    S.forEach(function (q) {
      var h = q.h, x = q.x0, y = q.y0, s = q.s0, roll = 0, k = q.i / Math.max(1, n - 1);
      if (mode === 'chase') {
        var a = u * TAU * 1.3 - k * TAU * .85, e = Math.min(1, u * 4);
        x = lerp(q.x0, cx + Math.cos(a) * RX, e); y = lerp(q.y0, cy + Math.sin(a) * RY, e) - Math.abs(Math.sin(now / 90 + q.ph)) * s * .35 * soft;
        roll = Math.sin(now / 90 + q.ph) * .12 * soft;
      } else if (mode === 'scramble') {
        var p = u < .45 ? u / .45 : (u - .45) / .55, A = u < .45 ? [q.x0, q.y0] : q.w1, B = u < .45 ? q.w1 : q.w2, e2 = smooth(p);
        x = lerp(A[0], B[0], e2); y = lerp(A[1], B[1], e2) - Math.sin(p * Math.PI) * s * .5 * soft;
        s = q.s0 * (1 + .35 * Math.sin(now / 160 + q.ph) * soft); roll = Math.sin(now / 120 + q.ph) * .25 * soft;
      } else if (mode === 'hop') {
        var hopT = (now - t0) / 330 + q.ph, jump = Math.abs(Math.sin(hopT * Math.PI)), e3 = smooth(u);
        x = lerp(q.x0, cx + (q.x0 - cx) * .55, e3); y = lerp(q.y0, cy + (q.y0 - cy) * .55, e3) - jump * s * .8 * soft;
        s = q.s0 * (1 + (jump - .5) * .16 * soft);
      } else if (mode === 'grow') {
        var w = Math.sin((u * 2.2 - k * .6) * Math.PI);
        s = q.s0 * (1 + .45 * w * soft); roll = w * .08 * soft;
      } else if (mode === 'wave') {
        var ph2 = u * 2.4 - (h.x / Math.max(1, W)) * 1.2, wv = Math.max(0, Math.sin(ph2 * Math.PI * 2)) * (ph2 > 0 && ph2 < 2 ? 1 : 0);
        y = q.y0 - wv * s * 1.1 * soft; s = q.s0 * (1 + wv * .15 * soft);
      }
      h.x = x; h.y = y; h.s = s; h.roll = roll;
    });
    if (u < 1) requestAnimationFrame(step);
    else { P49.prelude = null; done(); }
  };
  requestAnimationFrame(step);
  if (mode === 'chase' || mode === 'scramble') { var pat = setInterval(function () { if (!P49.prelude) { clearInterval(pat); return; } if (SOUND && allow('p49step', 60, 2)) try { tone({ f: 180 + Math.random() * 80, dur: .05, gain: .03, type: 'triangle' }); } catch (e) {} }, 110); }
  list.slice(0, Math.min(8, n)).forEach(function (h, i) { setTimeout(function () { if (P49.prelude) act(h, 'laugh'); }, i * 160); });
}

/* ========== 四、开拍：防重复、先闹后摆、烟花 ========== */
var p49BaseStart = photoStart;
photoStart = function () {
  if (PHOTO.active || P49.prelude) return;                       /* 拍摄中再按不响应——连拍越拍越小的根源 */
  if (typeof SUPER !== 'undefined' && SUPER) return;
  if (typeof cardOpen !== 'undefined' && cardOpen) return;
  if (typeof EVO !== 'undefined' && EVO.on) return p49BaseStart.apply(this, arguments);
  var classMode = typeof CLASS !== 'undefined' && CLASS && CLASS.active;
  var go = function () {
    p49BaseStart();
    if (!PHOTO.active) return;
    var fw = String(CFG.photoFirework || 'random');
    P49.fwOn = !classMode && (fw === 'on' || (fw === 'random' && Math.random() < .5));
    if (P49.fwOn) { p49Fireworks(PHOTO.shotAt); PHOTO.extraTop = Math.max(PHOTO.extraTop || 0, H * .26); }   /* 成片往上多留一截，把烟花框进来 */
  };
  var mode = classMode ? null : p49PickDyn();
  if (mode) { if (typeof toast === 'function') toast(evoLabelSafe(P49_DYN[mode]) + evoLSafe(' · 先闹一会儿……', ' · warming up…'), 1400); p49Prelude(mode, go); }
  else go();
};
function evoLSafe(zh, en) { return (typeof UI_LANG !== 'undefined' && UI_LANG === 'en') ? en : zh; }
function evoLabelSafe(pair) { return evoLSafe(pair[0], pair[1]); }

/* ========== 五、烟花（画在人物后面） ========== */
var P49_FW_COLS = ['#e36a5c', '#f0b13a', '#6fa8d6', '#8fc46c', '#c984d4', '#ffd98a'];
function p49Fireworks(shotAt) {
  var now = performance.now(), N = 5;
  for (var i = 0; i < N; i++) {
    var burstAt = shotAt - 380 + (i - N / 2) * 150 + Math.random() * 120, launch = burstAt - 750;
    P49.fw.push({ x: W * (.15 + .7 * (i + Math.random() * .6) / N), y0: H * 1.02, y1: H * (.12 + Math.random() * .18), launch: Math.max(now, launch), burst: Math.max(now + 200, burstAt), col: P49_FW_COLS[(Math.random() * P49_FW_COLS.length) | 0], col2: P49_FW_COLS[(Math.random() * P49_FW_COLS.length) | 0], parts: null, done: false });
  }
}
function p49DrawFireworks(now) {
  if (!P49.fw.length) return;
  P49.fw = P49.fw.filter(function (f) { return now < f.burst + 1800; });
  ctx.save();
  P49.fw.forEach(function (f) {
    if (now < f.launch) return;
    if (now < f.burst) {
      var k = (now - f.launch) / Math.max(1, f.burst - f.launch), y = lerp(f.y0, f.y1, 1 - Math.pow(1 - k, 2));
      ctx.globalAlpha = .9; ctx.strokeStyle = f.col; ctx.lineWidth = 2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(f.x, y); ctx.lineTo(f.x + Math.sin(k * 9) * 2, y + 26); ctx.stroke();
      ctx.fillStyle = '#fff6d0'; ctx.beginPath(); ctx.arc(f.x, y, 2.4, 0, TAU); ctx.fill();
      return;
    }
    if (!f.parts) {
      f.parts = []; var M = 64, R = Math.min(W, H) * (.2 + Math.random() * .07);
      for (var i = 0; i < M; i++) { var a = i / M * TAU + Math.random() * .1, v = R * (.75 + Math.random() * .35); f.parts.push({ a: a, v: v, c: i % 3 ? f.col : f.col2 }); }
      if (SOUND && allow('p49boom', 120, 3)) try { noise({ dur: .35, filter: 'lowpass', ff: 900, ff2: 200, gain: .12 }); for (var j = 0; j < 5; j++) noise({ dur: .03, filter: 'highpass', ff: 3000, gain: .05, when: .15 + j * .07 }); } catch (e) {}
    }
    var t = (now - f.burst) / 1000, fade = Math.max(0, 1 - t / 1.8);
    f.parts.forEach(function (p) {
      var d = p.v * (1 - Math.exp(-t * 3.2)), x = f.x + Math.cos(p.a) * d, y = f.y1 + Math.sin(p.a) * d + 60 * t * t;
      ctx.globalAlpha = fade * .25; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(x, y, 6 * (0.6 + fade * .6), 0, TAU); ctx.fill();
      ctx.globalAlpha = fade; ctx.beginPath(); ctx.arc(x, y, 3 * (0.6 + fade * .6), 0, TAU); ctx.fill();
      ctx.globalAlpha = fade * .35; ctx.strokeStyle = p.c; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.cos(p.a) * 10 * fade, y - Math.sin(p.a) * 10 * fade - 4 * t); ctx.stroke();
    });
    if (t < .12) { ctx.globalAlpha = (1 - t / .12) * .5; var g = ctx.createRadialGradient(f.x, f.y1, 0, f.x, f.y1, 60); g.addColorStop(0, '#fffbe8'); g.addColorStop(1, 'rgba(255,251,232,0)'); ctx.fillStyle = g; ctx.fillRect(f.x - 60, f.y1 - 60, 120, 120); }
  });
  ctx.restore();
}
var p49BaseBack = drawWorldBack;
drawWorldBack = function (now) { var r = p49BaseBack.apply(this, arguments); try { p49DrawFireworks(now); } catch (e) {} return r; };

/* ========== 六、合影设置面板 ========== */
UI_PAIRS.push(['合影设置', 'Photo settings'], ['入场动态', 'Warm-up'], ['烟花', 'Fireworks'], ['拍一张', 'Take the photo'], ['自拍', 'Selfie'], ['靠头', 'Huddle'], ['高矮排', 'Shortest to tallest'],
  ['C 位', 'Centre stage'], ['阶梯', 'Stairs'], ['追赶', 'Chase'], ['乱跑', 'Scramble'], ['跳跳', 'Hop'], ['忽大忽小', 'Grow & shrink'], ['人浪', 'Wave'], ['随机', 'Random'], ['关闭', 'Close']);
function p49Opts() {
  var styles = [['random', '每次随机']].concat(PHOTO_STYLES.map(function (k) { return [k, PHOTO_STYLE_ZH[k] || k]; }));
  var dyn = [['random', '随机'], ['none', '不加']].concat(Object.keys(P49_DYN).map(function (k) { return [k, P49_DYN[k][0]]; }));
  var moment = [['random', '每次随机'], ['none', '不加'], ['jump', '跳跳照'], ['caps', '抛帽'], ['confetti', '礼花'], ['photobomb', '抢镜'], ['blink', '有人闭眼']];
  var frames = (typeof LAB_FRAMES !== 'undefined' ? LAB_FRAMES : ['mat']).map(function (f) { var L = (typeof LAB_FRAME_LABEL !== 'undefined' && LAB_FRAME_LABEL[f]) || [f, f]; return [f, Array.isArray(L) ? L[0] : String(L)]; });
  return [['photoStyle', '合影样式', styles], ['photoDyn', '入场动态', dyn], ['photoMoment', '拍照瞬间', moment], ['photoFirework', '烟花', [['random', '随机'], ['on', '开'], ['off', '关']]], ['photoCount', '倒数', [['on', '3·2·1·茄子'], ['off', '直接拍']]], ['photoFrame', '相框', frames]];
}
function p49OpenSettings() {
  var old = document.getElementById('photoSet'); if (old) { old.remove(); return; }
  var L = document.createElement('div'); L.id = 'photoSet'; L.setAttribute('role', 'dialog'); L.setAttribute('aria-label', uiText('合影设置'));
  var box = document.createElement('div'); box.className = 'psBox'; L.appendChild(box);
  var hd = document.createElement('div'); hd.className = 'psHead'; hd.innerHTML = '<b></b><button type="button" class="psX" aria-label="close">×</button>'; hd.querySelector('b').textContent = uiText('合影设置'); box.appendChild(hd);
  p49Opts().forEach(function (row) {
    var r = document.createElement('div'); r.className = 'psRow';
    var lab = document.createElement('span'); lab.className = 'psLab'; lab.textContent = uiText(row[1]); r.appendChild(lab);
    var seg = document.createElement('div'); seg.className = 'psSeg';
    row[2].forEach(function (o) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = uiText(o[1]); b.setAttribute('aria-pressed', String(CFG[row[0]]) === o[0] ? 'true' : 'false');
      b.addEventListener('click', function () { CFG[row[0]] = o[0]; saveCfg(); Array.prototype.forEach.call(seg.children, function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); try { syncPanel(); } catch (e) {} });
      seg.appendChild(b);
    });
    r.appendChild(seg); box.appendChild(r);
  });
  var foot = document.createElement('div'); foot.className = 'psFoot';
  var shoot = document.createElement('button'); shoot.type = 'button'; shoot.className = 'psGo'; shoot.textContent = '◉ ' + uiText('拍一张');
  shoot.addEventListener('click', function () { L.remove(); if (typeof PHOTO_LAB !== 'undefined' && PHOTO_LAB.open && typeof labClose === 'function') try { labClose(); } catch (e) {} setTimeout(photoStart, 80); });
  foot.appendChild(shoot); box.appendChild(foot);
  L.addEventListener('click', function (e) { if (e.target === L || e.target.classList.contains('psX')) L.remove(); });
  document.body.appendChild(L);
  setTimeout(function () { shoot.focus(); }, 0);
}
(function p49UI() {
  var st = document.createElement('style');
  st.textContent = '#photoSet{position:fixed;inset:0;z-index:64;background:rgba(40,34,26,.35);display:flex;align-items:center;justify-content:center;padding:14px}' +
    '#photoSet .psBox{background:linear-gradient(180deg,#fbf8f0,#f4eee2);color:#3a342c;border-radius:16px;width:min(620px,100%);max-height:88vh;overflow:auto;padding:12px 16px 14px;box-shadow:0 12px 40px rgba(40,30,20,.3);font:13px/1.5 system-ui,"PingFang SC","Noto Sans SC",sans-serif}' +
    '#photoSet .psHead{display:flex;align-items:center}#photoSet .psHead b{font:600 17px/1.2 "Noto Serif SC","Songti SC",serif;letter-spacing:.06em}#photoSet .psX{margin-left:auto;border:0;background:none;font-size:22px;min-width:40px;min-height:40px;cursor:pointer;color:inherit}' +
    '#photoSet .psRow{padding:8px 0;border-top:1px solid rgba(160,140,110,.18)}#photoSet .psLab{display:block;font-size:11px;color:#8a7c6a;margin-bottom:4px}' +
    '#photoSet .psSeg{display:flex;flex-wrap:wrap;gap:4px}#photoSet .psSeg button{font:inherit;font-size:12px;border:1px solid #d3c7b2;background:#fffdf8;color:inherit;border-radius:999px;padding:4px 10px;min-height:32px;cursor:pointer}' +
    '#photoSet .psSeg button[aria-pressed="true"]{background:#36564c;border-color:#36564c;color:#fffdf4}' +
    '#photoSet .psFoot{display:flex;justify-content:flex-end;padding-top:10px}#photoSet .psGo{font:inherit;font-size:14px;border:0;background:#c2412d;color:#fff;border-radius:999px;padding:8px 20px;min-height:40px;cursor:pointer}' +
    '@media(prefers-color-scheme:dark){#photoSet .psBox{background:#2d2924;color:#efe7d8}#photoSet .psSeg button{background:#3a342c;border-color:#5a5044}}';
  document.head.appendChild(st);
  if (typeof QX_CTX !== 'undefined') QX_CTX.add('photoSet');
  /* 表演条菜单：原来的"大合照"按钮直接绑着最早的函数（绕过倒数与瞬间），换成走完整流程；旁边加"合影设置" */
  var menu = document.querySelector('.playMoreMenu');
  if (menu) {
    Array.prototype.forEach.call(menu.querySelectorAll('button'), function (b) {
      if (/大合照|Group photo/.test(b.textContent)) { var nb = b.cloneNode(true); nb.addEventListener('click', function () { photoStart(); }); b.parentNode.replaceChild(nb, b);
        var set = document.createElement('button'); set.type = 'button'; set.textContent = '⚙ ' + uiText('合影设置'); set.addEventListener('click', p49OpenSettings); nb.parentNode.insertBefore(set, nb.nextSibling); }
    });
  }
  /* 手机：长按底栏"拍" */
  var snap = document.querySelector('#qxDock button[data-k=snap]');
  if (snap) {
    var t = 0, long = false;
    snap.addEventListener('pointerdown', function () { long = false; t = setTimeout(function () { long = true; p49OpenSettings(); }, 520); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { snap.addEventListener(ev, function () { clearTimeout(t); }); });
    snap.addEventListener('click', function (e) { if (long) { e.stopImmediatePropagation(); e.preventDefault(); long = false; } }, true);
  }
  /* 设置面板"合影"组 */
  var grp = null;
  PANEL.forEach(function (G) { if ((G.items || []).some(function (it) { return it.id === 'photoStyle'; })) grp = G; });
  if (grp) {
    grp.items.forEach(function (it) { if (it.id === 'photoStyle') Object.keys(P49_STYLE_NAMES).forEach(function (k) { it.opts.push([k, P49_STYLE_NAMES[k][0]]); }); });
    var at = grp.items.findIndex(function (it) { return it.id === 'photoStyle'; });
    grp.items.splice(at + 1, 0,
      { id: 'photoDyn', label: '入场动态', type: 'seg', opts: [['random', '随机'], ['none', '不加']].concat(Object.keys(P49_DYN).map(function (k) { return [k, P49_DYN[k][0]]; })) },
      { id: 'photoFirework', label: '烟花', type: 'seg', opts: [['random', '随机'], ['on', '开'], ['off', '关']] });
  }
})();
/* 暗房里加一个"合影设置" */
if (typeof labBuild === 'function') {
  var p49BaseLabBuild = labBuild;
  labBuild = function () {
    var r = p49BaseLabBuild.apply(this, arguments);
    try {
      var acts = document.querySelector('#photoLab .ql-acts');
      if (acts && !acts.querySelector('.p49set')) { var b = document.createElement('button'); b.type = 'button'; b.className = 'p49set'; b.textContent = '⚙ ' + uiText('合影设置'); b.addEventListener('click', p49OpenSettings); acts.appendChild(b); }
    } catch (e) {}
    return r;
  };
}
try { window.__photo49 = { get state() { return { active: PHOTO.active, prelude: P49.prelude && P49.prelude.mode, fw: P49.fw.length, style: PHOTO.style }; }, settings: p49OpenSettings, styles: PHOTO_STYLES.slice() }; } catch (e) {}
