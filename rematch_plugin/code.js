figma.showUI(__html__, { width: 300, height: 100 });

var W = 393, H = 852;
var SIDE = 20;
var CW = W - SIDE * 2;
var SB_H = 59;
var CR = 20;

var FONTS = {
  regular:  { family: 'Unbounded', style: 'Regular'  },
  medium:   { family: 'Unbounded', style: 'Medium'   },
  semibold: { family: 'Unbounded', style: 'SemiBold' }
};

var LOADED = {};
async function lf(f) {
  var k = f.family + '_' + f.style;
  if (!LOADED[k]) { await figma.loadFontAsync(f); LOADED[k] = true; }
}
function wf(w) {
  if (w >= 600) return FONTS.semibold;
  if (w >= 500) return FONTS.medium;
  return FONTS.regular;
}

var C = {
  black:   { r: 0,     g: 0,     b: 0     },
  white:   { r: 1,     g: 1,     b: 1     },
  accent:  { r: 0.788, g: 0.961, b: 0.259 },
  accentL: { r: 0.878, g: 0.980, b: 0.600 },
  redL:    { r: 1.000, g: 0.878, b: 0.878 },
  red:     { r: 0.910, g: 0.750, b: 0.750 },
  gray100: { r: 0.969, g: 0.965, b: 0.953 },
  gray200: { r: 0.878, g: 0.859, b: 0.902 },
  gray400: { r: 0.420, g: 0.420, b: 0.431 },
  gray600: { r: 0.231, g: 0.231, b: 0.243 }
};

function sf(node, color, opacity) {
  var f = { type: 'SOLID', color: color };
  if (opacity !== undefined) f.opacity = opacity;
  node.fills = [f];
}

function mkRect(parent, x, y, w, h, color, r, opacity) {
  var el = figma.createRectangle();
  el.x = x; el.y = y;
  el.resize(Math.max(w,1), Math.max(h,1));
  if (r) el.cornerRadius = r;
  sf(el, color, opacity);
  if (parent) parent.appendChild(el);
  return el;
}

function mkFrame(parent, x, y, w, h, color, r) {
  var f = figma.createFrame();
  f.x = x; f.y = y;
  f.resize(Math.max(w,1), Math.max(h,1));
  if (r) f.cornerRadius = r;
  f.clipsContent = true;
  sf(f, color || C.white);
  if (parent) parent.appendChild(f);
  return f;
}

async function mkTxtAuto(parent, str, cx, cy, sz, weight, color, align) {
  var fn = wf(weight); await lf(fn);
  var t = figma.createText();
  t.fontName = fn;
  t.characters = String(str);
  t.fontSize = sz;
  t.textAutoResize = 'WIDTH_AND_HEIGHT';
  t.textAlignHorizontal = align ? align.toUpperCase() : 'CENTER';
  sf(t, color);
  t.x = Math.round(cx - t.width  / 2);
  t.y = Math.round(cy - t.height / 2);
  if (parent) parent.appendChild(t);
  return t;
}

async function mkTxt(parent, str, x, y, w, sz, weight, color, align, lineH) {
  var fn = wf(weight); await lf(fn);
  var t = figma.createText();
  t.fontName = fn;
  t.characters = String(str);
  t.fontSize = sz;
  if (w > 0) { t.textAutoResize = 'HEIGHT'; t.resize(w, 20); }
  else t.textAutoResize = 'WIDTH_AND_HEIGHT';
  if (align) t.textAlignHorizontal = align.toUpperCase();
  if (lineH) t.lineHeight = { value: lineH, unit: 'PIXELS' };
  t.x = x; t.y = y;
  sf(t, color);
  if (parent) parent.appendChild(t);
  return t;
}

async function probe(str, sz, weight) {
  var fn = wf(weight); await lf(fn);
  var t = figma.createText();
  t.fontName = fn;
  t.characters = str;
  t.fontSize = sz;
  t.textAutoResize = 'WIDTH_AND_HEIGHT';
  var w = t.width, h = t.height;
  t.remove();
  return { w: w, h: h };
}

function homeBar(parent) {
  var hb = mkRect(parent, W/2 - 67, H - 15, 134, 5, C.black, 3);
  hb.opacity = 0.2;
}

async function statusBar(parent) {
  await mkTxt(parent, '9:41', SIDE, 15, 60, 14, 500, C.black);
  var bx = W - SIDE - 25, by = 18;
  var bat = figma.createRectangle();
  bat.x=bx; bat.y=by; bat.resize(25,12); bat.cornerRadius=3;
  bat.strokes=[{type:'SOLID',color:C.black}]; bat.strokeWeight=1.2; bat.fills=[];
  parent.appendChild(bat);
  mkRect(parent, bx+2, by+2, 17, 8, C.black, 1);
  var tip = figma.createRectangle();
  tip.x=bx+25; tip.y=by+4; tip.resize(2,4); tip.cornerRadius=1;
  tip.fills=[{type:'SOLID',color:C.black}]; parent.appendChild(tip);
}

