/* r16: authored folio colours, portrait proportions and heritable motifs.
   Seven legacy loci + primary/donor tags remain the complete save format. */
var FOLK_COLOURS={
 folk_gourd_1:['#b85645','#677b51','#e6c69f'],folk_gourd_2:['#bf8c43','#738158','#e7caa5'],
 folk_gourd_3:['#c4ad52','#73835f','#ebd2ab'],folk_gourd_4:['#648269','#627554','#dbbc98'],
 folk_gourd_5:['#548c92','#647e67','#e6c7a5'],folk_gourd_6:['#566e95','#6f7d69','#e2c7af'],
 folk_gourd_7:['#8a6b91','#758066','#e9c9ad'],
 west_monkey:['#b9573e','#c9a052','#dfbd91'],west_pig:['#626d81','#b7a287','#dcb4a6'],
 west_monk:['#ab5141','#c5a257','#ecd3af'],west_sandy:['#487c7b','#b8945b','#bc9374'],
 hill_fox:['#e1d4b5','#b45b4d','#90a89e'],hill_bifang:['#4f8491','#b45b4d','#e8dcc3'],hill_dijiang:['#b76051','#c69f68','#d8c9a7'],
 yokai_kappa:['#698874','#bea365','#cbd2b0'],yokai_tengu:['#b65548','#404d61','#d5b578'],yokai_umbrella:['#bca46c','#5b7182','#bd7059'],
 giant_moss:['#697952','#acb18c','#75674d'],giant_frost:['#647e9a','#dce0dc','#4e637d'],
 giant_cloud:['#ac7353','#d7bc99','#625953'],euro_medusa:['#57867c','#d3ceb4','#385e58'],
 euro_cernunnos:['#4e725c','#cbb99a','#465b48'],euro_valkyrie:['#687c98','#e4cdb0','#3d5068'],
 euro_dryad:['#829966','#dfccaa','#536e49'],euro_faun:['#af8960','#d2b183','#705548'],euro_minotaur:['#815653','#bd9577','#4c3c3c']
};
Object.keys(FOLK_COLOURS).forEach(function(k){var p=FOLK_COLOURS[k],info=FOLK_INFO[k];info.pigments=p;info.col=[p[0]];FURS[k]=info.col;});
['guofeng','journey','yokai','giants'].forEach(function(series){FOLK_SERIES[series].keys.forEach(function(k){FOLK_INFO[k].support='bust';});});
Object.keys(FOLK_SERIES).forEach(function(s){FOLK_SERIES[s].palette=FOLK_SERIES[s].keys.map(function(k){return FOLK_COLOURS[k][0];});});

