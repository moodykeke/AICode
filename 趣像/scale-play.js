/* 趣像 08 (r22): 音阶弹跳——把 42 张脸变成一件乐器
   设计要点
   1) 点击（轻触）角色 → 它弹跳一下并发出一个音。
   2) 音高不是固定映射：进入时随机抽出 **五声调式 + 调 + 偏移 + 走向 + 基八度**，
      再按网格位置铺开成"音阶格子"——
         · 左右相邻差一个音级，向右走就是一段上行；
         · 每往下一行多走两级，于是斜着点会得到三度和音/琶音；
         · 八度按行递降，上排高、下排低。
      因为是五声，随便点都不会难听；因为每次随机，同一个人不会每次听到同一串音。
   3) 指定乐曲：曲子用**音级**记谱（不写死频率），所以换任何调式都能原样奏出来；
      演奏时匹配"当前调式里离该音级最近的那张脸"，让它按拍子弹跳——头部随乐舞动。
   音色复用应用自带的 SFX.marimba（木质马林巴），与"挥手"同一件乐器。 */

var SCALE_MODES = {
  gong: { zh: '宫', steps: [0, 2, 4, 7, 9] },
  shang: { zh: '商', steps: [0, 2, 5, 7, 10] },
  jiao: { zh: '角', steps: [0, 3, 5, 7, 10] },
  zhi: { zh: '徵', steps: [0, 2, 5, 7, 9] },
  yu: { zh: '羽', steps: [0, 3, 5, 8, 10] },
};
var SCALE_ROOTS = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00];   // C D E F G A
var TUNES = [
  { id: 'star', zh: '小星星', en: 'Twinkle', bpm: 132, seq: [0,0,4,4,5,5,4, 3,3,2,2,1,1,0] },
  { id: 'joy', zh: '欢乐颂', en: 'Ode to Joy', bpm: 126, seq: [2,2,3,4,4,3,2,1,0,0,1,2,2,1,1] },
  { id: 'jasmine', zh: '茉莉花', en: 'Jasmine', bpm: 108, seq: [3,3,4,5,4,3,2,2,3,4,3,3,2,1,0] },
];
var PLAY = { scale: null, tune: null, timer: null, seq: 0 };

function playRandomScale(){
  var modeKeys = Object.keys(SCALE_MODES);
  var modeKey = (typeof CFG !== 'undefined' && CFG.scaleMode && SCALE_MODES[CFG.scaleMode]) ? CFG.scaleMode
    : modeKeys[Math.floor(Math.random() * modeKeys.length)];
  PLAY.scale = {
    key: modeKey,
    steps: SCALE_MODES[modeKey].steps,
    root: SCALE_ROOTS[Math.floor(Math.random() * SCALE_ROOTS.length)],
    shift: Math.floor(Math.random() * 5),
    dir: Math.random() < 0.5 ? 1 : -1,          // 走向也随机：有时向右升，有时向右降
    downStep: 1 + Math.floor(Math.random() * 3),// 每往下一行走几个音级（1–3）
  };
  return PLAY.scale;
}
/** 每张脸在"音阶格子"里的位置：列 → 音级，行 → 音级+八度 */
function scaleSlot(h){
  var S = PLAY.scale || playRandomScale();
  var deg = (h.col * S.dir + h.row * S.downStep) + S.shift;
  var idx = ((deg % 5) + 5) % 5;
  var oct = Math.floor(deg / 5);
  oct = Math.max(-1, Math.min(1, oct));         // 两个八度之内，别跑到耳朵外面
  return { idx: idx, oct: oct, key: idx + ':' + oct };
}
function pitchAt(slot){
  var S = PLAY.scale || playRandomScale();
  return S.root * Math.pow(2, slot.oct) * Math.pow(2, S.steps[slot.idx] / 12);
}
/** 弹跳：给这张脸一个上抛初速，靠重力落回 */
function bounce(h, power){
  var f = feelState(h);
  f.vy = Math.max(-3.2, -(2.0 + (power || 0) * 1.4));   // 连击也不越顶
  f.vx += (Math.random() - 0.5) * 0.35;
  f.rv += (Math.random() - 0.5) * 0.9;
}
function noteAt(h, slot, gain){
  var f = feelState(h);
  bounce(h, 0.4 + Math.min(1, slot.oct + 1) * 0.3);
  f.sway = (f.sway || 0) + 1;                    // 随乐轻摆的计数器
  var pan = panOf(h);
  if (typeof SOUND !== 'undefined' && SOUND) {
    // 走音色库（设置里可换乐器）；旧路径留作兜底
    if (typeof playNote === 'function') playNote(pitchAt(slot), pan, gain ? gain * 1.15 : 0.10);
    else { try { SFX.marimba(pitchAt(slot), pan); } catch (e) { tone({ f: pitchAt(slot), dur: 0.5, gain: gain || 0.06, type: 'triangle', pan: pan }); } }
  }
}
/** 轻触角色 → 弹跳 + 一个音（挂在触感设计的"轻触回应"之后） */
var playBasePat = feelPat;
feelPat = function(h){
  playBasePat(h);
  if (!h) return;
  noteAt(h, scaleSlot(h));
};

