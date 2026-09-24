/* 趣像 04: structural characters, material controls and a gentle shared wind.
   The optional eighth DNA word is a versioned shape tag. Legacy seven-word DNA is unchanged. */
var NATURAL = ['ginkgo','cactus','mushroom','teapot','cloud'];
var NATURAL_INFO = {
  ginkgo:{name:'银杏叶旅人',col:['#b8bb66','#d5b961','#88a77b'],traits:['扇形叶片','放射叶脉','随风弯曲的叶柄'],quirk:'把每一阵风都当作来信。停下来时，仍朝着光。'},
  cactus:{name:'仙人掌守望者',col:['#729784','#97aa73','#679b91'],traits:['柱状肋线','稀疏刺簇','一朵小花'],quirk:'看起来有一点扎手，心里却存着一整场雨。'},
  mushroom:{name:'菌菇伞客',col:['#bf715b','#bb9560','#9980a0'],traits:['宽阔菌盖','放射菌褶','柔软菌柄'],quirk:'晴天也带着伞。风来的时候，悄悄弹一下伞沿。'},
  teapot:{name:'茶壶梦游者',col:['#7696ad','#bd8767','#86a494'],traits:['弯曲壶嘴','中空壶柄','会跳舞的壶盖'],quirk:'总想请云喝一杯茶。它笑起来时，壶盖会轻轻作响。'},
  cloud:{name:'慢吞吞的云',col:['#a5b9c4','#c0b0c6','#b8c6bb'],traits:['不对称云团','疏淡雨丝','柔软边缘'],quirk:'把影子借给路过的人。偶尔下雨，大多时候只是发呆。'}
};
var STUDIO_DEFAULT={density:1,pigment:1,wetness:0.55,paperSeed:271828,nature:28,objects:16,composition:'grid',brushRadius:0.55};
Object.keys(STUDIO_DEFAULT).forEach(function(k){ CFG_DEFAULT[k]=STUDIO_DEFAULT[k]; if(CFG[k]==null) CFG[k]=STUDIO_DEFAULT[k]; if(SHARE_KEYS.indexOf(k)<0) SHARE_KEYS.push(k); });
if(SHARE_KEYS.indexOf('mono')<0) SHARE_KEYS.push('mono');
// The first unconfigured landing page is deliberately a calm 7×5 theatre（35 位，弱机更轻）。
// Older builds stored an empty speciesPool, so checking the array itself made the
// migration silently skip. A separate marker preserves deliberate future grid edits.
// 2026-09-23：默认由 7×6(42) 改为 7×5(35)；用新标记 grid7x5 迁移一次，
// 明确选过网格的人（gridChoice）保持不动。
// r43：竖屏手机（窄边 <520px）默认 4×6（24 位）——7×5 在 390 宽上每张脸只有 ~45px，点不准也更费电。
// 只影响"从没选过网格"的访客；明确选过的（gridChoice）不动。
var STAGE_PHONE = (function(){ try { return Math.min(window.innerWidth, window.innerHeight) < 520 && window.innerHeight >= window.innerWidth; } catch (e) { return false; } })();
var STAGE_DEFAULT = STAGE_PHONE ? { cols: 4, rows: 6 } : { cols: 7, rows: 5 };
function ensureStageDefault(){
  try{
    var migrated=localStorage.getItem('quxiang.grid7x5'),choice=localStorage.getItem('quxiang.gridChoice');
    var pool=Array.isArray(CFG.speciesPool)?CFG.speciesPool:[];
    var oldAuto=(!choice && !pool.length && (Number(CFG.cols)!==STAGE_DEFAULT.cols || Number(CFG.rows)!==STAGE_DEFAULT.rows));
    if(!migrated && oldAuto){CFG.cols=STAGE_DEFAULT.cols;CFG.rows=STAGE_DEFAULT.rows;CFG.composition='grid';saveCfg();localStorage.setItem('quxiang.grid7x5','1');}
    if(STAGE_PHONE && !choice && !localStorage.getItem('quxiang.gridPhone') && Number(CFG.cols)===7 && Number(CFG.rows)===5){CFG.cols=STAGE_DEFAULT.cols;CFG.rows=STAGE_DEFAULT.rows;CFG.composition='grid';saveCfg();localStorage.setItem('quxiang.gridPhone','1');}
  }catch(e){}
  return Number(CFG.cols)===STAGE_DEFAULT.cols && Number(CFG.rows)===STAGE_DEFAULT.rows && CFG.composition==='grid';
}
ensureStageDefault();
NATURAL.forEach(function(k){ SPNAME[k]=NATURAL_INFO[k].name; FURS[k]=NATURAL_INFO[k].col; SP_RARITY[k]=2; });
MODES.push('花园 · 植物与菌菇','异物 · 茶壶与云');

