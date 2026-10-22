/* =====================================================================
   DA SORTE AO DECLÍNIO · GRÁFICOS DE DADOS REAIS (seção G do pacote)
   ---------------------------------------------------------------------
   Linguagem de dado real: eixo/escala/fonte, retícula azul ou tinta chapada,
   sem filtro de rugosidade, números em Azeret Mono. Uma única marca em
   destaque por gráfico (tinta azul sólida); dano em vermelho (alerta).
   Cada função recebe o elemento, as linhas lidas do CSV e as opções.
   ===================================================================== */
const Graficos = {};

/* Número no formato brasileiro: 1234.5 → "1.234,5" */
Graficos.fmt = (n, casas) => Number(n).toLocaleString('pt-BR', { minimumFractionDigits: casas || 0, maximumFractionDigits: casas || 0 });

/* Selo para gráficos com dado ainda não checado ou fictício */
Graficos.selo = (tipo, texto) => '<p class="selo-dado selo-' + tipo + '">' + esc(texto) + '</p>';

/* ---------------------------------------------------------------------
   1. BARRAS HORIZONTAIS (HTML; responsivas sem recálculo)
   opções: rotulo, valor, formato(v, linha), estilo(linha, i) → '' | 'destaque' | 'dano' | 'apagado',
           maximo, nota(linha)
   --------------------------------------------------------------------- */
Graficos.barras = function (el, linhas, o) {
  const max = o.maximo || Math.max(...linhas.map(l => +l[o.valor]));
  el.innerHTML = '<ol class="gb">' + linhas.map((l, i) => {
    const v = +l[o.valor], est = o.estilo ? o.estilo(l, i) : '';
    const frac = Math.max(0.004, v / max);
    return '<li class="gb-linha ' + est + '"><span class="gb-rot">' + esc(l[o.rotulo]) + '</span>' +
      '<span class="gb-trilho"><span class="gb-barra" style="width:calc((100% - 150px) * ' + frac.toFixed(4) + ')"></span>' +
      '<span class="gb-val">' + esc(o.formato ? o.formato(v, l) : Graficos.fmt(v)) + '</span></span>' +
      (o.nota && o.nota(l) ? '<span class="gb-nota">' + esc(o.nota(l)) + '</span>' : '') + '</li>';
  }).join('') + '</ol>';
};

/* ---------------------------------------------------------------------
   2. BARRAS DE FAIXA: valor fixo (sólido) + até o valor máximo (retícula)
   --------------------------------------------------------------------- */
Graficos.barrasFaixa = function (el, linhas, o) {
  const max = Math.max(...linhas.map(l => +(l[o.maximo] || l[o.fixo] || 0)));
  const larg = v => 'calc((100% - 120px) * ' + (v / max).toFixed(4) + ')';
  el.innerHTML =
    '<p class="gb-legenda legenda"><span class="chave chave-solida" aria-hidden="true"></span>valor fixo anual <span class="chave chave-retic" aria-hidden="true"></span>até o valor máximo anual, com bônus</p>' +
    '<ol class="gb">' + linhas.map(l => {
      const f = +l[o.fixo] || 0, m = +l[o.maximo] || 0;
      const txt = f && m ? 'R$ ' + Graficos.fmt(f, f % 1 ? 1 : 0) + ' a ' + Graficos.fmt(m) + ' mi'
        : f ? 'R$ ' + Graficos.fmt(f, f % 1 ? 1 : 0) + ' mi' : m ? 'até R$ ' + Graficos.fmt(m) + ' mi' : 'valor não divulgado';
      return '<li class="gb-linha"><span class="gb-rot">' + esc(l[o.rotulo]) + '</span><span class="gb-trilho">' +
        (f ? '<span class="gb-barra destaque-seg" style="width:' + larg(f) + '"></span>' : '') +
        (m > f ? '<span class="gb-barra" style="width:' + larg(m - f) + '"></span>' : '') +
        '<span class="gb-val">' + txt + '</span></span></li>';
    }).join('') + '</ol>';
};

/* ---------------------------------------------------------------------
   3. GRÁFICO DE UNIDADES: camisas (com nome) ou pontos/quadrados
   itens: [{rotulo, classe}], classe ∈ u-solido | u-retic | u-vazio | u-dano | u-apagado
   --------------------------------------------------------------------- */
