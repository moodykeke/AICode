/* 趣像 17 (r30): 大合照——随机靠拢、随机大小、随机样式，带相框导出
   玩法：按 `;`（或表演条里的「大合照」）→ 全班随机聚拢到中央摆造型 → 闪光灯一亮 →
   自动出一张"照片"。样式每次随机（也可在设置里指定），大小也带随机抖动（前排大、后排小）。

   造型样式：
     rows    三排合影（前排大、后排小，略微错落）
     line    一字排开（高低错落）
     arc     圆弧长队（像毕业照那种弧线）
     cluster 拥簇中央（最紧的一团）
   导出：
     · 存照片（相框三选一：白框题字 / 胶片齿孔 / 宝丽来）
     · 存原图（不带框）
   退出：Esc 或任意动作键；照片拍完后自动散场，随后弹出暗房（见 photo-lab.js）。 */

var PHOTO = { active: false, style: null, t0: 0, targets: null, flash: 0, shotAt: 0, result: null, captured: null, cropped: false, hi: null };
var PHOTO_STYLES = ['rows', 'line', 'arc', 'cluster'];
var PHOTO_STYLE_ZH = { rows: '三排合影', line: '一字排开', arc: '圆弧长队', cluster: '拥簇中央', random: '每次随机' };

CFG_DEFAULT.photoStyle = (CFG_DEFAULT.photoStyle == null) ? 'random' : CFG_DEFAULT.photoStyle;
CFG.photoStyle = (CFG.photoStyle == null) ? CFG_DEFAULT.photoStyle : CFG.photoStyle;
CFG_DEFAULT.photoRes = (CFG_DEFAULT.photoRes == null) ? '' : CFG_DEFAULT.photoRes;
CFG.photoRes = (CFG.photoRes == null) ? CFG_DEFAULT.photoRes : CFG.photoRes;
CFG_DEFAULT.photoFrame = (CFG_DEFAULT.photoFrame == null) ? 'mat' : CFG_DEFAULT.photoFrame;
CFG.photoFrame = (CFG.photoFrame == null) ? CFG_DEFAULT.photoFrame : CFG.photoFrame;
['photoStyle', 'photoFrame', 'photoRes'].forEach(function (k) { if (SHARE_KEYS.indexOf(k) < 0) SHARE_KEYS.push(k); });

function photoStyle() {
  var s = String(CFG.photoStyle || 'random');
  if (PHOTO_STYLES.indexOf(s) >= 0) return s;
  return PHOTO_STYLES[Math.floor(Math.random() * PHOTO_STYLES.length)];
}
function photoRand(seed) {           // 每张照片一个固定序列 → 一次生成、形状自洽
  var x = seed >>> 0 || 1;
  return function () { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; };
}

