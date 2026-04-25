figma.showUI(__html__, { width: 360, height: 720 });

var W = 360;
var H = 800;

var C = {
  black:      { r:0.059, g:0.059, b:0.059 },
  white:      { r:1,     g:1,     b:1     },
  accent:     { r:0.788, g:0.961, b:0.259 },
  accentDark: { r:0.502, g:0.620, b:0.118 },
  gray100:    { r:0.969, g:0.965, b:0.953 },
  gray200:    { r:0.929, g:0.922, b:0.902 },
  gray300:    { r:0.820, g:0.812, b:0.796 },
  gray400:    { r:0.722, g:0.710, b:0.682 },
  gray600:    { r:0.420, g:0.408, b:0.376 },
  gray800:    { r:0.200, g:0.196, b:0.188 },
  green:      { r:0.133, g:0.773, b:0.369 },
  red:        { r:1,     g:0.267, b:0.267 },
  bg:         { r:0.949, g:0.937, b:0.918 },
  cream:      { r:0.980, g:0.973, b:0.957 },
  sand:       { r:0.910, g:0.878, b:0.831 },
  tan:        { r:0.788, g:0.725, b:0.604 },
  beige:      { r:0.831, g:0.769, b:0.690 },
  slate:      { r:0.329, g:0.431, b:0.478 },
  darkSlate:  { r:0.216, g:0.278, b:0.310 },
  lightSlate: { r:0.471, g:0.565, b:0.612 }
};

var STYLES = [
  {
    id:'style_scan', name:'Скандинавский',
    desc:'Белый, дерево, натуральные материалы, уют и простота',
    tags:['Светло','Дерево','Уют'],
    colors:['#f5f0e8','#e8ddd0','#d4c4b0','#c9b99a','#a89070','#6b5040']
  },
  {
    id:'style_min', name:'Минимализм',
    desc:'Чистые линии, нейтральные тона, пустое пространство',
    tags:['Лаконично','Чисто','Функционально'],
    colors:['#f8f8f8','#e8e8e8','#d0d0d0','#b0b0b0','#787878','#2c2c2c']
  },
  {
    id:'style_loft', name:'Лофт',
    desc:'Кирпич, металл, открытые конструкции, индустриальность',
    tags:['Кирпич','Металл','Индустриально'],
    colors:['#c4bdb5','#a09890','#786050','#584840','#3c3028','#1e1814']
  },
  {
    id:'style_mod', name:'Современный',
    desc:'Актуальные формы, яркие акценты, технологичность',
    tags:['Актуально','Акценты','Технологично'],
    colors:['#f0f4f8','#c8d8e8','#7090b0','#3a5f80','#1a3a58','#c9f542']
  },
  {
    id:'style_class', name:'Классика',
    desc:'Симметрия, лепнина, благородные материалы, золото',
    tags:['Симметрия','Золото','Роскошь'],
    colors:['#f5efe0','#e8d5a8','#c8a84b','#8b7030','#4a3a18','#1a1208']
  },
  {
    id:'style_eco', name:'Эко / Бохо',
    desc:'Растения, натуральные текстуры, тёплые оттенки земли',
    tags:['Природа','Текстуры','Тепло'],
    colors:['#e8f0e0','#c8d8a8','#98b870','#6a9048','#3d6028','#c4714a']
  },
  {
    id:'style_japdi', name:'Japandi',
    desc:'Японский минимализм + скандинавский уют, ваби-саби',
    tags:['Ваби-саби','Тишина','Природность'],
    colors:['#f0ece4','#ddd5c8','#b8a88c','#8c7860','#5c4838','#2c2018']
  },
  {
    id:'style_art', name:'Арт-деко',
    desc:'Геометрия, контраст, золото, роскошные материалы',
    tags:['Геометрия','Контраст','Роскошь'],
    colors:['#1a1408','#3a2e18','#c8a84b','#e8c870','#f0d890','#f8f0e0']
  }
];

// ─── Утилиты ─────────────────────────────────────────────────────────────────

function hex2rgb(hex) {
  var n = parseInt(hex.replace('#',''), 16);
  return { r:((n>>16)&255)/255, g:((n>>8)&255)/255, b:(n&255)/255 };
}

function setFill(node, color) {
  node.fills = [{ type:'SOLID', color:color }];
}

function mkRect(parent, x, y, w, h, color, radius) {
  var r = figma.createRectangle();
  r.x = x; r.y = y; r.resize(w, h);
  if (radius) r.cornerRadius = radius;
  setFill(r, color);
  parent.appendChild(r);
  return r;
}

function mkFrame(parent, x, y, w, h, color, radius) {
  var f = figma.createFrame();
  f.x = x; f.y = y; f.resize(w, h);
  if (radius) f.cornerRadius = radius;
  f.clipsContent = true;
  setFill(f, color || C.white);
  if (parent) parent.appendChild(f);
  return f;
}

function wToStyle(w) {
  if (w >= 800) return 'Extra Bold';
  if (w >= 700) return 'Bold';
  if (w >= 600) return 'Semi Bold';
  if (w >= 500) return 'Medium';
  return 'Regular';
}

