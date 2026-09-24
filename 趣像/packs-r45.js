/* 趣像 22 (r45): 角色包登记表 QX_PACKS
   ─────────────────────────────────────────────────────────────
   以前角色散在五六处登记（上游经典基因、studio 的 NATURAL_INFO、folklore/new-faces 的 folkAdd、atlas 的海洋与动画来客……），
   "一个系列"没有实体。这里把它们归成角色包：包只是"名单 + 元数据"，成员仍用原来的登记函数画，不搬代码、不重画。
     QX_PACKS.register({id, zh, en, blurb:{zh,en}, cover, members:[…], tags:[…], evolve:{genes, climate:{…}}, noTank})
     QX_PACKS.list / byId[id] / packOf(key) / dna(key, seed) / audit()
   首批包全部由现有登记自动生成（经典头像、五个民间系列、潮间带、动画来客、花园与异物）；
   生态缸托盘、角色包浏览器（"整包上台"）都从这里取名单。审计：每位成员能生成 DNA、有中文名、有两条以上特征、封面存在。 */

var QX_PACKS = {
  list: [], byId: {}, _of: {},
  register: function (p) {
    if (!p || !p.id || this.byId[p.id]) return null;
    p.members = (p.members || []).filter(function (k, i, a) { return a.indexOf(k) === i; });
    p.cover = p.cover || p.members[0];
    p.evolve = p.evolve || { genes: 'donor', climate: {} };
    this.list.push(p); this.byId[p.id] = p;
    var self = this; p.members.forEach(function (k) { if (!self._of[k]) self._of[k] = p.id; });
    return p;
  },
  packOf: function (key) { return this.byId[this._of[key]] || null; },
  isClassic: function (key) { return Object.prototype.hasOwnProperty.call(LEGACY_LABELS, key); },
  dna: function (key, seed) {
    seed = seed == null ? randSeed() : seed >>> 0;
    if (this.isClassic(key)) { for (var i = 0; i < 4000; i++) { if (baseGenes(seed).sp === key) return pureDNA(seed); seed = (seed + 1) >>> 0; } return pureDNA(seed); }
    return atlasDNA(key, seed);
  },
  name: function (key, en) {
    if (this.isClassic(key)) return en ? cap(SPNAME[key] || key) : ((typeof CARDZH_SP !== 'undefined' && CARDZH_SP[key]) || LEGACY_LABELS[key]);
    var info = NATURAL_INFO[key] || {};
    return en ? (info.en || info.name || key) : String(info.name || key);
  },
  short: function (key) { var P = this.packOf(key), parts = this.name(key, false).split(' · '); return parts.length > 1 && P && parts[0] === P.zh ? parts[1] : parts[0]; },
  audit: function () {
    var bad = [], self = this;
    this.list.forEach(function (p) {
      if (p.members.indexOf(p.cover) < 0) bad.push(p.id + ': cover');
      if (!p.zh || !p.en) bad.push(p.id + ': name');
      p.members.forEach(function (k) {
        var d = null; try { d = self.dna(k, 12345); } catch (e) {}
        if (!d) bad.push(p.id + '/' + k + ': dna');
        if (!self.isClassic(k)) { var info = NATURAL_INFO[k]; if (!info || !info.name) bad.push(p.id + '/' + k + ': name'); else if (!info.traits || info.traits.length < 2) bad.push(p.id + '/' + k + ': traits'); }
      });
    });
    return bad;
  }
};