async function drawTags(parent, tags, x, y, h) {
  var PAD = 20;
  var cx2 = x;
  for (var i = 0; i < tags.length; i++) {
    var sz = await probe(tags[i], 14, 500);
    var tw = Math.round(sz.w + PAD * 2);
    var tg = mkRect(parent, cx2, y, tw, h, C.white, h/2);
    tg.strokes=[{type:'SOLID',color:C.gray200}]; tg.strokeWeight=1;
    await mkTxtAuto(parent, tags[i], cx2 + tw/2, y + h/2, 14, 500, C.gray600, 'center');
    cx2 += tw + 8;
  }
}

function hex2rgb(h) {
  var n = parseInt(h.replace('#',''), 16);
  return { r:((n>>16)&255)/255, g:((n>>8)&255)/255, b:(n&255)/255 };
}

function gradRect(parent, x, y, w, h, fromA, toA) {
  var el = figma.createRectangle();
  el.x = x; el.y = y; el.resize(Math.max(w,1), Math.max(h,1));
  el.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [[0,0,0],[0,1,0]],
    gradientStops: [
      { position:0, color:{ r:0, g:0, b:0, a:fromA } },
      { position:1, color:{ r:0, g:0, b:0, a:toA   } }
    ]
  }];
  if (parent) parent.appendChild(el);
  return el;
}

function ln(parent, x, y, w) {
  return mkRect(parent, x, y, w, 1, C.gray200);
}

async function buildStyleSwipe(p, style, badge) {
  sf(p, C.white);
  await statusBar(p);

  var y = SB_H + 16;
  await mkTxtAuto(p, style.num, W/2, y + 10, 14, 500, C.gray400, 'center');
  y += 14 + 14;
  await mkTxt(p, 'Нравится этот стиль?', SIDE, y, CW, 24, 600, C.black, 'left', 34);
  y += 34 + 14;

  var BTN_SZ = 68;
  var STAG_H = 44;
  var CARD_TOP = y;
  var cH = 380;
  var CARD_BOT = CARD_TOP + cH;
  var STAG_Y = CARD_BOT + 12;

  var card = mkFrame(p, SIDE, CARD_TOP, CW, cH, C.gray100, CR);

  var mc=3, mr=2, mg=3;
  var mW = (CW - mg*(mc+1)) / mc;
  var mH = (cH  - mg*(mr+1)) / mr;
  for (var r=0; r<mr; r++) {
    for (var c=0; c<mc; c++) {
      var ci = r*mc+c;
      // Левый верхний прямоугольник (r=0, c=0) — цвет фона карточки (gray100)
      var tileColor = (r===0 && c===0)
        ? C.gray100
        : style.colors[Math.min(ci, style.colors.length-1)];
      mkRect(card, mg+c*(mW+mg), mg+r*(mH+mg), mW, mH, tileColor, CR);
    }
  }

  // Название стиля в левом верхнем прямоугольнике
  var fnS = wf(600); await lf(fnS);
  var nt = figma.createText();
  nt.fontName = fnS;
  nt.fontSize = 18;
  nt.characters = style.nameLines;
  nt.textAutoResize = 'WIDTH_AND_HEIGHT';
  nt.textAlignHorizontal = 'LEFT';
  sf(nt, C.black);
  nt.x = Math.round(mg + mW/2 - nt.width/2);
  nt.y = Math.round(mg + mH/2 - nt.height/2);
  card.appendChild(nt);

  // Бейджи — паддинг: лево/право 20, сверху 14, снизу 13
  if (badge === 'like') {
    var likeText = '✓  нравится';
    var likeSz = await probe(likeText, 14, 600);
    var likeW  = Math.round(likeSz.w + 40);
    var likeH  = Math.round(likeSz.h + 14 + 13);
    var lbX = CW - likeW - 14;
    var lbY = 14;
    mkRect(card, lbX, lbY, likeW, likeH, C.accentL, 20);
    var lb = card.children[card.children.length - 1];
    lb.strokes=[{type:'SOLID',color:C.accent}]; lb.strokeWeight=1;
    await mkTxtAuto(card, likeText, lbX + likeW/2, lbY + 14 + likeSz.h/2, 14, 600, C.black, 'center');
  } else if (badge === 'nope') {
    var nopeText = '✘  не нравится';
    var nopeSz = await probe(nopeText, 14, 600);
    var nopeW  = Math.round(nopeSz.w + 40);
    var nopeH  = Math.round(nopeSz.h + 14 + 13);
    var nbX = CW - nopeW - 14;
    var nbY = 14;
    mkRect(card, nbX, nbY, nopeW, nopeH, C.redL, 20);
    var nb = card.children[card.children.length - 1];
    nb.strokes=[{type:'SOLID',color:C.red}]; nb.strokeWeight=1;
    await mkTxtAuto(card, nopeText, nbX + nopeW/2, nbY + 14 + nopeSz.h/2, 14, 600, C.black, 'center');
  }

  // Теги с переносом на новую строку
  var tagX = SIDE;
  var tagY = STAG_Y;
  for (var i = 0; i < style.tags.length; i++) {
    var tSz = await probe(style.tags[i], 14, 500);
    var tw = Math.round(tSz.w + 40);
    if (tagX + tw > SIDE + CW) {
      tagX = SIDE;
      tagY += STAG_H + 8;
    }
    var tg = mkRect(p, tagX, tagY, tw, STAG_H, C.white, STAG_H/2);
    tg.strokes=[{type:'SOLID',color:C.gray200}]; tg.strokeWeight=1;
    await mkTxtAuto(p, style.tags[i], tagX + tw/2, tagY + STAG_H/2, 14, 500, C.gray600, 'center');
    tagX += tw + 8;
  }

  // Кнопки от реального конца тегов
  var realTagsBottom = tagY + STAG_H;
  var btnYst  = realTagsBottom + 80;
  var btnCY2  = btnYst + BTN_SZ / 2;
  var labelY2 = btnYst + BTN_SZ + 12;
  var lblSz2  = await probe('не нравится', 14, 400);
  var labelCY2 = labelY2 + lblSz2.h / 2;

  var cx = W/2, nlCX = cx-85, lkCX = cx+85;
  var nlX = Math.round(nlCX - BTN_SZ/2);
  var lkX = Math.round(lkCX - BTN_SZ/2);

  var nl = mkRect(p, nlX, btnYst, BTN_SZ, BTN_SZ, C.redL, BTN_SZ/2);
  nl.strokes=[{type:'SOLID',color:C.red}]; nl.strokeWeight=1.5;
  await mkTxtAuto(p, '✘', nlCX, btnCY2, 20, 600, C.black, 'center');

  var skSz=42, skX=Math.round(cx-skSz/2), skY=btnYst+Math.round((BTN_SZ-skSz)/2);
  mkRect(p, skX, skY, skSz, skSz, C.gray100, skSz/2);
  await mkTxtAuto(p, '↺', cx, skY+skSz/2, 16, 500, C.gray400, 'center');

  var lk = mkRect(p, lkX, btnYst, BTN_SZ, BTN_SZ, C.accentL, BTN_SZ/2);
  lk.strokes=[{type:'SOLID',color:C.accent}]; lk.strokeWeight=1.5;
  await mkTxtAuto(p, '✓', lkCX, btnCY2, 20, 600, C.black, 'center');

  await mkTxtAuto(p, 'не нравится', nlCX, labelCY2, 14, 400, C.gray400, 'center');
  await mkTxtAuto(p, 'нравится',    lkCX, labelCY2, 14, 400, C.gray400, 'center');

  homeBar(p);
}

