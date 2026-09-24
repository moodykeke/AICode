/* 趣像 18 (r32): 班级人像——把平台上的学生头像（蓝底 AI 人像）统一成"纸上剧场"风格的班级合影
   ─────────────────────────────────────────────────────────────
   风格一致的四个动作（关键在下面前两步，背景蓝底是"绿幕"）：
     1) 蓝底键控：以四角取样的蓝色为基准 + 偏蓝判据，逐像素抠出人像的 alpha（边缘羽化 + 收 1px 去蓝边）
     2) 统一构图：从蒙版求"头部锚点"（首个前景行 = 头顶；该行附近最宽横跨 = 头宽），
        把头宽归一到画面宽度的 62%、头顶落在画面高度的 9% → 所有人的头一样大、一样高
     3) 统一底色：合成到与舞台同一张纸色上（可选暖色归一 + 极淡颗粒），气质立刻一致
     4) 统一相框与名牌：细墨线框 + 下方姓名条（昵称/学籍号/不显示，可在设置里换）
   加载：班级列表 → 名单（含头像 URL）→ 并发取图（6 路）→ 逐张处理 → 舞台上排成合影墙。
   大合影：`;` 复用现有摆造型/闪光/暗房（照片题字带班级名）。
   退出：表演条「退出班级人像」——释放肖像位图，回到原来的 42 张脸。 */

var CLASS = {
  active: false, busy: false, id: 0, name: '', students: [], cards: [], targets: null,
  progress: { done: 0, total: 0 }, labels: true, tone: 0.35, grain: true, lastError: '', baseline: 0, fallback: 0,
};
var CLASS_BASE = '/api/v1/growth/teacher/classes/';
var CLASS_CARD = { w: 200, h: 250, label: 30 };
var CLASS_STYLES = ['grid', 'rows', 'line', 'arc', 'cluster'];

/* ---------- 数据 ---------- */
function classJson(res) {
  if (!res || !res.ok) return null;
  return res.json().catch(function () { return null; });
}
/* 当前是不是教师（/api/v2/auth/me 返回裸对象，形状两种都兼容） */
function classIsTeacher() {
  return fetch('/api/v2/auth/me', { credentials: 'same-origin' })
    .then(classJson)
    .then(function (j) {
      var u = (j && (j.data || j)) || {};
      return !!(u.is_teacher || u.role === 'teacher' || u.api_role === 'teacher');
    })
    .catch(function () { return false; });
}

/* 全校班级（公开面，无鉴权；供教师任选；学生不用它） */
function classFetchAllClasses() {
  return fetch('/api/v2/edu/display/classes', { credentials: 'same-origin' })
    .then(classJson)
    .then(function (j) {
      var list = (j && (j.data || j.items)) || [];
      return list.map(function (c) { return { id: c.id, name: c.name || ('班级 ' + c.id), level: c.level }; });
    })
    .catch(function () { return []; });
}

/* 班级列表：学生先试"我的班级"，再试"我带的班"（教师）；两形状都兼容 */
function classFetchClasses() {
  return fetch('/api/v2/student/classroom/classes', { credentials: 'same-origin' })
    .then(classJson)
    .then(function (j) {
      var list = (j && (j.data || j.items)) || [];
      if (list.length) return list.map(function (c) { return { id: c.id, name: c.name || ('班级 ' + c.id) }; });
      // 教师：先问"我带的班"（RequireTeacher，班主任/任课都从这里出），再退 workshop
      return fetch('/api/v2/teacher/classroom/recent', { credentials: 'same-origin' }).then(classJson).then(function (r0) {
        var l1 = (r0 && (r0.data || r0.items)) || [];
        if (l1.length) return l1.map(function (c) { return { id: c.id, name: c.name || ('班级 ' + c.id) }; });
        return fetch('/api/v1/teacher/workshop/classes', { credentials: 'same-origin' }).then(classJson).then(function (t) {
          var l2 = (t && (t.data || t.items)) || [];
          return l2.map(function (c) { return { id: c.id || c.class_id, name: c.name || c.class_name || ('班级 ' + (c.id || c.class_id)) }; });
        });
      });
    })
    .catch(function () { return []; });
}
function classFetchRoster(id) {
  return fetch(CLASS_BASE + id + '/growth-ranking', { credentials: 'same-origin' })
    .then(classJson)
    .then(function (j) {
      var rows = (j && j.data) || [];
      return rows.filter(function (r) { return r && r.avatar_url; })
        .map(function (r) { return { id: r.user_id, username: r.username || '', nickname: r.nickname || '', url: r.avatar_url }; });
    })
    .catch(function () { return []; });
}

