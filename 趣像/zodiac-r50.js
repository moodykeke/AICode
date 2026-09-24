/* 趣像 27 (r50): 十二生肖 + 剪纸风
   ─────────────────────────────────────────────────────────────
   十二生肖是"经典半身头像"的新物种，不是平面半身画：同一个三维头骨、同一套七个基因座（头、耳、眼、口鼻、毛发、花纹、衣着），
   所以转头、眨眼、所有动作、大合照、卡片、生态缸里的杂交都和猫狗人物一样；和经典物种之间也能互相遗传（牛角猫、龙须狗……）。
   每一只都有一眼能认出来的招牌：
     鼠 大圆耳·尖吻·卷尾        牛 弯角·宽鼻·鼻环        虎 额头"王"字·虎纹·白腮
     兔 长耳·红眼·门牙           龙 鹿角·龙须·火焰鬃·竖瞳   蛇 竖瞳·分叉信子·菱纹·绕颈
     马 长脸·长鬃·额前白星       羊 卷毛·盘角·小胡子        猴 心形脸盘·圆耳·毛尖
     鸡 红冠·肉垂·金颈羽         狗 竖耳·眉上两点·卷尾      猪 大垂耳·圆鼻·一撮毛
   胸前一枚红底圆章写着本命字。
   种子：0x5A0D0000 起的 65536 个种子留给生肖（序号 % 12 = 第几位），随机种子落进来的机会是六万五千分之一——偶尔会自己冒出一只。
   剪纸风（画风 papercut）：纸就是颜色——毛色一律是红纸，小块浅色（白腮、鼻头、腮红、内耳）剪空露出底纸，
   黄色成金纸、蓝绿成青纸（套色），墨色成深红；轮廓是深红刀线，细线是剪开的缝；脸颊剪三道月牙纹，下巴一圈锯齿纹。
   任何角色都能用剪纸风画；"十二生肖"场景默认就是剪纸。 */

var ZBASE = 0x5A0D0000;
var ZOD = [
  { k: 'z_rat', ch: '鼠', zh: '子鼠', en: 'Rat', furs: ['#9d948a', '#b9b3aa', '#8a7d70', '#c9bfb2'],
    traits: [['圆圆大耳', '尖鼻长须', '细长卷尾'], ['big round ears', 'pointed whiskery nose', 'a long curling tail']],
    quirk: ['排在十二生肖第一位——据说是趴在牛背上过河，最后一步跳过了终点。', 'First of the twelve — rode across the river on the Ox and hopped over the line.'] },
  { k: 'z_ox', ch: '牛', zh: '丑牛', en: 'Ox', furs: ['#6b4a36', '#3f3431', '#a8784f', '#8a5a3a'],
    traits: [['一对弯角', '宽鼻与鼻环', '横着的耳朵'], ['a pair of curved horns', 'a broad nose with a ring', 'sideways ears']],
    quirk: ['一步一个脚印。过河时让老鼠搭了便车，到现在也不计较。', 'Steady, step by step. Gave the Rat a lift and still doesn’t mind.'] },
  { k: 'z_tiger', ch: '虎', zh: '寅虎', en: 'Tiger', furs: ['#e8893a', '#e59a4c', '#d9a441'],
    traits: [['额头一个"王"字', '一身虎纹', '白色腮毛'], ['王 (king) on its brow', 'bold stripes', 'white cheek ruff']],
    quirk: ['额头上天生一个"王"字，其实最怕别人摸它的胡子。', 'Born with 王 on its brow; secretly ticklish about its whiskers.'] },
  { k: 'z_rabbit', ch: '兔', zh: '卯兔', en: 'Rabbit', furs: ['#f3ede3', '#efe7da', '#d9c9b8', '#b9a08a'],
    traits: [['长长双耳', '红宝石眼睛', '三瓣嘴与门牙'], ['long ears', 'ruby eyes', 'a split lip and buck teeth']],
    quirk: ['从月亮上借来一双红眼睛。跑得快，也最会装作没在跑。', 'Ruby eyes borrowed from the moon. Fast, and best at pretending not to hurry.'] },
  { k: 'z_dragon', ch: '龙', zh: '辰龙', en: 'Dragon', furs: ['#3f8f7a', '#c8453a', '#d9a441', '#4a78a8'],
    traits: [['鹿角似的龙角', '两条飘飘龙须', '火焰鬃毛与竖瞳'], ['antler-like horns', 'two flowing barbels', 'a flame mane and slit eyes']],
    quirk: ['本可以第一个到，路上停下来给一个村子下了场雨。', 'Could have come first, but stopped to bring rain to a thirsty village.'] },
  { k: 'z_snake', ch: '蛇', zh: '巳蛇', en: 'Snake', furs: ['#7fa35a', '#5f8f6e', '#b88b4a', '#c9b35a'],
    traits: [['竖瞳金眼', '分叉的信子', '菱形花纹，盘在颈上'], ['golden slit eyes', 'a forked tongue', 'diamond scales, coiled at the neck']],
    quirk: ['悄悄盘在马蹄上过了河，最后一刻滑到了马前面。', 'Coiled on the Horse’s hoof, then slid ahead at the last moment.'] },
  { k: 'z_horse', ch: '马', zh: '午马', en: 'Horse', furs: ['#8b5a3c', '#c49a6c', '#3a302c', '#e8e0d2'],
    traits: [['长脸长鬃', '额前一道白星', '竖起的尖耳'], ['a long face and mane', 'a white blaze', 'pricked ears']],
    quirk: ['冲线前被蛇吓了一跳，从此总是先看看脚下。', 'Startled by the Snake at the finish; now always checks its hooves first.'] },
  { k: 'z_goat', ch: '羊', zh: '未羊', en: 'Goat', furs: ['#efe7da', '#e8dcc6', '#d9cbb4'],
    traits: [['卷卷羊毛', '一对盘角', '小山羊胡'], ['curly wool', 'curled horns', 'a little goatee']],
    quirk: ['和猴子、鸡一起扎木筏过河，是筏上最稳重的那一位。', 'Built a raft with the Monkey and the Rooster; the calmest one aboard.'] },
  { k: 'z_monkey', ch: '猴', zh: '申猴', en: 'Monkey', furs: ['#8b5e3c', '#a8784f', '#c9a47c'],
    traits: [['心形脸盘', '一对圆耳', '头顶机灵的毛尖'], ['a heart-shaped face', 'round side ears', 'a cheeky tuft']],
    quirk: ['木筏上负责拨开水草，一刻也停不下来。', 'Cleared the weeds from the raft. Cannot sit still for a moment.'] },
  { k: 'z_rooster', ch: '鸡', zh: '酉鸡', en: 'Rooster', furs: ['#f3ede3', '#e8a24a', '#c8663a'],
    traits: [['大红鸡冠', '一对肉垂', '金色颈羽'], ['a red comb', 'wattles', 'golden hackles']],
    quirk: ['在木筏上第一个望见岸，把大家领了过去。每天早上还在报时。', 'Spotted the shore from the raft and led them in. Still calls the hour each morning.'] },
  { k: 'z_dog', ch: '狗', zh: '戌狗', en: 'Dog', furs: ['#d9a05a', '#c98a4a', '#ece0cc', '#3c3331'],
    traits: [['一对竖耳', '眉上两点', '卷卷尾巴'], ['pricked ears', 'two brow dots', 'a curled tail']],
    quirk: ['在河里玩水玩得太开心，差点忘了比赛。', 'Had so much fun splashing in the river it nearly forgot the race.'] },
  { k: 'z_pig', ch: '猪', zh: '亥猪', en: 'Pig', furs: ['#f1b3aa', '#e8a8a0', '#3c3331', '#caa28f'],
    traits: [['一对大垂耳', '圆圆的鼻子', '头顶一撮毛'], ['big floppy ears', 'a round snout', 'a tuft on top']],
    quirk: ['路上吃了顿饭、睡了一觉，最后一个到——但是到了。', 'Stopped for a meal and a nap, arrived last — but arrived.'] }
];
var ZOD_KEYS = ZOD.map(function (z) { return z.k; }), ZOD_IDX = {};
ZOD.forEach(function (z, i) { ZOD_IDX[z.k] = i; });
var ZCLOTH = ['#b8423a', '#c85d4b', '#2f5d62', '#d9a441', '#3d4a66', '#6ea17b'];

