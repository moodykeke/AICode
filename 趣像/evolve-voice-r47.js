/* 趣像 24 (r47): 生态缸的声音与台词
   ─────────────────────────────────────────────────────────────
   台词  每隔三四秒，缸里有一只开口说一句（气泡画在舞台上，合影和延时都拍得到）。说什么看它此刻的处境：
         冷/热/黑/湿得受不了、正合适、刚出生、老了、吃饱了、有伴、刚被陨石或彗星照过、神话角色各有口头禅。
   声景  每种气候一层很轻的环境声（只在开了声音时）：雪原的风、沙漠的热蝉、夜林的蟋蟀、海边的浪、温和的鸟叫。 */

var EVO_LINES = {
  cold: [['好冷……', 'So cold…'], ['谁有围巾？', 'Anyone got a scarf?'], ['我的耳朵冻僵了', 'My ears are frozen']],
  hot: [['热死了', 'Too hot'], ['有没有树荫', 'Any shade?'], ['我要晒化了', 'I’m melting']],
  dark: [['看不见路', 'Can’t see a thing'], ['谁在那儿？', 'Who’s there?'], ['开个灯吧', 'Lights, please']],
  wet: [['咕噜咕噜', 'Glub glub'], ['毛都湿透了', 'Soaked through'], ['我在生锈', 'I’m rusting']],
  happy: [['这天气正好', 'Perfect weather'], ['舒服～', 'Lovely~'], ['这是我的地盘', 'This is my patch']],
  baby: [['我是新来的！', 'I’m new here!'], ['这是哪儿？', 'Where am I?'], ['妈妈？', 'Mum?']],
  old: [['我老了……', 'I’m getting old…'], ['想当年……', 'Back in my day…']],
  full: [['吃饱了', 'Full'], ['嗝', 'Burp']],
  buddy: [['有伴真好', 'Nice to have company'], ['一起过日子', 'Better together']],
  odd: [['我感觉怪怪的', 'I feel… different'], ['刚才那道光是什么', 'What was that light?']],
  drop: [['哎哟，着陆！', 'Oof — landed!'], ['这儿不错', 'Nice spot']]
};
var EVO_PACK_LINES = {
  journey: [['俺老孙来也', 'Here I come'], ['师父等等我', 'Wait for me, Master'], ['取经路远', 'It’s a long road west']],
  shanhai: [['山海之间，我最稀奇', 'Rarest between the mountains and the sea']],
  yokai: [['嘘——天黑了', 'Shh — it’s dark now'], ['今晚有庙会吗', 'Festival tonight?']],
  giants: [['北风是我的老朋友', 'The north wind is an old friend'], ['别盯着我的眼睛看', 'Don’t look me in the eye']],
  guofeng: [['葫芦娃，一根藤', 'Seven brothers, one vine']],
  tidal: [['潮水快来了', 'The tide is coming'], ['我想回海里', 'I want the sea']],
  garden: [['晒晒太阳', 'Sunbathing'], ['风吹过来了', 'Here comes the breeze']],
  cartoons: [['准备好了吗？', 'Are you ready?']]
};
var VOICE = { t: 0, amb: 0 };
EVO.bubbles = [];
function evoPickLine(h) {
  var e = h.evo || {}, f = e.fit || 1, C = evoClimateOf(h), pool = null;
  if (e.age === 0) pool = EVO_LINES.baby;
  else if (e.how === 'drop' && EVO.gen - (e.born || 0) <= 1 && Math.random() < .5) pool = EVO_LINES.drop;
  else if (e.full) pool = EVO_LINES.full;
  else if (e.mutagen) pool = EVO_LINES.odd;
  else if (f < .8) pool = C === 'snow' ? EVO_LINES.cold : C === 'desert' ? EVO_LINES.hot : C === 'night' ? EVO_LINES.dark : C === 'sea' ? EVO_LINES.wet : null;
  else if (e.buddy && Math.random() < .6) pool = EVO_LINES.buddy;
  else if (e.age >= 7 && Math.random() < .5) pool = EVO_LINES.old;
  else if (f > 1.12) pool = EVO_LINES.happy;
  if (!pool && h.g.natural && typeof QX_PACKS !== 'undefined') { var P = QX_PACKS.packOf(h.g.sp); if (P && EVO_PACK_LINES[P.id]) pool = EVO_PACK_LINES[P.id]; }
  return pool ? evoRand(pool) : null;
}
function evoSay() {
  if (typeof FUN === 'undefined') return;
  var alive = heads.filter(function (h) { return evoLive(h) && h.pop > .9; }); if (!alive.length) return;
  for (var tries = 0; tries < 6; tries++) {
    var h = evoRand(alive), L = evoPickLine(h); if (!L) continue;
    if (EVO.bubbles.some(function (b) { return b.h === h; })) continue;
    EVO.bubbles.push({ h: h, text: evoEn() ? L[1] : L[0], t0: performance.now(), dur: 2400, dir: h.col < cols / 2 ? 1 : -1, small: true });
    if (EVO.bubbles.length > 4) EVO.bubbles.shift();
    return;
  }
}
function evoAmbience(C) {
  if (!SOUND) return;
  try {
    if (C === 'snow') noise({ dur: 2.2, filter: 'bandpass', ff: 500, ff2: 900, q: .8, gain: .018, a: .9 });
    else if (C === 'desert') { for (var i = 0; i < 6; i++) tone({ f: 3900 + Math.random() * 300, dur: .05, gain: .006, type: 'square', when: i * .07 }); }
    else if (C === 'night') { for (var j = 0; j < 3; j++) tone({ f: 4400, f2: 4300, dur: .06, gain: .01, type: 'sine', when: j * .12 }); }
    else if (C === 'sea') noise({ dur: 2.6, filter: 'lowpass', ff: 420, ff2: 900, gain: .03, a: 1.1 });
    else { var b = 2200 + Math.random() * 900; tone({ f: b, f2: b * 1.25, dur: .09, gain: .012, type: 'sine' }); tone({ f: b * 1.1, f2: b * 1.4, dur: .08, gain: .01, type: 'sine', when: .14 }); }
  } catch (e) {}
}
var voiceBaseTick = evoTick;
evoTick = function (dt) {
  var r = voiceBaseTick.apply(this, arguments);
  if (!EVO.on || cardOpen) return r;
  var now = performance.now();
  if (EVO.speed && now > VOICE.t) { VOICE.t = now + 3000 + Math.random() * 1800; if (!reduceMotion() || Math.random() < .5) evoSay(); }
  if (now > VOICE.amb) { VOICE.amb = now + 2400 + Math.random() * 1600; evoAmbience(EVO.climate2 && Math.random() < .5 ? EVO.climate2 : EVO.climate); }
  return r;
};
/* 气泡画在天气层之上（否则夜林的暗色会把字压住）：借用 fun-r43 的气泡画法 */
var voiceBaseGrid = drawGrid;
drawGrid = function (dt, now) {
  var r = voiceBaseGrid.apply(this, arguments);
  if (!EVO.on || !EVO.bubbles.length || typeof funBubblesDraw !== 'function') return r;
  try { ctx = gctx; ctx.save(); ctx.setTransform(DPR, 0, 0, DPR, 0, 0); var saved = FUN.bubbles; FUN.bubbles = EVO.bubbles; try { funBubblesDraw(now); } finally { EVO.bubbles = FUN.bubbles; FUN.bubbles = saved; } ctx.restore(); } catch (e) { try { ctx.restore(); } catch (e2) {} }
  return r;
};
try { Object.assign(window.__evo, { say: evoSay, line: function (i) { return evoPickLine(heads[i]); } }); } catch (e) {}
