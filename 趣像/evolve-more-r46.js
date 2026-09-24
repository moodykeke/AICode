/* 趣像 23 (r46): 生态缸第三期
   ─────────────────────────────────────────────────────────────
     时间倒带    每一代都存一份缸码（最近 80 代）；点种群曲线上任一处，缸回到那一代，从那里分叉重来
     食物链      狐狸抓小鸡和兔子、猫头鹰和猫抓老鼠、老虎抓小猪——捕食者挨着猎物时，猎物可能被抓走（每代最多两起），
                 捕食者吃饱了多生；物种志记一笔（"狐狸抓走了一只白·兔子。"）
     共生        人和狗（看家护院）、人和猫（捉老鼠）、小猪和小鸡（农家院）、机器人和外星访客（技术交流）挨着时，两边都多生、少病
     进化延时    每一代存一张小缩略图（最近 150 代），一键导出成 8 帧/秒的小视频：舞台 + 代数 + 气候 + 种群曲线逐帧长出来；
                 浏览器不支持录像时，改存一张"进化连环画"（最多 24 格）
     海报送展墙  进化史海报可以直接投到校园作品墙（与卡片同一条平台通道）；展墙上的"作品码"就是缸码，打开即是这一缸
     缸码导入    代码框里粘贴缸码（qxt1_…）也能直接打开；从缸码来的生物，卡片上写"来自分享的缸码 · 第 N 代" */

/* ========== 一、时间倒带 ========== */
EVO.snaps = [];
function evoSnap() {
  if (!EVO.on || !heads.some(evoLive)) return;
  var last = EVO.snaps[EVO.snaps.length - 1];
  if (last && last.gen === EVO.gen) { last.code = evoExportCode(); return; }
  EVO.snaps.push({ gen: EVO.gen, code: evoExportCode() });
  if (EVO.snaps.length > 80) EVO.snaps.shift();
}
function evoRewind(gen) {
  var s = null; EVO.snaps.forEach(function (q) { if (q.gen <= gen && (!s || q.gen > s.gen)) s = q; });
  if (!s) { toast(evoL('那一代没有存档。', 'No snapshot for that generation.'), 1600); return false; }
  var journal = EVO.journal.filter(function (j) { return j.gen <= s.gen; }), hist = EVO.hist.filter(function (h) { return h.gen <= s.gen; }), lineage = EVO.lineage, snaps = EVO.snaps.filter(function (q) { return q.gen <= s.gen; });
  var from = EVO.gen, climate2 = EVO.climate2, ch = EVO.challenge;
  EVO.rewinding = true;
  var ok = false; try { ok = evoImportCode(s.code); } finally { EVO.rewinding = false; }
  if (!ok) return false;
  EVO.journal = journal; EVO.hist = hist; EVO.lineage = lineage; EVO.snaps = snaps;
  Object.keys(lineage).forEach(function (k) { lineage[k].gone = false; });
  if (ch && !ch.done) EVO.challenge = ch;
  EVO.timelapse = (EVO.timelapse || []).filter(function (f) { return f.gen <= s.gen; });
  evoLog('⟲ 时间倒回第 ' + s.gen + ' 代（从第 ' + from + ' 代）。从这里分叉重来。', '⟲ Rewound to generation ' + s.gen + ' (from ' + from + '). A new branch starts here.', 'mile');
  evoRenderStats();
  return true;
}

