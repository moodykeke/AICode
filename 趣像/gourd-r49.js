/* 趣像 26 (r49): 葫芦七子重画——大头头像，一人一个样
   ─────────────────────────────────────────────────────────────
   反馈："国风葫芦简直是在搞笑，全部一个样子"。以前七兄弟共用一张脸形、同一个发型、同一顶叶冠，只靠小标记区分。
   现在改成 Q 版大头（头约占全身六成、窄小的肩），每人从脸形、发型、眉眼、嘴、配饰到周身小物都不同；
   只保留一个家族记号：胸前一枚同色的小葫芦扣和叶子领。
     小火  火苗竖发、浓眉上挑、咧嘴露虎牙，身边跳两点火星
     小山  平头方脸、一字粗眉、小眼沉稳、抿嘴，石子耳坠、额上石纹带
     小风  发梢向一侧飞、两条风带、挤一只眼、嘬嘴吹口哨
     小叶  锅盖头顶一株双叶芽、弯弯笑眼、雀斑红脸蛋
     小潮  卷卷的浪花刘海、水汪汪大眼、ω 小嘴、身边一颗水珠
     小雾  长刘海遮住一只眼、另一只半眯、月牙发夹，整个人淡一点
     小灯  双丸子头插星星簪、星星眼、张嘴笑，背后一圈头光
   "国风葫芦"不再单独成一类（场景与角色包里去掉），七兄弟归入"动画来客"；旧分享码仍能打开。 */

