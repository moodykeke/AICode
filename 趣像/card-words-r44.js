/* 趣像 21 (r44): 经典角色卡片的中文文字
   ─────────────────────────────────────────────────────────────
   上游 Head Cases 的经典角色（人物、猫狗、机器人、外星访客及它们的混血）卡片一直只有英文：
   "Little Oona Dimmock-Orchard · brown rabbit · One gold earring, buck teeth… Naps with one eye open. Afraid of Mondays in March."
   中文界面下改为中文：名字（按基因哈希取，和英文名一样稳定）、物种（毛色·物种 / 甲 × 乙 混血）、可见特征、爱好与害怕。
   同一组基因永远得到同一段文字；英文界面完全不变；神话与民间角色（g.natural）保持各自的中文设定。
   生态缸里出生的生物，卡片上爱好与害怕那两行换成它的"出生证明"（第几代、什么气候、父母是谁），经 cardBio(dna, {zh, en}) 登记。 */

var CARDZH_FIRST = ['小满', '阿福', '豆包', '年糕', '汤圆', '糯米', '芝麻', '饭团', '布丁', '可乐', '包子', '花卷', '阿宝', '球球', '点点', '大黄', '二毛', '三三', '咕噜', '啾啾',
  '蹦蹦', '嘟嘟', '毛毛', '乐乐', '朵朵', '多多', '果果', '跳跳', '呼呼', '栗子', '柚子', '桃酥', '麦芽', '墨墨', '云朵', '石头', '茶茶', '米粒', '橘子', '团团', '圆圆', '哆啦', '噜噜', '小七', '十一'];
var CARDZH_SUR = ['毛', '豆', '糖', '墨', '云', '米', '花', '橘', '栗', '柚', '桃', '竹', '雪', '石', '茶', '麦', '团', '圆', '钱', '孙', '周', '吴', '郑', '冯', '陈', '褚', '卫', '蒋', '沈', '韩'];
var CARDZH_TITLE = { cat: ['喵', '老', ''], tiger: ['大王', '队长', ''], dog: ['乖', '汪', ''], bear: ['大', '老', ''], panda: ['团长', ''], rabbit: ['小', ''], pig: ['胖', ''], fox: ['先生', ''],
  mouse: ['小', ''], owl: ['博士', '教授'], chick: ['小', ''], frog: ['呱', ''], robot: ['型号', ''], alien: ['使者', ''], human: [''] };
var CARDZH_AFTER = { 大王: 1, 队长: 1, 团长: 1, 先生: 1, 博士: 1, 教授: 1, 使者: 1 };
var CARDZH_LIKES = ['收集瓶盖', '在电梯里哼歌', '每本书里都夹一朵花', '叫得出每只鸽子的名字', '每周二烤面包', '看书先看最后一页', '有十一把伞', '爱写信，没人要也写', '睡午觉睁一只眼',
  '天天练大提琴，拉得很烂', '把调料架按拼音排好', '记云的日记', '跟盆栽聊天', '填字游戏从没填完过', '会从牙缝里吹口哨', '精通明信片体', '对茶匙很有意见'];
var CARDZH_FEARS = ['旋转门', '太安静的房间', '鹅', '表格', '字母 Q', '下行的扶梯', '汤', '寒暄', '气球', '三月的星期一', '感应水龙头', '大海（有一点）'];
var CARDZH_COL = { black: '黑', 'dark brown': '深棕', chestnut: '栗色', copper: '铜色', flaxen: '亚麻色', silver: '银', auburn: '赤褐', 'dyed-blue': '染蓝的', 'dyed-pink': '染粉的',
  ginger: '橘', grey: '灰', cream: '奶油色', tawny: '黄褐', fawn: '浅褐', amber: '琥珀色', tan: '棕黄', chocolate: '巧克力色', golden: '金', brown: '棕', dark: '深色', honey: '蜜色',
  white: '白', sand: '沙色', pink: '粉', red: '红', 'deep red': '深红', pale: '浅色', field: '田', barn: '仓', yellow: '黄', lemon: '柠檬黄', green: '绿', tree: '树', steel: '钢',
  brass: '黄铜', mint: '薄荷', blue: '蓝', lilac: '丁香紫', rose: '玫瑰' };
