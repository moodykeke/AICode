/* 趣像 25 (r48): 生态缸的手感与画面
   ─────────────────────────────────────────────────────────────
   所见即所投  投放工具下，指针停在空格子上，会先看到"下一只"的淡影（真的就是它：放手投下的正是这只，连毛色都一样）；
               托盘换物种、换角色包，淡影立刻换。随机时淡影就是随机抽到的那一只。
   空格像画的  r44 的虚线圆＋加号换成手绘的"窝"：一抹淡淡的地色水彩＋两笔墨线托底；投放工具下空窝会轻轻呼吸。
   落地有回响  投下、出生时脚下荡开一圈墨线涟漪；老死、被吃时飘起两三片花瓣；被陨石炸走时溅起墨点。
   指着就知道  指针停在生物上，旁边浮出一张小签：变种名、在这里过得怎样（很自在 / 还行 / 难受）、第几代生、多大了。
   工具有手感  指针样式跟着工具变；在缸里按 D 投放、F 喂食、M 陨石（原来这三个键的舞台动作在缸里不需要）。
   面板更像纸  面板换成纸色底、宋体标题、细分隔线；当前工具在标题旁显示。 */

EVO.artMarks = true;
EVO.fxInk = [];
var FEEL2 = { ghost: null, ghostKey: '', nextDNA: {}, hover: null };

/* ========== 一、所见即所投 ========== */
function feelPickKey() { return (EVO.pack || 'classic') + ':' + EVO.pick; }
function feelNextDNA() {
  var k = feelPickKey();
  if (!FEEL2.nextDNA[k]) {
    var sp = EVO.pick;
    if (sp === 'random') { var P = typeof QX_PACKS !== 'undefined' && EVO.pack ? QX_PACKS.byId[EVO.pack] : null; sp = P ? evoRand(P.members) : evoRand(EVO_FOUNDERS)[0]; }
    var d = (typeof QX_PACKS !== 'undefined' && !QX_PACKS.isClassic(sp)) ? QX_PACKS.dna(sp) : pureDNA(evoFounderSeed(sp));
    FEEL2.nextDNA[k] = d || pureDNA(evoFounderSeed('cat'));
  }
  return FEEL2.nextDNA[k];
}
var feelBaseFounderDNA = evoFounderDNA;
evoFounderDNA = function (sp) {
  if (sp === EVO.pick || sp == null) { var k = feelPickKey(), d = feelNextDNA(); delete FEEL2.nextDNA[k]; FEEL2.ghost = null; return d.slice(); }
  return feelBaseFounderDNA.apply(this, arguments);
};
function feelGhostFor(h) {
  var d = feelNextDNA(), key = d.join('.');
  if (!FEEL2.ghost || FEEL2.ghostKey !== key) { FEEL2.ghost = new Head(d, null); FEEL2.ghostKey = key; FEEL2.ghost.pop = 1; }
  var g = FEEL2.ghost; g.x = h.x; g.y = h.y; g.s = h.s; g.col = h.col; g.row = h.row;
  return g;
}
function feelDrawGhost(now) {
  if (EVO.tool !== 'drop' || !pointer.inside || cardOpen) return;
  var h = headAt(pointer.x, pointer.y); if (!h || !evoEmpty(h) || h.pop > .05) return;
  var g = feelGhostFor(h), bob = Math.sin(now / 260) * .03;
  var o = { ox: 0, oy: -.25 + bob, hs: 1, spin: 0, mouth: g.g.openIdle * .55, smile: .4, eye: 0, brow: 0, angry: 0, flush: 0, sweat: 0, gazeX: 0, gazeY: .3, flap: 0 };
  g.yaw = Math.sin(now / 900) * .25; g.pitch = -.05;
  var ga = GALPHA; GALPHA = .38;
  try { ctx.save(); g.drawBodyAt(o); g.drawHeadAt(o); } catch (e) {} finally { ctx.restore(); GALPHA = ga; }
  /* 经典头的画法不理会全局透明度——盖一层纸色薄纱，让它读起来是"还没落下的影子" */
  var vx = h.x, vy = h.y - h.s * .1, R = h.s * 1.9, gr = ctx.createRadialGradient(vx, vy, h.s * .2, vx, vy, R);
  gr.addColorStop(0, 'rgba(246,241,230,.58)'); gr.addColorStop(.75, 'rgba(246,241,230,.5)'); gr.addColorStop(1, 'rgba(246,241,230,0)');
  ctx.save(); ctx.fillStyle = gr; ctx.fillRect(vx - R, vy - R, R * 2, R * 2); ctx.restore();
  /* 指向的窝加深一点 */
  useStyle(null); LW = 1;
  stroke(ring(h.x, h.y + h.s * 1.05, h.s * .95, h.s * .2, 20), { close: true, w: 1.2, jit: .5, seed: 71 + h.col * 7 + h.row, alpha: .45 });
}

