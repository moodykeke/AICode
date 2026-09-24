/* 趣像 17 (r31): 暗房——按下快门之后，先把照片显示出来，再决定保存 / 分享 / 取消
   流程：`;` 拍照 → 聚拢摆造型 → 闪光 → 弹窗显示成片（可按 4 种相框实时预览）
        → 保存（下载 PNG）/ 分享（系统分享或复制到剪贴板）/ 重拍 / 取消。

   键位（弹窗内，吞掉舞台按键，不会误触发表演动作）：
     ⏎      保存当前相框
     S      分享
     R      重拍（重新聚拢摆一次造型）
     1–4    直接选相框
     ← →    前后切换相框
     Esc    取消（关闭，照片留着，按 ' 可再打开）
     ;      再拍一张（等同于重拍）

   舞台键位：`;` 拍一张，`'` 重新打开上一张照片。 */

var PHOTO_LAB = { open: false, frame: 'mat', built: false, el: null, chips: {}, viewers: [] };
var LAB_FRAMES = ['mat', 'film', 'polaroid', 'raw'];
var LAB_FRAME_LABEL = { mat: ['白框题字', 'White mat'], film: ['胶片', 'Film'], polaroid: ['宝丽来', 'Polaroid'], raw: ['原图', 'Original'] };
function labLabel(f) { return qxLocal(LAB_FRAME_LABEL[f][0], LAB_FRAME_LABEL[f][1]); }

/* ---------- 样式（沿用纸面/朱印的既有色板） ---------- */
(function labStyle() {
  var st = document.createElement('style');
  st.textContent = [
    '#photoLab{position:fixed;inset:0;z-index:48;display:flex;align-items:center;justify-content:center;padding:14px;',
    'background:rgba(26,22,18,.74);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}',
    '#photoLab[hidden]{display:none}',
    '.ql{position:relative;background:var(--paper);color:var(--ink);border-radius:16px;padding:14px 16px 12px;',
    'max-width:min(780px,100%);max-height:100%;overflow:auto;box-shadow:0 24px 60px rgba(0,0,0,.45)}',
    '.ql-head{display:flex;align-items:baseline;gap:10px}',
    '.ql-title{font-family:var(--serif);font-size:17.5px;letter-spacing:.04em;margin:0}',
    '.ql-meta{flex:1;margin:0;font-size:12px;color:var(--ink-soft)}',
    '.ql-stage{display:flex;justify-content:center;padding:8px 0 2px}',
    '.ql-stage canvas{max-width:100%;border-radius:3px;box-shadow:0 10px 26px rgba(0,0,0,.32);background:#fff}',
    '.ql-frames{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:8px 0 10px}',
    '.ql-frames button{font:inherit;font-size:12px;display:flex;flex-direction:column;align-items:center;gap:3px;',
    'padding:6px 8px 5px;border:1px solid var(--edge);border-radius:10px;background:#fffdf7;color:var(--ink);cursor:pointer}',
    '.ql-frames button canvas{display:block;width:70px;height:auto;border-radius:2px}',
    '.ql-frames button[aria-pressed="true"]{border-color:var(--stamp);box-shadow:inset 0 0 0 1px var(--stamp)}',
    '.ql-frames button kbd,.ql-acts kbd{font-family:inherit;font-size:10px;border:1px solid currentColor;border-radius:3px;',
    'padding:0 4px;opacity:.62}',
    '.ql-acts{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}',
    '.ql-acts button{font:inherit;font-size:13.5px;display:inline-flex;align-items:center;gap:5px;padding:7px 15px;',
    'border-radius:999px;border:1px solid var(--edge);background:transparent;color:var(--ink);cursor:pointer}',
    '.ql-acts button.primary{background:var(--ink);color:var(--paper);border-color:var(--ink);font-style:italic}',
    '.ql-hint{margin:8px 0 0;text-align:center;font-size:11.5px;font-style:italic;color:var(--ink-soft)}',
  ].join('');
  document.head.appendChild(st);
})();

