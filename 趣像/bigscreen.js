/* 趣像 18 (r40): 课堂大屏模式 —— 投屏/家长会用，全程不需要键盘
   ─────────────────────────────────────────────────────────────
   场景：教室里把趣像投到大屏（或家长会展示班级合影）。要的是"远看好看、近点不慌"：
     · 全屏（浏览器允许就真全屏；不允许也照常工作，只是仍带浏览器边框）
     · 收起工具条与页脚，只留一排**大按钮**（≥64px，触屏/鼠标都能点，投影上也看得清）
     · **表情轮播**：原始 → 喜 → 怒 → 哀 → 乐，每 12 秒换一版（可暂停）
     · 一切操作都有按钮：拍合影 / 直接跳到某个表情 / 暂停轮播 / 退出大屏（Esc 也能退）

   与既有功能的关系：只做"呈现层"——班级人像仍由 class-faces 提供（载入/切班/点卡片都在），
   本文件负责"投屏时的界面与节奏"，不改数据与存储。 */

var BS = { on: false, auto: true, idx: 0, timer: 0, busy: false };
var BS_SEQ = ['', 'joy', 'anger', 'sorrow', 'delight'];
var BS_ZH = { '': '原始', joy: '喜', anger: '怒', sorrow: '哀', delight: '乐' };

/* 切"整班表情"：静默重取（不弹载入进度），逐张替换卡画布 */
function bsSetEmotion(emo, quiet) {
  if (BS.busy || typeof CLASS === 'undefined' || !CLASS.cards.length) return;
  BS.busy = true;
  CFG.classEmotion = emo;
  var V = (typeof QX_ASSET_V !== 'undefined') ? ('?v=' + QX_ASSET_V) : '';
  var get = function (u) { return fetch(u, { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.blob() : null; }).catch(function () { return null; }); };
  var tasks = CLASS.cards.map(function (card) {
    var first = emo ? ('/avatars/unified/emotion/' + emo + '/' + card.uid + '.png' + V)
                    : ('/avatars/unified/display/' + card.uid + '.png' + V);
    return get(first).then(function (b) { return b || get('/avatars/unified/display/' + card.uid + '.png' + V); })
      .then(function (b) { return b ? createImageBitmap(b) : null; })
      .then(function (img) {
        if (!img) return;
        var card2 = classBaselineCard(img, card.name);
        try { img.close && img.close(); } catch (e) {}
        try { card.canvas.width = 1; card.canvas.height = 1; } catch (e) {}
        card.canvas = card2;
      }).catch(function () {});
  });
  Promise.all(tasks).then(function () {
    BS.busy = false;
    if (!quiet && typeof toast === 'function') toast(qxLocal('全班已换成', 'Whole class switched to') + ' · ' + bsZh(emo), 1800);
    bsSync();
  });
}
function bsZh(e) { return qxLocal(BS_ZH[e] || e, { '': 'Original', joy: 'Joy', anger: 'Anger', sorrow: 'Sorrow', delight: 'Delight' }[e] || e); }

/* 轮播：到点换下一种表情（暂停/恢复用同一个开关） */
function bsTick() {
  if (!BS.on || !BS.auto || BS.busy) return;
  BS.idx = (BS.idx + 1) % BS_SEQ.length;
  bsSetEmotion(BS_SEQ[BS.idx], true);
}
function bsAuto(on) {
  BS.auto = (on == null) ? !BS.auto : !!on;
  if (BS.timer) { clearInterval(BS.timer); BS.timer = 0; }
  if (BS.on && BS.auto) BS.timer = setInterval(bsTick, 12000);
  bsSync();
}

