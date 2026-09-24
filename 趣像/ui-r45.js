/* 趣像 22 (r45): 界面第一期（《界面与键位-高观点改造方案-r43》P1）
   ─────────────────────────────────────────────────────────────
   1) 上下文层 QX_CTX：弹层（角色包、进化树 / 图鉴 / 挑战……）开着时，按键只交给最上层；Esc 永远只退一层。
      以前弹层里按字母键会穿透到舞台（按 S 背后全场打喷嚏），在生态缸的弹层里按 Esc 会直接退出生态缸。
   2) 键位登记 QX_KEYS：把基线 KEYMAP/KEYINFO 与各扩展自挂的监听（Tab、< > |、; '、暗房里的键）汇成一张表，
      audit() 查同一上下文的重复与缺中/英文名；window.__keys 调试出口。键位表、手机动作面板仍由 KBROWS 生成。
   3) 工具栏浮层化：顶栏与表演条收进一个浮在舞台上方的 #toolDeck——展开/收起不再改变舞台尺寸（以前 706→611px，
      每张脸 73→64px 并整体下移）；有鼠标的设备上空闲 6 秒自动变淡，指针移到上方或按 Tab 复原。
   4) 手机底部五键：演（动作面板）· 拍（大合照）· 角色（角色包）· 进化（生态缸）· 工具（r46 起，原为设置）；原底栏在手机上收起，
      舞台下沿让出底栏高度。 */

/* ========== 1) 上下文层 ========== */
var QX_CTX = {
  layers: ['packsLayer', 'evoModal'],
  top: function () {
    for (var i = this.layers.length - 1; i >= 0; i--) { var el = document.getElementById(this.layers[i]); if (el && !el.hidden) return el; }
    return null;
  },
  add: function (id) { if (this.layers.indexOf(id) < 0) this.layers.push(id); }
};
window.addEventListener('keydown', function (e) {
  var L = QX_CTX.top(); if (!L) return;
  if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); L.remove(); return; }
  /* 其余键不往舞台传（按钮的回车/空格/Tab 等默认行为照常） */
  e.stopImmediatePropagation();
}, true);

/* ========== 2) 键位登记 ========== */
var QX_KEYS = {
  extra: [
    { key: 'Tab', ctx: 'stage', owner: 'studio.js', zh: '显示/收起工具栏', en: 'Show/hide the toolbar' },
    { key: '<', ctx: 'stage', owner: 'scale-play.js', zh: '全场弹一遍', en: 'Strum the cast' },
    { key: '>', ctx: 'stage', owner: 'scale-play.js', zh: '换调式', en: 'Another mode' },
    { key: '|', ctx: 'stage', owner: 'scale-play.js', zh: '换一首', en: 'Next tune' },
    { key: 'r', ctx: 'lab', owner: 'photo-lab.js', zh: '重拍', en: 'Reshoot' },
    { key: '1-7', ctx: 'lab', owner: 'photo-lab.js', zh: '选相框', en: 'Pick a frame' },
    { key: ' ', ctx: 'tank', owner: 'evolve-r44.js', zh: '暂停/继续', en: 'Pause/resume' },
    { key: '1-5', ctx: 'tank', owner: 'evolve-r44.js', zh: '换气候', en: 'Change climate' },
    { key: 'Escape', ctx: 'any', owner: 'ui-r45.js', zh: '退一层', en: 'Back out one layer' }
  ],
  list: function () {
    var out = [];
    Object.keys(KEYMAP).forEach(function (k) {
      var info = KEYINFO[k] || [], en = info[0] || KEYMAP[k];
      out.push({ key: k, ctx: 'stage', owner: 'KEYMAP', fx: KEYMAP[k], en: en, zh: uiText(en, 'zh') });
    });
    return out.concat(this.extra);
  },
  audit: function () {
    var seen = {}, bad = [];
    this.list().forEach(function (r) {
      var id = r.ctx + ':' + String(r.key).toLowerCase();
      if (r.owner !== 'KEYMAP' && seen[id] && seen[id].fx !== r.fx) bad.push('conflict ' + id + ' ' + seen[id].owner + ' / ' + r.owner);
      seen[id] = seen[id] || r;
      if (r.owner === 'KEYMAP' && /^fun:|^[a-z0-9]$/i.test(r.key) && (!r.zh || r.zh === r.en) && /[a-z]/i.test(r.en)) bad.push('no zh name ' + r.key + ' (' + r.en + ')');
    });
    return bad;
  }
};
UI_PAIRS.push(['显示/收起工具栏', 'Show/hide the toolbar'], ['重拍', 'Reshoot'], ['选相框', 'Pick a frame'], ['暂停/继续', 'Pause/resume'], ['换气候', 'Change climate'], ['退一层', 'Back out one layer']);