function progressBar(parent, total, done, y) {
  var gap = 4;
  var segW = (CW - gap*(total-1)) / total;
  for (var i=0; i<total; i++)
    mkRect(parent, SIDE+i*(segW+gap), y, segW, 4, i<done ? C.black : C.gray200, 2);
  return y + 4 + 16;
}

async function buildSplash(p) {
  sf(p, { r:0.980, g:0.984, b:0.996 });
  await statusBar(p);
  var y = SB_H + 20;
  mkRect(p, SIDE, y, 48, 48, C.black, 14);
  await mkTxtAuto(p, 'R', SIDE+24, y+24, 18, 600, C.accent, 'center');
  await mkTxt(p, 'REMATCH', SIDE+60, y+17, 180, 14, 600, C.black, 'left');
  y += 48 + 60;
  await mkTxt(p, 'Найди своего\nдизайнера\nза 2 минуты', SIDE, y, CW, 28, 600, C.black, 'left', 40);
  y += 40*3 + 20;
  mkRect(p, SIDE, y, 64, 4, C.accent, 2);
  y += 4 + 20;
  await mkTxt(p,
    'Покажи интерьеры которые нравятся —\nмы подберём дизайнеров с похожими\nреализованными проектами',
    SIDE, y, CW, 14, 400, C.gray400, 'left', 24);
  y += 24*3 + 48;
  mkRect(p, SIDE,     y, 80, 80, C.accent,  16);
  mkRect(p, SIDE+88,  y, 60, 60, C.black,   14);
  mkRect(p, SIDE+88,  y+68, 60, 42, C.gray200, 10);
  mkRect(p, SIDE+156, y, 80, 80, C.gray100, 14);
  var ctaY = H - 34 - 16 - 56;
  mkRect(p, SIDE, ctaY, CW, 56, C.black, 28);
  await mkTxtAuto(p, 'Начать — это бесплатно', W/2, ctaY+28, 16, 600, C.white, 'center');
  await mkTxtAuto(p, 'Уже есть аккаунт? Войти', W/2, ctaY+56+20, 14, 400, C.gray400, 'center');
  homeBar(p);
}