var oldEncodeDNA=encodeDNA, oldDecodeDNA=decodeDNA, oldFounders=founders, oldComposeGenes=composeGenes, oldCrossDNA=crossDNA, oldRandomDNA=randomDNA;
encodeDNA=function(d){ return oldEncodeDNA(d.slice(0,7))+(d[7] ? '!'+d[7]+(d[8]?':'+d[8]:'') : ''); };
decodeDNA=function(str){var p=String(str||'').split('!');if(p.length>2)return null;var tags=[];if(p.length===2){if(!/^[1-9]\d?(?::[1-9]\d?)?$/.test(p[1]))return null;tags=p[1].split(':').map(Number);if(tags.some(function(n){return n>NATURAL.length;}) || tags[0]===tags[1])return null;}var d=oldDecodeDNA(p[0]);return d?d.concat(tags):null;};
founders=function(d){ return oldFounders(d.slice(0,7)); };
composeGenes=function(d,look){
  var g=oldComposeGenes(d,null), tag=d[7];
  if(tag && NATURAL[tag-1]){
    var k=NATURAL[tag-1], info=NATURAL_INFO[k];
    Object.assign(g,{sp:k,natural:true,human:false,fur:info.col[hashInt(g.seed,5)%info.col.length],hair:'none',topEars:null,sideEars:false,glasses:'none',beard:false,mustache:false,stubble:false,freckles:false,earring:false,antenna:0,bolts:false,box:false,chin:0,fluff:0,wide:1,tall:1,nose:'none',mouth:'tiny',eyeStyle:'animal',bib:null});
    g.donor=d[8] && d[8]!==tag?NATURAL[d[8]-1]:null;
  }
  return applyLook(g,look);
};
crossDNA=function(a,b){var out=oldCrossDNA(a.slice(0,7),b.slice(0,7)),primary=Math.random()<0.5?a:b,secondary=primary===a?b:a,tag=primary[7]||secondary[7];if(tag){out.dna.push(tag);var donor=secondary[7]!==tag?secondary[7]:(primary[8]||secondary[8]);if(donor && donor!==tag)out.dna.push(donor);}return out;};
randomDNA=function(){
  var n=clamp(Number(CFG.nature)||0,0,100), o=clamp(Number(CFG.objects)||0,0,100), tag=0;
  if(MODE===4)tag=1+Math.floor(Math.random()*3);
  else if(MODE===5)tag=4+Math.floor(Math.random()*2);
  else if(MODE===0){ var t=Math.random()*Math.max(100,n+o); if(t<n)tag=1+Math.floor(Math.random()*3); else if(t<n+o)tag=4+Math.floor(Math.random()*2); }
  if(tag)return pureDNA(randSeed()).concat(tag);
  return oldRandomDNA();
};
var oldSpeciesLine=speciesLine, oldTraitList=traitList, oldIdentity=identity;
speciesLine=function(g){ return g.natural?NATURAL_INFO[g.sp].name:oldSpeciesLine(g); };
traitList=function(g){ return g.natural?NATURAL_INFO[g.sp].traits.slice():oldTraitList(g); };
identity=function(g){ var id=oldIdentity(g); if(g.natural){ id.name=NATURAL_INFO[g.sp].name+' · '+id.first; id.quirk=NATURAL_INFO[g.sp].quirk; } return id; };

/* Texture controls operate in their own channels: spacing, deposited pigment and edge spread. */
var oldHatchIn=hatchIn, oldWash=wash, oldStroke=stroke, FACE_QUIET=null;
hatchIn=function(P,col,alpha,spacing,angle,width,jitter){
  if(!P || P.length<3 || P.some(function(p){return !Number.isFinite(p[0]) || !Number.isFinite(p[1]);}))return;
  var den=clamp(CFG.density,0.25,2.2);
  var b=bbox(P),span=Math.hypot(b[2]-b[0],b[3]-b[1]);
  var gap=Math.max(spacing/den,span/420,0.00001);
  if(!FACE_QUIET){oldHatchIn(P,col,alpha,gap,angle,width,jitter);return;}
  oldHatchIn(P,col,alpha*0.2,gap,angle,width,jitter);
  ctx.save();ctx.beginPath();ctx.rect(b[0]-1,b[1]-1,b[2]-b[0]+2,b[3]-b[1]+2);ctx.ellipse(FACE_QUIET.x,FACE_QUIET.y,FACE_QUIET.rx,FACE_QUIET.ry,0,0,TAU);ctx.clip('evenodd');
  oldHatchIn(P,col,alpha*0.8,gap,angle,width,jitter);ctx.restore();
};
stroke=function(P,opt){
  opt=Object.assign({},opt||{});
  opt.alpha=(opt.alpha==null?1:opt.alpha)*clamp(0.6+CFG.pigment*0.4,0.45,1.35);
  if(STYLE==='pencil'){ opt.color='#514c47'; opt.alpha*=0.78; opt.jit=(opt.jit==null?0.012:opt.jit)*1.25; }
  oldStroke(P,opt);
};
wash=function(P,col,seed,alpha,jit){
  if(!P || P.length<3 || !col || P.some(function(p){return !Number.isFinite(p[0]) || !Number.isFinite(p[1]);}))return;
  var den=clamp(CFG.density,0.25,2.2), wet=clamp(CFG.wetness,0,1), amount=clamp(CFG.pigment,0.25,1.7);
  alpha=(alpha==null?1:alpha)*amount;
  if(STYLE==='pencil'){
    // Sparse diagonal side strokes leave the paper visible; line structure stays independent.
    hatchIn(P,'#6e6459',0.15*alpha,7*LW,-0.64,0.66*LW,1.8*LW);
    if(den>1.15)hatchIn(P,'#514b43',0.085*alpha,11*LW,0.72,0.5*LW,LW);
    return;
  }
  var spread=(jit==null?0.03:jit)*(0.25+wet*1.5);
  oldWash(P,col,seed,alpha,spread);
  if(!COLOR || (STYLE!=='watercolor' && STYLE!=='sumi'))return;
  var b=bbox(P), area=(b[2]-b[0])*(b[3]-b[1]), rr=mulberry32(hashInt(seed||1,CFG.paperSeed));
  var radius=Math.max(b[2]-b[0],b[3]-b[1]);
  if(radius>0.3){ctx.save();tracePath(P,true);ctx.clip();var centerX=lerp(b[0],b[2],0.7),centerY=lerp(b[1],b[3],0.8),gl=ctx.createRadialGradient(centerX,centerY,0,centerX,centerY,radius*0.85);gl.addColorStop(0,mapCol(col));gl.addColorStop(1,'rgba(255,255,255,0)');ctx.globalCompositeOperation='multiply';ctx.globalAlpha=(0.12+wet*0.15)*alpha*GALPHA;ctx.fillStyle=gl;ctx.fillRect(b[0],b[1],b[2]-b[0],b[3]-b[1]);ctx.restore();}
  var count=Math.min(180,Math.round(area/Math.max(LW*LW*75,0.015)*den));
  ctx.save(); tracePath(P,true); ctx.clip(); ctx.fillStyle=mapCol(col);
  ctx.globalAlpha=0.085*amount*(1-wet*0.45)*GALPHA;
  for(var i=0;i<count;i++){ var x=lerp(b[0],b[2],rr()),y=lerp(b[1],b[3],rr()),r=LW*(0.4+rr()*0.8);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill(); }
  ctx.restore();
};
texCanvas=function(kind){
  var key=kind+':'+CFG.paperSeed+':'+CFG.density;
  if(TEXCACHE[key])return TEXCACHE[key];
  if(Object.keys(TEXCACHE).length>12)TEXCACHE={};
  var c=document.createElement('canvas'),g=c.getContext('2d'),rr=mulberry32((CFG.paperSeed||271828)^8911),den=clamp(CFG.density,0.25,2.2);
  if(kind==='dots'){c.width=c.height=Math.max(5,Math.round(10/Math.sqrt(den)));g.fillStyle='rgba(20,17,16,0.55)';g.beginPath();g.arc(c.width/2,c.height/2,1.35,0,TAU);g.fill();}
  else{c.width=c.height=96;for(var i=0;i<Math.round(650*den);i++){g.fillStyle='rgba(255,252,244,'+(0.25+rr()*0.55)+')';g.fillRect(rr()*96,rr()*96,1+rr(),1+rr());}}
  TEXCACHE[key]=c;return c;
};