var GOURD2_INK = '#3a3632';
function g2Head(shape, skin, s) {
  if (shape === 'square') folkPaint([[-.78,-.62],[-.72,-.96],[-.30,-1.10],[.30,-1.10],[.72,-.96],[.78,-.62],[.80,.10],[.62,.52],[.30,.66],[-.30,.66],[-.62,.52],[-.80,.10]], skin, s);
  else if (shape === 'long') folkPaint([[-.70,-.60],[-.58,-1.00],[0,-1.16],[.58,-1.00],[.70,-.60],[.72,.12],[.50,.58],[0,.72],[-.50,.58],[-.72,.12]], skin, s);
  else if (shape === 'point') folkPaint([[-.80,-.55],[-.66,-.98],[0,-1.14],[.66,-.98],[.80,-.55],[.78,.10],[.46,.52],[0,.70],[-.46,.52],[-.78,.10]], skin, s);
  else folkPaint(ring(0, -.22, .82, .90, 28), skin, s);
}
function g2Body(h, o, c, skin, leaf, s) {
  h._skin = skin; if (typeof SPLIT_SKIN !== 'undefined') SPLIT_SKIN[h.g.sp] = skin;
  folkShape([[-.16,.58],[.16,.58],[.19,.92],[-.19,.92]], skin, s + 110);
  folkShape([[-.80,1.46],[-.66,1.06],[-.26,.88],[.26,.88],[.66,1.06],[.80,1.46]], c, s + 111);
  folkLeaf(-.18, .96, -1.9, leaf, s + 112); folkLeaf(.18, .96, 1.9, leaf, s + 113);
  folkOval(0, 1.16, .07, .08, mixHex(c, '#ffffff', .25), s + 114); folkOval(0, 1.29, .1, .11, mixHex(c, '#ffffff', .25), s + 115);   // 家族记号：胸前小葫芦扣
}
function g2Brow(x, y, w, tilt, lw, s) { atlasLine([[x - w, y + tilt], [x, y - .02], [x + w, y - tilt]], s, lw, .9, GOURD2_INK); }
var GOURD2 = [
  function fire(h, o, c, skin, leaf, s, p) {
    artFlame(0, -1.08, 1.9, 0, c, '#f2b64a', s + 20);
    artFlame(-.48, -.98, .9, -.5, c, '#f2b64a', s + 21); artFlame(.50, -.98, .9, .5, c, '#f2b64a', s + 22);
    g2Head('point', skin, s + 10);
    folkShape([[-.78,-.45],[-.66,-.92],[-.2,-1.02],[.2,-1.02],[.66,-.92],[.78,-.45],[.46,-.70],[.18,-.56],[0,-.74],[-.18,-.56],[-.46,-.70]], mixHex(c, '#3a2020', .35), s + 11);
    for (var sg = -1; sg <= 1; sg += 2) { g2Brow(sg * .30, -.30, .16, -.07 * sg * -1, 2.4, s + 30 + sg); artEyeAlmond(h, o, sg * .30, -.08, .12, .04, s + 34 + sg * 3, { pupil: .05 }); artBlush(sg * .50, .18, .12, .06, s + 40 + sg, '#e8805e'); }
    folkShape([[-.24,.30],[0,.36],[.24,.30],[.14,.48],[0,.52],[-.14,.48]], '#8e3a30', s + 50);
    folkShape([[.08,.31],[.15,.31],[.12,.38]], '#fbf6ee', s + 51);
    artFlame(-.98, -.30 - p * .08, .45, -.2, c, '#f2b64a', s + 60, .9); artFlame(1.0, .02 + p * .06, .38, .2, c, '#f2b64a', s + 61, .85);
  },
  function stone(h, o, c, skin, leaf, s, p) {
    g2Head('square', skin, s + 10);
    folkShape([[-.80,-.66],[-.78,-1.02],[.78,-1.02],[.80,-.66],[.50,-.74],[-.50,-.74]], '#46423c', s + 11);
    folkShape([[-.80,-.66],[.80,-.66],[.78,-.54],[-.78,-.54]], '#9a9184', s + 12);
    [-.5, -.1, .32].forEach(function (x, i) { atlasLine([[x, -.64], [x + .08, -.58], [x + .04, -.54]], s + 13 + i, .7, .6, '#5b5146'); });
    for (var sg = -1; sg <= 1; sg += 2) { atlasLine([[sg * .14, -.30], [sg * .46, -.30]], s + 30 + sg, 3.2, .92, GOURD2_INK); var b = artBlink(o); if (b > .65) atlasLine([[sg * .22, -.10], [sg * .38, -.10]], s + 34 + sg, 1.2, .9); else { fill(ring(sg * .30 + (o.gazeX || 0) * .02, -.10, .045, .04 * (1 - b) + .005, 10), { color: INK, jit: 0 }); atlasLine([[sg * .20, -.16], [sg * .40, -.16]], s + 36 + sg, 1.1, .85); } folkOval(sg * .86, .10, .07, .08, '#8c8477', s + 38 + sg); }
    atlasLine([[-.16,.40],[0,.41],[.16,.40]], s + 50, 1.5, .9);
    atlasLine([[.46,.12],[.52,.20],[.48,.28]], s + 52, .6, .5, '#8a6f5a');
  },
  function wind(h, o, c, skin, leaf, s, p) {
    artStrip([[.40,-.90],[.90,-.98+p*.06],[1.30,-.86+p*.08],[1.62,-.98+p*.08]], .06, .02, mixHex(leaf, '#f3efe0', .3), s + 20, .9, .5);
    artStrip([[.46,-.70],[.94,-.62+p*.05],[1.34,-.48+p*.07]], .05, .02, leaf, s + 21, .9, .5);
    g2Head('round', skin, s + 10);
    folkShape([[-.82,-.34],[-.80,-.82],[-.40,-1.10],[.20,-1.14],[.70,-1.00],[1.12,-.88+p*.05],[.86,-.76],[1.02,-.62+p*.05],[.70,-.58],[.36,-.72],[.10,-.60],[-.30,-.72],[-.58,-.52]], '#3d4a48', s + 11);
    var b = artBlink(o);
    g2Brow(-.30, -.30, .14, .02, 1.3, s + 30); g2Brow(.30, -.34, .14, -.04, 1.3, s + 31);
    artEyeAlmond(h, o, -.30, -.08, .12, .03, s + 34, { pupil: .045 });
    atlasLine([[.18, -.10], [.30, -.16], [.42, -.10]], s + 36, 1.6, .9);   // 挤一只眼
    stroke(ring(.06, .38, .06, .07, 12), { close: true, w: 1.1, jit: .002, seed: s + 50 });
    atlasLine([[.18,.34],[.32,.28],[.44,.34],[.58,.28]], s + 51, .8, .55, '#6f8a5c');
    atlasLine([[.26,.42],[.40,.40],[.54,.46]], s + 52, .7, .45, '#6f8a5c');
  },
  function leafy(h, o, c, skin, leaf, s, p) {
    atlasLine([[0,-1.06],[.02,-1.30],[.0,-1.46]], s + 20, 1.4, .9, mixHex(leaf, '#2f4a2a', .3));
    folkLeaf(-.02, -1.44, -1.1 - p * .1, leaf, s + 21); folkLeaf(.04, -1.44, 1.1 + p * .1, leaf, s + 22);
    g2Head('round', skin, s + 10);
    folkShape([[-.84,-.30],[-.82,-.80],[-.46,-1.08],[0,-1.14],[.46,-1.08],[.82,-.80],[.84,-.30],[.74,-.46],[.40,-.48],[0,-.50],[-.40,-.48],[-.74,-.46]], '#3e5238', s + 11);
    for (var sg = -1; sg <= 1; sg += 2) {
      if (artBlink(o) > .65) atlasLine([[sg * .20, -.08], [sg * .30, -.03], [sg * .40, -.08]], s + 34 + sg, 1.3, .9);
      else atlasLine([[sg * .20, -.05], [sg * .30, -.14], [sg * .40, -.05]], s + 34 + sg, 1.5, .9);
      artBlush(sg * .46, .14, .15, .08, s + 40 + sg, '#e8907a');
      [[.40,.02],[.48,-.02],[.46,.08]].forEach(function (v, i) { fill(ring(sg * v[0], v[1] + .05, .014, .014, 6), { color: '#b07a5a', jit: 0 }); });
    }
    atlasLine([[-.14,.36],[0,.42+(o.smile||0)*.015],[.14,.36]], s + 50, 1.2, .9);
  },
  function water(h, o, c, skin, leaf, s, p) {
    g2Head('round', skin, s + 10);
    folkShape([[-.84,-.30],[-.82,-.80],[-.44,-1.10],[.20,-1.14],[.70,-.96],[.84,-.40],[.66,-.58],[.46,-.46],[.34,-.64],[.10,-.52],[-.04,-.72],[-.30,-.56],[-.52,-.66]], '#2f4a5c', s + 11);
    stroke([[-.04,-.72],[-.14,-.52],[-.02,-.40],[.10,-.50],[.02,-.58]], { w: 1.4, jit: .002, seed: s + 12, color: '#2f4a5c' });
    for (var sg = -1; sg <= 1; sg += 2) {
      artEyeRound(h, o, sg * .30, -.06, .11, '#3f7f86', s + 34 + sg * 3);
      if (artBlink(o) < .65) fill(ring(sg * .30 + .04, -.02, .018, .018, 6), { color: PAPER, jit: 0 });
      g2Brow(sg * .30, -.28, .12, .03 * sg, 1, s + 30 + sg);
    }
    atlasLine([[-.10,.36],[-.05,.40],[0,.37],[.05,.40],[.10,.36]], s + 50, 1.1, .9);
    var dy = p * .06; folkShape([[.98,-.10+dy],[.90,.06+dy],[.94,.14+dy],[1.02,.14+dy],[1.06,.06+dy]], '#9cc9e8', s + 60);
  },
  function mist(h, o, c, skin, leaf, s, p) {
    wash(ring(0, -.20, 1.10, 1.14, 28), '#c7cddb', s + 5, .45, .02);
    var ga = GALPHA; GALPHA = ga * .82;
    g2Head('long', skin, s + 10);
    folkShape([[-.74,.30],[-.76,-.70],[-.44,-1.08],[.10,-1.18],[.60,-1.02],[.74,-.62],[.40,-.66],[.10,-.56],[-.06,-.02],[-.24,.16],[-.52,.20]], '#4a4f5c', s + 11);
    artEyeAlmond(h, o, .28, -.08, .12, .0, s + 34, { drop: .03, lw: 1.8, look: .2 });
    g2Brow(.28, -.30, .12, 0, .9, s + 30);
    atlasLine([[.02,.40],[.12,.41],[.20,.39]], s + 50, 1, .85);
    folkShape([[.46,-.78],[.54,-.70],[.66,-.74],[.60,-.60],[.48,-.62]], '#d4d9df', s + 60);
    GALPHA = ga;
  },
  function light(h, o, c, skin, leaf, s, p) {
    var R = ring(0, -.30, 1.14, 1.14, 40); wash(R, '#ecd48a', s + 5, .28, .01); stroke(R, { close: true, w: 1.1, jit: .002, alpha: .7, color: '#c9a24a', seed: s + 6 });
    folkOval(-.58, -.98, .26, .25, '#4a3f3a', s + 20); folkOval(.58, -.98, .26, .25, '#4a3f3a', s + 21);
    g2Head('round', skin, s + 10);
    folkShape([[-.82,-.40],[-.76,-.84],[-.40,-1.08],[.40,-1.08],[.76,-.84],[.82,-.40],[.56,-.62],[.20,-.60],[0,-.72],[-.20,-.60],[-.56,-.62]], '#4a3f3a', s + 11);
    [[-.70,-1.16],[.70,-1.16]].forEach(function (q, i) { var st = []; for (var k = 0; k < 10; k++) { var a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? .05 : .12; st.push([q[0] + Math.cos(a) * r, q[1] + Math.sin(a) * r]); } folkShape(st, '#f0c04a', s + 22 + i); });
    for (var sg = -1; sg <= 1; sg += 2) {
      artEyeRound(h, o, sg * .28, -.02, .12, '#6a4a7a', s + 34 + sg * 3);
      if (artBlink(o) < .65) { var x = sg * .28 + .045, y = .02; atlasLine([[x - .03, y], [x + .03, y]], s + 40 + sg, .8, .95, PAPER); atlasLine([[x, y - .03], [x, y + .03]], s + 42 + sg, .8, .95, PAPER); }
      artBlush(sg * .46, .20, .13, .07, s + 44 + sg, '#e8907a');
      g2Brow(sg * .28, -.26, .11, .03 * sg, .9, s + 30 + sg);
    }
    folkShape([[-.16,.32],[0,.34],[.16,.32],[.10,.46],[0,.49],[-.10,.46]], '#9a4a3e', s + 50);
  }
];
var GOURD2_KIND = { fire: 0, stone: 1, wind: 2, leaf: 3, water: 4, mist: 5, light: 6 };
folkGourdFigure = function (h, o, info) {
  var s = h.g.seed, c = h.g.fur, leaf = info.pigments[1], skin = info.pigments[2] || '#ecc9a6';
  var n = GOURD2_KIND[info.kind]; if (n == null) n = info.ordinal || 0;
  var p = (typeof atlasPulse === 'function') ? atlasPulse(o) : 0;
  g2Body(h, o, c, skin, leaf, s);
  ctx.save(); ctx.translate(0, -.08); ctx.scale(1.08, 1.08);             // 大头：头部整体放大、略上提
  GOURD2[n](h, o, c, skin, leaf, s, p);
  ctx.restore();
};
if (typeof FOLK_SERIES !== 'undefined' && FOLK_SERIES.guofeng) {
  FOLK_SERIES.guofeng.keys.forEach(function (k) { ATLAS_DRAW[k] = function (h, o) { folkGourdFigure(h, o, FOLK_INFO[k]); }; });
  Object.keys(typeof PORTRAIT_ALIAS !== 'undefined' ? PORTRAIT_ALIAS : {}).forEach(function (k) { var src = FOLK_INFO[PORTRAIT_ALIAS[k]]; if (src) ATLAS_DRAW[k] = function (h, o) { folkGourdFigure(h, o, src); }; });
  var G2_TRAITS = [['火苗竖发', '浓眉虎牙', '身边火星'], ['平头方脸', '一字粗眉', '石子耳坠'], ['飞扬发梢', '挤眼吹哨', '两条风带'], ['锅盖头嫩芽', '弯弯笑眼', '雀斑红脸蛋'], ['浪花刘海', '水汪汪大眼', 'ω 小嘴'], ['长刘海遮眼', '半眯的眼', '月牙发夹'], ['双丸子星簪', '星星眼', '头光一圈']];
  FOLK_SERIES.guofeng.keys.forEach(function (k) { var info = FOLK_INFO[k], n = GOURD2_KIND[info.kind]; if (n != null) info.traits = G2_TRAITS[n].slice(); });
  Object.keys(typeof PORTRAIT_ALIAS !== 'undefined' ? PORTRAIT_ALIAS : {}).forEach(function (k) { var src = FOLK_INFO[PORTRAIT_ALIAS[k]], info = NATURAL_INFO[k]; if (src && info) info.traits = src.traits.slice(); });
}
/* "国风葫芦"不再单独成一类：场景按钮与角色包里去掉，七兄弟归入"动画来客" */
(function g2Merge() {
  Array.prototype.forEach.call(document.querySelectorAll('[data-scene="guofeng"]'), function (b) { b.hidden = true; b.style.display = 'none'; });
  if (typeof QX_PACKS !== 'undefined' && QX_PACKS.byId.guofeng) {
    QX_PACKS.list = QX_PACKS.list.filter(function (p) { return p.id !== 'guofeng'; });
    delete QX_PACKS.byId.guofeng;
    Object.keys(QX_PACKS._of).forEach(function (k) { if (QX_PACKS._of[k] === 'guofeng') QX_PACKS._of[k] = 'cartoons'; });
  }
})();
