/* 趣像 16 (r29): 视线纵向方向修正 + 点击跳起可配置
   一、纵向反向
   实验判定：把瞳孔视线设为 0、只改 pitch 渲染两张（±0.5）——正 pitch 的那张，
   五官整体上移、下巴区拉长，读作"头后仰、在看上面"；负 pitch 则额头一大片，读作低头。
   即 **正 pitch = 抬头**。而指针在角色【下方】时，原本算出的 pitch 是正的（+0.396）
   → 头反而抬起 ⇒ 与直觉相反（用户判断正确）。两处输入通道都要翻：
     · 指针视线（look.pitch）
     · 纵向拖动（drag 里对 pitch 的累加）
   注意：只翻"输入"，不动既有动作（yawn / stargaze 等自带 pitch 的动画保持原样）。

   二、点击跳起可配置
   「点击跳起」开关：关掉后，点角色只眨眼/微笑/发声，不再弹跳；
   「跳起高度」：短/中/长，按倍数缩放弹跳初速——脖子跟随的长度随之变化
   （伸缩脖的长度本来就由头被顶起多高决定）。 */

/* ── 一、指针纵向：翻回来 ── */
var FIX = { look: { yaw: 0, pitch: 0, gx: 0, gy: 0 } };
var fixBaseUpdate = Head.prototype.update;
Head.prototype.update = function (dt, now, look) {
  if (look) {
    var s = FIX.look;
    s.yaw = look.yaw; s.pitch = -look.pitch; s.gx = look.gx; s.gy = look.gy;
    return fixBaseUpdate.call(this, dt, now, s);
  }
  return fixBaseUpdate.call(this, dt, now, look);
};

/* ── 二、配置：点击跳起 / 跳起高度 ── */
CFG_DEFAULT.tapHop = (CFG_DEFAULT.tapHop == null) ? 'on' : CFG_DEFAULT.tapHop;
CFG.tapHop = (CFG.tapHop == null) ? CFG_DEFAULT.tapHop : CFG.tapHop;
CFG_DEFAULT.hopPower = (CFG_DEFAULT.hopPower == null) ? 'medium' : CFG_DEFAULT.hopPower;
CFG.hopPower = (CFG.hopPower == null) ? CFG_DEFAULT.hopPower : CFG.hopPower;
if (SHARE_KEYS.indexOf('tapHop') < 0) SHARE_KEYS.push('tapHop');
if (SHARE_KEYS.indexOf('hopPower') < 0) SHARE_KEYS.push('hopPower');

var HOP_POWER = { short: 1.0, medium: 1.7, long: 2.6 };
function hopPower() { return HOP_POWER[String(CFG.hopPower || 'medium')] || 1.7; }
function hopEnabled() { return String(CFG.tapHop || 'on') !== 'off'; }

/* 挂在触感层的"轻触回应"上：关掉就不弹，只保留表情与声音 */
if (typeof feelPat === 'function') {
  var hopBasePat = feelPat;
  feelPat = function (h) {
    if (!hopEnabled()) {
      // 不弹跳：仍然眨眼、微笑、发声（把触感层的表情计数打开即可）
      if (h) { var f = feelState(h); f.pat = 1; }
      if (typeof SOUND !== 'undefined' && SOUND && typeof allow === 'function' && allow('feelPat', 90, 3)
          && typeof playNote === 'function' && typeof scaleSlot === 'function') {
        try { playNote(pitchAt(scaleSlot(h)), panOf(h), 0.07); } catch (e) {}
      }
      return;
    }
    // 弹跳：初速按"跳起高度"缩放（脖子跟随的长度随之变化）
    if (h) {
      var st = feelState(h);
      st.pat = 1;
      st.vy = -1.9 * hopPower() / 1.7; if (st.vy < -4.4) st.vy = -4.4;
      st.neck = 1;                       // 脖子伸展脉冲：点击要看得见地"伸长"，不只是 2px 轻弹
    }
    if (typeof SOUND !== 'undefined' && SOUND && typeof allow === 'function' && allow('feelPat', 90, 3)
        && typeof playNote === 'function' && typeof scaleSlot === 'function') {
      try { playNote(pitchAt(scaleSlot(h)), panOf(h), 0.07); } catch (e) {}
    }
  };
}

/* ── 面板：加进"动作与表演"组 ── */
(function hopPanel() {
  var grp = null;
  PANEL.forEach(function (G) { if ((G.items || []).some(function (it) { return it.id === 'chain'; })) grp = G; });
  if (!grp) return;
  if (!grp.items.some(function (it) { return it.id === 'tapHop'; })) {
    var at = grp.items.findIndex(function (it) { return it.id === 'chain'; });
    grp.items.splice(at + 1, 0,
      { id: 'tapHop', label: '点击跳起', type: 'seg', opts: [['on', '开'], ['off', '关']] },
      { id: 'hopPower', label: '跳起高度', type: 'seg', opts: [['short', '短'], ['medium', '中'], ['long', '长']] });
  }
})();

if (typeof UI_PAIRS !== 'undefined') {
  UI_PAIRS.push(['点击跳起', 'Tap bounce'], ['跳起高度', 'Bounce height'],
    ['短', 'Short'], ['中', 'Medium'], ['长', 'Long']);
}

try {
  window.__hop = {
    get on() { return hopEnabled(); },
    set on(v) { CFG.tapHop = v ? 'on' : 'off'; },
    get power() { return cfgHopPowerName(); },
    set power(v) { if (HOP_POWER[v]) CFG.hopPower = v; },
    fire: function (i) { var h = heads[i || 0]; if (typeof feelPat === 'function') feelPat(h); return h ? { vy: +(feelState(h).vy || 0).toFixed(2) } : null; },
  };
  function cfgHopPowerName() { return String(CFG.hopPower || 'medium'); }
} catch (e) {}
