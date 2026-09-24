/* 趣像 05 (r19): 形象多样性与经典半身版式
   1) 半身托升级为经典半身比例：抬高肩线、加领口与袖缝，让新角色与经典半身像同版式；
      画布高度有余量（figure ≈3.0 单位 / 单元格 3.85），肩线下移不会压到下一行。
   2) 参数化人物绘制 folkFigurePortrait：以 look 数据描述脸型／发式／冠帽／耳角／髯须／道具，
      新角色只需登记数据，不再各写一份绘制函数。
   3) 新增角色：西游 +4、百鬼 +4、山海 +3，补齐"每个系列只有三五种造型"的单调问题。
   原绘制函数一律不动；本文件在构建顺序中排在各扩展之后，覆盖需要的入口。 */

/* ---------- 经典半身托：宽肩、领口、袖缝，替代原低肩线托 ---------- */
var FOLK_BUST = function(h,o,c,skin){
  var s = h.g.seed, info = (typeof FOLK_INFO !== 'undefined' && FOLK_INFO[h.g.sp]) || {};
  var accent = (info.pigments && info.pigments[1]) || c;
  // 脖子：跟随（头被弹起或飞起时伸长）或固定短颈
  if (o && o.neck && String(CFG.neckMode || 'follow') !== 'pop') {
    var nbx = o.ox || 0, nby = 0.26 + (o.oy || 0);
    folkShape([[-.24,.94],[-.12,nby-0.06],[nbx-.19,nby],[nbx+.19,nby],[.12,nby-0.06],[.24,.94]], skin, s+110);
    atlasLine([[nbx-.19,nby],[nbx+.19,nby]], s+118, .8, .5, skin);
  } else {
    folkShape([[-.20,.44],[.20,.44],[.23,.92],[-.23,.92]], skin, s+110);
  }
  // 肩与胸：抬高的半身托
  folkShape([[-1.22,1.46],[-.98,1.06],[-.52,.90],[-.22,.84],[.22,.84],[.52,.90],[.98,1.06],[1.22,1.46]], c, s+111);
  // 领口（交领：两笔斜襟）
  var p = (typeof atlasPulse === 'function') ? atlasPulse(o) * .015 : 0;
  folkShape([[-.30,.86],[0,1.02],[.30,.86],[.16,1.20],[0,1.30],[-.16,1.20]], accent, s+112);
  atlasLine([[-.34,.90],[-.06,1.22],[.06,1.34]], s+113, 1.5, .8, accent);
  // 袖缝：一条外廓一笔内袖
  atlasLine([[-.96,1.10],[-1.12,1.42]], s+114, 1.6, .75, c);
  atlasLine([[.96,1.10],[1.12,1.42]], s+115, 1.6, .75, c);
  atlasLine([[-.16,1.34],[-.10,1.46]], s+116, 1.1, .5, accent);
  atlasLine([[.16,1.34],[.10,1.46]], s+117, 1.1, .5, accent);
};

folkBustBase = FOLK_BUST;   /* 所有半身系列（国风/西游/妖怪/欧洲/巨人）共用抬高后的肩线与领口 */

