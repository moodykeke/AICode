const fs = require('fs');
const path = require('path');
const dir = path.resolve(__dirname, '..');
let html = fs.readFileSync(path.join(__dirname,'baseline.html'), 'utf8');
const VERIFY = process.argv.includes('--verify');
const MISSING = [];
let APPLIED = 0;
function replace(a,b){
  if(!html.includes(a)){
    if(VERIFY){ MISSING.push(a.slice(0,80)); return; }          // 契约检查模式：记下来继续走
    throw Error('Missing anchor: '+a.slice(0,90));
  }
  html=html.replace(a,b); APPLIED++;
}
replace('<title>Head Cases</title>', '<title>趣像 · 奇趣物种剧场 · v13.0.0</title>\n<link rel="icon" href="favicon.svg" type="image/svg+xml">');
replace('<html lang="en">','<html lang="zh-CN">');
replace('<span class="g">⚭</span> Breed</button>', '<span class="g">⚭</span> Evolve</button>');   // 天演（原：繁殖）
replace('var PALETTES = {',"var PALETTES = {\n  inkstone:{name:'Inkstone',zh:'砚灰',fam:'East',paper:'xuan',cols:[['浓墨','#343936'],['灰墨','#62685f'],['淡墨','#92958a'],['烟灰','#b6b7a9']]},");
html=html.replace(/^<link[^\n]+fonts\.(?:googleapis|gstatic)\.com[^\n]+\n/gm,'');
replace("volume:60,", "cols:7, rows:5, volume:60,density:1,pigment:1,wetness:0.55,paperSeed:271828,nature:28,objects:16,composition:'grid',brushRadius:0.55,speciesPool:[],motionStrength:0.8,motionPace:1,");
replace('<span class="name">Head cases</span>', '<span class="name">趣像 · 众生有趣</span>');
replace('every line is code — move, click to spin, drag to turn, double-click or hold for a card','移动目光相随 · 拖动转身 · 双击或长按收藏 · 轻触打招呼，快划成浪，慢划起涟漪，按住慢下来');
replace('<kbd>,</kbd> Settings','<kbd>,</kbd> 画材与设置');
replace('<div id="sheet">', `<div id="sheet" class="immersive">
  <nav id="studioBar" aria-label="趣像画室">
    <span class="studioTitle">奇趣物种剧场 <small>CURIOUS CREATURES / 13 · v13.0.0</small></span>
    <div class="studioScenes" role="group" aria-label="主题场景">
      <span class="toolLabel">先选一个方向</span>
      <button type="button" data-scene="guofeng" data-primary-scene="true">国风葫芦</button>
      <button type="button" data-scene="cartoons" data-primary-scene="true">动画来客</button>
      <button type="button" data-scene="hybrids" data-primary-scene="true">混生花园</button>
      <details class="sceneMore"><summary>更多主题</summary><div class="sceneMoreMenu">
        <button type="button" data-scene="journey">西游行旅</button>
        <button type="button" data-scene="shanhai">山海异兽</button>
        <button type="button" data-scene="yokai">百鬼小町</button>
        <button type="button" data-scene="giants">欧洲神话人物</button>
        <button type="button" data-scene="cabinet">经典半身像</button>
        <button type="button" data-scene="garden">风里花园</button>
        <button type="button" data-scene="curios">异物茶会</button>
        <button type="button" data-scene="portrait">一位主角</button>
        <button type="button" data-scene="tidal">潮间带</button>
      </div></details>
    </div>
    <div class="studioActions"><button type="button" id="stageSummary" aria-live="polite" aria-label="舞台 · 7 × 5 · 35 位；点击恢复默认 7×5 舞台" title="点击恢复默认 7×5 舞台">舞台 · 7 × 5 · 35 位</button><button type="button" id="atlasOpen">＋ 角色</button><button type="button" id="studioMaterials">✎ 画材</button><button type="button" id="studioExport">↓ 保存</button></div>
  </nav>`);
replace('  <div id="stage">', `<div id="playBar" aria-label="小剧场动作"><span class="playLabel">表演</span><div class="playPrimary"><button type="button" id="atlasFocus">焦点轮演</button><button type="button" id="atlasSeries">系列接力</button><button type="button" id="atlasQuiet">安静群像</button></div><details class="playMore"><summary>更多动作</summary><div class="playMoreMenu"><button type="button" id="atlasSignature">各显神通</button><button type="button" id="atlasRelay">泡泡接力</button><button type="button" id="atlasTide">潮汐圆舞</button><button type="button" id="atlasMeet">邻里回应</button><button type="button" id="studioWind">送一阵风</button><button type="button" id="studioWindBrush">局部风</button></div></details><span id="atlasStatus" role="status"></span></div>
  <div id="immersiveDock"><button type="button" id="immersiveToggle" aria-expanded="false" aria-controls="studioBar playBar" title="显示操作栏（U）"><span class="immersiveGlyph">◌</span><span class="immersiveText">显示工具</span></button></div>
  <div id="stage">`);
