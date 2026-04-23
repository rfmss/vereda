# 📖 Diário de Bordo: Projeto Vereda
*Registro cronológico de evolução, decisões de design e engenharia.*

---

## [2026-04-23] 💎 Super-Pack de Refinamento & Identidade
**Objetivo:** Elevar a estética do editor para um nível premium e consolidar a marca brasileira.

### ✨ Novas Funcionalidades & UX
- **Módulo "Organize-se" (Ex-Planner)**: 
    - Transição do visual "post-it" para "Event Pills" (estilo Notion/Amie/Cron) para melhor legibilidade.
    - Implementação de Heatmap visual no seletor de meses.
    - Adição de Painel de Metas Mensais independentes.
    - Expansão do calendário até 2030 com cálculo dinâmico de feriados nacionais brasileiros (fixos e móveis como Carnaval/Pscoa).
- **Empty State Literário**: Substituição da tela vazia por um sistema inspirador de citações aleatórias (Machado de Assis, Clarice Lispector, etc.) com design minimalista.
- **Fim dos Alerts Nativos**: Integração do `CustomDialog` em todo o fluxo da Sidebar (importação/deleção), eliminando diálogos cinzas do navegador.
- **Branding**: Alteração do título da aba do navegador para `"enverede-se"` (forçado via JS e Manifesto PWA), reforçando o conceito de trilhar caminhos literários.
- **Módulo "Organize-se em..."**: Ajuste de nomenclatura para garantir fluidez gramatical no cabeçalho do calendário.

### 🛠️ Engenharia & Refatoração
- **Hook `useEditorModes`**: Extração da lógica de estados (Foco, Leitor, Terminal) para um hook customizado, limpando o `App.jsx`.
- **Gramática Avançada**: Expansão do `posTagger.js` com dicionário de termos literários e regionalismos (ex: "quiçá", "oxente").
- **Fix de Tooltips**: Correção do clipping na borda esquerda da Sidebar; agora os tooltips abrem para a direita com animação suave.

---

## [2026-04-22] 🎨 Branding & Deployment
**Objetivo:** Finalizar a identidade visual e preparar para uso real.

- **Sistema de Favicons**: Implementação de conjunto completo de ícones cross-platform (Apple, Windows, Android).
- **Manifesto README**: Atualização da documentação com o manifesto filosófico do editor Vereda.
- **Integração Web**: Ajustes para o mosaico de projetos em `rfmss.github.io`.

---

## [2026-04-21] 🏗️ Expansão de Gêneros & Guia de Escrita
**Objetivo:** Tornar o Vereda uma ferramenta técnica para diversos formatos.

- **Catálogo de Gêneros**: Adição de Autoficção, Newsletter, Poesia e Roteiros (Novela/Minissérie).
- **Masterclass via Markdown**: Implementação de guias de escrita dinâmicos (placeholders) que ensinam a técnica de cada gênero sem interferir no texto do autor.
- **Modo Terminal**: Criação de ambiente de escrita minimalista focado em fluxo de consciência.

---

## [2026-04-20] 👁️ Modo Leitor & Dicionário Offline
**Objetivo:** Focar na experiência de revisão e consulta.

- **Modo Leitor (Reader Mode)**: Estética "Newspaper" minimalista com controle de fonte e temas (Papel, Sépia, Noite).
- **Dicionário Vereda**: Integração com a API Dicionário Aberto para consultas rápidas via tooltip flutuante.
- **Edição de Capítulos**: Habilitada a edição de títulos diretamente na Sidebar para organização ágil.

---

## [Próximos Passos Sugeridos]
- [ ] **Modularização CSS**: Quebrar o `index.css` gigante em módulos por componente.
- [ ] **Sync Cloud (Opcional)**: Estudar integração via WebDAV ou File System API para persistência além do LocalStorage.
- [ ] **Exportação Avançada**: Formatação automática para PDF/EPUB seguindo padrões da ABNT ou editoras.