/** 算造型目标：返回 [{h, x, y, s, roll}] */
function photoPose(style) {
  var list = heads.filter(function (h) { return !h.hidden; });
  var rnd = photoRand((Date.now() / 1000) | 0);
  var cx = W / 2, cy = H * 0.55;
  var n = list.length, out = [];
  // 基准尺寸取"当前头的 s"——它是这套画法的真实比例（格子尺寸是另一套单位，直接用会放大数倍）
  var refS = 0; list.forEach(function (h) { refS += h.s; }); refS = n ? refS / n : 40;
  var baseS = refS;
  if (style === 'rows') {
    var rowsN = n > 24 ? 3 : 2;
    list.forEach(function (h, i) {
      var r = Math.floor(i / Math.ceil(n / rowsN));
      var cInRow = i % Math.ceil(n / rowsN);
      var per = Math.ceil(n / rowsN);
      var span = Math.min(W * 0.88, (per - 1) * baseS * 1.35);
      var x = cx + (cInRow - (per - 1) / 2) * (span / Math.max(1, per - 1 || 1));
      var front = 1 - r / Math.max(1, rowsN - 1);
      out.push({
        h: h, x: x, y: cy + (r - (rowsN - 1) / 2) * baseS * 1.5 + (rnd() - 0.5) * baseS * 0.12,
        s: baseS * (0.88 + front * 0.26) * (0.94 + rnd() * 0.12), roll: (rnd() - 0.5) * 0.10,
      });
    });
  } else if (style === 'line') {
    list.forEach(function (h, i) {
      var span = Math.min(W * 0.9, (n - 1) * baseS * 1.25);
      out.push({
        h: h, x: cx + (i - (n - 1) / 2) * (span / Math.max(1, n - 1)),
        y: cy + (rnd() - 0.5) * baseS * 0.45,
        s: baseS * (0.92 + rnd() * 0.18), roll: (rnd() - 0.5) * 0.16,
      });
    });
  } else if (style === 'arc') {
    var R = Math.min(W * 0.40, (n - 1) * baseS * 0.42);
    list.forEach(function (h, i) {
      var t = n > 1 ? i / (n - 1) : 0.5;
      var a = (t - 0.5) * Math.PI * 0.95;
      out.push({
        h: h, x: cx + Math.sin(a) * R,
        y: cy + (1 - Math.cos(a)) * R * 0.75 + (rnd() - 0.5) * baseS * 0.12,
        s: baseS * (0.98 + (1 - Math.abs(t - 0.5) * 2) * 0.18) * (0.94 + rnd() * 0.12), roll: (rnd() - 0.5) * 0.12,
      });
    });
  } else {                                   // cluster：拥簇中央
    var rings = [[0, 0], []];
    var idx = 0;
    list.forEach(function (h, i) {
      var k = Math.min(3, Math.floor(i / 4) + 1);        // 最多三圈，别越铺越远
      var slot = i % 4;
      var rr = baseS * 1.25 * k;
      var a = slot / 4 * Math.PI * 2 + k * 0.7 + (rnd() - 0.5) * 0.5;
      out.push({
        h: h, x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr * 0.62 + (rnd() - 0.5) * baseS * 0.1,
        s: baseS * Math.max(0.66, 1.12 - k * 0.16) * (0.94 + rnd() * 0.12), roll: (rnd() - 0.5) * 0.14,
      });
      idx++;
    });
  }
  // 统一收进画面内（按目标尺寸留边）
  out.forEach(function (o) {
    var pad = o.s * 0.9;
    o.x = Math.max(pad, Math.min(W - pad, o.x));
    o.y = Math.max(pad * 0.8, Math.min(H - pad * 0.5, o.y));
  });
  return out;
}