replace('    <div id="banner" role="status"></div>', '    <div id="banner" role="status"></div>\n    <div id="stageCue" hidden aria-live="polite"><strong id="stageCueTitle"></strong><span id="stageCueDetail"></span></div>');
replace('<div id="cardLayer" hidden>', `<aside id="atlasLibrary" hidden aria-label="头像与混生工作台">
  <header><div><small>SPECIMEN LIBRARY</small><h2>挑一位，或创造新物种</h2></div><button type="button" id="atlasClose" aria-label="关闭头像库">×</button></header>
  <p>单选，让一种角色成群出现；混选，按系列连续分区。形态组合在下方“混生”工作台单独进行。</p>
  <div class="castModes" role="group" aria-label="物种选择方式"><button type="button" data-cast-mode="single">物种单选</button><button type="button" data-cast-mode="mixed" aria-pressed="true">物种混选</button><button type="button" id="castClear">清空选择</button></div>
  <div class="castApply"><label for="castCount">登场数量</label><select id="castCount"><option value="1">1 位</option><option value="4">4 位</option><option value="8">8 位</option><option value="12">12 位</option><option value="16">16 位</option><option value="24">24 位</option><option value="32">32 位</option><option value="42" selected>42 位</option><option value="48">48 位</option><option value="64">64 位</option></select><button type="button" id="castApply">让它们登场</button><span id="castSelectionStatus" role="status">请选择物种</span></div>
  <div id="atlasCards"></div>
  <section class="fusionBench"><h3>借一个结构，长成新的自己</h3><label for="fusionBase">主体</label><select id="fusionBase"></select><label for="fusionDonor">借来的结构</label><select id="fusionDonor"></select><button type="button" id="fusionCreate">让新物种诞生</button><p id="fusionHint">保留主轮廓，接入一类附肢、叶冠或纹样。交换主体，会得到另一种形象。</p></section>
</aside>
<div id="cardLayer" hidden>`);
replace('</style>', `
  #studioBar{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;gap:8px 16px;padding:11px 18px;border-bottom:1px solid var(--edge);background:#f3efe4;z-index:4;flex-wrap:wrap}
  .studioTitle{font-size:17px;letter-spacing:.12em;white-space:nowrap}.studioTitle small{display:block;font:9px Georgia,serif;letter-spacing:.17em;color:var(--ink-soft);margin-top:4px}
  .studioScenes,.studioActions{display:flex;gap:6px;flex-wrap:wrap}#studioBar button{border:1px solid var(--edge);border-radius:20px;background:transparent;color:var(--ink);font-family:inherit;font-size:13px;padding:7px 12px;cursor:pointer}
  #studioBar button[aria-pressed=true]{background:#36564c;color:#fff;border-color:#36564c}#studioBar button:hover{border-color:#36564c}#studioBar button:focus-visible{outline:2px solid #36564c;outline-offset:3px}
  #brushSample{width:100%;height:86px;border:1px solid var(--edge);border-radius:8px;margin:0 0 12px;display:block}.studioHint{font-size:12px;line-height:1.65;color:var(--ink-soft);margin:0 0 12px}
  #studioBar{display:grid;grid-template-columns:auto 1fr auto}.studioScenes{flex-wrap:nowrap;overflow:auto;scrollbar-width:thin;min-width:0}.studioScenes button{flex:0 0 auto}
  #playBar{display:flex;align-items:center;gap:7px;padding:7px 18px;border-bottom:1px solid var(--edge);flex-wrap:wrap;background:#ece9de;font-size:12px}#playBar>span:first-child{color:#687367;margin-right:5px}#playBar button{border:0;border-radius:14px;padding:5px 11px;background:#fff7;color:#395449;font-family:inherit;cursor:pointer}#playBar button:hover{background:#36564c;color:white}#playBar button:focus-visible{outline:2px solid #36564c}#atlasStatus{margin-left:auto;color:#687367;font-size:11px}
  #atlasLibrary{position:fixed;inset:0 auto 0 0;width:min(440px,100vw);z-index:45;background:#f3efe4;border-right:1px solid var(--edge);box-shadow:12px 0 45px #2a242025;overflow:auto;padding:20px}#atlasLibrary[hidden]{display:none}#atlasLibrary header{display:flex;justify-content:space-between;gap:12px;align-items:center}#atlasLibrary header small{font:10px Georgia,serif;letter-spacing:.16em;color:#7c8676}#atlasLibrary h2{font-size:21px;font-weight:500;margin:7px 0}#atlasLibrary header button{border:1px solid var(--edge);background:none;border-radius:50%;width:32px;height:32px;font-size:22px;cursor:pointer}#atlasLibrary p{font:12px/1.8 sans-serif;color:#726a5c}#atlasCards{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}#atlasCards button{padding:6px;border:1px solid #d6d0bd;background:#faf8f0;border-radius:10px;cursor:pointer;color:#465c50;font:12px/1.5 sans-serif}#atlasCards button:hover{border-color:#4c7560;background:#e8eedf}#atlasCards canvas{width:100%;aspect-ratio:1;display:block}#atlasCards .atlasGroup{grid-column:1/-1;font:11px sans-serif;letter-spacing:.10em;color:#8a7962;padding:15px 0 4px}.fusionBench{margin-top:22px;padding-top:12px;border-top:1px solid var(--edge);display:grid;grid-template-columns:90px 1fr;gap:10px;align-items:center}.fusionBench h3,.fusionBench p,.fusionBench button{grid-column:1/-1}.fusionBench h3{font-size:16px;font-weight:500}.fusionBench label{font:12px sans-serif}.fusionBench select{max-width:100%;padding:8px;border:1px solid var(--edge);border-radius:6px;background:#fff9;font:13px sans-serif}.fusionBench button{padding:10px;background:#36564c;color:#fff;border:0;border-radius:8px;cursor:pointer}.fusionBench button:focus-visible,#atlasCards button:focus-visible{outline:2px solid #9b774f;outline-offset:2px}
  @media(max-width:1080px){#studioBar{grid-template-columns:1fr auto}.studioScenes{grid-column:1/-1;order:3}.studioScenes button{font-size:12px!important}#atlasStatus{display:none}}
  @media(max-width:600px){#studioBar{padding:8px 10px;gap:8px}.studioTitle{font-size:15px}.studioScenes{order:3;width:100%;justify-content:center}#studioBar button{font-size:12px;padding:6px 9px}.studioActions{margin-left:auto}.studioTitle small{font-size:8px}}
  @media(max-width:600px){.studioScenes{justify-content:flex-start}#studioBar{grid-template-columns:1fr}.studioActions{margin-left:0}.studioTitle{display:none}#playBar{padding:6px 10px;gap:5px}#playBar>span:first-child{display:none}#playBar button{padding:6px 8px}}
  .castModes{display:flex;gap:6px;margin:12px 0}.castModes button{border:1px solid #cfc8b7;border-radius:16px;padding:7px 10px;background:transparent;cursor:pointer;color:#475c50;font:12px sans-serif}.castModes button[aria-pressed=true]{background:#36564c;color:#fff}.castApply{position:sticky;top:-20px;z-index:2;background:#f3efe4f5;display:flex;align-items:center;flex-wrap:wrap;gap:7px;padding:12px 0;border-bottom:1px solid #d6d0bd;font:12px sans-serif}.castApply select{padding:7px;border:1px solid #cfc8b7;border-radius:7px;background:white}.castApply>button{padding:8px 14px;border:0;border-radius:7px;background:#36564c;color:white;cursor:pointer}.castApply>button:disabled{opacity:.4;cursor:default}#castSelectionStatus{flex-basis:100%;color:#7a7565;font-size:11px}.atlasSpecimen{border:1px solid #d6d0bd;border-radius:10px;overflow:hidden;background:#faf8f0}#atlasCards .atlasSpecimen button{width:100%;border:0;border-radius:0;background:transparent}#atlasCards .atlasSpecimen .atlasPick[aria-pressed=true]{background:#dce8d6;box-shadow:inset 0 0 0 2px #719078}#atlasCards .atlasPeek{font-size:10px;padding:3px 6px 6px;color:#85816f;border-top:1px solid #e7e1d3!important}.atlasPick[aria-pressed=true] span:before{content:'✓ ';color:#36564c}
</style>`);
replace("function chainMul(){ return ({off:0, few:0.5, normal:1, lively:1.6})[CFG.chain] || 1; }", "function chainMul(){ var n=({off:0, few:0.5, normal:1, lively:1.6})[CFG.chain]; return n==null ? 1 : n; }");
// Seed paper independently of motion. These replacements are confined to the paper function.
/* 纸纹：① 复用同一张画布对象（原来每次 rebuildPaper 都新建，拍照提分辨率时会出现两张全尺寸纸纹
   且旧的不释放——实测 1440×838 各 4.6MB）；② 按像素预算降分辨率（纸纹是"渐变+细小颗粒"的软纹理，
   降采样后 drawImage 放大回去，颗粒的视觉大小不变，只是不糊到看不出）；③ paperFill 的图案
   按同一比例放大，保证"纸色遮挡"仍与纸面严丝合缝。 */
