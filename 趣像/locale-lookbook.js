/* UI language is a local preference, deliberately independent of scene DNA. */
var UI_LANG='zh-CN';try{if(localStorage.getItem('quxiang.language')==='en')UI_LANG='en';}catch(e){}
var UI_PAIRS=[
['趣像 · 众生有趣','Qu Xiang · Curious lives'],['奇趣物种剧场','Curious Creature Theatre'],['趣像画室','Qu Xiang studio'],['主题场景','Scenes'],['众生图鉴','Living atlas'],['风里花园','Wind garden'],['异物茶会','Curious tea party'],['一位主角','Solo portrait'],['潮间带','Tide pool'],['动画来客','Cartoon guests'],['混生花园','Hybrid garden'],['＋ 头像与混生','＋ Cast & hybrids'],['✎ 画材','✎ Materials'],['↓ 留下这一刻','↓ Save this moment'],['画材与设置','Materials & settings'],['让它们动起来','Bring them to life'],['各显神通','Signature moves'],['泡泡接力','Bubble relay'],['潮汐圆舞','Tidal waltz'],['送一阵风','Send a breeze'],['局部风','Local breeze'],['小剧场动作','Theatre movements'],
['焦点轮演','Focus rotation'],['安静群像','Quiet ensemble'],['系列接力','Series relay'],['主角、回应、安静位','focus, response, quiet roles'],['系列成员依次登场','series members enter in sequence'],['安静注视与轻微回应','quiet gazes and small responses'],
['先选一个方向','Choose a direction'],['更多主题','More scenes'],['表演','Performance'],['更多动作','More movements'],['角色','Cast'],['保存','Save'],['＋ 角色','＋ Cast'],['↓ 保存','↓ Save'],['舞台','Stage'],
['风格预设','Style presets'],['关闭风格预设','Close style presets'],['同一群角色，八种气质','One cast, eight moods'],['只改变纸张、色彩与笔触，保留当前角色、数量和构图。样张使用同一只虾，便于比较。','Change paper, colour and marks while keeping the cast and composition. Each preview uses the same shrimp for comparison.'],
['头像与混生工作台','Cast and hybrid workshop'],['关闭头像库','Close cast library'],['挑一位，或创造新物种','Choose a friend, or invent a species'],['单选，让一种角色成群出现；混选，按系列连续分区。形态组合在下方“混生”工作台单独进行。','Choose one species for a family, or several, arranged in family blocks. Combine body structures separately in the hybrid workshop below.'],['物种选择方式','Species selection mode'],['物种单选','Single species'],['物种混选','Mixed species'],['清空选择','Clear selection'],['登场数量','Cast size'],['让它们登场','Bring on stage'],['请选择物种','Choose species'],['看特写','View portrait'],['点选下方头像；“看特写”不会改变勾选。','Choose portraits below. Viewing a portrait does not change your selection.'],['借一个结构，长成新的自己','Borrow a shape, become someone new'],['主体','Main body'],['借来的结构','Borrowed structure'],['让新物种诞生','Create a new species'],['保留主轮廓，接入一类附肢、叶冠或纹样。交换主体，会得到另一种形象。','Keep the main silhouette and add an appendage, leaf crown or pattern. Swap the main body for a different result.'],['花园与异物','Garden & curiosities'],['人物、动物与老朋友','People, animals & old friends'],
['动作的分寸','Movement balance'],['动作幅度','Movement amplitude'],['表演节奏 · 舒缓 ↔ 轻快','Tempo · calm ↔ lively'],['幅度改变肢体动作大小；节奏改变新剧场动作的时长与入场间隔。系统减少动态效果仍优先。','Amplitude changes gesture size; tempo changes show duration and entry intervals. Reduced motion still takes priority.'],['画材 · 让每一笔有性格','Materials · marks with character'],['笔触疏密','Mark density'],['颜料浓淡','Pigment strength'],['干笔 ↔ 湿润','Dry ↔ wet'],['疏密改变笔触数量；浓淡改变着色强度。干湿主要作用于水彩与水墨。','Density changes the number of marks; pigment changes colour strength. Wetness mainly affects watercolour and ink wash.'],['植物与菌菇','Plants & mushrooms'],['茶壶与云','Teapots & clouds'],['构图','Composition'],['图鉴网格','Atlas grid'],['小群落（12 位以内）','Small cluster (up to 12)'],['肖像（1 位）','Portrait (one)'],['动作刷范围','Motion brush radius'],
['网格','Grid'],['列数','Columns'],['行数','Rows'],['头像大小','Head size'],['选角','Cast'],['人物比例','People'],['动物比例','Animals'],['机器人比例','Robots'],['访客比例','Visitors'],['随机混生比例','Wild hybrids'],['外观','Look'],['预设','Presets'],['画材风格（可单选或混选）','Art style (pick one, or several to mix)'],['配色（可自由混选）','Palettes (mix freely)'],['配色作用范围','Palette reaches'],['衣服与背景','Clothes & backgrounds'],['加上毛发','+ fur & hair'],['全部','Everything'],['纸张','Paper'],['线条粗细','Line weight'],['手绘抖动','Hand wobble'],['动作','Motion'],['速度','Speed'],['连锁反应','Chain reactions'],['关闭','Off'],['少量','Few'],['正常','Normal'],['活跃','Lively'],['K 键动作','K key'],['碰头','Knock heads'],['啵一下','Kiss'],['减少动态效果','Reduce motion'],['跟随系统','Follow system'],['开启','On'],['声音','Sound'],['音量','Volume'],['自动表演','Autoplay'],['空闲时自动表演','Autoplay when idle'],['等待多久开始','Start after'],['动作最短间隔','Shortest gap between moves'],['动作最长间隔','Longest gap between moves'],['自动表演音量','Autoplay volume'],['多久后休息','Doze off after'],['试一试','Try it'],['立即自动表演','Start autoplay now'],['分享','Share'],['分享码','Codes'],['立即应用选角','Apply cast now'],['恢复默认设置','Reset settings'],['设置已重置。','Settings reset.'],['调整新角色的比例。按 N 或“立即应用选角”重新生成。','Shapes new faces. Press N, or Apply now, to redraw.'],['空闲后角色会自动表演，随后休息；操作页面即可接管。','A screensaver: after you leave it alone, the heads perform on their own, then doze off. Any touch takes over.'],
['水彩','Watercolour'],['平涂','Flat'],['铅笔','Pencil'],['水墨','Ink wash'],['工笔','Gongbi'],['木刻','Woodcut'],['孔版印刷','Risograph'],['波普','Pop art'],['蜡笔','Crayon'],['奶油纸','Cream'],['牛皮纸','Kraft'],['浅蓝纸','Sky'],['新闻纸','Newsprint'],['宣纸','Rice paper'],['瓷白','Porcelain'],['赭石墙','Ochre wall'],['中国传统色','Chinese traditional'],['敦煌','Dunhuang'],['青花','Blue and white'],['文艺复兴','Renaissance'],['印象派','Impressionist'],['代尔夫特蓝','Delft blue'],['包豪斯','Bauhaus'],['莫兰迪','Morandi'],['孟菲斯','Memphis'],['北欧','Nordic'],['东方','East'],['西方','West'],['现代','Modern'],
['收藏库','Kept'],['粘贴角色代码','Paste a genome code'],['角色代码','Genome code'],['打开','Open'],['快捷键一览','Every key'],['动作表','Moves'],['声音已开启','Sound on'],['声音已关闭','Sound off'],['关闭卡片','Close card'],['翻面','Flip'],['收藏','Keep'],['天演','Evolve'],['卡片','Card'],['头像','Avatar'],['圆形','Circle'],['透明','Transparent'],['转台动画','Turntable'],['换色','Recolour'],['代码','Code'],['写下它的故事','Write their story'],['设置','Settings'],['关闭设置','Close settings'],['关闭窗口','Close'],['查看全部快捷键','See every key'],['知道了','Got it'],['让它们说','Make them say'],['输入文字，按回车','type a word, press Enter'],['完成','Done'],['恢复自然配色','Back to natural colours'],['为风格命名','Name this look'],['预设名称','Preset name'],['粘贴设置或场景代码','Paste a settings or scene code'],['设置或场景代码','Settings or scene code'],['自动','auto'],
['还没有可撤销的改动。','Nothing to undo yet.'],['上一幅构图、角色和画材都回来了。','Restored the previous cast, composition and materials.'],['同一种物种，各有自己的颜色与细节。','One species, with individual colours and details.'],['先回到图鉴，再开始这一幕。','Return to the atlas before starting this show.'],['已换一幅构图。双击角色收藏，或送一阵风。','Scene changed. Double-click to collect a character, or send a breeze.'],['移动目光相随 · 拖动转身 · 双击或长按收藏 · 让风经过，看看谁先回应','Move to guide their gaze · Drag to turn · Double-click or hold to collect · Send a breeze']
];
var SPECIES_EN={human:'Person',cat:'Cat',tiger:'Tiger',dog:'Dog',bear:'Bear',panda:'Panda',rabbit:'Rabbit',pig:'Pig',fox:'Fox',mouse:'Mouse',owl:'Owl',chick:'Chick',frog:'Frog',robot:'Robot',alien:'Alien visitor',ginkgo:'Ginkgo wanderer',cactus:'Cactus guardian',mushroom:'Mushroom friend',teapot:'Dreaming teapot',cloud:'Slow little cloud',shrimp:'Whiskered shrimp messenger',crab:'Fiddler crab drummer',octopus:'Octopus conductor',seahorse:'Curly-tail seahorse',puffer:'Puffer balloonist',jelly:'Jellyfish lantern',manta:'Manta glider',hermit:'Hermit crab collector',sponge:'SpongeBob',patrick:'Patrick Star',totoro:'Totoro',soot:'Soot sprite',gourd_fire:'Little Gourd · Fire',gourd_stone:'Little Gourd · Mountain',gourd_wind:'Little Gourd · Wind',gourd_leaf:'Little Gourd · Leaf',gourd_water:'Little Gourd · Tide',gourd_mist:'Little Gourd · Mist',gourd_light:'Little Gourd · Light',lotus_kid:'Lotus Flame Kid',cloud_dragon:'Cloud Dragon Kid'};
Object.keys(FOLK_INFO).forEach(function(k){SPECIES_EN[k]=FOLK_INFO[k].en;});
UI_PAIRS.push(['舞台没有可放置后代的位置，请增加席位或取消一位角色的收藏保护。','No room for a child. Add stage slots or unprotect a kept character.'],['本次双亲','parents'],['特征来源','trait sources']);
UI_PAIRS.push(['继承','Inherited'],['未混生','Unmixed'],['主体特征','Main trait'],['继承特征','Inherited trait'],['无','None'],['特征表达','Expression'],['含蓄表达','Subtle'],['均衡表达','Balanced'],['鲜明表达','Pronounced'],['原生结构','Original form'],['配色方式','Colour plan'],['主色为主，辅色呼应','Main hue + accent'],['系列原配','Folio colours'],['保存内容','Saved'],['物种 · 结构 · 种子','Species · motif · seeds']);
Object.keys(FOLK_SERIES).forEach(function(k){UI_PAIRS.push([FOLK_SERIES[k].name,FOLK_SERIES[k].en]);});
UI_PAIRS.push(['经典半身像','Classic bust portraits']);
SPECIES_CATALOG.forEach(function(k){UI_PAIRS.push([(NATURAL_INFO[k]||{}).name||LEGACY_LABELS[k],SPECIES_EN[k]]);});
UI_PAIRS=UI_PAIRS.concat([
['保存当前风格','Save current look'],['复制设置代码','Copy settings code'],['复制场景代码（设置与全部角色）','Copy scene code (settings + every face)'],['应用','Apply'],['参数调整即时生效；选角比例会影响下一次生成的角色。','Changes apply as you move them. Grid and Look act at once; Cast shapes the faces drawn next.'],['肤色','Skin'],['毛发','Fur'],['头发','Hair'],['衣服','Clothes'],['原始水彩','Original'],['水墨宣纸','Ink & rice paper'],['花园 · 让物种相遇','Garden · encounters'],['预备、呼应、余韵','Anticipation, response, settle'],
['吹气球','Balloon'],['挥手','Wave'],['打喷嚏','Sneeze'],['融化','Melt'],['漂浮','Float'],['睡觉','Sleep'],['哭泣','Cry'],['唱歌','Sing'],['跳舞','Dance'],['眨眼','Blink'],['转身','Turn'],['新角色','New faces'],['暂停','Pause'],['播放','Play'],['摇摆','Wobble'],['拍照','Snapshot'],['单色','Monochrome'],['彩色','Colour'],['稀有度','Rarity'],['混生','Hybrid'],['复制成功。','Copied.'],['设置代码已复制。','Settings code copied.'],['场景代码已复制。','Scene code copied.']
]);
UI_PAIRS.push(['砚灰','Inkstone'],['新的邻居','New neighbours'],['这两项是全部角色中的生成比例；其余比例使用原有人物与动物权重。收藏的角色会保留。','These are proportions of the full cast. Remaining characters use the people and animal weights. Collected characters are kept.'],['手绘起伏','Hand-drawn variation']);
UI_PAIRS.push(['显示工具','Show tools'],['收起工具','Hide tools'],['显示操作栏（U）','Show controls (U)'],['收起操作栏（U）','Hide controls (U)'],['沉浸式画面','Immersive canvas']);
UI_PAIRS.push(['邻里回应','Neighbourly reply'],['两两相遇','Paired encounters']);
UI_PAIRS.push(['全选','Select all'],['全不选','Clear all'],['收起','Collapse'],['展开','Expand'],['选择本组全部物种','Select every species in this group'],['取消本组全选','Clear every species in this group']);

