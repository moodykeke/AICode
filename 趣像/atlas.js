/* Curious Creatures 05. Character geometry is shared by stage, cards, avatars and hybrids. */
var ATLAS_INFO={
 shrimp:{name:'长须虾信使',col:['#cf8068','#bd6e61','#dd9c78'],traits:['弯曲分节','两根长须','三瓣尾扇'],quirk:'信件夹在胡须之间。害羞时，会先往后退一小步。',family:'潮间带'},
 crab:{name:'招潮蟹鼓手',col:['#ba7057','#c17e65','#a96852'],traits:['横向甲壳','高高眼柄','一对开合蟹钳'],quirk:'总是横着走上舞台。它的掌声，听起来像小小的木鱼。',family:'潮间带'},
 octopus:{name:'章鱼小指挥',col:['#a783a2','#be858f','#7f9fa2'],traits:['圆润外套膜','八条柔软腕足','小吸盘'],quirk:'每只手都想指挥一个乐章。最后，大家决定轮流。',family:'潮间带'},
 seahorse:{name:'卷尾海马',col:['#c3a36c','#b59069','#8fa59b'],traits:['马形头部','管状吻','盘卷尾巴'],quirk:'把问题卷进尾巴里，慢慢想。小鳍却一直忙着。',family:'潮间带'},
 puffer:{name:'河豚气球员',col:['#b6aa72','#a1b192','#c2a382'],traits:['短刺','扇形尾鳍','可鼓起的身体'],quirk:'一点小惊喜，就能让它圆上一圈。平静下来，还是个好邻居。',family:'潮间带'},
 jelly:{name:'水母灯笼',col:['#a9bcc4','#b7a3bc','#93b8b6'],traits:['半透明伞盖','波浪伞缘','飘带触手'],quirk:'用一盏没有开关的小灯，为经过的鱼照路。',family:'潮间带'},
 manta:{name:'鳐鱼滑翔者',col:['#78969f','#7e91ae','#95a79f'],traits:['菱形宽翼','卷起的头鳍','细长尾巴'],quirk:'把海流折成翅膀。转弯时，会给身后的朋友让路。',family:'潮间带'},
 hermit:{name:'寄居蟹收藏家',col:['#b4987e','#b99791','#a4a78a'],traits:['螺旋贝壳','探出的眼柄','小钳与足'],quirk:'背着一间螺旋小屋。遇到掌声，会先躲进去听一听。',family:'潮间带'},
 sponge:{name:'海绵宝宝',col:['#e7c459','#e7cf69','#d9b64e'],traits:['方形海绵','孔洞与长睫毛','白衬衣红领带'],quirk:'准备好了吗？准备好了！连泡泡都要排队笑一下。',family:'动画来客'},
 patrick:{name:'派大星',col:['#dca3a0','#d3a09d','#e3b0a4'],traits:['五角海星轮廓','绿色短裤','紫色花纹'],quirk:'认真地发一会儿呆。忽然想到一个主意，又忘记了。',family:'动画来客'},
 totoro:{name:'龙猫',col:['#939994','#8a9694','#a4a79b'],traits:['高高双耳','浅色大肚皮','胡须与山形纹'],quirk:'站在那里，像一小片安静的森林。耳朵比表情先听见风。',family:'动画来客'},
 soot:{name:'煤煤虫',col:['#474842','#51534c','#3e4444'],traits:['毛茸茸黑团','两只大白眼','轻巧小脚'],quirk:'小小一团，跑得很认真。停下以后，眼睛还在四处找朋友。',family:'动画来客'},
 gourd_fire:{name:'葫芦小火',col:['#c95745','#e1834d','#f0b34d'],traits:['火焰叶冠','红色短披帛','掌心小火星'],quirk:'先点亮一盏小灯，再邀请大家一起走。',family:'动画来客 · 葫芦七子',series:'葫芦七子',role:'火'},
 gourd_stone:{name:'葫芦小山',col:['#9b7357','#bd9a65','#6f7d70'],traits:['石色护肩','稳稳短靴','圆石小盾'],quirk:'走得慢，却总能把队伍稳稳接住。',family:'动画来客 · 葫芦七子',series:'葫芦七子',role:'山'},
 gourd_wind:{name:'葫芦小风',col:['#65a7a0','#8bc4b1','#d7e3c3'],traits:['风带披风','细长发梢','纸鸢小结'],quirk:'把每一句话都吹成一条轻快的弧线。',family:'动画来客 · 葫芦七子',series:'葫芦七子',role:'风'},
 gourd_leaf:{name:'葫芦小叶',col:['#6d9c63','#9fbd72','#e2bd63'],traits:['叶片肩饰','藤蔓腰带','种子小袋'],quirk:'喜欢照顾新芽，也喜欢把队形排成一片叶子。',family:'动画来客 · 葫芦七子',series:'葫芦七子',role:'木'},
 gourd_water:{name:'葫芦小潮',col:['#4d879e','#74b7c0','#d1e1dc'],traits:['水纹额饰','蓝色袖摆','贝壳小铃'],quirk:'一转身，脚边就多了一圈安静的水纹。',family:'动画来客 · 葫芦七子',series:'葫芦七子',role:'水'},
 gourd_mist:{name:'葫芦小雾',col:['#8d82ad','#b4a3c7','#e2d5dc'],traits:['雾色斗篷','月牙发夹','小云团'],quirk:'不急着出现，先让轮廓在雾里眨一下眼。',family:'动画来客 · 葫芦七子',series:'葫芦七子',role:'雾'},
 gourd_light:{name:'葫芦小灯',col:['#d29d42','#e3be61','#f2e6ac'],traits:['金色叶冠','灯笼腰包','星点短杖'],quirk:'把掌心的星点分给每一个晚回家的朋友。',family:'动画来客 · 葫芦七子',series:'葫芦七子',role:'光'},
 lotus_kid:{name:'莲火小将',col:['#c96857','#d8956e','#78a5a1'],traits:['莲瓣发冠','火焰腰牌','短短水袖'],quirk:'脚下有一朵莲，心里有一小团不服输的火。',family:'动画来客 · 东方小队',series:'东方小队',role:'莲火'},
 cloud_dragon:{name:'云龙小将',col:['#6c8fa4','#91b7bb','#d8b36c'],traits:['云角发髻','鳞片围巾','弯弯龙尾'],quirk:'会把云朵折成一条路，再悄悄跟在队伍后面。',family:'动画来客 · 东方小队',series:'东方小队',role:'云龙'}
};
Object.keys(ATLAS_INFO).forEach(function(k){NATURAL.push(k);NATURAL_INFO[k]=ATLAS_INFO[k];SPNAME[k]=ATLAS_INFO[k].name;FURS[k]=ATLAS_INFO[k].col;SP_RARITY[k]=3;});
var SEA=['shrimp','crab','octopus','seahorse','puffer','jelly','manta','hermit'],CHINESE_CARTOONS=['gourd_fire','gourd_stone','gourd_wind','gourd_leaf','gourd_water','gourd_mist','gourd_light','lotus_kid','cloud_dragon'],CARTOONS=['sponge','patrick','totoro','soot'].concat(CHINESE_CARTOONS);
var LEGACY_LABELS={human:'人物',cat:'猫',tiger:'老虎',dog:'小狗',bear:'棕熊',panda:'熊猫',rabbit:'兔子',pig:'小猪',fox:'狐狸',mouse:'小鼠',owl:'猫头鹰',chick:'小鸡',frog:'青蛙',robot:'机器人',alien:'外星访客'};
MODES.push('潮间带 · 水族','动画来客','混生 · 新物种');
var atlasRandomDNA=randomDNA;
randomDNA=function(){if(MODE===8){var a=Math.floor(Math.random()*NATURAL.length),b=(a+1+Math.floor(Math.random()*(NATURAL.length-1)))%NATURAL.length;return atlasDNA(NATURAL[a],randSeed(),NATURAL[b]);}if(MODE===6 || MODE===7){var list=MODE===6?SEA:CARTOONS;return pureDNA(randSeed()).concat(NATURAL.indexOf(pickOne(list))+1);}return atlasRandomDNA();};
function atlasTag(kind){return NATURAL.indexOf(kind)+1;}
function atlasDNA(kind,seed,donor){seed=seed==null?randSeed():seed;var t=atlasTag(kind),b=atlasTag(donor);if(!t){if(!Object.prototype.hasOwnProperty.call(LEGACY_LABELS,kind)||donor)return null;for(var i=0;i<10000;i++){if(baseGenes(seed).sp===kind)return pureDNA(seed);seed=(seed+1)>>>0;}return null;}var d=pureDNA(seed);d.push(t);if(b && b!==t)d.push(b);return d;}
function atlasLine(P,seed,w,alpha,col){stroke(P,{seed:seed,w:w==null?0.85:w,alpha:alpha==null?1:alpha,jit:0.004,color:col});}
function atlasOval(x,y,rx,ry,col,seed,alpha,angle){naturalPaint(ring(x,y,rx,ry,24,angle||0),col,seed,alpha,0.95);}
function atlasEye(x,y,r,seed,blink,iris){
 if(blink>0.65){atlasLine([[x-r,y],[x,y+r*.3],[x+r,y]],seed,1.05);return;}
 var P=ring(x,y,r,r*1.12,18);knock(P,seed,0);if(COLOR)wash(P,'#f6f1df',seed,0.2,0.002);stroke(P,{close:true,w:.7,jit:.002,seed:seed+1});
 if(iris){fill(ring(x,y,r*.62,r*.68,16),{color:mapCol(iris),jit:0});}
 fill(ring(x,y+r*.05,r*(iris?.32:.48),r*.57,14),{color:INK,jit:0});
 fill(ring(x-r*.15,y-r*.18,r*.13,r*.13,9),{color:PAPER,jit:0});
}
function atlasClaw(x,y,size,sg,open,col,seed){
 ctx.save();ctx.translate(x,y);ctx.scale(sg*size,size);ctx.rotate(-.15-open*.2);var gape=clamp((open+1)*.5,0,1);
 naturalPaint([[-.26,.40],[-.47,.04],[-.47,-.43],[-.19-.1*gape,-.73],[.01-.1*gape,-.36],[.04,-.05],[.25+.14*gape,-.35],[.42+.16*gape,-.48],[.52,-.19],[.34,.20],[.12,.39]],col,seed,.95,1.05);
 atlasLine([[-.05,.3],[-.1,-.02],[-.20,-.3]],seed+5,.7,.5);ctx.restore();
}
function atlasSpiral(cx,cy,r,turns,seed,col,width,phase){var P=[];for(var i=0;i<=56;i++){var t=i/56,a=t*TAU*turns+(phase||0),rr=r*(1-t*.91);P.push([cx+Math.cos(a)*rr,cy+Math.sin(a)*rr]);}atlasLine(P,seed,width||1.1,.8,col);}
function atlasPulse(o){return (o.perform||0)+(o.wind||0)*.26+(o.life||0);}