function folkGourdPortrait(h,o,info){
 var s=h.g.seed,c=h.g.fur,leaf=info.pigments[1],skin=info.pigments[2],n=info.ordinal||0;
 var w=[.67,.77,.62,.69,.67,.64,.68][n],chin=[.70,.63,.76,.71,.69,.75,.71][n];
 folkBustBase(h,o,c,skin);
 // Cheek and chin proportions, fringe and a single small symbol distinguish siblings.
 folkPaint([[-w,-.57],[-w*.72,-.91],[0,-1.01],[w*.78,-.87],[w,-.48],[w*.92,.27],[.30,chin],[-.29,chin],[-w*.92,.25]],skin,s+10);
 folkShape([[-w,-.24],[-w-.04,-.70],[-.43,-1.01],[-.03,-1.07],[.45,-.96],[w+.04,-.65],[w,-.23],[.47,-.48],[.32,-.73],[.06,-.58],[-.27,-.76],[-.47,-.49]],'#414742',s+11);
 folkPortraitEyes(h,o,-.11,n===1?.31:.25,n===0?.045:n===2?-.025:0);
 folkProfileNose(h,0,.03);folkPortraitMouth(h,o,.43,n===1?.16:.10);
 folkLeaf(-.10,-.99,-.95,leaf,s+18);folkLeaf(.13,-1.0,.90,leaf,s+20);
 folkOval(0,-1.17,.14,.16,c,s+22);folkOval(.015,-1.37,.095,.105,c,s+23);
 atlasLine([[.02,-1.45],[.075,-1.52],[.16,-1.48]],s+24,.7,.8,leaf);
 if(n===0){folkShape([[-.62,.18],[-.78,-.07],[-.69,-.27],[-.61,-.11],[-.51,-.28],[-.48,.02]],c,s+30);}
 if(n===1){atlasLine([[-.36,-.30],[-.15,-.30]],s+30,2,.8,leaf);atlasLine([[.15,-.30],[.36,-.30]],s+31,2,.8,leaf);}
 if(n===2){atlasLine([[.58,-.56],[.84,-.66],[.98,-.53]],s+30,1.4,.8,c);}
 if(n===3){folkLeaf(.62,-.31,.8,leaf,s+30);}
 if(n===4){atlasLine([[.46,.25],[.60,.18],[.73,.24]],s+30,1,.8,c);}
 if(n===5){folkShape([[.47,-.64],[.54,-.57],[.65,-.61],[.59,-.47],[.47,-.50]],'#d4d9df',s+30);}
 if(n===6){folkOval(.59,.23,.072,.095,'#c8a45f',s+30);atlasLine([[.59,.11],[.59,.04]],s+31,.65,.8,leaf);}
}
function folkJourneyPortrait(h,o,info){
 var k=info.kind,s=h.g.seed,c=h.g.fur,a=info.pigments[1],skin=info.pigments[2];folkBustBase(h,o,c,skin);
 if(k==='pig')for(var sg=-1;sg<=1;sg+=2)folkShape([[sg*.58,-.5],[sg*1.02,-.71],[sg*.97,-.19],[sg*.63,.07]],skin,s+sg+1);
 else if(k==='monkey'){folkOval(-.72,-.1,.18,.23,a,s+1);folkOval(.72,-.1,.18,.23,a,s+2);}
 var w=k==='pig'?.78:k==='sandy'?.72:.65;
 folkOval(0,-.1,w,.86,k==='monkey'?a:skin,s+6);
 if(k==='monkey'){
  // Peach-shaped facial mask: the muzzle belongs to the face, not a separate nose block.
  folkPaint([[-.58,-.45],[-.38,-.62],[0,-.43],[.39,-.63],[.58,-.44],[.47,.18],[.20,.57],[-.20,.57],[-.47,.18]],skin,s+7);
  atlasLine([[-.68,-.64],[-.34,-.71],[0,-.66],[.34,-.71],[.68,-.64]],s+8,2,.95,'#b88839');
  folkOval(0,-.65,.10,.065,a,s+9);
 }else if(k==='pig'){
  folkShape([[-.74,-.55],[-.59,-.86],[0,-1.03],[.59,-.85],[.75,-.54]],c,s+8);
 }else if(k==='monk'){
  folkShape([[-.65,-.58],[-.56,-1.06],[-.32,-.90],[0,-1.35],[.31,-.90],[.57,-1.06],[.65,-.58]],a,s+8);
  folkOval(0,-.90,.055,.083,c,s+9);
 }else{
  folkShape([[-.67,-.49],[-.70,-.72],[-.44,-.98],[0,-1.07],[.49,-.94],[.71,-.55],[.33,-.69],[-.25,-.68]],'#454e49',s+8);
  atlasLine([[-.67,-.62],[0,-.80],[.67,-.62]],s+9,2,.8,c);
 }
 folkPortraitEyes(h,o,-.09,k==='pig'?.30:.25,k==='monkey'?.045:0);
 if(k==='pig'){
  folkOval(0,.27,.29,.19,'#c79084',s+15);fill(ring(-.11,.25,.028,.045,12),{color:INK,jit:0});fill(ring(.11,.25,.028,.045,12),{color:INK,jit:0});
 }else folkProfileNose(h,0,.03);
 if(k==='sandy')folkShape([[-.65,.21],[-.41,.35],[-.17,.43],[.18,.43],[.45,.32],[.65,.20],[.47,.67],[0,.91],[-.48,.67]],'#454e49',s+16);
 folkPortraitMouth(h,o,k==='sandy'?.44:.48,k==='pig'?.18:.12);
}
FOLK_SERIES.guofeng.keys.forEach(function(k){FOLK_INFO[k].traits=['葫芦叶冠',['火形鬓饰','宽眉方颊','风带发梢','侧叶发饰','水纹脸颊','月牙发夹','金色小坠'][FOLK_INFO[k].ordinal],'大头像与低肩线'];ATLAS_DRAW[k]=function(h,o){folkGourdPortrait(h,o,FOLK_INFO[k]);};});
FOLK_SERIES.journey.keys.forEach(function(k){ATLAS_DRAW[k]=function(h,o){folkJourneyPortrait(h,o,FOLK_INFO[k]);};});
FOLK_INFO.west_monkey.traits=['金箍桃形脸','圆耳与短吻','朱砂窄肩'];FOLK_INFO.west_pig.traits=['扇形大耳','宽颊短鼻','靛灰窄肩'];
FOLK_INFO.west_monk.traits=['三瓣僧帽','细长面部','朱砂窄肩'];FOLK_INFO.west_sandy.traits=['深色卷髯','青色额带','石青窄肩'];

