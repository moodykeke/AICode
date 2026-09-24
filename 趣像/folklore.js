/* Append-only DNA catalogue. Traditional motifs are re-drawn as paper puppets.
   Palettes below are art direction, not historical colour reconstructions. */
var FOLK_SERIES={
 guofeng:{name:'国风葫芦',en:'Gourd paper puppets',paper:'xuan',keys:[],palette:['#b34436','#d39b40','#d7bd59','#648366','#658f8d','#42677b','#826284']},
 journey:{name:'西游行旅',en:'Journey to the West',paper:'cream',keys:[],palette:['#b74f38','#c3a264','#436d69','#343e42']},
 shanhai:{name:'山海异兽',en:'Mountains and Seas',paper:'xuan',keys:[],palette:['#668d83','#b45241','#d4c5a0','#46566a']},
 yokai:{name:'百鬼小町',en:'Yokai neighbourhood',paper:'cream',keys:[],palette:['#52636d','#bc6651','#98a185','#d6c79f']},
 giants:{name:'欧洲神话人物',en:'European mythic figures',paper:'cream',keys:[],palette:['#778778','#758fa4','#ac815a','#4c5960']}
};
var FOLK_INFO={};
function folkRegister(key,name,en,series,kind,col,traits,quirk,extra){
 var info=Object.assign({name:name,en:en,series:series,kind:kind,col:[col[0]],pigments:col,traits:traits,quirk:quirk,family:FOLK_SERIES[series].name,support:'figure'},extra||{});
 FOLK_INFO[key]=info;FOLK_SERIES[series].keys.push(key);NATURAL.push(key);NATURAL_INFO[key]=info;SPNAME[key]=name;FURS[key]=[col[0]];SP_RARITY[key]=3;
}
['大娃','二娃','三娃','四娃','五娃','六娃','七娃'].forEach(function(name,i){var gourdKinds=['fire','stone','wind','leaf','water','mist','light'];folkRegister('folk_gourd_'+(i+1),'国风葫芦 · '+name,'Gourd brother '+(i+1),'guofeng',gourdKinds[i],[FOLK_SERIES.guofeng.palette[i],'#697c4b','#edcea1'],['葫芦叶冠','黑发短褂','彩色腰封'],'把山风收进葫芦，再向邻座行一个礼。',{ordinal:i});});
folkRegister('west_monkey','悟空 · 云步','Wukong','journey','monkey',['#b64e36','#cfa652','#e5c194'],['金箍桃形脸','虎纹短裙','随身长棒'],'收起筋斗，先站稳脚下这一小片云。');
folkRegister('west_pig','八戒 · 荷扇','Bajie','journey','pig',['#595b67','#a99879','#d8b29b'],['扇形大耳','圆鼻与圆腹','月牙钉耙'],'把钉耙当成路标，停下来等大家。');
folkRegister('west_monk','唐僧 · 行灯','Tang monk','journey','monk',['#b9573e','#cdb26c','#e6c7a3'],['三瓣僧帽','交叠袈裟','环首禅杖'],'衣角轻摆，步子总是从容。');
folkRegister('west_sandy','沙僧 · 流沙','Sandy','journey','sandy',['#497877','#bd8d52','#b98b66'],['卷髯','大珠项链','月牙铲'],'不抢第一声，稳稳接住最后一声。');
folkRegister('hill_fox','青丘 · 九尾','Nine-tailed fox','shanhai','fox',['#e0caa2','#bc5844','#668c81'],['九尾扇面','尖耳短吻','前爪承托'],'九条尾巴一齐安静下来，比开屏还需要耐心。',{support:'beast'});
folkRegister('hill_bifang','毕方 · 独足','Bifang','shanhai','bird',['#537f88','#b8503d','#ddd5b9'],['独足立姿','白喙','青羽赤纹'],'抬起一片羽，风便有了颜色。',{support:'beast'});
folkRegister('hill_dijiang','帝江 · 鼓舞','Dijiang','shanhai','dijiang',['#b75948','#cc985b','#d8c4a1'],['六足','四翼','无面卵形'],'没有五官，也能用六只脚打出拍子。',{support:'beast'});
folkRegister('yokai_kappa','河童 · 荷皿','Kappa','yokai','kappa',['#79917a','#bfaa64','#d3c4a1'],['头顶水皿','浅色面盘','扁平短喙'],'鞠躬之前，先护住头顶的小水塘。');
folkRegister('yokai_tengu','天狗 · 羽扇','Tengu','yokai','tengu',['#b85143','#3f5665','#ccb787'],['侧向长鼻','小黑帽','墨色眉须'], '用羽扇扇出一阵有礼貌的风。');
folkRegister('yokai_umbrella','伞怪 · 雨歇','Umbrella spirit','yokai','umbrella',['#b7a373','#5d7580','#b36551'],['伞面轮廓','克制独眼','疏朗伞骨'],'雨停以后，仍想再蹦一小步。');
folkRegister('giant_moss','苔岩特洛尔','Nordic troll','giants','moss',['#687563','#aab485','#806c55'],['宽颊方脸','苔色短发','横向尖耳'],'让森林的重量停在肩上，苔藓便有了自己的山脊。',{support:'bust',legend:'Nordic troll'});
folkRegister('giant_frost','约顿 · 霜冠','Jotunn frost','giants','frost',['#647f92','#d7d9d0','#4d5e70'],['冰脊额冠','长脸白髯','霜蓝窄肩'],'霜线从眉骨落下，越过他的肩，结成一座安静的山。',{support:'bust',legend:'Norse jötunn'});
folkRegister('giant_cloud','阿特拉斯 · 云穹','Atlas of clouds','giants','cloudgiant',['#a78b71','#cdb38d','#58645f'],['云穹短弧','卷发方髯','赭色窄肩'],'他托住天体的弧线，也把每一次呼吸放得很慢。',{support:'bust',legend:'Greek Atlas'});
folkRegister('euro_medusa','美杜莎 · 蛇冠','Medusa · Stone Gaze','giants','medusa',['#788b7c','#c7c7ab','#566b68'],['盘曲蛇发','平静凝视','浅玉面色'],'她不需要提高声音，石头会替她回答。',{support:'bust',legend:'Greek Gorgon'});
folkRegister('euro_cernunnos','塞尔努诺斯 · 林角','Cernunnos · Green Horns','giants','cernunnos',['#526d5c','#c8b591','#46534a'],['分叉鹿角','尖耳窄脸','深色短髯'],'鹿角把森林的方向标在额头上。',{support:'bust',legend:'Celtic horned god'});
folkRegister('euro_valkyrie','瓦尔基里 · 乌翼','Valkyrie · Black Wing','giants','valkyrie',['#677b86','#d5c7ad','#384958'],['银灰翼盔','收窄下颌','金色侧发'],'她只抬眼一次，风就知道该往哪边走。',{support:'bust',legend:'Norse valkyrie'});
folkRegister('euro_dryad','德律阿得 · 橡叶','Dryad · Oak Spirit','giants','dryad',['#829070','#d6c5a0','#4f6349'],['侧簇橡叶','圆润脸型','苔绿发幕'],'树轮在她脸上慢慢长成一张地图。',{support:'bust',legend:'Greek dryad'});
folkRegister('euro_faun','法翁 · 牧笛','Faun · Reed Piper','giants','faun',['#a78269','#d1b084','#68544a'],['短角卷发','横向尖耳','微翘嘴角'],'他吹出的不是曲子，是一条会拐弯的小路。',{support:'bust',legend:'Roman faun'});
folkRegister('euro_minotaur','米诺陶 · 迷宫','Minotaur · Labyrinth','giants','minotaur',['#735f58','#b8936d','#443b3b'],['外展牛角','宽鼻口吻','独立双眼'],'迷宫没有出口，但他的额头记得每一面墙。',{support:'bust',legend:'Greek Minotaur'});

