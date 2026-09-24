/* 趣像 20 (r43): 趣味合奏与大合影效果
   ─────────────────────────────────────────────────────────────
   四个新合奏（不占键位——键盘已按区用满；入口在表演条"更多动作"、键位表"趣味"一排、手机动作面板）：
     追萤火虫  天色暗下来，一只萤火虫在舞台上乱飞，全场的眼睛跟着它转；最后落在某位的鼻尖上——阿嚏！
     传悄悄话  一句话沿着两排人一个传一个，每传一次就走样一点；最后一位大声喊出来，全场笑翻
     广场舞    112 拍/分，四段舞步：左右踏步、跳拍、甩头波浪、扭腰跳，配鼓点、旋律和彩色追光
     躲猫猫    全场一起缩没了，再一个个冒出来喊"哇！"；总有一个最后才探头
   大合影：
     队形 +3   心形、叠罗汉（金字塔）、向日葵（黄金角螺旋）
     倒数      3·2·1·茄子！——倒数期间全场转向镜头、露出笑脸
     拍照瞬间  跳跳照（全员腾空、脖子跟着伸）、抛帽（毕业帽在头顶飞）、礼花、抢镜（有人冲到前排做鬼脸）、有人闭眼（再按 R 重拍）
     相框 +3   年画（红底金边、倒福）、趣像日报（头版，按瞬间换标题，黑白网点）、卷轴（天头地头、惊燕、轴头）
   所有动作有限时长、结束回位；"减少动态效果"时幅度收小。 */

var FUN = { ff: null, bubbles: [], dance: null, parts: [], lights: [] };
function funEn() { return typeof UI_LANG !== 'undefined' && UI_LANG === 'en'; }
function funSoft() { return reduceMotion() ? .35 : 1; }
function funLook(h, x, y) {
  var dx = x - h.x, dy = y - (h.y - h.s * .2), D = Math.max(cellW * 1.15, h.s * 2.4);
  return { yaw: clamp(Math.atan2(dx, D) * 1.2, -1.05, 1.05), pitch: -clamp(Math.atan2(dy, D * 1.3) * .7, -.32, .4), gx: clamp(dx / (D * 1.4), -1, 1), gy: clamp(dy / (D * 1.4), -1, 1) };
}
function funBeep(f, when, dur, gain, type, pan) { try { if (SOUND) tone({ f: f, dur: dur || .2, gain: gain || .06, type: type || 'triangle', when: when || 0, pan: pan || 0 }); } catch (e) {} }

/* ========== 一、追萤火虫 ========== */
defineFx('ffWatch', { channels: ['gaze'], prio: PRIO.ACTION, dur: 9000,
  step: function (h, a, t, k, d) {
    var F = FUN.ff; if (!F) return;
    // 平面半身像转头只是水平压缩，眼神要放大一些、再加一点歪头和前倾，才看得出"都在看它"
    var L = funLook(h, F.x, F.y), e = Math.min(1, t / 600); d.yaw = L.yaw; d.pitch = L.pitch; d.gazeX = clamp(L.gx * 1.8, -1.5, 1.5); d.gazeY = clamp(L.gy * 1.6, -1.4, 1.4);
    d.roll = clamp(L.gx, -1, 1) * .10 * e * funSoft(); d.ox = clamp(L.gx, -1, 1) * .05 * e * funSoft();
    var near = Math.hypot(F.x - h.x, F.y - h.y) / Math.max(1, h.s);
    if (near < 1.8) { d.smile = 1; d.brow = .5; d.mouth = .1; }
    if (F.landed === h) { d.gazeX = 0; d.gazeY = 1; d.pitch = -.18; d.brow = .9; d.mouth = .06; }
  } });
