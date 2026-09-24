/* 趣像 07 (r21): 头飞起时的脖子约束（配置项）
   现状：`float`（Heads off 终章 / 飞行笔刷）让头飞起、脖子留在原地成一个桩；
   `longneck` 则是"脖子跟随变长"，`balloon` 用细线连着。
   本文件把这件事交给一个配置项：勾"脖子跟随"→ 头飞起时脖子一起伸长（望远镜脖子）；
   不勾"头跳起"→ 保持原来的样子（脖子留桩）。默认跟随，因为断头更少见。
   只包一个动作的 step，不动既有绘制。 */

CFG_DEFAULT.neckMode = (CFG_DEFAULT.neckMode == null) ? 'follow' : CFG_DEFAULT.neckMode;
CFG.neckMode = (CFG.neckMode == null) ? CFG_DEFAULT.neckMode : CFG.neckMode;
if (SHARE_KEYS.indexOf('neckMode') < 0) SHARE_KEYS.push('neckMode');   // 随场景分享码一起走

/* 动作组里加一项：头飞起时 · 脖子跟随 / 头跳起 */
(function neckPanelItem(){
  var grp = null;
  PANEL.forEach(function(G){ if ((G.items || []).some(function(it){ return it.id === 'kmode'; })) grp = G; });
  if (!grp) return;
  if (grp.items.some(function(it){ return it.id === 'neckMode'; })) return;
  grp.items.push({
    id: 'neckMode', label: '头飞起时', type: 'seg',
    opts: [['follow', '脖子跟随'], ['pop', '头跳起']],
  });
})();

/* `float`：头飞起时按配置决定脖子是否跟随（原实现留桩 d.stump=true） */
(function neckFloatHook(){
  var def = (typeof FXDEF !== 'undefined') && FXDEF.float;
  if (!def || !def.step) return;
  var baseStep = def.step;
  def.step = function (h, a, t, k, d) {
    baseStep(h, a, t, k, d);
    if (String(CFG.neckMode || 'follow') !== 'pop') {
      d.neck = 'long';        // 伸缩脖子：drawBodyAt 会据此把脖子画到 headBase
      d.stump = false;        // 不留断口
    }
  };
})();

/* 调试出口：与 __feel 同约定 */
try {
  window.__neck = {
    get marks() { return NECK.marks; },
    get pulses() { return NECK.pulses || 0; },
    get mode() { return CFG.neckMode; },
    set mode(v) { CFG.neckMode = v; if (typeof syncPanel === 'function') syncPanel(); },
    panelHasItem: function () { return PANEL.some(function (G) { return (G.items || []).some(function (it) { return it.id === 'neckMode'; }); }); },
    groups: function () { return PANEL.map(function (G) { return (G.group || '') + ':' + (G.items || []).length; }); },
    floatDef: function () { return FXDEF.float && Object.keys(FXDEF.float); },
  };
} catch (e) {}

/* 头被"弹"起来时（点击招呼、弹奏、移动出声）也让脖子跟着——不只是终章那种飞头。
   触感层把位移放在 this.__feel.y/x（乘以头身比例得到像素），超过约 3px 就进入伸缩脖。 */
var NECK = { marks: 0, pulses: 0 };
(function neckOnHop(){
  var baseUpd = Head.prototype.update;
  Head.prototype.update = function (dt, now, look) {
    var o = baseUpd.apply(this, arguments);
    var f = this.__feel;
    if (f && f.neck > 0.001 && String(CFG.neckMode || 'follow') !== 'pop') {
      f.neck = Math.max(0, f.neck - dt * 1.7);                 // 约 0.6s 回落到原状
      o.neck = o.neck || 'long'; o.stump = false;
      o.oy -= f.neck * 0.35;                                   // 头沿脖子升起（0.35 头高 ≈ 10px @网格）
      NECK.pulses = (NECK.pulses || 0) + 1;
    }
    if (f && String(CFG.neckMode || 'follow') !== 'pop') {
      var disp = Math.max(Math.abs(f.y || 0), Math.abs(f.x || 0)) * this.s * 0.55;
      // 阈值 1.2px：实测一次正常点击跳起的峰值位移只有约 2px（中档 2.06 / 短档 1.7），
      // 曾经按头身比例提到 s×0.08（网格上 2.24px）反而把正常弹跳卡在阈值下——脖子就"不跟了"。
      // 当年要防的"余震抽长脖"已从源头解决：摆造型期间 feelImpulse 直接不收冲量。
      if (disp > 1.2) { o.neck = o.neck || 'long'; o.stump = false; NECK.marks++; }
    }
    return o;
  };
})();

/* 词条：中英各一份（面板标签走统一词条表） */
if (typeof UI_PAIRS !== 'undefined') {
  UI_PAIRS.push(['头飞起时', 'When a head flies off'], ['脖子跟随', 'Neck follows'], ['头跳起', 'Head pops']);
  UI_PAIRS.push(['头飞起时，脖子跟着一起伸长；换成"头跳起"，脖子留在原地成一个断口。',
                 'When a head flies off, let the neck stretch with it; switch to "Head pops" to leave the neck behind.']);
}