(function packsBuild() {
  QX_PACKS.register({ id: 'classic', zh: '经典头像', en: 'Classic heads', cover: 'cat', tags: ['classic'],
    blurb: { zh: '人物、十二种动物、机器人和外星访客——七个基因座全开，是生态缸里进化的主角。', en: 'People, twelve animals, robots and visitors — all seven loci open; the stars of the evolution tank.' },
    members: ['human'].concat(ANIMALS, ODD), evolve: { genes: 'full', climate: {} } });
  var FOLK_META = {
    guofeng: { cover: 'folk_gourd_1', blurb: ['七个葫芦兄弟，一人一种本事。', 'Seven gourd brothers, one gift each.'], climate: {} },
    journey: { cover: 'west_monkey', blurb: ['取经路上的师徒、妖王与仙子。', 'Pilgrims, demon kings and immortals of the westward road.'], climate: { desert: .2, snow: -.1 } },
    shanhai: { cover: 'hill_fox', blurb: ['《山海经》里的异兽：九尾、毕方、白泽、烛龙……', 'Beasts from the Classic of Mountains and Seas.'], climate: { night: .15 } },
    yokai: { cover: null, blurb: ['住在隔壁的妖怪：座敷童子、猫又、提灯……', 'Yokai next door: zashiki-warashi, nekomata, lanterns…'], climate: { night: .25, desert: -.1 } },
    giants: { cover: null, blurb: ['欧洲与希腊神话：山怪、美杜莎、女武神、树精、牛头人……', 'European and Greek myth: trolls, Medusa, Valkyries, dryads, the Minotaur…'], climate: { snow: .2, sea: -.1 } }
  };
  Object.keys(FOLK_SERIES).forEach(function (sid) {
    var S = FOLK_SERIES[sid], M = FOLK_META[sid] || { blurb: ['', ''], climate: {} };
    QX_PACKS.register({ id: sid, zh: S.name, en: S.en, cover: M.cover || S.keys[0], members: S.keys.slice(), tags: ['folk'],
      blurb: { zh: M.blurb[0], en: M.blurb[1] }, evolve: { genes: 'donor', climate: M.climate } });
  });
  /* 其余 NATURAL_INFO 按 family 归包 */
  var FAM = { '潮间带': ['tidal', '潮间带', 'Tide pool', '虾兵蟹将、章鱼水母，只在海边如鱼得水。', 'Shrimp, crabs, octopus and jellies — at home only by the sea.', { sea: .4, desert: -.4, snow: -.2 }],
    '动画来客': ['cartoons', '动画来客', 'Cartoon guests', '从动画片里走出来的老朋友。', 'Old friends who stepped out of cartoons.', {}] };
  var groups = {};
  Object.keys(NATURAL_INFO).forEach(function (k) {
    if (FOLK_INFO[k]) return;
    var fam = String(NATURAL_INFO[k].family || '花园与异物').split(' · ')[0];
    (groups[fam] = groups[fam] || []).push(k);
  });
  Object.keys(groups).forEach(function (fam) {
    var F = FAM[fam] || ['garden', fam === '花园与异物' ? '花园与异物' : fam, fam === '花园与异物' ? 'Garden oddities' : fam, '银杏叶、仙人掌、蘑菇、茶壶和云——会眨眼的东西。', 'Ginkgo, cactus, mushroom, teapot and cloud — things that blink.', { temperate: .1 }];
    QX_PACKS.register({ id: F[0], zh: F[1], en: F[2], members: groups[fam], tags: ['nature'], blurb: { zh: F[3], en: F[4] }, evolve: { genes: 'donor', climate: F[5] } });
  });
  UI_PAIRS.push(['角色包', 'Character packs'], ['整包上台', 'Put the pack on stage'], ['经典头像', 'Classic heads'], ['潮间带', 'Tide pool'], ['动画来客', 'Cartoon guests'], ['花园与异物', 'Garden oddities']);
})();