/* ---------- 一、蓝底键控 ---------- */
function classKeyMask(img) {
  var w = img.width, h = img.height;
  var c = document.createElement('canvas'); c.width = w; c.height = h;
  var g = c.getContext('2d');
  g.drawImage(img, 0, 0);
  var d = g.getImageData(0, 0, w, h);
  var px = d.data;
  // 只沿边缘一圈取样当"背景蓝"基准（每张的蓝不同，还有渐变）。
  // 注意别取到画面中间——那里是脸，把肤色当背景基准的话泛洪会把人吃掉。
  var refs = [];
  (function () {
    var i, k, N = 9;
    for (k = 0; k < N; k++) {
      var fx = Math.round(4 + (w - 8) * k / (N - 1));
      i = (4 * w + fx) * 4; refs.push([px[i], px[i + 1], px[i + 2]]);
      i = ((h - 5) * w + fx) * 4; refs.push([px[i], px[i + 1], px[i + 2]]);
      var fy = Math.round(4 + (h - 8) * k / (N - 1));
      i = (fy * w + 4) * 4; refs.push([px[i], px[i + 1], px[i + 2]]);
      i = (fy * w + (w - 5)) * 4; refs.push([px[i], px[i + 1], px[i + 2]]);
    }
  })();
  var likeBg = function (i) {
    var r = px[i], gg = px[i + 1], b = px[i + 2];
    for (var j = 0; j < refs.length; j++) {
      var dr = r - refs[j][0], dg = gg - refs[j][1], db = b - refs[j][2];
      if (dr * dr + dg * dg + db * db < 4200) return true;
    }
    return b >= 95 && b - Math.max(r, gg) >= 7;                 // 偏蓝兜底（渐变/高光蓝）
  };
  // 从四边泛洪：只吃"连到画面边缘的背景"，里面同色的衣服不会被误伤
  var bg = new Uint8Array(w * h), stack = [];
  var push = function (x, y) { if (x < 0 || y < 0 || x >= w || y >= h) return; var o = y * w + x; if (bg[o]) return; if (!likeBg(o * 4)) return; bg[o] = 1; stack.push(o); };
  // 原图外圈常带一圈 1–2px 白边（圆角/描边遗留）——直接算背景，并从内缩 3px 处起洪，
  // 否则种子全落在白边上、判定不通过，泛洪一步都走不动
  for (var yb = 0; yb < h; yb++) {
    for (var xb = 0; xb < w; xb++) {
      if (xb < 2 || yb < 2 || xb >= w - 2 || yb >= h - 2) bg[yb * w + xb] = 1;
    }
  }
  for (var x0 = 3; x0 < w - 3; x0++) { push(x0, 3); push(x0, h - 4); }
  for (var y0 = 3; y0 < h - 3; y0++) { push(3, y0); push(w - 4, y0); }
  var seeded = stack.length;
  while (stack.length) {
    var o = stack.pop(), ox = o % w, oy = (o - ox) / w;
    push(ox - 1, oy); push(ox + 1, oy); push(ox, oy - 1); push(ox, oy + 1);
  }
  var marked = 0; for (var bi = 0; bi < bg.length; bi++) if (bg[bi]) marked++;
  window.__keySteps = { refs: refs.slice(0, 3), seeds: seeded, marked: marked, tot: w * h,
    lb00: likeBg(0), lb10: likeBg((w - 1) * 4), lbLeft: likeBg((h >> 1) * w * 4) };
  // 蓝色溢出抑制：前景像素上蓝通道压回与红绿齐平（否则边缘留一圈淡蓝）
  for (var i2 = 0; i2 < px.length; i2 += 4) {
    if (bg[i2 >> 2]) continue;
    var rr2 = px[i2], gg2 = px[i2 + 1], bb2 = px[i2 + 2];
    var cap = Math.max(rr2, gg2) + 6;
    if (bb2 > cap) {
      var lv = (bb2 - cap) / 255;
      px[i2 + 2] = cap;
      px[i2] = Math.min(255, rr2 + lv * 26);
      px[i2 + 1] = Math.min(255, gg2 + lv * 12);
    }
  }
  g.putImageData(d, 0, 0);
  // 纯人像层：把背景像素清成透明，得到干净的 alpha
  var cut = g.createImageData(w, h);
  for (var k = 0, i3 = 0; i3 < px.length; i3 += 4, k++) {
    cut.data[i3] = px[i3]; cut.data[i3 + 1] = px[i3 + 1]; cut.data[i3 + 2] = px[i3 + 2];
    cut.data[i3 + 3] = bg[k] ? 0 : 255;
  }
  g.putImageData(cut, 0, 0);
  // 羽化 1px（把硬边磨软一点，缩到卡片尺寸后不会显得像剪纸）
  var soft = document.createElement('canvas'); soft.width = w; soft.height = h;
  var sg = soft.getContext('2d');
  sg.filter = 'blur(0.6px)';
  sg.drawImage(c, 0, 0);
  sg.filter = 'none';
  return { canvas: soft, w: w, h: h, data: (function () {
    var id = sg.getImageData(0, 0, w, h), out = new Uint8ClampedArray(w * h);
    for (var k2 = 0, i4 = 3; i4 < id.data.length; i4 += 4, k2++) out[k2] = id.data[i4];
    return out;
  })() };
}

/* ---------- 二、头部锚点（统一构图的关键） ---------- */
function classHeadAnchor(mask) {
  var w = mask.w, h = mask.h, a = mask.data;
  var rows = [];
  for (var y = 0; y < h; y++) {
    var lo = -1, hi = -1, cnt = 0;
    for (var x = 0; x < w; x++) {
      if (a[y * w + x] > 128) { if (lo < 0) lo = x; hi = x; cnt++; }
    }
    rows.push({ lo: lo, hi: hi, cnt: cnt });
  }
  var top = 0;
  while (top < h && rows[top].cnt < w * 0.02) top++;
  var bottom = h - 1;
  while (bottom > top && rows[bottom].cnt < w * 0.02) bottom--;
  if (bottom - top < h * 0.2) return null;                       // 没抠出人来（整张都被判成背景）
  var bandEnd = Math.min(bottom, top + Math.round((bottom - top) * 0.42));
  var best = { w: 0, cx: w / 2, y: top };
  for (var yy = top; yy <= bandEnd; yy++) {
    var r = rows[yy];
    if (r.lo < 0) continue;
    var width = r.hi - r.lo + 1;
    if (width > best.w) best = { w: width, cx: (r.lo + r.hi) / 2, y: yy };
  }
  if (best.w < 6) return null;
  return { top: top, headW: best.w, headCX: best.cx, bottom: bottom };
}

/* ---------- 三、统一底色 + 四、相框名牌 ---------- */
function classPaperBase(card, w, h) {
  var g = card.getContext('2d');
  g.fillStyle = '#f6f1e6'; g.fillRect(0, 0, w, h);
  var grd = g.createLinearGradient(0, 0, w, h);
  grd.addColorStop(0, 'rgba(255,252,244,0.9)');
  grd.addColorStop(0.6, 'rgba(244,238,224,0.5)');
  grd.addColorStop(1, 'rgba(233,226,209,0.75)');
  g.fillStyle = grd; g.fillRect(0, 0, w, h);
  if (CLASS.grain) {
    for (var i = 0; i < 260; i++) {
      var x = Math.random() * w, y = Math.random() * h, al = Math.random();
      g.fillStyle = al > 0.5 ? 'rgba(120,102,78,' + (al * 0.05).toFixed(3) + ')'
                             : 'rgba(255,255,255,' + (al * 0.16).toFixed(3) + ')';
      g.fillRect(x, y, 1 + Math.random() * 1.3, 1);
    }
  }
  return g;
}
/* 把一张学生头像处理成统一规格的肖像卡 */
function classMakeCard(img, label, idx) {
  var m = classKeyMask(img);
  var anchor = classHeadAnchor(m);
  var cw = CLASS_CARD.w, ch = CLASS_CARD.h, lh = CLASS.labels ? CLASS_CARD.label : 0;
  var card = document.createElement('canvas');
  card.width = cw; card.height = ch + lh;
  var g = classPaperBase(card, cw, ch + lh);
  if (anchor) {
    var scale = (cw * 0.50) / anchor.headW;                       // 头宽 = 卡宽 50%（留出肩，像胸像）
    var faceTop = ch * 0.12;                                      // 头顶落在 12% 高度
    var dx = cw / 2 - anchor.headCX * scale;
    var dy = faceTop - anchor.top * scale;
    // 先把人像（已抠底）画到一张临时层上，色调归一只作用在人像上，再整层叠到纸面
    var pl = document.createElement('canvas'); pl.width = cw; pl.height = ch;
    var pg = pl.getContext('2d');
    pg.drawImage(m.canvas, dx, dy, m.w * scale, m.h * scale);
    if (CLASS.tone > 0) {
      pg.globalCompositeOperation = 'source-atop';
      pg.globalAlpha = Math.min(0.35, CLASS.tone * 0.16);
      pg.fillStyle = '#f0e2c8';
      pg.fillRect(0, 0, cw, ch);
      pg.globalCompositeOperation = 'source-over';
      pg.globalAlpha = 1;
    }
    g.save();
    g.beginPath(); g.rect(0, 0, cw, ch); g.clip();
    g.drawImage(pl, 0, 0);
    g.restore();
    pl.width = 1; pl.height = 1;
  } else {
    // 兜底：抠不出就原样缩放着放，至少构图一致
    var s2 = Math.max(cw / m.w, ch / m.h);
    g.drawImage(img, (cw - m.w * s2) / 2, 0, m.w * s2, m.h * s2);
  }
  classCardStyle(g, cw, ch, lh, label);
  try { m.canvas.width = 1; m.canvas.height = 1; } catch (e) {}
  return card;
}
/* 相框 + 名牌：两条路径（浏览器内抠图 / 服务端基线）共用同一套外观 */
function classCardStyle(g, cw, ch, lh, label) {
  g.strokeStyle = 'rgba(59,55,48,0.35)'; g.lineWidth = 1;
  g.strokeRect(0.5, 0.5, cw - 1, ch - 1);
  g.strokeStyle = 'rgba(255,255,255,0.5)';
  g.strokeRect(1.5, 1.5, cw - 3, ch - 3);
  if (lh) {
    g.strokeStyle = 'rgba(59,55,48,0.22)';
    g.beginPath(); g.moveTo(0.5, ch + 0.5); g.lineTo(cw - 0.5, ch + 0.5); g.stroke();
    g.fillStyle = '#3b3730';
    g.font = '600 13px "Noto Serif SC","Songti SC",serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    var t = String(label || '');
    while (t.length > 1 && g.measureText(t).width > cw - 14) t = t.slice(0, -1);
    g.fillText(t, cw / 2, ch + lh / 2 + 0.5);
  }
}