/* ── 指定乐曲：按音级匹配最近的脸，按拍子弹跳 ── */
function stopTune(){ if (PLAY.timer) { clearTimeout(PLAY.timer); PLAY.timer = null; } PLAY.tune = null; }
function playTune(tune){
  if (!tune) return;
  stopTune();
  if (!PLAY.scale) playRandomScale();
  PLAY.tune = tune.id;
  var beat = 60000 / tune.bpm, i = 0;
  heads.forEach(function(h){ h.__seq = null; });
  function step(){
    if (i >= tune.seq.length) { PLAY.timer = setTimeout(function(){ PLAY.tune = null; }, beat); return; }
    var want = tune.seq[i++];
    var pool = [], best = null, bd = 1e9;
    // 该音级在格子里的所有脸里，挑最靠上、最靠左且本轮还没被点过的一张（像真的在键盘上走）
    heads.forEach(function(h){
      var s = scaleSlot(h);
      var d = Math.abs(s.idx - (want % 5)) + Math.abs(s.oct - Math.floor(want / 5)) * 0.35;
      if (h.__seq) d += 1.2;
      if (d < bd) { bd = d; best = h; }
    });
    if (best) { best.__seq = 1; noteAt(best, scaleSlot(best), 0.075); }
    PLAY.timer = setTimeout(step, beat);
  }
  step();
}

/** 换一首：按曲目表循环（键盘 | 与表演条按钮共用） */
function cycleTune(){
  PLAY.cycle = ((PLAY.cycle == null ? -1 : PLAY.cycle) + 1) % TUNES.length;   // 记进度，曲终后再按也接着换
  var i = PLAY.cycle;
  playTune(TUNES[i]);
  if (typeof toast === 'function') toast('奏一段：' + TUNES[i].zh, 1800);
}

/* ── 头部随乐舞动：有音符余韵时全场轻轻摆动 ── */
var playFeelUpdate = Head.prototype.update;
Head.prototype.update = function(dt, now, look){
  var f = this.__feel;
  if (f && f.sway){
    f.sway = Math.max(0, f.sway - dt * 1.15);
    f.rv += Math.sin(now / 190 + (f.phase || (f.phase = Math.random() * 6.28))) * f.sway * 0.05;
  }
  return playFeelUpdate.apply(this, arguments);
};

/* ── 入口：表演条里加"奏一段"，另有键盘（< 弹一遍 / > 换调 / | 换一首）
   键位说明：; 与 ' 已归「大合照 / 看照片」（group-photo、photo-lab），这里让开。── */
