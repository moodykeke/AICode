/* 趣像 21 (r44): 投放进化 · 生态缸
   ─────────────────────────────────────────────────────────────
   受《孢子》启发：舞台变成一只生态缸。空格子等你"投放"生物；每隔一会儿过一代——
   挨着的两只会生孩子（七个基因座逐个随父或随母，偶尔突变），孤零零的只能克隆（更容易突变）；
   老了、挤了、不适应气候的会死。换气候（温和 / 雪原 / 沙漠 / 夜林 / 海边），几代之后缸里的样子就变了：
   雪原上浅色厚毛的活下来，沙漠里大耳朵的活下来，夜林里大眼睛的活下来，海边青蛙称王。
   解压玩法：撒食物（拖着撒）让附近的生物多生；扔陨石（点哪砸哪）——幸存者会发生奇怪的突变。
   物种志：新变种出现、称霸、灭绝、气候变化都会记一笔；右侧有种群曲线和排行。
   点任何一只生物看它的卡片（可收藏、分享码照旧）。合影键照样能拍整缸的"全家福"。
   只用现有的七基因座（crossDNA / randSeed / composeGenes），不新增画法；空格子用 h.hidden。 */

var EVO = {
  on: false, gen: 0, climate: 'temperate', cPrev: null, cT: 0, speed: 1, acc: 0, tool: 'drop', pick: 'random',
  food: [], meteors: [], craters: [], lineage: {}, hist: [], journal: [], dominant: null, births: 0, deaths: 0, drops: 0,
  panel: null, press: null
};
var EVO_GEN_MS = 2600;
function evoEn() { return typeof UI_LANG !== 'undefined' && UI_LANG === 'en'; }
function evoL(zh, en) { return evoEn() ? en : zh; }
function evoRand(a) { return a[(Math.random() * a.length) | 0]; }

/* ========== 一、气候与适应度 ========== */
var EVO_CLIMATES = {
  temperate: { zh: '温和', en: 'Mild', suffer: ['松了口气', 'relaxes'], glyph: '☘' },
  snow: { zh: '雪原', en: 'Tundra', suffer: ['开始发抖', 'starts to shiver'], glyph: '❄' },
  desert: { zh: '沙漠', en: 'Desert', suffer: ['热得冒汗', 'is sweating buckets'], glyph: '☀' },
  night: { zh: '夜林', en: 'Night forest', suffer: ['看不清路', 'can’t see a thing'], glyph: '☾' },
  sea: { zh: '海边', en: 'Seashore', suffer: ['喘不上气', 'is gasping'], glyph: '≈' }
};
var EVO_CLIMATE_ORDER = ['temperate', 'snow', 'desert', 'night', 'sea'];
/* 物种的"生活史"：繁殖快慢、寿命长短、特殊规矩（机器人不能单独克隆；外星访客突变率三倍） */
var EVO_LIFE = {
  human: { r: -.05, l: 3 }, cat: { r: 0, l: 1 }, tiger: { r: -.08, l: 2 }, dog: { r: .02, l: 1 }, bear: { r: -.1, l: 3 }, panda: { r: -.12, l: 3 },
  rabbit: { r: .15, l: -1 }, pig: { r: .05, l: 0 }, fox: { r: 0, l: 1 }, mouse: { r: .18, l: -2 }, owl: { r: -.03, l: 2 }, chick: { r: .1, l: -2 },
  frog: { r: .1, l: -1 }, robot: { r: -.1, l: 3, noClone: true }, alien: { r: 0, l: 1, mut: 3 }
};
function evoHex(hex) {
  var m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '')); if (!m) return { l: .6, s: 0, h: 0 };
  var n = parseInt(m[1], 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn, s = d ? d / (1 - Math.abs(2 * l - 1)) : 0, h = 0;
  if (d) { h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h = (h * 60 + 360) % 360; }
  return { l: .2126 * r + .7152 * g + .0722 * b, s: s, h: h };
}
/* 适应度：1 = 刚好过得去；每条理由都记下来，物种志里用得上 */
function evoFit(g, climate) {
  if (g.natural) {                                     /* 神话角色：看它所在的包在这种气候的底子 */
    var P = typeof QX_PACKS !== 'undefined' ? QX_PACKS.packOf(g.sp) : null, b = P && P.evolve && P.evolve.climate ? (P.evolve.climate[climate] || 0) : 0;
    var why = (typeof EVO_PACK_WHY !== 'undefined' && P && EVO_PACK_WHY[P.id] && EVO_PACK_WHY[P.id][climate]) || (b > 0 ? ['老家就是这种天气', 'feels like home'] : ['水土不服', 'far from home']);
    var r = b ? [b, why[0], why[1]] : null, dn = g.donor ? .05 : 0;
    return { f: clamp(1 + b + dn, .3, 1.6), best: r && b > 0 ? r : (dn ? [dn, '血统混杂', 'mixed blood'] : null), worst: r && b < 0 ? r : null };
  }
  var c = evoHex(g.fur), lum = c.l;
  var fluffy = clamp(g.fluff || 0, 0, 1.2) / 1.2 * .7 + (g.hair && g.hair !== 'none' && g.hair !== 'bald' ? .3 : 0) + (g.beard ? .2 : 0) + (g.feathers ? .2 : 0);
  var ear = g.topEars ? g.topEars.len : (g.sideEars ? .3 : .15);
  var eyeBig = clamp((g.eyeR - .055) / .03, 0, 1) + (g.eyeStyle === 'owl' ? .6 : g.eyeStyle === 'alien' ? .4 : g.eyeStyle === 'frog' ? .2 : 0);
  var wet = g.frog ? 1 : 0, mech = g.box ? 1 : 0, R = [];
  if (mech) { lum = .5; fluffy = Math.min(fluffy, .15); }          /* 机器的铁皮不算毛色，也不保暖 */
  var add = function (v, zh, en) { if (Math.abs(v) > .02) R.push([v, zh, en]); };
  if (climate === 'snow') {
    add((lum - .5) * .8, lum > .5 ? '毛色浅，雪地里不显眼' : '颜色太深，雪地里一眼就被看见', lum > .5 ? 'pale coats vanish in the snow' : 'dark coats stand out on snow');
    add(fluffy * .45 - .12, fluffy > .3 ? '毛厚，暖和' : '毛太薄，冻得慌', fluffy > .3 ? 'thick fur keeps warm' : 'thin fur lets the cold in');
    if (ear > .55) add(-(ear - .55) * .8, '长耳朵冻得慌', 'long ears freeze');
    add(-wet * .5, '皮肤会结冰', 'wet skin freezes');
    add(mech * .12, '机器不怕冷', 'machines don’t mind the cold');
  } else if (climate === 'desert') {
    add((ear - .35) * .6, ear > .35 ? '大耳朵散热快' : '小耳朵散不了热', ear > .35 ? 'big ears shed heat' : 'small ears trap heat');
    add(-fluffy * .4 + .08, fluffy > .2 ? '毛太厚，热坏了' : '毛短，凉快', fluffy > .2 ? 'too much fur in the heat' : 'short coats stay cool');
    add(-wet * .7, '皮肤干裂', 'skin dries out');
    add(lum > .45 && lum < .82 && c.s > .15 ? .15 : 0, '沙色是保护色', 'sandy coats blend in');
    add(mech * .1, '机器不怕热', 'machines don’t mind the heat');
    add(g.tongue ? .1 : 0, '吐舌头散热', 'panting helps');
  } else if (climate === 'night') {
    add(eyeBig * .45 - .15, eyeBig > .35 ? '大眼睛看得清' : '眼睛太小，摸黑', eyeBig > .35 ? 'big eyes see in the dark' : 'small eyes stumble in the dark');
    add((.5 - lum) * .5, lum < .5 ? '深色藏在夜里' : '浅色在夜里太显眼', lum < .5 ? 'dark coats hide at night' : 'pale coats glow at night');
    add(g.whiskers ? .15 : 0, '胡须能摸路', 'whiskers feel the way');
    add(g.antenna === 2 ? .1 : 0, '触角能感知', 'antennae sense the dark');
    add(mech ? -.15 : 0, '屏幕眼在黑里反光', 'screen eyes glow and give it away');
  } else if (climate === 'sea') {
    add(wet * .6, '蛙皮不怕湿', 'frog skin loves the damp');
    add(g.whiskers ? .15 : 0, '胡须感知水流', 'whiskers read the currents');
    add(g.beak ? .2 : 0, '喙能啄鱼', 'a beak catches fish');
    add(-fluffy * .25, '毛湿了太沉', 'wet fur is heavy');
    add(-mech * .4, '会生锈', 'robots rust');
  } else {
    add(g.hybrid ? .06 : 0, '杂种优势', 'hybrid vigour');
    add(mech ? -.06 : 0, '零件要保养', 'parts need servicing');
  }
  var f = 1; R.forEach(function (r) { f += r[0]; });
  R.sort(function (a, b) { return b[0] - a[0]; });
  return { f: clamp(f, .3, 1.6), best: R.length && R[0][0] > 0 ? R[0] : null, worst: R.length && R[R.length - 1][0] < 0 ? R[R.length - 1] : null };
}

/* ========== 二、变种命名：按每个基因座来自谁 ========== */
var EVO_NOUN = { human: ['人', 'human'], cat: ['猫', 'cat'], tiger: ['虎', 'tiger'], dog: ['狗', 'dog'], bear: ['熊', 'bear'], panda: ['熊猫', 'panda'], rabbit: ['兔', 'rabbit'], pig: ['猪', 'pig'],
  fox: ['狐', 'fox'], mouse: ['鼠', 'mouse'], owl: ['鸮', 'owl'], chick: ['鸡', 'chick'], frog: ['蛙', 'frog'], robot: ['机器人', 'robot'], alien: ['星人', 'visitor'] };
