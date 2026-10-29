/* =====================================================================
   DA SORTE AO DECLÍNIO · MAPA NARRATIVO E CONFIGURAÇÃO DO SITE
   ---------------------------------------------------------------------
   Este é o arquivo que a equipe mais vai editar. Tudo o que aparece em
   várias páginas mora aqui: títulos, linhas finas, rótulos da trajetória,
   setores do estádio, achados da home, créditos e aviso de jogo responsável.
   Regra de ouro: mexa só no texto entre aspas; não apague vírgulas nem chaves.
   ===================================================================== */

/* ---------------------------------------------------------------------
   0. PROJETO: créditos, datas e licenças (aparecem no rodapé de todas as páginas
      e na página Quem somos). Texto que começa com "[" aparece em vermelho
      como pendência até ser substituído.
   --------------------------------------------------------------------- */
const PROJETO = {
  creditos: [
    ['Reportagem e texto', '[A PREENCHER: nomes]'],
    ['Dados', '[A PREENCHER: nomes]'],
    ['Design e desenvolvimento', '[A PREENCHER: nomes]'],
    ['Orientação', '[A PREENCHER: professor(a)]']
  ],
  disciplina: 'Narrativas Inovadoras com Dados na Comunicação Digital',
  instituicao: 'UFPE · Centro de Artes e Comunicação (CAC)',
  /* Links das instituições (barra do topo, menu e rodapé). Confira os endereços antes de publicar. */
  links: [
    { sigla: 'UFPE', nome: 'Universidade Federal de Pernambuco', url: 'https://www.ufpe.br' },
    { sigla: 'CAC', nome: 'Centro de Artes e Comunicação', url: 'https://www.ufpe.br/cac' },
    { sigla: 'CIn', nome: 'Centro de Informática', url: 'https://www.cin.ufpe.br' }
  ],
  semestre: '[A PREENCHER]',
  publicado_em: '[A PREENCHER]',
  atualizado_em: '14/10/2026',
  repositorio: '[A PREENCHER: endereço do repositório no GitHub]',
  licenca_conteudo: 'Textos e dados: CC BY 4.0. Os relatos do Guia do Ministério da Saúde seguem CC BY-NC-SA 4.0.',
  licenca_codigo: 'Código: MIT. Ícones: Lucide (ISC).',
  /* Aviso de jogo responsável (seção B, ajustado à MP 1.394/2026). Os canais devem ser conferidos antes da publicação. */
  aviso_jogo_responsavel: '<strong>Apostar pode causar dependência.</strong> Uma medida provisória de setembro de 2026 proíbe as apostas de quota fixa no Brasil; a medida ainda está em análise no Congresso. Se está difícil parar, procure o CAPS ou a UBS da sua cidade, ou os Jogadores Anônimos. Em sofrimento emocional, ligue <strong>188</strong> (CVV). Teleatendimento do Ministério da Saúde: <span class="pendente">[A CONFIRMAR]</span>'
};

/* ---------------------------------------------------------------------
   1. MAPA NARRATIVO (seção L). rotulo_temporal traz a proposta S2,
      ainda a confirmar pela equipe (rotulo_confirmado: false).
   --------------------------------------------------------------------- */