async function mkText(parent, str, x, y, w, size, weight, color, opts) {
  opts = opts || {};
  var t = figma.createText();
  await figma.loadFontAsync({ family:'Inter', style:wToStyle(weight) });
  t.fontName = { family:'Inter', style:wToStyle(weight) };
  t.characters = str;
  t.fontSize = size;
  t.x = x; t.y = y;
  if (w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); }
  if (opts.align) t.textAlignHorizontal = opts.align.toUpperCase();
  if (opts.lineH) t.lineHeight = { value:opts.lineH, unit:'PIXELS' };
  if (opts.opacity !== undefined) {
    t.fills = [{ type:'SOLID', color:color, opacity:opts.opacity }];
  } else {
    setFill(t, color);
  }
  parent.appendChild(t);
  return t;
}

function mkGradient(node, fromAlpha, toAlpha) {
  node.fills = [{
    type:'GRADIENT_LINEAR',
    gradientTransform:[[0,0,0],[0,1,0]],
    gradientStops:[
      { position:0, color:{ r:0.059, g:0.059, b:0.059, a:fromAlpha } },
      { position:1, color:{ r:0.059, g:0.059, b:0.059, a:toAlpha   } }
    ]
  }];
}

async function addStatusBar(parent) {
  await mkText(parent, '9:41', 16, 12, 60, 13, 700, C.black);
  var bx = W - 16 - 52;
  for (var i = 0; i < 3; i++) {
    var bh = 4 + i*3;
    mkRect(parent, bx+i*9, 16+(10-bh), 6, bh, C.black, 1);
  }
  var bo = figma.createRectangle();
  bo.resize(18,9); bo.x = bx+30; bo.y = 14;
  bo.cornerRadius = 2;
  bo.strokes = [{ type:'SOLID', color:C.black }];
  bo.strokeWeight = 1; bo.fills = [];
  parent.appendChild(bo);
  mkRect(parent, bx+31, 15, 12, 7, C.black, 1);
  mkRect(parent, bx+49, 17, 2, 5, C.black, 1);
  return 36;
}

function addProgressBar(parent, total, done, y) {
  var segW = (W-32)/total - 3;
  for (var i = 0; i < total; i++) {
    mkRect(parent, 16+i*(segW+3), y, segW, 3, i < done ? C.black : C.gray200, 2);
  }
  return y+14;
}

async function addQHead(parent, step, total, title, hint, y) {
  await mkText(parent, 'Шаг '+step+' из '+total, 16, y, 200, 11, 600, C.gray400);
  y += 18;
  await mkText(parent, title, 16, y, W-32, 20, 800, C.black, { lineH:26 });
  y += 32;
  if (hint) {
    await mkText(parent, hint, 16, y, W-32, 12, 400, C.gray600);
    y += 24;
  }
  return y;
}

async function addBtn(parent, label, y, bgColor, txtColor) {
  bgColor  = bgColor  || C.black;
  txtColor = txtColor || C.white;
  mkRect(parent, 16, y, W-32, 50, bgColor, 14);
  await mkText(parent, label, 16, y+15, W-32, 14, 700, txtColor, { align:'center' });
  return y+62;
}

// ─────────────────────────────────────────────────────────────────────────────
// UI KIT
// ─────────────────────────────────────────────────────────────────────────────