function photoStart() {
  if (typeof SUPER !== 'undefined' && SUPER) return;
  if (typeof cardOpen !== 'undefined' && cardOpen) return;
  PHOTO.active = true;
  PHOTO.style = photoStyle();
  PHOTO.t0 = performance.now();
  PHOTO.shotAt = PHOTO.t0 + 1250;
  PHOTO.flash = 0;
  PHOTO.result = null;
  PHOTO.targets = photoPose(PHOTO.style); PHOTO_LOG = []; photoMark('pose');
  photoHiOn();                                         // 整段摆造型都在高分辨率下渲染
  if (typeof toast === 'function') toast((PHOTO_STYLE_ZH[PHOTO.style] || '合影') + ' · 站好了，笑一下', 1600);
  photoTick();
}
var PHOTO_LOG = [];
function photoMark(what) { PHOTO_LOG.push(what + '@' + Math.round(performance.now() - PHOTO.t0) + 'ms'); }
function photoEnd(restore) {
  if (PHOTO.active) photoHiOff();                      // 中途取消也要把分辨率还回去
  PHOTO.active = false;
  // 队形坐标要留给成片裁切用（photoCompose 按它框住这一群人）——下一张照片会覆盖它
  PHOTO.flash = 0;
  if (restore !== false) { try { layout(); } catch (e) {} }
}
function photoTick() {
  if (!PHOTO.active) return;
  var now = performance.now(), k = Math.min(1, (now - PHOTO.t0) / 1100);
  var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;     // easeInOutQuad
  (PHOTO.targets || []).forEach(function (o) {
    o.h.x += (o.x - o.h.x) * (0.10 + e * 0.20);
    o.h.y += (o.y - o.h.y) * (0.10 + e * 0.20);
    o.h.s += (o.s - o.h.s) * (0.10 + e * 0.20);
    o.h.roll += (o.roll - o.h.roll) * 0.06;
  });
  if (PHOTO.flash > 0) PHOTO.flash = Math.max(0, PHOTO.flash - 0.045);
  if (PHOTO.shotAt && now >= PHOTO.shotAt) { PHOTO.shotAt = 0; photoShoot(); }
  requestAnimationFrame(photoTick);
}
function photoShutter() {
  try {
    if (typeof SOUND !== 'undefined' && !SOUND) return;
    var a = ac(); if (!a) return;
    // 两下极短的噪声 = 快门"咔嗒"
    [[0, 0.05, 0.18, 2600], [0.07, 0.04, 0.12, 1800]].forEach(function (spec) {
      var t = a.currentTime + spec[0], dur = spec[1], gain = spec[2], freq = spec[3];
      var n = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate), d = n.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      var src = a.createBufferSource(); src.buffer = n;
      var f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 1.1;
      var g = a.createGain(); g.gain.value = gain;
      src.connect(f); f.connect(g); g.connect(bus(0));
      src.start(t);
    });
  } catch (e) {}
}
function photoShoot() {
  photoMark('shoot');
  // 先留住这一帧（散场后仍可导出同一张合影），再打闪光——否则成片会被闪光蒙白
  PHOTO.captured = photoCapture();                     // 快门：抓下屏幕上的这一帧（已是高分辨率）
  PHOTO.cropped = true;
  photoHiOff();                                        // 抓完立刻还原，别让高分辨率常驻
  PHOTO.flash = 1;
  photoShutter();
  setTimeout(function () {
    photoMark('end'); photoEnd(true);
    if (typeof labOpen === 'function') labOpen();      // r31: 拍完先显示成片（保存/分享/取消在暗房里选）
  }, 1500);
}
/** 把当前舞台合成到一张（可选相框）画布 */
function photoBoxOf(src) {                            // 按队形算裁切框（canvas 像素）
  var k = src.width / Math.max(1, W);
  var box = { x: 0, y: 0, w: src.width, h: src.height };
  if (PHOTO.targets && PHOTO.targets.length) {
    var minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    PHOTO.targets.forEach(function (o) {
      var r = o.s * 1.15;
      minX = Math.min(minX, o.x - r); maxX = Math.max(maxX, o.x + r);
      minY = Math.min(minY, o.y - r * 1.40); maxY = Math.max(maxY, o.y + r * 2.05);
    });
    var padX = (maxX - minX) * 0.09, padY = (maxY - minY) * 0.14;
    minX -= padX; maxX += padX; minY -= padY; maxY += padY;
    box.x = Math.max(0, Math.round(minX * k));
    box.y = Math.max(0, Math.round(minY * k));
    box.w = Math.min(src.width - box.x, Math.round((maxX - minX) * k));
    box.h = Math.min(src.height - box.y, Math.round((maxY - minY) * k));
  }
  return box;
}
function photoCapture() {                              // 快门：同步留一枚屏幕分辨率的底
  var src = cv, box = photoBoxOf(cv);
  var out = document.createElement('canvas');
  out.width = Math.max(8, box.w); out.height = Math.max(8, box.h);
  out.getContext('2d').drawImage(src, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h);
  return out;
}
/* 舞台在手机上只有四百来像素宽，直接拷贝的成片只有一百多像素。
   办法：开拍时就把舞台画布的分辨率提上去，让整个摆造型过程都在高分辨率下渲染，
   快门抓的就是屏幕上那一帧本身（不是事后重画的一帧，那样位置和脖子会不一样）。
   拍完/取消立刻还原。 */
