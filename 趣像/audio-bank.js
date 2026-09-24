/* 趣像 12 (r24): 音色库——把"一个正弦加包络"换成一套真正有性格的乐器
   现状：全应用只有 `tone()`（振荡器 + 包络）与几个 SFX，马林巴也只是正弦加短衰减。
   做法：自己搭一套轻量音色库（不引外部依赖，保持离线单文件可用），每条音色都用
   真实的合成手法，而不是换波形：
     · 马林巴 marimba —— FM（载波 × 调制器 3.5 倍，调制指数快速衰减）+ 木槌击打瞬态
     · 音乐盒 musicbox —— 非谐泛音簇（1 / 2.01 / 3.02 / 4.7），极快起音、长光辉尾
     · 古琴 guqin —— Karplus-Strong 拨弦（噪声脉冲进延迟线 + 低通反馈），真拨弦的颗粒感
     · 钟琴 bell —— FM 钟（比率 1.41），长衰减，送混响
     · 木鱼 woodblock —— 带通噪声瞬态 + 短促音高敲击
   另有一条共享**混响**（用生成脉冲响应的卷积器）与既有压缩器串在同一总线上；
   所有音色仍走应用既有的声音开关与音量（MASTER）。设置里可选乐器，并随场景分享码一起走。 */

var BANK = { verb: null, wet: null };
var INSTRUMENTS = {
  marimba: { zh: '马林巴', en: 'Marimba', play: playMarimba },
  musicbox: { zh: '音乐盒', en: 'Music box', play: playMusicBox },
  guqin: { zh: '古琴', en: 'Guqin', play: playGuqin },
  bell: { zh: '钟琴', en: 'Bell', play: playBell },
  woodblock: { zh: '木鱼', en: 'Woodblock', play: playWoodblock },
};
CFG_DEFAULT.instrument = (CFG_DEFAULT.instrument == null) ? 'marimba' : CFG_DEFAULT.instrument;
CFG.instrument = (CFG.instrument == null) ? CFG_DEFAULT.instrument : CFG.instrument;
if (SHARE_KEYS.indexOf('instrument') < 0) SHARE_KEYS.push('instrument');

/* ── 共享混响：生成一段噪声脉冲响应，作一条发送总线 ── */
function ensureVerb() {
  var a = ac();
  if (!a || BANK.verb) return BANK.verb;
  var sr = a.sampleRate, len = Math.floor(sr * 1.8);
  var buf = a.createBuffer(2, len, sr);
  for (var ch = 0; ch < 2; ch++) {
    var d = buf.getChannelData(ch);
    for (var i = 0; i < len; i++) {
      var t = i / len;
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.7) * (i < sr * 0.006 ? 0.25 : 1);
    }
  }
  var conv = a.createConvolver(); conv.buffer = buf;
  var wet = a.createGain(); wet.gain.value = 0.24;
  var lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 4200;
  conv.connect(lp); lp.connect(wet); wet.connect(MASTER);
  BANK.verb = conv; BANK.wet = wet;
  return conv;
}
/** 把某个节点送一点到混响 */
function verbSend(node, amount) {
  var a = ac(); if (!a) return;
  var v = ensureVerb(); if (!v) return;
  var g = a.createGain(); g.gain.value = (amount == null ? 1 : amount);
  node.connect(g); g.connect(v);
}
function noiseBurst(t, dur, gainTarget, freq, q, pan) {
  var a = ac();
  var src = a.createBufferSource();
  if (!NOISEBUF) {
    var n = a.createBuffer(1, Math.floor(a.sampleRate * 0.4), a.sampleRate);
    var dd = n.getChannelData(0);
    for (var i = 0; i < dd.length; i++) dd[i] = Math.random() * 2 - 1;
    NOISEBUF = n;
  }
  src.buffer = NOISEBUF;
  var f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q || 1.2;
  var g = a.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gainTarget, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  var out = bus(pan);
  src.connect(f); f.connect(g); g.connect(out);
  src.start(t); src.stop(t + dur + 0.05);
  return out;
}

