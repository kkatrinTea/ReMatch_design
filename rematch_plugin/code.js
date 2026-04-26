figma.showUI(__html__, { width: 360, height: 740 });

var W = 360;
var H = 800;

var C = {
  black:   { r:0.004, g:0.004, b:0.004 },
  white:   { r:1,     g:1,     b:1     },
  accent:  { r:0.788, g:0.961, b:0.259 },
  accentL: { r:0.878, g:0.980, b:0.600 }, // светло-зелёный фон кнопки нравится
  gray100: { r:0.969, g:0.965, b:0.953 },
  gray200: { r:0.878, g:0.859, b:0.902 },
  gray400: { r:0.420, g:0.420, b:0.431 },
  gray600: { r:0.231, g:0.231, b:0.243 },
  green:   { r:0.133, g:0.773, b:0.369 },
  red:     { r:0.945, g:0.290, b:0.290 },
  bg:      { r:0.949, g:0.937, b:0.918 },
  cream:   { r:0.980, g:0.984, b:0.996 }
};

var FONTS = {
  regular:   { family:'Unbounded', style:'Regular'  },
  medium:    { family:'Unbounded', style:'Medium'    },
  semibold:  { family:'Unbounded', style:'SemiBold'  },
  bold:      { family:'Unbounded', style:'Bold'      },
  extrabold: { family:'Unbounded', style:'ExtraBold' },
  black:     { family:'Unbounded', style:'Black'     }
};
var LOADED = {};
async function lf(f) {
  var k = f.family+'_'+f.style;
  if (!LOADED[k]) { await figma.loadFontAsync(f); LOADED[k]=true; }
}
function wf(w) {
  if (w>=900) return FONTS.black;
  if (w>=800) return FONTS.extrabold;
  if (w>=700) return FONTS.bold;
  if (w>=600) return FONTS.semibold;
  if (w>=500) return FONTS.medium;
  return FONTS.regular;
}

function hex2rgb(hex) {
  var n=parseInt(hex.replace('#',''),16);
  return {r:((n>>16)&255)/255,g:((n>>8)&255)/255,b:(n&255)/255};
}
function sf(node,color,opacity) {
  var f={type:'SOLID',color:color};
  if (opacity!==undefined) f.opacity=opacity;
  node.fills=[f];
}
function rect(parent,x,y,w,h,color,r,opacity) {
  var el=figma.createRectangle();
  el.x=x; el.y=y; el.resize(w,h);
  if (r) el.cornerRadius=r;
  sf(el,color,opacity);
  if (parent) parent.appendChild(el);
  return el;
}
function mkFrame(parent,x,y,w,h,color,r) {
  var f=figma.createFrame();
  f.x=x; f.y=y; f.resize(w,h);
  if (r) f.cornerRadius=r;
  f.clipsContent=true;
  sf(f,color||C.white);
  if (parent) parent.appendChild(f);
  return f;
}

// Текст с точным вертикальным центрированием
// cy = центр по Y, sz = fontSize
async function txtC(parent,str,x,cy,w,sz,weight,color,opts) {
  opts=opts||{};
  var fn=wf(weight); await lf(fn);
  var t=figma.createText();
  t.fontName=fn; t.characters=String(str); t.fontSize=sz;
  t.x=x;
  if (w){t.textAutoResize='HEIGHT'; t.resize(w,t.height);}
  // Центрируем: y = cy - height/2
  t.y=cy - t.height/2;
  if (opts.align) t.textAlignHorizontal=opts.align.toUpperCase();
  if (opts.lineH) t.lineHeight={value:opts.lineH,unit:'PIXELS'};
  if (opts.ls)    t.letterSpacing={value:opts.ls,unit:'PERCENT'};
  sf(t,color,opts.opacity);
  if (parent) parent.appendChild(t);
  return t;
}

// Обычный текст с top-y
async function txt(parent,str,x,y,w,sz,weight,color,opts) {
  opts=opts||{};
  var fn=wf(weight); await lf(fn);
  var t=figma.createText();
  t.fontName=fn; t.characters=String(str); t.fontSize=sz;
  t.x=x; t.y=y;
  if (w){t.textAutoResize='HEIGHT'; t.resize(w,t.height);}
  if (opts.align) t.textAlignHorizontal=opts.align.toUpperCase();
  if (opts.lineH) t.lineHeight={value:opts.lineH,unit:'PIXELS'};
  if (opts.ls)    t.letterSpacing={value:opts.ls,unit:'PERCENT'};
  sf(t,color,opts.opacity);
  if (parent) parent.appendChild(t);
  return t;
}

function gradRect(parent,x,y,w,h,fromA,toA,r) {
  var el=figma.createRectangle();
  el.x=x; el.y=y; el.resize(w,h);
  if (r) el.cornerRadius=r;
  el.fills=[{
    type:'GRADIENT_LINEAR',
    gradientTransform:[[0,0,0],[0,1,0]],
    gradientStops:[
      {position:0,color:{r:0.004,g:0.004,b:0.004,a:fromA}},
      {position:1,color:{r:0.004,g:0.004,b:0.004,a:toA}}
    ]
  }];
  if (parent) parent.appendChild(el);
  return el;
}

function grp(name,nodes,parent) {
  if (!nodes||nodes.length===0) return null;
  var g=figma.group(nodes,parent||nodes[0].parent);
  g.name=name;
  return g;
}

// ─── Статус-бар ──────────────────────────────────────────────────────────────
async function statusBar(parent,dark) {
  var clr=dark?C.black:C.white;
  var nodes=[];
  nodes.push(await txt(parent,'9:41',16,6,60,11,700,clr));
  var bx=W-72;
  for (var i=0;i<3;i++){var bh=4+i*3; nodes.push(rect(parent,bx+i*8,8+(10-bh),5,bh,clr,1));}
  nodes.push(rect(parent,bx+28,12,8,5,clr,1));
  nodes.push(rect(parent,bx+26,9,12,3,clr,1));
  var bat=figma.createRectangle();
  bat.resize(16,8);bat.x=bx+44;bat.y=8;bat.cornerRadius=2;
  bat.strokes=[{type:'SOLID',color:clr}];bat.strokeWeight=1.5;bat.fills=[];
  parent.appendChild(bat);nodes.push(bat);
  nodes.push(rect(parent,bx+46,10,9,4,clr,1));
  nodes.push(rect(parent,bx+61,10,2,4,clr,1));
  grp('status-bar',nodes,parent);
  return 24;
}

