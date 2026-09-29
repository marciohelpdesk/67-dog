/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  MessageCircle,
  MapPin,
  Utensils,
  Clock3,
  Instagram,
  Truck,
  Plus,
  Minus,
  Check,
  Copy,
  X,
  ShieldCheck,
  AlertCircle,
  ShoppingBag,
  Search,
  ArrowLeft,
} from 'lucide-react';
import { ASSETS } from './assets/images';
import {
  MENU_CATEGORIES,
  ESTABLISHMENT_INFO,
  AVAILABLE_EXTRAS,
  AVAILABLE_REMOVALS,
  MenuItem,
  ExtraOption,
  RemovalOption,
} from './data/menuData';

function formatCurrency(val: number) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function useAnimatedNumber(target: number, duration = 380) {
  const [current, setCurrent] = useState(target);
  const startRef = React.useRef(target);

  React.useEffect(() => {
    const fromVal = startRef.current;
    const toVal = target;

    if (fromVal === toVal) {
      setCurrent(toVal);
      return;
    }

    let startTimestamp: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // smooth cubic ease-out
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const val = fromVal + (toVal - fromVal) * easeProgress;
      setCurrent(val);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setCurrent(toVal);
        startRef.current = toVal;
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration]);

  return current;
}

function AnimatedPrice({ value, className = '' }: { value: number; className?: string }) {
  const animatedValue = useAnimatedNumber(value, 380);
  const [isPulsing, setIsPulsing] = useState(false);
  const prevValueRef = React.useRef(value);

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 380);
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <span
      className={`inline-block tabular-nums transition-all duration-200 ${
        isPulsing ? 'scale-105 text-primary drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]' : ''
      } ${className}`}
    >
      {formatCurrency(animatedValue)}
    </span>
  );
}

export interface CartItemState {
  cartItemId: string;
  item: MenuItem;
  qty: number;
  selectedExtras: ExtraOption[];
  selectedRemovals: RemovalOption[];
  notes?: string;
  unitPrice: number;
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [cart, setCart] = useState<Record<string, CartItemState>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [copiedPix, setCopiedPix] = useState(false);
  const [pixConfirmed, setPixConfirmed] = useState(false);
  const [pixPayerName, setPixPayerName] = useState('');

  // Item customization modal state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [modalExtras, setModalExtras] = useState<ExtraOption[]>([]);
  const [modalRemovals, setModalRemovals] = useState<RemovalOption[]>([]);
  const [modalItemNotes, setModalItemNotes] = useState('');

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const totalCount = cartItems.reduce((acc, curr) => acc + curr.qty, 0);
  const totalPrice = cartItems.reduce((acc, curr) => acc + curr.unitPrice * curr.qty, 0);

  const highlights = useMemo(() => {
    const dogDuplo = MENU_CATEGORIES[0]?.items.find((i) => i.id === 'dog-duplo');
    const pastelFrango = MENU_CATEGORIES[1]?.items.find((i) => i.id === 'pastel-frango');
    if (!dogDuplo || !pastelFrango) return [];
    return [
      { item: dogDuplo, badge: 'Top 1', img: ASSETS.heroHotdog },
      { item: pastelFrango, badge: 'Crocante', img: ASSETS.pastelDestaque },
    ];
  }, []);