let start=html.indexOf('function makePaperCanvas('),end=html.indexOf('/* ---------- pencil + watercolor',start);
if(start<0||end<0){ if(VERIFY){ MISSING.push('paper slice anchors'); start=end=0; } else throw Error('Missing anchor: paper slice'); }
let paper=html.slice(start,end)
  .replace('var p = document.createElement', 'var random = mulberry32((CFG.paperSeed||271828) >>> 0);\n  var p = document.createElement')
  .replaceAll('Math.random()', 'random()');
paper=paper.replace('rgba(150,130,100,0.10)','rgba(150,130,100,0.045)').replace('Math.min(1600, W*H/900)','Math.min(900, W*H/1400)').replace('(8+random()*26)','(4+random()*20)');
html=html.slice(0,start)+paper+html.slice(end);
// 主纸纹：降分辨率（预算 120 万像素）+ 主动释放上一张（旧 pattern 还引用着它，不显式清就成两份）
replace("function rebuildPaper(){\n  paper = makePaperCanvas(cv.width, cv.height);\n  gridPat = gctx.createPattern(paper, 'no-repeat');\n}",
        "var PAPER_SCALE = 1;\nfunction rebuildPaper(){\n  var _w = cv.width, _h = cv.height;\n  var _k = Math.min(1, Math.sqrt(1200000) / Math.max(_w, _h));\n  var _old = paper;\n  paper = makePaperCanvas(Math.max(8, Math.round(_w * _k)), Math.max(8, Math.round(_h * _k)));\n  PAPER_SCALE = paper.width / Math.max(1, _w);\n  if (_old && _old !== paper) { _old.width = 1; _old.height = 1; }\n  gridPat = gctx.createPattern(paper, 'no-repeat');\n}");