// The earlier Chinese animation visitors follow the same portrait grammar.
var PORTRAIT_ALIAS={gourd_fire:'folk_gourd_1',gourd_stone:'folk_gourd_2',gourd_wind:'folk_gourd_3',gourd_leaf:'folk_gourd_4',gourd_water:'folk_gourd_5',gourd_mist:'folk_gourd_6',gourd_light:'folk_gourd_7'};
Object.keys(PORTRAIT_ALIAS).forEach(function(k){var source=FOLK_INFO[PORTRAIT_ALIAS[k]],info=NATURAL_INFO[k];info.col=source.col.slice();FURS[k]=info.col;info.support='bust';info.traits=source.traits.slice();ATLAS_DRAW[k]=function(h,o){folkGourdPortrait(h,o,source);};});
['lotus_kid','cloud_dragon'].forEach(function(k){var info=NATURAL_INFO[k];info.support='bust';info.col=k==='lotus_kid'?['#b76662']:['#5d8991'];FURS[k]=info.col;info.traits=k==='lotus_kid'?['莲瓣发冠','浅暖面色','朱红窄肩']:['云角发髻','浅暖面色','青蓝窄肩'];ATLAS_DRAW[k]=function(h,o){var s=h.g.seed,c=h.g.fur;folkBustBase(h,o,c,'#e4c7a2');folkOval(0,-.1,.68,.85,'#e4c7a2',s+2);folkShape([[-.67,-.34],[-.65,-.75],[-.27,-1.02],[.24,-1.02],[.66,-.73],[.67,-.34],[.29,-.64],[0,-.55],[-.28,-.64]],'#465450',s+3);folkPortraitEyes(h,o,-.08,.26,.025);folkProfileNose(h,0,.04);folkPortraitMouth(h,o,.44,.11);if(k==='lotus_kid'){[-1,0,1].forEach(function(i){folkLeaf(i*.20,-.86,i*.6,c,s+10+i);});}else{for(var sg=-1;sg<=1;sg+=2)atlasLine([[sg*.38,-.78],[sg*.58,-1.11],[sg*.81,-1.08],[sg*.87,-1.29]],s+sg+10,2.2,.85,'#c3ad75');}};});

// Every newer donor has an authored, visible signature. Front attachment points
// keep inherited symbols from disappearing behind the recipient's headgear.
var FOLK_MOTIFS={
 fire:'火叶侧冠',stone:'岩片侧冠',wind:'双风带',leaf:'嫩叶簇',water:'水滴坠',mist:'月牙发饰',light:'星灯坠',
 monkey:'金箍额饰',pig:'扇形侧耳',monk:'三瓣额冠',sandy:'流沙髯',fox:'扇形狐尾',bird:'青羽侧翎',dijiang:'叠翼侧翅',
 kappa:'水皿额饰',tengu:'羽扇侧饰',umbrella:'折伞侧饰',moss:'苔叶侧簇',frost:'冰脊侧冠',cloudgiant:'云穹弧',
 medusa:'盘蛇侧发',cernunnos:'分叉鹿角',valkyrie:'羽翼侧盔',dryad:'橡叶侧簇',faun:'短曲角',minotaur:'外展牛角',lotus:'莲瓣侧冠',dragon:'云角'};