/* ========== 二、空格像画的 ========== */
function feelDrawNests(now) {
  if (EVO.tool !== 'drop') return;
  var anyLive = heads.some(evoLive), breathe = anyLive ? .5 : .65 + .25 * Math.sin(now / 420);
  useStyle(null); LW = 1;
  heads.forEach(function (h, i) {
    if (!evoEmpty(h) || h.pop > .05) return;
    var cx = h.x, cy = h.y + h.s * 1.05, rx = h.s * .9, ry = h.s * .2;
    wash(ring(cx, cy, rx, ry, 16), '#d8ccb0', 300 + i, .42 * breathe, .06);
    stroke([[cx - rx * .7, cy - ry * .2], [cx - rx * .2, cy + ry * .9], [cx + rx * .25, cy + ry * .95], [cx + rx * .72, cy - ry * .1]], { w: 1, jit: .6, seed: 500 + i, alpha: .28 * breathe });
  });
}

/* ========== 三、落地有回响 ========== */
function feelRipple(h, kind) { EVO.fxInk.push({ x: h.x, y: h.y + h.s * 1.05, s: h.s, t0: performance.now(), kind: kind }); if (EVO.fxInk.length > 24) EVO.fxInk.shift(); }
function feelDrawInk(now) {
  EVO.fxInk = EVO.fxInk.filter(function (f) { return now - f.t0 < 900; });
  useStyle(null); LW = 1;
  EVO.fxInk.forEach(function (f, i) {
    var k = (now - f.t0) / 900, e = 1 - Math.pow(1 - k, 2);
    var col = f.kind === 'birth' ? '#c2412d' : INK;
    stroke(ring(f.x, f.y, f.s * (.5 + e * 1.1), f.s * (.12 + e * .26), 22), { close: true, w: 1.3 * (1 - k) + .3, jit: .4, seed: 90 + i, alpha: .55 * (1 - k), color: col });
  });
}
var feelBaseDrop = evoDrop;
evoDrop = function (h) {
  var ok = evoEmpty(h), r = feelBaseDrop.apply(this, arguments);
  if (ok) setTimeout(function () { if (!h.hidden) feelRipple(h, 'drop'); }, reduceMotion() ? 60 : 480);
  return r;
};
var feelBaseKill = evoKill;
evoKill = function (h, cause) {
  var live = evoLive(h), r = feelBaseKill.apply(this, arguments);
  if (!live) return r;
  if (cause === 'meteor') { for (var i = 0; i < 8; i++) particles.push({ x: h.x, y: h.y - h.s * .3, vx: (Math.random() - .5) * 160, vy: -60 - Math.random() * 120, l: 0, ml: .7, r: 1.5 + Math.random() * 2, col: '#2d2a26' }); }
  else if (!reduceMotion()) { for (var j = 0; j < 3; j++) spawnPetal(h.x + (Math.random() - .5) * h.s, h.y - h.s * .4); }
  return r;
};
/* 出生：在 evoHatch 开始时荡一圈朱色涟漪 */
var feelHatchDef = FXDEF.evoHatch, feelHatchStep = feelHatchDef.step;
feelHatchDef.step = function (h, a, t, k, d) { if (!a.rippled) { a.rippled = true; feelRipple(h, 'birth'); } return feelHatchStep.apply(this, arguments); };