const MAPA = {
  titulo: "Da Sorte ao Declínio",
  subtitulo: "Dossiê das bets no futebol",
  ordem_linha_declinio: ["r1", "r2", "r3", "r4", "r5", "r6"],
  reportagens: [
    {
      id: "r1", numero: 1,
      titulo_provisorio: "Antes do apito, a propaganda",
      linha_fina: "O que são as bets, como funciona uma aposta de quota fixa e como o setor foi legalizado no Brasil.",
      tema: "Introdução: o que são as bets e como funcionam",
      hotspot_estadio: "hs_r1", posicao_na_linha_declinio: 1,
      rotulo_temporal: "2018 · Lei 13.756 legaliza a aposta de quota fixa", rotulo_confirmado: false,
      cor_token: "cat_r1",
      pergunta_central: "O que é uma aposta de quota fixa e como ela chegou ao futebol brasileiro?"
    },
    {
      id: "r2", numero: 2,
      titulo_provisorio: "O que se assina longe da torcida",
      linha_fina: "Patrocínios, contratos e jogadores-garotos-propaganda: como as bets entraram nos clubes.",
      tema: "Bets nos clubes",
      hotspot_estadio: "hs_r2", posicao_na_linha_declinio: 2,
      rotulo_temporal: "2019–2022 · Patrocínios tomam as camisas", rotulo_confirmado: false,
      cor_token: "cat_r2",
      pergunta_central: "Quantos clubes passaram a depender do dinheiro das bets, e em que condições?"
    },
    {
      id: "r3", numero: 3,
      titulo_provisorio: "A voz do jogo tem patrocinador",
      linha_fina: "Quem narra a partida também anuncia a aposta, e o torcedor ouve as duas coisas no mesmo tom.",
      tema: "Veículos de comunicação patrocinados",
      hotspot_estadio: "hs_r3", posicao_na_linha_declinio: 3,
      rotulo_temporal: "2024–2026 · A transmissão vira vitrine", rotulo_confirmado: false,
      cor_token: "cat_r3",
      pergunta_central: "Quanto da cobertura esportiva é financiada por casas de aposta?"
    },
    {
      id: "r4", numero: 4,
      titulo_provisorio: "O campeonato tem dono",
      linha_fina: "Quando a competição inteira tem patrocinador e o resultado vira mercadoria.",
      tema: "Competições e federações (inclui manipulação de resultados)",
      hotspot_estadio: "hs_r4", posicao_na_linha_declinio: 4,
      rotulo_temporal: "2024 · O Brasileirão ganha nome de bet", rotulo_confirmado: false,
      cor_token: "cat_r4",
      pergunta_central: "Como as bets chegaram às competições e onde a integridade do jogo foi posta em risco?"
    },
    {
      id: "r5", numero: 5,
      titulo_provisorio: "Quem revisa o lance das bets",
      linha_fina: "Leis, portarias e fiscalização: o que a regulamentação mudou e o que ficou de fora.",
      tema: "Regulamentação das bets",
      hotspot_estadio: "hs_r5", posicao_na_linha_declinio: 5,
      rotulo_temporal: "2023–2025 · Lei 14.790 e mercado regulado", rotulo_confirmado: false,
      cor_token: "cat_r5",
      pergunta_central: "O Estado chegou a tempo de frear o setor?"
    },
    {
      id: "r6", numero: 6,
      titulo_provisorio: "Da torcida à aposta: quem paga a conta",
      linha_fina: "O torcedor que virou apostador, o dinheiro que sai do orçamento da casa e o custo que fica para a saúde pública.",
      tema: "Torcedores como apostadores (lado social)",
      hotspot_estadio: "hs_r6", posicao_na_linha_declinio: 6,
      rotulo_temporal: "2025–2026 · A conta chega à saúde pública", rotulo_confirmado: false,
      cor_token: "cat_r6",
      pergunta_central: "Quem aposta, quanto gasta e qual é o custo social?"
    }
  ],
  paginas_extras: ["quem-somos", "metodologia-e-dados"]
};

/* A ponta da seta da linha de declínio (suposição S2). */
const FIM_DA_LINHA = {
  rotulo: "set/2026 · MP 1.394 proíbe as apostas de quota fixa",
  nota: "A medida ainda está em análise no Congresso."
};

/* ---------------------------------------------------------------------
   2. SETORES DO ESTÁDIO (seção F): rótulo, microcopy e posição do marcador
      no viewBox 0 0 960 540.
   --------------------------------------------------------------------- */
const ESTADIO = {
  hs_r1: { area: "Placas de publicidade", curto: "Placas", icone: "megaphone", marcador: [220, 402],
           microcopy: "Antes do apito, a propaganda. Como funciona uma aposta de quota fixa." },
  hs_r2: { area: "Túnel do vestiário", curto: "Vestiário", icone: "door-open", marcador: [480, 336],
           microcopy: "O que se assina longe da torcida: patrocínios, jogadores e contratos." },
  hs_r3: { area: "Cabine de imprensa", curto: "Imprensa", icone: "video", marcador: [576, 172],
           microcopy: "Quem narra o jogo também anuncia a aposta?" },
  hs_r4: { area: "Gramado e faixa do campeonato", curto: "Gramado", icone: "trophy", marcador: [480, 506],
           microcopy: "Quando o campeonato inteiro tem patrocinador e o resultado vira mercadoria." },
  hs_r5: { area: "Cabine do VAR", curto: "VAR", icone: "landmark", marcador: [386, 486],
           microcopy: "Quem revisa o lance das bets: leis, portarias e fiscalização." },
  hs_r6: { area: "Arquibancada", curto: "Arquibancada", icone: "users", marcador: [150, 214],
           microcopy: "Da torcida à aposta: quem paga a conta." }
};

/* ---------------------------------------------------------------------
   3. ACHADOS COM FONTE (somente itens [OK] do bloco de conteúdo).
   --------------------------------------------------------------------- */
const ACHADOS = {
  r1: { valor: "R$ 240 bi", rotulo: "movimentados em apostas pelas famílias brasileiras em 2024",
        fonte: "Banco Central, citado no Dossiê IEPS (2025)" },
  r2: { valor: "R$ 1,14 bi", rotulo: "das bets nos 20 clubes da Série A em 2025, 7,9% do faturamento deles",
        fonte: "Terra (set/2026)" },
  r3: { valor: "53%", rotulo: "das pessoas de 9 a 17 anos viram publicidade de apostas na internet",
        fonte: "TIC Kids Online 2025 (Cetic.br), citado no Dossiê IEPS" },
  r4: { valor: "2 de 2", rotulo: "principais competições da CBF levavam o nome de uma casa de apostas antes da MP",
        fonte: "Terra; Gazeta do Povo" },
  r5: { valor: "R$ 33 mi", rotulo: "repassados ao Ministério da Saúde até 25/08/2025, valor declarado pelas operadoras",
        fonte: "Dossiê IEPS (2025)" },
  r6: { valor: "10,9 mi", rotulo: "de brasileiros com padrão de jogo de risco ou problemático",
        fonte: "LENAD III (Unifesp), dados de 2023" }
};