var CLASS_EMOTIONS = ['joy', 'anger', 'sorrow', 'delight'];
function classEmotion() {
  var e = String(CFG.classEmotion || '');
  return CLASS_EMOTIONS.indexOf(e) >= 0 ? e : '';
}
/* 服务端基线（bin/process-student-avatars.py 已统一构图/抠底/纸面），
   应用优先读它——更快，也与"基线"完全一致；读不到才退回浏览器内逐张处理。 */
function classBaselineCard(img) {
  var cw = CLASS_CARD.w, ch = CLASS_CARD.h;
  var card = document.createElement('canvas');
  card.width = cw; card.height = ch;                       // 只烤人像：相框与名牌每帧矢量画
  var g = card.getContext('2d');
  g.fillStyle = '#f6f1e6'; g.fillRect(0, 0, cw, ch);
  g.drawImage(img, 0, 0, cw, ch);
  return card;
}

/* ---------- 加载一批 ---------- */
function classLabelOf(st) { return (CLASS.labels === 'id') ? st.username : (st.nickname || st.username); }
/* 名牌：按"当前设置"解析（改了设置立刻生效，不必重新载入班级） */
function classLabelNow() {
  var mode = String(CFG.className || 'nick');
  if (mode === 'off') return '';
  return function (c) {
    if (mode === 'id') return c.sid || c.name || '';
    return c.nick || c.sid || c.name || '';
  };
}
function classLoad(id, name) {
  if (CLASS.busy) { CLASS.cancel = true; return; }         // 载入中点"换个班/再载入"＝取消当前这次
  CLASS.busy = true;
  CLASS.cancel = false;
  CLASS.name = name || CLASS.name;
  CLASS.lastError = '';
  classStatusShow('正在读取' + (name || '班级') + '的名单…', 0, 0);
  classFetchRoster(id).then(function (roster) {
    if (!roster.length) {
      CLASS.busy = false; classStatusHide();
      toast(qxLocal('这个班还没有可用的头像。', 'No avatars for this class yet.'), 3000);
      return;
    }
    roster = roster.slice(0, 60);                       // 一个班最多 60 张，稳妥
    CLASS.progress = { done: 0, total: roster.length };
    CLASS.baseline = 0; CLASS.fallback = 0; CLASS.failed = [];   // 计数按次重置（供验证/排障看）
    var cards = new Array(roster.length);
    var next = 0;
    var finished = false;
    var left = roster.length;          // 按"完成数"收尾：派发完不等于拿完，还在飞的会被丢掉
    var run = function () {
      if (CLASS.cancel) {                                    // 取消：收尾但不落地
        classStatusHide(); finished = true; CLASS.busy = false;
        toast(qxLocal('已取消载入。', 'Loading cancelled.'), 2000);
        return;
      }
      if (left <= 0) {
        if (finished) return;          // 6 路并发会各自走到收尾：只做一次，
        finished = true;               // 否则第二遍会把刚建好的新一批卡当成"上一批"清掉
        classStatusHide();
        CLASS.cards.forEach(function (c) { try { c.canvas.width = 1; c.canvas.height = 1; } catch (e) {} });   // 切班：放掉上一批
        CLASS.cards = cards.filter(Boolean);
        CLASS.id = id; CLASS.name = name || ('班级 ' + id);
        CLASS.students = roster;
        CLASS.active = true;
        classLayout('grid');
        CLASS.busy = false;
        toast(qxLocal('已加载', 'Loaded') + ' ' + CLASS.cards.length + qxLocal(' 位同学', ' classmates') + ' · ' + CLASS.name, 2600);
        classSyncUI();
        return;
      }
      if (CLASS.cancel || next >= roster.length) return;    // 守一道：派发不越过名单（配合 left 收尾）
      var i = next++;
      classStatusShow('正在取头像并统一风格…', CLASS.progress.done, CLASS.progress.total);
      var st = roster[i];
      var grab = function (u) {
        return fetch(u, { credentials: 'same-origin' })
          .then(function (r) { return r.ok ? r.blob() : null; })
          .catch(function () { return null; });
      };
      // ① 服务端基线：选了表情就走情绪件，缺件退展示版、再退原始头像
      var emo = classEmotion();
      var V = (typeof QX_ASSET_V !== 'undefined') ? ('?v=' + QX_ASSET_V) : '';   // 资产版本：与拾趣馆卡片同一个旋钮
      var first = emo ? ('/avatars/unified/emotion/' + emo + '/' + st.id + '.png' + V) : ('/avatars/unified/display/' + st.id + '.png' + V);
      grab(first)
        .then(function (b) {
          if (b) return { blob: b, base: true };
          return grab('/avatars/unified/display/' + st.id + '.png' + V).then(function (b2) {
            if (b2) return { blob: b2, base: true };
            return grab(st.url).then(function (b3) { return b3 ? { blob: b3, base: false } : null; });
          });
        })
        .then(function (res) { return res ? createImageBitmap(res.blob).then(function (img) { return { img: img, base: res.base }; }) : null; })
        .then(function (r) {
          if (r) {
            var card = r.base ? classBaselineCard(r.img, classLabelOf(st)) : classMakeCard(r.img, classLabelOf(st), i);
            try { r.img.close && r.img.close(); } catch (e) {}
            if (r.base) CLASS.baseline++; else CLASS.fallback++;
            cards[i] = { canvas: card, name: classLabelOf(st), nick: st.nickname || '', sid: st.username || '',
                         uid: String(st.id), src: st.url, x: 0, y: 0, s: 1, roll: 0, pop: 1, __student: true };
          } else {
            CLASS.failed = (CLASS.failed || []).concat([st.id]);        // 哪个同学没取到图（排障用）
          }
        })
        .catch(function () { if (st) CLASS.failed = (CLASS.failed || []).concat([st.id]); })
        .then(function () { CLASS.progress.done++; left--; run(); });   // 无论成败都要递减，否则派发会越过名单末尾
    };
    for (var k = 0; k < 6; k++) run();
  });
}