/* ========== 四、指着就知道 ========== */
function feelDrawTag(now) {
  if (!pointer.inside || cardOpen || now - pointer.last > 4000) return;
  var h = headAt(pointer.x, pointer.y); if (!h || !evoLive(h) || h.pop < .9) return;
  var v = evoVariantOf(h), F = evoFit(h.g, evoClimateOf(h)), e = h.evo || {};
  var mood = F.f > 1.12 ? evoL('很自在', 'thriving') : F.f < .8 ? evoL('难受', 'struggling') : evoL('还行', 'getting by');
  var why = F.f > 1.12 ? (F.best ? evoL(F.best[1], F.best[2]) : '') : F.f < .8 ? (F.worst ? evoL(F.worst[1], F.worst[2]) : '') : '';
  var line1 = evoLabel(v), line2 = mood + (why ? ' · ' + why : ''), line3 = evoL('第 ' + (e.born || 0) + ' 代生 · ' + (e.age || 0) + ' 代大', 'born gen ' + (e.born || 0) + ' · age ' + (e.age || 0));
  ctx.save();
  var fs = 13, pad = 8;
  ctx.font = '600 ' + (fs + 1) + 'px "Noto Serif SC","Songti SC",serif'; var w1 = ctx.measureText(line1).width;
  ctx.font = fs + 'px system-ui,"PingFang SC",sans-serif'; var w2 = Math.max(ctx.measureText(line2).width, ctx.measureText(line3).width);
  var w = Math.max(w1, w2) + pad * 2, hh = fs * 3 + pad * 2 + 8;
  var x = clamp(h.x + h.s * 1.1, 6, W - w - 6), y = clamp(h.y - h.s * 1.2, 6, H - hh - 6);
  ctx.globalAlpha = .96; ctx.fillStyle = '#fbf7ee'; ctx.strokeStyle = 'rgba(58,52,44,.55)'; ctx.lineWidth = 1;
  ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, hh, 8); else ctx.rect(x, y, w, hh); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'hsl(' + v.hue + ',55%,48%)'; ctx.fillRect(x, y + 8, 3, hh - 16);
  ctx.globalAlpha = 1; ctx.textBaseline = 'top';
  ctx.fillStyle = '#3a342c'; ctx.font = '600 ' + (fs + 1) + 'px "Noto Serif SC","Songti SC",serif'; ctx.fillText(line1, x + pad, y + pad);
  ctx.fillStyle = F.f < .8 ? '#a4472f' : F.f > 1.12 ? '#3f7a55' : '#6a5f52'; ctx.font = fs + 'px system-ui,"PingFang SC",sans-serif'; ctx.fillText(line2, x + pad, y + pad + fs + 6);
  ctx.fillStyle = '#8a7c6a'; ctx.fillText(line3, x + pad, y + pad + fs * 2 + 9);
  ctx.restore();
}

/* ========== 五、每帧叠加（天气层之后、台词气泡之前） ========== */
var feelBaseWorld = evoDrawWorld;
evoDrawWorld = function (now) {
  feelBaseWorld.apply(this, arguments);
  try { feelDrawNests(now); feelDrawInk(now); feelDrawGhost(now); if (EVO.tool === 'drop' || EVO.tool === 'food') feelDrawTag(now); } catch (e) {}
};

