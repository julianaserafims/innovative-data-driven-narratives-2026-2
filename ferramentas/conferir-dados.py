#!/usr/bin/env python3
"""Confere os CSV e os placeholders antes de publicar.

Uso, na pasta do site:
  python ferramentas/conferir-dados.py
  python3 ferramentas/conferir-dados.py

Sai com código 1 se alguma planilha quebrou, se ainda há
[A PREENCHER], [A CONFIRMAR] ou [NOMES DA EQUIPE] no conteúdo
(páginas HTML e assets/js/mapa-narrativo.js) ou se algum rótulo da
trajetória ainda está com rotulo_confirmado: false.
O README e o restante do JavaScript ficam de fora: eles têm esses
marcadores como modelo de texto, não como pendência.
"""
import csv
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
DATA = RAIZ / 'data'

# Cabeçalho que os gráficos e as tabelas leem. Renomear uma coluna quebra o desenho.
CABECALHOS = {
    'linha-do-tempo-geral.csv': ['ano', 'data', 'evento', 'tipo', 'fonte', 'status'],
    'questionario-pesquisa-propria.csv': ['id_pergunta', 'bloco', 'pergunta', 'tipo', 'opcoes'],
    'r1-marcos-legais.csv': ['id', 'data_inicio', 'data_fim', 'precisao', 'data_texto', 'evento', 'tipo', 'fonte', 'url', 'status', 'destaque', 'rotulo_curto', 'rotulo_lado'],
    'r2-pernambuco.csv': ['clube', 'divisao', 'tipo_patrocinio', 'bet', 'situacao', 'fonte', 'status'],
    'r2-serie-a-2026.csv': ['clube', 'patrocinador_master', 'e_bet', 'situacao', 'valor_fixo_anual_mi', 'valor_max_anual_mi', 'vigencia', 'observacao', 'fonte', 'status'],
    'r3-exposicao-criancas.csv': ['faixa_etaria', 'viu_publicidade_de_apostas_pct', 'ano', 'fonte', 'status'],
    'r3-matriz-midia.csv': ['veiculo', 'tipo_vinculo', 'descricao', 'fonte', 'status'],
    'r3-verba-tv-1t2026.csv': ['emissora', 'participacao_verba_tv_pct', 'observacao', 'fonte', 'status'],
    'r4-casos-manipulacao.csv': ['caso', 'competicao', 'periodo', 'orgao', 'desfecho', 'fonte', 'status'],
    'r4-naming-rights.csv': ['propriedade', 'tipo', 'nome_comercial', 'bet', 'local', 'regiao', 'inicio', 'fim', 'situacao', 'fonte', 'status'],
    'r5-arrecadacao.csv': ['indicador', 'valor_rs_mi', 'periodo', 'fonte', 'status'],
    'r5-destinacao-arrecadacao.csv': ['destino', 'percentual', 'fonte', 'status'],
    'r5-penas-propostas.csv': ['conduta', 'pena_min_anos', 'pena_max_anos', 'agravante', 'fonte', 'status'],
    'r5-projetos-de-lei.csv': ['casa', 'projetos_de_lei', 'periodo', 'fonte', 'status'],
    'r5-regulacao.csv': ['id', 'data_inicio', 'data_fim', 'precisao', 'data_texto', 'evento', 'tipo', 'fonte', 'url', 'status', 'destaque', 'rotulo_curto', 'rotulo_lado'],
    'r6-custo-x-arrecadacao.csv': ['indicador', 'valor_rs_bi', 'periodo', 'fonte', 'status'],
    'r6-economia-das-familias.csv': ['indicador', 'valor', 'unidade', 'periodo', 'fonte', 'status'],
    'r6-perfil-apostador.csv': ['pesquisa', 'instituto', 'periodo_campo', 'amostra', 'margem_erro_pp', 'recorte', 'categoria', 'valor_pct', 'fonte', 'status'],
    'r6-saude.csv': ['indicador', 'valor', 'unidade', 'periodo', 'fonte', 'status'],
}

# Colunas que representam uma partição e precisam fechar em 100.
SOMAS = {
    'r5-destinacao-arrecadacao.csv': 'percentual',
    'r3-verba-tv-1t2026.csv': 'participacao_verba_tv_pct',
}

