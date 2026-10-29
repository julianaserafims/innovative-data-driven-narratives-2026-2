/* =====================================================================
   DA SORTE AO DECLÍNIO · SCRIPT DO SITE
   ---------------------------------------------------------------------
   Cabeçalho, menu, rodapé, som, estádio, linha/trajetória e utilidades.
   Os TEXTOS ficam em assets/js/mapa-narrativo.js; aqui fica o comportamento.
   ===================================================================== */

/* MODO_PROTOTIPO = true só nos protótipos soltos (mostra aviso em vez de abrir páginas
   que ainda não existem). No site completo fica false. */
const MODO_PROTOTIPO = false;
const LINKS_PROTOTIPO = {};

/* Caminho até a raiz do site, lido do <body data-raiz="...">:
   "" nas páginas da raiz e "../" dentro de /reportagens. */
const RAIZ = (document.body && document.body.dataset.raiz) || '';
let CAMINHO_REPORTAGENS = RAIZ + 'reportagens/';

/* Aparelho "leve": tela estreita ou só toque (celular). Nele cortamos os efeitos mais caros,
   principalmente o filtro de pincelada (feTurbulence + feDisplacementMap), que é refeito
   por software a cada quadro da animação e trava celulares de entrada. */
const APARELHO_LEVE = window.matchMedia('(max-width: 759px), (hover: none) and (pointer: coarse)').matches;

/* Toda página abre no topo, mesmo quando o navegador (ou o visualizador do artefato)
   tenta devolver a posição de rolagem da visita anterior. Exceção: links com âncora
   de propósito, como "metodologia.html#dados", continuam levando à seção indicada. */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
function irAoTopo() {
  if (!location.hash) { window.scrollTo(0, 0); return; }
  /* com âncora, garante a chegada à seção mesmo se a página mudou de altura ao carregar */
  const alvo = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (alvo) alvo.scrollIntoView({ block: 'start' });
}
irAoTopo();
addEventListener('DOMContentLoaded', irAoTopo);
addEventListener('load', () => { irAoTopo(); requestAnimationFrame(irAoTopo); });
addEventListener('pageshow', (e) => { if (e.persisted) irAoTopo(); });  /* volta pelo botão "voltar" do navegador */

/* ---------------------------------------------------------------------
   4. ÍCONES (desenhos da biblioteca Lucide, licença ISC, copiados aqui
      para não depender de CDN fora do cdnjs).
   --------------------------------------------------------------------- */