/* 角色包浏览器：封面 + 介绍 + 成员；"整包上台"把舞台换成这一包（轮流填满） */
function packsStage(id) {
  var P = QX_PACKS.byId[id]; if (!P || !P.members.length) return;
  if (typeof EVO !== 'undefined' && EVO.on) { toast(qxLocal('先退出生态缸。', 'Leave the tank first.'), 1800); return; }
  if (cardOpen) closeCard();
  var scene = id === 'classic' ? 'cabinet' : id;
  if (typeof FOLK_SERIES !== 'undefined' && FOLK_SERIES[id] || ['cabinet', 'tidal', 'cartoons', 'garden'].indexOf(scene) >= 0) {
    try { applyStudioScene(scene); toast(qxLocal(P.zh + ' 上台了（' + P.members.length + ' 位）。', P.en + ' take the stage (' + P.members.length + ').'), 2200); return; } catch (e) {}
  }
  pushUndo();
  var list = P.members.slice().sort(function () { return Math.random() - .5; });
  heads.forEach(function (h, i) { act(h, 'new', { delay: i * 28, dna: QX_PACKS.dna(list[i % list.length]) }); });
  toast(qxLocal(P.zh + ' 上台了（' + P.members.length + ' 位）。', P.en + ' take the stage (' + P.members.length + ').'), 2200);
}
function packsOpen() {
  var old = document.getElementById('packsLayer'); if (old) { old.remove(); return; }
  var en = typeof UI_LANG !== 'undefined' && UI_LANG === 'en';
  var L = document.createElement('div'); L.id = 'packsLayer'; L.setAttribute('role', 'dialog'); L.setAttribute('aria-label', uiText('角色包'));
  var box = document.createElement('div'); box.className = 'packsBox'; L.appendChild(box);
  var head = document.createElement('div'); head.className = 'packsHead';
  head.innerHTML = '<b></b><button type="button" class="packsX" aria-label="close">×</button>';
  head.querySelector('b').textContent = uiText('角色包'); box.appendChild(head);
  QX_PACKS.list.forEach(function (P) {
    var sec = document.createElement('section'); sec.className = 'packRow';
    var cv2 = document.createElement('canvas'); try { miniPortrait(cv2, QX_PACKS.dna(P.cover, 7), 64, .25); } catch (e) {}
    var txt = document.createElement('div'); txt.className = 'packTxt';
    var t = document.createElement('b'); t.textContent = (en ? P.en : P.zh) + ' · ' + P.members.length;
    var bl = document.createElement('p'); bl.textContent = en ? P.blurb.en : P.blurb.zh;
    var names = document.createElement('p'); names.className = 'packNames'; names.textContent = P.members.slice(0, 14).map(function (k) { return QX_PACKS.short(k); }).join(' · ') + (P.members.length > 14 ? ' …' : '');
    var go = document.createElement('button'); go.type = 'button'; go.textContent = uiText('整包上台');
    go.addEventListener('click', function () { L.remove(); packsStage(P.id); });
    txt.appendChild(t); txt.appendChild(bl); txt.appendChild(names); txt.appendChild(go);
    sec.appendChild(cv2); sec.appendChild(txt); box.appendChild(sec);
  });
  L.addEventListener('click', function (e) { if (e.target === L || e.target.classList.contains('packsX')) L.remove(); });
  L.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); L.remove(); } });
  document.body.appendChild(L);
  var x = L.querySelector('.packsX'); if (x) x.focus();
}
(function packsUI() {
  var st = document.createElement('style');
  st.textContent = '#packsLayer{position:fixed;inset:0;z-index:60;background:rgba(40,34,26,.35);display:flex;align-items:center;justify-content:center;padding:16px}' +
    '#packsLayer .packsBox{background:#faf6ee;color:#3a342c;border-radius:16px;max-width:620px;width:100%;max-height:86vh;overflow:auto;padding:14px 16px;box-shadow:0 12px 40px rgba(40,30,20,.3);font:13px/1.5 system-ui,"PingFang SC","Noto Sans SC",sans-serif}' +
    '#packsLayer .packsHead{display:flex;align-items:center;margin-bottom:6px}#packsLayer .packsHead b{font-size:16px}#packsLayer .packsX{margin-left:auto;font-size:20px;border:0;background:none;cursor:pointer;min-width:40px;min-height:40px;color:inherit}' +
    '#packsLayer .packRow{display:flex;gap:12px;padding:10px 0;border-top:1px dashed #d8cdb8}#packsLayer canvas{width:64px;height:64px;border-radius:50%;flex:0 0 auto}' +
    '#packsLayer .packTxt p{margin:2px 0;opacity:.85}#packsLayer .packNames{font-size:12px;opacity:.6}' +
    '#packsLayer button{font:inherit;font-size:12px;border:1px solid #d3c7b2;background:#fffdf8;border-radius:999px;padding:4px 12px;cursor:pointer;min-height:32px;color:inherit}' +
    '@media(prefers-color-scheme:dark){#packsLayer .packsBox{background:#2d2924;color:#efe7d8}#packsLayer button{background:#3a342c;border-color:#5a5044}}';
  document.head.appendChild(st);
  var menu = document.querySelector('.playMoreMenu');
  if (menu) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = '▦ ' + uiText('角色包');
    b.addEventListener('click', packsOpen); menu.appendChild(b);
  }
  TRIG.packs = packsOpen; TRIG_NAMES.packs = 'character packs';
})();
try { window.__packs = { get list() { return QX_PACKS.list.map(function (p) { return p.id + ':' + p.members.length; }); }, audit: function () { return QX_PACKS.audit(); }, open: packsOpen, stage: packsStage }; } catch (e) {}
