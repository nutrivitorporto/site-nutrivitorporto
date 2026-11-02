# Site Vitor Porto — Nutricionista

Site institucional e aplicativos estáticos de Vitor Porto, publicados em
[nutrivitorporto.com](https://nutrivitorporto.com).

Não há build, framework nem `package.json`: são arquivos HTML/CSS/JS puros,
servidos diretamente pela Vercel. Basta editar e publicar.

## Estrutura

```
.
├── index.html                  # home / link-in-bio (CTAs de WhatsApp, resultados, ebooks)
├── ebooks/index.html           # vitrine dos 9 ebooks (checkout na Cakto)
├── treino/                     # PWA do aluno (treinos, avaliação física, evolução)
│   ├── index.html
│   ├── adm.html                # painel administrativo (login Firebase, noindex)
│   ├── sw.js
│   └── manifest*.webmanifest
├── lista-de-substituicoes/     # ferramenta de equivalência de alimentos
├── capas/                      # capas dos ebooks
├── img/                        # imagens da home
├── resultados/                 # fotos de resultados (WebP)
├── favicon.ico
├── favicon-192.png
├── apple-touch-icon.png
├── robots.txt
├── sitemap.xml
└── vercel.json                 # CORS das capas; sem rewrites
```

## Páginas publicadas

| Rota | Conteúdo |
|---|---|
| `/` | Home com CTAs de WhatsApp, carrossel de resultados e atalhos |
| `/ebooks/` | Vitrine dos ebooks com checkout Cakto |
| `/treino/` | App do aluno (PWA instalável). Acesso pelo link `#pro/CÓDIGO` |
| `/treino/adm.html` | Painel do nutricionista (Firebase Auth, `noindex`) |
| `/lista-de-substituicoes/` | Lista de substituição de alimentos |

`/treino/` e `/treino/adm.html` têm `noindex` de propósito: são áreas privadas.

## Rodar localmente

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

O service worker do app de treino só é registrado em `https` ou `localhost`.

## Deploy

Hospedagem: **Vercel**. O projeto é 100% estático e o *Root Directory* do
projeto deve ser **a raiz deste repositório**.

O `vercel.json` libera CORS apenas para `/capas/(.*)`, usado pelas páginas de
checkout. Não existem rewrites: a home é o `index.html` da raiz.

## Firebase

O app de treino usa o projeto Firebase **`treino-teamporto`**:

- Firestore (região `southamerica-east1`) com cache local persistente
  (`persistentLocalCache`) para funcionar offline na academia;
- Firebase Auth para o login do painel administrativo;
- SDK carregado via CDN (`firebasejs/10.14.1`), com CSP restrita no `<head>`.

A configuração pública do Firebase fica embutida no HTML do app (é normal em
apps web). **As regras do Firestore ainda não estão versionadas neste
repositório** — ver "Próximos passos".

## Como atualizar conteúdo

- **Fotos de resultados da home:** substitua os arquivos em `resultados/` e
  mantenha os nomes (`r01.webp` … `r19.webp`) ou ajuste o `index.html`.
- **Ebooks:** edite o objeto `CHECKOUT` em `ebooks/index.html` e a capa em
  `capas/`.
- **App de treino:** `treino/index.html` (aluno) e `treino/adm.html` (painel).
  São arquivos grandes com o JS embutido; edite com cuidado.

## Próximos passos

- [ ] Versionar `firebase.json` e `firestore.rules` (segurança/LGPD)
- [ ] Revisar o acesso do paciente por código de 6 caracteres
- [ ] Cache imutável para imagens na Vercel
- [ ] Incluir `/lista-de-substituicoes/` no sitemap e linkar na home
- [ ] Self-host das fontes (hoje vêm do Google Fonts)