const ICONES = {
  "menu": '<path d="M4 6h16M4 12h16M4 18h16"/>',
  "x": '<path d="M18 6 6 18M6 6l12 12"/>',
  "headphones": '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
  "volume-2": '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  "volume-x": '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m22 9-6 6M16 9l6 6"/>',
  "arrow-right": '<path d="M5 12h14M12 5l7 7-7 7"/>',
  "arrow-left": '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  "check": '<path d="M20 6 9 17l-5-5"/>',
  "alert-triangle": '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/>',
  "info": '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  "landmark": '<path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l8 5H4z"/>',
  "video": '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  "door-open": '<path d="M13 4h3a2 2 0 0 1 2 2v14M2 20h3M13 20h9M10 12v.01"/><path d="M13 4.56v16.16a1 1 0 0 1-1.24.97L5 20V5.56a2 2 0 0 1 1.52-1.94l4-1A2 2 0 0 1 13 4.56Z"/>',
  "megaphone": '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  "trophy": '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>'
};
function icone(nome, classe) {
  return '<svg class="icone ' + (classe || '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (ICONES[nome] || '') + '</svg>';
}

/* ---------------------------------------------------------------------
   5. UTILITÁRIOS
   --------------------------------------------------------------------- */
const $ = (sel, raiz) => (raiz || document).querySelector(sel);
const $$ = (sel, raiz) => Array.from((raiz || document).querySelectorAll(sel));
const movimentoReduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const corCat = (r) => 'var(--color-' + r.cor_token + ')';
const reportagensEmOrdem = () => MAPA.ordem_linha_declinio.map(id => MAPA.reportagens.find(r => r.id === id));
const setorDe = (r) => ESTADIO[r.hotspot_estadio];
const urlReportagem = (r) => (MODO_PROTOTIPO && LINKS_PROTOTIPO[r.id]) ? LINKS_PROTOTIPO[r.id] : CAMINHO_REPORTAGENS + r.id + '.html';
const urlHome = () => RAIZ + 'index.html';
function esc(t) { return String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

/* Gerador de números pseudoaleatórios com semente: a torcida sai igual sempre. */
function aleatorio(semente) {
  let s = semente >>> 0;
  return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

/* ---------------------------------------------------------------------
   6. ESTADO "VISITADO" (localStorage com try/catch; tudo funciona sem ele)
   --------------------------------------------------------------------- */
const Visitados = {
  chave: 'dsd-visitados',
  lista() { try { return JSON.parse(localStorage.getItem(this.chave) || '[]'); } catch (e) { return this._mem || []; } },
  marcar(id) {
    const l = this.lista(); if (!l.includes(id)) l.push(id);
    this._mem = l;
    try { localStorage.setItem(this.chave, JSON.stringify(l)); } catch (e) { /* sem armazenamento: segue só na memória */ }
    document.dispatchEvent(new CustomEvent('visitados'));
  },
  tem(id) { return this.lista().includes(id); }
};
function atualizarVisitados() {
  $$('[data-rep]').forEach(el => el.classList.toggle('visitado', Visitados.tem(el.dataset.rep)));
  $$('.menu-item .lida').forEach(el => { el.hidden = !Visitados.tem(el.dataset.rep); });
}
document.addEventListener('visitados', atualizarVisitados);

/* Aviso rápido do protótipo */
let _toastTimer;
function avisoPrototipo(msg) {
  let t = $('#toast-prototipo');
  if (!t) return;
  t.textContent = msg;   /* a região fica sempre no DOM; vazia, some (ver CSS :empty) */
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { t.textContent = ''; }, 6000);
}

/* Clique em qualquer link de reportagem */
document.addEventListener('click', (ev) => {
  const extra = ev.target.closest('a[data-extra]');
  if (extra && MODO_PROTOTIPO) {
    ev.preventDefault();
    avisoPrototipo('Protótipo: a página "' + extra.dataset.extra + '" será criada na Etapa 3.');
    return;
  }
  const a = ev.target.closest('a[data-abre]');
  if (!a) return;
  if (ev.defaultPrevented) return;   /* 1º toque num setor do estádio: só lê a chamada, não abriu a reportagem */
  const id = a.dataset.abre;
  Visitados.marcar(id);
  if (MODO_PROTOTIPO && !LINKS_PROTOTIPO[id]) {
    ev.preventDefault();
    const r = MAPA.reportagens.find(x => x.id === id);
    avisoPrototipo('Protótipo: a página da reportagem ' + r.numero + ' (' + r.titulo_provisorio + ') será montada nas Etapas 2 e 3. O setor foi marcado como visitado.');
  }
});

/* ---------------------------------------------------------------------
   7. SOM (seção H): moedas sintetizadas no navegador, desligado por padrão
   --------------------------------------------------------------------- */
const Som = {
  ligado: false,
  ctx: null,
  _contexto() {
    if (!this.ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; this.ctx = new C(); }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },
  /* Um tilintar de moeda: parciais agudas e inarmônicas, queda rápida. Sem "ka-ching". */
  _tilintar(t, volume, brilho) {
    const ctx = this.ctx; const saida = ctx.createGain();
    saida.gain.setValueAtTime(0.0001, t);
    saida.gain.exponentialRampToValueAtTime(volume, t + 0.004);
    saida.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    saida.connect(ctx.destination);
    [1, 2.76, 5.4].forEach((m, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = brilho * m;
      g.gain.value = [0.6, 0.28, 0.12][i];
      o.connect(g); g.connect(saida); o.start(t); o.stop(t + 0.25);
    });
  },
  tocarMoedas() {
    const ctx = this._contexto(); if (!ctx) return;
    let t = ctx.currentTime + 0.05, intervalo = 0.03, vol = 0.18;
    for (let i = 0; i < 22; i++) {           /* 22 moedas, cada vez mais espaçadas (fator 1,13) */
      this._tilintar(t, vol, 2400 + ((i * 397) % 900));
      t += intervalo; intervalo *= 1.13; vol *= 0.95;
    }
    let iv = 0.13;                            /* a última moeda gira e para */
    while (iv > 0.012) { this._tilintar(t, 0.05, 3100); t += iv; iv *= 0.82; }
    this.mostrarLegenda();
  },
  mostrarLegenda() {
    const l = $('#legenda-som'); if (!l) return;
    l.textContent = '[som: moedas caindo sobre uma mesa, cada vez mais espaçadas, até a última girar e parar]';
    clearTimeout(this._t); this._t = setTimeout(() => { l.textContent = ''; }, 6000);
  },
  definir(ligar, tocar) {
    this.ligado = ligar;
    $$('.btn-som').forEach(b => {
      b.setAttribute('aria-pressed', String(ligar));
      b.setAttribute('aria-label', 'Som: ' + (ligar ? 'ligado' : 'desligado'));   /* no celular o botão mostra só o ícone */
      b.innerHTML = icone(ligar ? 'volume-2' : 'volume-x') +
        '<span class="rotulo-longo">Som: ' + (ligar ? 'ligado' : 'desligado') + '</span><span class="rotulo-curto">' + (ligar ? 'Ligado' : 'Mudo') + '</span>';
    });
    if (ligar && tocar) this.tocarMoedas();
  }
};

/* ---------------------------------------------------------------------
   8. CABEÇALHO, MENU LATERAL (foco preso, Esc, clique fora) e RODAPÉ
   --------------------------------------------------------------------- */
function montarMenu() {
  const ol = $('#menu-reportagens'); if (!ol) return;
  ol.innerHTML = reportagensEmOrdem().map(r =>
    '<li><a class="menu-item" data-abre="' + r.id + '" href="' + urlReportagem(r) + '">' +
      '<span class="cat" style="background:' + corCat(r) + '" aria-hidden="true"></span>' +
      '<span><span class="num">Reportagem ' + r.numero + ' · ' + esc(setorDe(r).curto) + '</span><span class="tit">' + esc(r.titulo_provisorio) + '</span></span>' +
      '<span class="lida" data-rep="' + r.id + '" hidden><span class="chk">' + icone('check') + '</span>Lida</span>' +
    '</a></li>').join('');

  const botao = $('#btn-menu'), painel = $('#menu-lateral'), fundo = $('#menu-fundo'), fechar = $('#btn-fechar-menu');
  function abrir() {
    painel.hidden = false; fundo.hidden = false; botao.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    fechar.focus();
  }
  function fecharMenu() {
    painel.hidden = true; fundo.hidden = true; botao.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    botao.focus();
  }
  botao.addEventListener('click', abrir);
  fechar.addEventListener('click', fecharMenu);
  fundo.addEventListener('click', fecharMenu);
  painel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { fecharMenu(); return; }
    if (e.key !== 'Tab') return;
    const focaveis = $$('a[href], button', painel);
    const primeiro = focaveis[0], ultimo = focaveis[focaveis.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
  });
  $$('.btn-som').forEach(b => b.addEventListener('click', () => Som.definir(!Som.ligado, true)));
  Som.definir(false, false);
}

/* Lista ordenada equivalente ao estádio (sempre visível) */
function montarLista(ol, comAchado) {
  ol.innerHTML = reportagensEmOrdem().map(r => {
    const s = setorDe(r);
    const achado = comAchado && ACHADOS[r.id]
      ? '<p class="legenda" style="margin-top:6px"><strong style="color:var(--color-tinta_azul);font-weight:600">' + esc(ACHADOS[r.id].valor) + '</strong> ' + esc(ACHADOS[r.id].rotulo) + '. Fonte: ' + esc(ACHADOS[r.id].fonte) + '.</p>'
      : '';
    return '<li><a class="item-rep" data-rep="' + r.id + '" data-abre="' + r.id + '" href="' + urlReportagem(r) + '">' +
      '<span class="num-circ" aria-hidden="true">' + r.numero + '<span class="chk">' + icone('check') + '</span></span>' +
      '<span style="min-width:0">' +
        '<span class="meta eyebrow"><span class="quad-cat" style="background:' + corCat(r) + '"></span>Reportagem ' + r.numero + ' · ' + esc(s.curto) + '<span class="selo-lida">Lida ✓</span></span>' +
        '<span class="tit" style="display:block">' + esc(r.titulo_provisorio) + '</span>' +
        '<span class="perg" style="display:block">' + esc(r.pergunta_central) + '</span>' + achado +
        '<span class="ler">Ler reportagem ' + icone('arrow-right') + '</span>' +
      '</span></a></li>';
  }).join('');
}

/* =====================================================================
   9. ESTÁDIO EM SVG (seção F)
   Vista da beira do campo; metade de lá do estádio; duas tintas riso.
   Geometria oficial do gramado: p(u,v), u = comprimento (0–1), v = largura
   (0 = lateral de lá, 1 = lateral de cá).
   ===================================================================== */
function p(u, v) {
  const y = 376 + v * 164, L = 150 - 70 * v, R = 810 + 70 * v;
  return [L + u * (R - L), y];
}
const f1 = n => Math.round(n * 10) / 10;
const pt = (u, v) => p(u, v).map(f1).join(',');
function poliUV(lista) { return lista.map(([u, v]) => pt(u, v)).join(' '); }

function desenharEstadio(opcoes) {
  opcoes = opcoes || {};
  const rnd = aleatorio(42);
  const W = 'var(--color-superficie)', T = 'var(--color-texto)';
  let s = '';

  /* --- 9.1 Padrões de retícula (pontos 5–6px) --- */
  s += '<defs>' +
    '<pattern id="ret-azul" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.4" fill="var(--color-tinta_azul)"/></pattern>' +
    '<pattern id="ret-azul-densa" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1.7" fill="var(--color-tinta_azul)"/></pattern>' +
    '<pattern id="ret-verde" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.25" fill="var(--color-tinta_verde)" opacity=".55"/></pattern>' +
    '<clipPath id="clip-campo"><polygon points="' + poliUV([[0, 0], [1, 0], [1, 1], [0, 1]]) + '"/></clipPath>' +
    '</defs>';

  s += '<g class="cenario" aria-hidden="true">';
  s += '<rect x="0" y="0" width="960" height="540" fill="var(--color-superficie)"/>';

  /* --- 9.2 Cobertura cortada no topo, com treliça --- */
  s += '<polygon points="24,38 936,38 952,98 8,98" fill="url(#ret-azul-densa)" stroke="' + T + '" stroke-width="2.5"/>';
  let trel = 'M24,40'; for (let x = 24, k = 0; x <= 936; x += 26, k++) trel += ' L' + x + ',' + (k % 2 ? 94 : 42);
  s += '<path d="' + trel + '" fill="none" stroke="' + T + '" stroke-width="1.5"/>';
  s += '<path d="M14 34 L40 30 L70 36 L120 29 L180 35 L260 30 L340 36 L420 30 L500 35 L580 29 L660 36 L740 30 L820 35 L900 29 L946 34" fill="none" stroke="' + T + '" stroke-width="2.5"/>';
  s += '<rect x="6" y="96" width="948" height="10" fill="' + T + '"/>';
  [120, 360, 600, 840].forEach(x => { s += '<rect x="' + (x - 3) + '" y="104" width="6" height="112" fill="' + T + '"/>'; });

  /* --- 9.3 Anel superior --- */
  s += '<polygon points="52,106 908,106 940,216 20,216" fill="var(--color-superficie)"/>';
  s += '<polygon points="52,106 908,106 940,216 20,216" fill="url(#ret-azul)" stroke="' + T + '" stroke-width="2.5"/>';
  for (let y = 120; y < 216; y += 12) s += '<line x1="' + f1(52 - (y - 106) * 0.29) + '" y1="' + y + '" x2="' + f1(908 + (y - 106) * 0.29) + '" y2="' + y + '" stroke="' + T + '" stroke-width="1" opacity=".35"/>';

  /* --- 9.4 Faixa LED entre os anéis (marcas fictícias) --- */
  s += '<rect x="0" y="216" width="960" height="20" fill="' + T + '"/>';
  s += '<text class="led-txt" x="480" y="231" text-anchor="middle" font-size="14" font-weight="700" letter-spacing="3" fill="var(--color-faixa_amarela)">' +
       'BET X · BET Y · BET Z · BET X · BET Y · BET Z · BET X · BET Y · BET Z · BET X · BET Y · BET Z</text>';

  /* --- 9.5 Anel inferior e arquibancadas atrás dos gols --- */
  s += '<rect x="0" y="236" width="960" height="118" fill="var(--color-superficie)"/>';
  s += '<rect x="0" y="236" width="960" height="118" fill="url(#ret-azul)"/>';
  for (let y = 248; y < 352; y += 11) s += '<line x1="0" y1="' + y + '" x2="960" y2="' + y + '" stroke="' + T + '" stroke-width="1" opacity=".35"/>';
  const fundoEsq = '0,236 62,236 62,352 110,360 58,470 28,540 0,540';
  const fundoDir = '960,236 898,236 898,352 850,360 902,470 932,540 960,540';
  [fundoEsq, fundoDir].forEach(pp => {
    s += '<polygon points="' + pp + '" fill="var(--color-superficie)"/>';
    s += '<polygon points="' + pp + '" fill="url(#ret-azul)" stroke="' + T + '" stroke-width="2.5"/>';
  });
  s += '<line x1="0" y1="352" x2="960" y2="352" stroke="' + T + '" stroke-width="2.5"/>';

  /* --- 9.6 Torcida em pontos coloridos (grupo .torcida some na Opção B) ---
     Mesmo desenho de antes (520 pontos de raio 2,4, mesma semente), mas em 4 <path> por cor
     em vez de 520 <circle>: ponto = traço de comprimento zero com ponta redonda de 4,8 de largura.
     Menos nós no DOM = a página abre e anima bem mais rápido no celular. */
  const cores = ['var(--color-tinta_azul)', 'var(--color-alerta)', 'var(--color-faixa_amarela)', 'var(--color-texto)', 'var(--color-tinta_azul)'];
  const pontosPorCor = cores.map(() => '');
  for (let i = 0; i < 520; i++) {
    let x, y;
    const zona = rnd();
    if (zona < 0.45) { x = 60 + rnd() * 840; y = 120 + rnd() * 90; }
    else if (zona < 0.9) { x = 4 + rnd() * 952; y = 242 + rnd() * 104; }
    else if (zona < 0.95) { x = 4 + rnd() * 50; y = 250 + rnd() * 200; }
    else { x = 906 + rnd() * 50; y = 250 + rnd() * 200; }
    if (x > 505 && x < 650 && y > 140 && y < 205) continue;          /* deixa a cabine livre */
    pontosPorCor[Math.floor(rnd() * cores.length)] += 'M' + f1(x) + ',' + f1(y) + 'h0';
  }
  s += '<g class="torcida" fill="none" stroke-width="4.8" stroke-linecap="round">';
  cores.forEach((cor, k) => { if (pontosPorCor[k]) s += '<path d="' + pontosPorCor[k] + '" stroke="' + cor + '"/>'; });
  s += '</g>';

  /* --- 9.7 Telões: placar (esq.) e anúncio fictício (dir.) --- */
  s += '<g class="teloes">' +
    '<rect x="300" y="108" width="132" height="40" fill="' + T + '" stroke="' + T + '" stroke-width="2.5"/>' +
    '<text x="366" y="138" text-anchor="middle" font-size="27" font-weight="900" fill="var(--color-superficie)">0 × 0</text>' +
    '<rect x="702" y="108" width="132" height="40" fill="var(--color-faixa_amarela)" stroke="' + T + '" stroke-width="2.5"/>' +
    '<text class="anuncio" x="768" y="138" text-anchor="middle" font-size="27" font-weight="900" fill="' + T + '">BET Z</text>' +
    '</g>';

  /* --- 9.8 Cabine de imprensa (anel superior, centro) --- */
  s += '<rect x="514" y="146" width="124" height="54" fill="var(--color-superficie)" stroke="' + T + '" stroke-width="2.5"/>' +
       '<rect x="508" y="140" width="136" height="9" fill="' + T + '"/>';
  for (let i = 0; i < 4; i++) s += '<rect x="' + (522 + i * 29) + '" y="156" width="22" height="16" fill="url(#ret-azul-densa)" stroke="' + T + '" stroke-width="1.5"/>';
  s += '<line x1="514" y1="182" x2="638" y2="182" stroke="' + T + '" stroke-width="1.5"/>';

  /* --- 9.9 Gramado em perspectiva (105 × 68 m) com listras e retícula verde --- */
  const N = 14;
  for (let i = 0; i < N; i++) {
    s += '<polygon points="' + poliUV([[i / N, 0], [(i + 1) / N, 0], [(i + 1) / N, 1], [i / N, 1]]) + '" fill="var(--color-' + (i % 2 ? 'gramado_escuro' : 'gramado_claro') + ')"/>';
  }
  s += '<rect x="0" y="370" width="960" height="170" fill="url(#ret-verde)" clip-path="url(#clip-campo)"/>';

  /* Linhas do campo (stroke_forte, branco) */
  const linhas = [];
  linhas.push('M' + pt(0, 0) + ' L' + pt(1, 0) + ' L' + pt(1, 1) + ' L' + pt(0, 1) + ' Z');
  linhas.push('M' + pt(0.5, 0) + ' L' + pt(0.5, 1));
  let circ = ''; for (let k = 0; k <= 48; k++) { const a = (k / 48) * Math.PI * 2; circ += (k ? ' L' : 'M') + pt(0.5 + (9.15 / 105) * Math.cos(a), 0.5 + (9.15 / 68) * Math.sin(a)); }
  linhas.push(circ + ' Z');
  const ga = 16.5 / 105, gl = 20.15 / 68, pa = 5.5 / 105, pl = 9.16 / 68;
  [[0, 1], [1, -1]].forEach(([u0, d]) => {
    linhas.push('M' + pt(u0, 0.5 - gl) + ' L' + pt(u0 + d * ga, 0.5 - gl) + ' L' + pt(u0 + d * ga, 0.5 + gl) + ' L' + pt(u0, 0.5 + gl));
    linhas.push('M' + pt(u0, 0.5 - pl) + ' L' + pt(u0 + d * pa, 0.5 - pl) + ' L' + pt(u0 + d * pa, 0.5 + pl) + ' L' + pt(u0, 0.5 + pl));
  });
  s += '<path d="' + linhas.join(' ') + '" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>';
  const ps = p(0.5, 0.5); s += '<circle cx="' + f1(ps[0]) + '" cy="' + f1(ps[1]) + '" r="3" fill="#fff"/>';

  /* --- 9.10 Placas de fundo (atrás das traves, sem texto) e traves na linha de gol --- */
  [[0, -1], [1, 1]].forEach(([u0, d]) => {
    const ub = u0 + d * 0.036;
    const segs = [[0.16, 0.39], [0.39, 0.61], [0.61, 0.84]];
    segs.forEach(([v0, v1], k) => {
      const a = p(ub, v0), b = p(ub, v1);
      s += '<polygon points="' + [a, b, [b[0], b[1] - 15], [a[0], a[1] - 15]].map(q => q.map(f1).join(',')).join(' ') + '" fill="' + (k % 2 ? W : T) + '" stroke="' + T + '" stroke-width="2"/>';
    });
    /* Rede (para fora do campo) */
    const v0 = 0.5 - 3.66 / 68, v1 = 0.5 + 3.66 / 68, h = 17, ur = u0 + d * 0.02;
    const b0 = p(u0, v0), b1 = p(u0, v1), r0 = p(ur, v0), r1 = p(ur, v1);
    s += '<polygon points="' + [b0, [b0[0], b0[1] - h], [b1[0], b1[1] - h], b1, r1, [r1[0], r1[1] - h + 4], [r0[0], r0[1] - h + 4], r0].map(q => q.map(f1).join(',')).join(' ') + '" fill="url(#ret-azul)" stroke="' + T + '" stroke-width="1.5" opacity=".9"/>';
    const trave = 'M' + f1(b0[0]) + ',' + f1(b0[1]) + ' L' + f1(b0[0]) + ',' + f1(b0[1] - h) + ' L' + f1(b1[0]) + ',' + f1(b1[1] - h) + ' L' + f1(b1[0]) + ',' + f1(b1[1]);
    s += '<path d="' + trave + '" fill="none" stroke="' + T + '" stroke-width="5" stroke-linejoin="round"/>';
    s += '<path d="' + trave + '" fill="none" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>';
  });

  /* --- 9.11 Placas da lateral de lá (marcas fictícias) e túnel do vestiário --- */
  s += '<g class="placas">';
  function placas(x0, x1, nomes) {
    const w = (x1 - x0) / nomes.length;
    nomes.forEach((n, k) => {
      const preto = k % 2 === 0;
      s += '<rect x="' + f1(x0 + k * w) + '" y="354" width="' + f1(w) + '" height="20" fill="' + (preto ? T : W) + '" stroke="' + T + '" stroke-width="2"/>';
      s += '<text class="placa-txt" x="' + f1(x0 + k * w + w / 2) + '" y="369.5" text-anchor="middle" font-size="15" font-weight="900" letter-spacing="2" fill="' + (preto ? W : T) + '">' + n + '</text>';
    });
  }
  placas(168, 446, ['BET X', 'BET Y', 'BET Z']);
  placas(514, 792, ['BET Z', 'BET X', 'BET Y']);
  s += '</g>';
  s += '<path d="M440,330 Q480,300 520,330 L520,336 L440,336 Z" fill="' + T + '"/>';
  s += '<path d="M452,376 L452,340 Q480,320 508,340 L508,376 Z" fill="' + T + '" stroke="' + T + '" stroke-width="2"/>';
  s += '<path d="M459,376 L459,344 Q480,330 501,344 L501,376 Z" fill="url(#ret-azul-densa)" opacity=".55"/>';
  s += '<path d="M452,376 L446,392 M508,376 L514,392" stroke="#fff" stroke-width="2" opacity=".8"/>';

  /* --- 9.12 Jogadores perfilados atrás da faixa CAMPEONATO --- */
  s += '<g class="jogadores">';
  for (let i = 0; i < 9; i++) {
    const x = 418 + i * 15.5;
    s += '<rect x="' + f1(x - 4.5) + '" y="424" width="9" height="20" fill="var(--color-tinta_azul)" stroke="' + T + '" stroke-width="1"/>' +
         '<circle cx="' + f1(x) + '" cy="419" r="4.5" fill="' + T + '"/>';
  }
  s += '</g>';
  s += '<g transform="rotate(-1.5 480 450)"><rect x="396" y="436" width="168" height="28" fill="var(--color-faixa_amarela)" stroke="' + T + '" stroke-width="2"/>' +
       '<text x="480" y="457" text-anchor="middle" font-size="19" font-weight="900" letter-spacing="2" fill="' + T + '">CAMPEONATO</text></g>';

  /* --- 9.13 Cabine do VAR (lateral de cá, em primeiro plano, cortada pela borda) --- */
  s += '<rect x="336" y="494" width="100" height="8" fill="' + T + '"/>' +
       '<rect x="342" y="502" width="88" height="44" fill="var(--color-superficie)" stroke="' + T + '" stroke-width="2.5"/>' +
       '<g transform="translate(398 510) scale(1.05)" fill="none" stroke="' + T + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONES.landmark + '</g>' +
       '<rect x="350" y="512" width="38" height="20" fill="url(#ret-azul-densa)" stroke="' + T + '" stroke-width="1.5"/>';
  s += '</g>'; /* fim do cenário */

  /* --- 9.14 Hotspots: <a> em ordem r1 → r6 (ordem de tabulação) --- */
  const zonas = {
    hs_r1: 'M166,350 H448 V378 H166 Z M512,350 H794 V378 H512 Z',
    hs_r2: 'M436,298 H524 V380 H436 Z',
    hs_r3: 'M502,136 H650 V206 H502 Z',
    hs_r4: 'M400,408 H560 L566,480 H394 Z',
    hs_r5: 'M332,488 H440 V540 H332 Z',
    hs_r6: 'M50,108 H292 V214 H22 Z'
  };
  reportagensEmOrdem().forEach(r => {
    const setor = setorDe(r); const [mx, my] = setor.marcador;
    const rotuloAria = r.numero + '. ' + setor.area + ': abrir reportagem ' + r.numero + ', ' + r.titulo_provisorio;
    s += '<a class="hs" id="' + r.hotspot_estadio + '" data-rep="' + r.id + '" data-abre="' + r.id + '" href="' + urlReportagem(r) + '" aria-label="' + esc(rotuloAria) + '">' +
      '<path class="zona" d="' + zonas[r.hotspot_estadio] + '"/>' +
      '<g class="mk" data-x="' + mx + '" data-y="' + my + '" transform="translate(' + mx + ' ' + my + ')">' +
        '<circle r="31" fill="#000" fill-opacity="0"/>' +
        '<circle class="mk-halo" r="27.5"/><circle class="mk-anel" r="24.5"/>' +
        '<circle class="mk-base" r="20"/>' +
        '<text class="mk-num" text-anchor="middle" dy="8.5">' + r.numero + '</text>' +
        '<g class="mk-check" transform="translate(15 -16)"><circle r="9" fill="var(--color-faixa_amarela)" stroke="var(--color-texto)" stroke-width="2"/>' +
        '<path d="M-4 0 L-1 3 L4.5 -3" fill="none" stroke="var(--color-texto)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></g>' +
      '</g></a>';
  });
  return s;
}

/* Celular: sem mouse não existe "passar o mouse". Nessas telas o setor é lido com um toque
   e a reportagem abre com um segundo toque (ou pelo botão do painel). */
const semMouse = () => window.matchMedia('(hover: none)').matches;

/* Os marcadores numerados do estádio têm 20 unidades de raio num desenho de 960. Com o estádio
   encolhido para a largura do celular isso vira um ponto de 7 px; aqui eles crescem (até 2,2×)
   para ficar com tamanho de dedo. Em telas largas a escala é 1 e nada muda. */
function escalaMarcador(svg) {
  const w = svg.getBoundingClientRect().width || 960;
  return Math.max(1, Math.min(2.2, 0.8 * 960 / w));
}
function ajustarMarcadores(svg) {
  const s = escalaMarcador(svg);
  const mks = $$('.mk', svg);
  /* mantém o marcador inteiro dentro do desenho (o do gramado ficava cortado embaixo) */
  const prender = p => [Math.max(24 * s, Math.min(960 - 24 * s, p[0])), Math.max(24 * s, Math.min(540 - 24 * s, p[1]))];
  const pos = mks.map(m => {
    if (!m.dataset.x0) { m.dataset.x0 = m.dataset.x; m.dataset.y0 = m.dataset.y; }
    return prender([+m.dataset.x0, +m.dataset.y0]);
  });
  /* Ampliados, o 4 (gramado) e o 5 (VAR) se encostavam e um toque no 4 abria o 5:
     afasta cada par que se sobrepõe ao longo da linha entre os centros, só o necessário.
     O halo tem raio 27,5; com escala 1 (telas largas) nenhum par encosta e nada muda. */
  const minimo = 2 * 27.5 * s + 12;
  for (let volta = 0; volta < 4; volta++) {
    for (let i = 0; i < pos.length; i++) for (let j = i + 1; j < pos.length; j++) {
      const dx = pos[j][0] - pos[i][0], dy = pos[j][1] - pos[i][1], d = Math.hypot(dx, dy) || 1;
      if (d >= minimo) continue;
      const k = (minimo - d) / 2 / d;
      pos[i] = prender([pos[i][0] - dx * k, pos[i][1] - dy * k]);
      pos[j] = prender([pos[j][0] + dx * k, pos[j][1] + dy * k]);
    }
  }
  mks.forEach((m, i) => {
    const [x, y] = pos[i];
    m.dataset.x = x; m.dataset.y = y;
    m.setAttribute('transform', 'translate(' + f1(x) + ' ' + f1(y) + ') scale(' + s.toFixed(2) + ')');
  });
}

/* Liga o estádio ao painel de leitura (aria-live).
   opcoes.ajustar === false: não mexe nos marcadores (a câmera da abertura cuida deles);
   opcoes.resize === false: não reajusta ao girar a tela (o indicador de posição vira trajetória). */
function ativarEstadio(svg, painel, opcoes) {
  opcoes = opcoes || {};
  svg.innerHTML = '<title id="' + svg.id + '-t">Estádio do dossiê, visto da beira do campo</title>' +
    '<desc id="' + svg.id + '-d">Ilustração da metade de lá de um estádio, com seis setores numerados. 1, placas de publicidade; 2, túnel do vestiário; 3, cabine de imprensa; 4, gramado e faixa do campeonato; 5, cabine do VAR; 6, arquibancada. Cada número abre uma reportagem. A mesma lista está logo abaixo da ilustração.</desc>' +
    desenharEstadio();
  svg.setAttribute('aria-labelledby', svg.id + '-t ' + svg.id + '-d');
  if (opcoes.ajustar !== false) {
    ajustarMarcadores(svg);
    if (opcoes.resize !== false) {
      let larg = svg.getBoundingClientRect().width, t;
      window.addEventListener('resize', () => {
        clearTimeout(t);
        t = setTimeout(() => { const n = svg.getBoundingClientRect().width; if (Math.abs(n - larg) > 1) { larg = n; ajustarMarcadores(svg); } }, 150);
      });
    }
  }
  if (painel && semMouse()) {
    const dica = painel.querySelector('.pl-txt');
    if (dica) dica.textContent = 'Toque num número para ler a chamada do setor. Toque de novo para abrir a reportagem.';
  }
  const padrao = painel ? painel.innerHTML : '';
  let atual = null;
  function mostrar(r) {
    if (!painel) return;
    const s = setorDe(r);
    painel.innerHTML = '<span class="pl-cab" style="color:' + corCat(r) + '">' + r.numero + ' · ' + esc(s.area) + '</span>' +
      '<span class="pl-txt">' + esc(s.microcopy) + '</span>' +
      (semMouse() ? '<a class="btn btn-primario pl-abrir" data-abre="' + r.id + '" href="' + urlReportagem(r) + '">Ler reportagem ' + r.numero + ' ' + icone('arrow-right') + '</a>' : '');
  }
  function selecionar(a, r) {
    $$('.hs.ativo', svg).forEach(x => x.classList.remove('ativo'));
    a.classList.add('ativo'); atual = a; mostrar(r);
  }
  $$('.hs', svg).forEach(a => {
    const r = MAPA.reportagens.find(x => x.id === a.dataset.rep);
    a.addEventListener('mouseenter', () => mostrar(r));
    a.addEventListener('focus', () => mostrar(r));
    a.addEventListener('keydown', (e) => { if (e.key === ' ') { e.preventDefault(); a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); } });
    a.addEventListener('click', (e) => {
      if (!painel || !semMouse()) return;                    /* com mouse, o clique abre direto, como sempre */
      if (atual !== a) { e.preventDefault(); selecionar(a, r); }   /* 1º toque: lê a chamada; 2º toque: abre */
    });
  });
  return { mostrar, padrao };
}

