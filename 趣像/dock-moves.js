/* 趣像 09 (r22): 界面把手归位 + 缺位动画接上键盘
   一、沉浸把手（"显示工具"）原本固定在画布顶部居中，挡在头像区。改为**默认放进下方栏**，
       并在设置里给三个选择：底部栏（默认）／右上角／隐藏（按 Tab 随时叫回来）。
   二、应用里有一批"反应型"动画（laugh / bobble / stargaze / cheer / bow / canon …）
       只作为邻居反应的内部素材，没有键盘出口——这里把它们编成五个整场动作并接上键位，
       同时写进快捷键一览（帮助面板）与页脚图例。 */

/* ══ 一、沉浸把手：默认进底栏 ══ */
CFG_DEFAULT.dockMode = (CFG_DEFAULT.dockMode == null) ? 'bar' : CFG_DEFAULT.dockMode;
CFG.dockMode = (CFG.dockMode == null) ? CFG_DEFAULT.dockMode : CFG.dockMode;
if (SHARE_KEYS.indexOf('dockMode') < 0) SHARE_KEYS.push('dockMode');

(function dockSetup(){
  var st = document.createElement('style');
  st.textContent = [
    /* 底部栏：把手变成页脚里的一枚小按钮 */
    'html.dock-bar #immersiveDock{position:static !important;transform:none !important;opacity:1 !important;pointer-events:auto;display:flex;align-items:center;margin-left:6px}',
    'html.dock-bar #immersiveToggle{border:1px solid var(--edge,#cdc5b2);background:transparent;box-shadow:none;padding:2px 8px;font-size:11px;border-radius:999px;color:inherit;backdrop-filter:none}',
    'html.dock-bar #immersiveToggle:hover{background:#36564c;color:#fff;border-color:#36564c}',
    /* 右上角：留在画布角上但缩小、降存在感 */
    'html.dock-corner #immersiveDock{position:fixed !important;top:calc(env(safe-area-inset-top,0px) + 8px) !important;right:10px !important;left:auto !important;bottom:auto !important;transform:none !important;opacity:.42 !important;z-index:52}',
    'html.dock-corner #immersiveDock:hover{opacity:1 !important}',
    /* 隐藏：只留键盘 U */
    'html.dock-hidden #immersiveDock{display:none !important}',
  ].join('\n');
  document.head.appendChild(st);

  window.__applyDockMode = function(){
    var mode = String(CFG.dockMode || 'bar');
    var dock = document.getElementById('immersiveDock');
    var sheet = document.getElementById('sheet');
    var caption = document.getElementById('caption');
    if (!dock || !sheet || !caption) return;
    document.documentElement.classList.toggle('dock-bar', mode === 'bar');
    document.documentElement.classList.toggle('dock-corner', mode === 'corner');
    document.documentElement.classList.toggle('dock-hidden', mode === 'hidden');
    if (mode === 'bar') {
      if (dock.parentElement !== caption) caption.appendChild(dock);   // 进底栏
    } else if (dock.parentElement !== sheet) {
      sheet.insertBefore(dock, document.getElementById('stage'));     // 回到画布层（角落/隐藏）
    }
  };
  window.__applyDockMode();
  setTimeout(window.__applyDockMode, 400);   // 底栏可能在启动后才渲染
})();

/* ── 返回拾趣馆：原来固定在画布右上角，同样挪进底栏 ── */
(function backLinkToBar(){
  var a = document.getElementById('funBackLink');
  if (!a) return;
  var st2 = document.createElement('style');
  st2.textContent = [
    'html.dock-bar #funBackLink{position:static !important;top:auto !important;right:auto !important;',
    'border:1px solid var(--edge,#cdc5b2);background:transparent;color:inherit;box-shadow:none;',
    'padding:2px 8px;font-size:11px;border-radius:999px;backdrop-filter:none;opacity:1;margin-left:6px}',
    'html.dock-bar #funBackLink:hover{background:#36564c;color:#fff;border-color:#36564c}',
  ].join('\n');
  document.head.appendChild(st2);
  var caption = document.getElementById('caption');
  function place(){
    if (!caption || !document.documentElement.classList.contains('dock-bar')) return;
    if (a.parentElement !== caption) caption.appendChild(a);
  }
  place();
  setTimeout(place, 400);
  // 把手模式切换时一并归位
  var baseApply = window.__applyDockMode;
  if (baseApply) window.__applyDockMode = function(){ baseApply(); a.style.display = ''; place(); };
})();