/* ---------- 参数化人物：look 数据 → 头像 ---------- */
function folkMuzzle(x, y, w, hgt, c, s){ folkShape([[x-w,y-hgt*.35],[x-w*.72,y-hgt],[x+w*.72,y-hgt],[x+w,y-hgt*.35],[x+w*.74,y+hgt*.62],[x-w*.74,y+hgt*.62]], c, s); }
function folkNostrils(y, w, s){ for (var sg=-1;sg<=1;sg+=2) folkOval(sg*w, y, .035, .026, '#6b5a4a', s+sg); }
function folkHornPair(kind, s, c, edge){
  var A = atlasLine, fillC = c, lineC = edge || c;
  for (var sg=-1; sg<=1; sg+=2){
    if (kind==='ox'){ A([[sg*.34,-.86],[sg*.66,-1.12],[sg*.92,-1.06]],s+sg,2.6,.95,fillC); A([[sg*.92,-1.06],[sg*1.10,-1.32]],s+sg+1,2.2,.95,lineC); }
    else if (kind==='goat'){ A([[sg*.30,-.88],[sg*.52,-1.18],[sg*.40,-1.46]],s+sg,2.2,.95,fillC); A([[sg*.44,-1.22],[sg*.74,-1.36]],s+sg+1,1.8,.9,lineC); }
    else if (kind==='dragon'){ A([[sg*.32,-.90],[sg*.60,-1.24],[sg*.88,-1.30],[sg*1.06,-1.52]],s+sg,2.8,.95,fillC); A([[sg*.62,-1.26],[sg*.98,-1.36]],s+sg+1,1.2,.8,lineC); }
  }
}
function folkCrest(kind, s, c, a){
  if (kind==='flame'){ folkShape([[-.20,-.92],[-.06,-1.30],[.02,-1.10],[.12,-1.44],[.24,-1.08],[.20,-.92]], c, s); }
  else if (kind==='phoenix'){ for (var i=0;i<5;i++){ var ang=-1.15+i*.28; ctx.save(); ctx.translate(0,-.92); ctx.rotate(ang); folkShape([[0,.10],[-.09,-.22],[-.02,-.52],[.05,-.22]], a, s+i); ctx.restore(); } }
  else if (kind==='lotus'){ for (var j=-1;j<=1;j++){ ctx.save(); ctx.translate(j*.24,-.90); ctx.rotate(j*.42); folkShape([[0,.10],[-.10,-.16],[-.03,-.44],[.06,-.16]], a, s+10+j); ctx.restore(); } }
}
function folkHat(kind, s, c, a){
  if (kind==='lamp'){ folkShape([[-.34,-1.02],[-.26,-1.42],[.26,-1.42],[.34,-1.02]], c, s); atlasLine([[-.30,-1.10],[.30,-1.10]],s+1,2,.9,a); atlasLine([[0,-1.42],[0,-1.56]],s+2,1.6,.8,c); }
  else if (kind==='basket'){ for (var i=0;i<4;i++) atlasLine([[-.34,-1.00-i*.08],[.34,-1.00-i*.08]],s+i,1.6,.85,c); folkShape([[-.30,-1.00],[-.24,-1.24],[.24,-1.24],[.30,-1.00]], c, s+9); }
  else if (kind==='cap'){ folkShape([[-.56,-.74],[-.50,-1.06],[.50,-1.06],[.56,-.74]], c, s); }
  else if (kind==='crown'){ folkShape([[-.52,-.86],[-.46,-1.02],[.46,-1.02],[.52,-.86]], a, s); }
}
function folkHair(kind, s, c){
  var L = atlasLine;
  if (kind==='long'){ folkShape([[-.78,-.30],[-.96,.34],[-.86,.86],[-.66,.72],[-.58,-.30]], c, s); folkShape([[.78,-.30],[.96,.34],[.86,.86],[.66,.72],[.58,-.30]], c, s+1); }
  else if (kind==='bob'){ folkShape([[-.80,-.42],[-.86,.30],[-.60,.34],[-.56,-.42]], c, s); folkShape([[.80,-.42],[.86,.30],[.60,.34],[.56,-.42]], c, s+1); }
  else if (kind==='twin'){ for (var sg=-1;sg<=1;sg+=2) folkOval(sg*.86,-.30,.20,.24, c, s+sg); }
  else if (kind==='wild'){ for (var i=0;i<7;i++){ var ang=-Math.PI*.86+i*Math.PI*.12; ctx.save(); ctx.rotate(ang); folkShape([[-.05,-.72],[-.14,-1.06],[0,-1.22],[.14,-1.06],[.05,-.72]], c, s+i); ctx.restore(); } }
  else if (kind==='bun'){ folkOval(0,-1.12,.26,.24, c, s); }
  else if (kind==='crestMane'){ for (var m=-1;m<=1;m+=2){ folkShape([[m*.66,-.62],[m*1.00,-.96],[m*.88,-.40],[m*.70,-.24]], c, s+m); } folkShape([[-.30,-.98],[-.12,-1.30],[.06,-1.12],[.22,-1.34],[.32,-.96]], c, s+4); }
  else if (kind==='topknot'){ folkOval(0,-1.08,.20,.20, c, s); atlasLine([[0,-1.24],[0,-1.34]],s+1,1.6,.8,c); }
}
function folkFigurePortrait(h,o,info){
  var L = info.look || {}, s = h.g.seed, c = h.g.fur, a = info.pigments[1], skin = L.skin || info.pigments[2];
  var w = L.wide || .66, chin = L.chin || .72;
  FOLK_BUST(h, o, c, skin);
  // 发式与冠帽（在脸后）
  if (L.hair) folkHair(L.hair, s+200, L.hairCol || '#3f4640');
  if (L.ears) for (var sg=-1; sg<=1; sg+=2){
    if (L.ears==='cat') folkShape([[sg*.52,-.86],[sg*.92,-1.30],[sg*1.06,-.92],[sg*.66,-.62]], skin, s+sg+210);
    else if (L.ears==='ox') folkShape([[sg*.60,-.70],[sg*1.10,-.92],[sg*.96,-.30],[sg*.62,-.40]], skin, s+sg+210);
    else if (L.ears==='long') folkOval(sg*.62,-.62,.20,.30, skin, s+sg+210);
  }
  if (L.horns) folkHornPair(L.horns, s+230, L.hornCol || c, L.hornEdge);
  // 脸
  folkShape([[-w,-.52],[-w*.74,-.90],[0,-1.00],[w*.78,-.88],[w,-.44],[w*.92,.26],[.30,chin],[-.29,chin],[-w*.92,.24]], skin, s+10);
  // 刘海
  folkShape([[-w-.02,-.22],[-w-.05,-.68],[-.42,-1.00],[-.02,-1.06],[.44,-.95],[w+.03,-.64],[w-.02,-.21],[.46,-.46],[.30,-.72],[.04,-.56],[-.26,-.74],[-.46,-.47]], L.hairCol || '#3f4640', s+11);
  if (L.hat) folkHat(L.hat, s+250, L.hatCol || c, a);
  if (L.crest) folkCrest(L.crest, s+260, c, a);
  if (L.muzzle) folkMuzzle(0, L.muzzleY || .10, L.muzzleW || .30, L.muzzleH || .22, L.muzzleCol || info.pigments[2], s+270);
  if (L.nostrils) folkNostrils((L.muzzleY || .10) + .06, (L.muzzleW || .30) * .42, s+274);
  folkPortraitEyes(h, o, L.eyeY == null ? -.09 : L.eyeY, L.eyeSep || .25, L.slant || 0);
  if (L.thirdEye) { fill(ring(0, -.52, .045, .075, 12), {color: a, jit: 0}); fill(ring(0, -.52, .022, .038, 12), {color: INK, jit: 0}); }
  if (L.brows) { for (var b=-1;b<=1;b+=2) atlasLine([[b*(L.eyeSep||.25)-.13,-.30],[b*(L.eyeSep||.25),-.34],[b*(L.eyeSep||.25)+.12,-.28]], s+b+280, L.browsW || 2, .85, L.browCol || c); }
  if (L.nose==='ring') { folkOval(0,.06,.10,.075, a, s+290); atlasLine([[-.10,.06],[.10,.06]],s+291,1.4,.8,INK); }
  else folkProfileNose(h, 0, L.noseY == null ? .03 : L.noseY);
  if (L.beard==='full') folkShape([[-.60,.20],[-.38,.34],[-.14,.44],[.16,.44],[.44,.32],[.62,.18],[.46,.70],[0,.92],[-.48,.70]], L.beardCol || '#414a47', s+300);
  else if (L.beard==='goatee') folkShape([[-.20,.40],[-.10,.52],[0,.62],[.10,.52],[.20,.40],[.10,.70],[0,.80],[-.10,.70]], L.beardCol || '#5a5f58', s+301);
  folkPortraitMouth(h, o, L.mouthY == null ? .46 : L.mouthY, L.mouthW == null ? .12 : L.mouthW);
  // 道具（画在肩前）
  if (L.prop==='fan') { ctx.save(); ctx.translate(.86,.60); ctx.rotate(-.28); folkShape([[0,0],[.46,-.16],[.62,.30],[.34,.52],[-.06,.36]], a, s+310); atlasLine([[0,0],[.40,.24]],s+311,1.2,.7,c); ctx.restore(); }
  else if (L.prop==='spear') { atlasLine([[.92,1.36],[.84,-1.06]],s+312,2.4,.95,a); folkShape([[.84,-1.06],[.78,-1.34],[.94,-1.24]], a, s+313); }
  else if (L.prop==='twinTails') { for (var t=-1;t<=1;t+=2){ atlasLine([[t*.90,.24],[t*1.18,.74],[t*1.04,1.24]],s+t+314,4.2,.95,c); atlasLine([[t*1.18,.74],[t*1.34,.96]],s+t+316,2.6,.9,a); } }
  else if (L.prop==='bib') { folkShape([[-.34,.94],[.34,.94],[.26,1.28],[-.26,1.28]], a, s+315); }
  else if (L.prop==='glow') { folkOval(.88,-.34,.10,.10,a,s+316); }
}