/* ========== 一、基因：新物种的七个基因座 ========== */
function zodSeed(i, seed) { return (ZBASE + i + 12 * (hashInt(seed >>> 0, 31) % 400)) >>> 0; }
function zodOf(seed) { var off = ((seed >>> 0) - ZBASE) >>> 0; return off < 0x10000 ? off % 12 : -1; }
MOD_KEYS.skull.push('zod', 'ztail');
MOD_KEYS.ears.push('horns');
MOD_KEYS.eyes.push('slit');
MOD_KEYS.snout.push('zsnout');
MOD_KEYS.hair.push('mane', 'comb');
MOD_KEYS.marks.push('zmark');
MOD_KEYS.style.push('zbadge');

function zodiacGenes(g, i, r) {
  var Z = ZOD[i], pick = function (a) { return a[(r() * a.length) | 0]; };
  Object.assign(g, {
    sp: Z.k, zod: i + 1, hair: 'none', sideEars: false, brows: false, eyeStyle: 'animal', mouth: 'w', nose: 'ink',
    eyeR: .074 + r() * .02, eyeSep: .40 + r() * .04, eyeV: .10 + r() * .04, chin: .12, blush: r() < .7, glasses: 'none',
    openIdle: 0, smileIdle: .45 + r() * .45, freckles: false, stubble: false, mustache: false, beard: false, mole: false, lines: false, earring: false,
    topEars: null, muzzle: null, whiskers: false, fluff: 0, bib: null, stripes: false, teeth: false, tongue: false, beak: null, antenna: 0,
    box: false, bolts: false, seams: false, tuft: false, feathers: false, frog: false, earCol: null, inner: PINK, tipCol: null, disc: null, iris: null,
    wide: 1, tall: .94, fur: pick(Z.furs), cloth: pick(ZCLOTH), collar: 'round',
    horns: null, slit: false, zsnout: null, mane: null, comb: false, zmark: null, ztail: null, zbadge: Z.ch
  });
  switch (Z.k) {
    case 'z_rat':
      g.topEars = { shape: 'round', u: .80, v: .62, len: .74, wid: .34 }; g.inner = '#e9a9a0';
      g.muzzle = { v: -.22, a: .15, b: .12, c: .52, col: null }; g.nose = 'pink'; g.whiskers = true; g.teeth = true;
      g.wide = .94; g.tall = .88; g.chin = .30; g.ztail = 'rat'; g.eyeR = .07;
      break;
    case 'z_ox':
      g.topEars = { shape: 'tri', u: 1.30, v: .30, len: .40, wid: .19 }; g.inner = '#e7c3a8';
      g.muzzle = { v: -.34, a: .36, b: .22, c: .30, col: '#e7c3a8', snout: true }; g.nose = 'snout';
      g.wide = 1.2; g.tall = .92; g.chin = .05; g.horns = 'ox'; g.zsnout = 'ring'; g.zmark = 'curl';
      break;
    case 'z_tiger':
      g.topEars = { shape: 'round', u: .58, v: .78, len: .38, wid: .2 }; g.nose = 'cat'; g.whiskers = true; g.stripes = true; g.bib = '#fbf6ee';
      g.wide = 1.14; g.tall = .92; g.fluff = 1.3; g.mouthV = -.38; g.inner = '#f3e3cf'; g.zmark = 'wang'; g.earCol = null;
      break;
    case 'z_rabbit':
      g.topEars = { shape: 'long', u: .26, v: .95, len: 1.12, wid: .18 }; g.inner = '#eba5a2';
      g.muzzle = { v: -.28, a: .20, b: .15, c: .12, col: null }; g.nose = 'pink'; g.teeth = true; g.whiskers = true;
      g.eyeStyle = 'iris'; g.iris = '#c8323a'; g.wide = .98; g.tall = .94;
      break;
    case 'z_dragon':
      g.topEars = { shape: 'tri', u: 1.05, v: .42, len: .34, wid: .14 }; g.inner = null;
      g.muzzle = { v: -.30, a: .30, b: .20, c: .55, col: null, snout: true }; g.nose = 'snout';
      g.eyeStyle = 'iris'; g.iris = '#e9b43a'; g.slit = true; g.eyeR = .085; g.eyeSep = .42; g.eyeV = .16;
      g.horns = 'antler'; g.mane = 'dragon'; g.zsnout = 'barbels'; g.zmark = 'scales'; g.wide = 1.06; g.tall = .98; g.chin = .08;
      g.muzzle.col = mixHex(g.fur, '#f6efd8', .45);
      break;
    case 'z_snake':
      g.eyeStyle = 'iris'; g.iris = '#e2c23a'; g.slit = true; g.eyeR = .08; g.eyeSep = .44; g.eyeV = .14;
      g.mouth = 'frog'; g.nose = 'none'; g.zsnout = 'tongue'; g.zmark = 'diamond'; g.ztail = 'coil';
      g.eyeSep = .50; g.eyeV = .22; g.wide = 1.12; g.tall = .80; g.chin = .40; g.blush = false;
      break;
    case 'z_horse':
      g.topEars = { shape: 'tri', u: .50, v: .92, len: .50, wid: .15 }; g.inner = '#c99078';
      g.muzzle = { v: -.46, a: .30, b: .24, c: .34, col: null, snout: true }; g.nose = 'snout';
      g.muzzle.col = mixHex(g.fur, g.fur === '#e8e0d2' ? '#b9a08a' : '#f3e6d6', .45);
      g.wide = .86; g.tall = 1.16; g.chin = .18; g.eyeSep = .46; g.eyeV = .18;
      g.mane = 'horse'; g.zmark = 'blaze';
      break;
    case 'z_goat':
      g.hair = 'curly'; g.hairCol = mixHex(g.fur, '#ffffff', .25); g.hairV = .55; g.nape = -.2; g.peak = 0; g.part = 0; g.puff = .06;
      g.topEars = { shape: 'flop', u: 1.20, v: .22, len: .42, wid: .15 }; g.earCol = mixHex(g.fur, '#b9a08a', .35);
      g.muzzle = { v: -.30, a: .20, b: .16, c: .26, col: '#f6efe4' }; g.nose = 'ink';
      g.horns = 'ram'; g.zmark = 'goatee'; g.wide = .98; g.tall = .98; g.chin = .22; g.eyeSep = .44;
      break;
    case 'z_monkey':
      g.sideEars = true; g.ears = .17; g.zmark = 'monkey';
      g.muzzle = { v: -.30, a: .26, b: .18, c: .22, col: '#f0d2b4' }; g.nose = 'ink';
      g.eyeSep = .30; g.eyeV = .12; g.tuft = true; g.wide = 1.02; g.tall = .96;
      break;
    case 'z_rooster':
      g.beak = { kind: 'chick', col: '#e8a23a' }; g.mouth = 'beak'; g.nose = 'none'; g.feathers = true;
      g.comb = true; g.mane = 'hackle'; g.zsnout = 'wattle'; g.eyeR = .065; g.wide = 1.0; g.tall = .98; g.fluff = .5;
      break;
    case 'z_dog':
      g.topEars = { shape: 'tri', u: .60, v: .80, len: .50, wid: .26 }; g.inner = '#f0c9a8';
      g.muzzle = { v: -.24, a: .28, b: .20, c: .40, col: g.fur === '#3c3331' ? '#d9a05a' : '#f4ead9' };
      g.bib = g.fur === '#3c3331' ? '#d9a05a' : '#fbf6ee'; g.tongue = r() < .5; g.openIdle = g.tongue ? .35 : 0;
      g.zmark = 'dots'; g.ztail = 'curl'; g.wide = 1.04; g.tall = .94;
      break;
    case 'z_pig':
      g.topEars = { shape: 'flop', u: .64, v: .74, len: .62, wid: .26 }; g.earCol = mixHex(g.fur, '#8a5a3a', .12);
      g.muzzle = { v: -.18, a: .26, b: .18, c: .16, col: mixHex(g.fur, '#c46a62', .25), snout: true }; g.nose = 'snout';
      g.wide = 1.2; g.tall = .9; g.chin = .02; g.tuft = true; g.blush = true; g.inner = '#e38e87';
      break;
  }
}
var zBaseGenes = baseGenes;
baseGenes = function (seed) {
  var g = zBaseGenes(seed), i = zodOf(seed);
  if (i >= 0 && !g.zod) zodiacGenes(g, i, mulberry32(((seed >>> 0) ^ 0x9e3779b9) >>> 0));
  return g;
};
function zodPure(g) { return !!(g && !g.natural && g.zod && g.dna && g.dna.slice(0, 7).every(function (s) { return zodOf(s) === g.zod - 1; })); }