var motifOriginalGraft=drawGraft;
function inheritedMotifInfo(k){return FOLK_INFO[k]||FOLK_INFO[PORTRAIT_ALIAS[k]]||(k==='lotus_kid'?{kind:'lotus',pigments:['#b76662','#d9b77b','#e4c7a2']}:k==='cloud_dragon'?{kind:'dragon',pigments:['#5d8991','#c3ad75','#e4c7a2']}:null);}
function folkMotif(h,o,info){
 var k=info.kind,s=h.g.seed+2100,c=info.pigments[0],a=info.pigments[1],v=h.g.motifVariant||0;
 var scale=[.92,1,1.08][v];
 ctx.save();ctx.translate(.69,-.61);ctx.scale(scale,scale);
 if(k==='cernunnos'||k==='dragon'){
  atlasLine([[0,.13],[.11,-.27],[.25,-.57],[.26,-.85]],s,2,.95,c);atlasLine([[.17,-.43],[.45,-.51],[.51,-.68]],s+1,1.5,.95,c);atlasLine([[.11,-.27],[-.12,-.46],[-.14,-.65]],s+2,1.5,.95,c);
 }else if(k==='medusa'){
  folkShape([[0,.24],[-.08,-.03],[-.02,-.29],[.20,-.43],[.40,-.34],[.40,-.18],[.24,-.12],[.20,-.25],[.11,-.18],[.12,.03]],c,s);fill(ring(.32,-.27,.025,.025,12),{color:INK,jit:0});
 }else if(k==='faun'||k==='minotaur'){
  folkShape([[-.1,.05],[.17,-.09],[.39,-.42],[.43,-.70],[.26,-.49],[.0,-.33],[-.22,-.25]],k==='minotaur'?'#d9c8a6':a,s);
 }else if(k==='umbrella'){
  folkShape([[0,-.37],[-.33,-.03],[.35,.05]],c,s);atlasLine([[0,-.34],[0,.24]],s+1,.8,.9,a);atlasLine([[0,-.31],[.20,.02]],s+2,.5,.7,a);
 }else if(k==='kappa'){
  folkOval(0,-.11,.31,.11,a,s);folkOval(0,-.14,.23,.052,'#a9c5c1',s+1);
 }else if(k==='tengu'||k==='bird'||k==='valkyrie'){
  [-1,0,1].forEach(function(i){ctx.save();ctx.rotate(i*.29);folkLeaf(0,.04,.4,c,s+2+i);ctx.restore();});
 }else if(k==='leaf'||k==='dryad'||k==='moss'||k==='lotus'){
  folkLeaf(0,.13,.4,c,s);folkLeaf(.16,.17,1.04,k==='lotus'?c:a,s+3);if(k==='lotus')folkLeaf(-.15,.10,-.4,c,s+5);
 }else if(k==='fire'||k==='frost'||k==='monk'){
  folkShape([[-.27,.09],[-.27,-.25],[-.11,-.14],[.02,-.51],[.14,-.16],[.32,-.29],[.27,.11]],c,s);
 }else if(k==='stone'){
  folkShape([[-.24,.04],[-.28,-.26],[0,-.39],[.26,-.21],[.21,.09]],c,s);atlasLine([[-.1,-.29],[.02,-.13],[.20,-.06]],s+1,.7,.7,a);
 }else if(k==='wind'){
  atlasLine([[-.1,.01],[.24,-.23],[.42,-.17],[.60,-.30]],s,2,.9,c);atlasLine([[0,.1],[.28,.16],[.51,.01]],s+1,1.1,.9,a);
 }else if(k==='water'){
  folkShape([[.05,-.31],[-.09,-.06],[-.03,.09],[.15,.08],[.21,-.05]],c,s);atlasLine([[.02,-.09],[.04,.02]],s+1,.7,.7,'#e2e0c7');
 }else if(k==='mist'){
  folkShape([[.20,-.36],[-.05,-.28],[-.20,-.06],[-.08,.16],[.20,.13],[.04,.02],[.01,-.15]],c,s);
 }else if(k==='light'){
  atlasLine([[0,-.36],[0,-.16]],s,.8,.8,a);folkOval(0,-.02,.15,.20,c,s+1);atlasLine([[-.12,-.06],[.12,-.06]],s+2,.7,.8,a);
 }else if(k==='cloudgiant'){
  atlasLine([[-.26,.10],[-.31,-.23],[-.06,-.43],[.23,-.33],[.35,-.02]],s,1.8,.95,c);folkOval(.25,-.32,.045,.045,a,s+1);
 }else if(k==='monkey'){
  atlasLine([[-.87,.06],[-.54,-.04],[-.17,.03],[.15,-.06]],s,2.6,.9,a);folkOval(-.29,-.01,.075,.058,a,s+1);
 }else if(k==='pig'){
  folkShape([[-.10,-.09],[.32,-.28],[.30,.12],[-.01,.27]],info.pigments[2],s);
 }else if(k==='sandy'){
  // A side lock reads on both human and non-human hosts without adding a second chin.
  folkShape([[-.05,.02],[.23,-.05],[.30,.42],[.11,.67],[-.04,.35]],'#454e49',s);
 }else if(k==='fox'||k==='dijiang'){
  for(var i=0;i<(k==='fox'?3:2);i++){ctx.save();ctx.rotate(-.35+i*.38);folkShape([[0,.24],[.32,-.05],[.39,-.47],[.15,-.36],[-.02,-.06]],i%2?a:c,s+i);ctx.restore();}
 }
 ctx.restore();
}
drawGraft=function(h,o,front){var info=inheritedMotifInfo(h.g.donor);if(!info)return motifOriginalGraft(h,o,front);if(front)folkMotif(h,o,info);};
var evolutionCompose=composeGenes;
composeGenes=function(d,look){var g=evolutionCompose(d,look);if(g.donor){g.motifVariant=hashInt(d[4]>>>0,137)%3;g.colourVariant=hashInt(d[5]>>>0,149)%3;
 // Recolour only costume/hair; fixed face colours are never mixed into mud.
 if(FOLK_INFO[g.sp]||PORTRAIT_ALIAS[g.sp]||g.sp==='lotus_kid'||g.sp==='cloud_dragon'){
  var donor=NATURAL_INFO[g.donor];if(!(look&&look.fur))g.fur=mixHex(g.fur,donor.col[0],[.10,.18,.26][g.colourVariant]);
 }
 }return g;};