/* A shared original Chinese-animation family: the silhouette stays related, while
   each child receives a distinct element, prop and motion cue. */
function drawGourdChild(h,o,kind){
 var g=h.g,s=g.seed,p=atlasPulse(o),info=ATLAS_INFO[kind]||ATLAS_INFO.gourd_fire;
 var fur=g.fur,accent=info.col[1],light=info.col[2],sway=Math.sin(s*.017+p*.9)*.05+p*.10;
 ctx.save();ctx.rotate(-p*.045);
 // short legs and a clear two-lobed gourd body
 for(var sg=-1;sg<=1;sg+=2){atlasLine([[sg*.16,.70],[sg*.19,.99+p*.035],[sg*.37,.99+p*.025]],s+10+sg,1.8,.95,fur);}
 naturalPaint([[-.58,.50],[-.69,.13],[-.54,-.20],[-.29,-.38],[-.43,-.70],[-.27,-.99],[0,-1.09],[.27,-.99],[.43,-.70],[.29,-.38],[.54,-.20],[.69,.13],[.58,.50],[.28,.72],[-.28,.72]],fur,s,.96,1.05);
 // collar and sash are intentionally separate layers so the family can mix with grafts.
 naturalPaint([[-.34,-.36],[0,-.28],[.34,-.36],[.25,-.18],[0,-.10],[-.25,-.18]],accent,s+20,.9,.75);
 atlasLine([[-.53,.20],[0,.30+.035*Math.sin(p*2)],[.53,.20]],s+23,1.1,.75,accent);
 atlasEye(-.18,-.56,.105,s+30,o.eye||0);atlasEye(.18,-.56,.105,s+31,o.eye||0);
 atlasLine([[-.10,-.29],[0,-.24],[.10,-.29]],s+34,.9,.8,INK);
 // leaf crown: a common series signature, rotated by role rather than duplicated.
 var crownRot={gourd_fire:-.10,gourd_stone:.06,gourd_wind:.24,gourd_leaf:-.22,gourd_water:.14,gourd_mist:-.05,gourd_light:.18}[kind]||0;
 ctx.save();ctx.translate(0,-1.02);ctx.rotate(crownRot+sway*.2);naturalPaint([[0,.18],[-.24,-.10],[-.12,-.47],[.08,-.26],[.30,-.40],[.24,-.03]],light,s+40,.95,.78);ctx.restore();
 if(kind==='gourd_fire'){
   naturalPaint([[-.05,-1.28],[.04,-1.68],[.18,-1.46],[.29,-1.66],[.28,-1.22]],'#e36c43',s+45,.9,.7);
   for(var i=0;i<3;i++)fill(ring((i-1)*.17,.05,.035,.035,9),{color:'#f4dc8b',alpha:.8,jit:0});
 } else if(kind==='gourd_stone'){
   naturalPaint([[-.83,.06],[-1.08,-.16],[-1.04,.38],[-.78,.54],[-.64,.27]],accent,s+45,.95,1);
   atlasLine([[-.93,-.04],[-.82,.24],[-.91,.38]],s+47,.8,.7,fur);
 } else if(kind==='gourd_wind'){
   atlasLine([[.40,-.08],[.88,-.35],[1.20,-.17],[1.42,-.47]],s+45,2.1,.82,light);
   atlasLine([[.51,.02],[.92,.20],[1.22,.08],[1.43,.30]],s+46,1.2,.6,accent);
 } else if(kind==='gourd_leaf'){
   ctx.save();ctx.translate(-.53,.04);ctx.rotate(-.28+p*.08);naturalPaint([[0,0],[-.42,-.33],[-.36,-.74],[-.02,-.53],[.25,-.76],[.28,-.32]],accent,s+45,.9,.8);atlasLine([[0,.02],[.06,-.58]],s+46,.7,.6,fur);ctx.restore();
 } else if(kind==='gourd_water'){
   for(i=0;i<3;i++)atlasLine([[-.76,.42+i*.12],[-.30,.32+i*.08],[.20,.44+i*.08],[.76,.32+i*.06]],s+45+i,1.4,.58,light);
   atlasLine([[.55,-.05],[.75,.12],[.88,.04]],s+49,1.1,.75,accent);
 } else if(kind==='gourd_mist'){
   for(i=-1;i<=1;i++)wash(ring(i*.27,-.02-Math.abs(i)*.08,.25,.16,16),light,s+45+i,.55,.008);
   atlasLine([[-.65,.37],[-.95,.45],[-1.14,.35]],s+49,1.1,.55,accent);
 } else if(kind==='gourd_light'){
   atlasLine([[.61,.20],[.94,.00],[.91,-.42]],s+45,1.2,.9,accent);
   naturalPaint([[.80,-.47],[.96,-.65],[1.12,-.47],[.96,-.28]],light,s+46,.85,.65);
   for(i=0;i<4;i++)fill(ring(-.55+i*.34,-.08-Math.abs(i-1.5)*.08,.025,.025,8),{color:light,alpha:.85,jit:0});
 }
 ctx.restore();
}
function drawLotusKid(h,o){var g=h.g,s=g.seed,p=atlasPulse(o);ctx.save();ctx.rotate(-p*.06);
 naturalPaint([[-.58,.69],[-.68,.18],[-.50,-.23],[-.20,-.42],[0,-.34],[.20,-.42],[.50,-.23],[.68,.18],[.58,.69],[.22,.84],[-.22,.84]],g.fur,s,.95,1.1);
 for(var i=-1;i<=1;i+=2)atlasLine([[i*.42,-.02],[i*.76,-.24-p*.05],[i*.92,.04]],s+4+i,1.8,.9,g.fur);
 naturalPaint([[-.36,-.48],[-.12,-.82],[0,-.59],[.12,-.82],[.36,-.48],[.20,-.30],[-.20,-.30]],g.fur,s+12,.88,.8);
 atlasEye(-.18,-.56,.105,s+20,o.eye||0);atlasEye(.18,-.56,.105,s+21,o.eye||0);atlasLine([[-.10,-.29],[0,-.22],[.10,-.29]],s+24,1,.8,INK);
 for(i=0;i<5;i++){var a=i*TAU/5+p*.12;naturalPaint([[Math.cos(a)*.68,.76+Math.sin(a)*.08],[Math.cos(a)*.88,.93+Math.sin(a)*.08],[Math.cos(a)*.52,1.02]],g.fur,s+30+i,.55,.65);}
 atlasLine([[.50,.22],[.94,.42],[1.08,.27]],s+40,1.4,.8,'#e5a85c');ctx.restore();}
