/* 趣像 13 (r24): 设置面板重新设计
   现状：11 个分组平铺（画材/Grid/新的邻居/Cast/Look/Motion/Sound/Autoplay/Share/演奏与界面/
   动作的分寸），一组接一组往下堆，找一项要滚很久，也看不出层级。
   做法（不动各分组的内容，只改组织方式）：
     1) 归成五层：场景与演员 / 画材与风格 / 动作与表演 / 声音与音乐 / 界面与分享；
     2) 每组折叠成 <details>，展开状态记在本地（第一次只展开"场景与演员"）；
     3) 顶部加一个**搜索框**：输入即筛（按项目名过滤，空组自动收起），并能提示"在别的分组里"；
     4) 音阶调式与音色归到"声音与音乐"、沉浸把手归到"界面与分享"。 */

(function panelDesign(){
  if (typeof PANEL === 'undefined') return;

  var PLAN = [
    { key: 'stage', title: '场景与演员', from: ['Grid', 'Cast', '新的邻居'] },
    { key: 'look', title: '画材与风格', from: ['画材 · 让每一笔有性格', 'Look'] },
    { key: 'motion', title: '动作与表演', from: ['动作的分寸', 'Motion'] },
    { key: 'sound', title: '声音与音乐', from: ['Sound', '演奏与界面'] },
    { key: 'ui', title: '界面与分享', from: ['Autoplay', 'Share'] },
  ];
  /* 跨组移动的项目：音阶调式/音色 → 声音与音乐；沉浸把手 → 界面与分享 */
  var MOVES = { scaleMode: '声音与音乐', instrument: '声音与音乐', dockMode: '界面与分享' };

  function findItem(id) {
    for (var i = 0; i < PANEL.length; i++) {
      var items = PANEL[i].items || [];
      for (var j = 0; j < items.length; j++) if (items[j].id === id) return { g: i, j: j, item: items[j] };
    }
    return null;
  }
  function takeItem(id) {
    var f = findItem(id); if (!f) return null;
    PANEL[f.g].items.splice(f.j, 1);
    if (!PANEL[f.g].items.length) PANEL.splice(f.g, 1);
    return f.item;
  }
  function pushTo(groupTitle, item) {
    var g = null;
    PANEL.forEach(function (G) { if (G.group === groupTitle) g = G; });
    if (!g) { g = { group: groupTitle, items: [] }; PANEL.push(g); }
    if (!g.items.some(function (it) { return it.id === item.id; })) g.items.push(item);
  }

  /* 1) 先按 PLAN 重排 + 改名（用原分组名匹配，改名后不影响后续判断） */
  var byTitle = {};
  PANEL.forEach(function (G) { byTitle[G.group] = G; });
  var ordered = [];
  PLAN.forEach(function (plan) {
    plan.from.forEach(function (src) {
      var G = byTitle[src]; if (!G) return;
      G.group = plan.title;                            // 同层各组统一改成新标题，随后按标题合并
      ordered.push(G);
    });
  });
  // 合并同层：把同标题的组并成一个
  var merged = [];
  ordered.forEach(function (G) {
    var hit = null;
    merged.forEach(function (M) { if (M.group === G.group) hit = M; });
    if (hit) hit.items = hit.items.concat(G.items); else merged.push({ group: G.group, note: G.note, items: G.items.slice() });
  });
  // 未列入 PLAN 的组兜到最后一层
  PANEL.forEach(function (G) { if (!merged.some(function (M) { return M.group === G.group; })) merged.push(G); });
  PANEL.length = 0; merged.forEach(function (M) { PANEL.push(M); });

  /* 2) 跨组移动 */
  Object.keys(MOVES).forEach(function (id) {
    var it = takeItem(id);
    if (it) pushTo(MOVES[id], it);
  });

  /* 3) 折叠 + 搜索：包一层 buildPanel */
  var baseBuildPanel = buildPanel;
  var OPEN_KEY = 'quxiang.panelOpen';
  function loadOpen() { try { return JSON.parse(localStorage.getItem(OPEN_KEY) || 'null') || {}; } catch (e) { return {}; } }
  function saveOpen(o) { try { localStorage.setItem(OPEN_KEY, JSON.stringify(o)); } catch (e) {} }

  buildPanel = function () {
    baseBuildPanel.apply(this, arguments);
    var body = document.getElementById('panelBody');
    if (!body) return;
    var open = loadOpen();

    // 搜索框
    var box = document.createElement('div');
    box.className = 'qx-search';
    var inp = document.createElement('input');
    inp.type = 'search'; inp.placeholder = '找一项设置…（如 音色 / 行数 / 分享）';
    inp.setAttribute('aria-label', '搜索设置');
    var count = document.createElement('span'); count.className = 'qx-search-count';
    box.appendChild(inp); box.appendChild(count);
    body.insertBefore(box, body.firstChild);

    var secs = Array.prototype.slice.call(body.querySelectorAll('section.grp'));
    secs.forEach(function (sec, i) {
      var h3 = sec.querySelector('h3');
      var title = h3 ? h3.textContent : '分组';
      var det = document.createElement('details');
      det.className = 'qx-grp';
      var sum = document.createElement('summary');
      var n = sec.querySelectorAll('.ctl').length;
      sum.innerHTML = '<span class="qx-grp-title"></span><span class="qx-grp-n">' + n + '</span>';
      sum.querySelector('.qx-grp-title').textContent = title;
      det.appendChild(sum);
      // 把原 section 里的控件搬进 details
      Array.prototype.slice.call(sec.children).forEach(function (child) { if (child !== h3) det.appendChild(child); });
      sec.parentNode.replaceChild(det, sec);
      var key = title;
      det.open = (open[key] === undefined) ? (i === 0) : !!open[key];
      det.addEventListener('toggle', function () { var o = loadOpen(); o[key] = det.open; saveOpen(o); });
    });

    // 画材预览与提示原本浮在所有分组之上——归进「画材与风格」组里
    var lookDet = null;
    Array.prototype.slice.call(body.querySelectorAll('details.qx-grp')).forEach(function (det) {
      if (det.querySelector('.qx-grp-title').textContent === '画材与风格') lookDet = det;
    });
    if (lookDet) {
      var sample = body.querySelector('#brushSample');
      var hint = body.querySelector('.studioHint');
      if (sample && sample.parentNode !== lookDet) lookDet.insertBefore(sample, lookDet.querySelector('.ctl') || null);
      if (hint && hint.parentNode !== lookDet) lookDet.insertBefore(hint, sample || null);
      if (sample) sample.style.marginTop = '6px';
    }

    // 搜索框按 Esc：先交还焦点，再让面板照常关闭（否则焦点留在输入框，快捷键会被吃掉）
    inp.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      inp.blur();
      var panel = document.getElementById('panel');
      if (panel && typeof togglePanel === 'function') togglePanel(false);
    });

    // 搜索：按项目名过滤
    inp.addEventListener('input', function () {
      var q = inp.value.trim().toLowerCase();
      var grps = Array.prototype.slice.call(body.querySelectorAll('details.qx-grp'));
      var hits = 0;
      grps.forEach(function (det) {
        var shown = 0;
        Array.prototype.slice.call(det.querySelectorAll('.ctl')).forEach(function (row) {
          var text = (row.textContent || '').toLowerCase();
          var ok = !q || text.indexOf(q) >= 0;
          row.style.display = ok ? '' : 'none';
          if (ok) shown++;
        });
        hits += shown;
        det.style.display = shown ? '' : 'none';
        if (q) det.open = shown > 0;                       // 搜索时自动展开有命中的组
      });
      count.textContent = q ? (hits ? hits + ' 项' : '没有匹配') : '';
    });
    return;
  };

  /* ── 行/列快捷 +− ：菜单里直接点，不必拖滑块（0 表示自动，从当前生效值起步） ── */
  function stepSize(which, delta) {
    var isCols = which === 'cols';
    var eff = isCols ? (typeof cols !== 'undefined' ? cols : 7) : (typeof rows !== 'undefined' ? rows : 6);
    var cur = Number(CFG[which] || 0) || eff;                 // 0=自动 → 用当前生效值起步
    var lo = isCols ? 3 : 2, hi = isCols ? 14 : 10;
    CFG[which] = Math.max(lo, Math.min(hi, cur + delta));
    try { saveCfg(); } catch (e) {}
    try { layout(); } catch (e) {}
    try { syncPanel(); } catch (e) {}
  }
  var stageBase = buildPanel;
  buildPanel = function () {
    var r = stageBase.apply(this, arguments);
    var body = document.getElementById('panelBody');
    if (!body) return r;
    [['cfg-cols', 'cols', '列'], ['cfg-rows', 'rows', '行']].forEach(function (spec) {
      var inp = document.getElementById(spec[0]);
      if (!inp || inp.dataset.qxStep) return;
      inp.dataset.qxStep = '1';
      var wrap = document.createElement('span');
      wrap.className = 'qx-step';
      wrap.setAttribute('role', 'group');
      wrap.setAttribute('aria-label', spec[2] + '数增减');
      [['−', -1], ['+', 1]].forEach(function (b) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = b[0];
        btn.setAttribute('aria-label', (b[1] > 0 ? '增加' : '减少') + spec[2] + '数');
        btn.addEventListener('click', function () { stepSize(spec[1], b[1]); });
        wrap.appendChild(btn);
      });
      var row = inp.closest('.ctl') || inp.parentNode;
      row.appendChild(wrap);
    });
    return r;
  };

  /* 键盘：− / = 本来只调列，这里补 Shift 版调行（与滑块同一套边界） */
  try {
    TRIG.fewerRows = function () { stepSize('rows', -1); };
    TRIG.moreRows = function () { stepSize('rows', 1); };
    KEYMAP['_'] = 'fewerRows';       // Shift + −
    KEYMAP['+'] = 'moreRows';        // Shift + =
    KEYINFO['_'] = ['Fewer rows', 'One row less on the stage.', 'action'];
    KEYINFO['+'] = ['More rows', 'One row more on the stage.', 'action'];
    if (typeof UI_PAIRS !== 'undefined') {
      UI_PAIRS.push(['减少行数', 'One row fewer'], ['增加行数', 'One row more'],
        ['行数增减', 'Rows +/−'], ['列数增减', 'Columns +/−'],
        ['One row less on the stage.', 'One row less on the stage.']);
    }
  } catch (e) {}

  /* 4) 样式 */
  var st = document.createElement('style');
  st.textContent = [
    '#panelBody .qx-search{display:flex;gap:8px;align-items:center;margin:0 0 12px}',
    '#panelBody .qx-search input{flex:1;min-width:0;padding:8px 12px;border-radius:999px;border:1px solid var(--edge,#cdc5b2);background:#fff9;font:13px/1.4 inherit;color:inherit}',
    '#panelBody .qx-search input:focus-visible{outline:2px solid #36564c;outline-offset:2px}',
    '#panelBody .qx-search-count{font-size:11px;color:#7c8676;white-space:nowrap}',
    '#panelBody details.qx-grp{border-top:1px solid var(--edge,#cdc5b2);padding:2px 0}',
    '#panelBody details.qx-grp>summary{cursor:pointer;list-style:none;display:flex;align-items:center;gap:8px;padding:9px 2px;font:600 13px/1.4 inherit;letter-spacing:.06em}',
    '#panelBody details.qx-grp>summary::-webkit-details-marker{display:none}',
    '#panelBody details.qx-grp>summary::before{content:"▸";font-size:10px;opacity:.6;transition:transform .18s ease}',
    '#panelBody details.qx-grp[open]>summary::before{transform:rotate(90deg)}',
    '#panelBody .qx-grp-n{margin-left:auto;font-size:11px;font-weight:400;opacity:.55}',
    '#panelBody details.qx-grp[open]>summary{margin-bottom:6px}',
    '#panelBody .ctl .qx-step{display:inline-flex;gap:4px;margin-left:6px}',
    '#panelBody .ctl .qx-step button{width:24px;height:22px;border-radius:6px;border:1px solid var(--edge,#cdc5b2);background:#fff7;color:inherit;cursor:pointer;font:14px/1 inherit;padding:0}',
    '#panelBody .ctl .qx-step button:hover{background:#36564c;color:#fff;border-color:#36564c}',
    '#panelBody .ctl .qx-step button:focus-visible{outline:2px solid #36564c;outline-offset:2px}',
  ].join('\n');
  document.head.appendChild(st);

  /* 词条 */
  if (typeof UI_PAIRS !== 'undefined') {
    UI_PAIRS.push(
      ['场景与演员', 'Stage & cast'], ['画材与风格', 'Materials & style'],
      ['动作与表演', 'Motion & performance'], ['界面与分享', 'Interface & sharing'],
      ['找一项设置…（如 音色 / 行数 / 分享）', 'Find a setting… (e.g. instrument / rows / sharing)'],
      ['搜索设置', 'Search settings'], ['没有匹配', 'no match'],
    );
  }
  try {
    window.__panel = {
      groups: function () { return PANEL.map(function (G) { return G.group + '(' + (G.items || []).length + ')'; }); },
      open: function () { var o = {}; document.querySelectorAll('#panelBody details.qx-grp').forEach(function (d) { o[d.querySelector('.qx-grp-title').textContent] = d.open; }); return o; },
    };
  } catch (e) {}
})();