/* ---------- 建面（首次打开时构建，之后复用） ---------- */
function labBuild() {
  if (PHOTO_LAB.built) return;
  var ov = document.createElement('div');
  ov.id = 'photoLab'; ov.hidden = true;
  ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
  ov.setAttribute('aria-label', qxLocal('全家福', 'Family portrait'));

  var sheet = document.createElement('div'); sheet.className = 'ql';
  sheet.innerHTML = '<div class="ql-head"><h2 class="ql-title">' + qxLocal('全家福', 'Family portrait') +
    '</h2><p class="ql-meta"></p><button type="button" class="x" data-lab="cancel" aria-label="' + qxLocal('关闭', 'Close') + '">×</button></div>' +
    '<div class="ql-stage"><canvas aria-label="' + qxLocal('照片预览', 'Photo preview') + '"></canvas></div>' +
    '<div class="ql-frames" role="group" aria-label="' + qxLocal('相框', 'Frame') + '"></div>' +
    '<div class="ql-acts">' +
    '<button type="button" class="primary" data-lab="save">' + qxLocal('保存', 'Save') + '<kbd>⏎</kbd></button>' +
    '<button type="button" data-lab="wall">' + qxLocal('送展墙', 'To the wall') + '<kbd>W</kbd></button>' +
    '<button type="button" data-lab="share">' + qxLocal('分享', 'Share') + '<kbd>S</kbd></button>' +
    '<button type="button" data-lab="poster">' + qxLocal('存展板', 'Save poster') + '<kbd>P</kbd></button>' +
    '<button type="button" data-lab="reshoot">' + qxLocal('重拍', 'Retake') + '<kbd>R</kbd></button>' +
    '<button type="button" data-lab="cancel">' + qxLocal('取消', 'Cancel') + '<kbd>Esc</kbd></button>' +
    '</div>' +
    '<p class="ql-hint"></p>';
  ov.appendChild(sheet);
  document.body.appendChild(ov);

  // 相框小样（各合成一张约 100px 宽的缩略图，点哪张就预览哪张）
  var box = sheet.querySelector('.ql-frames');
  LAB_FRAMES.forEach(function (f, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.dataset.frame = f;
    b.setAttribute('aria-pressed', 'false');
    b.innerHTML = '<canvas></canvas><span>' + labLabel(f) + ' <kbd>' + (i + 1) + '</kbd></span>';
    b.firstChild.addEventListener('click', function () { labSetFrame(f); });
    b.addEventListener('click', function () { labSetFrame(f); });
    box.appendChild(b);
    PHOTO_LAB.chips[f] = b;
  });

  // 按钮
  Array.prototype.forEach.call(sheet.querySelectorAll('[data-lab]'), function (b) {
    b.addEventListener('click', function () {
      var a = b.dataset.lab;
      if (a === 'save') labSave();
      else if (a === 'poster') labSavePoster();
      else if (a === 'wall') labSendToWall();
      else if (a === 'share') labShare();
      else if (a === 'reshoot') labReshoot();
      else labClose();
    });
  });
  // 点背景 = 取消
  ov.addEventListener('click', function (e) { if (e.target === ov) labClose(); });

  sheet.querySelector('.ql-hint').textContent = qxLocal(
    '← → 换相框 · 1–4 直选 · P 存展板 · W 送展墙 · 点背景关闭', '← → change frame · 1–4 pick · P poster · W wall · click outside to cancel');

  PHOTO_LAB.el = ov;
  PHOTO_LAB.built = true;
  PHOTO_LAB.chipsFor = function () { return box; };
}

