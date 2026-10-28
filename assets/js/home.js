/* DA SORTE AO DECLÍNIO · HOME: a bola que perde o quique (Opção C) */

iniciarComum();

/* ---------- 1. Geometria e desenho da trajetória (metáfora; sem escala) ----------
   Em telas largas o desenho é de 960 × 420. No celular é de 480 × 330: cabe na tela, sem rolar de lado,
   com os seis pousos a ≈ 46 px um do outro (o que cabe um dedo). A geometria vem de site.js
   (TRAJ_LARGO / TRAJ_ESTREITO). Cada quique sobe menos que o anterior (perde 28%). */
const reps = reportagensEmOrdem();
const svgT = $('#svg-traj');
const figura = $('#figura');
let G, segs, rastro, bola, gira, compTotal, compAte;
let estado = 0, animando = null, rotacao = 0;

function montarTrajetoria() {
  G = escolherTrajetoria();
  const { L, A, CHAO, RAIO, POUSOS, FIM_X } = G;
  const SEG = segmentosTrajetoria(0);
  const CAMINHO = caminhoTrajetoria(0);
  figura.dataset.modo = G === TRAJ_ESTREITO ? 'estreito' : 'largo';
  figura.style.aspectRatio = L + ' / ' + A;
  svgT.setAttribute('viewBox', '0 0 ' + L + ' ' + A);

  /* ---------- 2. Desenho do SVG ---------- */
  let listras = '';
  for (let x = 0; x < L; x += 60) listras += '<rect x="' + x + '" y="' + CHAO + '" width="60" height="28" fill="var(--color-' + ((x / 60) % 2 ? 'gramado_escuro' : 'gramado_claro') + ')"/>';
  svgT.innerHTML = '<defs>' + FILTRO_PINCEL +
    '<pattern id="ret-verde-c" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.25" fill="var(--color-tinta_verde)" opacity=".55"/></pattern>' +
    '<clipPath id="clip-bola"><circle r="' + RAIO + '"/></clipPath></defs>' +
    '<rect width="' + L + '" height="' + A + '" fill="var(--color-superficie)"/>' +
    listras + '<rect x="0" y="' + CHAO + '" width="' + L + '" height="28" fill="url(#ret-verde-c)"/>' +
    '<line x1="0" y1="' + CHAO + '" x2="' + L + '" y2="' + CHAO + '" stroke="#fff" stroke-width="3"/>' +
    '<line x1="0" y1="' + (CHAO + 28) + '" x2="' + L + '" y2="' + (CHAO + 28) + '" stroke="var(--color-texto)" stroke-width="2"/>' +
    '<g' + usarPincel('pincel') + '>' +
      '<path d="' + CAMINHO + '" fill="none" stroke="var(--color-alerta)" stroke-width="7" stroke-linecap="round" opacity=".28"/>' +
      '<path id="rastro" d="' + CAMINHO + '" fill="none" stroke="var(--color-alerta)" stroke-width="7" stroke-linecap="round"/>' +
      '<polygon points="' + setaEm([FIM_X + 30, CHAO], [FIM_X, CHAO]) + '" fill="var(--color-alerta)"/>' +
    '</g>' +
    '<line x1="' + FIM_X + '" y1="' + CHAO + '" x2="' + (FIM_X + 26) + '" y2="' + CHAO + '" stroke="var(--color-alerta)" stroke-width="7"/>' +
    SEG.map((d, i) => '<path class="seg" data-i="' + i + '" d="' + d + '" fill="none" stroke="none"/>').join('') +
    '<g id="bola"><g id="bola-gira">' +
      '<circle r="' + RAIO + '" fill="var(--color-superficie)" stroke="var(--color-texto)" stroke-width="2.5"/>' +
      '<g clip-path="url(#clip-bola)"><polygon points="0,-5 4.8,-1.5 3,4 -3,4 -4.8,-1.5" fill="var(--color-texto)"/>' +
      '<path d="M0,-5 L0,-12 M4.8,-1.5 L11,-4 M3,4 L7,10 M-3,4 L-7,10 M-4.8,-1.5 L-11,-4" stroke="var(--color-texto)" stroke-width="1.5"/></g>' +
    '</g></g>';

  /* Pontos clicáveis (HTML, para foco e alvo de toque de 44px) */
  $('#c-pontos').innerHTML = reps.map((r, i) =>
    '<li data-rep="' + r.id + '" style="--x:' + (POUSOS[i] / L * 100) + '%;--y:' + ((CHAO + 14) / A * 100) + '%;--cat:' + corCat(r) + '">' +
      '<button class="c-ponto" type="button" data-i="' + i + '" aria-label="Quique ' + r.numero + ': ' + esc(setorDe(r).area) + ', ' + esc(r.titulo_provisorio) + '">' +
        '<span class="bola-n" aria-hidden="true">' + r.numero + '</span><span class="chk" aria-hidden="true">' + icone('check') + '</span></button>' +
      '<span class="c-nome" aria-hidden="true">' + esc(setorDe(r).curto) + '</span>' +
    '</li>').join('');
  $('#c-fim').innerHTML = esc(FIM_DA_LINHA.rotulo) + '*<span>' + esc(FIM_DA_LINHA.nota) + '</span>';

  /* ---------- 3. Medidas do rastro ---------- */
  segs = $$('.seg', svgT);
  rastro = $('#rastro'); bola = $('#bola'); gira = $('#bola-gira');
  compTotal = rastro.getTotalLength();
  compAte = [];                      /* comprimento do rastro até cada estado */
  let acc = 0; segs.forEach((s, i) => { acc += s.getTotalLength(); compAte[i] = acc; });
}
montarTrajetoria();