/* ========== 二、名字、图鉴、角色包、生态缸 ========== */
ZOD.forEach(function (Z, i) {
  SPNAME[Z.k] = Z.en.toLowerCase(); FURS[Z.k] = Z.furs.slice(); SP_RARITY[Z.k] = 2; TITLES[Z.k] = [''];
  NATURAL_INFO[Z.k] = { name: Z.zh, en: 'Zodiac ' + Z.en, family: '十二生肖', col: Z.furs, traits: Z.traits[0].slice(), quirk: Z.quirk[0], support: 'zodiac' };
  if (typeof CARDZH_SP !== 'undefined') CARDZH_SP[Z.k] = Z.zh;
  if (typeof CARDZH_TITLE !== 'undefined') CARDZH_TITLE[Z.k] = [''];
  if (typeof EVO_NOUN !== 'undefined') { EVO_NOUN[Z.k] = [Z.ch, Z.en.toLowerCase()]; EVO_FULL[Z.k] = ['生肖' + Z.ch, 'zodiac ' + Z.en.toLowerCase()]; }
  if (typeof SPECIES_CATALOG !== 'undefined' && SPECIES_CATALOG.indexOf(Z.k) < 0) SPECIES_CATALOG.push(Z.k);
  if (typeof UI_PAIRS !== 'undefined') UI_PAIRS.push([Z.zh, 'Zodiac ' + Z.en]);
});
if (typeof EVO_PARTS !== 'undefined') {
  Object.assign(EVO_PARTS.ears, { z_ox: ['牛角', 'horned'], z_dragon: ['龙角', 'antlered'], z_goat: ['盘角', 'ram-horned'], z_rat: ['鼠耳', 'round-eared'], z_rabbit: ['兔耳', 'long-eared'], z_horse: ['马耳', 'horse-eared'], z_pig: ['大垂耳', 'lop-eared'], z_dog: ['竖耳', 'prick-eared'], z_tiger: ['虎耳', 'tiger-eared'] });
  Object.assign(EVO_PARTS.eyes, { z_dragon: ['龙睛', 'dragon-eyed'], z_snake: ['蛇瞳', 'slit-eyed'], z_rabbit: ['红眼', 'ruby-eyed'] });
  Object.assign(EVO_PARTS.snout, { z_dragon: ['龙须', 'barbelled'], z_ox: ['鼻环', 'nose-ringed'], z_snake: ['信子', 'fork-tongued'], z_rooster: ['肉垂', 'wattled'], z_pig: ['猪鼻', 'pig-snouted'], z_horse: ['马吻', 'horse-muzzled'], z_rat: ['鼠须', 'whiskery'], z_monkey: ['猴吻', 'monkey-muzzled'] });
}
UI_PAIRS.push(['十二生肖', 'Chinese zodiac'], ['剪纸', 'Paper-cut']);

var zAtlasDNA = atlasDNA;
atlasDNA = function (kind, seed, donor) {
  if (ZOD_IDX[kind] != null) return pureDNA(zodSeed(ZOD_IDX[kind], seed == null ? randSeed() : seed));
  return zAtlasDNA.apply(this, arguments);
};
var zPackDNA = QX_PACKS.dna;
QX_PACKS.dna = function (key, seed) { if (ZOD_IDX[key] != null) return atlasDNA(key, seed == null ? randSeed() : seed); return zPackDNA.apply(this, arguments); };
QX_PACKS.register({ id: 'zodiac', zh: '十二生肖', en: 'Chinese zodiac', cover: 'z_dragon', tags: ['classic', 'zodiac'], members: ZOD_KEYS.slice(),
  blurb: { zh: '鼠牛虎兔龙蛇马羊猴鸡狗猪——和经典头像一个规格，七个基因座全开，能和猫狗人物互相遗传。默认剪纸风。',
    en: 'Rat to Pig — built like the classic heads, all seven loci open, and they interbreed with cats, dogs and people. Paper-cut by default.' },
  evolve: { genes: 'full', climate: { temperate: .1 } } });