/* Abre o contêiner rolável do estádio centralizado (versão mobile) */
function centralizarRolagem(el) { el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2; }

/* =====================================================================
   10. LINHA DE DECLÍNIO (metáfora). Pincelada vermelha irregular.
   Horizontal a partir de 768px; vertical abaixo disso.
   ===================================================================== */
/* Curva suave passando pelos pontos (Catmull-Rom convertida em Bézier) */
function curvaSuave(pontos) {
  let d = 'M' + pontos[0].map(f1).join(',');
  for (let i = 0; i < pontos.length - 1; i++) {
    const p0 = pontos[i - 1] || pontos[i], p1 = pontos[i], p2 = pontos[i + 1], p3 = pontos[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ' C' + c1.map(f1).join(',') + ' ' + c2.map(f1).join(',') + ' ' + p2.map(f1).join(',');
  }
  return d;
}
/* Filtro de deslocamento: traço irregular (estático, nunca anima) */
/* No celular o filtro é omitido (traço liso): ver APARELHO_LEVE no topo deste arquivo. */
const FILTRO_PINCEL = APARELHO_LEVE ? '' : '<filter id="pincel" x="-5%" y="-20%" width="110%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter>';
/* Atributo para aplicar o filtro a um grupo (vazio no celular). */
const usarPincel = (id) => APARELHO_LEVE ? '' : ' filter="url(#' + (id || 'pincel') + ')"';
function setaEm(ponta, anterior) {
  const ang = Math.atan2(ponta[1] - anterior[1], ponta[0] - anterior[0]);
  const a = (dx, dy) => [ponta[0] + dx * Math.cos(ang) - dy * Math.sin(ang), ponta[1] + dx * Math.sin(ang) + dy * Math.cos(ang)];
  return [a(6, 0), a(-14, -11), a(-14, 11)].map(q => q.map(f1).join(',')).join(' ');
}

function montarLinhaDeclinio(caixa) {
  const reps = reportagensEmOrdem();
  caixa.classList.add('ld');
  caixa.innerHTML =
    '<span class="selo-ilustrativo">Linha ilustrativa · não representa dados</span>' +
    '<svg class="ld-traco" aria-hidden="true" focusable="false"></svg>' +
    '<ol class="ld-pontos">' + reps.map(r =>
      '<li data-rep="' + r.id + '">' +
        '<a class="ld-ponto" data-abre="' + r.id + '" href="' + urlReportagem(r) + '" aria-label="Ponto ' + r.numero + ' da linha: abrir reportagem ' + r.numero + ', ' + esc(r.titulo_provisorio) + '"><span class="bola" aria-hidden="true">' + r.numero + '</span><span class="chk" aria-hidden="true">' + icone('check') + '</span></a>' +
        '<span class="ld-texto"><span class="ld-rotulo" style="display:block">' + esc(r.rotulo_temporal) + (r.rotulo_confirmado ? '' : '*') + '</span>' +
        '<span class="ld-titulo" style="display:block">' + esc(r.titulo_provisorio) + '</span></span>' +
      '</li>').join('') + '</ol>' +
    '<p class="ld-fim">' + esc(FIM_DA_LINHA.rotulo) + '*<br><span style="font-weight:400;color:var(--color-texto_suave)">' + esc(FIM_DA_LINHA.nota) + '</span></p>';

  const svg = $('.ld-traco', caixa);
  let ultimaOrient = null, jaAnimou = false;

  function desenhar() {
    const orient = caixa.clientWidth >= 720 ? 'h' : 'v';
    caixa.dataset.orient = orient;
    $$('.ld-pontos li', caixa).forEach(li => {
      // no modo vertical os textos ficam ao lado; no horizontal, acima e abaixo
      const t = $('.ld-texto', li);
      if (orient === 'h') { t.style.display = 'contents'; } else { t.style.display = ''; }
    });
    let pontos, fim, vb;
    if (orient === 'h') {
      vb = [960, 490];
      pontos = reps.map((r, i) => [92 + i * 146, 92 + i * 50 + (i % 2 ? 10 : -4)]);
      fim = [928, 384];
      $$('.ld-pontos li', caixa).forEach((li, i) => {
        li.style.setProperty('--x', (pontos[i][0] / vb[0] * 100) + '%');
        li.style.setProperty('--y', (pontos[i][1] / vb[1] * 100) + '%');
      });
    } else {
      const caixaR = caixa.getBoundingClientRect();
      vb = [caixaR.width, caixaR.height];
      pontos = $$('.ld-ponto', caixa).map(a => {
        const r = a.getBoundingClientRect();
        return [r.left - caixaR.left + r.width / 2, r.top - caixaR.top + r.height / 2];
      });
      const fimEl = $('.ld-fim', caixa).getBoundingClientRect();
      fim = [pontos[pontos.length - 1][0] + 4, fimEl.top - caixaR.top + 6];
    }
    const todos = pontos.concat([fim]);
    const inicio = [todos[0][0] - (orient === 'h' ? 60 : 0), todos[0][1] - (orient === 'h' ? 26 : 34)];
    const caminho = curvaSuave([inicio].concat(todos));
    const antes = [fim[0] - (orient === 'h' ? 20 : 2), fim[1] - (orient === 'h' ? 8 : 20)];
    svg.setAttribute('viewBox', '0 0 ' + vb[0] + ' ' + vb[1]);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.innerHTML = '<defs>' + FILTRO_PINCEL + '</defs>' +
      '<g' + usarPincel('pincel') + '>' +
        '<path d="' + caminho + '" fill="none" stroke="var(--color-alerta)" stroke-width="3" stroke-linecap="round" opacity=".35" transform="translate(2.5 2)"/>' +
        '<path class="traco-principal" d="' + caminho + '" fill="none" stroke="var(--color-alerta)" stroke-width="7" stroke-linecap="round"/>' +
        '<polygon class="ponta" points="' + setaEm(fim, antes) + '" fill="var(--color-alerta)"/>' +
      '</g>';
    if (orient !== ultimaOrient) { ultimaOrient = orient; }
  }
  desenhar();
  let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(desenhar, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(desenhar);

  /* Desenho progressivo: só se a linha começa fora da tela e o movimento não é reduzido.
     Os pontos e textos ficam sempre visíveis; só o traço é "pintado". */
  const fora = caixa.getBoundingClientRect().top > window.innerHeight;
  if (!movimentoReduzido() && fora && 'IntersectionObserver' in window) {
    const traco = () => $('.traco-principal', svg);
    const tr = traco(); const L = tr.getTotalLength();
    tr.style.strokeDasharray = L; tr.style.strokeDashoffset = L;
    $('.ponta', svg).style.opacity = 0;
    const io = new IntersectionObserver((ents) => {
      if (!ents[0].isIntersecting || jaAnimou) return;
      jaAnimou = true; io.disconnect();
      const tt = traco();
      tt.style.transition = 'stroke-dashoffset var(--motion-duration-duracao_entrada) var(--motion-easing-easing_entrada)';
      requestAnimationFrame(() => { tt.style.strokeDashoffset = 0; });
      setTimeout(() => { const pn = $('.ponta', svg); if (pn) pn.style.opacity = 1; }, 1150);
    }, { threshold: 0.35 });
    io.observe(caixa);
  }
  return { redesenhar: desenhar };
}

/* =====================================================================
   11. TRAJETÓRIA DA BOLA (metáfora da home C e do indicador das reportagens)
   Cada quique sobe ~28% menos que o anterior. Coordenadas no viewBox 960 × 420.
   ===================================================================== */
/* Geometria em telas largas (computador): desenho de 960 × 420. */
const TRAJ_LARGO = {
  L: 960, A: 420,
  CHAO: 352, RAIO: 12,
  INICIO: [36, 64], QUEDA: 42,               /* de onde a bola cai e quanto a queda "puxa" para o lado */
  POUSOS: [120, 262, 392, 505, 602, 686],    /* onde a bola toca o chão: r1 … r6 */
  ALTURAS: [230, 166, 120, 87, 63],          /* altura de cada quique entre pousos */
  QUIQUINHOS: [[728, 30], [760, 13]],        /* depois do 6º pouso: [x, altura] */
  FIM_X: 880                                 /* onde a bola para */
};
/* Celular: desenho de 480 × 330 que cabe na tela sem rolar de lado. Pousos a 62 unidades
   (≈ 46 px, o que cabe um dedo) e quiques mais baixos, mantendo a regra de perder 28% a cada um. */
const TRAJ_ESTREITO = {
  L: 480, A: 330,
  CHAO: 262, RAIO: 12,
  INICIO: [14, 80], QUEDA: 16,
  POUSOS: [52, 114, 176, 238, 300, 362],
  ALTURAS: [146, 105, 76, 55, 40],
  QUIQUINHOS: [[394, 16], [420, 7]],
  FIM_X: 446
};
/* Metamorfose do estádio em trajetória (desenho do estádio, 960 × 540) no celular:
   os mesmos quiques, mas com os pousos espaçados por igual para os seis números não se encostarem. */
const TRAJ_MORFOSE_ESTREITO = Object.assign({}, TRAJ_LARGO, {
  POUSOS: [110, 230, 350, 470, 590, 710], QUIQUINHOS: [[752, 30], [784, 13]]
});
const telaEstreita = () => window.matchMedia('(max-width: 759px)').matches;
let TRAJ = TRAJ_LARGO;                       /* geometria em uso; trocada por escolherTrajetoria() */
function escolherTrajetoria() { TRAJ = telaEstreita() ? TRAJ_ESTREITO : TRAJ_LARGO; return TRAJ; }
function _q(x0, y0, x1, y1, h) { return 'Q' + f1((x0 + x1) / 2) + ',' + f1(Math.min(y0, y1) - 2 * h) + ' ' + f1(x1) + ',' + f1(y1); }
/* Segmentos: [0] queda; [1..5] quiques; [6] quiquinhos e rolagem. dy desloca tudo na vertical. */
function segmentosTrajetoria(dy, G) {
  dy = dy || 0; G = G || TRAJ;
  const C = G.CHAO + dy, P = G.POUSOS, s = [];
  s.push('M' + G.INICIO[0] + ',' + (G.INICIO[1] + dy) + ' Q' + (G.INICIO[0] + G.QUEDA) + ',' + (G.INICIO[1] + dy) + ' ' + P[0] + ',' + C);
  for (let i = 0; i < 5; i++) s.push('M' + P[i] + ',' + C + ' ' + _q(P[i], C, P[i + 1], C, G.ALTURAS[i]));
  let d = 'M' + P[5] + ',' + C, x = P[5];
  G.QUIQUINHOS.forEach(([x1, h]) => { d += ' ' + _q(x, C, x1, C, h); x = x1; });
  s.push(d + ' L' + G.FIM_X + ',' + C);
  return s;
}
function caminhoTrajetoria(dy, G) { const s = segmentosTrajetoria(dy, G); return s[0] + ' ' + s.slice(1).map(t => t.replace(/^M[\d.]+,[\d.]+ /, '')).join(' '); }

/* Metamorfose do estádio na trajetória (herdada da Opção B).
   Os seis marcadores saem do estádio e pousam na trajetória; o cenário apaga.
   k vai de 0 (estádio) a 1 (trajetória). */
function prepararMorfose(svg, opcoes) {
  opcoes = opcoes || {};
  const DY = opcoes.dy == null ? 110 : opcoes.dy;      /* chão da trajetória em y = 462 no estádio */
  /* aqui a trajetória vive no desenho do estádio (960 × 540), então não usa a geometria da home */
  const T = opcoes.geo || (telaEstreita() ? TRAJ_MORFOSE_ESTREITO : TRAJ_LARGO);
  const escalaPadrao = escalaMarcador(svg);   /* mesmo tamanho de dedo do estádio parado */
  const ns = 'http://www.w3.org/2000/svg';
  const g = document.createElementNS(ns, 'g'); g.setAttribute('class', 'morfose');
  g.innerHTML = '<defs>' + FILTRO_PINCEL.replace('id="pincel"', 'id="pincel-m"') + '</defs><g' + usarPincel('pincel-m') + '>' +
    '<path class="m-traco" fill="none" stroke="var(--color-alerta)" stroke-width="7" stroke-linecap="round"/>' +
    '<polygon class="m-ponta" fill="var(--color-alerta)"/></g>';
  svg.insertBefore(g, svg.querySelector('.hs'));
  const traco = g.querySelector('.m-traco'), ponta = g.querySelector('.m-ponta');
  const reps = reportagensEmOrdem();
  const mks = reps.map(r => svg.querySelector('#' + r.hotspot_estadio + ' .mk'));
  const de = mks.map(m => [+m.dataset.x, +m.dataset.y]);
  const C = T.CHAO + DY;
  const para = T.POUSOS.map(x => [x, C]);
  const cenario = svg.querySelector('.cenario');
  function aplicar(k, escala) {
    escala = escala || escalaPadrao;
    const pts = mks.map((m, i) => {
      const x = de[i][0] + (para[i][0] - de[i][0]) * k, y = de[i][1] + (para[i][1] - de[i][1]) * k;
      m.setAttribute('transform', 'translate(' + f1(x) + ' ' + f1(y) + ') scale(' + escala.toFixed(3) + ')');
      return [x, y];
    });
    cenario.style.opacity = String(1 - 0.92 * k);
    if (k <= 0.001) { traco.style.opacity = 0; ponta.style.opacity = 0; return; }
    const ini = [pts[0][0] + (T.INICIO[0] - pts[0][0]) * k, pts[0][1] + (T.INICIO[1] + DY - pts[0][1]) * k];
    let d = 'M' + f1(ini[0]) + ',' + f1(ini[1]) + ' Q' + f1(ini[0] + T.QUEDA * k) + ',' + f1(ini[1]) + ' ' + f1(pts[0][0]) + ',' + f1(pts[0][1]);
    for (let i = 0; i < 5; i++) d += ' ' + _q(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], T.ALTURAS[i] * k);
    let x = pts[5][0], y = pts[5][1];
    T.QUIQUINHOS.forEach(([x1, h]) => { const xx = x + (x1 - x) * k; d += ' ' + _q(x, y, xx, C, h * k); x = xx; y = C; });
    const fimX = pts[5][0] + (T.FIM_X - pts[5][0]) * k;
    d += ' L' + f1(fimX) + ',' + f1(C);
    traco.setAttribute('d', d);
    const L = traco.getTotalLength();
    traco.style.opacity = 1; traco.style.strokeDasharray = L; traco.style.strokeDashoffset = L * (1 - Math.min(1, k * 1.15));
    ponta.setAttribute('points', setaEm([fimX + 30, C], [fimX, C]));
    ponta.style.opacity = k > 0.97 ? 1 : 0;
  }
  return { aplicar };
}

/* Anima um número de 0 a 1 (ou volta); com movimento reduzido, pula direto */
function animar(dur, cadaQuadro, fim) {
  if (movimentoReduzido()) { cadaQuadro(1); if (fim) fim(); return; }
  const t0 = performance.now(), ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  /* Proteção para aparelhos lentos: se 3 quadros seguidos demoram mais de 80 ms (menos de ~12 quadros
     por segundo), a animação pula direto para o estado final em vez de arrastar a tela. */
  let ultimo = t0, lentos = 0;
  (function q(agora) {
    lentos = (agora - ultimo > 80) ? lentos + 1 : 0; ultimo = agora;
    const t = lentos >= 3 ? 1 : Math.min(1, (agora - t0) / dur);
    cadaQuadro(ease(t)); if (t < 1) requestAnimationFrame(q); else if (fim) fim();
  })(t0);
}

/* Rolagem suave da entrada até um alvo (1200ms; 0ms com movimento reduzido) */
function rolarAte(alvo) {
  const destino = alvo.getBoundingClientRect().top + window.scrollY - ($('.cabecalho')?.offsetHeight || 0) - 8;
  if (movimentoReduzido()) { window.scrollTo(0, destino); alvo.focus({ preventScroll: true }); return; }
  const inicio = window.scrollY, dist = destino - inicio, dur = 1200, t0 = performance.now();
  const ease = (x) => 1 - Math.pow(1 - x, 3);
  (function passo(agora) {
    const k = Math.min(1, (agora - t0) / dur);
    window.scrollTo(0, inicio + dist * ease(k));
    if (k < 1) requestAnimationFrame(passo); else alvo.focus({ preventScroll: true });
  })(t0);
}

/* Botões "Iniciar com som" / "Iniciar sem som" */
function ligarEntrada(alvo) {
  $$('[data-iniciar]').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.iniciar === 'com-som') Som.definir(true, true); else Som.definir(false, false);
    rolarAte(alvo);
  }));
}