/* ---------- 摆位 ---------- */
function classLayout(style) {
  var n = CLASS.cards.length, i;
  var list = CLASS.cards;
  if (!n) return;
  var cx = W / 2, cy = H * 0.52;
  var cardH = CLASS_CARD.h + (CLASS.labels ? CLASS_CARD.label : 0);
  var aspect = CLASS_CARD.w / cardH;
  // 尺寸要按"人数"缩：52 个人按十几个人的尺寸排，卡片会互相盖成一条条（实测弧线队形尤为明显）
  // 留 20% 重叠余量：真实合影肩并肩、脸不会叠（完全不留量会缩得太小）
  var fit = function (slots, spanPx) { return (spanPx / Math.max(1, slots)) / aspect / 2 * 1.2; };
  var parts = [];
  var cols, rows, gw, gh, cell;
  if (style === 'grid' || !style) {                     // 合影墙：尽量扁平的网格
    cols = Math.max(1, Math.round(Math.sqrt(n * (W / H) * 1.35)));
    rows = Math.ceil(n / cols);
    gw = W * 0.92; gh = H * 0.86;
    cell = Math.min(gw / cols, gh / rows);
    for (i = 0; i < n; i++) {
      var r0 = Math.floor(i / cols), c0 = i % cols;
      parts.push({ x: cx + (c0 - (cols - 1) / 2) * cell, y: cy + (r0 - (rows - 1) / 2) * cell * 1.04, s: cell * 0.44 });
    }
  } else if (style === 'rows') {
    var rn = n > 24 ? 3 : 2;
    var per = Math.ceil(n / rn);
    for (i = 0; i < n; i++) {
      var rr = Math.floor(i / per), ci = i % per;
      var span = Math.min(W * 0.94, per * cardH * 0.62);
      var step = span / Math.max(1, per - 1 || 1);
      parts.push({
        x: cx + (ci - (per - 1) / 2) * step,
        y: cy + (rr - (rn - 1) / 2) * cardH * 0.66,
        s: Math.min(cardH * (0.40 - rr * 0.035), fit(per, W * 0.94), (H * 0.88 / rn) / 2),
      });
    }
  } else if (style === 'line') {
    for (i = 0; i < n; i++) {
      var sp = Math.min(W * 0.94, (n - 1) * cardH * 0.5);
      parts.push({ x: cx + (i - (n - 1) / 2) * (sp / Math.max(1, n - 1)), y: cy + Math.sin(i * 1.7) * cardH * 0.06,
                   s: Math.min(cardH * 0.4, fit(n, W * 0.94)) });
    }
  } else if (style === 'arc') {
    var R = Math.min(W * 0.42, (n - 1) * cardH * 0.30);
    for (i = 0; i < n; i++) {
      var t = n > 1 ? i / (n - 1) : 0.5, a = (t - 0.5) * Math.PI * 0.95;
      parts.push({
        x: cx + Math.sin(a) * R, y: cy + (1 - Math.cos(a)) * R * 0.7,
        s: Math.min(cardH * (0.40 + (1 - Math.abs(t - 0.5) * 2) * 0.05), fit(n, R * 1.9)),
      });
    }
  } else {                                              // cluster：拼贴式挤在一起
    var rad = Math.min(W, H) * 0.30;
    for (i = 0; i < n; i++) {
      var ang = i * 2.3999, rr2 = rad * Math.sqrt(i / Math.max(1, n - 1));   // 黄金角均匀铺开
      parts.push({ x: cx + Math.cos(ang) * rr2, y: cy + Math.sin(ang) * rr2 * 0.72,
                   s: Math.min(cardH * 0.30, fit(Math.ceil(Math.sqrt(n)), W * 0.8)) });
    }
  }
  // 收进画面
  var aspect = CLASS_CARD.w / (CLASS_CARD.h + (CLASS.labels ? CLASS_CARD.label : 0));   // 布局按"含名牌"的比例留位
  parts.forEach(function (p) {
    var halfW = p.s * aspect;
    p.x = Math.max(halfW + 4, Math.min(W - halfW - 4, p.x));
    p.y = Math.max(p.s * 1.06 + 4, Math.min(H - p.s * 1.06 - 4, p.y));
  });
  CLASS.targets = parts.map(function (p, k) {
    var c = list[k];
    if (c && !c.placed) {                     // 首次摆位：直接就位，别从画布左上角飞过来
      c.x = p.x; c.y = p.y; c.s = p.s; c.roll = 0; c.placed = true;
    }
    return { h: c, x: p.x, y: p.y, s: p.s, roll: (k % 3 - 1) * 0.012 };
  });
  CLASS.style = style;
}

