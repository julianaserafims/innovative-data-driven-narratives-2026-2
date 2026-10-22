/* =====================================================================
   DA SORTE AO DECLÍNIO · COMPORTAMENTO COMUM DAS REPORTAGENS
   ---------------------------------------------------------------------
   A página só precisa ter <main data-rep="rN"> e os blocos com os ids
   abaixo. Cor, número, câmera, navegação e posição saem do MAPA.
   ===================================================================== */

/* ---------- Dados: lê /data/arquivo.csv ---------- */
async function carregarCSV(nome) {
  try {
    const r = await fetch(RAIZ + 'data/' + nome, { cache: 'no-store' });
    if (r.ok) return lerCSV(await r.text());
  } catch (e) { /* cai na mensagem de erro abaixo */ }
  return null;
}
function lerCSV(texto) {          /* CSV com aspas e vírgulas dentro de campos */
  const linhas = []; let campo = '', linha = [], aspas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (aspas) { if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; } else if (c === '"') aspas = false; else campo += c; }
    else if (c === '"') aspas = true;
    else if (c === ',') { linha.push(campo); campo = ''; }
    else if (c === '\n') { linha.push(campo); linhas.push(linha); linha = []; campo = ''; }
    else if (c !== '\r') campo += c;
  }
  if (campo || linha.length) { linha.push(campo); linhas.push(linha); }
  const cab = linhas.shift();
  return linhas.filter(l => l.length > 1).map(l => Object.fromEntries(cab.map((k, i) => [k, l[i]])));
}
/* Mensagem de erro/vazio (seção B) */
function erroGrafico(el) {
  el.innerHTML = '<p class="erro-grafico">Este gráfico não carregou. Os mesmos dados estão no botão “Baixar dados”. ' +
    '<span class="legenda">Se você abriu o arquivo direto do computador, rode um servidor local (veja o README).</span></p>';
}
/* Carrega um CSV, desenha e monta a tabela acessível; mostra erro se falhar */
async function graficoDeCSV(nome, elGrafico, desenhar, tabela, colunas) {
  const linhas = await carregarCSV(nome);
  if (!linhas) { erroGrafico(elGrafico); return null; }
  desenhar(linhas);
  if (tabela && colunas) Graficos.tabela(tabela, linhas, colunas);
  return linhas;
}

/* ---------- Scrollytelling: o passo ativo é o último cartão cujo topo
   passou da linha de leitura (55% da tela no computador, 65% no celular) ---------- */
const Scrolly = {
  iniciar(caixa, aoMudar) {
    const passos = $$('.passo-rep', caixa);
    let atual = null, quadro = 0;
    function medir() {
      quadro = 0;
      const linha = innerHeight * (matchMedia('(min-width: 1024px)').matches ? 0.55 : 0.65);
      let n = +passos[0].dataset.passo;
      passos.forEach(p => { if (p.getBoundingClientRect().top < linha) n = +p.dataset.passo; });
      if (n !== atual) {
        atual = n;
        passos.forEach(p => p.classList.toggle('ativo', +p.dataset.passo === n));
        aoMudar(n);
      }
    }
    addEventListener('scroll', () => { if (!quadro) quadro = requestAnimationFrame(medir); }, { passive: true });
    medir();
  }
};

/* ---------- Abertura, navegação e indicador de posição ---------- */
const VISTAS_CAMERA = {
  hs_r1: [140, 200, 680, 383], hs_r2: [320, 246, 320, 180], hs_r3: [416, 82, 320, 180],
  hs_r4: [300, 337, 360, 203], hs_r5: [226, 360, 320, 180], hs_r6: [0, 60, 400, 225]
};
function enquadrar(svg, vb) {
  svg.setAttribute('viewBox', vb.map(n => n.toFixed(1)).join(' '));
  const e = vb[2] / 960;
  $$('.mk', svg).forEach(m => m.setAttribute('transform', 'translate(' + m.dataset.x + ' ' + m.dataset.y + ') scale(' + e.toFixed(3) + ')'));
}