function folkPaint(P,c,s,alpha,width){naturalPaint(P,c,s,alpha==null?.96:alpha,width==null?.9:width);}
function folkOval(x,y,rx,ry,c,s){atlasOval(x,y,rx,ry,c,s,.96);}
function folkFace(h,o,skin,wide){var s=h.g.seed;folkOval(0,-.39,wide||.57,.56,skin,s+20);naturalEyes(h,o,0,-.38,.20);atlasLine([[-.32,-.60],[-.15,-.62]],s+21,1.2,.7);atlasLine([[.15,-.62],[.32,-.60]],s+22,1.2,.7);}
function folkBrow(info,s,p){
 var k=info.kind;
 if(k==='fire')atlasLine([[-.30,-.60],[-.12,-.66],[.02,-.60]],s+70,1.25,.78,info.pigments[1]);
 else if(k==='stone')atlasLine([[-.32,-.57],[-.12,-.55]],s+70,2.6,.8,'#5b5146');
 else if(k==='wind')atlasLine([[-.33,-.62],[-.12,-.55],[.02,-.60]],s+70,1,.72,info.pigments[1]);
 else if(k==='leaf')atlasLine([[-.30,-.56],[-.16,-.63]],s+70,1.6,.72,'#4e6448');
 else if(k==='water')atlasLine([[-.34,-.60],[-.15,-.62]],s+70,1,.75,'#3f7180');
 else if(k==='mist')atlasLine([[-.28,-.61],[-.12,-.57]],s+70,1,.52,'#b8a9c5');
 else atlasLine([[-.31,-.60],[-.14,-.62]],s+70,1,.75,info.pigments[1]);
 if(k==='light')folkOval(0,-.27,.045,.045,info.pigments[2],s+71);
}
function folkFooting(h,kind){
 var s=h.g.seed,water=kind==='water',col=water?'#92aaa7':kind==='cloud'?'#adbbba':'#b8aa8f';
 wash(ring(0,1.47,1.13,.12,28),col,s+900,.22,.006);
 atlasLine([[-1.05,1.46],[-.56,1.52],[.12,1.53],[.72,1.50],[1.04,1.45]],s+901,.65,.33,col);
 if(water)atlasLine([[-.89,1.36],[-.42,1.32],[.13,1.37],[.80,1.31]],s+902,.65,.32,col);
}
function folkRobe(h,o,c,accent,wide){
 var s=h.g.seed,w=wide||.66,p=atlasPulse(o)*.04;
 folkPaint([[-.28,.08],[-w,.27],[-w-.12,.84],[-.41,1.07],[.41,1.07],[w+.12,.84],[w,.27],[.28,.08]],c,s+2);
 folkPaint([[-.28,.10],[0,.47],[.28,.10],[.16,.66],[-.10,.78]],accent,s+3);
 atlasLine([[-w,.3],[-w-.2,.63+p],[-w-.07,.8]],s+4,2,.85,c);atlasLine([[w,.3],[w+.2,.61-p],[w+.07,.8]],s+5,2,.85,c);
 for(var sg=-1;sg<=1;sg+=2){folkPaint([[sg*.11,.98],[sg*.4,.98],[sg*.46,1.36],[sg*.10,1.36]],'#414946',s+6+sg);}
 atlasLine([[-.44,.77],[0,.82],[.44,.77]],s+8,2,.85,accent);
}
function folkGourd(h,o,info){
 var s=h.g.seed,c=h.g.fur,leaf=info.pigments[1],skin=info.pigments[2],p=atlasPulse(o);
 var widths={fire:.64,stone:.80,wind:.58,leaf:.70,water:.66,mist:.62,light:.72};
 folkRobe(h,o,c,leaf,widths[info.kind]||.66);folkFace(h,o,skin,info.kind==='stone'?.64:info.kind==='wind'?.55:.60);folkBrow(info,s,p);
 folkPaint([[-.62,-.35],[-.67,-.79],[-.39,-1.03],[0,-1.09],[.44,-1.0],[.65,-.70],[.59,-.34],[.36,-.57],[.30,-.78],[0,-.66],[-.32,-.81],[-.38,-.57]],'#323b39',s+30);
 for(var sg=-1;sg<=1;sg+=2){folkPaint([[sg*.02,-1.03],[sg*.34,-1.30],[sg*.49,-1.02],[sg*.18,-.94]],leaf,s+32+sg);}
 folkOval(0,-1.23,.15,.17,c,s+36);folkOval(.01,-1.44,.105,.105,c,s+37);atlasLine([[0,-1.53],[.06,-1.63],[.15,-1.59]],s+38,.8,.9,leaf);
 // Each brother has a distinctive sash seal as well as his principal hue.
 for(var i=0;i<=info.ordinal;i++)folkOval(-.18+(i%4)*.12,.84+Math.floor(i/4)*.11,.027,.027,skin,s+40+i);
 atlasLine([[.35,.78],[.72,.93+p*.09],[.92,.77+p*.06]],s+50,2.7,.8,c);
 // One silhouette cue per brother: these are structural props, not alternate swatches.
 if(info.kind==='fire'){
  folkPaint([[-.72,.18],[-1.03,-.05],[-.93,-.36],[-.70,-.20],[-.61,-.51],[-.42,-.17]],info.pigments[1],s+80,.9,.75);
  folkPaint([[.56,.12],[.82,-.11],[.72,-.42],[.57,-.24],[.45,-.47],[.36,-.12]],info.pigments[1],s+81,.9,.75);
 }else if(info.kind==='stone'){
  folkPaint([[-.88,.22],[-1.22,.04],[-1.15,.57],[-.85,.72],[-.62,.45],[-.71,.12]],info.pigments[1],s+80,.95,1.1);
  atlasLine([[-1.10,.16],[-.86,.40],[-1.06,.57]],s+81,1,.75,c);
 }else if(info.kind==='wind'){
  atlasLine([[.38,.08],[.82,-.15],[1.16,.02],[1.42,-.26]],s+80,2.8,.78,info.pigments[2]);
  atlasLine([[.46,.20],[.92,.40],[1.22,.29],[1.48,.48]],s+81,1.25,.68,leaf);
 }else if(info.kind==='leaf'){
  ctx.save();ctx.translate(-.58,.12);ctx.rotate(-.34+p*.08);folkPaint([[0,0],[-.46,-.31],[-.42,-.76],[-.07,-.57],[.25,-.82],[.31,-.32]],info.pigments[1],s+80,.92,.85);atlasLine([[0,.03],[.06,-.63]],s+81,.75,.7,c);ctx.restore();
  atlasLine([[.42,.56],[.74,.39],[.83,.12]],s+82,1.1,.72,leaf);
 }else if(info.kind==='water'){
  for(var w=0;w<3;w++)atlasLine([[-.78,.44+w*.12],[-.36,.31+w*.08],[.06,.45+w*.08],[.56,.30+w*.11]],s+80+w,1.7,.68,info.pigments[2]);
  folkOval(.66,-.24,.07,.10,info.pigments[2],s+84);folkOval(.66,-.39,.04,.06,info.pigments[1],s+85);
 }else if(info.kind==='mist'){
  folkPaint([[-.69,.06],[-.93,.38],[-.72,.78],[0,.92],[.73,.78],[.94,.38],[.68,.05],[.39,.18],[0,.08],[-.38,.18]],info.pigments[1],s+80,.34,.7);
  for(var m=-1;m<=1;m++)folkOval(m*.28,-.02-Math.abs(m)*.09,.24,.14,info.pigments[2],s+83+m);
 }else if(info.kind==='light'){
  folkPaint([[-.28,.17],[-.22,.68],[0,.82],[.22,.68],[.28,.17]],info.pigments[2],s+80,.88,.7);
  atlasLine([[-.18,.25],[.18,.25]],s+81,1,.8,info.pigments[1]);atlasLine([[0,.18],[0,.70]],s+82,.7,.7,info.pigments[1]);
  folkOval(.88,-.30,.10,.10,info.pigments[2],s+83);atlasLine([[.88,-.20],[.88,.28]],s+84,.85,.8,info.pigments[1]);
 }
}
function folkJourney(h,o,info){
 var s=h.g.seed,k=info.kind,c=h.g.fur,a=info.pigments[1],skin=info.pigments[2];
 folkRobe(h,o,c,a,k==='pig'?.83:.66);
 // Props sit behind the face and stay within the avatar safety circle.
 atlasLine([[.94,1.30],[.89,-1.12]],s+60,2.8,.95,a);
 if(k==='monk'){folkOval(.89,-1.13,.14,.17,a,s+61);folkOval(.76,-1.02,.045,.07,a,s+62);folkOval(1.02,-1.02,.045,.07,a,s+63);}
 if(k==='pig'){atlasLine([[.53,-.95],[1.22,-.95]],s+61,2,.9,a);for(var i=0;i<5;i++)atlasLine([[.55+i*.16,-.95],[.57+i*.16,-1.13]],s+62+i,1,.9,a);}
 if(k==='sandy')folkPaint([[.66,-1.05],[.84,-1.20],[1.08,-1.09],[.98,-.85],[.81,-.86]],a,s+61);
 if(k==='pig'){for(var sg=-1;sg<=1;sg+=2)folkPaint([[sg*.47,-.60],[sg*.89,-.72],[sg*.76,-.19],[sg*.43,-.24]],skin,s+70+sg);}
 folkFace(h,o,skin,k==='pig'?.66:.56);
 if(k==='monkey'){
  folkPaint([[-.53,-.18],[-.64,-.66],[-.39,-1.02],[0,-.88],[.37,-1.02],[.62,-.64],[.51,-.18],[.31,-.45],[0,-.64],[-.30,-.44]],c,s+30);
  atlasLine([[-.52,-.74],[0,-.85],[.52,-.74]],s+31,2.4,.95,a);folkOval(0,-.80,.09,.07,a,s+32);
  for(var i=0;i<3;i++)atlasLine([[-.4+i*.25,.88],[-.31+i*.25,1.02]],s+33+i,1.6,.75,'#453e35');
 }else if(k==='pig'){
  folkOval(0,-.17,.25,.16,'#b98374',s+30);folkOval(-.095,-.18,.032,.046,'#574844',s+31);folkOval(.095,-.18,.032,.046,'#574844',s+32);
  folkPaint([[-.60,-.72],[-.46,-1.02],[.28,-1.06],[.59,-.73]],c,s+33);
 }else if(k==='monk'){
  folkPaint([[-.58,-.74],[-.48,-1.18],[-.24,-1.01],[0,-1.45],[.25,-1.01],[.48,-1.18],[.58,-.74]],a,s+30);folkOval(0,-1.05,.065,.095,c,s+31);
  atlasLine([[-.45,.31],[.48,.68]],s+33,1,.85,skin);atlasLine([[-.45,.56],[.39,.94]],s+34,1,.85,skin);
 }else{
  folkPaint([[-.54,-.14],[-.37,.28],[0,.46],[.40,.22],[.54,-.14],[.23,-.02],[0,-.13],[-.24,-.02]],'#414a47',s+30);
  atlasLine([[-.52,-.80],[0,-.94],[.52,-.80]],s+31,3,.95,c);
  for(var i=0;i<7;i++){var t=i*Math.PI/6;folkOval(Math.cos(t)*.47,.33+Math.sin(t)*.19,.065,.065,a,s+40+i);}
 }
}
function folkBeast(h,o,info){
 var s=h.g.seed,c=h.g.fur,a=info.pigments[1],b=info.pigments[2],p=atlasPulse(o);
 if(info.kind==='fox'){
  for(var i=0;i<9;i++){var ang=-Math.PI*.44+i*Math.PI*.11+p*.035,len=1.25+.85*Math.cos(ang);ctx.save();ctx.translate(0,.59);ctx.rotate(ang);folkPaint([[0,.2],[-.13,-.25],[-.17,-len*.7],[0,-len],[.16,-len*.7],[.12,-.25]],i%2?b:c,s+50+i);ctx.restore();}
  folkOval(0,.56,.49,.63,c,s+1);for(var sg=-1;sg<=1;sg+=2){folkOval(sg*.28,1.20,.18,.13,c,s+2+sg);folkPaint([[sg*.20,-.46],[sg*.52,-1.14],[sg*.65,-.39]],a,s+4+sg);}
  folkPaint([[-.60,-.47],[-.43,-.69],[0,-.47],[.43,-.69],[.60,-.47],[.33,.03],[0,.23],[-.33,.03]],c,s+8);naturalEyes(h,o,0,-.34,.23);folkOval(0,.06,.045,.033,a,s+12);
 }else if(info.kind==='bird'){
  atlasLine([[0,.65],[.02,1.27],[-.25,1.35],[.28,1.35]],s+2,2,.95,a);
  folkPaint([[-.20,.83],[-.59,.32],[-.48,-.25],[-.13,-.56],[.21,-.94],[.43,-.79],[.31,-.22],[.57,.40],[.28,.89]],c,s+4);
  folkPaint([[.13,.25],[.75,-.11+p*.13],[1.04,-.58+p*.11],[.92,.19],[.45,.68]],a,s+5);
  folkPaint([[.29,-.79],[.80,-.68],[.32,-.59]],b,s+6);atlasEye(.17,-.74,.067,s+7,o.eye||0);
  for(var i=0;i<3;i++)folkOval(-.17+i*.12,.22+i*.13,.06,.1,a,s+8+i);
 }else{
  for(var sg=-1;sg<=1;sg+=2){for(var i=0;i<2;i++)folkPaint([[sg*.34,.16],[sg*(.75+i*.25),-.70+i*.3+p*.1],[sg*(1.04+i*.12),-.28+i*.35],[sg*.51,.48]],b,s+10+i+sg);for(var j=0;j<3;j++)atlasLine([[sg*(.2+j*.2),.72],[sg*(.25+j*.25),1.22],[sg*(.43+j*.25),1.33]],s+20+j+sg,2,.95,a);}
  folkOval(0,.20,.65,.76,c,s+1);atlasSpiral(0,.17,.20,1.2,s+30,a,.8,0);
 }
}
/* Portrait coordinates are shared by face, hair and shoulder; no nested head
   scaling. The chin overlaps a short neck that is hidden by the low neckline. */