/* ══ v13-r17 动作与终章词条：把"旧动作说明"整批补进统一词条 ══
   （原有缺口：帮助面板 52 个动作名与说明、页脚终章图例、预设名与配色名混排） */
UI_PAIRS=UI_PAIRS.concat([
['震一震','Quake'],['塑料眼','Googly eyes'],['发脾气','Rant'],['换身体','Trade heads'],['打哈欠','Yawn'],
['下雨','Rain'],['结冰','Freeze'],['猫头鹰转身','Owl turn'],['吐口水','Spit'],['流星','Shooting star'],
['多米诺','Domino'],['头掉了','Heads off'],['闲聊','Gossip'],['偷笑','Snicker'],['碰头','Knock'],
['长脖子','Long necks'],['打盹','Doze off'],['透视','X-ray'],['消失','Vanish'],
['看镜头','Say cheese'],['说句话','Say'],['吹气球','Balloons'],
['开一朵花','Bloom'],['舞龙','Dragon dance'],['图腾柱','Totem pole'],['摩天轮','Ferris wheel'],
['星河','Constellation'],['千面','A thousand heads'],['万花筒','Kaleidoscope'],
['阵容','Cast'],['少一列','Fewer columns'],['多一列','More columns'],
/* 页脚终章图例用的是触发名，与帮助面板的叫法不同，另立一词 */
['星河','stars'],['马赛克','mosaic'],['万花筒','kaleido'],['摩天轮','Ferris wheel'],['图腾柱','totem pole'],['碰头','knock'],
['· 即将上线','· soon'],
['野生','wild-born'],['同源','founders'],
['移动目光相随 · 拖动转身 · 双击或长按收藏 · 轻触打招呼，快划成浪，慢划起涟漪，按住慢下来','Move to guide their gaze · Drag to turn · Double-click or hold to collect · Tap to greet, sweep to make a wave, drift for ripples, hold to slow down'],
['现在可以摸：轻触打招呼 · 快划成浪 · 慢划起涟漪 · 按住慢下来 · 盯着谁，谁会注意到你','It is tactile now: tap to greet · sweep to make a wave · drift for ripples · hold to slow down · stare and someone notices.'],
/* 动作说明（悬停即读的一句） */
['纸面震裂，所有人在弹簧上晃个不停。','The paper shakes and cracks; everyone wobbles on a spring.'],
['每个人都换上一对会晃的塑料假眼。','Everyone gets rattly plastic eyes.'],
['涨红脸一通抱怨，蹦出 #@$%! 的气泡；邻居按脾气各自回应。','Red-faced ranting with #@$%! balloons; neighbours react by temperament.'],
['头换到了别人的身体上，四处张望一阵，再各归各位。','Heads shuffle onto the wrong bodies, look around, then go home.'],
['一个接一个，从中间传染开去。','Contagious, spreading outwards.'],
['一朵云飘过来。青蛙欢喜，猫不高兴。','A cloud rolls over. Frogs love it; cats do not.'],
['霜从四边爬进来；火爆的角色先把自己焐化。','Frost creeps in from the edges; fiery ones melt out early.'],
['慢慢转一整圈，然后冒出一圈晕星。','A slow 360° turn, then dizzy stars.'],
['蓄力、呸一声、溅到邻居身上——对方会按性格还击。','Wind up, ptoo, hit a neighbour — who reacts in character.'],
['大家一起看它划过；有人悄悄许愿。','Everyone watches it cross; a few make a wish.'],
['一个碰倒一个，再纷纷弹回来。','Heads topple one into the next, then spring back.'],
['头像瓶塞一样弹起漂浮，脖子留在原地。','Heads pop like corks and float; necks stay behind.'],
['两两凑近，嘀嘀咕咕。','Pairs lean in and chatter.'],
['所有人冲着同一个偷笑；被笑的那位怎么接，全看脾气。','Everyone giggles at one head. How it takes it depends on its temperament.'],
['邻居互相碰额头，碰出满天星。在设置里可以改成亲亲。','Neighbours bump foreheads and see stars. Kiss instead in Settings.'],
['脖子像潜望镜一样伸出去。','Necks stretch like periscopes.'],
['全体打起瞌睡、此起彼伏地打呼，直到一只蚊子飞来。','Everyone nods off, snoring, until a mosquito arrives.'],
['扫描线扫过：头骨、齿轮，还有一位小小的驾驶员。','A scanner sweeps across: skulls, gears, and a tiny pilot.'],
['噗——只剩虚线轮廓——又变回来。','Poof — gone to a dotted outline — ta-da.'],
['头像吹胀了牵着线飘起来，有几位索性松了手。','Heads inflate and float on strings; some let go.'],
['所有人转向正面，对镜头微笑。','Everyone faces front and smiles for the camera.'],
['输入一个词，大家一人举一个字母把它举起来。','Type a word; the heads hold it up, one letter each.'],
['终章：众人旋成一朵花，脖子编成花茎。','Finale: everyone swirls into one flower, necks braided into its stem.'],
['终章：脖子连成一条长龙，追一颗珠子。','Finale: one long neck-chain chases a pearl.'],
['终章：每列叠成一根雕柱。点柱子，它会唱。','Finale: each column stacks into a carved pole. Click a pole to hear it sing.'],
['终章：脖子变成辐条，人人都在轮上。拖动可以转。','Finale: necks become spokes and everyone rides. Drag to spin it.'],
['终章：天黑下来，头像变成星星，脖子连成星线。悬停一颗星，它会响。','Finale: night falls; heads become stars and necks become star lines. Hover a star to hear it.'],
['终章：每张脸变成一块砖，拼成一张盯着你的巨脸。点它一下。','Finale: every face becomes a tile of one giant face that watches you. Click it.'],
['终章：整个舞台被十二面镜像。左右移动可以操控。','Finale: the live grid, mirrored twelve ways. Move left or right to steer.'],
['在全体／人物／动物／异物之间轮换。','Cycle everyone / people / animals / oddballs.'],
['水彩与铅笔单色之间切换。','Watercolour or pencil only.'],
['开关声音。','Sound on or off.'],
['网格、演员、外观、动作、声音。','Grid, cast, look, motion, sound.'],
['你收藏的角色。','Your collection.'],
['就是这一页。','This sheet.'],
/* Shift 组合说明 */
['全体飞起来，落到别人身上。','Everyone flies off and lands on the wrong body.'],
['和邻居的脖子缠成一团结，再一下弹开。','Necks tie themselves in knots with a neighbour, then snap free.'],
['气球全飘走，长出新的小脑袋（Ctrl/⌘ Z 可以把原来的要回来）。','Every balloon floats away; new little heads grow back (Ctrl/⌘ Z brings the old ones back).'],
['连环喷嚏：一个把下一个喷得打转。','A chain sneeze: each one spins the next.'],
['口水大战——水珠在半空相撞。','Spit war — drops collide in mid-air.'],
['从指针处散开一圈波浪。','A ring wave spreading from your pointer.'],
['轮唱：每一排晚两拍进来。','A round: each row comes in two bars later.'],
['全体化成一摊，再从中冒出新面孔。','Everyone melts into one puddle and new faces rise out of it.'],
['大场面：头掉下来滚一圈，再跳回去。','The big one: heads fall off, roll, and jump back.'],
['整页变成透视片。','The whole page turns into an X-ray.'],
/* 风格预设全名（设置面板里原为纯英文） */
['原始水彩','Original'],['水墨宣纸','Ink & rice paper'],['青花小集','Blue & white'],
['敦煌壁画','Dunhuang mural'],['包豪斯海报','Bauhaus poster'],['孔版小志','Riso zine'],['一起上','Everything at once']
]);
var UI_INDEX=Object.create(null);UI_PAIRS.forEach(function(p){UI_INDEX[p[0]]=p;UI_INDEX[p[1]]=p;UI_INDEX[p[1].toLowerCase()]=p;});
UI_INDEX['Pencil 铅笔']=UI_INDEX['Pencil'];UI_INDEX['Ink wash 水墨']=UI_INDEX['Ink wash'];UI_INDEX['Gongbi 工笔']=UI_INDEX['Gongbi'];
function uiText(text,lang){
 var raw=String(text),s=raw.trim(),p=UI_INDEX[s],target=lang||UI_LANG;if(p)return raw.replace(s,p[target==='en'?1:0]);
 if(target==='en'){
  var m;if((m=s.match(/^(\d+) 位$/)))return m[1]+' characters';
  if((m=s.match(/^已选 (\d+) 种 · (.+)$/)))return m[1]+' selected · '+(m[1]==='1'?'one species, many personalities':'grouped families, distinct species');
  if((m=s.match(/^已按 (\d+) 种物种分区排列；没有自动混生。$/)))return 'Family blocks of '+m[1]+' species. Each keeps its own shape.';
  if((m=s.match(/^(.+) · 预备、呼应、余韵$/)))return uiText(m[1],target)+' · anticipation, response, settle';
  if((m=s.match(/^(.+) · 两两相遇$/)))return uiText(m[1],target)+' · paired encounters';
  if((m=s.match(/^(选择|查看)(.+?)(特写)?$/)))return (m[1]==='选择'?'Choose ':'View ')+uiText(m[2],target)+(m[3]?' portrait':'');
 }
 return raw;
}
// Remember source text per node so round trips never translate an already translated value.
var UI_SOURCES=new WeakMap(),UI_OBSERVER=null;
function localizeTree(root){
 if(!root)return;
 if(root.nodeType===3){var old=UI_SOURCES.get(root),now=root.nodeValue;if(!old||old.output!==now)old={source:now};var out=uiText(old.source);if(now!==out)root.nodeValue=out;old.output=out;UI_SOURCES.set(root,old);return;}
 if(root.nodeType===1){if(/^(SCRIPT|STYLE|TEXTAREA|INPUT|CANVAS)$/.test(root.tagName)||root.isContentEditable){if(root.tagName!=='INPUT')return;}['title','aria-label','placeholder'].forEach(function(attr){var v=root.getAttribute(attr);if(v){var store=UI_SOURCES.get(root)||{},r=store[attr];if(!r||r.output!==v)r={source:v};var out=uiText(r.source);if(v!==out)root.setAttribute(attr,out);r.output=out;store[attr]=r;UI_SOURCES.set(root,store);}});if(root.tagName==='INPUT')return;}
 Array.from(root.childNodes||[]).forEach(localizeTree);
}
function observeLocale(){if(UI_OBSERVER)UI_OBSERVER.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','placeholder']});}
function refreshLocale(){if(UI_OBSERVER)UI_OBSERVER.disconnect();localizeTree(document.body);document.documentElement.lang=UI_LANG;document.title=UI_LANG==='en'?'Qu Xiang · Curious Creature Theatre · v13.0.0':'趣像 · 奇趣物种剧场 · v13.0.0';document.getElementById('uiLanguage').value=UI_LANG;if(typeof updateStageSummary==='function')updateStageSummary();observeLocale();}
function setUILanguage(lang){if(['zh-CN','en'].indexOf(lang)<0)return false;UI_LANG=lang;try{localStorage.setItem('quxiang.language',lang);}catch(e){}refreshLocale();return true;}
document.getElementById('uiLanguage').addEventListener('change',function(e){setUILanguage(e.target.value);});
if(typeof MutationObserver!=='undefined'){UI_OBSERVER=new MutationObserver(function(records){UI_OBSERVER.disconnect();records.forEach(function(r){if(r.type==='childList')Array.from(r.addedNodes).forEach(localizeTree);else localizeTree(r.target);});observeLocale();});}
refreshLocale();

/* Presets are complete material recipes, applied independently of the cast. */


/* ══ v13-r18 卡面词条：旧物种基因表与卡面标签原为英文，中文界面下整表英文化 ══
   （新物种走 portraitGenomeRows 已是中文；旧物种与静态标签此前漏译） */
var CARD_WORDS = {
  '头':'Head','耳':'Ears','眼':'Eyes','鼻与嘴':'Nose & mouth','发':'Hair','纹样':'Markings','衣饰':'Wardrobe',
  '标本记录':'specimen record','基因':'genome','田野笔记':'field notes','每一行都是代码':'every line is code',
  '常见':'Common','少见':'Uncommon','稀有':'Rare','珍奇':'Epic','神话':'Mythic',
  '气质':'Temperament',
  '好奇':'Curious','冷淡':'Aloof','火爆':'Fiery','快活':'Jolly','羞怯':'Timid'
};
var CARD_INDEX = {};
Object.keys(CARD_WORDS).forEach(function(zh){ CARD_INDEX[zh] = zh; CARD_INDEX[CARD_WORDS[zh]] = zh; CARD_INDEX[CARD_WORDS[zh].toLowerCase()] = zh; });
/* 卡面取词：中文界面优先用旧物种中文名（LEGACY_LABELS），其次查卡面词条 */
function qxCardWord(word, sp){
  var zh = (sp && typeof LEGACY_LABELS !== 'undefined' && LEGACY_LABELS[sp]) || CARD_INDEX[word] || CARD_INDEX[String(word).toLowerCase()];
  if(UI_LANG === 'en') return CARD_WORDS[zh] || word;
  return zh || word;
}
/* ══ v13-r17 帮助面板与更新提示的中文版（含 <b>/<kbd> 的整段版式，逐语言给出）══ */
var HELP_COPY = {
  head: {
    zh: '字母是动作，数字是终章，符号是设置。悬停看说明，点击就演出。',
    en: 'Letters are moves, numbers are finales, symbols are settings. Hover to read, click to play.'
  },
  legend: {
    zh: '<b>Shift</b> + 字母：放大版（角上带虚线）· <b>Alt</b> + 字母，或按住 <b>空格</b> + 字母：用指针把它画到角色身上 · 手机上长按按键 · <b>`</b> 让大家说句话 · 方向键还藏着一个秘密',
    en: '<b>Shift</b> + letter: the big version (dotted corner) · <b>Alt</b> + letter, or hold <b>Space</b> + letter: paint it onto heads with the pointer · on a phone, press and hold a key · <b>`</b> make them say something · and there is a secret with the arrow keys'
  },
  whatsnew: {
    zh: '<b>按键调整。</b>设置搬离字母区：颜色 <kbd>9</kbd>、阵容 <kbd>8</kbd>、收藏 <kbd>.</kbd>、声音 <kbd>0</kbd>。数字键留给终章：开花 <kbd>1</kbd>、舞龙 <kbd>2</kbd>；<kbd>5</kbd>、<kbd>6</kbd>、<kbd>7</kbd> 是新的终章。设置里新增分享码（分享外观或整场）、自己的预设，还有空闲自动表演。',
    en: '<b>New keys.</b> Settings moved off the letters: colour <kbd>9</kbd>, cast <kbd>8</kbd>, kept <kbd>.</kbd>, sound <kbd>0</kbd>. Finales are on numbers: bloom <kbd>1</kbd>, dragon dance <kbd>2</kbd>. New finales on 5, 6 and 7. Settings now has codes to share your look or your whole scene, your own presets, and an autoplay screensaver.'
  }
};
function applyHelpCopy(){
  var lang = (UI_LANG === 'en') ? 'en' : 'zh';
  var head = document.querySelector('.helpSheet header p'); if(head) head.textContent = HELP_COPY.head[lang];
  var legend = document.querySelector('#help .legend'); if(legend) legend.innerHTML = HELP_COPY.legend[lang];
  var wn = document.querySelector('#whatsnew p'); if(wn) wn.innerHTML = HELP_COPY.whatsnew[lang];
}
var baseRefreshLocale = refreshLocale;
refreshLocale = function(){ baseRefreshLocale(); applyHelpCopy(); };
applyHelpCopy();
var LOOKBOOK=[
 {id:'soft',name:['柔彩日常','Soft everyday'],desc:['莫兰迪水彩 · 轻纸纹与柔和边缘','Morandi watercolour · soft edges and quiet paper'],styles:['watercolor'],palettes:['morandi'],paper:'cream',density:.65,pigment:.92,wetness:.65,line:.85,wobble:.8,mono:false},
 {id:'ink',name:['水墨留白','Ink & silence'],desc:['宣纸水墨 · 干湿相间，轮廓呼吸','Ink on rice paper · dry marks and soft washes'],styles:['sumi'],palettes:['inkstone'],paper:'xuan',density:.7,pigment:1.1,wetness:.8,line:.8,wobble:.9,mono:false},
 {id:'porcelain',name:['青花小集','Porcelain cabinet'],desc:['瓷白工笔 · 钴蓝细线，安静精致','Fine cobalt lines on porcelain white'],styles:['gongbi'],palettes:['qinghua'],paper:'porcelain',density:.6,pigment:1.05,wetness:.2,line:.7,wobble:.35,mono:false},
 {id:'wood',name:['森林木刻','Woodland print'],desc:['牛皮纸木刻 · 有力轮廓与疏密排线','Woodcut on kraft · bold contours and carved marks'],styles:['woodcut'],palettes:['nordic'],paper:'kraft',density:1.35,pigment:1.1,wetness:.1,line:1.3,wobble:.7,mono:false},
 {id:'riso',name:['孔版小报','Riso gazette'],desc:['孔版印刷 · 颗粒、亮色与错位趣味','Risograph · grain, bright colours and playful offsets'],styles:['riso'],palettes:['riso'],paper:'newsprint',density:1.15,pigment:.95,wetness:.2,line:.9,wobble:.6,mono:false},
 {id:'crayon',name:['蜡笔游园','Crayon picnic'],desc:['暖纸蜡笔 · 稚拙线条与饱满色块','Warm paper, waxy marks and cheerful colour'],styles:['crayon'],palettes:['memphis'],paper:'cream',density:1.45,pigment:1.15,wetness:.15,line:1.1,wobble:1.25,mono:false},
 {id:'pencil',name:['铅笔观察簿','Pencil field notes'],desc:['单色铅笔 · 留白、细线与观察感','Monochrome pencil · fine lines and open space'],styles:['pencil'],palettes:[],paper:'cream',density:1.1,pigment:.9,wetness:.1,line:.7,wobble:1,mono:true},
 {id:'pop',name:['波普派对','Pop party'],desc:['新闻纸波普 · 明快撞色与圆点节奏','Pop on newsprint · bright contrast and dot rhythms'],styles:['pop'],palettes:['pop'],paper:'newsprint',density:.9,pigment:1.2,wetness:.1,line:1.2,wobble:.3,mono:false}
];
LOOKBOOK.forEach(function(p){[p.name,p.desc].forEach(function(pair){UI_INDEX[pair[0]]=pair;UI_INDEX[pair[1]]=pair;});});
var LOOK_KEYS=['styles','palettes','paper','density','pigment','wetness','line','wobble','mono'];
function putLook(p){LOOK_KEYS.forEach(function(k){CFG[k]=Array.isArray(p[k])?p[k].slice():p[k];});CFG.palMode='all';}
function matchesLook(p){return CFG.palMode==='all'&&LOOK_KEYS.every(function(k){return JSON.stringify(CFG[k])===JSON.stringify(p[k]);});}
function syncLookbook(){document.querySelectorAll('[data-look]').forEach(function(b){b.setAttribute('aria-pressed',matchesLook(LOOKBOOK.find(function(p){return p.id===b.dataset.look;}))?'true':'false');});}
function applyMaterialPreset(id){var p=LOOKBOOK.find(function(v){return v.id===id;});if(!p)return false;pushUndo();putLook(p);applyTheme();rebuildPaper();saveCfg();syncPanel();syncLookbook();document.getElementById('lookbookStatus').textContent=p.name[UI_LANG==='en'?1:0];return true;}
function paintLookPreview(canvas,p){var savedCfg=CFG;try{CFG=Object.assign({},CFG);putLook(p);applyTheme();canvas.width=300;canvas.height=210;var x=canvas.getContext('2d');x.drawImage(makePaperCanvas(300,210),0,0);var h=new Head(atlasDNA('shrimp',714));h.x=150;h.y=108;h.s=61;h.pop=1;var oldCtx=ctx,oldPat=PAT,oldLine=LINE_K;try{ctx=x;PAT=null;LINE_K=1;h.draw({ox:0,oy:0,hs:1,eye:0,mouth:0,smile:.5,gazeX:.2,gazeY:0,flap:0,wind:0});}finally{ctx=oldCtx;PAT=oldPat;LINE_K=oldLine;}}finally{CFG=savedCfg;applyTheme();}}
function buildLookbook(){var box=document.getElementById('lookbookCards');box.innerHTML='';LOOKBOOK.forEach(function(p){var b=document.createElement('button');b.type='button';b.className='lookCard';b.dataset.look=p.id;var c=document.createElement('canvas');c.setAttribute('aria-hidden','true');b.appendChild(c);paintLookPreview(c,p);var title=document.createElement('strong');title.textContent=p.name[0];b.appendChild(title);var desc=document.createElement('span');desc.textContent=p.desc[0];b.appendChild(desc);b.addEventListener('click',function(){applyMaterialPreset(p.id);});box.appendChild(b);});syncLookbook();refreshLocale();}
function toggleLookbook(on){var el=document.getElementById('lookbook');el.hidden=!on;if(on){toggleAtlasLibrary(false);buildLookbook();document.getElementById('lookbookClose').focus();}else document.getElementById('lookbookOpen').focus();}
document.getElementById('lookbookOpen').addEventListener('click',function(){toggleLookbook(true);});
document.getElementById('lookbookClose').addEventListener('click',function(){toggleLookbook(false);});
document.getElementById('lookbook').addEventListener('keydown',function(e){e.stopPropagation();if(e.key==='Escape'){e.preventDefault();toggleLookbook(false);}if(e.key==='Tab'){var focusable=Array.from(document.getElementById('lookbook').querySelectorAll('button'));var first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
var lookSyncPanel=syncPanel;syncPanel=function(){lookSyncPanel();syncLookbook();};
