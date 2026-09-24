/* 趣像 22 (r45): 生态缸 · 第二期
   ─────────────────────────────────────────────────────────────
   在 r44 生态缸上加：
     角色包托盘  托盘上方一排包（经典 / 西游 / 山海 / 百鬼 / 欧洲神话 / 葫芦 / 潮间带 / 动画 / 花园）；神话角色也能投放，
                 同是神话的才通婚，孩子以"血统"（借体标志）带上另一位的招牌；每个包在各气候有自己的底子（潮间带离不开海边）
     分区        左右两种气候，中间自然成了迁徙带——看同一个祖先分成两支
     天灾        冰河期（三代雪原）、洪水（下两排被淹）、彗星（全缸辐射）、丰年（满天撒食物）
     进化树      每个变种一个小头像，连到它的父母变种；灭绝的变淡；点开看卡片
     图鉴与成就  见过的变种存在本机（最多 600 种）；十四个成就
     挑战        七关，每关一句话目标、代数上限、三星评价；挑战码可分享
     缸码        把整缸（气候、代数、每一只的基因和位置）压成一行字 / 链接；打开链接就是同一缸，之后各自演化
     海报        竖版"进化史"：舞台快照、种群曲线、本缸之最、三条物种志 */

var EVO_PACK_WHY = {
  journey: { desert: ['火焰山出身，不怕热', 'raised by the Flaming Mountains'], snow: ['袈裟挡不住风雪', 'robes don’t stop a blizzard'] },
  shanhai: { night: ['异兽夜里才出来', 'strange beasts come out at night'] },
  yokai: { night: ['妖怪的时辰到了', 'the hour of yokai'], desert: ['妖怪晒不得太阳', 'yokai can’t take the sun'] },
  giants: { snow: ['北国的神话，冰雪是老家', 'northern myths — snow is home'], sea: ['石头巨人会沉底', 'stone giants sink'] },
  tidal: { sea: ['本来就住在潮间带', 'they live in the tide pool'], desert: ['离了水就干了', 'dry out without water'], snow: ['海水结冰', 'the sea freezes'] },
  garden: { temperate: ['花园里最舒服', 'happiest in a garden'] }
};

/* ========== 一、托盘：按角色包切换 ========== */
EVO.pack = 'classic';
function evoPackTabs() {
  var p = EVO.panel; if (!p || p.packRow) return;
  var tray = p.el.querySelector('.evoTray'); if (!tray) return;
  var row = document.createElement('div'); row.className = 'evoPacks';
  QX_PACKS.list.forEach(function (P) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = evoL(P.zh, P.en); b.dataset.pack = P.id;
    b.addEventListener('click', function () { EVO.pack = P.id; EVO.pick = 'random'; EVO.tool = 'drop'; evoFillTray(); evoSyncPanel(); });
    row.appendChild(b);
  });
  tray.parentNode.insertBefore(row, tray);
  p.packRow = row;
}
function evoFillTray() {
  var p = EVO.panel, tray = p && p.el.querySelector('.evoTray'); if (!tray) return;
  tray.innerHTML = ''; p.tray = {};
  var P = QX_PACKS.byId[EVO.pack] || QX_PACKS.byId.classic;
  var add = function (key, label) {
    var b = document.createElement('button'); b.type = 'button';
    var c = document.createElement('canvas');
    if (key === 'random') { c.width = c.height = 52; var cx = c.getContext('2d'); cx.fillStyle = '#e9dfcc'; cx.beginPath(); cx.arc(26, 26, 25, 0, TAU); cx.fill(); cx.fillStyle = '#3a342c'; cx.font = '600 30px serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('?', 26, 28); }
    else try { miniPortrait(c, QX_PACKS.dna(key, 17), 26, .3); } catch (e) {}
    var sp = document.createElement('span'); sp.textContent = label; b.title = label;
    b.appendChild(c); b.appendChild(sp);
    b.addEventListener('click', function () { EVO.pick = key; EVO.tool = 'drop'; evoSyncPanel(); });
    tray.appendChild(b); p.tray[key] = b;
  };
  add('random', evoL('随机', 'Random'));
  P.members.forEach(function (k) { add(k, evoEn() ? QX_PACKS.name(k, true).split(' · ')[0] : QX_PACKS.short(k)); });
}

/* ========== 二、分区 ========== */
function evoSetClimate2(c) {
  if (c && !EVO_CLIMATES[c]) return;
  EVO.climate2 = c || null;
  if (c) evoLog('缸被分成了两半：左边' + EVO_CLIMATES[EVO.climate].zh + '，右边' + EVO_CLIMATES[c].zh + '。中间那一列是迁徙带。', 'The tank is split: ' + EVO_CLIMATES[EVO.climate].en.toLowerCase() + ' on the left, ' + EVO_CLIMATES[c].en.toLowerCase() + ' on the right.', 'climate');
  else evoLog('分区撤掉了，全缸一种气候。', 'The divide is gone — one climate again.', 'climate');
  evoSyncPanel();
}
/* 天气层按半边裁切 */
var evoPlusBaseLayer = evoClimateLayer;
evoClimateLayer = function (c, al, now) {
  if (!EVO.climate2 || EVO.splitDrawing) return evoPlusBaseLayer(c, al, now);
  var mid = Math.ceil(cols / 2) * cellW;
  EVO.splitDrawing = true;
  try {
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, mid, H); ctx.clip(); evoPlusBaseLayer(c, al, now); ctx.restore();
    if (c === EVO.climate) { ctx.save(); ctx.beginPath(); ctx.rect(mid, 0, W - mid, H); ctx.clip(); evoPlusBaseLayer(EVO.climate2, 1, now); ctx.restore();
      ctx.save(); ctx.strokeStyle = 'rgba(80,70,60,.28)'; ctx.setLineDash([6, 6]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(mid, 0); ctx.lineTo(mid, H); ctx.stroke(); ctx.restore(); }
  } finally { EVO.splitDrawing = false; }
};

/* ========== 三、天灾 ========== */
function evoDisaster(kind) {
  if (!EVO.on) return;
  var alive = heads.filter(evoLive);
  if (kind === 'ice') {
    if (EVO.ice) return;
    EVO.ice = 3; EVO.iceSaved = [EVO.climate, EVO.climate2];
    evoSetClimate('snow'); if (EVO.climate2) EVO.climate2 = 'snow';
    evoLog('冰河期来了！接下来三代全缸冰封。', 'An ice age! Three generations of frost.', 'meteor');
  } else if (kind === 'flood') {
    EVO.flood = { t0: performance.now() };
    if (SOUND) try { SFX.whoosh(0, 1.2); } catch (e) {}
    setTimeout(function () {
      if (!EVO.on) return;
      var n = 0; heads.forEach(function (h) { if (h.row >= rows - 2 && evoLive(h)) { n++; evoKill(h, 'flood'); } });
      EVO.food = EVO.food.filter(function (f) { return f.y < (rows - 2) * cellH; });
      evoLog('洪水！下面两排被淹了，' + n + ' 只没爬上来。', 'A flood! The bottom two rows go under; ' + n + ' didn’t climb out.', 'meteor');
      EVO.disasters = (EVO.disasters || 0) + 1;
      setTimeout(function () { evoCensus([]); }, 1500);
    }, 900);
    return;
  } else if (kind === 'comet') {
    EVO.comet = { t0: performance.now() };
    alive.forEach(function (h) { h.evo.mutagen = 1; });
    if (SOUND) try { SFX.whoosh(-.6, 1.4); } catch (e) {}
    evoLog('彗星掠过！全缸 ' + alive.length + ' 只都沾了点星尘——下一代会很怪。', 'A comet passes! All ' + alive.length + ' catch some stardust — the next generation will be odd.', 'meteor');
    EVO.afterMeteor = EVO.gen;
  } else if (kind === 'feast') {
    for (var i = 0; i < 44; i++) { EVO.lastSeed = 0; evoScatter(W * .03 + Math.random() * W * .94, H * .05 + Math.random() * H * .9); }
    evoLog('丰年！天上下起了种子雨。', 'A bumper year! It rains seeds.', 'top');
  }
  EVO.disasters = (EVO.disasters || 0) + 1;
  evoSyncPanel();
}
var evoPlusBaseGen = evoGeneration;
evoGeneration = function () {
  var r = evoPlusBaseGen.apply(this, arguments);
  if (EVO.ice) { EVO.ice--; if (!EVO.ice) { var s = EVO.iceSaved || ['temperate', null]; evoSetClimate(s[0] === 'snow' ? 'temperate' : s[0]); EVO.climate2 = s[1]; evoLog('冰河期结束了。活下来的都是毛厚的。', 'The ice age ends. The survivors are the furry ones.', 'climate'); } }
  EVO.streak = EVO.streak || {};
  var key = EVO.climate + (EVO.climate2 ? '/' + EVO.climate2 : '');
  if (EVO.streakKey === key && heads.some(evoLive)) EVO.streakN = (EVO.streakN || 0) + 1; else { EVO.streakKey = key; EVO.streakN = 0; }
  return r;
};
var evoPlusBaseMeteor = evoMeteor;
evoMeteor = function () { EVO.afterMeteor = EVO.gen; return evoPlusBaseMeteor.apply(this, arguments); };
/* 洪水、彗星的画面 */
var evoPlusBaseWorld = evoDrawWorld;
evoDrawWorld = function (now) {
  evoPlusBaseWorld(now);
  var F = EVO.flood;
  if (F) {
    var k = (now - F.t0) / 2600; if (k > 1) EVO.flood = null;
    else {
      var rise = Math.min(1, k / .35) * (1 - Math.max(0, (k - .7) / .3)), top = H - (2 * cellH + 8) * rise;
      ctx.save(); ctx.globalAlpha = .55; var g = ctx.createLinearGradient(0, top, 0, H); g.addColorStop(0, 'rgba(90,150,200,.7)'); g.addColorStop(1, 'rgba(40,90,150,.9)'); ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(0, H); for (var x = 0; x <= W; x += 12) ctx.lineTo(x, top + Math.sin(x / 40 + now / 180) * 5); ctx.lineTo(W, H); ctx.closePath(); ctx.fill(); ctx.restore();
    }
  }
  var C2 = EVO.comet;
  if (C2) {
    var t = (now - C2.t0) / 1600; if (t > 1) EVO.comet = null;
    else {
      var cx = -W * .1 + W * 1.2 * t, cy = H * (.12 + .12 * t);
      ctx.save(); var gr = ctx.createLinearGradient(cx, cy, cx - W * .25, cy - H * .08); gr.addColorStop(0, 'rgba(255,250,220,.95)'); gr.addColorStop(1, 'rgba(160,200,255,0)');
      ctx.strokeStyle = gr; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - W * .25, cy - H * .08); ctx.stroke();
      ctx.fillStyle = '#fffbe8'; ctx.beginPath(); ctx.arc(cx, cy, 7, 0, TAU); ctx.fill();
      ctx.globalAlpha = .12 * Math.sin(t * Math.PI); ctx.fillStyle = '#cfe0ff'; ctx.fillRect(0, 0, W, H); ctx.restore();
    }
  }
};

