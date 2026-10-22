# Da Sorte ao Declínio · Dossiê das bets no futebol

Dossiê de jornalismo de dados em seis reportagens sobre o dinheiro das casas de apostas no futebol brasileiro, de 2018 (legalização da aposta de quota fixa) a setembro de 2026 (MP 1.394, em análise no Congresso).

Trabalho da disciplina **Narrativas Inovadoras com Dados na Comunicação Digital** · UFPE / Centro de Artes e Comunicação (CAC).

- Site publicado: **[A PREENCHER]**
- Equipe e créditos: veja `quem-somos.html` (e preencha em `assets/js/mapa-narrativo.js`)

---

## O que tem em cada pasta

```
index.html              Página inicial (a bola que perde o quique + o estádio)
reportagens/r1.html…    As seis reportagens
metodologia.html        Metodologia, fontes, pendências e lista de dados
quem-somos.html         Equipe, disciplina e orientação
data/*.csv              TODOS os dados dos gráficos (abra no Excel ou no Google Planilhas)
assets/js/mapa-narrativo.js   Textos que aparecem em várias páginas: títulos, créditos, aviso
assets/js/site.js       Cabeçalho, menu, rodapé, som, estádio e trajetória
assets/js/graficos.js   Os tipos de gráfico (barras, camisas, pontos, linha do tempo, matriz)
assets/js/reportagem.js Abertura com câmera, scrollytelling e navegação das reportagens
assets/css/tokens.css   Cores, fontes e espaços (gerado de assets/tokens.json, NÃO edite à mão)
assets/css/site.css     Estilos do site
assets/img/             Coloque aqui os logos oficiais da UFPE, do CAC e do CIn
ferramentas/gerar-tokens.py   Regenera tokens.css a partir de tokens.json
```

## Como editar sem quebrar nada

**Mudar os créditos, as datas ou o aviso de jogo responsável** (aparecem em todas as páginas):
1. Abra `assets/js/mapa-narrativo.js` num editor de texto (VS Code, Bloco de Notas, o editor do próprio GitHub).
2. Procure o bloco `const PROJETO = {`.
3. Troque o texto entre aspas, por exemplo `'[A PREENCHER: nomes]'` por `'Maria Silva, João Souza'`.
4. Não apague as aspas, as vírgulas nem os colchetes `[ ]` de fora.

**Mudar o título ou a linha fina de uma reportagem:**
1. Abra `assets/js/mapa-narrativo.js` e ache a reportagem (`id: "r2"`, por exemplo). Troque `titulo_provisorio` e `linha_fina`: isso muda a home, o menu e a navegação.
2. Abra `reportagens/r2.html` e troque o mesmo texto dentro de `<h1 class="titulo-rep">` e da linha logo abaixo.

**Mudar o texto de uma reportagem:** abra `reportagens/rN.html` e edite o que está entre `<p>` e `</p>`. Os comentários `<!-- ===== -->` mostram onde começa cada bloco (achados, gráfico, citação, em números).

**Corrigir um dado:**
1. Abra o CSV em `data/` (o nome do arquivo está no botão “Baixar dados” do gráfico).
2. Corrija o valor e a coluna `status` (de `CONFERIR` ou `SEM FONTE` para `OK` quando tiver fonte).
3. Salve como CSV, separado por vírgula, codificação UTF-8. O gráfico lê o arquivo novo sozinho.
4. Se o título do gráfico afirma algo que mudou, reescreva o título no HTML.

**Tirar o selo “dado a confirmar” de um gráfico:** no HTML da reportagem, apague a linha `<p class="selo-dado selo-confirmar">…</p>` daquele gráfico.

**Trocar a pesquisa fictícia pela real:** substitua `data/r6-pesquisa-propria-q11-FICTICIO.csv` por um arquivo com as mesmas colunas (`resposta,quantidade,observacao`), renomeie no HTML da reportagem 6 e apague o selo amarelo.

**Mudar uma cor ou fonte:** edite `assets/tokens.json` e rode `python3 ferramentas/gerar-tokens.py`. Não edite `tokens.css` direto.

## Testar no seu computador

Os gráficos leem os arquivos de `data/`, e o navegador bloqueia isso quando a página é aberta com duplo clique. Para testar:
1. Abra o terminal dentro da pasta do site.
2. Digite `python3 -m http.server 8000` e aperte Enter.
3. No navegador, abra `http://localhost:8000`.
4. Para parar, volte ao terminal e aperte Ctrl+C.

## Publicar no GitHub Pages

1. Entre em github.com e clique em **New repository**. Nome sugerido: `da-sorte-ao-declinio`. Marque **Public**. Clique em **Create repository**.
2. Na página do repositório vazio, clique em **uploading an existing file**.
3. Arraste para a janela **o conteúdo** da pasta do site (o `index.html` precisa ficar na raiz, não dentro de outra pasta).
4. Escreva uma mensagem, por exemplo “Primeira versão do site”, e clique em **Commit changes**.
5. Vá em **Settings → Pages**. Em **Source**, escolha **Deploy from a branch**; em **Branch**, escolha `main` e a pasta `/ (root)`. Clique em **Save**.
6. Espere de 1 a 3 minutos e recarregue a página de Settings → Pages: o endereço aparece no topo (algo como `https://SEU-USUARIO.github.io/da-sorte-ao-declinio/`).
7. Cole esse endereço em `PROJETO.repositorio` e no topo deste README.

**Alternativa: Vercel.** Em vercel.com, entre com a conta do GitHub, clique em **Add New → Project**, escolha o repositório e clique em **Deploy** (não precisa mudar nenhuma configuração).

## Licenças

- Código: MIT (arquivo `LICENSE`).
- Textos e dados da equipe: CC BY 4.0 (arquivo `LICENSE-CONTEUDO.md`).
- Relatos do *Guia de cuidado para pessoas com problemas relacionados a jogos de apostas* (Ministério da Saúde, 2026): CC BY-NC-SA 4.0, conforme a licença original.
- Ícones: Lucide (ISC). Fontes: Google Fonts (SIL Open Font License).
- As marcas BET X, BET Y e BET Z das ilustrações são fictícias.

## Antes de publicar

Veja a lista de pendências em `metodologia.html` (seção “Pendências de checagem”) e procure no site tudo o que aparece em vermelho entre colchetes: `[A PREENCHER]`, `[A CONFIRMAR]`, `[CONFERIR]`, `[SEM FONTE]`, `[A APURAR]`.

Para o Prêmio Cláudio Weber Abramo de Jornalismo de Dados: confirme no regulamento da edição o período de publicação aceito e o limite de inscrições por categoria.