var evolutionCross=crossDNA;
function parentalTags(d){return [d[7],d[8]].filter(function(t,i,a){return t>0&&t<=NATURAL.length&&a.indexOf(t)===i;});}
crossDNA=function(a,b){
 var out=oldCrossDNA(a.slice(0,7),b.slice(0,7)),aa=parentalTags(a),bb=parentalTags(b);
 if(!aa.length&&!bb.length)return out;
 function gamete(p){return p.length>1&&Math.random()<.28?p[1]:p[0];}
 var at=gamete(aa),bt=gamete(bb),primary=Math.random()<.5?(at||bt):(bt||at),secondary=primary===at?bt:at;
 if(!secondary||secondary===primary){var others=aa.concat(bb).filter(function(t,i,a){return t!==primary&&a.indexOf(t)===i;});secondary=others.length?others[Math.floor(Math.random()*others.length)]:null;}
 out.dna.push(primary);if(secondary)out.dna.push(secondary);return out;
};
var evolutionTraits=traitList,evolutionIdentity=identity;
traitList=function(g){if(!g.donor)return evolutionTraits(g);var info=inheritedMotifInfo(g.donor);if(!info)return evolutionTraits(g);return [NATURAL_INFO[g.sp].traits[0],'借来：'+FOLK_MOTIFS[info.kind],['含蓄表达','均衡表达','鲜明表达'][g.motifVariant||0]];};
identity=function(g){var id=evolutionIdentity(g);if(g.donor&&inheritedMotifInfo(g.donor)){id.traits=traitList(g);id.quirk='保留'+NATURAL_INFO[g.sp].name+'的主体，继承'+NATURAL_INFO[g.donor].name+'的'+FOLK_MOTIFS[inheritedMotifInfo(g.donor).kind]+'。下次天演时，主体和借来的特征都有机会传给下一代。';}return id;};

