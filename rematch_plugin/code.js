figma.showUI(__html__, { width: 380, height: 820 });

var FONT_FAMILY = 'Unbounded';

var W = 393, H = 852;
var PHONE = {
  borderL: 14, borderR: 14, borderT: 12, borderB: 14,
  bodyR: 54, screenR: 46, diW: 126, diH: 37, diR: 20, diOffsetY: 12
};
function bodyW() { return W + PHONE.borderL + PHONE.borderR; }
function bodyH() { return H + PHONE.borderT + PHONE.borderB; }

var SB_Y   = 15;
var SB_H   = PHONE.diOffsetY + PHONE.diH + 10;
var HOME_H = 34;
var SIDE   = 16;
var CW     = W - SIDE * 2;

function swipeCY()  { return H - 54 - 16 - 8 - 34; }
function ctaTopY()  { return H - HOME_H - 8 - 56 - 12; }

var C = {
  black:   { r: 0.004, g: 0.004, b: 0.004 },
  white:   { r: 1,     g: 1,     b: 1     },
  accent:  { r: 0.788, g: 0.961, b: 0.259 },
  accentL: { r: 0.878, g: 0.980, b: 0.600 },
  redL:    { r: 1.000, g: 0.878, b: 0.878 },
  gray100: { r: 0.969, g: 0.965, b: 0.953 },
  gray200: { r: 0.878, g: 0.859, b: 0.902 },
  gray400: { r: 0.420, g: 0.420, b: 0.431 },
  gray600: { r: 0.231, g: 0.231, b: 0.243 },
  bg:      { r: 0.949, g: 0.937, b: 0.918 },
  cream:   { r: 0.980, g: 0.984, b: 0.996 }
};

var FONTS = {
  regular:   { family: FONT_FAMILY, style: 'Regular'   },
  medium:    { family: FONT_FAMILY, style: 'Medium'     },
  semibold:  { family: FONT_FAMILY, style: 'SemiBold'   },
  bold:      { family: FONT_FAMILY, style: 'Bold'       },
  extrabold: { family: FONT_FAMILY, style: 'ExtraBold'  },
  black:     { family: FONT_FAMILY, style: 'Black'      }
};

var TS = {
  xs: 7, s: 9, sm: 11, base: 14, md: 16,
  lg: 18, xl: 20, xxl: 24, price: 22, h1: 26, h0: 28
};

var LOADED = {};
async function lf(f) {
  var k = f.family + '_' + f.style;
  if (!LOADED[k]) { await figma.loadFontAsync(f); LOADED[k] = true; }
}
function wf(w) {
  if (w >= 900) return FONTS.black;
  if (w >= 800) return FONTS.extrabold;
  if (w >= 700) return FONTS.bold;
  if (w >= 600) return FONTS.semibold;
  if (w >= 500) return FONTS.medium;
  return FONTS.regular;
}
function hex2rgb(h) {
  var n = parseInt(h.replace('#', ''), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}
function sf(node, color, opacity) {
  var f = { type: 'SOLID', color: color };
  if (opacity !== undefined) f.opacity = opacity;
  node.fills = [f];
}
function rect(parent, x, y, w, h, color, r, opacity) {
  var el = figma.createRectangle();
  el.x = x; el.y = y; el.resize(w, h);
  if (r) el.cornerRadius = r;
  sf(el, color, opacity);
  if (parent) parent.appendChild(el);
  return el;
}
function mkFrame(parent, x, y, w, h, color, r, noClip) {
  var f = figma.createFrame();
  f.x = x; f.y = y; f.resize(w, h);
  if (r) f.cornerRadius = r;
  f.clipsContent = !noClip;
  sf(f, color || C.white);
  if (parent) parent.appendChild(f);
  return f;
}
async function txt(parent, str, x, y, w, sz, weight, color, opts) {
  opts = opts || {};
  var fn = wf(weight); await lf(fn);
  var t = figma.createText();
  t.fontName = fn; t.characters = String(str); t.fontSize = sz;
  t.x = x; t.y = y;
  if (w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); }
  if (opts.align) t.textAlignHorizontal = opts.align.toUpperCase();
  if (opts.lineH) t.lineHeight   = { value: opts.lineH, unit: 'PIXELS' };
  if (opts.ls)    t.letterSpacing = { value: opts.ls,   unit: 'PERCENT' };
  sf(t, color, opts.opacity);
  if (parent) parent.appendChild(t);
  return t;
}
async function txtC(parent, str, x, cy, w, sz, weight, color, opts) {
  opts = opts || {};
  var fn = wf(weight); await lf(fn);
  var t = figma.createText();
  t.fontName = fn; t.characters = String(str); t.fontSize = sz;
  t.x = x;
  if (w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); }
  t.y = cy - t.height / 2;
  if (opts.align) t.textAlignHorizontal = opts.align.toUpperCase();
  if (opts.lineH) t.lineHeight   = { value: opts.lineH, unit: 'PIXELS' };
  if (opts.ls)    t.letterSpacing = { value: opts.ls,   unit: 'PERCENT' };
  sf(t, color, opts.opacity);
  if (parent) parent.appendChild(t);
  return t;
}
function gradRect(parent, x, y, w, h, fromA, toA) {
  var el = figma.createRectangle();
  el.x = x; el.y = y; el.resize(w, h);
  el.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [[0, 0, 0], [0, 1, 0]],
    gradientStops: [
      { position: 0, color: { r: 0.004, g: 0.004, b: 0.004, a: fromA } },
      { position: 1, color: { r: 0.004, g: 0.004, b: 0.004, a: toA   } }
    ]
  }];
  if (parent) parent.appendChild(el);
  return el;
}
function grp(name, nodes, parent) {
  var valid = nodes.filter(function(n) { return n && n.parent; });
  if (!valid.length) return null;
  var g = figma.group(valid, parent || valid[0].parent);
  g.name = name;
  return g;
}
function line(parent, x, y, w, color, opacity) {
  var l = rect(parent, x, y, w, 1, color || C.gray200);
  if (opacity !== undefined) l.opacity = opacity;
  return l;
}

// ─────────────────────────────────────────────────────────────────────────────
// ДАННЫЕ
// ─────────────────────────────────────────────────────────────────────────────
var STYLES = [
  { name: 'Скандинавский', desc: 'Белый, дерево,\nнатуральные материалы',   tags: ['Светло',    'Дерево',   'Уют'      ], c: ['#f5f0e8','#e8ddd0','#d4c4b0','#c9b99a','#a89070','#6b5040'] },
  { name: 'Минимализм',    desc: 'Чистые линии,\nнейтральные тона',         tags: ['Лаконично', 'Чисто',    'Функц.'   ], c: ['#f8f8f8','#e8e8e8','#d0d0d0','#b0b0b0','#787878','#2c2c2c'] },
  { name: 'Лофт',          desc: 'Кирпич, металл,\nоткрытые конструкции',   tags: ['Кирпич',    'Металл',   'Индустрия'], c: ['#c4bdb5','#a09890','#786050','#584840','#3c3028','#1e1814'] },
  { name: 'Современный',   desc: 'Актуальные формы,\nяркие акценты',        tags: ['Актуально', 'Акценты',  'Тех'      ], c: ['#f0f4f8','#c8d8e8','#7090b0','#3a5f80','#1a3a58','#c9f542'] },
  { name: 'Классика',      desc: 'Симметрия, лепнина,\nблагородные мат.',   tags: ['Симметрия', 'Золото',   'Роскошь'  ], c: ['#f5efe0','#e8d5a8','#c8a84b','#8b7030','#4a3a18','#1a1208'] },
  { name: 'Эко / Бохо',   desc: 'Растения,\nнатуральные текстуры',         tags: ['Природа',   'Текстуры', 'Тепло'    ], c: ['#e8f0e0','#c8d8a8','#98b870','#6a9048','#3d6028','#c4714a'] },
  { name: 'Japandi',       desc: 'Японский минимализм\n+ скандинавский уют', tags: ['Ваби-саби', 'Тишина',   'Природа'  ], c: ['#f0ece4','#ddd5c8','#b8a88c','#8c7860','#5c4838','#2c2018'] },
  { name: 'Арт-деко',      desc: 'Геометрия, контраст,\nзолото и роскошь',  tags: ['Геометрия', 'Контраст', 'Роскошь'  ], c: ['#2a2010','#4a3a20','#c8a84b','#e8c870','#f0d890','#f8f0e0'] }
];