FOLK_SERIES.yokai.keys.forEach(function(k){FOLK_INFO[k].support='bust';});
function folkShape(P,c,s){
 // Preserve intended corners through the common hand-drawn smoothing pass.
 var q=[];P.forEach(function(p,i){var a=P[(i+P.length-1)%P.length],b=P[(i+1)%P.length];q.push([p[0]*.88+a[0]*.12,p[1]*.88+a[1]*.12],[p[0]*.88+b[0]*.12,p[1]*.88+b[1]*.12]);});folkPaint(q,c,s);
}
function folkBustBase(h,o,c,skin){
 var s=h.g.seed;
 folkShape([[-.20,.47],[.20,.47],[.23,.87],[-.23,.87]],skin,s+110);
 folkShape([[-1.02,1.10],[-.65,.98],[-.24,.84],[0,.92],[.24,.84],[.65,.98],[1.02,1.10]],c,s+111);
}
function folkPortraitEyes(h,o,y,sep,slant){
 var s=h.g.seed,gx=(o.gazeX||0)*.045,gy=(o.gazeY||0)*.025,blink=clamp(o.eye||0,0,1);
 for(var sg=-1;sg<=1;sg+=2){var x=sg*sep;
  atlasLine([[x-.11,y-.16+sg*(slant||0)],[x,y-.19],[x+.11,y-.16-sg*(slant||0)]],s+sg+130,1.4,.9);
  if(blink>.65)atlasLine([[x-.07,y],[x,y+.025],[x+.07,y]],s+sg+135,.9,.9);
  else {fill(ring(x+gx,y+gy,.035,.048*(1-blink)+.006,12),{color:INK,jit:0});atlasLine([[x-.09,y-.018],[x-.02,y-.035],[x+.075,y-.005]],s+sg+140,.65,.7);}
 }
}
function folkPortraitMouth(h,o,y,w){var k=(FOLK_INFO[h.g.sp]||{}).kind,smile=k==='medusa'||k==='valkyrie'?.003:k==='faun'?.06:.025;atlasLine([[-w,y],[0,y+smile+(o.smile||0)*.015],[w,y-(k==='faun'?.04:.007)]],h.g.seed+145,.85,.85);}
function folkProfileNose(h,x,y){atlasLine([[x,y],[x-.04,y+.17],[x+.055,y+.19]],h.g.seed+146,.85,.72);}
function folkLeaf(x,y,angle,c,s){ctx.save();ctx.translate(x,y);ctx.rotate(angle);folkShape([[0,.14],[-.13,-.03],[-.08,-.25],[0,-.38],[.09,-.23],[.13,-.04]],c,s);atlasLine([[0,.1],[0,-.25]],s+1,.55,.55);ctx.restore();}
function folkAntlers(s,c){
 for(var sg=-1;sg<=1;sg+=2){
  atlasLine([[sg*.48,-.79],[sg*.62,-1.11],[sg*.78,-1.32],[sg*.83,-1.60]],s+sg,3,.95,c);
  atlasLine([[sg*.68,-1.22],[sg*1.02,-1.30],[sg*1.13,-1.49]],s+sg+2,2,.95,c);
  atlasLine([[sg*.61,-1.08],[sg*.43,-1.29],[sg*.44,-1.47]],s+sg+4,1.9,.95,c);
 }
}
function folkEuropean(h,o,info){
 var s=h.g.seed,k=info.kind,c=h.g.fur,skin=info.pigments[1],a=info.pigments[2],hair=a;
 folkBustBase(h,o,c,skin);
 if(k==='cernunnos')folkAntlers(s+180,a);
 // Back silhouettes frame the large face, instead of floating above it.
 if(k==='medusa'){
  folkOval(0,-.24,.94,.99,c,s+1);
  [[-.70,-.72,-.3],[.63,-.86,.4],[-.77,.09,.4],[.74,.25,-.3]].forEach(function(v,i){ctx.save();ctx.translate(v[0],v[1]);ctx.rotate(v[2]);folkShape([[0,.29],[-.17,.02],[-.16,-.30],[.02,-.46],[.24,-.37],[.27,-.22],[.13,-.16],[.03,-.27],[-.03,-.17],[.07,.07]],c,s+10+i);fill(ring(.18,-.30,.022,.023,10),{color:INK,jit:0});ctx.restore();});
 }else if(k==='valkyrie'){
  folkShape([[-.64,-.69],[-.77,.67],[-.52,.90],[-.37,.64],[.37,.64],[.53,.9],[.77,.67],[.64,-.69]],'#d0b17a',s+1);
 }else if(k==='dryad'){
  folkOval(0,-.18,.85,1.02,c,s+1);
 }else if(k==='cloudgiant')folkOval(0,-.18,.82,.94,a,s+1);
 // Ears belong behind the face. Beast ears are pointed and swept sideways.
 if(k==='faun'||k==='cernunnos'||k==='minotaur'||k==='moss'){
  for(var sg=-1;sg<=1;sg+=2)folkShape([[sg*.61,-.35],[sg*1.04,-.54],[sg*.95,-.19],[sg*.64,-.02]],skin,s+20+sg);
 }else if(k!=='medusa'&&k!=='dryad'){
  folkOval(-.69,-.02,.115,.19,skin,s+22);folkOval(.69,-.02,.115,.19,skin,s+23);
 }
 var face=k==='moss'?[[-.68,-.69],[-.35,-.93],[.30,-.91],[.72,-.63],[.78,.19],[.48,.60],[-.37,.65],[-.78,.24]]:
  k==='frost'?[[-.60,-.75],[0,-1.03],[.58,-.73],[.63,.25],[.27,.65],[-.25,.65],[-.64,.22]]:
  k==='minotaur'?[[-.65,-.70],[-.34,-.95],[.33,-.95],[.66,-.7],[.72,.10],[.50,.64],[-.50,.64],[-.72,.10]]:
  k==='valkyrie'?[[-.61,-.70],[0,-.98],[.60,-.70],[.62,.16],[.33,.60],[.02,.74],[-.39,.53],[-.65,.1]]:
  k==='faun'?[[-.66,-.60],[-.29,-.97],[.38,-.88],[.68,-.53],[.62,.26],[.21,.71],[-.24,.67],[-.68,.20]]:
  ring(0,-.12,k==='medusa'?.67:k==='cloudgiant'?.70:.66,.85,32);
 folkPaint(face,skin,s+30);
 // Each face has a different brow rhythm, spacing, nose and mouth.
 folkPortraitEyes(h,o,k==='minotaur'?-.22:-.12,k==='moss'?.34:k==='minotaur'?.36:.27,k==='valkyrie'?.035:k==='faun'?-.035:0);
 if(k==='moss'){
  folkOval(0,.18,.22,.14,skin,s+35);folkPortraitMouth(h,o,.43,.16);
  folkShape([[-.72,-.66],[-.43,-.89],[-.13,-.83],[.13,-1.02],[.39,-.85],[.67,-.64],[.36,-.64],[.11,-.74],[-.24,-.66]],c,s+40);
 }else if(k==='minotaur'){
  folkOval(0,.34,.47,.29,'#d3b898',s+35);
  for(var sg=-1;sg<=1;sg+=2){fill(ring(sg*.19,.28,.047,.03,12),{color:INK,jit:0});folkShape([[sg*.45,-.76],[sg*.79,-.87],[sg*.99,-1.20],[sg*1.01,-1.38],[sg*.81,-1.16],[sg*.43,-1.03]],'#d6c9ac',s+40+sg);}
  folkPortraitMouth(h,o,.48,.21);folkShape([[-.37,-.86],[-.14,-1.01],[.13,-.93],[.37,-.86],[.17,-.61],[0,-.69],[-.18,-.60]],a,s+44);
 }else{
  folkProfileNose(h,k==='faun'?.06:0,.02);folkPortraitMouth(h,o,.43,k==='cloudgiant'?.18:.115);
 }
 if(k==='frost'){
  folkShape([[-.68,-.54],[-.57,-.97],[-.35,-.88],[-.15,-1.27],[.07,-1.04],[.31,-1.35],[.41,-.93],[.65,-.69],[.31,-.74],[0,-.87],[-.31,-.70]],c,s+50);
  folkShape([[-.60,.26],[-.40,.40],[-.21,.51],[0,.58],[.24,.49],[.59,.23],[.40,.76],[0,.94],[-.40,.75]],'#d9ded8',s+51);
  atlasLine([[-.22,.59],[0,.64],[.23,.57]],s+52,.8,.7);
 }else if(k==='cloudgiant'){
  folkShape([[-.72,-.42],[-.65,-.85],[-.38,-1.01],[-.08,-.95],[.17,-1.05],[.52,-.88],[.73,-.48],[.37,-.67],[0,-.74],[-.36,-.61]],a,s+50);
  folkShape([[-.66,.20],[-.37,.32],[-.23,.47],[.25,.47],[.41,.28],[.66,.18],[.53,.70],[.22,.88],[-.22,.86],[-.52,.67]],a,s+51);
  folkPortraitMouth(h,o,.46,.16);
  atlasLine([[-.50,-1.02],[-.25,-1.16],[.08,-1.20],[.37,-1.10]],s+53,1,.7,'#b8985f');
 }else if(k==='medusa'){
  folkShape([[-.65,-.40],[-.68,-.85],[-.30,-1.02],[.07,-.98],[.48,-.94],[.65,-.56],[.26,-.73],[.03,-.61],[-.27,-.77]],c,s+50);
  atlasLine([[-.31,-.89],[-.05,-.86],[.22,-.95],[.45,-.87]],s+51,1,.65,a);
 }else if(k==='cernunnos'){
  folkShape([[-.65,-.52],[-.53,-.90],[-.08,-1.02],[.37,-.96],[.65,-.56],[.23,-.71],[-.19,-.66]],a,s+50);
  folkShape([[-.46,.39],[-.23,.50],[0,.63],[.27,.47],[.44,.36],[.28,.80],[0,.89],[-.31,.77]],a,s+51);
 }else if(k==='valkyrie'){
  folkShape([[-.70,-.47],[-.65,-.94],[-.32,-1.19],[0,-1.26],[.34,-1.16],[.64,-.91],[.70,-.47],[.32,-.62],[0,-.51],[-.34,-.62]],c,s+50);
  atlasLine([[0,-1.17],[0,-.57]],s+51,.9,.65,'#e0d9bf');
  for(var sg=-1;sg<=1;sg+=2)folkShape([[sg*.57,-.70],[sg*.82,-.81],[sg*1.03,-1.18],[sg*.99,-.76],[sg*.80,-.49],[sg*.64,-.39]],'#d9d5c3',s+53+sg);
 }else if(k==='dryad'){
  folkShape([[-.67,.24],[-.72,-.71],[-.39,-.96],[.04,-1.01],[.50,-.80],[.65,-.40],[.33,-.59],[0,-.79],[-.41,-.53]],c,s+50);
  folkLeaf(.34,-.73,.65,a,s+52);folkLeaf(.56,-.63,1.15,c,s+54);folkLeaf(.23,-.91,.1,c,s+56);
 }else if(k==='faun'){
  folkShape([[-.66,-.46],[-.60,-.88],[-.37,-.92],[-.20,-1.08],[.03,-.97],[.30,-1.04],[.58,-.86],[.66,-.50],[.31,-.68],[.08,-.55],[-.19,-.73],[-.42,-.60]],a,s+50);
  for(var sg=-1;sg<=1;sg+=2)folkShape([[sg*.38,-.84],[sg*.57,-1.02],[sg*.55,-1.32],[sg*.40,-1.17],[sg*.23,-.92]],'#d9c5a2',s+52+sg);
  folkShape([[-.12,.60],[0,.78],[.13,.59]],a,s+55);
 }
}
function folkGiant(h,o,info){folkEuropean(h,o,info);}
function folkYokai(h,o,info){
 var s=h.g.seed,k=info.kind,c=h.g.fur,a=info.pigments[1],b=info.pigments[2];
 folkBustBase(h,o,a,k==='tengu'?c:'#aeb997');
 if(k==='umbrella'){
  // The canopy itself is the portrait: no tongue, stick body or dangling shoe.
  folkShape([[0,-1.15],[-.27,-.91],[-.72,-.37],[-.84,.18],[-.67,.61],[-.24,.76],[.25,.76],[.69,.58],[.85,.16],[.70,-.38],[.24,-.93]],c,s+2);
  atlasLine([[0,-1.18],[0,-1.34]],s+3,1.2,.85,a);
  [[-.68,.41],[-.40,.60],[.40,.60],[.68,.41]].forEach(function(v,i){atlasLine([[0,-1.07],[v[0]*.65,-.23],v],s+5+i,.7,.55,a);});
  folkOval(0,.06,.29,.15,'#eee5cf',s+12);
  if((o.eye||0)>.65)atlasLine([[-.21,.06],[0,.10],[.21,.06]],s+13,1,.9);
  else fill(ring((o.gazeX||0)*.045,.06,.065,.086,16),{color:INK,jit:0});
  folkPortraitMouth(h,o,.40,.11);
 }else if(k==='kappa'){
  folkOval(0,-.13,.79,.90,c,s+1);
  folkOval(0,.07,.65,.65,'#c5cba6',s+2);
  folkPortraitEyes(h,o,-.08,.26,0);
  folkShape([[-.29,.23],[-.13,.13],[.15,.13],[.31,.23],[.20,.35],[-.19,.35]],'#bba165',s+10);
  atlasLine([[-.23,.25],[0,.27],[.25,.25]],s+11,.8,.8);
  folkShape([[-.74,-.59],[-.56,-.84],[-.28,-.79],[0,-.92],[.27,-.79],[.59,-.82],[.73,-.54],[.42,-.60],[.17,-.55],[-.16,-.55],[-.44,-.62]],c,s+13);
  folkOval(0,-.84,.46,.12,b,s+14);folkOval(0,-.86,.35,.065,'#a7c3bf',s+15);
  atlasLine([[-.53,1.03],[-.26,.95],[0,1.07],[.26,.95],[.54,1.03]],s+16,.75,.8,b);
 }else{
  // A restrained three-quarter face makes the long nose part of the silhouette.
  folkShape([[-.64,-.68],[-.25,-.98],[.32,-.89],[.61,-.47],[.57,-.13],[.98,.08],[.97,.19],[.58,.20],[.49,.58],[.12,.75],[-.38,.56],[-.69,.13]],c,s+2);
  folkPortraitEyes(h,o,-.12,.23,.045);
  atlasLine([[.45,-.19],[.50,.13],[.89,.15]],s+5,.8,.7);
  folkPortraitMouth(h,o,.44,.13);
  folkShape([[-.68,-.36],[-.72,-.73],[-.40,-.95],[-.05,-1.03],[.36,-.93],[.60,-.53],[.28,-.67],[-.02,-.74],[-.33,-.64]],a,s+10);
  folkShape([[-.24,-.95],[-.22,-1.24],[.18,-1.24],[.24,-.98]],a,s+11);
  atlasLine([[-.14,-1.14],[.14,-1.14]],s+12,.7,.8,b);
  for(var sg=-1;sg<=1;sg+=2)atlasLine([[sg*.34,.38],[sg*.21,.34],[sg*.06,.39]],s+14+sg,1.6,.9,a);
 }
}