async function buildBehavior(p) {
  sf(p, C.white); await statusBar(p);
  var y = SB_H + 12;
  y = progressBar(p, 4, 0, y); y += 16;
  await mkTxt(p, 'Как вы принимаете\nрешения?', SIDE, y, CW, 24, 600, C.black, 'left', 34);
  y += 34*2 + 12;
  await mkTxt(p, 'Выберите одно — то, что ближе', SIDE, y, CW, 14, 400, C.gray400);
  y += 20 + 20;
  var items = [
    { icon:'🖼', t:'Хочу по шаблонам'     },
    { icon:'📱', t:'Pinterest / Instagram' },
    { icon:'💬', t:'Советуюсь с другими'  },
    { icon:'🔍', t:'Долго сравниваю'      },
    { icon:'⚡', t:'Решаю по ощущению'    }
  ];
  var rowH = 68;
  for (var i=0; i<items.length; i++) {
    var sel = i===1;
    var row = mkRect(p, SIDE, y, CW, rowH, sel ? C.gray100 : C.white, 16);
    row.strokes=[{type:'SOLID',color:sel?C.black:C.gray200}]; row.strokeWeight=sel?2:1;
    await mkTxtAuto(p, items[i].icon, SIDE+28, y+rowH/2, 20, 400, C.black, 'center');
    await mkTxt(p, items[i].t, SIDE+60, y+(rowH-20)/2, CW-80, 16, 500, C.black);
    if (sel) {
      mkRect(p, SIDE+CW-40, y+(rowH-24)/2, 24, 24, C.black, 12);
      await mkTxtAuto(p, '✓', SIDE+CW-28, y+rowH/2, 12, 600, C.white, 'center');
    }
    y += rowH + 8;
  }
  var ctaY = H - 34 - 16 - 56;
  mkRect(p, SIDE, ctaY, CW, 56, C.black, 28);
  await mkTxtAuto(p, 'Далее →', W/2, ctaY+28, 16, 600, C.white, 'center');
  homeBar(p);
}

async function buildBudget(p) {
  sf(p, C.white); await statusBar(p);
  var y = SB_H + 12;
  y = progressBar(p, 4, 1, y); y += 16;
  await mkTxt(p, 'Бюджет на\nдизайн-проект', SIDE, y, CW, 24, 600, C.black, 'left', 34);
  y += 34*2 + 12;
  await mkTxt(p, 'Поможет подобрать мастера нужного уровня', SIDE, y, CW, 14, 400, C.gray400);
  y += 20 + 20;
  var list = [
    { p:'до 80 000 ₽',     d:'Планировка и спецификации'   },
    { p:'150 – 300 000 ₽', d:'Полный проект, 3D'           },
    { p:'300 – 600 000 ₽', d:'Проект с авторским надзором' },
    { p:'от 600 000 ₽',    d:'Комплексный под ключ'        },
    { p:'Пока не знаю',    d:'Расскажем о вариантах'       }
  ];
  var rowH = 72;
  for (var i=0; i<list.length; i++) {
    var sel = i===1;
    var row = mkRect(p, SIDE, y, CW, rowH, sel?C.gray100:C.white, 16);
    row.strokes=[{type:'SOLID',color:sel?C.black:C.gray200}]; row.strokeWeight=sel?2:1;
    await mkTxt(p, list[i].p, SIDE+16, y+16,      CW-60, 16, 600, C.black);
    await mkTxt(p, list[i].d, SIDE+16, y+16+20+6, CW-60, 14, 400, C.gray400);
    if (sel) {
      mkRect(p, SIDE+CW-40, y+(rowH-24)/2, 24, 24, C.black, 12);
      await mkTxtAuto(p, '✓', SIDE+CW-28, y+rowH/2, 12, 600, C.white, 'center');
    }
    y += rowH + 8;
  }
  var ctaY = H - 34 - 16 - 56;
  mkRect(p, SIDE, ctaY, CW, 56, C.black, 28);
  await mkTxtAuto(p, 'Далее →', W/2, ctaY+28, 16, 600, C.white, 'center');
  homeBar(p);
}

async function buildArea(p) {
  sf(p, C.white); await statusBar(p);
  var y = SB_H + 12;
  y = progressBar(p, 4, 2, y); y += 16;
  await mkTxt(p, 'Площадь квартиры', SIDE, y, CW, 24, 600, C.black, 'left', 34);
  y += 34 + 12;
  await mkTxt(p, 'Примерно — для подбора специализации', SIDE, y, CW, 14, 400, C.gray400);
  y += 20 + 20;
  var areas = [
    { n:'до 35 м²', l:'студия'    },
    { n:'35–55 м²', l:'1–2 комн.' },
    { n:'55–80 м²', l:'2–3 комн.' },
    { n:'от 80 м²', l:'большая'   }
  ];
  var cellW = (CW-12)/2, cellH = 128;
  for (var i=0; i<4; i++) {
    var col = i%2, row = Math.floor(i/2);
    var cx2 = SIDE + col*(cellW+12), cy2 = y + row*(cellH+12);
    var sel = i===1;
    var cell = mkRect(p, cx2, cy2, cellW, cellH, sel?C.gray100:C.white, CR);
    cell.strokes=[{type:'SOLID',color:sel?C.black:C.gray200}]; cell.strokeWeight=sel?2:1;
    await mkTxtAuto(p, areas[i].n, cx2+cellW/2, cy2+cellH/2-12, 20, 600, C.black,   'center');
    await mkTxtAuto(p, areas[i].l, cx2+cellW/2, cy2+cellH/2+16, 14, 400, C.gray400, 'center');
    if (sel) {
      mkRect(p, cx2+cellW-36, cy2+12, 24, 24, C.black, 12);
      await mkTxtAuto(p, '✓', cx2+cellW-24, cy2+24, 12, 600, C.white, 'center');
    }
  }
  var ctaY = H - 34 - 16 - 56;
  mkRect(p, SIDE, ctaY, CW, 56, C.black, 28);
  await mkTxtAuto(p, 'Показать мастеров →', W/2, ctaY+28, 16, 600, C.white, 'center');
  homeBar(p);
}