/* ---------- 新增角色登记 ---------- */
function folkAdd(key,name,en,series,kind,col,traits,quirk,look){
  folkRegister(key,name,en,series,kind,col,traits,quirk,{look:look});
  var info = FOLK_INFO[key];
  info.support = 'bust';
  FOLK_COLOURS[key] = col;
  info.pigments = col; info.col = [col[0]]; FURS[key] = info.col; SP_RARITY[key] = 3;
  ATLAS_DRAW[key] = function(h,o){ folkFigurePortrait(h,o,info); };
}
/* 西游行旅 +4 */
folkAdd('west_bull','牛魔 · 焰山','Ox King · Flame Mountain','journey','bull',['#7d5148','#c08a5c','#d8b391'],
  ['牛角与鼻环','赭红虬髯','宽肩厚背'],'发威前先数三下，怕吓着路过的小妖。',
  {wide:.76,chin:.66,horns:'ox',hornCol:'#d9c9a8',beard:'full',nose:'ring',brows:true,browsW:2.6,hair:'wild',hairCol:'#4a4038',ears:'ox',eyeSep:.28,mouthY:.50});
folkAdd('west_fan','铁扇 · 芭蕉','Iron Fan · Banana Leaf','journey','fan',['#b25a4f','#cfa257','#ecd0ab'],
  ['高髻与团扇','朱红长裙','石青披帛'],'扇子一摇，能把火气扇成凉风。',
  {wide:.60,chin:.76,hair:'bun',hairCol:'#3d3a36',prop:'fan',eyeSep:.23,mouthW:.10});