/* ========== 二、食物链与共生 ========== */
var EVO_PREY = { fox: ['chick', 'rabbit'], owl: ['mouse'], cat: ['mouse'], tiger: ['pig'] };
var EVO_BUDDY = [['human', 'dog', '看家护院', 'guarding the house'], ['human', 'cat', '捉老鼠', 'mousing'], ['pig', 'chick', '农家院', 'farmyard friends'], ['robot', 'alien', '技术交流', 'swapping tech']];
EVO.chainSeen = {};
function evoFoodChain() {
  var alive = heads.filter(evoLive), eaten = 0;
  alive.forEach(function (h) { if (h.evo) { h.evo.buddy = 0; h.evo.full = 0; } });
  /* 共生 */
  alive.forEach(function (h) {
    if (h.g.natural) return;
    evoNear(h).forEach(function (o) {
      if (!evoLive(o) || o.g.natural) return;
      EVO_BUDDY.forEach(function (B) {
        if ((h.g.sp === B[0] && o.g.sp === B[1]) || (h.g.sp === B[1] && o.g.sp === B[0])) {
          h.evo.buddy = 1; o.evo.buddy = 1;
          var key = 'b:' + B[0] + B[1];
          if (!EVO.chainSeen[key]) { EVO.chainSeen[key] = 1; evoLog('共生：' + CARDZH_SP[B[0]] + '和' + CARDZH_SP[B[1]] + '挨在一起就过得更好（' + B[2] + '）。', 'Symbiosis: ' + SPNAME[B[0]] + ' and ' + SPNAME[B[1]] + ' do better side by side (' + B[3] + ').', 'top'); }
        }
      });
    });
  });
  /* 捕食 */
  alive.sort(function () { return Math.random() - .5; }).forEach(function (h) {
    if (eaten >= 2 || !evoLive(h) || h.g.natural) return;
    var prey = EVO_PREY[h.g.sp]; if (!prey || Math.random() > .22) return;
    var victims = evoNear(h).filter(function (o) { return evoLive(o) && !o.g.natural && prey.indexOf(o.g.sp) >= 0; });
    if (!victims.length) return;
    var v = evoRand(victims), vv = evoVariantOf(v), hv = evoVariantOf(h);
    act(h, 'lean', { dir: dirTo(h, v) });
    evoKill(v, 'eaten');
    h.evo.full = 1; h.evo.buddy = 1; eaten++;          /* 吃饱了：本代多生（记在 buddy 上，基线的"吃"那一步会先把 fed 清零） */
    if (SOUND && allow('evoChomp', 300, 1)) try { SFX.ptoo(panOf(v)); } catch (e) {}
    var key = 'p:' + h.g.sp + v.g.sp;
    if (!EVO.chainSeen[key] || Math.random() < .25) { EVO.chainSeen[key] = 1; evoLog(hv.zh + '抓走了一只' + vv.zh + '。', 'A ' + hv.en + ' caught a ' + vv.en + '.', 'gone'); }
  });
}
var evoMoreBaseGen = evoGeneration;
evoGeneration = function () {
  if (EVO.on && heads.some(evoLive)) { try { evoFoodChain(); } catch (e) {} }
  return evoMoreBaseGen.apply(this, arguments);
};

