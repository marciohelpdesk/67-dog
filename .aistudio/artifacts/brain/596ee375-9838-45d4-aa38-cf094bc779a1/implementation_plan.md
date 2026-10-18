# Plano de Implementação: Modernização Visual com Glassmorphism Consistente

Modernização da interface visual do 67 Dog aplicando estética de **vidro translúcido suave (glassmorphism)**, com desfoque de fundo (*backdrop-blur*), bordas reflexivas sutis (*subtle specular borders*), e esferas de luz ambiente difusa (*ambient glows*) em tons quentes para valorizar a profundidade e a sensação de leveza tanto no **Modo Dia** quanto no **Modo Noite**.

---

### 🎨 1. Efeito de Vidro e Estilos Globais (`src/index.css`)

- **Classes de Glassmorphism Consistentes (`.glass-panel`, `.glass-panel-subtle`, `.glass-pill`)**:
  - **Fundo Translúcido Refinado**:
    - *Modo Dia*: Camada de branco quente acetinado com transparência balanceada (`rgba(255, 255, 255, 0.72)`) combinada com `backdrop-filter: blur(16px)`.
    - *Modo Noite*: Camada grafite/preto acetinado translúcido (`rgba(22, 20, 18, 0.68)`) com `backdrop-filter: blur(20px)`.
  - **Bordas de Especularidade (Borda de Luz)**:
    - Borda sutil de 1px com reflexo superior mais nítido e laterais suaves (`border: 1px solid rgba(255, 255, 255, 0.18)` no escuro e `rgba(0, 0, 0, 0.06)` no claro).
    - Sombreamento interno micro (*inset highlight*) para sensação tátil de borda de vidro lapidado.
  - **Sombras Difusas de Elevação**:
    - Sombras suaves com dispersão ampla (`box-shadow: 0 12px 36px -8px rgba(0, 0, 0, 0.08)` no claro e `rgba(0, 0, 0, 0.5)` no escuro) para os cartões parecerem flutuar suavemente acima do plano de fundo.

---

### 🌟 2. Esferas de Luz Ambiente Difusas em Tons Quentes (`src/App.tsx`)

- **Ambient Glows Flutuantes no Background**:
  - Inserção de esferas de gradiente radial difuso com desfoque profundo (`blur-3xl`, `opacity-40` a `opacity-20` no escuro e `opacity-30` no claro):
    - Esfera 1 (Topo/Hero): Âmbar dourado suave (`bg-amber-400/25`).
    - Esfera 2 (Meio/Categorias e Destaques): Chama/Laranja quente (`bg-orange-400/20`).
    - Esfera 3 (Rodapé/Cardápio): Dourado sutil (`bg-amber-300/15`).
  - Posicionamento em camada de fundo não-bloqueante (`pointer-events-none fixed inset-0 overflow-hidden`), garantindo que o efeito de vidro fosco refracte essas luzes naturalmente enquanto o usuário rola a página.

---

### 📦 3. Aplicação Consistente nos Componentes da Aplicação

1. **Cartão do Hero Banner**:
   - Manter a foto vívida e nítida com cantos arredondados contínuos e borda de vidro sutil.
2. **Cartões de Ação Rápida (WhatsApp, Contato, Endereço, Horários, Instagram)**:
   - Aplicar o novo container de vidro translúcido unificado, com micro-interações de *hover* e elevação suave.
3. **Quadro de Categorias do Cardápio**:
   - Container translúcido com brilho orgânico no topo e botões internos com efeito de pastilhas de vidro suave.
4. **Seção de Destaques Mais Pedidos & Teaser de Combos**:
   - Cartões individuais de destaque com fundo de vidro translúcido, deixando transparecer a textura e os tons quentes do fundo.
5. **Seção e Itens do Cardápio 67 Dog**:
   - Cada card de produto passa a usar o efeito de vidro uniforme, garantindo legibilidade do texto e destaque para os preços e fotos.
6. **Modais (Personalização, Info de Localização e Carrinho)**:
   - Superfícies de modal com desfoque aprofundado e bordas acetinadas, mantendo coesão visual impecável em toda a experiência.

---

### 🚀 Plano de Verificação

1. **Verificação de Compilação & Linter**:
   - Executar `compile_applet` e `lint_applet` para assegurar integridade sintática e de tipagem.
2. **Testes de Contraste e Legibilidade**:
   - Testar alternância entre Modo Dia e Modo Noite, garantindo que o vidro mantenha excelente legibilidade de texto (mínimo WCAG AA), preços nítidos e apetite visual elevado.
3. **Fluidez e Desempenho**:
   - Garantir que `backdrop-filter` e as esferas difusas mantenham 60 FPS estáveis sem travamentos de scroll.