var zCatOf = catOf;
catOf = function (sp) { return ZOD_IDX[sp] != null ? 'animal' : zCatOf(sp); };

/* 纯种生肖的卡片：物种、特征、来历按生肖写（中英文各一套）；杂交的仍按原规则拼 */
var zIdentity = identity;
identity = function (g) {
  var id = zIdentity.apply(this, arguments);
  if (!zodPure(g)) return id;
  var Z = ZOD[g.zod - 1], zh = typeof UI_LANG === 'undefined' || UI_LANG !== 'en';
  id.species = zh ? '十二生肖 · ' + Z.zh : 'Zodiac ' + Z.en;
  id.traits = Z.traits[zh ? 0 : 1].slice();
  var bio = typeof CARD_BIO !== 'undefined' ? CARD_BIO[encodeDNA(g.dna.slice(0, 7))] : null;
  if (!bio) id.quirk = Z.quirk[zh ? 0 : 1];
  id.tier = Math.max(id.tier, 2);
  return id;
};

/* ========== 三、画法：生肖的招牌 ========== */
function zP(h, x, y, z) { var q = h.P({ x: x, y: y, z: z }); return [q.x, q.y, q.z]; }
function zAdd(p, dx, dy, dz) { return { x: p.x + dx, y: p.y + dy, z: p.z + dz }; }
function zPath(h, list) { return list.map(function (p) { var q = h.P(p); return [q.x, q.y]; }); }
function zPaint(P, col, seed, w) { knock(P, seed, .006); wash(P, col, seed + 1, 1, .012); stroke(P, { close: true, w: w || 1.05, jit: .006, seed: seed + 2 }); }
function zBands(path, w0, w1, n, seed, alpha) {
  var e = tubeEdges(path, w0, w1), m = path.length;
  for (var i = 1; i <= n; i++) {
    var j = Math.min(m - 1, Math.round(i * (m - 1) / (n + 1)));
    stroke([e.L[j], e.R[j]], { w: .75, jit: .004, seed: seed + i, alpha: alpha || .5 });
  }
}
/* 角：在头的局部三维空间里定路径，再投影——转头时自然跟着转 */
function zHorn(h, sgn) {
  var g = h.g, kind = g.horns, col = kind === 'antler' ? '#ecd6a4' : kind === 'ram' ? '#c9ae86' : '#efe3c8', seed = g.seed + 700 + (sgn > 0 ? 40 : 0), p0, pts, path;
  if (kind === 'ox') {
    p0 = sph(sgn * .60, .92);
    pts = [p0, zAdd(p0, sgn * .26, .03, 0), zAdd(p0, sgn * .52, -.08, .02), zAdd(p0, sgn * .66, -.32, .05), zAdd(p0, sgn * .60, -.56, .08)];
    path = zPath(h, pts); tube(path, .10, .018, col, seed, .004); zBands(path, .10, .018, 2, seed + 9, .45);
    var tip = path.slice(-2); fill([tip[0], tip[1], [tip[1][0] - sgn * .02, tip[1][1] + .04]], { color: '#6d5a44', jit: .002, alpha: .5 });
  } else if (kind === 'antler') {
    p0 = sph(sgn * .40, 1.08);
    pts = [p0, zAdd(p0, sgn * .10, -.28, -.04), zAdd(p0, sgn * .24, -.56, -.06), zAdd(p0, sgn * .42, -.80, -.08)];
    path = zPath(h, pts); tube(path, .07, .02, col, seed, .004);
    var b1 = zPath(h, [pts[1], zAdd(pts[1], sgn * .20, -.08, 0), zAdd(pts[1], sgn * .34, -.20, 0)]); tube(b1, .045, .014, col, seed + 3, .004);
    var b2 = zPath(h, [pts[2], zAdd(pts[2], -sgn * .04, -.18, 0), zAdd(pts[2], -sgn * .02, -.34, 0)]); tube(b2, .04, .012, col, seed + 6, .004);
  } else if (kind === 'ram') {
    var c = zAdd(sph(sgn * 1.02, .62), sgn * .10, .06, -.04), list = [];
    for (var i = 0; i <= 16; i++) { var t = i / 16, a = -2.0 + t * 4.6, r = .30 - .19 * t; list.push(zAdd(c, sgn * r * Math.cos(a), r * Math.sin(a), 0)); }
    path = zPath(h, list); tube(path, .11, .035, col, seed, .004); zBands(path, .11, .035, 6, seed + 9, .4);
  }
}
function zHornFront(h, sgn) { if (h.g.horns !== 'ram') return false; var q = h.P(sph(sgn * 1.02, .62)); return q.z > -.05; }
/* 沿头的轮廓长出一圈鬃（火焰、长鬃、颈羽） */
function zManePoly(h, t0, t1, n, L, shape, seed) {
  var inner = [], outer = [], i, P0, t, p, nx, ny, l;
  for (i = 0; i <= n; i++) {
    t = t0 + (t1 - t0) * i / n; p = h.silPt(t); l = Math.hypot(p[0], p[1]) || 1; nx = p[0] / l; ny = p[1] / l;
    inner.push([p[0] * .86, p[1] * .86]);
    if (i < n) {
      var tm = t0 + (t1 - t0) * (i + .5) / n, pm = h.silPt(tm), lm = Math.hypot(pm[0], pm[1]) || 1, mx = pm[0] / lm, my = pm[1] / lm;
      var len = L * (.72 + .5 * hash2(seed, i)) * (shape === 'horse' ? (1 + .9 * i / n) : 1);
      var bend = shape === 'dragon' ? .35 : shape === 'horse' ? .0 : .15, dx = mx - my * bend * (mx < 0 ? -1 : 1), dy = my + (shape === 'horse' ? 1.1 : shape === 'hackle' ? .35 : -.05);
      var dl = Math.hypot(dx, dy) || 1;
      outer.push([p[0] * .98, p[1] * .98]);
      outer.push([pm[0] + dx / dl * len, pm[1] + dy / dl * len]);
    } else outer.push([p[0] * .98, p[1] * .98]);
  }
  return outer.concat(inner.reverse());
}
function zDrawMane(h) {
  var g = h.g, kind = g.mane, col;
  if (kind === 'dragon') {
    col = { '#3f8f7a': '#d9573f', '#c8453a': '#e9a23a', '#d9a441': '#c8453a', '#4a78a8': '#e0b04a' }[g.fur] || '#d9573f';
    zPaint(zManePoly(h, -.28 * Math.PI, 1.28 * Math.PI, 13, .30, 'dragon', g.seed + 31), col, g.seed + 720, 1.1);
  } else if (kind === 'horse') {
    col = g.fur === '#e8e0d2' ? '#b9a08a' : g.fur === '#c49a6c' ? '#5b4131' : '#2a2320';
    var side = Math.sin(h.yaw) > .05 ? -1 : 1, t0 = side > 0 ? .40 * Math.PI : .60 * Math.PI, t1 = side > 0 ? 1.30 * Math.PI : -.30 * Math.PI;
    var P = zManePoly(h, t0, t1, 7, .22, 'horse', g.seed + 37);
    zPaint(P, col, g.seed + 724, 1.1);
  } else if (kind === 'hackle') {
    col = g.fur === '#c8663a' ? '#e8a23a' : g.fur === '#e8a24a' ? '#c8663a' : '#e8b04a';
    zPaint(zManePoly(h, 1.02 * Math.PI, 1.98 * Math.PI, 12, .30, 'hackle', g.seed + 41), col, g.seed + 728, 1.0);
  }
}
function zDrawComb(h) {
  var g = h.g, T = h.S(0, 1.42), sw = clamp(Math.cos(h.yaw), .45, 1);
  [[-.17, -.10, .11], [0, -.20, .14], [.17, -.12, .115]].forEach(function (c, i) {
    zPaint(ring(T.x + c[0] * sw, T.y + c[1], c[2] * sw + .02, c[2], 14), '#d8453a', g.seed + 740 + i * 3, 1.0);
  });
}
function zDrawTail(h) {
  var g = h.g, t = performance.now() / 1000 + g.idlePhase, sw = Math.sin(t * 1.3) * .05, path = [], i;
  if (g.ztail === 'rat') {
    for (i = 0; i <= 14; i++) { var u = i / 14; path.push([1.0 + .38 * u + Math.sin(u * 3.2) * .08 + sw * u, 1.46 - 1.05 * u + Math.sin(u * 6) * .04]); }
    var e = path[path.length - 1]; for (i = 1; i <= 6; i++) { var a = i / 6 * 4.2; path.push([e[0] - .1 + Math.cos(a) * .1, e[1] - Math.sin(a) * .1]); }
    tube(path, .04, .012, '#e9a9a0', g.seed + 760, .003);
  } else if (g.ztail === 'curl') {
    var c = [1.12 + sw * .5, 1.08];
    for (i = 0; i <= 18; i++) { var a2 = -1.2 + i / 18 * 5.4, r = .26 - .15 * i / 18; path.push([c[0] + Math.cos(a2) * r, c[1] - Math.sin(a2) * r]); }
    tube(path, .10, .05, g.fur, g.seed + 764, .004);
  }
}
function zDrawCoil(h) {
  var g = h.g, top = RY * g.tall * .82, cy = top + .30, path = [], i, col = g.fur;
  for (i = 0; i <= 20; i++) { var a = i / 20 * Math.PI; path.push([Math.cos(a) * .46 * g.wide, cy + Math.sin(a) * .11]); }
  tube(path, .085, .085, col, g.seed + 770, .004);
  for (i = 2; i < 20; i += 3) { var p = path[i]; wash(ring(p[0], p[1], .035, .028, 8), mixHex(col, '#2a2420', .35), g.seed + 771 + i, .9); }
  var tail = [[-.46 * g.wide, cy], [-.62, cy + .10], [-.74, cy + .26], [-.70, cy + .40]];
  tube(tail, .07, .02, col, g.seed + 790, .004);
}
function zDrawBadge(h) {
  var g = h.g, x = -.66, y = 1.47, R = .13;
  zPaint(ring(x, y, R, R, 20), '#c8453a', g.seed + 800, 1.0);
  stroke(ring(x, y, R * .78, R * .78, 18), { close: true, w: .7, jit: .002, seed: g.seed + 803, color: '#e0b04a', alpha: .9 * GALPHA });
  ctx.save(); ctx.translate(x, y + .006); ctx.scale(.01, .01);
  ctx.globalAlpha = GALPHA; ctx.fillStyle = STYLE === 'papercut' ? paperFill() : '#fbf3de';
  ctx.font = '600 17px "Songti SC","Noto Serif SC","STSong",serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(g.zbadge, 0, 0); ctx.restore(); ctx.globalAlpha = 1;
}
/* 皮毛上的花纹：先于眼睛画 */
function zDrawMark(h, o) {
  var g = h.g, k = g.zmark, f = clamp(Math.cos(h.yaw), .1, 1), i, S = function (u, v) { var q = h.S(u, v); return [q.x, q.y, q.z]; };
  if (k === 'wang') {
    var th = .032, rows = [[.20, 1.02], [.15, .84], [.21, .66]];
    rows.forEach(function (r, j) { var a = S(-r[0], r[1]), b = S(r[0], r[1]); if (a[2] > .05 && b[2] > .05) fill([[a[0], a[1] - th], [b[0], b[1] - th], [b[0], b[1] + th], [a[0], a[1] + th]], { jit: .006, seed: g.seed + 810 + j, alpha: .85 }); });
    var v0 = S(0, 1.02), v1 = S(0, .66); if (v0[2] > .05) fill([[v0[0] - th * f, v0[1]], [v0[0] + th * f, v0[1]], [v1[0] + th * f, v1[1]], [v1[0] - th * f, v1[1]]], { jit: .006, seed: g.seed + 814, alpha: .85 });
  } else if (k === 'blaze') {
    var bl = [S(-.08, 1.02), S(.08, 1.02), S(.05, .45), S(.10, .05), S(.07, -.25), S(-.07, -.25), S(-.10, .05), S(-.05, .45)];
    if (bl[0][2] > 0) { var P = bl.map(function (q) { return [q[0], q[1]]; }); knock(P, g.seed + 820, .006); wash(P, '#f7f1e6', g.seed + 821, 1); }
  } else if (k === 'scales') {
    for (i = 0; i < 7; i++) {
      var u = (i % 4 - 1.5) * .16 + (i >= 4 ? .08 : 0), v = i < 4 ? .95 : .78, c = S(u, v);
      if (c[2] < .1) continue;
      stroke([[c[0] - .06 * f, c[1]], [c[0], c[1] + .05], [c[0] + .06 * f, c[1]]], { w: .8, jit: .004, seed: g.seed + 830 + i, alpha: .55 });
    }
  } else if (k === 'diamond') {
    var dk = mixHex(g.fur, '#2a2420', .4);
    [[0, 1.25], [0, 1.0], [0, .75], [-.42, .9], [.42, .9]].forEach(function (d, j) {
      var c = S(d[0], d[1]), l = S(d[0] - .13, d[1]), r = S(d[0] + .13, d[1]), t = S(d[0], d[1] + .11), b = S(d[0], d[1] - .11);
      if (c[2] < .05) return;
      var P = [[t[0], t[1]], [r[0], r[1]], [b[0], b[1]], [l[0], l[1]]];
      wash(P, dk, g.seed + 840 + j, .95); stroke(P, { close: true, w: .7, jit: .004, seed: g.seed + 845 + j, alpha: .5 });
    });
  } else if (k === 'dots') {
    var dc = g.fur === '#3c3331' ? '#d9a05a' : mixHex(g.fur, '#5b4131', .45);
    for (i = 0; i < 2; i++) { var e = h.eyeInfo(i), d2 = S(e.u * .95, g.eyeV + .22); if (d2[2] < .1) continue; var P2 = ring(d2[0], d2[1], .05 * e.f + .01, .035, 10); if (g.fur === '#3c3331') knock(P2, g.seed + 850 + i, .004); wash(P2, dc, g.seed + 852 + i, 1); }
  } else if (k === 'monkey') {
    var pts = [];
    for (i = 0; i < 40; i++) {
      var tt = i / 40 * TAU, hx = 16 * Math.pow(Math.sin(tt), 3), hy = 13 * Math.cos(tt) - 5 * Math.cos(2 * tt) - 2 * Math.cos(3 * tt) - Math.cos(4 * tt);
      var q = h.S(hx / 17 * .62, -.04 + (hy + 2) / 17 * .52); pts.push([q.x, q.y]);
    }
    knock(pts, g.seed + 860, .006); wash(pts, '#f0d2b4', g.seed + 861, 1); stroke(pts, { close: true, w: .8, jit: .006, seed: g.seed + 862, alpha: .5 });
  } else if (k === 'curl') {
    var cc = S(0, .98); if (cc[2] > .1) for (i = 0; i < 3; i++) stroke(ring(cc[0] + (i - 1) * .09 * f, cc[1] + (i === 1 ? -.03 : 0), .045, .04, 9, i), { close: true, w: .8, jit: .004, seed: g.seed + 870 + i, alpha: .7 });
  }
}
/* 脸前面的东西：龙须、鼻环、信子、肉垂、马的额发、羊胡子 */
function zDrawFront(h, o) {
  var g = h.g, yaw = h.yaw, f = clamp(Math.cos(yaw), .1, 1), now = performance.now() / 1000, i;
  if (Math.cos(yaw) < -.1) return;
  var M = g.muzzle ? h.muzzleShape(g.muzzle) : null;
  if (g.zsnout === 'barbels' && M) {
    for (i = 0; i < 2; i++) {
      var sg = i ? 1 : -1, a = h.P({ x: sg * g.muzzle.a * .75, y: M.cy - .02, z: M.cz + g.muzzle.c * .55 }), sway = Math.sin(now * 1.6 + i * 1.7 + g.idlePhase) * .06;
      var path = []; for (var j = 0; j <= 14; j++) { var u = j / 14; path.push([a.x + sg * (.78 * u - .12 * u * u * u) * (.6 + .4 * f), a.y + .30 * Math.sin(u * Math.PI * .95) - .22 * u * u * u + Math.sin(u * 5 + now * 2 + i) * .04 * u + sway * u]); }
      tube(path, .026, .008, mixHex(g.fur, '#f6efd8', .3), g.seed + 880 + i, .003);
    }
  } else if (g.zsnout === 'ring' && M) {
    var rc = [M.c.x + Math.sin(yaw) * g.muzzle.c * .9, M.c.y + g.muzzle.b * .78];
    stroke(ring(rc[0], rc[1], .085 * Math.max(.5, f), .075, 16), { close: true, w: 2.1, jit: .003, seed: g.seed + 885, color: '#d6a23a' });
  } else if (g.zsnout === 'tongue') {
    var cyc = (now + g.idlePhase) % 2.4, out = o.mouth > .15 ? 1 : cyc < 1.1 ? Math.min(1, bump(cyc / 1.1) * 1.6) : 0;
    if (out > .05) {
      var m = h.S(0, -.34), L = .30 * out, tx = m.x + Math.sin(yaw) * .1, w0 = .022;
      var T = [[tx - w0, m.y], [tx + w0, m.y], [tx + w0 * .8, m.y + L], [tx + .06, m.y + L + .09], [tx + .035, m.y + L + .10], [tx, m.y + L + .03], [tx - .035, m.y + L + .10], [tx - .06, m.y + L + .09], [tx - w0 * .8, m.y + L]];
      fill(T, { color: '#c8323a', jit: .002, seed: g.seed + 888, alpha: .95 });
    }
  } else if (g.zsnout === 'wattle') {
    for (i = 0; i < 2; i++) {
      var s2 = i ? 1 : -1, w = h.P({ x: s2 * .065, y: .36, z: .80 });
      zPaint(ring(w.x, w.y, .065 * Math.max(.5, f), .10, 12), '#d8453a', g.seed + 890 + i * 3, .9);
    }
  }
  if (g.mane === 'horse') {
    var fl = [h.S(-.26, 1.28), h.S(.26, 1.28), h.S(.18, .86), h.S(.08, .96), h.S(0, .74), h.S(-.1, .92), h.S(-.2, .84)];
    if (fl[0].z > -.1) { var col = g.fur === '#e8e0d2' ? '#b9a08a' : g.fur === '#c49a6c' ? '#5b4131' : '#2a2320'; zPaint(fl.map(function (q) { return [q.x, q.y]; }), col, g.seed + 895, .9); }
  }
  if (g.zmark === 'goatee') {
    var ch = h.S(0, -.95), gl = Math.sin(now * 1.1 + g.idlePhase) * .02;
    zPaint([[ch.x - .07 * f, ch.y - .04], [ch.x + .07 * f, ch.y - .04], [ch.x + .02 + gl, ch.y + .22], [ch.x + gl, ch.y + .26], [ch.x - .03 + gl, ch.y + .2]], mixHex(g.fur, '#f7f2e8', .4), g.seed + 898, .9);
  }
}
/* 竖瞳/彩色虹膜的眼睛（龙、蛇、兔） */
function zDrawIrisEyes(h, o) {
  var g = h.g;
  for (var i = 0; i < 2; i++) {
    var E = h.eyeInfo(i); if (E.z < .02 || E.a <= .01) continue;
    var er = g.eyeR * 1.15, ef = E.f, ea = E.a, sd = g.seed + 60 + i * 7, lid = 1 - o.eye * .9;
    if (o.eye > .65) { stroke([[E.x - er * 1.3 * ef, E.y], [E.x, E.y + er * .7], [E.x + er * 1.3 * ef, E.y]], { w: 1.2, jit: .008, seed: sd + 4, alpha: ea }); continue; }
    var ir = ring(E.x, E.y, er * 1.25 * ef, er * 1.25 * lid, 16);
    knock(ir, sd, .004); wash(ir, g.iris || '#e9b43a', sd + 1, 1.3);
    var gx = clamp(o.gazeX, -1, 1) * er * .35 * ef, gy = clamp(o.gazeY, -1, 1) * er * .25;
    if (g.slit) fill(ring(E.x + gx, E.y + gy, er * .26 * ef, er * 1.02 * lid, 12), { jit: .003, alpha: ea });
    else fill(ring(E.x + gx, E.y + gy, er * .62 * ef, er * .62 * lid, 12), { jit: .004, alpha: ea });
    fill(ring(E.x + gx - er * .4 * ef, E.y + gy - er * .42 * lid, er * .2 * ef, er * .2 * lid, 7), { jit: .002, color: PAPER, alpha: ea });
    stroke(ir, { close: true, w: 1.15, jit: .006, seed: sd + 2, alpha: ea });
    if (g.slit) stroke([[E.x - er * 1.45 * ef, E.y - er * 1.2], [E.x, E.y - er * 1.55], [E.x + er * 1.45 * ef, E.y - er * 1.2]], { w: 1.2, jit: .006, seed: sd + 3, alpha: ea * .9 });
  }
}