const CAMISA = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path class="u-tecido" d="M8 2 3 5 1 10l4 1v11h14V11l4-1-2-5-5-3c-1 2-2.4 3-4 3S9 4 8 2Z"/><rect class="u-peito" x="7.5" y="9" width="9" height="5.5"/></svg>';
Graficos.unidades = function (el, itens, o) {
  o = o || {};
  const forma = o.forma || 'ponto';
  el.innerHTML = (forma === 'camisa' ? '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><pattern id="retic-camisa" width="2.2" height="2.2" patternUnits="userSpaceOnUse"><rect width="2.2" height="2.2" fill="#fff"/><circle cx="1.1" cy="1.1" r=".55" fill="var(--color-tinta_azul)"/></pattern></defs></svg>' : '') +
    '<ul class="gu gu-' + forma + '"' + (o.colunas ? ' style="--colunas:' + o.colunas + '"' : '') + '>' +
    itens.map(it => '<li class="gu-item ' + (it.classe || '') + '">' +
      (forma === 'camisa' ? CAMISA + '<span class="gu-rot">' + esc(it.rotulo) + '</span>' : '<span class="gu-marca" aria-hidden="true"></span>') +
    '</li>').join('') + '</ul>';
};
/* Muda só as classes (para o scrollytelling) sem redesenhar */
Graficos.reclassificar = function (el, classes) {
  $$('.gu-item', el).forEach((li, i) => { li.className = 'gu-item ' + (classes[i] || ''); });
};
/* Legenda de categorias (sempre presente quando há 2 ou mais) */
Graficos.legenda = function (el, itens) {
  el.innerHTML = itens.map(([classe, texto]) => '<span class="leg-item"><span class="leg-chave ' + classe + '" aria-hidden="true"></span>' + esc(texto) + '</span>').join('');
};

/* ---------------------------------------------------------------------
   4. MATRIZ (veículo × tipo de vínculo), em tabela acessível
   --------------------------------------------------------------------- */
