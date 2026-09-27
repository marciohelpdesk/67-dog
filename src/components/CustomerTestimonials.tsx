import React, { useState, useEffect, useRef } from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatarText: string;
  avatarBg: string;
  rating: number;
  date: string;
  text: string;
  verifiedSource: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Mariana Silveira',
    role: 'Cliente Verificada',
    avatarText: 'MS',
    avatarBg: 'from-amber-500 to-orange-600',
    rating: 5,
    date: 'há 3 dias',
    text: 'O Dogão Especial 22cm é surreal! Pão extremamente macio, super recheado e o queijo derretendo de verdade. Sem dúvidas o melhor lanche da Fazenda Rio Grande!',
    verifiedSource: 'Google Reviews',
  },
  {
    id: 2,
    name: 'Lucas Rodrigues',
    role: 'Cliente Verificado',
    avatarText: 'LR',
    avatarBg: 'from-red-500 to-amber-600',
    rating: 5,
    date: 'há 1 semana',
    text: 'Pastel gigante e super crocante! Massa sequinha que não fica encharcada de óleo e muito Catupiry original. O pedido chegou quentinho e rápido no delivery.',
    verifiedSource: 'Avaliação iFood',
  },
  {
    id: 3,
    name: 'Camila Fernandes',
    role: 'Cliente Fiel',
    avatarText: 'CF',
    avatarBg: 'from-amber-400 to-yellow-600',
    rating: 5,
    date: 'há 2 semanas',
    text: 'Atendimento nota 10 pelo WhatsApp! O molho especial da casa com cheddar é viciante. Já virou nossa tradição oficial de sexta-feira com a família toda.',
    verifiedSource: 'Pedido no Balcão',
  },
];

export const CustomerTestimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = TESTIMONIALS.length;

  const goToNext = () => {
    if (isAnimating) return;
    setDirection('right');
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    setDirection('left');
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const goToIndex = (idx: number) => {
    if (idx === currentIndex || isAnimating) return;
    setDirection(idx > currentIndex ? 'right' : 'left');
    setIsAnimating(true);
    setCurrentIndex(idx);
  };

  // Reset animation flag after transition completes
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 320);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isAnimating]);

  // Autoplay with pause on hover or focus
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      goToNext();
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentIndex, isAnimating]);

  const current = TESTIMONIALS[currentIndex];

  return (
    <section 
      className="relative z-10 w-full"
      aria-label="Depoimentos de Clientes"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Header with Title and Trust Rating */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
          <i className="fa-solid fa-star text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"></i>
          <span className="uppercase tracking-wider font-black text-[11px] sm:text-xs text-white">
            Depoimentos de Clientes
          </span>
        </div>

        {/* Aggregate score */}
        <div className="flex items-center gap-1 text-[11px] text-neutral-300 font-semibold bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
          <span className="text-amber-400 font-bold">5.0</span>
          <div className="flex text-amber-400 text-[9px]">
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
          </div>
          <span className="text-[10px] text-neutral-400">(+350)</span>
        </div>
      </div>

      {/* Glassmorphic Container Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-black/60 backdrop-blur-xl border border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)_inset] p-4 text-left transition-all">
        
        {/* Subtle decorative amber glow on top border */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none"></div>

        {/* Ambient watermark quotation icon */}
        <i className="fa-solid fa-quote-right absolute right-3 bottom-3 text-4xl text-amber-500/10 pointer-events-none"></i>

        {/* Animated Horizontal Fade Slide Container */}
        <div className="relative min-h-[110px] sm:min-h-[105px] flex flex-col justify-between overflow-hidden">
          <div
            key={current.id}
            className={`transition-all duration-300 ease-out transform ${
              direction === 'right' 
                ? 'animate-slide-fade-right' 
                : 'animate-slide-fade-left'
            }`}
          >
            {/* Top row: Avatar, Name, Verified Badge & Stars */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                {/* Stylized Initials Avatar */}
                <div 
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${current.avatarBg} flex items-center justify-center text-xs font-black text-white shadow-md shadow-black/40 border border-white/20 shrink-0`}
                >
                  {current.avatarText}
                </div>
                
                <div className="leading-tight">
                  <h4 className="text-xs font-bold text-white tracking-wide">
                    {current.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                    <span className="text-emerald-400 font-medium flex items-center gap-0.5">
                      <i className="fa-solid fa-circle-check text-[9px]"></i>
                      {current.verifiedSource}
                    </span>
                    <span className="text-neutral-600">·</span>
                    <span>{current.date}</span>
                  </div>
                </div>
              </div>

              {/* 5 Stars Rating */}
              <div className="flex gap-0.5 text-amber-400 text-[11px] shrink-0">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <i key={i} className="fa-solid fa-star drop-shadow-[0_1px_3px_rgba(245,158,11,0.5)]"></i>
                ))}
              </div>
            </div>

            {/* Testimonial Quote Text */}
            <p className="text-[11.5px] sm:text-xs text-neutral-200 leading-relaxed font-normal italic pr-2">
              "{current.text}"
            </p>
          </div>
        </div>

        {/* Bottom Navigation & Indicator Controls */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {TESTIMONIALS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => goToIndex(idx)}
                aria-label={`Ver depoimento ${idx + 1} de ${t.name}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-5 h-1.5 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                    : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Previous / Next Arrow Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={goToPrev}
              aria-label="Depoimento anterior"
              className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 active:scale-90 text-neutral-200 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 text-[10px]"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              onClick={goToNext}
              aria-label="Próximo depoimento"
              className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 active:scale-90 text-neutral-200 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 text-[10px]"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