  function handleCopyPix() {
    navigator.clipboard.writeText(ESTABLISHMENT_INFO.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  }

  function openMenu(categoryId: string = 'all') {
    setActiveCategory(categoryId);
    setSearchQuery('');
    setIsMenuOpen(true);
  }

  // Open customization modal
  function openCustomization(item: MenuItem) {
    setCustomizingItem(item);
    setModalQty(1);
    setModalExtras([]);
    setModalRemovals([]);
    setModalItemNotes('');
  }

  function toggleExtra(extra: ExtraOption) {
    setModalExtras((prev) => {
      const exists = prev.some((e) => e.id === extra.id);
      if (exists) {
        return prev.filter((e) => e.id !== extra.id);
      }
      return [...prev, extra];
    });
  }

  function toggleRemoval(rem: RemovalOption) {
    setModalRemovals((prev) => {
      const exists = prev.some((r) => r.id === rem.id);
      if (exists) {
        return prev.filter((r) => r.id !== rem.id);
      }
      return [...prev, rem];
    });
  }

  // Confirm customized item addition to cart
  function confirmAddCustomizedItem() {
    if (!customizingItem) return;

    const extrasPrice = modalExtras.reduce((sum, e) => sum + e.price, 0);
    const calculatedUnitPrice = customizingItem.price + extrasPrice;

    // Generate unique composite key
    const extrasKey = modalExtras.map((e) => e.id).sort().join('_');
    const removalsKey = modalRemovals.map((r) => r.id).sort().join('_');
    const notesKey = modalItemNotes.trim().toLowerCase();
    const cartItemId = `${customizingItem.id}__ext:${extrasKey}__rem:${removalsKey}__nt:${notesKey}`;

    setCart((prev) => {
      const existing = prev[cartItemId];
      if (existing) {
        return {
          ...prev,
          [cartItemId]: {
            ...existing,
            qty: existing.qty + modalQty,
          },
        };
      }
      return {
        ...prev,
        [cartItemId]: {
          cartItemId,
          item: customizingItem,
          qty: modalQty,
          selectedExtras: [...modalExtras],
          selectedRemovals: [...modalRemovals],
          notes: modalItemNotes.trim(),
          unitPrice: calculatedUnitPrice,
        },
      };
    });

    setCustomizingItem(null);
  }

  function updateCartQty(cartItemId: string, delta: number) {
    setCart((prev) => {
      const existing = prev[cartItemId];
      if (!existing) return prev;
      const nextQty = existing.qty + delta;
      const nextCart = { ...prev };
      if (nextQty <= 0) {
        delete nextCart[cartItemId];
      } else {
        nextCart[cartItemId] = { ...existing, qty: nextQty };
      }
      return nextCart;
    });
  }

  function sendWhatsAppOrder() {
    if (cartItems.length === 0 || !customerName.trim() || !pixConfirmed) return;

    const formattedItems = cartItems.map((c) => {
      let text = `• *${c.qty}x ${c.item.name}* — ${formatCurrency(c.unitPrice * c.qty)}`;
      if (c.selectedExtras.length > 0) {
        text += `\n   ➕ *Adicionais:* ${c.selectedExtras.map((e) => `${e.name} (+${formatCurrency(e.price)})`).join(', ')}`;
      }
      if (c.selectedRemovals.length > 0) {
        text += `\n   🚫 *Retirar:* ${c.selectedRemovals.map((r) => r.name).join(', ')}`;
      }
      if (c.notes) {
        text += `\n   📝 *Obs item:* ${c.notes}`;
      }
      return text;
    });

    const lines = [
      `🌭 *NOVO PEDIDO — SIX SEVEN HOT DOG*`,
      ``,
      `📋 *ITENS DO PEDIDO:*`,
      ...formattedItems,
      ``,
      `💰 *VALOR TOTAL: ${formatCurrency(totalPrice)}*`,
      ``,
      `🏃 *TIPO DE ATENDIMENTO:* Retirada no balcão`,
      `📍 *LOCAL DE RETIRADA:* ${ESTABLISHMENT_INFO.address}`,
      `👤 *NOME DO CLIENTE:* ${customerName.trim()}`,
      orderNotes ? `📝 *OBSERVAÇÕES GERAIS:* ${orderNotes.trim()}` : null,
      ``,
      `💳 *STATUS DO PAGAMENTO VIA PIX:*`,
      `✅ *PAGAMENTO REALIZADO VIA PIX*`,
      `🔑 *Chave Pix (CNPJ):* ${ESTABLISHMENT_INFO.pixKeyDisplay} (${ESTABLISHMENT_INFO.pixBeneficiary})`,
      pixPayerName ? `👤 *Titular do Pix:* ${pixPayerName.trim()}` : null,
      `📎 *Comprovante do Pix anexado nesta conversa!*`,
    ].filter(Boolean);

    const message = lines.join('\n');
    window.open(
      `https://wa.me/${ESTABLISHMENT_INFO.phone}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  }

  // Filtered menu categories for the Menu Modal
  const filteredCategories = useMemo(() => {
    return MENU_CATEGORIES.map((cat) => {
      if (activeCategory !== 'all' && cat.id !== activeCategory) {
        return null;
      }
      const filteredItems = cat.items.filter((item) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.tag && item.tag.toLowerCase().includes(q))
        );
      });

      if (filteredItems.length === 0) return null;
      return {
        ...cat,
        items: filteredItems,
      };
    }).filter(Boolean) as typeof MENU_CATEGORIES;
  }, [activeCategory, searchQuery]);

  // Price in customization modal
  const modalCurrentUnitPrice = customizingItem
    ? customizingItem.price + modalExtras.reduce((sum, e) => sum + e.price, 0)
    : 0;
  const modalCurrentTotal = modalCurrentUnitPrice * modalQty;

  return (
    <div className="min-h-screen bg-background pb-28 text-foreground selection:bg-primary selection:text-primary-foreground font-sans">
      <div className="mx-auto max-w-md px-3 pt-3">
        
        {/* HERO BANNER SECTION (HERO FOOD BACKGROUND + FLOATING 67 DOG LOGO + CURVED WAVE) */}
        <section className="relative overflow-hidden rounded-3xl border border-primary/30">
          <img
            src={ASSETS.heroBg}
            onError={(e) => {
              e.currentTarget.src = ASSETS.heroDogRemote;
            }}
            alt="67 Dog - hot dog, hambúrguer e pastel"
            width={1024}
            height={1024}
            fetchPriority="high"
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover object-[50%_62%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-background" />

          <div className="relative flex flex-col items-center px-6 pb-24 pt-16 text-center">
            <img
              src={ASSETS.logo67}
              alt="Logo 67 Dog"
              width={813}
              height={900}
              className="animate-float-slow h-64 w-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
            />
          </div>

          {/* ICONIC BOTTOM WAVY DIVIDER */}
          <svg
            viewBox="0 0 400 40"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 h-10 w-full text-background"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M0 0h400v8c-12 0-14 18-22 18s-10-14-20-14-12 22-22 22-10-18-20-18-12 12-22 12-10-20-20-20-12 16-22 16-10-12-20-12-12 24-22 24-10-16-20-16-12 10-22 10-10-18-20-18-12 14-22 14-10-10-20-10-12 20-22 20S12 8 0 8V0z" />
          </svg>
        </section>

        {/* INTERACTIVE ACTION CIRCLES */}
        <section className="mt-6 flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/${ESTABLISHMENT_INFO.phone}`}
              target="_blank"
              rel="noreferrer"
              title="WhatsApp"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-card text-primary transition-transform hover:scale-110 active:scale-95 shadow-sm"
            >
              <MessageCircle className="h-5 w-5" strokeWidth={2.2} />
            </a>

            <a
              href={ESTABLISHMENT_INFO.mapsUrl}
              target="_blank"
              rel="noreferrer"
              title="Localização"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-card text-primary transition-transform hover:scale-110 active:scale-95 shadow-sm"
            >
              <MapPin className="h-5 w-5" strokeWidth={2.2} />
            </a>

            <button
              type="button"
              onClick={() => openMenu('all')}
              title="Abrir Cardápio"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-card text-primary transition-transform hover:scale-110 active:scale-95 shadow-sm cursor-pointer"
            >
              <Utensils className="h-5 w-5" strokeWidth={2.2} />
            </button>

            <a
              href="#info"
              title="Horário"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-card text-primary transition-transform hover:scale-110 active:scale-95 shadow-sm"
            >
              <Clock3 className="h-5 w-5" strokeWidth={2.2} />
            </a>

            <a
              href={ESTABLISHMENT_INFO.instagram}
              target="_blank"
              rel="noreferrer"
              title="Instagram"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-card text-primary transition-transform hover:scale-110 active:scale-95 shadow-sm"
            >
              <Instagram className="h-5 w-5" strokeWidth={2.2} />
            </a>

            <button
              type="button"
              onClick={() => openMenu('all')}
              title="Fazer Pedido"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-card text-primary transition-transform hover:scale-110 active:scale-95 shadow-sm cursor-pointer"
            >
              <Truck className="h-5 w-5" strokeWidth={2.2} />
            </button>
          </div>
          <p className="mt-3 rounded-full border border-primary/30 px-4 py-1 text-[10px] font-bold tracking-widest text-primary">
            👆 CLIQUE NOS ÍCONES PARA INTERAGIR
          </p>
        </section>

        {/* CATEGORY SHORTCUT PILLS (CLIQUE ABRE O CARDÁPIO NA CATEGORIA ESCOLHIDA) */}
        <nav className="mt-6 flex flex-wrap justify-center gap-2">
          {MENU_CATEGORIES.slice(0, 4).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => openMenu(cat.id)}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold transition-all hover:border-primary active:scale-95 cursor-pointer shadow-xs hover:bg-secondary"
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </nav>

        {/* HIGHLIGHTS SECTION: DESTAQUES MAIS PEDIDOS */}
        <section className="mt-6 rounded-3xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-extrabold tracking-wide text-primary">
              🔥 DESTAQUES MAIS PEDIDOS
            </h2>
            <button
              type="button"
              onClick={() => openMenu('all')}
              className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Ver cardápio ›
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {highlights.map(({ item, badge, img }) => (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-border bg-secondary flex flex-col justify-between">
                <div>
                  <div className="relative">
                    <img src={img} alt={item.name} loading="lazy" className="h-28 w-full object-cover" />
                    <span className="absolute left-2 top-2 rounded-md bg-flame px-2 py-0.5 text-[10px] font-black text-flame-foreground">
                      {badge === 'Top 1' ? '🔥' : '★'} {badge}
                    </span>
                  </div>
                  <div className="p-3 pb-0">
                    <h3 className="truncate text-sm font-bold">{item.name}</h3>
                    <p className="truncate text-[11px] text-muted-foreground">{item.description}</p>
                    <p className="mt-1 font-display text-sm font-extrabold text-primary">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
                <div className="p-3 pt-2">
                  <button
                    onClick={() => openCustomization(item)}
                    className="w-full rounded-lg bg-flame py-2 text-xs font-extrabold text-flame-foreground transition-transform active:scale-95 cursor-pointer hover:brightness-110 shadow-sm"
                  >
                    🛒 Pedir / Personalizar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* PRIMARY CALL TO ACTION BUTTONS (ABREM O CARDÁPIO COMPLETO) */}
        <button
          type="button"
          onClick={() => openMenu('all')}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-flame to-accent py-4 font-display text-sm font-black tracking-wide text-flame-foreground shadow-xl transition-transform active:scale-[0.98] hover:brightness-105 cursor-pointer"
        >
          <span>🏃 FAZER PEDIDO (RETIRADA NO BALCÃO)</span>
        </button>

        <button
          type="button"
          onClick={() => openMenu('all')}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-4 text-sm font-bold transition-colors hover:border-primary active:scale-[0.99] cursor-pointer"
        >
          📖 Abrir Cardápio Completo &amp; Comanda
        </button>

        {/* INFO CARDS (RETIRADA / HORÁRIO / PIX CNPJ) */}
        <section id="info" className="mt-8 grid grid-cols-3 gap-2 scroll-mt-6">
          <div className="rounded-2xl border border-border bg-card p-3 text-center">
            <span className="text-xl">🏃</span>
            <p className="mt-1 text-xs font-bold">Retirada</p>
            <p className="text-[10px] text-muted-foreground">Balcão (Grátis)</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-3 text-center">
            <span className="text-xl">⏰</span>
            <p className="mt-1 text-xs font-bold">Horário</p>
            <p className="text-[10px] text-muted-foreground">{ESTABLISHMENT_INFO.hoursDisplay}</p>
          </div>
          <div
            onClick={handleCopyPix}
            className="rounded-2xl border border-border bg-card p-3 text-center cursor-pointer hover:border-primary/50 transition-all active:scale-95 group"
            title="Clique para copiar a Chave Pix (CNPJ)"
          >
            <span className="text-xl">💳</span>
            <p className="mt-1 text-xs font-bold text-primary group-hover:underline">
              {copiedPix ? '✓ Copiado!' : 'Pix (CNPJ)'}
            </p>
            <p className="text-[10px] text-muted-foreground truncate font-mono">
              {copiedPix ? 'Copiado!' : ESTABLISHMENT_INFO.pixKeyDisplay}
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>📍 {ESTABLISHMENT_INFO.address}</p>
          <p className="mt-2">© 2026 {ESTABLISHMENT_INFO.name}. Sabor e crocância inigualáveis.</p>
        </footer>

      </div>

      {/* FLOATING BOTTOM CART BAR */}
      {totalCount > 0 && !isCartOpen && !customizingItem && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-center justify-between rounded-2xl bg-flame px-5 py-4 font-bold text-flame-foreground shadow-2xl transition-transform active:scale-[0.98] cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-flame-foreground/20 text-xs font-black">
              {totalCount}
            </span>
            <span>Ver meu pedido</span>
          </span>
          <span className="font-display text-base font-extrabold">
            <AnimatedPrice value={totalPrice} />
          </span>
        </button>
      )}

      {/* FULLSCREEN / DEDICATED CARDÁPIO MODAL */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-45 flex flex-col bg-background/95 backdrop-blur-md animate-in fade-in duration-200">
          <div className="mx-auto flex h-full w-full max-w-md flex-col">
            
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 shadow-xs">
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-all active:scale-95"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </button>

              <div className="text-center">
                <h2 className="font-display text-sm font-black tracking-wide text-foreground">
                  Cardápio 67 DOG
                </h2>
                <span className="text-[10px] text-primary font-bold">Retirada no Balcão</span>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                aria-label="Fechar cardápio"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* SEARCH AND CATEGORY FILTER TABS */}
            <div className="border-b border-border bg-card p-3 space-y-2.5">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar hot dog, pastel, bebida..."
                  className="w-full rounded-xl border border-input bg-secondary pl-9 pr-3 py-2 text-xs outline-none placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === 'all'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'border border-border bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Todos
                </button>
                {MENU_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'border border-border bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SCROLLABLE LIST OF MENU ITEMS */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
              {filteredCategories.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-3xl mb-2">🔍</p>
                  <p className="text-sm font-bold">Nenhum item encontrado</p>
                  <p className="mt-1 text-xs text-muted-foreground">Tente pesquisar com outro termo.</p>
                </div>
              ) : (
                filteredCategories.map((cat) => (
                  <section key={cat.id} className="space-y-3">
                    <h3 className="font-display text-sm font-extrabold flex items-center gap-2 text-primary">
                      <span>{cat.emoji}</span> {cat.label}
                    </h3>

                    <div className="space-y-2.5">
                      {cat.items.map((item) => (
                        <article
                          key={item.id}
                          onClick={() => openCustomization(item)}
                          className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3.5 transition-all hover:border-primary/50 cursor-pointer active:scale-[0.99]"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold group-hover:text-primary transition-colors">
                                {item.name}
                              </h4>
                              {item.tag && (
                                <span className="rounded-full bg-flame px-2 py-0.5 text-[9px] font-black uppercase text-flame-foreground">
                                  {item.tag}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                            <p className="mt-1.5 font-display text-sm font-extrabold text-primary">
                              {formatCurrency(item.price)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openCustomization(item);
                            }}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-flame text-xl font-bold text-flame-foreground transition-transform active:scale-90 cursor-pointer hover:brightness-110 shadow-sm"
                            aria-label={`Personalizar e Adicionar ${item.name}`}
                          >
                            <Plus className="h-5 w-5" />
                          </button>
                        </article>
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>

            {/* BOTTOM BAR INSIDE MENU IF CART HAS ITEMS */}
            {totalCount > 0 && (
              <div className="border-t border-border bg-card p-3 shadow-lg">
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="flex w-full items-center justify-between rounded-2xl bg-flame px-4 py-3.5 font-bold text-flame-foreground shadow-xl transition-transform active:scale-98 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-flame-foreground/20 text-xs font-black">
                      {totalCount}
                    </span>
                    <span>Ver Comanda / Finalizar</span>
                  </span>
                  <span className="font-display text-base font-extrabold">
                    <AnimatedPrice value={totalPrice} />
                  </span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ITEM CUSTOMIZATION MODAL (ADICIONAIS + REMOÇÕES + QUANTIDADE) */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <button
            className="absolute inset-0 bg-overlay backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setCustomizingItem(null)}
            aria-label="Fechar personalização"
          />
          <div className="relative mx-auto max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-border bg-card p-5 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted" />

            {/* HEADER */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-extrabold">{customizingItem.name}</h2>
                  {customizingItem.tag && (
                    <span className="rounded-full bg-flame px-2 py-0.5 text-[9px] font-black uppercase text-flame-foreground">
                      {customizingItem.tag}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {customizingItem.description}
                </p>
                <p className="mt-2 font-display text-base font-extrabold text-primary">
                  {formatCurrency(customizingItem.price)}
                </p>
              </div>
              <button
                onClick={() => setCustomizingItem(null)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* TIPO DE ATENDIMENTO (RETIRADA VS ENTREGA INDISPONÍVEL) */}
            <div className="mt-5 rounded-2xl border border-border bg-secondary/50 p-3">
              <p className="text-xs font-bold text-muted-foreground mb-2">Tipo de atendimento:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-center gap-1.5 rounded-xl border border-primary bg-primary/10 py-2.5 px-2 text-xs font-bold text-primary shadow-xs">
                  <span>🏃 Retirada (Balcão)</span>
                  <span className="rounded-full bg-primary/20 px-1.5 py-0.2 text-[9px]">Ativo</span>
                </div>

                <div
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary/80 py-2.5 px-2 text-xs font-semibold text-muted-foreground opacity-50 cursor-not-allowed select-none"
                  title="Entrega delivery indisponível no momento"
                >
                  <span>🛵 Entrega</span>
                  <span className="rounded-full bg-muted px-1.5 py-0.2 text-[9px] text-muted-foreground">Em breve</span>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-amber-400/90 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>No momento operamos exclusivamente com retirada no balcão.</span>
              </p>
            </div>

            {/* ADICIONAIS ESPECIAIS (BACON, CHEDDAR, CATUPIRY, ETC.) */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-xs font-black uppercase tracking-wider text-primary">
                  ➕ Adicionais Especiais (Opcional)
                </h3>
                <span className="text-[10px] text-muted-foreground">Turbine seu lanche</span>
              </div>
              <div className="space-y-2">
                {AVAILABLE_EXTRAS.map((extra) => {
                  const isSelected = modalExtras.some((e) => e.id === extra.id);
                  return (
                    <label
                      key={extra.id}
                      onClick={() => toggleExtra(extra)}
                      className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border bg-secondary hover:border-border/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/50'
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-semibold">{extra.name}</span>
                      </div>
                      <span className="font-display text-xs font-bold text-primary">
                        +{formatCurrency(extra.price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* REMOÇÕES DE INGREDIENTES (O QUE RETIRAR DO LANCHE) */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-xs font-black uppercase tracking-wider text-destructive">
                  🚫 Deseja retirar algum item?
                </h3>
                <span className="text-[10px] text-muted-foreground">Sem custo</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_REMOVALS.map((rem) => {
                  const isSelected = modalRemovals.some((r) => r.id === rem.id);
                  return (
                    <button
                      type="button"
                      key={rem.id}
                      onClick={() => toggleRemoval(rem)}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'border-destructive bg-destructive/15 text-destructive font-bold'
                          : 'border-border bg-secondary hover:border-border/80 text-muted-foreground'
                      }`}
                    >
                      <div
                        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors ${
                          isSelected ? 'border-destructive bg-destructive text-white' : 'border-muted-foreground/40'
                        }`}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                      </div>
                      <span className="truncate">{rem.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* OBSERVAÇÃO INDIVIDUAL DO ITEM */}
            <div className="mt-5">
              <label className="text-xs font-bold text-muted-foreground block mb-1.5">
                Observações deste item (opcional):
              </label>
              <input
                value={modalItemNotes}
                onChange={(e) => setModalItemNotes(e.target.value)}
                placeholder="Ex.: Pão bem prensado, milho à parte, etc."
                className="w-full rounded-xl border border-input bg-secondary px-3 py-2 text-xs outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            </div>

            {/* QUANTIDADE E BOTÃO ADICIONAR */}
            <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
              <div className="flex items-center gap-2 rounded-full border border-border bg-secondary px-2 py-1">
                <button
                  type="button"
                  onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-muted font-bold cursor-pointer active:scale-90 hover:bg-muted-foreground/20"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-5 text-center text-sm font-bold">{modalQty}</span>
                <button
                  type="button"
                  onClick={() => setModalQty((q) => q + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-flame font-bold text-flame-foreground cursor-pointer active:scale-90 hover:brightness-110"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={confirmAddCustomizedItem}
                className="flex-1 rounded-2xl bg-flame py-3 px-4 font-display text-sm font-extrabold text-flame-foreground shadow-lg transition-transform active:scale-95 cursor-pointer hover:brightness-110 flex items-center justify-between"
              >
                <span>Adicionar ao Pedido</span>
                <span>{formatCurrency(modalCurrentTotal)}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* INTERACTIVE CART DRAWER / BOTTOM SHEET */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <button
            className="absolute inset-0 bg-overlay backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setIsCartOpen(false)}
            aria-label="Fechar carrinho"
          />
          <div className="relative mx-auto max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-border bg-card p-5 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-extrabold">Comanda &amp; Pedido</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer px-2 py-1"
              >
                Fechar
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-3xl mb-2">🌭</p>
                <p className="text-sm font-bold">Sua comanda está vazia</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Escolha um hot dog ou pastel delicioso no cardápio!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    openMenu('all');
                  }}
                  className="mt-4 rounded-xl bg-flame px-4 py-2 text-xs font-bold text-flame-foreground cursor-pointer hover:brightness-110"
                >
                  Abrir Cardápio
                </button>
              </div>
            ) : (
              <>
                {/* ATENDIMENTO: RETIRADA OBRIGATÓRIA (ENTREGA INDISPONÍVEL CONFORME SOLICITADO) */}
                <div className="mt-4 rounded-2xl border border-border bg-secondary/50 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-muted-foreground">Forma de recebimento:</p>
                    <span className="text-[10px] text-primary font-bold">Apenas Retirada</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-center gap-1.5 rounded-xl border border-primary bg-primary/10 py-2.5 px-2 text-xs font-bold text-primary shadow-xs">
                      <span>🏃 Retirada (Balcão)</span>
                    </div>
                    <div
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary/80 py-2.5 px-2 text-xs font-semibold text-muted-foreground opacity-50 cursor-not-allowed select-none"
                      title="Entrega indisponível no momento"
                    >
                      <span>🛵 Entrega</span>
                      <span className="rounded-full bg-muted px-1.5 py-0.2 text-[9px] text-muted-foreground">Em breve</span>
                    </div>
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    📍 Retirar em: <span className="text-foreground">{ESTABLISHMENT_INFO.address}</span>
                  </p>
                </div>

                {/* LIST OF CART ITEMS WITH EXTRAS AND REMOVALS */}
                <div className="mt-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Itens selecionados:
                  </p>
                  <ul className="space-y-3">
                    {cartItems.map((cartEntry) => (
                      <li
                        key={cartEntry.cartItemId}
                        className="rounded-xl border border-border bg-secondary/60 p-3 flex flex-col gap-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-sm text-foreground">{cartEntry.item.name}</p>
                            <p className="text-xs font-bold text-primary">
                              {formatCurrency(cartEntry.unitPrice)} un.
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQty(cartEntry.cartItemId, -1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-muted font-bold hover:bg-muted-foreground/20 cursor-pointer active:scale-90"
                              aria-label="Diminuir"
                            >
                              −
                            </button>
                            <span className="w-4 text-center text-sm font-bold">{cartEntry.qty}</span>
                            <button
                              onClick={() => updateCartQty(cartEntry.cartItemId, 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-flame font-bold text-flame-foreground hover:brightness-110 cursor-pointer active:scale-90"
                              aria-label="Aumentar"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* EXTRAS LIST */}
                        {cartEntry.selectedExtras.length > 0 && (
                          <div className="text-[11px] text-primary/95 flex flex-wrap gap-1">
                            <span className="font-bold">Adicionais:</span>
                            {cartEntry.selectedExtras.map((e) => (
                              <span key={e.id} className="rounded-md bg-primary/10 px-1.5 py-0.5 border border-primary/20">
                                + {e.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* REMOVALS LIST */}
                        {cartEntry.selectedRemovals.length > 0 && (
                          <div className="text-[11px] text-destructive flex flex-wrap gap-1">
                            <span className="font-bold">Retirar:</span>
                            {cartEntry.selectedRemovals.map((r) => (
                              <span key={r.id} className="rounded-md bg-destructive/10 px-1.5 py-0.5 border border-destructive/20">
                                🚫 {r.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* ITEM NOTES */}
                        {cartEntry.notes && (
                          <p className="text-[11px] text-muted-foreground italic">
                            📝 {cartEntry.notes}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* IDENTIFICAÇÃO DO CLIENTE */}
                <div className="mt-5 space-y-2">
                  <label className="text-xs font-bold text-foreground block">
                    Nome de quem vai retirar no balcão: <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="customer-name-input"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Digite seu nome (Obrigatório)"
                    className={`w-full rounded-xl border bg-secondary px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground transition-colors ${
                      !customerName.trim() ? 'border-amber-500/50' : 'border-primary'
                    }`}
                  />
                  <input
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Observações gerais para a cozinha (opcional)"
                    className="w-full rounded-xl border border-input bg-secondary px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>

                {/* RESUMO DE VALORES */}
                <div className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>Taxa de Atendimento (Retirada)</span>
                    <span className="text-emerald-400 font-bold">Grátis</span>
                  </div>
                  <div className="flex justify-between font-display text-base font-extrabold">
                    <span>Total a Pagar</span>
                    <AnimatedPrice value={totalPrice} className="text-primary font-extrabold text-base" />
                  </div>
                </div>

                {/* PIX MANDATORY PAYMENT BOX */}
                <div id="pix-checkbox-container" className="mt-5 rounded-2xl border-2 border-emerald-500/50 bg-emerald-950/20 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-400" />
                      <span className="font-display text-xs font-black uppercase text-emerald-400 tracking-wider">
                        Pagamento via Pix (Obrigatório)
                      </span>
                    </div>
                    <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      CNPJ
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground mb-3">
                    Transfira o valor exato de <strong className="text-foreground"><AnimatedPrice value={totalPrice} /></strong> para a chave abaixo:
                  </p>

                  <div className="flex items-center justify-between gap-2 rounded-xl bg-card border border-emerald-500/30 p-2.5">
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground">Chave Pix (CNPJ):</p>
                      <p className="font-mono text-sm font-bold text-emerald-400">{ESTABLISHMENT_INFO.pixKeyDisplay}</p>
                      <p className="text-[10px] text-muted-foreground truncate">Favorecido: {ESTABLISHMENT_INFO.pixBeneficiary}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="shrink-0 flex items-center gap-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-3 py-2 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                    >
                      {copiedPix ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* CHECKBOX DE CONFIRMAÇÃO DO PIX (BLOQUEIO DO WHATSAPP) */}
                  <div className="mt-3 space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={pixConfirmed}
                        onChange={(e) => setPixConfirmed(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-emerald-500 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                      />
                      <span className="text-xs font-medium text-foreground leading-snug group-hover:text-emerald-300 transition-colors">
                        Já realizei o Pix de <strong className="text-emerald-400"><AnimatedPrice value={totalPrice} /></strong> e anexarei o comprovante no WhatsApp.
                      </span>
                    </label>

                    {pixConfirmed && (
                      <input
                        value={pixPayerName}
                        onChange={(e) => setPixPayerName(e.target.value)}
                        placeholder="Nome no comprovante Pix (opcional)"
                        className="w-full rounded-xl border border-emerald-500/30 bg-card px-3 py-2 text-xs outline-none placeholder:text-muted-foreground focus:border-emerald-400"
                      />
                    )}
                  </div>
                </div>

                {/* BOTÃO ENVIAR PEDIDO NO WHATSAPP (DESIGN DESENQUADRADO, FLUIDO E MODERNO) */}
                <div className="mt-5">
                  {!pixConfirmed || !customerName.trim() ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (!customerName.trim()) {
                          const inputEl = document.getElementById('customer-name-input');
                          inputEl?.focus();
                          inputEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        } else if (!pixConfirmed) {
                          const pixEl = document.getElementById('pix-checkbox-container');
                          pixEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className="group relative flex w-full items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 to-secondary/80 p-3.5 text-left transition-all duration-300 hover:border-amber-400/50 hover:bg-secondary active:scale-[0.99] cursor-pointer shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 group-hover:scale-105 group-hover:bg-amber-500/25 transition-all">
                          <AlertCircle className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-display text-xs font-bold text-foreground truncate">
                            {!customerName.trim()
                              ? '1. Digite seu nome para retirar'
                              : '2. Confirme o pagamento Pix'}
                          </p>
                          <p className="text-[11px] text-amber-300/80 truncate">
                            {!customerName.trim()
                              ? 'Toque aqui para preencher seu nome'
                              : 'Marque a caixinha do Pix pago para liberar'}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 rounded-full bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold text-amber-300 group-hover:bg-amber-500/30 transition-colors">
                        Pendente
                      </div>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={sendWhatsAppOrder}
                      className="group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#25D366] via-[#1EBE5D] to-[#128C7E] p-3.5 text-white shadow-[0_12px_28px_-6px_rgba(37,211,102,0.45)] transition-all duration-300 hover:brightness-110 active:scale-[0.98] cursor-pointer animate-pulse hover:animate-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xs text-white shadow-inner group-hover:scale-105 transition-transform">
                          <MessageCircle className="h-6 w-6 fill-white stroke-none" />
                        </div>
                        <div className="text-left min-w-0">
                          <span className="font-display text-xs font-black uppercase tracking-wider block truncate">
                            Enviar Pedido no WhatsApp
                          </span>
                          <span className="text-[11px] text-white/90 font-medium block truncate">
                            Comprovante Pix pronto para envio
                          </span>
                        </div>
                      </div>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/25 text-white group-hover:translate-x-1 transition-transform">
                        <span className="font-bold text-sm">›</span>
                      </div>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