Graficos.matriz = function (el, linhas, o) {
  const linhasNomes = [...new Set(linhas.map(l => l[o.linha]))];
  const colunas = o.colunas;
  const celula = (ln, col) => linhas.find(l => l[o.linha] === ln && l[o.coluna] === col);
  el.innerHTML = '<table class="gm"><thead><tr><th scope="col">' + esc(o.titulo_linha) + '</th>' +
    colunas.map(c => '<th scope="col">' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' +
    linhasNomes.map(ln => '<tr><th scope="row">' + esc(ln) + '</th>' + colunas.map(c => {
      const x = celula(ln, c);
      return x ? '<td class="gm-sim"><span class="gm-simbolo" aria-hidden="true">●</span> ' + esc(x[o.texto]) + '</td>'
               : '<td class="gm-nao"><span class="gm-simbolo" aria-hidden="true">○</span><span class="sr">sem registro</span></td>';
    }).join('') + '</tr>').join('') + '</tbody></table>';
};

/* ---------------------------------------------------------------------
   5. CARTÕES (ex.: naming rights), com estado para o scrollytelling
   --------------------------------------------------------------------- */
Graficos.cartoes = function (el, linhas, o) {
  el.innerHTML = '<ul class="gc">' + linhas.map((l, i) => '<li class="gc-item" data-i="' + i + '" data-grupo="' + esc(l[o.grupo] || '') + '">' +
    '<span class="eyebrow">' + esc(l[o.eyebrow]) + '</span>' +
    '<span class="gc-tit">' + esc(l[o.titulo]) + '</span>' +
    '<span class="gc-txt">' + esc(o.texto(l)) + '</span>' +
    '<span class="gc-status">' + esc(l[o.status]) + '</span></li>').join('') + '</ul>';
};

/* ---------------------------------------------------------------------
   6. LINHA DO TEMPO em faixas (SVG 960 de largura; rola de lado no celular)
   linhas do CSV: id, data_inicio, data_fim, data_texto, evento, tipo, fonte, destaque, rotulo_curto, rotulo_lado
   - tipo igual a uma faixa → marca na faixa (com data_fim → cápsula de período)
   - tipo fora das faixas e com data_fim → fundo sombreado atravessando o gráfico
   opções: faixas [[tipo, nome, forma]], inicio, fim, anotacao {de, ate, texto}, formas por faixa
   --------------------------------------------------------------------- */
Graficos.linhaDoTempo = function (el, dados, o) {
  const k = o.ampliar || 1;                         /* aumenta letras e marcas quando o gráfico fica pequeno */
  const W = 960, M = { e: 140 * k, d: 24, t: 56 * k, b: 40 * k }, alturaFaixa = o.alturaFaixa || 76;
  const H = M.t + 30 + o.faixas.length * alturaFaixa + M.b - 30;
  const t = s => new Date(s + 'T12:00:00').getTime();
  const x0 = t(o.inicio), x1 = t(o.fim);
  const X = d => M.e + (t(d) - x0) / (x1 - x0) * (W - M.e - M.d);
  const iF = tipo => o.faixas.findIndex(f => f[0] === tipo);
  const Y = tipo => M.t + 34 + iF(tipo) * alturaFaixa;
  const id = 'tl' + Math.random().toString(36).slice(2, 7);
  let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(o.rotuloAria || 'Linha do tempo') + '">' +
    '<defs><pattern id="' + id + '" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.4" fill="var(--color-tinta_azul)"/></pattern></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="var(--color-superficie)"/>';
  dados.filter(d => iF(d.tipo) < 0 && d.data_fim).forEach(d => {
    const a = X(d.data_inicio), b = X(d.data_fim);
    s += '<rect x="' + f1(a) + '" y="' + (M.t + 4) + '" width="' + f1(b - a) + '" height="' + (H - M.t - M.b - 4) + '" fill="var(--color-seq_1)" stroke="var(--color-tinta_azul)" stroke-width="1"/>' +
      '<text x="' + f1((a + b) / 2) + '" y="' + (H - M.b - 10) + '" text-anchor="middle" font-size="' + (13 * k) + '" fill="var(--color-texto)">' + esc(d.rotulo_curto || d.data_texto) + '</text>';
  });
  const a0 = new Date(x0).getFullYear() + 1, a1 = new Date(x1).getFullYear();
  for (let ano = a0; ano <= a1; ano++) {
    const xa = X(ano + '-01-01');
    s += '<line x1="' + f1(xa) + '" y1="' + (M.t + 4) + '" x2="' + f1(xa) + '" y2="' + (H - M.b) + '" stroke="var(--color-linha)" stroke-width="1"/>' +
      '<text x="' + f1(xa) + '" y="' + (H - M.b + 19) + '" text-anchor="middle" font-size="' + (13 * k) + '" fill="var(--color-texto_suave)">' + ano + '</text>';
  }
  s += '<line x1="' + M.e + '" y1="' + (H - M.b) + '" x2="' + (W - M.d) + '" y2="' + (H - M.b) + '" stroke="var(--color-texto)" stroke-width="1"/>';
  o.faixas.forEach(([k, nome]) => {
    s += '<line x1="' + M.e + '" y1="' + Y(k) + '" x2="' + (W - M.d) + '" y2="' + Y(k) + '" stroke="var(--color-linha)" stroke-width="1"/>' +
      '<text x="12" y="' + (Y(k) + 5) + '" font-size="' + (13 * k) + '" font-weight="600" fill="var(--color-texto)">' + esc(nome) + '</text>';
  });
  if (o.anotacao) {
    const a = X(o.anotacao.de), b = X(o.anotacao.ate), yb = M.t - 4;
    s += '<path d="M' + f1(a) + ',' + (yb + 10) + ' V' + yb + ' H' + f1(b) + ' V' + (yb + 10) + '" fill="none" stroke="var(--color-tinta_azul)" stroke-width="1"/>' +
      '<text x="' + f1((a + b) / 2) + '" y="' + (yb - 9) + '" text-anchor="middle" font-size="' + (14 * k) + '" font-weight="600" fill="var(--color-tinta_azul)">' + esc(o.anotacao.texto) + '</text>';
  }
  const marcas = dados.filter(d => iF(d.tipo) >= 0);
  marcas.forEach((d, i) => {
    const cx = X(d.data_inicio), cy = Y(d.tipo), forma = o.faixas[iF(d.tipo)][2] || 'quadrado';
    const dano = d.destaque === 'dano', dest = d.destaque === 'sim';
    const preench = dano ? 'var(--color-alerta)' : dest ? 'var(--color-tinta_azul)' : 'url(#' + id + ')';
    const borda = dano ? 'var(--color-alerta)' : 'var(--color-tinta_azul)';
    let f;
    if (d.data_fim) {
      const xb = X(d.data_fim);
      f = '<rect x="' + f1(cx) + '" y="' + (cy - 7) + '" width="' + f1(Math.max(6, xb - cx)) + '" height="14" fill="' + preench + '" stroke="' + borda + '" stroke-width="1.5"/>';
    } else if (forma === 'quadrado') f = '<rect x="' + f1(cx - 7 * k) + '" y="' + (cy - 7 * k) + '" width="' + 14 * k + '" height="' + 14 * k + '" fill="' + preench + '" stroke="' + borda + '" stroke-width="1.5"/>';
    else if (forma === 'circulo') f = '<circle cx="' + f1(cx) + '" cy="' + cy + '" r="' + 7.5 * k + '" fill="' + preench + '" stroke="' + borda + '" stroke-width="1.5"/>';
    else f = '<polygon points="' + f1(cx) + ',' + (cy - 9) + ' ' + f1(cx + 8.5) + ',' + (cy + 6) + ' ' + f1(cx - 8.5) + ',' + (cy + 6) + '" fill="' + preench + '" stroke="' + borda + '" stroke-width="1.5"/>';
    const xr = d.data_fim ? (cx + X(d.data_fim)) / 2 : cx;
    const rot = d.rotulo_curto ? '<text x="' + f1(d.data_fim ? xr : xr + (d.rotulo_lado === 'esq' ? -13 : 13)) + '" y="' + (d.data_fim ? cy - 13 : cy + 5) + '" text-anchor="' + (d.data_fim ? 'middle' : d.rotulo_lado === 'esq' ? 'end' : 'start') + '" font-size="' + (13 * k) + '" font-weight="600" fill="var(--color-texto)">' + esc(d.rotulo_curto) + '</text>' : '';
    s += '<g class="marca" tabindex="0" data-i="' + i + '" data-id="' + esc(d.id) + '" aria-label="' + esc(d.data_texto + ': ' + d.evento) + '">' +
      '<circle class="alvo" cx="' + f1(xr) + '" cy="' + cy + '" r="16"/><circle class="anel-marca" cx="' + f1(xr) + '" cy="' + cy + '" r="14"/>' + f + '</g>' + rot;
  });
  s += '</svg><div class="tooltip" hidden></div>';
  el.innerHTML = s;
  const tt = $('.tooltip', el);
  $$('.marca', el).forEach(g => {
    const d = marcas[+g.dataset.i];
    const mostrar = () => {
      tt.innerHTML = '<strong>' + esc(d.data_texto) + '</strong>' + esc(d.evento) + '<br><span style="color:var(--color-texto_suave)">Fonte: ' + esc(d.fonte) + (d.status && d.status !== 'OK' ? ' · ' + esc(d.status) : '') + '</span>';
      tt.hidden = false;
      const r = g.getBoundingClientRect(), a = el.getBoundingClientRect();
      tt.style.left = Math.max(4, Math.min(r.left - a.left + r.width / 2 - 130, a.width - 264)) + 'px';
      tt.style.top = (r.bottom - a.top + 6) + 'px';
    };
    g.addEventListener('mouseenter', mostrar); g.addEventListener('focus', mostrar);
    g.addEventListener('mouseleave', () => { tt.hidden = true; }); g.addEventListener('blur', () => { tt.hidden = true; });
  });
};
/* Destaca marcas da linha do tempo por id (scrollytelling) */
Graficos.destacarMarcas = function (el, ids) {
  $$('.marca', el).forEach(g => g.classList.toggle('ativa', ids.includes(g.dataset.id)));
  /* no celular a linha do tempo rola de lado: leva a marca ativa para o centro */
  const rol = el.closest('.tl-rolagem'), alvo = $('.marca.ativa', el);
  if (rol && alvo && rol.scrollWidth > rol.clientWidth) {
    const r = alvo.getBoundingClientRect(), c = rol.getBoundingClientRect();
    rol.scrollTo({ left: rol.scrollLeft + r.left - c.left - c.width / 2, behavior: movimentoReduzido() ? 'auto' : 'smooth' });
  }
};

/* ---------------------------------------------------------------------
   7. TABELA ACESSÍVEL a partir das linhas do CSV
   colunas: [[campo, 'Título da coluna'], ...]
   --------------------------------------------------------------------- */
Graficos.tabela = function (tabela, linhas, colunas) {
  tabela.insertAdjacentHTML('beforeend', '<thead><tr>' + colunas.map(c => '<th scope="col">' + esc(c[1]) + '</th>').join('') + '</tr></thead><tbody>' +
    linhas.map(l => '<tr>' + colunas.map(c => '<td>' + esc(l[c[0]] == null ? '' : l[c[0]]) + '</td>').join('') + '</tr>').join('') + '</tbody>');
};