async function buildFeatures(p) {
  sf(p, C.white); await statusBar(p);
  var y = SB_H + 12;
  y = progressBar(p, 4, 3, y); y += 16;
  await mkTxt(p, 'Что важно\nв интерьере?', SIDE, y, CW, 24, 600, C.black, 'left', 34);
  y += 34*2 + 12;
  await mkTxt(p, 'Выберите всё, что важно для вас', SIDE, y, CW, 14, 400, C.gray400);
  y += 20 + 20;
  var tags = [
    { t:'светлые тона',       s:true  },
    { t:'минимализм',         s:false },
    { t:'натур. материалы',   s:true  },
    { t:'яркие акценты',      s:false },
    { t:'функциональность',   s:true  },
    { t:'уютная атмосфера',   s:false },
    { t:'современный дизайн', s:true  },
    { t:'классический стиль', s:false },
    { t:'эклектика',          s:false },
    { t:'хай-тек',            s:true  }
  ];
  var tagH=44, gX=8, gY=10, rx=SIDE, ry=y;
  for (var i=0; i<tags.length; i++) {
    var tSz = await probe(tags[i].t, 14, tags[i].s?600:500);
    var tw = Math.round(tSz.w + 32);
    if (rx + tw > SIDE + CW) { rx=SIDE; ry+=tagH+gY; }
    var te = mkRect(p, rx, ry, tw, tagH, tags[i].s?C.black:C.white, tagH/2);
    if (!tags[i].s) { te.strokes=[{type:'SOLID',color:C.gray200}]; te.strokeWeight=1; }
    await mkTxtAuto(p, tags[i].t, rx+tw/2, ry+tagH/2, 14, tags[i].s?600:500,
      tags[i].s?C.white:C.gray600, 'center');
    rx += tw + gX;
  }
  var ctaY = H - 34 - 16 - 56;
  mkRect(p, SIDE, ctaY, CW, 56, C.black, 28);
  await mkTxtAuto(p, 'Продолжить →', W/2, ctaY+28, 16, 600, C.white, 'center');
  homeBar(p);
}

var MASTER = {
  initials:  'НА',
  fullName:  'Наталья Антонова',
  firstName: 'Наталье',
  city:      'Москва',
  exp:       '6 лет',
  rating:    '4.9',
  reviews:   '127 отзывов',
  projects:  '47',
  match:     '94',
  price:     '4 500 ₽/м²',
  spec:      'Скандинавский · Japandi · Минимализм',
  why:       ['светлые тона','минимализм','натур. матер.','japandi'],
  bg: ['#f0ece4','#ddd5c8','#b8a88c','#8c7860','#e8ddd0','#f5f0e8'],
  works: [
    { label:'Квартира 68 м², ЖК',      colors:[{r:0.96,g:0.94,b:0.91},{r:0.83,g:0.77,b:0.69},{r:0.66,g:0.56,b:0.44}] },
    { label:'Дом 110 м², Подмосковье',          colors:[{r:0.91,g:0.87,b:0.81},{r:0.79,g:0.73,b:0.60},{r:0.42,g:0.31,b:0.25}] },
    { label:'Апартаменты 55 м², Address3',   colors:[{r:0.88,g:0.85,b:0.80},{r:0.70,g:0.63,b:0.54},{r:0.50,g:0.42,b:0.34}] }
  ],
  reviewsList: [
    { initials:'НИ', name:'Нина Иванова', obj:'квартира 68 м²',    stars:5, text:'Наталья справилась с проектом на отлично! Очень довольны результатом и вниманием к деталям.' },
    { initials:'МС', name:'Михаил Смирнов', obj:'апартаменты 55 м²', stars:5, text:'Профессиональный подход и внимательное отношение к деталям. Рекомендую!' },
    { initials:'АП', name:'Анна Петрова', obj:'дом 110 м²',        stars:5, text:'Наталья превзошла все наши ожидания! Интерьер получился стильным и уютным.' }
  ]
};