var EVO_FULL = { human: ['人类', 'human'], alien: ['外星访客', 'visitor'] };
var EVO_PARTS = {
  ears: { cat: ['猫耳', 'cat-eared'], tiger: ['虎耳', 'tiger-eared'], dog: ['垂耳', 'floppy-eared'], bear: ['熊耳', 'bear-eared'], panda: ['黑耳', 'panda-eared'], rabbit: ['兔耳', 'rabbit-eared'],
    pig: ['猪耳', 'pig-eared'], fox: ['狐耳', 'fox-eared'], mouse: ['鼠耳', 'mouse-eared'], owl: ['羽角', 'tufted'], robot: ['螺栓', 'bolted'], alien: ['触角', 'antennaed'], human: ['人耳', 'human-eared'] },
  eyes: { owl: ['鸮眼', 'owl-eyed'], frog: ['蛙眼', 'frog-eyed'], panda: ['黑眼圈', 'panda-eyed'], robot: ['屏幕眼', 'screen-eyed'], alien: ['星眼', 'starry-eyed'], human: ['人眼', 'human-eyed'] },
  snout: { pig: ['猪鼻', 'pig-snouted'], dog: ['狗嘴', 'dog-muzzled'], chick: ['鸡喙', 'beaked'], owl: ['钩喙', 'hook-beaked'], frog: ['阔嘴', 'wide-mouthed'], rabbit: ['兔牙', 'buck-toothed'],
    bear: ['熊吻', 'bear-muzzled'], fox: ['尖吻', 'fox-snouted'], mouse: ['鼠须', 'whiskery'], robot: ['格栅嘴', 'grille-mouthed'], alien: ['小嘴', 'tiny-mouthed'], human: ['人鼻', 'human-nosed'],
    cat: ['猫须', 'cat-whiskered'], tiger: ['虎须', 'tiger-whiskered'], panda: ['熊猫吻', 'panda-muzzled'] }
};
var EVO_HAIR = { sweep: ['刘海', 'fringed'], crop: ['短发', 'crop-haired'], curly: ['卷毛', 'curly'], bun: ['发髻', 'bunned'], bald: ['秃顶', 'balding'], long: ['长发', 'long-haired'], cap: ['毛线帽', 'capped'], wisps: ['呆毛', 'wispy'] };
function evoColour(g) {
  if (g.sp === 'human' || g.sp === 'robot' || g.sp === 'panda' || g.sp === 'tiger') return null;
  var c = evoHex(g.fur);
  if (c.l > .86) return ['白', 'white']; if (c.l < .26) return ['黑', 'black']; if (c.s < .13) return ['灰', 'grey'];
  if (c.h >= 70 && c.h < 165) return ['绿', 'green']; if (c.h >= 165 && c.h < 250) return ['蓝', 'blue']; if (c.h >= 250 && c.h < 330) return ['紫', 'violet'];
  if (c.h >= 330 || c.h < 14) return ['粉', 'pink']; if (c.h < 34 && c.s > .55) return ['橘', 'ginger']; if (c.h >= 40) return ['金', 'golden'];
  return ['棕', 'brown'];
}
function evoName(g) {
  if (g.natural) {
    var hs = typeof QX_PACKS !== 'undefined' ? QX_PACKS.short(g.sp) : String((NATURAL_INFO[g.sp] || {}).name || g.sp), hen = String((NATURAL_INFO[g.sp] || {}).en || g.sp);
    var ds = g.donor ? (typeof QX_PACKS !== 'undefined' ? QX_PACKS.short(g.donor) : String((NATURAL_INFO[g.donor] || {}).name || g.donor)) : '', den = g.donor ? String((NATURAL_INFO[g.donor] || {}).en || g.donor) : '';
    var zh0 = hs + (ds ? '（' + ds + '血统）' : ''), hh = 0; for (var q = 0; q < zh0.length; q++) hh = (hh * 31 + zh0.charCodeAt(q)) >>> 0;
    return { key: zh0, zh: zh0, en: hen + (den ? ' with ' + den + ' blood' : ''), hue: hh % 360, hybrid: !!ds, sp: g.sp, natural: true };
  }
  var sp = g.sp, parts = [], mods = ['ears', 'eyes', 'snout'];
  for (var i = 0; i < 3; i++) { var src = g.src[i + 1]; if (src === sp) continue; var p = (EVO_PARTS[mods[i]] || {})[src]; if (p && p[0]) parts.push(p); }
  if (sp !== 'human' && g.hair && g.hair !== 'none' && EVO_HAIR[g.hair]) parts.push(EVO_HAIR[g.hair]);
  parts = parts.slice(0, 2);
  var col = evoColour(g), noun = parts.length ? EVO_NOUN[sp] : (EVO_FULL[sp] || [(typeof LEGACY_LABELS !== 'undefined' && LEGACY_LABELS[sp]) || EVO_NOUN[sp][0], EVO_NOUN[sp][1]]);
  var zh = (col ? col[0] + '·' : '') + parts.map(function (p) { return p[0]; }).join('') + noun[0];
  var en = (col ? col[1] + ' ' : '') + parts.map(function (p) { return p[1]; }).join(' ') + (parts.length ? ' ' : '') + noun[1];
  var key = zh, hsh = 0; for (var k = 0; k < key.length; k++) hsh = (hsh * 31 + key.charCodeAt(k)) >>> 0;
  return { key: key, zh: zh, en: en, hue: hsh % 360, hybrid: parts.length > 0, sp: sp };
}
function evoLabel(v) { return v ? (evoEn() ? v.en : v.zh) : ''; }

/* ========== 三、始祖：投放托盘里的十五种，每种一段"图鉴" ========== */
var EVO_FOUNDERS = [
  ['human', '会穿衣服、会戴眼镜。什么气候都能凑合，哪儿都不是最好；生得慢，活得长。', 'Wears clothes and glasses. Copes anywhere, excels nowhere; breeds slowly, lives long.'],
  ['cat', '毛蓬松、耳朵尖、胡须灵。怕水，夜里眼睛亮。', 'Fluffy, pointy-eared, whiskered. Hates water, fine in the dark.'],
  ['tiger', '条纹是林子里的隐身衣；厚毛耐寒，最怕热。', 'Stripes hide it in the woods; thick fur for the cold, hates the heat.'],
  ['dog', '耷拉耳朵，吐舌头散热。哪儿有伙伴哪儿就是家。', 'Floppy ears, pants to cool down. Home is wherever the pack is.'],
  ['bear', '块头大、毛厚，冬天睡一觉就过去了。生得少。', 'Big and thick-furred; sleeps through winter. Few cubs.'],
  ['panda', '黑眼圈是天生的；白毛在雪里看不见。生得最慢。', 'Born with dark rings; white fur vanishes in snow. Slowest breeder.'],
  ['rabbit', '长耳朵是散热器也是雷达。生得快、活得短。', 'Long ears are radiators and radar. Breeds fast, dies young.'],
  ['pig', '什么都吃；在泥里打滚就是防晒。', 'Eats anything; a mud bath is sunscreen.'],
  ['fox', '尖耳尖嘴，夜里出没。沙漠里的亲戚耳朵更大。', 'Sharp ears, sharp snout, out at night. Its desert cousins have bigger ears.'],
  ['mouse', '小、快、多。一眨眼就是好几代。', 'Small, quick, many. Generations flash by.'],
  ['owl', '大眼睛盘状脸，夜里看得最清楚；白天打盹。', 'Huge eyes in a dish face — best in the dark; dozes by day.'],
  ['chick', '毛茸茸的一团，怕冷又怕热，但孵得快。', 'A ball of fluff, fussy about weather, hatches fast.'],
  ['frog', '皮肤要湿的。海边是天堂，沙漠是地狱。', 'Needs damp skin. The shore is heaven, the desert hell.'],
  ['robot', '不怕冷不怕热，会生锈；不能自己克隆，得借别人的零件拼出下一代。', 'Heat- and cold-proof, but rusts; can’t clone itself — needs a partner’s parts.'],
  ['alien', '从天上投下来的，来路不明；突变率是别人的三倍。', 'Dropped from the sky, origin unknown; mutates three times as often.']
];
function evoFounderDNA(sp) {
  if (sp === 'random') { var P = typeof QX_PACKS !== 'undefined' && EVO.pack ? QX_PACKS.byId[EVO.pack] : null; sp = P ? evoRand(P.members) : evoRand(EVO_FOUNDERS)[0]; }
  if (typeof QX_PACKS !== 'undefined' && !QX_PACKS.isClassic(sp)) { var d = QX_PACKS.dna(sp); if (d) return d; }
  return pureDNA(evoFounderSeed(sp));
}
function evoFounderSeed(sp) {
  if (sp === 'random') sp = evoRand(EVO_FOUNDERS)[0];
  for (var i = 0; i < 900; i++) { var s = randSeed(); if (baseGenes(s).sp === sp) return s; }
  return randSeed();
}

/* ========== 四、动作：投下、孵出、谈恋爱、吃、衰老、被陨石炸飞 ========== */
defineFx('evoDrop', { channels: ['pos'], prio: PRIO.REACT, dur: 900,
  step: function (h, a, t, k, d) {
    var soft = reduceMotion() ? 0 : 1, fall = Math.min(1, k / .55), land = k > .55 ? (k - .55) / .45 : 0;
    d.pop = Math.min(1, k * 4); d.oy = -3.2 * soft * (1 - fall) * (1 - fall) - .18 * soft * Math.sin(land * Math.PI) * (1 - land);
    d.hs = land ? -.12 * Math.sin(land * Math.PI) * (1 - land) : 0; d.eye = fall < 1 ? .7 : 0; d.mouth = fall < 1 ? .5 : .1; d.brow = fall < 1 ? .8 : 0;
    if (!a.landed && fall >= 1) { a.landed = true; if (SOUND) try { SFX.thunk(panOf(h)); } catch (e) {} for (var i = 0; i < 6; i++) particles.push({ x: h.x + (Math.random() - .5) * h.s, y: h.y + h.s * .9, vx: (Math.random() - .5) * 60, vy: -20 - Math.random() * 30, l: 0, ml: .5, r: 2 + Math.random() * 2, col: '#c8b89a' }); }
  } });
