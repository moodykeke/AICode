/* 趣像 26 (r49): 半身像"头肩分离"
   ─────────────────────────────────────────────────────────────
   反馈：欧洲神话人物点一下，整个人连肩膀一起往上跳，脖子也跟着伸——肩膀、脖子、头没有分开。
   原因：民间/神话角色是整张半身画，舞台把"头的位移"（点击跳起、伸脖子、摇头晃脑）套在整张画上。
   做法：只对有肩膀的半身像（西游、百鬼、欧洲神话、葫芦七子等），位移明显时分三层画——
     肩膀  不带位移，裁在领口线以下，钉在原地；
     脖子  从领口到下巴补一段同肤色的颈（头被顶起多高，脖子就伸多长；"脖子跟随"关掉时不补）；
     头    带位移，裁在自己的领口线以上。
   位移很小（呼吸式的轻晃）时照原样整张画，不多花一笔。兽类（山海）、海洋、花园角色本来就是整只跳，不动。 */

var SPLIT_SKIN = {};                     /* 按物种记肤色：半身像有位图缓存，同一物种只真正画一次 */
if (typeof folkBustCore === 'function') {
  var splitBaseCore = folkBustCore;
  folkBustCore = function (h, o, robe, skin) { if (h && h.g) SPLIT_SKIN[h.g.sp] = skin; return splitBaseCore.apply(this, arguments); };
}
function splitIsBust(h) {
  var g = h.g; if (!g || !g.natural) return false;
  var info = NATURAL_INFO[g.sp] || {};
  if (info.support === 'beast') return false;
  return info.support === 'bust' || (!!FOLK_INFO[g.sp] && info.support !== 'figure');
}
var SPLIT_Y = .84;                       // 领口线（单位坐标）：folkBustCore 的肩线从 .84 起
var splitBaseHead = Head.prototype.drawHeadAt;
Head.prototype.drawHeadAt = function (o) {
  if (!o || !splitIsBust(this)) return splitBaseHead.apply(this, arguments);
  var ox = o.ox || 0, oy = o.oy || 0, hs = o.hs || 1;
  if (oy < 0) oy *= .55;                 /* 半身像比圆头高：同样的弹跳，头只顶起一半多一点，不至于飞出格子 */
  if (Math.abs(oy) < .05 && Math.abs(ox) < .05 && Math.abs(hs - 1) < .05 && !o.neck) return splitBaseHead.apply(this, arguments);
  var k = this.s * this.pop; if (k < .001) return;
  var still = {}, head = {}, key;
  for (key in o) { still[key] = o[key]; head[key] = o[key]; }
  still.ox = 0; still.oy = 0; still.hs = 1; still.neck = null; head.neck = null; head.oy = oy;
  /* 肩膀：钉在原地 */
  ctx.save(); ctx.beginPath(); ctx.rect(this.x - k * 4, this.y + SPLIT_Y * k, k * 8, k * 3); ctx.clip();
  splitBaseHead.call(this, still);
  ctx.restore();
  /* 脖子：从领口接到被顶起的下巴 */
  var lift = -oy, follow = String(CFG.neckMode || 'follow') !== 'pop';
  if (lift > .06 && follow) {
    var skin = SPLIT_SKIN[this.g.sp] || this._skin || '#e3c1a0';
    useStyle(this.g); ctx.save(); ctx.translate(this.x, this.y); ctx.scale(k, k); ctx.rotate(this.roll * .3);
    LW = 1.15 * LINE_K / k;
    var top = .50 * hs + oy, nx = ox;
    folkShape([[-.23, SPLIT_Y + .10], [nx - .18 * hs, top], [nx + .18 * hs, top], [.23, SPLIT_Y + .10]], skin, this.g.seed + 170);
    atlasLine([[-.23, SPLIT_Y + .06], [nx - .18 * hs, top + .04]], this.g.seed + 171, .8, .55, mixHex(skin, '#3a3530', .45));
    atlasLine([[.23, SPLIT_Y + .06], [nx + .18 * hs, top + .04]], this.g.seed + 172, .8, .55, mixHex(skin, '#3a3530', .45));
    ctx.restore();
  }
  /* 头：带位移，裁在自己的领口线以上 */
  ctx.save(); ctx.beginPath(); ctx.rect(this.x - k * 4, this.y - k * 6, k * 8, (6 + oy + SPLIT_Y * hs) * k); ctx.clip();
  splitBaseHead.call(this, head);
  ctx.restore();
};