folkAdd('west_red','红孩 · 火尖','Red Boy · Fire Tip','journey','redboy',['#c2543f','#d8a24a','#f0cd9f'],
  ['火尖短髻','红肚兜','赤足小将'],'火气来得快，去得也快，转眼就去追蝴蝶。',
  {wide:.62,chin:.80,hair:'topknot',hairCol:'#5a2f28',crest:'flame',prop:'bib',eyeSep:.22,eyeY:-.12,mouthW:.14,hairSlim:true});
folkAdd('west_dragon','白龙 · 西海','White Dragon · West Sea','journey','dragon',['#7f93a8','#dfe3e2','#e8d6b8'],
  ['龙角与银鬃','青灰鳞领','长面清目'],'话不多，跑起来像一阵白风。',
  {wide:.60,chin:.68,horns:'dragon',hornCol:'#e7e3d4',hornEdge:'#7c8b96',hair:'crestMane',hairCol:'#6b8296',muzzle:true,muzzleY:.24,muzzleW:.30,muzzleH:.22,muzzleCol:'#f0dcb8',nostrils:true,ears:'long',eyeSep:.23,noseY:-.06,mouthY:.60,mouthW:.16});
/* 百鬼小町 +4 */
folkAdd('yokai_snow','雪女 · 霜衣','Snow Woman · Frost Robe','yokai','snow',['#8fa7b8','#e8eef1','#dfe7ea'],
  ['长直黑发','霜白和服','呵气成雪'],'她走过的地方，夏天会短一小截。',
  {wide:.66,chin:.74,hair:'long',hairCol:'#33393f',skin:'#eef3f5',brows:true,browsW:1.4,browCol:'#4a555c',eyeSep:.24,mouthW:.10,prop:'glow'});