function photoHiOn() {
  PHOTO.hi = null;
  var mult = 1;
  try {
    var box = photoBoxOf(cv);
    var print = String(CFG.photoRes || '') === 'print';
    var need = Math.max(1, Math.ceil((print ? 1800 : 760) / Math.max(1, box.w)));   // 成片想要多宽（打印版要更宽）
    var budgetPx = print ? 1.2e7 : 6e6;                                             // 整幅像素预算
    var budget = Math.floor(Math.sqrt(budgetPx / Math.max(1, cv.width * cv.height)));
    var cap = (W < 700) ? 2.2 : 3;                                                  // 小屏别把整幅拉太大（峰值内存）
    mult = Math.max(1, Math.min(cap, need, budget));
  } catch (e) { mult = 1; }
  if (mult <= 1) return;
  try {
    PHOTO.hi = { dpr: DPR, w: cv.width, h: cv.height };
    DPR = DPR * mult;
    cv.width = (W * DPR) | 0; cv.height = (H * DPR) | 0;   // 只放大画布：不能走 layout()，那会重排角色
    // 纸纹要跟着换尺寸：knock() 靠 paperFill() 的图案按"设备像素"贴回纸面做遮挡，
    // 图案还是旧尺寸的话只盖住半张画布，本该被挡住的身体就会漏出来（成片上一片灰影）
    if (typeof rebuildPaper === 'function') rebuildPaper();
  } catch (e) { PHOTO.hi = null; }
}
function photoHiOff() {
  var hi = PHOTO.hi;
  if (!hi) return;
  PHOTO.hi = null;
  try {
    DPR = hi.dpr; cv.width = hi.w; cv.height = hi.h;
    if (typeof rebuildPaper === 'function') rebuildPaper();
    if (typeof drawGrid === 'function') drawGrid(0, performance.now());    // 补一帧，避免还原时闪一下
  } catch (e) {}
}
function photoCompose(frame, scale) {
  var src = PHOTO.captured || cv;                      // 优先用"按下快门那一刻"留存的那一帧
  var inner = document.createElement('canvas');
  var box = PHOTO.cropped ? { x: 0, y: 0, w: src.width, h: src.height } : photoBoxOf(src);
  inner.width = box.w; inner.height = box.h;
  inner.getContext('2d').drawImage(src, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h);
  if (scale && scale !== 1) {                          // 缩略预览：整幅等比缩小，框与题字随之内缩
    var small = document.createElement('canvas');
    small.width = Math.max(24, Math.round(box.w * scale));
    small.height = Math.max(24, Math.round(box.h * scale));
    small.getContext('2d').drawImage(inner, 0, 0, small.width, small.height);
    inner = small;
  }

  if (frame === 'raw') return { canvas: inner, name: 'quxiang-photo-raw.png' };
  var pad, bottomExtra, bg = '#fffdf7', ink = '#3b3730';
  if (frame === 'film') { pad = Math.round(inner.width * 0.045); bottomExtra = Math.round(pad * 1.9); bg = '#141210'; ink = '#efe7d5'; }
  else if (frame === 'polaroid') { pad = Math.round(inner.width * 0.055); bottomExtra = Math.round(inner.width * 0.16); }
  else { pad = Math.round(inner.width * 0.06); bottomExtra = Math.round(inner.width * 0.12); }

  var out = document.createElement('canvas');
  out.width = inner.width + pad * 2;
  out.height = inner.height + pad + bottomExtra;
  var x = out.getContext('2d');
  x.fillStyle = bg; x.fillRect(0, 0, out.width, out.height);
  x.drawImage(inner, pad, pad);
  // 内细线
  x.strokeStyle = frame === 'film' ? 'rgba(239,231,213,0.35)' : 'rgba(59,55,48,0.25)';
  x.lineWidth = Math.max(1, Math.round(out.width * 0.0012));
  x.strokeRect(pad + 0.5, pad + 0.5, inner.width - 1, inner.height - 1);
  // 胶片齿孔（小图上留白太窄，齿孔既看不见、步长还会取整成 0 —— 必须保证步长 > 0）
  if (frame === 'film' && out.width >= 90) {
    x.fillStyle = 'rgba(239,231,213,0.75)';
    var holeW = Math.max(1, Math.round(out.width * 0.016)), holeH = Math.max(1, Math.round(pad * 0.34));
    var gap = Math.max(3, holeW * 2.2);
    for (var hx = pad * 0.5; hx < out.width - pad * 0.5; hx += gap) {
      x.fillRect(hx, pad * 0.28, holeW, holeH);
      x.fillRect(hx, out.height - pad * 0.28 - holeH, holeW, holeH);
    }
  }
  // 题字
  var fs = Math.round(out.width * (frame === 'polaroid' ? 0.045 : 0.032));
  x.fillStyle = ink;
  x.font = '600 ' + fs + 'px "Noto Serif SC","Songti SC",serif';
  x.textAlign = 'center';
  var d = new Date();
  var stamp = d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0');
  var who = (typeof CLASS !== 'undefined' && CLASS && CLASS.active && CLASS.name) ? CLASS.name : '全班合影';
  var line = '趣像 · ' + who + ' · ' + (PHOTO.targets ? PHOTO.targets.length : heads.length) + ' 位 · ' + stamp;
  var capY = out.height - bottomExtra * (frame === 'film' ? 0.55 : 0.42);
  x.fillText(line, out.width / 2, capY);
  // 朱印（胶片框排到题字这一行，免得压到下方齿孔）
  var ss = Math.round(fs * 1.25);
  x.fillStyle = 'rgba(172,54,42,0.92)';
  var sealY = (frame === 'film') ? capY - ss * 0.85 : out.height - bottomExtra * 0.78;
  x.fillRect(out.width - pad - ss * 1.4, sealY, ss, ss);
  x.fillStyle = '#fdf6ec';
  x.font = '600 ' + Math.round(ss * 0.62) + 'px "Noto Serif SC",serif';
  x.fillText('趣', out.width - pad - ss * 0.9, sealY + ss * 0.68);
  return { canvas: out, name: 'quxiang-photo-' + frame + '.png' };
}
function photoSave(frame) {
  var shot = PHOTO.result && frame === CFG.photoFrame ? PHOTO.result : photoCompose(frame);
  if (!shot || typeof canvasBlob !== 'function' || typeof saveFile !== 'function') return;
  if (typeof beginExport === 'function' && !beginExport(['合影照片', 'group photo'])) return;
  canvasBlob(shot.canvas).then(function (blob) {
    if (typeof endExport === 'function') endExport();
    if (blob) saveFile(shot.name, blob);
    else if (typeof exportFailed === 'function') exportFailed();
  }, function () { if (typeof exportFailed === 'function') exportFailed(); });
}