function drawCloudDragon(h,o){var g=h.g,s=g.seed,p=atlasPulse(o);ctx.save();ctx.rotate(-p*.04);
 naturalPaint([[-.65,.39],[-.72,-.10],[-.46,-.48],[-.18,-.62],[.20,-.59],[.55,-.39],[.70,.06],[.53,.55],[.10,.74],[-.32,.69]],g.fur,s,.95,1.08);
 for(var sg=-1;sg<=1;sg+=2){naturalPaint([[sg*.18,-.50],[sg*.30,-.95],[sg*.17,-1.26],[sg*.45,-1.06],[sg*.50,-.67]],g.fur,s+4+sg,.9,.75);}
 atlasEye(-.20,-.30,.10,s+20,o.eye||0);atlasEye(.20,-.30,.10,s+21,o.eye||0);atlasLine([[-.11,-.02],[0,.04],[.11,-.02]],s+23,1,.8,INK);
 atlasLine([[.52,.24],[.97,.45],[1.24,.28],[1.39,.46]],s+30,2,.8,g.fur);atlasLine([[.63,.39],[.91,.65],[1.18,.63]],s+31,1,.55,'#d8b36c');
 for(var i=0;i<5;i++)atlasLine([[-.43+i*.20,.16],[-.34+i*.20,.29]],s+40+i,1.3,.55,'#d8b36c');ctx.restore();}

