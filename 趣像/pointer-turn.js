/* 趣像 18 (r34): 点击/拖动的手感修正 —— 点击不转圈，左右划才转头
   ─────────────────────────────────────────────────────────────
   原来的行为（基线 endDrag）：点击（几乎没移动）→ 头自转一整圈（spinVel 9~14）；
   划一下松手 → 按甩动速度再转一圈。用户读来"不符合逻辑"：
     · 点击头像，期望的是"轻轻一弹、脖子跟着伸长"（触感层的回应），不该整圈自转；
     · 想让它转头，应该按住后左划/右划（拖动过程里 yaw/pitch 本来就跟随手指），
       松手后停在转到的角度，而不是甩出去转圈。
   做法：只改"松手"这一步——
     · 把这次拖拽标记成"动过了"（moved≥6）并清零甩速（vel=0），基线就不会走
       自转分支（点击自转 / 甩动自转），而转头结果（拖拽中累积的 yaw/pitch）原样保留；
     · 双击开卡、长按开卡、混生选亲等其它路径完全不动。 */

var PTURN = { marks: 0, last: null };
(function pointerTurn() {
  if (typeof drag === 'undefined') return;
  // 注意：基线是**按值**把 endDrag 注册进 pointerup/pointercancel/pointerleave 的，
  // 覆盖 endDrag 这个绑定没用（监听器里存的是旧函数）。只能在**捕获阶段**
  // 抢在它的监听器之前改这次拖拽的状态——window 上的捕获监听先于 canvas 上的监听。
  var tweak = function () {
    var d = drag;
    if (d && d.head) {
      // 这次是"点击"还是"划动"，都在这里被读出来（基线随后会用到）
      PTURN.last = { moved: d.moved, vel: d.vel, clicked: d.moved < 6 };
      if (d.moved < 6) PTURN.marks++;            // 记一次"点击"（供验收）
      d.moved = Math.max(d.moved, 6);            // 不让它进"点击自转"分支
      d.vel = 0;                                 // 也不让它进"甩动自转"分支
    }
  };
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
    window.addEventListener(ev, tweak, true);
  });
})();

try {
  window.__turn = {
    get last() { return PTURN.last; },
    get clicks() { return PTURN.marks; },
    get spinning() { return heads.map(function (h) { return !!h.spinning; }).filter(Boolean).length; },
  };
} catch (e) {}