// Human outline families vary proportions without tying appearance to temperament.
var oldSilPt=Head.prototype.silPt;
Head.prototype.silPt=function(t){var p=oldSilPt.call(this,t);if(this.g.sp==='human'){
  var fam=hashInt(this.g.seed,71)%5,y=clamp(p[1],-1,1);
  if(fam===0){p[0]*=0.87;p[1]*=1.10;}
  if(fam===1){p[0]*=1.11;p[1]*=0.91;}
  if(fam===2)p[0]*=1+0.15*y;
  if(fam===3)p[0]*=1-0.13*y;
  if(fam===4)p[0]+=0.055*Math.sin(t*2);
}return p;};

/* Each shape has a structural silhouette. Shared contour and wash keep them in one world. */
function naturalPaint(P,col,seed,alpha,w){knock(P,seed,0.004);wash(P,col,seed+1,alpha==null?1:alpha,0.017);stroke(P,{close:true,w:w||1.1,jit:0.006,seed:seed+2});}
function petalFlower(x,y,size,col,seed){for(var j=0;j<5;j++){var a=j*TAU/5;naturalPaint(ring(x+Math.cos(a)*size*0.65,y+Math.sin(a)*size*0.65,size*0.52,size*0.6,12,a),col,seed+j,0.85,0.55);}fill(ring(x,y,size*0.24,size*0.24,10),{color:'#c7a447',jit:0,seed:seed+8});}
function naturalEyes(h,o,x,y,sep){
  if(Math.cos(h.yaw)<0.03)return;
  var blink=clamp(o.eye||0,0,1),gx=(o.gazeX||0)*0.028;
  for(var s=-1;s<=1;s+=2){var ex=x+s*sep+gx;
    if(blink>0.65)stroke([[ex-0.045,y],[ex,y+0.015],[ex+0.045,y]],{w:1,jit:0.002,seed:h.g.seed+s});
    else fill(ring(ex,y,0.026,0.039*(1-blink)+0.006,12),{jit:0,color:INK});
  }
  stroke([[x-0.055,y+0.13],[x,y+0.155+(o.smile||0)*0.035],[x+0.055,y+0.13]],{w:0.8,jit:0.003,seed:h.g.seed+94});
}
Head.prototype.drawNatural=function(o){
  var g=this.g,k=g.sp,seed=g.seed,wind=o.wind||0,den=clamp(CFG.density,0.25,2.2),i,P;
  ctx.save();ctx.scale(0.76+0.24*Math.abs(Math.cos(this.yaw)),1);ctx.transform(1,0,wind*0.035,1,0,0);
  if(k==='ginkgo'){
    stroke([[0,1.1],[0.10+wind*0.06,0.57],[0,0.05]],{color:COLOR?'#778354':INK,w:1.6,seed:seed+1,jit:0.008});
    P=[[0,0.62],[-0.50,0.15],[-0.94,-0.14],[-1.23,-0.45],[-1.12,-0.63],[-1.16,-0.83],[-0.91,-0.82],[-0.80,-1.0],[-0.56,-0.93],[-0.39,-1.11],[-0.16,-1.06],[-0.06,-0.88],[0.04,-1.11],[0.31,-1.10],[0.46,-0.94],[0.70,-1.02],[0.86,-0.85],[1.10,-0.80],[1.05,-0.59],[1.23,-0.40],[0.89,-0.10],[0.45,0.21],[0,0.62]];
    naturalPaint(P,g.fur,seed,0.96,1.05);
    var veins=Math.round(8+den*5);
    for(i=0;i<veins;i++){var t=i/(veins-1),xx=lerp(-0.94,0.94,t),yy=-0.95+0.52*Math.pow(Math.abs(xx),2);stroke([[0,0.57],[xx*0.47,-0.08],[xx,yy]],{color:COLOR?'#6e8050':INK,alpha:0.35,w:0.52,jit:0.004,seed:seed+30+i});}
    naturalEyes(this,o,0,-0.15,0.19);
  }else if(k==='cactus'){
    P=[[-0.33,0.76],[-0.38,0.25],[-0.76,0.25],[-0.90,0.08],[-0.91,-0.49],[-0.77,-0.62],[-0.64,-0.48],[-0.65,-0.02],[-0.37,-0.07],[-0.38,-0.77],[-0.26,-1.04],[0,-1.12],[0.27,-0.98],[0.34,-0.72],[0.33,-0.24],[0.65,-0.31],[0.66,-0.65],[0.81,-0.75],[0.94,-0.61],[0.94,-0.14],[0.82,0.03],[0.34,0.14],[0.30,0.76]];
    naturalPaint(P,g.fur,seed,0.95,1.2);
    for(i=-1;i<=1;i++)stroke([[i*0.18,0.65],[i*0.18+0.025,-0.18],[i*0.15,-0.88]],{w:0.65,alpha:0.36,color:COLOR?'#3e6654':INK,seed:seed+10+i});
    var pr=mulberry32(seed),count=Math.round(13*den);for(i=0;i<count;i++){var x=(pr()<0.5?-1:1)*(0.34+pr()*0.08),y=-0.83+pr()*1.48;stroke([[x-0.055,y-0.035],[x,y],[x+0.065,y-0.04]],{w:0.65,alpha:0.65,seed:seed+60+i,jit:0.001});}
    petalFlower(0.12,-1.08+wind*0.025,0.15,'#c97883',seed+80);
    naturalPaint([[-0.55,0.76],[0.52,0.76],[0.41,1.16],[-0.41,1.16]],'#b7866d',seed+120,0.8,0.9);
    stroke([[-0.60,0.76],[0.58,0.76]],{w:1.5,seed:seed+125});naturalEyes(this,o,0,-0.34,0.145);
  }else if(k==='mushroom'){
    P=[[-0.20,-0.18],[0.24,-0.18],[0.23,0.33],[0.39,1.02],[0.13,1.15],[-0.33,1.04],[-0.20,0.39]];
    naturalPaint(P,'#d3c4a0',seed+1,0.52,1);
    var capShift=wind*0.07;ctx.save();ctx.translate(0,capShift);
    naturalPaint(ring(0,-0.21,1.04,0.22,32),'#d1ae94',seed+8,0.65,0.8);
    var ribs=Math.round(9+den*7);for(i=0;i<ribs;i++){var xx=lerp(-0.96,0.96,i/(ribs-1));stroke([[0,-0.13],[xx*0.5,-0.11],[xx,-0.23]],{w:0.48,alpha:0.46,seed:seed+20+i});}
    P=[[-1.09,-0.26],[-0.85,-0.68],[-0.53,-1.06],[-0.18,-1.24],[0.21,-1.17],[0.62,-0.95],[0.92,-0.57],[1.09,-0.24],[0.64,-0.32],[0.14,-0.37],[-0.46,-0.30],[-1.09,-0.26]];
    naturalPaint(P,g.fur,seed+3,1,1.2);
    [[-0.44,-0.70,0.13],[-0.02,-0.95,0.09],[0.39,-0.68,0.14],[0.68,-0.44,0.07],[-0.76,-0.41,0.065]].forEach(function(p,j){wash(ring(p[0],p[1],p[2],p[2]*0.52,15),'#eadbb5',seed+50+j,0.9,0.006);});
    ctx.restore();naturalEyes(this,o,0,0.34,0.13);
  }else if(k==='teapot'){
    naturalPaint(ring(0.77,-0.17,0.56,0.53,28),g.fur,seed+1,0.85,1.2);
    var hole=ring(0.82,-0.20,0.34,0.31,24);knock(hole,seed+4,0.003);stroke(hole,{close:true,w:1,seed:seed+5});
    naturalPaint([[-0.54,0.34],[-0.90,0.18],[-1.02,-0.13],[-1.05,-0.56],[-1.31,-0.67],[-1.35,-0.80],[-0.94,-0.80],[-0.71,-0.38],[-0.39,-0.20]],g.fur,seed+8,0.85,1.15);
    naturalPaint([[-0.45,-0.68],[0.41,-0.68],[0.77,-0.19],[0.79,0.41],[0.51,0.80],[-0.40,0.82],[-0.76,0.42],[-0.79,-0.17]],g.fur,seed+13,0.88,1.2);
    // Quiet ceramic ornament stays below the face.
    for(i=-2;i<=2;i++)stroke([[i*0.2-0.08,0.56],[i*0.2,0.48],[i*0.2+0.08,0.56]],{w:0.7,alpha:0.5,color:COLOR?'#3d6479':INK,seed:seed+26+i});
    ctx.save();ctx.translate(0,-Math.abs(wind)*0.14);ctx.rotate(wind*0.055);
    naturalPaint([[-0.57,-0.66],[-0.34,-0.89],[0.32,-0.89],[0.58,-0.66]],g.fur,seed+33,0.9,1);
    naturalPaint(ring(0,-0.97,0.115,0.09,14),'#bfa574',seed+37,0.8,0.8);ctx.restore();
    naturalEyes(this,o,-0.01,-0.10,0.21);
    if(Math.abs(wind)>0.08){for(i=0;i<2;i++)stroke([[-1.18+i*0.1,-0.9],[-1.30+i*0.1+wind*0.15,-1.08],[-1.13+i*0.1+wind*0.23,-1.29]],{w:0.75,alpha:Math.abs(wind)*0.35,seed:seed+60+i});}
  }else if(k==='cloud'){
    ctx.save();ctx.scale(1+Math.abs(wind)*0.10,1-Math.abs(wind)*0.05);
    P=[[-1.14,0.18],[-1.25,-0.02],[-1.21,-0.34],[-0.99,-0.49],[-0.79,-0.48],[-0.86,-0.80],[-0.67,-1.05],[-0.31,-1.08],[-0.03,-0.88],[0.04,-0.57],[0.23,-0.87],[0.55,-0.86],[0.75,-0.63],[0.72,-0.41],[1.02,-0.46],[1.23,-0.22],[1.21,0.05],[0.98,0.30],[0.55,0.29],[0.25,0.43],[-0.08,0.32],[-0.53,0.43],[-0.88,0.26]];
    naturalPaint(P,g.fur,seed,0.55,0.85);naturalEyes(this,o,-0.04,-0.21,0.20);ctx.restore();
    for(i=0;i<3;i++){var xx=(i-1)*0.42,yy=0.70+(i%2)*0.16;stroke([[xx+wind*0.04,yy],[xx-0.045+wind*0.10,yy+0.16]],{color:COLOR?'#7197ad':INK,w:0.8,alpha:0.4,seed:seed+40+i});}
  }
  ctx.restore();
};
var oldDrawBodyAt=Head.prototype.drawBodyAt,oldDrawHeadAt=Head.prototype.drawHeadAt;
Head.prototype.drawBodyAt=function(o){if(!this.g.natural)return oldDrawBodyAt.call(this,o);};
Head.prototype.drawHeadAt=function(o){
  var prevQuiet=FACE_QUIET;
  if(!this.g.natural){FACE_QUIET={x:Math.sin(this.yaw)*0.28,y:0.05,rx:0.38,ry:0.40};try{return oldDrawHeadAt.call(this,o);}finally{FACE_QUIET=prevQuiet;}}
  if(this.s*this.pop<0.001)return;
  FACE_QUIET={x:0,y:this.g.sp==='mushroom'?0.40:this.g.sp==='cactus'?-0.29:-0.09,rx:this.g.sp==='mushroom'?0.18:0.29,ry:0.19};
  useStyle(this.g);GALPHA=o.ghost?1-0.86*o.ghost:1;var oldYaw=this.yaw;this.yaw+=o.spin||0;
  ctx.save();ctx.translate(this.x,this.y);ctx.scale(this.s*this.pop,this.s*this.pop);ctx.translate(o.ox||0,o.oy||0);ctx.rotate(this.roll);var hs=o.hs||1;ctx.scale(hs,hs);LW=1.15*LINE_K/(this.s*this.pop*hs);
  if(o.melt>0.01){ctx.translate(0,0.9);ctx.scale(1+o.melt*0.4,Math.max(0.12,1-o.melt*0.78));ctx.translate(0,-0.9);}
  this.drawNatural(o);if(o.ice>0.02)this.drawIce(o);ctx.restore();this.yaw=oldYaw;GALPHA=1;FACE_QUIET=prevQuiet;
};