async function buildMatch(p) {
  var m = MASTER;
  sf(p, C.white);
  await statusBar(p);

  var y = SB_H + 14;
  await mkTxt(p, 'СОВПАДЕНИЯ', SIDE, y, 140, 11, 600, C.gray400);
  mkRect(p, W-SIDE-18, y, 12, 12, C.accent,  6);
  mkRect(p, W-SIDE-36, y, 12, 12, C.gray200, 6);
  y += 12 + 12;

  var swipeAreaH = 68 + 44 + 80 + 44 + 20;
  var cH = H - y - swipeAreaH - 34;
  if (cH < 120) cH = 120;

  var card = mkFrame(p, SIDE, y, CW, cH, C.white, CR);
  card.effects = [{
    type:'DROP_SHADOW', color:{r:0,g:0,b:0,a:0.08},
    offset:{x:0,y:4}, radius:24, spread:0, visible:true, blendMode:'NORMAL'
  }];

  var mH = Math.round(cH * 0.36);
  var cols = 3, g = 3, bW = (CW - g*(cols+1)) / cols;
  for (var ci = 0; ci < cols; ci++)
    mkRect(card, g+ci*(bW+g), g, bW, mH-g, hex2rgb(m.bg[ci]), 14);
  gradRect(card, 0, mH-60, CW, 60, 0, 0.6);

  mkRect(card, 14, 14, 148, 32, C.accent, 16);
  await mkTxtAuto(card, m.match+'% совпадение', 14+74, 30, 13, 600, C.black, 'center');

  var infoY = mH + 14;
  mkRect(card, 16, infoY, 44, 44, C.black, 22);
  await mkTxtAuto(card, m.initials, 16+22, infoY+22, 14, 600, C.accent, 'center');

  var tX = 70, tW = CW - tX - 12;
  await mkTxt(card, m.fullName,                          tX, infoY,        tW, 18, 600, C.black);
  await mkTxt(card, m.city + ' · ' + m.exp,              tX, infoY+24,     tW, 13, 400, C.gray400);
  await mkTxt(card, '★ ' + m.rating + '  ' + m.reviews,  tX, infoY+42,     tW, 13, 500, C.black);
  infoY += 60 + 12;

  ln(card, 16, infoY, CW-32); infoY += 1 + 12;

  await mkTxt(card, m.price,                16,   infoY,    (CW-32)/2, 20, 600, C.black);
  await mkTxt(card, m.projects+' проектов', CW/2, infoY+3,  (CW/2)-20, 15, 500, C.gray400, 'right');
  await mkTxt(card, 'стоимость/м²',         16,   infoY+26, (CW-32)/2, 12, 400, C.gray400);
  infoY += 26 + 12 + 16;

  await mkTxt(card, 'ПОЧЕМУ ' + m.fullName.split(' ')[0].toUpperCase(),
    16, infoY, CW-32, 11, 600, C.gray400);
  infoY += 11 + 10;

  var tgX = 16;
  for (var wi = 0; wi < m.why.length; wi++) {
    var wt = m.why[wi];
    var wSz = await probe(wt, 13, 500);
    var wtW = Math.round(wSz.w + 24);
    if (tgX + wtW > CW - 16) { tgX = 16; infoY += 32; }
    mkRect(card, tgX, infoY, wtW, 28, C.gray100, 14);
    await mkTxtAuto(card, wt, tgX+wtW/2, infoY+14, 13, 500, C.gray600, 'center');
    tgX += wtW + 8;
  }

  var tagsY  = y + cH + 12;
  var btnCY  = tagsY + 44 + 60;
  var BTN_SZ = 68;
  var btnYst = Math.round(btnCY - BTN_SZ/2);
  var labelY = btnYst + BTN_SZ + 12;
  var lblSz  = await probe('не нравится', 14, 400);
  var labelCY= labelY + lblSz.h/2;

  var cx = W/2, nlCX = cx-85, lkCX = cx+85;
  var nlX = Math.round(nlCX - BTN_SZ/2);
  var lkX = Math.round(lkCX - BTN_SZ/2);

  var nl = mkRect(p, nlX, btnYst, BTN_SZ, BTN_SZ, C.redL, BTN_SZ/2);
  nl.strokes=[{type:'SOLID',color:C.red}]; nl.strokeWeight=1.5;
  await mkTxtAuto(p, '✘', nlCX, btnCY, 20, 600, C.black, 'center');

  var skSz=42, skX=Math.round(cx-skSz/2), skY=btnYst+Math.round((BTN_SZ-skSz)/2);
  mkRect(p, skX, skY, skSz, skSz, C.gray100, skSz/2);
  await mkTxtAuto(p, '↺', cx, skY+skSz/2, 16, 500, C.gray400, 'center');

  var lk = mkRect(p, lkX, btnYst, BTN_SZ, BTN_SZ, C.accentL, BTN_SZ/2);
  lk.strokes=[{type:'SOLID',color:C.accent}]; lk.strokeWeight=1.5;
  await mkTxtAuto(p, '✓', lkCX, btnCY, 20, 600, C.black, 'center');

  await mkTxtAuto(p, 'не нравится', nlCX, labelCY, 14, 400, C.gray400, 'center');
  await mkTxtAuto(p, 'нравится',    lkCX, labelCY, 14, 400, C.gray400, 'center');

  homeBar(p);
}

