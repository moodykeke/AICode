/* 趣像 14 (r25): 移动出声——把指针当成一根拨过琴弦的手指
   开关在设置里（声音与音乐 → 移动出声 · 关/开，默认关，免得安静看画时被吵）。
   开启后：指针（或手指）划过谁，谁就发出它在音阶格子里那个音，并轻轻一弹——
   像手指划过竖琴，一串音跟着走。限流两条：同一张脸 260ms 内只响一次、全局 70ms 一次，
   所以快划不会糊成噪音。与"局部风"笔刷、终章、开卡、天演互不抢占。 */

CFG_DEFAULT.moveSound = (CFG_DEFAULT.moveSound == null) ? 'off' : CFG_DEFAULT.moveSound;
CFG.moveSound = (CFG.moveSound == null) ? CFG_DEFAULT.moveSound : CFG.moveSound;
if (SHARE_KEYS.indexOf('moveSound') < 0) SHARE_KEYS.push('moveSound');

var MOVE_SOUND = { last: {}, radius: 0.9, calls: 0, blocked: 0, matched: 0, cooled: 0 };

function moveSoundOn() { return String(CFG.moveSound || 'off') === 'on'; }

function moveSoundAt(x, y) {
  if (!moveSoundOn()) return;
  if (typeof BRUSH !== 'undefined' && BRUSH) return;
  if (typeof SUPER !== 'undefined' && SUPER) return;
  if (typeof cardOpen !== 'undefined' && cardOpen) return;
  if (typeof drag !== 'undefined' && drag) return;
  if (typeof breedFrom !== 'undefined' && breedFrom) return;
  MOVE_SOUND.calls++;
  if (typeof allow !== 'function' || !allow('moveSound', 80, 6)) { MOVE_SOUND.blocked++; return; }

  var best = null, bd = 1e9;
  for (var i = 0; i < heads.length; i++) {
    var h = heads[i];
    if (h.hidden) continue;
    var d = Math.hypot(h.x - x, (h.y - h.s * 0.25) - y);
    // 半径取"路径附近"而不是"正下方"：横着划过去才会响成一串，而不是偶尔蹭到一张脸
    var reach = Math.max(h.s * 1.5, 78);
    if (d > reach) continue;
    if (d < bd) { bd = d; best = h; }
  }
  if (!best) return;
  MOVE_SOUND.matched++;
  var now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  if (MOVE_SOUND.last[best.code] && now - MOVE_SOUND.last[best.code] < 190) { MOVE_SOUND.cooled++; return; }
  MOVE_SOUND.last[best.code] = now;

  // 发声：用它自己在音阶格子里的音；再给一点向上的小弹，视觉与声音同步
  try {
    if (typeof playNote === 'function' && typeof scaleSlot === 'function') {
      playNote(pitchAt(scaleSlot(best)), panOf(best), 0.055);
    } else if (typeof SFX !== 'undefined') {
      SFX.marimba(320 + Math.random() * 420, panOf(best));
    }
  } catch (e) { /* 单个音失败不影响滑动 */ }
  if (typeof feelState === 'function' && !feelReduce()) {
    var f = feelState(best);
    f.vy -= 0.55;                     // 小弹一下（比点击轻）
    f.rv += (Math.random() - 0.5) * 0.25;
  }
}

cv.addEventListener('pointermove', function (e) {
  var p = local(e);
  moveSoundAt(p.x, p.y);
}, { passive: true });

/* 设置项 */
(function moveSoundPanel() {
  var grp = null;
  PANEL.forEach(function (G) { if ((G.items || []).some(function (it) { return it.id === 'instrument'; })) grp = G; });
  if (!grp) return;
  if (grp.items.some(function (it) { return it.id === 'moveSound'; })) return;
  var item = { id: 'moveSound', label: '移动出声', type: 'seg', opts: [['off', '关'], ['on', '开']] };
  var at = grp.items.findIndex(function (it) { return it.id === 'instrument'; });
  grp.items.splice(at + 1, 0, item);
})();

if (typeof UI_PAIRS !== 'undefined') {
  UI_PAIRS.push(['移动出声', 'Sound on move'], ['关', 'Off'], ['开', 'On']);
  UI_PAIRS.push(['指针划过谁，谁就发出它在音阶里的那个音（像拨过一排琴弦）。',
                 'Sweep the pointer and each face sounds its note in the scale — a harp of faces.']);
}

try {
  window.__moveSound = {
    get on() { return moveSoundOn(); },
    set on(v) { CFG.moveSound = v ? 'on' : 'off'; },
    get hits() { return Object.keys(MOVE_SOUND.last).length; },
    get stats() { return { calls: MOVE_SOUND.calls, blocked: MOVE_SOUND.blocked, matched: MOVE_SOUND.matched, cooled: MOVE_SOUND.cooled, played: Object.keys(MOVE_SOUND.last).length }; },
    reset: function () { MOVE_SOUND.last = {}; MOVE_SOUND.calls = MOVE_SOUND.blocked = MOVE_SOUND.matched = MOVE_SOUND.cooled = 0; },
  };
} catch (e) {}