/* 界面：状态类 + 一排大按钮 */
function bsBuildBar() {
  if (document.getElementById('bsBar')) return;
  var bar = document.createElement('div');
  bar.id = 'bsBar';
  bar.innerHTML =
    '<button type="button" data-bs="shot">' + qxLocal('拍合影', 'Class photo') + '</button>' +
    '<span class="bs-sep"></span>' +
    BS_SEQ.map(function (e) {
      return '<button type="button" data-bs="emo" data-emo="' + e + '">' + bsZh(e) + '</button>';
    }).join('') +
    '<span class="bs-sep"></span>' +
    '<button type="button" data-bs="auto">' + qxLocal('轮播：开', 'Rotate: on') + '</button>' +
    '<button type="button" data-bs="exit">' + qxLocal('退出大屏', 'Exit') + '</button>';
  document.body.appendChild(bar);
  bar.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('button[data-bs]') : null;
    if (!b) return;
    var a = b.dataset.bs;
    if (a === 'shot') { if (typeof photoStart === 'function') photoStart(); }
    else if (a === 'emo') { BS.idx = BS_SEQ.indexOf(b.dataset.emo); bsSetEmotion(b.dataset.emo); }
    else if (a === 'auto') { bsAuto(); }
    else if (a === 'exit') { bsExit(); }
  });
}
function bsSync() {
  var bar = document.getElementById('bsBar');
  if (!bar) return;
  Array.prototype.forEach.call(bar.querySelectorAll('button'), function (b) {
    if (b.dataset.bs === 'emo') {
      var on = (b.dataset.emo || '') === String(CFG.classEmotion || '');
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  });
  var ab = bar.querySelector('button[data-bs="auto"]');
  if (ab) ab.textContent = BS.auto ? qxLocal('轮播：开', 'Rotate: on') : qxLocal('轮播：停', 'Rotate: paused');
}
function bsEnter() {
  if (typeof CLASS === 'undefined' || !CLASS.cards.length) {
    toast(qxLocal('先载入班级人像，再进大屏模式。', 'Load a class first, then open big-screen mode.'), 2800);
    return;
  }
  BS.on = true;
  document.documentElement.classList.add('bigscreen');
  bsBuildBar();
  BS.idx = Math.max(0, BS_SEQ.indexOf(String(CFG.classEmotion || '')));
  bsAuto(true);
  try { if (!document.fullscreenElement && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen(); } catch (e) {}
  toast(qxLocal('大屏模式：Esc 退出 · 12 秒换一种表情', 'Big screen: Esc to exit · a new expression every 12s'), 3200);
}
function bsExit() {
  BS.on = false;
  document.documentElement.classList.remove('bigscreen');
  bsAuto(false);
  var bar = document.getElementById('bsBar');
  if (bar) bar.remove();
  try { if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen(); } catch (e) {}
}

/* 样式：大按钮（≥64px，投影/触屏都点得准），纸面色板、低调不抢画面 */
(function bsStyle() {
  var st = document.createElement('style');
  st.textContent = [
    '#bsBar{position:fixed;left:0;right:0;bottom:0;z-index:55;display:none;flex-wrap:wrap;gap:10px;justify-content:center;',
    '  align-items:center;padding:12px 14px calc(12px + env(safe-area-inset-bottom,0px));',
    '  background:linear-gradient(180deg,rgba(243,239,228,0) 0%,rgba(243,239,228,.92) 38%,rgba(243,239,228,.98) 100%)}',
    'html.bigscreen #bsBar{display:flex}',
    'html.bigscreen #caption,html.bigscreen #actions,html.bigscreen #studioBar,html.bigscreen #immersiveDock{display:none !important}',
    '#bsBar button{font:inherit;font-size:15px;min-height:64px;min-width:96px;padding:10px 20px;border-radius:14px;cursor:pointer;',
    '  border:1px solid var(--edge);background:#fffdf7;color:var(--ink);box-shadow:0 6px 16px rgba(0,0,0,.10)}',
    '#bsBar button[aria-pressed="true"]{background:var(--ink);color:var(--paper);border-color:var(--ink)}',
    '#bsBar button[data-bs="shot"]{background:var(--stamp);color:#fdf6ec;border-color:var(--stamp);font-weight:600}',
    '#bsBar .bs-sep{width:1px;height:38px;background:var(--edge);opacity:.7}',
    '@media (max-width:620px){#bsBar{gap:8px;padding:10px}#bsBar button{min-width:74px;min-height:56px;font-size:14px;padding:8px 12px}}',
  ].join('\n');
  document.head.appendChild(st);
})();

/* 入口：表演条按钮 + Esc 退出 */
(function bsEntry() {
  var menu = document.querySelector('.playMoreMenu');
  if (menu) {
    var lab = document.createElement('div');
    lab.className = 'playLabel'; lab.style.cssText = 'margin:2px 0 0;font-size:11px;opacity:.7';
    lab.textContent = qxLocal('课堂大屏', 'Big screen');
    menu.appendChild(lab);
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = qxLocal('大屏模式', 'Big-screen mode');
    b.addEventListener('click', bsEnter);
    menu.appendChild(b);
  }
  document.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Escape' && BS.on) { e.preventDefault(); bsExit(); }
  });
})();

if (typeof UI_PAIRS !== 'undefined') {
  UI_PAIRS.push(['课堂大屏', 'Big screen'], ['大屏模式', 'Big-screen mode'], ['拍合影', 'Class photo'],
    ['轮播：开', 'Rotate: on'], ['轮播：停', 'Rotate: paused'], ['退出大屏', 'Exit']);
}

try {
  window.__big = {
    enter: bsEnter, exit: bsExit, auto: bsAuto, setEmotion: bsSetEmotion,
    get on() { return BS.on; },
    get autoOn() { return BS.auto; },
    get idx() { return BS.idx; },
    get emotion() { return String(CFG.classEmotion || ''); },
    barHeight: function () { var b = document.getElementById('bsBar'); return b ? Math.round(b.getBoundingClientRect().height) : 0; },
    btn: function (n) { var b = document.querySelector('#bsBar button[data-bs="' + n + '"]'); return b ? { h: Math.round(b.getBoundingClientRect().height), t: b.textContent.trim() } : null; },
  };
} catch (e) {}