/* Wind has a finite envelope and material-specific secondary motion. */
FACE_FIELDS.push('wind');
defineFx('breeze',{channels:['pos','wind'],dur:2800,step:function(h,a,t,k,d){
  var e=Math.sin(Math.PI*k),f=e*Math.sin(k*Math.PI*3.3+(a.phase||0)),soft=reduceMotion()?0.22:1;
  d.wind=f*soft;d.roll=f*(h.g.sp==='cactus'?0.035:h.g.sp==='ginkgo'?0.23:0.10)*soft;
  d.flap=f*0.5*soft;d.smile=0.65;d.gazeX=0.5;
  if(h.g.sp==='cloud')d.ox=e*0.3*soft;
  if(h.g.sp==='mushroom')d.oy=-Math.abs(f)*0.07*soft;
}});
BRUSH_ONE.breeze=function(h){act(h,'breeze',{phase:h.col*0.35});};TRIG_NAMES.breeze='风经过';
function sendBreeze(){if(SUPER){toast('等这一幕结束，再让风经过。');return;}heads.forEach(function(h,i){act(h,'breeze',{delay:i*25,phase:h.col*0.3});});toast('风经过：叶片弯折，菌盖轻弹，壶盖轻响，云慢慢伸展。',2800);}
// Radius is a spatial control, independent of the brush material's density.
brushAt=function(x,y){if(!BRUSH)return;var now=performance.now(),r=Math.max(cellW,cellH)*CFG.brushRadius;heads.forEach(function(h){if(Math.hypot(h.x-x,h.y-y)>r || (BRUSH.cool.get(h)||0)>now)return;BRUSH.cool.set(h,now+1600/CFG.speed);BRUSH_ONE[BRUSH.name](h);});};