/* ---------- 画：预览 + 相框小样 ---------- */
function labPaintMinis() {
  LAB_FRAMES.forEach(function (f) {
    var b = PHOTO_LAB.chips[f];
    if (!b || b.__done) return;
    var mini = photoCompose(f, 0.12);
    if (!mini || !mini.canvas) return;
    var c = b.firstChild;
    c.width = mini.canvas.width; c.height = mini.canvas.height;
    c.getContext('2d').drawImage(mini.canvas, 0, 0);
    b.__done = true;
    mini.canvas.width = 1; mini.canvas.height = 1;   // 缩略图已拷走，立刻释放
  });
}
function labPaintPreview() {
  if (!PHOTO_LAB.el) return;
  var shot = photoCompose(PHOTO_LAB.frame);
  if (!shot || !shot.canvas) return;
  var src = shot.canvas;
  var cvp = PHOTO_LAB.el.querySelector('.ql-stage canvas');
  var maxW = Math.min(window.innerWidth * 0.68, 640);
  var maxH = Math.max(220, window.innerHeight * 0.54);
  var k = Math.min(maxW / src.width, maxH / src.height, 1);
  cvp.width = Math.max(80, Math.round(src.width * k));
  cvp.height = Math.max(80, Math.round(src.height * k));
  var g = cvp.getContext('2d');
  g.clearRect(0, 0, cvp.width, cvp.height);
  g.drawImage(src, 0, 0, cvp.width, cvp.height);
  src.width = 1; src.height = 1;                      // 预览画好即释放整幅，内存只留预览这一张
  PHOTO.result = null;                                // 保存时按需重合成（photoSave 已支持）
  LAB_FRAMES.forEach(function (f) {
    var b = PHOTO_LAB.chips[f];
    if (b) b.setAttribute('aria-pressed', f === PHOTO_LAB.frame ? 'true' : 'false');
  });
}
function labSetFrame(f) {
  if (LAB_FRAMES.indexOf(f) < 0) return;
  PHOTO_LAB.frame = f;
  CFG.photoFrame = f;
  try { saveCfg(); } catch (e) {}
  labPaintPreview();
}
function labCycle(d) {
  var i = LAB_FRAMES.indexOf(PHOTO_LAB.frame);
  labSetFrame(LAB_FRAMES[(i + d + LAB_FRAMES.length) % LAB_FRAMES.length]);
}

/* ---------- 动作 ---------- */
function labOpen() {
  if (!PHOTO.captured) { toast(qxLocal('还没有合影 —— 按 ; 拍一张。', 'No photo yet — press ; to take one.'), 2600); return; }
  labBuild();
  PHOTO_LAB.open = true;
  PHOTO_LAB.el.hidden = false;
  var n = PHOTO.targets ? PHOTO.targets.length : heads.length;
  var d = new Date();
  var stamp = d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0');
  PHOTO_LAB.el.querySelector('.ql-meta').textContent =
    n + qxLocal(' 位', ' faces') + ' · ' + stamp;
  labPaintMinis();
  labSetFrame(LAB_FRAMES.indexOf(CFG.photoFrame) >= 0 ? CFG.photoFrame : PHOTO_LAB.frame);
  var b = PHOTO_LAB.el.querySelector('.ql-acts button.primary');
  try { b.focus({ preventScroll: true }); } catch (e) {}
  photoMark('lab');
}
function labClose() {
  if (!PHOTO_LAB.open) return;
  PHOTO_LAB.open = false;
  if (PHOTO_LAB.el) {
    PHOTO_LAB.el.hidden = true;
    var cvp = PHOTO_LAB.el.querySelector('.ql-stage canvas');
    cvp.width = 1; cvp.height = 1;                    // 关掉就把预览位图放掉
  }
  try { document.activeElement.blur(); } catch (e) {}
  if (PHOTO_LAB.viewers.length) { PHOTO_LAB.viewers.forEach(function (f) { try { f(); } catch (e) {} }); }
}
function labSave() {
  var f = PHOTO_LAB.frame;
  photoSave(f);
  toast(qxLocal('已保存', 'Saved') + ' · ' + labLabel(f), 2200);
}
function labShare() {
  var shot = photoCompose(PHOTO_LAB.frame);
  if (!shot || typeof canvasBlob !== 'function') return;
  if (typeof beginExport === 'function' && !beginExport(['合影照片', 'group photo'])) return;
  canvasBlob(shot.canvas).then(function (blob) {
    if (typeof endExport === 'function') endExport();
    if (!blob) { if (typeof exportFailed === 'function') exportFailed(); return; }
    var file = null;
    try { file = new File([blob], shot.name, { type: 'image/png' }); } catch (e) {}
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: qxLocal('趣像 · 全家福', 'Head Cases · family portrait') })
        .then(function () { toast(qxLocal('已分享', 'Shared'), 1800); },
              function () { /* 用户自己取消，不打扰 */ });
      return;
    }
    if (navigator.clipboard && window.ClipboardItem) {
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(
        function () { toast(qxLocal('已复制到剪贴板，去粘贴吧。', 'Copied to the clipboard — go paste it.'), 3000); },
        function () { saveFile(shot.name, blob); toast(qxLocal('这里不能分享，已存到下载。', 'Sharing is unavailable here — saved to downloads.'), 3200); });
      return;
    }
    saveFile(shot.name, blob);
    toast(qxLocal('这里不能分享，已存到下载。', 'Sharing is unavailable here — saved to downloads.'), 3200);
  }, function () { if (typeof exportFailed === 'function') exportFailed(); });
}
/* 展板（作品化）：把合影排成一张立幅海报（≈A 系列 1:1.414），可打印张贴。
   版式：顶部班级名 + 日期 → 中间合影（按宽适配）→ 底部「趣像 · 拾趣馆」与朱印。 */