/* ========== 3) 工具栏浮层化 ========== */
(function toolDeck() {
  var sheet = document.getElementById('sheet'), bar = document.getElementById('studioBar'), play = document.getElementById('playBar'), stage = document.getElementById('stage');
  if (!sheet || !bar || !stage) return;
  var deck = document.createElement('div'); deck.id = 'toolDeck';
  sheet.insertBefore(deck, bar); deck.appendChild(bar); if (play) deck.appendChild(play);
  var st = document.createElement('style');
  st.textContent =
    '#toolDeck{position:absolute;left:0;right:0;top:0;z-index:30;display:flex;flex-direction:column;transition:opacity .4s ease}' +
    '#toolDeck #studioBar,#toolDeck #playBar{box-shadow:0 6px 18px rgba(56,47,36,.10)}' +
    '#toolDeck #studioBar{background:rgba(243,239,228,.9)!important}#toolDeck #playBar{background:rgba(232,238,229,.88)!important}' +
    '#toolDeck.rest{opacity:.12}#toolDeck.rest:hover,#toolDeck.rest:focus-within{opacity:1}' +
    '#sheet.immersive #toolDeck{pointer-events:none}';
  document.head.appendChild(st);
  /* 有鼠标的设备：空闲 6 秒变淡；指针到上方 64px 或按键时复原 */
  var hover = false; try { hover = window.matchMedia('(hover:hover) and (pointer:fine)').matches; } catch (e) {}
  if (!hover) return;
  var t = 0;
  var wake = function () { deck.classList.remove('rest'); clearTimeout(t); t = setTimeout(function () {
    if (deck.matches(':hover') || deck.contains(document.activeElement) || document.querySelector('.playMoreMenu:not([hidden]) :hover')) { wake(); return; }
    deck.classList.add('rest'); }, 6000); };
  window.addEventListener('pointermove', function (e) { if (e.clientY < 64 || deck.contains(e.target)) wake(); }, { passive: true });
  window.addEventListener('keydown', function (e) { if (e.key === 'Tab') wake(); });
  deck.addEventListener('focusin', wake);
  wake();
})();

