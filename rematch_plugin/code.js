figma.showUI(__html__, { width: 380, height: 820 });

var W = 393;
var H = 852;

var PHONE = {
  borderL: 14, borderR: 14,
  borderT: 12, borderB: 14,
  bodyR: 54, screenR: 46,
  diW: 126, diH: 37, diR: 20,
  diOffsetY: 12
};

function bodyW() { return W + PHONE.borderL + PHONE.borderR; }
function bodyH() { return H + PHONE.borderT + PHONE.borderB; }

var DI_BOTTOM = PHONE.diOffsetY + PHONE.diH;
var SB_Y      = 15;
var SB_H      = DI_BOTTOM + 10;

var HOME_H = 34;
var SIDE   = 16;
var CW     = W - SIDE * 2;

function safeBottom() { return H - HOME_H - 8; }
function ctaTopY()    { return safeBottom() - 56 - 12; }

function swipeCY() { return H - 54 - 34; }

var C = {
  black:   { r: 0.004, g: 0.004, b: 0.004 },
  white:   { r: 1, g: 1, b: 1 },
  accent:  { r: 0.788, g: 0.961, b: 0.259 },
  accentL: { r: 0.878, g: 0.980, b: 0.600 },
  redL:    { r: 1.000, g: 0.878, b: 0.878 },
  gray100: { r: 0.969, g: 0.965, b: 0.953 },
  gray200: { r: 0.878, g: 0.859, b: 0.902 },
  gray400: { r: 0.420, g: 0.420, b: 0.431 },
  gray600: { r: 0.231, g: 0.231, b: 0.243 },
  bg:      { r: 0.949, g: 0.937, b: 0.918 },
  cream:   { r: 0.980, g: 0.984, b: 0.996 },
  // Акцентный светло-зелёный для декора сплэша (вместо белого)
  splashDeco: { r: 0.878, g: 0.980, b: 0.600 }
};

var FONTS = {
  regular:   { family: 'Unbounded', style: 'Regular' },
  medium:    { family: 'Unbounded', style: 'Medium' },
  semibold:  { family: 'Unbounded', style: 'SemiBold' },
  bold:      { family: 'Unbounded', style: 'Bold' },
  extrabold: { family: 'Unbounded', style: 'ExtraBold' },
  black:     { family: 'Unbounded', style: 'Black' }
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
function mkFrame(parent, x, y, w, h, color, r) {
  var f = figma.createFrame();
  f.x = x; f.y = y; f.resize(w, h);
  if (r) f.cornerRadius = r;
  f.clipsContent = true;
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
  if (opts.lineH) t.lineHeight = { value: opts.lineH, unit: 'PIXELS' };
  if (opts.ls) t.letterSpacing = { value: opts.ls, unit: 'PERCENT' };
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
  if (opts.lineH) t.lineHeight = { value: opts.lineH, unit: 'PIXELS' };
  if (opts.ls) t.letterSpacing = { value: opts.ls, unit: 'PERCENT' };
  sf(t, color, opts.opacity);
  if (parent) parent.appendChild(t);
  return t;
}
function gradRect(parent, x, y, w, h, fromA, toA, r) {
  var el = figma.createRectangle();
  el.x = x; el.y = y; el.resize(w, h);
  if (r) el.cornerRadius = r;
  el.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [[0, 0, 0], [0, 1, 0]],
    gradientStops: [
      { position: 0, color: { r: 0.004, g: 0.004, b: 0.004, a: fromA } },
      { position: 1, color: { r: 0.004, g: 0.004, b: 0.004, a: toA } }
    ]
  }];
  if (parent) parent.appendChild(el);
  return el;
}

// ─── ГРУППИРОВКА ─────────────────────────────────────────────────────────────
function grp(name, nodes, parent) {
  var valid = nodes.filter(function(n) { return n && n.parent; });
  if (!valid.length) return null;
  var g = figma.group(valid, parent || valid[0].parent);
  g.name = name;
  return g;
}

// ─────────────────────────────────────────────────────────────────────────────
// iPhone 16 РАМКА
// ─────────────────────────────────────────────────────────────────────────────
async function drawPhone(container, px, py) {
  var bw = bodyW(), bh = bodyH();
  var nodes = [];

  var body = figma.createRectangle();
  body.x = px; body.y = py; body.resize(bw, bh);
  body.cornerRadius = PHONE.bodyR;
  body.fills = [{ type: 'SOLID', color: { r: 0.13, g: 0.13, b: 0.14 } }];
  body.strokes = [{ type: 'SOLID', color: { r: 0.30, g: 0.30, b: 0.33 } }];
  body.strokeWeight = 1.5;
  container.appendChild(body); nodes.push(body);

  var scrBg = figma.createRectangle();
  scrBg.x = px + PHONE.borderL - 1; scrBg.y = py + PHONE.borderT - 1;
  scrBg.resize(W + 2, H + 2); scrBg.cornerRadius = PHONE.screenR + 1;
  scrBg.fills = [{ type: 'SOLID', color: { r: 0.02, g: 0.02, b: 0.02 } }];
  container.appendChild(scrBg); nodes.push(scrBg);

  [[py + 130, 52], [py + 194, 52]].forEach(function(v) {
    var b = figma.createRectangle();
    b.x = px - 3.5; b.y = v[0]; b.resize(3.5, v[1]); b.cornerRadius = 2;
    b.fills = [{ type: 'SOLID', color: { r: 0.26, g: 0.26, b: 0.28 } }];
    container.appendChild(b); nodes.push(b);
  });
  var mt = figma.createRectangle();
  mt.x = px - 3.5; mt.y = py + 88; mt.resize(3.5, 36); mt.cornerRadius = 2;
  mt.fills = [{ type: 'SOLID', color: { r: 0.26, g: 0.26, b: 0.28 } }];
  container.appendChild(mt); nodes.push(mt);

  var pb = figma.createRectangle();
  pb.x = px + bw; pb.y = py + 156; pb.resize(3.5, 72); pb.cornerRadius = 2;
  pb.fills = [{ type: 'SOLID', color: { r: 0.26, g: 0.26, b: 0.28 } }];
  container.appendChild(pb); nodes.push(pb);

  grp('iphone16-body', nodes, container);

  return {
    screenX: px + PHONE.borderL,
    screenY: py + PHONE.borderT,
    diX: px + PHONE.borderL + W / 2 - PHONE.diW / 2,
    diY: py + PHONE.borderT + PHONE.diOffsetY
  };
}

