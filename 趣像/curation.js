/* A theme is a complete cast, not a bag of unrelated random heads. */
var folioLayout=layout;
layout=function(){folioLayout();if(CFG.composition==='grid'){heads.forEach(function(h){h.s=Math.min(h.s,cellW/3.75,cellH/3.85);});}};
var curatedScene=applyStudioScene;
applyStudioScene=function(name){
 var folio=FOLK_SERIES[name],sets={cabinet:Object.keys(LEGACY_LABELS),tidal:SEA,cartoons:CARTOONS,garden:['ginkgo','cactus','mushroom'],curios:['teapot','cloud']};
 if(!folio&&!sets[name]){curatedScene(name);return;}
 var keys=folio?folio.keys:sets[name];
 applySelectedCast(keys,42);
 Object.assign(CFG,{styles:['watercolor'],palettes:[],paper:folio?folio.paper:'cream',density:.85,pigment:1,wetness:.48,mono:false});
 studioScene=name;poolCursor=0;applyTheme();saveCfg();syncPanel();
 document.querySelectorAll('[data-scene]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.scene===name?'true':'false');});
 document.querySelectorAll('.sceneMore').forEach(function(d){d.open=false;});
 document.getElementById('atlasStatus').textContent=folio?folio.name:({cabinet:'经典半身像',tidal:'潮间带',cartoons:'动画来客',garden:'风里花园',curios:'异物茶会'}[name]);
};
// Existing, saved casts stay intact. A fresh or uncurated default opens on the
// classic half-bust cast (r19): 人物与动物同台，一眼看到版式的完整样貌。
if(MODE===0&&(!CFG.speciesPool||!CFG.speciesPool.length)){
 CFG.speciesPool=Object.keys(LEGACY_LABELS).slice();CFG.palettes=['morandi'];CFG.paper='cream';poolCursor=0;
}
// Keep regenerated signature gestures modest, with different physical weights.
var folkSignature=FXDEF.signature.step;
FXDEF.signature.step=function(h,a,t,k,d){
 folkSignature(h,a,t,k,d);var info=FOLK_INFO[h.g.sp];if(!info)return;
 var e=performanceEnvelope(k),s=performanceSpring(k),v=performanceStrength();
 if(info.series==='giants'){d.oy=-e*.025*v;d.roll=s*.035*v;d.perform=(e*.23+s*.18)*v;}
 else if(info.kind==='umbrella'){d.oy=-Math.max(0,s)*.22*v;d.roll=s*.08*v;}
 else if(info.kind==='bird'){d.roll=s*.035*v;d.perform=(e*.65+s*.3)*v;}
 else if(info.kind==='dijiang'){d.oy=-Math.max(0,s)*.09*v;d.perform=s*.45*v;}
 else{d.oy=-e*.04*v;d.roll=s*.05*v;d.perform=(e*.4+s*.3)*v;}
};

/* 新增角色追加在 NATURAL 末尾（标签即索引，不可重排），图鉴却按"连续同名族"分段，
   于是同一系列会出现两个分组头。这里只重排图鉴目录顺序（不动 NATURAL）。 */
(function(){
  if(typeof SPECIES_CATALOG==='undefined'||!SPECIES_CATALOG.length)return;
  var order=[],byFam={};
  SPECIES_CATALOG.forEach(function(k){
    var info=NATURAL_INFO[k]||{},fam=info.family||(LEGACY_LABELS[k]?'人物、动物与老朋友':'花园与异物');
    if(!byFam[fam]){byFam[fam]=[];order.push(fam);}
    byFam[fam].push(k);
  });
  var out=[];order.forEach(function(f){out=out.concat(byFam[f]);});
  SPECIES_CATALOG.length=0;Array.prototype.push.apply(SPECIES_CATALOG,out);
})();
