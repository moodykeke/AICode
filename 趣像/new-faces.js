/* 趣像 05 (r19 → r43): 经典半身版式与十一位角色的逐个造型
   r19：半身托升级为经典比例；新增西游 +4、百鬼 +4、山海 +3。
   r43：r19 的十一位由一个参数化模板生成，结果是"同一张脸 + 同一片刘海"，兽类被贴上猪鼻块，
        道具悬空、角只是细线——不符合经典头像"一条完整轮廓、五官长在脸上、一两个身份符号"。
        现改为"共用零件、逐个构图"：半身托／四种眼睛／火焰／雪花／飘带共用，每位角色各写构图；
        山海三位回到异兽画法（躯干、前爪或盘身 + 云台），不再拼人形肩膀；
        国风葫芦的 r19 标记分前后两层，水纹抹额、雾纱、头光不再横穿眉眼；
        新角色作为借体时也有自己的遗传标志（此前卡背显示"借来：undefined"）。
   编号、名称、英文名与 NATURAL 顺序不变，旧分享码仍指向同一角色。
   性能预算：每位 ≤ 约 0.7ms/头（与葫芦七兄弟同档），见《角色重绘-r43.md》。 */

/* ---------- 经典半身托：宽肩、领口、袖缝 ---------- */
function folkBustCore(h,o,robe,skin,accent,collar){
  var s = h.g.seed;
  // 脖子：跟随（头被弹起或飞起时伸长）或固定短颈
  if (o && o.neck && String(CFG.neckMode || 'follow') !== 'pop') {
    var nbx = o.ox || 0, nby = 0.26 + (o.oy || 0);
    folkShape([[-.24,.94],[-.12,nby-0.06],[nbx-.19,nby],[nbx+.19,nby],[.12,nby-0.06],[.24,.94]], skin, s+110);
    atlasLine([[nbx-.19,nby],[nbx+.19,nby]], s+118, .8, .5, skin);
  } else {
    folkShape([[-.20,.44],[.20,.44],[.23,.92],[-.23,.92]], skin, s+110);
  }
  // 肩与胸：抬高的半身托
  folkShape([[-1.22,1.46],[-.98,1.06],[-.52,.90],[-.22,.84],[.22,.84],[.52,.90],[.98,1.06],[1.22,1.46]], robe, s+111);
  if (collar === 'none') return;                       // 赤膊（红孩）：不画领口与袖缝
  if (collar === 'kimono') {                           // 和服：内衬 V 领 + 右衽两条襟线
    folkShape([[-.28,.86],[0,1.00],[.28,.86],[.12,1.30],[-.12,1.30]], accent, s+112);
    atlasLine([[-.36,.88],[.02,1.28],[.14,1.46]], s+113, 1.6, .85, mixHex(robe,'#3a3530',.35));
    atlasLine([[.36,.88],[.12,1.12]], s+119, 1.4, .8, mixHex(robe,'#3a3530',.35));
  } else {                                             // 交领：两笔斜襟
    folkShape([[-.30,.86],[0,1.02],[.30,.86],[.16,1.20],[0,1.30],[-.16,1.20]], accent, s+112);
    atlasLine([[-.34,.90],[-.06,1.22],[.06,1.34]], s+113, 1.5, .8, accent);
    atlasLine([[-.16,1.34],[-.10,1.46]], s+116, 1.1, .5, accent);
    atlasLine([[.16,1.34],[.10,1.46]], s+117, 1.1, .5, accent);
  }
  // 袖缝：一条外廓一笔内袖
  atlasLine([[-.96,1.10],[-1.12,1.42]], s+114, 1.6, .75, robe);
  atlasLine([[.96,1.10],[1.12,1.42]], s+115, 1.6, .75, robe);
}
var FOLK_BUST = function(h,o,c,skin){
  var info = (typeof FOLK_INFO !== 'undefined' && FOLK_INFO[h.g.sp]) || {};
  folkBustCore(h, o, c, skin, (info.pigments && info.pigments[1]) || c, 'cross');
};
folkBustBase = FOLK_BUST;   /* 所有半身系列（国风/西游/妖怪/欧洲/巨人）共用抬高后的肩线与领口 */

/* ---------- 共用零件 ---------- */
var ART_BAKE = null;   // 位图缓存烘焙中：眼睛只登记不画，每帧按实时视线/眨眼重画（见 portrait-sprite.js）
function artBlink(o){ return clamp(o.eye || 0, 0, 1); }
// 兽眼：虹膜 + 瞳 + 高光，沿用经典动物头像的点睛法
function artEyeRound(h,o,x,y,r,iris,s){
  if (ART_BAKE) { ART_BAKE.push({fn:artEyeRound, a:Array.prototype.slice.call(arguments), hi:0, oi:1, M:ctx.getTransform()}); return; }
  var b = artBlink(o), gx = (o.gazeX || 0)*r*.35, gy = (o.gazeY || 0)*r*.25;
  if (b > .65) { atlasLine([[x-r*1.1,y],[x,y+r*.45],[x+r*1.1,y]], s, 1.1, .9); return; }
  var ry = r*(1 - b*.9);
  if (iris) {
    var ir = ring(x, y, r, ry, 16); knock(ir, s, .004); wash(ir, iris, s+1, 1, .004); stroke(ir, {close:true, w:.9, jit:.003, seed:s+2});
    fill(ring(x+gx, y+gy, r*.52, ry*.56, 12), {color:INK, jit:0});
  } else fill(ring(x+gx, y+gy, r*.78, ry*.9, 12), {color:INK, jit:0});
  fill(ring(x+gx-r*.32, y+gy-ry*.36, r*.22, r*.22, 8), {color:PAPER, jit:0});
}
// 人眼：上睑弧线 + 瞳 + 高光；tilt 为外眼角上挑量
function artEyeAlmond(h,o,x,y,w,tilt,s,opt){
  if (ART_BAKE) { ART_BAKE.push({fn:artEyeAlmond, a:Array.prototype.slice.call(arguments), hi:0, oi:1, M:ctx.getTransform()}); return; }
  opt = opt || {};
  var sg = x < 0 ? -1 : 1, b = artBlink(o), gx = ((o.gazeX || 0)*.32 + (opt.look || 0))*w, gy = (o.gazeY || 0)*.018, dy = opt.drop || 0;
  var inner = [x-sg*w, y+.012], outer = [x+sg*w, y-tilt], mid = [x+sg*w*.1, y-.064];
  if (b > .65) {
    atlasLine([inner,[x,y+.03],outer], s, 1.1, .9);
    if (opt.lash) atlasLine([outer,[outer[0]+sg*.06,outer[1]-.03]], s+3, 1, .85);
    return;
  }
  var pr = opt.pupil || .042;
  if (opt.iris) { var ir = ring(x+gx, y-.006+gy+dy, pr*1.45, pr*1.3*(1-b)+.006, 14); fill(ir, {color:mixHex(opt.iris,'#ffffff',.05), jit:0}); stroke(ir, {close:true, w:.55, jit:0, seed:s+4, alpha:.7}); }
  fill(ring(x+gx, y-.012+gy+dy, pr, pr*1.15*(1-b)+.006, 12), {color:INK, jit:0});
  fill(ring(x+gx-pr*.35, y-.03+dy, pr*.3, pr*.3, 6), {color:PAPER, jit:0});
  atlasLine([inner,mid,outer], s, opt.lw || 1.3, .92);
  if (opt.lash) atlasLine([outer,[outer[0]+sg*.07,outer[1]-.04]], s+3, 1, .85);
  if (opt.lower !== false) atlasLine([[x-sg*w*.55,y+.05],[x,y+.058],[x+sg*w*.55,y+.045]], s+2, .55, .4);
}
// 圆睁的白眼珠（经典 wide 眼）：纸色眼白 + 墨线 + 瞳；look 让瞳孔偏向某处
function artEyeWhite(h,o,x,y,rx,ry,s,look){
  if (ART_BAKE) { ART_BAKE.push({fn:artEyeWhite, a:Array.prototype.slice.call(arguments), hi:0, oi:1, M:ctx.getTransform()}); return; }
  var b = artBlink(o), gx = ((o.gazeX || 0)*.3 + (look || 0))*rx, gy = (o.gazeY || 0)*ry*.3;
  if (b > .65) { atlasLine([[x-rx,y],[x,y+ry*.4],[x+rx,y]], s, 1.1, .9); return; }
  var e = ring(x, y, rx, ry*(1 - b*.85), 16); knock(e, s, .003); stroke(e, {close:true, w:.95, jit:.003, seed:s+1});
  var pr = Math.min(rx, ry)*.5, px = clamp(x+gx, x-rx+pr, x+rx-pr);
  fill(ring(px, y+gy, pr, pr*(1-b), 10), {color:INK, jit:0});
  fill(ring(px-pr*.35, y+gy-pr*.4, pr*.3, pr*.3, 6), {color:PAPER, jit:0});
}
// 猫眼：琥珀虹膜 + 竖瞳
function artEyeSlit(h,o,x,y,rx,ry,iris,s,tilt){
  if (ART_BAKE) { ART_BAKE.push({fn:artEyeSlit, a:Array.prototype.slice.call(arguments), hi:0, oi:1, M:ctx.getTransform()}); return; }
  var sg = x < 0 ? -1 : 1, b = artBlink(o), gx = (o.gazeX || 0)*rx*.3;
  if (b > .65) { atlasLine([[x-rx,y],[x,y+ry*.35],[x+rx,y-sg*ry*.3]], s, 1.2, .9); return; }
  var e = ring(x, y, rx, ry*(1 - b*.85), 16, -sg*(tilt || 0));
  knock(e, s, .003); wash(e, iris, s+1, 1, .003); stroke(e, {close:true, w:1.05, jit:.003, seed:s+2});
  fill(ring(x+gx, y, rx*.17, ry*.84*(1-b), 10), {color:INK, jit:0});
  fill(ring(x+gx-rx*.36, y-ry*.34, rx*.16, rx*.16, 6), {color:PAPER, jit:0});
}
// 直目（烛龙）：竖长的眼
function artEyeVertical(h,o,x,y,rx,ry,iris,s){
  if (ART_BAKE) { ART_BAKE.push({fn:artEyeVertical, a:Array.prototype.slice.call(arguments), hi:0, oi:1, M:ctx.getTransform()}); return; }
  var b = artBlink(o), gx = (o.gazeX || 0)*rx*.3, gy = (o.gazeY || 0)*ry*.25;
  if (b > .65) { atlasLine([[x,y-ry],[x+(x<0?-1:1)*rx*.45,y],[x,y+ry]], s, 1.1, .9); return; }
  var e = ring(x, y, rx, ry*(1 - b*.8), 16); knock(e, s, .003); wash(e, iris, s+1, 1, .003); stroke(e, {close:true, w:.95, jit:.003, seed:s+2});
  fill(ring(x+gx, y+gy, rx*.3, ry*.6*(1-b), 10), {color:INK, jit:0});
  fill(ring(x+gx-rx*.22, y+gy-ry*.3, rx*.2, rx*.2, 6), {color:PAPER, jit:0});
}
function artBlush(x,y,rx,ry,s,col){ if (COLOR) wash(ring(x, y, rx, ry, 14), col || '#e58c74', s, .45, .01); }
// 火焰：外焰 + 内焰；sz 为整体尺寸，线宽按尺寸补偿
function artFlame(x,y,sz,rot,outer,inner,s,alpha){
  var lw = LW; ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(sz, sz); LW = lw/sz;
  var a = alpha == null ? .96 : alpha;
  folkPaint([[0,.30],[-.20,.18],[-.26,-.06],[-.14,-.28],[-.10,-.12],[-.02,-.46],[.10,-.20],[.20,-.30],[.26,-.02],[.20,.18]], outer, s, a, .8);
  if (inner) folkPaint([[0,.24],[-.10,.14],[-.12,-.02],[-.02,-.18],[.06,-.04],[.10,.14]], inner, s+1, a, .5);
  ctx.restore(); LW = lw;
}
function artSnow(x,y,r,s,col,alpha){
  for (var i = 0; i < 3; i++) { var a = i*Math.PI/3 + .26; atlasLine([[x-Math.cos(a)*r,y-Math.sin(a)*r],[x+Math.cos(a)*r,y+Math.sin(a)*r]], s+i, .8, alpha || .8, col); }
}
function artStrip(path,w0,w1,col,s,alpha,lw){ var e = tubeEdges(path, w0, w1); folkPaint(e.L.concat(e.R.slice().reverse()), col, s, alpha, lw || .75); }
function artBow(x,y,sz,col,s){
  folkShape([[x,y],[x-sz,y-sz*.62],[x-sz*.92,y+sz*.5]], col, s);
  folkShape([[x,y],[x+sz,y-sz*.62],[x+sz*.92,y+sz*.5]], col, s+1);
  folkOval(x, y, sz*.26, sz*.3, mixHex(col,'#3a2a25',.2), s+2);
}