/* Composition leaves room for a subject and its response. Grid order is retained for old finales. */
function updateStageSummary(){
  var el=document.getElementById('stageSummary');if(!el)return;
  var cols=Number(CFG.cols)||'auto',rows=Number(CFG.rows)||'auto',n=heads.length||0,en=typeof UI_LANG!=='undefined'&&UI_LANG==='en';
  el.textContent=en?'Stage · '+cols+' × '+rows+' · '+n+' characters':'舞台 · '+cols+' × '+rows+' · '+n+' 位';
  el.setAttribute('aria-label',el.textContent+(en?' · click to restore the default 7 × 5 stage':'；点击恢复默认 7×5 舞台'));
  el.setAttribute('title',en?'Restore the default 7 × 5 stage':'点击恢复默认 7×5 舞台');
}
var oldLayout=layout;
layout=function(){oldLayout();if(CFG.composition==='cluster' && heads.length<=12){
  heads.forEach(function(h,i){var count=heads.length;
    if(i===0){h.x=W*0.49;h.y=H*0.46;h.s=Math.min(W,H)*0.125;}
    else{var a=-Math.PI/2+(i-1)*TAU/Math.max(1,count-1);h.x=W*0.5+Math.cos(a)*W*0.30;h.y=H*0.51+Math.sin(a)*H*0.30;h.s=Math.min(W,H)*(0.068+hash2(i,81)*0.019);}
  });
}else if(CFG.composition==='portrait' && heads.length===1){heads[0].x=W/2;heads[0].y=H*0.47;heads[0].s=Math.min(W*0.23,H*0.29);}updateStageSummary();
};
var studioScene='';
pushUndo=function(){UNDO.push({faces:heads.map(function(h){return{dna:h.dna.slice(),look:h.look?Object.assign({},h.look):null};}),cfg:JSON.parse(JSON.stringify(CFG)),mode:MODE,scene:studioScene});if(UNDO.length>5)UNDO.shift();};
undo=function(){var saved=UNDO.pop();if(!saved){toast('还没有可撤销的改动。');return;}if(SUPER){SUPER=null;document.body.classList.remove('super');}endBrush();CFG=normalizedConfig(saved.cfg);MODE=saved.mode;studioScene=saved.scene;applyTheme();layout();heads.forEach(function(h,i){var f=saved.faces[i];if(f){clearActs(h);h.setDNA(f.dna,f.look);h.pop=1;}});saveCfg();syncPanel();document.querySelectorAll('[data-scene]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.scene===studioScene?'true':'false');});toast('上一幅构图、角色和画材都回来了。');};
function applyStudioScene(name){
  pushUndo();exitAll();endBrush();if(SUPER){SUPER=null;document.body.classList.remove('super');}MODE=0;
  studioScene=name;
  var settings={cabinet:{cols:5,rows:3,composition:'grid',styles:['watercolor'],palettes:['morandi'],paper:'cream',density:0.85,pigment:1.1,wetness:0.5},garden:{cols:3,rows:2,composition:'cluster',styles:['watercolor'],palettes:['cn'],paper:'xuan',density:0.85,pigment:1,wetness:0.68},curios:{cols:3,rows:2,composition:'cluster',styles:['gongbi'],palettes:['qinghua'],paper:'porcelain',density:0.7,pigment:1,wetness:0.25},portrait:{cols:1,rows:1,composition:'portrait',styles:['pencil'],palettes:[],paper:'cream',density:1.25,pigment:1.05,wetness:0.2}}[name];
  if(!settings)return;Object.assign(CFG,settings,{mono:false,palMode:'accents',chain:'few'});applyTheme();layout();
  var sample=name==='garden'?[1,2,3,1,3,5]:name==='curios'?[4,5,4,5,4,3]:[0,1,0,4,0,2,0,3,0,5,0,1,0,3,0];
  heads.forEach(function(h,i){if(isKept(h.code))return;var seed=hashInt(481+i*113,name.length*97),d=pureDNA(seed),tag=name==='portrait'?0:sample[i%sample.length];
    if(name==='portrait'){while(baseGenes(seed).sp!=='human')seed=(seed+1)>>>0;d=pureDNA(seed);}
    if(tag)d.push(tag);clearActs(h);h.setDNA(d);h.pop=1;
  });saveCfg();syncPanel();paintBrushSample();
  document.querySelectorAll('[data-scene]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.scene===name?'true':'false');});
  toast('已换一幅构图。双击角色收藏，或送一阵风。',2200);
}

PANEL.unshift({group:'画材 · 让每一笔有性格',note:'疏密改变笔触数量；浓淡改变着色强度。干湿主要作用于水彩与水墨。',items:[
  {id:'density',label:'笔触疏密',type:'range',min:0.25,max:2.2,step:0.05,fmt:function(v){return Math.round(v*100)+'%';}},
  {id:'pigment',label:'颜料浓淡',type:'range',min:0.25,max:1.7,step:0.05,fmt:function(v){return Math.round(v*100)+'%';}},
  {id:'wetness',label:'干笔 ↔ 湿润',type:'range',min:0,max:1,step:0.05,fmt:function(v){return Math.round(v*100)+'%';}}
]});
PANEL.splice(2,0,{group:'新的邻居',note:'这两项是全部角色中的生成比例；其余比例使用原有人物与动物权重。收藏的角色会保留。',items:[
  {id:'nature',label:'植物与菌菇',type:'range',min:0,max:70,step:5,fmt:function(v){return v+'%';}},
  {id:'objects',label:'茶壶与云',type:'range',min:0,max:30,step:5,fmt:function(v){return v+'%';}},
  {id:'composition',label:'构图',type:'seg',relayout:true,opts:[['grid','图鉴网格'],['cluster','小群落（12 位以内）'],['portrait','肖像（1 位）']]},
  {id:'brushRadius',label:'动作刷范围',type:'range',min:0.2,max:1.2,step:0.05,fmt:function(v){return Math.round(v*100)+'%';}}
]});
STYLES.pencil='Pencil 铅笔';
PANEL.forEach(function(G){G.items.forEach(function(it){if(it.id==='styles')it.opts=Object.keys(STYLES).map(function(k){return[k,STYLES[k]];});if(it.id==='line')it.label='线条粗细';if(it.id==='wobble')it.label='手绘起伏';});});
var oldBuildPanel=buildPanel,oldSyncPanel=syncPanel;
function paintBrushSample(){
  var c=document.getElementById('brushSample');if(!c || !c.getContext)return;
  c.width=300;c.height=86;var x=c.getContext('2d');x.fillStyle=PAPER;x.fillRect(0,0,300,86);
  var prev={ctx:ctx,PAT:PAT,LW:LW,STYLE:STYLE,COLOR:COLOR,HEADMAP:HEADMAP,GALPHA:GALPHA};
  ctx=x;PAT=null;LW=1;GALPHA=1;useStyle({seed:122,fur:'#829987',cloth:'#b8826e',hairCol:'#2a2320',hatCol:'#9c8c70'});
  for(var j=0;j<3;j++){var P=[[20+j*92,62],[30+j*92,22],[55+j*92,14],[82+j*92,52],[64+j*92,69]];wash(P,'#7f9c83',180+j,1,1.8);stroke(P,{close:true,w:1,seed:180+j,jit:0.7});}
  ctx=prev.ctx;PAT=prev.PAT;LW=prev.LW;STYLE=prev.STYLE;COLOR=prev.COLOR;HEADMAP=prev.HEADMAP;GALPHA=prev.GALPHA;
}
buildPanel=function(){oldBuildPanel();var c=document.createElement('canvas');c.id='brushSample';c.setAttribute('aria-label','当前画材笔触预览');panelBody.insertBefore(c,panelBody.firstChild);paintBrushSample();};
syncPanel=function(){oldSyncPanel();paintBrushSample();};

// Validate shared/local settings before they reach allocation or draw loops.
function normalizedConfig(input){
  var c=JSON.parse(JSON.stringify(CFG_DEFAULT));if(!input || typeof input!=='object')return c;
  var ranges={cols:[0,14],rows:[0,10],scale:[0.7,1.3],hybrid:[0,50],line:[0.6,1.8],wobble:[0,2],speed:[0.5,2],density:[0.25,2.2],pigment:[0.25,1.7],wetness:[0,1],nature:[0,70],objects:[0,30],brushRadius:[0.2,1.2],volume:[0,100],paperSeed:[0,4294967295],motionStrength:[0.2,1.2],motionPace:[0.6,1.4]};
  Object.keys(ranges).forEach(function(k){if(typeof input[k]==='number' && Number.isFinite(input[k]))c[k]=clamp(input[k],ranges[k][0],ranges[k][1]);});c.cols=Math.round(c.cols);c.rows=Math.round(c.rows);c.paperSeed=Math.round(c.paperSeed);
  var enums={paper:Object.keys(PAPERS),palMode:['accents','fur','all'],chain:['off','few','normal','lively'],kmode:['kiss','knock'],reduce:['system','on','off'],composition:['grid','cluster','portrait']};
  Object.keys(enums).forEach(function(k){if(enums[k].indexOf(input[k])>=0)c[k]=input[k];});
  ['styles','palettes'].forEach(function(k){if(Array.isArray(input[k])){var all=k==='styles'?STYLES:PALETTES;c[k]=input[k].filter(function(s){return typeof s==='string' && Object.prototype.hasOwnProperty.call(all,s);});}});
  if(!c.styles || !c.styles.length)c.styles=['watercolor'];c.mono=typeof input.mono==='boolean'?input.mono:c.mono;
  if(Array.isArray(input.speciesPool))c.speciesPool=input.speciesPool.filter(function(k){return typeof k==='string';}).slice(0,64);
  if(input.w && typeof input.w==='object')Object.keys(c.w).forEach(function(k){if(typeof input.w[k]==='number' && Number.isFinite(input.w[k]))c.w[k]=clamp(input.w[k],0,100);});
  if(input.auto && typeof input.auto==='object'){c.auto.on=input.auto.on==='on'?'on':'off';['min','max','vol','idle','sleep'].forEach(function(k){var rr={min:[5,60],max:[5,60],vol:[0,100],idle:[1,10],sleep:[10,60]}[k];if(typeof input.auto[k]==='number'&&Number.isFinite(input.auto[k]))c.auto[k]=clamp(input.auto[k],rr[0],rr[1]);});c.auto.max=Math.max(c.auto.min,c.auto.max);}
  return c;
}
CFG=normalizedConfig(CFG);
importCode=function(str){
  str=String(str||'').trim();if(str.length>100000)return false;var m=str.match(/^(hcs?1)\.([A-Za-z0-9_-]+)$/);if(!m)return false;var o;
  try{o=JSON.parse(b64d(m[2]));}catch(e){return false;}
  if(!o || o.v!==1 || !o.c || typeof o.c!=='object')return false;
  var next=normalizedConfig(Object.assign({},CFG,o.c)),faces=null;
  if(m[1]==='hcs1'){
    if(!Array.isArray(o.f) || o.f.length<1 || o.f.length>140 || !next.cols || !next.rows || o.f.length!==next.cols*next.rows)return false;
    faces=o.f.map(decodeCode);if(faces.some(function(f){return !f;}))return false;
  }
  pushUndo();CFG=next;applyTheme();layout();if(faces)heads.forEach(function(h,i){clearActs(h);h.setDNA(faces[i].dna,faces[i].look);h.pop=1;});saveCfg();syncPanel();return true;
};

document.querySelectorAll('[data-scene]').forEach(function(b){b.addEventListener('click',function(){applyStudioScene(b.dataset.scene);});});
document.getElementById('studioWind').addEventListener('click',sendBreeze);
document.getElementById('studioWindBrush').addEventListener('click',function(){if(BRUSH && BRUSH.name==='breeze')endBrush();else startBrush('breeze');});
document.getElementById('studioMaterials').addEventListener('click',function(){togglePanel(true);});
document.getElementById('studioExport').addEventListener('click',function(){
  if(typeof beginExport==='function'&&!beginExport(['这一刻的画面','this moment']))return;
  var out=document.createElement('canvas');out.width=cv.width;out.height=cv.height;out.getContext('2d').drawImage(cv,0,0);
  canvasBlob(out,'image/png').then(function(blob){
    if(typeof endExport==='function')endExport();
    if(blob)return saveFile('趣像-这一刻.png',blob);
    toast(qxLocal('画面未能生成，请再试一次。','The picture could not be made — try again.'));
  }).catch(function(){if(typeof endExport==='function')endExport();toast(qxLocal('保存未完成，请再试一次。','Saving did not finish — try again.'));});
});
document.getElementById('stageSummary').addEventListener('click',function(){
  if(cardOpen)closeCard();if(SUPER){SUPER=null;document.body.classList.remove('super');}endBrush();pushUndo();exitAll();
  CFG.cols=STAGE_DEFAULT.cols;CFG.rows=STAGE_DEFAULT.rows;CFG.composition='grid';studioScene='';
  try{localStorage.setItem('quxiang.gridChoice','default');localStorage.setItem('quxiang.grid7x5','1');}catch(e){}
  applyTheme();layout();saveCfg();syncPanel();document.querySelectorAll('[data-scene]').forEach(function(b){b.setAttribute('aria-pressed','false');});
  toast(qxLocal('默认舞台已恢复：'+STAGE_DEFAULT.cols+' 列 × '+STAGE_DEFAULT.rows+' 行。','Default stage restored: '+STAGE_DEFAULT.cols+' columns × '+STAGE_DEFAULT.rows+' rows.'),1800);
});
// The artwork is the default state. The dock remains as a small, discoverable
// handle; U or the handle reveals the full operation bars without changing the
// selected cast, scene, or saved drawing.
var immersiveSheet=document.getElementById('sheet'),immersiveToggle=document.getElementById('immersiveToggle'),immersiveStudio=document.getElementById('studioBar'),immersivePlay=document.getElementById('playBar');
function setImmersive(on,persist){
  on=!!on;if(!immersiveSheet)return on;
  immersiveSheet.classList.toggle('immersive',on);
  var immersiveEnglish=typeof UI_LANG!=='undefined'&&UI_LANG==='en';
  if(immersiveToggle){immersiveToggle.setAttribute('aria-expanded',on?'false':'true');immersiveToggle.setAttribute('title',immersiveEnglish?(on?'Show controls (Tab)':'Hide controls (Tab)'):(on?'显示操作栏（Tab）':'收起操作栏（Tab）'));var txt=immersiveToggle.querySelector?immersiveToggle.querySelector('.immersiveText'):null;if(txt)txt.textContent=immersiveEnglish?(on?'Show tools':'Hide tools'):(on?'显示工具':'收起工具');}
  if(immersiveStudio)immersiveStudio.setAttribute('aria-hidden',on?'true':'false');if(immersivePlay)immersivePlay.setAttribute('aria-hidden',on?'true':'false');
  if(persist!==false){try{localStorage.setItem('quxiang.immersive',on?'on':'off');}catch(e){}}
  if(typeof layout==='function')requestAnimationFrame(function(){layout();});return on;
}
function immersiveState(){return !!(immersiveSheet&&immersiveSheet.classList.contains('immersive'));}
var immersiveSaved='on';try{immersiveSaved=localStorage.getItem('quxiang.immersive')||'on';}catch(e){}
setImmersive(immersiveSaved!=='off',false);
if(immersiveToggle)immersiveToggle.addEventListener('click',function(){setImmersive(!immersiveState());});
/* r43 键位：工具栏不再占 U（U 是基线的"下雨"，两者同时触发）。
   改为 Tab：焦点还在舞台上时按 Tab，工具栏展开并把焦点交给第一个按钮——想用键盘走到控件，正是该显示控件的时候；
   从工具栏里按 Esc，收起（仅限这次是 Tab 叫出来的）并把焦点还给舞台。焦点已在控件里时 Tab 照常走。 */
var immersiveByTab=false;
function immersiveOnStage(){var a=document.activeElement;return !a||a===document.body||a===document.documentElement||a.id==='c'||a.id==='stage';}
document.addEventListener('keydown',function(e){
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  var bar=document.getElementById('studioBar'),play=document.getElementById('playBar');
  if(e.key==='Tab'&&!e.shiftKey&&immersiveOnStage()&&immersiveState()&&!(typeof helpOpen!=='undefined'&&helpOpen)&&!(typeof cardOpen!=='undefined'&&cardOpen)){
    e.preventDefault();setImmersive(false);immersiveByTab=true;
    requestAnimationFrame(function(){var f=bar&&bar.querySelector('button:not([disabled]),select');if(f)f.focus();});return;
  }
  if(e.key==='Escape'&&immersiveByTab&&document.activeElement&&((bar&&bar.contains(document.activeElement))||(play&&play.contains(document.activeElement)))){
    immersiveByTab=false;document.activeElement.blur();setImmersive(true);
  }
});
/* v13-r17 拾趣馆集成：本作作为校园站展品挂在 /static/fun/ 下时，给一条回馆的路。
   独立打开压缩包（file:// 或本地预览）时不注入，保持作品自洽。 */
(function(){
  if(location.pathname.indexOf('/static/fun/') !== 0) return;
  var a = document.createElement('a');
  a.id = 'funBackLink'; a.href = '/campus/fun';
  a.textContent = (typeof UI_LANG !== 'undefined' && UI_LANG === 'en') ? '‹ Gallery' : '‹ 拾趣馆';
  a.setAttribute('aria-label', (typeof UI_LANG !== 'undefined' && UI_LANG === 'en') ? 'Back to the gallery' : '返回拾趣馆');
  var st = document.createElement('style');
  st.textContent = '#funBackLink{position:fixed;top:12px;right:12px;z-index:60;padding:6px 14px;border-radius:999px;' +
    'border:1px solid rgba(70,60,45,.28);background:rgba(247,243,232,.82);color:#4a4438;' +
    'font:13px/1.5 "Noto Serif SC","Songti SC",serif;letter-spacing:.18em;text-decoration:none;' +
    'backdrop-filter:blur(6px);transition:background .18s,border-color .18s}' +
    '#funBackLink:hover{background:#fffdf6;border-color:rgba(70,60,45,.6)}' +
    '#funBackLink:focus-visible{outline:2px solid #6b7f5f;outline-offset:2px}' +
    '@media(max-width:600px){#funBackLink{top:8px;right:8px;padding:5px 11px;font-size:12px}}';
  document.head.appendChild(st); document.body.appendChild(a);
})();

// Keep the original card recolour controls, but name materials correctly for the new forms.
var oldBuildRecolour=buildRecolour;
buildRecolour=function(){oldBuildRecolour();if(card && card.head.g.natural){var labs=document.getElementById('recolourMenu').querySelectorAll('.swrow > span');if(labs[0])labs[0].textContent='本色';}};