/* 入口：表演条 + 键盘 ; + 帮助面板
   键位选择：反引号键（键帽上印的是 ~）是「说话」，不能占它的 Shift 形式，
   所以改用分号键；: 是同一颗键的 Shift 形式，全角 ；/： 供中文输入法下按同一个键。 */
(function photoEntries() {
  var menu = document.querySelector('.playMoreMenu');
  if (menu) {
    var lab = document.createElement('div');
    lab.className = 'playLabel'; lab.style.cssText = 'margin:2px 0 0;font-size:11px;opacity:.7';
    lab.textContent = '合影';
    menu.appendChild(lab);
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = '大合照（;）';
    b.addEventListener('click', photoStart);
    menu.appendChild(b);
  }
  TRIG.snapshot = function () { photoStart(); };
  [';', ':', '；', '：'].forEach(function (k) { KEYMAP[k] = 'snapshot'; });
  TRIG_NAMES.snapshot = 'group photo';
  KEYINFO[';'] = ['Group photo', 'Everyone gathers into one pose, a flash goes off, and the photo is yours to save.', 'action'];
  if (typeof KBROWS !== 'undefined' && !KBROWS.some(function (r) { return r.indexOf(';') >= 0; })) {
    var last = KBROWS[KBROWS.length - 1];
    if (last && last.indexOf(' ') >= 0) last.push(';'); else KBROWS.push([';']);
  }
  document.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Escape' && PHOTO.active) { e.preventDefault(); photoEnd(true); }
  });
})();