MARCADORES = ('[A PREENCHER', '[A CONFIRMAR', '[NOMES DA EQUIPE]')


def ler(caminho):
    # utf-8-sig tira o BOM que o Excel grava em "CSV UTF-8"; o site também lê esses arquivos
    texto = caminho.read_bytes().decode('utf-8-sig')
    primeira = texto.splitlines()[0] if texto.splitlines() else ''
    if primeira.count(';') > primeira.count(','):
        raise ValueError('separador é ponto e vírgula; o site só lê vírgula')
    linhas = list(csv.reader(texto.splitlines()))
    if not linhas or not any(c.strip() for c in linhas[0]):
        raise ValueError('CSV vazio')
    cab = linhas[0]
    if any(not c.strip() for c in cab):
        raise ValueError('cabeçalho com coluna sem nome')
    dados = [l for l in linhas[1:] if any(c.strip() for c in l)]
    if not dados:
        raise ValueError('só o cabeçalho, sem linhas de dado')
    return cab, dados


def conferir_csv():
    erros = []
    vistos = set()
    for caminho in sorted(DATA.glob('*.csv')):
        vistos.add(caminho.name)
        try:
            cab, dados = ler(caminho)
        except (UnicodeDecodeError, ValueError) as e:
            erros.append(caminho.name + ': ' + str(e))
            continue
        esperado = CABECALHOS.get(caminho.name)
        if esperado is None:
            erros.append(caminho.name + ': arquivo novo sem colunas registradas em conferir-dados.py')
            continue
        if cab != esperado:
            erros.append(caminho.name + ': cabeçalho ' + ','.join(cab) + ' — o gráfico espera ' + ','.join(esperado))
        for i, linha in enumerate(dados, start=2):
            if len(linha) != len(cab):
                erros.append('%s: linha %d tem %d campos e o cabeçalho tem %d' % (caminho.name, i, len(linha), len(cab)))
        coluna = SOMAS.get(caminho.name)
        if coluna and coluna in cab:
            idx = cab.index(coluna)
            try:
                total = sum(float(l[idx].replace(',', '.')) for l in dados)
            except ValueError:
                erros.append(caminho.name + ': a coluna ' + coluna + ' tem valor que não é número')
            else:
                if abs(total - 100) > 0.05:
                    erros.append('%s: a coluna %s soma %.2f, não 100' % (caminho.name, coluna, total))
    for nome in sorted(set(CABECALHOS) - vistos):
        erros.append(nome + ': arquivo esperado em data/ e não encontrado')
    return erros


def sem_comentarios(js):
    """Tira os comentários /* ... */ do mapa-narrativo.js: eles explicam os marcadores e não são pendência."""
    return re.sub(r'/\*.*?\*/', '', js, flags=re.S)


def conferir_marcadores():
    erros = []
    # Só onde mora o conteúdo. Os outros .js usam os marcadores como modelo de texto
    # (ex.: o [A CONFIRMAR] que a home mostra enquanto um rótulo não é confirmado).
    mapa = RAIZ / 'assets' / 'js' / 'mapa-narrativo.js'
    arquivos = list(RAIZ.glob('*.html')) + list((RAIZ / 'reportagens').glob('*.html')) + [mapa]
    for caminho in arquivos:
        texto = caminho.read_text(encoding='utf-8')
        if caminho == mapa:
            texto = sem_comentarios(texto)
        for marca in MARCADORES:
            if marca in texto:
                erros.append(caminho.relative_to(RAIZ).as_posix() + ': ainda contém ' + marca)
    # Rótulos da trajetória: a home mostra [A CONFIRMAR] enquanto estiverem false
    provisorios = len(re.findall(r'\b(?:rotulo_)?confirmado:\s*false', sem_comentarios(mapa.read_text(encoding='utf-8'))))
    if provisorios:
        erros.append('assets/js/mapa-narrativo.js: %d rótulo(s) da trajetória ainda com confirmado: false' % provisorios)
    return erros


def main():
    erros = conferir_csv() + conferir_marcadores()
    if not erros:
        print('Conferência ok: CSV, somas de 100, conteúdo sem placeholder e rótulos da trajetória confirmados.')
        return 0
    print('A publicação ainda tem %d pendência(s):' % len(erros))
    for e in erros:
        print('- ' + e)
    return 1


if __name__ == '__main__':
    sys.exit(main())