/* ---------- 细节分级（r43 性能） ----------
   7×5 舞台上每单位只有约 40–60 设备像素，卷毛、鳞纹、羽脉、念珠点这类 1–2px 的装饰看不见却很费时；
   每单位不足 ART_DETAIL_PX 时跳过它们，卡片、导出与打印合影仍画全。
   弱机兜底：舞台最近帧绘制持续 >30ms 时整体改简版，降回 <18ms 才恢复（带回差，不会来回闪）。 */
var ART_DETAIL_PX = 64, ART_LOW = false, ART_D = true;
function artDetail(){
  if (typeof gctx !== 'undefined' && ctx === gctx && typeof perfDraw === 'number') {
    if (perfDraw > 30) ART_LOW = true; else if (perfDraw < 18) ART_LOW = false;
    if (ART_LOW) return false;
  }
  var m = ctx.getTransform(); return Math.hypot(m.a, m.b) >= ART_DETAIL_PX;
}

/* ---------- 十一位角色：逐个构图 ---------- */
var FACE_ART = {};

// 牛魔 · 焰山：外展牛角、横耳、浓眉圆睁、宽鼻金环、赭黑虬髯、金边肩甲
FACE_ART.bull = function(h,o,info){
  var s = h.g.seed, c = h.g.fur, gold = info.pigments[1], skin = info.pigments[2], hair = '#3a2621';
  for (var sg = -1; sg <= 1; sg += 2) {
    folkShape([[sg*.44,-.92],[sg*.80,-1.04],[sg*1.10,-1.16],[sg*1.30,-1.42],[sg*1.26,-1.10],[sg*1.04,-.88],[sg*.74,-.72],[sg*.48,-.66]], '#e8d9b5', s+1+sg);
    folkShape([[sg*1.14,-1.18],[sg*1.30,-1.42],[sg*1.25,-1.08]], '#6a5646', s+4+sg);
    if (ART_D) atlasLine([[sg*.80,-1.02],[sg*.76,-.74]], s+7+sg, .7, .55);
    if (ART_D) atlasLine([[sg*.98,-1.10],[sg*.92,-.84]], s+9+sg, .7, .55);
    folkShape([[sg*.64,-.46],[sg*1.00,-.60],[sg*1.04,-.42],[sg*.94,-.28],[sg*.64,-.26]], skin, s+11+sg);
    if (ART_D) wash(ring(sg*.86,-.42,.11,.06,10), '#b87466', s+13+sg, .7, .01);
  }
  folkBustCore(h, o, c, skin, gold, 'cross');
  for (sg = -1; sg <= 1; sg += 2) atlasLine([[sg*1.16,1.38],[sg*.98,1.08],[sg*.62,.94]], s+15+sg, 2.8, .9, gold);
  folkShape([[-.70,-.50],[-.62,-.84],[-.30,-1.00],[.30,-1.00],[.62,-.84],[.70,-.50],[.72,.06],[.58,.44],[.30,.66],[-.30,.66],[-.58,.44],[-.72,.06]], skin, s+20);
  folkShape([[-.70,-.44],[-.68,-.86],[-.34,-1.06],[.34,-1.06],[.68,-.86],[.70,-.44],[.56,-.62],[.26,-.72],[0,-.60],[-.26,-.72],[-.56,-.62]], hair, s+21);
  atlasLine([[-.64,-.80],[-.30,-.92],[0,-.94],[.30,-.92],[.64,-.80]], s+22, 2.4, .95, gold);
  artFlame(0, -1.02, .34, 0, '#c9563a', '#e7b04e', s+23);
  for (sg = -1; sg <= 1; sg += 2) {
    folkShape([[sg*.08,-.28],[sg*.30,-.44],[sg*.54,-.48],[sg*.52,-.38],[sg*.28,-.32],[sg*.10,-.22]], hair, s+25+sg);
    artEyeWhite(h, o, sg*.29, -.17, .095, .068, s+28+sg*3, 0);
  }
  folkShape([[-.20,.04],[-.12,-.12],[0,-.16],[.12,-.12],[.20,.04],[.14,.14],[-.14,.14]], mixHex(skin,'#8a4c3a',.22), s+33);
  fill(ring(-.08,.08,.032,.022,8), {color:INK, jit:0}); fill(ring(.08,.08,.032,.022,8), {color:INK, jit:0});
  for (sg = -1; sg <= 1; sg += 2) folkShape([[sg*.04,.17],[sg*.30,.15],[sg*.52,.26],[sg*.60,.46],[sg*.44,.34],[sg*.24,.26],[sg*.06,.25]], hair, s+35+sg);
  folkShape([[-.62,.18],[-.50,.40],[-.28,.52],[0,.49],[.28,.52],[.50,.40],[.62,.18],[.72,.48],[.56,.82],[.26,1.00],[0,1.04],[-.26,1.00],[-.56,.82],[-.72,.48]], hair, s+38);
  if (ART_D) [[-.32,.74],[.02,.86],[.34,.72]].forEach(function(v,i){ atlasSpiral(v[0], v[1], .055, 1.2, s+40+i, '#7a5a4c', .7, i); });
  atlasLine([[-.14,.40],[0,.37+(o.smile||0)*.02],[.14,.40]], s+46, 1.2, .9);
  stroke(ring(0,.22,.10,.075,18), {close:true, w:2.2, jit:.002, seed:s+47, color:gold});
};

// 铁扇 · 芭蕉：肩后一柄芭蕉扇、高髻金簪步摇、丹凤眼、花钿与樱唇、石青披帛
FACE_ART.fan = function(h,o,info){
  var s = h.g.seed, c = h.g.fur, gold = info.pigments[1], skin = info.pigments[2], p = atlasPulse(o), hair = '#2c2826', vein = '#5d7445';
  ctx.save(); ctx.translate(.92, .44); ctx.rotate(.16 + p*.05);
  atlasLine([[0,.06],[0,.66]], s+1, 2.4, .95, '#7b5b3d');
  folkShape([[0,.06],[-.30,-.10],[-.44,-.46],[-.38,-.84],[-.16,-1.06],[.14,-1.06],[.38,-.84],[.44,-.46],[.30,-.10]], '#8ea267', s+2);
  atlasLine([[0,.04],[0,-1.00]], s+3, 1, .7, vein);
  if (ART_D) for (var i = 0; i < 4; i++) { var y = -.16 - i*.2, w = .30 - Math.abs(i-1.5)*.06; atlasLine([[0,y],[-w,y-.16]], s+4+i, .6, .5, vein); atlasLine([[0,y],[w,y-.16]], s+8+i, .6, .5, vein); }
  ctx.restore();
  folkShape([[-.28,-.90],[-.42,-1.14],[-.30,-1.38],[-.04,-1.50],[.24,-1.44],[.40,-1.22],[.32,-.92]], hair, s+12);
  folkBustCore(h, o, c, skin, gold, 'cross');
  for (var sg = -1; sg <= 1; sg += 2) folkShape([[sg*1.20,1.46],[sg*1.02,1.08],[sg*.66,.92],[sg*.40,.90],[sg*.50,1.00],[sg*.82,1.16],[sg*.98,1.46]], '#6f8f93', s+14+sg);
  folkShape([[-.58,-.50],[-.52,-.86],[-.24,-1.00],[.24,-1.00],[.52,-.86],[.58,-.50],[.56,.04],[.42,.42],[.18,.66],[0,.70],[-.18,.66],[-.42,.42],[-.56,.04]], skin, s+16);
  folkShape([[-.60,-.10],[-.66,-.64],[-.44,-.96],[-.10,-1.06],[0,-1.02],[.10,-1.06],[.44,-.96],[.66,-.64],[.60,-.10],[.50,-.46],[.32,-.74],[.06,-.84],[0,-.78],[-.06,-.84],[-.32,-.74],[-.50,-.46]], hair, s+17);
  atlasLine([[-.50,-1.06],[.52,-1.34]], s+18, 1.8, .95, gold); folkOval(-.52, -1.05, .045, .045, gold, s+19);
  atlasLine([[.52,-1.34],[.58,-1.10+p*.03]], s+20, .7, .8, gold); folkOval(.58, -1.06+p*.03, .04, .05, '#c0574b', s+21);
  folkShape([[0,-.68],[.04,-.61],[0,-.54],[-.04,-.61]], '#c0574b', s+22);
  for (sg = -1; sg <= 1; sg += 2) {
    atlasLine([[sg*.10,-.33],[sg*.25,-.39],[sg*.41,-.35]], s+23+sg, 1.1, .8, '#3d3632');
    artEyeAlmond(h, o, sg*.25, -.15, .11, .05, s+26+sg*3, {lash:true});
    if (ART_D) folkOval(sg*.58, .12, .03, .05, gold, s+33+sg);
  }
  folkProfileNose(h, 0, .04);
  folkShape([[-.09,.42],[-.03,.40],[0,.415],[.03,.40],[.09,.42],[.04,.47],[-.04,.47]], '#c0574b', s+32);
};

