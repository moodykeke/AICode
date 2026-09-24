/* 趣像 05c (r43): 半身像位图缓存——舞台上每帧只重画眼睛
   各系列半身像（葫芦、西游、山海、百鬼、欧洲）是平面画法：头转时只做水平压缩，不像经典头像那样三维转动。
   它们每一笔都是"纸色遮挡 + 两层水彩 + 双遍墨线"，35 位同台时每帧要重画上千笔，弱机吃力。
   做法：每个角色在当前尺寸、画风、纸色下只画一次到离屏小画布；舞台每帧贴图，
   再按实时视线与眨眼重画登记过的眼睛——所以目光跟随、眨眼、轻触回应都还在。
   以下情况照常逐笔现画：伸脖、融化/冰冻、半透明、招牌动作与风中摆动、伞怪（独眼即脸）、
   卡片/导出/打印分辨率（每单位 >110 设备像素）。缓存按 LRU 限 3MB，页面隐藏即清空。
   调试出口 window.__sprite（stats / on / clear）。 */
var SPRITE = { on: true, cache: new Map(), bytes: 0, max: 3 * 1048576, bakes: 0, hits: 0, live: 0, sig: '' };
var SPRITE_SKIP = { yokai_umbrella: 1, hill_zhulong: 1 };   // 伞怪独眼即脸；烛龙闭眼焰暗，都要逐帧现画

function spriteKind(sp){ return (FOLK_INFO[sp] || PORTRAIT_ALIAS[sp]) && !SPRITE_SKIP[sp]; }
function spriteSig(){ return [PAPER, MAPKEY, CFG.line, CFG.wobble, CFG.mono ? 1 : 0].join('|'); }
function spriteClear(){ SPRITE.cache.clear(); SPRITE.bytes = 0; }
function spriteTrim(){
  var it = SPRITE.cache.keys();
  while (SPRITE.bytes > SPRITE.max && SPRITE.cache.size > 1) {
    var k = it.next().value, e = SPRITE.cache.get(k);
    SPRITE.bytes -= e.bytes; e.canvas.width = e.canvas.height = 1; SPRITE.cache.delete(k);
  }
}
// 眼睛之外的原有画法里还有三种点睛函数：同样只登记、不在烘焙时画
(function(){
  function recorder(fn, oi, bi){
    return function(){
      if (ART_BAKE) { ART_BAKE.push({fn:fn, a:Array.prototype.slice.call(arguments), hi:bi == null ? 0 : null, oi:oi, bi:bi, M:ctx.getTransform()}); return; }
      return fn.apply(this, arguments);
    };
  }
  folkPortraitEyes = recorder(folkPortraitEyes, 1);
  naturalEyes = recorder(naturalEyes, 1);
  atlasEye = recorder(atlasEye, null, 4);        // atlasEye(x,y,r,seed,blink,iris)：第 5 个参数是眨眼量
})();

function spriteBake(h, k, base){
  var X0 = 2.0, Y0 = 1.85, w = Math.ceil(2*X0*k), hh = Math.ceil(2*Y0*k);
  var c = document.createElement('canvas'); c.width = w; c.height = hh;
  if (typeof MEM_TAG === 'function') MEM_TAG(c, 'portrait-sprite');
  var recs = [], oldYaw = h.yaw, lw = LW, galpha = GALPHA;
  var o0 = {ox:0, oy:0, hs:1, mouth:0, smile:0, eye:0, brow:0, gazeX:0, gazeY:0, flap:0, perform:0, wind:0, life:0};
  renderTo(c.getContext('2d'), PAT, LINE_K, function(){
    ctx.setTransform(k, 0, 0, k, X0*k, Y0*k); LW = lw; GALPHA = 1; h.yaw = 0; ART_BAKE = recs;
    try { base.call(h, o0); } finally { ART_BAKE = null; h.yaw = oldYaw; GALPHA = galpha; }
  });
  LW = lw;
  var inv = new DOMMatrix([k, 0, 0, k, X0*k, Y0*k]).inverse();
  recs.forEach(function(r){ r.R = inv.multiply(r.M); r.M = null; });
  SPRITE.bakes++;
  return { canvas:c, X0:X0, Y0:Y0, k:k, recs:recs, bytes:w*hh*4 };
}

var spriteBaseNatural = Head.prototype.drawNatural;
Head.prototype.drawNatural = function(o){
  if (!SPRITE.on || ctx !== gctx || !spriteKind(this.g.sp) || o.neck || (o.melt||0) > .01 || (o.ice||0) > .02 || GALPHA < .999 ||
      Math.abs(o.perform||0) > .04 || Math.abs(o.wind||0) > .08) { SPRITE.live++; return spriteBaseNatural.call(this, o); }
  var M = ctx.getTransform(), kNow = Math.hypot(M.a, M.b), kNom = kNow / Math.max(.05, (this.pop||1)*(o.hs||1));
  var bucket = Math.max(16, Math.round(kNom*4)/4);   // 同一舞台所有格子同尺寸：按实际尺寸烘焙，1:1 贴图不发虚
  if (bucket > 110) { SPRITE.live++; return spriteBaseNatural.call(this, o); }
  var sig = spriteSig(); if (sig !== SPRITE.sig) { spriteClear(); SPRITE.sig = sig; }
  var key = this.g.sp + '|' + this.g.fur + '|' + (this.g.donor||'') + '|' + (this.g.motifVariant||0) + '|' + STYLE + '|' + (COLOR ? 1 : 0) + '|' + bucket;
  var e = SPRITE.cache.get(key);
  if (e) { SPRITE.cache.delete(key); SPRITE.cache.set(key, e); SPRITE.hits++; }
  else { e = spriteBake(this, bucket, spriteBaseNatural); SPRITE.cache.set(key, e); SPRITE.bytes += e.bytes; spriteTrim(); }
  ctx.save();
  ctx.scale(.76 + .24*Math.abs(Math.cos(this.yaw)), 1);
  ctx.drawImage(e.canvas, -e.X0, -e.Y0, e.canvas.width/e.k, e.canvas.height/e.k);
  var B = ctx.getTransform();
  for (var i = 0; i < e.recs.length; i++) {
    var r = e.recs[i], a = r.a.slice();
    if (r.hi === 0) a[0] = this;
    if (r.oi != null) a[r.oi] = o;
    if (r.bi != null) a[r.bi] = o.eye || 0;
    ctx.setTransform(B); ctx.transform(r.R.a, r.R.b, r.R.c, r.R.d, r.R.e, r.R.f);
    r.fn.apply(null, a);
  }
  ctx.restore();
};
document.addEventListener('visibilitychange', function(){ if (document.hidden) spriteClear(); });

try {
  window.__sprite = {
    get stats(){ return { entries:SPRITE.cache.size, MB:Math.round(SPRITE.bytes/104857.6)/10, bakes:SPRITE.bakes, hits:SPRITE.hits, live:SPRITE.live }; },
    get on(){ return SPRITE.on; }, set on(v){ SPRITE.on = !!v; spriteClear(); },
    clear: spriteClear
  };
} catch (e) {}