// ─── Прогресс-бар ────────────────────────────────────────────────────────────
function progressBar(parent,total,done,y) {
  var gap=4,segW=(W-32-gap*(total-1))/total;
  var nodes=[];
  for (var i=0;i<total;i++)
    nodes.push(rect(parent,16+i*(segW+gap),y,segW,3,i<done?C.black:C.gray200,2));
  grp('progress-bar',nodes,parent);
  return y+3+16;
}

// ─── Навбар ──────────────────────────────────────────────────────────────────
function navBar(parent) {
  var el=rect(parent,W/2-20,H-20,40,4,C.gray200,2);
  grp('nav-bar',[el],parent);
}

// ─── CTA-кнопка ──────────────────────────────────────────────────────────────
async function ctaBtn(parent,label,y,bg,fg) {
  bg=bg||C.black; fg=fg||C.white;
  var nodes=[];
  var btnH=52;
  nodes.push(rect(parent,16,y,W-32,btnH,bg,26));
  // Текст строго по центру кнопки
  nodes.push(await txtC(parent,label,16,y+btnH/2,W-32,10,700,fg,{align:'center'}));
  grp('cta-btn',nodes,parent);
  return y+btnH;
}

// ─── Кнопки свайпа ───────────────────────────────────────────────────────────
// Левая: белый круг + крестик (✕) красным — мягкий, не агрессивный
// Правая: светло-зелёный круг + чёрная галочка по центру
async function swipeButtons(parent,bY,rightLabel) {
  rightLabel=rightLabel||'нравится';
  var cx=W/2;
  var btnSz=64; // диаметр кнопки
  var nodes=[];

  // ── Не нравится ──────────────────────────────────────────────────────────
  var nlX=cx-96, nlY=bY;
  var nl=rect(parent,nlX,nlY,btnSz,btnSz,C.white,btnSz/2);
  nl.strokes=[{type:'SOLID',color:C.gray200}];nl.strokeWeight=1.5;
  nodes.push(nl);
  // Крестик строго по центру кнопки
  nodes.push(await txtC(parent,'✕',nlX,nlY+btnSz/2,btnSz,20,700,C.gray400,{align:'center'}));
  nodes.push(await txt(parent,'не моё',nlX-4,nlY+btnSz+8,btnSz+8,8,500,C.gray400,{align:'center'}));

  // ── Пропустить (центр) ───────────────────────────────────────────────────
  var skipSz=36;
  var skipX=cx-skipSz/2, skipY=bY+btnSz/2-skipSz/2;
  var skip=rect(parent,skipX,skipY,skipSz,skipSz,C.gray100,skipSz/2);
  nodes.push(skip);
  nodes.push(await txtC(parent,'↺',skipX,skipY+skipSz/2,skipSz,14,500,C.gray400,{align:'center'}));

  // ── Нравится — светло-зелёный фон, чёрная галочка ────────────────────────
  var lkX=cx+32, lkY=bY;
  var lk=rect(parent,lkX,lkY,btnSz,btnSz,C.accentL,btnSz/2);
  lk.strokes=[{type:'SOLID',color:C.accent}];lk.strokeWeight=1.5;
  nodes.push(lk);
  // Галочка строго по центру
  nodes.push(await txtC(parent,'✓',lkX,lkY+btnSz/2,btnSz,22,700,C.black,{align:'center'}));
  nodes.push(await txt(parent,rightLabel,lkX,lkY+btnSz+8,btnSz,8,500,C.gray400,{align:'center'}));

  grp('swipe-buttons',nodes,parent);
}