var CARDZH_SP = { human: '人类', cat: '猫', tiger: '老虎', dog: '小狗', bear: '熊', panda: '大熊猫', rabbit: '兔子', pig: '小猪', fox: '狐狸', mouse: '老鼠', owl: '猫头鹰', chick: '小鸡', frog: '青蛙', robot: '机器人', alien: '外星访客' };
var CARDZH_PART = { ears: '耳朵', eyes: '眼睛', snout: '鼻子和嘴', hair: '头发' };
function cardZh() { return typeof UI_LANG === 'undefined' || UI_LANG !== 'en'; }
function cardZhSpecies(g) {
  var fs = founders(g.dna), sps = [];
  fs.forEach(function (s) { var sp = baseGenes(s).sp; if (sps.indexOf(sp) < 0) sps.push(sp); });
  if (fs.length === 1 || sps.length === 1) {
    if (g.sp === 'human') return fs.length > 1 ? '人类（多家血统）' : '人类';
    if (g.sp === 'panda') return '大熊猫';
    var cw = COLNAME[g.geneFur || g.fur], cn = CARDZH_COL[cw];
    var special = { 'field mouse': '田鼠', 'barn owl': '仓鸮', 'tree frog': '树蛙', 'giant panda': '大熊猫', 'deep red fox': '赤狐' }[cw + ' ' + g.sp];
    if (special) return special;
    return (cn ? cn + (cn.length === 1 ? '' : '的') : '') + CARDZH_SP[g.sp];
  }
  return sps.map(function (s) { return CARDZH_SP[s]; }).join(' × ') + ' 混血';
}
function cardZhTraits(g) {
  var t = [], groups = {}, order = [];
  for (var i = 1; i < MODS.length; i++) {
    var m = MODS[i], sp = g.src[i];
    if (sp === g.sp || m === 'style' || m === 'marks') continue;
    if (m === 'hair' && g.hair === 'none') continue;
    if (!groups[sp]) { groups[sp] = []; order.push(sp); }
    groups[sp].push(CARDZH_PART[m]);
  }
  order.forEach(function (sp) { t.push(CARDZH_SP[sp] + '的' + groups[sp].join('、')); });
  var hc = CARDZH_COL[COLNAME[g.hairCol]] || '深色';
  var HS = { sweep: hc + '头发梳到一边', crop: hc + '短发', curly: hc + '卷发', bun: hc + '头发盘成髻', bald: '骄傲的秃顶', long: hc + '长发', cap: '一顶毛线帽', wisps: '几缕' + hc + '呆毛' };
  if (g.hair && g.hair !== 'none' && HS[g.hair]) t.push(HS[g.hair]);
  if (g.glasses === 'round') t.push('圆眼镜'); else if (g.glasses === 'square') t.push('方框眼镜');
  if (g.beard) t.push('一脸大胡子'); else if (g.mustache) t.push('两撇小胡子'); else if (g.stubble) t.push('胡茬');
  if (g.earring) t.push('一只金耳环');
  if (g.freckles) t.push('雀斑');
  if (g.tongue) t.push('吐着舌头');
  if (g.teeth) t.push('两颗门牙');
  if (g.stripes) t.push('一身条纹');
  if (g.whiskers) t.push('六根胡须');
  if (g.antenna === 1) t.push('红尖天线'); else if (g.antenna === 2) t.push('两根触角');
  if (g.eyeStyle === 'screen') t.push('屏幕眼');
  if (g.mole) t.push('一颗美人痣');
  if (g.tuft) t.push('一撮倔强的毛');
  return t.slice(0, 4);
}
function cardZhName(g, id) {
  var d = g.dna, fs = founders(d), h = dnaHash(d);
  var nameOf = function (s) { return CARDZH_FIRST[hashInt(s, 11) % CARDZH_FIRST.length]; };
  var first = fs.length > 1 ? CARDZH_FIRST[hashInt(h, 13) % CARDZH_FIRST.length] : nameOf(fs[0]);
  var sur = CARDZH_SUR[hashInt(fs[0], 12) % CARDZH_SUR.length];
  var tl = CARDZH_TITLE[g.sp] || [''], title = tl[hashInt(h, 14) % tl.length];
  if (g.sp === 'robot') return '型号 ' + (h % 97 + 3) + ' · ' + first;
  if (fs.length > 1) first = first + '-' + nameOf(fs[1]);
  if (!title) return g.sp === 'human' ? sur + first : first;
  return CARDZH_AFTER[title] ? first + title : title + first;
}
/* 额外的卡片背面文字，按基因码登记（卡片会用同一段 DNA 重新组一次基因，所以不能挂在 g 上） */
var CARD_BIO = {}, CARD_BIO_KEYS = [];
function cardBio(dna, bio) {
  var k = encodeDNA(dna.slice(0, 7));
  if (!(k in CARD_BIO)) { CARD_BIO_KEYS.push(k); if (CARD_BIO_KEYS.length > 400) delete CARD_BIO[CARD_BIO_KEYS.shift()]; }
  CARD_BIO[k] = bio;
}
var cardZhBaseIdentity = identity;
identity = function (g) {
  var id = cardZhBaseIdentity.apply(this, arguments);
  if (!g || g.natural || g.donor || !g.dna || !g.src) return id;
  var bio = CARD_BIO[encodeDNA(g.dna.slice(0, 7))];
  if (cardZh()) {
    var h = dnaHash(g.dna);
    id.name = cardZhName(g, id);
    id.species = cardZhSpecies(g);
    id.traits = cardZhTraits(g);
    id.quirk = CARDZH_LIKES[hashInt(h, 15) % CARDZH_LIKES.length] + '。怕' + CARDZH_FEARS[hashInt(h, 16) % CARDZH_FEARS.length] + '。';
    if (bio) id.quirk = bio.zh;
  } else if (bio) id.quirk = bio.en;
  return id;
};
/* 卡片上"特征"一行：中文用顿号、句号，不要英文的首字母大写与逗号 */
var cardZhBaseCap = cap;
cap = function (s) { return (typeof s === 'string' && /^[一-鿿]/.test(s)) ? s : cardZhBaseCap(s); };
var cardZhBaseWrap = wrapText;
wrapText = function (text, maxW, maxLines) {
  if (typeof text === 'string' && cardZh()) {
    if (text === 'Unremarkable in every visible way.') text = '看上去哪儿都很普通。';
    else if (/[\u4e00-\u9fff）]\.$/.test(text)) text = text.replace(/, (?=[\u4e00-\u9fff])/g, '、').replace(/\.$/, '。');
  }
  return cardZhBaseWrap.call(this, text, maxW, maxLines);
};