/* ========== 三、进化延时（每代一张缩略图） ========== */
EVO.timelapse = [];
function evoGrabFrame() {
  if (!EVO.on || !cv.width) return;
  var last = EVO.timelapse[EVO.timelapse.length - 1]; if (last && last.gen === EVO.gen) return;
  var w = 360, h = Math.round(w * cv.height / cv.width), c = document.createElement('canvas'); c.width = w; c.height = h;
  try { c.getContext('2d').drawImage(cv, 0, 0, w, h); } catch (e) { return; }
  var item = { gen: EVO.gen, climate: EVO.climate, climate2: EVO.climate2, n: heads.filter(evoLive).length, url: null };
  try { item.url = c.toDataURL('image/jpeg', .72); } catch (e) { return; }
  c.width = c.height = 1;
  EVO.timelapse.push(item);
  if (EVO.timelapse.length > 150) EVO.timelapse.shift();
}
var evoMoreBaseCensus = evoCensus;
evoCensus = function () {
  var r = evoMoreBaseCensus.apply(this, arguments);
  if (EVO.on) { evoSnap(); setTimeout(evoGrabFrame, 60); }
  return r;
};
function evoLoadImg(url) { return new Promise(function (res) { var im = new Image(); im.onload = function () { res(im); }; im.onerror = function () { res(null); }; im.src = url; }); }
async function evoTimelapse() {
  var F = EVO.timelapse.slice();
  if (F.length < 3) { toast(evoL('再多演几代，才有东西可以做延时。', 'Let it run a few more generations first.'), 2000); return; }
  if (!beginExport(['进化延时', 'evolution timelapse'])) return;
  try {
    var ims = []; for (var i = 0; i < F.length; i++) ims.push(await evoLoadImg(F[i].url));
    var fw = 720, fh = Math.round(fw * (ims[0] ? ims[0].height / ims[0].width : .6)), chartH = 90, head = 54, c = document.createElement('canvas');
    c.width = fw; c.height = head + fh + chartH + 16;
    var x = c.getContext('2d'), sans = 'system-ui,"PingFang SC","Noto Sans SC",sans-serif';
    var maxN = Math.max(1, heads.length);
    var paint = function (k) {
      var f = F[k];
      x.fillStyle = '#f5efe3'; x.fillRect(0, 0, c.width, c.height);
      x.fillStyle = '#3a342c'; x.font = '700 26px ' + sans; x.textAlign = 'left';
      x.fillText(evoL('生态缸 · 第 ' + f.gen + ' 代', 'Tank · generation ' + f.gen), 16, 36);
      x.font = '400 18px ' + sans; x.textAlign = 'right'; x.fillStyle = '#6a5f52';
      x.fillText(evoL(EVO_CLIMATES[f.climate].zh + (f.climate2 ? ' | ' + EVO_CLIMATES[f.climate2].zh : '') + ' · ' + f.n + ' 只', EVO_CLIMATES[f.climate].en + (f.climate2 ? ' | ' + EVO_CLIMATES[f.climate2].en : '') + ' · ' + f.n), fw - 16, 36);
      if (ims[k]) x.drawImage(ims[k], 0, head, fw, fh);
      var y0 = head + fh + 8; x.fillStyle = '#ece3d2'; x.fillRect(16, y0, fw - 32, chartH);
      x.fillStyle = 'hsla(150,40%,45%,.8)'; x.beginPath(); x.moveTo(16, y0 + chartH);
      for (var j = 0; j <= k; j++) x.lineTo(16 + (fw - 32) * j / Math.max(1, F.length - 1), y0 + chartH - F[j].n / maxN * (chartH - 4));
      x.lineTo(16 + (fw - 32) * k / Math.max(1, F.length - 1), y0 + chartH); x.closePath(); x.fill();
    };
    var types = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'], mime = '';
    if (window.MediaRecorder && c.captureStream) for (var t = 0; t < types.length; t++) if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(types[t])) { mime = types[t]; break; }
    if (!mime) {                                        // 不支持录像：进化连环画
      var step = Math.max(1, Math.ceil(F.length / 24)), picks = []; for (var p = 0; p < F.length; p += step) picks.push(p);
      var cols2 = 4, rows2 = Math.ceil(picks.length / cols2), tw = 300, th = Math.round(tw * fh / fw), sheet = document.createElement('canvas');
      sheet.width = cols2 * tw; sheet.height = rows2 * (th + 28); var sx = sheet.getContext('2d'); sx.fillStyle = '#f5efe3'; sx.fillRect(0, 0, sheet.width, sheet.height);
      picks.forEach(function (k2, i2) { var X = (i2 % cols2) * tw, Y = Math.floor(i2 / cols2) * (th + 28); if (ims[k2]) sx.drawImage(ims[k2], X + 4, Y + 24, tw - 8, th - 4); sx.fillStyle = '#3a342c'; sx.font = '500 15px ' + sans; sx.fillText(evoL('第 ' + F[k2].gen + ' 代', 'Gen ' + F[k2].gen), X + 6, Y + 18); });
      sheet.toBlob(function (b) { endExport(); evoDownload(b, 'quxiang-tank-comic.png'); toast(evoL('浏览器不支持录像，存成了一张进化连环画。', 'No video recording here — saved a comic strip instead.'), 2600); }, 'image/png');
      return;
    }
    var stream = c.captureStream(24), chunks = [], rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 3e6 });
    rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
    rec.onstop = function () { endExport(); var b = new Blob(chunks, { type: rec.mimeType || mime }); evoDownload(b, 'quxiang-tank-timelapse.' + (/mp4/.test(mime) ? 'mp4' : 'webm')); toast(evoL('进化延时已保存（' + F.length + ' 代）。', 'Timelapse saved (' + F.length + ' generations).'), 2400); };
    paint(0); rec.start();
    var k = 0, tick = function () { paint(k); k++; if (k < F.length) setTimeout(tick, 125); else setTimeout(function () { paint(F.length - 1); setTimeout(function () { rec.stop(); }, 700); }, 125); };
    setTimeout(tick, 125);
  } catch (e) { exportFailed(); }
}
function evoDownload(blob, name) {
  if (!blob) return;
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 3000);
}