/* ========== 四、图鉴与成就（本机） ========== */
var EVO_DEX = {}, EVO_ACH = {};
try { EVO_DEX = JSON.parse(localStorage.getItem('quxiang.evoDex') || '{}') || {}; } catch (e) { EVO_DEX = {}; }
try { EVO_ACH = JSON.parse(localStorage.getItem('quxiang.evoAch') || '{}') || {}; } catch (e) { EVO_ACH = {}; }
function evoSaveDex() { try { localStorage.setItem('quxiang.evoDex', JSON.stringify(EVO_DEX)); } catch (e) {} }
function evoSaveAch() { try { localStorage.setItem('quxiang.evoAch', JSON.stringify(EVO_ACH)); } catch (e) {} }
function evoSpeciesCount(g) { if (g.natural) return g.donor ? 2 : 1; var s = {}; for (var i = 0; i < 4; i++) s[g.src[i]] = 1; return Object.keys(s).length; }
var EVO_ACHS = [
  ['hybrid', '第一只混血', 'First hybrid', '缸里出现了第一只混血。', 'A hybrid appears in the tank.', function (c) { return c.alive.some(function (h) { return !h.g.natural && evoSpeciesCount(h.g) >= 2; }); }],
  ['tri', '三族混血', 'Three bloodlines', '一只生物身上有三种物种的部件。', 'One creature carries parts of three species.', function (c) { return c.alive.some(function (h) { return evoSpeciesCount(h.g) >= 3; }); }],
  ['full', '满缸', 'Full house', '每个格子都有生物。', 'Every cell is occupied.', function (c) { return c.alive.length >= heads.length; }],
  ['lonely', '最后一只', 'The last one', '全缸只剩一只，还活着。', 'Only one creature left alive.', function (c) { return c.alive.length === 1 && EVO.gen > 5; }],
  ['diverse', '百花齐放', 'Blooming', '同时有 8 种生物。', 'Eight kinds at once.', function (c) { return c.kinds >= 8; }],
  ['streak', '气候老手', 'Weathered', '同一种气候连续 30 代没有灭缸。', 'Thirty generations in one climate without dying out.', function () { return (EVO.streakN || 0) >= 30; }],
  ['phoenix', '劫后新生', 'From the ashes', '陨石或彗星之后三代内出现了新变种。', 'A new kind within three generations of a meteor or comet.', function (c) { return EVO.afterMeteor != null && EVO.gen - EVO.afterMeteor <= 3 && EVO.gen > EVO.afterMeteor && c.fresh > 0; }],
  ['gen100', '百代', 'A hundred generations', '第 100 代。', 'Generation 100.', function () { return EVO.gen >= 100; }],
  ['myth', '神话血统', 'Mythic blood', '神话角色带上了另一位的血统。', 'A mythic figure carries another’s mark.', function (c) { return c.alive.some(function (h) { return h.g.natural && h.g.donor; }); }],
  ['rust', '生锈了', 'Rusted', '机器人在海边灭绝了。', 'Robots went extinct by the sea.', function (c) { return c.rusted; }],
  ['split', '分道扬镳', 'Parting ways', '分区时两边的霸主不一样。', 'Different kinds rule each half of a split tank.', function (c) { return c.splitDiff; }],
  ['dex30', '图鉴 30 种', '30 in the book', '图鉴里收集了 30 种。', '30 kinds collected.', function () { return Object.keys(EVO_DEX).length >= 30; }],
  ['dex100', '图鉴 100 种', '100 in the book', '图鉴里收集了 100 种。', '100 kinds collected.', function () { return Object.keys(EVO_DEX).length >= 100; }],
  ['champion', '挑战全通', 'All challenges', '通过了全部挑战。', 'Every challenge cleared.', function () { return EVO_CHALLENGES.every(function (C) { return (EVO_STARS[C.id] || 0) > 0; }); }]
];
var evoPlusBaseCensus = evoCensus;
evoCensus = function (news) {
  var before = Object.keys(EVO.lineage).length, prevGone = {};
  Object.keys(EVO.lineage).forEach(function (k) { prevGone[k] = EVO.lineage[k].gone; });
  var r = evoPlusBaseCensus.apply(this, arguments);
  if (!EVO.on) return r;
  var alive = heads.filter(evoLive), kinds = {}, dexNew = 0;
  alive.forEach(function (h) {
    var v = evoVariantOf(h); kinds[v.key] = 1;
    if (!EVO_DEX[v.key]) { EVO_DEX[v.key] = { zh: v.zh, en: v.en, d: h.dna.map(function (x) { return (x >>> 0).toString(36); }).join('.'), t: Date.now(), h: v.hue }; dexNew++; }
  });
  var dk = Object.keys(EVO_DEX); if (dk.length > 600) dk.sort(function (a, b) { return EVO_DEX[a].t - EVO_DEX[b].t; }).slice(0, dk.length - 600).forEach(function (k) { delete EVO_DEX[k]; });
  if (dexNew) evoSaveDex();
  var rusted = false;
  Object.keys(EVO.lineage).forEach(function (k) { var L = EVO.lineage[k]; if (L.gone && !prevGone[k] && L.v.sp === 'robot' && EVO.climate === 'sea' && L.peak >= 2) rusted = true; });
  var splitDiff = false;
  if (EVO.climate2) {
    var half = Math.ceil(cols / 2), cL = {}, cR = {};
    alive.forEach(function (h) { var k = evoVariantOf(h).key, m = h.col >= half ? cR : cL; m[k] = (m[k] || 0) + 1; });
    var top = function (m) { return Object.keys(m).sort(function (a, b) { return m[b] - m[a]; })[0]; };
    var a = top(cL), b = top(cR); splitDiff = !!(a && b && a !== b && cL[a] >= 3 && cR[b] >= 3);
  }
  var ctx2 = { alive: alive, kinds: Object.keys(kinds).length, fresh: Object.keys(EVO.lineage).length - before, rusted: rusted, splitDiff: splitDiff };
  EVO_ACHS.forEach(function (A) {
    if (EVO_ACH[A[0]]) return;
    var ok = false; try { ok = A[5](ctx2); } catch (e) {}
    if (ok) { EVO_ACH[A[0]] = Date.now(); evoSaveAch(); evoLog('★ 成就：' + A[1] + '——' + A[3], '★ Achievement: ' + A[2] + ' — ' + A[4], 'top'); toast('★ ' + evoL(A[1], A[2]), 2400); if (SOUND) try { SFX.chime(0); } catch (e) {} }
  });
  evoChallengeCheck(ctx2);
  return r;
};