/* 生肖的装饰色（鬃、角、冠、章……）保持本色，不被配色方案就近替换成灰调 */
var Z_RAW = 0, zBaseMapCol = mapCol;
mapCol = function (c) { return Z_RAW ? c : zBaseMapCol(c); };
function zRaw(fn) { return function () { Z_RAW++; try { return fn.apply(this, arguments); } finally { Z_RAW--; } }; }
zDrawMane = zRaw(zDrawMane); zDrawComb = zRaw(zDrawComb); zHorn = zRaw(zHorn); zDrawTail = zRaw(zDrawTail); zDrawCoil = zRaw(zDrawCoil);
zDrawBadge = zRaw(zDrawBadge); zDrawMark = zRaw(zDrawMark); zDrawFront = zRaw(zDrawFront); zDrawIrisEyes = zRaw(zDrawIrisEyes);

/* 挂到头像的画法上：头骨之后画轮廓前（outline(48) 的第一次调用）＝脑后；drawFace 之前＝皮毛花纹；drawGlasses 之前＝脸前 */
var zBaseOutline = Head.prototype.outline;
Head.prototype.outline = function (n) {
  if (this._zBehind && n === 48) {
    this._zBehind = false; var g = this.g;
    try {
      if (g.mane) zDrawMane(this);
      if (g.comb) zDrawComb(this);
      if (g.horns) { for (var i = 0; i < 2; i++) { var sg = i ? 1 : -1; if (!zHornFront(this, sg)) zHorn(this, sg); } }
    } catch (e) {}
  }
  return zBaseOutline.apply(this, arguments);
};
var zBaseFace = Head.prototype.drawFace;
Head.prototype.drawFace = function (o) {
  var g = this.g;
  if (!g.natural) {
    if (STYLE === 'papercut') try { pcOrnaments(this); } catch (e) {}
    if (g.zmark) { ctx.save(); tracePath(this.outline(40), true); ctx.clip(); try { zDrawMark(this, o); } catch (e) {} ctx.restore(); }
  }
  return zBaseFace.apply(this, arguments);
};
var zBaseEyes = Head.prototype.drawEyes;
Head.prototype.drawEyes = function (o) {
  if (this.g.eyeStyle === 'iris' && !(o.googly > .5)) return zDrawIrisEyes(this, o);
  return zBaseEyes.apply(this, arguments);
};
var zBaseGlasses = Head.prototype.drawGlasses;
Head.prototype.drawGlasses = function () {
  var g = this.g;
  if (!g.natural && (g.zsnout || g.mane === 'horse' || g.zmark === 'goatee' || g.horns === 'ram')) {
    try {
      if (g.horns === 'ram') for (var i = 0; i < 2; i++) { var sg = i ? 1 : -1; if (zHornFront(this, sg)) zHorn(this, sg); }
      zDrawFront(this, this._zo || {});
    } catch (e) {}
  }
  return zBaseGlasses.apply(this, arguments);
};
var zBaseBody = Head.prototype.drawBody;
Head.prototype.drawBody = function (o) {
  var g = this.g, r;
  if (!g.natural && g.ztail && g.ztail !== 'coil') try { zDrawTail(this); } catch (e) {}
  r = zBaseBody.apply(this, arguments);
  if (!g.natural) {
    try { if (g.ztail === 'coil' && (!o || !o.neck || o.neck === 'plain')) zDrawCoil(this); } catch (e) {}
    try { if (g.zbadge) zDrawBadge(this); } catch (e) {}
  }
  return r;
};

