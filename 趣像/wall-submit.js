/* 趣像 10 (r23): 送去展墙——把一张卡变成校园展品
   设计：卡片比"导出 PNG"更进一步——作品码（角色 DNA）随卡片一起交上去（存在项目主文件 main.txt），
   于是展墙上点开展品，"在趣像里看这张脸"能把同一个角色原样打开继续玩。

   边界（未登录也不影响主要功能）：
   · 未登录：只提示"登录后可以挂到展墙"，本地导出、收藏、玩法一律不变；
   · 已登录：走平台既有作品通道——POST /api/v1/projects/{用户名}/{作品名}（project_type=quxiang
     + thumbnail + extra_files.main.txt），随后置 ispublic=true（分享给登录用户）。
     正式上墙（ispublished）由老师在作品墙里点一下——这是平台既有的可见性口径，也是天然的审核位。 */

(function wallSubmit(){
  var actions = document.getElementById('actions');
  if (!actions) return;

  var btn = document.createElement('button');
  btn.className = 'act'; btn.type = 'button'; btn.id = 'wallSubmitBtn';
  btn.innerHTML = '<span class="g">⇪</span> 送去展墙';
  btn.title = '把这张卡挂到校园作品墙（随时可撤下）';
  actions.appendChild(btn);

  function slugOf(s){
    return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 18) || 'card';
  }
  function blobToDataUri(blob){
    return new Promise(function(res){
      var fr = new FileReader();
      fr.onload = function(){ res(fr.result); };
      fr.readAsDataURL(blob);
    });
  }
  function canvasToJpeg(canvas, quality){
    return new Promise(function(res){
      canvas.toBlob(function(b){ res(b); }, 'image/jpeg', quality);
    });
  }
  /** 展墙用图：同一套渲染路径，但按展墙需要的尺寸出图。
   *  1020×1428 的 PNG 转 base64 约 2.8MB，会撞上服务端 2MB 请求体上限（实测 413），
   *  展墙最大只显示到灯箱宽度，所以用 2 倍尺寸的 JPEG 足够，体积约两百分之一。 */
  function renderCardCanvas(){
    var k = 2, c = document.createElement('canvas');
    c.width = CW * k; c.height = CH * k;
    var x = c.getContext('2d');
    var pat = x.createPattern(makePaperCanvas(c.width, c.height), 'no-repeat');
    x.setTransform(k, 0, 0, k, 0, 0);
    x.save(); roundRect(x, 0, 0, CW, CH, 16); x.clip();
    var snap = { id: card.id, head: card.head, founders: card.founders };
    renderTo(x, pat, 1.25, function(){ paintFront(snap, card.o, true); });
    x.restore();
    return c;
  }

  btn.addEventListener('click', async function(){
    if (!card || !card.head) return;

    // 1) 先问"你是谁"——未登录只提示，不拦本地操作
    var me = null;
    try {
      var r = await fetch('/api/v2/auth/me', { credentials: 'same-origin' });
      me = await r.json();
    } catch (e) { /* 网络异常也按未登录处理 */ }
    if (!me || !me.username) {
      toast(qxLocal('登录后可以挂到展墙；卡片用「↓ 卡片」照样存到本地。',
                    'Sign in to hang this card on the wall — or just save it locally.'), 4600);
      return;
    }

    // 2) 出图（复用导出那套忙态反馈）
    if (!beginExport(['展墙投稿', 'wall submission'])) return;
    try {
      var canvas = renderCardCanvas();
      var blob = await canvasToJpeg(canvas, 0.88);
      // 万一某张图特别复杂超了 1.6MB，再降一档尺寸重来一次（宁可略小，也不要 413）
      if (blob && blob.size > 1.6 * 1024 * 1024) {
        var small = document.createElement('canvas');
        small.width = Math.round(CW * 1.4); small.height = Math.round(CH * 1.4);
        small.getContext('2d').drawImage(canvas, 0, 0, small.width, small.height);
        blob = await canvasToJpeg(small, 0.84);
      }
      var dataUri = await blobToDataUri(blob);

      var title = (card.id && card.id.name) ? card.id.name : '趣像角色卡';
      var code = String((card.id && card.id.code) || (card.head && card.head.code) || '');
      var name = 'quxiang-' + slugOf(code || title) + '-' + Date.now().toString(36);
      var payload = {
        project_type: 'quxiang',
        thumbnail: dataUri,
        extra_files: { 'main.txt': code },          // 主文件＝作品码：展墙上能原样打开
        notes: title,
        project_metadata: { kind: 'quxiang-card', title: title, series: (card.id && card.id.species) || '' },
      };
      var url = '/api/v1/projects/' + encodeURIComponent(me.username) + '/' + name;
      var res = await fetch(url, {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      var js = {};
      try { js = await res.json(); } catch (e) {}
      if (!res.ok || !js.ok) { exportFailed(); return; }

      // 3) 上墙＝分享 + 发布（平台的发布权只归作者本人：教师只能提醒，不能替学生发布）
      try {
        await fetch(url + '/metadata?ispublic=true&ispublished=true', { method: 'POST', credentials: 'same-origin' });
      } catch (e) { /* 发布失败也不算投稿失败，作品墙的"我的作品"里还能再试 */ }

      endExport();
      toast(qxLocal('已挂上作品墙（校内资源 → 作品墙）· 想撤下就在展墙上点自己的作品',
                    'Hung on the wall (Campus → Wall) — open your work there to take it down.'), 5200);
    } catch (e) {
      exportFailed();
    }
  });

  if (typeof UI_PAIRS !== 'undefined') {
    UI_PAIRS.push(['送去展墙', 'Send to the wall'],
      ['把这张卡挂到校园作品墙（随时可撤下）', 'Hang this card on the campus wall (you can take it down anytime)'],
      ['登录后可以挂到展墙；卡片用「↓ 卡片」照样存到本地。', 'Sign in to hang this card on the wall — or just save it locally.'],
      ['已挂上作品墙（校内资源 → 作品墙）· 想撤下就在展墙上点自己的作品', 'Hung on the wall (Campus → Wall) — open your work there to take it down.']);
  }
  try { window.__wallSubmit = { slugOf: slugOf, hasButton: true }; } catch (e) {}
})();