/* ---------- 画 ---------- */
var classEmoSeen = null;
function classScene(dt, now) {
  var labelOf = classLabelNow();
  if (CLASS.busy) {                                        // 载入中：舞台上直接给进度，别只在角落转圈
    var p = CLASS.progress || { done: 0, total: 0 };
    var k = p.total ? Math.min(1, p.done / p.total) : 0;
    var cw2 = Math.min(W * 0.62, 460), ch2 = 96;
    var x0 = (W - cw2) / 2, y0 = H / 2 - ch2 / 2;
    ctx.save();
    ctx.fillStyle = 'rgba(26,22,18,0.06)'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fffdf7'; ctx.strokeStyle = 'rgba(59,55,48,0.35)'; ctx.lineWidth = 1;
    ctx.fillRect(x0, y0, cw2, ch2); ctx.strokeRect(x0 + 0.5, y0 + 0.5, cw2 - 1, ch2 - 1);
    ctx.fillStyle = '#3b3730'; ctx.textAlign = 'center';
    ctx.font = '600 15px "Noto Serif SC","Songti SC",serif';
    ctx.fillText(qxLocal('正在载入', 'Loading') + ' ' + (CLASS.name || '') + ' · ' + p.done + ' / ' + p.total, W / 2, y0 + 34);
    ctx.fillStyle = 'rgba(0,0,0,0.10)'; ctx.fillRect(x0 + 20, y0 + 48, cw2 - 40, 8);
    ctx.fillStyle = '#c2412d'; ctx.fillRect(x0 + 20, y0 + 48, (cw2 - 40) * k, 8);
    ctx.fillStyle = 'rgba(95,85,76,0.85)'; ctx.font = 'italic 12px "Noto Serif SC",serif';
    ctx.fillText(qxLocal('Esc 取消', 'Esc to cancel'), W / 2, y0 + 76);
    ctx.restore();
    return;                                                // 载入中不画卡（避免半截画面）
  }
  var emoNow = classEmotion();                              // 设置里换了表情：重载一次让卡片换图
  if (CLASS.active && CLASS.id && emoNow !== classEmoSeen) {
    classEmoSeen = emoNow;
    var cid = CLASS.id, cname = CLASS.name;
    setTimeout(function () { if (CLASS.active) classLoad(cid, cname); }, 0);
  }
  // 纸面背景
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  try { ctx.drawImage(paper, 0, 0, W, H); } catch (e) { ctx.fillStyle = '#f3efe4'; ctx.fillRect(0, 0, W, H); }
  // 标题：班级名 + 人数（像班级荣誉墙）
  if (CLASS.name) {
    ctx.save();
    ctx.fillStyle = 'rgba(59,55,48,0.82)';
    ctx.font = '600 ' + Math.round(Math.min(30, W * 0.026)) + 'px "Noto Serif SC","Songti SC",serif';
    ctx.textAlign = 'center';
    ctx.fillText(CLASS.name + ' · ' + CLASS.cards.length + qxLocal(' 位', ' faces'), W / 2, H * 0.055);
    ctx.strokeStyle = 'rgba(194,65,45,0.55)'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - Math.min(120, W * 0.12), H * 0.055 + 10);
    ctx.lineTo(W / 2 + Math.min(120, W * 0.12), H * 0.055 + 10);
    ctx.stroke();
    ctx.restore();
  }
  // 肖像卡（向目标位置缓动）
  var k = 1 - Math.pow(0.001, Math.min(0.05, dt || 0.016));   // 与帧率无关的缓动
  var list = CLASS.targets || [];
  for (var i = 0; i < list.length; i++) {
    var t = list[i], c = t.h;
    c.x += (t.x - c.x) * k; c.y += (t.y - c.y) * k; c.s += (t.s - c.s) * k; c.roll += (t.roll - c.roll) * k * 0.6;
    var label = labelOf(c);
    var lhUnit = label ? CLASS_CARD.label : 0;                     // 名牌高度（设计单位 30 → 按比例缩放）
    var unitH = CLASS_CARD.h + lhUnit;
    var ch = 2 * c.s;                                             // s = 卡的半高（舞台像素）
    var cw = ch * (CLASS_CARD.w / unitH);
    var lh = ch * (lhUnit / unitH);
    ctx.save();
    ctx.translate(c.x, c.y); ctx.rotate(c.roll);
    ctx.fillStyle = 'rgba(60,50,38,0.13)';                        // 相纸投影
    ctx.fillRect(-cw / 2 + 2, -ch / 2 + 3, cw, ch);
    ctx.fillStyle = '#f6f1e6';                                    // 名牌底板
    ctx.fillRect(-cw / 2, ch / 2, cw, lh);
    ctx.drawImage(c.canvas, -cw / 2, -ch / 2, cw, ch);
    ctx.strokeStyle = 'rgba(59,55,48,0.35)'; ctx.lineWidth = 1;   // 相框
    ctx.strokeRect(-cw / 2 + 0.5, -ch / 2 + 0.5, cw - 1, ch);
    if (label) {
      ctx.strokeStyle = 'rgba(59,55,48,0.22)';
      ctx.beginPath(); ctx.moveTo(-cw / 2, ch / 2 + 0.5); ctx.lineTo(cw / 2, ch / 2 + 0.5); ctx.stroke();
      ctx.fillStyle = '#3b3730';
      ctx.font = '600 ' + Math.max(7, Math.round(lh * 0.46)) + 'px "Noto Serif SC","Songti SC",serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      var t = String(label);
      while (t.length > 1 && ctx.measureText(t).width > cw - 8) t = t.slice(0, -1);
      ctx.fillText(t, 0, ch / 2 + lh / 2 + 0.5);
    }
    ctx.restore();
  }
  // 说明一行
  ctx.save();
  ctx.fillStyle = 'rgba(95,85,76,0.75)';
  ctx.font = 'italic 500 ' + Math.round(Math.min(15, W * 0.013)) + 'px "Noto Serif SC","Songti SC",serif';
  ctx.textAlign = 'center';
  ctx.fillText(qxLocal('按 ; 拍一张班级大合影', 'Press ; for the class photo'), W / 2, H - 14);
  ctx.restore();
}

/* ---------- 进度浮层 ---------- */
function classStatusShow(text, done, total) {
  var el = document.getElementById('classStatus');
  if (!el) {
    el = document.createElement('div');
    el.id = 'classStatus';
    el.style.cssText = 'position:fixed;left:50%;top:18%;transform:translateX(-50%);z-index:47;background:var(--paper);' +
      'border:1px solid var(--edge);border-radius:14px;padding:14px 20px;box-shadow:0 16px 40px rgba(0,0,0,.28);' +
      'font-size:13.5px;color:var(--ink);text-align:center;min-width:210px';
    document.body.appendChild(el);
  }
  el.hidden = false;
  var pct = total ? Math.round(done / total * 100) : 0;
  el.innerHTML = '<div style="margin-bottom:8px">' + text + '</div>' +
    (total ? '<div style="height:6px;border-radius:3px;background:rgba(0,0,0,.09);overflow:hidden">' +
      '<div style="height:100%;width:' + pct + '%;background:var(--stamp);transition:width .18s"></div></div>' +
      '<div style="margin-top:6px;font-size:12px;opacity:.7">' + done + ' / ' + total + '</div>' : '');
}
function classStatusHide() { var el = document.getElementById('classStatus'); if (el) el.hidden = true; }