/* ── 五件乐器 ── */
function playMarimba(freq, pan, gain) {
  var a = ac(); if (!a) return; var t = a.currentTime;
  var out = bus(pan);
  var carrier = a.createOscillator(), mod = a.createOscillator(), modGain = a.createGain(), amp = a.createGain();
  carrier.type = 'sine'; carrier.frequency.value = freq;
  mod.type = 'sine'; mod.frequency.value = freq * 3.5;
  modGain.gain.setValueAtTime(freq * 2.6, t);
  modGain.gain.exponentialRampToValueAtTime(freq * 0.02, t + 0.16);      /* 调制指数快落 = 木头的"敲" */
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime((gain || 0.09), t + 0.003);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);
  mod.connect(modGain); modGain.connect(carrier.frequency);
  carrier.connect(amp); amp.connect(out);
  mod.start(t); mod.stop(t + 0.9); carrier.start(t); carrier.stop(t + 0.9);
  noiseBurst(t, 0.05, (gain || 0.09) * 1.4, freq * 2.2, 0.9, pan);        /* 木槌击打瞬态 */
  verbSend(out, 0.35);
}
function playMusicBox(freq, pan, gain) {
  var a = ac(); if (!a) return; var t = a.currentTime;
  var out = bus(pan);
  [1, 2.01, 3.02, 4.7].forEach(function (mul, i) {
    var o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = freq * mul;
    var pk = (gain || 0.08) * (i === 0 ? 1 : 0.30 / i);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(pk, t + 0.004 + i * 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5 + i * 0.25);
    o.connect(g); g.connect(out);
    o.start(t); o.stop(t + 2.2);
  });
  verbSend(out, 0.5);
}
function playGuqin(freq, pan, gain) {                                     /* Karplus-Strong 拨弦 */
  var a = ac(); if (!a) return; var t = a.currentTime;
  var out = bus(pan);
  var sr = a.sampleRate, N = Math.max(2, Math.round(sr / freq));
  var buf = a.createBuffer(1, Math.floor(sr * 1.9), sr);
  var d = buf.getChannelData(0), line = new Float32Array(N);
  for (var k = 0; k < N; k++) line[k] = Math.random() * 2 - 1;           /* 初始噪声 = 拨弦 */
  var decay = 0.9962 + Math.min(0.0032, freq / 900000);
  var prev = 0;
  for (var i = 0; i < d.length; i++) {
    var idx = i % N;
    var cur = line[idx];
    var filtered = (cur + prev) * 0.5 * decay;                            /* 低通反馈 */
    line[idx] = filtered;
    prev = cur;
    d[i] = cur;
  }
  var src = a.createBufferSource(); src.buffer = buf;
  var amp = a.createGain();
  amp.gain.setValueAtTime((gain || 0.14), t);
  amp.gain.setValueAtTime((gain || 0.14), t + 1.2);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + 1.9);
  var tone1 = a.createBiquadFilter(); tone1.type = 'lowpass'; tone1.frequency.value = Math.min(6000, freq * 9);
  src.connect(tone1); tone1.connect(amp); amp.connect(out);
  src.start(t);
  verbSend(out, 0.6);
}
function playBell(freq, pan, gain) {
  var a = ac(); if (!a) return; var t = a.currentTime;
  var out = bus(pan);
  var carrier = a.createOscillator(), mod = a.createOscillator(), modGain = a.createGain(), amp = a.createGain();
  carrier.type = 'sine'; carrier.frequency.value = freq;
  mod.type = 'sine'; mod.frequency.value = freq * 1.41;
  modGain.gain.setValueAtTime(freq * 1.4, t);
  modGain.gain.exponentialRampToValueAtTime(freq * 0.05, t + 0.9);
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime((gain || 0.07), t + 0.006);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + 3.1);
  mod.connect(modGain); modGain.connect(carrier.frequency);
  carrier.connect(amp); amp.connect(out);
  mod.start(t); mod.stop(t + 3.2); carrier.start(t); carrier.stop(t + 3.2);
  verbSend(out, 0.7);
}
function playWoodblock(freq, pan, gain) {
  var a = ac(); if (!a) return; var t = a.currentTime;
  var out = bus(pan);
  var o = a.createOscillator(), g = a.createGain();
  o.type = 'triangle'; o.frequency.setValueAtTime(freq * 1.6, t);
  o.frequency.exponentialRampToValueAtTime(freq * 0.9, t + 0.06);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime((gain || 0.10), t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
  o.connect(g); g.connect(out);
  o.start(t); o.stop(t + 0.2);
  noiseBurst(t, 0.035, (gain || 0.1), freq * 3.4, 2.2, pan);
  verbSend(out, 0.3);
}

/** 统一入口：按当前乐器发声（未解锁音频上下文时静默返回） */
function playNote(freq, pan, gain) {
  if (typeof SOUND !== 'undefined' && !SOUND) return;
  var a = ac(); if (!a) return;
  var ins = INSTRUMENTS[CFG.instrument] || INSTRUMENTS.marimba;
  try { ins.play(freq, pan, gain); } catch (e) { /* 单个音色出错不影响整体 */ }
}

/* ── 设置：乐器（放进"声音与音乐"组）── */
(function instrumentPanel() {
  var items = [
    { id: 'instrument', label: '音色', type: 'seg',
      opts: Object.keys(INSTRUMENTS).map(function (k) { return [k, INSTRUMENTS[k].zh]; }) },
  ];
  var grp = null;
  PANEL.forEach(function (G) { if ((G.items || []).some(function (it) { return it.id === 'volume'; })) grp = G; });
  if (grp) {
    var at = grp.items.findIndex(function (it) { return it.id === 'volume'; });
    if (at >= 0) grp.items.splice(at + 1, 0, items[0]); else grp.items.push(items[0]);
  } else {
    PANEL.push({ group: '声音与音乐', items: items });
  }
  if (typeof UI_PAIRS !== 'undefined') {
    Object.keys(INSTRUMENTS).forEach(function (k) { UI_PAIRS.push([INSTRUMENTS[k].zh, INSTRUMENTS[k].en]); });
    UI_PAIRS.push(['音色', 'Instrument'], ['声音与音乐', 'Sound & music']);
  }
})();

try {
  window.__bank = {
    instruments: Object.keys(INSTRUMENTS),
    get current() { return CFG.instrument; },
    set current(v) { CFG.instrument = v; },
    play: function (freq, pan, gain) { playNote(freq || 440, pan || 0, gain || 0.08); },
    /** 离线渲染一件乐器，用于验收：返回峰值、衰减时长与"亮度"（过零率近似） */
    render: function (name, freq) {
      var C = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!C) return Promise.resolve(null);
      var sr = 22050, dur = 2.0;
      var off = new C(1, sr * dur, sr);
      // 离线渲染要把"跨上下文缓存"也隔离：混响节点与噪声缓冲都绑定在各自的 AudioContext 上
      var savedAC = AC, savedMaster = MASTER, savedSound = SOUND, savedVerb = BANK.verb, savedWet = BANK.wet, savedNoise = NOISEBUF;
      AC = off; MASTER = off.createGain(); MASTER.gain.value = 1; MASTER.connect(off.destination); SOUND = true;
      try { off.resume = function () {}; } catch (e) {}   /* 离线上下文不该被 resume */
      BANK.verb = null; BANK.wet = null; NOISEBUF = null;
      try {
        INSTRUMENTS[name || CFG.instrument].play(freq || 440, 0, 0.5);
      } finally {
        AC = savedAC; MASTER = savedMaster; SOUND = savedSound;
        BANK.verb = savedVerb; BANK.wet = savedWet; NOISEBUF = savedNoise;
      }
      return off.startRendering().then(function (buf) {
        var d = buf.getChannelData(0), peak = 0, last = 0, zc = 0;
        for (var i = 0; i < d.length; i++) {
          var v = Math.abs(d[i]); if (v > peak) peak = v;
          if (v > 0.002) last = i;
          if (i && ((d[i - 1] < 0 && d[i] >= 0) || (d[i - 1] >= 0 && d[i] < 0))) zc++;
        }
        return { peak: +peak.toFixed(4), decaySec: +(last / sr).toFixed(2), zeroCrossPerSec: Math.round(zc / dur) };
      });
    },
  };
} catch (e) {}
