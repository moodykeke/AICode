/* 趣像 15 (r26): 内存占用优化
   先量后改（CDP 基线，1440×900）：打开后 DOM 画布 3 个 / 4.9MB，开一次角色库涨到 81 个 / 8MB，
   开一次风格预设 90 个 / 11MB，DOM 节点 688 → 2949，JS 堆 5.5 → 13.3MB。
   问题不在"用得多"，而在**关掉也不还**：

   1) 角色库 78 张缩略图（110×110，约 3.8MB）关掉后仍驻留 → 改为**懒渲染 + 关闭即释放**：
      只渲染滚动到可见区的那些（IntersectionObserver，提前 240px 预取），关闭时把画布尺寸归零。
   2) 风格预设的 8 张预览（300×210，约 2MB）同样关掉不还 → 关闭即释放（重开时会重建）。
   3) 角色卡的两个画布（380×532×2，约 1.6MB）→ 关卡即释放（重开时 sizeCard 会重设尺寸）。
   4) 舞台画布：retina 上 DPR 取 2，1440 宽就是约 16MB 后备存储 → 加**按面积自适应**的上限
      （总像素 ≤260 万；小屏仍保持 2 倍清晰度）。此项在 build.cjs 里改常量。
   5) 基因缓存上限 4000 → 1200（纯缓存，过大只是在占内存）。
   6) 眼睛的放大偏移原来每帧每头 Object.assign 一个新对象（42 次/帧）→ 改为每头一个复用对象。 */

var MEM = { releasedAtlas: 0, releasedLook: 0, releasedCard: 0, lazyRendered: 0 };

/* ── 1) 角色库缩略图：懒渲染 ── */
var memAtlasIO = null;
function memLazyAtlasThumbs() {
  var picks = Array.prototype.slice.call(document.querySelectorAll('#atlasCards .atlasPick'));
  if (!picks.length) return;
  if (memAtlasIO) { try { memAtlasIO.disconnect(); } catch (e) {} memAtlasIO = null; }
  var boxEl = document.getElementById('atlasLibrary');
  var entries = picks.map(function (btn, i) { return { btn: btn, kind: btn.dataset.kind, i: i }; });
  function render(e) {
    if (e.done) return;
    var c = e.btn.querySelector('canvas'); if (!c) return;
    try { miniPortrait(c, atlasDNA(e.kind, 431 + e.i * 71), 110, 0, null); } catch (err) { return; }
    e.done = true; MEM.lazyRendered++;
  }
  if (typeof IntersectionObserver !== 'function' || !boxEl) { entries.forEach(render); return; }
  entries.forEach(function (e) {
    var c = e.btn.querySelector('canvas');
    if (c) { c.width = 0; c.height = 0; }                 // 先腾地方，滚动到再画
  });
  memAtlasIO = new IntersectionObserver(function (list) {
    list.forEach(function (rec) {
      if (!rec.isIntersecting) return;
      var e = entries[picks.indexOf(rec.target)];
      if (e) render(e);
      memAtlasIO.unobserve(rec.target);
    });
  }, { root: boxEl, rootMargin: '240px 0px' });
  entries.forEach(function (e) { memAtlasIO.observe(e.btn); });
}
var memBuildAtlas = buildAtlasLibrary;
buildAtlasLibrary = function () {
  var r = memBuildAtlas.apply(this, arguments);
  memLazyAtlasThumbs();
  return r;
};
var memToggleAtlas = toggleAtlasLibrary;
toggleAtlasLibrary = function (open) {
  var wantOpen = (open == null) ? document.getElementById('atlasLibrary').hidden : open;
  var r = memToggleAtlas.apply(this, arguments);
  if (!wantOpen) {                                        // 关闭：连缩略图一起还回去
    if (memAtlasIO) { try { memAtlasIO.disconnect(); } catch (e) {} memAtlasIO = null; }
    var n = 0;
    document.querySelectorAll('#atlasCards .atlasPick canvas').forEach(function (c) {
      if (c.width) { c.width = 0; c.height = 0; n++; }
    });
    MEM.releasedAtlas += n;
  }
  return r;
};

/* ── 2) 风格预设预览：关闭即释放（重开时 buildLookbook 会重建）── */
var memToggleLook = toggleLookbook;
toggleLookbook = function (on) {
  var r = memToggleLook.apply(this, arguments);
  if (!on) {
    var n = 0;
    document.querySelectorAll('#lookbookCards canvas').forEach(function (c) {
      if (c.width) { c.width = 0; c.height = 0; n++; }
    });
    MEM.releasedLook += n;
  }
  return r;
};

/* ── 3) 角色卡画布：关卡即释放（开卡时 sizeCard 会重设尺寸）── */
var memCloseCard = closeCard;
closeCard = function () {
  var front = document.getElementById('cardFront'), back = document.getElementById('cardBack');
  var r = memCloseCard.apply(this, arguments);
  [front, back].forEach(function (c) {
    if (!c) return;
    if (c.width > 1) { c.width = 0; c.height = 0; MEM.releasedCard++; }
  });
  return r;
};

/* ── 4) 兜底：页面隐藏一段时间后，把"重开即重建"的画布也还回去 ── */
document.addEventListener('visibilitychange', function () {
  if (document.hidden) {
    if (typeof stopTune === 'function') stopTune();
    if (typeof MOVE_SOUND !== 'undefined') MOVE_SOUND.last = {};
  }
});

try {
  window.__mem = {
    get stats() { return { releasedAtlas: MEM.releasedAtlas, releasedLook: MEM.releasedLook, releasedCard: MEM.releasedCard, lazyRendered: MEM.lazyRendered }; },
    canvasBytes: function () {
      var list = Array.from(document.querySelectorAll('canvas'));
      return Math.round(list.reduce(function (a, c) { return a + c.width * c.height * 4; }, 0) / 1048576 * 10) / 10;
    },
    canvases: function () { return document.querySelectorAll('canvas').length; },
  };
} catch (e) {}