function photoPoster(frame, scale) {
  var shot = photoCompose(frame || PHOTO_LAB.frame, 1);
  var sw = shot.canvas.width, sh = shot.canvas.height;
  var targetW = Math.max(2000, Math.round(sw * (scale || 1.6)));      // 打印版目标宽
  var sheetW = Math.min(3600, Math.max(1600, targetW));
  var sheetH = Math.round(sheetW * 1.414);
  var c = document.createElement('canvas');
  c.width = sheetW; c.height = sheetH;
  var g = c.getContext('2d');
  g.fillStyle = '#f6f1e6'; g.fillRect(0, 0, sheetW, sheetH);
  g.strokeStyle = 'rgba(59,55,48,0.28)'; g.lineWidth = Math.max(1, sheetW * 0.0015);
  g.strokeRect(sheetW * 0.035, sheetH * 0.025, sheetW * 0.93, sheetH * 0.95);
  var title = (typeof CLASS !== 'undefined' && CLASS.active && CLASS.name) ? CLASS.name : qxLocal('全班合影', 'the whole class');
  var d = new Date();
  var stamp = d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0');
  g.fillStyle = '#3b3730'; g.textAlign = 'center';
  g.font = '600 ' + Math.round(sheetW * 0.055) + 'px "Noto Serif SC","Songti SC",serif';
  g.fillText(title, sheetW / 2, sheetH * 0.085);
  g.font = '500 ' + Math.round(sheetW * 0.024) + 'px "Noto Serif SC",serif';
  g.fillStyle = '#5f554c';
  g.fillText(stamp + qxLocal(' · 合影留念', ' · class photo'), sheetW / 2, sheetH * 0.115);
  var padX = sheetW * 0.09, maxW = sheetW - padX * 2;
  var k = Math.min(maxW / sw, (sheetH * 0.62) / sh, 2.2);
  var w = sw * k, h = sh * k, x = (sheetW - w) / 2, y = sheetH * 0.18;
  g.fillStyle = 'rgba(60,50,38,0.14)'; g.fillRect(x + 6, y + 8, w, h);
  g.drawImage(shot.canvas, x, y, w, h);
  g.strokeStyle = 'rgba(59,55,48,0.35)'; g.lineWidth = 1; g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  g.fillStyle = '#5f554c';
  g.font = 'italic 500 ' + Math.round(sheetW * 0.022) + 'px "Noto Serif SC",serif';
  g.fillText(qxLocal('趣像 · 拾趣馆', 'Head Cases · Gallery of Curiosities'), sheetW / 2, sheetH * 0.90);
  var ss = Math.round(sheetW * 0.035);
  g.fillStyle = 'rgba(172,54,42,0.92)';
  g.fillRect(sheetW / 2 + Math.min(sheetW * 0.22, title.length * sheetW * 0.03) + 12, sheetH * 0.83, ss, ss);
  g.fillStyle = '#fdf6ec';
  g.font = '600 ' + Math.round(ss * 0.62) + 'px "Noto Serif SC",serif';
  g.fillText('趣', sheetW / 2 + Math.min(sheetW * 0.22, title.length * sheetW * 0.03) + 12 + ss / 2, sheetH * 0.83 + ss * 0.68);
  shot.canvas.width = 1; shot.canvas.height = 1;
  return c;
}
function labSavePoster() {
  if (typeof beginExport === 'function' && !beginExport(['合影展板', 'class poster'])) return;
  var c = photoPoster(PHOTO_LAB.frame, 1.6);
  if (typeof canvasBlob === 'function' && typeof saveFile === 'function') {
    canvasBlob(c, 'image/jpeg').then(function (blob) {
      if (typeof endExport === 'function') endExport();
      if (blob) { saveFile('quxiang-poster-' + Date.now() + '.jpg', blob); toast(qxLocal('已保存展板（打印用）', 'Poster saved (print ready)'), 2600); }
      else if (typeof exportFailed === 'function') exportFailed();
    }, function () { if (typeof exportFailed === 'function') exportFailed(); });
  }
  c.width = 1; c.height = 1;
}
function labReshoot() {
  labClose();
  photoStart();
}