async function buildUIKit(p) {
  // Размер UI Kit — широкий фрейм
  p.resize(1200, 900);
  setFill(p, C.cream);

  var x = 40; var y = 40;

  // ── Заголовок ──────────────────────────────────────────────────────────────
  await mkText(p, 'ReMatch — UI Kit', x, y, 600, 28, 800, C.black);
  await mkText(p, 'Основные элементы дизайн-системы', x, y+38, 600, 13, 400, C.gray600);
  y += 80;

  // ── ЦВЕТА ─────────────────────────────────────────────────────────────────
  await mkText(p, 'ЦВЕТА', x, y, 300, 11, 700, C.gray400);
  y += 18;

  var colorTokens = [
    { name:'Black',      hex:'#0f0f0f', color:C.black,      light:true  },
    { name:'White',      hex:'#ffffff', color:C.white,       light:false },
    { name:'Accent',     hex:'#c9f542', color:C.accent,      light:false },
    { name:'Cream',      hex:'#faf8f4', color:C.cream,       light:false },
    { name:'Gray 100',   hex:'#f7f6f3', color:C.gray100,     light:false },
    { name:'Gray 200',   hex:'#edebe6', color:C.gray200,     light:false },
    { name:'Gray 400',   hex:'#b8b5ae', color:C.gray400,     light:true  },
    { name:'Gray 600',   hex:'#6b6860', color:C.gray600,     light:true  },
    { name:'Green',      hex:'#22c55e', color:C.green,       light:true  },
    { name:'Red',        hex:'#ff4444', color:C.red,         light:true  },
    { name:'Sand',       hex:'#e8e0d4', color:C.sand,        light:false },
    { name:'BG',         hex:'#f2eeea', color:C.bg,          light:false }
  ];

  var cSize = 64; var cGap = 12;
  for (var ci = 0; ci < colorTokens.length; ci++) {
    var ct = colorTokens[ci];
    var cx = x + ci*(cSize+cGap);
    // Сброс на вторую строку если не влезает
    if (cx + cSize > 1160) {
      cx = x + (ci-6)*(cSize+cGap);
      var rowY = y + 90;
    } else {
      rowY = y;
    }
    var swatch = mkRect(p, cx, rowY, cSize, cSize, ct.color, 12);
    if (ct.name === 'White') {
      swatch.strokes = [{ type:'SOLID', color:C.gray200 }]; swatch.strokeWeight = 1;
    }
    await mkText(p, ct.name, cx, rowY+cSize+6, cSize, 9, 600, C.gray600);
    await mkText(p, ct.hex,  cx, rowY+cSize+18, cSize, 8, 400, C.gray400);
  }

  y += 182;

  // ── ТИПОГРАФИКА ───────────────────────────────────────────────────────────
  await mkText(p, 'ТИПОГРАФИКА', x, y, 400, 11, 700, C.gray400);
  y += 18;

  var typeRows = [
    { label:'H1 — Extra Bold 32',   text:'Найди своего дизайнера',         size:32, w:800 },
    { label:'H2 — Bold 24',         text:'Стиль вашего интерьера',          size:24, w:700 },
    { label:'H3 — Semi Bold 18',    text:'Выберите подходящий вариант',     size:18, w:600 },
    { label:'Body — Medium 14',     text:'Описание функции или блока',      size:14, w:500 },
    { label:'Caption — Regular 12', text:'Подсказка или вспомогательный текст', size:12, w:400 },
    { label:'Label — Bold 11',      text:'МЕТКА / ШАГ 1 ИЗ 6',            size:11, w:700 }
  ];

  for (var ti = 0; ti < typeRows.length; ti++) {
    var tr = typeRows[ti];
    await mkText(p, tr.label, x, y, 220, 10, 600, C.gray400);
    await mkText(p, tr.text,  x+230, y, 600, tr.size, tr.w, C.black);
    y += Math.max(tr.size + 20, 36);
  }

  y += 16;

  // ── КНОПКИ ────────────────────────────────────────────────────────────────
  await mkText(p, 'КНОПКИ', x, y, 300, 11, 700, C.gray400);
  y += 18;

  // Primary
  mkRect(p, x, y, 200, 50, C.black, 14);
  await mkText(p, 'Продолжить →', x, y+15, 200, 14, 700, C.white, { align:'center' });
  await mkText(p, 'Primary', x, y+58, 200, 10, 600, C.gray400, { align:'center' });

  // Accent
  mkRect(p, x+220, y, 200, 50, C.accent, 14);
  await mkText(p, 'Начать бесплатно', x+220, y+15, 200, 14, 700, C.black, { align:'center' });
  await mkText(p, 'Accent', x+220, y+58, 200, 10, 600, C.gray400, { align:'center' });

  // Secondary
  var secBtn = mkRect(p, x+440, y, 200, 50, C.white, 14);
  secBtn.strokes = [{ type:'SOLID', color:C.black }]; secBtn.strokeWeight = 1.5;
  await mkText(p, 'Пропустить', x+440, y+15, 200, 14, 600, C.black, { align:'center' });
  await mkText(p, 'Secondary', x+440, y+58, 200, 10, 600, C.gray400, { align:'center' });

  // Disabled
  var disBtn = mkRect(p, x+660, y, 200, 50, C.black, 14);
  disBtn.opacity = 0.3;
  await mkText(p, 'Недоступно', x+660, y+15, 200, 14, 700, C.white, { align:'center' });
  await mkText(p, 'Disabled', x+660, y+58, 200, 10, 600, C.gray400, { align:'center' });

  y += 90;

  // ── КАРТОЧКИ ВАРИАНТОВ ────────────────────────────────────────────────────
  await mkText(p, 'ЭЛЕМЕНТЫ ВЫБОРА', x, y, 400, 11, 700, C.gray400);
  y += 18;

  // Не выбранная строка
  var row1 = mkRect(p, x, y, 300, 52, C.white, 12);
  row1.strokes = [{ type:'SOLID', color:C.gray200 }]; row1.strokeWeight = 1.5;
  await mkText(p, '🖼', x+16, y+14, 28, 20, 400, C.black);
  await mkText(p, 'Хожу по шоурумам', x+52, y+16, 230, 14, 500, C.black);
  await mkText(p, 'Default', x, y+60, 300, 10, 600, C.gray400, { align:'center' });

  // Выбранная строка
  var row2 = mkRect(p, x+320, y, 300, 52, C.gray100, 12);
  row2.strokes = [{ type:'SOLID', color:C.black }]; row2.strokeWeight = 1.5;
  await mkText(p, '📱', x+336, y+14, 28, 20, 400, C.black);
  await mkText(p, 'Сохраняю в Pinterest', x+372, y+16, 230, 14, 600, C.black);
  // Галочка
  mkRect(p, x+596, y+16, 20, 20, C.black, 6);
  await mkText(p, '✓', x+596, y+18, 20, 10, 800, C.white, { align:'center' });
  await mkText(p, 'Selected', x+320, y+60, 300, 10, 600, C.gray400, { align:'center' });

  y += 90;

  // ── ТЕГИ ──────────────────────────────────────────────────────────────────
  await mkText(p, 'ТЕГИ', x, y, 300, 11, 700, C.gray400);
  y += 18;

  var tagItems = ['хранение', 'естественный свет', 'эргономика', 'уют и тепло', 'рабочая зона'];
  var tagX = x;
  for (var tgi = 0; tgi < tagItems.length; tgi++) {
    var sel = tgi === 0 || tgi === 2;
    var tW  = tagItems[tgi].length*7+24;
    var tg  = mkRect(p, tagX, y, tW, 30, sel ? C.black : C.white, 15);
    tg.strokes = [{ type:'SOLID', color: sel ? C.black : C.gray200 }]; tg.strokeWeight = 1.5;
    await mkText(p, tagItems[tgi], tagX, y+7, tW, 12, 500, sel ? C.white : C.black, { align:'center' });
    tagX += tW+8;
  }

  y += 56;

  // ── ИКОНКИ ДЕЙСТВИЙ ───────────────────────────────────────────────────────
  await mkText(p, 'КНОПКИ СВАЙПА', x, y, 400, 11, 700, C.gray400);
  y += 18;

  // Нет
  mkRect(p, x, y, 60, 60, hex2rgb('#fff0f0'), 30);
  await mkText(p, '✕', x, y+14, 60, 24, 700, C.red, { align:'center' });
  await mkText(p, 'Не моё', x, y+68, 60, 10, 600, C.gray400, { align:'center' });

  // Пропустить
  mkRect(p, x+80, y+10, 44, 40, C.gray100, 20);
  await mkText(p, '⟳', x+80, y+18, 44, 18, 600, C.gray400, { align:'center' });
  await mkText(p, 'Пропуск', x+76, y+58, 52, 10, 600, C.gray400, { align:'center' });

  // Нравится
  mkRect(p, x+148, y, 60, 60, hex2rgb('#f0fff4'), 30);
  await mkText(p, '♥', x+148, y+14, 60, 24, 700, C.green, { align:'center' });
  await mkText(p, 'Нравится', x+140, y+68, 76, 10, 600, C.gray400, { align:'center' });

  // Активный Нет
  mkRect(p, x+260, y, 60, 60, C.red, 30);
  await mkText(p, '✕', x+260, y+14, 60, 24, 700, C.white, { align:'center' });
  await mkText(p, 'Active nope', x+252, y+68, 76, 10, 600, C.gray400, { align:'center' });

  // Активный Нравится
  mkRect(p, x+356, y, 60, 60, C.green, 30);
  await mkText(p, '♥', x+356, y+14, 60, 24, 700, C.white, { align:'center' });
  await mkText(p, 'Active like', x+348, y+68, 76, 10, 600, C.gray400, { align:'center' });

  y += 100;

  // ── ПРОГРЕСС-БАР ──────────────────────────────────────────────────────────
  await mkText(p, 'ПРОГРЕСС-БАР', x, y, 400, 11, 700, C.gray400);
  y += 18;

  // 3 из 6
  var segW = 60; var segGap = 6;
  for (var pi = 0; pi < 6; pi++) {
    mkRect(p, x+pi*(segW+segGap), y, segW, 4, pi < 3 ? C.black : C.gray200, 2);
  }
  await mkText(p, 'Шаг 3 из 6', x+400, y-1, 200, 12, 500, C.gray600);

  y += 32;

  // ── СТАТУС-БАР ────────────────────────────────────────────────────────────
  await mkText(p, 'СТАТУС-БАР ANDROID', x, y, 400, 11, 700, C.gray400);
  y += 18;

  var sbFrame = mkFrame(p, x, y, 360, 36, C.cream, 8);
  await addStatusBar(sbFrame);
  await mkText(p, '360px wide', x+380, y+10, 200, 12, 400, C.gray400);

  y += 60;

  // ── КАРТОЧКА МАСТЕРА ──────────────────────────────────────────────────────
  await mkText(p, 'КАРТОЧКА МАСТЕРА', x, y, 400, 11, 700, C.gray400);
  y += 18;

  var card = mkRect(p, x, y, 328, 100, C.white, 16);
  card.strokes = [{ type:'SOLID', color:C.black }]; card.strokeWeight = 1.5;
  mkRect(p, x+14, y+14, 44, 44, C.black, 22);
  await mkText(p, 'АС', x+14, y+24, 44, 15, 800, C.white, { align:'center' });
  await mkText(p, 'Анна Смирнова', x+68, y+14, 200, 14, 700, C.black);
  await mkText(p, '● 94% совпадение вкусов', x+68, y+34, 220, 11, 600, C.green);
  await mkText(p, '47 реализованных проектов', x+68, y+50, 200, 11, 400, C.gray600);
  var m1 = [C.sand, C.tan, C.beige];
  for (var mi = 0; mi < 3; mi++) { mkRect(p, x+14+mi*48, y+68, 42, 22, m1[mi], 6); }
  await mkText(p, 'проекты →', x+162, y+73, 90, 10, 600, C.gray400);

  // ── Мини-легенда ──────────────────────────────────────────────────────────
  await mkText(p,
    'Inter — основной шрифт   ·   Сетка: 16px отступы   ·   Радиусы: 8/12/14/16/20/30px   ·   Android 360×800',
    x, 860, 1100, 11, 400, C.gray400);
}