var ATLAS_DRAW={
 shrimp:function(h,o){var g=h.g,s=g.seed,p=atlasPulse(o);ctx.save();ctx.rotate(-p*.09);
   // A curled abdomen and a fan, rather than a round head with extra antennae.
   [[.58,.15,.38,.34,.2],[.60,.44,.32,.27,.6],[.40,.65,.29,.22,.9],[.12,.78,.26,.19,1.1]].forEach(function(v,i){atlasOval(v[0],v[1],v[2],v[3],g.fur,s+20+i,.9,v[4]);});
   if(g.donor!=='ginkgo'){ctx.save();ctx.translate(-.1,.8);ctx.rotate(p*.22);for(var j=-1;j<=1;j++)naturalPaint([[0,0],[-.19+j*.08,.19],[-.53+j*.13,.25+j*.19],[-.43+j*.09,-.06+j*.18]],g.fur,s+50+j,.8,.8);ctx.restore();}
   for(var i=0;i<4;i++)atlasLine([[.30-i*.18,.13],[.02-i*.2,.37+p*.03],[-.20-i*.17,.53]],s+70+i,.8,.7);
   naturalPaint([[-.93,-.50],[-1.19,-.67],[-.65,-.69],[-.31,-.88],[.15,-.72],[.53,-.42],[.72,-.03],[.37,.24],[-.09,.15],[-.55,-.08]],g.fur,s,.98,1.2);
   for(i=0;i<4;i++)atlasLine([[-.25+i*.20,-.64],[-.12+i*.2,-.31],[-.17+i*.18,.06]],s+8+i,.65,.42);
   atlasLine([[-.72,-.46],[-1.01,-.94],[-.89,-1.27],[-.24+p*.12,-1.42]],s+80,1,.9);
   atlasLine([[-.61,-.44],[-.32,-1.02],[.05,-1.22],[.74+p*.14,-1.23]],s+81,.9,.8);
   atlasLine([[-.61,-.30],[-.81,-.51]],s+82,1.6);atlasEye(-.82,-.53,.073,s+85,o.eye||0);
   atlasLine([[-.51,-.12],[-.40,-.08],[-.3,-.15]],s+90,.8);ctx.restore();
 },
 crab:function(h,o){var g=h.g,s=g.seed,p=atlasPulse(o),col=g.fur;
   for(var side=-1;side<=1;side+=2){for(var i=0;i<3;i++){var yy=.20+i*.19;atlasLine([[side*.57,yy-.12],[side*(1.00+i*.035),yy-.06+p*.04*side],[side*(1.17-i*.07),yy+.25]],s+10+i+side,1.8,.85,col);}
     atlasLine([[side*.60,-.10],[side*1.05,-.32],[side*1.12,-.55]],s+25+side,3,1,col);
     atlasClaw(side*1.08,-.57-p*.09*side,.60,side,p,col,s+30+side);
   }
   naturalPaint([[-.87,.15],[-.78,-.32],[-.42,-.50],[.34,-.51],[.78,-.33],[.87,.11],[.55,.55],[-.50,.55]],col,s,.95,1.15);
   for(var j=-1;j<=1;j+=2){atlasLine([[j*.31,-.39],[j*.38,-.82]],s+44+j,2.6,1,col);atlasEye(j*.38,-.83,.105,s+46+j,o.eye||0);}
   atlasLine([[-.20,.16],[0,.27+Math.max(0,p)*.04],[.20,.16]],s+50,1);
   for(i=0;i<5;i++)fill(ring((i-2)*.17,-.22+Math.abs(i-2)*.027,.022,.015,8),{color:COLOR?'#844c40':INK,alpha:.4,jit:0});
 },
 octopus:function(h,o){var g=h.g,s=g.seed,p=atlasPulse(o);
   for(var i=0;i<8;i++){var u=(i-3.5)/3.5,P=[],start=u*.45;for(var j=0;j<=16;j++){var t=j/16;P.push([start+u*t*.63+Math.sin(t*Math.PI*1.6+i*.7+p)*.15*t,.05+t*(.75+(.5-Math.abs(u))*.35)+Math.sin(t*Math.PI*2+i*.7+p)*.17*t]);}tube(P,.115,.022,g.fur,s+10+i,.007,true);for(j=7;j<15;j+=3){var v=P[j];fill(ring(v[0],v[1]+.03,.024,.015,8),{color:COLOR?'#e5c6ba':PAPER,alpha:.7,jit:0});}}
   naturalPaint([[-.68,.13],[-.73,-.45],[-.58,-.93],[-.21,-1.13],[.27,-1.11],[.64,-.87],[.76,-.43],[.63,.19],[.28,.40],[-.24,.38]],g.fur,s,.92,1.1);
   naturalEyes(h,o,0,-.18,.25);atlasOval(-.46,-.02,.075,.045,'#dbaa9d',s+60,.4);atlasOval(.46,-.02,.075,.045,'#dbaa9d',s+62,.4);
 },
 seahorse:function(h,o){var g=h.g,s=g.seed,p=atlasPulse(o),tail=[];
   for(var j=0;j<=36;j++){var t=j/36,a=t*Math.PI*(3.7+p*.24)+.15,r=.32*(1-t*.88)*(1+p*.1*t);tail.push([.05+Math.cos(a)*r,.83+Math.sin(a)*r]);}tube(tail,.12,.025,g.fur,s+20,.007,true);
   naturalPaint([[.25,-.42],[.78,-.13+p*.04],[.65,.29],[.35,.46],[.24,.17]],'#bdc6ad',s+25,.55,.8);
   naturalPaint([[-.71,-.84],[-.30,-.96],[-.29,-1.15],[-.03,-1.25],[.31,-1.04],[.47,-.68],[.28,-.42],[.30,-.12],[.60,.16],[.54,.50],[.33,.74],[.29,.85],[.04,.94],[-.12,.74],[-.19,.43],[-.10,.02],[-.09,-.36],[-.42,-.51],[-.83,-.51],[-.93,-.67]],g.fur,s,.95,1.1);
   atlasEye(-.16,-.83,.09,s+40,o.eye||0);atlasLine([[-.78,-.64],[-.57,-.63]],s+44,.8);
   for(var i=0;i<6;i++){var yy=-.28+i*.16;atlasLine([[.02,yy],[.25+Math.sin(i*.55)*.10,yy+.025]],s+50+i,.65,.5);}
   for(i=0;i<4;i++)atlasLine([[.30,.07],[.62,.02+i*.08+p*.04]],s+60+i,.6,.45);
 },
 puffer:function(h,o){var g=h.g,s=g.seed,p=Math.max(0,atlasPulse(o));ctx.save();ctx.scale(1+p*.14,1+p*.11);
   naturalPaint([[.75,-.02],[1.28,-.42],[1.15,.03],[1.29,.44],[.75,.23]],g.fur,s+1,.7,.9);
   for(var i=0;i<15;i++){var a=i*TAU/15;naturalPaint([[Math.cos(a)*.77,Math.sin(a)*.72],[Math.cos(a+.09)*(.99+p*.08),Math.sin(a+.09)*(.92+p*.08)],[Math.cos(a+.17)*.77,Math.sin(a+.17)*.72]],g.fur,s+10+i,.75,.65);}
   atlasOval(0,0,.83,.76,g.fur,s,.92);wash(ring(0,.29,.56,.32,24),'#e0d4b6',s+35,.6,.008);naturalEyes(h,o,-.10,-.11,.24);
   for(i=0;i<9;i++){var xx=(hash2(s,i)-.5)*1.18,yy=-.57+hash2(s+3,i)*.30;fill(ring(xx,yy,.025,.025,8),{color:COLOR?'#78845d':INK,alpha:.45,jit:0});}ctx.restore();
 },
 jelly:function(h,o){var g=h.g,s=g.seed,p=atlasPulse(o);
   for(var i=0;i<7;i++){var P=[];for(var j=0;j<=18;j++){var t=j/18;P.push([(i-3)*.19+Math.sin(t*TAU*1.1+i*.7+p*1.9)*.10*t,.12+t*(.85+hash2(s,i)*.35)]);}atlasLine(P,s+20+i,i%2?1.3:2.4,.50,g.fur);}
   ctx.save();ctx.translate(0,-p*.06);ctx.scale(1-p*.07,1+p*.06);
   naturalPaint([[-1.02,.16],[-.91,-.37],[-.60,-.85],[-.10,-1.03],[.45,-.93],[.88,-.55],[1.02,.12],[.75,-.01],[.52,.18],[.25,0],[-.02,.19],[-.28,0],[-.54,.17],[-.79,-.02]],g.fur,s,.58,.9);
   for(i=-1;i<=1;i++)wash(ring(i*.26,-.61,.18,.19,20),'#e1c5c8',s+9+i,.35,.008);
   naturalEyes(h,o,0,-.22,.21);ctx.restore();
 },
 manta:function(h,o){var g=h.g,s=g.seed,p=atlasPulse(o);
   atlasLine([[0,.39],[.06,.85],[-.14,1.25],[.08,1.40]],s+3,1.4,.9,g.fur);
   naturalPaint([[0,-.57],[-.28,-.46],[-.72,-.65],[-1.39,-.65-p*.19],[-1.16,-.17],[-.77,.33],[-.39,.45],[0,.70],[.41,.44],[.78,.31],[1.18,-.19],[1.39,-.66+p*.19],[.71,-.65],[.29,-.46]],g.fur,s,.95,1.1);
   for(var sg=-1;sg<=1;sg+=2){atlasLine([[sg*.31,-.43],[sg*.42,-.81],[sg*.22,-.97],[sg*.18,-.65]],s+14+sg,2.2,.9,g.fur);atlasLine([[sg*.36,-.17],[sg*.81,-.1],[sg*1.1,-.4]],s+18+sg,.7,.3);}
   naturalEyes(h,o,0,-.20,.22);
 },
 hermit:function(h,o){var g=h.g,s=g.seed,p=Math.max(0,atlasPulse(o));
   ctx.save();ctx.translate(p*.26,-p*.08);
   for(var i=0;i<3;i++)atlasLine([[-.40+i*.21,.43],[-.68+i*.23,.69],[-.74+i*.20,.95]],s+12+i,2,.9,'#b47862');
   atlasClaw(-.73,.27,.42,-1,p,'#bd7c66',s+18);
   atlasOval(-.23,.29,.40,.35,'#c18a70',s+20,.9);
   for(var sg=-1;sg<=1;sg+=2){atlasLine([[-.25+sg*.13,.15],[-.34+sg*.16,-.27]],s+24+sg,2,1,'#c18a70');atlasEye(-.34+sg*.16,-.29,.075,s+28+sg,o.eye||0);}
   ctx.restore();
   naturalPaint([[-.02,.64],[-.31,.05],[-.12,-.65],[.23,-1.06],[.52,-1.13],[.89,-.83],[1.04,-.30],[.94,.28],[.48,.70]],g.fur,s,.94,1.1);
   atlasSpiral(.41,-.23,.51,1.65,s+40,COLOR?'#746f58':INK,1.25,-.7);
   atlasLine([[.1,.61],[.47,.49],[.80,.18]],s+43,.7,.5);
 },
 sponge:function(h,o){var g=h.g,s=g.seed,p=atlasPulse(o),yellow=g.fur;
   for(var sg=-1;sg<=1;sg+=2){atlasLine([[sg*.71,.16],[sg*(1.03+p*.04),.38],[sg*(1.10+p*.12),.03-p*.18]],s+2+sg,2,1,yellow);for(var i=0;i<3;i++)atlasLine([[sg*(1.10+p*.12),.03-p*.18],[sg*(1.18+i*.025),-.1+i*.09-p*.18]],s+7+i+sg,1.05);}
   naturalPaint([[-.76,-1.06],[-.48,-1.14],[-.22,-1.05],[.07,-1.12],[.33,-1.06],[.64,-1.10],[.82,-.91],[.76,-.59],[.83,-.29],[.77,.02],[.83,.42],[-.76,.42],[-.82,.09],[-.76,-.2],[-.84,-.52],[-.76,-.77]],yellow,s,.98,1.15);
   [[-.60,-.86,.075],[.59,-.86,.06],[-.66,-.26,.06],[.64,-.14,.08],[-.59,.20,.045],[.50,.26,.07],[.17,-.96,.035]].forEach(function(v,i){wash(ring(v[0],v[1],v[2],v[2]*.77,13),'#a7a455',s+20+i,.72,.003);});
   for(var sg=-1;sg<=1;sg+=2){atlasEye(sg*.27,-.51,.25,s+40+sg,o.eye||0,'#729baa');for(i=-1;i<=1;i++)atlasLine([[sg*.27+i*.12,-.73],[sg*.27+i*.15,-.89]],s+46+i+sg,1.1);}
   atlasOval(.01,-.23,.09,.20,yellow,s+60,.9);
   wash(ring(-.48,-.01,.14,.07,14),'#d28570',s+64,.38,.005);wash(ring(.48,-.01,.14,.07,14),'#d28570',s+65,.38,.005);
   atlasLine([[-.48,.02],[-.20,.19],[.22,.19],[.49,.02]],s+69,1.1);
   for(i=-1;i<=1;i+=2)naturalPaint(rectPts(i<0?-.18:.025,.14,.15,.20,4),'#f4efe1',s+72+i,1,.75);
   naturalPaint(rectPts(-.78,.40,1.56,.26,5),'#f3eee0',s+80,.85,.85);
   naturalPaint(rectPts(-.76,.65,1.52,.31,5),'#9b795e',s+85,.9,1);
   naturalPaint([[-.08,.43],[.08,.43],[.02,.55],[.14,.79],[0,.88],[-.13,.77],[-.02,.55]],'#b5544c',s+90,.96,.6);
   for(var sg=-1;sg<=1;sg+=2){atlasLine([[sg*.39,.94],[sg*.4,1.16]],s+97+sg,2,1,yellow);atlasLine([[sg*.4,1.15],[sg*.59,1.17]],s+100+sg,4);}
 },
 patrick:function(h,o){var g=h.g,s=g.seed,p=atlasPulse(o);
   naturalPaint([[0,-1.26],[.20,-.83],[.42,-.48],[1.09,-.24],[.82,.10],[.55,.26],[.68,1.10],[.21,.88],[0,.59],[-.28,.99],[-.62,1.11],[-.54,.24],[-.88,.04],[-1.10,-.25],[-.38,-.48],[-.17,-.94]],g.fur,s,.98,1.05);
   for(var sg=-1;sg<=1;sg+=2)atlasEye(sg*.13,-.50,.13,s+12+sg,o.eye||0);
   atlasLine([[-.12,-.13],[.01,-.06],[.15,-.14]],s+20,1);atlasLine([[-.19,-.73],[-.06,-.75]],s+22,1);atlasLine([[.06,-.76],[.19,-.74]],s+23,1);
   naturalPaint([[-.55,.37],[.53,.37],[.65,.87],[.23,.76],[0,.63],[-.26,.86],[-.59,.92]],'#a4b378',s+30,.93,.9);
   [[-.32,.58],[.32,.62]].forEach(function(v,i){for(var j=0;j<5;j++){var a=j*TAU/5;wash(ring(v[0]+Math.cos(a)*.064,v[1]+Math.sin(a)*.054,.06,.038,12),'#9984a1',s+40+i*5+j,.9,.002);}});
   fill(ring(.03,.20,.018,.025,8),{color:INK,alpha:.5,jit:0});
 },
 totoro:function(h,o){var g=h.g,s=g.seed,p=atlasPulse(o);
   for(var sg=-1;sg<=1;sg+=2)naturalPaint([[sg*.25,-.65],[sg*(.31+p*.025),-1.35],[sg*.48,-1.46],[sg*.56,-.72]],g.fur,s+4+sg,.95,.9);
   naturalPaint([[-.77,.73],[-.92,.15],[-.76,-.52],[-.40,-.95],[.28,-.98],[.70,-.64],[.89,.12],[.83,.75],[.48,1.04],[-.41,1.07]],g.fur,s,.94,1.05);
   atlasOval(0,.38,.62,.60,'#e0d6b9',s+10,.92);
   for(var sg=-1;sg<=1;sg+=2){atlasEye(sg*.27,-.53,.092,s+20+sg,o.eye||0);for(var i=0;i<3;i++)atlasLine([[sg*.52,-.20+i*.08],[sg*1.06,-.28+i*.15]],s+24+i+sg,.85,.9);}
   fill([[-.11,-.39],[.11,-.39],[0,-.28]],{color:INK,jit:.002});atlasLine([[-.12,-.16],[0,-.12],[.12,-.16]],s+31,.8);
   [[-.30,.12],[0,.07],[.30,.12],[-.40,.40],[-.13,.35],[.14,.35],[.40,.40]].forEach(function(v,i){atlasLine([[v[0]-.065,v[1]+.07],[v[0],v[1]],[v[0]+.065,v[1]+.07]],s+40+i,1.8,.8,g.fur);});
 },
 soot:function(h,o){var g=h.g,s=g.seed,p=atlasPulse(o),P=[];
   for(var i=0;i<60;i++){var a=i*TAU/60,r=.62+(i%2?.10:0)+hash2(s,i)*.055;P.push([Math.cos(a)*r,Math.sin(a)*r]);}naturalPaint(P,g.fur,s,1.6,.8);
   for(var sg=-1;sg<=1;sg+=2){atlasEye(sg*.24,-.10,.23,s+20+sg,o.eye||0);atlasLine([[sg*.24,.62],[sg*.34,.87],[sg*.48,.89]],s+30+sg,1.2);}
 },
 gourd_fire:function(h,o){drawGourdChild(h,o,'gourd_fire');},
 gourd_stone:function(h,o){drawGourdChild(h,o,'gourd_stone');},
 gourd_wind:function(h,o){drawGourdChild(h,o,'gourd_wind');},
 gourd_leaf:function(h,o){drawGourdChild(h,o,'gourd_leaf');},
 gourd_water:function(h,o){drawGourdChild(h,o,'gourd_water');},
 gourd_mist:function(h,o){drawGourdChild(h,o,'gourd_mist');},
 gourd_light:function(h,o){drawGourdChild(h,o,'gourd_light');},
 lotus_kid:function(h,o){drawLotusKid(h,o);},
 cloud_dragon:function(h,o){drawCloudDragon(h,o);}
};