/* ---------- 入口与设置 ---------- */
function classPickerOpen() {
  classStatusShow('正在读取班级…', 0, 0);
  classFetchClasses().then(function (list) {
    classStatusHide();
    if (!list.length) {
      classIsTeacher().then(function (isT) {
        toast(isT ? qxLocal('你名下暂时没有班级，可从下面全校班级里选。', 'No class of your own — pick one from all classes below.')
                  : qxLocal('没找到你名下的班级；登录后才会显示你的班。', 'No class found for you — sign in to see your class.'), 3600);
      });
    }
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:49;display:flex;align-items:center;justify-content:center;' +
      'background:rgba(26,22,18,.7);padding:14px';
    var sheet = document.createElement('div');
    sheet.style.cssText = 'background:var(--paper);color:var(--ink);border-radius:16px;padding:16px 18px;max-width:420px;' +
      'width:100%;max-height:80vh;overflow:auto;box-shadow:0 24px 60px rgba(0,0,0,.45)';
    sheet.innerHTML = '<h2 style="margin:0 0 4px;font-size:17px;font-family:var(--serif)">' + qxLocal('选择班级', 'Choose a class') + '</h2>' +
      '<p style="margin:0 0 12px;font-size:12px;color:var(--ink-soft)">' + qxLocal('把同学们的头像统一成一种风格，排成班级合影。', 'Unify everyone’s portrait into one style and line the class up.') + '</p>';
    var mkBtn = function (c, host) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = c.name;
      b.dataset.name = c.name;
      b.style.cssText = 'display:block;width:100%;text-align:left;font:inherit;font-size:14px;padding:10px 12px;margin-bottom:8px;' +
        'border:1px solid var(--edge);border-radius:10px;background:#fffdf7;color:var(--ink);cursor:pointer';
      b.addEventListener('click', function () { ov.remove(); classLoad(c.id, c.name); });
      (host || sheet).appendChild(b);
      return b;
    };
    var mine = document.createElement('div');
    sheet.appendChild(mine);
    list.forEach(function (c) { mkBtn(c, mine); });
    // 教师：再加一个"全校班级"区（含搜索框）——教师可加载任一班级
    var tsec = document.createElement('div');
    tsec.hidden = true;
    sheet.appendChild(tsec);
    var ttl = document.createElement('p');
    ttl.style.cssText = 'margin:10px 0 6px;font-size:12px;color:var(--ink-soft)';
    ttl.textContent = qxLocal('全校班级（教师可任选）', 'All classes (teachers)');
    var box = document.createElement('input');
    box.type = 'text';
    box.placeholder = qxLocal('搜索班级名…', 'Search a class…');
    box.style.cssText = 'font:inherit;font-size:13px;padding:6px 10px;border:1px solid var(--edge);border-radius:8px;width:100%;margin-bottom:8px;background:#fff;color:var(--ink)';
    var allBox = document.createElement('div');
    allBox.style.cssText = 'max-height:38vh;overflow:auto';
    tsec.appendChild(ttl); tsec.appendChild(box); tsec.appendChild(allBox);
    classIsTeacher().then(function (isT) {
      if (!isT) return;                                    // 学生：不展示全校班级
      classFetchAllClasses().then(function (all) {
        if (!all.length) return;
        tsec.hidden = false;
        ttl.textContent = qxLocal('全校班级（教师可任选）', 'All classes (teachers)') + ' · ' + all.length;
        all.forEach(function (c) { mkBtn(c, allBox); });
        box.addEventListener('input', function () {
          var q = box.value.trim();
          Array.prototype.forEach.call(allBox.children, function (b) {
            b.hidden = !!q && b.dataset.name.indexOf(q) < 0;
          });
        });
        box.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Escape') { ov.remove(); } });
      });
    });
    var cancel = document.createElement('button');
    cancel.type = 'button'; cancel.textContent = qxLocal('取消', 'Cancel');
    cancel.style.cssText = 'font:inherit;font-size:13px;padding:7px 16px;border-radius:999px;border:1px solid var(--edge);background:transparent;color:var(--ink);cursor:pointer';
    cancel.addEventListener('click', function () { ov.remove(); });
    sheet.appendChild(cancel);
    ov.appendChild(sheet);
    ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
    document.body.appendChild(ov);
  });
}
function classExit() {
  CLASS.active = false;
  CLASS.targets = null;
  CLASS.cards.forEach(function (c) { try { c.canvas.width = 1; c.canvas.height = 1; } catch (e) {} });
  CLASS.cards = []; CLASS.students = []; CLASS.name = '';
  classSyncUI();
  toast(qxLocal('已退出班级人像', 'Left class mode'), 1800);
}
function classSyncUI() {
  var on = document.getElementById('classOn'), off = document.getElementById('classOff'), sw = document.getElementById('classSwap');
  if (on) on.hidden = CLASS.active;
  if (off) off.hidden = !CLASS.active;
  if (sw) sw.hidden = !CLASS.active;                 // 已在班里也能"换个班"
}

(function classEntries() {
  var menu = document.querySelector('.playMoreMenu');
  if (menu) {
    var lab = document.createElement('div');
    lab.className = 'playLabel'; lab.style.cssText = 'margin:2px 0 0;font-size:11px;opacity:.7';
    lab.textContent = qxLocal('班级人像', 'Class portraits');
    menu.appendChild(lab);
    var b = document.createElement('button');
    b.type = 'button'; b.id = 'classOn'; b.textContent = qxLocal('加载班级人像…', 'Load a class…');
    b.addEventListener('click', classPickerOpen);
    menu.appendChild(b);
    var bs = document.createElement('button');
    bs.type = 'button'; bs.id = 'classSwap'; bs.textContent = qxLocal('换个班…', 'Switch class…');
    bs.hidden = true;
    bs.addEventListener('click', classPickerOpen);
    menu.appendChild(bs);
    var b2 = document.createElement('button');
    b2.type = 'button'; b2.id = 'classOff'; b2.textContent = qxLocal('退出班级人像', 'Leave class mode');
    b2.hidden = true;
    b2.addEventListener('click', classExit);
    menu.appendChild(b2);
  }
  document.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Escape' && CLASS.active && !PHOTO.active && typeof PHOTO_LAB !== 'undefined' && !PHOTO_LAB.open) {
      if (CLASS.busy) { CLASS.cancel = true; return; }      // 载入中：Esc 先取消载入
      classExit();
    }
  });
})();

