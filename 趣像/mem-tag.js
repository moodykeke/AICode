/* 趣像 18 (r35): 画布归属标签 + 全量内存记账
   ─────────────────────────────────────────────────────────────
   屏幕上只有一张舞台画布，但内存里往往躺着好几张同尺寸的离屏画布
   （纸纹、抓帧、导出缓冲…）。给每个已知归属的画布打上 __tag，
   外部（CDP Runtime.queryObjects）就能按归属点名统计，不再靠猜。 */
var MEM_TAG = null, MEM_TAGS = {};
(function memTag() {
  var tag = function (c, t) { try { if (c && !c.__tag) { c.__tag = t; MEM_TAGS[t] = (MEM_TAGS[t] || 0) + 1; } } catch (e) {} };
  MEM_TAG = tag;

  // 纸纹（基线 canvas，随主题/分辨率重建）
  if (typeof rebuildPaper === 'function') {
    var baseRebuild = rebuildPaper;
    rebuildPaper = function () {
      var r = baseRebuild.apply(this, arguments);
      try { tag(paper, 'paper'); } catch (e) {}
      return r;
    };
  }
  try { tag(paper, 'paper'); } catch (e) {}
  try { tag(cv, 'stage'); } catch (e) {}
  try { tag(gridPat && gridPat.__src, 'paper-pattern-src'); } catch (e) {}

  // 导出/抓帧：photoCapture / 透明头像 / 转台
  if (typeof photoCapture === 'function') {
    var baseCap = photoCapture;
    photoCapture = function () { var c = baseCap.apply(this, arguments); tag(c, 'photo-crop'); return c; };
  }
  if (typeof photoCompose === 'function') {
    var baseCompose = photoCompose;
    photoCompose = function (frame, scale) {
      var r = baseCompose.apply(this, arguments);
      try { tag(r.canvas, 'photo-frame-' + (frame || 'mat')); } catch (e) {}
      return r;
    };
  }
  // 卡片正反面 / 头像导出（先按当前尺寸标一次，sizeCard 之后再标）
  try { tag(frontC, 'card-front'); tag(backC, 'card-back'); } catch (e) {}
  if (typeof sizeCard === 'function') {
    var baseSize = sizeCard;
    sizeCard = function () {
      var r = baseSize.apply(this, arguments);
      try { tag(frontC, 'card-front'); tag(backC, 'card-back'); } catch (e) {}
      return r;
    };
  }

  // 全量记账：已知归属 + 未知（用 __mem.unknownHint 打印提示）
  try {
    window.__mem.tagList = function () { return Object.keys(MEM_TAGS); };
  } catch (e) {}
})();
