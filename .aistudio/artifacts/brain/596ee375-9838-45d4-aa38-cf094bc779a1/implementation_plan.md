# Plano de Implementação — Novo Cardápio do 67 Dog

Reestruturação completa dos itens, preços, combos e categorias do cardápio do 67 Dog, garantindo navegação intuitiva, clareza nos ingredientes dos lanches e melhor experiência de pedido para o cliente.

---

## 1. Atualização dos Dados do Cardápio (`src/data/menuData.ts`)

### 🌭 Hot Dogs (Ingredientes mantidos intactos, preços e ordenação atualizados)
1. **Democrático** — **R$ 8,00**
2. **Raiz** — **R$ 10,00**
3. **Duplo Raiz** — **R$ 12,00**
4. **Frangolino** — **R$ 15,00**
5. **Calabresaço** — **R$ 15,00**
6. **Baconzeira** — **R$ 17,00**
7. **Six Seven** — **R$ 19,00** (Destaque Mais Pedido)
8. **Costelaço** — **R$ 20,00**

### 🥟 Pastéis
* **Pastel de Carne** — **R$ 10,00**
* **Pastel de Frango** — **R$ 10,00**
* **Pastel de Pizza** — **R$ 10,00**
* **Pastel de Queijo** — **R$ 10,00** *(mantido conforme sua escolha)*
* **Pastel de Costela** — **R$ 18,00** *(novo item especial recheado com costela desfiada)*

### 🔥 Combos 67 (Categoria única com divisão clara entre Hot Dogs e Pastéis)
* **Combos de Hot Dogs:**
  1. **Combo Na Medida** — **R$ 27,00** (1 Six Seven + 1 mini Coca-Cola 220 ml)
  2. **Combo Duplinha** — **R$ 49,00** (1 Costelaço + 1 Six Seven + 2 mini Coca-Cola 220 ml)
  3. **Combo Six Seven Galera** — **R$ 79,00** (1 Six Seven + 1 Costelaço + 2 Raiz + 4 mini Coca-Cola 220 ml)
* **Combos de Pastéis:**
  4. **Combo Individual** — **R$ 19,00** (1 pastel tradicional + 1 mini Coca-Cola 220 ml)
  5. **Combo Individual Costela** — **R$ 20,00** (1 pastel de costela + 1 mini Coca-Cola 220 ml)
  6. **Combo Duplo de Pastéis** — **R$ 34,00** (2 pastéis à sua escolha + 2 mini Coca-Cola 220 ml)
  7. **Combo Família de Pastéis** — **R$ 55,00** (4 pastéis à sua escolha + 4 mini Coca-Cola 220 ml)

### 🥤 Bebidas
* **Coca-Cola 350 ml (Lata)** — **R$ 6,00**
* **Fanta 350 ml (Lata)** — **R$ 5,50**
* **Guaraná Antarctica 350 ml (Lata)** — **R$ 5,50**
* **Suco Kapo 200 ml** — **R$ 4,00**
* **Água Mineral 500 ml** — **R$ 4,00** *(mantida conforme sua escolha)*
* Nota explicativa sobre a **Coca-Cola mini 220 ml** exclusiva dos combos.

---

## 2. Ajustes na Interface e Layout (`src/App.tsx`)

* **Mapeamento de Imagens (`getItemImage`)**: Adicionar o novo item `pastel-costela` e os novos combos para associar as fotos correspondentes (`ASSETS.pastelCrocante`, `ASSETS.combo`, etc.).
* **Destaques da Página Inicial (`highlights`)**:
  * Atualizar o card do **Six Seven** com o novo valor de **R$ 19,00**.
  * Atualizar o card do **Raiz** com o novo valor de **R$ 10,00**.
  * Atualizar o card do **Pastel de Carne** com o novo valor de **R$ 10,00**.
* **Layout dos Combos**:
  * Na seção de Combos, adicionar divisor ou badges visuais claros separando **Combos de Hot Dogs 🌭🥤** e **Combos de Pastéis 🥟🥤**.
  * No modal de personalização dos combos de pastéis múltiplos (Duplo e Família), ajustar o placeholder das observações para: `"Ex.: 1 de carne e 1 de queijo, bem sequinho"`, facilitando a escolha dos sabores pelo cliente.
* **Adicionais e Remoções**:
  * Garantir que as regras já existentes continuem válidas (adicionais e remoções aparecem para hot dogs e combos de hot dog, enquanto pastéis e combos de pastéis mostram apenas o campo de observações para os sabores/detalhes).

---

## 3. Sincronização de SEO e Schema.org (`seo-plugin.ts`)

* Sincronizar o plugin de pré-renderização para que os novos preços e novos combos sejam refletidos tanto no Schema.org JSON-LD (Rich Snippets de Restaurante no Google) quanto no HTML de acessibilidade estática.

---

## 4. Verificação e Testes

* Executar compilação com `compile_applet`.
* Executar lint com `lint_applet`.
* Testar o fluxo completo de montagem de pedido no carrinho e envio da mensagem para o WhatsApp.