/* ========== 五、挑战 ========== */
var EVO_STARS = {};
try { EVO_STARS = JSON.parse(localStorage.getItem('quxiang.evoStars') || '{}') || {}; } catch (e) { EVO_STARS = {}; }
var EVO_CHALLENGES = [
  { id: 'tri', zh: '三族混血', en: 'Three bloodlines', goal: ['三种动物开局。15 代内得到一只由三种物种拼成的生物。', 'Three species to start. Within 15 generations, get one creature built from three species.'], climate: 'temperate', founders: ['fox', 'fox', 'pig', 'pig', 'owl', 'owl'], limit: 15,
    win: function (c) { return c.alive.some(function (h) { return !h.g.natural && evoSpeciesCount(h.g) >= 3; }); } },
  { id: 'eyes', zh: '夜之眼', en: 'Eyes of the night', goal: ['三对小鸡在夜林开局。进化出长着猫头鹰或外星人眼睛的小鸡（彗星和陨石能加快突变）。', 'Three pairs of chicks in the night forest. Evolve a chick with owl or alien eyes (comets and meteors speed up mutation).'], climate: 'night', founders: ['chick', 'chick', 'chick', 'chick', 'chick', 'chick'], limit: 40,
    win: function (c) { return c.alive.some(function (h) { return !h.g.natural && h.g.sp === 'chick' && (h.g.src[2] === 'owl' || h.g.src[2] === 'alien'); }); } },
  { id: 'hold', zh: '雪原坚守', en: 'Hold the tundra', goal: ['雪原开局。撑过 25 代，最后至少 16 只。', 'Start on the tundra. Last 25 generations with at least 16 alive.'], climate: 'snow', founders: ['cat', 'cat', 'bear', 'bear', 'rabbit', 'rabbit', 'mouse', 'mouse'], limit: 25, lockClimate: true, atEnd: true,
    win: function (c) { return EVO.gen - EVO.challenge.g0 >= 25 && c.alive.length >= 16; }, stars: function (c) { return c.alive.length >= 28 ? 3 : c.alive.length >= 22 ? 2 : 1; } },
  { id: 'rust', zh: '机器人退场', en: 'Robots out', goal: ['海边开局，缸里有四个机器人。25 代内让机器人灭绝，但别让缸空了（陨石是你的朋友）。', 'Seashore start with four robots. Make robots extinct within 25 generations without emptying the tank (meteors are your friend).'], climate: 'sea', founders: ['robot', 'robot', 'robot', 'robot', 'frog', 'frog', 'cat', 'cat'], limit: 25, lockClimate: true,
    win: function (c) { return c.alive.length > 0 && !c.alive.some(function (h) { return h.g.sp === 'robot'; }); } },
  { id: 'boom', zh: '人丁兴旺', en: 'Baby boom', goal: ['一对兔子开局。20 代内把缸填满八成（撒食物会快很多）。', 'One pair of rabbits. Fill 80% of the tank within 20 generations (food helps a lot).'], climate: 'temperate', founders: ['rabbit', 'rabbit'], limit: 20,
    win: function (c) { return c.alive.length >= Math.ceil(heads.length * .8); } },
  { id: 'blood', zh: '神话血统', en: 'Mythic blood', goal: ['西游与欧洲神话各一对。20 代内得到一位带着另一边血统的神话角色。', 'A pair from Journey and a pair of European myths. Within 20 generations, get a figure carrying the other side’s mark.'], climate: 'temperate', founders: ['west_monkey', 'west_pig', 'giant_medusa', 'giant_minotaur'], limit: 20,
    win: function (c) { return c.alive.some(function (h) { var a = QX_PACKS.packOf(h.g.sp), b = h.g.donor ? QX_PACKS.packOf(h.g.donor) : null; return h.g.natural && a && b && a.id !== b.id; }); } },
  { id: 'century', zh: '百代不绝', en: 'A hundred generations', goal: ['四种生物开局。撑过 100 代，最后至少有 5 种。', 'Four kinds to start. Last 100 generations with at least 5 kinds.'], climate: 'temperate', founders: ['human', 'human', 'dog', 'dog', 'owl', 'owl', 'frog', 'frog'], limit: 100, atEnd: true,
    win: function (c) { return EVO.gen - EVO.challenge.g0 >= 100 && c.kinds >= 5; }, stars: function (c) { return c.kinds >= 9 ? 3 : c.kinds >= 7 ? 2 : 1; } }
];
/* 欧洲神话成员的实际登记键 */
(function () {
  var g = QX_PACKS.byId.giants; if (!g) return;
  var find = function (kind) { return g.members.filter(function (k) { return (FOLK_INFO[k] || {}).kind === kind; })[0]; };
  var B = EVO_CHALLENGES.filter(function (c) { return c.id === 'blood'; })[0];
  B.founders = ['west_monkey', 'west_pig', find('medusa') || g.members[0], find('minotaur') || g.members[1]];
})();
function evoStartChallenge(id) {
  var C = EVO_CHALLENGES.filter(function (c) { return c.id === id; })[0]; if (!C) return;
  if (!EVO.on) evoEnter();
  if (!EVO.on) return;
  evoClearTank();
  EVO.climate = C.climate; EVO.climate2 = null; EVO.cPrev = null; EVO.cT = 0;
  EVO.challenge = { id: id, g0: EVO.gen, done: false };
  /* 固定开局：从中间开始，成对相邻地摆 */
  var order = heads.slice().sort(function (a, b) { var ca = (cols - 1) / 2, ra = (rows - 1) / 2; return (Math.abs(a.col - ca) + Math.abs(a.row - ra) * 1.2) - (Math.abs(b.col - ca) + Math.abs(b.row - ra) * 1.2) || a.col - b.col; });
  var r = mulberry32(dnaHash([id.length, id.charCodeAt(0), id.charCodeAt(1) || 7]));
  C.founders.forEach(function (sp, i) {
    var h = order[i]; if (!h) return;
    var d = QX_PACKS.dna(sp, (r() * 4294967296) >>> 0);
    setTimeout(function () { evoPlace(h, d, 'drop'); }, i * 160);
  });
  evoLog('挑战 · ' + C.zh + '：' + C.goal[0], 'Challenge · ' + C.en + ': ' + C.goal[1], 'mile');
  evoSyncPanel();
}
function evoChallengeCheck(c) {
  var X = EVO.challenge; if (!X || X.done) return;
  var C = EVO_CHALLENGES.filter(function (q) { return q.id === X.id; })[0]; if (!C) return;
  var used = EVO.gen - X.g0;
  if (!c.alive.length && used > 0) return evoChallengeEnd(C, 0, evoL('缸空了。', 'The tank died out.'));
  var ok = false; try { ok = C.win(c); } catch (e) {}
  if (ok) {
    var stars = C.stars ? C.stars(c) : used <= C.limit * .5 ? 3 : used <= C.limit * .8 ? 2 : 1;
    return evoChallengeEnd(C, stars);
  }
  if (used >= C.limit) evoChallengeEnd(C, 0, evoL('代数用完了。', 'Out of generations.'));
}
function evoChallengeEnd(C, stars, why) {
  EVO.challenge.done = true;
  if (stars) {
    EVO_STARS[C.id] = Math.max(EVO_STARS[C.id] || 0, stars); try { localStorage.setItem('quxiang.evoStars', JSON.stringify(EVO_STARS)); } catch (e) {}
    evoLog('挑战成功 · ' + C.zh + ' ' + '★★★'.slice(0, stars) + '（用了 ' + (EVO.gen - EVO.challenge.g0) + ' 代）', 'Challenge cleared · ' + C.en + ' ' + '★★★'.slice(0, stars) + ' (' + (EVO.gen - EVO.challenge.g0) + ' generations)', 'top');
    toast(evoL('挑战成功！', 'Challenge cleared!') + ' ' + '★★★'.slice(0, stars), 3000);
    if (SOUND) try { SFX.chime(0); SFX.chime(0, .3); } catch (e) {}
    for (var i = 0; i < 30; i++) particles.push({ x: W / 2, y: H * .4, vx: (Math.random() - .5) * 400, vy: -100 - Math.random() * 250, l: 0, ml: 1.2, r: 3 + Math.random() * 3, col: evoRand(['#e36a5c', '#f0b13a', '#6fa8d6', '#8fc46c']) });
  } else {
    evoLog('挑战没成功 · ' + C.zh + '：' + why + '点"挑战"再来一次。', 'Challenge failed · ' + C.en + ': ' + why + ' Try again from "Challenges".', 'gone');
    toast(evoL('没成功——', 'Not this time — ') + why, 2600);
  }
  evoSyncPanel();
}
/* 挑战里锁定气候的关，气候按钮不响应 */
var evoPlusBaseSetClimate = evoSetClimate;
evoSetClimate = function (c) {
  var X = EVO.challenge, C = X && !X.done ? EVO_CHALLENGES.filter(function (q) { return q.id === X.id; })[0] : null;
  if (C && C.lockClimate && !EVO.ice) { toast(evoL('这一关不能换气候。', 'Climate is fixed in this challenge.'), 1600); return; }
  return evoPlusBaseSetClimate.apply(this, arguments);
};