function drawDynamicIsland(container, pos) {
  var di = figma.createRectangle();
  di.x = pos.diX; di.y = pos.diY;
  di.resize(PHONE.diW, PHONE.diH);
  di.cornerRadius = PHONE.diR;
  di.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  di.name = 'dynamic-island';
  container.appendChild(di);
  return di;
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BAR
// ─────────────────────────────────────────────────────────────────────────────
async function statusBar(parent, dark) {
  var clr = dark ? C.black : C.white;
  var nodes = [];

  nodes.push(await txt(parent, '9:41', SIDE, SB_Y, 80, 15, 700, clr));

  var rx = W - SIDE;
  var batW = 25, batH = 12, batX = rx - batW, batY = SB_Y + 3;
  var bat = figma.createRectangle();
  bat.x = batX; bat.y = batY; bat.resize(batW, batH); bat.cornerRadius = 3;
  bat.strokes = [{ type: 'SOLID', color: clr }]; bat.strokeWeight = 1.2; bat.fills = [];
  parent.appendChild(bat); nodes.push(bat);
  nodes.push(rect(parent, batX + 2, batY + 2, 17, batH - 4, clr, 1));
  var tip = figma.createRectangle();
  tip.x = batX + batW; tip.y = batY + 4; tip.resize(2, 4); tip.cornerRadius = 1;
  tip.fills = [{ type: 'SOLID', color: clr }];
  parent.appendChild(tip); nodes.push(tip);
  rx = batX - 8;

  for (var wi = 0; wi < 3; wi++) {
    var ws = 3 + wi * 3;
    var we = figma.createRectangle();
    we.x = rx - ws; we.y = SB_Y + (12 - ws); we.resize(ws, ws); we.cornerRadius = 1;
    sf(we, clr, wi < 2 ? 0.45 : 1);
    parent.appendChild(we); nodes.push(we);
  }
  rx = rx - 15;

  for (var si = 0; si < 4; si++) {
    var bh = 3 + si * 3;
    nodes.push(rect(parent, rx - (4 - si) * 6, SB_Y + 14 - bh, 4, bh, clr, 1, si < 2 ? 0.4 : 1));
  }

  grp('status-bar', nodes, parent);
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME INDICATOR
// ─────────────────────────────────────────────────────────────────────────────
function homeBar(parent) {
  var barW = 134, barH = 5;
  var b = rect(parent, W / 2 - barW / 2, H - 10 - barH, barW, barH, C.black, 3, 0.2);
  b.name = 'home-indicator';
  return b;
}

// ─────────────────────────────────────────────────────────────────────────────
// УТИЛИТЫ UI
// ─────────────────────────────────────────────────────────────────────────────
function progressBar(parent, total, done, y) {
  var gap = 4, segW = (CW - gap * (total - 1)) / total;
  var nodes = [];
  for (var i = 0; i < total; i++)
    nodes.push(rect(parent, SIDE + i * (segW + gap), y, segW, 3, i < done ? C.black : C.gray200, 2));
  grp('progress-bar', nodes, parent);
  return y + 3 + 14;
}

async function ctaBtn(parent, label, y, bg, fg) {
  bg = bg || C.black; fg = fg || C.white;
  var bH = 56, nodes = [];
  nodes.push(rect(parent, SIDE, y, CW, bH, bg, 28));
  nodes.push(await txtC(parent, label, SIDE, y + bH / 2, CW, 11, 700, fg, { align: 'center' }));
  grp('cta-btn', nodes, parent);
  return y + bH;
}

// ─── КНОПКИ СВАЙПА ───────────────────────────────────────────────────────────
async function swipeButtons(parent, centerY) {
  var cx = W / 2, sz = 68, nodes = [];

  var nlX = cx - sz - 48, nlY = centerY - sz / 2;
  var nl = rect(parent, nlX, nlY, sz, sz, C.redL, sz / 2);
  nl.strokes = [{ type: 'SOLID', color: { r: 0.91, g: 0.75, b: 0.75 } }]; nl.strokeWeight = 1.5;
  nodes.push(nl);
  nodes.push(await txtC(parent, '✘', nlX, nlY + sz / 2, sz, 22, 700, C.black, { align: 'center' }));
  nodes.push(await txt(parent, 'не нравится', nlX - 2, nlY + sz + 6, sz + 4, 7, 500, C.gray400, { align: 'center' }));

  var skipSz = 42, skipX = cx - skipSz / 2, skipY = centerY - skipSz / 2;
  nodes.push(rect(parent, skipX, skipY, skipSz, skipSz, C.gray100, skipSz / 2));
  nodes.push(await txtC(parent, '↺', skipX, centerY, skipSz, 15, 500, C.gray400, { align: 'center' }));

  var lkX = cx + 48, lkY = centerY - sz / 2;
  var lk = rect(parent, lkX, lkY, sz, sz, C.accentL, sz / 2);
  lk.strokes = [{ type: 'SOLID', color: C.accent }]; lk.strokeWeight = 1.5;
  nodes.push(lk);
  nodes.push(await txtC(parent, '✓', lkX, lkY + sz / 2, sz, 22, 700, C.black, { align: 'center' }));
  nodes.push(await txt(parent, 'нравится', lkX, lkY + sz + 6, sz, 7, 500, C.gray400, { align: 'center' }));

  grp('swipe-buttons', nodes, parent);
}

// ─────────────────────────────────────────────────────────────────────────────
// ДАННЫЕ
// ─────────────────────────────────────────────────────────────────────────────
var STYLES = [
  { name: 'Скандинавский', desc: 'Белый, дерево,\nнатуральные материалы', tags: ['Светло', 'Дерево', 'Уют'],
    c: ['#f5f0e8', '#e8ddd0', '#d4c4b0', '#c9b99a', '#a89070', '#6b5040'] },
  { name: 'Минимализм', desc: 'Чистые линии,\nнейтральные тона', tags: ['Лаконично', 'Чисто', 'Функц.'],
    c: ['#f8f8f8', '#e8e8e8', '#d0d0d0', '#b0b0b0', '#787878', '#2c2c2c'] },
  { name: 'Лофт', desc: 'Кирпич, металл,\nоткрытые конструкции', tags: ['Кирпич', 'Металл', 'Индустрия'],
    c: ['#c4bdb5', '#a09890', '#786050', '#584840', '#3c3028', '#1e1814'] },
  { name: 'Современный', desc: 'Актуальные формы,\nяркие акценты', tags: ['Актуально', 'Акценты', 'Тех'],
    c: ['#f0f4f8', '#c8d8e8', '#7090b0', '#3a5f80', '#1a3a58', '#c9f542'] },
  { name: 'Классика', desc: 'Симметрия, лепнина,\nблагородные мат.', tags: ['Симметрия', 'Золото', 'Роскошь'],
    c: ['#f5efe0', '#e8d5a8', '#c8a84b', '#8b7030', '#4a3a18', '#1a1208'] },
  { name: 'Эко / Бохо', desc: 'Растения,\nнатуральные текстуры', tags: ['Природа', 'Текстуры', 'Тепло'],
    c: ['#e8f0e0', '#c8d8a8', '#98b870', '#6a9048', '#3d6028', '#c4714a'] },
  { name: 'Japandi', desc: 'Японский минимализм\n+ скандинавский уют', tags: ['Ваби-саби', 'Тишина', 'Природа'],
    c: ['#f0ece4', '#ddd5c8', '#b8a88c', '#8c7860', '#5c4838', '#2c2018'] },
  { name: 'Арт-деко', desc: 'Геометрия, контраст,\nзолото и роскошь', tags: ['Геометрия', 'Контраст', 'Роскошь'],
    c: ['#2a2010', '#4a3a20', '#c8a84b', '#e8c870', '#f0d890', '#f8f0e0'] }
];

var MASTERS = [
  {
    initials: 'АС', firstName: 'Анна', lastName: 'Соколова',
    city: 'Москва', exp: '6 лет', rating: '4.9', reviews: '127 отзывов',
    match: '94', price: '4 500 ₽/м²', projects: '47',
    why: ['светлые тона', 'минимализм', 'натур. матер.', 'japandi'],
    reviewsList: [
      { av: 'КМ', name: 'Катерина М.', obj: 'квартира 68 м²', stars: '★★★★★',
        text: 'Анна поняла нас с первого раза — показала реальные проекты в нашем стиле.' },
      { av: 'ДП', name: 'Дмитрий П.', obj: 'апартаменты 55 м²', stars: '★★★★★',
        text: 'Очень детальный проект, всё продумано до мелочей.' },
      { av: 'АВ', name: 'Алина В.', obj: 'дом 110 м²', stars: '★★★★☆',
        text: 'Хороший результат, небольшие правки по срокам, качество на высоте.' }
    ],
    bg: ['#f0ece4', '#ddd5c8', '#b8a88c', '#8c7860', '#e8ddd0', '#f5f0e8'], idx: 1
  },
  {
    initials: 'МВ', firstName: 'Максим', lastName: 'Ветров',
    city: 'Санкт-Петербург', exp: '4 года', rating: '4.8', reviews: '89 отзывов',
    match: '87', price: '3 800 ₽/м²', projects: '31',
    why: ['лофт-стиль', 'тёмные тона', 'открытые планировки', 'современный'],
    reviewsList: [
      { av: 'ИС', name: 'Игорь С.', obj: 'студия 38 м²', stars: '★★★★★',
        text: 'Максим отлично чувствует лофт-стиль. Всё сделал быстро и именно так, как я хотел.' },
      { av: 'ЕА', name: 'Елена А.', obj: 'квартира 72 м²', stars: '★★★★★',
        text: 'Результат отличный, авторский надзор прошёл гладко.' },
      { av: 'РН', name: 'Роман Н.', obj: 'офис 90 м²', stars: '★★★★☆',
        text: 'Профессионал своего дела. Рекомендую всем любителям индустриального стиля.' }
    ],
    bg: ['#e8e8e8', '#d0d0d0', '#b0b0b0', '#c8d8e8', '#7090b0', '#3a5f80'], idx: 2
  },
  {
    initials: 'ЕК', firstName: 'Елена', lastName: 'Кузнецова',
    city: 'Москва', exp: '8 лет', rating: '5.0', reviews: '203 отзыва',
    match: '91', price: '5 200 ₽/м²', projects: '68',
    why: ['классика', 'симметрия', 'золото', 'благородные мат.'],
    reviewsList: [
      { av: 'МС', name: 'Мария С.', obj: 'квартира 95 м²', stars: '★★★★★',
        text: 'Елена создала именно тот классический интерьер, о котором я мечтала. Безупречно.' },
      { av: 'АГ', name: 'Андрей Г.', obj: 'загородный дом 200 м²', stars: '★★★★★',
        text: 'Профессионализм на высшем уровне. Все сроки соблюдены, качество отменное.' }
    ],
    bg: ['#f5efe0', '#e8d5a8', '#c8a84b', '#8b7030', '#4a3a18', '#f5f0e8'], idx: 3
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// ЧЕКБОКС-ГАЛОЧКА
// ─────────────────────────────────────────────────────────────────────────────
async function checkmark(parent, rowX, rowY, rowW, rowH) {
  var sz = Math.min(rowH - 16, 24);
  var chkX = rowX + rowW - 8 - sz;
  var chkY = rowY + (rowH - sz) / 2;
  var nodes = [];
  var bg = rect(parent, chkX, chkY, sz, sz, C.black, 6);
  nodes.push(bg);
  nodes.push(await txtC(parent, '✓', chkX, chkY + sz / 2, sz, Math.round(sz * 0.45), 800, C.white, { align: 'center' }));
  grp('checkmark', nodes, parent);
  return nodes;
}

// ─────────────────────────────────────────────────────────────────────────────
// UI KIT
// ─────────────────────────────────────────────────────────────────────────────
async function buildUIKit(p) {
  sf(p, C.bg);
  var x = 56, y = 56;
  await txt(p, 'REMATCH  UI KIT', x, y, 900, 28, 900, C.black, { ls: 3 });
  await txt(p, 'Unbounded · iPhone 16 · 393×852 · Dynamic Island · iOS HIG', x, y + 44, 800, 11, 400, C.gray400, { ls: 2 });
  y += 108;

  // 01 ЦВЕТА
  var colorNodes = [];
  colorNodes.push(await txt(p, '01  ЦВЕТА', x, y, 400, 10, 700, C.gray400, { ls: 5 }));
  y += 30;
  var tokens = [
    { n: 'Black', c: C.black, h: '#010101' }, { n: 'White', c: C.white, h: '#ffffff' },
    { n: 'Accent', c: C.accent, h: '#c9f542' }, { n: 'Accent L', c: C.accentL, h: '#e0faa0' },
    { n: 'Red L', c: C.redL, h: '#ffe0e0' }, { n: 'BG', c: C.bg, h: '#f2eeea' },
    { n: 'Gray 100', c: C.gray100, h: '#f7f6f3' }, { n: 'Gray 200', c: C.gray200, h: '#e0dbe6' },
    { n: 'Gray 400', c: C.gray400, h: '#6b6b6e' }, { n: 'Gray 600', c: C.gray600, h: '#3b3b3e' }
  ];
  for (var ci = 0; ci < tokens.length; ci++) {
    var swX = x + ci * 132;
    var sw = rect(p, swX, y, 108, 108, tokens[ci].c, 16);
    if (tokens[ci].n === 'White') { sw.strokes = [{ type: 'SOLID', color: C.gray200 }]; sw.strokeWeight = 1; }
    colorNodes.push(sw);
    colorNodes.push(await txt(p, tokens[ci].n, swX, y + 114, 108, 9, 600, C.gray600, { align: 'center' }));
    colorNodes.push(await txt(p, tokens[ci].h, swX, y + 128, 108, 8, 400, C.gray400, { align: 'center' }));
  }
  grp('01-colors', colorNodes, p);
  y += 178;

  // 02 ТИПОГРАФИКА
  var typoNodes = [];
  typoNodes.push(await txt(p, '02  ТИПОГРАФИКА — UNBOUNDED', x, y, 900, 10, 700, C.gray400, { ls: 5 }));
  y += 30;
  var typeRows = [
    { label: 'Black / 900', str: 'Найди своего дизайнера', sz: 24, w: 900 },
    { label: 'ExtraBold / 800', str: 'Заголовок раздела', sz: 18, w: 800 },
    { label: 'Bold / 700', str: 'Кнопка · CTA · Акцент', sz: 14, w: 700 },
    { label: 'SemiBold / 600', str: 'Подзаголовок · Лейбл', sz: 12, w: 600 },
    { label: 'Medium / 500', str: 'Тело текста средний', sz: 11, w: 500 },
    { label: 'Regular / 400', str: 'Подпись · Второстепенный', sz: 10, w: 400 }
  ];
  for (var ti = 0; ti < typeRows.length; ti++) {
    var tr = typeRows[ti];
    typoNodes.push(await txt(p, tr.label, x, y + 4, 240, 8, 400, C.gray400));
    typoNodes.push(await txt(p, tr.str, x + 250, y, 900, tr.sz, tr.w, C.black));
    y += tr.sz + 28;
  }
  grp('02-typography', typoNodes, p);
  y += 16;

  // 03 КНОПКИ
  var btnNodes = [];
  btnNodes.push(await txt(p, '03  КНОПКИ', x, y, 400, 10, 700, C.gray400, { ls: 5 }));
  y += 30;
  var b1 = rect(p, x, y, 260, 56, C.black, 28); btnNodes.push(b1);
  btnNodes.push(await txtC(p, 'Начать — это бесплатно', x, y + 28, 260, 11, 700, C.white, { align: 'center' }));
  btnNodes.push(await txt(p, 'Primary', x, y + 64, 260, 8, 400, C.gray400, { align: 'center' }));
  var b2 = rect(p, x + 280, y, 240, 56, C.accent, 28); btnNodes.push(b2);
  btnNodes.push(await txtC(p, 'Показать мастеров →', x + 280, y + 28, 240, 11, 700, C.black, { align: 'center' }));
  btnNodes.push(await txt(p, 'Accent', x + 280, y + 64, 240, 8, 400, C.gray400, { align: 'center' }));
  var b3 = rect(p, x + 544, y, 200, 56, C.white, 28);
  b3.strokes = [{ type: 'SOLID', color: C.black }]; b3.strokeWeight = 1.5; btnNodes.push(b3);
  btnNodes.push(await txtC(p, 'Войти', x + 544, y + 28, 200, 11, 700, C.black, { align: 'center' }));
  btnNodes.push(await txt(p, 'Outline', x + 544, y + 64, 200, 8, 400, C.gray400, { align: 'center' }));
  var b4 = rect(p, x + 768, y, 200, 56, C.gray100, 28); btnNodes.push(b4);
  btnNodes.push(await txtC(p, 'Пропустить', x + 768, y + 28, 200, 11, 500, C.gray600, { align: 'center' }));
  btnNodes.push(await txt(p, 'Ghost', x + 768, y + 64, 200, 8, 400, C.gray400, { align: 'center' }));
  var b5 = rect(p, x + 992, y, 56, 56, C.white, 28);
  b5.strokes = [{ type: 'SOLID', color: C.gray200 }]; b5.strokeWeight = 1.5; btnNodes.push(b5);
  btnNodes.push(await txtC(p, '↗', x + 992, y + 28, 56, 20, 500, C.black, { align: 'center' }));
  btnNodes.push(await txt(p, 'Icon', x + 992, y + 64, 56, 8, 400, C.gray400, { align: 'center' }));
  grp('03-buttons', btnNodes, p);
  y += 108;

  // 04 КНОПКИ СВАЙПА
  var swipeNodes = [];
  swipeNodes.push(await txt(p, '04  КНОПКИ СВАЙПА', x, y, 400, 10, 700, C.gray400, { ls: 5 }));
  y += 30;
  var nl2 = rect(p, x, y, 68, 68, C.redL, 34);
  nl2.strokes = [{ type: 'SOLID', color: { r: 0.91, g: 0.75, b: 0.75 } }]; nl2.strokeWeight = 1.5;
  swipeNodes.push(nl2);
  swipeNodes.push(await txtC(p, '✘', x, y + 34, 68, 24, 700, C.black, { align: 'center' }));
  swipeNodes.push(await txt(p, 'не нравится', x - 4, y + 76, 76, 8, 500, C.gray400, { align: 'center' }));
  var skipBtn = rect(p, x + 96, y + 14, 40, 40, C.gray100, 20); swipeNodes.push(skipBtn);
  swipeNodes.push(await txtC(p, '↺', x + 96, y + 34, 40, 16, 500, C.gray400, { align: 'center' }));
  swipeNodes.push(await txt(p, 'пропустить', x + 88, y + 62, 56, 8, 500, C.gray400, { align: 'center' }));
  var lk2 = rect(p, x + 160, y, 68, 68, C.accentL, 34);
  lk2.strokes = [{ type: 'SOLID', color: C.accent }]; lk2.strokeWeight = 1.5; swipeNodes.push(lk2);
  swipeNodes.push(await txtC(p, '✓', x + 160, y + 34, 68, 24, 700, C.black, { align: 'center' }));
  swipeNodes.push(await txt(p, 'нравится', x + 160, y + 76, 68, 8, 500, C.gray400, { align: 'center' }));
  grp('04-swipe-buttons', swipeNodes, p);
  y += 120;

  // 05 ТЕГИ
  var tagNodes = [];
  tagNodes.push(await txt(p, '05  ТЕГИ / ЧИПЫ', x, y, 400, 10, 700, C.gray400, { ls: 5 }));
  y += 30;
  var chips = [
    { l: 'светлые тона', sel: true }, { l: 'минимализм', sel: true },
    { l: 'лофт', sel: false }, { l: 'натур. матер.', sel: false },
    { l: 'эко', sel: false }, { l: 'рабочая зона', sel: false }
  ];
  var cx2 = x;
  for (var chi = 0; chi < chips.length; chi++) {
    var cw = chips[chi].l.length * 7 + 24;
    var ce = rect(p, cx2, y, cw, 32, chips[chi].sel ? C.black : C.white, 16);
    ce.strokes = [{ type: 'SOLID', color: chips[chi].sel ? C.black : C.gray200 }]; ce.strokeWeight = 1.5;
    tagNodes.push(ce);
    tagNodes.push(await txtC(p, chips[chi].l, cx2, y + 16, cw, 9, chips[chi].sel ? 600 : 500, chips[chi].sel ? C.white : C.black, { align: 'center' }));
    cx2 += cw + 10;
  }
  grp('05-tags', tagNodes, p);
  y += 64;

  // 06 БЕЙДЖИ
  var badgeNodes = [];
  badgeNodes.push(await txt(p, '06  БЕЙДЖИ', x, y, 400, 10, 700, C.gray400, { ls: 5 }));
  y += 30;
  var ba1 = rect(p, x, y, 148, 30, C.accent, 15); badgeNodes.push(ba1);
  badgeNodes.push(await txtC(p, '94% совпадение', x, y + 15, 148, 9, 700, C.black, { align: 'center' }));
  var ba2 = rect(p, x + 168, y, 128, 30, C.accentL, 8);
  ba2.strokes = [{ type: 'SOLID', color: C.accent }]; ba2.strokeWeight = 1; badgeNodes.push(ba2);
  badgeNodes.push(await txtC(p, '✓  НРАВИТСЯ', x + 168, y + 15, 128, 9, 700, C.black, { align: 'center' }));
  var ba3 = rect(p, x + 316, y, 128, 30, C.redL, 8);
  ba3.strokes = [{ type: 'SOLID', color: { r: 0.91, g: 0.75, b: 0.75 } }]; ba3.strokeWeight = 1; badgeNodes.push(ba3);
  badgeNodes.push(await txtC(p, '✘  НЕ НРАВИТСЯ', x + 316, y + 15, 128, 9, 700, C.black, { align: 'center' }));
  var ba4 = rect(p, x + 464, y, 196, 30, C.white, 15);
  ba4.strokes = [{ type: 'SOLID', color: C.gray200 }]; ba4.strokeWeight = 1; badgeNodes.push(ba4);
  badgeNodes.push(await txtC(p, '📍 Москва · онлайн', x + 464, y + 15, 196, 8, 500, C.gray600, { align: 'center' }));
  grp('06-badges', badgeNodes, p);
  y += 72;

  // 07 СТАТУС-БАР
  var sbKitNodes = [];
  sbKitNodes.push(await txt(p, '07  СТАТУС-БАР + DYNAMIC ISLAND', x, y, 700, 10, 700, C.gray400, { ls: 5 }));
  y += 30;
  var sbF1 = mkFrame(p, x, y, W, SB_H + 4, C.black, 10);
  var diD1 = figma.createRectangle();
  diD1.x = W / 2 - PHONE.diW / 2; diD1.y = PHONE.diOffsetY;
  diD1.resize(PHONE.diW, PHONE.diH); diD1.cornerRadius = PHONE.diR;
  diD1.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  sbF1.appendChild(diD1); await statusBar(sbF1, false); sbKitNodes.push(sbF1);
  var sbF2 = mkFrame(p, x + W + 24, y, W, SB_H + 4, C.white, 10);
  sbF2.strokes = [{ type: 'SOLID', color: C.gray200 }]; sbF2.strokeWeight = 1;
  var diD2 = figma.createRectangle();
  diD2.x = W / 2 - PHONE.diW / 2; diD2.y = PHONE.diOffsetY;
  diD2.resize(PHONE.diW, PHONE.diH); diD2.cornerRadius = PHONE.diR;
  diD2.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  sbF2.appendChild(diD2); await statusBar(sbF2, true); sbKitNodes.push(sbF2);
  sbKitNodes.push(await txt(p, 'На тёмном', x, y + SB_H + 12, W, 8, 400, C.gray400, { align: 'center' }));
  sbKitNodes.push(await txt(p, 'На светлом', x + W + 24, y + SB_H + 12, W, 8, 400, C.gray400, { align: 'center' }));
  grp('07-statusbar', sbKitNodes, p);
  y += SB_H + 52;

  // 08 HOME INDICATOR
  var hiNodes = [];
  hiNodes.push(await txt(p, '08  HOME INDICATOR', x, y, 400, 10, 700, C.gray400, { ls: 5 }));
  y += 30;
  var hiD = figma.createRectangle();
  hiD.x = x; hiD.y = y; hiD.resize(134, 5); hiD.cornerRadius = 3;
  hiD.fills = [{ type: 'SOLID', color: C.black, opacity: 0.2 }];
  p.appendChild(hiD); hiNodes.push(hiD);
  hiNodes.push(await txt(p, '134×5 · opacity 20% · bottom: 10px', x, y + 13, 400, 8, 400, C.gray400));
  grp('08-home-indicator', hiNodes, p);
  y += 52;

  // 09 ПРОГРЕСС
  var pbNodes = [];
  pbNodes.push(await txt(p, '09  ПРОГРЕСС-БАР', x, y, 400, 10, 700, C.gray400, { ls: 5 }));
  y += 30;
  var pbF = mkFrame(p, x, y, W, 20, C.white, 4);
  progressBar(pbF, 5, 3, 8);
  pbNodes.push(pbF);
  pbNodes.push(await txt(p, '3 из 5 шагов', x, y + 28, W, 8, 400, C.gray400, { align: 'center' }));
  grp('09-progressbar', pbNodes, p);
  y += 68;

  // 10 КАРТОЧКА МАСТЕРА
  var cardKitNodes = [];
  cardKitNodes.push(await txt(p, '10  КАРТОЧКА МАСТЕРА', x, y, 600, 10, 700, C.gray400, { ls: 5 }));
  y += 30;
  var mCW = 340, mCH = 460;
  var mCard = mkFrame(p, x, y, mCW, mCH, C.white, 22);
  mCard.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.09 }, offset: { x: 0, y: 4 }, radius: 20, spread: 0, visible: true, blendMode: 'NORMAL' }];
  var mClrs = ['#f0ece4', '#ddd5c8', '#b8a88c'];
  var mBw = (mCW - 12) / 3;
  for (var mc = 0; mc < 3; mc++) rect(mCard, 4 + mc * (mBw + 4), 4, mBw, 180, hex2rgb(mClrs[mc]), 14);
  gradRect(mCard, 0, 150, mCW, 60, 0, 0.65);
  rect(mCard, 14, 14, 132, 28, C.accent, 14);
  await txtC(mCard, '94% совпадение', 14, 28, 132, 8, 700, C.black, { align: 'center' });
  rect(mCard, 16, 210, 44, 44, C.black, 22);
  await txtC(mCard, 'АС', 16, 232, 44, 12, 800, C.accent, { align: 'center' });
  await txt(mCard, 'Анна Соколова', 70, 212, mCW - 86, 12, 800, C.black);
  await txt(mCard, 'Москва · 6 лет', 70, 230, mCW - 86, 9, 400, C.gray400);
  await txt(mCard, '★ 4.9  127 отзывов', 70, 244, mCW - 86, 8, 500, C.black);
  rect(mCard, 16, 276, mCW - 32, 1, C.gray200);
  await txt(mCard, '4 500 ₽/м²', 16, 288, (mCW - 32) / 2, 12, 800, C.black);
  await txt(mCard, '47 проектов', mCW / 2, 288, (mCW - 32) / 2, 10, 600, C.gray400, { align: 'right' });
  await txt(mCard, 'стоимость/м²', 16, 305, (mCW - 32) / 2, 7, 400, C.gray400);
  cardKitNodes.push(mCard);
  grp('10-master-card', cardKitNodes, p);
  y += mCH + 52;

  // 11 СТИЛЬ-КАРТОЧКИ
  var styleKitNodes = [];
  styleKitNodes.push(await txt(p, '11  СТИЛЬ-КАРТОЧКИ', x, y, 700, 10, 700, C.gray400, { ls: 5 }));
  y += 30;
  var scW = 210, scH = 160;
  var styleColors4 = [
    ['#f5f0e8', '#e8ddd0', '#d4c4b0', '#c9b99a', '#a89070', '#6b5040'],
    ['#f8f8f8', '#e8e8e8', '#d0d0d0', '#b0b0b0', '#787878', '#2c2c2c'],
    ['#c4bdb5', '#a09890', '#786050', '#584840', '#3c3028', '#1e1814'],
    ['#f0f4f8', '#c8d8e8', '#7090b0', '#3a5f80', '#1a3a58', '#c9f542']
  ];
  var styleNames4 = ['Скандинавский', 'Минимализм', 'Лофт', 'Современный'];
  for (var si3 = 0; si3 < 4; si3++) {
    var scX2 = x + si3 * (scW + 16);
    var sc4 = mkFrame(p, scX2, y, scW, scH, hex2rgb(styleColors4[si3][0]), 14);
    var sbw2 = (scW - 9) / 3, sbh2 = (scH - 9) / 2;
    for (var sr2 = 0; sr2 < 2; sr2++)
      for (var sc5 = 0; sc5 < 3; sc5++)
        rect(sc4, 3 + sc5 * (sbw2 + 3), 3 + sr2 * (sbh2 + 3), sbw2, sbh2,
          hex2rgb(styleColors4[si3][Math.min(sr2 * 3 + sc5, 5)]), 8);
    gradRect(sc4, 0, scH - 64, scW, 64, 0, 0.85);
    await txt(sc4, styleNames4[si3], 10, scH - 34, scW - 20, 10, 800, C.white);
    styleKitNodes.push(sc4);
    styleKitNodes.push(await txt(p, styleNames4[si3], scX2, y + scH + 8, scW, 8, 400, C.gray400, { align: 'center' }));
  }
  grp('11-style-cards', styleKitNodes, p);
}

// ─────────────────────────────────────────────────────────────────────────────
// SPLASH
// ─────────────────────────────────────────────────────────────────────────────
async function buildSplash(p) {
  sf(p, C.cream);

  // ── Декоративные блоки (правый верхний угол) ─────────────────────────────
  // Было: один прямоугольник C.cream (фактически белый/кремовый — не виден)
  // Исправлено: заменён на C.gray200 (лавандово-серый), хорошо виден на фоне
  var dTop = SB_H + 4;
  var decoNodes = [];
  decoNodes.push(rect(p, 234, dTop,      80, 80, C.accent,  16));         // зелёный
  decoNodes.push(rect(p, 322, dTop,      58, 58, C.black,   14));         // чёрный
  decoNodes.push(rect(p, 234, dTop + 90, 58, 42, C.gray200, 10));         // серый
  // БЫЛ C.cream (почти белый на кремовом фоне) → теперь C.gray400 (тёмно-серый)
  decoNodes.push(rect(p, 298, dTop + 68, 82, 34, C.gray400, 10, 0.55));  // серый акцент
  grp('deco', decoNodes, p);

  await statusBar(p, true);

  var y = SB_H + 48;
  var logoNodes = [];
  logoNodes.push(rect(p, SIDE, y, 48, 48, C.black, 14));
  logoNodes.push(await txtC(p, 'R', SIDE, y + 24, 48, 17, 900, C.accent, { align: 'center' }));
  logoNodes.push(await txt(p, 'REMATCH', SIDE + 58, y + 17, 220, 14, 800, C.black, { ls: 4 }));
  grp('logo', logoNodes, p);
  y += 48 + 64;

  var heroNodes = [];
  heroNodes.push(await txt(p, 'Найди своего\nдизайнера\nза 2 минуты', SIDE, y, CW, 26, 900, C.black, { lineH: 44 }));
  y += 44 * 3 + 12;
  heroNodes.push(rect(p, SIDE, y, 64, 4, C.accent, 2));
  y += 4 + 28;
  heroNodes.push(await txt(p, 'Покажи интерьеры которые нравятся —\nмы подберём дизайнеров с похожими\nреализованными проектами', SIDE, y, CW, 10, 400, C.gray400, { lineH: 18 }));
  grp('hero-text', heroNodes, p);

  var ctaNodes = [];
  ctaNodes.push(rect(p, SIDE, ctaTopY(), CW, 56, C.black, 28));
  ctaNodes.push(await txtC(p, 'Начать — это бесплатно', SIDE, ctaTopY() + 28, CW, 11, 700, C.white, { align: 'center' }));
  ctaNodes.push(await txt(p, 'Уже есть аккаунт? Войти', SIDE, ctaTopY() + 64, CW, 10, 400, C.gray400, { align: 'center' }));
  grp('cta', ctaNodes, p);

  homeBar(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// СВАЙП СТИЛЯ
// buildStyleSwipe — карточка с цветными блоками
// Исправления:
//   1. Карточка уменьшена на 10px снизу (cardReduceBottom = 10)
//   2. Подложка под названием/описанием — белая полупрозрачная, внизу карточки
// ─────────────────────────────────────────────────────────────────────────────
async function buildStyleSwipe(p, idx, state) {
  state = state || 'neutral';
  var st = STYLES[idx];
  sf(p, C.white);
  await statusBar(p, true);

  var y = SB_H + 12;

  // ── Шапка ──────────────────────────────────────────────────────────────────
  var headerNodes = [];
  headerNodes.push(await txt(p, (idx + 1) + ' / ' + STYLES.length, 0, y, W, 8, 600, C.gray400, { align: 'center', ls: 3 }));
  y += 8 + 12;
  headerNodes.push(await txt(p, 'Нравится этот стиль?', SIDE, y, CW, 14, 800, C.black, { lineH: 22 }));
  y += 22 + 10;
  grp('header', headerNodes, p);

  var sCY = swipeCY();       // 764
  var btnTop  = sCY - 34;   // 730
  var cardEnd = btnTop - 14; // 716

  var tagsH = 26 + 10;
  var cardY = y;

  var cardReduceBottom = 10;
  var cH = cardEnd - tagsH - cardY - cardReduceBottom;
  if (cH < 80) cH = 80;

  var cW = CW;

  // ── Карточка ───────────────────────────────────────────────────────────────
  var card = mkFrame(p, SIDE, cardY, cW, cH, hex2rgb(st.c[0]), 22);

  var cols = 3, rows = 2, g = 3;
  var bW2 = (cW - g * (cols + 1)) / cols;
  var bH2 = (cH - g * (rows + 1)) / rows;

  // Цветные плитки
  var tileNodes = [];
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      tileNodes.push(
        rect(card, g + c * (bW2 + g), g + r * (bH2 + g), bW2, bH2,
          hex2rgb(st.c[Math.min(r * cols + c, st.c.length - 1)]), 12)
      );
    }
  }
  grp('color-tiles', tileNodes, card);

  // ── Подложка с названием/описанием ─────────────────────────────────────────
  // Нижний край плиток нижнего ряда:
  // tileBottom = g + bH2 + g + bH2 + g = g*3 + bH2*2
  var tileBottom = g * 3 + bH2 * 2;

  // Текст: название ~18px + описание ~2 строки*13px = ~44px + отступы
  var labelPadV = 10; // вертикальный паддинг внутри подложки
  var nameH    = 18;
  var descH    = 26;  // 2 строки × 13px
  var labelBgH = labelPadV + nameH + 6 + descH + labelPadV; // ≈ 72px

  // Верх подложки = низ плиток + 8px (минимальный отступ)
  var labelBgY = tileBottom + 8;

  // Если подложка не влезает — поджимаем от низа карточки с отступом 4px
  if (labelBgY + labelBgH > cH - 4) {
    labelBgY = cH - labelBgH - 4;
  }

  var labelBgNodes = [];
  var overlay = figma.createRectangle();
  overlay.x = 4;
  overlay.y = labelBgY;
  overlay.resize(cW - 8, labelBgH);
  overlay.cornerRadius = 14; // скруглённые углы
  overlay.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.88 }];
  card.appendChild(overlay);
  labelBgNodes.push(overlay);

  var textX = 14;
  var nameT = await txt(
    card, st.name,
    textX, labelBgY + labelPadV,
    cW - 28, 13, 800, C.black, { lineH: 18 }
  );
  labelBgNodes.push(nameT);

  var descT = await txt(
    card, st.desc,
    textX, labelBgY + labelPadV + nameH + 6,
    cW - 28, 8, 400, C.gray400, { lineH: 13 }
  );
  labelBgNodes.push(descT);

  grp('style-label', labelBgNodes, card);

  // ── Бейдж состояния ────────────────────────────────────────────────────────
  if (state === 'like') {
    var likeNodes = [];
    var lb = rect(card, cW - 134, 12, 120, 28, C.accentL, 8);
    lb.strokes = [{ type: 'SOLID', color: C.accent }]; lb.strokeWeight = 1;
    likeNodes.push(lb);
    likeNodes.push(await txtC(card, '✓  НРАВИТСЯ', cW - 134, 26, 120, 9, 700, C.black, { align: 'center' }));
    grp('badge-like', likeNodes, card);
  } else if (state === 'nope') {
    var nopeNodes = [];
    var nb = rect(card, 14, 12, 128, 28, C.redL, 8);
    nb.strokes = [{ type: 'SOLID', color: { r: 0.91, g: 0.75, b: 0.75 } }]; nb.strokeWeight = 1;
    nopeNodes.push(nb);
    nopeNodes.push(await txtC(card, '✘  НЕ НРАВИТСЯ', 14, 26, 128, 9, 700, C.black, { align: 'center' }));
    grp('badge-nope', nopeNodes, card);
  }

  // ── Теги ───────────────────────────────────────────────────────────────────
  var tagsY = cardY + cH + 10;
  var tagRowNodes = [];
  var tgX2 = SIDE;
  for (var ti2 = 0; ti2 < st.tags.length; ti2++) {
    var tgW = st.tags[ti2].length * 7 + 24;
    var tg = rect(p, tgX2, tagsY, tgW, 26, C.white, 13);
    tg.strokes = [{ type: 'SOLID', color: C.gray200 }]; tg.strokeWeight = 1;
    tagRowNodes.push(tg);
    tagRowNodes.push(await txtC(p, st.tags[ti2], tgX2, tagsY + 13, tgW, 9, 500, C.gray400, { align: 'center' }));
    tgX2 += tgW + 8;
  }
  grp('style-tags', tagRowNodes, p);

  await swipeButtons(p, sCY);
  homeBar(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// ПОВЕДЕНИЕ
// ─────────────────────────────────────────────────────────────────────────────
async function buildBehavior(p) {
  sf(p, C.white);
  await statusBar(p, true);
  var y = SB_H + 8;
  y = progressBar(p, 5, 1, y); y += 16;

  var headerNodes = [];
  headerNodes.push(await txt(p, 'ШАГ 1 ИЗ 5', SIDE, y, CW, 8, 600, C.gray400, { ls: 4 })); y += 8 + 14;
  headerNodes.push(await txt(p, 'Как вы принимаете\nрешения?', SIDE, y, CW, 15, 800, C.black, { lineH: 24 })); y += 48 + 12;
  headerNodes.push(await txt(p, 'Выберите одно — то, что ближе', SIDE, y, CW, 9, 400, C.gray400)); y += 9 + 18;
  grp('header', headerNodes, p);

  var items = [
    { icon: '🖼', txt: 'Хожу по шоурумам' },
    { icon: '📱', txt: 'Pinterest / Instagram' },
    { icon: '💬', txt: 'Советуюсь с другими' },
    { icon: '🔍', txt: 'Долго сравниваю' },
    { icon: '⚡', txt: 'Решаю по ощущению' }
  ];
  var rowH = 56;
  var allRowNodes = [];
  for (var i = 0; i < items.length; i++) {
    var sel = i === 1;
    var rowNodes = [];
    var row = rect(p, SIDE, y, CW, rowH, sel ? C.gray100 : C.white, 14);
    row.strokes = [{ type: 'SOLID', color: sel ? C.black : C.gray200 }]; row.strokeWeight = 1.5;
    rowNodes.push(row);
    rowNodes.push(await txtC(p, items[i].icon, SIDE + 14, y + rowH / 2, 26, 18, 400, C.black, { align: 'center' }));
    rowNodes.push(await txtC(p, items[i].txt, SIDE + 50, y + rowH / 2, CW - 78, 11, 500, C.black));
    if (sel) {
      var chkNodes = await checkmark(p, SIDE, y, CW, rowH);
      rowNodes = rowNodes.concat(chkNodes);
    }
    grp('row-' + i, rowNodes, p);
    allRowNodes.push(grp('row-' + i, [], p) || rowNodes); // собираем для внешней группы
    y += rowH + 8;
  }

  var ctaN = [];
  ctaN.push(rect(p, SIDE, ctaTopY(), CW, 56, C.black, 28));
  ctaN.push(await txtC(p, 'Далее →', SIDE, ctaTopY() + 28, CW, 11, 700, C.white, { align: 'center' }));
  grp('cta', ctaN, p);
  homeBar(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// БЮДЖЕТ
// ─────────────────────────────────────────────────────────────────────────────
async function buildBudget(p) {
  sf(p, C.white);
  await statusBar(p, true);
  var y = SB_H + 8;
  y = progressBar(p, 5, 2, y); y += 16;

  var headerNodes = [];
  headerNodes.push(await txt(p, 'ШАГ 2 ИЗ 5', SIDE, y, CW, 8, 600, C.gray400, { ls: 4 })); y += 8 + 14;
  headerNodes.push(await txt(p, 'Бюджет на дизайн-проект', SIDE, y, CW, 15, 800, C.black, { lineH: 24 })); y += 24 + 12;
  headerNodes.push(await txt(p, 'Поможет подобрать мастера нужного уровня', SIDE, y, CW, 9, 400, C.gray400)); y += 9 + 18;
  grp('header', headerNodes, p);

  var list = [
    { p: 'до 80 000 ₽', d: 'Планировка и спецификации' },
    { p: '80 000 – 150 000 ₽', d: 'Полный проект, 3D' },
    { p: '150 000 – 300 000 ₽', d: 'Проект с авторским надзором' },
    { p: '300 000 – 600 000 ₽', d: 'Комплексный под ключ' },
    { p: 'от 600 000 ₽', d: 'Премиум, эксклюзив' },
    { p: 'Пока не знаю', d: 'Расскажем о вариантах' }
  ];
  var rowH = 58;
  for (var i = 0; i < list.length; i++) {
    var sel = i === 2;
    var rowNodes = [];
    var row = rect(p, SIDE, y, CW, rowH, sel ? C.gray100 : C.white, 14);
    row.strokes = [{ type: 'SOLID', color: sel ? C.black : C.gray200 }]; row.strokeWeight = 1.5;
    rowNodes.push(row);
    rowNodes.push(await txt(p, list[i].p, SIDE + 16, y + 12, CW - 60, 11, 700, C.black));
    rowNodes.push(await txt(p, list[i].d, SIDE + 16, y + 30, CW - 60, 9, 400, C.gray400));
    if (sel) {
      var chkNodes = await checkmark(p, SIDE, y, CW, rowH);
      rowNodes = rowNodes.concat(chkNodes);
    }
    grp('budget-row-' + i, rowNodes, p);
    y += rowH + 8;
  }
  homeBar(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// ПЛОЩАДЬ
// ─────────────────────────────────────────────────────────────────────────────
async function buildArea(p) {
  sf(p, C.white);
  await statusBar(p, true);
  var y = SB_H + 8;
  y = progressBar(p, 5, 3, y); y += 16;

  var headerNodes = [];
  headerNodes.push(await txt(p, 'ШАГ 3 ИЗ 5', SIDE, y, CW, 8, 600, C.gray400, { ls: 4 })); y += 8 + 14;
  headerNodes.push(await txt(p, 'Площадь квартиры', SIDE, y, CW, 15, 800, C.black, { lineH: 24 })); y += 24 + 12;
  headerNodes.push(await txt(p, 'Примерно — для подбора специализации', SIDE, y, CW, 9, 400, C.gray400)); y += 9 + 24;
  grp('header', headerNodes, p);

  var areas = [
    { n: 'до 35 м²', l: 'студия' }, { n: '35–55 м²', l: '1–2 комн.' },
    { n: '55–80 м²', l: '2–3 комн.' }, { n: 'от 80 м²', l: 'большая' }
  ];
  var cellW = (CW - 12) / 2, cellH = 110;
  var allCellNodes = [];
  for (var i = 0; i < 4; i++) {
    var col = i % 2, rowN = Math.floor(i / 2);
    var cx2 = SIDE + col * (cellW + 12), cy2 = y + rowN * (cellH + 12);
    var sel = i === 1;
    var cellNodes = [];
    var cell = rect(p, cx2, cy2, cellW, cellH, sel ? C.gray100 : C.white, 16);
    cell.strokes = [{ type: 'SOLID', color: sel ? C.black : C.gray200 }]; cell.strokeWeight = 1.5;
    cellNodes.push(cell);
    cellNodes.push(await txtC(p, areas[i].n, cx2 + 8, cy2 + cellH / 2 - 8, cellW - 16, 14, 800, C.black, { align: 'center' }));
    cellNodes.push(await txtC(p, areas[i].l, cx2 + 8, cy2 + cellH / 2 + 12, cellW - 16, 9, 500, C.gray400, { align: 'center' }));
    if (sel) {
      var chkSz = 22;
      var chkX = cx2 + cellW - 8 - chkSz;
      var chkY2 = cy2 + 8;
      var chkBg = rect(p, chkX, chkY2, chkSz, chkSz, C.black, 6);
      cellNodes.push(chkBg);
      cellNodes.push(await txtC(p, '✓', chkX, chkY2 + chkSz / 2, chkSz, 10, 800, C.white, { align: 'center' }));
    }
    grp('area-cell-' + i, cellNodes, p);
  }
  homeBar(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// КРИТЕРИИ
// ─────────────────────────────────────────────────────────────────────────────
async function buildFeatures(p) {
  sf(p, C.white);
  await statusBar(p, true);
  var y = SB_H + 8;
  y = progressBar(p, 5, 4, y); y += 16;

  var headerNodes = [];
  headerNodes.push(await txt(p, 'ШАГ 4 ИЗ 5', SIDE, y, CW, 8, 600, C.gray400, { ls: 4 })); y += 8 + 14;
  headerNodes.push(await txt(p, 'Что важно в интерьере?', SIDE, y, CW, 15, 800, C.black, { lineH: 24 })); y += 24 + 12;
  headerNodes.push(await txt(p, 'Выберите всё, что важно для вас', SIDE, y, CW, 9, 400, C.gray400)); y += 9 + 16;
  grp('header', headerNodes, p);

  var tags = [
    { t: 'хранение', s: true }, { t: 'свет', s: false }, { t: 'эргономика', s: true },
    { t: 'эко', s: false }, { t: 'цветовые акценты', s: true }, { t: 'простор', s: false },
    { t: 'уют', s: true }, { t: 'минимализм', s: false }, { t: 'рабочая зона', s: true },
    { t: 'детская', s: false }, { t: 'текстиль', s: false }, { t: 'высокие потолки', s: false },
    { t: 'открытая кухня', s: false }, { t: 'гардеробная', s: true }, { t: 'тёмные тона', s: false },
    { t: 'светлые тона', s: true }, { t: 'панорамные окна', s: false }, { t: 'умный дом', s: false },
    { t: 'барная стойка', s: false }, { t: 'зонирование', s: true }, { t: 'арт-объекты', s: false },
    { t: 'мягкие формы', s: false }, { t: 'геометрия', s: false }, { t: 'природные мат.', s: true }
  ];
  var rx = SIDE, ry = y;
  var tagNodes = [];
  for (var i = 0; i < tags.length; i++) {
    var tw = tags[i].t.length * 6.5 + 22;
    if (rx + tw > SIDE + CW) { rx = SIDE; ry += 38; }
    var te = rect(p, rx, ry, tw, 30, tags[i].s ? C.black : C.white, 15);
    te.strokes = [{ type: 'SOLID', color: tags[i].s ? C.black : C.gray200 }]; te.strokeWeight = 1.5;
    tagNodes.push(te);
    tagNodes.push(await txtC(p, tags[i].t, rx, ry + 15, tw, 8, tags[i].s ? 600 : 500, tags[i].s ? C.white : C.black, { align: 'center' }));
    rx += tw + 7;
  }
  grp('tags-grid', tagNodes, p);

  var ctaN = [];
  ctaN.push(rect(p, SIDE, ctaTopY(), CW, 56, C.accent, 28));
  ctaN.push(await txtC(p, 'Показать мастеров →', SIDE, ctaTopY() + 28, CW, 11, 700, C.black, { align: 'center' }));
  grp('cta', ctaN, p);
  homeBar(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// КАРТОЧКА МАСТЕРА (свайп)
// ─────────────────────────────────────────────────────────────────────────────
async function buildResult(p, mi) {
  var m = MASTERS[mi];
  sf(p, C.white);
  await statusBar(p, true);
  var y = SB_H + 14;

  var counterNodes = [];
  counterNodes.push(await txt(p, 'СОВПАДЕНИЯ', SIDE, y, 140, 8, 600, C.gray400, { ls: 4 }));
  var total = MASTERS.length;
  for (var di = 0; di < total; di++)
    counterNodes.push(rect(p, W - SIDE - (total - di) * 18, y, 12, 12, di < m.idx ? C.accent : C.gray200, 6));
  grp('counter', counterNodes, p);
  y += 12 + 14;

  var sCY = swipeCY();
  var btnTop  = sCY - 34;
  var cardEnd = btnTop - 14;
  var cH = cardEnd - y;
  var cW = CW;
  if (cH < 120) cH = 120;

  var card = mkFrame(p, SIDE, y, cW, cH, C.white, 22);
  card.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.08 }, offset: { x: 0, y: 4 }, radius: 24, spread: 0, visible: true, blendMode: 'NORMAL' }];

  var mH = Math.round(cH * 0.40);
  var cols = 3, g = 3, bW3 = (cW - g * (cols + 1)) / cols;
  var topTilesNodes = [];
  for (var ci = 0; ci < cols; ci++)
    topTilesNodes.push(rect(card, g + ci * (bW3 + g), g, bW3, mH - g, hex2rgb(m.bg[ci]), 14));
  grp('top-tiles', topTilesNodes, card);

  gradRect(card, 0, mH - 60, cW, 80, 0, 0.6);

  var matchNodes = [];
  matchNodes.push(rect(card, 14, 14, 132, 28, C.accent, 14));
  matchNodes.push(await txtC(card, m.match + '% совпадение', 14, 28, 132, 8, 700, C.black, { align: 'center' }));
  grp('match-badge', matchNodes, card);

  var infoY = mH + 18;
  var avatarNodes = [];
  avatarNodes.push(rect(card, 16, infoY, 44, 44, C.black, 22));
  avatarNodes.push(await txtC(card, m.initials, 16, infoY + 22, 44, 12, 800, C.accent, { align: 'center' }));
  grp('avatar', avatarNodes, card);

  var nameInfoNodes = [];
  nameInfoNodes.push(await txt(card, m.firstName + ' ' + m.lastName, 70, infoY + 2, cW - 86, 12, 800, C.black));
  nameInfoNodes.push(await txt(card, m.city + ' · ' + m.exp, 70, infoY + 18, cW - 86, 9, 400, C.gray400));
  nameInfoNodes.push(await txt(card, '★ ' + m.rating + '  ' + m.reviews, 70, infoY + 32, cW - 86, 8, 500, C.black));
  grp('name-info', nameInfoNodes, card);
  infoY += 44 + 14;

  rect(card, 16, infoY, cW - 32, 1, C.gray200); infoY += 1 + 12;

  var priceNodes = [];
  priceNodes.push(await txt(card, m.price, 16, infoY, (cW - 32) / 2, 12, 800, C.black));
  priceNodes.push(await txt(card, m.projects + ' проектов', cW / 2, infoY, (cW - 32) / 2, 10, 600, C.gray400, { align: 'right' }));
  priceNodes.push(await txt(card, 'стоимость/м²', 16, infoY + 16, (cW - 32) / 2, 7, 400, C.gray400));
  grp('price-info', priceNodes, card);
  infoY += 16 + 14 + 10;

  await txt(card, 'ПОЧЕМУ ' + m.firstName.toUpperCase(), 16, infoY, 220, 7, 700, C.gray400, { ls: 4 });
  infoY += 7 + 10;
  var tgX3 = 16;
  var whyNodes = [];
  for (var wyi = 0; wyi < m.why.length; wyi++) {
    var wt = m.why[wyi], wtW = wt.length * 6 + 20;
    if (tgX3 + wtW > cW - 16) { tgX3 = 16; infoY += 28; }
    var wtBg = rect(card, tgX3, infoY, wtW, 22, C.gray100, 11);
    whyNodes.push(wtBg);
    whyNodes.push(await txtC(card, wt, tgX3, infoY + 11, wtW, 8, 500, C.gray600, { align: 'center' }));
    tgX3 += wtW + 6;
  }
  grp('why-tags', whyNodes, card);

  await swipeButtons(p, sCY);
  homeBar(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// ПРОФИЛЬ МАСТЕРА
// ─────────────────────────────────────────────────────────────────────────────
async function buildProfile(p, mi) {
  var m = MASTERS[mi];
  sf(p, C.white);

  var ctaPanelH = 72;
  var ctaPanelY = H - HOME_H - ctaPanelH + 11;

  // ── Герой ─────────────────────────────────────────────────────────────────
  var heroH = 230;
  var hero = mkFrame(p, 0, 0, W, heroH, C.black, 0);
  var cols = 3, g = 3, bW4 = (W - g * (cols + 1)) / cols;
  var heroTiles = [];
  for (var ci = 0; ci < cols; ci++)
    heroTiles.push(rect(hero, g + ci * (bW4 + g), g, bW4, heroH - g, hex2rgb(m.bg[ci]), 10));
  grp('hero-tiles', heroTiles, hero);
  gradRect(hero, 0, heroH - 150, W, 150, 0, 0.85);

  await statusBar(hero, false);

  var backBtnNodes = [];
  backBtnNodes.push(rect(hero, SIDE, SB_H + 4, 36, 36, C.black, 18, 0.5));
  backBtnNodes.push(await txtC(hero, '←', SIDE, SB_H + 22, 36, 15, 700, C.white, { align: 'center' }));
  grp('back-btn', backBtnNodes, hero);

  var heroMatchNodes = [];
  heroMatchNodes.push(rect(hero, SIDE, heroH - 44, 148, 28, C.accent, 14));
  heroMatchNodes.push(await txtC(hero, m.match + '% совпадение', SIDE, heroH - 30, 148, 8, 700, C.black, { align: 'center' }));
  grp('hero-match', heroMatchNodes, hero);

  var y = heroH + 18;

  var nameNodes = [];
  nameNodes.push(await txt(p, m.firstName + ' ' + m.lastName, SIDE, y, CW - 110, 16, 800, C.black, { lineH: 24 }));
  nameNodes.push(await txt(p, m.price, W - SIDE - 100, y, 100, 12, 700, C.black, { align: 'right' }));
  nameNodes.push(await txt(p, 'за м² проекта', W - SIDE - 100, y + 18, 100, 8, 400, C.gray400, { align: 'right' }));
  grp('name-price', nameNodes, p);
  y += 24 + 6;

  await txt(p, '📍 ' + m.city + ' · работает онлайн', SIDE, y, CW, 9, 500, C.gray400);
  y += 9 + 16;

  var tgX4 = SIDE;
  var profileTagNodes = [];
  for (var ti3 = 0; ti3 < m.why.length; ti3++) {
    var tw3 = m.why[ti3].length * 6 + 20;
    var isSel = ti3 === 0;
    var tb = rect(p, tgX4, y, tw3, 28, isSel ? C.accent : C.gray100, 14);
    profileTagNodes.push(tb);
    profileTagNodes.push(await txtC(p, m.why[ti3], tgX4, y + 14, tw3, 8, 700, isSel ? C.black : C.gray600, { align: 'center' }));
    tgX4 += tw3 + 6;
  }
  grp('profile-tags', profileTagNodes, p);
  y += 28 + 18;

  rect(p, 0, y, W, 1, C.gray200); y += 1 + 18;

  var s3W = (CW - 12) / 3, statH = 68;
  var stats = [{ v: m.projects, k: 'проектов' }, { v: m.exp, k: 'опыт' }, { v: '★ ' + m.rating, k: 'рейтинг' }];
  var statsNodes = [];
  for (var si4 = 0; si4 < 3; si4++) {
    var sx = SIDE + si4 * (s3W + 6);
    var sc6 = rect(p, sx, y, s3W, statH, C.white, 14);
    sc6.strokes = [{ type: 'SOLID', color: C.gray200 }]; sc6.strokeWeight = 1;
    statsNodes.push(sc6);
    statsNodes.push(await txtC(p, stats[si4].v, sx + 4, y + statH / 2 - 8, s3W - 8, 14, 800, C.black, { align: 'center' }));
    statsNodes.push(await txtC(p, stats[si4].k, sx + 4, y + statH / 2 + 10, s3W - 8, 7, 500, C.gray400, { align: 'center', ls: 3 }));
  }
  grp('stats', statsNodes, p);
  y += statH + 18;

  rect(p, 0, y, W, 1, C.gray200); y += 1 + 18;

  await txt(p, 'РЕАЛЬНЫЕ ПРОЕКТЫ', SIDE, y, CW, 8, 700, C.gray400, { ls: 5 }); y += 8 + 12;
  var phW = 100, phH = 76, phGap = 9;
  var phLabels = ['Гостиная', 'Спальня', 'Кухня', 'Прихожая', 'Ванная'];
  var photoNodes = [];
  for (var pi = 0; pi < 5; pi++) {
    var phX = SIDE + pi * (phW + phGap);
    photoNodes.push(rect(p, phX, y, phW, phH, hex2rgb(m.bg[pi % m.bg.length]), 12));
    photoNodes.push(await txt(p, phLabels[pi], phX, y + phH + 5, phW, 7, 500, C.gray400, { align: 'center' }));
  }
  var moreX = SIDE + 5 * (phW + phGap);
  var moreBg = rect(p, moreX, y + phH / 2 - 18, 72, 36, C.black, 18);
  photoNodes.push(moreBg);
  photoNodes.push(await txtC(p, 'ещё →', moreX, y + phH / 2, 72, 8, 700, C.white, { align: 'center' }));
  grp('projects', photoNodes, p);
  y += phH + 22 + 12;

  rect(p, 0, y, W, 1, C.gray200); y += 1 + 18;

  await txt(p, 'ОТЗЫВЫ', SIDE, y, CW, 8, 700, C.gray400, { ls: 5 }); y += 8 + 12;
  var allReviewNodes = [];
  for (var ri = 0; ri < m.reviewsList.length; ri++) {
    var rv = m.reviewsList[ri], revH = 102;
    var reviewNodes = [];
    var revCard = rect(p, SIDE, y, CW, revH, C.white, 16);
    revCard.strokes = [{ type: 'SOLID', color: C.gray200 }]; revCard.strokeWeight = 0.5;
    reviewNodes.push(revCard);
    var avBg = rect(p, SIDE + 12, y + 14, 32, 32, C.black, 16); reviewNodes.push(avBg);
    reviewNodes.push(await txtC(p, rv.av, SIDE + 12, y + 30, 32, 10, 700, C.accent, { align: 'center' }));
    reviewNodes.push(await txt(p, rv.name + ' · ' + rv.obj, SIDE + 52, y + 14, CW - 64, 9, 700, C.black));
    reviewNodes.push(await txt(p, rv.stars, SIDE + 52, y + 28, 70, 9, 400, C.black));
    reviewNodes.push(await txt(p, rv.text, SIDE + 12, y + 50, CW - 24, 9, 400, C.gray400, { lineH: 14 }));
    grp('review-' + ri, reviewNodes, p);
    y += revH + 10;
  }
  y += 8;
  rect(p, 0, y, W, 1, C.gray200); y += 1 + 18;

  await txt(p, 'О МАСТЕРЕ', SIDE, y, CW, 8, 700, C.gray400, { ls: 5 }); y += 8 + 12;
  var facts = ['Срок дизайн-проекта: 3–5 недель', '200+ клиентов по всей России', 'Первая консультация — бесплатно', 'Топ-10 Houzz Russia 2023'];
  var factIcons = ['⏱', '👥', '🎁', '🏆'];
  for (var fi = 0; fi < facts.length; fi++) {
    var factRow = [];
    var fic = rect(p, SIDE, y + fi * 42, 30, 30, C.white, 8);
    fic.strokes = [{ type: 'SOLID', color: C.gray200 }]; fic.strokeWeight = 0.5;
    factRow.push(fic);
    factRow.push(await txtC(p, factIcons[fi], SIDE, y + fi * 42 + 15, 30, 15, 400, C.black, { align: 'center' }));
    factRow.push(await txtC(p, facts[fi], SIDE + 40, y + fi * 42 + 15, CW - 40, 9, 500, C.black));
    grp('fact-' + fi, factRow, p);
  }

  // ── CTA панель ─────────────────────────────────────────────────────────────
  var ctaPanelNodes = [];
  var ctaPanelBg = rect(p, 0, ctaPanelY, W, ctaPanelH, C.white);
  ctaPanelNodes.push(ctaPanelBg);
  ctaPanelNodes.push(rect(p, 0, ctaPanelY, W, 1, C.gray200));

  var btnH = 50;
  var innerY = ctaPanelY + (ctaPanelH - btnH) / 2;
  var iconW = 50, gapB = 8;
  var mainW = CW - iconW * 2 - gapB * 2;

  ctaPanelNodes.push(rect(p, SIDE, innerY, mainW, btnH, C.black, 25));
  ctaPanelNodes.push(await txtC(p, 'Написать ' + m.firstName + ' →', SIDE, innerY + btnH / 2, mainW, 10, 700, C.white, { align: 'center' }));

  var saveX = SIDE + mainW + gapB;
  var saveBtn = rect(p, saveX, innerY, iconW, btnH, C.white, 25);
  saveBtn.strokes = [{ type: 'SOLID', color: C.gray200 }]; saveBtn.strokeWeight = 1;
  ctaPanelNodes.push(saveBtn);
  ctaPanelNodes.push(await txtC(p, '☆', saveX, innerY + btnH / 2, iconW, 18, 400, C.black, { align: 'center' }));

  var shareX = saveX + iconW + gapB;
  var shareBtn = rect(p, shareX, innerY, iconW, btnH, C.white, 25);
  shareBtn.strokes = [{ type: 'SOLID', color: C.gray200 }]; shareBtn.strokeWeight = 1;
  ctaPanelNodes.push(shareBtn);
  ctaPanelNodes.push(await txtC(p, '↗', shareX, innerY + btnH / 2, iconW, 16, 600, C.black, { align: 'center' }));

  grp('cta-panel', ctaPanelNodes, p);
  homeBar(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// КАРТА ЭКРАНОВ
// ─────────────────────────────────────────────────────────────────────────────
var SCREEN_MAP = {
  ui_kit:      { name: '00 — UI Kit',          fn: function(p) { return buildUIKit(p); } },
  splash:      { name: '01 — Splash',           fn: function(p) { return buildSplash(p); } },
  style_scan:  { name: '02a — Скандинавский',   fn: function(p) { return buildStyleSwipe(p, 0, 'like'); } },
  style_min:   { name: '02b — Минимализм',      fn: function(p) { return buildStyleSwipe(p, 1, 'neutral'); } },
  style_loft:  { name: '02c — Лофт',            fn: function(p) { return buildStyleSwipe(p, 2, 'nope'); } },
  style_mod:   { name: '02d — Современный',     fn: function(p) { return buildStyleSwipe(p, 3, 'neutral'); } },
  style_class: { name: '02e — Классика',        fn: function(p) { return buildStyleSwipe(p, 4, 'like'); } },
  style_eco:   { name: '02f — Эко/Бохо',        fn: function(p) { return buildStyleSwipe(p, 5, 'neutral'); } },
  style_japdi: { name: '02g — Japandi',         fn: function(p) { return buildStyleSwipe(p, 6, 'nope'); } },
  style_art:   { name: '02h — Арт-деко',        fn: function(p) { return buildStyleSwipe(p, 7, 'like'); } },
  behavior:    { name: '03 — Поведение',        fn: function(p) { return buildBehavior(p); } },
  budget:      { name: '04 — Бюджет',           fn: function(p) { return buildBudget(p); } },
  area:        { name: '05 — Площадь',          fn: function(p) { return buildArea(p); } },
  features:    { name: '06 — Критерии',         fn: function(p) { return buildFeatures(p); } },
  result_1:    { name: '07a — Карточка Анны',   fn: function(p) { return buildResult(p, 0); } },
  result_2:    { name: '07b — Карточка Максима', fn: function(p) { return buildResult(p, 1); } },
  result_3:    { name: '07c — Карточка Елены',  fn: function(p) { return buildResult(p, 2); } },
  profile_1:   { name: '08a — Профиль Анны',    fn: function(p) { return buildProfile(p, 0); } },
  profile_2:   { name: '08b — Профиль Максима', fn: function(p) { return buildProfile(p, 1); } },
  profile_3:   { name: '08c — Профиль Елены',   fn: function(p) { return buildProfile(p, 2); } }
};

// ─────────────────────────────────────────────────────────────────────────────
// ГЛАВНЫЙ ЦИКЛ
// ─────────────────────────────────────────────────────────────────────────────
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
    var uiKitW = 1440, uiKitH = 2600;
    var totW = Math.max(COLS * cellW + gap, hasUIKit ? uiKitW + gap * 2 : 0);
    var totH = (hasUIKit ? uiKitH + gap : 0) + rows * cellH + gap;

    var container = figma.createFrame();
    container.name = 'ReMatch — Онбординг v15';
    sf(container, C.bg);
    container.resize(totW, totH);
    container.x = 0; container.y = 0;
    figma.currentPage.appendChild(container);

    var offsetY = 0;
    if (hasUIKit) {
      figma.ui.postMessage({ type: 'progress', pct: 3, label: 'UI Kit...' });
      var uk = figma.createFrame();
      uk.name = '00 — UI Kit'; uk.x = gap; uk.y = gap;
      uk.resize(uiKitW, uiKitH); uk.clipsContent = true; sf(uk, C.bg);
      container.appendChild(uk);
      await buildUIKit(uk);
      offsetY = uiKitH + gap;
    }

    for (var i = 0; i < phoneScreens.length; i++) {
      var def = SCREEN_MAP[phoneScreens[i]];
      if (!def) continue;
      var col = layout === 'vertical' ? 0 : layout === 'horizontal' ? i : i % COLS;
      var row = layout === 'horizontal' ? 0 : layout === 'vertical' ? i : Math.floor(i / COLS);
      figma.ui.postMessage({ type: 'progress', pct: 3 + Math.round((i / phoneScreens.length) * 94), label: 'Создаю: ' + def.name });

      var phoneX = gap + col * cellW;
      var phoneY = offsetY + gap + row * cellH;
      var pos = await drawPhone(container, phoneX, phoneY);

      var f = figma.createFrame();
      f.name = def.name; f.x = pos.screenX; f.y = pos.screenY;
      f.resize(W, H); f.clipsContent = true; f.cornerRadius = PHONE.screenR;
      sf(f, C.white);
      container.appendChild(f);
      await def.fn(f);

      drawDynamicIsland(container, pos);
    }

    figma.viewport.scrollAndZoomIntoView([container]);
    figma.ui.postMessage({ type: 'done', count: screens.length });
  } catch (err) {
    figma.ui.postMessage({ type: 'error', message: err.message });
    console.error(err);
  }
};