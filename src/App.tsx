/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ASSETS } from './assets/images';
import { ESTABLISHMENT_INFO } from './data/menuData';
import { HoursModal } from './components/HoursModal';
import { LocationModal } from './components/LocationModal';
import { MenuModal } from './components/MenuModal';
import { DeliveryModal } from './components/DeliveryModal';
import { SharePixModal } from './components/SharePixModal';
import { LazyImage } from './components/LazyImage';
import { CustomerTestimonials } from './components/CustomerTestimonials';
import { DestaqueCardSkeleton, DestaqueImageSkeleton } from './components/DestaqueSkeleton';

export default function App() {
  const [isHoursOpen, setIsHoursOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [isPixOpen, setIsPixOpen] = useState(false);
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const [isHotdogLoaded, setIsHotdogLoaded] = useState(false);
  const [isPastelLoaded, setIsPastelLoaded] = useState(false);
  const [initialMenuCategory, setInitialMenuCategory] = useState<'all' | 'hotdogs' | 'pasteis' | 'combos' | 'bebidas'>('all');

  // Pre-load destaques images to smoothly transition from skeleton to card without layout shift
  useEffect(() => {
    let isMounted = true;

    const img1 = new Image();
    img1.src = ASSETS.hotdog;
    if (img1.complete && img1.naturalWidth > 0) {
      setIsHotdogLoaded(true);
    } else {
      img1.onload = () => { if (isMounted) setIsHotdogLoaded(true); };
      img1.onerror = () => { if (isMounted) setIsHotdogLoaded(true); };
    }

    const img2 = new Image();
    img2.src = ASSETS.pastel;
    if (img2.complete && img2.naturalWidth > 0) {
      setIsPastelLoaded(true);
    } else {
      img2.onload = () => { if (isMounted) setIsPastelLoaded(true); };
      img2.onerror = () => { if (isMounted) setIsPastelLoaded(true); };
    }

    return () => {
      isMounted = false;
    };
  }, []);
  
  // Thin subtle progress bar tracking scroll position at the very top of the card
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const totalHeight = doc.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const currentScroll = window.scrollY || doc.scrollTop || 0;
      const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const openCategory = (cat: 'all' | 'hotdogs' | 'pasteis' | 'combos' | 'bebidas') => {
    setInitialMenuCategory(cat);
    setIsMenuOpen(true);
  };

  const handleQuickOrder = (itemName: string, price: string) => {
    const text = `Ol%C3%A1%2C%2067%20Dog!%20Vim%20pelo%20Bio%20Link%20e%20gostaria%20de%20pedir%20o%20*${encodeURIComponent(itemName)}*%20(${encodeURIComponent(price)})!`;
    window.open(`https://wa.me/${ESTABLISHMENT_INFO.phone}?text=${text}`, '_blank');
  };

  // Small, elegant long-press tooltips for traditional action buttons
  const [activeTooltip, setActiveTooltip] = useState<{ id: string; label: string; icon: string; color: string } | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipDismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressTriggeredRef = useRef(false);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
      if (tooltipDismissTimerRef.current) clearTimeout(tooltipDismissTimerRef.current);
    };
  }, []);

  const handleActionPressStart = (id: string, label: string, icon: string, color: string) => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    isLongPressTriggeredRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressTriggeredRef.current = true;
      setActiveTooltip({ id, label, icon, color });
      try {
        if ('vibrate' in navigator) navigator.vibrate(35);
      } catch {}
      if (tooltipDismissTimerRef.current) clearTimeout(tooltipDismissTimerRef.current);
      tooltipDismissTimerRef.current = setTimeout(() => {
        setActiveTooltip(null);
      }, 2200);
    }, 400);
  };

  const handleActionPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleActionClick = (e: React.MouseEvent, action?: () => void) => {
    if (isLongPressTriggeredRef.current) {
      e.preventDefault();
      e.stopPropagation();
      isLongPressTriggeredRef.current = false;
      return;
    }
    if (action) {
      action();
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center py-3 sm:py-6 px-3 sm:px-4 overflow-x-hidden font-['Poppins',sans-serif]">
      
      {/* 1. FIXED BACKGROUND OVERLAY WITH PROGRESSIVE LAZY BLUR-UP FOR FAST 3G/4G RENDERING */}
      <div className="fixed inset-0 z-0 bg-[#120602] pointer-events-none overflow-hidden">
        {/* Lazy loaded background image with smooth blur transition */}
        <img 
          src={ASSETS.background}
          alt="Ambiente 67 Dog"
          loading="lazy"
          decoding="async"
          onLoad={() => setIsBgLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out ${
            isBgLoaded ? 'opacity-40 blur-0 scale-100' : 'opacity-0 blur-xl scale-105'
          }`}
          referrerPolicy="no-referrer"
        />
        {/* Warm caramel and dark amber gradient inspired by the reference image */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1f0d04]/90 via-[#180902]/85 to-[#0e0501]/95 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/25 via-transparent to-black/80"></div>
      </div>

      {/* 2. MAIN CARD CONTAINER (STRUCTURED LIKE THE DELICIOUS REFERENCE MOBILE MOCKUP) */}
      <main className="relative z-10 w-full max-w-[430px] rounded-[36px] overflow-hidden text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border border-amber-500/25 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-gradient-to-b from-[#180a03] via-[#120501] to-[#0a0301]">
        
        {/* SUBTLE AMBER-500 SCROLL PROGRESS BAR AT THE VERY TOP OF THE CARD (TRANSPARENT TRACK, ZERO BLACK STRIP) */}
        <div 
          className="absolute top-0 left-0 right-0 z-50 w-full h-[2.5px] bg-transparent pointer-events-none overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso de rolagem"
        >
          <div 
            className="h-full bg-amber-500 shadow-[0_0_8px_#f59e0b] transition-[width] duration-75 ease-out rounded-r-full"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* UPPER HERO SECTION (CONTINUOUS GASTRO PALETTE WITH HERO HOT DOG & CHALK TYPOGRAPHY) */}
        <div className="relative pt-10 sm:pt-12 px-5 pb-8 sm:pb-9 text-center flex flex-col items-center justify-center min-h-[355px] sm:min-h-[390px]">
          
          {/* HOT DOG IMAGE BEHIND WITH PROGRESSIVE BLUR-UP & SUCCULENT TONES */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {/* The feather-masked image */}
            <div className="absolute inset-0 hero-feathered-image">
              <img 
                src={ASSETS.heroDog} 
                alt="Cachorro Quente Artesanal 67" 
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onLoad={() => setIsHeroLoaded(true)}
                className={`w-full h-full object-cover object-[center_28%] contrast-[1.10] brightness-[1.05] saturate-[1.15] transition-opacity duration-500 ease-out ${
                  isHeroLoaded ? 'opacity-100 blur-0' : 'opacity-20 blur-md'
                }`}
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Subtle warm golden amber ambient spotlight */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.18)_0%,_transparent_75%)] pointer-events-none"></div>
            
            {/* Progressive feathered blur layer ONLY at bottom for smooth dark smoke flow */}
            <div className="progressive-blur-bottom"></div>
          </div>

          {/* HERO BRAND LOGO WITH ANIMATED BOUNCE & GLOW EFFECTS (THE ONLY CONTINUOUS BRAND ANIMATION) */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center">
            
            {/* Animated Logo in place of letters with the same bouncing & glowing effects */}
            <div className="flex items-center justify-center select-none py-0.5">
              <img 
                src={ASSETS.heroTypographyLogo} 
                alt="67 Dog Logotipo Oficial" 
                className="w-32 sm:w-36 max-w-[135px] sm:max-w-[150px] h-auto object-contain animated-logo-hero cursor-pointer"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = ASSETS.heroTypographyLogoRemote;
                }}
              />
            </div>

            <p className="mt-2.5 text-[10px] sm:text-[11px] font-black text-amber-100 tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] bg-black/45 backdrop-blur-xs px-3 py-0.5 rounded-full border border-white/10 shadow-md">
              Six Seven Hot Dog &amp; Pastéis Crocantes
            </p>
          </div>

        </div>

        {/* TRADITIONAL CUSTOMER SERVICE ACTION BUTTONS ROW (100% SEAMLESS DARK SMOKE FLOW, NO DIVIDER LINE) */}
        <div className="relative z-20 px-3 sm:px-4 pt-6 sm:pt-7 pb-3 text-center">
          <div className="relative z-10 grid grid-cols-6 gap-1.5 sm:gap-2 max-w-sm mx-auto">
            
            {/* WhatsApp */}
            <div className="relative flex flex-col items-center">
              {activeTooltip?.id === 'whatsapp' && (
                <div 
                  className="action-tooltip-pop absolute -top-10 left-0 sm:left-1/2 sm:-translate-x-1/2 z-40 bg-neutral-900/95 border border-amber-500/40 text-neutral-100 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xl shadow-black/90 flex items-center gap-1.5 whitespace-nowrap pointer-events-none select-none backdrop-blur-md"
                  role="tooltip"
                >
                  <i className="fa-brands fa-whatsapp text-xs text-[#25D366]"></i>
                  <span>Pedir no WhatsApp</span>
                  <span className="absolute -bottom-1 left-4 sm:left-1/2 sm:-translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900 border-r border-b border-amber-500/40" />
                </div>
              )}
              <a
                href={`https://wa.me/${ESTABLISHMENT_INFO.phone}?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20um%20pedido%20no%2067%20Dog.`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pedir no WhatsApp"
                title="Pedir no WhatsApp (Toque longo para ajuda)"
                className="group flex flex-col items-center gap-1.5 text-center transition-transform"
                onTouchStart={() => handleActionPressStart('whatsapp', 'Pedir no WhatsApp', 'fa-brands fa-whatsapp', 'text-[#25D366]')}
                onTouchEnd={handleActionPressEnd}
                onTouchMove={handleActionPressEnd}
                onTouchCancel={handleActionPressEnd}
                onMouseDown={() => handleActionPressStart('whatsapp', 'Pedir no WhatsApp', 'fa-brands fa-whatsapp', 'text-[#25D366]')}
                onMouseUp={handleActionPressEnd}
                onMouseLeave={handleActionPressEnd}
                onContextMenu={(e) => {
                  if (isLongPressTriggeredRef.current) e.preventDefault();
                }}
                onClick={(e) => handleActionClick(e)}
              >
                <div className={`traditional-action-btn btn-trad-whatsapp ${activeTooltip?.id === 'whatsapp' ? 'scale-110 ring-2 ring-amber-400/80 shadow-lg shadow-green-500/30' : ''}`}>
                  <i className="fa-brands fa-whatsapp text-xl text-white"></i>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-neutral-300 group-hover:text-white transition-colors leading-tight">
                  WhatsApp
                </span>
              </a>
            </div>

            {/* Como Chegar / Localização */}
            <div className="relative flex flex-col items-center">
              {activeTooltip?.id === 'location' && (
                <div 
                  className="action-tooltip-pop absolute -top-10 left-1/2 -translate-x-1/2 z-40 bg-neutral-900/95 border border-amber-500/40 text-neutral-100 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xl shadow-black/90 flex items-center gap-1.5 whitespace-nowrap pointer-events-none select-none backdrop-blur-md"
                  role="tooltip"
                >
                  <i className="fa-solid fa-location-dot text-xs text-[#EA4335]"></i>
                  <span>Ver endereço &amp; rota</span>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900 border-r border-b border-amber-500/40" />
                </div>
              )}
              <button
                onClick={(e) => handleActionClick(e, () => setIsLocationOpen(true))}
                aria-label="Como Chegar"
                title="Localização &amp; Como Chegar (Toque longo para ajuda)"
                className="group flex flex-col items-center gap-1.5 text-center transition-transform cursor-pointer"
                onTouchStart={() => handleActionPressStart('location', 'Ver endereço & rota', 'fa-solid fa-location-dot', 'text-[#EA4335]')}
                onTouchEnd={handleActionPressEnd}
                onTouchMove={handleActionPressEnd}
                onTouchCancel={handleActionPressEnd}
                onMouseDown={() => handleActionPressStart('location', 'Ver endereço & rota', 'fa-solid fa-location-dot', 'text-[#EA4335]')}
                onMouseUp={handleActionPressEnd}
                onMouseLeave={handleActionPressEnd}
                onContextMenu={(e) => {
                  if (isLongPressTriggeredRef.current) e.preventDefault();
                }}
              >
                <div className={`traditional-action-btn btn-trad-location ${activeTooltip?.id === 'location' ? 'scale-110 ring-2 ring-amber-400/80 shadow-lg shadow-red-500/30' : ''}`}>
                  <i className="fa-solid fa-location-dot text-lg text-white"></i>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-neutral-300 group-hover:text-white transition-colors leading-tight">
                  Local
                </span>
              </button>
            </div>

            {/* Cardápio Completo */}
            <div className="relative flex flex-col items-center">
              {activeTooltip?.id === 'menu' && (
                <div 
                  className="action-tooltip-pop absolute -top-10 left-1/2 -translate-x-1/2 z-40 bg-neutral-900/95 border border-amber-500/40 text-neutral-100 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xl shadow-black/90 flex items-center gap-1.5 whitespace-nowrap pointer-events-none select-none backdrop-blur-md"
                  role="tooltip"
                >
                  <i className="fa-solid fa-utensils text-xs text-[#F59E0B]"></i>
                  <span>Cardápio &amp; preços</span>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900 border-r border-b border-amber-500/40" />
                </div>
              )}
              <button
                onClick={(e) => handleActionClick(e, () => setIsMenuOpen(true))}
                aria-label="Cardápio Completo"
                title="Ver Cardápio Completo (Toque longo para ajuda)"
                className="group flex flex-col items-center gap-1.5 text-center transition-transform cursor-pointer"
                onTouchStart={() => handleActionPressStart('menu', 'Cardápio & preços', 'fa-solid fa-utensils', 'text-[#F59E0B]')}
                onTouchEnd={handleActionPressEnd}
                onTouchMove={handleActionPressEnd}
                onTouchCancel={handleActionPressEnd}
                onMouseDown={() => handleActionPressStart('menu', 'Cardápio & preços', 'fa-solid fa-utensils', 'text-[#F59E0B]')}
                onMouseUp={handleActionPressEnd}
                onMouseLeave={handleActionPressEnd}
                onContextMenu={(e) => {
                  if (isLongPressTriggeredRef.current) e.preventDefault();
                }}
              >
                <div className={`traditional-action-btn btn-trad-menu ${activeTooltip?.id === 'menu' ? 'scale-110 ring-2 ring-amber-400/80 shadow-lg shadow-amber-500/30' : ''}`}>
                  <i className="fa-solid fa-utensils text-lg text-white"></i>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-neutral-300 group-hover:text-white transition-colors leading-tight">
                  Cardápio
                </span>
              </button>
            </div>

            {/* Horários */}
            <div className="relative flex flex-col items-center">
              {activeTooltip?.id === 'hours' && (
                <div 
                  className="action-tooltip-pop absolute -top-10 left-1/2 -translate-x-1/2 z-40 bg-neutral-900/95 border border-amber-500/40 text-neutral-100 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xl shadow-black/90 flex items-center gap-1.5 whitespace-nowrap pointer-events-none select-none backdrop-blur-md"
                  role="tooltip"
                >
                  <i className="fa-solid fa-clock text-xs text-[#0284C7]"></i>
                  <span>Horários de hoje</span>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900 border-r border-b border-amber-500/40" />
                </div>
              )}
              <button
                onClick={(e) => handleActionClick(e, () => setIsHoursOpen(true))}
                aria-label="Horários de Atendimento"
                title="Horários de Atendimento (Toque longo para ajuda)"
                className="group flex flex-col items-center gap-1.5 text-center transition-transform cursor-pointer"
                onTouchStart={() => handleActionPressStart('hours', 'Horários de hoje', 'fa-solid fa-clock', 'text-[#0284C7]')}
                onTouchEnd={handleActionPressEnd}
                onTouchMove={handleActionPressEnd}
                onTouchCancel={handleActionPressEnd}
                onMouseDown={() => handleActionPressStart('hours', 'Horários de hoje', 'fa-solid fa-clock', 'text-[#0284C7]')}
                onMouseUp={handleActionPressEnd}
                onMouseLeave={handleActionPressEnd}
                onContextMenu={(e) => {
                  if (isLongPressTriggeredRef.current) e.preventDefault();
                }}
              >
                <div className={`traditional-action-btn btn-trad-hours ${activeTooltip?.id === 'hours' ? 'scale-110 ring-2 ring-amber-400/80 shadow-lg shadow-sky-500/30' : ''}`}>
                  <i className="fa-solid fa-clock text-lg text-white"></i>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-neutral-300 group-hover:text-white transition-colors leading-tight">
                  Horários
                </span>
              </button>
            </div>

            {/* Instagram */}
            <div className="relative flex flex-col items-center">
              {activeTooltip?.id === 'instagram' && (
                <div 
                  className="action-tooltip-pop absolute -top-10 left-1/2 -translate-x-1/2 z-40 bg-neutral-900/95 border border-amber-500/40 text-neutral-100 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xl shadow-black/90 flex items-center gap-1.5 whitespace-nowrap pointer-events-none select-none backdrop-blur-md"
                  role="tooltip"
                >
                  <i className="fa-brands fa-instagram text-xs text-[#E1306C]"></i>
                  <span>Instagram oficial</span>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900 border-r border-b border-amber-500/40" />
                </div>
              )}
              <a
                href={ESTABLISHMENT_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Nosso Instagram (Toque longo para ajuda)"
                className="group flex flex-col items-center gap-1.5 text-center transition-transform"
                onTouchStart={() => handleActionPressStart('instagram', 'Instagram oficial', 'fa-brands fa-instagram', 'text-[#E1306C]')}
                onTouchEnd={handleActionPressEnd}
                onTouchMove={handleActionPressEnd}
                onTouchCancel={handleActionPressEnd}
                onMouseDown={() => handleActionPressStart('instagram', 'Instagram oficial', 'fa-brands fa-instagram', 'text-[#E1306C]')}
                onMouseUp={handleActionPressEnd}
                onMouseLeave={handleActionPressEnd}
                onContextMenu={(e) => {
                  if (isLongPressTriggeredRef.current) e.preventDefault();
                }}
                onClick={(e) => handleActionClick(e)}
              >
                <div className={`traditional-action-btn btn-trad-instagram ${activeTooltip?.id === 'instagram' ? 'scale-110 ring-2 ring-amber-400/80 shadow-lg shadow-pink-500/30' : ''}`}>
                  <svg 
                    className="w-5 h-5 text-white" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      clipRule="evenodd" 
                      d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm4.5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6zm5.5-2.7a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z" 
                    />
                  </svg>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-neutral-300 group-hover:text-white transition-colors leading-tight">
                  Instagram
                </span>
              </a>
            </div>

            {/* Chave Pix */}
            <div className="relative flex flex-col items-center">
              {activeTooltip?.id === 'pix' && (
                <div 
                  className="action-tooltip-pop absolute -top-10 right-0 sm:left-1/2 sm:translate-x-1/2 z-40 bg-neutral-900/95 border border-amber-500/40 text-neutral-100 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xl shadow-black/90 flex items-center gap-1.5 whitespace-nowrap pointer-events-none select-none backdrop-blur-md"
                  role="tooltip"
                >
                  <i className="fa-brands fa-pix text-xs text-[#32BCAD]"></i>
                  <span>Copiar chave Pix</span>
                  <span className="absolute -bottom-1 right-4 sm:left-1/2 sm:-translate-x-1/2 w-2 h-2 rotate-45 bg-neutral-900 border-r border-b border-amber-500/40" />
                </div>
              )}
              <button
                onClick={(e) => handleActionClick(e, () => setIsPixOpen(true))}
                aria-label="Chave Pix"
                title="Chave Pix &amp; Pagamentos (Toque longo para ajuda)"
                className="group flex flex-col items-center gap-1.5 text-center transition-transform cursor-pointer"
                onTouchStart={() => handleActionPressStart('pix', 'Copiar chave Pix', 'fa-brands fa-pix', 'text-[#32BCAD]')}
                onTouchEnd={handleActionPressEnd}
                onTouchMove={handleActionPressEnd}
                onTouchCancel={handleActionPressEnd}
                onMouseDown={() => handleActionPressStart('pix', 'Copiar chave Pix', 'fa-brands fa-pix', 'text-[#32BCAD]')}
                onMouseUp={handleActionPressEnd}
                onMouseLeave={handleActionPressEnd}
                onContextMenu={(e) => {
                  if (isLongPressTriggeredRef.current) e.preventDefault();
                }}
              >
                <div className={`traditional-action-btn btn-trad-pix ${activeTooltip?.id === 'pix' ? 'scale-110 ring-2 ring-amber-400/80 shadow-lg shadow-teal-500/30' : ''}`}>
                  <i className="fa-brands fa-pix text-lg text-white"></i>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-neutral-300 group-hover:text-white transition-colors leading-tight">
                  Pix
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* LOWER SECTION: FULL MENU & OFFERS PRESERVED */}
        <div className="p-5 pt-3 space-y-4 bg-gradient-to-b from-[#100401] via-[#0d0301] to-[#080201]">
          
          {/* Quick Category Quick-Pills */}
          <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => openCategory('hotdogs')}
              className="flex-1 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-amber-500 hover:text-black border border-white/15 text-[11px] font-bold whitespace-nowrap transition-colors flex items-center justify-center gap-1"
            >
              🌭 Hot Dogs
            </button>
            <button
              onClick={() => openCategory('pasteis')}
              className="flex-1 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-amber-500 hover:text-black border border-white/15 text-[11px] font-bold whitespace-nowrap transition-colors flex items-center justify-center gap-1"
            >
              🥟 Pastéis
            </button>
            <button
              onClick={() => openCategory('combos')}
              className="flex-1 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-amber-500 hover:text-black border border-white/15 text-[11px] font-bold whitespace-nowrap transition-colors flex items-center justify-center gap-1"
            >
              🍟 Combos
            </button>
            <button
              onClick={() => openCategory('bebidas')}
              className="flex-1 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-amber-500 hover:text-black border border-white/15 text-[11px] font-bold whitespace-nowrap transition-colors flex items-center justify-center gap-1"
            >
              🥤 Bebidas
            </button>
          </div>

          {/* DESTAQUES DO DIA (Mouthwatering Cards com foto, preço e pedir) */}
          <section className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <i className="fa-solid fa-fire-flame-curved text-red-500"></i>
                <span className="uppercase tracking-wide">Destaques Mais Pedidos</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-[11px] text-amber-300 hover:text-white flex items-center gap-1 transition-colors font-medium"
              >
                <span>Ver cardápio</span>
                <i className="fa-solid fa-chevron-right text-[9px]"></i>
              </button>
            </div>

            {/* 2 Mini Cards Lado a Lado com Foto e Ação de Pedido */}
            <div className="grid grid-cols-2 gap-2.5 min-h-[212px]">
              
              {/* Card 1: Hot Dog Monster Cheddar Bacon */}
              {!isHotdogLoaded ? (
                <DestaqueCardSkeleton badgeText="🔥 Top 1" icon="fa-solid fa-hotdog" />
              ) : (
                <article className="glass-card rounded-xl overflow-hidden flex flex-col justify-between border border-white/10 hover:border-amber-500/50 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 transition-all duration-200 ease-out group cursor-pointer h-full">
                  <div className="relative h-24 w-full overflow-hidden bg-neutral-900">
                    <LazyImage 
                      src={ASSETS.hotdog} 
                      alt="Monster Cheddar Bacon" 
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300 ease-out"
                      customSkeleton={<DestaqueImageSkeleton badgeText="🔥 Top 1" icon="fa-solid fa-hotdog" />}
                      onLoad={() => setIsHotdogLoaded(true)}
                    />
                    <span className="absolute top-1.5 left-1.5 z-10 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                      🔥 Top 1
                    </span>
                  </div>
                  <div className="p-2.5 flex flex-col flex-1 justify-between gap-1.5">
                    <div>
                      <h3 className="font-bold text-xs text-neutral-100 leading-snug line-clamp-1 group-hover:text-amber-300 transition-colors">
                        Monster Cheddar
                      </h3>
                      <p className="text-[10px] text-neutral-300 line-clamp-1">
                        Duplo artesanal + cheddar
                      </p>
                      <p className="text-xs font-black text-amber-400 mt-0.5">
                        R$ 26,90
                      </p>
                    </div>
                    <button
                      onClick={() => handleQuickOrder('Monster Cheddar Bacon', 'R$ 26,90')}
                      className="w-full py-1.5 px-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-md active:scale-95 cursor-pointer"
                    >
                      <i className="fa-solid fa-bag-shopping text-[10px]"></i>
                      <span>Pedir</span>
                    </button>
                  </div>
                </article>
              )}

              {/* Card 2: Pastel Especial Frango Catupiry */}
              {!isPastelLoaded ? (
                <DestaqueCardSkeleton badgeText="⭐ Crocante" icon="fa-solid fa-utensils" />
              ) : (
                <article className="glass-card rounded-xl overflow-hidden flex flex-col justify-between border border-white/10 hover:border-amber-500/50 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 transition-all duration-200 ease-out group cursor-pointer h-full">
                  <div className="relative h-24 w-full overflow-hidden bg-neutral-900">
                    <LazyImage 
                      src={ASSETS.pastel} 
                      alt="Pastel Especial Frango Catupiry" 
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300 ease-out"
                      customSkeleton={<DestaqueImageSkeleton badgeText="⭐ Crocante" icon="fa-solid fa-utensils" />}
                      onLoad={() => setIsPastelLoaded(true)}
                    />
                    <span className="absolute top-1.5 left-1.5 z-10 bg-amber-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                      ⭐ Crocante
                    </span>
                  </div>
                  <div className="p-2.5 flex flex-col flex-1 justify-between gap-1.5">
                    <div>
                      <h3 className="font-bold text-xs text-neutral-100 leading-snug line-clamp-1 group-hover:text-amber-300 transition-colors">
                        Pastel Especial
                      </h3>
                      <p className="text-[10px] text-neutral-300 line-clamp-1">
                        Frango &amp; Catupiry 25cm
                      </p>
                      <p className="text-xs font-black text-amber-400 mt-0.5">
                        R$ 21,90
                      </p>
                    </div>
                    <button
                      onClick={() => handleQuickOrder('Pastel Especial da Casa (Frango & Catupiry)', 'R$ 21,90')}
                      className="w-full py-1.5 px-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-md active:scale-95 cursor-pointer"
                    >
                      <i className="fa-solid fa-bag-shopping text-[10px]"></i>
                      <span>Pedir</span>
                    </button>
                  </div>
                </article>
              )}

            </div>
          </section>

          {/* LARGE DELIVERY / IFOOD BUTTON */}
          <button
            onClick={() => setIsDeliveryOpen(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 border border-white/20 active:scale-98 transition-all"
          >
            <i className="fa-solid fa-motorcycle text-base"></i>
            <span>FAZER PEDIDO AGORA (IFOOD / DELIVERY)</span>
          </button>

          {/* CARDÁPIO COMPLETO BUTTON */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-100 font-bold text-xs flex items-center justify-center gap-2 border border-white/15 active:scale-98 transition-all cursor-pointer"
          >
            <i className="fa-solid fa-book-open text-amber-400"></i>
            <span>Abrir Cardápio Completo &amp; Comanda</span>
          </button>

          {/* DEPOIMENTOS DE CLIENTES (GLASSMORPHISM CARD WITH HORIZONTAL FADE) */}
          <CustomerTestimonials />

          {/* FOOTER */}
          <footer className="pt-2 border-t border-white/10 text-center">
            <p className="text-[11px] text-neutral-300 leading-relaxed mb-1 px-2 font-medium">
              📍 {ESTABLISHMENT_INFO.address}
            </p>
            <p className="text-[10px] text-neutral-400">
              © 2026 {ESTABLISHMENT_INFO.name}. Sabor e crocância inigualáveis.
            </p>
          </footer>

        </div>

      </main>

      {/* WORKING INTERACTIVE MODALS */}
      <HoursModal 
        isOpen={isHoursOpen} 
        onClose={() => setIsHoursOpen(false)} 
      />

      <LocationModal 
        isOpen={isLocationOpen} 
        onClose={() => setIsLocationOpen(false)} 
      />

      <MenuModal 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        initialCategory={initialMenuCategory}
      />

      <DeliveryModal 
        isOpen={isDeliveryOpen} 
        onClose={() => setIsDeliveryOpen(false)} 
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      <SharePixModal 
        isOpen={isPixOpen} 
        onClose={() => setIsPixOpen(false)} 
      />

    </div>
  );
}