var MASTERS = [
  {
    initials: 'АС', fullName: 'Анна Смирнова', firstName: 'Анну',
    city: 'Москва', exp: '6 лет', rating: '4.9', reviews: '127 отзывов',
    match: '94', price: '4 500 ₽/м²', projects: '47',
    why: ['светлые тона', 'минимализм', 'натур. матер.', 'japandi'],
    reviewsList: [
      { av: 'КМ', name: 'Катя М.',  obj: 'квартира 68 м²',    stars: '★★★★★', text: 'Анна поняла нас с первого раза — показала реальные проекты в нашем стиле. Очень рекомендую!' },
      { av: 'ДП', name: 'Дима П.',  obj: 'апартаменты 55 м²', stars: '★★★★★', text: 'Очень детальный проект, всё продумано до мелочей. Сроки соблюдены.' },
      { av: 'АВ', name: 'Алина В.', obj: 'дом 110 м²',        stars: '★★★★☆', text: 'Хороший результат, были небольшие правки по срокам, но всё решили.' }
    ],
    bg: ['#f0ece4','#ddd5c8','#b8a88c','#8c7860','#e8ddd0','#f5f0e8'], idx: 1
  },
  {
    initials: 'МВ', fullName: 'Макс Ветров', firstName: 'Максу',
    city: 'Петербург', exp: '4 года', rating: '4.8', reviews: '89 отзывов',
    match: '87', price: '3 800 ₽/м²', projects: '31',
    why: ['лофт-стиль', 'тёмные тона', 'откр. планир.', 'современный'],
    reviewsList: [
      { av: 'ИС', name: 'Иван С.',  obj: 'студия 38 м²',   stars: '★★★★★', text: 'Макс отлично чувствует лофт. Всё сделал быстро и именно так, как я хотел!' },
      { av: 'ЕА', name: 'Ева А.',   obj: 'квартира 72 м²', stars: '★★★★★', text: 'Результат отличный, авторский надзор прошёл гладко. Буду обращаться снова.' },
      { av: 'РН', name: 'Рома Н.',  obj: 'офис 90 м²',     stars: '★★★★☆', text: 'Профессионал своего дела. Рекомендую всем любителям индустриального стиля.' }
    ],
    bg: ['#e8e8e8','#d0d0d0','#b0b0b0','#c8d8e8','#7090b0','#3a5f80'], idx: 2
  },
  {
    initials: 'ЕК', fullName: 'Елена Кузнецова', firstName: 'Елене',
    city: 'Москва', exp: '8 лет', rating: '5.0', reviews: '203 отзыва',
    match: '91', price: '5 200 ₽/м²', projects: '68',
    why: ['классика', 'симметрия', 'золото', 'благ. матер.'],
    reviewsList: [
      { av: 'МС', name: 'Маша С.', obj: 'квартира 95 м²', stars: '★★★★★', text: 'Елена создала именно тот классический интерьер, о котором я мечтала. Браво!' },
      { av: 'АГ', name: 'Артём Г.',obj: 'дом 200 м²',     stars: '★★★★★', text: 'Профессионализм на высшем уровне. Все сроки соблюдены, результат превзошёл ожидания.' }
    ],
    bg: ['#f5efe0','#e8d5a8','#c8a84b','#8b7030','#4a3a18','#f5f0e8'], idx: 3
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// iPhone 16
// ─────────────────────────────────────────────────────────────────────────────
async function drawPhone(container, px, py) {
  var bw = bodyW(), bh = bodyH(), nodes = [];
  var body = figma.createRectangle();
  body.x = px; body.y = py; body.resize(bw, bh); body.cornerRadius = PHONE.bodyR;
  body.fills   = [{ type: 'SOLID', color: { r: 0.13, g: 0.13, b: 0.14 } }];
  body.strokes = [{ type: 'SOLID', color: { r: 0.30, g: 0.30, b: 0.33 } }]; body.strokeWeight = 1.5;
  container.appendChild(body); nodes.push(body);
  var scrBg = figma.createRectangle();
  scrBg.x = px + PHONE.borderL - 1; scrBg.y = py + PHONE.borderT - 1;
  scrBg.resize(W + 2, H + 2); scrBg.cornerRadius = PHONE.screenR + 1;
  scrBg.fills = [{ type: 'SOLID', color: { r: 0.02, g: 0.02, b: 0.02 } }];
  container.appendChild(scrBg); nodes.push(scrBg);
  [[py + 130, 52],[py + 194, 52]].forEach(function(v) {
    var b = figma.createRectangle(); b.x = px - 3.5; b.y = v[0]; b.resize(3.5, v[1]); b.cornerRadius = 2;
    b.fills = [{ type: 'SOLID', color: { r: 0.26, g: 0.26, b: 0.28 } }]; container.appendChild(b); nodes.push(b);
  });
  var mt = figma.createRectangle(); mt.x = px - 3.5; mt.y = py + 88; mt.resize(3.5, 36); mt.cornerRadius = 2;
  mt.fills = [{ type: 'SOLID', color: { r: 0.26, g: 0.26, b: 0.28 } }]; container.appendChild(mt); nodes.push(mt);
  var pb = figma.createRectangle(); pb.x = px + bw; pb.y = py + 156; pb.resize(3.5, 72); pb.cornerRadius = 2;
  pb.fills = [{ type: 'SOLID', color: { r: 0.26, g: 0.26, b: 0.28 } }]; container.appendChild(pb); nodes.push(pb);
  grp('iphone16-body', nodes, container);
  return {
    screenX: px + PHONE.borderL, screenY: py + PHONE.borderT,
    diX: px + PHONE.borderL + W / 2 - PHONE.diW / 2,
    diY: py + PHONE.borderT + PHONE.diOffsetY
  };
}
function drawDynamicIsland(container, pos) {
  var di = figma.createRectangle();
  di.x = pos.diX; di.y = pos.diY; di.resize(PHONE.diW, PHONE.diH); di.cornerRadius = PHONE.diR;
  di.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]; di.name = 'dynamic-island';
  container.appendChild(di); return di;
}

async function statusBar(parent, dark) {
  var clr = dark ? C.black : C.white, nodes = [];
  nodes.push(await txt(parent, '9:41', SIDE, SB_Y, 80, 15, 700, clr));
  var rx = W - SIDE, batW = 25, batH = 12, batX = rx - batW, batY = SB_Y + 3;
  var bat = figma.createRectangle(); bat.x = batX; bat.y = batY; bat.resize(batW, batH); bat.cornerRadius = 3;
  bat.strokes = [{ type: 'SOLID', color: clr }]; bat.strokeWeight = 1.2; bat.fills = [];
  parent.appendChild(bat); nodes.push(bat);
  nodes.push(rect(parent, batX + 2, batY + 2, 17, batH - 4, clr, 1));
  var tip = figma.createRectangle(); tip.x = batX + batW; tip.y = batY + 4; tip.resize(2, 4); tip.cornerRadius = 1;
  tip.fills = [{ type: 'SOLID', color: clr }]; parent.appendChild(tip); nodes.push(tip);
  rx = batX - 8;
  for (var wi = 0; wi < 3; wi++) {
    var ws = 3 + wi * 3; var we = figma.createRectangle();
    we.x = rx - ws; we.y = SB_Y + (12 - ws); we.resize(ws, ws); we.cornerRadius = 1;
    sf(we, clr, wi < 2 ? 0.45 : 1); parent.appendChild(we); nodes.push(we);
  }
  rx = rx - 15;
  for (var si = 0; si < 4; si++) {
    var bh2 = 3 + si * 3;
    nodes.push(rect(parent, rx - (4 - si) * 6, SB_Y + 14 - bh2, 4, bh2, clr, 1, si < 2 ? 0.4 : 1));
  }
  grp('status-bar', nodes, parent);
}
function homeBar(parent) {
  var barW = 134, barH = 5;
  rect(parent, W / 2 - barW / 2, H - 10 - barH, barW, barH, C.black, 3, 0.2);
}
function progressBar(parent, total, done, y) {
  var gap = 4, segW = (CW - gap * (total - 1)) / total, nodes = [];
  for (var i = 0; i < total; i++)
    nodes.push(rect(parent, SIDE + i * (segW + gap), y, segW, 3, i < done ? C.black : C.gray200, 2));
  grp('progress-bar', nodes, parent);
  return y + 3 + 14;
}

async function swipeButtons(parent) {
  var centerY = swipeCY(), sz = 68, cx = W / 2, nodes = [];
  var nlW = 96, nlX = cx - sz - 48, nlY = centerY - sz / 2;
  var nl = rect(parent, nlX, nlY, sz, sz, C.redL, sz / 2);
  nl.strokes = [{ type: 'SOLID', color: { r: 0.91, g: 0.75, b: 0.75 } }]; nl.strokeWeight = 1.5; nodes.push(nl);
  nodes.push(await txtC(parent, '✘', nlX, nlY + sz / 2, sz, TS.xxl, 700, C.black, { align: 'center' }));
  nodes.push(await txt(parent, 'не нравится', nlX + sz / 2 - nlW / 2, nlY + sz + 8, nlW, TS.sm, 500, C.gray400, { align: 'center' }));
  var skipSz = 42, skipX = cx - skipSz / 2, skipY = centerY - skipSz / 2;
  nodes.push(rect(parent, skipX, skipY, skipSz, skipSz, C.gray100, skipSz / 2));
  nodes.push(await txtC(parent, '↺', skipX, centerY, skipSz, TS.md, 500, C.gray400, { align: 'center' }));
  var lkW = 80, lkX = cx + 48, lkY = centerY - sz / 2;
  var lk = rect(parent, lkX, lkY, sz, sz, C.accentL, sz / 2);
  lk.strokes = [{ type: 'SOLID', color: C.accent }]; lk.strokeWeight = 1.5; nodes.push(lk);
  nodes.push(await txtC(parent, '✓', lkX, lkY + sz / 2, sz, TS.xxl, 700, C.black, { align: 'center' }));
  nodes.push(await txt(parent, 'нравится', lkX + sz / 2 - lkW / 2, lkY + sz + 8, lkW, TS.sm, 500, C.gray400, { align: 'center' }));
  grp('swipe-buttons', nodes, parent);
}

async function checkmark(parent, rowX, rowY, rowW, rowH) {
  var sz = Math.min(rowH - 16, 24), chkX = rowX + rowW - 12 - sz, chkY = rowY + (rowH - sz) / 2, nodes = [];
  nodes.push(rect(parent, chkX, chkY, sz, sz, C.black, 6));
  nodes.push(await txtC(parent, '✓', chkX, chkY + sz / 2, sz, Math.round(sz * 0.45), 800, C.white, { align: 'center' }));
  grp('checkmark', nodes, parent); return nodes;
}

// ─────────────────────────────────────────────────────────────────────────────
// ПРОФИЛЬ — шапка (исправленная)
// ─────────────────────────────────────────────────────────────────────────────
async function buildProfileHeader(p, m) {
  var heroH = 210;
  var hero = mkFrame(p, 0, 0, W, heroH, C.black, 0);
  var cols = 3, g = 3, bW4 = (W - g * (cols + 1)) / cols;
  var heroMosaicNodes = [];
  for (var ci = 0; ci < cols; ci++)
    heroMosaicNodes.push(rect(hero, g + ci * (bW4 + g), g, bW4, heroH - g, hex2rgb(m.bg[ci]), 10));
  grp('hero-mosaic', heroMosaicNodes, hero);
  gradRect(hero, 0, heroH - 130, W, 130, 0, 0.85);
  await statusBar(hero, false);

  var navNodes = [];
  navNodes.push(rect(hero, SIDE, SB_H + 6, 40, 40, C.black, 20, 0.5));
  navNodes.push(await txtC(hero, '←', SIDE, SB_H + 26, 40, TS.lg, 700, C.white, { align: 'center' }));
  grp('nav-back', navNodes, hero);

  var matchNodes = [];
  matchNodes.push(rect(hero, SIDE, heroH - 44, 148, 30, C.accent, 15));
  matchNodes.push(await txtC(hero, m.match + '% совпадение', SIDE, heroH - 29, 148, TS.sm, 700, C.black, { align: 'center' }));
  grp('match-badge', matchNodes, hero);

  var y = heroH + 20;

  // ── Имя + цена: одна строка, один уровень ─────────────────────────────────
  var priceW = 132;
  var nameW  = CW - priceW - 12;
  var namePriceNodes = [];
  namePriceNodes.push(await txt(p, m.fullName,  SIDE,              y, nameW,  TS.xl,  800, C.black));
  namePriceNodes.push(await txt(p, m.price,     W - SIDE - priceW, y, priceW, TS.lg,  700, C.black, { align: 'right' }));
  grp('name-price', namePriceNodes, p);
  y += 28 + 10;

  // ── Город ─────────────────────────────────────────────────────────────────
  await txt(p, '📍 ' + m.city + ' · онлайн', SIDE, y, CW, TS.sm, 500, C.gray400);
  y += TS.sm + 20;

  // ── Теги: 2 в ряд, каждый текст в 1 строку ──────────────────────────────
  var tagH4 = 34, tagGap4 = 8, tagsPerRow = 2;
  var tagW = Math.floor((CW - (tagsPerRow - 1) * tagGap4) / tagsPerRow);
  var tagNodes2 = [];
  for (var ti3 = 0; ti3 < m.why.length; ti3++) {
    var col4 = ti3 % tagsPerRow;
    var row4 = Math.floor(ti3 / tagsPerRow);
    var tgX4 = SIDE + col4 * (tagW + tagGap4);
    var tgY4 = y + row4 * (tagH4 + tagGap4);
    var isSel = ti3 === 0;
    tagNodes2.push(rect(p, tgX4, tgY4, tagW, tagH4, isSel ? C.accent : C.gray100, tagH4 / 2));
    tagNodes2.push(await txtC(p, m.why[ti3], tgX4, tgY4 + tagH4 / 2, tagW, TS.sm, 700,
      isSel ? C.black : C.gray600, { align: 'center' }));
  }
  grp('style-tags', tagNodes2, p);
  var tagRows = Math.ceil(m.why.length / tagsPerRow);
  y += tagRows * (tagH4 + tagGap4) - tagGap4 + 24;

  // ── Разделитель ───────────────────────────────────────────────────────────
  line(p, 0, y, W); y += 1;

  // ── Статы: крупный шрифт, БЕЗ border ─────────────────────────────────────
  var statH = 76;
  var s3W   = (CW - 12) / 3;
  var stats = [
    { v: m.projects,     k: 'проектов' },
    { v: m.exp,          k: 'опыт'     },
    { v: '★ ' + m.rating, k: 'рейтинг' }
  ];
  var statNodes = [];
  for (var si4 = 0; si4 < 3; si4++) {
    var sx = SIDE + si4 * (s3W + 6);
    var cellNodes = [];
    // Фон — без strokes (убрали border)
    cellNodes.push(rect(p, sx, y, s3W, statH, C.white, 12));
    // Значение: TS.xxl = 24px (было TS.xl = 20px)
    cellNodes.push(await txtC(p, stats[si4].v,
      sx + 4, y + statH / 2 - 14, s3W - 8, TS.xxl, 800, C.black, { align: 'center' }));
    // Подпись: TS.sm = 11px (было TS.xs = 7px)
    cellNodes.push(await txtC(p, stats[si4].k,
      sx + 4, y + statH / 2 + 16, s3W - 8, TS.sm,  500, C.gray400, { align: 'center', ls: 2 }));
    grp('stat-' + si4, cellNodes, p);
    statNodes = statNodes.concat(cellNodes);
  }
  grp('stats-row', statNodes, p);
  y += statH;

  // Разделитель под статами
  line(p, 0, y, W); y += 1;
  return y;
}

async function buildTabs(p, y, activeTab) {
  var tabH = 44, tabW = CW / 2, nodes = [];
  var wA = activeTab === 'works', rA = activeTab === 'reviews';
  nodes.push(rect(p, SIDE,        y, tabW, tabH, C.white, 0));
  nodes.push(await txtC(p, 'Работы',  SIDE,        y + tabH / 2, tabW, TS.md, wA ? 700 : 500, wA ? C.black : C.gray400, { align: 'center' }));
  nodes.push(rect(p, SIDE,        y + tabH - 2, tabW, 2, wA ? C.black : C.gray200, 1));
  nodes.push(rect(p, SIDE + tabW, y, tabW, tabH, C.white, 0));
  nodes.push(await txtC(p, 'Отзывы', SIDE + tabW, y + tabH / 2, tabW, TS.md, rA ? 700 : 500, rA ? C.black : C.gray400, { align: 'center' }));
  nodes.push(rect(p, SIDE + tabW, y + tabH - 2, tabW, 2, rA ? C.black : C.gray200, 1));
  grp('tabs', nodes, p);
  return y + tabH;
}

async function buildProfileCTA(p, m) {
  var ctaPanelH = 80, ctaPanelY = H - HOME_H - ctaPanelH, nodes = [];
  nodes.push(rect(p, 0, ctaPanelY, W, ctaPanelH, C.white));
  nodes.push(line(p, 0, ctaPanelY, W));
  var btnH = 56, innerY = ctaPanelY + (ctaPanelH - btnH) / 2;
  var iconW = 56, gapB = 8, mainW = CW - iconW * 2 - gapB * 2;
  nodes.push(rect(p, SIDE, innerY, mainW, btnH, C.black, 28));
  nodes.push(await txtC(p, 'Написать ' + m.firstName + ' →', SIDE, innerY + btnH / 2, mainW, TS.sm, 700, C.white, { align: 'center' }));
  var saveX = SIDE + mainW + gapB;
  var saveBtn = rect(p, saveX, innerY, iconW, btnH, C.white, 28);
  saveBtn.strokes = [{ type: 'SOLID', color: C.gray200 }]; saveBtn.strokeWeight = 1; nodes.push(saveBtn);
  nodes.push(await txtC(p, '☆', saveX, innerY + btnH / 2, iconW, TS.xl, 400, C.black, { align: 'center' }));
  var shareX = saveX + iconW + gapB;
  var shareBtn = rect(p, shareX, innerY, iconW, btnH, C.white, 28);
  shareBtn.strokes = [{ type: 'SOLID', color: C.gray200 }]; shareBtn.strokeWeight = 1; nodes.push(shareBtn);
  nodes.push(await txtC(p, '↗', shareX, innerY + btnH / 2, iconW, TS.lg, 600, C.black, { align: 'center' }));
  grp('profile-cta', nodes, p);
  return ctaPanelY;
}

// ─────────────────────────────────────────────────────────────────────────────
// ПРОФИЛЬ — РАБОТЫ
// ─────────────────────────────────────────────────────────────────────────────
async function buildProfile(p, mi) {
  var m = MASTERS[mi];
  sf(p, C.white);
  var afterHeader = await buildProfileHeader(p, m);
  var tabEndY     = await buildTabs(p, afterHeader, 'works');
  var ctaPanelY   = await buildProfileCTA(p, m);
  var contentY = tabEndY + 14, contentBottom = ctaPanelY - 12;

  var sectionNodes = [];
  sectionNodes.push(await txt(p, 'РЕАЛЬНЫЕ ПРОЕКТЫ', SIDE, contentY, CW, TS.s, 700, C.gray400, { ls: 3 }));
  contentY += TS.s + 10;

  var labelH = TS.sm + 8;
  var phH = contentBottom - contentY - labelH; if (phH < 60) phH = 60;
  var phW = 220, phGap = 12;
  var photos = [
    { label: 'Гостиная', ci: 0 }, { label: 'Спальня', ci: 1 },
    { label: 'Кухня',    ci: 2 }, { label: 'Прихожая',ci: 3 }, { label: 'Ванная', ci: 4 }
  ];
  var carouselH = phH + labelH + 4;
  var carousel = mkFrame(p, 0, contentY, W, carouselH, C.white, 0);
  var stripW = SIDE + photos.length * (phW + phGap) + 24;
  var strip = mkFrame(carousel, 0, 0, stripW, carouselH, C.white, 0, true);
  var stripNodes = [];
  for (var pi = 0; pi < photos.length; pi++) {
    var phX = SIDE + pi * (phW + phGap);
    stripNodes.push(rect(strip, phX, 0, phW, phH, hex2rgb(m.bg[photos[pi].ci % m.bg.length]), 14));
    stripNodes.push(await txt(strip, photos[pi].label, phX, phH + 6, phW, TS.sm, 500, C.gray400, { align: 'center' }));
  }
  grp('photos-strip', stripNodes, strip);
  sectionNodes.push(carousel);

  var dotsY = contentY + carouselH + 8, dotsNodes = [];
  for (var di2 = 0; di2 < photos.length; di2++) {
    dotsNodes.push(rect(p, W / 2 - (photos.length * 10) / 2 + di2 * 10, dotsY, 6, 6,
      di2 === 0 ? C.black : C.gray200, 3));
  }
  grp('carousel-dots', dotsNodes, p);
  grp('works-section', sectionNodes, p);
  homeBar(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// ПРОФИЛЬ — ОТЗЫВЫ
// ─────────────────────────────────────────────────────────────────────────────
async function buildProfileReviews(p, mi) {
  var m = MASTERS[mi];
  sf(p, C.white);
  var afterHeader = await buildProfileHeader(p, m);
  var tabEndY     = await buildTabs(p, afterHeader, 'reviews');
  var ctaPanelY   = await buildProfileCTA(p, m);
  var contentY = tabEndY + 14, contentBottom = ctaPanelY - 12;

  var sectionNodes = [];
  sectionNodes.push(await txt(p, 'ОТЗЫВЫ  ·  ' + m.reviews, SIDE, contentY, CW, TS.s, 700, C.gray400, { ls: 3 }));
  contentY += TS.s + 12;

  var availH = contentBottom - contentY;
  var revCount = m.reviewsList.length;
  var revH = Math.floor((availH - (revCount - 1) * 10) / revCount);
  if (revH < 110) revH = 110;

  for (var ri = 0; ri < revCount; ri++) {
    var rv = m.reviewsList[ri], revNodes = [];
    // Карточка отзыва
    var revCard = rect(p, SIDE, contentY, CW, revH, C.gray100, 16);
    revNodes.push(revCard);
    // Аватар
    revNodes.push(rect(p, SIDE + 12, contentY + 14, 36, 36, C.black, 18));
    revNodes.push(await txtC(p, rv.av, SIDE + 12, contentY + 32, 36, TS.sm, 700, C.accent, { align: 'center' }));
    // Имя + объект
    revNodes.push(await txt(p, rv.name, SIDE + 58, contentY + 14, CW - 80, TS.base, 700, C.black));
    revNodes.push(await txt(p, rv.obj,  SIDE + 58, contentY + 32, CW - 80, TS.sm,   400, C.gray400));
    // Звёзды
    revNodes.push(await txt(p, rv.stars, SIDE + 12, contentY + 58, 90, TS.md, 400, C.black));
    // Текст
    var textY = contentY + 58 + TS.md + 8;
    var textH = revH - (textY - contentY) - 12;
    if (textH > 0)
      revNodes.push(await txt(p, rv.text, SIDE + 12, textY, CW - 24, TS.sm, 400, C.gray600, { lineH: 18 }));
    grp('review-' + ri, revNodes, p);
    sectionNodes = sectionNodes.concat(revNodes);
    contentY += revH + 10;
  }
  grp('reviews-section', sectionNodes, p);
  homeBar(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// ОСТАЛЬНЫЕ ЭКРАНЫ (без изменений)
// ─────────────────────────────────────────────────────────────────────────────
async function buildSplash(p) {
  sf(p, C.cream);
  var dTop = SB_H + 4, dNodes = [];
  dNodes.push(rect(p, 234, dTop,      80, 80, C.accent,  16));
  dNodes.push(rect(p, 322, dTop,      58, 58, C.black,   14));
  dNodes.push(rect(p, 234, dTop + 90, 58, 42, C.gray200, 10));
  dNodes.push(rect(p, 298, dTop + 68, 82, 34, C.gray400, 10, 0.55));
  grp('decorative', dNodes, p);
  await statusBar(p, true);
  var y = SB_H + 48, logoNodes = [];
  logoNodes.push(rect(p, SIDE, y, 48, 48, C.black, 14));
  logoNodes.push(await txtC(p, 'R', SIDE, y + 24, 48, TS.lg, 900, C.accent, { align: 'center' }));
  logoNodes.push(await txt(p, 'REMATCH', SIDE + 58, y + 16, 220, TS.base, 800, C.black, { ls: 4 }));
  grp('logo', logoNodes, p); y += 48 + 64;
  var heroNodes = [];
  heroNodes.push(await txt(p, 'Найди своего\nдизайнера\nза 2 минуты', SIDE, y, CW, TS.h1, 900, C.black, { lineH: 44 }));
  y += 44 * 3 + 16;
  heroNodes.push(rect(p, SIDE, y, 64, 4, C.accent, 2)); y += 4 + 24;
  heroNodes.push(await txt(p, 'Покажи интерьеры которые нравятся —\nмы подберём дизайнеров с похожими\nреализованными проектами', SIDE, y, CW, TS.base, 400, C.gray400, { lineH: 22 }));
  grp('hero', heroNodes, p);
  var ctaNodes = [];
  ctaNodes.push(rect(p, SIDE, ctaTopY(), CW, 56, C.black, 28));
  ctaNodes.push(await txtC(p, 'Начать — это бесплатно', SIDE, ctaTopY() + 28, CW, TS.sm, 700, C.white, { align: 'center' }));
  ctaNodes.push(await txt(p, 'Уже есть аккаунт? Войти', SIDE, ctaTopY() + 68, CW, TS.sm, 400, C.gray400, { align: 'center' }));
  grp('cta', ctaNodes, p);
  homeBar(p);
}

async function buildStyleSwipe(p, idx, state) {
  state = state || 'neutral';
  var st = STYLES[idx];
  sf(p, C.white);
  await statusBar(p, true);
  var y = SB_H + 12, topNodes = [];
  topNodes.push(await txt(p, (idx + 1) + ' / ' + STYLES.length, 0, y, W, TS.s, 600, C.gray400, { align: 'center', ls: 3 }));
  y += TS.s + 12;
  topNodes.push(await txt(p, 'Нравится этот стиль?', SIDE, y, CW, TS.xl, 800, C.black, { lineH: 28 }));
  y += 28 + 12; grp('top-bar', topNodes, p);
  var btnCY = swipeCY(), tagsH = 36 + 10, cardEnd = btnCY - 34 - 16 - tagsH;
  var cH = cardEnd - y; if (cH < 80) cH = 80;
  var card = mkFrame(p, SIDE, y, CW, cH, hex2rgb(st.c[0]), 22);
  var cols = 3, rows = 2, g = 3, bW2 = (CW - g * (cols + 1)) / cols, bH2 = (cH - g * (rows + 1)) / rows;
  var mosaicNodes = [];
  for (var r = 0; r < rows; r++)
    for (var c = 0; c < cols; c++)
      mosaicNodes.push(rect(card, g + c * (bW2 + g), g + r * (bH2 + g), bW2, bH2, hex2rgb(st.c[Math.min(r * cols + c, st.c.length - 1)]), 12));
  grp('mosaic', mosaicNodes, card);
  var lPH = 16, lPV = 14, nLH = 26, dLH = 20, dLines = st.desc.split('\n').length;
  var lBgH = lPV + nLH + 10 + dLH * dLines + lPV, lBgY = cH - lBgH - 8;
  var ov = figma.createRectangle(); ov.x = 6; ov.y = lBgY; ov.resize(CW - 12, lBgH); ov.cornerRadius = 16;
  ov.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.96 }]; card.appendChild(ov);
  var labelNodes = [];
  labelNodes.push(await txt(card, st.name, lPH, lBgY + lPV, CW - lPH * 2, TS.lg, 800, C.black, { lineH: nLH }));
  labelNodes.push(await txt(card, st.desc, lPH, lBgY + lPV + nLH + 10, CW - lPH * 2, TS.base, 400, C.gray400, { lineH: dLH }));
  grp('card-label', labelNodes, card);
  if (state === 'like') {
    var lb = rect(card, CW - 148, 12, 132, 32, C.accentL, 8);
    lb.strokes = [{ type: 'SOLID', color: C.accent }]; lb.strokeWeight = 1;
    await txtC(card, '✓  НРАВИТСЯ', CW - 148, 28, 132, TS.sm, 700, C.black, { align: 'center' });
  } else if (state === 'nope') {
    var nb = rect(card, 14, 12, 140, 32, C.redL, 8);
    nb.strokes = [{ type: 'SOLID', color: { r: 0.91, g: 0.75, b: 0.75 } }]; nb.strokeWeight = 1;
    await txtC(card, '✘  НЕ НРАВИТСЯ', 14, 28, 140, TS.sm, 700, C.black, { align: 'center' });
  }
  var tagsY = y + cH + 10, tgX2 = SIDE, tagNodes = [];
  for (var ti2 = 0; ti2 < st.tags.length; ti2++) {
    var tgW = st.tags[ti2].length * 7.5 + 28;
    var tg = rect(p, tgX2, tagsY, tgW, 36, C.white, 18);
    tg.strokes = [{ type: 'SOLID', color: C.gray200 }]; tg.strokeWeight = 1;
    tagNodes.push(tg);
    tagNodes.push(await txtC(p, st.tags[ti2], tgX2, tagsY + 18, tgW, TS.sm, 500, C.gray400, { align: 'center' }));
    tgX2 += tgW + 8;
  }
  grp('style-tags', tagNodes, p);
  await swipeButtons(p); homeBar(p);
}

async function buildBehavior(p) {
  sf(p, C.white); await statusBar(p, true);
  var y = SB_H + 8; y = progressBar(p, 5, 1, y); y += 16;
  var hNodes = [];
  hNodes.push(await txt(p, 'ШАГ 1 ИЗ 5', SIDE, y, CW, TS.s, 600, C.gray400, { ls: 4 })); y += TS.s + 12;
  hNodes.push(await txt(p, 'Как вы принимаете\nрешения?', SIDE, y, CW, TS.xl, 800, C.black, { lineH: 28 })); y += 28 * 2 + 12;
  hNodes.push(await txt(p, 'Выберите одно — то, что ближе', SIDE, y, CW, TS.base, 400, C.gray400)); y += TS.base + 16;
  grp('screen-header', hNodes, p);
  var items = [
    { icon: '🖼', t: 'Хожу по шоурумам' }, { icon: '📱', t: 'Pinterest / Instagram' },
    { icon: '💬', t: 'Советуюсь с другими' }, { icon: '🔍', t: 'Долго сравниваю' }, { icon: '⚡', t: 'Решаю по ощущению' }
  ];
  var rowH = 64;
  for (var i = 0; i < items.length; i++) {
    var sel = i === 1, rNodes = [];
    var row = rect(p, SIDE, y, CW, rowH, sel ? C.gray100 : C.white, 16);
    row.strokes = [{ type: 'SOLID', color: sel ? C.black : C.gray200 }]; row.strokeWeight = 1.5; rNodes.push(row);
    rNodes.push(await txtC(p, items[i].icon, SIDE + 16, y + rowH / 2, 28, TS.xl, 400, C.black, { align: 'center' }));
    rNodes.push(await txtC(p, items[i].t, SIDE + 54, y + rowH / 2, CW - 82, TS.md, 500, C.black));
    if (sel) { var chk = await checkmark(p, SIDE, y, CW, rowH); rNodes = rNodes.concat(chk); }
    grp('row-' + i, rNodes, p); y += rowH + 8;
  }
  var ctaNodes = [];
  ctaNodes.push(rect(p, SIDE, ctaTopY(), CW, 56, C.black, 28));
  ctaNodes.push(await txtC(p, 'Далее →', SIDE, ctaTopY() + 28, CW, TS.sm, 700, C.white, { align: 'center' }));
  grp('cta', ctaNodes, p); homeBar(p);
}

async function buildBudget(p) {
  sf(p, C.white); await statusBar(p, true);
  var y = SB_H + 8; y = progressBar(p, 5, 2, y); y += 16;
  var hNodes = [];
  hNodes.push(await txt(p, 'ШАГ 2 ИЗ 5', SIDE, y, CW, TS.s, 600, C.gray400, { ls: 4 })); y += TS.s + 12;
  hNodes.push(await txt(p, 'Бюджет на дизайн-проект', SIDE, y, CW, TS.xl, 800, C.black, { lineH: 28 })); y += 28 + 12;
  hNodes.push(await txt(p, 'Поможет подобрать мастера нужного уровня', SIDE, y, CW, TS.base, 400, C.gray400)); y += TS.base + 16;
  grp('screen-header', hNodes, p);
  var list = [
    { p: 'до 80 000 ₽',     d: 'Планировка и спецификации' },
    { p: '80 – 150 000 ₽',  d: 'Полный проект, 3D' },
    { p: '150 – 300 000 ₽', d: 'Проект с авторским надзором' },
    { p: '300 – 600 000 ₽', d: 'Комплексный под ключ' },
    { p: 'от 600 000 ₽',    d: 'Премиум, эксклюзив' },
    { p: 'Пока не знаю',    d: 'Расскажем о вариантах' }
  ];
  var rowH = 72;
  for (var i = 0; i < list.length; i++) {
    var sel = i === 2, rNodes = [];
    var row = rect(p, SIDE, y, CW, rowH, sel ? C.gray100 : C.white, 16);
    row.strokes = [{ type: 'SOLID', color: sel ? C.black : C.gray200 }]; row.strokeWeight = 1.5; rNodes.push(row);
    rNodes.push(await txt(p, list[i].p, SIDE + 16, y + 16, CW - 60, TS.md, 700, C.black));
    rNodes.push(await txt(p, list[i].d, SIDE + 16, y + 40, CW - 60, TS.sm, 400, C.gray400));
    if (sel) { var chk = await checkmark(p, SIDE, y, CW, rowH); rNodes = rNodes.concat(chk); }
    grp('budget-row-' + i, rNodes, p); y += rowH + 8;
  }
  homeBar(p);
}

async function buildArea(p) {
  sf(p, C.white); await statusBar(p, true);
  var y = SB_H + 8; y = progressBar(p, 5, 3, y); y += 16;
  var hNodes = [];
  hNodes.push(await txt(p, 'ШАГ 3 ИЗ 5', SIDE, y, CW, TS.s, 600, C.gray400, { ls: 4 })); y += TS.s + 12;
  hNodes.push(await txt(p, 'Площадь квартиры', SIDE, y, CW, TS.xl, 800, C.black, { lineH: 28 })); y += 28 + 12;
  hNodes.push(await txt(p, 'Примерно — для подбора специализации', SIDE, y, CW, TS.base, 400, C.gray400)); y += TS.base + 20;
  grp('screen-header', hNodes, p);
  var areas = [{ n: 'до 35 м²', l: 'студия' }, { n: '35–55 м²', l: '1–2 комн.' }, { n: '55–80 м²', l: '2–3 комн.' }, { n: 'от 80 м²', l: 'большая' }];
  var cellW = (CW - 12) / 2, cellH = 120, gridNodes = [];
  for (var i = 0; i < 4; i++) {
    var col = i % 2, rowN = Math.floor(i / 2), cx2 = SIDE + col * (cellW + 12), cy2 = y + rowN * (cellH + 12);
    var sel = i === 1, cNodes = [];
    var cell = rect(p, cx2, cy2, cellW, cellH, sel ? C.gray100 : C.white, 16);
    cell.strokes = [{ type: 'SOLID', color: sel ? C.black : C.gray200 }]; cell.strokeWeight = 1.5; cNodes.push(cell);
    cNodes.push(await txtC(p, areas[i].n, cx2 + 8, cy2 + cellH / 2 - 10, cellW - 16, TS.lg, 800, C.black, { align: 'center' }));
    cNodes.push(await txtC(p, areas[i].l, cx2 + 8, cy2 + cellH / 2 + 16, cellW - 16, TS.sm, 500, C.gray400, { align: 'center' }));
    if (sel) {
      var chkSz = 24, chkX2 = cx2 + cellW - 10 - chkSz, chkY3 = cy2 + 10;
      cNodes.push(rect(p, chkX2, chkY3, chkSz, chkSz, C.black, 6));
      cNodes.push(await txtC(p, '✓', chkX2, chkY3 + chkSz / 2, chkSz, TS.sm, 800, C.white, { align: 'center' }));
    }
    grp('area-cell-' + i, cNodes, p); gridNodes = gridNodes.concat(cNodes);
  }
  grp('area-grid', gridNodes, p); homeBar(p);
}

async function buildFeatures(p) {
  sf(p, C.white); await statusBar(p, true);
  var y = SB_H + 8; y = progressBar(p, 5, 4, y); y += 16;
  var hNodes = [];
  hNodes.push(await txt(p, 'ШАГ 4 ИЗ 5', SIDE, y, CW, TS.s, 600, C.gray400, { ls: 4 })); y += TS.s + 12;
  hNodes.push(await txt(p, 'Что важно в интерьере?', SIDE, y, CW, TS.xl, 800, C.black, { lineH: 28 })); y += 28 + 12;
  hNodes.push(await txt(p, 'Выберите всё, что важно для вас', SIDE, y, CW, TS.base, 400, C.gray400)); y += TS.base + 16;
  grp('screen-header', hNodes, p);
  var tags = [
    { t: 'хранение', s: true },  { t: 'свет', s: false },       { t: 'эргономика', s: true }, { t: 'эко', s: false },
    { t: 'цвет. акц.', s: true }, { t: 'простор', s: false },    { t: 'уют', s: true },        { t: 'минимализм', s: false },
    { t: 'рабочая зона', s: true },{ t: 'детская', s: false },   { t: 'текстиль', s: false },  { t: 'высок. потолки', s: false },
    { t: 'откр. кухня', s: false },{ t: 'гардеробная', s: true }, { t: 'тёмные тона', s: false },{ t: 'светлые тона', s: true },
    { t: 'панор. окна', s: false },{ t: 'умный дом', s: false },  { t: 'барная стойка', s: false },{ t: 'зонирование', s: true },
    { t: 'арт-объекты', s: false },{ t: 'мягкие формы', s: false },{ t: 'геометрия', s: false },{ t: 'природ. мат.', s: true }
  ];
  var tagH = 36, gX = 8, gY = 10, rx = SIDE, ry = y, tagNodes = [];
  for (var i = 0; i < tags.length; i++) {
    var tw = tags[i].t.length * 7.5 + 28;
    if (rx + tw > SIDE + CW) { rx = SIDE; ry += tagH + gY; }
    var te = rect(p, rx, ry, tw, tagH, tags[i].s ? C.black : C.white, tagH / 2);
    te.strokes = [{ type: 'SOLID', color: tags[i].s ? C.black : C.gray200 }]; te.strokeWeight = 1.5;
    tagNodes.push(te);
    tagNodes.push(await txtC(p, tags[i].t, rx, ry + tagH / 2, tw, TS.sm, tags[i].s ? 600 : 500, tags[i].s ? C.white : C.black, { align: 'center' }));
    rx += tw + gX;
  }
  grp('feature-tags', tagNodes, p);
  var ctaNodes = [];
  ctaNodes.push(rect(p, SIDE, ctaTopY(), CW, 56, C.accent, 28));
  ctaNodes.push(await txtC(p, 'Показать мастеров →', SIDE, ctaTopY() + 28, CW, TS.sm, 700, C.black, { align: 'center' }));
  grp('cta', ctaNodes, p); homeBar(p);
}

async function buildResult(p, mi) {
  var m = MASTERS[mi];
  sf(p, C.white); await statusBar(p, true);
  var y = SB_H + 14, topNodes = [];
  topNodes.push(await txt(p, 'СОВПАДЕНИЯ', SIDE, y, 140, TS.xs, 600, C.gray400, { ls: 4 }));
  var total = MASTERS.length;
  for (var di = 0; di < total; di++)
    topNodes.push(rect(p, W - SIDE - (total - di) * 18, y, 12, 12, di < m.idx ? C.accent : C.gray200, 6));
  grp('top-indicator', topNodes, p); y += 12 + 12;
  var btnCY = swipeCY(), cardEnd = btnCY - 34 - 16;
  var cH = cardEnd - y; if (cH < 120) cH = 120;
  var card = mkFrame(p, SIDE, y, CW, cH, C.white, 22);
  card.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.08 }, offset: { x: 0, y: 4 }, radius: 24, spread: 0, visible: true, blendMode: 'NORMAL' }];
  var mH = Math.round(cH * 0.36), cols = 3, g = 3, bW3 = (CW - g * (cols + 1)) / cols;
  var mosaicNodes = [];
  for (var ci2 = 0; ci2 < cols; ci2++)
    mosaicNodes.push(rect(card, g + ci2 * (bW3 + g), g, bW3, mH - g, hex2rgb(m.bg[ci2]), 14));
  gradRect(card, 0, mH - 60, CW, 80, 0, 0.6);
  grp('mosaic', mosaicNodes, card);
  var badgeNodes = [];
  badgeNodes.push(rect(card, 14, 14, 148, 32, C.accent, 16));
  badgeNodes.push(await txtC(card, m.match + '% совпадение', 14, 30, 148, TS.sm, 700, C.black, { align: 'center' }));
  grp('match-badge', badgeNodes, card);
  var infoY = mH + 14;
  var avNodes2 = [];
  avNodes2.push(rect(card, 16, infoY, 44, 44, C.black, 22));
  avNodes2.push(await txtC(card, m.initials, 16, infoY + 22, 44, TS.base, 800, C.accent, { align: 'center' }));
  grp('avatar', avNodes2, card);
  var tX = 70, tW = CW - tX - 12, infoTextNodes = [];
  infoTextNodes.push(await txt(card, m.fullName,              tX, infoY,              tW, TS.xl,  800, C.black));
  infoTextNodes.push(await txt(card, m.city + ' · ' + m.exp, tX, infoY + TS.xl + 8,  tW, TS.sm,  400, C.gray400));
  infoTextNodes.push(await txt(card, '★ ' + m.rating + '  ' + m.reviews, tX, infoY + TS.xl + 8 + TS.sm + 8, tW, TS.sm, 500, C.black));
  grp('info-text', infoTextNodes, card);
  infoY += Math.max(44, TS.xl + 8 + TS.sm + 8 + TS.sm) + 12;
  line(card, 16, infoY, CW - 32); infoY += 1 + 12;
  var priceNodes = [];
  priceNodes.push(await txt(card, m.price,               16,      infoY,     (CW - 32) / 2, TS.price, 800, C.black));
  priceNodes.push(await txt(card, m.projects+' проектов',CW/2,    infoY + 2, (CW/2) - 20,   TS.lg,    600, C.gray400, { align: 'right' }));
  priceNodes.push(await txt(card, 'стоимость/м²',        16,      infoY+30,  (CW - 32) / 2, TS.sm,    400, C.gray400));
  grp('price-block', priceNodes, card); infoY += 30 + TS.sm + 16;
  var whyNodes = [];
  whyNodes.push(await txt(card, 'ПОЧЕМУ ' + m.fullName.split(' ')[0].toUpperCase(), 16, infoY, 240, TS.sm, 700, C.gray400, { ls: 3 }));
  infoY += TS.sm + 10;
  var tgX3 = 16;
  for (var wyi = 0; wyi < m.why.length; wyi++) {
    var wt = m.why[wyi], wtW = wt.length * 7 + 24;
    if (tgX3 + wtW > CW - 16) { tgX3 = 16; infoY += 36; }
    whyNodes.push(rect(card, tgX3, infoY, wtW, 28, C.gray100, 14));
    whyNodes.push(await txtC(card, wt, tgX3, infoY + 14, wtW, TS.sm, 500, C.gray600, { align: 'center' }));
    tgX3 += wtW + 8;
  }
  grp('why-block', whyNodes, card);
  await swipeButtons(p); homeBar(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// UI KIT
// ─────────────────────────────────────────────────────────────────────────────
async function buildUIKit(p) {
  sf(p, C.bg);
  var x = 56, y = 56;
  var header = [];
  header.push(await txt(p, 'REMATCH  UI KIT', x, y, 1200, TS.h0, 900, C.black, { ls: 3 }));
  header.push(await txt(p, 'Шрифт: ' + FONT_FAMILY + ' · iPhone 16 · 393×852 · Dynamic Island', x, y + 44, 1200, TS.sm, 400, C.gray400, { ls: 2 }));
  header.push(await txt(p, '↑ Измени FONT_FAMILY в начале кода — шрифт изменится на всех экранах', x, y + 64, 1200, TS.xs, 400, C.gray400));
  grp('00-header', header, p); y += 108;

  // 01 Цвета
  var colorNodes = [];
  colorNodes.push(await txt(p, '01  ЦВЕТА', x, y, 400, TS.s, 700, C.gray400, { ls: 5 })); y += 28;
  var tokens = [
    { n: 'Black',    bg: C.black,   fg: C.white, h: '#010101' },
    { n: 'White',    bg: C.white,   fg: C.black, h: '#ffffff' },
    { n: 'Accent',   bg: C.accent,  fg: C.black, h: '#c9f542' },
    { n: 'Accent L', bg: C.accentL, fg: C.black, h: '#e0faa0' },
    { n: 'Red L',    bg: C.redL,    fg: C.black, h: '#ffe0e0' },
    { n: 'BG',       bg: C.bg,      fg: C.black, h: '#f2eeea' },
    { n: 'Gray 100', bg: C.gray100, fg: C.black, h: '#f7f6f3' },
    { n: 'Gray 200', bg: C.gray200, fg: C.black, h: '#e0dbe6' },
    { n: 'Gray 400', bg: C.gray400, fg: C.white, h: '#6b6b6e' },
    { n: 'Gray 600', bg: C.gray600, fg: C.white, h: '#3b3b3e' }
  ];
  for (var ci = 0; ci < tokens.length; ci++) {
    var swX = x + ci * 140, swNodes = [];
    var sw = rect(p, swX, y, 120, 120, tokens[ci].bg, 16);
    if (tokens[ci].n === 'White') { sw.strokes = [{ type: 'SOLID', color: C.gray200 }]; sw.strokeWeight = 1; }
    swNodes.push(sw);
    swNodes.push(await txtC(p, tokens[ci].n, swX, y + 60, 120, TS.xs, 700, tokens[ci].fg, { align: 'center' }));
    swNodes.push(await txt(p, tokens[ci].n, swX, y + 126, 120, TS.s,  700, C.gray600, { align: 'center' }));
    swNodes.push(await txt(p, tokens[ci].h, swX, y + 140, 120, TS.xs, 400, C.gray400, { align: 'center' }));
    grp('color-' + tokens[ci].n, swNodes, p);
    colorNodes = colorNodes.concat(swNodes);
  }
  grp('01-colors', colorNodes, p); y += 188;

  // 02 Типографика
  var typoNodes = [];
  typoNodes.push(await txt(p, '02  ТИПОГРАФИКА — ' + FONT_FAMILY.toUpperCase(), x, y, 1200, TS.s, 700, C.gray400, { ls: 5 })); y += 28;
  var typeRows = [
    { label: 'xs    / 7px',   sample: 'Микро-подпись · счётчик · бейдж',       sz: TS.xs,    w: 400 },
    { label: 's     / 9px',   sample: 'Мелкий второстепенный · лейбл',          sz: TS.s,     w: 400 },
    { label: 'sm    / 11px',  sample: 'Тег · подпись кнопки · город мастера',   sz: TS.sm,    w: 500 },
    { label: 'base  / 14px',  sample: 'Основной текст · отзыв · описание',      sz: TS.base,  w: 400 },
    { label: 'md    / 16px',  sample: 'Строка списка · пункт меню',             sz: TS.md,    w: 500 },
    { label: 'lg    / 18px',  sample: 'Подзаголовок · цена мастера',            sz: TS.lg,    w: 600 },
    { label: 'xl    / 20px',  sample: 'Заголовок экрана · имя мастера',         sz: TS.xl,    w: 700 },
    { label: 'price / 22px',  sample: '4 500 ₽/м²  — цена',                    sz: TS.price, w: 800 },
    { label: 'xxl   / 24px',  sample: '47 проектов · 94% · статы мастера',      sz: TS.xxl,   w: 800 },
    { label: 'h1    / 26px',  sample: 'Найди своего дизайнера',                 sz: TS.h1,    w: 900 },
    { label: 'h0    / 28px',  sample: 'REMATCH — Заголовок приложения',         sz: TS.h0,    w: 900 }
  ];
  for (var ti = 0; ti < typeRows.length; ti++) {
    var tr = typeRows[ti], tRow = [];
    tRow.push(await txt(p, tr.label,  x,       y + 4, 260, TS.xs, 400, C.gray400));
    tRow.push(await txt(p, tr.sample, x + 270, y,     900, tr.sz, tr.w, C.black));
    grp('type-' + ti, tRow, p);
    typoNodes = typoNodes.concat(tRow);
    y += tr.sz + 24;
  }
  grp('02-typography', typoNodes, p); y += 24;

  // 03 Веса
  var weightNodes = [];
  weightNodes.push(await txt(p, '03  ВЕСА ШРИФТА', x, y, 600, TS.s, 700, C.gray400, { ls: 5 })); y += 28;
  var weights = [
    { w: 400, label: 'Regular' }, { w: 500, label: 'Medium' }, { w: 600, label: 'SemiBold' },
    { w: 700, label: 'Bold' },    { w: 800, label: 'ExtraBold' }, { w: 900, label: 'Black' }
  ];
  for (var wi2 = 0; wi2 < weights.length; wi2++) {
    var wRow = [];
    wRow.push(await txt(p, weights[wi2].label + ' / ' + weights[wi2].w, x,       y, 280, TS.xs, 400, C.gray400));
    wRow.push(await txt(p, 'Дизайнер интерьеров · ' + FONT_FAMILY,      x + 290, y, 700, TS.lg, weights[wi2].w, C.black));
    grp('weight-' + weights[wi2].w, wRow, p);
    weightNodes = weightNodes.concat(wRow); y += TS.lg + 16;
  }
  grp('03-weights', weightNodes, p); y += 32;

  // 04 Кнопки
  var btnSection = [];
  btnSection.push(await txt(p, '04  КНОПКИ', x, y, 600, TS.s, 700, C.gray400, { ls: 5 })); y += 28;
  var bpr = rect(p, x, y, 280, 56, C.black, 28); btnSection.push(bpr);
  btnSection.push(await txtC(p, 'Начать — это бесплатно', x, y + 28, 280, TS.sm, 700, C.white, { align: 'center' }));
  var bac = rect(p, x + 296, y, 240, 56, C.accent, 28); btnSection.push(bac);
  btnSection.push(await txtC(p, 'Показать мастеров →', x + 296, y + 28, 240, TS.sm, 700, C.black, { align: 'center' }));
  var bgh = rect(p, x + 552, y, 200, 56, C.white, 28);
  bgh.strokes = [{ type: 'SOLID', color: C.gray200 }]; bgh.strokeWeight = 1.5; btnSection.push(bgh);
  btnSection.push(await txtC(p, 'Войти', x + 552, y + 28, 200, TS.sm, 600, C.black, { align: 'center' }));
  grp('04-buttons', btnSection, p); y += 56 + 32;

  // 05 Иконки-кнопки
  var iconSection = [];
  iconSection.push(await txt(p, '05  ИКОНКИ-КНОПКИ', x, y, 600, TS.s, 700, C.gray400, { ls: 5 })); y += 28;
  var icons = [
    { ic: '←', bg: C.white,   label: 'Назад' },
    { ic: '☆', bg: C.white,   label: 'Сохранить' },
    { ic: '↗', bg: C.white,   label: 'Поделиться' },
    { ic: '✓', bg: C.accent,  label: 'Выбрать' },
    { ic: '✘', bg: C.redL,    label: 'Отклонить' },
    { ic: '↺', bg: C.gray100, label: 'Пропустить' }
  ];
  for (var ii = 0; ii < icons.length; ii++) {
    var ib = rect(p, x + ii * 80, y, 56, 56, icons[ii].bg, 28);
    ib.strokes = [{ type: 'SOLID', color: C.gray200 }]; ib.strokeWeight = 1;
    iconSection.push(ib);
    iconSection.push(await txtC(p, icons[ii].ic,    x + ii * 80, y + 28, 56, TS.xl, 600, C.black, { align: 'center' }));
    iconSection.push(await txt(p,  icons[ii].label, x + ii * 80, y + 62, 56, TS.xs, 400, C.gray400, { align: 'center' }));
  }
  grp('05-icon-buttons', iconSection, p); y += 56 + 32 + 24;

  // 06 Теги
  var tagSection = [];
  tagSection.push(await txt(p, '06  ТЕГИ / ПЛАШКИ', x, y, 600, TS.s, 700, C.gray400, { ls: 5 })); y += 28;
  var tagExamples = [
    { t: 'светлые тона', s: 'dark' }, { t: 'минимализм', s: 'none' },
    { t: '94% совпадение', s: 'accent' }, { t: 'japandi', s: 'none' },
    { t: 'Москва · онлайн', s: 'none' }, { t: '★ 4.9', s: 'none' }
  ];
  var tgRx = x;
  for (var tgi = 0; tgi < tagExamples.length; tgi++) {
    var te = tagExamples[tgi], tw = te.t.length * 7.5 + 28, thH = 36;
    var teBg = te.s === 'dark' ? C.black : te.s === 'accent' ? C.accent : C.white;
    var teFg = te.s === 'dark' ? C.white : C.black;
    var tgEl = rect(p, tgRx, y, tw, thH, teBg, thH / 2);
    if (te.s === 'none') { tgEl.strokes = [{ type: 'SOLID', color: C.gray200 }]; tgEl.strokeWeight = 1; }
    tagSection.push(tgEl);
    tagSection.push(await txtC(p, te.t, tgRx, y + thH / 2, tw, TS.sm, te.s ? 600 : 500, teFg, { align: 'center' }));
    tgRx += tw + 10;
  }
  grp('06-tags', tagSection, p); y += 36 + 32;

  // 07 Аватары
  var avSection = [];
  avSection.push(await txt(p, '07  АВАТАРЫ', x, y, 600, TS.s, 700, C.gray400, { ls: 5 })); y += 28;
  var avSizes = [40, 48, 56, 64], avColors = [C.black, C.gray600, C.gray400, C.gray200], avFg = [C.accent, C.white, C.white, C.black];
  for (var avi = 0; avi < avSizes.length; avi++) {
    var avSz = avSizes[avi], avX = x + avi * (avSz + 16);
    avSection.push(rect(p, avX, y, avSz, avSz, avColors[avi], avSz / 2));
    avSection.push(await txtC(p, 'АС', avX, y + avSz / 2, avSz, Math.round(avSz * 0.28), 700, avFg[avi], { align: 'center' }));
    avSection.push(await txt(p, avSz + 'px', avX, y + avSz + 6, avSz, TS.xs, 400, C.gray400, { align: 'center' }));
  }
  grp('07-avatars', avSection, p); y += avSizes[avSizes.length - 1] + 32;

  // 08 Прогресс-бары
  var pbSection = [];
  pbSection.push(await txt(p, '08  ПРОГРЕСС-БАР', x, y, 600, TS.s, 700, C.gray400, { ls: 5 })); y += 28;
  for (var pbi = 1; pbi <= 5; pbi++) {
    var pbGap = 4, pbSegW = (500 - pbGap * 4) / 5;
    for (var pbj = 0; pbj < 5; pbj++)
      pbSection.push(rect(p, x + pbj * (pbSegW + pbGap), y, pbSegW, 4, pbj < pbi ? C.black : C.gray200, 2));
    pbSection.push(await txt(p, pbi + '/5', x + 516, y + 2, 40, TS.xs, 600, C.gray400));
    y += 4 + 10;
  }
  grp('08-progress', pbSection, p); y += 24;

  // 09 Звёзды
  var stSection = [];
  stSection.push(await txt(p, '09  РЕЙТИНГ / ЗВЁЗДЫ', x, y, 600, TS.s, 700, C.gray400, { ls: 5 })); y += 28;
  ['★★★★★  5.0', '★★★★☆  4.2', '★★★☆☆  3.1'].forEach(function(s, i) {
    stSection.push(txt(p, s, x + i * 220, y, 200, TS.md, 500, C.black));
  });
  grp('09-stars', stSection, p); y += TS.md + 32;

  // 10 Разделители
  var divSection = [];
  divSection.push(await txt(p, '10  РАЗДЕЛИТЕЛИ', x, y, 600, TS.s, 700, C.gray400, { ls: 5 })); y += 28;
  divSection.push(line(p, x, y, 600, C.gray200));
  divSection.push(await txt(p, 'gray200 / 1px', x + 616, y - 4, 200, TS.xs, 400, C.gray400)); y += 14;
  divSection.push(line(p, x, y, 600, C.gray400, 0.3));
  divSection.push(await txt(p, 'gray400 30% / 1px', x + 616, y - 4, 200, TS.xs, 400, C.gray400)); y += 14;
  divSection.push(line(p, x, y, 600, C.black, 0.08));
  divSection.push(await txt(p, 'black 8% / 1px', x + 616, y - 4, 200, TS.xs, 400, C.gray400));
  grp('10-dividers', divSection, p);
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN MAP + ГЛАВНЫЙ ЦИКЛ
// ─────────────────────────────────────────────────────────────────────────────
var SCREEN_MAP = {
  ui_kit:      { name: '00 — UI Kit',              fn: function(p) { return buildUIKit(p); } },
  splash:      { name: '01 — Splash',               fn: function(p) { return buildSplash(p); } },
  style_scan:  { name: '02a — Скандинавский',       fn: function(p) { return buildStyleSwipe(p, 0, 'like'); } },
  style_min:   { name: '02b — Минимализм',          fn: function(p) { return buildStyleSwipe(p, 1, 'neutral'); } },
  style_loft:  { name: '02c — Лофт',                fn: function(p) { return buildStyleSwipe(p, 2, 'nope'); } },
  style_mod:   { name: '02d — Современный',         fn: function(p) { return buildStyleSwipe(p, 3, 'neutral'); } },
  style_class: { name: '02e — Классика',            fn: function(p) { return buildStyleSwipe(p, 4, 'like'); } },
  style_eco:   { name: '02f — Эко/Бохо',            fn: function(p) { return buildStyleSwipe(p, 5, 'neutral'); } },
  style_japdi: { name: '02g — Japandi',             fn: function(p) { return buildStyleSwipe(p, 6, 'nope'); } },
  style_art:   { name: '02h — Арт-деко',            fn: function(p) { return buildStyleSwipe(p, 7, 'like'); } },
  behavior:    { name: '03 — Поведение',            fn: function(p) { return buildBehavior(p); } },
  budget:      { name: '04 — Бюджет',               fn: function(p) { return buildBudget(p); } },
  area:        { name: '05 — Площадь',              fn: function(p) { return buildArea(p); } },
  features:    { name: '06 — Критерии',             fn: function(p) { return buildFeatures(p); } },
  result_1:    { name: '07a — Карточка Анна',       fn: function(p) { return buildResult(p, 0); } },
  result_2:    { name: '07b — Карточка Макс',       fn: function(p) { return buildResult(p, 1); } },
  result_3:    { name: '07c — Карточка Елена',      fn: function(p) { return buildResult(p, 2); } },
  profile_1:   { name: '08a — Работы Анна',         fn: function(p) { return buildProfile(p, 0); } },
  profile_2:   { name: '08b — Работы Макс',         fn: function(p) { return buildProfile(p, 1); } },
  profile_3:   { name: '08c — Работы Елена',        fn: function(p) { return buildProfile(p, 2); } },
  // ↓ Экраны отзывов — все три мастера, один активный
  profile_1r:  { name: '09a — Отзывы Анна',         fn: function(p) { return buildProfileReviews(p, 0); } },
  profile_2r:  { name: '09b — Отзывы Макс',         fn: function(p) { return buildProfileReviews(p, 1); } },
  profile_3r:  { name: '09c — Отзывы Елена',        fn: function(p) { return buildProfileReviews(p, 2); } }
};

figma.ui.onmessage = async function(msg) {
  if (msg.type !== 'create-screens') return;
  try {
    var screens = msg.screens, layout = msg.layout, gap = msg.gap;
    var phoneScreens = screens.filter(function(s) { return s !== 'ui_kit'; });
    var hasUIKit = screens.indexOf('ui_kit') !== -1;
    var bw = bodyW(), bh = bodyH();
    var COLS = layout === 'grid' ? 4 : layout === 'vertical' ? 1 : phoneScreens.length;
    var rows = Math.ceil(phoneScreens.length / Math.max(COLS, 1));
    var cellW = bw + gap, cellH = bh + gap;
    var uiKitW = 1440, uiKitH = 2800;
    var totW = Math.max(COLS * cellW + gap, hasUIKit ? uiKitW + gap * 2 : 0);
    var totH = (hasUIKit ? uiKitH + gap : 0) + rows * cellH + gap;
    var container = figma.createFrame();
    container.name = 'ReMatch — Онбординг v22';
    sf(container, C.bg);
    container.resize(totW, totH);
    container.x = 0; container.y = 0;
    figma.currentPage.appendChild(container);
    var offsetY = 0;
    if (hasUIKit) {
      figma.ui.postMessage({ type: 'progress', pct: 2, label: 'UI Kit...' });
      var uk = figma.createFrame();
      uk.name = '00 — UI Kit'; uk.x = gap; uk.y = gap;
      uk.resize(uiKitW, uiKitH); uk.clipsContent = true; sf(uk, C.bg);
      container.appendChild(uk);
      await buildUIKit(uk);
      offsetY = uiKitH + gap;
    }
    for (var i = 0; i < phoneScreens.length; i++) {
      var def = SCREEN_MAP[phoneScreens[i]]; if (!def) continue;
      var col = layout === 'vertical' ? 0 : layout === 'horizontal' ? i : i % COLS;
      var row = layout === 'horizontal' ? 0 : layout === 'vertical' ? i : Math.floor(i / COLS);
      figma.ui.postMessage({ type: 'progress', pct: 3 + Math.round((i / phoneScreens.length) * 94), label: 'Создаю: ' + def.name });
      var phoneX = gap + col * cellW, phoneY = offsetY + gap + row * cellH;
      var pos = await drawPhone(container, phoneX, phoneY);
      var f = figma.createFrame();
      f.name = def.name; f.x = pos.screenX; f.y = pos.screenY;
      f.resize(W, H); f.clipsContent = true; f.cornerRadius = PHONE.screenR;
      sf(f, C.white); container.appendChild(f);
      await def.fn(f);
      drawDynamicIsland(container, pos);
    }
    figma.viewport.scrollAndZoomIntoView([container]);
    figma.ui.postMessage({ type: 'done', count: screens.length });
  } catch(err) {
    figma.ui.postMessage({ type: 'error', message: err.message });
    console.error(err);
  }
};