"""Gera assets/css/tokens.css a partir de assets/tokens.json (seção M do pacote de design).
Como usar, no terminal, dentro da pasta do site:  python3 ferramentas/gerar-tokens.py
Cada token vira uma variável CSS com o caminho do JSON: color.texto_suave -> --color-texto_suave."""
import json, pathlib
raiz = pathlib.Path(__file__).resolve().parent.parent
tokens = json.loads((raiz / 'assets' / 'tokens.json').read_text(encoding='utf-8'))
linhas = []
def percorrer(no, caminho):
    for k, v in no.items():
        if k == 'import':            # a URL das fontes vai no <link> de cada página, não vira variável
            continue
        c = caminho + [k]
        if isinstance(v, dict):
            percorrer(v, c)
        else:
            linhas.append(f'  --{"-".join(c)}: {v};')
percorrer(tokens, [])
css = ('/* ARQUIVO GERADO: não edite à mão.\n'
       '   Fonte: assets/tokens.json (seção M do pacote de design "Da Sorte ao Declínio" v1.0).\n'
       '   Para mudar um token, edite o JSON e rode: python3 ferramentas/gerar-tokens.py */\n'
       ':root {\n' + '\n'.join(linhas) + '\n}\n')
(raiz / 'assets' / 'css' / 'tokens.css').write_text(css, encoding='utf-8')
print(f'{len(linhas)} tokens gravados em assets/css/tokens.css')