// 红孩 · 火尖：光头圆脸、两枚火焰形小髻与桃形额发、圆眼坏笑、赤膊红肚兜、长命锁
FACE_ART.redboy = function(h,o,info){
  var s = h.g.seed, c = h.g.fur, gold = info.pigments[1], skin = info.pigments[2], hair = '#35261f';
  folkBustCore(h, o, skin, skin, skin, 'none');
  folkShape([[-.42,.94],[0,.88],[.42,.94],[.58,1.20],[.34,1.46],[-.34,1.46],[-.58,1.20]], c, s+1);
  atlasLine([[-.40,.98],[0,.93],[.40,.98]], s+2, 1.6, .9, gold);
  for (var sg = -1; sg <= 1; sg += 2) folkOval(sg*.70, -.08, .12, .17, skin, s+4+sg);
  folkPaint(ring(0, -.18, .70, .86, 30), skin, s+6);
  wash([[-.64,-.58],[-.52,-.86],[-.24,-1.00],[0,-1.03],[.24,-1.00],[.52,-.86],[.64,-.58],[.30,-.68],[0,-.71],[-.30,-.68]], '#aab3b2', s+7, .38, .01);
  for (sg = -1; sg <= 1; sg += 2) {                    // 两枚小髻，红绳扎根，髻尖一簇火苗（火尖）
    artFlame(sg*.52, -1.10, .30, sg*.35, '#d5553d', '#eeb24e', s+40+sg*2);
    folkOval(sg*.46, -.92, .17, .16, hair, s+8+sg);
    atlasLine([[sg*.33,-.83],[sg*.46,-.79],[sg*.59,-.86]], s+10+sg, 2.4, .95, '#d0493a');
  }
  folkShape([[-.07,-.86],[-.09,-.95],[0,-1.06],[.09,-.95],[.07,-.86],[0,-.83]], hair, s+12);
  atlasLine([[-.37,-.40],[-.25,-.47],[-.12,-.43]], s+13, 2.2, .9, hair);
  atlasLine([[.12,-.41],[.25,-.44],[.37,-.38]], s+14, 2.2, .9, hair);
  for (sg = -1; sg <= 1; sg += 2) { artEyeRound(h, o, sg*.25, -.18, .07, null, s+15+sg*2); artBlush(sg*.44, .12, .14, .085, s+19+sg); }
  atlasLine([[-.04,.04],[0,.08],[.05,.04]], s+22, .9, .8);
  folkShape([[-.16,.30],[0,.33+(o.smile||0)*.01],[.16,.30],[.10,.42],[0,.46],[-.10,.42]], '#8b3b31', s+23);
  atlasLine([[-.30,.84],[-.18,.96],[0,1.00],[.18,.96],[.30,.84]], s+24, 2.4, .95, gold);
  folkShape([[-.12,1.02],[.12,1.02],[.14,1.10],[0,1.17],[-.14,1.10]], gold, s+25);
};

// 白龙 · 西海：分叉龙角、银鬃、云纹眉棱、额前明珠、如意鼻、长须，青灰鳞领
FACE_ART.dragon = function(h,o,info){
  var s = h.g.seed, c = h.g.fur, silver = info.pigments[1], cream = info.pigments[2], p = atlasPulse(o);
  var white = '#eef0ec', mane = '#9fb4c4', horn = '#e6d6a8';
  for (var sg = -1; sg <= 1; sg += 2) {
    tube([[sg*.30,-.86],[sg*.42,-1.16],[sg*.58,-1.40],[sg*.62,-1.60]], .075, .03, horn, s+1+sg, .004);
    tube([[sg*.46,-1.22],[sg*.72,-1.28],[sg*.86,-1.44]], .05, .025, horn, s+3+sg, .004);
    folkShape([[sg*.46,-.84],[sg*.84,-.92],[sg*.74,-.70],[sg*1.02,-.62],[sg*.84,-.42],[sg*1.04,-.22],[sg*.80,-.10],[sg*.92,.12],[sg*.58,.10]], mane, s+5+sg);
  }
  folkBustCore(h, o, c, white, silver, 'cross');
  if (ART_D) for (var i = -1; i <= 1; i++) atlasLine([[i*.36-.12,1.24],[i*.36,1.18],[i*.36+.12,1.24]], s+30+i, .7, .5, mixHex(c,'#2a3440',.3));
  folkShape([[-.60,-.56],[-.54,-.86],[-.28,-1.00],[.28,-1.00],[.54,-.86],[.60,-.56],[.50,-.22],[.54,.06],[.60,.32],[.48,.56],[.24,.68],[-.24,.68],[-.48,.56],[-.60,.32],[-.54,.06],[-.50,-.22]], white, s+8);
  wash([[-.52,.14],[-.28,.04],[0,.08],[.28,.04],[.52,.14],[.56,.34],[.44,.56],[.22,.66],[-.22,.66],[-.44,.56],[-.56,.34]], cream, s+9, .5, .01);
  for (sg = -1; sg <= 1; sg += 2) folkShape([[sg*.08,-.36],[sg*.24,-.52],[sg*.46,-.52],[sg*.58,-.42],[sg*.46,-.36],[sg*.26,-.40]], mane, s+10+sg);
  if (ART_D) for (i = -1; i <= 1; i++) atlasLine([[i*.16-.07,-.80],[i*.16,-.76],[i*.16+.07,-.80]], s+33+i, .6, .45, '#8397a8');
  folkOval(0, -.64, .065, .065, '#e4eef0', s+14); fill(ring(-.02,-.665,.018,.018,6), {color:PAPER, jit:0});
  for (sg = -1; sg <= 1; sg += 2) artEyeRound(h, o, sg*.28, -.24, .078, '#6f93ad', s+15+sg*3);
  for (sg = -1; sg <= 1; sg += 2) atlasSpiral(sg*.16, .20, .075, 1.15, s+21+sg, INK, .9, sg > 0 ? Math.PI : 0);
  atlasLine([[-.40,.42],[-.36,.46],[-.18,.50],[0,.49],[.18,.50],[.36,.46],[.40,.42]], s+23, 1, .9);
  for (sg = -1; sg <= 1; sg += 2) atlasLine([[sg*.46,.30],[sg*.80,.26+p*.03],[sg*1.08,.40],[sg*1.22,.66]], s+25+sg, 1, .75);
  folkShape([[-.14,.62],[0,.86],[.14,.62]], mane, s+27);
};

// 雪女 · 霜衣：齐刘海长直发垂到肩前、半垂的眼、淡紫唇、呵出的霜气与飘雪、白和服蓝衬领
FACE_ART.snow = function(h,o,info){
  var s = h.g.seed, c = h.g.fur, blue = info.pigments[1], skin = info.pigments[2], p = atlasPulse(o), hair = '#2b3035';
  folkShape([[-.72,-.56],[-.66,-.92],[-.34,-1.08],[0,-1.10],[.34,-1.08],[.66,-.92],[.72,-.56],[.78,.30],[.84,1.10],[.56,1.20],[-.56,1.20],[-.84,1.10],[-.78,.30]], hair, s+1);
  folkBustCore(h, o, c, skin, blue, 'kimono');
  folkShape([[-.56,-.50],[-.50,-.86],[-.24,-1.00],[.24,-1.00],[.50,-.86],[.56,-.50],[.55,.04],[.42,.40],[.18,.64],[0,.68],[-.18,.64],[-.42,.40],[-.55,.04]], skin, s+3);
  for (var sg = -1; sg <= 1; sg += 2) folkShape([[sg*.48,-.46],[sg*.68,-.50],[sg*.72,.30],[sg*.70,.90],[sg*.62,1.28],[sg*.52,.92],[sg*.50,.30]], hair, s+4+sg);
  folkShape([[-.64,-.40],[-.68,-.82],[-.38,-1.04],[0,-1.08],[.38,-1.04],[.68,-.82],[.64,-.40],[.44,-.47],[.20,-.49],[0,-.48],[-.20,-.49],[-.44,-.47]], hair, s+7);
  if (ART_D) [-.32,0,.32].forEach(function(x,i){ atlasLine([[x*.9,-.92],[x,-.70],[x,-.52]], s+40+i, .55, .35, '#5e666e'); });
  for (sg = -1; sg <= 1; sg += 2) {
    artEyeAlmond(h, o, sg*.24, -.16, .105, -.012, s+8+sg*3, {lash:true, drop:.014, lw:1.5});
    atlasLine([[sg*.18,-.34],[sg*.30,-.35]], s+14+sg, .8, .45, '#5b6570');
  }
  folkProfileNose(h, 0, .04);
  folkShape([[-.08,.42],[0,.41],[.08,.42],[.04,.46],[-.04,.46]], '#8e9dbb', s+16);
  atlasLine([[.14,.44],[.34,.38+p*.02],[.52,.42],[.66,.34]], s+17, .9, .5, blue);
  if (ART_D) atlasLine([[.18,.50],[.40,.50+p*.02],[.58,.56]], s+18, .7, .4, blue);
  [[-1.02,-.56,.08],[1.00,-.94,.07],[.88,.12,.06],[-.94,.22,.05]].forEach(function(v,i){ if (i < 2 || ART_D) artSnow(v[0], v[1] + p*.04*(i%2 ? 1 : -1), v[2], s+30+i*3, blue, .75); });
};