// ③ paperFill：图案按 1/PAPER_SCALE 放大，遮挡仍与纸面对齐
replace("  try{ PAT.setTransform(ctx.getTransform().inverse()); return PAT; }",
        "  try{ PAT.setTransform(ctx.getTransform().inverse().scale(1/(PAPER_SCALE||1), 1/(PAPER_SCALE||1))); return PAT; }");
replace("if((it.id==='cols'||it.id==='rows') && v>0 && v<(it.id==='cols'?3:2)) v = it.id==='cols'?3:2;", "if((it.id==='cols'||it.id==='rows') && v>0 && v<1) v=1;");
replace("CFG.cols = clamp((CFG.cols||cols) + (name==='more'?1:-1), 3, 14); saveCfg(); layout(); syncPanel(); return;", "CFG.cols = clamp((CFG.cols||cols) + (name==='more'?1:-1), 3, 14); try{localStorage.setItem('quxiang.gridChoice','custom');}catch(e){} saveCfg(); layout(); syncPanel(); return;");
replace("if(it.relayout) layout();", "if(it.relayout) layout();\n          if(it.id==='cols'||it.id==='rows'){try{localStorage.setItem('quxiang.gridChoice','custom');}catch(e){}}\n          paintBrushSample();");
replace("setCfg(it.id, o[0]); saveCfg(); applyTheme();", "setCfg(it.id, o[0]); if(it.id==='cols'||it.id==='rows'||it.id==='composition'){try{localStorage.setItem('quxiang.gridChoice','custom');}catch(e){}} saveCfg(); applyTheme(); if(it.relayout) layout(); paintBrushSample();");
replace("if(tag==='INPUT' || tag==='TEXTAREA' || tag==='SELECT') return;", "if(tag==='INPUT' || tag==='TEXTAREA' || tag==='SELECT') return;\n  if(tag==='BUTTON' && (e.key==='Enter' || e.code==='Space')) return;");
replace('var f=new Head(pureDNA(s)); f.yaw=0; return f;', 'var f=new Head(h.dna[7] ? pureDNA(s).concat(h.dna[7]) : pureDNA(s)); f.yaw=0; return f;');
replace("founders: id.founders.slice(0,3).map(function(s){ var f=new Head(h.dna[7] ? pureDNA(s).concat(h.dna[7]) : pureDNA(s)); f.yaw=0; return f; }),", "founders: portraitLineage(h,src).heads, lineageLabel: portraitLineage(h,src).label,");
replace("ctx.fillText(c.founders.length>1 ? 'founders' : 'wild-born', CW/2, y);", "ctx.fillText(uiText(c.lineageLabel||'trait sources'), CW/2, y);");
replace("ctx.fillText(nm.first+' '+nm.sur, fx, cy+r+14);", "ctx.fillText(c.lineageLabel==='parents'||c.lineageLabel==='trait sources' ? uiText(SPNAME[f.g.sp]||f.g.sp) : nm.first+' '+nm.sur, fx, cy+r+14, gapx-8);");
replace("ctx.fillText('specimen record', m, 35);", "ctx.fillText(qxCardWord('specimen record'), m, 35);");
replace("ctx.fillText('genome', CW/2, 58);", "ctx.fillText(qxCardWord('genome'), CW/2, 58);");
replace("ctx.fillText('field notes', m, y);", "ctx.fillText(qxCardWord('field notes'), m, y);");
replace("ctx.fillText('every line is code', m, CH-24);", "ctx.fillText(qxCardWord('every line is code'), m, CH-24);");
replace("ctx.fillText(TIERS[id.tier].name.toLowerCase(), CW-m, CH-24);", "ctx.fillText(qxCardWord(TIERS[id.tier].name.toLowerCase()), CW-m, CH-24);");
replace("ctx.fillText('Temperament', m, y);", "ctx.fillText(qxCardWord('Temperament'), m, y);");
replace("ctx.fillText(cap(id.temper), CW-m, y);", "ctx.fillText(qxCardWord(cap(id.temper)), CW-m, y);");
replace("ctx.fillText(id.species.toLowerCase()+', '+id.temper, m, y);", "ctx.fillText(id.species.toLowerCase()+', '+qxCardWord(id.temper), m, y);");
replace("var b = baseGenes(h.dna[i]), label = MOD_LABEL[MODS[i]], val = cap(SPNAME[b.sp]);", "var b = baseGenes(h.dna[i]), label = MOD_LABEL[MODS[i]], val = cap(SPNAME[b.sp]); if(h.g.natural){var row=portraitGenomeRows(h)[i];label=row[0];val=row[1];b={fur:row[2]};}else if(typeof qxCardWord==='function'){label=qxCardWord(label);val=qxCardWord(val,b.sp);}");
replace("var vw = ctx.measureText(val).width;\n    ctx.fillText(val, CW-m-22, y);", "var available=CW-2*m-34-ctx.measureText(label).width,vw=Math.min(ctx.measureText(val).width,available);\n    ctx.fillText(val, CW-m-22, y, available);");
replace("'Brush: <b>'", "'动作刷：<b>'");
replace("var el = document.getElementById('whatsnew'); el.hidden = false;", "var el = document.getElementById('whatsnew'); el.hidden = true; return;");
replace('<div class="studioActions">','<div class="studioActions"><label class="languageControl">语言 / Language <select id="uiLanguage" aria-label="语言 / Language"><option value="zh-CN">简体中文</option><option value="en">English</option></select></label><button type="button" id="lookbookOpen">风格预设</button>');
replace('<aside id="atlasLibrary"',`<aside id="lookbook" hidden aria-label="风格预设"><header><div><small>THE LOOKBOOK / 08</small><h2>同一群角色，八种气质</h2></div><button type="button" id="lookbookClose" aria-label="关闭风格预设">×</button></header><p>只改变纸张、色彩与笔触，保留当前角色、数量和构图。样张使用同一只虾，便于比较。</p><div id="lookbookCards"></div><p id="lookbookStatus" role="status"></p></aside><aside id="atlasLibrary"`);
replace('</style>',`#lookbook{position:fixed;inset:0 0 0 auto;width:min(640px,100vw);padding:24px;box-sizing:border-box;overflow:auto;z-index:48;background:#f3efe4;box-shadow:-12px 0 45px #2a242025}#lookbook[hidden]{display:none}#lookbook header{display:flex;justify-content:space-between;align-items:center;gap:12px}#lookbook header small{font:10px Georgia;letter-spacing:.15em;color:#716b5e}#lookbook h2{font-size:23px;font-weight:500}#lookbook p{font:13px/1.8 sans-serif;color:#716b5e}#lookbookClose{background:none;border:1px solid #c7c0af;border-radius:50%;width:34px;height:34px;font-size:24px;cursor:pointer}#lookbookCards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.lookCard{display:flex;flex-direction:column;text-align:left;padding:0 0 14px;overflow:hidden;border:1px solid #d5cfbf;border-radius:12px;background:#faf8f1;color:#3e5149;cursor:pointer;font:13px/1.7 sans-serif}.lookCard canvas{width:100%;height:auto;display:block}.lookCard strong,.lookCard span{margin:8px 13px 0}.lookCard span{font-size:12px;color:#736b5e;margin-top:2px}.lookCard[aria-pressed=true]{outline:2px solid #517761;outline-offset:2px}.lookCard:focus-visible,#lookbookClose:focus-visible{outline:3px solid #9e7142;outline-offset:3px}.languageControl{font:10px/1.4 sans-serif;color:#736b5e;display:flex;flex-direction:column;gap:2px}.languageControl select{font:12px sans-serif;border:1px solid #cdc5b3;border-radius:6px;padding:3px;background:#faf8f1;color:#36564c}.studioActions{align-items:center}html[lang=en] .studioTitle{letter-spacing:.02em;font-size:15px}@media(max-width:600px){#lookbook{padding:16px}#lookbookCards{gap:10px}.studioActions{flex-wrap:wrap}.lookCard strong{font-size:13px}} </style>`);
  html=html.replace('</style>',`</style><style>
  .toolLabel,.playLabel{font:10px/1.3 sans-serif;letter-spacing:.08em;color:#8b806d;white-space:nowrap}.sceneMore,.playMore{position:relative;flex:0 0 auto}.sceneMore summary,.playMore summary{list-style:none;cursor:pointer;border:1px dashed #b9b09e;border-radius:20px;padding:7px 12px;color:#667367;font-size:12px;white-space:nowrap}.sceneMore summary::-webkit-details-marker,.playMore summary::-webkit-details-marker{display:none}.sceneMore summary:after,.playMore summary:after{content:'＋';margin-left:5px}.sceneMore[open] summary:after,.playMore[open] summary:after{content:'－'}.sceneMoreMenu,.playMoreMenu{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:5px 0}.sceneMoreMenu button{border:1px solid var(--edge);border-radius:20px;background:transparent;color:var(--ink);font-family:inherit;font-size:13px;padding:7px 12px;cursor:pointer}.sceneMoreMenu button[aria-pressed=true]{background:#36564c;color:#fff;border-color:#36564c}.sceneMoreMenu button:hover{border-color:#36564c}.sceneMoreMenu button:focus-visible,.sceneMore summary:focus-visible,.playMore summary:focus-visible{outline:2px solid #36564c;outline-offset:3px}.studioActions{gap:8px}.studioActions #stageSummary{font:10px/1.3 sans-serif;color:#687367;white-space:nowrap;border:1px solid #d4cdbc;border-radius:14px;padding:5px 9px;background:#fff7;cursor:pointer}.studioActions #stageSummary:hover{border-color:#36564c;color:#36564c}.playPrimary,.playMoreMenu{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.playPrimary button{background:#dce8d6!important;color:#36564c!important}.playMoreMenu button{font-size:11px!important;padding:5px 9px!important}.playMore[open] .playMoreMenu{padding-left:2px}.playMore summary{padding:5px 10px;background:#fff7}.playLabel{margin-right:1px}
  #immersiveDock{position:fixed;top:calc(env(safe-area-inset-top,0px) + 8px);left:50%;transform:translateX(-50%);z-index:52;opacity:.72;transition:opacity .22s ease,top .32s ease;pointer-events:auto}
  #immersiveDock:hover,#immersiveDock:focus-within{opacity:1}
  #immersiveToggle{pointer-events:auto;display:flex;align-items:center;gap:5px;border:1px solid #bdb39e;border-radius:999px;background:#f3efe4e8;color:#52665a;box-shadow:0 4px 16px #382f2412;padding:5px 11px;font:11px/1.2 sans-serif;cursor:pointer;backdrop-filter:blur(7px)}
  #immersiveToggle:hover{background:#36564c;color:#fff;border-color:#36564c}#immersiveToggle:focus-visible{outline:2px solid #36564c;outline-offset:3px}.immersiveGlyph{font-size:15px;line-height:10px}
  #studioBar,#playBar{max-height:220px;overflow:hidden;transition:max-height .34s ease,opacity .24s ease,transform .34s ease,padding .34s ease,border-color .24s ease}
  #playBar{max-height:80px}
  #sheet.immersive #studioBar,#sheet.immersive #playBar{max-height:0;height:0;min-height:0;flex:0 0 0;opacity:0;transform:translateY(-14px);padding-top:0;padding-bottom:0;border-color:transparent;pointer-events:none}
  #sheet.immersive #immersiveDock{opacity:.88;top:calc(env(safe-area-inset-top,0px) + 10px)}
  #sheet.immersive #immersiveDock:hover,#sheet.immersive #immersiveDock:focus-within{opacity:1}
  #sheet.immersive #immersiveToggle{background:#f3efe4c8}
  #sheet:not(.immersive) #immersiveDock{opacity:.42;top:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 76px);left:auto;right:14px;transform:none}
  @media (prefers-reduced-motion:reduce){#studioBar,#playBar,#immersiveDock{transition:none}}
  @media(max-width:600px){.toolLabel{display:none}.studioActions #stageSummary{order:5;border-right:0;padding-right:0;width:100%}.sceneMoreMenu,.playMoreMenu{padding-top:7px}.sceneMore summary,.playMore summary{padding:6px 9px}.playLabel{display:none}}
</style>`);
const toolbarPolish=`
  /* Shown toolbar: one clear hierarchy, compact controls, no accidental third row. */
  #studioBar{grid-template-columns:auto minmax(0,1fr) auto;grid-template-areas:"brand scenes actions";align-items:center;gap:8px 14px;padding:8px 18px;min-height:56px;background:rgba(243,239,228,.96);box-shadow:0 1px 0 rgba(78,70,54,.05)}
  #studioBar .studioTitle{grid-area:brand;line-height:1.15;min-width:174px}.studioTitle small{margin-top:3px;opacity:.72}
  #studioBar .studioScenes{grid-area:scenes;align-self:center;gap:5px;padding:2px 0}.studioScenes .toolLabel{margin-right:2px;opacity:.82}.studioScenes button{padding:6px 10px;font-size:12px}.studioScenes button[data-primary-scene=true]{background:#fffaf0}.studioScenes button[data-primary-scene=true][aria-pressed=true]{background:#36564c}
  #studioBar .studioActions{grid-area:actions;justify-content:flex-end;gap:5px;flex-wrap:nowrap;white-space:nowrap}.languageControl{flex-direction:row;align-items:center;gap:5px;white-space:nowrap}.languageControl select{height:28px;padding:3px 6px}
  #studioBar .studioActions>button{height:30px;padding:5px 10px;font-size:12px}.studioActions #stageSummary{background:#e6eee2;border-color:#c5d3c0;color:#36564c}.studioActions #atlasOpen{background:#36564c;color:#fff;border-color:#36564c}.studioActions #studioExport{background:#f8f3e7}
  #studioBar .studioActions>button:hover{transform:translateY(-1px);box-shadow:0 3px 10px rgba(56,69,57,.10)}#studioBar .studioActions>button:active{transform:translateY(0);box-shadow:none}
  #playBar{min-height:34px;padding:5px 18px;background:#e8eee5;border-bottom-color:#d2ddcd;gap:6px}.playLabel{color:#36564c!important;font-weight:600}.playPrimary button{border:1px solid #c6d8c2!important;background:#f5f8f1!important}.playPrimary button:hover{background:#36564c!important;color:#fff!important}.playMore summary{border-color:#b4c4ae;background:#f5f8f1}.playMoreMenu{background:#e8eee5}.playMoreMenu button{border:1px solid #c6d8c2!important;background:#f5f8f1!important}.playMoreMenu button:hover{background:#36564c!important;color:#fff!important}
  @media(max-width:1180px){#studioBar{grid-template-columns:1fr auto;grid-template-areas:"brand actions" "scenes scenes";row-gap:6px}.studioScenes{width:100%}.studioActions{justify-self:end}}
  @media(max-width:720px){#studioBar{grid-template-columns:1fr;grid-template-areas:"brand" "actions" "scenes";padding:8px 12px}.studioTitle{min-width:0}.studioActions{justify-self:stretch;justify-content:flex-start;overflow:auto;padding-bottom:1px}.languageControl{margin-right:2px}.studioScenes{padding-bottom:2px}.studioScenes .toolLabel{display:none}}
  @media(max-width:480px){#studioBar .studioTitle{font-size:14px}.studioTitle small{display:none}.studioActions{gap:4px}.studioActions #stageSummary{order:0;width:auto}.studioActions>button{font-size:11px!important;padding:5px 8px!important}.languageControl{font-size:9px}.languageControl select{max-width:82px}.playPrimary{width:100%}.playPrimary button{flex:1}.playMore{margin-left:auto}}
  #atlasStatus{display:block;flex:0 1 auto;max-width:360px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border:1px solid #c9d8c3;border-radius:999px;padding:4px 9px;background:#f5f8f1;color:#47624e;font-size:11px;min-height:14px}
  #stage{position:relative}#stageCue{position:absolute;left:16px;top:14px;z-index:5;display:flex;align-items:baseline;gap:8px;max-width:min(430px,calc(100% - 32px));padding:8px 12px;border:1px solid rgba(199,181,139,.75);border-radius:10px;background:rgba(250,247,236,.88);box-shadow:0 5px 18px rgba(66,58,44,.10);color:#465d50;pointer-events:none;opacity:0;transform:translateY(-6px);transition:opacity .22s ease,transform .28s ease}#stageCue[hidden]{display:none}#stageCue.cueShow{opacity:1;transform:translateY(0)}#stageCueTitle{font-size:13px;font-weight:600;white-space:nowrap}#stageCueDetail{font:11px/1.45 sans-serif;color:#6d766b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  @media(max-width:1080px){#atlasStatus{display:block;max-width:300px}}
  @media(max-width:720px){#atlasStatus{order:4;flex-basis:100%;max-width:none;text-align:center}}
  @media(prefers-reduced-motion:reduce){#stageCue{transition:none}}
  /* Library groups are treated as editorial sections: the header owns both selection and visibility. */
  #atlasCards{display:block}
  .atlasGroupSection{margin:14px 0 20px;padding-bottom:3px;border-bottom:1px solid rgba(118,105,83,.18)}
  .atlasGroupHead{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 0 8px;border-bottom:1px solid rgba(118,105,83,.28)}
  #atlasCards .atlasGroupHead .atlasGroup{padding:0;font:600 11px/1.2 sans-serif;letter-spacing:.12em;color:#5f6f61}
  .atlasGroupControls{display:flex;align-items:center;gap:5px;flex:0 0 auto}.atlasGroupMeta{min-width:28px;text-align:right;font:10px/1 sans-serif;color:#8b826f}
  .atlasGroupControls button{border:1px solid #c8c0ae;border-radius:999px;background:#fbf8ef;color:#5a6d60;font:10px/1.2 sans-serif;padding:5px 8px;cursor:pointer;transition:background .18s,border-color .18s,color .18s,transform .18s}
  .atlasGroupControls button:hover{border-color:#527660;background:#edf3e8;transform:translateY(-1px)}.atlasGroupControls button:focus-visible{outline:2px solid #9b774f;outline-offset:2px}
  .atlasGroupControls .atlasGroupSelect[aria-pressed=true]{background:#36564c;border-color:#36564c;color:#fff}.atlasGroupToggle{min-width:38px}
  .atlasGroupGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding-top:10px}.atlasGroupSection.is-collapsed .atlasGroupGrid{display:none}.atlasGroupSection.is-collapsed{padding-bottom:0}
  .atlasSpecimen{min-width:0;box-shadow:0 2px 8px rgba(70,62,46,.06);transition:transform .18s,box-shadow .18s}.atlasSpecimen:hover{transform:translateY(-2px);box-shadow:0 5px 14px rgba(70,62,46,.12)}
  #atlasCards .atlasSpecimen .atlasPick{padding:7px 7px 5px}.atlasPick span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  #atlasCards .atlasPeek{background:rgba(255,252,242,.72);transition:color .18s,background .18s}.atlasSpecimen:hover .atlasPeek{background:#edf3e8;color:#36564c}
  #atlasLibrary header{padding-bottom:5px;border-bottom:1px solid rgba(118,105,83,.18)}#atlasLibrary header button{transition:background .18s,color .18s,transform .18s}#atlasLibrary header button:hover{background:#36564c;color:#fff;transform:rotate(8deg)}
  /* Toolbar hierarchy stays legible when a dark paper preset is active. */
  #studioBar,#playBar{color:var(--ink,#3f4c43);backdrop-filter:blur(8px)}#studioBar button,#playBar button{font-weight:500;letter-spacing:.01em;transition:background .18s,border-color .18s,color .18s,transform .18s,box-shadow .18s}
  #studioBar .studioActions>button,#studioBar .languageControl select{box-shadow:0 1px 0 rgba(30,43,34,.08)}#studioBar .studioActions>button:focus-visible,#playBar button:focus-visible{box-shadow:0 0 0 3px rgba(86,121,94,.22)}
  #playBar .playPrimary button{position:relative}#playBar .playPrimary button:first-child:before{content:'●';display:inline-block;margin-right:5px;font-size:8px;vertical-align:1px;color:#9d6f44}#playBar .playPrimary button[aria-pressed=true]:before{color:#d8ebc9}
  @media(min-width:520px){.atlasGroupGrid{grid-template-columns:repeat(3,minmax(0,1fr))}}
  @media(max-width:480px){.atlasGroupHead{align-items:flex-start}.atlasGroupControls{gap:3px}.atlasGroupControls button{padding:5px 6px}.atlasGroupMeta{min-width:22px}}
  /* v13-r17: 生成大图/视频需要数秒——给明确的"正在导出"状态，并挡住重复点击 */
  body.exporting #actions .act,body.exporting #studioExport{opacity:.45;pointer-events:none;cursor:progress}
  body.exporting #card{filter:saturate(.94)}
  #toast.exporting:after{content:'';display:inline-block;width:8px;height:8px;margin-left:8px;border-radius:50%;background:#9d6f44;animation:qxPulse 1s ease-in-out infinite}
  @keyframes qxPulse{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:1;transform:scale(1.15)}}
`;
var toolbarStyleEnd=html.lastIndexOf('</style>');html=html.slice(0,toolbarStyleEnd)+toolbarPolish+html.slice(toolbarStyleEnd);
const extension = ['studio.js','atlas.js','folklore.js','portrait-evolution.js','new-faces.js','myth-faces.js','portrait-sprite.js','ensemble.js','curation.js','locale-lookbook.js','touch-feel.js','neck-mode.js','scale-play.js','dock-moves.js','wall-submit.js','gaze-life.js','audio-bank.js','panel-design.js','move-sound.js','memory-tame.js','gaze-hop-fix.js','group-photo.js','photo-lab.js','class-faces.js','pointer-turn.js','mobile-fit.js','mem-tag.js','bigscreen.js','i18n-fill.js','ux-r43.js','fun-r43.js','card-words-r44.js','packs-r45.js','ui-r45.js','evolve-r44.js','evolve-plus-r45.js','gestures-r46.js','power-a11y-r46.js','evolve-more-r46.js','head-cache-r47.js','evolve-voice-r47.js'].map(f=>fs.readFileSync(path.join(__dirname,f),'utf8')).join('\n');
// 资产版本：取自拾趣馆卡片 v —— 同一个旋钮同时管卡片、基线与情绪件 URL 的 ?v=
let ASSET_V = 1;
try {
  const mf = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'static', 'fun', 'manifest.json'), 'utf8'));
  const it = (mf.items || []).find(i => i.slug === 'quxiang');
  if (it && it.v) ASSET_V = it.v;
} catch (e) { console.warn('资产版本读取失败，用 1'); }
replace('renderRecent();\nboot();', 'var QX_ASSET_V = ' + ASSET_V + ';\n' + extension + '\n\nrenderRecent();\nboot();');
replace("drag.head.pitch = clamp(drag.head.pitch + dy*0.006, -0.45, 0.5);", "drag.head.pitch = clamp(drag.head.pitch - dy*0.006, -0.45, 0.5);   /* r29 纵向方向翻回 */");
replace("  DPR = Math.min(window.devicePixelRatio||1, W<700?1.75:2);", "  DPR = Math.min(window.devicePixelRatio||1, W<700?1.75:2, Math.max(1, Math.sqrt(2600000/(W*H))));   /* r26 内存：舞台总像素 ≤260 万 */\n  if(typeof QX_DPR_SCALE==='number' && QX_DPR_SCALE<1) DPR = Math.max(Math.min(1, DPR), DPR*QX_DPR_SCALE);   /* r43 弱机：持续掉帧时逐级降分辨率，不低于 1 */");
replace("if(geneCache.size>4000) geneCache.clear();", "if(geneCache.size>1200) geneCache.clear();");