/* Áreas com rolagem lateral (estádio, tabelas, gráficos largos) recebem foco de teclado
   e um nome, para quem navega sem mouse conseguir rolá-las com as setas (WCAG 2.1.1). */
function tornarRolaveisFocaveis() {
  $$('.estadio-rolagem, .c-rolagem, .graf-rolagem, .tab-rolagem, .tl-rolagem, .moldura-pos, #g-matriz').forEach(el => {
    if (el.dataset.rolavel) return;
    el.dataset.rolavel = '1';
    el.tabIndex = 0;
    el.setAttribute('role', 'region');
    const fig = el.closest('figure, section, details');
    let tit = fig && fig.querySelector('h2, h3, summary');
    if (!tit) {                                  /* sem figura: usa o intertítulo anterior */
      let ant = el.previousElementSibling;
      while (ant && !/^H[23]$/.test(ant.tagName)) ant = ant.previousElementSibling;
      tit = ant || el.querySelector('caption');
    }
    el.setAttribute('aria-label', 'Área com rolagem lateral' + (tit ? ': ' + tit.textContent.trim() : ''));
  });
}

function iniciarComum() {
  montarMenu();
  atualizarVisitados();
  tornarRolaveisFocaveis();
}


/* =====================================================================
   12. CASCA DAS PÁGINAS: cabeçalho, menu, aviso de jogo responsável e rodapé
   montados aqui para que créditos e menu sejam editados num lugar só.
   ===================================================================== */