// ─────────────────────────────────────────────────────────────────────────────
// SPLASH (экран 1)
// ─────────────────────────────────────────────────────────────────────────────
async function buildSplash(p) {
  sf(p,C.cream);
  var y=await statusBar(p,true);

  // ── Дизайнерские прямоугольники в правом верхнем углу ────────────────────
  var decoNodes=[];
  // Несколько прямоугольников разного размера, сдвинутых в угол
  var deco=[
    {x:W-80, y:28,  w:64,  h:64,  c:C.accent,  r:12},
    {x:W-52, y:36,  w:36,  h:36,  c:C.black,   r:8},
    {x:W-96, y:52,  w:28,  h:48,  c:C.gray200, r:8},
    {x:W-68, y:24,  w:18,  h:18,  c:C.gray400, r:4, op:0.4},
    {x:W-38, y:20,  w:20,  h:54,  c:C.black,   r:6, op:0.15},
  ];
  for (var di=0;di<deco.length;di++){
    var d=deco[di];
    decoNodes.push(rect(p,d.x,d.y,d.w,d.h,d.c,d.r,d.op));
  }
  grp('deco-corner',decoNodes,p);

  y+=32;
  // ── Лого ─────────────────────────────────────────────────────────────────
  var logoNodes=[];
  var lb=rect(p,16,y,44,44,C.black,12);
  logoNodes.push(lb);
  logoNodes.push(await txtC(p,'R',16,y+22,44,16,900,C.accent,{align:'center'}));
  logoNodes.push(await txt(p,'REMATCH',68,y+14,180,13,800,C.black,{ls:4}));
  grp('logo',logoNodes,p);
  y+=44+72;

  // ── Hero текст ───────────────────────────────────────────────────────────
  var heroNodes=[];
  heroNodes.push(await txt(p,'Найди своего\nдизайнера\nза 2 минуты',16,y,W-32,24,900,C.black,{lineH:40}));
  heroNodes.push(rect(p,16,y+128,60,4,C.accent,2));
  grp('hero-text',heroNodes,p);
  y+=128+4+28;

  var subNode=await txt(p,'Покажи интерьеры которые нравятся — мы подберём дизайнеров с похожими реализованными проектами',16,y,W-32,10,400,C.gray400,{lineH:17});
  grp('subtitle',[subNode],p);

  await ctaBtn(p,'Начать — это бесплатно',H-48-24-52-32);
  var loginNode=await txt(p,'Уже есть аккаунт? Войти',16,H-48-24-52-32+62,W-32,10,400,C.gray400,{align:'center'});
  grp('auth-link',[loginNode],p);
  navBar(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// СТИЛИ — свайп
// ─────────────────────────────────────────────────────────────────────────────
var STYLES=[
  {name:'Скандинавский',desc:'Белый, дерево,\nнатуральные материалы',tags:['Светло','Дерево','Уют'],          c:['#f5f0e8','#e8ddd0','#d4c4b0','#c9b99a','#a89070','#6b5040']},
  {name:'Минимализм',   desc:'Чистые линии,\nнейтральные тона',      tags:['Лаконично','Чисто','Функционально'],c:['#f8f8f8','#e8e8e8','#d0d0d0','#b0b0b0','#787878','#2c2c2c']},
  {name:'Лофт',         desc:'Кирпич, металл,\nоткрытые конструкции',tags:['Кирпич','Металл','Индустрия'],    c:['#c4bdb5','#a09890','#786050','#584840','#3c3028','#1e1814']},
  {name:'Современный',  desc:'Актуальные формы,\nяркие акценты',     tags:['Актуально','Акценты','Тех'],      c:['#f0f4f8','#c8d8e8','#7090b0','#3a5f80','#1a3a58','#c9f542']},
  {name:'Классика',     desc:'Симметрия, лепнина,\nблагородные мат.',tags:['Симметрия','Золото','Роскошь'],   c:['#f5efe0','#e8d5a8','#c8a84b','#8b7030','#4a3a18','#1a1208']},
  {name:'Эко / Бохо',   desc:'Растения,\nнатуральные текстуры',      tags:['Природа','Текстуры','Тепло'],     c:['#e8f0e0','#c8d8a8','#98b870','#6a9048','#3d6028','#c4714a']},
  {name:'Japandi',      desc:'Японский минимализм\n+ скандинавский уют',tags:['Ваби-саби','Тишина','Природа'],c:['#f0ece4','#ddd5c8','#b8a88c','#8c7860','#5c4838','#2c2018']},
  {name:'Арт-деко',     desc:'Геометрия, контраст,\nзолото и роскошь',tags:['Геометрия','Контраст','Роскошь'],c:['#2a2010','#4a3a20','#c8a84b','#e8c870','#f0d890','#f8f0e0']}
];

async function buildStyleSwipe(p,idx,state) {
  state=state||'neutral';
  var st=STYLES[idx];
  sf(p,C.white);

  var y=await statusBar(p,true);
  y+=16;

  var headerNodes=[];
  headerNodes.push(await txt(p,(idx+1)+' / '+STYLES.length,0,y,W,8,600,C.gray400,{align:'center',ls:3}));
  y+=8+14;
  headerNodes.push(await txt(p,'Нравится этот стиль?',16,y,W-32,13,800,C.black,{lineH:20}));
  grp('header',headerNodes,p);
  y+=20+18;

  var bY=H-48-24-64;
  var tagsH=36, gap_card=14;
  var cH=bY-gap_card-tagsH-gap_card-y;
  var cW=W-32;

  var card=mkFrame(p,16,y,cW,cH,hex2rgb(st.c[0]),20);

  var cols=3,rows=2,g=3;
  var bW=(cW-g*(cols+1))/cols;
  var bH=(cH-g*(rows+1))/rows;
  var moodNodes=[];
  for (var r=0;r<rows;r++)
    for (var c=0;c<cols;c++)
      moodNodes.push(rect(card,g+c*(bW+g),g+r*(bH+g),bW,bH,hex2rgb(st.c[Math.min(r*cols+c,st.c.length-1)]),12));
  grp('moodboard',moodNodes,card);
  gradRect(card,0,cH-130,cW,130,0,0.88);

  if (state==='like') {
    var lb2=rect(card,14,14,114,28,C.accent,8);
    var lt=await txtC(card,'✓  НРАВИТСЯ',14,28,114,9,700,C.black,{align:'center'});
    grp('badge-like',[lb2,lt],card);
  } else if (state==='nope') {
    var nb=rect(card,cW-128,14,114,28,C.white,8);
    nb.strokes=[{type:'SOLID',color:C.gray200}];nb.strokeWeight=1;
    var nt=await txtC(card,'✕  НЕ МОЁ',cW-128,28,114,9,700,C.gray400,{align:'center'});
    grp('badge-nope',[nb,nt],card);
  }

  var cardTextNodes=[];
  cardTextNodes.push(await txt(card,st.name,16,cH-68,cW-32,15,800,C.white,{lineH:24}));
  cardTextNodes.push(await txt(card,st.desc,16,cH-40,cW-32,9,400,C.white,{opacity:0.75,lineH:14}));
  grp('card-text',cardTextNodes,card);
  grp('style-card',[card],p);
  y+=cH+gap_card;

  var tgNodes=[];
  var tgX=16;
  for (var ti=0;ti<st.tags.length;ti++){
    var tgW=st.tags[ti].length*7+24;
    var tg=rect(p,tgX,y,tgW,28,C.white,14);
    tg.strokes=[{type:'SOLID',color:C.gray200}];tg.strokeWeight=1;
    tgNodes.push(tg);
    tgNodes.push(await txtC(p,st.tags[ti],tgX,y+14,tgW,9,500,C.gray400,{align:'center'}));
    tgX+=tgW+8;
  }
  grp('tags',tgNodes,p);
  await swipeButtons(p,bY,'нравится');
  navBar(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// ПОВЕДЕНИЕ — шаг 1/5
// ─────────────────────────────────────────────────────────────────────────────
async function buildBehavior(p) {
  sf(p,C.white);
  var y=await statusBar(p,true);
  y+=8;
  y=progressBar(p,5,1,y);
  y+=16;

  var hdrNodes=[];
  hdrNodes.push(await txt(p,'ШАГ 1 ИЗ 5',16,y,W-32,8,600,C.gray400,{ls:4}));
  y+=8+12;
  hdrNodes.push(await txt(p,'Как вы принимаете\nрешения?',16,y,W-32,14,800,C.black,{lineH:22}));
  y+=44+10;
  hdrNodes.push(await txt(p,'Выберите одно — то, что ближе',16,y,W-32,9,400,C.gray400));
  grp('header',hdrNodes,p);
  y+=9+18;

  // Однострочный текст в кнопках (короткие подписи)
  var items=[
    {icon:'🖼',txt:'Хожу по шоурумам'},
    {icon:'📱',txt:'Pinterest / Instagram'},
    {icon:'💬',txt:'Советуюсь с другими'},
    {icon:'🔍',txt:'Долго сравниваю'},
    {icon:'⚡',txt:'Решаю по ощущению'}
  ];
  var listNodes=[];
  var rowH=54;
  for (var i=0;i<items.length;i++){
    var sel=i===1;
    var row=rect(p,16,y,W-32,rowH,sel?C.gray100:C.white,12);
    row.strokes=[{type:'SOLID',color:sel?C.black:C.gray200}];row.strokeWeight=1.5;
    listNodes.push(row);
    listNodes.push(await txtC(p,items[i].icon,28,y+rowH/2,24,16,400,C.black,{align:'center'}));
    listNodes.push(await txtC(p,items[i].txt,60,y+rowH/2,W-60-32-16-24,10,500,C.black,{align:'left'}));
    if (sel){
      var cb=rect(p,W-16-16-24,y+rowH/2-12,24,24,C.black,6);
      listNodes.push(cb);
      listNodes.push(await txtC(p,'✓',W-16-16-24,y+rowH/2,24,10,800,C.white,{align:'center'}));
    }
    y+=rowH+8;
  }
  grp('options-list',listNodes,p);
  await ctaBtn(p,'Далее →',H-48-20-52);
  navBar(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// БЮДЖЕТ — шаг 2/5
// ─────────────────────────────────────────────────────────────────────────────
async function buildBudget(p) {
  sf(p,C.white);
  var y=await statusBar(p,true);
  y+=8;
  y=progressBar(p,5,2,y);
  y+=16;

  var hdrNodes=[];
  hdrNodes.push(await txt(p,'ШАГ 2 ИЗ 5',16,y,W-32,8,600,C.gray400,{ls:4}));
  y+=8+12;
  hdrNodes.push(await txt(p,'Бюджет на дизайн-проект',16,y,W-32,14,800,C.black,{lineH:22}));
  y+=22+10;
  hdrNodes.push(await txt(p,'Поможет подобрать мастера нужного уровня',16,y,W-32,9,400,C.gray400));
  grp('header',hdrNodes,p);
  y+=9+18;

  var list=[
    {p:'до 80 000 ₽',        d:'Планировка и спецификации'},
    {p:'80 000 – 150 000 ₽', d:'Полный проект, 3D'},
    {p:'150 000 – 300 000 ₽',d:'Проект с авторским надзором'},
    {p:'300 000 – 600 000 ₽',d:'Комплексный под ключ'},
    {p:'от 600 000 ₽',       d:'Премиум, эксклюзив'},
    {p:'Пока не знаю',        d:'Расскажем о вариантах'}
  ];
  var listNodes=[];
  var rowH=58;
  for (var i=0;i<list.length;i++){
    var sel=i===2;
    var row=rect(p,16,y,W-32,rowH,sel?C.gray100:C.white,12);
    row.strokes=[{type:'SOLID',color:sel?C.black:C.gray200}];row.strokeWeight=1.5;
    listNodes.push(row);
    listNodes.push(await txt(p,list[i].p,28,y+12,W-60-32,10,700,C.black));
    listNodes.push(await txt(p,list[i].d,28,y+28,W-60-32,9,400,C.gray400));
    if (sel){
      var cb=rect(p,W-16-16-24,y+rowH/2-12,24,24,C.black,6);
      listNodes.push(cb);
      listNodes.push(await txtC(p,'✓',W-16-16-24,y+rowH/2,24,10,800,C.white,{align:'center'}));
    }
    y+=rowH+8;
  }
  grp('budget-list',listNodes,p);
  navBar(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// ПЛОЩАДЬ — шаг 3/5
// ─────────────────────────────────────────────────────────────────────────────
async function buildArea(p) {
  sf(p,C.white);
  var y=await statusBar(p,true);
  y+=8;
  y=progressBar(p,5,3,y);
  y+=16;

  var hdrNodes=[];
  hdrNodes.push(await txt(p,'ШАГ 3 ИЗ 5',16,y,W-32,8,600,C.gray400,{ls:4}));
  y+=8+12;
  hdrNodes.push(await txt(p,'Площадь квартиры',16,y,W-32,14,800,C.black,{lineH:22}));
  y+=22+10;
  hdrNodes.push(await txt(p,'Примерно — для подбора специализации',16,y,W-32,9,400,C.gray400));
  grp('header',hdrNodes,p);
  y+=9+24;

  var areas=[{n:'до 35 м²',l:'студия'},{n:'35–55 м²',l:'1–2 комн.'},{n:'55–80 м²',l:'2–3 комн.'},{n:'от 80 м²',l:'большая'}];
  var cW=(W-32-10)/2, cellH=104;
  var gridNodes=[];
  for (var i=0;i<4;i++){
    var col=i%2,row=Math.floor(i/2);
    var cx=16+col*(cW+10),cy=y+row*(cellH+10);
    var sel=i===1;
    var cell=rect(p,cx,cy,cW,cellH,sel?C.gray100:C.white,14);
    cell.strokes=[{type:'SOLID',color:sel?C.black:C.gray200}];cell.strokeWeight=1.5;
    gridNodes.push(cell);
    gridNodes.push(await txtC(p,areas[i].n,cx+8,cy+cellH/2-8,cW-16,13,800,C.black,{align:'center'}));
    gridNodes.push(await txtC(p,areas[i].l,cx+8,cy+cellH/2+10,cW-16,9,500,C.gray400,{align:'center'}));
    if (sel){
      var cb=rect(p,cx+cW-8-22,cy+8,22,22,C.black,6);
      gridNodes.push(cb);
      gridNodes.push(await txtC(p,'✓',cx+cW-8-22,cy+19,22,9,800,C.white,{align:'center'}));
    }
  }
  grp('area-grid',gridNodes,p);
  navBar(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// КРИТЕРИИ — шаг 4/5
// ─────────────────────────────────────────────────────────────────────────────
async function buildFeatures(p) {
  sf(p,C.white);
  var y=await statusBar(p,true);
  y+=8;
  y=progressBar(p,5,4,y);
  y+=16;

  var hdrNodes=[];
  hdrNodes.push(await txt(p,'ШАГ 4 ИЗ 5',16,y,W-32,8,600,C.gray400,{ls:4}));
  y+=8+12;
  hdrNodes.push(await txt(p,'Что важно в интерьере?',16,y,W-32,14,800,C.black,{lineH:22}));
  y+=22+10;
  hdrNodes.push(await txt(p,'Выберите всё, что важно для вас',16,y,W-32,9,400,C.gray400));
  grp('header',hdrNodes,p);
  y+=9+18;

  var tags=[
    {t:'хранение',s:true},{t:'свет',s:false},
    {t:'эргономика',s:true},{t:'эко',s:false},
    {t:'акценты',s:true},{t:'простор',s:false},
    {t:'уют',s:true},{t:'минимум',s:false},
    {t:'рабочая зона',s:false},{t:'детская',s:false},
    {t:'текстиль',s:false},{t:'выс. потол.',s:false}
  ];
  var rx=16,ry=y,tagNodes=[];
  for (var i=0;i<tags.length;i++){
    var tw=tags[i].t.length*7+24;
    if (rx+tw>W-16){rx=16;ry+=40;}
    var te=rect(p,rx,ry,tw,32,tags[i].s?C.black:C.white,16);
    te.strokes=[{type:'SOLID',color:tags[i].s?C.black:C.gray200}];te.strokeWeight=1.5;
    tagNodes.push(te);
    tagNodes.push(await txtC(p,tags[i].t,rx,ry+16,tw,9,tags[i].s?600:500,tags[i].s?C.white:C.black,{align:'center'}));
    rx+=tw+8;
  }
  grp('tags-grid',tagNodes,p);
  await ctaBtn(p,'Показать мастеров →',H-48-20-52,C.accent,C.black);
  navBar(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// МАСТЕРА
// ─────────────────────────────────────────────────────────────────────────────
var MASTERS=[
  {
    initials:'АС',
    name:'Алина Смирнова',
    city:'Москва', exp:'6 лет',
    rating:'4.9', reviews:'127 отзывов', match:'94',
    price:'4 500 ₽/м²', projects:'47',
    why:['светлые тона','минимализм','натур. матер.','japandi'],
    reviews_list:[
      {av:'КМ',name:'Ксения М.',obj:'квартира 68 м²',stars:'★★★★★',text:'Алина поняла нас с первого раза — показала реальные проекты в нашем стиле. Результат превзошёл ожидания.'},
      {av:'ДП',name:'Дмитрий П.',obj:'апартаменты 55 м²',stars:'★★★★★',text:'Очень детальный проект, всё продумано до мелочей. Работать было комфортно и приятно.'},
      {av:'АВ',name:'Анна В.',obj:'дом 110 м²',stars:'★★★★☆',text:'Хороший результат, небольшие правки по срокам, но качество на высоте.'}
    ],
    bg:['#f0ece4','#ddd5c8','#b8a88c','#8c7860','#e8ddd0','#f5f0e8'],
    idx:1
  },
  {
    initials:'МВ',
    name:'Михаил Ветров',
    city:'Санкт-Петербург', exp:'4 года',
    rating:'4.8', reviews:'89 отзывов', match:'87',
    price:'3 800 ₽/м²', projects:'31',
    why:['лофт-стиль','тёмные тона','открытые планировки','современный'],
    reviews_list:[
      {av:'ИС',name:'Иван С.',obj:'студия 38 м²',stars:'★★★★★',text:'Михаил отлично чувствует лофт-стиль. Всё сделал быстро и именно так, как я хотел.'},
      {av:'ЕА',name:'Елена А.',obj:'квартира 72 м²',stars:'★★★★★',text:'Результат отличный, авторский надзор прошёл гладко.'},
      {av:'РН',name:'Роман Н.',obj:'офис 90 м²',stars:'★★★★☆',text:'Профессионал своего дела. Рекомендую всем кто любит индустриальный стиль.'}
    ],
    bg:['#e8e8e8','#d0d0d0','#b0b0b0','#c8d8e8','#7090b0','#3a5f80'],
    idx:2
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// КАРТОЧКА МАСТЕРА (результат)
// ─────────────────────────────────────────────────────────────────────────────
async function buildResult(p,mi) {
  var m=MASTERS[mi];
  sf(p,C.white);

  var y=await statusBar(p,true);
  y+=18;

  var hdrNodes=[];
  hdrNodes.push(await txt(p,'СОВПАДЕНИЯ',16,y,130,8,600,C.gray400,{ls:4}));
  var total=MASTERS.length;
  for (var di=0;di<total;di++)
    hdrNodes.push(rect(p,W-16-(total-di)*18,y,12,12,di<m.idx?C.accent:C.gray200,6));
  grp('header',hdrNodes,p);
  y+=12+18;

  var bY=H-48-28-64;   // фиксированный Y кнопок
  var cardGap=28;       // отступ между карточкой и кнопками
  var cH=bY-cardGap-y;
  var cW=W-32;

  var card=mkFrame(p,16,y,cW,cH,C.white,20);
  card.effects=[{type:'DROP_SHADOW',color:{r:0,g:0,b:0,a:0.08},offset:{x:0,y:4},radius:24,spread:0,visible:true,blendMode:'NORMAL'}];

  var mH=Math.round(cH*0.42);
  var cols=3,g=3;
  var bW=(cW-g*(cols+1))/cols;
  var moodNodes=[];
  for (var ci=0;ci<cols;ci++)
    moodNodes.push(rect(card,g+ci*(bW+g),g,bW,mH-g*2,hex2rgb(m.bg[ci]),12));
  moodNodes.push(rect(card,g,mH-g,cW-g*2,36,hex2rgb(m.bg[3]),0));
  grp('moodboard',moodNodes,card);

  var badgeNodes=[];
  badgeNodes.push(rect(card,14,14,120,26,C.accent,13));
  badgeNodes.push(await txtC(card,m.match+'% совпадение',14,27,120,8,700,C.black,{align:'center'}));
  grp('badge',badgeNodes,card);

  var infoY=mH+36+18;
  var infoNodes=[];
  var av=rect(card,16,infoY,40,40,C.black,20);
  infoNodes.push(av);
  infoNodes.push(await txtC(card,m.initials,16,infoY+20,40,11,800,C.accent,{align:'center'}));
  // Имя — явно прописываем строку
  infoNodes.push(await txt(card,m.name,64,infoY+2,cW-64-16,11,800,C.black));
  infoNodes.push(await txt(card,m.city+' · '+m.exp,64,infoY+18,cW-64-16,9,400,C.gray400));
  infoNodes.push(await txt(card,'★ '+m.rating+'  '+m.reviews,64,infoY+32,cW-64-16,8,500,C.black));
  infoY+=40+18;

  infoNodes.push(rect(card,16,infoY,cW-32,1,C.gray200));
  infoY+=1+14;
  infoNodes.push(await txt(card,m.price,16,infoY,(cW-32)/2,12,800,C.black));
  infoNodes.push(await txt(card,m.projects+' проектов',cW/2,infoY,(cW-32)/2,11,600,C.gray400,{align:'right'}));
  infoNodes.push(await txt(card,'стоимость/м²',16,infoY+17,(cW-32)/2,7,400,C.gray400));
  infoY+=17+18+12;

  infoNodes.push(await txt(card,'ПОЧЕМУ СОВПАЛИ',16,infoY,200,7,700,C.gray400,{ls:4}));
  infoY+=7+10;
  var tgX=16;
  for (var wyi=0;wyi<m.why.length;wyi++){
    var wt=m.why[wyi];
    var wtW=wt.length*6+20;
    if (tgX+wtW>cW-16){tgX=16;infoY+=26;}
    infoNodes.push(rect(card,tgX,infoY,wtW,22,C.gray100,11));
    infoNodes.push(await txtC(card,wt,tgX,infoY+11,wtW,8,500,C.gray600,{align:'center'}));
    tgX+=wtW+6;
  }
  grp('card-info',infoNodes,card);
  grp('master-card',[card],p);

  var hintNodes=[];
  hintNodes.push(await txt(p,'← не подходит',16,bY-22,(W-32)/2,8,400,C.gray400));
  hintNodes.push(await txt(p,'написать →',W/2,bY-22,(W-32)/2,8,400,C.gray400,{align:'right'}));
  grp('swipe-hint',hintNodes,p);

  await swipeButtons(p,bY,'написать');
  navBar(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// ПРОФИЛЬ МАСТЕРА
// ─────────────────────────────────────────────────────────────────────────────
async function buildProfile(p,mi) {
  var m=MASTERS[mi];
  sf(p,C.white);

  // CTA-панель прибита к низу — рисуем её первой, чтобы знать Y
  var ctaPanelH=72;
  var ctaY=H-48-ctaPanelH; // Y верхней границы CTA-панели

  // ── CTA-панель (рисуем последней, но Y фиксируем сразу) ──────────────────
  // Отрисуем в конце, сейчас просто запомним Y

  // ── Герой ────────────────────────────────────────────────────────────────
  var heroH=210;
  var hero=mkFrame(p,0,0,W,heroH,C.black,0);
  var cols=3,g=3;
  var bW=(W-g*(cols+1))/cols;
  var heroImgNodes=[];
  for (var ci=0;ci<cols;ci++)
    heroImgNodes.push(rect(hero,g+ci*(bW+g),g,bW,heroH-g*2,hex2rgb(m.bg[ci]),8));
  grp('hero-images',heroImgNodes,hero);
  gradRect(hero,0,heroH-120,W,120,0,0.78);

  var backBtn=mkFrame(hero,16,36,34,34,C.black,17);
  sf(backBtn,C.black,0.45);
  await txtC(backBtn,'←',0,17,34,14,700,C.white,{align:'center'});
  grp('back-btn',[backBtn],hero);

  var badgeBg=rect(hero,16,heroH-44,180,28,C.accent,14);
  var badgeTxt=await txtC(hero,'● '+m.match+'% совпадение с вашим вкусом',16,heroH-30,180,8,700,C.black,{align:'center'});
  grp('hero-badge',[badgeBg,badgeTxt],hero);
  grp('hero-section',[hero],p);

  var y=heroH+20;
  var bx=16;

  // ── Имя + цена ────────────────────────────────────────────────────────────
  var nameNodes=[];
  nameNodes.push(await txt(p,m.name,bx,y,W-bx-16-100,15,800,C.black,{lineH:22}));
  nameNodes.push(await txt(p,m.price,W-16-100,y,100,12,700,C.black,{align:'right'}));
  nameNodes.push(await txt(p,'за м² проекта',W-16-100,y+17,100,8,400,C.gray400,{align:'right'}));
  y+=22+6;
  nameNodes.push(await txt(p,'📍 '+m.city+' · работает онлайн',bx,y,W-32,9,500,C.gray400));
  grp('name-price',nameNodes,p);
  y+=9+16;

  // ── Теги ─────────────────────────────────────────────────────────────────
  var tgNodes=[];
  var tgX=bx;
  for (var ti=0;ti<m.why.length;ti++){
    var tw=m.why[ti].length*6+20;
    var isSel=ti===0;
    var tge=rect(p,tgX,y,tw,28,isSel?C.accent:C.gray100,14);
    tgNodes.push(tge);
    tgNodes.push(await txtC(p,m.why[ti],tgX,y+14,tw,8,700,isSel?C.black:C.gray600,{align:'center'}));
    tgX+=tw+6;
  }
  grp('style-tags',tgNodes,p);
  y+=28+18;

  rect(p,0,y,W,1,C.gray200); y+=1+18;

  // ── Статистика ────────────────────────────────────────────────────────────
  var s3W=(W-32-12)/3,statH=68;
  var stats=[{v:m.projects,k:'проектов'},{v:m.exp,k:'опыт'},{v:'★ '+m.rating,k:'рейтинг'}];
  var statNodes=[];
  for (var si=0;si<3;si++){
    var sx=bx+si*(s3W+6);
    var sc=rect(p,sx,y,s3W,statH,C.white,12);
    sc.strokes=[{type:'SOLID',color:C.gray200}];sc.strokeWeight=1;
    statNodes.push(sc);
    // Значение строго по центру ячейки
    statNodes.push(await txtC(p,stats[si].v,sx+4,y+statH/2-7,s3W-8,14,800,C.black,{align:'center'}));
    statNodes.push(await txtC(p,stats[si].k,sx+4,y+statH/2+10,s3W-8,7,500,C.gray400,{align:'center',ls:3}));
  }
  grp('stats',statNodes,p);
  y+=statH+18;

  rect(p,0,y,W,1,C.gray200); y+=1+18;

  // ── Реальные проекты — одна строка-карусель ───────────────────────────────
  var secLbl=await txt(p,'РЕАЛЬНЫЕ ПРОЕКТЫ',bx,y,W-32,8,700,C.gray400,{ls:5});
  grp('section-label',[secLbl],p);
  y+=8+12;

  // Горизонтальная карусель — 6 плиток в одну строку
  // Первые 3 видны в экране, остальные намекают на прокрутку (обрезаются)
  var phW=100,phH=76,phGap=10;
  var phLabels=['Гостиная · 42 м²','Спальня · 18 м²','Кухня · 14 м²','Прихожая · 8 м²','Ванная · 6 м²','Балкон · 5 м²'];
  var carouselNodes=[];
  for (var pi=0;pi<6;pi++){
    var phX=bx+pi*(phW+phGap);
    carouselNodes.push(rect(p,phX,y,phW,phH,hex2rgb(m.bg[pi%m.bg.length]),10));
    carouselNodes.push(await txt(p,phLabels[pi],phX,y+phH+5,phW,7,500,C.gray400,{align:'center'}));
  }
  // Индикатор «ещё» — текст справа
  carouselNodes.push(await txt(p,'→ ещё',W-48,y+phH/2-5,40,8,600,C.gray400,{align:'right'}));
  grp('projects-carousel',carouselNodes,p);
  y+=phH+18+12;

  rect(p,0,y,W,1,C.gray200); y+=1+18;

  // ── Отзывы ───────────────────────────────────────────────────────────────
  var revSecLbl=await txt(p,'ОТЗЫВЫ',bx,y,W-32,8,700,C.gray400,{ls:5});
  grp('section-label-reviews',[revSecLbl],p);
  y+=8+12;

  var revNodes=[];
  for (var ri=0;ri<m.reviews_list.length;ri++){
    var rv=m.reviews_list[ri];
    var revH=102;
    var revCard=rect(p,bx,y,W-32,revH,C.white,14);
    revCard.strokes=[{type:'SOLID',color:C.gray200}];revCard.strokeWeight=0.5;
    revNodes.push(revCard);
    var rav=rect(p,bx+12,y+14,30,30,C.black,15);
    revNodes.push(rav);
    revNodes.push(await txtC(p,rv.av,bx+12,y+29,30,10,700,C.accent,{align:'center'}));
    revNodes.push(await txt(p,rv.name+' · '+rv.obj,bx+50,y+14,W-32-50-12,9,700,C.black));
    revNodes.push(await txt(p,rv.stars,bx+50,y+28,60,9,400,C.black));
    revNodes.push(await txt(p,rv.text,bx+12,y+52,W-32-24,9,400,C.gray400,{lineH:14}));
    y+=revH+10;
  }
  grp('reviews',revNodes,p);
  y+=8;

  rect(p,0,y,W,1,C.gray200); y+=1+18;

  // ── О мастере ─────────────────────────────────────────────────────────────
  var factsLbl=await txt(p,'О МАСТЕРЕ',bx,y,W-32,8,700,C.gray400,{ls:5});
  grp('section-label-facts',[factsLbl],p);
  y+=8+12;

  var facts=['Срок дизайн-проекта: 3–5 недель','200+ клиентов по всей России','Первая консультация — бесплатно','Топ-10 Houzz Russia 2023'];
  var factIcons=['⏱','👥','🎁','🏆'];
  var factNodes=[];
  for (var fi=0;fi<facts.length;fi++){
    var fic=rect(p,bx,y+fi*40,28,28,C.white,8);
    fic.strokes=[{type:'SOLID',color:C.gray200}];fic.strokeWeight=0.5;
    factNodes.push(fic);
    factNodes.push(await txtC(p,factIcons[fi],bx,y+fi*40+14,28,14,400,C.black,{align:'center'}));
    factNodes.push(await txt(p,facts[fi],bx+38,y+fi*40+9,W-bx-38-16,9,500,C.black,{lineH:14}));
  }
  grp('facts',factNodes,p);

  // ── CTA-панель — строго прибита к низу ───────────────────────────────────
  // ctaY = H - 48(навбар-зона) - ctaPanelH
  var ctaNodes=[];
  // Белая подложка до самого низа
  ctaNodes.push(rect(p,0,ctaY,W,H-ctaY,C.white));
  ctaNodes.push(rect(p,0,ctaY,W,1,C.gray200));

  var innerY=ctaY+10;
  var btnW=W-32-8-48-8-48;
  var mainBtn=rect(p,bx,innerY,btnW,52,C.black,26);
  ctaNodes.push(mainBtn);
  ctaNodes.push(await txtC(p,'Написать '+m.name.split(' ')[0]+' →',bx,innerY+26,btnW,10,700,C.white,{align:'center'}));

  var shareX=W-16-48;
  var shareBtn=rect(p,shareX,innerY+4,44,44,C.white,22);
  shareBtn.strokes=[{type:'SOLID',color:C.gray200}];shareBtn.strokeWeight=0.5;
  ctaNodes.push(shareBtn);
  ctaNodes.push(await txtC(p,'↗',shareX,innerY+26,44,16,600,C.black,{align:'center'}));

  var saveX=W-16-48-8-48;
  var saveBtn=rect(p,saveX,innerY+4,44,44,C.white,22);
  saveBtn.strokes=[{type:'SOLID',color:C.gray200}];saveBtn.strokeWeight=0.5;
  ctaNodes.push(saveBtn);
  ctaNodes.push(await txtC(p,'☆',saveX,innerY+26,44,18,400,C.black,{align:'center'}));

  grp('cta-panel',ctaNodes,p);
  navBar(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// UI KIT
// ─────────────────────────────────────────────────────────────────────────────
async function buildUIKit(p) {
  p.resize(1200,980);
  sf(p,C.bg);
  var x=48,y=48;
  await txt(p,'REMATCH UI KIT',x,y,600,24,900,C.black,{ls:3});
  await txt(p,'Unbounded · Android 360×800 · Light theme',x,y+40,600,10,400,C.gray400,{ls:2});
  y+=90;
  await txt(p,'ЦВЕТА',x,y,200,8,700,C.gray400,{ls:5}); y+=22;
  var tokens=[
    {n:'Black',  c:C.black,  h:'#010101'},{n:'White',  c:C.white,  h:'#ffffff'},
    {n:'Accent', c:C.accent, h:'#c9f542'},{n:'AccentL',c:C.accentL,h:'#e0faa0'},
    {n:'BG',     c:C.bg,     h:'#f2eeea'},{n:'Gray100',c:C.gray100,h:'#f7f6f3'},
    {n:'Gray200',c:C.gray200,h:'#e0dbe6'},{n:'Gray400',c:C.gray400,h:'#6b6b6e'},
    {n:'Gray600',c:C.gray600,h:'#3b3b3e'},{n:'Green',  c:C.green,  h:'#22c55e'}
  ];
  for (var ci=0;ci<tokens.length;ci++){
    var swX=x+ci*106;
    var sw=rect(p,swX,y,84,84,tokens[ci].c,12);
    if(tokens[ci].n==='White'){sw.strokes=[{type:'SOLID',color:C.gray200}];sw.strokeWeight=1;}
    await txt(p,tokens[ci].n,swX,y+90,84,8,600,C.gray600,{align:'center'});
    await txt(p,tokens[ci].h,swX,y+102,84,7,400,C.gray400,{align:'center'});
  }
  y+=140;
  await txt(p,'ТИПОГРАФИКА',x,y,400,8,700,C.gray400,{ls:5}); y+=22;
  var trows=[
    {l:'Display · Black · 24px',sz:24,w:900,s:'Найди дизайнера'},
    {l:'H1 · ExtraBold · 18px',sz:18,w:800,s:'Стиль интерьера'},
    {l:'H2 · Bold · 14px',sz:14,w:700,s:'Выберите вариант'},
    {l:'Body · Medium · 10px',sz:10,w:500,s:'Основной текст'},
    {l:'Caption · 9px',sz:9,w:400,s:'Подсказка, метаданные'},
    {l:'Label · Bold · 8px',sz:8,w:700,s:'МЕТКА · ШАГ 1'}
  ];
  for (var ti=0;ti<trows.length;ti++){
    var tr=trows[ti];
    await txt(p,tr.l,x,y+4,260,8,400,C.gray400);
    await txt(p,tr.s,x+280,y,700,tr.sz,tr.w,C.black,{lineH:tr.sz*1.5});
    y+=Math.max(tr.sz*1.5,26)+12;
  }
  y+=20;
  await txt(p,'КНОПКИ',x,y,400,8,700,C.gray400,{ls:5}); y+=22;
  rect(p,x,y,200,52,C.black,26);
  await txtC(p,'Продолжить →',x,y+26,200,10,700,C.white,{align:'center'});
  rect(p,x+220,y,200,52,C.accent,26);
  await txtC(p,'Показать мастеров →',x+220,y+26,200,10,700,C.black,{align:'center'});
  var s3=rect(p,x+440,y,160,52,C.white,26);
  s3.strokes=[{type:'SOLID',color:C.black}];s3.strokeWeight=1.5;
  await txtC(p,'Пропустить',x+440,y+26,160,10,600,C.black,{align:'center'});
  y+=90;
  await txt(p,'КНОПКИ СВАЙПА',x,y,400,8,700,C.gray400,{ls:5}); y+=22;
  var nlK=rect(p,x,y,64,64,C.white,32);
  nlK.strokes=[{type:'SOLID',color:C.gray200}];nlK.strokeWeight=1.5;
  await txtC(p,'✕',x,y+32,64,20,700,C.gray400,{align:'center'});
  await txt(p,'не моё',x,y+72,64,8,500,C.gray400,{align:'center'});
  rect(p,x+80,y+14,36,36,C.gray100,18);
  await txtC(p,'↺',x+80,y+32,36,14,500,C.gray400,{align:'center'});
  var lkK=rect(p,x+132,y,64,64,C.accentL,32);
  lkK.strokes=[{type:'SOLID',color:C.accent}];lkK.strokeWeight=1.5;
  await txtC(p,'✓',x+132,y+32,64,22,700,C.black,{align:'center'});
  await txt(p,'нравится',x+132,y+72,64,8,500,C.gray400,{align:'center'});
}

// ─────────────────────────────────────────────────────────────────────────────
// Карта экранов
// ─────────────────────────────────────────────────────────────────────────────
var SCREEN_MAP={
  ui_kit:     {name:'00 — UI Kit',         fn:function(p){return buildUIKit(p);},  w:1200,h:980},
  splash:     {name:'01 — Splash',         fn:function(p){return buildSplash(p);}},
  style_scan: {name:'02a — Скандинавский', fn:function(p){return buildStyleSwipe(p,0,'like');}},
  style_min:  {name:'02b — Минимализм',    fn:function(p){return buildStyleSwipe(p,1,'neutral');}},
  style_loft: {name:'02c — Лофт',          fn:function(p){return buildStyleSwipe(p,2,'nope');}},
  style_mod:  {name:'02d — Современный',   fn:function(p){return buildStyleSwipe(p,3,'neutral');}},
  style_class:{name:'02e — Классика',      fn:function(p){return buildStyleSwipe(p,4,'like');}},
  style_eco:  {name:'02f — Эко/Бохо',      fn:function(p){return buildStyleSwipe(p,5,'neutral');}},
  style_japdi:{name:'02g — Japandi',       fn:function(p){return buildStyleSwipe(p,6,'nope');}},
  style_art:  {name:'02h — Арт-деко',      fn:function(p){return buildStyleSwipe(p,7,'like');}},
  behavior:   {name:'03 — Поведение',      fn:function(p){return buildBehavior(p);}},
  budget:     {name:'04 — Бюджет',         fn:function(p){return buildBudget(p);}},
  area:       {name:'05 — Площадь',        fn:function(p){return buildArea(p);}},
  features:   {name:'06 — Критерии',       fn:function(p){return buildFeatures(p);}},
  result_1:   {name:'07a — Алина',         fn:function(p){return buildResult(p,0);}},
  result_2:   {name:'07b — Михаил',        fn:function(p){return buildResult(p,1);}},
  profile_1:  {name:'08a — Профиль Алина', fn:function(p){return buildProfile(p,0);}},
  profile_2:  {name:'08b — Профиль Михаил',fn:function(p){return buildProfile(p,1);}}
};

async function buildScreen(container,name,fn,sx,sy,fw,fh) {
  fw=fw||W; fh=fh||H;
  var f=figma.createFrame();
  f.name=name; f.x=sx; f.y=sy;
  f.resize(fw,fh);
  f.clipsContent=true;
  sf(f,C.white);
  container.appendChild(f);
  await fn(f);
  return f;
}

figma.ui.onmessage=async function(msg){
  if (msg.type!=='create-screens') return;
  try {
    var screens=msg.screens,layout=msg.layout,gap=msg.gap;
    var phoneScreens=screens.filter(function(s){return s!=='ui_kit';});
    var hasUIKit=screens.indexOf('ui_kit')!==-1;
    var COLS=layout==='grid'?4:layout==='vertical'?1:phoneScreens.length;
    var rows=Math.ceil(phoneScreens.length/Math.max(COLS,1));
    var totW=Math.max(COLS*(W+gap)+gap,hasUIKit?1200+gap*2:0);
    var totH=(hasUIKit?980+gap:0)+rows*(H+gap)+gap;
    var container=figma.createFrame();
    container.name='ReMatch — Онбординг v6';
    sf(container,C.bg);
    container.resize(totW,totH);
    container.x=0; container.y=0;
    figma.currentPage.appendChild(container);
    var offsetY=0;
    if (hasUIKit){
      figma.ui.postMessage({type:'progress',pct:5,label:'UI Kit'});
      await buildScreen(container,'00 — UI Kit',buildUIKit,gap,gap,1200,980);
      offsetY=980+gap;
    }
    for (var i=0;i<phoneScreens.length;i++){
      var def=SCREEN_MAP[phoneScreens[i]];
      if (!def) continue;
      var col=layout==='vertical'?0:layout==='horizontal'?i:i%COLS;
      var row=layout==='horizontal'?0:layout==='vertical'?i:Math.floor(i/COLS);
      figma.ui.postMessage({type:'progress',pct:5+Math.round((i/phoneScreens.length)*92),label:'Создаю: '+def.name});
      await buildScreen(container,def.name,def.fn,gap+col*(W+gap),offsetY+gap+row*(H+gap),def.w,def.h);
    }
    figma.viewport.scrollAndZoomIntoView([container]);
    figma.ui.postMessage({type:'done',count:screens.length});
  } catch(err){
    figma.ui.postMessage({type:'error',message:err.message});
    console.error(err);
  }
};