// 输出直接落到站内（内网 nginx 直出仓库工作树）：源码在 趣像/，产物在 static/fun/quxiang/
const OUT = path.join(__dirname, '..', 'static', 'fun', 'quxiang');
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html);
fs.writeFileSync(path.join(OUT, 'favicon.svg'), fs.readFileSync(path.join(__dirname, 'favicon.svg')));
const js=html.match(/<script>([\s\S]*?)<\/script>/)[1];
fs.writeFileSync(path.join(__dirname,'app-check.js'),js);
if (VERIFY) {
  /* r46 词条审计：uiText('中文') 用到的每个中文字面量都必须登记过中英对（否则英文界面仍是中文） */
  const PAIR = /\[\s*'((?:[^'\\\n]|\\.)*)'\s*,\s*'((?:[^'\\\n]|\\.)*)'\s*\]/g, CJK = /[\u4e00-\u9fff]/;
  const known = new Set();
  let m; while ((m = PAIR.exec(js))) { if (CJK.test(m[1])) known.add(m[1]); if (CJK.test(m[2])) known.add(m[2]); }
  const USE = /uiText\(\s*'((?:[^'\\\n]|\\.)*)'\s*\)/g, missingI18n = new Set();
  while ((m = USE.exec(js))) { if (CJK.test(m[1]) && !known.has(m[1])) missingI18n.add(m[1]); }
  /* 键位审计：扩展里 KEYMAP['k'] = 'fx' 的直接赋值，同一个键被赋成两个不同动作即冲突 */
  const KA = /KEYMAP\[\s*'((?:[^'\\]|\\.)*)'\s*\]\s*=\s*'([^']*)'/g, keyTo = {}, keyClash = [];
  while ((m = KA.exec(js))) { if (keyTo[m[1]] && keyTo[m[1]] !== m[2]) keyClash.push(m[1] + ': ' + keyTo[m[1]] + ' / ' + m[2]); keyTo[m[1]] = m[2]; }
  console.log('词条审计：uiText 中文字面量未登记 ' + missingI18n.size + ' 条');
  missingI18n.forEach(t => console.log('  [未登记] ' + t));
  console.log('键位审计：KEYMAP 直接赋值冲突 ' + keyClash.length + ' 条');
  keyClash.forEach(t => console.log('  [冲突] ' + t));
  if (missingI18n.size || keyClash.length) MISSING.push('i18n/key audit');
  console.log('补丁契约检查：命中 ' + APPLIED + ' 条，失配 ' + MISSING.length + ' 条');
  MISSING.forEach(m => console.log('  [失配] ' + m.replace(/\n/g, '\\n')));
  process.exit(MISSING.length ? 1 : 0);
}
console.log('Built', Buffer.byteLength(html), 'bytes', '· 资产版本 v' + ASSET_V);