async function buildProfileHeader(p, m) {
  var heroH = 220;
  var hero = mkFrame(p, 0, 0, W, heroH, C.black, 0);

  var cols = 3, g = 3, bW = (W - g*(cols+1)) / cols;
  for (var ci = 0; ci < cols; ci++)
    mkRect(hero, g+ci*(bW+g), g, bW, heroH-g, hex2rgb(m.bg[ci]), 10);
  gradRect(hero, 0, heroH-140, W, 140, 0, 0.88);

  await statusBar(hero);

  mkRect(hero, SIDE, SB_H+8, 36, 36, C.black, 18, 0.45);
  await mkTxtAuto(hero, '←', SIDE+18, SB_H+26, 16, 600, C.white, 'center');

  await mkTxt(hero, m.fullName, SIDE, heroH-60, CW-140, 20, 600, C.white);
  await mkTxt(hero, m.price,    SIDE, heroH-36, CW,     14, 500, C.white);

  mkRect(hero, SIDE, heroH-68, 148, 28, C.accent, 14);
  await mkTxtAuto(hero, m.match+'% совпадение', SIDE+74, heroH-54, 12, 600, C.black, 'center');

  var y = heroH + 16;

  await mkTxt(p, '📍 ' + m.city + '  ·  Опыт ' + m.exp, SIDE, y, CW, 13, 400, C.gray400);
  y += 16 + 14;

  var tagH = 36, tagGap = 8, tPerRow = 2;
  var tagW = Math.floor((CW - (tPerRow-1)*tagGap) / tPerRow);
  for (var ti = 0; ti < m.why.length; ti++) {
    var col = ti % tPerRow, row = Math.floor(ti / tPerRow);
    var tgX = SIDE + col*(tagW+tagGap);
    var tgY = y + row*(tagH+tagGap);
    var isSel = ti === 0;
    mkRect(p, tgX, tgY, tagW, tagH, isSel ? C.accent : C.gray100, tagH/2);
    await mkTxtAuto(p, m.why[ti], tgX+tagW/2, tgY+tagH/2, 13, 600,
      isSel ? C.black : C.gray600, 'center');
  }
  var tagRows = Math.ceil(m.why.length / tPerRow);
  y += tagRows*(tagH+tagGap) - tagGap + 20;

  ln(p, 0, y, W); y += 1;

  var statH = 72, sW = CW/3;
  var stats = [
    { v: m.projects,    k: 'проектов' },
    { v: m.exp,         k: 'опыт'     },
    { v: '★ '+m.rating, k: 'рейтинг'  }
  ];
  for (var si = 0; si < 3; si++) {
    var sx = SIDE + si*sW;
    await mkTxtAuto(p, stats[si].v, sx+sW/2, y+statH/2-10, 20, 600, C.black,   'center');
    await mkTxtAuto(p, stats[si].k, sx+sW/2, y+statH/2+16, 12, 400, C.gray400, 'center');
  }
  y += statH;

  ln(p, 0, y, W); y += 1;
  return y;
}

async function buildTabs(p, y, activeTab) {
  var tabH = 44, tabW = CW/2;
  var wA = activeTab === 'works', rA = activeTab === 'reviews';
  await mkTxtAuto(p, 'Работы',  SIDE+tabW/2,      y+tabH/2, 15, wA?600:400, wA?C.black:C.gray400, 'center');
  mkRect(p, SIDE,      y+tabH-2, tabW, 2, wA?C.black:C.gray200, 1);
  await mkTxtAuto(p, 'Отзывы', SIDE+tabW+tabW/2, y+tabH/2, 15, rA?600:400, rA?C.black:C.gray400, 'center');
  mkRect(p, SIDE+tabW, y+tabH-2, tabW, 2, rA?C.black:C.gray200, 1);
  return y + tabH;
}

async function buildProfileCTA(p, m) {
  var ctaPanelH = 80, ctaPanelY = H - 34 - ctaPanelH;
  mkRect(p, 0, ctaPanelY, W, ctaPanelH, C.white);
  ln(p, 0, ctaPanelY, W);
  var btnH = 56, innerY = ctaPanelY + (ctaPanelH-btnH)/2;
  var iconW = 52, gap = 8, mainW = CW - iconW*2 - gap*2;
  mkRect(p, SIDE, innerY, mainW, btnH, C.black, 28);
  await mkTxtAuto(p, 'Написать ' + m.firstName + ' →', SIDE+mainW/2, innerY+btnH/2, 14, 600, C.white, 'center');
  var saveX = SIDE+mainW+gap;
  var saveBtn = mkRect(p, saveX, innerY, iconW, btnH, C.white, 28);
  saveBtn.strokes=[{type:'SOLID',color:C.gray200}]; saveBtn.strokeWeight=1;
  await mkTxtAuto(p, '☆', saveX+iconW/2, innerY+btnH/2, 20, 400, C.black, 'center');
  var shareX = saveX+iconW+gap;
  var shareBtn = mkRect(p, shareX, innerY, iconW, btnH, C.white, 28);
  shareBtn.strokes=[{type:'SOLID',color:C.gray200}]; shareBtn.strokeWeight=1;
  await mkTxtAuto(p, '↗', shareX+iconW/2, innerY+btnH/2, 18, 600, C.black, 'center');
  return ctaPanelY;
}

