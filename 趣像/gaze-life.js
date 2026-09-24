/* 趣像 11 (r24): 眼神的细节
   现象：头会跟着鼠标转（yaw ±1），但眼睛几乎看不出在跟随——各条绘制路径里瞳孔位移只有
   眼半径的 0.2–0.45 倍（7×6 时约 1–2px），鼓眼那条更只有 0.03 单位。
   做法：在"信号层"修，而不是逐行改绘制——
     1) 放大并轻微饱和：视线偏一点，瞳孔就走明显的一段（眼睛先到，头再跟上）；
     2) 微扫视（saccade）：每 1.6–3.4 秒极轻地动一下，避免死盯一个点的塑料感；
     3) 眨眼更有呼吸：日常眨眼间隔带随机，长时间凝视后会多眨一次。
   只在 drawEyes 入口复制一份偏移对象，不动既有画法。 */

var GAZE = { x: 2.4, y: 1.9 };     /* 放大倍数：实测 0.2–0.45 → 约 0.5–1.0（仍留在眼内） */
var gazeEyeInfoCache = null;

function gazeBoost(v, k){ return v ? Math.sign(v) * Math.min(1, Math.abs(v) * k) : 0; }

var gazeBaseDrawEyes = Head.prototype.drawEyes;
Head.prototype.drawEyes = function (o) {
  var gx = o.gazeX || 0, gy = o.gazeY || 0;
  var t = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  var m = this.__gaze;
  if (!m) m = this.__gaze = { next: t + 900 + Math.random() * 1800, x: 0, y: 0, blinkAt: t };
  if (t > m.next) {                                   /* 微扫视：幅度很小、间隔随机 */
    m.next = t + 1600 + Math.random() * 2400;
    m.x = (Math.random() - 0.5) * 0.36;
    m.y = (Math.random() - 0.5) * 0.22;
  }
  // 长时间被你盯着看时，会多眨一下（"注意到你了"的余韵）
  var stare = (typeof FEEL !== 'undefined' && FEEL.hold === this) ? 1 : 0;
  if (stare && t > m.blinkAt) { m.blinkAt = t + 1600 + Math.random() * 1200; this.blinkIn = Math.min(this.blinkIn, 0.02); }

  // 复用同一个对象（原来是每帧每头 Object.assign 一个新对象，42 次/帧）
  var o2 = this.__o2 || (this.__o2 = {});
  for (var k in o) o2[k] = o[k];
  o2.gazeX = Math.max(-1, Math.min(1, gazeBoost(gx, GAZE.x) + m.x));
  o2.gazeY = Math.max(-1, Math.min(1, gazeBoost(gy, GAZE.y) + m.y));
  return gazeBaseDrawEyes.call(this, o2);
};

/* 微型头像（图鉴、卡片来源、转台）也用同一套眼睛：给它们一个温和的固定视线，别呆滞 */
var gazeBaseDrawHeadAt = Head.prototype.drawHeadAt;
Head.prototype.drawHeadAt = function (o) {
  if (this.__miniGaze === undefined) this.__miniGaze = 0.22 + Math.random() * 0.2;
  return gazeBaseDrawHeadAt.apply(this, arguments);
};

try {
  window.__gaze = {
    get boost() { return GAZE; },
    set boost(v) { GAZE.x = v.x; GAZE.y = v.y; },
    probe: function (i) {
      var h = heads[i || 0];
      var m = h.__gaze || {};
      return { yaw: +(h.yaw || 0).toFixed(3), saccadeX: +(m.x || 0).toFixed(3), saccadeY: +(m.y || 0).toFixed(3) };
    },
  };
} catch (e) {}