/* ---------- 弹窗内的键盘：吞掉舞台按键，只认自己这几个 ---------- */
window.addEventListener('keydown', function (e) {
  if (!PHOTO_LAB.open) return;
  var tag = (e.target && e.target.tagName) || '';
  if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;      // 让浏览器自己的组合键（复制等）照常
  var k = e.key;
  var handled = true;
  if (k === 'Escape') labClose();
  else if (k === 'Enter') labSave();
  else if (k === 'w' || k === 'W') labSendToWall();
  else if (k === 's' || k === 'S') labShare();
  else if (k === 'p' || k === 'P') labSavePoster();
  else if (k === 'r' || k === 'R' || k === ';' || k === ':' || k === '；' || k === '：') labReshoot();
  else if (k === 'ArrowLeft') labCycle(-1);
  else if (k === 'ArrowRight') labCycle(1);
  else if (k >= '1' && k <= '4') labSetFrame(LAB_FRAMES[+k - 1]);
  else handled = false;
  if (handled || k.length === 1 || k === 'Tab') e.preventDefault();
  // 弹窗开着时舞台一律不接键盘：单个字符键与方向键都吞掉，避免误触发表演动作
  if (k.length === 1 || /^Arrow/.test(k)) e.stopImmediatePropagation();
}, true);

/* ---------- 入口：`'` 重新打开上一张 + 表演条按钮 ---------- */
(function labEntries() {
  TRIG.photoView = function () { labOpen(); };
  ['\'', '"', '‘', '’', '“', '”'].forEach(function (k) { KEYMAP[k] = 'photoView'; });
  TRIG_NAMES.photoView = 'view photo';
  KEYINFO['\''] = ['View photo', 'Reopen the last group photo: change the frame, save, or share it.', 'action'];
  if (typeof KBROWS !== 'undefined' && !KBROWS.some(function (r) { return r.indexOf('\'') >= 0; })) {
    var last = KBROWS[KBROWS.length - 1];
    if (last && last.indexOf(';') >= 0) last.push('\''); else KBROWS.push(['\'']);
  }
  var menu = document.querySelector('.playMoreMenu');
  if (menu) {
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = qxLocal('看照片（\'）', 'View photo (\')');
    b.addEventListener('click', labOpen);
    menu.appendChild(b);
  }
})();

if (typeof UI_PAIRS !== 'undefined') {
  UI_PAIRS.push(['保存', 'Save'], ['分享', 'Share'], ['重拍', 'Retake'], ['取消', 'Cancel'],
    ['全家福', 'Family portrait'], ['照片预览', 'Photo preview'], ['关闭', 'Close'],
    ['原图', 'Original']);
}

try {
  window.__lab = {
    open: labOpen, close: labClose, save: labSave, share: labShare, reshoot: labReshoot,
    set frame(v) { labSetFrame(v); },
    get frame() { return PHOTO_LAB.frame; },
    get isOpen() { return PHOTO_LAB.open; },
    get keys() { return ['Enter', 'S', 'P', 'W', 'R', 'Escape', '1-4', 'ArrowLeft', 'ArrowRight']; },
    poster: labSavePoster, toWall: labSendToWall, composePoster: function (f) { var c = photoPoster(f || PHOTO_LAB.frame, 1.6); var r = { w: c.width, h: c.height }; c.width = 1; c.height = 1; return r; },
  };
} catch (e) {}