/* ========== 六、缸码：整缸压成一行字 ========== */
function evoPlace(h, dna, how) {
  if (!h || !h.hidden || h.evoDying) return;
  clearActs(h);
  h.setDNA(dna, null); h.hidden = false; h.pop = 0; h.yaw = 0; h.pitch = 0; h.parents = null;
  h.evo = { age: 1, born: EVO.gen, fit: evoFit(h.g, evoClimateOf(h)).f, how: how || 'drop', fed: 0 };
  act(h, 'evoDrop');
  setTimeout(function () { evoCensus([]); }, 950);
}
function evoClearTank() {
  heads.forEach(function (h) { clearActs(h); h.hidden = true; h.evo = null; h.evoDying = false; h.evoReserved = false; h.pop = 0; });
  EVO.gen = 0; EVO.acc = 0; EVO.food = []; EVO.meteors = []; EVO.craters = []; EVO.lineage = {}; EVO.hist = []; EVO.journal = []; EVO.dominant = null;
  EVO.births = EVO.deaths = EVO.drops = 0; EVO.ice = 0; EVO.challenge = null; EVO.climate2 = null; EVO.streakN = 0; EVO.afterMeteor = null;
  evoRenderJournal(); evoRenderStats();
}
var EVO_CI = EVO_CLIMATE_ORDER;
function evoExportCode() {
  var tab = [], idx = {}, rowsOut = [];
  heads.forEach(function (h, i) {
    if (!evoLive(h)) return;
    rowsOut.push(i.toString(36) + '-' + h.dna.map(function (x) { x = x >>> 0; if (!(x in idx)) { idx[x] = tab.length; tab.push(x.toString(36)); } return idx[x].toString(36); }).join(','));
  });
  return 'qxt1_' + [EVO_CI.indexOf(EVO.climate), EVO.climate2 ? EVO_CI.indexOf(EVO.climate2) : '', EVO.gen.toString(36), cols, rows].join(',') + '~' + tab.join('.') + '~' + rowsOut.join(';');
}
function evoImportCode(str) {
  var m = /qxt1_([^~]*)~([^~]*)~(.*)$/.exec(String(str || '').trim()); if (!m) return false;
  var hd = m[1].split(','), tab = m[2] ? m[2].split('.').map(function (x) { return parseInt(x, 36) >>> 0; }) : [];
  if (!EVO.on) evoEnter(); if (!EVO.on) return false;
  evoClearTank();
  EVO.climate = EVO_CI[+hd[0]] || 'temperate'; EVO.climate2 = hd[1] !== '' && EVO_CI[+hd[1]] ? EVO_CI[+hd[1]] : null; EVO.gen = parseInt(hd[2], 36) || 0;
  var oc = +hd[3] || cols, used = {};
  (m[3] ? m[3].split(';') : []).forEach(function (e, n) {
    var p = e.split('-'); if (p.length !== 2) return;
    var i = parseInt(p[0], 36), r0 = Math.floor(i / oc), c0 = i % oc, dna = p[1].split(',').map(function (x) { return tab[parseInt(x, 36)]; });
    if (dna.length < 7 || dna.some(function (x) { return x == null; })) return;
    var h = r0 < rows && c0 < cols ? heads[r0 * cols + c0] : null;
    if (!h || used[heads.indexOf(h)]) h = heads.filter(function (q, j) { return !used[j] && q.hidden; })[0];
    if (!h) return; used[heads.indexOf(h)] = 1;
    setTimeout(function () { evoPlace(h, dna, 'drop'); }, n * 40);
  });
  evoLog('按缸码重建了这一缸（第 ' + EVO.gen + ' 代）。从现在起各自演化。', 'Tank rebuilt from a code (generation ' + EVO.gen + '). From here on it evolves on its own.', 'mile');
  evoSyncPanel();
  return true;
}
function evoShareLink(hash) { return location.href.split('#')[0] + '#' + hash; }
function evoCopy(text, okMsg) {
  var done = function () { toast(okMsg, 2400); };
  try { navigator.clipboard.writeText(text).then(done, function () { window.prompt(evoL('复制这段：', 'Copy this:'), text); }); } catch (e) { window.prompt(evoL('复制这段：', 'Copy this:'), text); }
}
function evoShareTank() {
  if (!heads.some(evoLive)) { toast(evoL('缸是空的。', 'The tank is empty.'), 1600); return; }
  evoCopy(evoShareLink('tank=' + evoExportCode()), evoL('缸码链接已复制：打开它就是这一缸。', 'Tank link copied — opening it rebuilds this tank.'));
}
function evoAskImport() {
  var s = window.prompt(evoL('粘贴缸码或链接：', 'Paste a tank code or link:'), '');
  if (s && !evoImportCode(decodeURIComponent(s))) toast(evoL('看不懂这段缸码。', 'That tank code doesn’t parse.'), 2000);
}
(function evoHashBoot() {
  var h = location.hash || '';
  var m1 = /#tank=(.+)$/.exec(h), m2 = /#tank-challenge=([a-z]+)/.exec(h);
  if (!m1 && !m2) return;
  setTimeout(function () {
    if (m1) evoImportCode(decodeURIComponent(m1[1]));
    else if (m2) evoStartChallenge(m2[1]);
  }, 1400);
})();