/* 设置：样式与相框 */
(function photoPanel() {
  var grp = null;
  PANEL.forEach(function (G) { if ((G.items || []).some(function (it) { return it.id === 'tapHop'; })) grp = G; });
  if (!grp) return;
  if (!grp.items.some(function (it) { return it.id === 'photoStyle'; })) {
    var at = grp.items.findIndex(function (it) { return it.id === 'hopPower'; });
    var items = [
      { id: 'photoStyle', label: '合影样式', type: 'seg', opts: [['random', '每次随机'], ['rows', '三排'], ['line', '一字'], ['arc', '圆弧'], ['cluster', '拥簇']] },
      { id: 'photoFrame', label: '相框', type: 'seg', opts: [['mat', '白框题字'], ['film', '胶片'], ['polaroid', '宝丽来'], ['raw', '不带框']] },
      { id: 'photoRes', label: '照片清晰度', type: 'seg', opts: [['', '屏幕'], ['print', '打印']] },
    ];
    grp.items.splice(at + 1, 0, items[0], items[1]);
  }
})();

/* 闪光：叠在舞台之上（用覆盖层画，不吃内存） */
var photoBaseGrid = drawGrid;
drawGrid = function (dt, now) {
  var r = photoBaseGrid.apply(this, arguments);
  if (PHOTO.flash > 0.001) {
    try {
      ctx.save(); ctx.globalAlpha = PHOTO.flash * 0.85;
      ctx.fillStyle = '#fffdf4';
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    } catch (e) {}
  }
  return r;
};

if (typeof UI_PAIRS !== 'undefined') {
  UI_PAIRS.push(['大合照', 'Group photo'], ['合影样式', 'Pose style'], ['相框', 'Frame'],
    ['三排', 'Rows'], ['一字', 'Line'], ['圆弧', 'Arc'], ['拥簇', 'Cluster'],
    ['白框题字', 'White mat'], ['胶片', 'Film'], ['宝丽来', 'Polaroid'], ['不带框', 'No frame'],
    ['全班合影', 'the whole class']);
}

try {
  window.__photo = {
    start: photoStart, end: photoEnd,
    get style() { return PHOTO.style; },
    set style(v) { if (PHOTO_STYLE_ZH[v] !== undefined) CFG.photoStyle = v; },
    set frame(v) { CFG.photoFrame = v; },
    get res() { return String(CFG.photoRes || '') || 'screen'; },
    set res(v) { CFG.photoRes = String(v) === 'print' ? 'print' : ''; },
    get active() { return PHOTO.active; },
    get log() { return PHOTO_LOG.slice(); },
    save: function (frame) { photoSave(frame || CFG.photoFrame); },
    compose: function (frame) { var c = photoCompose(frame || 'mat'); return { w: c.canvas.width, h: c.canvas.height, name: c.name }; },
    poseOf: function (i) { var o = (PHOTO.targets || [])[i || 0]; return o ? { x: Math.round(o.x), y: Math.round(o.y), s: +o.s.toFixed(1) } : null; },
  };
} catch (e) {}