/* A single donor changes silhouette at the margins, leaving the face and primary body legible. */
function drawGraft(h,o,front){
 var k=h.g.donor;if(!k)return;var s=h.g.seed+940,col=NATURAL_INFO[k].col[hashInt(s,3)%NATURAL_INFO[k].col.length],p=atlasPulse(o),i;
 if(front){
   if(k==='puffer'){for(i=0;i<11;i++){var a=i*TAU/11;if(Math.sin(a)<-.7)continue;var x=Math.cos(a)*.95,y=Math.sin(a)*.85;atlasLine([[x,y],[x*1.18,y*1.18]],s+i,1.2,.7,col);}}
   else if(k==='sponge'){for(i=0;i<7;i++){var a=i*TAU/7;wash(ring(Math.cos(a)*.58,Math.sin(a)*.53,.055,.04,10),'#b2a65b',s+i,.6,.003);}}
   else if(k==='patrick'){for(i=0;i<3;i++){var x=(i-1)*.37,y=.42;var P=[];for(var j=0;j<10;j++){var a=j*Math.PI/5-Math.PI/2,r=j%2?.03:.07;P.push([x+Math.cos(a)*r,y+Math.sin(a)*r]);}wash(P,col,s+i,.8,.002);}}
   else if(k==='mushroom'){naturalPaint([[-.84,-.67],[-.53,-1.17],[-.11,-1.33],[.4,-1.18],[.86,-.65],[.34,-.77],[-.26,-.77]],col,s,.9,1);for(i=0;i<3;i++)wash(ring((i-1)*.33,-.98+Math.abs(i-1)*.1,.075,.038,14),'#e6d6b6',s+6+i,.8,.003);}
   else if(k==='teapot'){naturalPaint([[-.34,-.91],[-.19,-1.10],[.19,-1.10],[.36,-.91]],col,s,.85,.8);atlasOval(0,-1.15-p*.04,.075,.07,col,s+4,.8);}
   return;
 }
 if(k==='crab' || k==='hermit'){for(var sg=-1;sg<=1;sg+=2){atlasLine([[sg*.64,.12],[sg*1.22,.27],[sg*1.37,-.03]],s+sg,2.2,.9,col);atlasClaw(sg*1.37,-.13,.44,sg,p,col,s+10+sg);}}
 else if(k==='shrimp'){atlasLine([[-.27,-.60],[-.90,-1.10],[-.52,-1.38],[.11,-1.4]],s,1,.85,col);atlasLine([[.24,-.61],[.63,-1.16],[1.16,-1.18]],s+2,1,.85,col);}
 else if(k==='ginkgo'){ctx.save();if(h.g.sp==='shrimp'){ctx.translate(-.21,.78);ctx.rotate(-Math.PI/2+p*.18);ctx.scale(.72,.72);}else{ctx.translate(.15,-.80);ctx.rotate(.35+p*.1);}naturalPaint([[0,0],[-.5,-.3],[-.64,-.65],[-.28,-.78],[0,-.67],[.26,-.8],[.63,-.61],[.51,-.3]],col,s,.9,.9);for(i=-2;i<=2;i++)atlasLine([[0,-.03],[i*.22,-.62]],s+8+i,.5,.5);ctx.restore();}
 else if(k==='cactus'){for(var sg=-1;sg<=1;sg+=2)naturalPaint([[sg*.65,.2],[sg*1.05,.16],[sg*1.1,-.44],[sg*.94,-.53],[sg*.9,-.01],[sg*.63,-.03]],col,s+sg,.85,.9);}
 else if(k==='octopus' || k==='jelly'){for(i=0;i<5;i++){var P=[];for(var j=0;j<=18;j++){var t=j/18;P.push([(i-2)*.23+Math.sin(t*TAU+i+p)*.16*t,.43+t*.78]);}if(k==='octopus')tube(P,.075,.015,col,s+i,.006,true);else atlasLine(P,s+i,1.8,.65,col);}}
 else if(k==='seahorse'){var P=[];for(i=0;i<=35;i++){var t=i/35,a=t*Math.PI*3.3,r=.32*(1-t*.9);P.push([.48+Math.cos(a)*r,.78+Math.sin(a)*r]);}tube(P,.08,.016,col,s,.007,true);}
 else if(k==='manta'){for(var sg=-1;sg<=1;sg+=2)naturalPaint([[sg*.5,-.34],[sg*1.39,-.66+p*.13],[sg*1.11,.16],[sg*.52,.4]],col,s+sg,.65,.85);}
 else if(k==='totoro'){for(var sg=-1;sg<=1;sg+=2)naturalPaint([[sg*.3,-.70],[sg*.36,-1.30],[sg*.54,-1.40],[sg*.6,-.65]],col,s+sg,.85,.85);}
 else if(k==='soot'){for(i=0;i<22;i++){var a=i*TAU/22;atlasLine([[Math.cos(a)*.78,Math.sin(a)*.74],[Math.cos(a)*.96,Math.sin(a)*.91]],s+i,.7,.65,col);}}
 else if(k==='cloud'){for(i=-1;i<=1;i++)atlasOval(i*.43,-.73-Math.abs(i)*.10,.34,.32,col,s+10+i,.55);}
}
var atlasOriginalDraw=Head.prototype.drawNatural;
Head.prototype.drawNatural=function(o){
 var fn=ATLAS_DRAW[this.g.sp];ctx.save();
 // A smaller secondary structure and restrained proportions preserve the primary identity.
 if(this.g.donor)ctx.scale(.87,.87);
 if(fn){var turn=.76+.24*Math.abs(Math.cos(this.yaw));ctx.scale(turn,1);}
 drawGraft(this,o,false);
 if(fn)fn(this,o);else atlasOriginalDraw.call(this,o);
 drawGraft(this,o,true);ctx.restore();
};
var atlasIdentity=identity,atlasSpeciesLine=speciesLine,atlasTraitList=traitList;
var HYBRID_NAMES={'shrimp:ginkgo':'银杏虾信使','cloud:crab':'云钳守卫','octopus:mushroom':'伞帽章鱼','teapot:jelly':'水母茶壶','crab:totoro':'森林蟹','manta:cloud':'云翼鳐','seahorse:ginkgo':'秋叶海马','sponge:octopus':'八臂海绵'};
function hybridName(g){return HYBRID_NAMES[g.sp+':'+g.donor]||(NATURAL_INFO[g.sp].name+' · '+NATURAL_INFO[g.donor].name);}
speciesLine=function(g){return g.donor?hybridName(g):atlasSpeciesLine(g);};
traitList=function(g){return g.donor?[NATURAL_INFO[g.sp].traits[0],'借来：'+NATURAL_INFO[g.donor].traits[0],NATURAL_INFO[g.sp].traits[1]]:atlasTraitList(g);};
identity=function(g){var id=atlasIdentity(g);if(g.donor){id.name=hybridName(g)+' · '+id.first;id.species=hybridName(g);id.traits=traitList(g);id.quirk='保留'+NATURAL_INFO[g.sp].name+'的主体，借来'+NATURAL_INFO[g.donor].name+'的一点本领。'+NATURAL_INFO[g.sp].quirk;id.tier=Math.max(2,id.tier);}return id;};