/* 设置：姓名显示 / 色温归一 / 颗粒 */
(function classPanel() {
  var grp = null;
  PANEL.forEach(function (G) { if ((G.items || []).some(function (it) { return it.id === 'photoFrame'; })) grp = G; });
  if (!grp) return;
  if (!grp.items.some(function (it) { return it.id === 'className'; })) {
    var at = grp.items.findIndex(function (it) { return it.id === 'photoFrame'; });
    grp.items.splice(at + 1, 0,
      { id: 'className', label: '名牌显示', type: 'seg', opts: [['nick', '昵称'], ['id', '学籍号'], ['off', '不显示']] },
      { id: 'classTone', label: '统一色温', type: 'seg', opts: [['low', '轻微'], ['mid', '适中'], ['high', '明显']] },
      { id: 'classEmotion', label: '表情', type: 'seg', opts: [['', '原始'], ['joy', '喜'], ['anger', '怒'], ['sorrow', '哀'], ['delight', '乐']] });
  }
})();
CFG_DEFAULT.className = (CFG_DEFAULT.className == null) ? 'nick' : CFG_DEFAULT.className;
CFG.className = (CFG.className == null) ? CFG_DEFAULT.className : CFG.className;
CFG_DEFAULT.classEmotion = (CFG_DEFAULT.classEmotion == null) ? '' : CFG_DEFAULT.classEmotion;
CFG.classEmotion = (CFG.classEmotion == null) ? CFG_DEFAULT.classEmotion : CFG.classEmotion;
CFG_DEFAULT.classTone = (CFG_DEFAULT.classTone == null) ? 'mid' : CFG_DEFAULT.classTone;
CFG.classTone = (CFG.classTone == null) ? CFG_DEFAULT.classTone : CFG.classTone;
CLASS.labels = (CFG.className === 'off') ? false : CFG.className;
CLASS.tone = CFG.classTone === 'low' ? 0.18 : (CFG.classTone === 'high' ? 0.6 : 0.35);

/* ---------- 学生头像不参与天演（原"繁殖"） ----------
   班级人像是真实同学的头像，不参与混生：班级模式下一律拒绝，
   将来若把学生做成台上的角色，也认 __student 这个标记。 */
(function classNoBreed() {
  var refuse = function () {
    if (typeof toast === 'function') {
      toast(qxLocal('同学的头像不参与天演 —— 天演只属于这里的原生角色。',
        'Classmates do not take part in evolution — that belongs to the native cast.'), 3000);
    }
  };
  var wrap = function (fn) {
    return function (a, b) {
      if (CLASS.active || (a && a.__student) || (b && b.__student)) { refuse(); return; }
      return fn.apply(this, arguments);
    };
  };
  if (typeof startBreed === 'function') startBreed = wrap(startBreed);
  if (typeof doBreed === 'function') doBreed = wrap(doBreed);
  var baseCards = classLoad;
  classLoad = function () {                     // 载入后给每张卡打上标记（未来若成为角色，天演会认它）
    var r = baseCards.apply(this, arguments);
    setTimeout(function () { CLASS.cards.forEach(function (c) { c.__student = true; }); }, 0);
    return r;
  };
})();

/* ---------- 单个同学的操作：点卡片 → 大图 + 名字 + 单独换表情 ----------
   规范：沿用应用的纸面/朱印样式（--paper/--ink/--stamp + 衬线字），按钮 ≥40px 供手机点按。 */
var CLASS_CARD_V = {};                                  // uid → 这一位单独选的表情（覆盖全局设置）
function classCardHit(x, y) {
  var list = CLASS.targets || [];
  for (var i = list.length - 1; i >= 0; i--) {
    var t = list[i], ch = 2 * t.s, cw = ch * (CLASS_CARD.w / (CLASS_CARD.h + (CLASS.labels ? CLASS_CARD.label : 0)));
    if (Math.abs(x - t.h.x) <= cw / 2 + 4 && Math.abs(y - t.h.y) <= ch / 2 + 4) return t.h;
  }
  return null;
}
function classReloadStudent(card, emotion) {
  var g = function (u) { return fetch(u, { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.blob() : null; }).catch(function () { return null; }); };
  var V = (typeof QX_ASSET_V !== 'undefined') ? ('?v=' + QX_ASSET_V) : '';
  var first = emotion ? ('/avatars/unified/emotion/' + emotion + '/' + card.uid + '.png' + V)
                      : ('/avatars/unified/display/' + card.uid + '.png' + V);
  return g(first).then(function (b) {
    if (b) return b;
    return g('/avatars/unified/display/' + card.uid + '.png' + V).then(function (b2) { return b2 || g(card.src || ''); });
  }).then(function (b) {
    if (!b) return false;
    return createImageBitmap(b).then(function (img) {
      var card2 = (typeof classBaselineCard === 'function') ? classBaselineCard(img, card.name) : classMakeCard(img, card.name, 0);
      try { img.close && img.close(); } catch (e) {}
      try { card.canvas.width = 1; card.canvas.height = 1; } catch (e) {}
      card.canvas = card2;
      return true;
    });
  });
}
function classStudentSheet(card) {
  var old = document.getElementById('classSheet');
  if (old) old.remove();
  var ov = document.createElement('div');
  ov.id = 'classSheet';
  ov.style.cssText = 'position:fixed;inset:0;z-index:49;display:flex;align-items:center;justify-content:center;' +
    'background:rgba(26,22,18,.62);padding:14px';
  var sh = document.createElement('div');
  sh.style.cssText = 'background:var(--paper);color:var(--ink);border-radius:16px;padding:14px 16px 12px;max-width:360px;' +
    'width:100%;max-height:92vh;overflow:auto;box-shadow:0 24px 60px rgba(0,0,0,.45);text-align:center';
  sh.innerHTML = '<h2 style="margin:0 0 2px;font-size:17px;font-family:var(--serif)">' + (card.name || '') + '</h2>' +
    '<p style="margin:0 0 10px;font-size:12px;color:var(--ink-soft)">' + (card.sid || '') + '</p>';
  var big = document.createElement('canvas');
  var cvv = card.canvas;
  big.width = 220; big.height = Math.round(220 * cvv.height / Math.max(1, cvv.width));
  big.getContext('2d').drawImage(cvv, 0, 0, big.width, big.height);
  big.style.cssText = 'max-width:100%;border-radius:3px;box-shadow:0 10px 26px rgba(0,0,0,.28);background:#fff';
  sh.appendChild(big);
  var p2 = document.createElement('p');
  p2.style.cssText = 'margin:10px 0 6px;font-size:12px;color:var(--ink-soft)';
  p2.textContent = qxLocal('单独换表情', 'Expression just for them');
  sh.appendChild(p2);
  var row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:6px;justify-content:center;flex-wrap:wrap';
  var opts = [['', qxLocal('原始', 'Original')]].concat(CLASS_EMOTIONS.map(function (e) {
    return [e, uiZh(e)];
  }));
  opts.forEach(function (o) {
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = o[1];
    var on = (CLASS_CARD_V[card.uid] || '') === o[0];
    b.style.cssText = 'font:inherit;font-size:13px;min-height:40px;padding:8px 14px;border-radius:999px;cursor:pointer;' +
      (on ? 'background:var(--ink);color:var(--paper);border:1px solid var(--ink)'
          : 'background:transparent;color:var(--ink);border:1px solid var(--edge)');
    b.addEventListener('click', function () {
      CLASS_CARD_V[card.uid] = o[0];
      b.disabled = true;
      classReloadStudent(card, o[0]).then(function (ok) {
        if (!ok) toast(qxLocal('这一位暂时换不了表情。', 'No expression variant for this one yet.'), 2400);
        ov.remove();
      });
    });
    row.appendChild(b);
  });
  sh.appendChild(row);
  var foot = document.createElement('div');
  foot.style.cssText = 'margin-top:12px';
  var close = document.createElement('button');
  close.type = 'button'; close.textContent = qxLocal('关闭', 'Close');
  close.style.cssText = 'font:inherit;font-size:13px;min-height:40px;padding:8px 18px;border-radius:999px;' +
    'border:1px solid var(--edge);background:transparent;color:var(--ink);cursor:pointer';
  close.addEventListener('click', function () { ov.remove(); });
  foot.appendChild(close); sh.appendChild(foot);
  ov.appendChild(sh);
  ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
  document.body.appendChild(ov);
}
function uiZh(e) { var m = { joy: '喜', anger: '怒', sorrow: '哀', delight: '乐' }; return qxLocal(m[e] || e, e); }