// 座敷 · 红兜：齐刘海娃娃头、圆脸点睛、红脸蛋、侧边红蝴蝶结、红围兜（涎挂）
FACE_ART.zashiki = function(h,o,info){
  var s = h.g.seed, c = h.g.fur, red = info.pigments[1], skin = info.pigments[2], hair = '#2a2521';
  folkShape([[-.80,-.34],[-.78,-.84],[-.44,-1.08],[0,-1.12],[.44,-1.08],[.78,-.84],[.80,-.34],[.80,.30],[.60,.40],[-.60,.40],[-.80,.30]], hair, s+1);
  folkBustCore(h, o, c, skin, '#efe3cf', 'kimono');
  folkShape([[-.46,.92],[0,.98],[.46,.92],[.52,1.12],[.36,1.34],[0,1.42],[-.36,1.34],[-.52,1.12]], red, s+3);
  atlasLine([[-.44,.95],[0,1.01],[.44,.95]], s+4, 1.4, .8, '#f2e6d2');
  folkPaint(ring(0, -.16, .66, .82, 30), skin, s+5);
  for (var sg = -1; sg <= 1; sg += 2) folkShape([[sg*.56,-.36],[sg*.80,-.34],[sg*.80,.30],[sg*.62,.38],[sg*.56,.10]], hair, s+6+sg);
  folkShape([[-.70,-.30],[-.72,-.80],[-.40,-1.06],[0,-1.10],[.40,-1.06],[.72,-.80],[.70,-.30],[.54,-.36],[.40,-.41],[.28,-.37],[.14,-.41],[0,-.38],[-.14,-.41],[-.28,-.37],[-.40,-.41],[-.54,-.36]], hair, s+9);
  if (ART_D) [-.40,-.14,.14,.40].forEach(function(x,i){ atlasLine([[x*.9,-.86],[x,-.62],[x*1.02,-.46]], s+24+i, .55, .4, '#6a625a'); });
  artBow(.62, -.80, .17, red, s+10);
  for (sg = -1; sg <= 1; sg += 2) { artEyeRound(h, o, sg*.22, -.12, .052, null, s+13+sg*2); artBlush(sg*.40, .10, .13, .08, s+17+sg, '#e88a78'); }
  atlasLine([[-.03,.08],[0,.11],[.03,.08]], s+20, .8, .7);
  atlasLine([[-.08,.35],[0,.38+(o.smile||0)*.015],[.08,.35]], s+21, .9, .85);
};

// 提灯 · 夜路：光头小僧、竿头一盏纸灯在肩后发光、瞳孔偏向灯火、八字眉、红脸蛋、赭黄短褂
FACE_ART.lantern = function(h,o,info){
  var s = h.g.seed, c = h.g.fur, paper = info.pigments[1], skin = info.pigments[2], p = atlasPulse(o), cap = '#4f3e31';
  atlasLine([[.62,1.40],[.84,.30],[.96,-.60],[1.04,-1.32]], s+1, 2.4, .95, '#6b5138');
  var lx = 1.04 + p*.03, ly = -.70;
  if (COLOR) wash(ring(lx, ly, .60, .60, 20), '#f3d98a', s+2, .28 + p*.05, .02);
  atlasLine([[1.04,-1.32],[lx,-1.15]], s+3, .8, .8);
  folkShape([[lx-.16,-1.16],[lx+.16,-1.16],[lx+.14,-1.06],[lx-.14,-1.06]], cap, s+4);
  folkPaint(ring(lx, ly, .27, .38, 22), paper, s+5);
  if (ART_D) for (var i = 1; i <= 4; i++) { var yy = ly - .38 + i*.152, hw = .27*Math.sqrt(Math.max(0, 1 - Math.pow((yy-ly)/.38, 2))); atlasLine([[lx-hw,yy],[lx,yy+.025],[lx+hw,yy]], s+6+i, .55, .45); }
  folkShape([[lx-.14,ly+.34],[lx+.14,ly+.34],[lx+.16,ly+.44],[lx-.16,ly+.44]], cap, s+11);
  folkOval(lx, ly, .085, .085, '#c2543f', s+12);
  folkBustCore(h, o, c, skin, cap, 'cross');
  for (var sg = -1; sg <= 1; sg += 2) folkOval(sg*.68, -.06, .13, .19, skin, s+13+sg);
  folkPaint(ring(0, -.16, .66, .84, 30), skin, s+15);
  wash([[-.60,-.56],[-.50,-.84],[-.24,-.98],[0,-1.00],[.24,-.98],[.50,-.84],[.60,-.56],[.30,-.66],[0,-.69],[-.30,-.66]], '#a9b4b6', s+16, .35, .01);
  for (sg = -1; sg <= 1; sg += 2) {
    atlasLine([[sg*.10,-.45],[sg*.24,-.42],[sg*.38,-.35]], s+17+sg, 1.6, .9, '#4a3a30');
    artEyeWhite(h, o, sg*.24, -.18, .10, .09, s+20+sg*3, .38);
    artBlush(sg*.42, .10, .14, .085, s+26+sg, '#df6f5c');
  }
  atlasLine([[-.03,.06],[0,.09],[.03,.06]], s+29, .8, .7);
  atlasLine([[-.11,.40],[-.055,.37],[0,.40],[.055,.37],[.11,.40]], s+30, .95, .85);
};

// 猫又 · 双尾：三花猫脸、豆绞手巾包头、琥珀竖瞳、ω 嘴与胡须，两条尾巴在肩后摆动
FACE_ART.neko = function(h,o,info){
  var s = h.g.seed, c = h.g.fur, orange = info.pigments[1], fur = info.pigments[2], p = atlasPulse(o), dark = '#46403a', towel = '#f4efe4', dot = '#3f5a78';
  for (var sg = -1; sg <= 1; sg += 2) {
    var sw = p*.10*sg;
    tube([[sg*.66,1.24],[sg*1.06,.84],[sg*1.28,.28],[sg*1.22+sw,-.24],[sg*1.02+sw,-.50]], .10, .065, fur, s+1+sg, .004);
    tube([[sg*1.25+sw*.8,-.10],[sg*1.22+sw,-.24],[sg*1.02+sw,-.50]], .082, .066, sg < 0 ? orange : dark, s+3+sg, .004);
  }
  folkBustCore(h, o, c, fur, '#efe6d4', 'kimono');
  for (sg = -1; sg <= 1; sg += 2) {
    folkShape([[sg*.26,-.78],[sg*.56,-1.30],[sg*.78,-.60]], sg < 0 ? orange : fur, s+5+sg);
    folkShape([[sg*.38,-.80],[sg*.56,-1.12],[sg*.66,-.70]], '#e2a699', s+7+sg);
  }
  folkShape([[-.68,-.40],[-.60,-.76],[-.30,-.94],[0,-.98],[.30,-.94],[.60,-.76],[.68,-.40],[.72,-.04],[.84,.16],[.66,.26],[.72,.40],[.44,.58],[0,.66],[-.44,.58],[-.72,.40],[-.66,.26],[-.84,.16],[-.72,-.04]], fur, s+10);
  wash([[-.66,-.38],[-.59,-.74],[-.30,-.92],[-.12,-.94],[-.16,-.62],[-.30,-.44],[-.44,-.30],[-.62,-.18]], orange, s+11, .85, .01);
  wash([[.40,-.62],[.60,-.72],[.68,-.40],[.70,-.10],[.52,-.20],[.40,-.40]], dark, s+12, .8, .01);
  folkShape([[-.62,-.60],[-.54,-.86],[-.26,-1.02],[0,-1.06],[.26,-1.02],[.54,-.86],[.62,-.60],[.30,-.68],[0,-.70],[-.30,-.68]], towel, s+13);
  [[-.42,-.76],[-.20,-.86],[0,-.80],[.20,-.86],[.42,-.76],[0,-.97]].forEach(function(v,i){ fill(ring(v[0], v[1], .028, .024, 8), {color:dot, jit:0, seed:s+14+i}); });
  folkShape([[.54,-.70],[.80,-.86],[.86,-.72],[.62,-.62]], towel, s+20);
  folkShape([[.56,-.64],[.84,-.56],[.78,-.44],[.58,-.56]], towel, s+21);
  for (sg = -1; sg <= 1; sg += 2) artEyeSlit(h, o, sg*.27, -.22, .105, .085, '#d9a441', s+22+sg*3, .18);
  folkShape([[-.07,.02],[.07,.02],[0,.10]], '#d98f86', s+28);
  atlasLine([[0,.10],[0,.16]], s+29, .8, .85);
  atlasLine([[-.13,.20],[-.065,.23],[0,.16],[.065,.23],[.13,.20]], s+30, .9, .85);
  for (sg = -1; sg <= 1; sg += 2) for (var w = 0; w < 3; w++) atlasLine([[sg*.26,.10+w*.05],[sg*.82,.02+w*.11]], s+32+w+sg*4, .6, .55);
};