/* Three finite scenes: anticipation, characteristic action, and a soft return to rest. */
FACE_FIELDS.push('perform','charge');EXCLUSIVE.special=1;
var atlasUpdate=Head.prototype.update;
Head.prototype.update=function(dt,now,look){var o=atlasUpdate.call(this,dt,now,look);o.life=reduceMotion()?0:Math.sin(now*.0018+this.g.idlePhase)*.065;return o;};
defineFx('signature',{channels:['pos','special'],dur:3200,sfx:function(h){if(allow('atlasSignature',90,2))SFX.marimba(penta(h.col+2,220),panOf(h));},step:function(h,a,t,k,d){
 var e=Math.sin(Math.PI*k),p=e*Math.sin(k*TAU*1.5),soft=reduceMotion()?.18:1,sp=h.g.sp;d.perform=p*soft;d.smile=.8;d.eye=k<.13?bump(k/.13)*.75:0;
 if(sp==='shrimp'){d.ox=-Math.sin(Math.PI*k)*.35*soft;d.roll=-p*.14*soft;}
 else if(sp==='crab'){d.ox=Math.sin(k*TAU*2)*e*.25*soft;d.roll=p*.05*soft;}
 else if(sp==='puffer'){d.hs=e*.12*soft;d.perform=e*soft;}
 else if(sp==='sponge' || sp==='soot'){d.oy=-Math.abs(p)*.30*soft;d.roll=p*.11*soft;}
 else if(sp==='patrick'){d.roll=p*.28*soft;d.eye=.6*e;}
 else if(sp==='hermit'){d.perform=e*soft;d.oy=e*.04*soft;}
 else if(sp==='totoro'){d.hs=e*.025*soft;d.perform=e*soft;}
 else{d.oy=-e*.07*soft;d.roll=p*.10*soft;}
}});
var ATLAS_BUBBLES=[];
function addAtlasBubble(h){if(ATLAS_BUBBLES.length>=72)return;ATLAS_BUBBLES.push({x:h.x,y:h.y-h.s*.12,s:h.s,t:performance.now(),col:h.g.fur,seed:h.g.seed});}
defineFx('bubbleReply',{channels:['pos','special'],dur:2400,start:function(h){addAtlasBubble(h);},sfx:function(h){if(allow('atlasBubble',100,2))SFX.pop(panOf(h),400+hashInt(h.g.seed,2)%250);},step:function(h,a,t,k,d){var e=bump(k),soft=reduceMotion()?.2:1;d.charge=e;d.perform=e*.6*soft;d.mouth=e*.6;d.oy=-e*.09*soft;d.smile=1;d.gazeY=-.5;}});
defineFx('tideDance',{channels:['pos','special'],dur:5400,step:function(h,a,t,k,d){var e=bump(k),soft=reduceMotion()?.15:1,phase=(a.phase||0)+k*TAU;d.ox=Math.cos(phase)*e*.38*soft;d.oy=Math.sin(phase)*e*.25*soft;d.roll=Math.sin(phase)*e*.15*soft;d.perform=Math.sin(phase)*e*soft;d.smile=.8;}});
var oldAtlasDrawGrid=drawGrid;
drawGrid=function(dt,now){oldAtlasDrawGrid(dt,now);if(!ATLAS_BUBBLES.length)return;ctx=gctx;ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ATLAS_BUBBLES=ATLAS_BUBBLES.filter(function(b){return now-b.t<4100;});ATLAS_BUBBLES.forEach(function(b){var k=(now-b.t)/4100;if(k<0)return;var soft=reduceMotion()?.18:1,x=b.x+Math.sin(k*TAU+b.seed)*b.s*.18*soft,y=b.y-k*b.s*2.4*soft,r=b.s*(.075+Math.sin(k*Math.PI)*.10),a=Math.sin(k*Math.PI)*.55;ctx.globalAlpha=a;ctx.strokeStyle=b.col;ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();ctx.strokeStyle='#fffdf5';ctx.beginPath();ctx.arc(x,y,r*.73,Math.PI*1.04,Math.PI*1.55);ctx.stroke();});ctx.restore();};
function runAtlasShow(name){if(SUPER || cardOpen){toast('先回到图鉴，再开始这一幕。');return;}ATLAS_BUBBLES=[];var actions={signature:['各显神通','signature'],relay:['泡泡接力','bubbleReply'],tide:['潮汐圆舞','tideDance']},a=actions[name];if(!a)return;heads.forEach(function(h,i){act(h,a[1],{delay:reduceMotion()?0:i*(name==='relay'?180:45),phase:i*.51});});document.getElementById('atlasStatus').textContent=a[0]+' · 动作结束后回到原位';}