Object.keys(FOLK_INFO).forEach(function(k){ATLAS_DRAW[k]=function(h,o){var info=FOLK_INFO[k];if(info.support!=='bust')folkFooting(h,info.series==='shanhai'?'cloud':'earth');if(info.series==='guofeng')folkGourd(h,o,info);else if(info.series==='journey')folkJourney(h,o,info);else if(info.series==='shanhai')folkBeast(h,o,info);else if(info.series==='yokai')folkYokai(h,o,info);else if(['moss','frost','cloudgiant'].indexOf(info.kind)>=0)folkGiant(h,o,info);else folkEuropean(h,o,info);};});
// Older natural figures have no common lower silhouette. Add a light contextual
// landing plane, never a detached human neck, and keep their existing anatomy.
var folkOriginalNatural=Head.prototype.drawNatural;
Head.prototype.drawNatural=function(o){if(!FOLK_INFO[this.g.sp]&&(NATURAL_INFO[this.g.sp]||{}).support!=='bust')folkFooting(this,SEA.indexOf(this.g.sp)>=0?'water':this.g.sp==='cloud'?'cloud':'earth');folkOriginalNatural.call(this,o);};
// A new donor contributes one clear costume or outline motif, not a second head.
var folkOriginalGraft=drawGraft;
drawGraft=function(h,o,front){var info=FOLK_INFO[h.g.donor];if(!info)return folkOriginalGraft(h,o,front);if(front)return;var c=h.g.fur,s=h.g.seed+1200,p=atlasPulse(o);if(info.series==='guofeng'){folkOval(0,-1.1,.17,.21,c,s);folkOval(.02,-1.37,.11,.12,c,s+1);}else if(info.series==='journey'){atlasLine([[1.1,1.1],[1.05,-1.1]],s,3,.9,c);}else if(info.series==='shanhai'){for(var sg=-1;sg<=1;sg+=2)folkPaint([[sg*.55,.5],[sg*1.35,.1+p*.1],[sg*1.18,-.55],[sg*.75,-.12]],c,s+sg);}else if(info.series==='yokai'){folkPaint([[-.7,-.76],[0,-1.32],[.7,-.76]],c,s);}else{folkPaint([[-.75,-.65],[-.59,-1.3],[-.2,-1.04],[.08,-1.48],[.44,-1.07],[.73,-.67]],c,s);}};

