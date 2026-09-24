/* 趣像 19 (r43): 界面与键位收口、手机端操作、弱机降分辨率
   ─────────────────────────────────────────────────────────────
   1) 词条索引补全：UI_INDEX 只在 locale-lookbook.js 载入时建一次，之后 14 个扩展 push 的 151 条
      （班级人像、暗房、大屏、合奏小动作、i18n-fill 的 45 条……）从没进索引——中英切换对它们无效。
      这里在全部扩展之后重建一次索引，并让以后的 push 自动入索引。
   2) 键位表按"区"组织：数字＝终章与设置，字母＝动作，括号区＝合奏，; '＝拍照，< > |＝音乐；
      < > | 在键位表里点了没反应（它们走 scale-play 自己的监听而非 KEYMAP），现在点键帽会回放该键。
   3) 手机：键位表变成带名字的动作面板；底栏收成一行横滑（不再四个按钮竖排、把手压住键帽）；
      顶栏左侧的语言切换不再被挤出屏幕。
   4) 弱机：舞台连续 3 秒每帧绘制 >34ms 时，逐级降低舞台分辨率（每级 ×0.8，最低 1 倍），
      只对高分屏有效；拍照提分辨率期间不动。 */

/* ---------- 1) 词条索引补全 ---------- */
(function uxLocale(){
  if (typeof UI_PAIRS === 'undefined' || typeof UI_INDEX === 'undefined') return;
  UI_PAIRS.push(
    ['全场弹一遍', 'Strum the cast'], ['按音阶顺序，每张脸弹一个音。', 'A note on every face, in scale order.'],
    ['换调式', 'Another mode'], ['重新抽一个音阶（调、调式、走向、行距）。', 'Re-roll the scale (key, mode, direction, spacing).'],
    ['换一首', 'Next tune'], ['按当前调式奏下一首曲子。', 'Play the next tune in the current mode.'],
    ['大合照', 'Group photo'], ['大家聚拢摆个造型，闪光一下，出一张合影。', 'Everyone gathers into one pose, a flash goes off, and the photo is yours to save.'],
    ['看照片', 'View photo'], ['重新打开上一张合影：换相框、保存或分享。', 'Reopen the last group photo: change the frame, save, or share it.'],
    ['少一行', 'Fewer rows'], ['舞台少一行。', 'One row less on the stage.'], ['多一行', 'More rows'], ['舞台多一行。', 'One row more on the stage.'],
    ['数字：终章 1–7 · 设置', 'Numbers: finales 1–7 · settings'], ['字母：动作（Shift 全场版）', 'Letters: moves (Shift: everyone)'],
    ['合奏', 'Ensemble'], ['拍照', 'Camera'], ['音乐', 'Music'],
    ['Tab 显示/收起工具栏 · Esc 退出或取消 · Enter 打开指着的那张脸的卡片', 'Tab show/hide the toolbar · Esc leave or cancel · Enter open the card of the face under the pointer'],
    ['显示操作栏（Tab）', 'Show controls (Tab)'], ['收起操作栏（Tab）', 'Hide controls (Tab)']
  );
  function index(p){ if (!p || !p[0] || !p[1]) return; UI_INDEX[p[0]] = p; UI_INDEX[p[1]] = p; UI_INDEX[String(p[1]).toLowerCase()] = p; }
  UI_PAIRS.forEach(index);
  var push = UI_PAIRS.push;
  UI_PAIRS.push = function(){ for (var i = 0; i < arguments.length; i++) index(arguments[i]); return push.apply(UI_PAIRS, arguments); };
  if (typeof refreshLocale === 'function') refreshLocale();
})();

/* ---------- 2) 键位表按区组织 ---------- */
(function uxKeys(){
  if (typeof KEYINFO === 'undefined' || typeof KBROWS === 'undefined') return;
  if (!KEYINFO['|']) KEYINFO['|'] = ['Next tune', 'Play the next tune in the current mode.', 'action'];
  // 前五排是基线键盘（数字、三排字母、空格）；其后按区重排扩展键
  var core = KBROWS.slice(0, 5), zones = [['[', ']', '\\', '{', '}'], [';', '\''], ['<', '>', '|']];
  KBROWS.length = 0;
  core.concat(zones.map(function(r){ return r.filter(function(k){ return KEYINFO[k]; }); }).filter(function(r){ return r.length; }))
      .forEach(function(r){ KBROWS.push(r); });
  var ZONE = { '`':['数字：终章 1–7 · 设置', 1], '1':['数字：终章 1–7 · 设置', 1], 'q':['字母：动作（Shift 全场版）', 1], '[':['合奏'], ';':['拍照'], '<':['音乐'] };
  var baseBuild = buildKb;
  buildKb = function(){
    baseBuild();
    var kb = document.getElementById('kb'); if (!kb) return;
    Array.prototype.forEach.call(kb.querySelectorAll('.kbrow'), function(row){
      var b = row.querySelector('.cap b'); if (!b) return;
      var z = ZONE[b.textContent.toLowerCase()]; if (!z) return;
      var lab = document.createElement('span'); lab.className = 'kbzone' + (z[1] ? ' core' : '');
      lab.textContent = uiText(z[0]); row.insertBefore(lab, row.firstChild);
    });
    // 这几个键由扩展自己的监听处理（不在 KEYMAP 里）：点键帽时把按键回放给它们
    Array.prototype.forEach.call(kb.querySelectorAll('.cap'), function(cap){
      var k = cap.firstChild && cap.firstChild.textContent;
      if (!k || k.length !== 1 || KEYMAP[k] || KEYMAP[k.toLowerCase()]) return;
      cap.addEventListener('click', function(){ setTimeout(function(){ document.dispatchEvent(new KeyboardEvent('keydown', {key:k, bubbles:false})); }, 140); });
    });
    if (!document.getElementById('kbKeysNote')) {
      var note = document.createElement('p'); note.id = 'kbKeysNote'; note.className = 'legend';
      note.textContent = uiText('Tab 显示/收起工具栏 · Esc 退出或取消 · Enter 打开指着的那张脸的卡片');
      var info = document.getElementById('kbInfo'); if (info) info.parentNode.insertBefore(note, info);
    }
  };
  var kbEl = document.getElementById('kb'); if (kbEl && kbEl.firstChild) { kbEl.innerHTML = ''; }
})();