defineFx('evoHatch', { channels: ['pos'], prio: PRIO.REACT, dur: 760,
  step: function (h, a, t, k, d) { var e = 1 - Math.pow(1 - k, 3); d.pop = e * (1 + .18 * Math.sin(k * Math.PI)); d.oy = -.15 * Math.sin(k * Math.PI); d.eye = k < .5 ? 1 : 0; d.smile = .6; } });
defineFx('evoNudge', { channels: ['face'], dur: 900,
  step: function (h, a, t, k, d) { var e = bump(k); d.gazeX = (a.dir || 0) * e; d.smile = .8 * e; d.flush = .5 * e; } });
defineFx('evoEat', { channels: ['face'], dur: 1100,
  step: function (h, a, t, k, d) { var e = bump(k); d.mouth = .15 + .35 * Math.abs(Math.sin(t / 90)) * e; d.smile = .5 * e; d.gazeX = (a.dir || 0) * .8 * e; d.gazeY = .5 * e; } });
defineFx('evoFade', { channels: ['pos', 'face'], prio: PRIO.REACT, dur: 1400,
  step: function (h, a, t, k, d) { d.pop = 1 - k * k; d.roll = .35 * k * (a.dir || 1); d.eye = 1; d.oy = -.4 * k; d.mouth = .05; },
  cleanup: function (h) { h.evoDying = false; h.hidden = true; h.evo = null; h.pop = 0; } });
defineFx('evoBlast', { channels: ['pos', 'face'], prio: PRIO.SUPER, dur: 1100,
  step: function (h, a, t, k, d) { d.ox = (a.dx || 0) * 3 * k; d.oy = (a.dy || -1) * 3 * k - 2.2 * Math.sin(k * Math.PI); d.spin = 7 * k; d.pop = 1 - k; d.eye = 1; d.mouth = .7; d.dizzy = 1; },
  cleanup: function (h) { h.evoDying = false; h.hidden = true; h.evo = null; h.pop = 0; } });
var EVO_FX = { evoDrop: 1, evoHatch: 1, evoNudge: 1, evoEat: 1, evoFade: 1, evoBlast: 1 };

/* 空格子不接任何动作——否则按个键，空格子里就冒出一张脸 */
var evoBaseAct = act;
act = function (h, name) {
  if (EVO.on && h && h.hidden && !EVO_FX[name]) return null;
  return evoBaseAct.apply(this, arguments);
};

/* ========== 五、一代 ========== */
/* 分区（r45）：右半边可以是另一种气候 */
function evoClimateOf(h) { return EVO.climate2 && h && h.col >= Math.ceil(cols / 2) ? EVO.climate2 : EVO.climate; }
function evoLive(h) { return !h.hidden && !h.evoDying && h.evo; }
function evoEmpty(h) { return h.hidden && !h.evoDying && !h.evoReserved; }
function evoNear(h) { return heads.filter(function (o) { return o !== h && Math.abs(o.row - h.row) <= 1 && Math.abs(o.col - h.col) <= 1; }); }
/* 经典与经典、神话与神话才通婚（神话角色是整张画，靠"血统"（借体标志）把招牌传下去） */
function evoCanMate(a, b) { return !!a.g.natural === !!b.g.natural; }
function evoCross(a, b) { return (a.length > 7 || b.length > 7) ? crossDNA(a.slice(), b.slice()) : crossDNA(a.slice(0, 7), b.slice(0, 7)); }
function evoMutate(d) {
  if (d.length > 7) {                                  /* 神话：换花色 / 丢了血统 / 得到同包另一位的血统 */
    var x = Math.random(), host = NATURAL[d[7] - 1], P = typeof QX_PACKS !== 'undefined' ? QX_PACKS.packOf(host) : null;
    if (x < .25 && d.length > 8) { var lost = NATURAL[d[8] - 1]; d.length = 8; return { natural: 'lost', from: lost, to: host, locus: 7 }; }
    if (x < .5 && P && P.members.length > 1) { var k = evoRand(P.members.filter(function (m) { return m !== host; })), t = NATURAL.indexOf(k) + 1; if (t > 0) { d[8] = t; return { natural: 'gain', from: host, to: k, locus: 8 }; } }
    var j = 4 + ((Math.random() * 2) | 0); d[j] = randSeed(); return { natural: 'tint', from: host, to: host, locus: j };
  }
  var i = Math.random() < .12 ? 0 : 1 + ((Math.random() * 6) | 0), old = d[i];
  d[i] = randSeed();
  return { locus: i, from: baseGenes(old).sp, to: baseGenes(d[i]).sp };
}
function evoBirth(cell, dna, mom, dad, how, delay) {
  cell.evoReserved = true;
  setTimeout(function () {
    cell.evoReserved = false;
    if (!EVO.on || !cell.hidden || cell.evoDying) return;
    clearActs(cell);
    cell.setDNA(dna, null); cell.hidden = false; cell.pop = 0; cell.yaw = 0; cell.pitch = 0;
    cell.parents = [mom.code].concat(dad ? [dad.code] : []);
    cell.evo = { age: 0, born: EVO.gen, fit: 1, how: how, fed: 0 };
    cardBio(dna, evoBio(how, mom, dad)); cell._id = null;
    act(cell, 'evoHatch', { hideBefore: true });
    if (dad) { for (var i = 0; i < 4; i++) spawnHeart(cell.x + (Math.random() - .5) * cell.s, cell.y - cell.s * .5); act(mom, 'evoNudge', { dir: dirTo(mom, cell) }); act(dad, 'evoNudge', { dir: dirTo(dad, cell) }); }
    if (how === 'mutant') spawnText(cell, evoL('突变！', 'Mutant!'), false, .9);
    if (SOUND && allow('evoPop', 120, 3)) try { SFX.pop(panOf(cell), 600 + Math.random() * 600); } catch (e) {}
    EVO.births++;
  }, delay);
}
/* 卡片背面的"出生证明"（card-words-r44.js 用它换掉爱好与害怕那两行） */
function evoBio(how, mom, dad) {
  var C = EVO_CLIMATES[EVO.climate], M = evoVariantOf(mom), D = dad ? evoVariantOf(dad) : null;
  if (how === 'drop') {
    var F = EVO_FOUNDERS.filter(function (f) { return f[0] === mom.g.sp; })[0];
    return { zh: '始祖 · 第 ' + EVO.gen + ' 代投放。' + (F ? F[1].split('。')[0] + '。' : ''), en: 'Founder · dropped in gen ' + EVO.gen + '. ' + (F ? F[2].split('. ')[0].replace(/\.$/, '') + '.' : '') };
  }
  var head = '第 ' + EVO.gen + ' 代 · ' + C.zh + ' · ', headEn = 'Gen ' + EVO.gen + ' · ' + C.en.toLowerCase() + ' · ', mut = how === 'mutant';
  if (D) return { zh: head + '父母：' + M.zh + ' × ' + D.zh + (mut ? ' · 突变' : ''), en: headEn + 'parents: ' + M.en + ' × ' + D.en + (mut ? ' · mutant' : '') };
  return { zh: head + (mut ? M.zh + '独自生下 · 突变' : M.zh + '的克隆'), en: headEn + (mut ? 'budded off a ' + M.en + ' · mutant' : 'a clone of a ' + M.en) };
}
function evoKill(h, cause, extra) {
  if (!evoLive(h)) return;
  h.evoDying = true;
  if (cause === 'meteor') act(h, 'evoBlast', extra || {}); else act(h, 'evoFade', { dir: Math.random() < .5 ? -1 : 1 });
  EVO.deaths++;
}
function evoGeneration() {
  var alive = heads.filter(evoLive);
  if (!alive.length) return;
  EVO.gen++;
  var C = EVO.climate;
  EVO.food = EVO.food.filter(function (f) { return EVO.gen - f.gen < 4; });
  EVO.craters = EVO.craters.filter(function (c) { return EVO.gen - c.gen < 4; });
  /* 吃：每只身边一格内有食物就吃一颗 */
  alive.forEach(function (h) {
    h.evo.fed = 0;
    var best = -1, bd = Math.max(cellW, cellH) * 1.25;
    EVO.food.forEach(function (f, i) { var dd = Math.hypot(f.x - h.x, f.y - h.y); if (dd < bd) { bd = dd; best = i; } });
    if (best >= 0) { var f = EVO.food.splice(best, 1)[0]; h.evo.fed = 1; if (Math.random() < .5) act(h, 'evoEat', { dir: f.x > h.x ? 1 : -1 }); }
  });
  /* 死：衰老、拥挤、不适应 */
  alive.forEach(function (h) {
    var e = h.evo, L = EVO_LIFE[h.g.sp] || { r: 0, l: 1 }, F = evoFit(h.g, evoClimateOf(h));
    e.age++; e.fit = F.f;
    var nb = evoNear(h).filter(evoLive).length, life = 4 + 4 * F.f + L.l;
    var p = .03 + Math.max(0, 1.05 - F.f) * .38 + (nb >= 7 ? .22 : nb >= 6 ? .1 : 0) + (e.age > life ? .45 : 0) - (e.fed ? .1 : 0);
    if (Math.random() < p) evoKill(h, e.age > life ? 'old' : 'unfit');
  });
  /* 生：挨着的配对，孤单的克隆 */
  var born = 0, news = [];
  alive.filter(evoLive).sort(function () { return Math.random() - .5; }).forEach(function (h) {
    var e = h.evo; if (e.age < 1) return;
    var L = EVO_LIFE[h.g.sp] || { r: 0 };
    var pr = clamp(.16 + .3 * e.fit + L.r + (e.fed ? .35 : 0), .05, .95);
    if (Math.random() > pr) return;
    var near = evoNear(h), room = near.filter(evoEmpty); if (!room.length) return;
    var mates = near.filter(function (o) { return evoLive(o) && o.evo.age >= 1 && evoCanMate(h, o); }), mate = mates.length ? evoRand(mates) : null;
    if (!mate && L.noClone) return;
    var dna, how, mut = null, mutP = (mate ? 0 : .28) + (e.mutagen ? .6 : 0);
    if ((EVO_LIFE[h.g.sp] || {}).mut) mutP = mutP * 3 + .1;
    if (mate) { var res = evoCross(h.dna, mate.dna); dna = res.dna; how = res.mutated ? 'mutant' : 'cross'; }
    else { dna = h.g.natural ? h.dna.slice() : h.dna.slice(0, 7); how = 'clone'; }
    if (Math.random() < mutP) { mut = evoMutate(dna); how = 'mutant'; }
    var cell = evoRand(room);
    evoBirth(cell, dna, h, mate, how, 120 + Math.random() * 700 / Math.max(1, EVO.speed));
    news.push({ dna: dna, mom: h, dad: mate, how: how, mut: mut });
    e.mutagen = 0; born++;
  });
  setTimeout(function () { evoCensus(news); }, 900 / Math.max(1, EVO.speed));
}