/* ========== 七、弹层：进化树、图鉴与成就、挑战 ========== */
function evoModal(title) {
  var old = document.getElementById('evoModal'); if (old) old.remove();
  var L = document.createElement('div'); L.id = 'evoModal'; L.setAttribute('role', 'dialog'); L.setAttribute('aria-label', title);
  var box = document.createElement('div'); box.className = 'evoMBox'; L.appendChild(box);
  var hd = document.createElement('div'); hd.className = 'evoMHead'; var b = document.createElement('b'); b.textContent = title; hd.appendChild(b);
  var x = document.createElement('button'); x.type = 'button'; x.className = 'evoMX'; x.textContent = '×'; x.setAttribute('aria-label', 'close'); hd.appendChild(x); box.appendChild(hd);
  var close = function () { L.remove(); };
  L.addEventListener('click', function (e) { if (e.target === L || e.target === x) close(); });
  L.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); close(); } });
  document.body.appendChild(L); setTimeout(function () { x.focus(); }, 0);
  return { el: L, box: box, close: close };
}
function evoTreeOpen() {
  var keys = Object.keys(EVO.lineage);
  if (!keys.length) { toast(evoL('缸里还没有生物。', 'Nothing in the tank yet.'), 1600); return; }
  var M = evoModal(evoL('进化树', 'Evolution tree'));
  var Ls = keys.map(function (k) { return EVO.lineage[k]; });
  /* 只画有分量的：活着的、曾经 ≥2 只的、始祖、以及它们的父母 */
  var keep = {}; Ls.forEach(function (L) { if (!L.gone || L.peak >= 2 || L.how === 'drop') keep[L.v.key] = 1; });
  Ls.forEach(function (L) { if (keep[L.v.key]) (L.parents || []).forEach(function (p) { keep[p] = 1; }); });
  Ls = Ls.filter(function (L) { return keep[L.v.key]; }).sort(function (a, b) { return a.first - b.first; }).slice(0, 90);
  /* 按始祖分成几条带：根 = 沿第一个父母一直往上 */
  var rootOf = function (L) { var seen = 0, cur = L; while (cur && cur.parents && cur.parents.length && EVO.lineage[cur.parents[0]] && seen++ < 60) cur = EVO.lineage[cur.parents[0]]; return cur.v.key; };
  var bands = [], bandOf = {}, slot = {};
  Ls.forEach(function (L) { var r = rootOf(L); if (!(r in bandOf)) { bandOf[r] = bands.length; bands.push([]); } bands[bandOf[r]].push(L); });
  var maxG = Math.max(1, EVO.gen), NW = 64, pad = 36, bandH = [], y0 = 10;
  var wrap = document.createElement('div'); wrap.className = 'evoTreeWrap';
  var inner = document.createElement('div'); inner.className = 'evoTree';
  var width = Math.max(640, Math.min(2400, 80 + maxG * 14 + NW)), pos = {};
  /* 孤零零的（没有父母也没有孩子）先横排在最上面，省地方 */
  var lone = bands.filter(function (B) { return B.length === 1; }), perRow = Math.max(1, Math.floor((width - pad) / (NW + 8)));
  lone.forEach(function (B, i) { pos[B[0].v.key] = { x: pad / 2 + (i % perRow) * (NW + 8), y: y0 + Math.floor(i / perRow) * 74 }; });
  if (lone.length) y0 += Math.ceil(lone.length / perRow) * 74 + 16;
  bands.filter(function (B) { return B.length > 1; }).forEach(function (B) {
    var lanes = []; B.forEach(function (L) {
      var x = pad + (L.first / maxG) * (width - pad * 2 - NW), lane = 0;
      while (lanes[lane] != null && lanes[lane] > x - NW - 4) lane++;
      lanes[lane] = x; pos[L.v.key] = { x: x, y: y0 + lane * 70 };
    });
    y0 += Math.max(1, lanes.length) * 70 + 18;
  });
  inner.style.width = width + 'px'; inner.style.height = y0 + 'px';
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('width', width); svg.setAttribute('height', y0); svg.style.position = 'absolute'; svg.style.left = svg.style.top = '0';
  Ls.forEach(function (L) {
    (L.parents || []).forEach(function (pk, j) {
      var a = pos[pk], b = pos[L.v.key]; if (!a || !b) return;
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path'), x1 = a.x + NW / 2, y1 = a.y + 20, x2 = b.x + NW / 2, y2 = b.y + 20;
      path.setAttribute('d', 'M' + x1 + ',' + y1 + ' C' + (x1 + x2) / 2 + ',' + y1 + ' ' + (x1 + x2) / 2 + ',' + y2 + ' ' + x2 + ',' + y2);
      path.setAttribute('fill', 'none'); path.setAttribute('stroke', 'hsl(' + L.v.hue + ',45%,55%)'); path.setAttribute('stroke-width', j ? 1.2 : 2); if (j) path.setAttribute('stroke-dasharray', '4 3');
      svg.appendChild(path);
    });
  });
  inner.appendChild(svg);
  Ls.forEach(function (L) {
    var p = pos[L.v.key], n = document.createElement('button'); n.type = 'button'; n.className = 'evoNode' + (L.gone ? ' gone' : '');
    n.style.left = p.x + 'px'; n.style.top = p.y + 'px'; n.title = evoLabel(L.v) + ' · ' + evoL('第 ' + L.first + ' 代出现', 'since gen ' + L.first);
    var c = document.createElement('canvas'); try { miniPortrait(c, L.dna, 40, .3, L.look); } catch (e) {}
    var s = document.createElement('span'); s.textContent = (L.gone ? '† ' : '') + evoLabel(L.v) + (L.n ? ' ×' + L.n : '');
    n.appendChild(c); n.appendChild(s);
    n.addEventListener('click', function () { M.close(); openCard(null, { dna: L.dna, look: L.look }); });
    inner.appendChild(n);
  });
  var axis = document.createElement('div'); axis.className = 'evoAxis'; axis.textContent = evoL('← 第 0 代　　　　时间　　　　第 ' + maxG + ' 代 →', '← gen 0        time        gen ' + maxG + ' →');
  wrap.appendChild(inner); M.box.appendChild(axis); M.box.appendChild(wrap);
  var note = document.createElement('p'); note.className = 'evoMNote'; note.textContent = evoL('实线连到"妈妈"，虚线连到"爸爸"；带 † 的已经灭绝。点任意一种看它的卡片。', 'Solid line to the first parent, dashed to the second; † means extinct. Click any to see its card.');
  M.box.appendChild(note);
}
function evoDexOpen() {
  var M = evoModal(evoL('图鉴与成就', 'Field book & achievements'));
  var ach = document.createElement('div'); ach.className = 'evoAch';
  EVO_ACHS.forEach(function (A) {
    var d = document.createElement('div'); d.className = 'evoAchI' + (EVO_ACH[A[0]] ? ' on' : '');
    d.innerHTML = '<b></b><span></span>'; d.querySelector('b').textContent = (EVO_ACH[A[0]] ? '★ ' : '☆ ') + evoL(A[1], A[2]); d.querySelector('span').textContent = evoL(A[3], A[4]);
    ach.appendChild(d);
  });
  var got = Object.keys(EVO_ACH).length;
  var h1 = document.createElement('p'); h1.className = 'evoMNote'; h1.textContent = evoL('成就 ' + got + ' / ' + EVO_ACHS.length, 'Achievements ' + got + ' / ' + EVO_ACHS.length);
  M.box.appendChild(h1); M.box.appendChild(ach);
  var keys = Object.keys(EVO_DEX).sort(function (a, b) { return EVO_DEX[b].t - EVO_DEX[a].t; });
  var h2 = document.createElement('p'); h2.className = 'evoMNote'; h2.textContent = evoL('图鉴：见过 ' + keys.length + ' 种（存在这台设备上）', 'Field book: ' + keys.length + ' kinds seen (kept on this device)');
  M.box.appendChild(h2);
  var grid = document.createElement('div'); grid.className = 'evoDex'; M.box.appendChild(grid);
  var render = function (from) {
    keys.slice(from, from + 48).forEach(function (k) {
      var E = EVO_DEX[k], dna = E.d.split('.').map(function (x) { return parseInt(x, 36) >>> 0; });
      var b = document.createElement('button'); b.type = 'button'; b.className = 'evoDexI'; b.title = evoEn() ? E.en : E.zh;
      var c = document.createElement('canvas'); try { miniPortrait(c, dna, 44, .3); } catch (e) {}
      var s = document.createElement('span'); s.textContent = evoEn() ? E.en : E.zh;
      b.appendChild(c); b.appendChild(s); b.addEventListener('click', function () { M.close(); openCard(null, { dna: dna }); });
      grid.appendChild(b);
    });
    if (from + 48 < keys.length) { var more = document.createElement('button'); more.type = 'button'; more.className = 'evoMore'; more.textContent = evoL('再看 48 种', 'Show 48 more'); more.addEventListener('click', function () { more.remove(); render(from + 48); }); grid.appendChild(more); }
  };
  render(0);
}
function evoChallengesOpen() {
  var M = evoModal(evoL('挑战', 'Challenges'));
  EVO_CHALLENGES.forEach(function (C) {
    var d = document.createElement('div'); d.className = 'evoChal';
    var st = EVO_STARS[C.id] || 0;
    d.innerHTML = '<div><b></b><em></em><p></p></div><span class="evoChalBtns"><button type="button" class="go"></button><button type="button" class="share"></button></span>';
    d.querySelector('b').textContent = evoL(C.zh, C.en); d.querySelector('em').textContent = ' ' + '★★★'.slice(0, st) + '☆☆☆'.slice(st) + ' · ' + evoL(C.limit + ' 代', C.limit + ' gens');
    d.querySelector('p').textContent = evoL(C.goal[0], C.goal[1]);
    d.querySelector('.go').textContent = evoL('开始', 'Start'); d.querySelector('.share').textContent = evoL('挑战码', 'Share');
    d.querySelector('.go').addEventListener('click', function () { M.close(); evoStartChallenge(C.id); });
    d.querySelector('.share').addEventListener('click', function () { evoCopy(evoShareLink('tank-challenge=' + C.id), evoL('挑战链接已复制：「' + C.zh + '」' + (st ? '，我拿了 ' + st + ' 颗星' : '') + '，你呢？', 'Challenge link copied.')); });
    M.box.appendChild(d);
  });
}

