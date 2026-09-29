import React, { useState } from 'react';
import { 
  MENU_ITEMS, 
  MenuItem, 
  ESTABLISHMENT_INFO, 
  AVAILABLE_EXTRAS, 
  AVAILABLE_REMOVALS,
  ExtraOption,
  RemovalOption
} from '../data/menuData';
import { ASSETS } from '../assets/images';
import { LazyImage } from './LazyImage';

export interface ItemModification {
  removals: string[]; // list of removal IDs
  extras: string[]; // list of extra IDs
  note: string;
}

export interface CartItem {
  id: string; // unique identifier for this cart line
  item: MenuItem;
  quantity: number;
  modification: ItemModification;
  unitPrice: number;
}

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: 'all' | 'hotdogs' | 'pasteis' | 'combos' | 'bebidas';
}

export const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'hotdogs' | 'pasteis' | 'combos' | 'bebidas'>(initialCategory);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'retirada'>('delivery');
  const [viewingCart, setViewingCart] = useState(false);

  // Mandatory Payment Verification State
  const [hasConfirmedPix, setHasConfirmedPix] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  // Per-item active draft modifications before adding to cart
  const [itemDrafts, setItemDrafts] = useState<Record<string, ItemModification>>({});
  // Track which item cards have their interactive modification controls expanded
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  // Filter items based on active tab and search query
  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Get current draft modification for an item
  const getDraft = (itemId: string): ItemModification => {
    return itemDrafts[itemId] || { removals: [], extras: [], note: '' };
  };

  // Toggle ingredient removal checkbox
  const handleToggleRemoval = (itemId: string, removalId: string) => {
    setItemDrafts((prev) => {
      const current = prev[itemId] || { removals: [], extras: [], note: '' };
      const exists = current.removals.includes(removalId);
      const updatedRemovals = exists
        ? current.removals.filter((id) => id !== removalId)
        : [...current.removals, removalId];

      return {
        ...prev,
        [itemId]: {
          ...current,
          removals: updatedRemovals,
        },
      };
    });
  };

  // Toggle extra topping selector
  const handleToggleExtra = (itemId: string, extraId: string) => {
    setItemDrafts((prev) => {
      const current = prev[itemId] || { removals: [], extras: [], note: '' };
      const exists = current.extras.includes(extraId);
      const updatedExtras = exists
        ? current.extras.filter((id) => id !== extraId)
        : [...current.extras, extraId];

      return {
        ...prev,
        [itemId]: {
          ...current,
          extras: updatedExtras,
        },
      };
    });
  };

  // Update item note
  const handleNoteChange = (itemId: string, noteText: string) => {
    setItemDrafts((prev) => {
      const current = prev[itemId] || { removals: [], extras: [], note: '' };
      return {
        ...prev,
        [itemId]: {
          ...current,
          note: noteText,
        },
      };
    });
  };

  // Toggle modification controls panel on the item card
  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Calculate dynamic price of an item given its selected extras
  const calculateDynamicItemPrice = (item: MenuItem, draft: ItemModification) => {
    const extrasTotal = draft.extras.reduce((sum, extraId) => {
      const extra = AVAILABLE_EXTRAS.find((e) => e.id === extraId);
      return sum + (extra ? extra.price : 0);
    }, 0);
    return item.price + extrasTotal;
  };

  // Add customized item to cart
  const handleAddToCart = (item: MenuItem, withModifications = true) => {
    const draft = withModifications
      ? getDraft(item.id)
      : { removals: [], extras: [], note: '' };

    const unitPrice = calculateDynamicItemPrice(item, draft);

    const newCartItem: CartItem = {
      id: `${item.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      item,
      quantity: 1,
      modification: {
        removals: [...draft.removals],
        extras: [...draft.extras],
        note: draft.note,
      },
      unitPrice,
    };

    setCart((prev) => [...prev, newCartItem]);
    // Reset confirmation if cart changes so payment matches new total
    setHasConfirmedPix(false);

    // Reset draft for this item
    setItemDrafts((prev) => ({
      ...prev,
      [item.id]: { removals: [], extras: [], note: '' },
    }));
  };

  // Update quantity of an item in the cart
  const updateCartQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.id === cartId) {
            const nextQty = c.quantity + delta;
            return nextQty > 0 ? { ...c, quantity: nextQty } : null;
          }
          return c;
        })
        .filter(Boolean) as CartItem[]
    );
    setHasConfirmedPix(false);
  };

  // Remove a line item from the cart
  const removeCartItem = (cartId: string) => {
    setCart((prev) => prev.filter((c) => c.id !== cartId));
    setHasConfirmedPix(false);
  };

  // Copy Pix Key to Clipboard
  const handleCopyPix = () => {
    navigator.clipboard.writeText(ESTABLISHMENT_INFO.pixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2500);
  };

  // Totals calculations
  const totalItemsCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const cartSubtotal = cart.reduce((sum, c) => sum + c.unitPrice * c.quantity, 0);

  // Send WhatsApp order - strictly requires payment confirmation
  const handleSendOrderWhatsApp = () => {
    if (totalItemsCount === 0) return;
    if (!hasConfirmedPix) return;

    let message = `*NOVO PEDIDO PAGO - SIX SEVEN DOG* 🌭🥟\n\n`;
    message += `*STATUS DO PAGAMENTO:* 🟢 PIX REALIZADO E CONFIRMADO\n`;
    message += `*VALOR TOTAL PAGO:* R$ ${cartSubtotal.toFixed(2).replace('.', ',')}\n`;
    message += `*CHAVE PIX UTILIZADA:* ${ESTABLISHMENT_INFO.pixKey} (${ESTABLISHMENT_INFO.pixBeneficiary})\n\n`;

    message += `*DADOS DO CLIENTE:*\n`;
    if (customerName.trim()) {
      message += `▪ *Nome:* ${customerName.trim()}\n`;
    }
    message += `▪ *Tipo:* ${deliveryMode === 'delivery' ? '🛵 Entrega Delivery' : '🏪 Retirada no Balcão'}\n`;
    if (deliveryMode === 'delivery' && customerAddress.trim()) {
      message += `▪ *Endereço:* ${customerAddress.trim()}\n`;
    }

    message += `\n*ITENS SELECIONADOS NO CARDÁPIO:*\n`;

    cart.forEach((cartItem, idx) => {
      const lineTotal = (cartItem.unitPrice * cartItem.quantity).toFixed(2).replace('.', ',');

      message += `\n${idx + 1}. *${cartItem.quantity}x ${cartItem.item.name}* — R$ ${lineTotal}\n`;
      if (cartItem.quantity > 1) {
        message += `   (R$ ${cartItem.unitPrice.toFixed(2).replace('.', ',')} cada)\n`;
      }

      // Add extra toppings if selected
      if (cartItem.modification.extras.length > 0) {
        const extrasDetails = cartItem.modification.extras
          .map((eId) => {
            const extra = AVAILABLE_EXTRAS.find((e) => e.id === eId);
            return extra ? `${extra.name} (+R$ ${extra.price.toFixed(2).replace('.', ',')})` : null;
          })
          .filter(Boolean);

        message += `   ➕ *Adicionais / Extras:* ${extrasDetails.join(', ')}\n`;
      }

      // Add ingredient removals if selected
      if (cartItem.modification.removals.length > 0) {
        const removalsDetails = cartItem.modification.removals
          .map((rId) => {
            const rem = AVAILABLE_REMOVALS.find((r) => r.id === rId);
            return rem ? rem.name.replace('Sem ', '') : null;
          })
          .filter(Boolean);

        message += `   🚫 *SEM (Ingredientes retirados):* ${removalsDetails.join(', ')}\n`;
      }

      // Add customer special note if present
      if (cartItem.modification.note.trim()) {
        message += `   📝 *Observações:* ${cartItem.modification.note.trim()}\n`;
      }
    });

    message += `\n─────────────────────\n`;
    message += `*VALOR TOTAL DO PEDIDO: R$ ${cartSubtotal.toFixed(2).replace('.', ',')}*\n`;
    message += `─────────────────────\n\n`;
    message += `✅ *Estou enviando o comprovante do Pix em anexo logo abaixo para conferência!*\n`;
    message += `Por favor, confirmem o recebimento para iniciar o preparo na chapa. Obrigado!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${ESTABLISHMENT_INFO.phone}?text=${encoded}`, '_blank');
  };

  const getItemImage = (item: MenuItem) => {
    if (item.category === 'hotdogs') return ASSETS.hotdog;
    if (item.category === 'pasteis') return ASSETS.pastel;
    if (item.id === 'cb-2') return ASSETS.hotdog;
    return null;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg max-h-[94vh] glass-card rounded-3xl text-white border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-neutral-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <i className="fa-solid fa-utensils text-lg"></i>
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight">Cardápio &amp; Pedidos</h3>
              <p className="text-xs text-neutral-400">Monte seu lanche, pague via Pix e envie para a cozinha</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {totalItemsCount > 0 && (
              <button
                type="button"
                onClick={() => setViewingCart((v) => !v)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewingCart
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-amber-400 border border-amber-500/30'
                }`}
                title="Alternar entre Cardápio e Sacola"
              >
                <i className="fa-solid fa-bag-shopping"></i>
                <span>{viewingCart ? 'Cardápio' : `Sacola (${totalItemsCount})`}</span>
              </button>
            )}

            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Fechar cardápio"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
        </div>

        {/* VIEW 1: CART SUMMARY & MANDATORY PIX PAYMENT CHECKOUT */}
        {viewingCart ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-black text-amber-400">
                <i className="fa-solid fa-receipt"></i>
                <span>Itens Selecionados no seu Pedido</span>
              </div>
              <button
                type="button"
                onClick={() => setViewingCart(false)}
                className="text-xs text-neutral-300 hover:text-white underline underline-offset-2 cursor-pointer"
              >
                + Adicionar mais itens
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 space-y-2">
                <i className="fa-solid fa-basket-shopping text-3xl opacity-40"></i>
                <p className="text-sm">Sua sacola está vazia</p>
                <button 
                  type="button"
                  onClick={() => setViewingCart(false)}
                  className="text-xs text-amber-400 font-bold underline underline-offset-4 cursor-pointer"
                >
                  Ver cardápio e escolher
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Items List */}
                <div className="space-y-3">
                  {cart.map((cartItem, idx) => {
                    const lineTotal = cartItem.unitPrice * cartItem.quantity;
                    const hasCustomization = 
                      cartItem.modification.extras.length > 0 ||
                      cartItem.modification.removals.length > 0 ||
                      Boolean(cartItem.modification.note.trim());

                    return (
                      <div 
                        key={cartItem.id}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-amber-400">#{idx + 1}</span>
                              <h4 className="font-bold text-sm text-neutral-100 leading-snug">
                                {cartItem.item.name}
                              </h4>
                            </div>
                            <span className="text-xs font-black text-amber-400 mt-0.5 inline-block">
                              R$ {lineTotal.toFixed(2).replace('.', ',')}
                              {cartItem.quantity > 1 && (
                                <span className="text-[10px] text-neutral-400 font-normal ml-1">
                                  ({cartItem.quantity}x R$ {cartItem.unitPrice.toFixed(2).replace('.', ',')})
                                </span>
                              )}
                            </span>
                          </div>

                          {/* Quantity Counter */}
                          <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(cartItem.id, -1)}
                              className="w-6 h-6 rounded-lg bg-neutral-900/80 hover:bg-red-500/80 text-white flex items-center justify-center text-xs cursor-pointer"
                              aria-label="Diminuir quantidade"
                            >
                              <i className="fa-solid fa-minus text-[10px]"></i>
                            </button>
                            <span className="w-5 text-center font-bold text-xs text-white">
                              {cartItem.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(cartItem.id, 1)}
                              className="w-6 h-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center text-xs font-bold cursor-pointer"
                              aria-label="Aumentar quantidade"
                            >
                              <i className="fa-solid fa-plus text-[10px]"></i>
                            </button>
                          </div>
                        </div>

                        {/* Modification Breakdown in Cart */}
                        {hasCustomization && (
                          <div className="p-2.5 rounded-xl bg-black/45 border border-white/10 space-y-1.5 text-[11px]">
                            {/* Extras selected */}
                            {cartItem.modification.extras.length > 0 && (
                              <div className="flex items-start gap-1.5 text-emerald-400">
                                <i className="fa-solid fa-plus text-[10px] mt-0.5 shrink-0"></i>
                                <div>
                                  <span className="font-bold">Adicionais: </span>
                                  <span>
                                    {cartItem.modification.extras
                                      .map((eId) => {
                                        const ex = AVAILABLE_EXTRAS.find((e) => e.id === eId);
                                        return ex ? `${ex.name} (+R$ ${ex.price.toFixed(2).replace('.', ',')})` : null;
                                      })
                                      .filter(Boolean)
                                      .join(', ')}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Removals selected */}
                            {cartItem.modification.removals.length > 0 && (
                              <div className="flex items-start gap-1.5 text-red-400">
                                <i className="fa-solid fa-ban text-[10px] mt-0.5 shrink-0"></i>
                                <div>
                                  <span className="font-bold">Sem ingredientes: </span>
                                  <span>
                                    {cartItem.modification.removals
                                      .map((rId) => {
                                        const rem = AVAILABLE_REMOVALS.find((r) => r.id === rId);
                                        return rem ? rem.name : null;
                                      })
                                      .filter(Boolean)
                                      .join(', ')}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Custom note */}
                            {cartItem.modification.note.trim() && (
                              <div className="flex items-start gap-1.5 text-neutral-300 italic">
                                <i className="fa-regular fa-comment text-[10px] mt-0.5 shrink-0 text-amber-400"></i>
                                <span>&quot;{cartItem.modification.note.trim()}&quot;</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Remove item button */}
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => removeCartItem(cartItem.id)}
                            className="text-neutral-400 hover:text-red-400 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <i className="fa-solid fa-trash-can text-[10px]"></i>
                            <span>Excluir do pedido</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Customer Details Form */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide block">
                    1. Dados de Entrega / Retirada
                  </span>

                  <input 
                    type="text"
                    placeholder="Seu Nome Completo *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full py-2 px-3 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-amber-400"
                  />

                  {deliveryMode === 'delivery' && (
                    <input 
                      type="text"
                      placeholder="Endereço Completo com Número e Bairro *"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full py-2 px-3 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-amber-400"
                    />
                  )}
                </div>

                {/* MANDATORY PAYMENT STEP (PIX) */}
                <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-neutral-900 to-black border-2 border-emerald-500/50 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400">
                        <i className="fa-brands fa-pix text-lg"></i>
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-white leading-tight">
                          2. Pagamento via Pix (Obrigatório)
                        </h4>
                        <p className="text-[10px] text-neutral-400">O pedido só é enviado após a realização do Pix</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Chave Oficial
                    </span>
                  </div>

                  {/* Order Total Highlight */}
                  <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                    <span className="text-xs text-neutral-300 font-medium">Valor Exato do Pedido:</span>
                    <span className="text-lg font-black text-amber-400">
                      R$ {cartSubtotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  {/* Pix Key Display & Copy Action */}
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/15 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400 text-[11px]">Chave Pix (CNPJ):</span>
                      <span className="text-neutral-400 text-[11px]">Favorecido: {ESTABLISHMENT_INFO.pixBeneficiary}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-black/80 border border-emerald-500/30">
                      <code className="text-xs font-mono font-bold text-emerald-400 select-all">
                        {ESTABLISHMENT_INFO.pixKey}
                      </code>

                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          pixCopied
                            ? 'bg-emerald-500 text-black'
                            : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        <i className={pixCopied ? "fa-solid fa-check" : "fa-regular fa-copy"}></i>
                        <span>{pixCopied ? 'Chave Copiada!' : 'Copiar Chave'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Mandatory Payment Confirmation Checkbox */}
                  <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-black/50 border border-emerald-500/30 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={hasConfirmedPix}
                      onChange={(e) => setHasConfirmedPix(e.target.checked)}
                      className="mt-0.5 rounded border-neutral-600 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer w-4 h-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-white block">
                        Confirmo que já realizei o pagamento Pix de R$ {cartSubtotal.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-[11px] text-neutral-400 block mt-0.5">
                        Enviarei o comprovante gerado pelo banco na conversa do WhatsApp para conferência imediata da equipe.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* VIEW 2: FULL INTERACTIVE MENU BROWSING */
          <>
            {/* Search Input and Categories */}
            <div className="p-3 sm:p-4 border-b border-white/10 shrink-0 bg-neutral-950/40 space-y-3">
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs"></i>
                <input 
                  type="text"
                  placeholder="Buscar lanche, pastel, combo, bebida..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full py-2 pl-9 pr-8 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-amber-400 transition-colors"
                />
                {search && (
                  <button 
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    <i className="fa-solid fa-xmark text-xs"></i>
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                  }`}
                >
                  Todos ({MENU_ITEMS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('hotdogs')}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'hotdogs'
                      ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                  }`}
                >
                  🌭 Hot Dogs
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('pasteis')}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'pasteis'
                      ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                  }`}
                >
                  🥟 Pastéis Crocantes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('combos')}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'combos'
                      ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                  }`}
                >
                  🍟 Combos
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('bebidas')}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'bebidas'
                      ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                  }`}
                >
                  🥤 Bebidas
                </button>
              </div>
            </div>

            {/* Item List with Interactive Modification Controls */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-neutral-400 space-y-2">
                  <i className="fa-solid fa-bowl-food text-3xl opacity-40"></i>
                  <p className="text-sm">Nenhum item encontrado com &quot;{search}&quot;</p>
                  <button 
                    type="button"
                    onClick={() => { setSearch(''); setActiveTab('all'); }}
                    className="text-xs text-amber-400 underline underline-offset-4 cursor-pointer"
                  >
                    Ver todo o cardápio
                  </button>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const imgUrl = getItemImage(item);
                  const isFood = item.category !== 'bebidas';
                  const draft = getDraft(item.id);
                  const isExpanded = Boolean(expandedItems[item.id]);

                  // Dynamic price calculated live based on selected toppings
                  const dynamicPrice = calculateDynamicItemPrice(item, draft);
                  const hasCustomizations = draft.extras.length > 0 || draft.removals.length > 0 || draft.note.length > 0;

                  // Number of this item currently in the cart
                  const inCartCount = cart
                    .filter((c) => c.item.id === item.id)
                    .reduce((sum, c) => sum + c.quantity, 0);

                  return (
                    <article 
                      key={item.id}
                      className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isExpanded
                          ? 'bg-neutral-900/90 border-amber-500/50 shadow-lg shadow-black/60'
                          : 'bg-white/5 hover:bg-white/10 border-white/10'
                      }`}
                    >
                      {/* Top Row: Image, Name, Price and Expand Button */}
                      <div className="flex gap-3.5 items-start">
                        {/* Thumbnail / Icon */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-neutral-900 border border-white/10 relative">
                          {imgUrl ? (
                            <LazyImage 
                              src={imgUrl} 
                              alt={item.name} 
                              containerClassName="w-full h-full"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 bg-neutral-950/60 p-2 text-center">
                              <i className={`text-xl mb-1 ${
                                item.category === 'combos' ? 'fa-solid fa-box-open text-amber-400' : 'fa-solid fa-bottle-water text-cyan-400'
                              }`}></i>
                              <span className="text-[10px] text-neutral-400 leading-tight">Gelada</span>
                            </div>
                          )}
                          {item.popular && (
                            <span className="absolute top-1 left-1 z-10 bg-red-600 text-[9px] font-bold text-white px-1.5 py-0.5 rounded shadow">
                              Top
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-bold text-sm text-neutral-100 leading-tight">
                              {item.name}
                            </h4>
                          </div>

                          {item.tag && (
                            <span className="inline-block text-[10px] text-amber-400 font-semibold mt-0.5">
                              {item.tag}
                            </span>
                          )}

                          <p className="text-[11px] text-neutral-300 leading-relaxed mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Action Bar: Full width, clean alignment, guaranteed no overflow */}
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
                        <div className="shrink-0">
                          <span className="text-[10px] text-neutral-400 block leading-tight mb-0.5">Preço Base</span>
                          <span className="text-sm sm:text-base font-black text-amber-400 leading-none">
                            R$ {item.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Interactive modification toggle (food items) */}
                          {isFood ? (
                            <button
                              type="button"
                              onClick={() => toggleExpanded(item.id)}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                isExpanded
                                  ? 'bg-amber-500 text-black shadow-md'
                                  : hasCustomizations
                                  ? 'bg-amber-500/25 text-amber-300 border border-amber-400'
                                  : 'bg-white/10 hover:bg-white/20 text-neutral-200 border border-white/15'
                              }`}
                              title="Personalizar adicionais e ingredientes"
                            >
                              <i className="fa-solid fa-sliders text-[11px]"></i>
                              <span>{isExpanded ? 'Fechar' : 'Personalizar'}</span>
                              {hasCustomizations && !isExpanded && (
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                              )}
                            </button>
                          ) : null}

                          {/* Quick Add with Standard Recipe */}
                          <button
                            type="button"
                            onClick={() => handleAddToCart(item, false)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-950/40 active:scale-95 transition-all cursor-pointer"
                            title="Adicionar receita padrão sem extras"
                          >
                            <i className="fa-solid fa-plus text-[10px]"></i>
                            <span>{inCartCount > 0 ? `+ (${inCartCount})` : 'Adicionar'}</span>
                          </button>
                        </div>
                      </div>

                      {/* INTERACTIVE MODIFICATION CONTROLS PANEL */}
                      {isFood && isExpanded && (
                        <div className="mt-3.5 pt-3 border-t border-amber-500/30 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
                          
                          {/* 1. SELECTORS FOR EXTRA TOPPINGS */}
                          <div className="bg-black/35 rounded-xl p-3 border border-white/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                                <i className="fa-solid fa-circle-plus text-emerald-400 text-xs"></i>
                                <span>Adicionar Coberturas / Extras</span>
                              </span>
                              <span className="text-[10px] text-neutral-400">Calculado no total</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {AVAILABLE_EXTRAS.map((extra) => {
                                const isChecked = draft.extras.includes(extra.id);
                                return (
                                  <label
                                    key={extra.id}
                                    className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                                      isChecked
                                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm'
                                        : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleToggleExtra(item.id, extra.id)}
                                        className="rounded border-neutral-600 text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer w-3.5 h-3.5"
                                      />
                                      <span className="font-semibold text-[11px] leading-tight">{extra.name}</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-amber-400 shrink-0 ml-1">
                                      + R$ {extra.price.toFixed(2).replace('.', ',')}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {/* 2. CHECKBOXES FOR REMOVING INGREDIENTS */}
                          <div className="bg-black/35 rounded-xl p-3 border border-white/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-red-400 flex items-center gap-1.5 uppercase tracking-wide">
                                <i className="fa-solid fa-ban text-red-400 text-xs"></i>
                                <span>Remover Ingredientes</span>
                              </span>
                              <span className="text-[10px] text-emerald-400 font-semibold">Sem custo adicional</span>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5">
                              {AVAILABLE_REMOVALS.map((rem) => {
                                const isChecked = draft.removals.includes(rem.id);
                                return (
                                  <label
                                    key={rem.id}
                                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                                      isChecked
                                        ? 'bg-red-500/20 border-red-400 text-white font-semibold'
                                        : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => handleToggleRemoval(item.id, rem.id)}
                                      className="rounded border-neutral-600 text-red-500 focus:ring-0 focus:ring-offset-0 cursor-pointer w-3.5 h-3.5"
                                    />
                                    <span className="text-[11px] leading-tight line-clamp-1">{rem.name}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {/* 3. OPTIONAL CUSTOM NOTE */}
                          <div>
                            <input
                              type="text"
                              placeholder="Observação (ex: bem prensado, sem orégano...)"
                              value={draft.note}
                              onChange={(e) => handleNoteChange(item.id, e.target.value)}
                              className="w-full py-1.5 px-3 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                            />
                          </div>

                          {/* 4. DYNAMIC PRICE & CONFIRM ADDITION BUTTON */}
                          <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-amber-500/40 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
                            <div>
                              <span className="text-[10px] text-neutral-400 block uppercase font-medium">Preço deste lanche</span>
                              <span className="text-base font-black text-amber-400">
                                R$ {dynamicPrice.toFixed(2).replace('.', ',')}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                handleAddToCart(item, true);
                                toggleExpanded(item.id);
                              }}
                              className="w-full sm:w-auto py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/50 active:scale-95 transition-all cursor-pointer"
                            >
                              <i className="fa-solid fa-check"></i>
                              <span>Adicionar Personalizado</span>
                            </button>
                          </div>

                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Bottom Cart Action Bar */}
        {totalItemsCount > 0 ? (
          <div className="p-4 border-t border-white/15 bg-neutral-950/95 shrink-0 space-y-3">
            {/* Delivery mode selection */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-medium">Como deseja receber:</span>
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDeliveryMode('delivery')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    deliveryMode === 'delivery' ? 'bg-amber-500 text-black font-bold' : 'text-neutral-300'
                  }`}
                >
                  🛵 Entrega Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMode('retirada')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    deliveryMode === 'retirada' ? 'bg-amber-500 text-black font-bold' : 'text-neutral-300'
                  }`}
                >
                  🏪 Retirada Balcão
                </button>
              </div>
            </div>

            {/* Quick Name Input (If not in Cart Review view) */}
            {!viewingCart && (
              <input 
                type="text"
                placeholder="Seu nome para o pedido (obrigatório)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full py-1.5 px-3 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-amber-400"
              />
            )}

            {/* Total and Checkout Button */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px] uppercase text-neutral-400 font-semibold">
                    Total ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'itens'})
                  </p>
                  <button
                    type="button"
                    onClick={() => setViewingCart((v) => !v)}
                    className="text-[10px] text-amber-400 underline cursor-pointer"
                  >
                    {viewingCart ? 'Ver cardápio' : 'Ver sacola & pagar'}
                  </button>
                </div>
                <p className="text-lg font-black text-amber-400">
                  R$ {cartSubtotal.toFixed(2).replace('.', ',')}
                </p>
              </div>

              {/* WhatsApp Button with Strict Payment Confirmation Requirement */}
              {hasConfirmedPix ? (
                <button
                  type="button"
                  onClick={handleSendOrderWhatsApp}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-transform active:scale-95 cursor-pointer animate-pulse"
                >
                  <i className="fa-brands fa-whatsapp text-lg"></i>
                  <span>Enviar Pedido Pago 🚀</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setViewingCart(true)}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-500/30 transition-all cursor-pointer"
                  title="Pague via Pix para liberar o envio do pedido"
                >
                  <i className="fa-solid fa-lock text-sm"></i>
                  <span>Pagar Pix p/ Liberar Pedido</span>
                </button>
              )}
            </div>

            {/* Warning when Pix is not yet confirmed */}
            {!hasConfirmedPix && (
              <p className="text-[10px] text-neutral-400 text-center flex items-center justify-center gap-1">
                <i className="fa-solid fa-circle-exclamation text-amber-400 text-[10px]"></i>
                <span>O pedido só pode ser enviado ao WhatsApp após realizar e confirmar o Pix.</span>
              </p>
            )}
          </div>
        ) : (
          <div className="p-3 border-t border-white/10 bg-neutral-950/60 shrink-0 text-center text-xs text-neutral-400">
            Adicione itens ao pedido e faça o pagamento via Pix para enviar diretamente para a chapa.
          </div>
        )}
      </div>
    </div>
  );
};