function hex2rgb(hex) {
  var n = parseInt(hex.replace('#',''), 16);
  return { r:((n>>16)&255)/255, g:((n>>8)&255)/255, b:(n&255)/255 };
}

// ─────────────────────────────────────────────────────────────────────────────
// SPLASH (светлый, без превью-квадратов)
// ─────────────────────────────────────────────────────────────────────────────

async function buildSplash(p) {
  setFill(p, C.cream);

  // Декоративные плитки — только в правом верхнем углу
  var tiles = [
    { x:240, y:0,  w:60, h:80,  hex:'#e8ddd0' },
    { x:304, y:0,  w:56, h:80,  hex:'#d4c4b0' },
    { x:240, y:84, w:60, h:60,  hex:'#c9f542' },
    { x:304, y:84, w:56, h:60,  hex:'#c9b99a' }
  ];
  for (var ti = 0; ti < tiles.length; ti++) {
    var td = tiles[ti];
    var tile = mkRect(p, td.x, td.y, td.w, td.h, hex2rgb(td.hex), 0);
    tile.opacity = 0.7;
  }

  // Логотип
  mkRect(p, 16, 52, 32, 32, C.black, 8);
  await mkText(p, 'R', 16, 59, 32, 16, 800, C.accent, { align:'center' });
  await mkText(p, 'REMATCH', 56, 60, 120, 13, 800, C.black);

  // Заголовок
  var hy = 175;
  await mkText(p, 'Найди своего\nдизайнера за\n2 минуты', 16, hy, W-32, 34, 800, C.black, { lineH:44 });

  // Акцентная черта
  mkRect(p, 16, hy+146, 56, 5, C.accent, 3);

  // Описание
  await mkText(p,
    'Покажи интерьеры, которые нравятся — мы подберём дизайнеров с похожими реализованными проектами',
    16, hy+166, W-32, 13, 400, C.gray600, { lineH:20 });

  // Главная кнопка
  mkRect(p, 16, H-16-50-48, W-32, 50, C.black, 14);
  await mkText(p, 'Начать — это бесплатно', 16, H-16-50-48+15, W-32, 14, 700, C.white, { align:'center' });

  // Вторичная ссылка
  await mkText(p, 'Уже есть аккаунт? Войти', 16, H-16-50+14, W-32, 12, 400, C.gray600, { align:'center' });
}