function pend(v) { return /^\[/.test(v) ? '<span class="pendente">' + esc(v) + '</span>' : esc(v); }
function montarCasca() {
  const main = document.querySelector('main');
  const cab = `
<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="cabecalho">
  <div class="conteiner">
    <div class="topo-esq">
      <a class="marca-topo" href="${RAIZ}index.html" aria-label="Da Sorte ao Declínio: página inicial">
        <svg class="bola-topo" viewBox="-15 -15 30 30" aria-hidden="true" focusable="false"><circle r="13" fill="#fff" stroke="#15171C" stroke-width="2.5"/><polygon points="0,-5 4.8,-1.5 3,4 -3,4 -4.8,-1.5" fill="#15171C"/><path d="M0,-5 L0,-12 M4.8,-1.5 L11,-4 M3,4 L7,10 M-3,4 L-7,10 M-4.8,-1.5 L-11,-4" stroke="#15171C" stroke-width="1.5" fill="none"/></svg>
        <span class="marca-nome">Da Sorte ao Declínio</span>
      </a>
      <nav class="inst" aria-label="Instituições">
        ${PROJETO.links.map(l => '<a class="inst-link" href="' + esc(l.url) + '" target="_blank" rel="noopener" title="' + esc(l.nome) + '" aria-label="' + esc(l.nome) + ' (abre em nova aba)"><span class="sigla">' + esc(l.sigla) + '</span><span class="nome-longo"> · ' + esc(l.nome) + '</span></a>').join('')}
      </nav>
    </div>
    <div class="acoes-cabecalho">
      <button class="btn-icone btn-som" type="button" aria-pressed="false">Som: desligado</button>
      <button class="btn-icone" id="btn-menu" type="button" aria-expanded="false" aria-controls="menu-lateral">${icone('menu')}<span class="sr">Abrir menu</span></button>
    </div>
  </div>
</header>
<div id="menu-fundo" class="menu-fundo" hidden></div>
<aside id="menu-lateral" class="menu-lateral" hidden aria-label="Menu do dossiê">
  <div class="menu-topo">
    <a class="eyebrow" href="${RAIZ}index.html">Da Sorte ao Declínio</a>
    <button id="btn-fechar-menu" class="btn-icone" type="button">${icone('x')}<span class="sr">Fechar menu</span></button>
  </div>
  <nav aria-label="Navegação do dossiê">
    <h2>Reportagens</h2>
    <ol id="menu-reportagens"></ol>
    <h2>O projeto</h2>
    <ul>
      <li><a class="menu-item" href="${RAIZ}metodologia.html"><span class="cat" aria-hidden="true"></span><span class="tit">Metodologia e dados</span><span></span></a></li>
      <li><a class="menu-item" href="${RAIZ}quem-somos.html"><span class="cat" aria-hidden="true"></span><span class="tit">Quem somos</span><span></span></a></li>
    </ul>
    <h2>Instituições</h2>
    <ul>
      ${PROJETO.links.map(l => '<li><a class="menu-item" href="' + esc(l.url) + '" target="_blank" rel="noopener"><span class="cat" aria-hidden="true"></span><span class="tit">' + esc(l.nome) + ' <span aria-hidden="true">↗</span><span class="sr"> (abre em nova aba)</span></span><span></span></a></li>').join('')}
    </ul>
  </nav>
</aside>
<p id="legenda-som" class="legenda-som" role="status" aria-live="polite"></p>
<div id="toast-prototipo" class="toast-prototipo" role="status" aria-live="polite"></div>`;
  const rod = `
<div class="conteiner">
  <aside class="aviso-jr" aria-label="Aviso de jogo responsável">
    ${icone('alert-triangle')}
    <p>${PROJETO.aviso_jogo_responsavel}</p>
  </aside>
</div>
<footer class="rodape">
  <div class="conteiner">
    <p class="marca">Da Sorte ao Declínio</p>
    <div class="rodape-grade">
      <section aria-labelledby="rod-cred">
        <h2 id="rod-cred">Créditos</h2>
        <dl>${PROJETO.creditos.map(([f, n]) => '<dt>' + esc(f) + '</dt><dd>' + pend(n) + '</dd>').join('')}</dl>
      </section>
      <section aria-labelledby="rod-disc">
        <h2 id="rod-disc">Disciplina</h2>
        <dl>
          <dt>Curso</dt><dd>${esc(PROJETO.disciplina)}</dd>
          <dt>Instituição</dt><dd>${esc(PROJETO.instituicao)}</dd>
          <dt>Semestre</dt><dd>${pend(PROJETO.semestre)}</dd>
        </dl>
      </section>
      <section aria-labelledby="rod-proj">
        <h2 id="rod-proj">O projeto</h2>
        <ul>
          <li><a href="${RAIZ}metodologia.html">Metodologia e dados</a></li>
          <li><a href="${RAIZ}quem-somos.html">Quem somos</a></li>
          <li><a href="${RAIZ}index.html">Página inicial</a></li>
          ${PROJETO.links.map(l => '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.nome) + ' (' + esc(l.sigla) + ') ↗<span class="sr"> (abre em nova aba)</span></a></li>').join('')}
        </ul>
      </section>
    </div>
    <p class="fino">Publicado em ${pend(PROJETO.publicado_em)} · Atualizado em ${esc(PROJETO.atualizado_em)} · ${esc(PROJETO.licenca_conteudo)} ${esc(PROJETO.licenca_codigo)} · Código aberto: ${pend(PROJETO.repositorio)} · As marcas BET X, BET Y e BET Z das ilustrações são fictícias.</p>
  </div>
</footer>`;
  main.insertAdjacentHTML('beforebegin', cab);
  main.insertAdjacentHTML('afterend', rod);
}
montarCasca();