function iniciarReportagem() {
  iniciarComum();
  const main = $('main');
  const R = MAPA.reportagens.find(r => r.id === main.dataset.rep);
  const SETOR = setorDe(R), ORDEM = reportagensEmOrdem(), POS = ORDEM.indexOf(R);
  document.documentElement.style.setProperty('--cat', corCat(R));
  $('#eyebrow-rep').innerHTML = '<span class="quad-cat" style="background:' + corCat(R) + '"></span>Reportagem ' + R.numero + ' de ' + ORDEM.length + ' · ' + esc(SETOR.area);
  $$('.menu-item[data-abre="' + R.id + '"]').forEach(a => a.setAttribute('aria-current', 'page'));
  Visitados.marcar(R.id);

  /* tempo de leitura (200 palavras por minuto) */
  const palavras = main.innerText.split(/\s+/).length;
  $('#tempo-leitura').textContent = 'leitura de ' + Math.max(1, Math.round(palavras / 200)) + ' min';

  /* 1. câmera da abertura: estádio inteiro → setor desta reportagem */
  const svgCam = $('#svg-camera');
  ativarEstadio(svgCam, null);
  $('#' + R.hotspot_estadio, svgCam).classList.add('atual');
  const vbFim = VISTAS_CAMERA[R.hotspot_estadio], vbIni = [0, 0, 960, 540];
  setTimeout(() => animar(1200, k => enquadrar(svgCam, vbIni.map((v, i) => v + (vbFim[i] - v) * k)), () => {
    $('#camera-legenda').textContent = 'Você está no setor ' + R.numero + ': ' + SETOR.area.toLowerCase() + '. ' + SETOR.microcopy;
  }), 500);

  /* 2. navegação anterior/próxima: sem anterior em r1 e sem próxima em r6 (o espaço some) */
  const ant = ORDEM[POS - 1], prox = ORDEM[POS + 1];
  const card = (r, classe, dir) => '<a class="card-nav ' + classe + '" data-abre="' + r.id + '" href="' + urlReportagem(r) + '">' +
    '<span class="dir">' + dir + '</span><span class="eyebrow"><span class="quad-cat" style="background:' + corCat(r) + ';display:inline-block;margin-right:6px"></span>' + r.numero + ' · ' + esc(setorDe(r).curto) + '</span>' +
    '<span class="tt">' + esc(r.titulo_provisorio) + '</span></a>';
  $('#nav-rep-grade').innerHTML = (ant ? card(ant, 'anterior', icone('arrow-left') + 'Reportagem anterior') : '') +
    (prox ? card(prox, 'proxima', 'Próxima reportagem ' + icone('arrow-right')) : '');
  $('#link-home').href = urlHome() + '#estadio';   /* só este botão vai direto à seção do estádio na home */

  /* 3. indicador de posição: o estádio esvazia e vira a trajetória da bola */
  const svgPos = $('#svg-posicao');
  ativarEstadio(svgPos, null);
  $('#' + R.hotspot_estadio, svgPos).classList.add('atual');
  const morf = prepararMorfose(svgPos);
  const legPos = $('#legenda-pos');
  legPos.textContent = 'O estádio do dossiê. Role até aqui para ver o caminho das seis reportagens.';
  let feito = false;
  const transformar = () => {
    if (feito) return; feito = true;
    animar(1400, k => morf.aplicar(k), () => {
      legPos.textContent = 'Você está no quique ' + R.numero + ' de ' + ORDEM.length + ': ' + R.titulo_provisorio + '. Os números abrem as outras reportagens.';
    });
  };
  if (movimentoReduzido() || !('IntersectionObserver' in window)) transformar();
  else {
    const io = new IntersectionObserver(e => { if (e[0].isIntersecting) { io.disconnect(); transformar(); } }, { threshold: 0.5 });
    io.observe(svgPos);
  }
  atualizarVisitados();
  return R;
}