folkAdd('yokai_zashiki','座敷 · 红兜','Zashiki Child · Red Bib','yokai','zashiki',['#bf7a5e','#c8534a','#e9d4b4'],
  ['娃娃额发','红肚兜','永远长不大'],'谁家孩子多一双筷子，谁家就多一分福气。',
  {wide:.76,chin:.86,hair:'bob',hairCol:'#3a332c',prop:'bib',eyeSep:.22,eyeY:-.16,slant:-.03,mouthW:.12,mouthY:.42,noseY:-.02,child:true});
folkAdd('yokai_lantern','提灯 · 夜路','Lantern Boy · Night Road','yokai','lantern',['#b3894a','#d9c27a','#f0dcae'],
  ['头顶一盏提灯','赭黄短褂','赤脚夜行'],'夜里替人探路，自己却怕黑。',
  {wide:.64,chin:.76,hair:'bald',hairCol:'#4a4034',hat:'lamp',hatCol:'#c9a24a',eyeSep:.23,mouthW:.12,mouthY:.48});
folkAdd('yokai_neko','猫又 · 双尾','Nekomata · Twin Tails','yokai','neko',['#9a8a6e','#6d6455','#e6dcc4'],
  ['猫耳与双尾','琥珀眼','轻盈步态'],'走三步，回头看两次——不是怕，是谨慎。',
  {wide:.68,chin:.78,hair:'wild',hairCol:'#5f5546',ears:'cat',eyeSep:.27,eyeY:-.10,slant:.05,muzzle:true,muzzleY:.16,muzzleW:.24,muzzleH:.16,prop:'twinTails',mouthW:.14});
/* 山海异兽 +3 */
folkAdd('hill_baize','白泽 · 万知','Baize · All-Knowing','shanhai','baize',['#8e9166','#dccfa6','#e9e2c8'],
  ['羊角与长须','可辨万物','温厚双目'],'知道所有名字，却从不轻易开口。',
  {wide:.68,chin:.72,horns:'goat',hornCol:'#e0d3ae',beard:'goatee',hair:'bun',hairCol:'#6b6a52',skin:'#e6dcc0',muzzle:true,muzzleY:.14,muzzleW:.28,muzzleH:.20,muzzleCol:'#efe6cc',eyeSep:.25,noseY:.05,thirdEye:true,eyeY:-.14,mouthW:.12});
folkAdd('hill_zhulong','烛龙 · 烛阴','Torch Dragon · Candle Yin','shanhai','zhulong',['#9c4f45','#d8b46a','#e7cfa4'],
  ['龙角与烛焰','赤鳞长身','睁眼为昼'],'睁眼天亮，闭眼天黑，打个盹就是一夜。',
  {wide:.70,chin:.70,horns:'dragon',hornCol:'#e3c98d',crest:'flame',hair:'wild',hairCol:'#5a3a30',muzzle:true,muzzleY:.14,muzzleW:.28,muzzleH:.20,muzzleCol:'#dcb98a',eyeSep:.26,eyeY:-.12,noseY:.06,mouthW:.14});
folkAdd('hill_feng','凤凰 · 涅槃','Fenghuang · Rebirth','shanhai','fenghuang',['#b8604a','#d9a94f','#f0d9a4'],
  ['五羽华冠','金红长翎','浴火重生'],'落一次羽，就开一片花。',
  {wide:.62,chin:.76,crest:'phoenix',hair:'slim',hairCol:'#a8542f',skin:'#f0d6ac',eyeSep:.23,eyeY:-.14,slant:.06,muzzle:true,muzzleY:.18,muzzleW:.20,muzzleH:.14,muzzleCol:'#e8c078',prop:'glow',mouthW:.10});

