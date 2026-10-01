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
  Navigation,
  ExternalLink,
  CreditCard,
  Sparkles,
  UserPlus,
  PhoneCall,
  Trash2,
  SlidersHorizontal,
} from 'lucide-react';
import { ASSETS } from './assets/images';
import {
  MENU_CATEGORIES,
  MENU_ITEMS,
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

function getItemImage(item: MenuItem): string {
  if (item.image) return item.image;
  
  switch (item.id) {
    case 'dog-democratico':
      return ASSETS.hotdog;
    case 'dog-raiz':
      return ASSETS.hotdogAppetizing;
    case 'dog-raiz-duplo':
      return ASSETS.hotdogGourmet;
    case 'dog-frangolino':
      return ASSETS.hotdogRealista;
    case 'dog-calabresaco':
      return ASSETS.hotdogAppetizing;
    case 'dog-baconzeira':
      return ASSETS.hotdogCheddar;
    case 'dog-costelaco':
      return ASSETS.heroHotdog;
    case 'dog-six-seven':
      return ASSETS.heroHotdog;

    // Combos
    case 'combo-six-seven-na-medida':
    case 'combo-duplinha':
    case 'combo-galera':
      return ASSETS.combo;

    // Burgers
    case 'burger-x-salada':
    case 'burger-x-frango':
    case 'burger-x-bacon':
    case 'burger-x-calabresa':
    case 'burger-x-costela':
    case 'burger-x-tudo':
    case 'burger-classic-67':
    case 'burger-bacon-supreme':
    case 'burger-costelaco-bbq':
    case 'burger-smash-duplo':
      return ASSETS.burger;

    // Pastéis
    case 'pastel-carne':
    case 'pastel-carne-especial':
      return ASSETS.pastel;
    case 'pastel-frango':
    case 'pastel-frango-catupiry':
      return ASSETS.pastelCrocante;
    case 'pastel-queijo':
    case 'pastel-queijo-duplo':
      return ASSETS.pastel;
    case 'pastel-pizza':
    case 'pastel-pizza-especial':
      return ASSETS.pastelCrocante;
    case 'pastel-costela-queijo':
    case 'pastel-chocolate-banana':
      return ASSETS.pastelCrocante;

    // Bebidas
    case 'refri-lata':
    case 'coca-600':
    case 'refri-2l':
    case 'agua-500':
      return ASSETS.bebidas;

    default:
      if (item.category === 'hotdogs') return ASSETS.hotdog;
      if (item.category === 'hamburgueres') return ASSETS.burger;
      if (item.category === 'pasteis') return ASSETS.pastel;
      if (item.category === 'combos') return ASSETS.combo;
      if (item.category === 'bebidas') return ASSETS.bebidas;
      return ASSETS.hotdog;
  }
}

function MenuItemCard({
  item,
  onSelect,
  index = 0,
}: {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  index?: number;
}) {
  const isBebida = item.category === 'bebidas';
  const match = item.name.match(/^(\d+)[\.\-\s]+(.*)$/);
  const itemNumber = match ? match[1] : null;
  const displayName = match ? match[2] : item.name;
  const staggerDelay = `${Math.min(index * 40, 360)}ms`;

  return (
    <article
      onClick={() => onSelect(item)}
      style={{ animationDelay: staggerDelay }}
      className="animate-card-entry group relative flex items-center gap-3 sm:gap-3.5 rounded-2xl border border-border/60 bg-card/80 p-3 transition-all hover:border-amber-400/50 hover:bg-card cursor-pointer active:scale-[0.99] shadow-xs hover:shadow-md will-change-[transform,opacity]"
    >
      {/* MINIATURA DA IMAGEM DO LANCHE (LADO ESQUERDO) */}
      <div className="relative h-20 w-20 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-sm">
        <img
          src={getItemImage(item)}
          alt={displayName}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = ASSETS.hotdog;
          }}
        />
        {item.discountPercent && (
          <span className="absolute top-1 left-1 rounded-md bg-flame px-1.5 py-0.5 text-[9px] font-black text-white shadow-xs">
            -{item.discountPercent}%
          </span>
        )}
      </div>

      {/* INFORMAÇÕES DO LANCHE */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <h4 className="font-display text-sm font-extrabold text-foreground group-hover:text-amber-300 transition-colors leading-snug flex items-center gap-1.5 flex-wrap">
            {itemNumber && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-500/15 border border-amber-500/30 text-[11px] font-black text-amber-400 font-mono shadow-2xs">
                {itemNumber}
              </span>
            )}
            <span>{displayName}</span>
          </h4>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2">
          {/* PREÇO EM DESTAQUE COM PREÇO ORIGINAL SE HOUVER DESCONTO */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-sm font-black text-primary">
              {formatCurrency(item.price)}
            </span>
            {item.originalPrice && (
              <span className="text-[11px] text-muted-foreground line-through opacity-70">
                {formatCurrency(item.originalPrice)}
              </span>
            )}
          </div>

          {/* BOTÃO UNIFICADO COM ALTA LEGIBILIDADE */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-flame/90 group-hover:bg-flame text-white px-2.5 py-1 text-[11px] font-bold shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="h-2.5 w-2.5" />
            <span>{isBebida ? 'Pedir' : 'Personalizar'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function DailyOffersCarousel({
  offers,
  onSelect,
}: {
  offers: MenuItem[];
  onSelect: (item: MenuItem) => void;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  if (!offers || offers.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-flame/40 bg-gradient-to-br from-flame/15 via-card to-card p-3.5 sm:p-4 shadow-lg shadow-flame/5">
      {/* HEADER DA SEÇÃO OFERTAS DO DIA */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-flame text-white shadow-xs">
            <span className="text-sm">⚡</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xs sm:text-sm font-black uppercase tracking-wider text-flame">
                Ofertas do Dia
              </h3>
              <span className="rounded-full bg-flame/20 border border-flame/40 px-2 py-0.5 text-[9px] font-black uppercase text-flame tracking-tight">
                Desconto Especial
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Preços promocionais válidos para pedidos no balcão hoje
            </p>
          </div>
        </div>

        {/* SETAS DE NAVEGAÇÃO RÁPIDA */}
        <div className="hidden sm:flex items-center gap-1">
          <button
            type="button"
            onClick={scrollLeft}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-95 transition-all cursor-pointer font-bold text-sm"
            aria-label="Rolar para esquerda"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={scrollRight}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-95 transition-all cursor-pointer font-bold text-sm"
            aria-label="Rolar para direita"
          >
            ›
          </button>
        </div>
      </div>

      {/* CARROSSEL HORIZONTAL DE OFERTAS */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth -mx-1 px-1"
      >
        {offers.map((offer, idx) => {
          const match = offer.name.match(/^(\d+)[\.\-\s]+(.*)$/);
          const itemNumber = match ? match[1] : null;
          const displayName = match ? match[2] : offer.name;

          return (
            <article
              key={`daily-offer-${offer.id}`}
              onClick={() => onSelect(offer)}
              style={{ animationDelay: `${Math.min(idx * 50, 250)}ms` }}
              className="animate-card-entry snap-start w-[240px] sm:w-[260px] shrink-0 rounded-2xl border border-white/10 bg-neutral-900/95 p-3 shadow-md transition-all hover:border-flame/70 hover:shadow-xl hover:shadow-flame/10 hover:bg-neutral-850 cursor-pointer active:scale-[0.98] group flex flex-col justify-between will-change-[transform,opacity]"
            >
              <div>
                {/* TOPO DO CARD: TAG DE ECONOMIA E IMAGEM */}
                <div className="flex items-start gap-2.5">
                  <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-inner">
                    <img
                      src={getItemImage(offer)}
                      alt={displayName}
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = ASSETS.hotdog;
                      }}
                    />
                    {offer.discountPercent && (
                      <span className="absolute top-1 left-1 rounded-md bg-flame px-1.5 py-0.5 text-[9px] font-black text-white shadow-xs">
                        -{offer.discountPercent}%
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 mb-0.5">
                      {itemNumber && (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-primary/20 text-[10px] font-black text-primary font-mono">
                          {itemNumber}
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-tight truncate">
                        {offer.category === 'combos'
                          ? 'Combo'
                          : offer.category === 'hotdogs'
                          ? 'Hot Dog'
                          : offer.category === 'hamburgueres'
                          ? 'Burger'
                          : offer.category === 'pasteis'
                          ? 'Pastel'
                          : 'Especial'}
                      </span>
                    </div>
                    <h4 className="font-display text-xs font-black text-foreground group-hover:text-primary transition-colors leading-tight truncate">
                      {displayName}
                    </h4>
                    <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* RODAPÉ DO CARD: PREÇOS E BOTÃO DE AÇÃO */}
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-sm font-black text-flame">
                      {formatCurrency(offer.price)}
                    </span>
                    {offer.originalPrice && (
                      <span className="text-[11px] text-muted-foreground line-through opacity-70">
                        {formatCurrency(offer.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-md bg-flame/15 border border-flame/30 px-2 py-0.5 text-[10px] font-bold text-flame group-hover:bg-flame group-hover:text-white transition-colors">
                    <SlidersHorizontal className="h-2.5 w-2.5" />
                    <span>Pedir</span>
                  </span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-flame text-white shadow-xs group-hover:scale-110 group-hover:brightness-110 transition-all shrink-0">
                    <Plus className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
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

// Ícones Oficiais das Marcas para reconhecimento imediato por qualquer pessoa
function OfficialWhatsAppIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.69C7.02 10.9 7.9 12.06 8.02 12.23C8.14 12.4 9.75 14.89 12.21 15.95C12.8 16.2 13.25 16.35 13.61 16.47C14.2 16.65 14.74 16.63 15.17 16.56C15.65 16.49 16.64 15.96 16.85 15.37C17.05 14.78 17.05 14.28 16.99 14.17C16.93 14.07 16.79 14.01 16.57 13.9C16.35 13.79 15.28 13.26 15.08 13.19C14.88 13.12 14.74 13.08 14.59 13.31C14.45 13.53 14.04 14.01 13.92 14.15C13.79 14.3 13.67 14.32 13.45 14.21C13.23 14.1 12.52 13.87 11.68 13.12C11.02 12.53 10.58 11.8 10.45 11.58C10.33 11.36 10.44 11.24 10.55 11.13C10.65 11.03 10.77 10.87 10.88 10.74C10.99 10.61 11.03 10.51 11.1 10.36C11.17 10.22 11.14 10.09 11.08 9.98C11.03 9.87 10.59 8.79 10.4 8.35C10.23 7.92 10.05 7.98 9.91 7.97C9.78 7.96 9.63 7.96 9.49 7.96C9.34 7.96 9.1 8.01 8.89 8.24C8.67 8.47 8.53 8.61 8.53 7.33Z" />
    </svg>
  );
}

function OfficialInstagramIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function OfficialGoogleMapsPinIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
        fill="#EA4335"
      />
      <circle cx="12" cy="9" r="3.2" fill="#FFFFFF" />
      <circle cx="12" cy="9" r="1.8" fill="#B31412" />
    </svg>
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

  const dailyOffers = useMemo(() => {
    return MENU_ITEMS.filter((item) => item.isDailyOffer);
  }, []);

  const [cart, setCart] = useState<Record<string, CartItemState>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [copiedPix, setCopiedPix] = useState(false);
  const [pixConfirmed, setPixConfirmed] = useState(false);
  const [pixPayerName, setPixPayerName] = useState('');

  // Location & Schedule Info Modal
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalTab, setInfoModalTab] = useState<'all' | 'address' | 'hours'>('all');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [contactSaved, setContactSaved] = useState(false);

  // Dedicated Contact Session Modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Floating WhatsApp button visibility (activates after 300px scroll)
  const [showFloatingWhatsApp, setShowFloatingWhatsApp] = useState(false);

  // Hero banner background image loading state (for skeleton shimmer effect)
  const [heroBgLoaded, setHeroBgLoaded] = useState(false);

  React.useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setShowFloatingWhatsApp(scrollY >= 300);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    const allItems = MENU_CATEGORIES.flatMap((c) => c.items);
    const dogRaiz = allItems.find((i) => i.id === 'dog-raiz');
    const dogSixSeven = allItems.find((i) => i.id === 'dog-six-seven');
    const burgerBacon = allItems.find((i) => i.id === 'burger-x-bacon');
    const pastelCarne = allItems.find((i) => i.id === 'pastel-carne');

    const list = [];
    if (dogRaiz) {
      list.push({
        item: dogRaiz,
        badge: '⚡ 16% OFF • Oferta',
        subtitle: 'Vina, tomate, milho, cebola, maionese e batata palha',
        img: ASSETS.hotdogAppetizing,
      });
    }
    if (dogSixSeven) {
      list.push({
        item: dogSixSeven,
        badge: '🔥 Top 1 • O Mais Pedido',
        subtitle: '2 vinas, frango desfiado, calabresa, bacon e purê',
        img: ASSETS.heroHotdog,
      });
    }
    if (burgerBacon) {
      list.push({
        item: burgerBacon,
        badge: '🍔 11% OFF • Artesanal',
        subtitle: 'Brioche, blend suculento, queijo e fatias generosas de bacon',
        img: ASSETS.burger,
      });
    }
    if (pastelCarne) {
      list.push({
        item: pastelCarne,
        badge: '🥟 15% OFF • Crocante',
        subtitle: 'Massa crocante e sequinha com carne moída especial',
        img: ASSETS.pastel,
      });
    }
    return list;
  }, []);

  function handleCopyPix() {
    navigator.clipboard.writeText(ESTABLISHMENT_INFO.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  }

  function handleCopyAddress() {
    navigator.clipboard.writeText(ESTABLISHMENT_INFO.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  }

  function handleSaveContact() {
    setIsContactModalOpen(true);
  }

  function handleDownloadVCard() {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://67dog.com.br';
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:67 Dog • Six Seven Hot Dog',
      'N:Dog;67;;;',
      'ORG:67 Dog - Hot Dog, Burger e Pastel',
      'TITLE:Cardápio Digital & Pedidos',
      `TEL;TYPE=CELL,VOICE,WHATSAPP:+${ESTABLISHMENT_INFO.phone}`,
      `URL:${currentUrl}`,
      `ADR;TYPE=WORK:;;${ESTABLISHMENT_INFO.address};Fazenda Rio Grande;PR;83823-114;Brasil`,
      'NOTE:O autêntico Hot Dog com Vina, Hambúrgueres artesanais e Pastéis crocantes! Acesse nosso cardápio no link deste contato para fazer seu pedido.',
      'END:VCARD',
    ].join('\r\n');

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '67_Dog_Contato.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 60000);

    setContactSaved(true);
    setTimeout(() => setContactSaved(false), 3500);
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

  function handleClearCart() {
    setCart({});
    setCustomerName('');
    setOrderNotes('');
    setPixConfirmed(false);
    setPixPayerName('');
    setCopiedPix(false);
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
        <section className="relative overflow-hidden rounded-3xl min-h-[360px] sm:min-h-[400px] w-full bg-neutral-950 border border-white/5 shadow-2xl">
          {/* SKELETON LOADING COM DESTAQUE-SKELETON-SHIMMER */}
          <div
            className={`absolute inset-0 z-0 bg-neutral-900/90 destaque-skeleton-shimmer transition-opacity duration-700 ease-out ${
              heroBgLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            aria-hidden="true"
          />

          {/* IMAGEM DO BANNER PRINCIPAL */}
          <img
            src={ASSETS.heroBg}
            onLoad={() => setHeroBgLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = ASSETS.heroDogRemote;
              setHeroBgLoaded(true);
            }}
            alt="67 Dog - hot dog, hambúrguer e pastel"
            width={1024}
            height={1024}
            fetchPriority="high"
            loading="eager"
            className={`absolute inset-0 h-full w-full object-cover object-[50%_62%] transition-opacity duration-700 ease-out ${
              heroBgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/30 via-black/10 to-background" />

          <div className="relative z-10 flex flex-col items-center px-6 pb-24 pt-16 text-center">
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
            className="absolute bottom-0 left-0 z-10 h-10 w-full text-background"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M0 0h400v8c-12 0-14 18-22 18s-10-14-20-14-12 22-22 22-10-18-20-18-12 12-22 12-10-20-20-20-12 16-22 16-10-12-20-12-12 24-22 24-10-16-20-16-12 10-22 10-10-18-20-18-12 14-22 14-10-10-20-10-12 20-22 20S12 8 0 8V0z" />
          </svg>
        </section>

        {/* INTERACTIVE ACTION CARDS (CLEAN, BALANCED QUICK HUB) */}
        <section className="mt-5 w-full">
          <div className="rounded-3xl border border-border/70 bg-card/80 p-3 sm:p-3.5 backdrop-blur-xl shadow-xl space-y-2.5">
            {/* Linha 1: WhatsApp Oficial e Salvar Contato */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* 1. WHATSAPP */}
              <a
                href={`https://wa.me/${ESTABLISHMENT_INFO.phone}`}
                target="_blank"
                rel="noreferrer"
                className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-950/70 p-3 backdrop-blur-md transition-all hover:scale-[1.02] hover:border-emerald-400 active:scale-95 cursor-pointer shadow-xs"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-[0_4px_12px_rgba(37,211,102,0.35)] group-hover:scale-105 transition-transform">
                  <OfficialWhatsAppIcon className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-xs sm:text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
                      WhatsApp
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[#25D366] animate-pulse shrink-0" />
                  </div>
                  <p className="text-[11px] font-medium text-emerald-200/80 truncate">
                    Falar conosco
                  </p>
                </div>
              </a>

              {/* 2. SALVAR CONTATO */}
              <button
                type="button"
                onClick={handleSaveContact}
                className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs ${
                  contactSaved
                    ? 'border-emerald-400 bg-emerald-950/80 shadow-[0_4px_16px_rgba(16,185,129,0.3)]'
                    : 'border-amber-500/30 bg-amber-950/40 hover:bg-amber-950/70 hover:border-amber-400'
                }`}
                title="Salvar contato oficial do 67 Dog na agenda do seu celular"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm group-hover:scale-105 transition-transform ${
                    contactSaved
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500 text-black'
                  }`}
                >
                  {contactSaved ? (
                    <Check className="h-5 w-5 text-white stroke-[3]" />
                  ) : (
                    <UserPlus className="h-5 w-5 stroke-[2.4]" />
                  )}
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate">
                      {contactSaved ? 'Salvo!' : 'Contato'}
                    </span>
                    <span className={`h-2 w-2 rounded-full ${contactSaved ? 'bg-emerald-400' : 'bg-amber-400'} shrink-0`} />
                  </div>
                  <p className="text-[11px] font-medium text-amber-200/80 truncate">
                    {contactSaved ? 'Adicionado ✓' : 'Salvar na agenda'}
                  </p>
                </div>
              </button>
            </div>

            {/* Linha 2: 3 Cartões Informativos (Endereço, Horários, Instagram) */}
            <div className="grid grid-cols-3 gap-2 pt-0.5">
              {/* 3. ENDEREÇO */}
              <button
                type="button"
                onClick={() => {
                  setInfoModalTab('address');
                  setIsInfoModalOpen(true);
                }}
                className="group flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-secondary/60 hover:bg-secondary hover:border-border p-2.5 text-center transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs"
              >
                <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 p-1 group-hover:scale-105 transition-transform">
                  <OfficialGoogleMapsPinIcon className="h-5 w-5" />
                </div>
                <span className="font-display text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  Endereço
                </span>
                <span className="text-[10px] text-muted-foreground truncate w-full">
                  Como Chegar
                </span>
              </button>

              {/* 4. HORÁRIOS */}
              <button
                type="button"
                onClick={() => {
                  setInfoModalTab('hours');
                  setIsInfoModalOpen(true);
                }}
                className="group flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-secondary/60 hover:bg-secondary hover:border-border p-2.5 text-center transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs"
              >
                <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary group-hover:scale-105 transition-transform">
                  <Clock3 className="h-4 w-4" strokeWidth={2.4} />
                </div>
                <span className="font-display text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  Horários
                </span>
                <span className="text-[10px] text-muted-foreground truncate w-full">
                  18h às 23h
                </span>
              </button>

              {/* 5. INSTAGRAM */}
              <a
                href={ESTABLISHMENT_INFO.instagram}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-secondary/60 hover:bg-secondary hover:border-border p-2.5 text-center transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs"
              >
                <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white group-hover:scale-105 transition-transform">
                  <OfficialInstagramIcon className="h-4 w-4 text-white" />
                </div>
                <span className="font-display text-xs font-bold text-foreground group-hover:text-pink-300 transition-colors">
                  Instagram
                </span>
                <span className="text-[10px] text-muted-foreground truncate w-full">
                  @67dog_
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* QUADRO DE CATEGORIAS UNIFORME & ORGÂNICO */}
        <nav
          aria-label="Categorias do Cardápio"
          className="mt-6 relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-b from-neutral-900/90 via-card to-card/95 p-3 sm:p-3.5 shadow-xl shadow-black/40 backdrop-blur-2xl"
        >
          {/* Linha de brilho orgânico no topo */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
          <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-16 w-40 rounded-full bg-amber-500/10 blur-xl" />

          {/* Cabeçalho do Quadro */}
          <div className="relative mb-2.5 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/20 text-xs">
                ✨
              </span>
              <span className="font-display text-xs font-black uppercase tracking-wider text-primary">
                Cardápio por Categoria
              </span>
            </div>
            <span className="text-[10px] font-bold text-amber-300/90">
              Toque para abrir ›
            </span>
          </div>

          {/* Grade uniforme com todas as 5 categorias em formato padronizado */}
          <div className="relative grid grid-cols-5 gap-1.5 sm:gap-2">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  const el = document.getElementById('cardapio-67-dog');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative flex flex-col items-center justify-between rounded-2xl border border-white/10 bg-neutral-900/70 p-1.5 sm:p-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400/60 hover:bg-neutral-800 hover:shadow-[0_6px_20px_rgba(245,158,11,0.2)] active:scale-95 cursor-pointer text-center h-[82px] sm:h-[88px]"
              >
                {/* Ícone com container orgânico uniforme */}
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-b from-white/10 to-white/[0.03] border border-white/10 shadow-inner group-hover:scale-110 group-hover:border-amber-400/50 group-hover:from-amber-500/20 transition-all duration-200">
                  <span className="text-xl sm:text-2xl drop-shadow-xs">
                    {cat.emoji}
                  </span>
                </div>

                {/* Nome uniforme e quantidade de opções */}
                <div className="w-full mt-1 flex flex-col items-center justify-center">
                  <span className="block w-full font-display text-[10px] sm:text-xs font-extrabold text-foreground group-hover:text-amber-300 transition-colors leading-tight text-center truncate tracking-tight">
                    {cat.label}
                  </span>
                  <span className="block text-[9px] font-medium text-muted-foreground group-hover:text-amber-200/80 transition-colors">
                    {cat.items.length} itens
                  </span>
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* SEÇÃO OFERTAS DO DIA & DESTAQUES MAIS PEDIDOS (COMO NO INÍCIO: CARDS GRANDES, APETITOSOS E DESTACADOS) */}
        <section className="mt-6 rounded-3xl border border-border bg-card p-4 shadow-xl">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-flame text-white text-xs font-black shadow-xs animate-bounce">
                🔥
              </span>
              <div>
                <h2 className="font-display text-sm sm:text-base font-black tracking-wide text-primary flex items-center gap-1.5">
                  <span>OFERTAS DO DIA & MAIS PEDIDOS</span>
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Destaques preparados na hora com desconto especial hoje
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('cardapio-67-dog');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer shrink-0"
            >
              Ver tudo ›
            </button>
          </div>

          {/* GRADE DE CARDS DESTACADOS COM FOTOS GRANDES, DESCONTOS E BOTÃO DIRETO */}
          <div className="mt-3.5 grid grid-cols-2 gap-3 sm:gap-3.5">
            {highlights.map(({ item, badge, subtitle, img }) => {
              const match = item.name.match(/^(\d+)[\.\-\s]+(.*)$/);
              const itemNumber = match ? match[1] : null;
              const displayName = match ? match[2] : item.name;

              return (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-border/70 bg-card/85 hover:border-amber-400/50 hover:bg-card transition-all flex flex-col justify-between shadow-sm hover:shadow-xl"
                >
                  <div className="flex-1 flex flex-col">
                    <div className="relative overflow-hidden h-28 sm:h-34 w-full bg-neutral-950">
                      <img
                        src={img}
                        alt={displayName}
                        loading="lazy"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute left-2 top-2 rounded-lg bg-flame/95 px-2 py-0.5 text-[10px] font-black text-white shadow-md">
                        {badge}
                      </span>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          {itemNumber && (
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-amber-500/20 text-[10px] font-black text-amber-400 font-mono">
                              {itemNumber}
                            </span>
                          )}
                          <h3 className="truncate font-display text-sm font-black tracking-wide text-foreground group-hover:text-amber-300 transition-colors">
                            {displayName}
                          </h3>
                        </div>
                        <p className="line-clamp-2 text-[11px] text-muted-foreground leading-relaxed">
                          {subtitle || item.description}
                        </p>
                      </div>
                      <div className="mt-2.5 flex items-baseline gap-1.5">
                        <span className="font-display text-sm sm:text-base font-black text-primary">
                          {formatCurrency(item.price)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-[11px] text-muted-foreground line-through opacity-70">
                            {formatCurrency(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="px-3 pb-3 pt-0">
                    <button
                      onClick={() => openCustomization(item)}
                      className="w-full rounded-xl bg-flame py-2 sm:py-2.5 text-xs font-black text-white transition-all active:scale-95 cursor-pointer hover:brightness-110 shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5 stroke-[3]" />
                      <span>Pedir / Personalizar</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* TEASER DOS COMBOS 67 */}
          <div
            onClick={() => {
              setActiveCategory('combos');
              const el = document.getElementById('cardapio-67-dog');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-3.5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-card to-card p-3 flex items-center justify-between gap-3 cursor-pointer hover:border-amber-400/60 transition-all active:scale-[0.99] group shadow-xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 text-lg group-hover:scale-105 transition-transform">
                🔥
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xs font-black uppercase text-amber-400 tracking-wide truncate">
                    Combos 67
                  </span>
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-bold text-amber-300">
                    Com Refrigerante
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                  Duplinha (R$ 64,90), Galera (R$ 98,90) e Na Medida (R$ 39,90)
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform">
              <span>Ver</span>
              <span>›</span>
            </div>
          </div>
        </section>

        {/* SEÇÃO CARDÁPIO 67 DOG (ESTRUTURA ESTRITAMENTE UNIFORME) */}
        <section id="cardapio-67-dog" className="mt-6 rounded-3xl border border-border bg-card/70 p-4 shadow-xl scroll-mt-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h2 className="font-display text-base sm:text-lg font-black tracking-wide text-foreground flex items-center gap-2">
                <span>🌭</span>
                <span>Cardápio 67 DOG</span>
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Toque em qualquer lanche para personalizar e pedir (Retirada no Balcão)
              </p>
            </div>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-1 text-[10px] font-bold text-primary shrink-0">
              Balcão
            </span>
          </div>

          {/* SEARCH AND CATEGORY FILTER TABS */}
          <div className="mt-4 space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar hot dog, hambúrguer, pastel, bebida..."
                className="w-full rounded-xl border border-input bg-secondary/80 pl-9 pr-3 py-2 text-xs outline-none placeholder:text-muted-foreground focus:border-primary"
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
                Todos ({MENU_ITEMS.length})
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
                  {cat.emoji} {cat.label} ({cat.items.length})
                </button>
              ))}
            </div>
          </div>

          {/* LISTA UNIFORME DE ITENS DO CARDÁPIO */}
          <div className="mt-4 space-y-6">
            {filteredCategories.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-3xl mb-2">🔍</p>
                <p className="text-sm font-bold">Nenhum item encontrado</p>
                <p className="mt-1 text-xs text-muted-foreground">Tente buscar por outro termo.</p>
              </div>
            ) : (
              filteredCategories.map((cat) => (
                <div key={cat.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-extrabold flex items-center gap-2 text-primary">
                      <span>{cat.emoji}</span> {cat.label}
                    </h3>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {cat.items.length} {cat.items.length === 1 ? 'opção' : 'opções'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {cat.items.map((item, idx) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onSelect={openCustomization}
                        index={idx}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => {
              setInfoModalTab('address');
              setIsInfoModalOpen(true);
            }}
            className="mx-auto block text-[10px] sm:text-xs tracking-tight text-muted-foreground hover:text-amber-400 transition-colors underline-offset-4 hover:underline cursor-pointer"
          >
            📍 {ESTABLISHMENT_INFO.address} (Toque para ver rotas)
          </button>
          <p className="mt-1.5 text-[11px] sm:text-xs">© 2026 {ESTABLISHMENT_INFO.name}. Sabor e crocância inigualáveis.</p>
        </footer>

      </div>

      {/* FLOATING BOTTOM CART BAR */}
      {totalCount > 0 && !isCartOpen && !customizingItem && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-center justify-between rounded-2xl bg-flame px-5 py-4 font-bold text-flame-foreground shadow-2xl transition-transform active:scale-[0.98] cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-black text-flame shadow-sm">
              {totalCount}
            </span>
            <span>Ver meu pedido</span>
          </span>
          <span className="font-display text-base font-extrabold">
            <AnimatedPrice value={totalPrice} />
          </span>
        </button>
      )}

      {/* BOTÃO FLUTUANTE DE WHATSAPP FIXO NO CANTO INFERIOR DIREITO (VISÍVEL APÓS 300PX DE ROLAGEM) */}
      <div
        className={`fixed z-40 transition-all duration-500 ease-out ${
          totalCount > 0 && !isCartOpen && !customizingItem
            ? 'bottom-22 sm:bottom-24 right-4 sm:right-6'
            : 'bottom-5 sm:bottom-6 right-4 sm:right-6'
        } ${
          showFloatingWhatsApp && !isMenuOpen && !isCartOpen && !customizingItem && !isInfoModalOpen && !isContactModalOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-6 scale-75 pointer-events-none'
        }`}
      >
        <a
          href={`https://wa.me/${ESTABLISHMENT_INFO.phone}?text=${encodeURIComponent('Olá! Gostaria de fazer um pedido no 67 Dog.')}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chamar no WhatsApp"
          className="group relative flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#1EBE5D] via-[#25D366] to-[#34E77B] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_10px_32px_rgba(37,211,102,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          {/* Efeito de pulsação suave em ondas (radar) */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping" />
          <span className="absolute -inset-1.5 rounded-full bg-[#25D366]/20 animate-pulse" />

          {/* Ícone Oficial WhatsApp */}
          <OfficialWhatsAppIcon className="relative z-10 h-7 w-7 text-white drop-shadow-sm group-hover:scale-110 transition-transform" />

          {/* Tooltip elegante no Desktop ao passar o mouse */}
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl border border-white/10 bg-neutral-950/95 px-3 py-1.5 text-xs font-black tracking-wide text-white opacity-0 shadow-2xl backdrop-blur-md transition-all duration-200 group-hover:opacity-100 group-hover:-translate-x-1 hidden sm:flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#25D366] animate-pulse" />
            <span>Chamar no WhatsApp</span>
          </span>
        </a>
      </div>

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
              {/* OFERTAS DO DIA NO TOPO DO MODAL */}
              {dailyOffers.length > 0 && searchQuery.trim() === '' && (
                <div>
                  <DailyOffersCarousel offers={dailyOffers} onSelect={openCustomization} />
                </div>
              )}

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
                      {cat.items.map((item, idx) => (
                        <MenuItemCard
                          key={item.id}
                          item={item}
                          onSelect={openCustomization}
                          index={idx}
                        />
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
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-black text-flame shadow-sm">
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

            {/* HEADER COM IMAGEM DO LANCHE SELECIONADO */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <img
                  src={getItemImage(customizingItem)}
                  alt={customizingItem.name}
                  className="h-16 w-16 sm:h-18 sm:w-18 shrink-0 rounded-2xl object-cover border border-white/10 shadow-md bg-neutral-900"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-base font-extrabold text-foreground">
                    {customizingItem.name.replace(/^\d+\.\s*/, '')}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {customizingItem.description}
                  </p>
                  <p className="mt-1.5 font-display text-sm font-extrabold text-primary">
                    {formatCurrency(customizingItem.price)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCustomizingItem(null)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer shrink-0"
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
              <div className="flex items-center gap-2">
                {cartItems.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-bold text-destructive hover:bg-destructive hover:text-white transition-all cursor-pointer active:scale-95"
                    title="Limpar todos os itens da comanda e começar do zero"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Limpar Comanda</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-xl border border-border bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  Fechar
                </button>
              </div>
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
                        <div className="flex items-start justify-between gap-2.5">
                          <img
                            src={getItemImage(cartEntry.item)}
                            alt={cartEntry.item.name}
                            className="h-12 w-12 shrink-0 rounded-xl object-cover border border-white/10 shadow-xs bg-neutral-900"
                            onError={(e) => {
                              e.currentTarget.src = ASSETS.hotdog;
                            }}
                          />
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
                          <OfficialWhatsAppIcon className="h-6 w-6 text-white" />
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

      {/* MODAL INFORMATIVO: ENDEREÇO & HORÁRIOS DE ATENDIMENTO */}
      {isInfoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setIsInfoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-neutral-950/95 p-5 text-foreground shadow-2xl backdrop-blur-2xl max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header com Glassmorphism */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {infoModalTab === 'hours' ? (
                    <Clock3 className="h-6 w-6" />
                  ) : (
                    <MapPin className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-display text-base font-extrabold text-white">
                    {infoModalTab === 'hours' ? 'Horários de Atendimento' : 'Endereço & Localização'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    67 DOG • Fazenda Rio Grande - PR
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInfoModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Abas Alternáveis */}
            <div className="mt-4 flex rounded-xl bg-white/5 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setInfoModalTab('address')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  infoModalTab === 'address'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Endereço</span>
              </button>
              <button
                type="button"
                onClick={() => setInfoModalTab('hours')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  infoModalTab === 'hours'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                <Clock3 className="h-3.5 w-3.5" />
                <span>Horários</span>
              </button>
              <button
                type="button"
                onClick={() => setInfoModalTab('all')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  infoModalTab === 'all'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Tudo</span>
              </button>
            </div>

            {/* Conteúdo scrollável */}
            <div className="mt-4 overflow-y-auto space-y-4 pr-1">
              {/* SEÇÃO ENDEREÇO */}
              {(infoModalTab === 'address' || infoModalTab === 'all') && (
                <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/40 via-neutral-900/60 to-black/60 p-4 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-rose-400 font-display font-bold text-xs uppercase tracking-wider mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>Local para Retirada dos Lanches</span>
                  </div>

                  <p className="text-sm font-semibold text-white leading-relaxed">
                    {ESTABLISHMENT_INFO.address}
                  </p>

                  {/* Botões de Ação para Rotas */}
                  <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      href={ESTABLISHMENT_INFO.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
                    >
                      <Navigation className="h-4 w-4" />
                      <span>Abrir no Google Maps</span>
                      <ExternalLink className="h-3 w-3 opacity-70" />
                    </a>

                    <a
                      href={ESTABLISHMENT_INFO.wazeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 px-3 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
                    >
                      <span>🚗 Abrir no Waze</span>
                      <ExternalLink className="h-3 w-3 opacity-70" />
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-xs font-bold text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Endereço Copiado com Sucesso!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 text-amber-400" />
                        <span>Copiar Endereço Completo</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* SEÇÃO HORÁRIOS */}
              {(infoModalTab === 'hours' || infoModalTab === 'all') && (
                <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-950/40 via-neutral-900/60 to-black/60 p-4 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sky-400 font-display font-bold text-xs uppercase tracking-wider">
                      <Clock3 className="h-4 w-4" />
                      <span>Horários de Funcionamento</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Terça a Domingo
                    </span>
                  </div>

                  <div className="space-y-2">
                    {ESTABLISHMENT_INFO.hours.map((h, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between rounded-xl p-2.5 text-xs ${
                          h.open
                            ? 'bg-emerald-950/30 border border-emerald-500/20 text-white'
                            : 'bg-white/5 border border-white/5 text-muted-foreground'
                        }`}
                      >
                        <span className="font-bold">{h.day}</span>
                        <span className={`font-semibold ${h.open ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {h.time}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="mt-3 text-[11px] text-sky-200/80 leading-snug">
                    🌭 Dica: Você pode montar sua comanda e enviar no WhatsApp com antecedência para agilizar seu lanche!
                  </p>
                </div>
              )}

              {/* SEÇÃO SALVAR NA AGENDA */}
              <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/40 via-neutral-900/60 to-black/60 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-violet-400 font-display font-bold text-xs uppercase tracking-wider mb-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Salvar Contato no Celular</span>
                </div>
                <p className="text-xs text-violet-200/80 leading-relaxed mb-3">
                  Adicione o 67 Dog na sua agenda com 1 toque!
                </p>
                <button
                  type="button"
                  onClick={handleSaveContact}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold text-white transition-all shadow-md active:scale-95 cursor-pointer ${
                    contactSaved
                      ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 shadow-violet-950/50'
                  }`}
                >
                  {contactSaved ? (
                    <>
                      <Check className="h-4.5 w-4.5 text-white" />
                      <span>✓ Contato Salvo na Agenda!</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4.5 w-4.5 text-white" />
                      <span>Salvar Contato</span>
                    </>
                  )}
                </button>
              </div>

              {/* FORMAS DE PAGAMENTO */}
              {infoModalTab === 'all' && (
                <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-neutral-900/60 to-black/60 p-4 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-amber-400 font-display font-bold text-xs uppercase tracking-wider mb-2.5">
                    <CreditCard className="h-4 w-4" />
                    <span>Formas de Pagamento Aceitas</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                      <span className="text-lg block">⚡</span>
                      <span className="font-bold text-white block mt-0.5">Pix</span>
                      <span className="text-[10px] text-emerald-400">Sem taxa</span>
                    </div>
                    <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                      <span className="text-lg block">💳</span>
                      <span className="font-bold text-white block mt-0.5">Cartão</span>
                      <span className="text-[10px] text-muted-foreground">Débito/Crédito</span>
                    </div>
                    <div className="rounded-xl bg-white/5 p-2.5 border border-white/10">
                      <span className="text-lg block">💵</span>
                      <span className="font-bold text-white block mt-0.5">Dinheiro</span>
                      <span className="text-[10px] text-muted-foreground">No Balcão</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Ações Finais ao Fim da Leitura (Aparecem após a rolagem completa de Endereço, Horários ou Tudo) */}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2 pb-1">
                <a
                  href={`https://wa.me/${ESTABLISHMENT_INFO.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#1EBE5D] py-3.5 px-4 text-xs sm:text-sm font-black uppercase text-white shadow-lg shadow-emerald-950/50 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <OfficialWhatsAppIcon className="h-5 w-5 text-white shrink-0" />
                  <span>Chamar no WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setIsInfoModalOpen(false);
                    openMenu('all');
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/15 py-2.5 px-4 text-xs font-bold text-amber-300 hover:bg-amber-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <Utensils className="h-4 w-4 shrink-0" />
                  <span>Ver Cardápio Completo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE SESSÃO PARA SALVAR CONTATO DIRETAMENTE NO CELULAR (ANDROID / IPHONE) */}
      {isContactModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setIsContactModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-amber-500/30 bg-neutral-950/95 p-5 text-foreground shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-flame text-white shadow-md">
                  <UserPlus className="h-6 w-6 stroke-[2.4]" />
                </div>
                <div>
                  <h3 className="font-display text-base font-extrabold text-white">
                    Salvar 67 Dog na Agenda
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Escolha a melhor forma para o seu celular:
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Número e Botão de Copiar */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Telefone Oficial
                </span>
                <span className="text-base font-black text-white block mt-0.5">
                  {ESTABLISHMENT_INFO.phoneDisplay}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(ESTABLISHMENT_INFO.phoneDisplay);
                  setCopiedPhone(true);
                  setTimeout(() => setCopiedPhone(false), 2500);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
              >
                {copiedPhone ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-amber-400" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            {/* Opções de Ação Direta */}
            <div className="mt-3.5 space-y-2.5">
              {/* Opção 1: Abrir no Discador do Celular (Abre diretamente o app Telefone com '+ Criar Contato' - Sem baixar arquivo!) */}
              <a
                href={`tel:${ESTABLISHMENT_INFO.phone}`}
                className="group flex items-center gap-3.5 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/70 via-black/60 to-emerald-950/40 p-3.5 hover:border-emerald-400 hover:bg-emerald-950/90 active:scale-95 transition-all cursor-pointer"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md group-hover:scale-105 transition-transform">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <span className="font-display text-sm font-black text-white group-hover:text-emerald-300 block">
                    Adicionar pelo Discador do Celular
                  </span>
                  <span className="text-[11px] text-emerald-200/80 block leading-tight mt-0.5">
                    Abre o app Telefone no Android ou iPhone para tocar em &quot;+ Criar novo contato&quot;
                  </span>
                </div>
              </a>

              {/* Opção 2: Baixar Cartão Completo (.vcf) */}
              <button
                type="button"
                onClick={handleDownloadVCard}
                className="w-full group flex items-center gap-3.5 rounded-2xl border border-violet-500/40 bg-gradient-to-r from-violet-950/70 via-black/60 to-violet-950/40 p-3.5 hover:border-violet-400 hover:bg-violet-900/90 active:scale-95 transition-all cursor-pointer"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md group-hover:scale-105 transition-transform">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-black text-white group-hover:text-violet-300">
                      {contactSaved ? '✓ Arquivo Gerado!' : 'Baixar Cartão de Contato (.vcf)'}
                    </span>
                  </div>
                  <span className="text-[11px] text-violet-200/80 block leading-tight mt-0.5">
                    Importa automaticamente na sua agenda nome, endereço e link do cardápio
                  </span>
                </div>
              </button>

              {/* Opção 3: Falar no WhatsApp */}
              <a
                href={`https://wa.me/${ESTABLISHMENT_INFO.phone}`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3.5 rounded-2xl border border-[#25D366]/40 bg-gradient-to-r from-emerald-950/50 via-black/60 to-[#25D366]/20 p-3.5 hover:border-[#25D366] hover:bg-emerald-950/80 active:scale-95 transition-all cursor-pointer"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-[0_4px_12px_rgba(37,211,102,0.35)] group-hover:scale-105 transition-transform">
                  <OfficialWhatsAppIcon className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <span className="font-display text-sm font-black text-white group-hover:text-[#25D366] block">
                    Salvar e Chamar no WhatsApp
                  </span>
                  <span className="text-[11px] text-emerald-200/80 block leading-tight mt-0.5">
                    Inicia conversa no WhatsApp para salvar o contato na hora
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