function posicionarBola(x, y) { bola.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + (y - G.RAIO).toFixed(1) + ')'); gira.setAttribute('transform', 'rotate(' + rotacao.toFixed(0) + ')'); }
function pontoNoSeg(i, frac) { const s = segs[i]; const pnt = s.getPointAtLength(s.getTotalLength() * frac); return [pnt.x, pnt.y]; }
function rastroAte(comp) { rastro.style.strokeDasharray = compTotal; rastro.style.strokeDashoffset = compTotal - comp; }

function mostrarCartao() {
  const c = $('#cartao');
  if (estado === 6) {
    c.dataset.rep = '';
    c.innerHTML = '<p class="eyebrow">A bola parou</p><h3>' + esc(FIM_DA_LINHA.rotulo) + '</h3>' +
      '<p>' + esc(FIM_DA_LINHA.nota) + ' O Congresso pode manter, mudar ou rejeitar a proibição.</p>' +
      '<p class="legenda">Fonte: Congresso em Foco; BBC Brasil. Rótulo provisório <span class="pendente">[A CONFIRMAR]</span>.</p>' +
      '<p><button class="btn btn-secundario" type="button" id="btn-recomecar">Voltar ao primeiro quique</button></p>';
    $('#btn-recomecar').addEventListener('click', () => irPara(0));
  } else {
    const r = reps[estado], s = setorDe(r), a = ACHADOS[r.id];
    c.dataset.rep = r.id;
    c.innerHTML =
      '<p class="meta eyebrow"><span class="quad-cat" style="background:' + corCat(r) + '"></span>Quique ' + r.numero + ' de 6 · ' + esc(s.area) + '</p>' +
      '<h3>' + esc(r.titulo_provisorio) + '</h3>' +
      '<p class="linha-fina">' + esc(r.linha_fina) + '</p>' +
      '<div class="em-numeros"><p class="eyebrow">Em números</p><p class="dado">' + esc(a.valor) + '</p><p style="font-size:15px;line-height:1.45">' + esc(a.rotulo) + '</p><p class="legenda">Fonte: ' + esc(a.fonte) + '.</p></div>' +
      '<p class="legenda">' + esc(r.rotulo_temporal) + ' <span class="pendente">[A CONFIRMAR]</span></p>' +
      '<p><a class="btn btn-primario" data-abre="' + r.id + '" href="' + urlReportagem(r) + '">Ler reportagem ' + icone('arrow-right') + '</a></p>';
  }
  $$('.c-ponto').forEach((b, i) => { if (i === estado) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
  $('#btn-ant').setAttribute('aria-disabled', String(estado === 0));
  $('#btn-prox').setAttribute('aria-disabled', String(estado === 6));
  $('#contador').textContent = estado === 6 ? 'Fim' : (estado + 1) + ' / 6';
  /* No celular a figura rola de lado: acompanha a bola */
  const rol = $('#c-rolagem');
  if (rol.scrollWidth > rol.clientWidth) {
    const x = (estado === 6 ? G.FIM_X : G.POUSOS[estado]) / G.L * rol.scrollWidth - rol.clientWidth / 2;
    rol.scrollTo({ left: Math.max(0, x), behavior: movimentoReduzido() ? 'auto' : 'smooth' });
  }
}

function colocarEm(e) {
  estado = e;
  const fimSeg = e === 6 ? 6 : e;    /* estado e = fim do segmento e (pouso e) */
  const [x, y] = pontoNoSeg(fimSeg, 1);
  posicionarBola(x, y); rastroAte(compAte[fimSeg]);
  mostrarCartao();
}

function irPara(alvo) {
  alvo = Math.max(0, Math.min(6, alvo));
  if (alvo === estado || animando) return;
  if (movimentoReduzido()) { colocarEm(alvo); return; }
  /* Segmentos a percorrer (para trás, a bola refaz o caminho ao contrário) */
  const fila = [];
  if (alvo > estado) for (let i = estado + 1; i <= alvo; i++) fila.push([i, 1]);
  else for (let i = estado; i > alvo; i--) fila.push([i, -1]);
  const destinoFinal = alvo;
  estado = alvo; mostrarCartao();
  function proximo() {
    if (!fila.length) { animando = null; colocarEm(destinoFinal); return; }
    const [i, dir] = fila.shift();
    const comp = segs[i].getTotalLength(), dur = Math.max(380, Math.min(900, comp * 1.6)), t0 = performance.now();
    (function quadro(agora) {
      const t = Math.min(1, (agora - t0) / dur);
      const frac = dir > 0 ? t : 1 - t;
      const [x, y] = pontoNoSeg(i, frac);
      rotacao += dir * 9;
      posicionarBola(x, y);
      rastroAte((compAte[i - 1] || 0) + comp * frac);
      if (t < 1) animando = requestAnimationFrame(quadro); else proximo();
    })(t0);
  }
  animando = true; proximo();
}

$('#btn-prox').addEventListener('click', () => { if (estado < 6) irPara(estado + 1); });
$('#btn-ant').addEventListener('click', () => { if (estado > 0) irPara(estado - 1); });
/* delegação: os botões são recriados quando a tela muda de tamanho (celular ↔ computador) */
$('#c-pontos').addEventListener('click', (e) => { const b = e.target.closest('.c-ponto'); if (b) irPara(+b.dataset.i); });
$('#figura').addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { e.preventDefault(); irPara(estado + 1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); irPara(estado - 1); }
});
colocarEm(0);
/* Ao girar o celular ou redimensionar a janela, troca entre o desenho estreito e o largo */
{
  const mq = window.matchMedia('(max-width: 759px)');
  const trocou = () => { montarTrajetoria(); colocarEm(estado); atualizarVisitados(); };
  if (mq.addEventListener) mq.addEventListener('change', trocou); else if (mq.addListener) mq.addListener(trocou);
}

/* ---------- 4. Estádio e lista com achados ---------- */
/* O estádio fica abaixo da bola: só é desenhado quando falta ~1 tela para chegar nele.
   (O <svg> tem viewBox no HTML, então a altura da página não muda quando ele é montado.) */
function montarEstadioDaHome() {
  ativarEstadio($('#svg-estadio'), $('#painel'));
  centralizarRolagem($('#rolagem'));
  atualizarVisitados();
}
if ('IntersectionObserver' in window) {
  const ioEstadio = new IntersectionObserver((e) => { if (e[0].isIntersecting) { ioEstadio.disconnect(); montarEstadioDaHome(); } }, { rootMargin: '100% 0px' });
  ioEstadio.observe($('#rolagem'));
} else montarEstadioDaHome();
montarLista($('#lista'), true);
atualizarVisitados();
ligarEntrada($('#trajetoria'));