/* ========== 四、海报送展墙 ========== */
async function evoPosterWall() {
  var c = evoPosterCanvas(); if (!c) return;
  var me = null;
  try { var r = await fetch('/api/v2/auth/me', { credentials: 'same-origin' }); me = await r.json(); } catch (e) {}
  if (!me || !me.username) { toast(evoL('登录后可以挂到展墙；海报用「海报」照样存到本地。', 'Sign in to hang it on the wall — or save the poster locally.'), 4200); return; }
  if (!beginExport(['展墙投稿', 'wall submission'])) return;
  try {
    var small = document.createElement('canvas'); small.width = 720; small.height = Math.round(720 * c.height / c.width); small.getContext('2d').drawImage(c, 0, 0, small.width, small.height);
    var blob = await new Promise(function (res) { small.toBlob(res, 'image/jpeg', .86); });
    var uri = await new Promise(function (res) { var fr = new FileReader(); fr.onload = function () { res(fr.result); }; fr.readAsDataURL(blob); });
    var code = 'tank=' + evoExportCode(), title = evoL('生态缸 · 第 ' + EVO.gen + ' 代', 'Evolution tank · gen ' + EVO.gen);
    var url = '/api/v1/projects/' + encodeURIComponent(me.username) + '/quxiang-tank-' + Date.now().toString(36);
    var res = await fetch(url, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_type: 'quxiang', thumbnail: uri, extra_files: { 'main.txt': code }, notes: title, project_metadata: { kind: 'quxiang-tank', title: title, series: EVO_CLIMATES[EVO.climate].zh } }) });
    var js = {}; try { js = await res.json(); } catch (e) {}
    if (!res.ok || !js.ok) { exportFailed(); return; }
    try { await fetch(url + '/metadata?ispublic=true&ispublished=true', { method: 'POST', credentials: 'same-origin' }); } catch (e) {}
    endExport();
    toast(evoL('进化史挂上了作品墙；展墙上点开就是这一缸。', 'Hung on the wall — opening it there rebuilds this tank.'), 4200);
  } catch (e) { exportFailed(); }
}

/* ========== 五、缸码也能从代码框导入；导入的生物带"来历" ========== */
if (typeof importCode === 'function') {
  var evoMoreBaseImport = importCode;
  importCode = function (str) {
    var s = String(str || '');
    if (s.indexOf('qxt1_') >= 0) { var ok = evoImportCode(decodeURIComponent(s.slice(s.indexOf('qxt1_')))); if (!ok) toast(evoL('看不懂这段缸码。', 'That tank code doesn’t parse.'), 2000); return ok; }
    return evoMoreBaseImport.apply(this, arguments);
  };
}
var evoMoreBaseImportCode = evoImportCode;
evoImportCode = function (str) {
  if (!EVO.rewinding) EVO.importUntil = performance.now() + 4000;   /* 摆放是分批延时的，所以用一个时间窗而不是同步标记 */
  return evoMoreBaseImportCode.apply(this, arguments);
};
var evoMoreBasePlace = evoPlace;
evoPlace = function (h, dna) {
  if (performance.now() < (EVO.importUntil || 0) && typeof cardBio === 'function') {
    var C = EVO_CLIMATES[EVO.climate];
    cardBio(dna, { zh: '来自分享的缸码 · 第 ' + EVO.gen + ' 代 · ' + C.zh, en: 'From a shared tank code · gen ' + EVO.gen + ' · ' + C.en.toLowerCase() });
  }
  return evoMoreBasePlace.apply(this, arguments);
};

/* ========== 六、面板：曲线可点、新按钮 ========== */
UI_PAIRS.push(['延时', 'Timelapse'], ['送展墙', 'To the wall'], ['点曲线回到那一代', 'Click the chart to rewind to that generation']);
var evoMoreBaseBuild = evoBuildPanel;
evoBuildPanel = function () {
  var fresh = !EVO.panel, p = evoMoreBaseBuild.apply(this, arguments);
  if (!fresh) return p;
  p.chart.style.cursor = 'pointer'; p.chart.title = uiText('点曲线回到那一代');
  p.chart.addEventListener('click', function (e) {
    var H2 = EVO.hist; if (H2.length < 2) return;
    var r = p.chart.getBoundingClientRect(), k = Math.round((e.clientX - r.left) / r.width * (H2.length - 1));
    var g = H2[clamp(k, 0, H2.length - 1)].gen;
    if (g >= EVO.gen) return;
    evoRewind(g);
  });
  var r4 = p.el.querySelector('.evoRow.r4');
  if (r4) [['延时', evoTimelapse], ['送展墙', evoPosterWall]].forEach(function (it) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = uiText(it[0]); b.addEventListener('click', function () { it[1](); }); r4.appendChild(b);
  });
  return p;
};
var evoMoreBaseEnter = evoEnter;
evoEnter = function () { EVO.snaps = []; EVO.timelapse = []; EVO.chainSeen = {}; return evoMoreBaseEnter.apply(this, arguments); };
try { Object.assign(window.__evo, { rewind: evoRewind, snaps: function () { return EVO.snaps.map(function (s) { return s.gen; }); }, timelapse: evoTimelapse, frames: function () { return EVO.timelapse.length; }, wall: evoPosterWall }); } catch (e) {}
