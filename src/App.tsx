/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ASSETS } from './assets/images';
import { ESTABLISHMENT_INFO } from './data/menuData';
import { HoursModal } from './components/HoursModal';
import { LocationModal } from './components/LocationModal';
import { MenuModal } from './components/MenuModal';
import { DeliveryModal } from './components/DeliveryModal';
import { SharePixModal } from './components/SharePixModal';
import { LazyImage } from './components/LazyImage';

export default function App() {
  const [isHoursOpen, setIsHoursOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [isPixOpen, setIsPixOpen] = useState(false);
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const [initialMenuCategory, setInitialMenuCategory] = useState<'all' | 'hotdogs' | 'pasteis' | 'combos' | 'bebidas'>('all');

  const openCategory = (cat: 'all' | 'hotdogs' | 'pasteis' | 'combos' | 'bebidas') => {
    setInitialMenuCategory(cat);
    setIsMenuOpen(true);
  };

  const handleQuickOrder = (itemName: string, price: string) => {
    const text = `Ol%C3%A1%2C%2067%20Dog!%20Vim%20pelo%20Bio%20Link%20e%20gostaria%20de%20pedir%20o%20*${encodeURIComponent(itemName)}*%20(${encodeURIComponent(price)})!`;
    window.open(`https://wa.me/${ESTABLISHMENT_INFO.phone}?text=${text}`, '_blank');
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
        
        {/* UPPER HERO SECTION (CONTINUOUS GASTRO PALETTE WITH HERO HOT DOG & CHALK TYPOGRAPHY) */}
        <div className="relative pt-6 px-5 pb-3 text-center flex flex-col justify-between">
          
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
                className={`w-full h-full object-cover object-center hero-bg-breathe contrast-105 brightness-100 transition-all duration-700 ease-out ${
                  isHeroLoaded ? 'opacity-95 blur-0 scale-100' : 'opacity-20 blur-md scale-105'
                }`}
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Subtle warm golden amber ambient spotlight */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.25)_0%,_transparent_75%)] pointer-events-none"></div>
            
            {/* Progressive feathered blur layers on all edges so image dissolves smoothly into surrounding shapes */}
            <div className="progressive-blur-top"></div>
            <div className="progressive-blur-bottom"></div>
            <div className="progressive-blur-sides"></div>
          </div>

          {/* HERO BRAND LOGO WITH ANIMATED BOUNCE & GLOW EFFECTS */}
          <div className="relative z-10 my-auto py-2 flex flex-col items-center">
            
            {/* Animated Logo in place of letters with the same bouncing & glowing effects */}
            <div className="flex items-center justify-center my-1 select-none">
              <img 
                src={ASSETS.heroTypographyLogo} 
                alt="67 Dog Logotipo Oficial" 
                className="w-48 sm:w-56 max-w-[230px] sm:max-w-[260px] h-auto object-contain animated-logo-hero cursor-pointer"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = ASSETS.heroTypographyLogoRemote;
                }}
              />
            </div>

            <p className="mt-2 text-xs font-black text-amber-100 tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] bg-black/35 backdrop-blur-xs px-3 py-0.5 rounded-full border border-white/10">
              Six Seven Hot Dog &amp; Pastéis Crocantes
            </p>
          </div>

          {/* PRIMARY "PEÇA AGORA" CTA BUTTON (Traditional WhatsApp Action Button) */}
          <div className="relative z-10 mt-3 mb-1 flex justify-center">
            <a
              href={`https://wa.me/${ESTABLISHMENT_INFO.phone}?text=Ol%C3%A1!%20Vim%20pelo%20Bio%20Link%20e%20gostaria%20de%20fazer%20meu%20pedido%20no%2067%20Dog!`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm tracking-wide shadow-lg shadow-black/40 border border-white/20 transition-all duration-200 active:scale-95 hover:scale-[1.02]"
            >
              <span>Peça agora</span>
              <i className="fa-brands fa-whatsapp text-xl text-white"></i>
            </a>
          </div>

        </div>

        {/* SIGNATURE FLUID MOLTEN CHEDDAR DRIP TRANSITION (NO STRAIGHT BAND, ORGANIC LIQUID SHADER) */}
        <div className="relative w-full z-20 -mt-2.5 -mb-2 overflow-visible pointer-events-none liquid-cheddar-shader">
          <svg 
            viewBox="0 0 1200 125" 
            className="w-full h-16 sm:h-20 block"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Molten Cheddar Core - Top Opacity Fade Prevents ANY Straight Edge */}
              <linearGradient id="cheddarMainFluid" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
                <stop offset="25%" stopColor="#d97706" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.98" />
                <stop offset="75%" stopColor="#fbbf24" stopOpacity="1" />
                <stop offset="100%" stopColor="#fef08a" stopOpacity="1" />
              </linearGradient>

              {/* Luminous Warm Secondary Depth Layer for 3D Volume */}
              <linearGradient id="cheddarDepthFluid" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#92400e" stopOpacity="0" />
                <stop offset="30%" stopColor="#b45309" stopOpacity="0.8" />
                <stop offset="85%" stopColor="#d97706" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="1" />
              </linearGradient>

              {/* Specular Liquid Gloss Highlight for Mouthwatering Wet Cheese Shine */}
              <linearGradient id="cheddarGlossFluid" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="15%" stopColor="rgba(255,255,255,0.95)" />
                <stop offset="35%" stopColor="rgba(254,240,138,0.7)" />
                <stop offset="58%" stopColor="rgba(255,255,255,0.95)" />
                <stop offset="80%" stopColor="rgba(254,240,138,0.6)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>

            {/* Back Layer: Secondary Soft Molten Depth Flow */}
            <path
              d="M 0,0 L 1200,0 L 1200,24 C 1140,24 1100,54 1050,54 C 990,54 970,22 920,22 C 870,22 850,88 810,88 C 775,88 760,30 710,30 C 660,30 640,68 590,68 C 540,68 520,24 460,24 C 400,24 380,100 330,100 C 285,100 270,34 210,34 C 160,34 140,74 90,74 C 50,74 30,26 0,26 Z"
              fill="url(#cheddarDepthFluid)"
            />

            {/* Main Front Layer: Organic Molten Artisan Cheddar with Deep Fluid Drips */}
            <path
              d="M 0,0 L 1200,0 L 1200,20 C 1140,20 1100,48 1050,48 C 990,48 970,18 920,18 C 870,18 850,82 810,82 C 775,82 760,26 710,26 C 660,26 640,62 590,62 C 540,62 520,20 460,20 C 400,20 380,94 330,94 C 285,94 270,30 210,30 C 160,30 140,68 90,68 C 50,68 30,22 0,22 Z"
              fill="url(#cheddarMainFluid)"
            />

            {/* Specular Liquid Rim Highlight (Gleaming Fluid Crest) */}
            <path
              d="M 10,24 C 40,24 60,70 90,70 C 140,70 160,32 210,32 C 270,32 285,96 330,96 C 380,96 400,22 460,22 C 520,22 540,64 590,64 C 640,64 660,28 710,28 C 760,28 775,84 810,84 C 850,84 870,20 920,20 C 970,20 990,50 1050,50 C 1100,50 1140,22 1190,22"
              fill="none"
              stroke="url(#cheddarGlossFluid)"
              strokeWidth="2.8"
              strokeLinecap="round"
              opacity="0.95"
            />

            {/* Suspended Molten Cheddar Droplets with Specular Highlights */}
            <g>
              {/* Droplet 1 beneath main drip at x=330 */}
              <circle cx="330" cy="108" r="5" fill="#f59e0b" />
              <circle cx="328.5" cy="106" r="1.6" fill="#ffffff" opacity="0.95" />

              {/* Droplet 2 beneath drip at x=810 */}
              <circle cx="810" cy="98" r="4.5" fill="#f59e0b" />
              <circle cx="808.5" cy="96.3" r="1.4" fill="#ffffff" opacity="0.95" />

              {/* Small droplet beneath drip at x=90 */}
              <circle cx="90" cy="82" r="3.5" fill="#f59e0b" />
              <circle cx="88.8" cy="80.8" r="1.1" fill="#ffffff" opacity="0.95" />
            </g>
          </svg>
        </div>

        {/* TRADITIONAL CUSTOMER SERVICE ACTION BUTTONS ROW */}
        <div className="relative z-20 px-3 sm:px-4 pt-3 pb-3 text-center">
          
          {/* Traditional Action Buttons Row with clear labels and authentic brand colors */}
          <div className="relative z-10 grid grid-cols-6 gap-1.5 sm:gap-2 max-w-sm mx-auto my-1">
            
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${ESTABLISHMENT_INFO.phone}?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20um%20pedido%20no%2067%20Dog.`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pedir no WhatsApp"
              className="group flex flex-col items-center gap-1.5 text-center transition-transform"
              title="Pedir no WhatsApp"
            >
              <div className="traditional-action-btn btn-trad-whatsapp">
                <i className="fa-brands fa-whatsapp text-xl text-white"></i>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-neutral-300 group-hover:text-white transition-colors leading-tight">
                WhatsApp
              </span>
            </a>

            {/* Como Chegar / Localização */}
            <button
              onClick={() => setIsLocationOpen(true)}
              aria-label="Como Chegar"
              className="group flex flex-col items-center gap-1.5 text-center transition-transform"
              title="Localização & Como Chegar"
            >
              <div className="traditional-action-btn btn-trad-location">
                <i className="fa-solid fa-location-dot text-lg text-white"></i>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-neutral-300 group-hover:text-white transition-colors leading-tight">
                Local
              </span>
            </button>

            {/* Cardápio Completo */}
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Cardápio Completo"
              className="group flex flex-col items-center gap-1.5 text-center transition-transform"
              title="Ver Cardápio Completo"
            >
              <div className="traditional-action-btn btn-trad-menu">
                <i className="fa-solid fa-utensils text-lg text-white"></i>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-neutral-300 group-hover:text-white transition-colors leading-tight">
                Cardápio
              </span>
            </button>

            {/* Horários */}
            <button
              onClick={() => setIsHoursOpen(true)}
              aria-label="Horários de Atendimento"
              className="group flex flex-col items-center gap-1.5 text-center transition-transform"
              title="Horários de Atendimento"
            >
              <div className="traditional-action-btn btn-trad-hours">
                <i className="fa-solid fa-clock text-lg text-white"></i>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-neutral-300 group-hover:text-white transition-colors leading-tight">
                Horários
              </span>
            </button>

            {/* Instagram */}
            <a
              href={ESTABLISHMENT_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group flex flex-col items-center gap-1.5 text-center transition-transform"
              title="Nosso Instagram"
            >
              <div className="traditional-action-btn btn-trad-instagram">
                <i className="fa-brands fa-instagram text-xl text-white"></i>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-neutral-300 group-hover:text-white transition-colors leading-tight">
                Instagram
              </span>
            </a>

            {/* Chave Pix */}
            <button
              onClick={() => setIsPixOpen(true)}
              aria-label="Chave Pix"
              className="group flex flex-col items-center gap-1.5 text-center transition-transform"
              title="Chave Pix & Pagamentos"
            >
              <div className="traditional-action-btn btn-trad-pix">
                <i className="fa-brands fa-pix text-lg text-white"></i>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-neutral-300 group-hover:text-white transition-colors leading-tight">
                Pix
              </span>
            </button>

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
            <div className="grid grid-cols-2 gap-2.5">
              
              {/* Card 1: Hot Dog Monster Cheddar Bacon */}
              <article className="glass-card rounded-xl overflow-hidden flex flex-col justify-between border border-white/10 hover:border-amber-500/40 transition-all duration-200 group">
                <div className="relative h-24 w-full overflow-hidden bg-neutral-900">
                  <LazyImage 
                    src={ASSETS.hotdog} 
                    alt="Monster Cheddar Bacon" 
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-1.5 left-1.5 z-10 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                    🔥 Top 1
                  </span>
                </div>
                <div className="p-2.5 flex flex-col flex-1 justify-between gap-1.5">
                  <div>
                    <h3 className="font-bold text-xs text-neutral-100 leading-snug line-clamp-1">
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
                    className="w-full py-1.5 px-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-md active:scale-95"
                  >
                    <i className="fa-solid fa-bag-shopping text-[10px]"></i>
                    <span>Pedir</span>
                  </button>
                </div>
              </article>

              {/* Card 2: Pastel Especial Frango Catupiry */}
              <article className="glass-card rounded-xl overflow-hidden flex flex-col justify-between border border-white/10 hover:border-amber-500/40 transition-all duration-200 group">
                <div className="relative h-24 w-full overflow-hidden bg-neutral-900">
                  <LazyImage 
                    src={ASSETS.pastel} 
                    alt="Pastel Especial Frango Catupiry" 
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-1.5 left-1.5 z-10 bg-amber-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                    ⭐ Crocante
                  </span>
                </div>
                <div className="p-2.5 flex flex-col flex-1 justify-between gap-1.5">
                  <div>
                    <h3 className="font-bold text-xs text-neutral-100 leading-snug line-clamp-1">
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
                    className="w-full py-1.5 px-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-md active:scale-95"
                  >
                    <i className="fa-solid fa-bag-shopping text-[10px]"></i>
                    <span>Pedir</span>
                  </button>
                </div>
              </article>

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
            className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-100 font-bold text-xs flex items-center justify-center gap-2 border border-white/15 active:scale-98 transition-all"
          >
            <i className="fa-solid fa-book-open text-amber-400"></i>
            <span>Abrir Cardápio Completo &amp; Comanda</span>
          </button>

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