/* ---------- 3) 样式：键位区标签、手机底栏/顶栏/动作面板 ---------- */
(function uxStyle(){
  var st = document.createElement('style');
  st.textContent = [
    '#kb .kbzone{align-self:center;font:600 11px/1.3 sans-serif;letter-spacing:.1em;color:#7a6f5c;margin-right:6px;white-space:nowrap}',
    '#kb .kbzone.core{display:none}',
    '#kbKeysNote{margin-top:6px}',
    '@media (max-width:720px){#studioBar .studioActions{justify-content:flex-start!important}#studioBar .studioActions>*{flex-shrink:0}#studioBar .languageControl select{max-width:none;min-width:88px}}',
    '@media (max-width:640px){',
    /* 键位表 → 带名字的动作面板：四列、每格显示动作名，分区有小标题 */
    '  #help .helpSheet{max-height:calc(100vh - 28px);overflow-y:auto;-webkit-overflow-scrolling:touch}',
    '  #help .kbrow{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px!important;padding-left:0!important;margin:0 0 6px}',
    '  #help .kbzone,#help .kbzone.core{display:block;grid-column:1/-1;margin:8px 0 0}',
    '  #help .cap{width:auto!important;min-width:0!important;height:auto!important;min-height:52px;padding:5px 7px!important;text-align:left}',
    '  #help .cap span{display:block!important;font-size:11.5px;line-height:1.25;white-space:normal}',
    '  #help .cap b{font-size:12px!important;opacity:.72}',
    '  #help .cap.space{grid-column:span 2;width:auto!important}',
    /* 底栏：一行横滑，把手放最前，不再竖排、不再重叠 */
    '  #caption{display:flex!important;flex-wrap:nowrap!important;align-items:center;overflow-x:auto;overflow-y:hidden;gap:6px!important;',
    '    padding:6px 10px calc(6px + env(safe-area-inset-bottom,0px))!important;scrollbar-width:none;',
    '    -webkit-mask-image:linear-gradient(90deg,#000 86%,transparent);mask-image:linear-gradient(90deg,#000 86%,transparent)}',
    '  #caption::-webkit-scrollbar{display:none}',
    '  #caption .name,#caption .note{display:none!important}',
    '  #caption .tools,#caption #recent{display:contents!important}',
    '  #caption #immersiveDock{order:-1;margin:0!important;flex:0 0 auto;width:auto!important}',
    '  #caption .key,#caption button{flex:0 0 auto;min-height:44px;white-space:nowrap}',
    '  #caption .key.tool{order:1}#caption #recent .key{order:2}#caption #autoChip{order:1}',
    '}'
  ].join('\n');
  document.head.appendChild(st);
})();

/* ---------- 4) 弱机降分辨率 ---------- */
var QX_DPR_SCALE = 1;
(function uxLowPower(){
  var slow = 0;
  function tick(){
    try {
      var shooting = typeof PHOTO !== 'undefined' && PHOTO && (PHOTO.hi || PHOTO.active);
      if (!document.hidden && typeof perfDraw === 'number' && !shooting && !cardOpen) {
        if (perfDraw > 34) slow++; else slow = Math.max(0, slow - 1);
        if (slow >= 3 && DPR > 1.05 && QX_DPR_SCALE > .56) {
          slow = 0; QX_DPR_SCALE = Math.max(.56, QX_DPR_SCALE * .8);
          DPR = Math.max(1, DPR * .8); cv.width = (W*DPR) | 0; cv.height = (H*DPR) | 0;
          if (typeof rebuildPaper === 'function') rebuildPaper();
          if (typeof spriteClear === 'function') spriteClear();
        }
      }
    } catch (e) {}
    setTimeout(tick, 1000);
  }
  setTimeout(tick, 4000);
  try { window.__lowpower = { get scale(){ return QX_DPR_SCALE; }, get dpr(){ return DPR; } }; } catch (e) {}
})();