// Keep later-added folklore characters active in breeding. A natural parent is
// always carried as the primary tag; a different natural parent is retained as
// the donor tag so the child visibly inherits a second motif.
var folkBreedCross=crossDNA;
crossDNA=function(a,b){
 var out=folkBreedCross(a,b),at=a[7]||0,bt=b[7]||0;
 if(!at&&!bt)return out;
 var primary=Math.random()<.5?a:b,secondary=primary===a?b:a,tag=primary[7]||secondary[7];
 if(tag){out.dna[7]=tag;var donor=secondary[7]||secondary[8]||primary[8];if(donor&&donor!==tag)out.dna[8]=donor;else if(out.dna.length>8)out.dna.length=8;}
 return out;
};

function castFamily(k){if(FOLK_INFO[k])return FOLK_INFO[k].family;if(LEGACY_LABELS[k])return '经典半身像';if(SEA.indexOf(k)>=0)return '潮间带';return (NATURAL_INFO[k]||{}).family||'花园与异物';}
function castSchedule(pool,count){
 var order=pool.slice().sort(function(a,b){var fa=castFamily(a),fb=castFamily(b);return fa===fb?NATURAL.concat(Object.keys(LEGACY_LABELS)).indexOf(a)-NATURAL.concat(Object.keys(LEGACY_LABELS)).indexOf(b):fa.localeCompare(fb,'zh-CN');}),arr=[];
 var families=[];order.forEach(function(k,i){var f=castFamily(k),group=families[families.length-1];if(!group||group.name!==f){group={name:f,keys:[],counts:[]};families.push(group);}group.keys.push(k);group.counts.push(Math.floor(count/order.length)+(i<count%order.length?1:0));});
 families.forEach(function(group){var left=group.counts.reduce(function(a,b){return a+b;},0);while(left>0)group.keys.forEach(function(k,i){if(group.counts[i]>0){arr.push(k);group.counts[i]--;left--;}});});return arr;
}