/* ========== 六、普查与物种志 ========== */
var EVO_EPITAPH = [
  ['它们最后一只死前还在数云。', 'The last one was counting clouds.'],
  ['化石会记住它们的。', 'The fossils will remember.'],
  ['谁也没来得及给它们拍张照。', 'Nobody got a photo.'],
  ['缸里安静了一点。', 'The tank is a little quieter.'],
  ['也许哪天还会再长出来。', 'Maybe they’ll evolve again one day.']
];
function evoLog(zh, en, kind) {
  EVO.journal.unshift({ gen: EVO.gen, zh: zh, en: en, kind: kind || '' });
  if (EVO.journal.length > 60) EVO.journal.length = 60;
  evoRenderJournal();
}
function evoVariantOf(h) { if (!h._evoV || h._evoV.code !== h.code) h._evoV = { code: h.code, v: evoName(h.g) }; return h._evoV.v; }
function evoCensus(news) {
  if (!EVO.on) return;
  var counts = {}, sample = {}, alive = heads.filter(evoLive);
  alive.forEach(function (h) { var v = evoVariantOf(h); counts[v.key] = (counts[v.key] || 0) + 1; sample[v.key] = sample[v.key] || { v: v, h: h }; });
  var C = EVO.climate, logged = 0;
  /* 新变种 */
  Object.keys(counts).forEach(function (k) {
    var L = EVO.lineage[k];
    if (!L) {
      var s = sample[k];
      L = EVO.lineage[k] = { v: s.v, first: EVO.gen, peak: 0, n: 0, dna: s.h.dna.slice(), look: s.h.look, gone: false, parents: [] };
      var bn = news.filter(function (b) { return evoName(composeGenes(b.dna)).key === k; })[0];
      if (bn) { L.parents = [evoVariantOf(bn.mom).key].concat(bn.dad ? [evoVariantOf(bn.dad).key] : []); L.how = bn.how; }
      else if (s.h.evo && s.h.evo.how === 'drop') L.how = 'drop';
      if (s.v.hybrid && logged < 2 && EVO.gen > 0) {
        if (bn) {
          var M = evoVariantOf(bn.mom), D = bn.dad ? evoVariantOf(bn.dad) : null;
          if (bn.mut && bn.mut.natural) {
            var nm = function (k2) { return typeof QX_PACKS !== 'undefined' ? QX_PACKS.short(k2) : k2; };
            if (bn.mut.natural === 'gain') evoLog('一次突变：' + M.zh + '的孩子身上冒出了' + nm(bn.mut.to) + '的招牌——' + s.v.zh + '诞生了。', 'A mutation: a ' + M.en + '’s child sprouted the mark of ' + ((NATURAL_INFO[bn.mut.to] || {}).en || bn.mut.to) + ' — the first ' + s.v.en + '.', 'new');
            else evoLog('一次突变：' + M.zh + '的孩子' + (bn.mut.natural === 'lost' ? '丢了' + nm(bn.mut.from) + '的血统' : '换了一身花色') + '。', 'A mutation: a ' + M.en + '’s child ' + (bn.mut.natural === 'lost' ? 'lost its borrowed mark.' : 'changed colour.'), 'new');
          } else if (bn.mut) {
            var part = [['头', 'head'], ['耳朵', 'ears'], ['眼睛', 'eyes'], ['鼻子和嘴', 'nose and mouth'], ['毛发', 'hair'], ['花纹', 'markings'], ['打扮', 'outfit']][bn.mut.locus];
            evoLog('一次突变：' + M.zh + '的孩子' + part[0] + '长成了' + ((EVO_FULL[bn.mut.to] || [])[0] || (typeof LEGACY_LABELS !== 'undefined' && LEGACY_LABELS[bn.mut.to]) || bn.mut.to) + '的样子——' + s.v.zh + '诞生了。',
              'A mutation: a ' + M.en + '’s child grew the ' + part[1] + ' of a ' + (SPNAME[bn.mut.to] || bn.mut.to) + ' — the first ' + s.v.en + '.', 'new');
          } else if (D) evoLog((M.key === D.key ? '两只' + M.zh : M.zh + '和' + D.zh) + '生下了第一只' + s.v.zh + '。', (M.key === D.key ? 'Two ' + M.en + 's' : 'A ' + M.en + ' and a ' + D.en) + ' had the first ' + s.v.en + '.', 'new');
          else evoLog('第一只' + s.v.zh + '出现了。', 'The first ' + s.v.en + ' appears.', 'new');
          logged++;
        }
      }
    }
    L.n = counts[k]; L.peak = Math.max(L.peak, L.n); L.gone = false;
    if (L.n >= 6 && !L.bloom) { L.bloom = true; var F = evoFit(sample[k].h.g, C); evoLog(L.v.zh + '在' + EVO_CLIMATES[C].zh + '站稳了脚跟（' + L.n + ' 只）' + (F.best && C !== 'temperate' ? '：' + F.best[1] + '。' : '。'), 'The ' + L.v.en + ' takes hold in the ' + EVO_CLIMATES[C].en.toLowerCase() + ' (' + L.n + ')' + (F.best && C !== 'temperate' ? ': ' + F.best[2] + '.' : '.'), 'bloom'); }
  });
  /* 灭绝 */
  Object.keys(EVO.lineage).forEach(function (k) {
    var L = EVO.lineage[k];
    if (counts[k] || L.gone) return;
    L.n = 0; L.gone = true;
    if (L.peak >= 3) { var ep = evoRand(EVO_EPITAPH), F = evoFit(composeGenes(L.dna), C); evoLog(L.v.zh + '灭绝了' + (F.worst ? '（' + F.worst[1] + '）' : '') + '。' + ep[0], 'The ' + L.v.en + ' is extinct' + (F.worst ? ' (' + F.worst[2] + ')' : '') + '. ' + ep[1], 'gone'); }
  });
  /* 霸主易位 */
  var top = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
  if (top && top !== EVO.dominant && counts[top] >= 4) {
    EVO.dominant = top; var TL = EVO.lineage[top];
    evoLog(TL.v.zh + '成了缸里最多的生物（' + counts[top] + ' 只）。', 'The ' + TL.v.en + ' is now the most common creature (' + counts[top] + ').', 'top');
  }
  if (!alive.length && EVO.gen > 0) evoLog('缸里空了。点空格，重新投放。', 'The tank is empty. Tap a cell to start again.', 'gone');
  [10, 30, 60, 100, 200].forEach(function (m) {
    if (EVO.gen === m) { var nk = Object.keys(counts).length; evoLog('第 ' + m + ' 代。缸里有 ' + nk + ' 种生物、' + alive.length + ' 只。' + (nk >= 6 ? '热闹得很。' : nk === 1 ? '只剩一家独大。' : nk === 0 ? '缸空了。' : ''), 'Generation ' + m + '. ' + nk + ' kinds, ' + alive.length + ' creatures.', 'mile'); }
  });
  EVO.hist.push({ gen: EVO.gen, c: counts, n: alive.length });
  if (EVO.hist.length > 80) EVO.hist.shift();
  evoRenderStats();
}