// 白泽 · 万知（异兽）：坐姿前爪、云纹鬃、卷羊角、额上天眼、长寿眉、温厚双目、长须、火焰尾
FACE_ART.baize = function(h,o,info){
  var s = h.g.seed, c = h.g.fur, mane = info.pigments[1], gold = info.pigments[2], p = atlasPulse(o), deep = mixHex(mane,'#2e3a30',.35);
  folkFooting(h, 'cloud');
  folkShape([[.50,.84],[.92,.60],[1.18,.20],[1.08,-.02],[1.28,-.24+p*.04],[.98,-.20],[.86,.12],[.62,.44]], mane, s+1);
  if (ART_D) atlasSpiral(1.00, .12, .09, 1.2, s+2, deep, .8, 0);
  folkShape([[-.62,1.30],[-.66,.84],[-.48,.40],[0,.28],[.48,.40],[.66,.84],[.62,1.30]], c, s+3);
  for (var sg = -1; sg <= 1; sg += 2) {
    folkShape([[sg*.10,.74],[sg*.44,.74],[sg*.46,1.24],[sg*.52,1.36],[sg*.08,1.36],[sg*.12,1.24]], c, s+4+sg);
    if (ART_D) { atlasLine([[sg*.22,1.28],[sg*.22,1.36]], s+6+sg, .6, .6); atlasLine([[sg*.36,1.28],[sg*.36,1.36]], s+8+sg, .6, .6); }
  }
  var M = []; for (var i = 0; i < 28; i++) { var a = i/28*TAU, r = i%2 ? .84 : .96; M.push([Math.cos(a)*r*.98, -.36 + Math.sin(a)*r*.92]); }
  folkPaint(M, mane, s+10);
  if (ART_D) [[-.78,-.08],[.80,-.20],[-.60,-.86],[.62,-.88]].forEach(function(v,i){ atlasSpiral(v[0], v[1], .08, 1.2, s+11+i, deep, .75, i); });
  for (sg = -1; sg <= 1; sg += 2) {
    folkShape([[sg*.18,-.86],[sg*.30,-1.14],[sg*.52,-1.36],[sg*.80,-1.40],[sg*.64,-1.26],[sg*.44,-1.06],[sg*.36,-.84]], '#e3d4a5', s+16+sg);
    if (ART_D) atlasLine([[sg*.36,-1.14],[sg*.44,-1.08]], s+18+sg, .6, .5);
    folkShape([[sg*.44,-.66],[sg*.80,-.64],[sg*.70,-.46],[sg*.46,-.46]], c, s+20+sg);
  }
  folkShape([[-.54,-.50],[-.48,-.80],[-.22,-.94],[.22,-.94],[.48,-.80],[.54,-.50],[.52,-.16],[.40,.08],[.20,.20],[-.20,.20],[-.40,.08],[-.52,-.16]], c, s+22);
  artEyeVertical(h, o, 0, -.68, .042, .075, gold, s+23);
  for (sg = -1; sg <= 1; sg += 2) {
    folkShape([[sg*.08,-.50],[sg*.30,-.56],[sg*.56,-.50],[sg*.78,-.36],[sg*.86,-.18],[sg*.66,-.30],[sg*.46,-.42],[sg*.26,-.46]], mane, s+26+sg);
    artEyeRound(h, o, sg*.22, -.34, .058, '#8a6a3c', s+28+sg*3);
    atlasLine([[sg*.22-.07,-.26],[sg*.22,-.235],[sg*.22+.07,-.26]], s+34+sg, .6, .6);
  }
  folkShape([[-.10,-.16],[0,-.13],[.10,-.16],[.07,-.07],[0,-.03],[-.07,-.07]], '#b98270', s+37);
  atlasLine([[0,-.03],[0,.04]], s+38, .7, .8);
  atlasLine([[-.14,.06],[-.07,.09],[0,.04],[.07,.09],[.14,.06]], s+39, .8, .85);
  folkShape([[-.16,.12],[.16,.12],[.20,.36],[.12,.62],[.02,.82],[-.04,.60],[-.18,.36]], mane, s+40);
};

// 烛龙 · 烛阴（异兽）：人面蛇身而赤、直目、发作烛焰（闭眼时焰光转暗）、短角长须、盘身承托
FACE_ART.zhulong = function(h,o,info){
  var s = h.g.seed, c = h.g.fur, gold = info.pigments[1], skin = info.pigments[2], p = atlasPulse(o), dim = 1 - artBlink(o)*.55, hair = '#7a2e27';
  folkFooting(h, 'cloud');
  var A = [[0,.30],[.32,.50],[.66,.74],[.76,1.04],[.54,1.28],[.10,1.36],[-.36,1.32],[-.70,1.14],[-.78,.86],[-.58,.66]];
  var B = [[-.58,.66],[-.28,.60],[.04,.72],[.18,.94],[.04,1.10],[-.20,1.10],[-.30,.96]];
  tube(A, .20, .18, c, s+1, .004);
  if (ART_D) atlasLine(A.slice(2, 9), s+2, 2.2, .45, gold);
  if (ART_D) for (var i = 1; i < A.length - 1; i += 2) atlasLine([[A[i][0]-.07,A[i][1]-.05],[A[i][0],A[i][1]+.02],[A[i][0]+.07,A[i][1]-.05]], s+3+i, .6, .5);
  tube(B, .18, .05, c, s+12, .004);
  folkShape([[-.60,-.14],[-.70,-.60],[-.56,-.94],[-.50,-1.18],[-.34,-1.10],[-.26,-1.38],[-.08,-1.28],[0,-1.60],[.08,-1.28],[.26,-1.40],[.34,-1.10],[.50,-1.20],[.56,-.94],[.70,-.60],[.60,-.14]], '#9b3a2c', s+13);
  folkPaint([[-.36,-.94],[-.30,-1.16],[-.16,-1.10],[-.10,-1.34],[0,-1.26],[.02,-1.50],[.12,-1.30],[.20,-1.36],[.26,-1.12],[.36,-.94]], '#d9713f', s+29, .96*dim, .7);
  folkPaint([[-.18,-.98],[-.12,-1.18],[-.03,-1.12],[0,-1.36],[.06,-1.12],[.14,-1.20],[.20,-.98]], gold, s+14, .96*dim, .6);
  for (var sg = -1; sg <= 1; sg += 2) tube([[sg*.36,-.90],[sg*.52,-1.10],[sg*.68,-1.16]], .05, .02, gold, s+15+sg, .003);
  folkShape([[-.54,-.46],[-.48,-.80],[-.24,-.94],[.24,-.94],[.48,-.80],[.54,-.46],[.52,-.08],[.40,.18],[.18,.32],[0,.34],[-.18,.32],[-.40,.18],[-.52,-.08]], skin, s+17);
  folkShape([[-.54,-.40],[-.52,-.78],[-.26,-.96],[0,-.99],[.26,-.96],[.52,-.78],[.54,-.40],[.36,-.64],[0,-.72],[-.36,-.64]], hair, s+18);
  for (sg = -1; sg <= 1; sg += 2) artEyeVertical(h, o, sg*.22, -.30, .052, .11, gold, s+19+sg*3);
  folkProfileNose(h, 0, -.08);
  for (sg = -1; sg <= 1; sg += 2) atlasLine([[sg*.04,.07],[sg*.20,.10],[sg*.30,.28],[sg*.30+p*.02,.52],[sg*.22,.68]], s+25+sg, 1.1, .85, hair);
  atlasLine([[-.10,.18],[0,.19+(o.smile||0)*.012],[.10,.18]], s+28, .85, .85);
};

// 凤凰 · 涅槃（异兽）：三羽华冠、赤首凤眼、金喙、青翼金胸、三支带翎眼的长尾、余烬飘升
FACE_ART.fenghuang = function(h,o,info){
  var s = h.g.seed, c = h.g.fur, gold = info.pigments[1], cream = info.pigments[2], p = atlasPulse(o), teal = '#5d8c84', indigo = '#46586c';
  folkFooting(h, 'cloud');
  // 三支长尾：由细到宽的翎羽，末端一枚翎眼
  [[[.08,1.06],[.60,1.24],[1.04,1.02],[1.26,.52],[1.24,-.02]],[[.10,1.14],[.66,1.38],[1.12,1.28],[1.38,.92]],[[-.08,1.08],[-.62,1.26],[-1.02,1.04],[-1.22,.60]]].forEach(function(T,i){
    var n = T.length; T[n-1] = [T[n-1][0] + p*.05*(i === 2 ? -1 : 1), T[n-1][1]];
    var E = tubeEdges(T, .035, .125); folkPaint(E.L.concat(E.R.slice().reverse()), gold, s+1+i*4);
    if (ART_D) atlasLine(T, s+2+i*4, .6, .5, mixHex(gold,'#6a4a20',.45));
    folkOval(T[n-1][0], T[n-1][1], .115, .14, teal, s+3+i*4); fill(ring(T[n-1][0], T[n-1][1]+.02, .055, .07, 12), {color:indigo, jit:0});
  });
  for (var sg = -1; sg <= 1; sg += 2) {
    folkShape([[sg*.34,.30],[sg*.74,.42],[sg*.96,.80],[sg*.88,1.20],[sg*.62,1.12],[sg*.40,.82]], teal, s+14+sg);
    if (ART_D) atlasLine([[sg*.50,.66],[sg*.80,.96]], s+16+sg, .6, .5);
  }
  folkPaint(ring(0, .74, .46, .56, 24), gold, s+20);
  if (ART_D) [[-.16,.60],[.16,.60],[0,.82]].forEach(function(v,i){ atlasLine([[v[0]-.08,v[1]-.03],[v[0],v[1]+.04],[v[0]+.08,v[1]-.03]], s+21+i, .7, .6, c); });
  folkShape([[-.20,.40],[-.16,-.06],[.16,-.06],[.20,.40]], c, s+27);
  // 三羽华冠：羽片而非细线，各带一点翎眼
  for (var i = -1; i <= 1; i++) {
    ctx.save(); ctx.translate(0, -.88); ctx.rotate(i*.42 + p*.03);
    folkShape([[0,.04],[-.06,-.20],[-.11,-.42],[0,-.62],[.11,-.42],[.06,-.20]], i ? c : gold, s+28+i);
    fill(ring(0, -.44, .045, .06, 10), {color:teal, jit:0});
    ctx.restore();
  }
  folkPaint(ring(0, -.40, .54, .54, 26), c, s+37);
  for (sg = -1; sg <= 1; sg += 2) {
    folkOval(sg*.23, -.46, .135, .115, cream, s+38+sg);
    artEyeRound(h, o, sg*.23, -.46, .072, '#d9a441', s+40+sg*3);
    atlasLine([[sg*.36,-.50],[sg*.48,-.56]], s+44+sg, .8, .8);
  }
  folkShape([[-.10,-.34],[.10,-.34],[.06,-.19],[0,-.09],[-.05,-.19]], '#e0b24e', s+46);
  atlasLine([[-.05,-.28],[0,-.26],[.05,-.28]], s+47, .6, .6);
  [[-1.00,-.50],[.96,-.92],[-.74,-1.14]].forEach(function(v,i){ var y = v[1] - p*.06; fill([[v[0],y-.07],[v[0]+.035,y+.01],[v[0],y+.04],[v[0]-.035,y+.01]], {color:i%2 ? '#e7b04e' : '#d0603f', alpha:.8, jit:0}); });
};