/* ========== 八、海报：进化史 ========== */
function evoChartOn(x, w, h) {
  var H2 = EVO.hist; if (H2.length < 2) return;
  var last = H2[H2.length - 1], keys = Object.keys(last.c).sort(function (a, b) { return last.c[b] - last.c[a]; }).slice(0, 5);
  var cap2 = Math.max(heads.length, 1), n = H2.length, base = H2.map(function () { return 0; });
  keys.concat(['_rest']).forEach(function (k) {
    var ys = H2.map(function (s, i) { var v = k === '_rest' ? s.n - keys.reduce(function (a, t) { return a + (s.c[t] || 0); }, 0) : (s.c[k] || 0); return base[i] + v; });
    x.beginPath(); ys.forEach(function (v, i) { var px = i / (n - 1) * w, py = h - v / cap2 * (h - 4); if (i) x.lineTo(px, py); else x.moveTo(px, py); });
    for (var i = n - 1; i >= 0; i--) x.lineTo(i / (n - 1) * w, h - base[i] / cap2 * (h - 4));
    x.closePath(); x.fillStyle = k === '_rest' ? 'rgba(150,140,125,.45)' : 'hsla(' + EVO.lineage[k].v.hue + ',55%,55%,.85)'; x.fill(); base = ys;
  });
}
function evoPoster() {
  var c = evoPosterCanvas(); if (!c) return;
  evoPosterSave(c);
}
function evoPosterCanvas() {
  var alive = heads.filter(evoLive);
  if (!alive.length && !EVO.hist.length) { toast(evoL('缸是空的。', 'The tank is empty.'), 1600); return null; }
  var PW = 1080, PH = 1560, c = document.createElement('canvas'); c.width = PW; c.height = PH;
  var x = c.getContext('2d'), serif = '"Noto Serif SC","Songti SC","STSong",serif', sans = 'system-ui,"PingFang SC","Noto Sans SC",sans-serif';
  x.fillStyle = '#f5efe3'; x.fillRect(0, 0, PW, PH);
  x.strokeStyle = '#3a342c'; x.lineWidth = 3; x.strokeRect(28, 28, PW - 56, PH - 56); x.lineWidth = 1; x.strokeRect(40, 40, PW - 80, PH - 80);
  x.fillStyle = '#3a342c'; x.textAlign = 'center';
  x.font = '700 64px ' + serif; x.fillText(evoL('生态缸 · 进化史', 'The evolution tank'), PW / 2, 128);
  var clim = EVO_CLIMATES[EVO.climate], clim2 = EVO.climate2 ? EVO_CLIMATES[EVO.climate2] : null, d = new Date();
  x.font = '400 28px ' + sans; x.fillStyle = '#6a5f52';
  x.fillText(evoL('第 ' + EVO.gen + ' 代 · ' + clim.zh + (clim2 ? ' | ' + clim2.zh : '') + ' · ' + d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate(), 'Generation ' + EVO.gen + ' · ' + clim.en + (clim2 ? ' | ' + clim2.en : '') + ' · ' + d.toISOString().slice(0, 10)), PW / 2, 176);
  /* 舞台快照 */
  var sw = PW - 120, sh = Math.round(sw * cv.height / cv.width); if (sh > 640) { sh = 640; sw = Math.round(sh * cv.width / cv.height); }
  var sx = (PW - sw) / 2, sy = 210;
  try { x.drawImage(cv, sx, sy, sw, sh); } catch (e) {}
  x.strokeStyle = '#3a342c'; x.lineWidth = 2; x.strokeRect(sx, sy, sw, sh);
  var y = sy + sh + 40;
  /* 曲线 */
  x.save(); x.translate(60, y); x.fillStyle = '#ece3d2'; x.fillRect(0, 0, PW - 120, 170); evoChartOn(x, PW - 120, 170); x.restore();
  x.textAlign = 'left'; x.fillStyle = '#6a5f52'; x.font = '400 22px ' + sans; x.fillText(evoL('种群曲线（最近 ' + EVO.hist.length + ' 代）', 'Population (last ' + EVO.hist.length + ' generations)'), 60, y + 200);
  y += 250;
  /* 本缸之最 */
  var counts = {}; alive.forEach(function (h) { var k = evoVariantOf(h).key; counts[k] = (counts[k] || 0) + 1; });
  var topK = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
  var odd = alive.slice().sort(function (a, b) { return evoSpeciesCount(b.g) - evoSpeciesCount(a.g); })[0];
  var old = alive.slice().sort(function (a, b) { return b.evo.age - a.evo.age; })[0];
  var gone = Object.keys(EVO.lineage).filter(function (k) { return EVO.lineage[k].gone; }).length;
  var rowsP = [
    [evoL('最多', 'Most common'), topK ? evoLabel(EVO.lineage[topK].v) + ' ×' + counts[topK] : '—'],
    [evoL('最怪', 'Oddest'), odd ? evoLabel(evoVariantOf(odd)) : '—'],
    [evoL('最长寿', 'Oldest'), old ? evoLabel(evoVariantOf(old)) + evoL('（' + old.evo.age + ' 代）', ' (' + old.evo.age + ' gens)') : '—'],
    [evoL('出现过 / 灭绝', 'Kinds seen / extinct'), Object.keys(EVO.lineage).length + ' / ' + gone]
  ];
  x.font = '700 34px ' + serif; x.fillStyle = '#3a342c'; x.fillText(evoL('本缸之最', 'Records'), 60, y); y += 20;
  rowsP.forEach(function (r) { y += 44; x.font = '400 24px ' + sans; x.fillStyle = '#8a7c6a'; x.fillText(r[0], 60, y); x.font = '500 28px ' + sans; x.fillStyle = '#3a342c'; x.fillText(r[1], 280, y); });
  y += 60;
  x.font = '700 34px ' + serif; x.fillText(evoL('物种志摘抄', 'From the field notes'), 60, y); y += 16;
  var picks = EVO.journal.filter(function (j) { return /new|gone|top|meteor/.test(j.kind); }).slice(0, 3);
  x.font = '400 24px ' + sans; x.fillStyle = '#4a4238';
  picks.forEach(function (j) {
    var t = (evoEn() ? j.en : j.zh), line = '', lines = [];
    for (var i = 0; i < t.length; i++) { var nl = line + t[i]; if (x.measureText(nl).width > PW - 240) { lines.push(line); line = t[i]; } else line = nl; }
    lines.push(line);
    if (y > PH - 190) return;
    y += 38; x.fillStyle = '#8a7c6a'; x.fillText(evoL('第 ' + j.gen + ' 代', 'Gen ' + j.gen), 60, y); x.fillStyle = '#4a4238';
    lines.slice(0, 2).forEach(function (l, i) { x.fillText(l, 170, y + i * 34); }); y += (Math.min(2, lines.length) - 1) * 34;
  });
  x.textAlign = 'center'; x.font = '400 22px ' + sans; x.fillStyle = '#8a7c6a'; x.fillText(evoL('趣像 · 生态缸 —— 投放、繁衍、突变、看谁活下来', 'Qu Xiang · evolution tank — drop, breed, mutate, see who survives'), PW / 2, PH - 70);
  EVO.lastPoster = c;
  return c;
}
function evoPosterSave(c) {
  c.toBlob(function (b) {
    if (!b) { toast(evoL('海报生成失败。', 'Poster failed.'), 2000); return; }
    var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'quxiang-tank-gen' + EVO.gen + '.png'; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    toast(evoL('进化史海报已保存。', 'Evolution poster saved.'), 2200);
  }, 'image/png');
}