// ─────────────────────────────────────────────────────────────────────────────
// СВАЙП-КАРТОЧКА СТИЛЯ
// ─────────────────────────────────────────────────────────────────────────────

async function buildStyleSwipe(p, styleIndex, cardState) {
  cardState = cardState || 'neutral';
  var style = STYLES[styleIndex];
  setFill(p, C.cream);

  var y = await addStatusBar(p);
  y += 8;

  // Счётчик
  await mkText(p, (styleIndex+1)+' / '+STYLES.length, 0, y, W, 11, 600, C.gray400, { align:'center' });
  y += 20;

  // Заголовок
  await mkText(p, 'Нравится этот стиль?', 16, y, W-32, 18, 800, C.black);
  y += 32;

  // ── КАРТОЧКА ────────────────────────────────────────────────────────────
  var cardW = W-32;
  var cardH = 340;
  var cardX = 16;

  // Фон карточки — сетка 3×2 цветовых блоков
  var card = mkFrame(p, cardX, y, cardW, cardH, hex2rgb(style.colors[0]), 20);

  var cols = 3; var rows = 2; var gap = 3;
  var bW = (cardW - gap*(cols+1)) / cols;
  var bH = (cardH - gap*(rows+1)) / rows;

  for (var ri = 0; ri < rows; ri++) {
    for (var ci = 0; ci < cols; ci++) {
      var idx = ri*cols+ci;
      mkRect(card, gap+ci*(bW+gap), gap+ri*(bH+gap), bW, bH, hex2rgb(style.colors[idx]), 14);
    }
  }

  // Градиент снизу
  var gOv = mkRect(card, 0, cardH-130, cardW, 130, C.black, 0);
  mkGradient(gOv, 0, 0.88);

  // Бейдж LIKE / NOPE
  if (cardState === 'like') {
    mkRect(card, 14, 14, 96, 30, C.green, 8);
    await mkText(card, '❤  НРАВИТСЯ', 14, 20, 96, 11, 800, C.white, { align:'center' });
  } else if (cardState === 'nope') {
    mkRect(card, cardW-110, 14, 96, 30, C.red, 8);
    await mkText(card, '✕  НЕ МОЁ', cardW-110, 20, 96, 11, 800, C.white, { align:'center' });
  }

  // ── Плашка с текстом под градиентом ──────────────────────────────────────
  await mkText(card, style.name, 16, cardH-72, cardW-32, 20, 800, C.white);
  await mkText(card, style.desc, 16, cardH-46, cardW-32, 11, 400, C.white, { opacity:0.75, lineH:16 });

  y += cardH + 14;

  // ── Теги под карточкой ────────────────────────────────────────────────────
  var tagX = 16;
  for (var tgi = 0; tgi < style.tags.length; tgi++) {
    var tag  = style.tags[tgi];
    var tagW = tag.length*7+22;
    mkRect(p, tagX, y, tagW, 26, C.white, 13);
    var tgEl = p.children[p.children.length-1];
    tgEl.strokes = [{ type:'SOLID', color:C.gray300 }]; tgEl.strokeWeight = 1;
    await mkText(p, tag, tagX, y+5, tagW, 11, 500, C.gray600, { align:'center' });
    tagX += tagW+6;
  }
  y += 38;

  // ── Кнопки свайпа ─────────────────────────────────────────────────────────
  var btnY = H-16-64;
  var cx   = W/2;
  var nopeActive = cardState === 'nope';
  var likeActive = cardState === 'like';

  // Нет
  mkRect(p, cx-94, btnY, 60, 60, nopeActive ? C.red : hex2rgb('#fff0f0'), 30);
  await mkText(p, '✕', cx-94, btnY+14, 60, 24, 700, nopeActive ? C.white : C.red, { align:'center' });
  await mkText(p, 'Не моё', cx-94, btnY+66, 60, 9, 600, C.gray400, { align:'center' });

  // Пропустить
  mkRect(p, cx-18, btnY+12, 36, 36, C.gray100, 18);
  await mkText(p, '⟳', cx-18, btnY+17, 36, 16, 500, C.gray400, { align:'center' });

  // Нравится
  mkRect(p, cx+34, btnY, 60, 60, likeActive ? C.green : hex2rgb('#f0fff4'), 30);
  await mkText(p, '♥', cx+34, btnY+14, 60, 24, 700, likeActive ? C.white : C.green, { align:'center' });
  await mkText(p, 'Нравится', cx+34, btnY+66, 60, 9, 600, C.gray400, { align:'center' });
}