/* ---------- 西游原四位：r16 共用一张脸，r43 各给招牌 ---------- */
var JOURNEY_ART = {};
// 悟空：紫金冠两根雉翎、金箍、火眼金睛、桃心脸、龇牙笑
JOURNEY_ART.monkey = function(h,o,info){
  var s = h.g.seed, c = h.g.fur, a = info.pigments[1], skin = info.pigments[2], p = atlasPulse(o);
  for (var sg = -1; sg <= 1; sg += 2) {
    var P = [[sg*.14,-.98],[sg*.30,-1.34],[sg*.66,-1.56+p*.02],[sg*1.06,-1.54+p*.03],[sg*1.34,-1.36+p*.03]];
    tube(P, .045, .02, '#caa25a', s+1+sg, .003);
    if (ART_D) for (var k = 1; k < 4; k++) atlasLine([[P[k][0],P[k][1]-.05],[P[k][0]+sg*.02,P[k][1]+.05]], s+3+k+sg*4, .7, .7, '#6a4a2a');
  }
  folkBustBase(h, o, c, skin);
  for (sg = -1; sg <= 1; sg += 2) { folkOval(sg*.72, -.10, .18, .23, a, s+12+sg); folkOval(sg*.72, -.08, .09, .12, skin, s+14+sg); }
  folkOval(0, -.10, .65, .86, a, s+16);
  folkPaint([[-.58,-.45],[-.38,-.62],[0,-.43],[.39,-.63],[.58,-.44],[.47,.18],[.20,.57],[-.20,.57],[-.47,.18]], skin, s+17);
  for (sg = -1; sg <= 1; sg += 2) if (COLOR) wash(ring(sg*.24, -.14, .13, .10, 12), '#d06a4f', s+18+sg, .45, .01);
  atlasLine([[-.68,-.64],[-.34,-.71],[0,-.66],[.34,-.71],[.68,-.64]], s+20, 2.2, .95, '#b88839');
  folkShape([[-.22,-.74],[-.18,-.96],[-.07,-.86],[0,-1.02],[.07,-.86],[.18,-.96],[.22,-.74]], '#d4a94c', s+21);
  folkOval(0, -.82, .05, .045, '#b8453a', s+22);
  for (sg = -1; sg <= 1; sg += 2) { artEyeRound(h, o, sg*.24, -.14, .062, '#e2b34a', s+23+sg*3); atlasLine([[sg*.10,-.30],[sg*.24,-.34],[sg*.38,-.28]], s+29+sg, 1.4, .85, '#7a5a30'); }
  fill(ring(-.05, .10, .018, .014, 6), {color:INK, jit:0}); fill(ring(.05, .10, .018, .014, 6), {color:INK, jit:0});
  folkShape([[-.20,.28],[0,.32],[.20,.28],[.12,.42],[0,.45],[-.12,.42]], '#8b3b31', s+31);
  folkShape([[-.16,.30],[0,.33],[.16,.30],[.14,.34],[0,.365],[-.14,.34]], '#f3ead8', s+32);
};
// 八戒：扇耳、猪吻、眯眼乐呵、红脸蛋
JOURNEY_ART.pig = function(h,o,info){
  var s = h.g.seed, c = h.g.fur, a = info.pigments[1], skin = info.pigments[2];
  folkBustBase(h, o, c, skin);
  for (var sg = -1; sg <= 1; sg += 2) folkShape([[sg*.58,-.5],[sg*1.02,-.71],[sg*.97,-.19],[sg*.63,.07]], skin, s+sg+1);
  folkOval(0, -.1, .80, .86, skin, s+6);
  folkShape([[-.74,-.55],[-.59,-.86],[0,-1.03],[.59,-.85],[.75,-.54]], c, s+8);
  for (sg = -1; sg <= 1; sg += 2) {
    atlasLine([[sg*.30-.09,-.10],[sg*.30,-.17],[sg*.30+.09,-.10]], s+10+sg, 1.4, .9);
    atlasLine([[sg*.18,-.34],[sg*.30,-.39],[sg*.42,-.35]], s+12+sg, .9, .7, '#5a4a44');
    artBlush(sg*.50, .16, .13, .08, s+14+sg, '#e0877a');
  }
  folkOval(0, .22, .30, .19, '#c79084', s+16);
  fill(ring(-.11, .20, .03, .046, 12), {color:INK, jit:0}); fill(ring(.11, .20, .03, .046, 12), {color:INK, jit:0});
  atlasLine([[-.30,.46],[-.14,.54],[0,.56+(o.smile||0)*.015],[.14,.54],[.30,.46]], s+18, 1.1, .9);
};
// 唐僧：毗卢帽五瓣与垂带、低垂的眼、长耳垂、袈裟金格
JOURNEY_ART.monk = function(h,o,info){
  var s = h.g.seed, c = h.g.fur, a = info.pigments[1], skin = info.pigments[2];
  for (var sg = -1; sg <= 1; sg += 2) artStrip([[sg*.52,-.80],[sg*.66,-.36],[sg*.72,.24],[sg*.80,.84]], .035, .03, a, s+1+sg, .96, .6);
  folkBustBase(h, o, c, skin);
  if (ART_D) [-.56,-.28,.28,.56].forEach(function(x,i){ atlasLine([[x,.90+Math.abs(x)*.16],[x*1.1,1.46]], s+4+i, .9, .8, a); });
  if (ART_D) { atlasLine([[-1.06,1.22],[-.30,1.18]], s+8, .9, .8, a); atlasLine([[.30,1.18],[1.06,1.22]], s+9, .9, .8, a); }
  if (ART_D) stroke(ring(-.64, 1.02, .07, .07, 12), {close:true, w:1.6, jit:.002, seed:s+10, color:a});
  for (sg = -1; sg <= 1; sg += 2) folkOval(sg*.64, .02, .10, .22, skin, s+11+sg);
  folkOval(0, -.10, .64, .86, skin, s+13);
  folkShape([[-.60,-.58],[-.56,-.80],[0,-.88],[.56,-.80],[.60,-.58],[0,-.66]], a, s+14);
  [[-2,.20],[-1,.26],[0,.32],[1,.26],[2,.20]].forEach(function(v,i){
    var x = v[0]*.23, top = -.80 - v[1] - Math.abs(v[0])*.02;
    folkShape([[x-.11,-.74+Math.abs(v[0])*.02],[x-.12,top+.14],[x-.05,top],[x+.05,top],[x+.12,top+.14],[x+.11,-.74+Math.abs(v[0])*.02]], a, s+15+i);
    folkOval(x, top+.12, .035, .035, '#b8453a', s+20+i);
  });
  for (sg = -1; sg <= 1; sg += 2) { atlasLine([[sg*.10,-.34],[sg*.25,-.38],[sg*.40,-.34]], s+26+sg, .9, .75, '#4a3a30'); artEyeAlmond(h, o, sg*.24, -.14, .10, -.01, s+28+sg*3, {drop:.022, lw:1.6, lower:false}); }
  folkProfileNose(h, 0, .03);
  atlasLine([[-.08,.42],[0,.44+(o.smile||0)*.01],[.08,.42]], s+34, .9, .85);
};
// 沙僧：光顶环一圈红卷发、圆睁眼、红虬髯、九颗大念珠
JOURNEY_ART.sandy = function(h,o,info){
  var s = h.g.seed, c = h.g.fur, a = info.pigments[1], skin = info.pigments[2], red = '#8a4a32';
  folkBustBase(h, o, c, skin);
  folkOval(0, -.10, .72, .86, skin, s+6);
  if (COLOR) wash([[-.56,-.62],[-.40,-.88],[0,-.96],[.40,-.88],[.56,-.62],[0,-.70]], '#d9a88a', s+7, .35, .01);
  for (var sg = -1; sg <= 1; sg += 2) {
    folkShape([[sg*.48,-.74],[sg*.72,-.56],[sg*.80,-.14],[sg*.64,.02],[sg*.58,-.40]], red, s+8+sg);
    if (ART_D) [[.64,-.52],[.72,-.30],[.66,-.10]].forEach(function(v,i){ mythCurlSmall(sg*v[0], v[1], .05, s+10+i+sg*3, '#b0705a'); });
    folkShape([[sg*.10,-.30],[sg*.30,-.40],[sg*.48,-.36],[sg*.46,-.28],[sg*.28,-.30],[sg*.12,-.24]], red, s+18+sg);
    artEyeWhite(h, o, sg*.26, -.14, .085, .07, s+20+sg*3, 0);
  }
  folkShape([[-.12,.02],[0,-.06],[.12,.02],[.10,.12],[-.10,.12]], mixHex(skin, '#6a3a2a', .2), s+26);
  folkShape([[-.65,.21],[-.41,.35],[-.17,.43],[.18,.43],[.45,.32],[.65,.20],[.47,.67],[0,.91],[-.48,.67]], red, s+27);
  if (ART_D) [[-.30,.56],[0,.70],[.30,.56]].forEach(function(v,i){ mythCurlSmall(v[0], v[1], .05, s+28+i, '#b0705a'); });
  atlasLine([[-.12,.30],[0,.32],[.12,.30]], s+31, 1, .85);
  for (var i = 0; i < 9; i++) { var t = i/8, x = -.66 + t*1.32, y = .98 + Math.sin(t*Math.PI)*.30; folkOval(x, y, .075, .07, '#ddd0a8', s+32+i); if (ART_D) { fill(ring(x-.02, y-.01, .014, .014, 6), {color:'#6a5a44', jit:0}); fill(ring(x+.02, y-.01, .014, .014, 6), {color:'#6a5a44', jit:0}); } }
};
function mythCurlSmall(x,y,r,s,col){ stroke(ring(x, y, r, r*.9, 10), {close:true, w:.8, jit:.004, seed:s, color:col}); }
['west_monkey','west_pig','west_monk','west_sandy'].forEach(function(k){ var info = FOLK_INFO[k], art = JOURNEY_ART[info.kind]; if (art) ATLAS_DRAW[k] = function(h,o){ ART_D = artDetail(); art(h, o, info); }; });
FOLK_INFO.west_monkey.traits = ['紫金冠雉翎','火眼金睛','桃心脸'];
FOLK_INFO.west_pig.traits = ['扇形大耳','眯眼乐呵','圆鼻'];
FOLK_INFO.west_monk.traits = ['毗卢帽','低眉长耳','袈裟金格'];
FOLK_INFO.west_sandy.traits = ['九颗大念珠','红卷发环顶','红虬髯'];