(function scaleEntries(){
  var menu = document.querySelector('.playMoreMenu');
  if (menu) {
    var lab = document.createElement('div');
    lab.className = 'playLabel'; lab.style.cssText = 'margin:2px 0 0;font-size:11px;opacity:.7';
    lab.textContent = '奏一段';
    menu.appendChild(lab);
    TUNES.forEach(function(t, i){
      var b = document.createElement('button');
      b.type = 'button'; b.dataset.tune = t.id;
      b.textContent = t.zh;
      b.addEventListener('click', function(){ playTune(t); });
      menu.appendChild(b);
    });
    var next = document.createElement('button');
    next.type = 'button'; next.textContent = '下一首（|）';
    next.addEventListener('click', function(){ cycleTune(); });
    menu.appendChild(next);
    var roll = document.createElement('button');
    roll.type = 'button'; roll.textContent = '换一种调式（>）';
    roll.addEventListener('click', function(){
      playRandomScale();
      if (typeof toast === 'function') toast('换成 ' + SCALE_MODES[PLAY.scale.key].zh + '调式 · 基准音 ' + Math.round(PLAY.scale.root) + 'Hz', 2200);
    });
    menu.appendChild(roll);
    var demo = document.createElement('button');
    demo.type = 'button'; demo.textContent = '全场弹一遍（<）';
    demo.addEventListener('click', function(){
      var hs = heads.slice().sort(function(a, b){ return (a.col - b.col) || (a.row - b.row); });
      hs.forEach(function(h, i){ setTimeout(function(){ noteAt(h, scaleSlot(h)); }, i * 70); });
    });
    menu.appendChild(demo);
  }
  // 键盘：< 弹一遍，> 换调，| 换一首。（; 与 ' 是合照/看照片，不能占）
  try {                                   // 键位表也要能看到这两个新键（手机端点它即触发）
    if (typeof KEYINFO !== 'undefined') {
      KEYINFO['<'] = ['Strum the cast', 'A note on every face, in scale order.', 'action'];
      KEYINFO['>'] = ['Another mode', 'Re-roll the scale (key, mode, direction, spacing).', 'action'];
      if (typeof KBROWS !== 'undefined' && !KBROWS.some(function (r) { return r.indexOf('<') >= 0; })) {
        var last = KBROWS[KBROWS.length - 1];
        if (last && last.indexOf(';') >= 0) last.push('<', '>'); else KBROWS.push(['<', '>']);
      }
    }
  } catch (e) {}
  // 注意：数字键是应用的终章（Shift+数字也会落到终章上），所以曲目不能用数字键。
  document.addEventListener('keydown', function(e){
    var tag = (e.target && e.target.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === '|') { e.preventDefault(); FEEL && (FEEL.keyHits = (FEEL.keyHits || 0) + 1); cycleTune(); if (typeof PLAY !== 'undefined') PLAY.lastKey = '|'; return; }
    if (e.key === '<') {
      e.preventDefault();
      var hs = heads.slice().sort(function(a, b){ return (a.col - b.col) || (a.row - b.row); });
      hs.forEach(function(h, i){ setTimeout(function(){ noteAt(h, scaleSlot(h)); }, i * 70); });
    } else if (e.key === '>') {
      e.preventDefault();
      playRandomScale();
      if (typeof toast === 'function') toast('换成 ' + SCALE_MODES[PLAY.scale.key].zh + '调式', 1800);
    }
  });
  // 换场景时重排音阶（"不要每次固定"也体现在这里）
  var scaleScene = applyStudioScene;
  applyStudioScene = function(){ stopTune(); var r = scaleScene.apply(this, arguments); playRandomScale(); return r; };
  playRandomScale();
  try {
    window.__play = {
      get scale(){ return PLAY.scale; },
      get playing(){ return PLAY.tune; },                    /* 当前曲目 id（null=没在奏）*/
      playById: function(id){ var t = TUNES.filter(function(x){ return x.id === id; })[0]; if (t) playTune(t); return !!t; },
      pitchOf: function(i){ return pitchAt(scaleSlot(heads[i || 0])); },
      slots: function(){ return heads.map(function(h){ var s = scaleSlot(h); return s.idx + ':' + s.oct; }).slice(0, 12); },
      stop: stopTune, reroll: function(){ return playRandomScale(); },
      cycle: cycleTune, get lastKey(){ return PLAY.lastKey; },
      tunes: TUNES.map(function(t){ return t.zh; }),
    };
  } catch (e) {}
})();

/* 词条 */
if (typeof UI_PAIRS !== 'undefined') {
  UI_PAIRS.push(['奏一段', 'Play a tune'], ['换一种调式', 'Another mode'], ['全场弹一遍', 'Strum the cast']);
  TUNES.forEach(function(t){ UI_PAIRS.push([t.zh, t.en]); });
}
