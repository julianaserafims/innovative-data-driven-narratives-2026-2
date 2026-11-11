# Revisão final · Da Sorte ao Declínio

Oct 21, 2026 · @Juliana

O site passa na auditoria de acessibilidade (0 violações em 9 páginas), segue o pacote de design e cumpre as regras de ética. O que ainda separa o dossiê da publicação e da inscrição no prêmio é conteúdo da equipe: créditos, data de publicação e a checagem de 11 grupos de dados.

> **Atualização de 30/10/2026 (PRs #1, #2 e #3, já no ar):** responsividade no celular revisada; créditos centralizados em `PROJETO.equipe`; 18 das 23 pendências resolvidas, cada dado com fonte; as 3 que faltam são decisões da equipe (veja "Pendências"). As 20 planilhas com dados estão com todas as linhas OK. O que não teve fonte saiu do texto e está listado na Metodologia, em "O que foi retirado por falta de fonte". Auditoria axe-core refeita em 29/10: 0 violações nas 9 páginas, em 1280px e 390px. O status de cada item está na coluna Status da tabela de pendências.
>
> **Atualização de 11/11/2026 (PR #4, já no ar, e PR "conferir-dados", aguardando merge):** o PR #4 corrigiu bugs técnicos: fonte inválida na linha do tempo, ids duplicados nos dois estádios das reportagens, menu como diálogo modal, posição mantida ao recarregar ou voltar e mensagem de erro para CSV com defeito. Ele também passou a esconder do rodapé e da abertura os créditos ainda `[A PREENCHER]`. O PR seguinte faz o `[A CONFIRMAR]` dos rótulos da trajetória obedecer a `rotulo_confirmado`, aceita CSV com BOM e tira os falsos alertas do script `ferramentas/conferir-dados.py`. Auditoria refeita em 11/11: 0 violações do axe nas 9 páginas, sem rolagem lateral de 320 a 1280px.

## O que foi corrigido nesta revisão

A auditoria encontrou 6 problemas, todos corrigidos e retestados nas 9 páginas, em 1280px e 390px. Para levar ao repositório, reenvie os 15 arquivos da última coluna (veja "Como levar as correções para o GitHub").

| Problema encontrado | Onde | Correção | Arquivos |
| --- | --- | --- | --- |
| Marcas da linha do tempo com `aria-label` sem papel válido (erro grave no axe) | r1, r5 | `role="img"` e área de toque de 44px | `assets/js/graficos.js` |
| Texto dos itens “apagados” do scrollytelling com contraste de 1,6:1 a 2,9:1 | r2, r4 | Cinza `texto_suave` (7,44:1) no lugar de opacidade | `assets/css/site.css` |
| Partes do esquema invisíveis até a rolagem (proibido pela seção H) | r1 | Tudo visível; passo atual com marca-texto amarelo | `reportagens/r1.html`, `assets/css/site.css` |
| Tabelas e gráficos com rolagem lateral inacessíveis pelo teclado | r3, r4, r5 | Áreas roláveis recebem foco e nome | `assets/js/site.js`, `assets/js/reportagem.js` |
| Alvos de toque menores que 44px; estádio final não virava trajetória no celular | todas | Rodapé e links de fonte com 44px; câmera da abertura fora do Tab; estádio final com rolagem lateral | `assets/css/site.css`, `assets/js/reportagem.js` |
| Dados: URL com vírgula quebrando um CSV; data da MP só como “set/2026”; status do r4 em coluna errada; sem data de coleta em parte dos gráficos | dados, Metodologia | CSV corrigido; MP em 25/09/2026; colunas renomeadas; “Coleta: out/2026” em todas as fontes; rótulo duplicado na r6 | `data/linha-do-tempo-geral.csv`, `data/r1-marcos-legais.csv`, `data/r4-naming-rights.csv`, `data/r5-regulacao.csv`, `metodologia.html`, `reportagens/r1.html` a `r6.html` |

## Diretrizes da disciplina

Os seis critérios da disciplina estão cumpridos. O ponto mais fraco é o conteúdo jornalístico das reportagens 3 e 4, que ainda depende de apuração.

| Critério | Status | Como o site cumpre |
| --- | --- | --- |
| Narrativo | ✔ | Seis reportagens em ordem, do anúncio na placa ao custo para o torcedor; a bola que perde o quique costura a sequência |
| Jornalístico | ✔ com ressalva | Achados com fonte em cada reportagem; r3 (mídia) e r4 (manipulação) ainda têm pouco dado checado |
| Interativo | ✔ | Estádio clicável, trajetória navegável por botões e setas, scrollytelling em todas as reportagens, dicas nos gráficos |
| Feito para mídias digitais | ✔ | Responsivo de 320px a desktop; publicado no GitHub Pages |
| Exploratório e aberto | ✔ | Três portas de entrada (trajetória, estádio, lista); o leitor escolhe a ordem; dados para baixar |
| Foge do comum | ✔ | Estádio desenhado por código que se transforma na trajetória da bola; desregistro de tinta nos títulos de r1 a r6 |

## Requisitos do Prêmio Cláudio Weber Abramo

A parte técnica está pronta; faltam três itens que só a equipe resolve: créditos, data de publicação e pedidos via LAI. Antes de inscrever, confirmem no regulamento da edição o período de publicação aceito e o limite de inscrições por categoria.

> **Regulamento conferido em 11/11/2026.** A 8ª edição (2026) aceitou só trabalhos publicados entre 09/06/2025 e 14/06/2026, com inscrições de 15/06 a 17/07 (a tabela do regulamento fala em 02/08, provavelmente uma prorrogação); os vencedores saem em 12/11/2026, no Coda.Br. **O dossiê, publicado em out–nov/2026, fica para a 9ª edição (2027)**, ainda sem regulamento. Se o padrão das últimas edições se mantiver, a janela de 2027 deve começar logo depois de 14/06/2026 e cobrir o dossiê (isso é inferência, não regra publicada).
>
> O que vale para planejar, segundo a edição 2026:
> - **Categorias:** Visualização de dados, Investigação, Inovação e experimentação e Dados abertos. Não há categoria para estudantes.
> - **Limite:** até 3 trabalhos por categoria por proponente; o mesmo trabalho não pode ir em duas categorias. A inscrição é gratuita.
> - **Requisitos:** língua portuguesa; qualquer meio, inclusive "hotsites e plataformas web"; pessoas físicas maiores de 18 anos ou coletivos, formalizados ou não.
> - **Ponto a esclarecer com a organização:** o regulamento pede "vínculo de trabalho ou autorização formal da organização que publicou o conteúdo". Não está claro se um site próprio de estudantes, com orientação da UFPE, atende a isso. Vale perguntar à Escola de Dados (Open Knowledge Brasil) antes da próxima edição.
> - A categoria Dados abertos valoriza trabalhos feitos com LAI ou bases públicas que publicam código e metodologia, o que combina com o dossiê.
>
> Fontes: anúncio da 8ª edição e dos finalistas no blog da Escola de Dados; regulamento e FAQ em premio.jornalismodedados.org.br (o site recusou acesso automático; os trechos vieram da busca e devem ser conferidos no navegador).

| Requisito | Status | Situação |
| --- | --- | --- |
| Título-afirmação em cada gráfico | ✔ | Todos os 17 gráficos e esquemas têm título com verbo e conclusão |
| Linha fina, anotações, fonte e data de coleta visíveis | ✔ | “Coleta: out/2026” em todas as notas de fonte (corrigido nesta revisão) |
| Descrição textual e tabela de dados | ✔ | “Ler descrição do gráfico” com texto e tabela em cada gráfico |
| Botão “Baixar dados (CSV)” | ✔ | Em todos os gráficos; 20 CSVs em `/data`, lidos pelo próprio site |
| Página de metodologia | ✔ | Perguntas, fontes, período, tratamentos, limitações e pendências prontos; a seção de LAI diz que não houve pedidos nesta edição, e as correções entram por issue no GitHub (11/11) |
| Código aberto, README e licenças | ✔ | Repositório público; MIT para código, CC BY 4.0 para conteúdo |
| Achados de interesse público | ✔ | Caixa “O que a apuração mostra” e “Em números” em cada reportagem |
| Créditos completos | ✘ parcial | Autoria dos 6 textos e os 24 nomes e cursos preenchidos (30/10); faltam funções da Computação, função de Maria Rita, orientação |
| Data de publicação visível | ✘ | Campo existe no rodapé e nas reportagens, ainda vazio |
| Português e meio digital | ✔ | `lang="pt-BR"` em todas as páginas; URL pública no GitHub Pages |
| Dados verificados | ✔ | Todas as linhas das 20 planilhas com dados estão OK, com fonte (30/10); o que não teve fonte foi retirado e listado na Metodologia |

## Acessibilidade (WCAG 2.2 AA)

A auditoria automática com axe-core 4.10 terminou com 0 violações nas 9 páginas, em 1280px com movimento normal e em 390px com movimento reduzido. A primeira rodada tinha encontrado 6 tipos de problema, corrigidos nesta revisão. Falta um teste com leitor de tela real (NVDA ou VoiceOver), que a ferramenta automática não substitui.

| Item | Status | Resultado |
| --- | --- | --- |
| Navegação por teclado | ✔ | Tab percorre cabeçalho, entrada, quiques 1 a 6, estádio na ordem r1→r6, lista e rodapé |
| Menu lateral | ✔ | Diálogo modal (PR #4): o resto da página fica inerte enquanto o menu está aberto; Esc fecha e devolve o foco ao botão |
| Contraste | ✔ | Pares de texto do pacote acima de 4,5:1; itens apagados corrigidos para 7,44:1 |
| Foco visível | ✔ | Anel azul de 3px com halo branco; nos números do estádio, anel no marcador |
| Textos alternativos | ✔ | Estádio com título, descrição e lista equivalente visível; gráficos com descrição e tabela |
| Movimento reduzido | ✔ | Sem animações, sem erros, todo o conteúdo visível em repouso |
| Estrutura | ✔ | Um h1 por página, sem saltos de título, landmarks header/nav/main/footer, “Pular para o conteúdo” |
| Alvos de toque | ✔ | Botões, links de navegação e números com 44px; marcas de gráfico com 24 a 35px, dentro do mínimo AA de 24px |
| Som | ✔ | Desligado por padrão, botão com `aria-pressed`, legenda textual |
| Leitor de tela real | ◐ | A árvore de acessibilidade foi conferida em 11/11; falta ouvir a home e uma reportagem com NVDA (Windows) ou VoiceOver (Mac/iPhone) |

## Fidelidade ao pacote de design

O site usa os 108 tokens da seção M sem cores ou fontes extras. Há três desvios, todos aprovados pela equipe nas etapas anteriores.

| Item | Status | Situação |
| --- | --- | --- |
| Tokens (seção M) | ✔ | `tokens.css` gerado de `tokens.json` por `ferramentas/gerar-tokens.py`, nomes idênticos |
| Tipografia (seção D) | ✔ | Big Shoulders Display, Literata e Azeret Mono, escala mobile/desktop do pacote |
| Formas e grid (seção E) | ✔ | Raio 0 em tudo exceto marcadores; sombra riso só em cartões; contêiner de 1200px |
| Estádio (seção F) | ✔ com desvio | Geometria p(u,v), 6 hotspots nas coordenadas, lista equivalente; desde o PR #1 o estádio cabe na largura do celular, sem o mínimo de 720px (desvio a aprovar) |
| Linguagem de dados (seção G) | ✔ | Uma marca em destaque por gráfico, retícula nas demais, fonte e CSV em todos |
| Movimento e som (seção H) | ✔ | Durações e easing do pacote; nada invisível em repouso (corrigido no esquema da r1) |
| Componentes (seção J) | ✔ | Os 15 componentes com seus estados, inclusive “visitado” e desabilitado |
| Tom de voz (seção B) | ✔ | Nenhuma palavra proibida; “bônus” aparece 2 vezes só em contexto jornalístico (a portaria que proibiu o bônus de boas-vindas e os valores de contrato da r2) |
| Imagens (seção I) | — | O site ainda não usa fotos; quando entrarem, seguir duotom e regra de crédito |

Desvios aprovados:

- A home segue a Opção C: a linha de declínio virou a trajetória de uma bola, com o selo “Trajetória ilustrativa · não representa dados”.
- A cabine do VAR foi desenhada em primeiro plano, cortada pela borda, para não ficar sobre o gramado.
- O aviso de jogo responsável menciona a MP 1.394/2026 e que ela está em análise no Congresso.

Desvios a aprovar (PR #1, 28/10/2026):

- Estádio sem largura mínima de 720px no celular, com marcadores ampliados para o toque.
- Barra do topo azul com friso amarelo e verde e links de texto para UFPE, CAC e CIn no lugar dos logos.

## Ética

Todos os critérios de ética estão cumpridos. O único ponto de atenção é o status da MP, que pode mudar antes da inscrição.

| Critério | Status | Situação |
| --- | --- | --- |
| Marcas fictícias nas ilustrações | ✔ | O desenho do estádio só tem BET X, Y e Z; marcas reais aparecem apenas em texto, tabelas e dados |
| Nada que incentive apostas | ✔ | Sem simulação de ganho; o esquema da r1 mostra a margem da casa com valores fictícios rotulados |
| Som sem recompensa | ✔ | Moedas que vão parando, desligado por padrão; sem caixa registradora ou jackpot |
| Aviso de jogo responsável | ✔ | Em todas as páginas e no topo da r6; teleatendimento do SUS pelo Meu SUS Digital; autoexclusão informada como fora do ar desde a MP (30/10) |
| Metáfora × dado | ✔ | Trajetória, estádio e esquema com selo de ilustração; gráficos de dado sem filtro de rugosidade |
| Dados fictícios rotulados | ✔ | Pesquisa própria com selo amarelo “dado fictício para protótipo” |
| Relatos e temas sensíveis | ✔ | Relatos anônimos do Guia do Ministério da Saúde com licença; custo por suicídio fora dos destaques; CVV 188 perto |
| Proibição tratada como provisória | ✔ | Todo o site diz que a MP está em análise no Congresso |

Situação da MP em 21/10/2026: editada em 25/09/2026, em vigor, operadoras tiveram até 06/10/2026 para encerrar, 94 emendas no Congresso e pedido de suspensão no STF (ADI 7721) sem decisão. Revisem o texto do aviso e das reportagens 1 e 5 na semana da publicação.

## Pendências

Situação em 11/11/2026. **A apuração das reportagens está concluída:** os 14 itens de dados foram resolvidos, cada um com fonte. Falta o que depende da equipe: **3 itens**, todos decisões rápidas, e 1 lembrete para a semana da publicação. Fora das pendências, ainda vale ouvir a home e uma reportagem com leitor de tela (NVDA ou VoiceOver), cerca de 30 minutos. Os números (#) são os mesmos da primeira versão desta revisão.

### O que falta

| # | O que fazer | Onde | Tipo | O que bloqueia |
| --- | --- | --- | --- | --- |
| 1 | Créditos: função de 8 pessoas da Computação (Alexandre, Cleber, Guilherme, Luan, Maria Clara, Mariana Beatriz, Mariana Melo, Vinicius), função de Maria Rita, orientação e a ordem dos nomes no "Como citar" | `assets/js/mapa-narrativo.js` e `quem-somos.html` | Decisão da equipe | Entrega e prêmio. Enquanto vazios, somem do rodapé e da abertura (PR #4), mas aparecem em vermelho no Quem somos |
| 2 | Data de publicação | `PROJETO.publicado_em` | Decisão da equipe | Prêmio. Enquanto vazia, "Publicado em" não aparece |
| 18 | Pesquisa própria: só 4 respostas. Escolher entre publicá-las como relato (recomendado), simulação com selo de "dado simulado" ou deixar fora | r6 | Decisão da equipe + planilha de respostas | Nada; hoje a pesquisa está fora do site |

**Lembrete para a semana da publicação (#23):** revisar o status da MP 1.394 no Congresso e no STF (ADIs 8.024 e 8.027, entre outras). Se a MP cair ou mudar, atualizar o aviso de jogo responsável, a r1, a r5 e a caixa "Onde pedir ajuda" da r6 (a autoexclusão pode voltar).

Para ver o que ainda está pendente no próprio site, rode `python3 ferramentas/conferir-dados.py`.

### Concluído

| # | Reportagem | O que era | Onde está | Fonte | Status |
| --- | --- | --- | --- | --- | --- |
| 3 | Geral | Logos oficiais da UFPE, do CAC e do CIn | Topo, menu, rodapé e Quem somos | — | ✔ Encerrado: a equipe decidiu manter links de texto (PR #1); endereços conferidos em 28/10 |
| 4 | Geral | Canais de ajuda | Aviso de jogo responsável e caixa "Onde pedir ajuda" da r6 | gov.br/saude; Fazenda; Jogadores Anônimos | ✔ Feito: teleatendimento pelo Meu SUS Digital (autoteste), lista de reuniões dos Jogadores Anônimos; autoexclusão fora do ar desde a MP |
| 5 | Geral | URL oficial do Dossiê IEPS e do Guia do Ministério da Saúde | Fontes da r1, r3, r6 e Metodologia | ieps.org.br; gov.br/saude | ✔ Feito: o link da BVS impresso no Guia dá 404; usado o do gov.br |
| 6 | 1 | Datas históricas e origem do termo "bet" | Texto da r1; `data/linha-do-tempo-geral.csv` | Planalto; ENAP; Agência Senado; UFJF | ✔ Feito: 1941, 1946 e 1969 no Planalto; Vila Rica 1784 era para a Casa da Câmara e Cadeia, não caridade; cassinos nas décadas de 1930 e 1940 |
| 7 | 1 | Texto dos rótulos temporais da trajetória (proposta S2) | `mapa-narrativo.js` | Equipe | ✔ Feito (11/11): a equipe aprovou os 7 rótulos como estão; todos conferem com as fontes apuradas. O `[A CONFIRMAR]` saiu da home |
| 8 | 2 | Série A 2026 com link encurtado; divergências | `data/r2-serie-a-2026.csv` | Meio & Mensagem, Máquina do Esporte, Poder360 e outros | ✔ Feito: um link por clube. Correção: 14 de 20 clubes com bet máster na data da MP (Grêmio fechou com a Pitaco em 23/09). Valores de São Paulo e Cruzeiro retirados por falta de fonte |
| 9 | 2 | Vínculo dos clubes pernambucanos com bets | `data/r2-pernambuco.csv` | Propmark, Máquina do Esporte, Focus GN | ✔ Feito: Sport, Náutico, Santa Cruz e Maguary confirmados; Central, Retrô e Decisão retirados por falta de fonte |
| 10 | 2 | Flamengo no STF; garotos-propaganda; "paralisar o Brasileirão" | Texto da r2 | Poder360; Estadão; Focus GN | ✔ Feito. Correção: o Flamengo não entrou com ação; pediu para participar das ações como parte interessada (aceito por Fux em 30/09) |
| 11 | 3 | Verba de bets na TV e investimento total | `data/r3-verba-tv-1t2026.csv` | Tunad; Ibope; IAB Brasil | ✔ Feito. Correção: os R$ por emissora não existem na fonte; o gráfico virou participação (Globo 59%, SBT 22%, demais 19%) |
| 12 | 3 | Vínculos de mídia; Senacon e Conar | `data/r3-matriz-midia.csv` | Meio & Mensagem; Agência Pública; Propmark | ✔ Feito: 5 vínculos confirmados; BBB, A Fazenda e cotas da Band retirados por falta de fonte; joint venture Globo–MGM é de ago/2024 |
| 13 | 4 | Casos de manipulação de resultados | `data/r4-casos-manipulacao.csv` | MP-GO; STJD; Câmara; Senado | ✔ Feito: 5 casos com desfecho (inclui a reabilitação dos banidos em 2025) |
| 14 | 4 | Naming rights (link encurtado); posição da CBF e das federações | Texto da r4 | Meio & Mensagem; O Povo; SBT News | ✔ Feito: CBF sem posição oficial; FPF; integridade (Sportradar); MP revogou a proibição de atletas apostarem |
| 15 | 5 | Destinação da arrecadação soma 85% | `data/r5-destinacao-arrecadacao.csv` | Planalto, Lei 13.756, art. 30 | ✔ Feito: 100% dos 12% (segurança pública, sociedade civil, Funapol, ABDI); Lei 15.480/2026 citada |
| 16 | 5 | Penas na MP ou em projeto de lei; URL do O Globo | `data/r5-penas-propostas.csv` | Agência Câmara; inteiro teor do PL | ✔ Feito: as penas estão no PL 5.477/2026, não na MP |
| 17 | 6 | "Aumento de 104%": período ou projeção? | Texto da r6; `data/r6-saude.csv` | Guia do Ministério da Saúde | ✔ Feito: jan/2018 a mai/2025 |
| 19 | 6 | Recortes da Quaest 2026 que não batem com o total de 9% | Fora do site | g1 (17/04/2026) | ✔ Encerrado: ficam fora do site; só entram se alguém conferir |
| 20 | Metodologia | Pedidos via LAI e e-mail para correções | `metodologia.html` | Fala.BR | ✔ Feito (11/11): correções por issue no repositório do GitHub, sem precisar de e-mail; a seção de LAI diz que a equipe não fez pedidos nesta edição e sugere dois para a próxima. **Se alguém da equipe fez pedido via LAI, troque o texto pelos dados do pedido** |
| 21 | Acessibilidade | Teste com leitor de tela real | Home e as 6 reportagens | NVDA ou VoiceOver | ✔ Conferência feita (11/11): a árvore de acessibilidade, que é o que o leitor de tela lê, está certa (títulos, regiões e nomes), e as áreas de rolagem e os botões "Baixar dados" ganharam nomes que dizem o conteúdo. Falta só ouvir a home e uma reportagem com NVDA ou VoiceOver |
| 22 | Prêmio | Período de publicação aceito e limite de inscrições | Regulamento 2026 (premio.jornalismodedados.org.br) | Escola de Dados; regulamento | ✔ Conferido (11/11): o dossiê **não entra na 8ª edição (2026)**, que só aceitou trabalhos publicados entre 09/06/2025 e 14/06/2026; os vencedores saem em 12/11/2026. Fica para a 9ª edição (2027), ainda sem regulamento. Veja a seção do prêmio |

## Como levar as correções para o GitHub

> **Desde 28/10/2026 a equipe usa branches e pull requests:** cada merge no `main` publica o site sozinho pelo GitHub Pages, em cerca de 1 minuto. Antes de publicar, rode `python3 ferramentas/conferir-dados.py`: ele confere as planilhas e lista o que ainda está `[A PREENCHER]`, `[A CONFIRMAR]` ou com rótulo da trajetória não confirmado. O passo a passo abaixo, de upload pelo navegador, fica só como alternativa.

Reenviar as pastas inteiras é o jeito mais seguro: o GitHub substitui os arquivos de mesmo nome e mantém os que não mudaram.

1. Baixe o `da-sorte-ao-declinio.zip` mais recente da conversa e descompacte.
2. No repositório `innovative-data-driven-narratives-2026-2`, clique em **Add file → Upload files**.
3. Na pasta descompactada, segure Ctrl (Windows) ou Cmd (Mac), clique em `assets`, `data`, `reportagens` e `metodologia.html`, e arraste os quatro juntos para a área pontilhada. Não use o botão “choose your files”, que não aceita pastas.
4. Confira se a lista mostra caminhos com barra, como `assets/css/site.css`.
5. Escreva *Correções da revisão final* e clique em **Commit changes**.
6. Espere 2 minutos e abra o site com Ctrl+Shift+R (Cmd+Shift+R no Mac).

Depois de preencher créditos ou corrigir dados, repita só com os arquivos que vocês editaram.

## Fontes consultadas nesta revisão

- [Após extensão do prazo, MP do fim das bets recebe quase 100 emendas](https://www.jornaldocomercio.com/economia/2026/10/1266906-apos-extensao-do-prazo-mp-do-fim-das-bets-recebe-quase-100-emendas.html), Jornal do Comércio (out/2026)
- [MP das bets: Congresso, STF e o futuro do mercado](https://sigma.world/pt-br/news/mp-das-bets-congresso-stf-futuro-mercado/), SiGMA (08/10/2026)
- Auditoria automática: axe-core 4.10.2 (regras WCAG 2.0, 2.1 e 2.2 níveis A e AA) rodada nas 9 páginas em 21/10/2026