/* 点卡片：班级模式下舞台上只有卡片，这里接管点击（含手机触摸） */
(function classCardTap() {
  var down = null;
  ['pointerdown', 'pointerup'].forEach(function (ev) {
    window.addEventListener(ev, function (e) {
      if (!CLASS.active || CLASS.busy) return;
      var tag = (e.target && e.target.tagName) || '';
      if (tag !== 'CANVAS') return;
      if (typeof PHOTO !== 'undefined' && PHOTO.active) return;
      if (typeof PHOTO_LAB !== 'undefined' && PHOTO_LAB.open) return;
      var r = cv.getBoundingClientRect();
      var p = { x: (e.clientX - r.left), y: (e.clientY - r.top) };
      if (ev === 'pointerdown') { down = p; return; }
      if (!down || Math.abs(p.x - down.x) > 8 || Math.abs(p.y - down.y) > 8) { down = null; return; }
      down = null;
      var h = classCardHit(p.x, p.y);
      if (h) classStudentSheet(h);
    }, true);
  });
})();

/* 快门时刻把卡片吸附到位：缓动是逐帧的，慢设备/低帧率下 1.25 秒还走不完，
   直接拍就会拍到"半途的队形"（实测无头环境 10fps 时明显）。吸附只影响收尾那一帧。 */
(function classSnapOnShoot() {
  if (typeof photoShoot !== 'function') return;
  var baseShoot = photoShoot;
  photoShoot = function () {
    try {
      (CLASS.targets || []).forEach(function (t) {
        var c = t.h;
        if (!c) return;
        c.x = t.x; c.y = t.y; c.s = t.s; c.roll = t.roll;
      });
    } catch (e) {}
    return baseShoot.apply(this, arguments);
  };
})();

/* ---------- 接进应用：绘制接管 + 大合照沿用 ---------- */
var classBaseGrid = drawGrid;
drawGrid = function (dt, now) {
  if (CLASS.active) { try { classScene(dt, now); } catch (e) { } return; }
  return classBaseGrid.apply(this, arguments);
};
var classBasePose = photoPose;
photoPose = function (style) {
  if (CLASS.active && CLASS.cards.length) {
    classLayout(style);
    return CLASS.targets;
  }
  return classBasePose.apply(this, arguments);
};

if (typeof UI_PAIRS !== 'undefined') {
  UI_PAIRS.push(['班级人像', 'Class portraits'], ['加载班级人像…', 'Load a class…'], ['退出班级人像', 'Leave class mode'],
    ['选择班级', 'Choose a class'], ['名牌显示', 'Name tag'], ['学籍号', 'Student no.'], ['不显示', 'Hide'],
    ['统一色温', 'Unified tone'], ['轻微', 'Light'], ['适中', 'Medium'], ['明显', 'Strong']);
}

try {
  window.__class = {
    pick: classPickerOpen, load: classLoad, exit: classExit, layout: classLayout,
    get active() { return CLASS.active; },
    get name() { return CLASS.name; },
    get count() { return CLASS.cards.length; },
    get progress() { return CLASS.progress; },
    get sources() { return { baseline: CLASS.baseline, fallback: CLASS.fallback, failed: CLASS.failed || [] }; },
    get raw() {   // 【临时】看真实卡片画布尺寸与存活数
      var alive = 0, dead = 0, dims = [];
      CLASS.cards.forEach(function (c, i) { if (c.canvas.width > 2) alive++; else dead++; if (i < 3) dims.push(c.canvas.width + 'x' + c.canvas.height); });
      return { alive: alive, dead: dead, dims: dims };
    },
    get bytes() {                                   // 离屏卡画布不进 __mem（它只数挂 DOM 的），这里单独记账
      var n = 0;
      CLASS.cards.forEach(function (c) { try { n += c.canvas.width * c.canvas.height * 4; } catch (e) {} });
      return { cards: CLASS.cards.length, cardMB: +(n / 1048576).toFixed(1) };
    },
    get style() { return CLASS.style; },
    get cards() { return CLASS.cards.map(function (c) { return { name: c.name, x: Math.round(c.x), y: Math.round(c.y), s: +c.s.toFixed(1) }; }); },
    classes: classFetchClasses,
    roster: classFetchRoster,
    /* 单张调试：给个 URL，返回统一后的肖像卡 dataURL（用于比对"风格一致"） */
    card: function (url, label) {
      return fetch(url, { credentials: 'same-origin' }).then(function (r) { return r.blob(); })
        .then(function (b) { return createImageBitmap(b); })
        .then(function (img) {
          var mask = classKeyMask(img);
          var bgN = 0, tot = mask.w * mask.h;
          for (var i = 0; i < mask.data.length; i++) if (mask.data[i] < 128) bgN++;
          var anchor = classHeadAnchor(mask);
          var anchor = classHeadAnchor(mask);
          window.__keyDbg = { img: img.width + 'x' + img.height, anchor: !!anchor };
          var c = classMakeCard(img, label || '', 0);
          var d = c.toDataURL('image/png'); c.width = 1; c.height = 1;
          return d;
        });
    },
  };
} catch (e) {}