/* ========== 九、面板：新增几排 ========== */
UI_PAIRS.push(['分区', 'Split'], ['右半边', 'Right half'], ['天灾', 'Disasters'], ['冰河期', 'Ice age'], ['洪水', 'Flood'], ['彗星', 'Comet'], ['丰年', 'Bumper year'],
  ['进化树', 'Tree'], ['图鉴·成就', 'Book'], ['挑战', 'Challenges'], ['海报', 'Poster'], ['缸码', 'Tank link'], ['导入', 'Import']);
var evoPlusBaseBuild = evoBuildPanel;
evoBuildPanel = function () {
  var fresh = !EVO.panel, p = evoPlusBaseBuild.apply(this, arguments);
  if (!fresh) return p;
  var st = document.createElement('style');
  st.textContent =
    '#evoPanel>*{flex:0 0 auto}#evoPanel .evoPacks{display:flex;gap:3px;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px}#evoPanel .evoPacks button{flex:0 0 auto;min-height:26px;padding:2px 8px;font-size:11px}' +
    '#evoPanel .evoGoal{background:#fff4d8;border:1px solid #e8cf8e;border-radius:10px;padding:6px 8px;font-size:12px}#evoPanel .evoGoal[hidden]{display:none}' +
    '#evoPanel .evoRow.r2[hidden]{display:none}' +
    '#evoModal{position:fixed;inset:0;z-index:62;background:rgba(40,34,26,.4);display:flex;align-items:center;justify-content:center;padding:14px}' +
    '#evoModal .evoMBox{background:#faf6ee;color:#3a342c;border-radius:16px;width:min(980px,100%);max-height:88vh;overflow:auto;padding:12px 16px 16px;box-shadow:0 12px 40px rgba(40,30,20,.3);font:13px/1.5 system-ui,"PingFang SC","Noto Sans SC",sans-serif}' +
    '#evoModal .evoMHead{display:flex;align-items:center;position:sticky;top:-12px;background:inherit;padding:4px 0;z-index:2}#evoModal .evoMHead b{font-size:16px}#evoModal .evoMX{margin-left:auto;border:0;background:none;font-size:22px;min-width:40px;min-height:40px;cursor:pointer;color:inherit}' +
    '#evoModal .evoMNote{opacity:.7;margin:6px 0}#evoModal .evoAxis{font-size:11px;opacity:.6;margin-bottom:4px}' +
    '#evoModal .evoTreeWrap{overflow:auto;border:1px dashed #d8cdb8;border-radius:10px;background:#f4ede0}#evoModal .evoTree{position:relative}' +
    '#evoModal .evoNode{position:absolute;width:64px;display:flex;flex-direction:column;align-items:center;border:0;background:none;padding:0;cursor:pointer;color:inherit;font:inherit}' +
    '#evoModal .evoNode canvas{width:40px;height:40px;border-radius:50%;background:#fff;box-shadow:0 0 0 2px #fffaf0}#evoModal .evoNode span{font-size:10px;line-height:1.2;text-align:center;max-height:2.4em;overflow:hidden}#evoModal .evoNode.gone{opacity:.45}' +
    '#evoModal .evoAch{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:6px}#evoModal .evoAchI{border:1px solid #e3d8c4;border-radius:10px;padding:6px 8px;opacity:.55}#evoModal .evoAchI.on{opacity:1;background:#fff4d8;border-color:#e8cf8e}#evoModal .evoAchI span{display:block;font-size:12px;opacity:.75}' +
    '#evoModal .evoDex{display:grid;grid-template-columns:repeat(auto-fill,minmax(76px,1fr));gap:6px}#evoModal .evoDexI{display:flex;flex-direction:column;align-items:center;border:0;background:none;cursor:pointer;color:inherit;font:inherit;padding:2px}' +
    '#evoModal .evoDexI canvas{width:44px;height:44px;border-radius:50%}#evoModal .evoDexI span{font-size:10px;text-align:center;line-height:1.2}' +
    '#evoModal .evoChal{display:flex;gap:10px;align-items:center;border-top:1px dashed #d8cdb8;padding:8px 0}#evoModal .evoChal>div{flex:1}#evoModal .evoChal em{font-style:normal;color:#b0801f}#evoModal .evoChal p{margin:2px 0;opacity:.8}' +
    '#evoModal button.go,#evoModal button.share,#evoModal .evoMore{font:inherit;font-size:12px;border:1px solid #d3c7b2;background:#fffdf8;border-radius:999px;padding:4px 12px;cursor:pointer;min-height:32px;color:inherit;margin-left:4px}' +
    '@media(max-width:640px){#evoPanel .evoRow.r3{display:flex}#evoModal .evoChal{flex-direction:column;align-items:flex-start}}' +
    '@media(prefers-color-scheme:dark){#evoModal .evoMBox{background:#2d2924;color:#efe7d8}#evoModal .evoTreeWrap{background:#35302a}#evoPanel .evoGoal{background:#4a3f25;border-color:#6a5a30}#evoModal .evoAchI.on{background:#4a3f25}}';
  document.head.appendChild(st);
  var P = p.el, rows = P.querySelectorAll('.evoRow');
  /* 目标条 */
  var goal = document.createElement('div'); goal.className = 'evoGoal'; goal.hidden = true; P.insertBefore(goal, P.children[1]); p.goal = goal;
  evoPackTabs(); evoFillTray();
  /* 气候排后面：分区开关 + 右半边一排 */
  var climRow = rows[1];
  var split = document.createElement('button'); split.type = 'button'; split.textContent = '◧ ' + uiText('分区');
  split.addEventListener('click', function () { if (EVO.climate2) evoSetClimate2(null); else evoSetClimate2(EVO_CLIMATE_ORDER.filter(function (c) { return c !== EVO.climate; })[EVO.climate === 'snow' ? 1 : 0]); });
  climRow.appendChild(split); p.split = split;
  var r2 = document.createElement('div'); r2.className = 'evoRow r2'; r2.hidden = true;
  var lab2 = document.createElement('span'); lab2.className = 'evoLab'; lab2.textContent = uiText('右半边'); r2.appendChild(lab2);
  p.climates2 = {};
  EVO_CLIMATE_ORDER.forEach(function (c) { var C = EVO_CLIMATES[c], b = document.createElement('button'); b.type = 'button'; b.textContent = C.glyph + ' ' + evoL(C.zh, C.en); b.addEventListener('click', function () { EVO.climate2 = c; evoSyncPanel(); }); r2.appendChild(b); p.climates2[c] = b; });
  climRow.parentNode.insertBefore(r2, climRow.nextSibling); p.r2 = r2;
  /* 天灾一排 */
  var r3 = document.createElement('div'); r3.className = 'evoRow r3';
  var lab3 = document.createElement('span'); lab3.className = 'evoLab'; lab3.textContent = uiText('天灾'); r3.appendChild(lab3);
  [['ice', '❄ ' + uiText('冰河期')], ['flood', '🌊 ' + uiText('洪水')], ['comet', '✦ ' + uiText('彗星')], ['feast', '✿ ' + uiText('丰年')]].forEach(function (it) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = it[1]; b.addEventListener('click', function () { evoDisaster(it[0]); }); r3.appendChild(b);
  });
  r2.parentNode.insertBefore(r3, r2.nextSibling);
  /* 底部：进化树 / 图鉴 / 挑战 / 海报 / 缸码 / 导入 */
  var r4 = document.createElement('div'); r4.className = 'evoRow r4';
  [['进化树', evoTreeOpen], ['图鉴·成就', evoDexOpen], ['挑战', evoChallengesOpen], ['海报', evoPoster], ['缸码', evoShareTank], ['导入', evoAskImport]].forEach(function (it) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = uiText(it[0]); b.addEventListener('click', it[1]); r4.appendChild(b);
  });
  var exitRow = rows[rows.length - 1]; P.insertBefore(r4, exitRow);
  return p;
};
var evoPlusBaseSync = evoSyncPanel;
evoSyncPanel = function () {
  evoPlusBaseSync.apply(this, arguments);
  var p = EVO.panel; if (!p || !p.r2) return;
  p.r2.hidden = !EVO.climate2; p.split.classList.toggle('on', !!EVO.climate2);
  Object.keys(p.climates2).forEach(function (k) { p.climates2[k].classList.toggle('on', EVO.climate2 === k); });
  if (p.packRow) Array.prototype.forEach.call(p.packRow.children, function (b) { b.classList.toggle('on', b.dataset.pack === EVO.pack); });
  if (EVO.tool === 'drop' && EVO.pick !== 'random' && !QX_PACKS.isClassic(EVO.pick) && NATURAL_INFO[EVO.pick]) p.blurb.textContent = evoEn() ? (NATURAL_INFO[EVO.pick].en || '') + '' : NATURAL_INFO[EVO.pick].quirk;
  else if (EVO.tool === 'drop' && EVO.pick === 'random' && EVO.pack !== 'classic') { var PK = QX_PACKS.byId[EVO.pack]; if (PK) p.blurb.textContent = evoEn() ? PK.blurb.en : PK.blurb.zh; }
  var X = EVO.challenge;
  if (X && !X.done) { var C = EVO_CHALLENGES.filter(function (q) { return q.id === X.id; })[0]; p.goal.hidden = false; p.goal.textContent = evoL('挑战 · ' + C.zh + '：' + C.goal[0] + '（' + (EVO.gen - X.g0) + ' / ' + C.limit + ' 代）', 'Challenge · ' + C.en + ': ' + C.goal[1] + ' (' + (EVO.gen - X.g0) + ' / ' + C.limit + ')'); }
  else p.goal.hidden = true;
};
/* 神话角色按各自系列的设定上色：缸里一出现神话角色，就暂时关掉全局配色方案（莫兰迪等会把整张画压暗），出缸还原 */
function evoNaturalLook(h) {
  if (!h || !h.g || !h.g.natural || EVO.palSaved) return;
  EVO.palSaved = { palettes: (CFG.palettes || []).slice() };
  if (EVO.palSaved.palettes.length) { CFG.palettes = []; try { applyTheme(); } catch (e) {} }
}
var evoPlusBasePlace = evoPlace;
evoPlace = function (h) { var r = evoPlusBasePlace.apply(this, arguments); evoNaturalLook(h); return r; };
var evoPlusBaseDrop = evoDrop;
evoDrop = function (h) { var r = evoPlusBaseDrop.apply(this, arguments); evoNaturalLook(h); return r; };
var evoPlusBaseExit = evoExit;
evoExit = function () {
  var r = evoPlusBaseExit.apply(this, arguments);
  if (EVO.palSaved) { CFG.palettes = EVO.palSaved.palettes; EVO.palSaved = null; try { applyTheme(); } catch (e) {} }
  var m = document.getElementById('evoModal'); if (m) m.remove();
  return r;
};
/* 进缸时清掉上一轮的扩展状态 */
var evoPlusBaseEnter = evoEnter;
evoEnter = function () { EVO.climate2 = null; EVO.ice = 0; EVO.challenge = null; EVO.streakN = 0; EVO.afterMeteor = null; return evoPlusBaseEnter.apply(this, arguments); };
TRIG.evolve = function () { if (EVO.on) evoExit(); else evoEnter(); };
try {
  Object.assign(window.__evo, { disaster: evoDisaster, split: evoSetClimate2, code: evoExportCode, load: evoImportCode, tree: evoTreeOpen, dex: evoDexOpen, challenges: evoChallengesOpen, challenge: evoStartChallenge, poster: evoPoster, pack: function (id) { EVO.pack = id; evoFillTray(); evoSyncPanel(); }, pick: function (k) { EVO.pick = k; } });
} catch (e) {}