/* ---------- 新增角色登记 ---------- */
function folkAdd(key,name,en,series,kind,col,traits,quirk,support){
  folkRegister(key,name,en,series,kind,col,traits,quirk,{});
  var info = FOLK_INFO[key], art = FACE_ART[kind];
  info.support = support || 'bust';
  FOLK_COLOURS[key] = col;
  info.pigments = col; info.col = [col[0]]; FURS[key] = info.col; SP_RARITY[key] = 3;
  ATLAS_DRAW[key] = function(h,o){ ART_D = artDetail(); art(h,o,info); };
}
/* 西游行旅 +4 */
folkAdd('west_bull','牛魔 · 焰山','Ox King · Flame Mountain','journey','bull',['#7d4a40','#c9a05a','#c98b68'],
  ['牛角与鼻环','赭红虬髯','金边肩甲'],'发威前先数三下，怕吓着路过的小妖。');
folkAdd('west_fan','铁扇 · 芭蕉','Iron Fan · Banana Leaf','journey','fan',['#b25a4f','#cfa257','#ecd0ab'],
  ['芭蕉扇','高髻金簪','石青披帛'],'扇子一摇，能把火气扇成凉风。');
folkAdd('west_red','红孩 · 火尖','Red Boy · Fire Tip','journey','redboy',['#c2543f','#d8a24a','#f0cd9f'],
  ['火尖双髻','红肚兜','长命锁'],'火气来得快，去得也快，转眼就去追蝴蝶。');
folkAdd('west_dragon','白龙 · 西海','White Dragon · West Sea','journey','dragon',['#7f93a8','#dfe3e2','#e8d6b8'],
  ['龙角与银鬃','额前明珠','青灰鳞领'],'话不多，跑起来像一阵白风。');
/* 百鬼小町 +4 */
folkAdd('yokai_snow','雪女 · 霜衣','Snow Woman · Frost Robe','yokai','snow',['#e2e8eb','#7f9db2','#eef2f3'],
  ['长直黑发','霜白和服','呵气成雪'],'她走过的地方，夏天会短一小截。');
folkAdd('yokai_zashiki','座敷 · 红兜','Zashiki Child · Red Bib','yokai','zashiki',['#b98a62','#c24f45','#f1dcc0'],
  ['齐刘海娃娃头','红围兜','永远长不大'],'谁家孩子多一双筷子，谁家就多一分福气。');
folkAdd('yokai_lantern','提灯 · 夜路','Lantern Boy · Night Road','yokai','lantern',['#b8894a','#efdcae','#f0d6b2'],
  ['光头小僧','竿头纸灯','赭黄短褂'],'夜里替人探路，自己却怕黑。');
folkAdd('yokai_neko','猫又 · 双尾','Nekomata · Twin Tails','yokai','neko',['#566779','#d4975a','#f1e9d8'],
  ['三花猫脸','豆绞头巾','肩后双尾'],'走三步，回头看两次——不是怕，是谨慎。');
/* 山海异兽 +3：与九尾、毕方、帝江同为异兽画法，云台承托 */
folkAdd('hill_baize','白泽 · 万知','Baize · All-Knowing','shanhai','baize',['#e7dfc7','#7f9a82','#c9a55e'],
  ['额上天眼','卷羊角与长眉','云纹鬃毛'],'知道所有名字，却从不轻易开口。','beast');
folkAdd('hill_zhulong','烛龙 · 烛阴','Torch Dragon · Candle Yin','shanhai','zhulong',['#b24f3e','#e0b35a','#e3a584'],
  ['人面蛇身','直目烛焰','睁眼为昼'],'睁眼天亮，闭眼天黑，打个盹就是一夜。','beast');
folkAdd('hill_feng','凤凰 · 涅槃','Fenghuang · Rebirth','shanhai','fenghuang',['#c0573f','#dca74e','#f1dfb6'],
  ['三羽华冠','翎眼长尾','浴火重生'],'落一次羽，就开一片花。','beast');

/* ---------- 新角色作为借体时的遗传标志 ---------- */
var ART_MOTIFS = {bull:'牛角侧饰',fan:'芭蕉小扇',redboy:'火尖小髻',snow:'雪花坠',zashiki:'红蝴蝶结',lantern:'小纸灯',neko:'三花猫耳',baize:'卷羊角',zhulong:'烛焰',fenghuang:'凤翎'};
Object.keys(ART_MOTIFS).forEach(function(k){ FOLK_MOTIFS[k] = ART_MOTIFS[k]; });
var artMotifBase = folkMotif;
folkMotif = function(h,o,info){
  var k = info.kind;
  if (!ART_MOTIFS[k]) return artMotifBase(h,o,info);
  var s = h.g.seed + 2100, c = info.pigments[0], a = info.pigments[1], v = h.g.motifVariant || 0, sc = [.92,1,1.08][v];
  ctx.save(); ctx.translate(.69, -.61); ctx.scale(sc, sc);
  if (k === 'bull') { folkShape([[-.12,.10],[.14,-.02],[.32,-.22],[.40,-.50],[.26,-.30],[.02,-.14],[-.16,-.04]], '#e8d9b5', s); folkShape([[.30,-.30],[.40,-.50],[.36,-.24]], '#6a5646', s+1); }
  else if (k === 'fan') { ctx.rotate(.5); folkShape([[0,.04],[-.13,-.06],[-.18,-.22],[-.12,-.40],[0,-.46],[.12,-.40],[.18,-.22],[.13,-.06]], '#8ea267', s); atlasLine([[0,.02],[0,-.42]], s+1, .6, .7, '#5d7445'); atlasLine([[0,.02],[0,.24]], s+2, 1.4, .9, '#7b5b3d'); }
  else if (k === 'redboy') { folkShape([[-.12,.10],[-.14,-.06],[-.06,-.20],[-.10,-.34],[.02,-.48],[.05,-.30],[.13,-.20],[.13,.08]], '#35261f', s); folkOval(0, .08, .12, .045, '#d0493a', s+1); }
  else if (k === 'snow') { artSnow(.02, -.14, .17, s, a, .9); artSnow(.24, .10, .08, s+4, a, .7); }
  else if (k === 'zashiki') artBow(0, -.08, .18, a, s);
  else if (k === 'lantern') { atlasLine([[0,-.40],[0,-.28]], s, .7, .8); folkShape([[-.08,-.30],[.08,-.30],[.08,-.25],[-.08,-.25]], '#4f3e31', s+1); folkPaint(ring(0, -.06, .12, .18, 16), a, s+2); folkShape([[-.08,.12],[.08,.12],[.08,.17],[-.08,.17]], '#4f3e31', s+3); folkOval(0, -.06, .04, .04, '#c2543f', s+4); }
  else if (k === 'neko') { folkShape([[-.16,.10],[.02,-.42],[.20,.12]], a, s); folkShape([[-.08,.06],[.02,-.26],[.12,.08]], '#e2a699', s+1); }
  else if (k === 'baize') { folkShape([[-.10,.08],[.02,-.18],[.22,-.38],[.44,-.40],[.30,-.30],[.12,-.12],[.06,.10]], '#e3d4a5', s); }
  else if (k === 'zhulong') artFlame(0, -.12, .62, 0, c, a, s);
  else if (k === 'fenghuang') { atlasLine([[-.06,.12],[.06,-.14],[.14,-.34]], s, .9, .85, c); ctx.save(); ctx.translate(.14, -.36); ctx.rotate(.4); folkShape([[0,.12],[-.08,-.02],[0,-.16],[.08,-.02]], '#5d8c84', s+1); folkOval(0, -.02, .03, .04, a, s+2); ctx.restore(); }
  ctx.restore();
};

/* ---------- 国风葫芦：七兄弟各自可辨（保留葫芦叶冠身份，加鬓饰／冠饰／额饰） ----------
   r43：分前后两层——风带、雾纱、头光画在头像之后；水纹改为额上"抹额"，不再横穿眉眼。 */
