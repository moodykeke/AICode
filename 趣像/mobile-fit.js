/* 趣像 18 (r34): 手机端适配 —— 按钮点得准、工具条不裁切
   ─────────────────────────────────────────────────────────────
   实机（390×844）量到的问题：
     · 工具条 #immersiveDock 的按钮只有 42×27px，手指点不准（建议 ≥ 40px 高）；
     · 底部键位行右侧被裁掉（内容超出却只换行不滚动）；
     · 顶部工具区在窄屏占掉近三分之一屏高。
   只加样式，不动逻辑：窄屏下把可横滑的条变横滑、按钮抬到可点高度、
   顶部工具区默认收窄，并保证所有按钮都在可触范围内。 */
(function mobileFit() {
  var st = document.createElement('style');
  st.textContent = [
    '@media (max-width: 620px), (pointer: coarse) {',
    /* 工具条：横滑不换行，按钮抬到 40px 高 */
    '  #immersiveDock{max-width:100%;overflow-x:auto;overflow-y:hidden;flex-wrap:nowrap;',
    '    -webkit-overflow-scrolling:touch;scrollbar-width:none;gap:8px}',
    '  #immersiveDock::-webkit-scrollbar{display:none}',
    '  #immersiveDock button{min-height:40px;padding:8px 12px;font-size:13px;flex:0 0 auto}',
    '  #sceneMoreMenu button,.playMoreMenu button,#immersiveToggle,.x{min-height:40px}',
    /* 兜底：舞台外壳与各类浮层菜单里的按钮，手机上统一抬到可点高度 */
    '  #stage button,#actions button,[id$="Menu"] button,[class$="Menu"] button,[class*="scene"] button,[class*="chips"] button{min-height:40px}',
    '  .sw{width:30px;height:30px}',
    /* 一条兜底：手机上除色块/圆点这类小控件外，所有按钮都抬到可点高度 */
    '  button:not(.sw):not(.dot){min-height:40px}',
    '  #caption .name{white-space:nowrap;font-size:12px}',
    /* 底部键位/工具行：横滑，键帽保持方正好点 */
    '  #caption{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;gap:6px}',
    '  #caption::-webkit-scrollbar{display:none}',
    '  #caption .cap{flex:0 0 auto;min-height:46px;width:62px;height:52px}',
    '  #caption button,.tools button,#caption .tools button{flex:0 0 auto;min-height:40px;padding:8px 10px}',
    /* 顶部工具区：窄屏收成一行横滑，别吃掉舞台 */
    '  #actions{max-width:100%;overflow-x:auto;flex-wrap:nowrap;-webkit-overflow-scrolling:touch;gap:6px}',
    '  #actions::-webkit-scrollbar{display:none}',
    '  #actions button{flex:0 0 auto}',
    /* 弹窗/设置面板：窄屏占满宽，按钮可点 */
    '  #panel{width:100vw}',
    '  #photoLab .ql,#classStatus{max-width:100%}',
    '  .ql-acts button,.ql-frames button{min-height:40px}',
    '}',
  ].join('\n');
  document.head.appendChild(st);
})();