function funFireflies() {
  if (SUPER || !heads.length) return;
  var dur = 9000 / CFG.speed, pick = heads[Math.floor(Math.random() * heads.length)];
  FUN.ff = { t0: performance.now(), dur: dur, x: -40, y: H * .4, trail: [], target: pick, landed: null, sneezed: false,
    p1: Math.random() * 6, p2: Math.random() * 6, p3: Math.random() * 6, dirX: Math.random() < .5 ? -1 : 1, lastChime: 0 };
  each(function (h) { act(h, 'ffWatch'); });
  if (typeof toast === 'function') toast(qxLocal('天黑了……有只萤火虫', 'Dusk… a firefly'), 1600);
}
function funFireflyStep(now) {
  var F = FUN.ff; if (!F) return;
  var t = (now - F.t0) / 1000, T = F.dur / 1000, soft = funSoft();
  if (t > T) { FUN.ff = null; return; }
  var wx = W * (.5 + .36 * Math.sin(t * .9 * soft + F.p1) + .08 * Math.sin(t * 2.3 + F.p2));
  var wy = H * (.45 + .30 * Math.sin(t * .63 * soft + F.p3) + .06 * Math.cos(t * 2.9));
  if (t < .8) { var e0 = smooth(t / .8); wx = lerp(-30, wx, e0); }
  var land0 = T - 3.4, land1 = T - 1.9, tg = F.target, nx = tg.x + tg.s * .02, ny = tg.y + tg.s * .06, x, y;
  if (t < land0) { x = wx; y = wy; }
  else if (t < land1) { var e = smooth((t - land0) / (land1 - land0)); x = lerp(wx, nx, e); y = lerp(wy, ny, e); if (e > .97) F.landed = tg; }
  else {
    if (!F.sneezed && t > land1 + .55) { F.sneezed = true; F.landed = null; F.ox = nx; F.oy = ny; F.ot = t; act(tg, 'sneeze'); }
    if (F.sneezed) { var u = t - F.ot; x = F.ox + u * W * .16 * F.dirX; y = F.oy - u * H * .32 - Math.sin(u * 9) * 6; }
    else { x = nx; y = ny; }
  }
  F.x = x + Math.sin(t * 11) * 2; F.y = y + Math.cos(t * 13) * 2;
  F.trail.push([F.x, F.y]); if (F.trail.length > 16) F.trail.shift();
  if (now - F.lastChime > 420) {
    var near = heads.filter(function (h) { return Math.hypot(F.x - h.x, F.y - h.y) < h.s * 1.1; })[0];
    if (near && typeof penta === 'function') { F.lastChime = now; funBeep(penta(near.col + (rows - 1 - near.row) * 2, 440), 0, .35, .035, 'sine', panOf(near)); }
  }
}
function funFireflyDraw(now) {
  var F = FUN.ff; if (!F) return;
  var t = (now - F.t0) / F.dur, dusk = Math.min(1, t * 6) * Math.min(1, (1 - t) * 5) * .30;
  ctx.fillStyle = 'rgba(24,30,52,' + dusk.toFixed(3) + ')'; ctx.fillRect(0, 0, W, H);
  var pulse = .75 + .25 * Math.sin(now / 130), R = Math.max(30, cellW * .55);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  var g = ctx.createRadialGradient(F.x, F.y, 0, F.x, F.y, R);
  g.addColorStop(0, 'rgba(255,236,150,' + (.55 * pulse).toFixed(3) + ')'); g.addColorStop(.35, 'rgba(230,220,120,' + (.18 * pulse).toFixed(3) + ')'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(F.x, F.y, R, 0, TAU); ctx.fill();
  F.trail.forEach(function (p, i) { ctx.fillStyle = 'rgba(250,236,150,' + (i / F.trail.length * .35).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(p[0], p[1], 1.2 + i * .12, 0, TAU); ctx.fill(); });
  ctx.restore();
  ctx.fillStyle = '#fff7c8'; ctx.beginPath(); ctx.arc(F.x, F.y, 3.2, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(90,80,60,.55)'; ctx.lineWidth = 1;
  var fl = Math.sin(now / 28) * 3;
  ctx.beginPath(); ctx.ellipse(F.x - 3, F.y - 3, 3.2, 1.6 + fl * .2, -.6, 0, TAU); ctx.ellipse(F.x + 3, F.y - 3, 3.2, 1.6 - fl * .2, .6, 0, TAU); ctx.stroke();
}

/* ========== 二、传悄悄话 ========== */
var FUN_WHISPERS = {
  zh: [['葫芦娃', '胡噜娃', '呼噜哇', '呼噜噜', '打呼噜！'], ['吃饭了吗', '吃烦了吗', '痴饭了吗', '吃番茄吗', '吃番茄酱！'],
       ['明天春游', '明天出游', '明天吹牛', '明天吹泡泡', '吹泡泡去！'], ['老师来了', '老鼠来了', '老虎来了', '老虎开会了', '老虎开会啦！'],
       ['快去排队', '快去拍腿', '快去拍对', '快去拍照', '拍照啦，茄子！', 'photo'], ['月亮很圆', '月饼很圆', '月饼很甜', '月饼要咸', '要吃咸月饼！']],
  en: [['Pass the peas', 'Pass the keys', 'Pat the bees', 'Bat the breeze', 'Chat with bees!'], ['Nice hat', 'Mice chat', 'Mice that chat', 'Rice that’s flat', 'Rice pancake!'],
       ['Lunch at noon', 'Munch a spoon', 'Punch a moon', 'Hunch a tune', 'Hum a tune!']]
};
defineFx('whisperSay', { channels: C_POS, prio: PRIO.ACTION, dur: 900,
  step: function (h, a, t, k, d) { var e = bump(k) * funSoft(), dir = a.dir || 1; d.yaw = dir * .85 * e; d.ox = dir * .14 * e; d.roll = dir * .12 * e; d.mouth = .06 + .06 * Math.abs(Math.sin(t / 60)) * e; d.smile = .3; d.eye = .25 * e; } });
defineFx('whisperHear', { channels: C_POS, prio: PRIO.ACTION, dur: 900,
  step: function (h, a, t, k, d) { var e = bump(k), dir = a.dir || 1; d.yaw = -dir * .55 * e; d.brow = .9 * e; d.gazeX = -dir * .8 * e; d.mouth = .04; } });
defineFx('whisperShout', { channels: C_POS, prio: PRIO.ACTION, dur: 1400,
  step: function (h, a, t, k, d) { var e = bump(k) * funSoft(); d.yaw = 0; d.pitch = .16 * e; d.mouth = .42 * e; d.brow = e; d.smile = .7; d.oy = -.14 * e; } });
function funWhisper() {
  if (SUPER || heads.length < 3) return;
  var r = Math.floor(Math.random() * Math.max(1, rows - 1)), snake = [];
  heads.filter(function (h) { return h.row === r; }).sort(function (a, b) { return a.col - b.col; }).forEach(function (h) { snake.push(h); });
  heads.filter(function (h) { return h.row === r + 1; }).sort(function (a, b) { return b.col - a.col; }).forEach(function (h) { snake.push(h); });
  var L = Math.min(10, snake.length), start = Math.floor(Math.random() * (snake.length - L + 1)), path = snake.slice(start, start + L);
  var chains = FUN_WHISPERS[funEn() ? 'en' : 'zh'], chain = chains[Math.floor(Math.random() * chains.length)].slice(), hop = 620 / CFG.speed;
  var thenPhoto = chain[chain.length - 1] === 'photo'; if (thenPhoto) chain.pop();   // 传到"拍照啦"——真的拍一张
  path.forEach(function (h, i) {
    if (i === L - 1) return;
    var nx = path[i + 1], dir = nx.x > h.x + 2 ? 1 : nx.x < h.x - 2 ? -1 : (nx.y > h.y ? 1 : -1), word = chain[Math.round(i / (L - 1) * (chain.length - 2))];
    setTimeout(function () {
      act(h, 'whisperSay', { dir: dir }); act(nx, 'whisperHear', { dir: dir, delay: 140 });
      FUN.bubbles.push({ h: h, text: word, t0: performance.now(), dur: hop * 1.05, dir: dir, small: true });
      if (SOUND && allow('whisper', 90, 3)) try { noise({ dur: .16, filter: 'highpass', ff: 3600, gain: .05, pan: panOf(h) }); } catch (e) {}
    }, i * hop);
  });
  var last = path[L - 1], first = path[0];
  setTimeout(function () {
    act(last, 'whisperShout'); FUN.bubbles.push({ h: last, text: chain[chain.length - 1], t0: performance.now(), dur: 2200 / CFG.speed, dir: 0, small: false });
    if (SOUND) try { SFX.huh(panOf(last)); } catch (e) {}
    setTimeout(function () {
      each(function (h) { if (h === last) return; act(h, h === first ? 'lean' : 'laugh', { delay: Math.hypot(h.x - last.x, h.y - last.y) / Math.max(1, cellW) * 70 }); });
      if (first) FUN.bubbles.push({ h: first, text: funEn() ? 'That’s not what I said!' : '我说的是“' + chain[0] + '”！', t0: performance.now() + 500, dur: 2000, dir: 0, small: true });
      if (thenPhoto && typeof photoStart === 'function') setTimeout(function () { if (!PHOTO.active && !cardOpen && !SUPER) photoStart(); }, 2300 / CFG.speed);
    }, 700 / CFG.speed);
  }, (L - 1) * hop);
}
function funBubblesDraw(now) {
  FUN.bubbles = FUN.bubbles.filter(function (b) { return now < b.t0 + b.dur; });
  FUN.bubbles.forEach(function (b) {
    var h = b.h; if (!h || now < b.t0) return;
    var k = (now - b.t0) / b.dur, alpha = Math.min(1, k * 8) * Math.min(1, (1 - k) * 6);
    var fs = Math.max(11, h.s * (b.small ? .34 : .5)), o = h.lastO || { ox: 0, oy: 0 };
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.font = (b.small ? 'italic ' : '600 ') + fs + 'px "Noto Serif SC","Songti SC",serif';
    var tw = ctx.measureText(b.text).width, pw = tw + fs * 1.1, ph = fs * 1.7;
    var bx = h.x + (o.ox || 0) * h.s + b.dir * h.s * .55 - pw / 2, by = h.y + (o.oy || 0) * h.s - h.s * 1.45 - ph;
    bx = clamp(bx, 4, W - pw - 4); by = Math.max(4, by);
    ctx.fillStyle = b.small ? 'rgba(255,253,246,.94)' : '#fff6d8'; ctx.strokeStyle = 'rgba(58,52,44,.8)'; ctx.lineWidth = b.small ? 1 : 1.6;
    var r = ph / 2, tx = clamp(h.x + b.dir * h.s * .3, bx + r, bx + pw - r);
    ctx.beginPath(); ctx.moveTo(bx + r, by); ctx.lineTo(bx + pw - r, by); ctx.arc(bx + pw - r, by + r, r, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(tx + 6, by + ph); ctx.lineTo(tx - 2, by + ph + fs * .6); ctx.lineTo(tx - 6, by + ph); ctx.lineTo(bx + r, by + ph); ctx.arc(bx + r, by + r, r, Math.PI / 2, Math.PI * 1.5); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3a342c'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(b.text, bx + pw / 2, by + ph / 2 + 1);
    ctx.restore();
  });
}

/* ========== 三、广场舞 ========== */
defineFx('squareDance', { channels: C_POS, prio: PRIO.ACTION, dur: 8600,
  step: function (h, a, t, k, d) {
    var beatMs = 60000 / 112 / CFG.speed, b = t / beatMs, bi = Math.floor(b), ph = b - bi, sec = Math.floor(bi / 8) % 4;
    var env = smooth(Math.min(1, k * 10)) * smooth(Math.min(1, (1 - k) * 10)) * funSoft(), mir = h.row % 2 ? -1 : 1, hop = bump(ph);
    if (sec === 0) { var side = (bi % 2 ? 1 : -1) * mir; d.ox = side * .16 * env; d.roll = -side * .10 * env; d.oy = -hop * .05 * env; }
    else if (sec === 1) { d.oy = -hop * .15 * env; d.hs = .05 * hop * env; }
    else if (sec === 2) { var p = Math.sin(b * Math.PI / 2 - h.col * .6); d.yaw = p * .8 * env; d.roll = p * .12 * env; d.oy = -Math.abs(p) * .05 * env; }
    else { var w = Math.sin(b * Math.PI - h.col * .9); d.oy = -Math.max(0, w) * .17 * env; d.roll = w * .14 * env; d.yaw = w * .5 * env; }
    d.smile = .95; d.mouth = .08 + .12 * hop; d.eye = (bi % 8 === 7 && ph < .35) ? 1 : 0;
  } });
function funDance() {
  if (SUPER || !heads.length) return;
  var dur = 8600 / CFG.speed, beat = 60 / 112 / CFG.speed;
  FUN.dance = { t0: performance.now(), dur: dur };
  each(function (h) { act(h, 'squareDance'); });
  if (SOUND) try {
    var mel = [0, 2, 4, 7, 4, 2, 4, 9, 7, 4, 2, 0, 2, 4, 2, 0], base = 392;
    var scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
    for (var i = 0; i < 16; i++) {
      var when = i * beat;
      if (i % 2 === 0) SFX.tom(when, 0);
      tone({ f: (i % 4 < 2 ? 98 : 110) * (i % 8 < 4 ? 1 : 1.335), dur: beat * .9, gain: .07, type: 'sine', when: when });
      [0, .5].forEach(function (off, j) { var n = mel[(i * 2 + j) % mel.length]; tone({ f: base * Math.pow(2, scale[n % scale.length] / 12), dur: beat * .45, gain: .045, type: 'triangle', when: when + off * beat }); });
    }
  } catch (e) {}
  setTimeout(function () { var hs = heads.slice().sort(function () { return Math.random() - .5; }).slice(0, 6); hs.forEach(function (h, i) { setTimeout(function () { spawnText(h, ['♪', '♫', '♬'][i % 3], true, 1.1); }, i * 380); }); }, 900);
}
function funDanceDraw(now) {
  var D = FUN.dance; if (!D) return;
  var k = (now - D.t0) / D.dur; if (k > 1) { FUN.dance = null; return; }
  var env = Math.min(1, k * 8) * Math.min(1, (1 - k) * 8), cols3 = ['rgba(236,110,120,', 'rgba(110,170,230,', 'rgba(240,200,90,'];
  ctx.save(); ctx.globalCompositeOperation = 'multiply';
  for (var i = 0; i < 3; i++) {
    var ph = now / 1000 * (.55 + i * .17) + i * 2.1, x = W * (.5 + .42 * Math.sin(ph)), y = H * (.5 + .34 * Math.sin(ph * 1.3 + i)), R = Math.max(W, H) * .22;
    var g = ctx.createRadialGradient(x, y, 0, x, y, R); g.addColorStop(0, cols3[i] + (.22 * env).toFixed(3) + ')'); g.addColorStop(1, cols3[i] + '0)');
    ctx.fillStyle = g; ctx.fillRect(x - R, y - R, R * 2, R * 2);
  }
  ctx.restore();
}

/* ========== 四、躲猫猫 ========== */
defineFx('peekaboo', { channels: C_POS, prio: PRIO.ACTION, dur: 4200,
  step: function (h, a, t, k, d) {
    var up = a.reveal || .6;
    if (k < up) { d.pop = 1 - smooth(Math.min(1, k / .12)); d.eye = 1; }
    else {
      var u = (k - up) / (1 - up), s = smooth(Math.min(1, u / .22));
      d.pop = s + Math.sin(Math.min(1, u * 2.2) * Math.PI) * .16 * funSoft(); d.mouth = .36 * (1 - u); d.brow = 1 - u; d.smile = u; d.eye = 0;
      if (!a.booed) { a.booed = true; spawnText(h, a.word, false, 1.05); if (SOUND && allow('peek', 60, 5)) try { SFX.pop(panOf(h), 480 + Math.random() * 420); } catch (e) {} }
    }
  } });
function funPeekaboo() {
  if (SUPER || !heads.length) return;
  var words = funEn() ? ['Boo!', 'Peekaboo!', 'Here!', 'Ta-da!'] : ['哇！', '在这！', '嘿！', '喵！', '找到我啦'];
  var late = heads[Math.floor(Math.random() * heads.length)];
  if (SOUND) try { SFX.whoosh(0, .5); } catch (e) {}
  each(function (h) { act(h, 'peekaboo', { reveal: h === late ? .93 : .34 + Math.random() * .5, word: h === late ? (funEn() ? 'Me too…' : '还有我…') : words[Math.floor(Math.random() * words.length)] }); });
}

/* ========== 五、入口：表演条、键位表"趣味"一排、手机动作面板 ========== */
var FUN_MOVES = [
  { fx: 'fireflies', key: 'fun:ff', glyph: '✦', zh: '追萤火虫', en: 'Firefly', zhDesc: '天色暗下来，一只萤火虫乱飞，全场的眼睛跟着它；最后落在谁鼻尖上——阿嚏！', desc: 'Dusk falls, a firefly wanders, every eye follows it — until it lands on someone’s nose.', run: funFireflies },
  { fx: 'whisper', key: 'fun:wh', glyph: '…', zh: '传悄悄话', en: 'Telephone', zhDesc: '一句话一个传一个，越传越走样；最后一位喊出来，全场笑翻。', desc: 'A whisper passes down the line and drifts; the last one shouts it out.', run: funWhisper },
  { fx: 'squareDance', key: 'fun:sd', glyph: '♫', zh: '广场舞', en: 'Square dance', zhDesc: '四段舞步：踏步、跳拍、甩头、扭腰，配鼓点和彩色追光。', desc: 'Four figures — step, hop, sway, twist — with a beat and coloured spotlights.', run: funDance },
  { fx: 'peekaboo', key: 'fun:pk', glyph: '☺', zh: '躲猫猫', en: 'Peekaboo', zhDesc: '全场一起缩没了，再一个个冒出来喊"哇！"；总有一个最后才探头。', desc: 'Everyone ducks out of sight and pops back up one by one — someone is always last.', run: funPeekaboo }
];
(function funEntries() {
  FUN_MOVES.forEach(function (M) {
    TRIG[M.fx] = M.run; TRIG_NAMES[M.fx] = M.en.toLowerCase(); KEYMAP[M.key] = M.fx; KEYINFO[M.key] = [M.en, M.desc, 'action'];
    UI_PAIRS.push([M.zh, M.en], [M.zhDesc, M.desc]);
  });
  UI_PAIRS.push(['趣味', 'Fun'], ['天黑了……有只萤火虫', 'Dusk… a firefly']);
  if (typeof KBROWS !== 'undefined') KBROWS.push(FUN_MOVES.map(function (M) { return M.key; }));
  var menu = document.querySelector('.playMoreMenu');
  if (menu) {
    var lab = document.createElement('div'); lab.className = 'playLabel'; lab.style.cssText = 'margin:2px 0 0;font-size:11px;opacity:.7'; lab.textContent = uiText('趣味'); menu.appendChild(lab);
    FUN_MOVES.forEach(function (M) { var b = document.createElement('button'); b.type = 'button'; b.textContent = uiText(M.zh); b.addEventListener('click', function () { fire(M.fx); }); menu.appendChild(b); });
  }
  var baseKb = buildKb;
  buildKb = function () {
    baseKb();
    Array.prototype.forEach.call(document.querySelectorAll('#kb .cap'), function (cap) {
      var M = FUN_MOVES.filter(function (m) { return cap.firstChild && cap.firstChild.textContent === m.key.toUpperCase(); })[0];
      if (!M) return;
      cap.firstChild.textContent = M.glyph; cap.setAttribute('aria-label', uiText(M.zh));
      var row = cap.parentNode;
      if (row && !row.querySelector('.kbzone')) { var z = document.createElement('span'); z.className = 'kbzone'; z.textContent = uiText('趣味'); row.insertBefore(z, row.firstChild); }
    });
  };
})();

/* ========== 六、大合影：队形 ========== */
PHOTO_STYLES.push('heart', 'pyramid', 'sunflower');
PHOTO_STYLE_ZH.heart = '心形'; PHOTO_STYLE_ZH.pyramid = '叠罗汉'; PHOTO_STYLE_ZH.sunflower = '向日葵';
var funBasePose = photoPose;
photoPose = function (style) {
  if (['heart', 'pyramid', 'sunflower'].indexOf(style) < 0) return funBasePose(style);
  var list = heads.filter(function (h) { return !h.hidden; }), n = list.length, out = [];
  var rnd = photoRand((Date.now() / 1000) | 0), cx = W / 2, cy = H * .52;
  var baseS = n ? list.reduce(function (a, h) { return a + h.s; }, 0) / n : 40;
  if (style === 'heart') {
    var P = [], len = [0];
    for (var i = 0; i <= 400; i++) { var t = i / 400 * TAU; P.push([16 * Math.pow(Math.sin(t), 3), -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]); if (i) len.push(len[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1])); }
    var sc = Math.min(W * .40 / 16, H * .36 / 16), outerN = n > 30 ? Math.round(n * .7) : n;
    var place = function (m, shrink, off, sizeK) {
      for (var j = 0; j < m; j++) {
        var target = (j + off) / m * len[400], q = 0; while (q < 400 && len[q] < target) q++;
        out.push({ h: list[out.length], x: cx + P[q][0] * sc * shrink, y: cy + (P[q][1] + 2.5) * sc * shrink, s: baseS * sizeK * (.95 + rnd() * .1), roll: (rnd() - .5) * .12 });
      }
    };
    place(outerN, 1, 0, .86);
    if (n > outerN) place(n - outerN, .5, .5, .72);
  } else if (style === 'pyramid') {
    var m = Math.ceil((Math.sqrt(8 * n + 1) - 1) / 2), dx = Math.min(baseS * 1.45, W * .9 / m), dy = Math.min(baseS * 1.28, H * .82 / m), s2 = Math.min(baseS, dx / 1.45), idx = 0;
    for (var r = 0; r < m && idx < n; r++) {
      var cnt = Math.min(r + 1, n - idx);
      for (var c = 0; c < cnt; c++, idx++) out.push({ h: list[idx], x: cx + (c - (cnt - 1) / 2) * dx, y: cy + (r - (m - 1) / 2) * dy, s: s2 * (.95 + rnd() * .08), roll: (rnd() - .5) * .08 });
    }
  } else {
    var Rmax = Math.min(W * .42, H * .42 / .8), cc = Rmax / Math.sqrt(n);
    list.forEach(function (h, i2) { var rr = cc * Math.sqrt(i2 + .5), a = i2 * 2.39996; out.push({ h: h, x: cx + rr * Math.cos(a), y: cy + rr * Math.sin(a) * .8, s: baseS * (1.12 - .38 * Math.sqrt(i2 / n)), roll: (rnd() - .5) * .1 }); });
  }
  out.forEach(function (o) { var pad = o.s * .9; o.x = Math.max(pad, Math.min(W - pad, o.x)); o.y = Math.max(pad * .8, Math.min(H - pad * .5, o.y)); });
  return out;
};

/* ========== 七、大合影：倒数、正对镜头、拍照瞬间 ========== */
['photoMoment', 'photoCount'].forEach(function (k) {
  CFG_DEFAULT[k] = CFG_DEFAULT[k] == null ? (k === 'photoMoment' ? 'random' : 'on') : CFG_DEFAULT[k];
  CFG[k] = CFG[k] == null ? CFG_DEFAULT[k] : CFG[k];
  if (SHARE_KEYS.indexOf(k) < 0) SHARE_KEYS.push(k);
});
var FUN_MOMENTS = ['jump', 'caps', 'confetti', 'photobomb', 'blink'];
var FUN_MOMENT_ZH = { none: '不加', jump: '跳跳照', caps: '抛帽', confetti: '礼花', photobomb: '抢镜', blink: '有人闭眼', random: '每次随机' };
defineFx('photoSmile', { channels: ['gaze'], prio: PRIO.ACTION, dur: 1500,
  step: function (h, a, t, k, d) { d.yaw = 0; d.pitch = .03; d.gazeX = 0; d.gazeY = 0; d.smile = 1; d.mouth = .16; d.brow = .35; d.eye = 0; } });
defineFx('photoShut', { channels: ['face'], prio: PRIO.REACT, dur: 900,
  step: function (h, a, t, k, d) { d.eye = 1; d.smile = .4; } });
defineFx('photoJump', { channels: C_NECK, prio: PRIO.REACT, dur: 1000,
  step: function (h, a, t, k, d) { var e = bump(k); d.oy = -(a.amp || .5) * e; d.roll = (a.tilt || 0) * e; d.smile = 1; d.mouth = .3 * e; d.eye = 0; d.brow = .6 * e; if (String(CFG.neckMode || 'follow') !== 'pop' && e > .15) d.neck = 'long'; } });
defineFx('photoBomb', { channels: ['gaze'], prio: PRIO.REACT, dur: 1600,
  step: function (h, a, t, k, d) { d.yaw = -.35; d.pitch = .08; d.smile = 1; d.mouth = .38; d.brow = 1; d.tongueOut = .8; d.eye = 0; d.gazeX = -.6; } });

function funPickMoment(classMode) {
  var m = String(CFG.photoMoment || 'random');
  var pool = classMode ? ['caps', 'confetti'] : FUN_MOMENTS;
  if (m === 'none') return 'none';
  if (m === 'random' || pool.indexOf(m) < 0) return pool[Math.floor(Math.random() * pool.length)];
  return m;
}
function funCountdown(at) {
  var el = document.getElementById('photoCount');
  if (!el) { el = document.createElement('div'); el.id = 'photoCount'; el.setAttribute('aria-live', 'assertive'); document.body.appendChild(el); }
  var words = ['3', '2', '1', qxLocal('茄子！', 'Cheese!')];
  words.forEach(function (w, i) {
    setTimeout(function () {
      if (!PHOTO.active) { el.className = ''; return; }
      el.textContent = w; el.className = ''; void el.offsetWidth; el.className = 'show' + (i === 3 ? ' say' : '');
      if (SOUND) try { i < 3 ? SFX.thunk(0) : SFX.chime(0); } catch (e) {}
    }, Math.max(0, at - performance.now()) + i * 420);
  });
  setTimeout(function () { el.className = ''; }, Math.max(0, at - performance.now()) + 4 * 420 + 250);
}
function funMoment(kind) {
  var T = PHOTO.targets || [], wait = PHOTO.shotAt - performance.now();
  if (!T.length) return;
  var avgS = T.reduce(function (a, o) { return a + o.s; }, 0) / T.length;
  PHOTO.extraTop = kind === 'jump' ? avgS * 1.25 : kind === 'caps' ? avgS * 1.6 : 0;
  var at = function (ms, fn) { setTimeout(function () { if (PHOTO.active) fn(); }, Math.max(0, wait - ms)); };
  if (kind === 'jump') at(500 / CFG.speed, function () { T.forEach(function (o) { act(o.h, 'photoJump', { amp: .75 + Math.random() * .45, tilt: (Math.random() - .5) * .34 }); }); FUN.jumpUntil = performance.now() + 1000 / CFG.speed; if (SOUND) try { SFX.whoosh(0, .5); } catch (e) {} });
  // 帽子在快门那一刻正好到最高点：T=0.75s 升 1.7 个头高 → g = 2H/T²，v = gT
  else if (kind === 'caps') at(750, function () { T.forEach(function (o, i) { if (Math.random() < .8) { var up = 1.5 + Math.random() * .5, g = 2 * up * o.s / .5625; FUN.parts.push({ last: performance.now(), kind: 'cap', x: o.x + (Math.random() - .5) * o.s * .4, y: o.y - o.s * .9, s: o.s, vx: (Math.random() - .5) * o.s * 1.2, vy: -g * .75, g: g, rot: Math.random() * TAU, vr: (Math.random() - .5) * 9, t: 0, life: 2.4 }); } }); });
  else if (kind === 'confetti') at(650, function () {
    var minX = 1e9, maxX = -1e9, maxY = -1e9; T.forEach(function (o) { minX = Math.min(minX, o.x); maxX = Math.max(maxX, o.x); maxY = Math.max(maxY, o.y + o.s); });
    var colsC = ['#d9534f', '#f0ad4e', '#5bc0de', '#5cb85c', '#9b59b6', '#f7d44c', '#e87aa0'];
    [[minX - avgS * .5, 1], [maxX + avgS * .5, -1]].forEach(function (src) {
      for (var i = 0; i < 110; i++) { var sp = avgS * (9 + Math.random() * 9), a = -Math.PI / 2 + src[1] * (.2 + Math.random() * .6); FUN.parts.push({ last: performance.now(), kind: 'conf', x: src[0], y: maxY, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: avgS * 5, drag: 1.2, rot: Math.random() * TAU, vr: (Math.random() - .5) * 14, w: avgS * (.18 + Math.random() * .14), col: colsC[i % colsC.length], t: 0, life: 3 }); }
    });
    if (SOUND) try { SFX.pop(0, 900); SFX.pop(0, 700); } catch (e) {}
  });
  else if (kind === 'photobomb') at(650, function () {
    var cand = T.filter(function (o) { return Math.abs(o.x - W / 2) > W * .12; }), o = (cand.length ? cand : T)[Math.floor(Math.random() * (cand.length || T.length))];
    var maxX = -1e9, maxY = -1e9; T.forEach(function (q) { if (q !== o) { maxX = Math.max(maxX, q.x); maxY = Math.max(maxY, q.y); } });
    o.x = Math.min(W - avgS * 1.3, maxX + avgS * .2); o.y = Math.min(H - avgS * .6, maxY + avgS * .35); o.s = avgS * 1.5; o.roll = .24;
    var hi = heads.indexOf(o.h); if (hi >= 0) { PHOTO.bombIndex = hi; heads.splice(hi, 1); heads.push(o.h); }
    act(o.h, 'photoBomb'); if (SOUND) try { SFX.raspberry(panOf(o.h)); } catch (e) {}
  });
  else if (kind === 'blink') at(260, function () { var k2 = T.length > 12 ? 2 : 1; T.slice().sort(function () { return Math.random() - .5; }).slice(0, k2).forEach(function (o) { act(o.h, 'photoShut'); }); PHOTO.blinked = true; });
}
function funShadowsDraw(now) {
  if (!FUN.jumpUntil) return;
  if (now > FUN.jumpUntil || !PHOTO.targets) { FUN.jumpUntil = 0; return; }
  ctx.save(); ctx.fillStyle = 'rgba(60,50,40,.16)';
  PHOTO.targets.forEach(function (o) { var lift = o.h.lastO ? Math.max(0, -o.h.lastO.oy) : 0; var r = o.s * (1.0 - Math.min(.5, lift * .35)); ctx.beginPath(); ctx.ellipse(o.x, o.y + o.s * 1.5, r, r * .18, 0, 0, TAU); ctx.fill(); });
  ctx.restore();
}
function funPartsDraw(now) {
  if (!FUN.parts.length) return;
  FUN.parts = FUN.parts.filter(function (p) { return p.t < p.life; });
  FUN.parts.forEach(function (p) {
    // 按真实时间积分（慢机掉帧时也要在快门那一刻飞到位），每步 ≤16ms
    var left = Math.min(.4, (now - (p.last || now)) / 1000); p.last = now;
    while (left > 0) {
      var dt = Math.min(.016, left); left -= dt;
      p.t += dt; if (p.drag) { p.vx *= Math.exp(-p.drag * dt); p.vy *= Math.exp(-p.drag * dt * .6); }
      p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
    }
    var fade = Math.min(1, (p.life - p.t) * 2.5);
    ctx.save(); ctx.globalAlpha = fade; ctx.translate(p.x, p.y);
    if (p.kind === 'cap') {
      var s = p.s * .5; ctx.rotate(Math.sin(p.rot) * .5);
      ctx.fillStyle = '#2e2b36'; ctx.beginPath(); ctx.moveTo(0, -s * .45); ctx.lineTo(s, 0); ctx.lineTo(0, s * .45); ctx.lineTo(-s, 0); ctx.closePath(); ctx.fill();
      ctx.fillRect(-s * .45, s * .05, s * .9, s * .32);
      ctx.strokeStyle = '#d9a441'; ctx.lineWidth = Math.max(1, s * .06); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s * .55, s * .12); ctx.lineTo(s * .6, s * .55 + Math.sin(p.rot * 2) * s * .08); ctx.stroke();
      ctx.fillStyle = '#d9a441'; ctx.beginPath(); ctx.arc(0, 0, s * .07, 0, TAU); ctx.fill();
    } else {
      ctx.rotate(p.rot); ctx.scale(1, Math.cos(p.rot * 1.7)); ctx.fillStyle = p.col; ctx.fillRect(-p.w / 2, -p.w * .3, p.w, p.w * .6);
    }
    ctx.restore();
  });
}
var funBaseStart = photoStart;
photoStart = function () {
  funBaseStart.apply(this, arguments);
  if (!PHOTO.active) return;
  var classMode = typeof CLASS !== 'undefined' && CLASS && CLASS.active;
  PHOTO.extraTop = 0; PHOTO.blinked = false; PHOTO.bombIndex = -1;
  if (String(CFG.photoCount || 'on') !== 'off') { PHOTO.shotAt += 1700; funCountdown(PHOTO.t0 + 1150); }
  if (!classMode) setTimeout(function () { if (PHOTO.active) (PHOTO.targets || []).forEach(function (o) { act(o.h, 'photoSmile'); }); }, Math.max(0, PHOTO.shotAt - performance.now() - 700));
  PHOTO.moment = funPickMoment(classMode);
  if (PHOTO.moment !== 'none') funMoment(PHOTO.moment);
};
var funBaseBox = photoBoxOf;
photoBoxOf = function (src) {
  var b = funBaseBox(src);
  if (PHOTO.extraTop && PHOTO.targets && PHOTO.targets.length) { var k = src.width / Math.max(1, W), ny = Math.max(0, b.y - Math.round(PHOTO.extraTop * k)); b.h += b.y - ny; b.y = ny; }
  return b;
};
var funBaseEnd = photoEnd;
photoEnd = function (restore) {
  if (PHOTO.bombIndex >= 0) { var h = heads.pop(); heads.splice(PHOTO.bombIndex, 0, h); PHOTO.bombIndex = -1; }
  var r = funBaseEnd.apply(this, arguments);
  if (PHOTO.blinked && typeof toast === 'function') setTimeout(function () { toast(qxLocal('有人闭眼了——按 R 重拍？', 'Someone blinked — press R to reshoot?'), 2600); }, 400);
  return r;
};

/* ========== 八、相框 +3：年画 / 趣像日报 / 卷轴 ========== */
var FUN_FRAMES = { nianhua: ['年画', 'New Year print'], news: ['趣像日报', 'Front page'], scroll: ['卷轴', 'Hanging scroll'] };
Object.keys(FUN_FRAMES).forEach(function (f) { LAB_FRAMES.push(f); LAB_FRAME_LABEL[f] = FUN_FRAMES[f]; });
function funCnNum(n) { return String(n).split('').map(function (c) { return '〇一二三四五六七八九'[+c] || c; }).join(''); }
function funWho() { return (typeof CLASS !== 'undefined' && CLASS && CLASS.active && CLASS.name) ? CLASS.name : qxLocal('全班', 'The class'); }
function funCount() { return PHOTO.targets ? PHOTO.targets.length : heads.length; }
function funSerif(x, px, weight) { x.font = (weight || '600') + ' ' + Math.max(6, Math.round(px)) + 'px "Noto Serif SC","Songti SC","STSong",serif'; }
function funSeal(x, cx, cy, sz, txt) {
  x.fillStyle = 'rgba(172,54,42,.92)'; x.fillRect(cx - sz / 2, cy - sz / 2, sz, sz);
  x.fillStyle = '#fdf6ec'; funSerif(x, sz * .62); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt || '趣', cx, cy + sz * .04);
}
function funFrameNianhua(inner) {
  var w = inner.width, h = inner.height, pad = Math.round(w * .08), top = Math.round(w * .14), bot = Math.round(w * .11);
  var out = document.createElement('canvas'); out.width = w + pad * 2; out.height = h + top + bot; var x = out.getContext('2d');
  var red = '#b3302a', gold = '#e0b04f', W2 = out.width, H2 = out.height, u = W2 / 100;
  x.fillStyle = red; x.fillRect(0, 0, W2, H2);
  x.strokeStyle = gold; x.lineWidth = Math.max(1, u * .5); x.strokeRect(u * 1.6, u * 1.6, W2 - u * 3.2, H2 - u * 3.2);
  x.lineWidth = Math.max(1, u * .2); x.strokeRect(u * 2.5, u * 2.5, W2 - u * 5, H2 - u * 5);
  x.fillStyle = '#f6e7c8'; x.fillRect(pad - u * 1.2, top - u * 1.2, w + u * 2.4, h + u * 2.4);
  x.drawImage(inner, pad, top);
  x.fillStyle = gold; x.textAlign = 'center'; x.textBaseline = 'middle'; funSerif(x, top * .42, '700');
  x.fillText(funWho() + qxLocal(' · 阖家欢', ' · All together'), W2 / 2, top * .55);
  for (var sg = -1; sg <= 1; sg += 2) {
    var cx = W2 / 2 + sg * (W2 * .36), cy = top * .55;
    x.save(); x.strokeStyle = gold; x.lineWidth = Math.max(1, u * .35); x.beginPath();
    for (var j = 0; j < 3; j++) x.arc(cx + sg * j * u * 2.4, cy + (j % 2 ? u * .8 : 0), u * 1.6, Math.PI * .1, Math.PI * 1.6);
    x.stroke(); x.restore();
  }
  [[pad * .5, top * .5], [W2 - pad * .5, top * .5], [pad * .5, H2 - bot * .5], [W2 - pad * .5, H2 - bot * .5]].forEach(function (p, i) {
    var sz = Math.min(pad, bot) * .7; x.save(); x.translate(p[0], p[1]); x.rotate(Math.PI / 4); x.fillStyle = gold; x.fillRect(-sz / 2, -sz / 2, sz, sz); x.restore();
    x.save(); x.translate(p[0], p[1]); if (i < 2) x.rotate(Math.PI); x.fillStyle = red; funSerif(x, sz * .72, '700'); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('福', 0, sz * .03); x.restore();
  });
  var d = new Date(); x.fillStyle = gold; funSerif(x, bot * .3); x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(qxLocal('吉祥如意 · ' + funCount() + ' 位 · ' + d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate(), 'Good fortune · ' + funCount() + ' of us · ' + d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate()), W2 / 2, H2 - bot * .5);
  return out;
}
function funFrameNews(inner) {
  var w = inner.width, h = inner.height, pad = Math.round(w * .06), mast = Math.round(w * .2), below = Math.round(w * .22);
  var out = document.createElement('canvas'); out.width = w + pad * 2; out.height = h + mast + below; var x = out.getContext('2d'), W2 = out.width, u = W2 / 100;
  x.fillStyle = '#f2eee3'; x.fillRect(0, 0, W2, out.height);
  x.fillStyle = '#1d1b18'; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; funSerif(x, mast * .36, '900');
  x.fillText(qxLocal('趣 像 日 报', 'THE QU XIANG DAILY'), W2 / 2, mast * .42);
  x.fillRect(pad, mast * .5, W2 - pad * 2, Math.max(1, u * .5)); x.fillRect(pad, mast * .72, W2 - pad * 2, Math.max(1, u * .2));
  var d = new Date(), wk = '日一二三四五六'[d.getDay()]; funSerif(x, mast * .09, '500');
  x.fillText(qxLocal('第 ' + (100 + d.getDate() * 7) + ' 期 · ' + d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 星期' + wk + ' · 拾趣馆出版', 'No. ' + (100 + d.getDate() * 7) + ' · ' + d.toDateString() + ' · Curiosity Hall Press'), W2 / 2, mast * .64);
  var n = funCount(), m = PHOTO.moment;
  var head = { jump: ['全员腾空！' + n + ' 位同时起跳', 'Lift-off! All ' + n + ' jump at once'], caps: ['毕业啦！帽子满天飞', 'Caps in the air!'], confetti: ['礼花齐放 · ' + n + ' 位合影留念', 'Confetti for all ' + n], photobomb: ['惊现抢镜者！', 'Photobomb spotted!'], blink: ['有人闭眼了，本报记者表示很无奈', 'Someone blinked. Our photographer sighs'] }[m] || ['号外！' + n + ' 位齐聚一堂', 'Extra! ' + n + ' gather for one photo'];
  funSerif(x, mast * .2, '800'); x.fillText(qxLocal(head[0], head[1]), W2 / 2, mast * .93);
  var g = document.createElement('canvas'); g.width = w; g.height = h; var gx = g.getContext('2d'); gx.drawImage(inner, 0, 0);
  try { var img = gx.getImageData(0, 0, w, h), px = img.data; for (var i = 0; i < px.length; i += 4) { var yv = px[i] * .3 + px[i + 1] * .59 + px[i + 2] * .11; yv = clamp((yv - 128) * 1.18 + 128 + 6, 0, 255); px[i] = px[i + 1] = px[i + 2] = yv; } gx.putImageData(img, 0, 0); } catch (e) {}
  x.drawImage(g, pad, mast); g.width = g.height = 1;
  x.strokeStyle = '#1d1b18'; x.lineWidth = Math.max(1, u * .2); x.strokeRect(pad, mast, w, h);
  x.textAlign = 'left'; funSerif(x, below * .1, '500'); x.fillText(qxLocal('▲ 本报记者 摄', '▲ Staff photographer'), pad, mast + h + below * .14);
  var colW = (w - pad) / 2, y0 = mast + h + below * .26, rnd = photoRand(d.getDate() * 97 + n);
  x.fillStyle = 'rgba(40,36,30,.55)';
  for (var c = 0; c < 2; c++) for (var l = 0; l < 6; l++) { var lw = colW * (l === 5 ? .55 : .9 + rnd() * .1); x.fillRect(pad + c * (colW + pad), y0 + l * below * .115, lw * .98, Math.max(1, below * .035)); }
  return out;
}
function funFrameScroll(inner) {
  var w = inner.width, h = inner.height, side = Math.round(w * .06), top = Math.round(w * .2), bot = Math.round(w * .13), rod = Math.round(w * .035);
  var out = document.createElement('canvas'); out.width = w + side * 2 + rod * 2; out.height = h + top + bot + rod * 2; var x = out.getContext('2d'), W2 = out.width, H2 = out.height, u = W2 / 100;
  x.fillStyle = '#c9d3c9'; x.fillRect(rod, rod, W2 - rod * 2, H2 - rod * 2);
  x.strokeStyle = 'rgba(255,255,255,.18)'; x.lineWidth = 1; for (var k = -H2; k < W2; k += Math.max(4, u * 1.2)) { x.beginPath(); x.moveTo(k, rod); x.lineTo(k + H2, H2 - rod); x.stroke(); }
  var ix = rod + side, iy = rod + top;
  x.fillStyle = '#efe8d6'; x.fillRect(ix - u * 1.1, iy - u * 1.1, w + u * 2.2, h + u * 2.2);
  x.drawImage(inner, ix, iy);
  x.fillStyle = '#9fae9f'; [-.18, .18].forEach(function (f) { x.fillRect(W2 / 2 + f * W2 - u * .7, rod, u * 1.4, top * .92); });
  x.fillStyle = '#3a342c'; x.textAlign = 'center'; x.textBaseline = 'middle'; funSerif(x, top * .16, '600');
  var d = new Date(); x.fillText(qxLocal('趣像雅集 · ' + funCnNum(d.getFullYear()) + '年', 'Qu Xiang gathering · ' + d.getFullYear()), W2 / 2, rod + top * .55);
  funSeal(x, ix + w - u * 2.6, iy + h - u * 2.6, u * 3.2, '趣');
  var wood = function (y, hgt, knob) {
    var gr = x.createLinearGradient(0, y, 0, y + hgt); gr.addColorStop(0, '#6b4a33'); gr.addColorStop(.5, '#8a6444'); gr.addColorStop(1, '#4a3222');
    x.fillStyle = gr; x.fillRect(knob ? rod * .2 : rod * .6, y, W2 - (knob ? rod * .4 : rod * 1.2), hgt);
    if (knob) { x.fillStyle = '#c9a24a'; x.fillRect(0, y - hgt * .1, rod * .6, hgt * 1.2); x.fillRect(W2 - rod * .6, y - hgt * .1, rod * .6, hgt * 1.2); }
  };
  wood(0, rod, false); wood(H2 - rod * 1.3, rod * 1.3, true);
  return out;
}
var funBaseCompose = photoCompose;
photoCompose = function (frame, scale) {
  if (!FUN_FRAMES[frame]) return funBaseCompose.apply(this, arguments);
  var raw = funBaseCompose('raw', scale); if (!raw || !raw.canvas) return raw;
  var out = frame === 'nianhua' ? funFrameNianhua(raw.canvas) : frame === 'news' ? funFrameNews(raw.canvas) : funFrameScroll(raw.canvas);
  raw.canvas.width = raw.canvas.height = 1;
  return { canvas: out, name: 'quxiang-photo-' + frame + '.png' };
};

/* ========== 九、设置与词条 ========== */
(function funPanel() {
  var grp = null;
  PANEL.forEach(function (G) { if ((G.items || []).some(function (it) { return it.id === 'photoStyle'; })) grp = G; });
  if (!grp) return;
  grp.items.forEach(function (it) {
    if (it.id === 'photoStyle') it.opts.push(['heart', '心形'], ['pyramid', '叠罗汉'], ['sunflower', '向日葵']);
    if (it.id === 'photoFrame') it.opts.push(['nianhua', '年画'], ['news', '趣像日报'], ['scroll', '卷轴']);
  });
  var at = grp.items.findIndex(function (it) { return it.id === 'photoFrame'; });
  grp.items.splice(at + 1, 0,
    { id: 'photoMoment', label: '拍照瞬间', type: 'seg', opts: [['random', '每次随机'], ['none', '不加'], ['jump', '跳跳照'], ['caps', '抛帽'], ['confetti', '礼花'], ['photobomb', '抢镜'], ['blink', '有人闭眼']] },
    { id: 'photoCount', label: '倒数', type: 'seg', opts: [['on', '3·2·1·茄子'], ['off', '直接拍']] });
  UI_PAIRS.push(['心形', 'Heart'], ['叠罗汉', 'Pyramid'], ['向日葵', 'Sunflower'], ['年画', 'New Year print'], ['趣像日报', 'Front page'], ['卷轴', 'Hanging scroll'],
    ['拍照瞬间', 'Shutter moment'], ['跳跳照', 'Jump shot'], ['抛帽', 'Cap toss'], ['礼花', 'Confetti'], ['抢镜', 'Photobomb'], ['有人闭眼', 'Someone blinks'], ['不加', 'None'],
    ['倒数', 'Countdown'], ['3·2·1·茄子', '3·2·1·Cheese'], ['直接拍', 'Shoot at once'], ['有人闭眼了——按 R 重拍？', 'Someone blinked — press R to reshoot?'],
    ['← → 换相框 · 1–7 直选 · P 存展板 · W 送展墙 · 点背景关闭', '← → change frame · 1–7 pick · P poster · W wall · click outside to cancel']);
  var st = document.createElement('style');
  st.textContent = '#photoCount{position:fixed;left:50%;top:30%;z-index:47;pointer-events:none;transform:translate(-50%,-50%) scale(.5);opacity:0;' +
    'font:700 min(26vw,170px)/1 "Noto Serif SC","Songti SC",serif;color:#fffdf4;text-shadow:0 4px 24px rgba(40,30,20,.45),0 0 2px rgba(40,30,20,.6);transition:none}' +
    '#photoCount.show{animation:qxCount .42s ease-out forwards}#photoCount.say{font-size:min(15vw,110px);color:#ffe9a8}' +
    '@keyframes qxCount{0%{opacity:0;transform:translate(-50%,-50%) scale(1.5)}35%{opacity:.95;transform:translate(-50%,-50%) scale(1)}100%{opacity:.0;transform:translate(-50%,-50%) scale(.85)}}' +
    '@media(prefers-reduced-motion:reduce){#photoCount.show{animation:none;opacity:.9;transform:translate(-50%,-50%)}}' +
    '.ql-frames{flex-wrap:wrap}';
  document.head.appendChild(st);
})();

/* ========== 十、每帧：萤火、气泡、追光、彩纸（画在舞台上，所以合影能拍到） ========== */
var funBaseGrid = drawGrid;
drawGrid = function (dt, now) {
  funFireflyStep(now);
  var r = funBaseGrid.apply(this, arguments);
  if (!FUN.ff && !FUN.bubbles.length && !FUN.dance && !FUN.parts.length && !FUN.jumpUntil) return r;
  try {
    ctx = gctx; ctx.save(); ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    funShadowsDraw(now); funDanceDraw(now); funFireflyDraw(now); funPartsDraw(now); funBubblesDraw(now);
    ctx.restore();
  } catch (e) { try { ctx.restore(); } catch (e2) {} }
  return r;
};
try { window.__fun = { get state() { return { ff: !!FUN.ff, bubbles: FUN.bubbles.length, dance: !!FUN.dance, parts: FUN.parts.length, moment: PHOTO.moment }; }, fire: function (n) { fire(n); } }; } catch (e) {}