/* ========== 四、剪纸风 ========== */
STYLES.papercut = 'Paper-cut 剪纸';
PANEL.forEach(function (G) { G.items.forEach(function (it) { if (it.id === 'styles') it.opts = Object.keys(STYLES).map(function (k) { return [k, STYLES[k]]; }); }); });
var PC = { on: 0, g: null, RED: '#c62f2a', DEEP: '#7a1714', INK: '#3b1512', GOLD: '#d9a23a', TEAL: '#2f6b64', LIGHT: '#df6450' };
function pcActive() { return PC.on > 0 && STYLE === 'papercut'; }
function pcHsl(hex) {
  var n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, s = 0, h = 0, d = mx - mn;
  if (d > 1e-6) { s = d / (1 - Math.abs(2 * l - 1)); h = mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
  return { h: h, s: s, l: l };
}
/* 颜色 → 纸：主毛色永远是红纸；小块浅色剪空；黄→金纸，蓝绿→青纸，很深→深红 */
function pcColor(raw, area) {
  var g = PC.g;
  if (g && (raw === g.fur || raw === g.earCol || raw === g.geneFur)) return PC.RED;
  if (typeof raw !== 'string' || !/^#[0-9a-f]{6}$/i.test(raw)) return PC.RED;
  var c = pcHsl(raw);
  if (c.l > .80) return area < .30 ? 'CUT' : PC.LIGHT;
  if (c.l < .26) return PC.INK;
  if (c.h >= 32 && c.h < 64 && c.s > .42) return PC.GOLD;
  if (c.h >= 90 && c.h < 265 && c.s > .18) return PC.TEAL;
  return c.l > .62 ? PC.LIGHT : c.l < .4 ? PC.DEEP : PC.RED;
}
function pcArea(P) { var b = bbox(P); return (b[2] - b[0]) * (b[3] - b[1]); }
var pcBaseKnock = knock, pcBaseWash = wash, pcBaseStroke = stroke, pcBaseFill = fill;
knock = function (pts, seed, jit) {
  if (!pcActive()) return pcBaseKnock.apply(this, arguments);
  if (!pts || pts.length < 3) return;
  var big = pcArea(pts) > .45;
  ctx.save(); ctx.fillStyle = PC.RED; ctx.globalAlpha = GALPHA;
  if (big && GALPHA > .9) { ctx.shadowColor = 'rgba(90,20,12,.28)'; ctx.shadowBlur = 3; ctx.shadowOffsetY = 1.5; }
  tracePath(pts, true); ctx.fill(); ctx.restore();
};
wash = function (pts, color, seed, alpha) {
  if (!pcActive()) return pcBaseWash.apply(this, arguments);
  if (!COLOR || !color || !pts || pts.length < 3) return;
  var a = Math.min(1, (alpha == null ? 1 : alpha)) * GALPHA; if (a < .12) return;
  var c = pcColor(color, pcArea(pts));
  ctx.save(); ctx.fillStyle = c === 'CUT' ? paperFill() : c; ctx.globalAlpha = c === 'CUT' ? GALPHA : a;
  tracePath(pts, true); ctx.fill(); ctx.restore();
};
stroke = function (pts, opt) {
  if (!pcActive()) return pcBaseStroke.apply(this, arguments);
  if (!pts || pts.length < 2) return;
  opt = opt || {};
  var plain = !opt.color || opt.color === INK, w0 = opt.w == null ? 1 : opt.w, col;
  if (plain) col = w0 < 1 ? 'CUT' : PC.DEEP; else if (opt.color === PAPER || opt.color === '#ffffff') col = 'CUT'; else col = pcColor(opt.color, 0);
  var alpha = (opt.alpha == null ? 1 : opt.alpha) * GALPHA; if (alpha <= .01) return;
  ctx.save(); ctx.strokeStyle = col === 'CUT' ? paperFill() : col; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.lineWidth = w0 * LW * CFG.line * (col === 'CUT' ? .9 : 1.05); ctx.globalAlpha = Math.min(1, alpha * 1.1);
  tracePath(jitterPts(pts, (opt.jit == null ? .012 : opt.jit) * .25, opt.seed || 1), !!opt.close); ctx.stroke(); ctx.restore();
};
fill = function (pts, opt) {
  if (!pcActive()) return pcBaseFill.apply(this, arguments);
  if (!pts || pts.length < 3) return;
  opt = opt || {};
  var alpha = (opt.alpha == null ? .92 : opt.alpha) * GALPHA; if (alpha <= .01) return;
  var c = !opt.color || opt.color === INK ? PC.INK : opt.color === PAPER ? 'CUT' : pcColor(opt.color, pcArea(pts));
  ctx.save(); ctx.fillStyle = c === 'CUT' ? paperFill() : c; ctx.globalAlpha = Math.min(1, alpha * 1.08);
  tracePath(pts, true); ctx.fill(); ctx.restore();
};
/* 剪纸的刀法：脸颊三道月牙纹，下巴一圈锯齿纹，额头一朵四瓣花（有花纹的物种不剪花） */
function pcCrescent(cx, cy, r, rot) {
  var P = [], i, ca = Math.cos(rot), sa = Math.sin(rot), push = function (x, y) { P.push([cx + x * ca - y * sa, cy + x * sa + y * ca]); };
  for (i = 0; i <= 10; i++) { var a = -1.25 + 2.5 * i / 10; push(Math.cos(a) * r, Math.sin(a) * r); }
  for (i = 10; i >= 0; i--) { var b = -1.0 + 2.0 * i / 10; push(Math.cos(b) * r * .72 + r * .12, Math.sin(b) * r * .78); }
  return P;
}
function pcOrnaments(h) {
  var g = h.g, i, f = clamp(Math.cos(h.yaw), .1, 1), cut = { color: PAPER, jit: 0, alpha: 1 };
  for (i = 0; i < 2; i++) {
    var sg = i ? 1 : -1, c = h.S(sg * .80, -.10);
    if (c.z < .12) continue;
    for (var j = 0; j < 3; j++) fill(pcCrescent(c.x + sg * j * .045 * f, c.y + (j - 1) * .085, .07, sg > 0 ? Math.PI : 0), cut);
  }
  var t, p, q, n = 18;
  for (i = 1; i < n; i++) {
    t = Math.PI * (1.18 + .64 * i / n); p = h.silPt(t); q = h.silPt(Math.PI * (1.18 + .64 * (i + .5) / n));
    var k = .9, a0 = [p[0] * k, p[1] * k], a1 = [q[0] * k, q[1] * k], m = [(a0[0] + a1[0]) / 2 * .93, (a0[1] + a1[1]) / 2 * .93];
    fill([a0, a1, m], cut);
  }
  if (!g.zmark && g.hair === 'none' && !g.tuft) {
    var fc = h.S(0, .82);
    if (fc.z > .2) for (i = 0; i < 4; i++) { var a = i * Math.PI / 2 + Math.PI / 4; fill(ring(fc.x + Math.cos(a) * .045 * f, fc.y + Math.sin(a) * .045, .032 * f, .032, 8, a), cut); }
  }
}

/* 头与身体的画法期间才生效（泡泡、粒子、卡片底色等照旧）；记下当前角色，用来认出"主毛色" */
['drawHeadAt', 'drawBodyAt'].forEach(function (m) {
  var base = Head.prototype[m];
  Head.prototype[m] = function (o) {
    var pg = PC.g; PC.on++; PC.g = this.g; if (m === 'drawHeadAt') { this._zBehind = true; this._zo = o; }
    try { return base.apply(this, arguments); } finally { PC.on--; PC.g = pg; this._zBehind = false; }
  };
});

/* ========== 五、场景：十二生肖（4×3 按子丑寅卯排，默认剪纸） ========== */
var zScene = applyStudioScene;
applyStudioScene = function (name) {
  if (name !== 'zodiac') return zScene.apply(this, arguments);
  if (typeof EVO !== 'undefined' && EVO.on) return;
  applySelectedCast(ZOD_KEYS, 12);
  heads.forEach(function (h, i) { if (isKept(h.code)) return; clearActs(h); h.setDNA(atlasDNA(ZOD_KEYS[i % 12], hashInt(5200 + i * 37, 12))); h.pop = 1; });
  Object.assign(CFG, { styles: ['papercut'], palettes: [], paper: 'xuan', density: .85, pigment: 1, wetness: .4, mono: false, speciesPool: ZOD_KEYS.slice() });
  studioScene = 'zodiac'; poolCursor = 0; applyTheme(); saveCfg(); syncPanel();
  document.querySelectorAll('[data-scene]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.scene === 'zodiac' ? 'true' : 'false'); });
  document.querySelectorAll('.sceneMore').forEach(function (d) { d.open = false; });
  var st = document.getElementById('atlasStatus'); if (st) st.textContent = '十二生肖';
  toast(qxLocal('十二生肖上台了——剪纸风。在"画材与设置"里换画风，就是水彩、水墨的生肖。', 'The twelve zodiac animals, in paper-cut. Change the art style in settings for watercolour or ink.'), 3200);
};
var zPacksStage = packsStage;
packsStage = function (id) { if (id === 'zodiac') { if (typeof EVO !== 'undefined' && EVO.on) { toast(qxLocal('先退出生态缸。', 'Leave the tank first.'), 1800); return; } if (cardOpen) closeCard(); applyStudioScene('zodiac'); return; } return zPacksStage.apply(this, arguments); };
if (typeof castFamily === 'function') { var zCastFamily = castFamily; castFamily = function (k) { return ZOD_IDX[k] != null ? '十二生肖' : zCastFamily(k); }; }

try { window.__zodiac = { keys: ZOD_KEYS, dna: function (k, s) { return atlasDNA(k, s); }, pure: function (i) { return zodPure(heads[i || 0].g); }, scene: function () { applyStudioScene('zodiac'); } }; } catch (e) {}