function folkGourdMarks(h,o,info,layer){
  var s=h.g.seed, c=h.g.fur, leaf=info.pigments[1];
  var p=(typeof atlasPulse==='function')?atlasPulse(o):0, k=info.kind;
  if(layer==='back'){
    if(k==='wind'){
      artStrip([[.06,-1.10],[.44,-1.22+p*.06],[.80,-1.10+p*.08],[1.12,-1.22+p*.08],[1.32,-1.12+p*.06]],.045,.022,mixHex(leaf,'#f3efe0',.35),s+9,.9,.5);
      artStrip([[.08,-1.04],[.46,-.98+p*.05],[.84,-.86+p*.07],[1.14,-.94+p*.07]],.04,.02,leaf,s+10,.9,.5);
    }else if(k==='mist'){
      var V=[[-.84,.92],[-.94,.18],[-.86,-.58],[-.54,-1.08],[0,-1.24],[.54,-1.08],[.86,-.58],[.94,.18],[.84,.92]];
      wash(V,'#c7cddb',s+9,.55,.02); stroke(V,{w:.7,alpha:.35,color:'#8a93a6',seed:s+10,jit:.006});
      atlasLine([[-.70,-.70],[-.82,.10]],s+11,.6,.25,'#8a93a6'); atlasLine([[.70,-.70],[.82,.10]],s+12,.6,.25,'#8a93a6');
    }else if(k==='light'){
      var R=ring(0,-.42,.90,.90,40); wash(R,'#ecd48a',s+9,.3,.01); stroke(R,{close:true,w:1.1,jit:.002,alpha:.75,color:'#c9a24a',seed:s+10});
    }
    return;
  }
  if(k==='fire'){
    for(var sg=-1;sg<=1;sg+=2){ ctx.save(); ctx.translate(sg*.62,-.34); ctx.rotate(sg*.30); folkShape([[0,.16],[-.13,-.06],[-.06,-.34],[.04,-.16],[.12,-.30],[.13,-.02]],c,s+sg); ctx.restore(); }
    folkShape([[-.13,-1.12],[-.02,-1.42],[.06,-1.20],[.16,-1.46],[.20,-1.10]],c,s+9);
  }else if(k==='stone'){
    folkShape([[-.34,-1.06],[-.22,-1.34],[.10,-1.38],[.26,-1.10],[.06,-1.00],[-.20,-.98]],'#8c8477',s+9);
    for(var b=-1;b<=1;b+=2)atlasLine([[b*.44,-.32],[b*.16,-.36],[b*.02,-.30]],s+b+12,2.4,.9,'#5b5146');
  }else if(k==='leaf'){
    folkLeaf(-.74,-.34,2.5,leaf,s+9); folkLeaf(.76,-.32,-2.6,leaf,s+10);
    atlasLine([[-.60,.10],[-.44,.16]],s+11,1.1,.6,leaf); atlasLine([[.60,.10],[.44,.16]],s+12,1.1,.6,leaf);
  }else if(k==='water'){
    folkShape([[-.68,-.62],[-.34,-.78],[0,-.81],[.34,-.78],[.68,-.62],[.68,-.52],[.34,-.68],[0,-.71],[-.34,-.68],[-.68,-.52]],c,s+9);
    atlasLine([[-.50,-.64],[-.36,-.70],[-.22,-.66],[-.08,-.72],[.06,-.68],[.20,-.73],[.34,-.69],[.50,-.63]],s+10,.7,.8,'#e3efe9');
    folkOval(0,-.75,.05,.055,'#eef4f0',s+11);
  }
}
/* r43：七兄弟同一张脸 → 同一家人、各自的神情。发式、叶冠与葫芦不变，眉眼口按性情区分。 */
var GOURD_FACE = [
  function(h,o,s){ // 大娃：浓眉上挑、自信的笑
    for (var sg = -1; sg <= 1; sg += 2) { atlasLine([[sg*.10,-.29],[sg*.26,-.35],[sg*.42,-.37]], s+60+sg, 2, .9, '#3a3a36'); artEyeAlmond(h, o, sg*.25, -.11, .10, .04, s+62+sg*3); }
    atlasLine([[-.17,.39],[-.08,.44],[0,.45+(o.smile||0)*.015],[.08,.44],[.17,.39]], s+68, 1.1, .9);
  },
  function(h,o,s){ // 二娃：沉稳的重睑、抿紧的嘴（粗眉由岩冠标记画）
    for (var sg = -1; sg <= 1; sg += 2) artEyeAlmond(h, o, sg*.30, -.10, .10, 0, s+62+sg*3, {drop:.016, lw:1.7});
    atlasLine([[-.15,.44],[0,.445],[.15,.44]], s+68, 1.2, .9);
  },
  function(h,o,s){ // 三娃：笑成弯月的眼、嘬嘴吹出一缕风
    for (var sg = -1; sg <= 1; sg += 2) { atlasLine([[sg*.25-.09,-.08],[sg*.25,-.15],[sg*.25+.09,-.08]], s+62+sg, 1.4, .9); atlasLine([[sg*.12,-.30],[sg*.25,-.34],[sg*.38,-.31]], s+60+sg, .9, .7, '#3a3a36'); }
    stroke(ring(0, .44, .045, .05, 12), {close:true, w:1, jit:.002, seed:s+68});
    atlasLine([[.10,.42],[.24,.38],[.36,.42],[.46,.38]], s+69, .8, .55, '#6f8a5c');
  },
  function(h,o,s){ // 四娃：圆眼、雀斑、张嘴大笑
    for (var sg = -1; sg <= 1; sg += 2) {
      artEyeRound(h, o, sg*.25, -.11, .055, null, s+62+sg*3);
      atlasLine([[sg*.13,-.30],[sg*.25,-.35],[sg*.37,-.31]], s+60+sg, .9, .7, '#3a3a36');
      [[.34,.14],[.42,.10],[.40,.20]].forEach(function(v,i){ fill(ring(sg*v[0], v[1], .014, .014, 6), {color:'#b07a5a', jit:0}); });
    }
    folkShape([[-.14,.37],[0,.39],[.14,.37],[.08,.48],[0,.50],[-.08,.48]], '#9a4a3e', s+68);
  },
  function(h,o,s){ // 五娃：水汪汪的大眼、ω 形小嘴
    for (var sg = -1; sg <= 1; sg += 2) {
      artEyeRound(h, o, sg*.25, -.10, .068, '#3f7f86', s+62+sg*3);
      if (artBlink(o) < .65) fill(ring(sg*.25+.03, -.07, .012, .012, 6), {color:PAPER, jit:0});
      atlasLine([[sg*.13,-.29],[sg*.25,-.33],[sg*.37,-.30]], s+60+sg, .9, .7, '#3a3a36');
    }
    atlasLine([[-.09,.42],[-.045,.45],[0,.425],[.045,.45],[.09,.42]], s+68, 1, .9);
  },
  function(h,o,s){ // 六娃：眯眼斜睨、一边翘起的笑
    for (var sg = -1; sg <= 1; sg += 2) { artEyeAlmond(h, o, sg*.25, -.11, .10, .02, s+62+sg*3, {drop:.02, lw:1.8, look:.45}); atlasLine([[sg*.12,-.31],[sg*.26,-.33],[sg*.40,-.30]], s+60+sg, .9, .7, '#3a3a36'); }
    atlasLine([[-.10,.44],[.04,.44],[.14,.39]], s+68, 1.1, .9);
  },
  function(h,o,s){ // 七娃：娃娃脸——眼位偏低、亮晶晶的大眼、红脸蛋
    for (var sg = -1; sg <= 1; sg += 2) {
      artEyeRound(h, o, sg*.23, -.03, .072, '#6a4a7a', s+62+sg*3);
      if (artBlink(o) < .65) fill(ring(sg*.23+.03, .0, .014, .014, 6), {color:PAPER, jit:0});
      artBlush(sg*.40, .20, .12, .07, s+66+sg, '#e8907a');
      atlasLine([[sg*.12,-.22],[sg*.23,-.26],[sg*.34,-.23]], s+60+sg, .8, .6, '#3a3a36');
    }
    atlasLine([[-.07,.40],[0,.43+(o.smile||0)*.01],[.07,.40]], s+68, 1, .9);
  }
];
folkGourdPortrait = function(h,o,info){
  var s=h.g.seed,c=h.g.fur,leaf=info.pigments[1],skin=info.pigments[2],n=info.ordinal||0;
  var w=[.67,.77,.62,.72,.67,.64,.70][n],chin=[.70,.63,.76,.73,.69,.75,.74][n];
  folkBustBase(h,o,c,skin);
  folkPaint([[-w,-.57],[-w*.72,-.91],[0,-1.01],[w*.78,-.87],[w,-.48],[w*.92,.27],[.30,chin],[-.29,chin],[-w*.92,.25]],skin,s+10);
  folkShape([[-w,-.24],[-w-.04,-.70],[-.43,-1.01],[-.03,-1.07],[.45,-.96],[w+.04,-.65],[w,-.23],[.47,-.48],[.32,-.73],[.06,-.58],[-.27,-.76],[-.47,-.49]],'#414742',s+11);
  GOURD_FACE[n](h,o,s);
  folkProfileNose(h,0,n===6?.10:.03);
  folkLeaf(-.10,-.99,-.95,leaf,s+18);folkLeaf(.13,-1.0,.90,leaf,s+20);
  folkOval(0,-1.17,.14,.16,c,s+22);folkOval(.015,-1.37,.095,.105,c,s+23);
  atlasLine([[.02,-1.45],[.075,-1.52],[.16,-1.48]],s+24,.7,.8,leaf);
  if(n===0){folkShape([[-.62,.18],[-.78,-.07],[-.69,-.27],[-.61,-.11],[-.51,-.28],[-.48,.02]],c,s+30);}
  if(n===2){atlasLine([[.58,-.56],[.84,-.66],[.98,-.53]],s+30,1.4,.8,c);}
  if(n===3){folkLeaf(.62,-.31,.8,leaf,s+30);}
  if(n===5){folkShape([[.47,-.64],[.54,-.57],[.65,-.61],[.59,-.47],[.47,-.50]],'#d4d9df',s+30);}
  if(n===6){folkOval(.59,.23,.072,.095,'#c8a45f',s+30);atlasLine([[.59,.11],[.59,.04]],s+31,.65,.8,leaf);}
};
function folkGourdFigure(h,o,info){ folkGourdMarks(h,o,info,'back'); folkGourdPortrait(h,o,info); folkGourdMarks(h,o,info,'front'); }
if(typeof FOLK_SERIES!=='undefined' && FOLK_SERIES.guofeng){
  FOLK_SERIES.guofeng.keys.forEach(function(k){ ATLAS_DRAW[k]=function(h,o){ folkGourdFigure(h,o,FOLK_INFO[k]); }; });
  Object.keys(PORTRAIT_ALIAS||{}).forEach(function(k){ var src=FOLK_INFO[PORTRAIT_ALIAS[k]]; if(src) ATLAS_DRAW[k]=function(h,o){ folkGourdFigure(h,o,src); }; });
}