async function buildProfile(p, tab) {
  var m = MASTER;
  sf(p, C.white);
  var afterHeader = await buildProfileHeader(p, m);
  var tabEndY     = await buildTabs(p, afterHeader, tab);
  var ctaPanelY   = await buildProfileCTA(p, m);
  var contentY    = tabEndY + 16;
  var contentBottom = ctaPanelY - 12;

  if (tab === 'works') {
    await mkTxt(p, 'РЕАЛЬНЫЕ ПРОЕКТЫ', SIDE, contentY, CW, 11, 600, C.gray400);
    contentY += 11 + 12;
    var availH = contentBottom - contentY;
    var wColW  = (CW - 12) / 2;
    var wColH  = Math.floor((availH - 12) / 2);
    if (wColH < 100) wColH = 100;
    for (var wi = 0; wi < m.works.length; wi++) {
      var wcol = wi%2, wrow = Math.floor(wi/2);
      var wcx = SIDE + wcol*(wColW+12);
      var wcy = contentY + wrow*(wColH+12);
      var wk  = m.works[wi];
      var wf2 = mkFrame(p, wcx, wcy, wColW, wColH, C.gray100, CR);
      var wmc=3, wmg=3, wmW=(wColW-wmg*(wmc+1))/wmc;
      for (var wk3=0; wk3<wmc; wk3++)
        mkRect(wf2, wmg+wk3*(wmW+wmg), wmg, wmW, wColH-wmg*2, wk.colors[Math.min(wk3,2)], 10);
      gradRect(wf2, 0, wColH-48, wColW, 48, 0, 0.55);
      await mkTxt(wf2, wk.label, 10, wColH-30, wColW-20, 11, 400, C.white, 'left', 16);
    }
  } else {
    await mkTxt(p, 'ОТЗЫВЫ · ' + m.reviews, SIDE, contentY, CW, 11, 600, C.gray400);
    contentY += 11 + 14;
    var availH2  = contentBottom - contentY;
    var revCount = m.reviewsList.length;
    var revH     = Math.floor((availH2 - (revCount-1)*12) / revCount);
    if (revH < 110) revH = 110;
    for (var ri = 0; ri < revCount; ri++) {
      var rv = m.reviewsList[ri];
      mkRect(p, SIDE, contentY, CW, revH, C.gray100, 16);
      mkRect(p, SIDE+12, contentY+14, 36, 36, C.black, 18);
      await mkTxtAuto(p, rv.initials, SIDE+12+18, contentY+32, 13, 600, C.accent, 'center');
      await mkTxt(p, rv.name, SIDE+58, contentY+14, CW-80, 14, 600, C.black);
      await mkTxt(p, rv.obj,  SIDE+58, contentY+32, CW-80, 12, 400, C.gray400);
      var stars = '';
      for (var si = 0; si < rv.stars; si++) stars += '★';
      await mkTxt(p, stars, SIDE+12, contentY+58, 80, 13, 400, { r:0.95, g:0.77, b:0.20 });
      var textY = contentY + 58 + 16 + 8;
      var textH = revH - (textY - contentY) - 12;
      if (textH > 0)
        await mkTxt(p, rv.text, SIDE+12, textY, CW-24, 13, 400, C.gray600, 'left', 19);
      contentY += revH + 12;
    }
  }

  homeBar(p);
}

var STYLES = {
  scandi: {
    num: '1 / 2',
    nameLines: 'Скан\nди\nнав\nский',
    tags: ['Светло','Дерево','Уют'],
    colors: [
      {r:0.96,g:0.94,b:0.91}, {r:0.91,g:0.87,b:0.81},
      {r:0.83,g:0.77,b:0.69}, {r:0.79,g:0.73,b:0.60},
      {r:0.66,g:0.56,b:0.44}, {r:0.42,g:0.31,b:0.25}
    ]
  },
  loft: {
    num: '2 / 2',
    nameLines: 'Лофт',
    tags: ['Кирпич','Металл','Индустрия'],
    colors: [
      {r:0.75,g:0.72,b:0.70}, {r:0.60,g:0.56,b:0.52},
      {r:0.47,g:0.42,b:0.38}, {r:0.35,g:0.30,b:0.27},
      {r:0.24,g:0.19,b:0.16}, {r:0.12,g:0.09,b:0.08}
    ]
  }
};

figma.ui.onmessage = async function(msg) {
  var screens = [
    { name:'01 · Старт',                    fn: async function(p){ await buildSplash(p); } },
    { name:'02 · Скандинавский',            fn: async function(p){ await buildStyleSwipe(p, STYLES.scandi, null); } },
    { name:'03 · Скандинавский — нравится', fn: async function(p){ await buildStyleSwipe(p, STYLES.scandi, 'like'); } },
    { name:'04 · Лофт',                     fn: async function(p){ await buildStyleSwipe(p, STYLES.loft, null); } },
    { name:'05 · Лофт — не нравится',       fn: async function(p){ await buildStyleSwipe(p, STYLES.loft, 'nope'); } },
    { name:'06 · Как принимаете решения',   fn: async function(p){ await buildBehavior(p); } },
    { name:'07 · Бюджет',                   fn: async function(p){ await buildBudget(p); } },
    { name:'08 · Площадь',                  fn: async function(p){ await buildArea(p); } },
    { name:'09 · Что важно',                fn: async function(p){ await buildFeatures(p); } },
    { name:'10 · Карточка мастера',         fn: async function(p){ await buildMatch(p); } },
    { name:'11 · Профиль — работы',         fn: async function(p){ await buildProfile(p, 'works'); } },
    { name:'12 · Профиль — отзывы',         fn: async function(p){ await buildProfile(p, 'reviews'); } }
  ];

  var COLS = 4, GAP = 48, bW = W+28, bH = H+24;
  for (var i=0; i<screens.length; i++) {
    var col = i%COLS, row = Math.floor(i/COLS);
    var frame = figma.createFrame();
    frame.name = screens[i].name;
    frame.resize(W, H);
    frame.x = col*(bW+GAP);
    frame.y = row*(bH+GAP);
    frame.clipsContent = true;
    sf(frame, C.white);
    figma.currentPage.appendChild(frame);
    await screens[i].fn(frame);
  }

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  figma.notify('✓ 12 экранов готовы!');
};