/* ========== 六、工具的手感：指针样式、D / F / M ========== */
function feelCursor() {
  var c = !EVO.on ? '' : EVO.tool === 'meteor' ? 'crosshair' : EVO.tool === 'food' ? 'cell' : '';
  if (EVO.on && EVO.tool === 'drop') { var h = pointer.inside ? headAt(pointer.x, pointer.y) : null; c = h && evoEmpty(h) ? 'copy' : h && evoLive(h) ? 'pointer' : 'default'; }
  if (cv.style.cursor !== c) cv.style.cursor = c;
}
window.addEventListener('pointermove', function () { if (EVO.on) feelCursor(); }, { passive: true });
window.addEventListener('keydown', function (e) {
  if (!EVO.on || cardOpen || e.ctrlKey || e.metaKey || e.altKey || (typeof QX_CTX !== 'undefined' && QX_CTX.top())) return;
  var tag = (e.target && e.target.tagName) || ''; if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
  var k = (e.key || '').toLowerCase(), t = k === 'd' ? 'drop' : k === 'f' ? 'food' : k === 'm' ? 'meteor' : null;
  if (!t) return;
  e.preventDefault(); e.stopImmediatePropagation();
  EVO.tool = t; evoSyncPanel(); feelCursor();
}, true);
var feelBaseExit = evoExit;
evoExit = function () { var r = feelBaseExit.apply(this, arguments); cv.style.cursor = ''; FEEL2.ghost = null; FEEL2.nextDNA = {}; return r; };

/* ========== 七、面板更像纸 ========== */
(function feelPanelStyle() {
  var st = document.createElement('style');
  st.textContent =
    '#evoPanel{background:linear-gradient(180deg,rgba(251,248,240,.97),rgba(246,240,228,.97));border-color:#d9ccb3;box-shadow:0 10px 30px rgba(60,48,30,.16),inset 0 0 0 1px rgba(255,255,255,.6)}' +
    '#evoPanel .evoHead b{font:600 17px/1.2 "Noto Serif SC","Songti SC",serif;letter-spacing:.06em}' +
    '#evoPanel .evoHead .evoTool{font-size:11px;color:#8a7c6a;border:1px solid #e0d5c0;border-radius:999px;padding:1px 7px}' +
    '#evoPanel .evoRow,#evoPanel .evoTray,#evoPanel .evoPacks{border-top:1px solid rgba(160,140,110,.14);padding-top:6px}' +
    '#evoPanel button{transition:background .15s,color .15s,border-color .15s,transform .1s}#evoPanel button:active{transform:scale(.96)}' +
    '#evoPanel button.on{background:#36564c;border-color:#36564c;color:#fffdf4}' +
    '#evoPanel .evoTray button.on{background:#fff4d8;color:#3a342c;border-color:#c9a24a;box-shadow:0 0 0 2px rgba(201,162,74,.35)}' +
    '@media(prefers-color-scheme:dark){#evoPanel{background:linear-gradient(180deg,rgba(44,40,34,.97),rgba(36,33,28,.97))}#evoPanel .evoTray button.on{background:#4a3f25;color:#efe7d8}}';
  document.head.appendChild(st);
})();
var feelBaseBuild = evoBuildPanel;
evoBuildPanel = function () {
  var fresh = !EVO.panel, p = feelBaseBuild.apply(this, arguments);
  if (fresh) {
    var tag = document.createElement('span'); tag.className = 'evoTool'; p.el.querySelector('.evoHead').insertBefore(tag, p.gen); p.toolTag = tag;
    Object.keys(p.tools).forEach(function (k) { var key = k === 'drop' ? 'D' : k === 'food' ? 'F' : 'M'; p.tools[k].title = key; });
  }
  return p;
};
var feelBaseSync = evoSyncPanel;
evoSyncPanel = function () {
  feelBaseSync.apply(this, arguments);
  var p = EVO.panel; if (p && p.toolTag) p.toolTag.textContent = EVO.tool === 'drop' ? evoL('投放 · D', 'Drop · D') : EVO.tool === 'food' ? evoL('喂食 · F', 'Feed · F') : evoL('陨石 · M', 'Meteor · M');
  FEEL2.ghost = null;
};
try { Object.assign(window.__evo, { nextDNA: function () { return feelNextDNA().slice(); } }); } catch (e) {}
/* 缸里不要"点水涟漪"：指针在空格上留下的圈会和投放淡影、落地涟漪抢眼 */
var feelBaseGrid = drawGrid;
drawGrid = function () { if (EVO.on && typeof FEEL !== 'undefined' && FEEL.ripples && FEEL.ripples.length) FEEL.ripples.length = 0; return feelBaseGrid.apply(this, arguments); };