/* ========== 4) 手机底部五键 ========== */
(function mobileDock() {
  var dock = document.createElement('nav'); dock.id = 'qxDock'; dock.setAttribute('aria-label', uiText('快捷操作'));
  var items = [
    ['act', '✦', '演', 'Act', function () { if (typeof toggleHelp === 'function') toggleHelp(); }],
    ['snap', '◉', '拍', 'Photo', function () { fire('snapshot'); }],
    ['packs', '▦', '角色', 'Cast', function () { if (typeof packsOpen === 'function') packsOpen(); }],
    ['evo', '❦', '进化', 'Evolve', function () { fire('evolve'); }],
    /* r46：原底栏收起后，工具栏把手也跟着看不见了——第五键改为"工具"（场景、语言、画材与设置、保存都在工具栏里） */
    ['tools', '☰', '工具', 'Tools', function () { if (typeof setImmersive === 'function') setImmersive(!immersiveState()); }]
  ];
  items.forEach(function (it) {
    var b = document.createElement('button'); b.type = 'button'; b.dataset.k = it[0];
    b.innerHTML = '<i aria-hidden="true"></i><span></span>'; b.querySelector('i').textContent = it[1]; b.querySelector('span').textContent = uiText(it[2]);
    b.addEventListener('click', function () { try { it[4](); } catch (e) {} });
    dock.appendChild(b);
  });
  UI_PAIRS.push(['快捷操作', 'Quick actions'], ['演', 'Act'], ['拍', 'Photo'], ['角色', 'Cast'], ['进化', 'Evolve'], ['设置', 'Settings'], ['工具', 'Tools']);
  var st = document.createElement('style');
  st.textContent =
    '#qxDock{display:none}' +
    '@media(max-width:640px){' +
    '  #qxDock{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:48;height:calc(58px + env(safe-area-inset-bottom,0px));padding:4px 6px env(safe-area-inset-bottom,0px);' +
    '    background:rgba(246,242,233,.96);border-top:1px solid #d9cfbc;box-shadow:0 -4px 16px rgba(56,47,36,.08);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}' +
    '  #qxDock button{flex:1 1 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;border:0;background:none;color:#3f4c43;font:12px/1.2 system-ui,"PingFang SC",sans-serif;min-height:48px;border-radius:12px}' +
    '  #qxDock button:active{background:#e6dfcf}#qxDock i{font-style:normal;font-size:19px;line-height:1}' +
    '  #sheet{padding-bottom:calc(58px + env(safe-area-inset-bottom,0px))}#caption{display:none!important}' +
    '  body.evo-on #qxDock{display:none}body.evo-on #sheet{padding-bottom:0}' +
    '}' +
    /* r46：横屏手机——底栏太占高度，改成右侧一条竖栏 */
    '@media(max-height:500px) and (orientation:landscape) and (pointer:coarse){' +
    '  #qxDock{display:flex;flex-direction:column;position:fixed;top:0;bottom:0;right:0;z-index:48;width:calc(62px + env(safe-area-inset-right,0px));padding:6px env(safe-area-inset-right,0px) 6px 4px;' +
    '    background:rgba(246,242,233,.96);border-left:1px solid #d9cfbc;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}' +
    '  #qxDock button{flex:1 1 0;display:flex;flex-direction:column;align-items:center;justify-content:center;border:0;background:none;color:#3f4c43;font:11px/1.2 system-ui,"PingFang SC",sans-serif;min-height:44px;border-radius:10px}' +
    '  #qxDock i{font-style:normal;font-size:17px;line-height:1}' +
    '  #sheet{padding-right:calc(62px + env(safe-area-inset-right,0px))}#caption{display:none!important}' +
    '  body.evo-on #qxDock{display:none}body.evo-on #sheet{padding-right:0}' +
    '}' +
    '@media(max-width:640px) and (prefers-color-scheme:dark){#qxDock{background:rgba(40,36,31,.96);border-color:#5a5044}#qxDock button{color:#efe7d8}}';
  document.head.appendChild(st);
  document.body.appendChild(dock);
  var mq = null; try { mq = window.matchMedia('(max-width:640px), (max-height:500px) and (orientation:landscape) and (pointer:coarse)'); } catch (e) {}
  if (mq) { var relayout = function () { requestAnimationFrame(function () { layout(); }); }; if (mq.addEventListener) mq.addEventListener('change', relayout); if (mq.matches) relayout(); }
  /* 进出生态缸时舞台下沿变了，重排一次 */
  var evoWas = document.body.classList.contains('evo-on');
  var obs = new MutationObserver(function () { var now = document.body.classList.contains('evo-on'); if (now === evoWas) return; evoWas = now; if (mq && mq.matches) requestAnimationFrame(function () { layout(); }); });
  obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();

try { window.__keys = { list: function () { return QX_KEYS.list(); }, audit: function () { return QX_KEYS.audit(); }, get ctx() { var t = QX_CTX.top(); return t ? t.id : 'stage'; } }; } catch (e) {}