/* ---------- r42: 合影送展墙（与卡片同一通道，kind=class-photo）----------
   与 wall-submit 的差别：图是"照片/展板"而不是角色卡，没有作品码 ——
   main.txt 里放一段说明（班级、日期、相框），展墙据此不显示"在趣像里看这张脸"。 */
function labSendToWall() {
  return (async function () {
    var me = null;
    try {
      var r = await fetch('/api/v2/auth/me', { credentials: 'same-origin' });
      me = await r.json();
    } catch (e) {}
    if (!me || !me.username) {
      toast(qxLocal('登录后可以把合影挂到展墙；「保存」照样存到本地。',
                    'Sign in to hang the photo on the wall — or just save it locally.'), 4600);
      return;
    }
    if (typeof beginExport === 'function' && !beginExport(['展墙投稿', 'wall submission'])) return;
    try {
      var frame = PHOTO_LAB.frame;
      var shot = photoCompose(frame);                       // 展墙灯箱宽 ~640px，2 倍 JPEG 足够
      var small = document.createElement('canvas');
      var k = Math.min(1, 1280 / shot.canvas.width);
      small.width = Math.round(shot.canvas.width * k); small.height = Math.round(shot.canvas.height * k);
      small.getContext('2d').drawImage(shot.canvas, 0, 0, small.width, small.height);
      shot.canvas.width = 1; shot.canvas.height = 1;
      var blob = await new Promise(function (res) { small.toBlob(function (b) { res(b); }, 'image/jpeg', 0.88); });
      if (blob && blob.size > 1.6 * 1024 * 1024) {
        var half = document.createElement('canvas');
        half.width = Math.round(small.width * 0.7); half.height = Math.round(small.height * 0.7);
        half.getContext('2d').drawImage(small, 0, 0, half.width, half.height);
        blob = await new Promise(function (res) { half.toBlob(function (b) { res(b); }, 'image/jpeg', 0.84); });
      }
      var fr = new FileReader();
      var dataUri = await new Promise(function (res) { fr.onload = function () { res(fr.result); }; fr.readAsDataURL(blob); });
      var who = (typeof CLASS !== 'undefined' && CLASS.active && CLASS.name) ? CLASS.name : qxLocal('全班合影', 'the whole class');
      var title = who + '·' + qxLocal('班级合影', 'class photo');   // 不加空格：词条表里有带词距的「· 合影留念」，嵌套拼会被翻译器叠加出「· ·」
      var name = 'quxiang-photo-' + Date.now().toString(36);
      var meta = {
        kind: 'class-photo', title: title,
        className: who,
        frame: frame,
        n: (typeof CLASS !== 'undefined' && CLASS.cards.length) || (PHOTO.targets ? PHOTO.targets.length : 0),
        date: new Date().toISOString().slice(0, 10),
      };
      var mainTxt = qxLocal('班级合影', 'class photo') + '\n' + who + '\n' + meta.date + '\n' + (meta.n || '') +
                    qxLocal(' 位同学', ' classmates') + '\n' + (typeof QX_ASSET_V !== 'undefined' ? ('asset v' + QX_ASSET_V) : '');
      var url = '/api/v1/projects/' + encodeURIComponent(me.username) + '/' + name;
      var res2 = await fetch(url, {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_type: 'quxiang',
          thumbnail: dataUri,
          extra_files: { 'main.txt': mainTxt },
          notes: title,
          project_metadata: meta,
        }),
      });
      var js = {};
      try { js = await res2.json(); } catch (e) {}
      if (!res2.ok || !js.ok) { if (typeof exportFailed === 'function') exportFailed(); return; }
      try {
        await fetch(url + '/metadata?ispublic=true&ispublished=true', { method: 'POST', credentials: 'same-origin' });
      } catch (e) {}
      if (typeof endExport === 'function') endExport();
      toast(qxLocal('合影已挂上作品墙（校内资源 → 作品墙）。',
                    'The class photo is on the wall (Campus → Wall).'), 4600);
    } catch (e) {
      if (typeof exportFailed === 'function') exportFailed();
    }
  })();
}
(function wallEntries() {
  var ov = document.getElementById('photoLab');
  if (!ov) return;                                          // 暗房是首开时构建的，这里只挂键位与出口
})();
