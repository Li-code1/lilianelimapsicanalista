# Liliane Lima | Psicanálise e Terapia Online

Site institucional estático da psicanalista clínica **Liliane Lima**, com atendimento de psicanálise e coaching com PNL 100% online. Construído apenas com **HTML, CSS e JavaScript puro** (sem framework e sem etapa de build), pronto para publicar na **Vercel**.

- Site: <https://lilianelimapsicanalista.com.br>
- Idioma: `pt-BR`
- Stack: HTML5 semântico · CSS3 (variáveis, grid, flexbox) · JavaScript ES5/ES6 sem dependências

---

## Estrutura do projeto

```
.
├── index.html                      # Página inicial
├── sobre.html
├── psicanalise-online.html
├── coaching-pnl.html
├── metodo-florescer.html
├── programa-posicionadas.html
├── areas-de-atuacao.html
├── brasileiros-no-exterior.html
├── terapia-terceira-idade.html
├── como-funciona.html
├── faq.html
├── mapa-feridas-emocionais.html    # Ferramenta interativa (identidade visual própria)
├── teste-temperamento.html         # Teste dos 4 temperamentos (antes hospedado no GitHub Pages)
├── loja/                           # Loja Mente em Cores (cartazes e marcadores, links Hotmart)
├── blog.html                       # Blog com 11 artigos (filtro por categoria, leitura expansível)
├── 404.html                        # Página de erro personalizada
├── css/
│   ├── base.css                    # Menu, rodapé, botão do WhatsApp, acessibilidade
│   ├── home.css                    # Estilos da página inicial
│   ├── pages.css                   # Estilos compartilhados das páginas internas
│   ├── florescer.css               # Método Florescer
│   ├── posicionadas.css            # Programa Posicionadas
│   ├── faq.css                     # Perguntas frequentes
│   ├── teste-temperamento.css      # Teste de Temperamento
│   ├── blog.css                    # Blog (artigos, filtro de categorias)
│   ├── mapa-feridas.css            # Mapa das Feridas Emocionais
│   └── utilities.css               # Classes utilitárias (carregado por último)
├── js/
│   ├── main.js                     # Menu mobile, voltar ao topo, ano do rodapé
│   ├── teste-temperamento.js       # Perguntas, cálculo, resultado e PDF do teste
│   ├── blog.js                     # Filtro de categorias do blog e abertura por #âncora
│   └── mapa-feridas.js             # Lógica do teste das feridas emocionais
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── vercel.json                     # URLs limpas, redirecionamento e cabeçalhos de segurança
└── README.md
```

---

## Como publicar na Vercel

### Opção 1 — Pelo painel (recomendada)

1. Envie esta pasta para um repositório no GitHub, GitLab ou Bitbucket.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. Em **Framework Preset**, escolha **Other**. Deixe **Build Command** e **Output Directory** vazios.
4. Clique em **Deploy**.

### Opção 2 — Pela linha de comando

```bash
npm i -g vercel
vercel          # deploy de prévia
vercel --prod   # deploy em produção
```

### Domínio próprio

Em **Project → Settings → Domains**, adicione `lilianelimapsicanalista.com.br` e `www.lilianelimapsicanalista.com.br` e siga as instruções de DNS. Defina um dos dois como principal; a Vercel redireciona o outro automaticamente.

> As URLs canônicas, o `sitemap.xml` e os dados estruturados usam `https://lilianelimapsicanalista.com.br` (sem `www`). Se preferir `www`, troque o domínio nesses arquivos.

---

## Como visualizar localmente

Os links internos usam caminhos a partir da raiz com a extensão (`/faq.html`, `/css/base.css`), então abra o site por um servidor local, e não clicando no arquivo. Como os links levam `.html`, eles funcionam em qualquer hospedagem; na Vercel, o `cleanUrls` redireciona automaticamente para `/faq`:

```bash
npx serve .          # ou
vercel dev           # reproduz as URLs limpas e os redirecionamentos
```

Em produção na Vercel, o endereço exibido é `/faq`.

---

## SEO aplicado

| Item | Detalhe |
|---|---|
| **Title da home** | `Terapia Online de Psicanálise e Coaching com PNL \| Liliane Lima` |
| **H1 da home** | `Terapia Online de Psicanálise e Coaching com PNL para Adultos` (único H1 da página) |
| **Titles e descriptions** | Únicos em cada página, com palavras-chave naturais |
| **Hierarquia de títulos** | H1 → H2 → H3 sem saltos (os antigos `h4` da home viraram `h3`) |
| **Canonical** | Uma URL canônica por página |
| **Open Graph e Twitter Card** | Título, descrição, URL e imagem para compartilhamento |
| **Dados estruturados (JSON-LD)** | `ProfessionalService`, `Person` e `WebSite` na home; `BreadcrumbList` nas páginas internas; `FAQPage` na página de perguntas frequentes |
| **`sitemap.xml` e `robots.txt`** | Incluídos e apontando para o domínio de produção |
| **URLs limpas** | `/faq` em vez de `/faq.html` (`cleanUrls` no `vercel.json`) |
| **Imagens** | `alt` descritivo, `loading="lazy"` e `decoding="async"`; a imagem principal usa `fetchpriority="high"` |
| **Fontes** | `preconnect` e `display=swap` em um único pedido (sem `@import` no CSS) |
| **Páginas sem indexação** | Apenas `404.html` usa `noindex` |

---

## Semântica e acessibilidade

- Estrutura com `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<address>`, `<footer>`, `<figure>` e `<blockquote>`.
- Seções ligadas aos seus títulos com `aria-labelledby`.
- Listas reais (`ul` e `ol`) onde há conjuntos de itens.
- Link "Pular para o conteúdo", foco visível e `aria-current="page"` no menu.
- Menu mobile com `aria-expanded`, fechamento por `Esc` e menu oculto fora da tela, sem receber foco.
- Ícones decorativos com `aria-hidden`; botões e links de ícone com `aria-label`.
- Respeito a `prefers-reduced-motion`.
- Telefone e e-mail da seção de contato clicáveis (`tel:` e `mailto:`).

## Responsividade

Layout fluido, testado em larguras de celular (390 px), tablet e desktop (1366 px), sem rolagem horizontal. O menu vira gaveta lateral até 1240 px. Grades de cartões reorganizam-se em 1, 2 ou 3 colunas conforme a largura.

---

## Ajustes feitos em relação ao material original

O visual, as cores, as fontes e os textos foram mantidos. As mudanças foram:

1. **Título da home** definido como `Liliane Lima | Psicanálise e Terapia Online`.
2. **H1 da home** passou a ser `Atendimento de Psicanálise e Terapia Online para Adultos`. A frase anterior ("Escuta, acolhimento e o reencontro com a sua essência") foi mantida logo abaixo, como subtítulo em H2.
3. **Menu**: o cabeçalho original tinha só a logo (o menu vinha da plataforma anterior). Foi criado um menu com as mesmas páginas do rodapé.
4. **Estilos inline** (`style="..."`) movidos para classes em `css/utilities.css`.
5. **Links internos** de `https://lilianelimapsicanalista.com.br/...` para caminhos relativos (`/faq`).
6. **Seção de contato da home**: o formulário/agenda da plataforma anterior não existia no HTML, então a coluna ficou única e centralizada.
7. **`blog.html`** agora traz os 11 artigos (estilos em `css/blog.css`, filtro em `js/blog.js`) e está no `sitemap.xml`.
8. **`/agendar`** redireciona para o WhatsApp (ver `vercel.json`) até existir uma agenda online.

---

© Liliane Lima — Psicanalista Clínica. Todos os direitos reservados.
