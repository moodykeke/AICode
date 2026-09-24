/* Species selection is independent of structural hybridisation. */
var SPECIES_CATALOG=NATURAL.concat(Object.keys(LEGACY_LABELS));
['speciesPool','motionStrength','motionPace'].forEach(function(k){if(SHARE_KEYS.indexOf(k)<0)SHARE_KEYS.push(k);});
var ensembleNormalize=normalizedConfig;
function validSpecies(list){if(!Array.isArray(list))return [];return list.filter(function(k,i){return typeof k==='string' && SPECIES_CATALOG.indexOf(k)>=0 && list.indexOf(k)===i;}).slice(0,SPECIES_CATALOG.length);}
normalizedConfig=function(input){var c=ensembleNormalize(input);c.speciesPool=validSpecies(input&&input.speciesPool);return c;};
CFG=normalizedConfig(CFG);
var selectedSpecies=[],castChoiceMode='mixed',poolCursor=0;
var ensembleRandomDNA=randomDNA;
randomDNA=function(){if(MODE===0 && CFG.speciesPool && CFG.speciesPool.length){var pool=castSchedule(CFG.speciesPool,Math.max(CFG.speciesPool.length,(CFG.cols||7)*(CFG.rows||6)));return atlasDNA(pool[(poolCursor++)%pool.length],randSeed());}return ensembleRandomDNA();};
function syncCastSelection(){
 document.querySelectorAll('.atlasPick').forEach(function(b){b.setAttribute('aria-pressed',selectedSpecies.indexOf(b.dataset.kind)>=0?'true':'false');});
 document.querySelectorAll('[data-cast-mode]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.castMode===castChoiceMode?'true':'false');});
 document.querySelectorAll('.atlasGroupSection').forEach(function(section){var fam=section.dataset.family,keys=SPECIES_CATALOG.filter(function(k){var info=NATURAL_INFO[k]||{family:'人物、动物与老朋友'};return (info.family||'花园与异物')===fam;}),picked=keys.filter(function(k){return selectedSpecies.indexOf(k)>=0;}).length,all=keys.length>0&&picked===keys.length,select=section.querySelector('.atlasGroupSelect'),meta=section.querySelector('.atlasGroupMeta');if(select){select.textContent=all?'全不选':'全选';select.setAttribute('aria-pressed',all?'true':'false');select.setAttribute('aria-label',(all?'取消选择':'选择')+fam+'全部物种');select.title=all?'取消本组全选':'选择本组全部物种';}if(meta)meta.textContent=picked+'/'+keys.length;});
 var count=selectedSpecies.length;document.getElementById('castSelectionStatus').textContent=count ? '已选 '+count+' 种 · '+(count===1?'同一物种，不同个性':'按系列分区，保持各自物种形象') : '点选下方头像；“看特写”不会改变勾选。';
 document.getElementById('castApply').disabled=!count;
}
function chooseCastMode(mode){castChoiceMode=mode==='single'?'single':'mixed';if(castChoiceMode==='single' && selectedSpecies.length>1)selectedSpecies=selectedSpecies.slice(0,1);syncCastSelection();}
function chooseSpecies(kind){if(SPECIES_CATALOG.indexOf(kind)<0)return;var i=selectedSpecies.indexOf(kind);if(castChoiceMode==='single')selectedSpecies=i>=0?[]:[kind];else if(i>=0)selectedSpecies.splice(i,1);else selectedSpecies.push(kind);syncCastSelection();}
function familyKeys(fam){return SPECIES_CATALOG.filter(function(k){var info=NATURAL_INFO[k]||{family:'人物、动物与老朋友'};return (info.family||'花园与异物')===fam;});}
function toggleFamilySelection(fam){var keys=familyKeys(fam);if(!keys.length)return false;if(castChoiceMode==='single')castChoiceMode='mixed';var all=keys.every(function(k){return selectedSpecies.indexOf(k)>=0;});if(all)selectedSpecies=selectedSpecies.filter(function(k){return keys.indexOf(k)<0;});else keys.forEach(function(k){if(selectedSpecies.indexOf(k)<0)selectedSpecies.push(k);});syncCastSelection();return true;}
function applySelectedCast(list,count){
 var pool=validSpecies(list);if(!pool.length)return false;
 var sizes=[1,4,8,12,16,24,32,42,48,64],wanted=Math.max(pool.length,Number(count)||42),n=sizes.find(function(v){return v>=wanted;})||64;
 if(cardOpen)closeCard();pushUndo();endBrush();SUPER=null;document.body.classList.remove('super');ATLAS_BUBBLES=[];ENSEMBLE_LINKS=[];MODE=0;studioScene='';poolCursor=0;
 var dim={1:[1,1],4:[2,2],8:[4,2],12:[4,3],16:[4,4],24:[6,4],32:[8,4],42:[7,6],48:[8,6],64:[8,8]}[n].slice(),portrait=stage.getBoundingClientRect().width<600;if(n!==42&&portrait&&dim[0]>dim[1])dim.reverse();
 Object.assign(CFG,{speciesPool:pool,cols:dim[0],rows:dim[1],composition:n===1?'portrait':'grid'});applyTheme();layout();
 var schedule=castSchedule(pool,heads.length);heads.forEach(function(h,i){clearActs(h);h.setDNA(atlasDNA(schedule[i],randSeed()));h.pop=1;});poolCursor=0;
 saveCfg();syncPanel();document.getElementById('castCount').value=String(n);document.querySelectorAll('[data-scene]').forEach(function(b){b.setAttribute('aria-pressed','false');});toggleAtlasLibrary(false);
 toast(pool.length===1?'同一种物种，各有自己的颜色与细节。':'已按 '+pool.length+' 种物种分区排列；没有自动混生。',2600);return true;
}
buildAtlasLibrary=function(){
 selectedSpecies=validSpecies(CFG.speciesPool);if(!selectedSpecies.length)selectedSpecies=validSpecies(heads.map(function(h){return h.g.sp;}));if(!selectedSpecies.length)selectedSpecies=['shrimp','crab'];castChoiceMode=selectedSpecies.length===1?'single':'mixed';
 document.getElementById('castCount').value=String([1,4,8,12,16,24,32,42,48,64].indexOf(heads.length)>=0?heads.length:8);
 var box=document.getElementById('atlasCards');box.innerHTML='';var last='',groupSection=null,groupGrid=null;
 SPECIES_CATALOG.forEach(function(k,i){var info=NATURAL_INFO[k]||{name:LEGACY_LABELS[k],family:'人物、动物与老朋友'},fam=info.family||'花园与异物';if(fam!==last){
   groupSection=document.createElement('section');groupSection.className='atlasGroupSection';groupSection.dataset.family=fam;var sectionForGroup=groupSection;
   var head=document.createElement('div');head.className='atlasGroupHead';var label=document.createElement('div');label.className='atlasGroup';label.textContent=fam;var meta=document.createElement('span');meta.className='atlasGroupMeta';var controls=document.createElement('div');controls.className='atlasGroupControls';var selectAll=document.createElement('button');selectAll.type='button';selectAll.className='atlasGroupSelect';selectAll.textContent='全选';selectAll.setAttribute('aria-pressed','false');selectAll.setAttribute('aria-label','选择'+fam+'全部物种');selectAll.addEventListener('click',function(e){e.stopPropagation();toggleFamilySelection(fam);});var collapse=document.createElement('button');collapse.type='button';collapse.className='atlasGroupToggle';collapse.textContent='收起';collapse.setAttribute('aria-expanded','true');collapse.setAttribute('aria-label','收起'+fam);collapse.addEventListener('click',function(){var closed=sectionForGroup.classList.toggle('is-collapsed');collapse.textContent=closed?'展开':'收起';collapse.setAttribute('aria-expanded',closed?'false':'true');collapse.setAttribute('aria-label',(closed?'展开':'收起')+fam);});controls.appendChild(meta);controls.appendChild(selectAll);controls.appendChild(collapse);head.appendChild(label);head.appendChild(controls);groupGrid=document.createElement('div');groupGrid.className='atlasGroupGrid';groupSection.appendChild(head);groupSection.appendChild(groupGrid);box.appendChild(groupSection);last=fam;
  }
   var wrap=document.createElement('div');wrap.className='atlasSpecimen';var b=document.createElement('button');b.type='button';b.className='atlasPick';b.dataset.kind=k;b.setAttribute('aria-label','选择'+info.name);b.setAttribute('aria-pressed',selectedSpecies.indexOf(k)>=0?'true':'false');
   var c=document.createElement('canvas');b.appendChild(c);var label=document.createElement('span');label.textContent=info.name;b.appendChild(label);wrap.appendChild(b);groupGrid.appendChild(wrap);miniPortrait(c,atlasDNA(k,431+i*71),110,0,null);b.addEventListener('click',function(){chooseSpecies(k);});
   var peek=document.createElement('button');peek.type='button';peek.className='atlasPeek';peek.textContent='看特写';peek.setAttribute('aria-label','查看'+info.name+'特写');peek.addEventListener('click',function(){focusAtlasCharacter(k);});wrap.appendChild(peek);
 });
 ['fusionBase','fusionDonor'].forEach(function(id){var sel=document.getElementById(id),old=sel.value;sel.innerHTML='';NATURAL.forEach(function(k){var opt=document.createElement('option');opt.value=k;opt.textContent=NATURAL_INFO[k].name;sel.appendChild(opt);});sel.value=NATURAL.indexOf(old)>=0?old:(id==='fusionBase'?'shrimp':'ginkgo');});syncCastSelection();
};
document.querySelectorAll('[data-cast-mode]').forEach(function(b){b.addEventListener('click',function(){chooseCastMode(b.dataset.castMode);});});
document.getElementById('castClear').addEventListener('click',function(){selectedSpecies=[];syncCastSelection();});
document.getElementById('castApply').addEventListener('click',function(){applySelectedCast(selectedSpecies,document.getElementById('castCount').value);});
var ensembleScene=applyStudioScene;
applyStudioScene=function(name){ensembleScene(name);CFG.speciesPool=[];poolCursor=0;ENSEMBLE_LINKS=[];saveCfg();};
var ensembleFocus=focusAtlasCharacter;
focusAtlasCharacter=function(kind,donor){var ok=ensembleFocus(kind,donor);if(ok){CFG.speciesPool=donor?[]:[kind];MODE=donor?8:0;saveCfg();}return ok;};
var ensembleImport=importCode;
importCode=function(str){var ok=ensembleImport(str);if(ok){poolCursor=0;if(CFG.speciesPool.length)MODE=0;ENSEMBLE_LINKS=[];}return ok;};

/* Animation grammar: anticipation -> articulated gesture -> damped follow-through -> rest.
   Every property has an envelope that reaches zero, so repeated shows do not drift. */
function performanceEnvelope(k){var rise=smooth((k-.14)/.14),fall=1-smooth((k-.66)/.34);return rise*fall;}
function performanceSpring(k){var t=clamp((k-.18)/.82,0,1);return Math.sin(t*TAU*1.4)*Math.exp(-t*2.4)*smooth(t/.09)*(1-smooth((t-.82)/.18));}
function performanceStrength(){return CFG.motionStrength*(reduceMotion()?.16:1);}
defineFx('signature',{channels:['pos','special'],dur:function(){return 4400/CFG.motionPace;},sfx:function(h){if(allow('atlasSignature',100,2))SFX.marimba(penta(h.col+2,220),panOf(h));},step:function(h,a,t,k,d){
 var e=performanceEnvelope(k),spring=performanceSpring(k),pre=smooth(k/.12)*(1-smooth((k-.12)/.10)),strength=performanceStrength(),sp=h.g.sp;
 d.perform=(e*.5+spring*.8-pre*.15)*strength;d.smile=.45+e*.4;d.eye=pre*.45;d.gazeX=spring*.3;
 if(sp==='shrimp'){d.ox=(pre*.07-e*.48+spring*.10)*strength;d.roll=(-e*.16+spring*.1)*strength;d.oy=-(e*.08)*strength;}
 else if(sp==='crab'){var step=smooth((k-.18)/.14)-2*smooth((k-.42)/.18)+smooth((k-.70)/.26);d.ox=step*.48*strength;d.roll=step*.035*strength;d.perform=(e*.5+spring*.9)*strength;}
 else if(sp==='jelly'){d.perform=(e*.85+spring*.25)*strength;d.oy=-smooth((k-.25)/.25)*(1-smooth((k-.67)/.33))*.34*strength;d.hs=-pre*.018*strength;}
 else if(sp==='puffer'){d.hs=e*.115*strength;d.perform=e*strength;d.oy=-e*.05*strength;}
 else if(sp==='octopus'){d.oy=-e*.065*strength;d.roll=spring*.075*strength;d.perform=(e*.65+spring)*strength;}
 else if(sp==='hermit'){d.perform=e*strength;d.eye=pre*.65;}
 else if(sp==='sponge'||sp==='soot'){d.oy=(pre*.045-Math.max(0,spring)*.36)*strength;d.hs=(pre*-.035+spring*.025)*strength;d.roll=spring*.10*strength;}
 else if(sp==='patrick'){d.roll=(e*.15+spring*.14)*strength;d.eye=.55*e;}
 else if(sp==='totoro'){d.hs=e*.026*strength;d.perform=(e+spring*.25)*strength;d.eye=e*.2;}
 else if(sp==='manta'){d.ox=spring*.12*strength;d.oy=-e*.16*strength;d.roll=spring*.12*strength;}
 else if(sp.indexOf('gourd_')===0){d.oy=(pre*.035-Math.max(0,spring)*.22)*strength;d.roll=spring*.08*strength;d.perform=(e*.75+spring*.55)*strength;d.gazeX=spring*.18;}
 else if(sp==='lotus_kid'){d.oy=(pre*.04-Math.max(0,spring)*.26)*strength;d.roll=spring*.09*strength;d.perform=(e*.72+spring*.65)*strength;}
 else if(sp==='cloud_dragon'){d.ox=spring*.12*strength;d.oy=-e*.08*strength;d.roll=spring*.10*strength;d.perform=(e*.5+spring*.75)*strength;}
 else{d.oy=-e*.055*strength;d.roll=spring*.10*strength;}
}});
defineFx('tideDance',{channels:['pos','special'],dur:function(){return 6800/CFG.motionPace;},step:function(h,a,t,k,d){var e=smooth(k/.17)*(1-smooth((k-.70)/.30)),strength=performanceStrength(),ph=(a.phase||0)+k*TAU*.85;d.ox=Math.sin(ph)*e*.58*strength;d.oy=Math.sin(ph*2)*e*.20*strength;d.roll=Math.cos(ph)*e*.12*strength;d.perform=Math.sin(ph+.45)*e*.8*strength;d.smile=.65;}});
defineFx('bubbleReply',{channels:['pos','special'],dur:function(){return 2700/CFG.motionPace;},start:function(h){addAtlasBubble(h);},sfx:function(h){if(allow('atlasBubble',120,2))SFX.pop(panOf(h),430+hashInt(h.g.seed,2)%200);},step:function(h,a,t,k,d){var e=performanceEnvelope(k),strength=performanceStrength();d.charge=e;d.perform=e*.55*strength;d.mouth=e*.55;d.oy=-e*.07*strength;d.smile=.8;d.gazeY=-e*.45;}});
defineFx('callReply',{channels:['pos','special'],dur:function(){return 3300/CFG.motionPace;},start:function(h,a){if(a.reply)addAtlasBubble(h);},sfx:function(h,a){if(a.reply&&allow('atlasReply',150,2))SFX.pop(panOf(h),500+hashInt(h.g.seed,2)%180);},step:function(h,a,t,k,d){var e=performanceEnvelope(k),spring=performanceSpring(k),strength=performanceStrength(),reply=!!a.reply,sign=reply?-1:1;d.perform=(e*.34+spring*.45)*strength;d.oy=-e*.045*strength;d.gazeX=sign*e*.34;d.gazeY=-e*.14;d.smile=.34+e*(reply?.48:.28);d.mouth=e*(reply?.42:.16);d.eye=e*(reply?.12:.04);if(h.g.sp==='crab'){d.ox=sign*e*.22*strength;d.roll=spring*.055*sign;}else if(h.g.sp==='shrimp'){d.ox=sign*e*.12*strength;d.roll=-spring*.08*sign;}else if(h.g.sp==='jelly'||h.g.sp==='sponge'){d.hs=sign*spring*.025*strength;d.oy-=e*.025*strength;}else if(h.g.sp==='puffer'){d.hs=e*.06*strength;}}});
var ensembleUpdate=Head.prototype.update;
Head.prototype.update=function(dt,now,look){var o=ensembleUpdate.call(this,dt,now,look),target=(o.perform||0)+(o.wind||0)*.26;this._trailing=lerp(this._trailing||0,target,1-Math.exp(-Math.max(0,dt)*9));if(Math.abs(this._trailing)<.0001)this._trailing=0;o.trailing=this._trailing;return o;};
atlasPulse=function(o){return (o.trailing==null?(o.perform||0)+(o.wind||0)*.26:o.trailing)+(o.life||0);};
var performanceCueTimer=0;
function setPerformanceCue(title,detail){var box=document.getElementById('stageCue'),titleEl=document.getElementById('stageCueTitle'),detailEl=document.getElementById('stageCueDetail');if(!box)return;if(titleEl)titleEl.textContent=title||'';if(detailEl)detailEl.textContent=detail||'';box.hidden=false;box.classList.remove('cueShow');void box.offsetWidth;box.classList.add('cueShow');if(performanceCueTimer)clearTimeout(performanceCueTimer);performanceCueTimer=setTimeout(function(){box.classList.remove('cueShow');box.hidden=true;},Math.max(2600,2100/CFG.motionPace));}
function clearPerformanceCue(){var box=document.getElementById('stageCue');if(!box)return;box.classList.remove('cueShow');box.hidden=true;if(performanceCueTimer)clearTimeout(performanceCueTimer);performanceCueTimer=0;}
function drawPerformanceMarks(now){if(!heads||!heads.length)return;ctx=gctx;ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);heads.forEach(function(h){var a=(h.acts||[]).find(function(x){var t=now-x.t0-x.delay;return !x.exiting&&t>=0&&t<=x.dur;});if(!a)return;var pulse=Math.min(1.4,Math.abs(atlasPulse(h.lastO||{}))),col=a.name==='callReply'?(a.reply?'#5b8091':'#b27a51'):a.name==='quietPortrait'?'#78977d':'#9b774f';ctx.globalAlpha=.12+Math.min(.16,pulse*.07);ctx.strokeStyle=col;ctx.lineWidth=1.1;ctx.setLineDash([3,4]);ctx.beginPath();ctx.arc(h.x,h.y-h.s*.18,h.s*(.78+Math.min(.15,pulse*.05)),0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=.45;ctx.fillStyle=col;ctx.beginPath();ctx.arc(h.x,h.y-h.s*1.12,2.4+Math.min(2,pulse*1.5),0,TAU);ctx.fill();});ctx.restore();}
var ENSEMBLE_LINKS=[];
runAtlasShow=function(name){
 if(SUPER||cardOpen){toast('先回到图鉴，再开始这一幕。');return;}var names={signature:'各显神通',relay:'泡泡接力',tide:'潮汐圆舞',meet:'邻里回应'},details={signature:'每个角色展示自己的招牌动作',relay:'回应沿队列传递，泡泡标记交接',tide:'错相摆动，最后一起回到原位',meet:'前者先发起，后者随后回应'},fx={signature:'signature',relay:'bubbleReply',tide:'tideDance'}[name];if(name==='meet'){ATLAS_BUBBLES=[];ENSEMBLE_LINKS=[];var pairs=heads.slice().sort(function(a,b){return a.row-b.row||a.col-b.col;});pairs.forEach(clearActs);var meetNow=performance.now(),pairStep=reduceMotion()?0:Math.min(460,2600/Math.max(1,Math.ceil(pairs.length/2)))/CFG.motionPace;for(var pi=0;pi+1<pairs.length;pi+=2){var lead=pairs[pi],reply=pairs[pi+1],delay=(pi/2)*pairStep;act(lead,'callReply',{delay:delay,phase:lead.col*.48+lead.row*.62,lead:true});act(reply,'callReply',{delay:delay+220/CFG.motionPace,phase:reply.col*.48+reply.row*.62,reply:true});if(!reduceMotion())ENSEMBLE_LINKS.push({x0:lead.x,y0:lead.y-lead.s*.35,x1:reply.x,y1:reply.y-reply.s*.35,bend:Math.min(lead.s,reply.s)*.72,t:meetNow+delay/CFG.speed,duration:Math.max(680,1250/CFG.speed),col:reply.g.fur,kind:'meet'});}document.getElementById('atlasStatus').textContent=names[name]+' · 两两相遇';setPerformanceCue(names[name],details[name]);return;}if(!fx)return;
 ATLAS_BUBBLES=[];ENSEMBLE_LINKS=[];var ordered=heads.slice().sort(function(a,b){return a.row-b.row||a.col-b.col;}),now=performance.now(),step=reduceMotion()?0:Math.min(name==='relay'?380:95,2200/Math.max(1,ordered.length-1))/CFG.motionPace;
 ordered.forEach(function(h,i){act(h,fx,{delay:i*step,phase:h.col*.48+h.row*.62});if(name==='relay'&&i>0&&i<33&&!reduceMotion()){var a=ordered[i-1];ENSEMBLE_LINKS.push({x0:a.x,y0:a.y-a.s*.35,x1:h.x,y1:h.y-h.s*.35,bend:Math.min(a.s,h.s)*.8,t:now+(i-1)*step/CFG.speed,duration:Math.max(120,step/CFG.speed),col:h.g.fur});}});
 document.getElementById('atlasStatus').textContent=names[name]+' · 预备、呼应、余韵';setPerformanceCue(names[name],details[name]);
};
/* Choreography gives the 7 × 6 stage an editorial rhythm: one focus, a few replies,
   and a quiet field. These roles are finite and return every head to its original pose. */
var ORCHESTRA_PLAN=[];
defineFx('quietPortrait',{channels:['special'],dur:function(){return 4200/CFG.motionPace;},step:function(h,a,t,k,d){var e=performanceEnvelope(k),strength=performanceStrength(),phase=a.phase||0;d.gazeX=Math.sin(phase+k*TAU*.7)*e*.18*strength;d.gazeY=Math.cos(phase+k*TAU*.45)*e*.06*strength;d.eye=e*.10;d.smile=.16+e*.08;d.perform=e*.06*strength;}});
function orchestrationOrder(){return heads.slice().sort(function(a,b){return a.row-b.row||a.col-b.col;});}
function isSeriesGuest(h){var sp=h.g.sp;return !!FOLK_INFO[sp]||sp.indexOf('gourd_')===0||sp==='lotus_kid'||sp==='cloud_dragon';}
function orchestrationRole(h,role,delay,phase){ORCHESTRA_PLAN.push({role:role,species:h.g.sp,delay:Math.round(delay)});act(h,role==='focus'?'signature':role==='response'?'bubbleReply':'quietPortrait',{delay:delay,phase:phase});}
function runOrchestration(name){
 if(SUPER||cardOpen){toast('先回到图鉴，再开始编排。');return;}if(['focus','quiet','series'].indexOf(name)<0)return;
 var ordered=orchestrationOrder(),now=performance.now(),pace=reduceMotion()?0:1/CFG.motionPace,mid=(ordered.length-1)/2;
 ATLAS_BUBBLES=[];ENSEMBLE_LINKS=[];ORCHESTRA_PLAN=[];ordered.forEach(clearActs);
 if(name==='focus'){
   var fi=Math.max(0,Math.min(ordered.length-1,Math.round(mid))),focus=ordered[fi];
   orchestrationRole(focus,'focus',0,focus.col*.5+focus.row*.7);
   ordered.forEach(function(h,i){if(h===focus)return;var dist=Math.abs(i-fi);orchestrationRole(h,dist<=2?'response':'quiet',dist<=2?dist*260*pace:(i%5)*100*pace,h.col*.5+h.row*.7);});
 }else if(name==='quiet'){
   ordered.forEach(function(h,i){orchestrationRole(h,'quiet',(i%7)*85*pace,h.col*.5+h.row*.7);});
   if(ordered.length)orchestrationRole(ordered[Math.floor(mid)],'response',320*pace,mid*.4);
 }else{
   var series=ordered.filter(isSeriesGuest),others=ordered.filter(function(h){return !isSeriesGuest(h);});
   series.forEach(function(h,i){orchestrationRole(h,'focus',i*360*pace,h.col*.5+h.row*.7);});
   others.forEach(function(h,i){orchestrationRole(h,i%4===0?'response':'quiet',(series.length*360+i*95)*pace,h.col*.5+h.row*.7);});
 }
 var labels={focus:'焦点轮演 · 主角、回应、安静位',quiet:'安静群像 · 安静注视与轻微回应',series:'系列接力 · 系列成员依次登场'},cueDetails={focus:'一个角色先亮相，邻近角色随后回应',quiet:'全员轻微注视，中间角色做一次回应',series:'系列成员按队列依次登场'};
 document.getElementById('atlasStatus').textContent=labels[name];setPerformanceCue(labels[name],cueDetails[name]);
}
var ensembleDrawGrid=drawGrid;
drawGrid=function(dt,now){ensembleDrawGrid(dt,now);drawPerformanceMarks(now);if(!ENSEMBLE_LINKS.length)return;ctx=gctx;ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ENSEMBLE_LINKS=ENSEMBLE_LINKS.filter(function(l){return now-l.t<l.duration+250;});ENSEMBLE_LINKS.forEach(function(l){var k=(now-l.t)/l.duration;if(k<0||k>1)return;var q=smooth(k),mx=(l.x0+l.x1)/2,my=Math.min(l.y0,l.y1)-l.bend;ctx.strokeStyle=l.col;ctx.lineWidth=.9;ctx.globalAlpha=Math.sin(k*Math.PI)*.24;ctx.beginPath();ctx.moveTo(l.x0,l.y0);ctx.quadraticCurveTo(mx,my,l.x1,l.y1);ctx.stroke();var x=(1-q)*(1-q)*l.x0+2*(1-q)*q*mx+q*q*l.x1,y=(1-q)*(1-q)*l.y0+2*(1-q)*q*my+q*q*l.y1;ctx.globalAlpha=.65;ctx.beginPath();ctx.arc(x,y,4.5,0,TAU);ctx.stroke();});ctx.restore();};
PANEL.unshift({group:'动作的分寸',note:'幅度改变肢体动作大小；节奏改变新剧场动作的时长与入场间隔。系统减少动态效果仍优先。',items:[
 {id:'motionStrength',label:'动作幅度',type:'range',min:.2,max:1.2,step:.05,fmt:function(v){return Math.round(v*100)+'%';}},
 {id:'motionPace',label:'表演节奏 · 舒缓 ↔ 轻快',type:'range',min:.6,max:1.4,step:.05,fmt:function(v){return v.toFixed(2)+'×';}}
]});