/* ========== 七、投放、喂食、陨石、气候 ========== */
function evoDrop(h, sp) {
  if (!evoEmpty(h)) return;
  clearActs(h);
  h.setDNA(evoFounderDNA(sp || EVO.pick), null);
  h.hidden = false; h.pop = 0; h.yaw = 0; h.pitch = 0; h.parents = null;
  h.evo = { age: 1, born: EVO.gen, fit: evoFit(h.g, evoClimateOf(h)).f, how: 'drop', fed: 0 };
  cardBio(h.dna, evoBio('drop', h)); h._id = null;
  act(h, 'evoDrop');
  EVO.drops++;
  var v = evoVariantOf(h);
  if (EVO.drops <= 12 || EVO.drops % 10 === 0) evoLog('投下了一只' + v.zh + '。', 'Dropped in a ' + v.en + '.', 'drop');
  setTimeout(function () { evoCensus([]); }, 950);
}
function evoScatter(x, y) {
  var now = performance.now();
  if (EVO.lastSeed && now - EVO.lastSeed < 45) return;
  EVO.lastSeed = now;
  if (EVO.food.length > 70) EVO.food.shift();
  EVO.food.push({ x: x + (Math.random() - .5) * 14, y: y + (Math.random() - .5) * 14, gen: EVO.gen, t0: now, k: (Math.random() * 3) | 0, r: Math.random() * TAU });
  if (SOUND && allow('evoSeed', 90, 2)) try { tone({ f: 1400 + Math.random() * 600, dur: .05, gain: .02, type: 'triangle' }); } catch (e) {}
}
function evoMeteor(x, y) {
  var now = performance.now(), fall = reduceMotion() ? 120 : 650;
  EVO.meteors.push({ x: x, y: y, t0: now, fall: fall });
  if (SOUND) try { SFX.whoosh(clamp(x / W * 1.6 - .8, -.8, .8), .6); } catch (e) {}
  setTimeout(function () {
    if (!EVO.on) return;
    var R = Math.max(cellW, cellH) * 1.25, hit = 0, near = 0;
    QUAKE = { t0: performance.now(), dur: 700, cracks: [] };
    if (SOUND) try { SFX.thunk(0); noise({ dur: .5, filter: 'lowpass', ff: 700, ff2: 120, gain: .35 }); } catch (e) {}
    for (var i = 0; i < 26; i++) { var a = Math.random() * TAU, v = 80 + Math.random() * 220; particles.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, l: 0, ml: .6 + Math.random() * .6, r: 2 + Math.random() * 4, col: evoRand(['#e8742f', '#f2b140', '#6e6258', '#a0948a']) }); }
    EVO.craters.push({ x: x, y: y, r: R * .55, gen: EVO.gen });
    heads.forEach(function (h) {
      if (!evoLive(h)) return;
      var dx = h.x - x, dy = h.y - y, dd = Math.hypot(dx, dy);
      if (dd < R) { hit++; evoKill(h, 'meteor', { dx: dx / (dd || 1), dy: Math.min(-.3, dy / (dd || 1)) }); }
      else if (dd < R * 2.2) { near++; h.evo.mutagen = 1; act(h, 'cower', { dir: x > h.x ? 1 : -1 }); }
    });
    EVO.food = EVO.food.filter(function (f) { return Math.hypot(f.x - x, f.y - y) > R; });
    evoLog('天降陨石！' + (hit ? hit + ' 只没来得及跑。' : '没砸中谁。') + (near ? '附近 ' + near + ' 只受了辐射——它们的孩子会有点怪。' : ''),
      'Meteor strike! ' + (hit ? hit + ' didn’t get away. ' : 'Nobody hit. ') + (near ? near + ' nearby got a dose — their children will be odd.' : ''), 'meteor');
    setTimeout(function () { evoCensus([]); }, 1300);
  }, fall);
}
function evoSetClimate(c) {
  if (!EVO_CLIMATES[c] || c === EVO.climate) return;
  EVO.cPrev = EVO.climate; EVO.climate = c; EVO.cT = performance.now();
  var alive = heads.filter(evoLive), best = null, worst = null;
  alive.forEach(function (h) { var f = evoFit(h.g, c).f; if (!best || f > best[0]) best = [f, h]; });
  alive.forEach(function (h) { var f = evoFit(h.g, c).f; if (best && evoVariantOf(h).key === evoVariantOf(best[1]).key) return; if (!worst || f < worst[0]) worst = [f, h]; });
  var CI = EVO_CLIMATES[c];
  if (best && worst && worst[0] < best[0] - .05) {
    var bf = evoFit(best[1].g, c), wf = evoFit(worst[1].g, c);
    evoLog('气候变成了' + CI.zh + '。' + evoVariantOf(best[1]).zh + '最自在' + (bf.best ? '（' + bf.best[1] + '）' : '') + '，' + evoVariantOf(worst[1]).zh + CI.suffer[0] + (wf.worst ? '（' + wf.worst[1] + '）' : '') + '。',
      'The climate turns ' + CI.en.toLowerCase() + '. The ' + evoVariantOf(best[1]).en + ' is happiest' + (bf.best ? ' (' + bf.best[2] + ')' : '') + '; the ' + evoVariantOf(worst[1]).en + ' ' + CI.suffer[1] + (wf.worst ? ' (' + wf.worst[2] + ')' : '') + '.', 'climate');
  } else evoLog('气候变成了' + CI.zh + '。', 'The climate turns ' + CI.en.toLowerCase() + '.', 'climate');
  if (SOUND) try { SFX.swish(); } catch (e) {}
  evoSyncPanel();
}