/* ══ 二、五个"缺位"动作接上键盘 ══ */
(function connectMoves(){
  var MOVES = {
    '[': { fx: 'laugh',    name: 'Giggle wave', zh: '笑场',
           desc: 'A ripple of laughter crosses the grid; every other row bobs along.',
           zhDesc: '一排排笑开，隔行随声点头。',
           run: function(){ each(function(h){ act(h, h.row % 2 ? 'laugh' : 'bobble', { delay: h.col * 68 + h.row * 28 }); }); } },
    ']': { fx: 'stargaze', name: 'Look up', zh: '仰望',
           desc: 'Everyone tips their head back to the sky, bottom row last.',
           zhDesc: '齐齐抬头看天，后排先抬、前排随后。',
           run: function(){ each(function(h){ act(h, 'stargaze', { delay: h.col * 55 + (rows - 1 - h.row) * 42 }); }); } },
    '\\': { fx: 'bow',     name: 'Take a bow', zh: '谢幕',
           desc: 'A curtain call sweeping right to left.',
           zhDesc: '谢幕式鞠躬，从右往左依次。',
           run: function(){ each(function(h){ act(h, 'bow', { delay: (cols - 1 - h.col) * 85 + h.row * 20 }); }); } },
    '{': { fx: 'cheer',    name: 'Cheer', zh: '欢呼',
           desc: 'Row by row, a cheer goes up.',
           zhDesc: '一排接一排地欢呼起来。',
           run: function(){ each(function(h){ act(h, 'cheer', { delay: h.row * 95 + Math.random() * 120 }); }); } },
    '}': { fx: 'canon',    name: 'Round', zh: '轮唱',
           desc: 'The cast sings a round, column after column.',
           zhDesc: '一列接一列，唱成一个轮子。',
           run: function(){ each(function(h){ act(h, 'canon', { delay: h.col * 150 }); }); } },
  };
  Object.keys(MOVES).forEach(function(k){
    var M = MOVES[k];
    if (typeof FXDEF[M.fx] !== 'function' && !(FXDEF && FXDEF[M.fx])) return;   // 动作不存在就跳过
    TRIG[M.fx] = M.run;
    KEYMAP[k] = M.fx;
    TRIG_NAMES[M.fx] = M.name.toLowerCase();
    KEYINFO[k] = [M.name, M.desc, 'action'];
    if (typeof UI_PAIRS !== 'undefined') UI_PAIRS.push([M.zh, M.name], [M.zhDesc, M.desc]);
  });
  if (typeof KBROWS !== 'undefined') {
    var extra = Object.keys(MOVES).filter(function(k){ return KEYMAP[k]; });
    if (extra.length && !KBROWS.some(function(r){ return r.indexOf(extra[0]) >= 0; })) KBROWS.push(extra);
  }
  /* 表演条里也放一份入口（不认识键盘的人也能玩到） */
  var menu = document.querySelector('.playMoreMenu');
  if (menu) {
    var lab = document.createElement('div');
    lab.className = 'playLabel'; lab.style.cssText = 'margin:2px 0 0;font-size:11px;opacity:.7';
    lab.textContent = '小动作';
    menu.appendChild(lab);
    Object.keys(MOVES).forEach(function(k){
      var M = MOVES[k]; if (!KEYMAP[k]) return;
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = M.zh;
      b.addEventListener('click', function(){ M.run(); });
      menu.appendChild(b);
    });
  }
})();

/* ══ 三、设置：把手位置 + 音阶调式（"设置页面要设计齐全"）══ */
(function dockPanel(){
  var grp = {
    group: '演奏与界面',
    note: '音阶调式决定点击角色时发出的音高分布；把手是"显示工具"那枚按钮的位置。',
    items: [
      { id: 'scaleMode', label: '音阶调式', type: 'seg',
        opts: [['auto', '每次随机'], ['gong', '宫'], ['shang', '商'], ['jiao', '角'], ['zhi', '徵'], ['yu', '羽']] },
      { id: 'dockMode', label: '沉浸把手', type: 'seg',
        opts: [['bar', '底部栏'], ['corner', '右上角'], ['hidden', '隐藏（按 Tab）']] },
    ],
  };
  if (typeof PANEL !== 'undefined' && !PANEL.some(function(G){ return G.group === grp.group; })) {
    var at = -1;
    PANEL.forEach(function(G, i){ if (G.group === 'Sound') at = i; });
    if (at >= 0) PANEL.splice(at, 0, grp); else PANEL.push(grp);
  }
  /* 改配置后立即生效 */
  var baseSync = (typeof syncPanel === 'function') ? syncPanel : null;
  if (baseSync) {
    syncPanel = function(){
      baseSync.apply(this, arguments);
      if (window.__applyDockMode) window.__applyDockMode();
      if (typeof PLAY !== 'undefined' && CFG.scaleMode && CFG.scaleMode !== 'auto' && PLAY.scale && PLAY.scale.key !== CFG.scaleMode
          && typeof playRandomScale === 'function') playRandomScale();
    };
  }
})();

if (typeof UI_PAIRS !== 'undefined') {
  UI_PAIRS.push(
    ['演奏与界面', 'Playing & interface'],
    ['音阶调式', 'Musical mode'], ['每次随机', 'Random each time'],
    ['宫', 'Gong'], ['商', 'Shang'], ['角', 'Jiao'], ['徵', 'Zhi'], ['羽', 'Yu'],
    ['沉浸把手', 'Immersive handle'], ['底部栏', 'In footer'], ['右上角', 'Top right'], ['隐藏（按 Tab）', 'Hidden (press Tab)'],
    ['音阶调式决定点击角色时发出的音高分布；把手是"显示工具"那枚按钮的位置。',
     'The mode shapes the pitches you hear when tapping a head; the handle is where the "show tools" button sits.'],
    ['小动作', 'Small moves'],
  );
}

try {
  window.__dock = {
    get mode(){ return CFG.dockMode; }, set mode(v){ CFG.dockMode = v; if (window.__applyDockMode) window.__applyDockMode(); },
    get where(){ var d = document.getElementById('immersiveDock'); return d && d.parentElement ? (d.parentElement.id || d.parentElement.tagName) : 'none'; },
    moves: function(){ return Object.keys(KEYMAP).filter(function(k){ return '[]\\{}'.indexOf(k) >= 0; }).map(function(k){ return k + '→' + KEYMAP[k]; }); },
  };
} catch (e) {}