var atlasStudioScene=applyStudioScene;
var ATLAS_SCENES={
 tidal:{cols:4,rows:2,styles:['watercolor'],paper:'sky',density:.85,pigment:1.08,wetness:.60,characters:SEA},
 cartoons:{cols:2,rows:2,styles:['watercolor'],paper:'cream',density:.68,pigment:1.16,wetness:.35,characters:CARTOONS},
 hybrids:{cols:3,rows:2,styles:['watercolor'],paper:'xuan',density:.82,pigment:1.04,wetness:.55,characters:[['shrimp','ginkgo'],['cloud','crab'],['octopus','mushroom'],['teapot','jelly'],['manta','cloud'],['seahorse','ginkgo']]}
};
applyStudioScene=function(name){
 if(!ATLAS_SCENES[name]){ATLAS_BUBBLES=[];return atlasStudioScene(name);}var set=ATLAS_SCENES[name];if(cardOpen)closeCard();pushUndo();endBrush();SUPER=null;document.body.classList.remove('super');ATLAS_BUBBLES=[];MODE=name==='tidal'?6:name==='cartoons'?7:8;studioScene=name;
 Object.assign(CFG,{cols:set.cols,rows:set.rows,styles:set.styles.slice(),paper:set.paper,density:set.density,pigment:set.pigment,wetness:set.wetness,palettes:[],palMode:'accents',mono:false,composition:'grid',scale:1,chain:'few'});applyTheme();layout();
 heads.forEach(function(h,i){if(isKept(h.code))return;var item=set.characters[i%set.characters.length],kind=Array.isArray(item)?item[0]:item,donor=Array.isArray(item)?item[1]:null;clearActs(h);h.setDNA(atlasDNA(kind,hashInt(9500+i*83,name.length*13),donor));h.pop=1;});
 saveCfg();syncPanel();document.querySelectorAll('[data-scene]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.scene===name?'true':'false');});toast(name==='hybrids'?'新物种有两种来历。去“头像与混生”交换主体，会看到新的形象。':'点“各显神通”，每一位都用自己的方式打招呼。',3000);
};
function focusAtlasCharacter(kind,donor){var d=atlasDNA(kind,randSeed(),donor);if(!d)return false;if(cardOpen)closeCard();pushUndo();SUPER=null;document.body.classList.remove('super');endBrush();ATLAS_BUBBLES=[];studioScene='';Object.assign(CFG,{cols:1,rows:1,composition:'portrait',styles:['watercolor'],palettes:[],paper:'cream',mono:false,pigment:1.1});applyTheme();layout();clearActs(heads[0]);heads[0].setDNA(d);heads[0].pop=1;saveCfg();syncPanel();toggleAtlasLibrary(false);document.querySelectorAll('[data-scene]').forEach(function(b){b.setAttribute('aria-pressed','false');});runAtlasShow('signature');return true;}
function toggleAtlasLibrary(open){var el=document.getElementById('atlasLibrary');if(open==null)open=el.hidden;el.hidden=!open;if(open){if(cardOpen)closeCard();if(panelOpen)togglePanel(false);buildAtlasLibrary();document.getElementById('atlasClose').focus();}else document.getElementById('atlasOpen').focus();}
function buildAtlasLibrary(){
 var box=document.getElementById('atlasCards');box.innerHTML='';var last='';
 NATURAL.concat(Object.keys(LEGACY_LABELS)).forEach(function(k,i){var info=NATURAL_INFO[k]||{name:LEGACY_LABELS[k],family:'人物、动物与老朋友'},fam=info.family||'花园与异物';if(fam!==last){var label=document.createElement('div');label.className='atlasGroup';label.textContent=fam;box.appendChild(label);last=fam;}var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','查看'+info.name);var c=document.createElement('canvas');b.appendChild(c);var label=document.createElement('span');label.textContent=info.name;b.appendChild(label);box.appendChild(b);miniPortrait(c,atlasDNA(k,431+i*71),110,0,null);b.addEventListener('click',function(){focusAtlasCharacter(k);});});
 ['fusionBase','fusionDonor'].forEach(function(id){var sel=document.getElementById(id),old=sel.value;sel.innerHTML='';NATURAL.forEach(function(k){var opt=document.createElement('option');opt.value=k;opt.textContent=NATURAL_INFO[k].name;sel.appendChild(opt);});sel.value=NATURAL.indexOf(old)>=0?old:(id==='fusionBase'?'shrimp':'ginkgo');});
}
document.getElementById('atlasOpen').addEventListener('click',function(){toggleAtlasLibrary();});
document.getElementById('atlasClose').addEventListener('click',function(){toggleAtlasLibrary(false);});
document.getElementById('fusionCreate').addEventListener('click',function(){var a=document.getElementById('fusionBase').value,b=document.getElementById('fusionDonor').value;if(a===b){document.getElementById('fusionHint').textContent='换一位不同的伙伴，才能借来新的结构。';return;}focusAtlasCharacter(a,b);});
document.getElementById('atlasSignature').addEventListener('click',function(){runAtlasShow('signature');});
document.getElementById('atlasRelay').addEventListener('click',function(){runAtlasShow('relay');});
document.getElementById('atlasTide').addEventListener('click',function(){runAtlasShow('tide');});
document.getElementById('atlasMeet').addEventListener('click',function(){runAtlasShow('meet');});
document.getElementById('atlasFocus').addEventListener('click',function(){runOrchestration('focus');});
document.getElementById('atlasQuiet').addEventListener('click',function(){runOrchestration('quiet');});
document.getElementById('atlasSeries').addEventListener('click',function(){runOrchestration('series');});
document.getElementById('atlasLibrary').addEventListener('keydown',function(e){if(e.key==='Escape'){toggleAtlasLibrary(false);e.preventDefault();}e.stopPropagation();});
window.addEventListener('keydown',function(e){if(e.key==='Escape'&&!document.getElementById('atlasLibrary').hidden){toggleAtlasLibrary(false);e.stopPropagation();}});
var atlasImportCode=importCode;
importCode=function(str){var ok=atlasImportCode(str);if(ok){ATLAS_BUBBLES=[];studioScene='';if(String(str).trim().indexOf('hcs1.')===0){MODE=heads.every(function(h){return !!h.g.donor;})?8:heads.every(function(h){return SEA.indexOf(h.g.sp)>=0;})?6:heads.every(function(h){return CARTOONS.indexOf(h.g.sp)>=0;})?7:0;}document.querySelectorAll('[data-scene]').forEach(function(b){b.setAttribute('aria-pressed','false');});}return ok;};
