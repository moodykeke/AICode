/* 趣像 18 (r41): 词条收口 —— 把这一路新增的界面文案补齐到词条表
   ─────────────────────────────────────────────────────────────
   机制回顾（locale-lookbook.js）：界面是"整串匹配"翻译的——
     · 画布上每帧重绘的文字（班级标题、载入面板、展板题字）用 qxLocal 取词即已双语；
     · DOM 里"只设一次"的文字（按钮、面板标签）要靠 UI_PAIRS 有登记，才能在切换语言时被
       观察器改过来；没登记的会留在中文。
   本文件把上一轮各扩展里新增、但没登记的整句补齐（含按钮上印的键位说明）。 */
if (typeof UI_PAIRS !== 'undefined') {
  UI_PAIRS.push(
    // 班级人像：入口、选班面板、载入与操作
    ['加载班级人像…', 'Load a class…'], ['换个班…', 'Switch class…'], ['退出班级人像', 'Leave class mode'],
    ['选择班级', 'Choose a class'], ['全校班级（教师可任选）', 'All classes (teachers)'],
    ['搜索班级名…', 'Search a class…'], ['单独换表情', 'Expression just for them'],
    ['把同学们的头像统一成一种风格，排成班级合影。', 'Unify everyone’s portrait into one style and line the class up.'],
    ['你名下暂时没有班级，可从下面全校班级里选。', 'No class of your own — pick one from all classes below.'],
    ['没找到你名下的班级；登录后才会显示你的班。', 'No class found for you — sign in to see your class.'],
    ['这个班还没有可用的头像。', 'No avatars for this class yet.'], ['已加载', 'Loaded'], ['位同学', ' classmates'],
    ['还没找到你名下的班级。', 'No class found for you.'], ['正在载入', 'Loading'], ['Esc 取消', 'Esc to cancel'],
    ['已取消载入。', 'Loading cancelled.'], ['已退出班级人像', 'Left class mode'], ['按 ; 拍一张班级大合影', 'Press ; for the class photo'],
    ['这一位暂时换不了表情。', 'No expression variant for this one yet.'],
    ['同学的头像不参与天演 —— 天演只属于这里的原生角色。', 'Classmates do not take part in evolution — that belongs to the native cast.'],
    // 合影与暗房（含按钮上印的键）
    ['大合照（;）', 'Group photo (;)'], ['看照片（\'）', 'View photo (\')'], ['全家福', 'Family portrait'],
    ['趣像 · 全家福', 'Head Cases · family portrait'], ['存展板', 'Save poster'], ['重拍', 'Retake'],
    ['保存未完成，请再试一次。', 'Save did not finish — please try again.'], ['已保存展板（打印用）', 'Poster saved (print ready)'],
    ['已保存', 'Saved'], ['已分享', 'Shared'], ['这里不能分享，已存到下载。', 'Sharing is unavailable here — saved to downloads.'],
    ['已复制到剪贴板，去粘贴吧。', 'Copied to the clipboard — go paste it.'],
    ['还没有合影 —— 按 ; 拍一张。', 'No photo yet — press ; to take one.'],
    ['← → 换相框 · 1–4 直选 · P 存展板 · 点背景关闭', '← → change frame · 1–4 pick · P poster · click outside to cancel'],
    ['全班已换成', 'Whole class switched to'], ['· 合影留念', ' · class photo'], ['趣像 · 拾趣馆', 'Head Cases · Gallery of Curiosities'],
    ['画面未能生成，请再试一次。', 'Could not render — please try again.'],
    // 弹奏（原键位让给合照后补的按钮文案）
    ['全场弹一遍（<）', 'Strum the cast (<)'], ['换一种调式（>）', 'Another mode (>)'], ['下一首（|）', 'Next tune (|)'],
    ['换一位不同的伙伴，才能借来新的结构。', 'Pick a different partner to borrow a new structure.'],
    ['看特写', 'View portrait'], ['本色', 'Natural'], ['小动作', 'Small moves'],
    // 合影送展墙
    ['送展墙', 'To the wall'], ['班级合影', 'class photo'],
    ['登录后可以把合影挂到展墙；「保存」照样存到本地。', 'Sign in to hang the photo on the wall — or just save it locally.'],
    ['合影已挂上作品墙（校内资源 → 作品墙）。', 'The class photo is on the wall (Campus → Wall).'],
    ['← → 换相框 · 1–4 直选 · P 存展板 · W 送展墙 · 点背景关闭', '← → change frame · 1–4 pick · P poster · W wall · click outside to cancel'],
    ['合影', 'Group photo']
  );
}