/* ---------- 国风葫芦：七兄弟各自可辨（保留葫芦叶冠身份，加鬓饰／冠饰／额饰／道具） ---------- */
function folkGourdMarks(h,o,info){
  var s=h.g.seed, c=h.g.fur, leaf=info.pigments[1], skin=info.pigments[2];
  var p=(typeof atlasPulse==='function')?atlasPulse(o):0, k=info.kind;
  if(k==='fire'){
    for(var sg=-1;sg<=1;sg+=2){ ctx.save(); ctx.translate(sg*.62,-.34); ctx.rotate(sg*.30); folkShape([[0,.16],[-.13,-.06],[-.06,-.34],[.04,-.16],[.12,-.30],[.13,-.02]],c,s+sg); ctx.restore(); }
    folkShape([[-.13,-1.12],[-.02,-1.42],[.06,-1.20],[.16,-1.46],[.20,-1.10]],c,s+9);
  }else if(k==='stone'){
    folkShape([[-.34,-1.06],[-.22,-1.34],[.10,-1.38],[.26,-1.10],[.06,-1.00],[-.20,-.98]],'#8c8477',s+9);
    for(var b=-1;b<=1;b+=2)atlasLine([[b*.44,-.32],[b*.16,-.36],[b*.02,-.30]],s+b+12,2.4,.9,'#5b5146');
  }else if(k==='wind'){
    atlasLine([[.46,-.46],[.94,-.70+p*.14],[1.32,-.52+p*.10],[1.58,-.78+p*.12]],s+9,2.6,.8,leaf);
    atlasLine([[-.46,-.44],[-.92,-.66+p*.12],[-1.24,-.48+p*.10],[-1.46,-.72+p*.10]],s+10,2.2,.72,leaf);
  }else if(k==='leaf'){
    folkLeaf(-.74,-.34,2.5,leaf,s+9); folkLeaf(.76,-.32,-2.6,leaf,s+10);
    atlasLine([[-.60,.10],[-.44,.16]],s+11,1.1,.6,leaf); atlasLine([[.60,.10],[.44,.16]],s+12,1.1,.6,leaf);
  }else if(k==='water'){
    for(var w2=0;w2<3;w2++)atlasLine([[-.50,-.36+w2*.10],[-.20,-.42+w2*.10],[.14,-.34+w2*.10],[.48,-.42+w2*.10]],s+9+w2,1.4,.72,info.pigments[1]);
    folkOval(.62,-.52,.055,.075,info.pigments[1],s+14);
  }else if(k==='mist'){
    folkShape([[-.62,-.30],[-.40,-.52],[0,-.60],[.42,-.50],[.62,-.28],[.40,-.16],[-.04,-.22],[-.42,-.16]],'#cfd4dd',s+9);
    folkShape([[-.16,-.60],[-.06,-.72],[.06,-.62],[.16,-.74],[.20,-.56]],'#e6e9ef',s+10);
  }else{
    stroke(ring(0,-1.34,.24,.085,22),{close:true,w:1.4,jit:0.35,seed:s+9,color:'#d6b254'});
    folkOval(-.54,.30,.06,.08,'#c8a45f',s+10);
  }
}
function folkGourdFigure(h,o,info){ folkGourdPortrait(h,o,info); folkGourdMarks(h,o,info); }
if(typeof FOLK_SERIES!=='undefined' && FOLK_SERIES.guofeng){
  FOLK_SERIES.guofeng.keys.forEach(function(k){ ATLAS_DRAW[k]=function(h,o){ folkGourdFigure(h,o,FOLK_INFO[k]); }; });
  Object.keys(PORTRAIT_ALIAS||{}).forEach(function(k){ var src=FOLK_INFO[PORTRAIT_ALIAS[k]]; if(src) ATLAS_DRAW[k]=function(h,o){ folkGourdFigure(h,o,src); }; });
}