/* ========== 八、每帧：模拟时钟、心情、气候、食物、陨石 ========== */
/* 空格子什么都不画（地震时身体会被弹簧"晃出来"，所以在绘制这一层也拦一下） */
['drawBodyAt', 'drawHeadAt'].forEach(function (fn) {
  var base = Head.prototype[fn];
  Head.prototype[fn] = function () { if (EVO.on && this.hidden && !this.evoDying && this.pop < .04) return; return base.apply(this, arguments); };
});
var evoBaseUpdate = Head.prototype.update;
Head.prototype.update = function (dt, now, look) {
  var o = evoBaseUpdate.apply(this, arguments);
  if (!EVO.on) return o;
  if (this.hidden && !this.evoDying) { this.pop = Math.max(0, this.pop - dt * 4); return o; }
  if (!this.evo || this.evoDying) return o;
  var f = this.evo.fit, C = evoClimateOf(this), tt = now / 1000 + this.col * .7;
  if (f < .8) {
    var e = clamp((.8 - f) / .4, 0, 1) * (reduceMotion() ? .4 : 1);
    if (C === 'snow') { o.ox += Math.sin(now / 28) * .018 * e; o.brow = Math.max(o.brow || 0, .6 * e); o.smile = lerp(o.smile, -.5, e); }
    else if (C === 'desert') { o.sweat = Math.max(o.sweat || 0, .9 * e); o.mouth = Math.max(o.mouth, (.25 + .15 * Math.sin(now / 110)) * e); }
    else if (C === 'night') { o.eye = Math.max(o.eye, .5 * e); o.gazeX = Math.sin(tt * 2.1) * e; o.brow = Math.max(o.brow || 0, .5 * e); }
    else if (C === 'sea') { o.mouth = Math.max(o.mouth, (.2 + .2 * Math.abs(Math.sin(now / 240))) * e); o.dizzy = Math.max(o.dizzy || 0, .4 * e); }
  } else if (f > 1.15) o.smile = lerp(o.smile, 1, clamp((f - 1.15) / .3, 0, 1) * .7);
  return o;
};
function evoTick(dt) {
  if (!EVO.on || !EVO.speed || cardOpen || (typeof PHOTO !== 'undefined' && PHOTO.active)) return;
  EVO.acc += Math.min(dt, .25) * 1000 * EVO.speed;
  if (EVO.acc >= EVO_GEN_MS) { EVO.acc = 0; evoGeneration(); evoSyncPanel(); }
}
function evoClimateLayer(c, al, now) {
  if (al <= .01) return;
  var t = now / 1000, i;
  ctx.save();
  if (c === 'snow') {
    ctx.globalAlpha = al; ctx.fillStyle = 'rgba(214,230,246,.34)'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    var n = reduceMotion() ? 30 : 70;
    for (i = 0; i < n; i++) { var sx = ((i * 97.3 + t * (6 + i % 4 * 3) + Math.sin(t * .6 + i) * 18) % W + W) % W, sy = (i * 53.7 + t * (18 + i % 5 * 7)) % H; ctx.globalAlpha = al * (.55 + .35 * (i % 3) / 2); ctx.beginPath(); ctx.arc(sx, sy, 1.4 + (i % 4) * .7, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = al * .5; var gs = ctx.createLinearGradient(0, H * .82, 0, H); gs.addColorStop(0, 'rgba(255,255,255,0)'); gs.addColorStop(1, 'rgba(250,252,255,.9)'); ctx.fillStyle = gs; ctx.fillRect(0, H * .82, W, H * .18);
  } else if (c === 'desert') {
    ctx.globalAlpha = al; ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(246,206,140,.55)'; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
    var sun = ctx.createRadialGradient(W * .86, H * .08, 0, W * .86, H * .08, Math.max(W, H) * .35); sun.addColorStop(0, 'rgba(255,240,190,.55)'); sun.addColorStop(1, 'rgba(255,240,190,0)'); ctx.fillStyle = sun; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(190,140,80,.18)'; ctx.lineWidth = 1.2;
    for (i = 0; i < 5; i++) { var hy = H * (.25 + i * .16); ctx.beginPath(); for (var x = 0; x <= W; x += 16) { var yy = hy + Math.sin(x / 38 + t * 2 + i) * 2.5; if (x) ctx.lineTo(x, yy); else ctx.moveTo(x, yy); } ctx.stroke(); }
  } else if (c === 'night') {
    ctx.globalAlpha = al; ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(70,86,140,.75)'; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(255,248,220,.9)';
    for (i = 0; i < 40; i++) { var tw = .4 + .6 * Math.abs(Math.sin(t * 1.3 + i * 2.1)); ctx.globalAlpha = al * tw * .8; ctx.fillRect((i * 131.7) % W, (i * 71.3) % (H * .9), 1.6, 1.6); }
    ctx.globalAlpha = al * .9; ctx.beginPath(); ctx.arc(W * .88, H * .1, 16, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(W * .88 + 7, H * .1 - 4, 14, 0, TAU); ctx.fill(); ctx.globalCompositeOperation = 'source-over';
    for (i = 0; i < 8; i++) { var fx = W * (.5 + .45 * Math.sin(t * .3 + i * 1.7)), fy = H * (.5 + .4 * Math.sin(t * .23 + i * 2.9)), fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, 9); fg.addColorStop(0, 'rgba(250,236,150,.9)'); fg.addColorStop(1, 'rgba(250,236,150,0)'); ctx.globalAlpha = al * (.5 + .5 * Math.sin(t * 3 + i)); ctx.fillStyle = fg; ctx.fillRect(fx - 9, fy - 9, 18, 18); }
  } else if (c === 'sea') {
    ctx.globalAlpha = al;
    var gw = ctx.createLinearGradient(0, H * .45, 0, H); gw.addColorStop(0, 'rgba(90,160,210,0)'); gw.addColorStop(1, 'rgba(70,140,200,.38)'); ctx.fillStyle = gw; ctx.fillRect(0, H * .45, W, H * .55);
    ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 1.4;
    for (i = 0; i < 3; i++) { var wy = H * (.84 + i * .055); ctx.beginPath(); for (var x2 = 0; x2 <= W; x2 += 12) { var y2 = wy + Math.sin(x2 / 30 + t * (1.6 + i * .3) + i) * 3; if (x2) ctx.lineTo(x2, y2); else ctx.moveTo(x2, y2); } ctx.stroke(); }
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1;
    for (i = 0; i < 14; i++) { var by = H - ((t * (22 + i % 4 * 9) + i * 67) % (H * .6)), bx = (i * 89.3 + Math.sin(t + i) * 8) % W; ctx.globalAlpha = al * .7; ctx.beginPath(); ctx.arc(bx, by, 2 + i % 3, 0, TAU); ctx.stroke(); }
  } else {
    ctx.globalAlpha = al; var gg = ctx.createLinearGradient(0, H * .7, 0, H); gg.addColorStop(0, 'rgba(150,196,120,0)'); gg.addColorStop(1, 'rgba(140,190,110,.22)'); ctx.fillStyle = gg; ctx.fillRect(0, H * .7, W, H * .3);
  }
  ctx.restore();
}
var EVO_FOOD_COL = ['#c9853c', '#8fb35a', '#d8574a'];
function evoDrawWorld(now) {
  var fade = Math.min(1, (now - EVO.cT) / 1200);
  if (EVO.cPrev && fade < 1) evoClimateLayer(EVO.cPrev, 1 - fade, now);
  evoClimateLayer(EVO.climate, EVO.cT ? fade : 1, now);
  ctx.save();
  EVO.craters.forEach(function (c) { var a = 1 - (EVO.gen - c.gen) / 4; ctx.globalAlpha = .35 * a; ctx.fillStyle = '#4a3b2e'; ctx.beginPath(); ctx.ellipse(c.x, c.y, c.r, c.r * .45, 0, 0, TAU); ctx.fill(); ctx.globalAlpha = .25 * a; ctx.strokeStyle = '#2d241c'; ctx.lineWidth = 2; ctx.stroke(); });
  EVO.food.forEach(function (f) {
    var age = Math.min(1, (now - f.t0) / 250); ctx.globalAlpha = age; ctx.fillStyle = EVO_FOOD_COL[f.k];
    ctx.beginPath(); ctx.ellipse(f.x, f.y - (1 - age) * 10, 3.2, 2.2, f.r, 0, TAU); ctx.fill();
    ctx.globalAlpha = age * .35; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(f.x - 1, f.y - 1 - (1 - age) * 10, .9, 0, TAU); ctx.fill();
  });
  if (EVO.tool === 'drop') {
    var pulse = heads.some(evoLive) ? .16 : .28 + .14 * Math.sin(now / 300);
    ctx.globalAlpha = pulse; ctx.strokeStyle = INK || '#3a342c'; ctx.lineWidth = 1.2; ctx.setLineDash([3, 4]);
    heads.forEach(function (h) { if (!evoEmpty(h) || h.pop > .05) return; var r = h.s * .55; ctx.beginPath(); ctx.arc(h.x, h.y, r, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(h.x - r * .35, h.y); ctx.lineTo(h.x + r * .35, h.y); ctx.moveTo(h.x, h.y - r * .35); ctx.lineTo(h.x, h.y + r * .35); ctx.stroke(); });
    ctx.setLineDash([]);
  }
  EVO.meteors = EVO.meteors.filter(function (m) { return now - m.t0 < m.fall + 400; });
  EVO.meteors.forEach(function (m) {
    var k = (now - m.t0) / m.fall;
    if (k <= 1) {
      var sx = m.x + W * .3 * (1 - k), sy = m.y - H * .7 * (1 - k), tx = sx + W * .08, ty = sy - H * .18;
      var g = ctx.createLinearGradient(sx, sy, tx, ty); g.addColorStop(0, 'rgba(255,200,110,.95)'); g.addColorStop(1, 'rgba(255,120,60,0)');
      ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(tx, ty); ctx.stroke();
      ctx.fillStyle = '#5a4b3e'; ctx.beginPath(); ctx.arc(sx, sy, 6, 0, TAU); ctx.fill();
    } else {
      var e = (now - m.t0 - m.fall) / 400, R = Math.max(cellW, cellH) * 1.25 * (.4 + e);
      var fg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, R); fg.addColorStop(0, 'rgba(255,236,170,' + (.9 * (1 - e)).toFixed(3) + ')'); fg.addColorStop(1, 'rgba(255,140,60,0)');
      ctx.globalAlpha = 1; ctx.fillStyle = fg; ctx.fillRect(m.x - R, m.y - R, R * 2, R * 2);
    }
  });
  ctx.restore();
}
var evoBaseGrid = drawGrid;
drawGrid = function (dt, now) {
  if (EVO.on) evoTick(dt);
  var r = evoBaseGrid.apply(this, arguments);
  if (!EVO.on || SUPER) return r;
  try { ctx = gctx; ctx.save(); ctx.setTransform(DPR, 0, 0, DPR, 0, 0); evoDrawWorld(now); ctx.restore(); } catch (e) { try { ctx.restore(); } catch (e2) {} }
  return r;
};
/* 换网格时：新出现的格子也是空的 */
var evoBaseLayout = layout;
layout = function () {
  var r = evoBaseLayout.apply(this, arguments);
  if (EVO.on) heads.forEach(function (h) { if (!h.evoSeen) { h.evoSeen = true; clearActs(h); h.hidden = true; h.evo = null; h.pop = 0; } });
  return r;
};

/* ========== 九、输入：生态缸开着时，舞台的点按归它 ========== */
function evoPoint(e) { var r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
window.addEventListener('pointerdown', function (e) {
  if (!EVO.on || e.target !== cv || cardOpen) return;
  e.stopImmediatePropagation(); e.preventDefault();
  var p = evoPoint(e), h = headAt(p.x, p.y);
  EVO.press = { id: e.pointerId, x: p.x, y: p.y };
  try { cv.setPointerCapture(e.pointerId); } catch (e2) {}
  if (EVO.tool === 'food') { evoScatter(p.x, p.y); return; }
  if (EVO.tool === 'meteor') { evoMeteor(p.x, p.y); return; }
  if (!h) return;
  if (evoEmpty(h)) evoDrop(h);
  else if (evoLive(h)) EVO.press.card = h;
}, true);
window.addEventListener('pointermove', function (e) {
  if (!EVO.on || !EVO.press || e.pointerId !== EVO.press.id) return;
  e.stopImmediatePropagation();
  var p = evoPoint(e);
  pointer.x = p.x; pointer.y = p.y; pointer.last = performance.now(); pointer.inside = true;
  if (EVO.tool === 'food') { var n = Math.max(1, Math.round(Math.hypot(p.x - EVO.press.x, p.y - EVO.press.y) / 18)); for (var i = 1; i <= n; i++) { EVO.lastSeed = 0; evoScatter(lerp(EVO.press.x, p.x, i / n), lerp(EVO.press.y, p.y, i / n)); } EVO.press.x = p.x; EVO.press.y = p.y; }
  else if (EVO.tool === 'drop') { var h = headAt(p.x, p.y); if (h && evoEmpty(h)) { EVO.press.card = null; evoDrop(h); } }
}, true);
function evoUp(e) {
  if (!EVO.on || !EVO.press || e.pointerId !== EVO.press.id) return;
  e.stopImmediatePropagation();
  var c = EVO.press.card; EVO.press = null;
  if (c && evoLive(c) && e.type === 'pointerup') openCard(c);
}
window.addEventListener('pointerup', evoUp, true);
window.addEventListener('pointercancel', evoUp, true);
window.addEventListener('dblclick', function (e) { if (EVO.on && e.target === cv) e.stopImmediatePropagation(); }, true);
/* 键：Esc 退出、空格暂停、1–5 换气候；会整缸换脸的键（N 新面孔、T 交换、V 消失、6–0、−/=）在缸里不响应 */
var EVO_BLOCK = { n: 1, t: 1, v: 1, '6': 1, '7': 1, '8': 1, '9': 1, '0': 1, '-': 1, '=': 1, '_': 1, '+': 1 };
window.addEventListener('keydown', function (e) {
  if (!EVO.on || cardOpen) return;
  var tag = (e.target && e.target.tagName) || '';
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
  var k = (e.key || '').toLowerCase();
  if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); e.stopImmediatePropagation(); return; }
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (k === 'escape') { e.preventDefault(); e.stopImmediatePropagation(); evoExit(); return; }
  if (k === ' ') { e.preventDefault(); e.stopImmediatePropagation(); evoSetSpeed(EVO.speed ? 0 : 1); return; }
  if (/^[1-5]$/.test(k)) { e.preventDefault(); e.stopImmediatePropagation(); evoSetClimate(EVO_CLIMATE_ORDER[+k - 1]); return; }
  if (EVO_BLOCK[k]) { e.preventDefault(); e.stopImmediatePropagation(); }
}, true);

/* ========== 十、面板 ========== */
UI_PAIRS.push(['投放进化', 'Evolution tank'], ['生态缸', 'Evolution tank'], ['投放', 'Drop'], ['喂食', 'Feed'], ['陨石', 'Meteor'], ['暂停', 'Pause'], ['物种志', 'Field notes'],
  ['退出', 'Exit'], ['随机', 'Random'], ['气候', 'Climate'], ['种群', 'Population'], ['收起', 'Hide'], ['展开', 'Show'], ['随机开局', 'Random start'],
  ['舞台变成一只生态缸：投放生物、换气候、撒食物、扔陨石，看几代之后长成什么样。', 'The stage becomes a tank: drop in creatures, change the climate, scatter food, throw meteors — and watch them evolve.'],
  ['温和', 'Mild'], ['雪原', 'Tundra'], ['沙漠', 'Desert'], ['夜林', 'Night forest'], ['海边', 'Seashore'], ['玩法', 'Modes']);
function evoEl(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
function evoBuildPanel() {
  if (EVO.panel) return EVO.panel;
  var st = document.createElement('style');
  st.textContent =
    '#evoPanel{position:fixed;right:12px;top:64px;z-index:46;width:272px;max-height:calc(100vh - 150px);display:flex;flex-direction:column;gap:8px;padding:10px 12px 12px;' +
    'background:rgba(250,246,238,.95);border:1px solid #d8cdb8;border-radius:14px;box-shadow:0 8px 28px rgba(60,48,30,.18);color:#3a342c;font:13px/1.45 system-ui,"PingFang SC","Noto Sans SC",sans-serif;overflow:auto;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}' +
    '#evoPanel[hidden]{display:none}#evoPanel.min>*:not(.evoHead){display:none}' +
    '#evoPanel .evoHead{display:flex;align-items:baseline;gap:8px}#evoPanel .evoHead b{font-size:15px}#evoPanel .evoHead .evoGen{margin-left:auto;font-variant-numeric:tabular-nums;opacity:.75;font-size:12px}' +
    '#evoPanel .evoRow{display:flex;flex-wrap:wrap;gap:4px;align-items:center}#evoPanel .evoRow>span.evoLab{font-size:11px;opacity:.6;width:100%}' +
    '#evoPanel button{font:inherit;font-size:12px;border:1px solid #d3c7b2;background:#fffdf8;color:inherit;border-radius:999px;padding:4px 9px;cursor:pointer;min-height:30px}' +
    '#evoPanel button.on{background:#3a342c;color:#fffdf4;border-color:#3a342c}#evoPanel button:focus-visible{outline:2px solid #c2412d;outline-offset:1px}' +
    '#evoPanel .evoTray{display:grid;grid-template-columns:repeat(8,1fr);gap:3px}' +
    '#evoPanel .evoTray button{display:flex;flex-direction:column;align-items:center;gap:0;border-radius:8px;padding:2px 0;min-width:0;min-height:0}' +
    '#evoPanel .evoTray canvas{width:26px;height:26px;border-radius:50%}#evoPanel .evoTray span{font-size:10px;white-space:nowrap;overflow:hidden;max-width:100%}' +
    '#evoPanel .evoBlurb{font-size:12px;opacity:.8;min-height:34px}' +
    '#evoPanel canvas.evoChart{width:100%;height:64px;background:#f3ecdf;border-radius:8px}' +
    '#evoPanel ol.evoTop{margin:0;padding:0;list-style:none;font-size:12px}#evoPanel ol.evoTop li{display:flex;align-items:center;gap:6px}#evoPanel ol.evoTop i{display:inline-block;width:9px;height:9px;border-radius:50%}' +
    '#evoPanel ol.evoTop em{margin-left:auto;font-style:normal;font-variant-numeric:tabular-nums;opacity:.7}' +
    '#evoPanel ul.evoLog{margin:0;padding:0;list-style:none;font-size:12px;max-height:190px;overflow:auto;border-top:1px dashed #d8cdb8;padding-top:6px}' +
    '#evoPanel ul.evoLog li{margin:0 0 5px}#evoPanel ul.evoLog li b{font-weight:600;opacity:.55;margin-right:4px;font-variant-numeric:tabular-nums}' +
    '#evoPanel ul.evoLog li.k-gone{color:#8a4a3a}#evoPanel ul.evoLog li.k-new{color:#2c5da3}#evoPanel ul.evoLog li.k-meteor{color:#b0501f}#evoPanel ul.evoLog li.k-top{color:#3f7a55}' +
    'body.evo-on #stageCue{display:none}' +
    '@media(max-width:640px){#evoPanel{left:8px;right:8px;top:auto;bottom:8px;width:auto;max-height:38vh;gap:6px;padding:8px 10px;border-radius:14px 14px 10px 10px}' +
    '#evoPanel .evoBlurb,#evoPanel canvas.evoChart,#evoPanel ol.evoTop,#evoPanel .evoRow>span.evoLab{display:none}#evoPanel ul.evoLog{max-height:58px}#evoPanel button{min-height:32px}}' +
    '@media(prefers-color-scheme:dark){#evoPanel{background:rgba(40,36,31,.95);color:#efe7d8;border-color:#5a5044}#evoPanel button{background:#2f2a24;border-color:#5a5044}#evoPanel button.on{background:#efe7d8;color:#2f2a24}#evoPanel canvas.evoChart{background:#2f2a24}}';
  document.head.appendChild(st);
  var P = evoEl('section'); P.id = 'evoPanel'; P.hidden = true; P.setAttribute('aria-label', uiText('生态缸'));
  var head = evoEl('div', 'evoHead'); head.appendChild(evoEl('b', '', uiText('生态缸')));
  var gen = evoEl('span', 'evoGen'); head.appendChild(gen);
  var mini = evoEl('button', '', '–'); mini.type = 'button'; mini.title = uiText('收起'); mini.style.minHeight = '24px'; mini.style.padding = '0 8px';
  mini.addEventListener('click', function () { P.classList.toggle('min'); mini.textContent = P.classList.contains('min') ? '+' : '–'; mini.title = uiText(P.classList.contains('min') ? '展开' : '收起'); });
  head.appendChild(mini); P.appendChild(head);
  var mk = function (label, list, onClick) {
    var row = evoEl('div', 'evoRow'); if (label) row.appendChild(evoEl('span', 'evoLab', uiText(label)));
    var btns = {};
    list.forEach(function (it) { var b = evoEl('button', '', it[1]); b.type = 'button'; if (it[2]) b.title = it[2]; b.addEventListener('click', function () { onClick(it[0]); }); row.appendChild(b); btns[it[0]] = b; });
    P.appendChild(row); return btns;
  };
  var tools = mk('', [['drop', '⬇ ' + uiText('投放')], ['food', '✿ ' + uiText('喂食')], ['meteor', '☄ ' + uiText('陨石')]], function (t) { EVO.tool = t; evoSyncPanel(); });
  var tray = evoEl('div', 'evoTray'), blurb = evoEl('div', 'evoBlurb'), trayBtns = {};
  var addChip = function (sp, zh, en) {
    var b = evoEl('button'); b.type = 'button';
    var c = evoEl('canvas');
    if (sp === 'random') { c.width = c.height = 52; var cx = c.getContext('2d'); cx.fillStyle = '#e9dfcc'; cx.beginPath(); cx.arc(26, 26, 25, 0, TAU); cx.fill(); cx.fillStyle = '#3a342c'; cx.font = '600 30px serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('?', 26, 28); }
    else try { miniPortrait(c, pureDNA(evoFounderSeed(sp)), 26, .3); } catch (e) {}
    b.appendChild(c); b.appendChild(evoEl('span', '', evoL(zh, en))); b.title = evoL(zh, en);
    b.addEventListener('click', function () { EVO.pick = sp; EVO.tool = 'drop'; evoSyncPanel(); });
    tray.appendChild(b); trayBtns[sp] = b;
  };
  addChip('random', '随机', 'Random');
  EVO_FOUNDERS.forEach(function (F) { addChip(F[0], (EVO_FULL[F[0]] || [(typeof LEGACY_LABELS !== 'undefined' && LEGACY_LABELS[F[0]]) || F[0]])[0], cap(SPNAME[F[0]] || F[0])); });
  P.appendChild(tray); P.appendChild(blurb);
  var climates = mk('气候', EVO_CLIMATE_ORDER.map(function (c, i) { var C = EVO_CLIMATES[c]; return [c, C.glyph + ' ' + evoL(C.zh, C.en), (i + 1) + '']; }), function (c) { evoSetClimate(c); });
  var speeds = mk('', [[0, '❚❚ ' + uiText('暂停')], [1, '1×'], [3, '3×'], ['seed', uiText('随机开局')]], function (s) { if (s === 'seed') evoRandomStart(); else evoSetSpeed(s); });
  var chart = evoEl('canvas', 'evoChart'); P.appendChild(chart);
  var top = evoEl('ol', 'evoTop'); P.appendChild(top);
  P.appendChild(evoEl('span', 'evoLab', uiText('物种志'))).style.cssText = 'font-size:11px;opacity:.6';
  var log = evoEl('ul', 'evoLog'); log.setAttribute('aria-live', 'polite'); P.appendChild(log);
  var exit = mk('', [['exit', '✕ ' + uiText('退出') + ' (Esc)']], function () { evoExit(); });
  exit.exit.style.marginLeft = 'auto';
  document.body.appendChild(P);
  EVO.panel = { el: P, gen: gen, tools: tools, tray: trayBtns, blurb: blurb, climates: climates, speeds: speeds, chart: chart, top: top, log: log };
  return EVO.panel;
}
function evoSetSpeed(s) { EVO.speed = s; evoSyncPanel(); }
function evoSyncPanel() {
  var p = EVO.panel; if (!p) return;
  var alive = heads.filter(evoLive).length;
  p.gen.textContent = evoL('第 ' + EVO.gen + ' 代 · ' + alive + ' 只', 'Gen ' + EVO.gen + ' · ' + alive);
  Object.keys(p.tools).forEach(function (k) { p.tools[k].classList.toggle('on', EVO.tool === k); });
  Object.keys(p.tray).forEach(function (k) { p.tray[k].classList.toggle('on', EVO.tool === 'drop' && EVO.pick === k); });
  Object.keys(p.climates).forEach(function (k) { p.climates[k].classList.toggle('on', EVO.climate === k); });
  Object.keys(p.speeds).forEach(function (k) { p.speeds[k].classList.toggle('on', String(EVO.speed) === k); });
  var F = EVO_FOUNDERS.filter(function (f) { return f[0] === EVO.pick; })[0];
  p.blurb.textContent = EVO.tool === 'food' ? evoL('在舞台上拖动撒食物：吃到的会多生孩子、少生病。', 'Drag across the stage to scatter food: fed creatures breed more and live longer.')
    : EVO.tool === 'meteor' ? evoL('点哪砸哪。砸中的飞走，附近幸存的会生出怪孩子。', 'Tap to strike. The hit fly off; survivors nearby have odd children.')
    : F ? F[evoEn() ? 2 : 1] : evoL('点空格投放；点已有的生物看它的卡片。', 'Tap an empty cell to drop one in; tap a creature to see its card.');
}
function evoRenderJournal() {
  var p = EVO.panel; if (!p) return;
  p.log.innerHTML = '';
  EVO.journal.slice(0, 30).forEach(function (j) { var li = evoEl('li', 'k-' + j.kind); li.appendChild(evoEl('b', '', j.gen)); li.appendChild(document.createTextNode(evoEn() ? j.en : j.zh)); p.log.appendChild(li); });
}
function evoRenderStats() {
  var p = EVO.panel; if (!p) return;
  evoSyncPanel();
  var last = EVO.hist[EVO.hist.length - 1] || { c: {} }, keys = Object.keys(last.c).sort(function (a, b) { return last.c[b] - last.c[a]; });
  p.top.innerHTML = '';
  keys.slice(0, 5).forEach(function (k) {
    var L = EVO.lineage[k], li = evoEl('li'), dot = evoEl('i'); dot.style.background = 'hsl(' + L.v.hue + ',55%,55%)';
    li.appendChild(dot); li.appendChild(document.createTextNode(evoLabel(L.v))); li.appendChild(evoEl('em', '', last.c[k])); p.top.appendChild(li);
  });
  /* 种群曲线：前五名各一条色带叠起来，其余灰 */
  var cv2 = p.chart, dpr = Math.min(2, window.devicePixelRatio || 1), w = cv2.clientWidth || 248, h = 64;
  cv2.width = w * dpr; cv2.height = h * dpr;
  var x = cv2.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, h);
  var H2 = EVO.hist; if (H2.length < 2) return;
  var cap = Math.max(heads.length, 1), topK = keys.slice(0, 5), n = H2.length;
  var layers = topK.concat(['_rest']);
  var base = H2.map(function () { return 0; });
  layers.forEach(function (k) {
    var ys = H2.map(function (s, i) { var v = k === '_rest' ? s.n - topK.reduce(function (a, t) { return a + (s.c[t] || 0); }, 0) : (s.c[k] || 0); return base[i] + v; });
    x.beginPath();
    ys.forEach(function (v, i) { var px = i / (n - 1) * w, py = h - v / cap * (h - 4); if (i) x.lineTo(px, py); else x.moveTo(px, py); });
    for (var i = n - 1; i >= 0; i--) x.lineTo(i / (n - 1) * w, h - base[i] / cap * (h - 4));
    x.closePath(); x.fillStyle = k === '_rest' ? 'rgba(150,140,125,.45)' : 'hsla(' + EVO.lineage[k].v.hue + ',55%,55%,.85)'; x.fill();
    base = ys;
  });
}

/* ========== 十一、进出 ========== */
function evoRandomStart() {
  var empties = heads.filter(evoEmpty).sort(function () { return Math.random() - .5; });
  var sps = EVO_FOUNDERS.map(function (f) { return f[0]; }).sort(function () { return Math.random() - .5; }).slice(0, 4);
  sps.forEach(function (sp, i) {
    var a = empties.shift(); if (!a) return;
    setTimeout(function () { evoDrop(a, sp); var b = evoNear(a).filter(evoEmpty)[0]; if (b) setTimeout(function () { evoDrop(b, sp); }, 180); }, i * 380);
  });
}
function evoEnter() {
  if (EVO.on) return;
  if (typeof CLASS !== 'undefined' && CLASS.active) { toast(evoL('班级人像里不开生态缸——先退出班级人像。', 'Leave class portraits first.'), 2200); return; }
  if (SUPER || (typeof PHOTO !== 'undefined' && PHOTO.active)) { toast(evoL('先结束当前的表演，再打开生态缸。', 'Finish the current show first.'), 2000); return; }
  if (typeof BRUSH !== 'undefined' && BRUSH) try { endBrush(); } catch (e) {}
  if (breedFrom) cancelBreed();
  EVO.on = true; EVO.gen = 0; EVO.acc = 0; EVO.speed = 1; EVO.tool = 'drop'; EVO.pick = 'random'; EVO.food = []; EVO.meteors = []; EVO.craters = [];
  EVO.lineage = {}; EVO.hist = []; EVO.journal = []; EVO.dominant = null; EVO.births = EVO.deaths = EVO.drops = 0; EVO.cPrev = null; EVO.cT = 0;
  exitAll();
  heads.forEach(function (h) { h.evoSeen = true; h.hidden = true; h.evo = null; h.evoDying = false; h.evoReserved = false; });
  document.body.classList.add('evo-on');
  var p = evoBuildPanel(); p.el.hidden = false; evoRenderJournal(); evoRenderStats();
  evoLog('生态缸打开了。点空格投放生物；挨着的会生孩子，不适应的会消失。', 'The tank is open. Tap empty cells to drop creatures in; neighbours breed, the unfit fade away.', 'mile');
  toast(evoL('点空格，把生物投进生态缸', 'Tap an empty cell to drop a creature in'), 2600);
  if (SOUND) try { SFX.whoosh(0, .6); } catch (e) {}
}
function evoExit() {
  if (!EVO.on) return;
  var kinds = Object.keys(EVO.lineage).length, gen = EVO.gen;
  EVO.on = false; EVO.press = null;
  document.body.classList.remove('evo-on');
  if (EVO.panel) EVO.panel.el.hidden = true;
  heads.forEach(function (h, i) {
    delete h.evoSeen; h.evoReserved = false;
    if (h.hidden || h.evoDying) { clearActs(h); h.evoDying = false; h.hidden = false; h.setDNA(randomDNA(), null); h.pop = 0; act(h, 'intro', { delay: 60 + Math.random() * 500, hideBefore: true }); }
    h.evo = null;
  });
  if (gen) toast(evoL('进化了 ' + gen + ' 代，出现过 ' + kinds + ' 种生物。它们留在了舞台上。', gen + ' generations, ' + kinds + ' kinds. The survivors stay on stage.'), 3200);
}
TRIG.evolve = function () { if (EVO.on) evoExit(); else evoEnter(); };
TRIG_NAMES.evolve = 'evolution tank';
KEYMAP['fun:ev'] = 'evolve';
KEYINFO['fun:ev'] = ['Evolution tank', 'The stage becomes a tank: drop in creatures, change the climate, scatter food, throw meteors — and watch them evolve.', 'action'];
(function evoEntries() {
  UI_PAIRS.push(['投放进化', 'Evolution tank']);
  if (typeof KBROWS !== 'undefined') { var row = KBROWS.filter(function (r) { return r.indexOf('fun:ff') >= 0; })[0]; if (row) row.push('fun:ev'); else KBROWS.push(['fun:ev']); }
  var menu = document.querySelector('.playMoreMenu');
  if (menu) {
    var lab = document.createElement('div'); lab.className = 'playLabel'; lab.style.cssText = 'margin:2px 0 0;font-size:11px;opacity:.7'; lab.textContent = uiText('玩法'); menu.appendChild(lab);
    var b = document.createElement('button'); b.type = 'button'; b.textContent = '❦ ' + uiText('投放进化'); b.title = uiText('舞台变成一只生态缸：投放生物、换气候、撒食物、扔陨石，看几代之后长成什么样。');
    b.addEventListener('click', function () { fire('evolve'); }); menu.appendChild(b);
  }
  var baseKb = buildKb;
  buildKb = function () {
    baseKb();
    Array.prototype.forEach.call(document.querySelectorAll('#kb .cap'), function (cap) {
      if (cap.firstChild && cap.firstChild.textContent === 'FUN:EV') { cap.firstChild.textContent = '❦'; cap.setAttribute('aria-label', uiText('投放进化')); }
    });
  };
})();
try { window.__evo = { get state() { return { on: EVO.on, gen: EVO.gen, climate: EVO.climate, alive: heads.filter(evoLive).length, kinds: Object.keys(EVO.lineage).length, food: EVO.food.length, journal: EVO.journal.slice(0, 8) }; },
  enter: evoEnter, exit: evoExit, drop: function (i, sp) { if (heads[i]) evoDrop(heads[i], sp); }, gen: function (n) { for (var i = 0; i < (n || 1); i++) { evoGeneration(); } evoCensus([]); },
  climate: evoSetClimate, meteor: evoMeteor, food: evoScatter, random: evoRandomStart, speed: evoSetSpeed, tool: function (t) { EVO.tool = t; evoSyncPanel(); } }; } catch (e) {}
