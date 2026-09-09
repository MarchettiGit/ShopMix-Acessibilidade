# ShopMix - Melhorias de Acessibilidade (PRD)

## Problema original
Melhorar a acessibilidade da ShopMix (e-commerce/painel de vendedor) **sem reconstruir** o projeto,
preservando a arquitetura: **Java + Spring Boot + Thymeleaf + Bootstrap 5.3 + JavaScript + MySQL**.
Foco em WCAG: HTML semântico, leitores de tela, teclado, foco visível, contraste, formulários,
mensagens de erro, imagens, navegação, responsividade e simplicidade.

## Arquitetura (preservada)
- Back-end: Spring Boot (Controllers/Services/Repositories inalterados). Java 25, MySQL.
- Front-end: Thymeleaf + Bootstrap 5.3 (CDN) + CSS/JS próprios.
- Nenhuma mudança em models, banco, rotas ou APIs.

## Ambiente
- Este ambiente (Node/Python) não possui Java 25 + Maven + MySQL. Usuário executa localmente.
- Validação feita de forma estática (estrutura HTML balanceada + revisão de código). Teste em runtime pendente no ambiente local do usuário.

## Implementado (data: 2026-06)
Arquivos novos:
- `static/css/accessibility.css` — foco visível global, skip link, contraste do texto secundário, painel A11y e modo alto contraste, prefers-reduced-motion.
- `static/js/accessibility.js` — painel de acessibilidade (aumentar/diminuir texto via font-size do root em rem, alto contraste, restaurar), persistência em localStorage, anúncios via aria-live, fechar com Esc.
- `templates/fragments/acessibilidade.html` — fragmentos Thymeleaf reutilizáveis (recursos CSS, skip-link, painel, scripts). DRY em todas as páginas.

Arquivos modificados:
- `templates/index.html` (login) — lang pt-BR, title único, skip link, header/main/footer semânticos, labels `for`/`id`, autocomplete, erro com role=alert/aria-live, painel A11y.
- `templates/cadastro.html` — labels associados, requisitos de senha via aria-describedby, validação de confirmação inline acessível (sem alert), erro do back-end explicativo, painel A11y. Regex/mensagem alinhados a 8+ caracteres (coerente com o back-end).
- `templates/anunciar.html` — landmarks (main/aside/section), labels `for`/`id`, campos obrigatórios sinalizados (*), invalid-feedback, fieldset/legend nos checkboxes, alt dinâmico no preview, botão sem emojis, botão Cancelar, correção do `>` duplicado no <form>, placeholder de imagem via placehold.co, painel A11y.
- `templates/home.html` (dashboard) — lang pt-BR, title, skip link, nav landmark com aria-label, busca de pedidos acessível (label + botão + filtro JS + feedback aria-live), tabela com caption + scope, alt dinâmico em imagens de produtos/anúncios/pedidos, canvases com role=img + aria-label, hierarquia de headings, botões de ação com aria-label dinâmico (th:attr), badge warning com texto escuro, "Sair" no lugar de "Sign Out", painel A11y. Removido script quebrado color-modes.js.

## Melhorias de acessibilidade por tema
- Semântica: header/nav/main/section/article/aside/footer/fieldset; headings hierárquicos.
- Leitores de tela: labels, aria-live (erros/sucesso/busca), role=alert/status/img, captions, scope.
- Teclado: foco visível forte (:focus-visible), skip link, ordem lógica, Esc fecha painel.
- Contraste: alto contraste opcional + ajuste do texto secundário; badge de aviso legível.
- Texto ajustável: painel escala o font-size do root (layout em rem responde bem).
- Imagens: alt descritivo dinâmico a partir do nome do produto/anúncio.
- Formulários: mensagens explicativas próximas ao campo; feedback nativo do Bootstrap.
- Responsividade: mantida via Bootstrap; painel A11y responsivo.

## Alternador de tema (2026-06)
- Botão claro/escuro acessível no topo de todas as páginas (navbar na home; barra superior nas demais), via fragmento reutilizável (`tema` / `barra-tema`).
- Integrado ao Bootstrap 5.3 (`data-bs-theme`) e ao `accessibility.js`: escolha salva em localStorage, 1ª visita respeita `prefers-color-scheme`, anúncio via aria-live, `aria-pressed`/`aria-label` dinâmicos, sem flash no carregamento.
- CSS: `.theme-toggle` adapta cor ao contexto e fundo escuro aplicado às telas de login/cadastro.

## Leitura por voz (2026-06)
- Seção "Leitura por voz" no painel de acessibilidade usando a Web Speech API nativa (`speechSynthesis`), sem back-end nem chaves externas; voz pt-BR quando disponível.
- Recursos: "Ler a página" (lê o `<main>`/conteúdo principal), "Parar" e alternador "Ler itens ao focar" (lê o nome acessível de links/botões/campos/cards ao receber foco por teclado ou ao passar o mouse).
- Preferência `readOnFocus` salva em localStorage; Esc interrompe a fala; seção se oculta se o navegador não suportar.

## Backlog / próximos passos
- P1: Rodar localmente (Maven + MySQL) e validar com leitor de tela (NVDA/VoiceOver) + auditoria Lighthouse/axe.
- P2: Páginas de carrinho e checkout acessíveis (não existem hoje — fora do escopo atual por escolha do usuário).
- P2: Tornar a busca de pedidos server-side (hoje é filtro client-side na tabela renderizada).
- P2: Corrigir caminho de upload no HomeController (usa `/demo/src/...`) se necessário no ambiente do usuário.