// Immediate parents are available on a freshly born stage head. A saved code
// only proves expressed source species, so never relabel them as actual parents.
function portraitLineage(h,src){
 var parents=src&&src.code===h.code&&Array.isArray(src.parents)?src.parents.map(decodeCode).filter(Boolean):[];
 if(parents.length===2)return {label:'parents',heads:parents.map(function(p){var f=new Head(p.dna,p.look);f.yaw=0;return f;})};
 if(h.g.natural){var keys=[h.g.sp].concat(h.g.donor?[h.g.donor]:[]);return {label:'trait sources',heads:keys.map(function(k,i){var f=new Head(atlasDNA(k,431+i*71));f.yaw=0;return f;})};}
 return {label:h.id().founders.length>1?'founders':'wild-born',heads:h.id().founders.slice(0,3).map(function(s){var f=new Head(pureDNA(s));f.yaw=0;return f;})};
}
var lineageSetDNA=Head.prototype.setDNA;
Head.prototype.setDNA=function(dna,look){this.parents=null;return lineageSetDNA.call(this,dna,look);};
var lineageBreed=doBreed;
doBreed=function(a,b){if(!heads.some(function(h){return h!==a&&h!==b&&!isKept(h.code);})){cancelBreed();toast(uiText('舞台没有可放置后代的位置，请增加席位或取消一位角色的收藏保护。'));return false;}lineageBreed(a,b);return true;};

function portraitGenomeRows(h){var g=h.g,base=NATURAL_INFO[g.sp],donor=NATURAL_INFO[g.donor],motif=inheritedMotifInfo(g.donor),c=g.fur,a=donor?donor.col[0]:c;
 return [['主体',base.name,c],['继承',donor?donor.name:'未混生',a],['主体特征',base.traits[0],c],['继承特征',donor?(motif?FOLK_MOTIFS[motif.kind]:donor.traits[0]):'无',a],['特征表达',donor&&motif?['含蓄表达','均衡表达','鲜明表达'][g.motifVariant||0]:'原生结构',a],['配色方式',donor?'主色为主，辅色呼应':'系列原配',c],['保存内容','物种 · 结构 · 种子',c]].map(function(r){return [uiText(r[0]),uiText(r[1]),r[2]];});
}
// Latin words keep their spaces; Chinese and overlong tokens can wrap safely.
wrapText=function(text,maxW,maxLines){
 var tokens=String(text).match(/[\u2e80-\u9fff\uff00-\uffef]|[^\s\u2e80-\u9fff\uff00-\uffef]+|\s+/g)||[],lines=[],cur='';
 function add(t){var next=cur+t;if(ctx.measureText(next).width<=maxW){cur=next;return;}if(cur.trim())lines.push(cur.trimEnd());cur=t.trimStart();}
 tokens.forEach(function(t){if(ctx.measureText(t).width>maxW)Array.from(t).forEach(add);else add(t);});if(cur.trim())lines.push(cur.trimEnd());
 if(maxLines&&lines.length>maxLines){lines=lines.slice(0,maxLines);var last=Array.from(lines[maxLines-1]);while(last.length&&ctx.measureText(last.join('')+'…').width>maxW)last.pop();lines[maxLines-1]=last.join('').trimEnd()+'…';}return lines;
};