// ─────────────────────────────────────────────────────────────────────────────
// ПОВЕДЕНИЕ
// ─────────────────────────────────────────────────────────────────────────────

async function buildBehavior(p) {
  setFill(p, C.white);
  var y = await addStatusBar(p);
  y = addProgressBar(p, 5, 1, y);
  y = await addQHead(p, 1, 5, 'Как вы принимаете решения?', 'Выберите одно — то, что ближе', y);

  var items = [
    { icon:'🖼', txt:'Хожу по шоурумам, фотографирую'     },
    { icon:'📱', txt:'Сохраняю в Pinterest / Instagram'    },
    { icon:'💬', txt:'Советуюсь с друзьями или дизайнером' },
    { icon:'🔍', txt:'Долго изучаю и сравниваю варианты'   },
    { icon:'⚡', txt:'Решаю быстро, по ощущению'           }
  ];

  for (var i = 0; i < items.length; i++) {
    var sel = i===1;
    var row = mkRect(p, 16, y, W-32, 50, sel ? C.gray100 : C.white, 12);
    row.strokes=[{ type:'SOLID', color:sel?C.black:C.gray200 }]; row.strokeWeight=1.5;
    await mkText(p, items[i].icon, 28, y+13, 28, 20, 400, C.black);
    await mkText(p, items[i].txt,  64, y+15, W-96, 13, 500, C.black);
    if (sel) {
      mkRect(p, W-16-20, y+15, 20, 20, C.black, 6);
      await mkText(p, '✓', W-16-20, y+17, 20, 10, 800, C.white, { align:'center' });
    }
    y += 58;
  }

  await addBtn(p, 'Далее →', H-16-50);
}

// ─────────────────────────────────────────────────────────────────────────────
// БЮДЖЕТ
// ─────────────────────────────────────────────────────────────────────────────

async function buildBudget(p) {
  setFill(p, C.white);
  var y = await addStatusBar(p);
  y = addProgressBar(p, 5, 2, y);
  y = await addQHead(p, 2, 5, 'Бюджет на дизайн-проект', 'Поможет подобрать мастера нужного уровня', y);

  var list = [
    { price:'до 80 000 ₽',         desc:'Планировка и спецификации'      },
    { price:'80 000 – 150 000 ₽',  desc:'Полный проект, 3D-визуализации'  },
    { price:'150 000 – 300 000 ₽', desc:'Проект с авторским надзором'     },
    { price:'300 000 – 600 000 ₽', desc:'Комплексный проект под ключ'    },
    { price:'от 600 000 ₽',        desc:'Премиум, эксклюзивный дизайн'   },
    { price:'Пока не знаю',         desc:'Расскажем о вариантах'           }
  ];

  for (var i = 0; i < list.length; i++) {
    var sel = i===2;
    var row = mkRect(p, 16, y, W-32, 52, sel ? C.gray100 : C.white, 12);
    row.strokes=[{ type:'SOLID', color:sel?C.black:C.gray200 }]; row.strokeWeight=1.5;
    await mkText(p, list[i].price, 28, y+10, W-72, 14, 700, C.black);
    await mkText(p, list[i].desc,  28, y+28, W-72, 11, 400, C.gray600);
    if (sel) {
      mkRect(p, W-16-24, y+16, 20, 20, C.black, 6);
      await mkText(p, '✓', W-16-24, y+18, 20, 10, 800, C.white, { align:'center' });
    }
    y += 60;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ПЛОЩАДЬ
// ─────────────────────────────────────────────────────────────────────────────

async function buildArea(p) {
  setFill(p, C.white);
  var y = await addStatusBar(p);
  y = addProgressBar(p, 5, 3, y);
  y = await addQHead(p, 3, 5, 'Площадь квартиры', 'Примерно — для подбора специализации', y);

  var areas = [
    { n:'до 35', l:'м²  ·  студия'    },
    { n:'35–55', l:'м²  ·  1–2 комн.' },
    { n:'55–80', l:'м²  ·  2–3 комн.' },
    { n:'от 80', l:'м²  ·  большая'   }
  ];
  var cW = (W-32-8)/2;
  for (var i = 0; i < 4; i++) {
    var cx   = 16+(i%2)*(cW+8);
    var cy   = y+Math.floor(i/2)*100;
    var sel  = i===1;
    var cell = mkRect(p, cx, cy, cW, 88, sel?C.gray100:C.white, 14);
    cell.strokes=[{ type:'SOLID', color:sel?C.black:C.gray200 }]; cell.strokeWeight=1.5;
    await mkText(p, areas[i].n, cx, cy+18, cW, 22, 800, C.black,   { align:'center' });
    await mkText(p, areas[i].l, cx, cy+48, cW, 11, 500, C.gray600, { align:'center' });
    if (sel) {
      mkRect(p, cx+cW-28, cy+8, 20, 20, C.black, 6);
      await mkText(p, '✓', cx+cW-28, cy+10, 20, 10, 800, C.white, { align:'center' });
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// КРИТЕРИИ
// ─────────────────────────────────────────────────────────────────────────────

async function buildFeatures(p) {
  setFill(p, C.white);
  var y = await addStatusBar(p);
  y = addProgressBar(p, 5, 4, y);
  y = await addQHead(p, 4, 5, 'Что важно в интерьере?', 'Выберите всё, что важно для вас', y);

  var tags = [
    'хранение','естественный свет','эргономика',
    'натуральные материалы','цветовые акценты',
    'открытое пространство','уют и тепло',
    'минимум предметов','рабочая зона',
    'детская зона','много текстиля','высокие потолки'
  ];
  var selMap = { 0:1,2:1,4:1,6:1 };
  var rx=16; var ry=y;
  for (var i = 0; i < tags.length; i++) {
    var tw = tags[i].length*7+24;
    if (rx+tw > W-16) { rx=16; ry+=38; }
    var sel = selMap[i]===1;
    var tr  = mkRect(p, rx, ry, tw, 30, sel?C.black:C.white, 15);
    tr.strokes=[{ type:'SOLID', color:sel?C.black:C.gray200 }]; tr.strokeWeight=1.5;
    await mkText(p, tags[i], rx, ry+7, tw, 12, 500, sel?C.white:C.black, { align:'center' });
    rx += tw+6;
  }

  await addBtn(p, 'Показать мастеров →', H-16-50);
}

// ─────────────────────────────────────────────────────────────────────────────
// РЕЗУЛЬТАТ
// ─────────────────────────────────────────────────────────────────────────────

async function buildResult(p) {
  setFill(p, C.cream);
  var y = await addStatusBar(p);

  // Успех-иконка
  mkRect(p, W/2-30, y+12, 60, 60, C.accent, 30);
  await mkText(p, '✓', W/2-30, y+26, 60, 26, 800, C.black, { align:'center' });
  y += 86;

  await mkText(p, 'Вот ваши мастера', 16, y, W-32, 20, 800, C.black, { align:'center' });
  y += 28;
  await mkText(p, 'Подобрали по совпадению вкусов\nи реальным реализованным проектам',
    16, y, W-32, 12, 400, C.gray600, { align:'center', lineH:18 });
  y += 48;

  // Карточка 1 — выделенная
  var c1 = mkRect(p, 16, y, W-32, 100, C.white, 16);
  c1.strokes=[{ type:'SOLID', color:C.black }]; c1.strokeWeight=1.5;
  mkRect(p, 28, y+14, 44, 44, C.black, 22);
  await mkText(p, 'АС', 28, y+24, 44, 15, 800, C.white, { align:'center' });
  await mkText(p, 'Анна Смирнова', 82, y+14, 180, 14, 700, C.black);
  await mkText(p, '● 94% совпадение вкусов', 82, y+32, 210, 11, 600, C.green);
  await mkText(p, '47 реализованных проектов', 82, y+48, 190, 11, 400, C.gray600);
  var m1=[C.sand,C.tan,C.beige];
  for (var i=0;i<3;i++) { mkRect(p, 28+i*48, y+68, 42, 24, m1[i], 6); }
  await mkText(p, 'смотреть проекты →', 178, y+73, 130, 10, 600, C.gray400);
  y += 116;

  // Карточка 2 — приглушённая
  var c2 = mkRect(p, 16, y, W-32, 90, C.white, 16);
  c2.strokes=[{ type:'SOLID', color:C.gray200 }]; c2.strokeWeight=1.5; c2.opacity=0.65;
  mkRect(p, 28, y+14, 44, 44, C.slate, 22);
  await mkText(p, 'МВ', 28, y+24, 44, 15, 800, C.white, { align:'center' });
  await mkText(p, 'Михаил Волков', 82, y+14, 180, 14, 700, C.black);
  await mkText(p, '● 87% совпадение', 82, y+32, 180, 11, 600, C.green);
  await mkText(p, '31 реализованный проект', 82, y+48, 180, 11, 400, C.gray600);
  var m2=[C.lightSlate,C.darkSlate,C.slate];
  for (var j=0;j<3;j++) { mkRect(p, 28+j*48, y+60, 42, 24, m2[j], 6); }

  // CTA
  mkRect(p, 16, H-16-50, W-32, 50, C.accent, 14);
  await mkText(p, 'Написать Анне →', 16, H-16-50+15, W-32, 14, 800, C.black, { align:'center' });
}

// ─────────────────────────────────────────────────────────────────────────────
// Построение фреймов
// ─────────────────────────────────────────────────────────────────────────────

async function buildScreen(container, name, buildFn, sx, sy, w, h) {
  w = w || W; h = h || H;
  var f = figma.createFrame();
  f.name = name; f.x = sx; f.y = sy;
  f.resize(w, h);
  f.clipsContent = true;
  setFill(f, C.white);
  container.appendChild(f);
  await buildFn(f);
  return f;
}

var SCREEN_MAP = {
  ui_kit:      { name:'00 — UI Kit',          fn:function(p){ return buildUIKit(p);               }, w:1200, h:920 },
  splash:      { name:'01 — Splash',          fn:function(p){ return buildSplash(p);              } },
  style_scan:  { name:'02a — Скандинавский',  fn:function(p){ return buildStyleSwipe(p,0,'like');    } },
  style_min:   { name:'02b — Минимализм',     fn:function(p){ return buildStyleSwipe(p,1,'neutral'); } },
  style_loft:  { name:'02c — Лофт',           fn:function(p){ return buildStyleSwipe(p,2,'nope');    } },
  style_mod:   { name:'02d — Современный',    fn:function(p){ return buildStyleSwipe(p,3,'neutral'); } },
  style_class: { name:'02e — Классика',       fn:function(p){ return buildStyleSwipe(p,4,'like');    } },
  style_eco:   { name:'02f — Эко/Бохо',       fn:function(p){ return buildStyleSwipe(p,5,'neutral'); } },
  style_japdi: { name:'02g — Japandi',        fn:function(p){ return buildStyleSwipe(p,6,'nope');    } },
  style_art:   { name:'02h — Арт-деко',       fn:function(p){ return buildStyleSwipe(p,7,'like');    } },
  behavior:    { name:'03 — Поведение',       fn:function(p){ return buildBehavior(p);            } },
  budget:      { name:'04 — Бюджет',          fn:function(p){ return buildBudget(p);              } },
  area:        { name:'05 — Площадь',         fn:function(p){ return buildArea(p);                } },
  features:    { name:'06 — Критерии',        fn:function(p){ return buildFeatures(p);            } },
  result:      { name:'07 — Результат',       fn:function(p){ return buildResult(p);              } }
};

figma.ui.onmessage = async function(msg) {
  if (msg.type !== 'create-screens') return;
  try {
    var screens = msg.screens;
    var layout  = msg.layout;
    var gap     = msg.gap;

    // UI Kit всегда идёт отдельно — не считаем его в сетку обычных экранов
    var phoneScreens = screens.filter(function(s){ return s !== 'ui_kit'; });
    var hasUIKit     = screens.indexOf('ui_kit') !== -1;

    var COLS = layout==='grid' ? 4 : layout==='vertical' ? 1 : phoneScreens.length;
    var rows = Math.ceil(phoneScreens.length / COLS);
    var totW = Math.max(COLS*W+(COLS+1)*gap, hasUIKit ? 1200+gap*2 : 0);
    var totH = (hasUIKit ? 920+gap : 0) + rows*H+(rows+1)*gap;

    var container = figma.createFrame();
    container.name = 'ReMatch — Онбординг';
    setFill(container, C.bg);
    container.resize(totW, totH);
    container.x = 0; container.y = 0;
    figma.currentPage.appendChild(container);

    var offsetY = 0;

    // Рисуем UI Kit первым
    if (hasUIKit) {
      figma.ui.postMessage({ type:'progress', pct:5, label:'Создаю: UI Kit' });
      await buildScreen(container, '00 — UI Kit', buildUIKit, gap, gap, 1200, 920);
      offsetY = 920+gap;
    }

    // Рисуем экраны
    for (var i = 0; i < phoneScreens.length; i++) {
      var def = SCREEN_MAP[phoneScreens[i]];
      if (!def) continue;

      var col = layout==='vertical' ? 0 : layout==='horizontal' ? i : i%COLS;
      var row = layout==='horizontal' ? 0 : layout==='vertical' ? i : Math.floor(i/COLS);

      figma.ui.postMessage({
        type:'progress',
        pct: 5 + Math.round((i/phoneScreens.length)*90),
        label:'Создаю: '+def.name
      });

      var sx = gap+col*(W+gap);
      var sy = offsetY+gap+row*(H+gap);
      await buildScreen(container, def.name, def.fn, sx, sy);
    }

    figma.viewport.scrollAndZoomIntoView([container]);
    figma.ui.postMessage({ type:'done', count:screens.length });

  } catch(err) {
    figma.ui.postMessage({ type:'error', message:err.message });
    console.error(err);
  }
};