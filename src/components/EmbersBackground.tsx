import React, { useEffect, useRef } from 'react';

type ParticleType = 'ember' | 'spark' | 'smoke' | 'pop';

interface Particle {
  type: ParticleType;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  size: number;
  speedY: number;
  speedX: number;
  sway: number;
  swaySpeed: number;
  angle: number;
  opacity: number;
  maxOpacity: number;
  color: string;
  glowColor: string;
  coreColor?: string;
  life: number;
  maxLife: number;
  decayRate: number;
  trailLength: number;
}

// Cores incandescentes de brasa e óleo quente
const EMBER_PALETTES = [
  { color: '#ff2200', glow: '#ff0000', core: '#ffaa00' }, // Rubi fogo
  { color: '#ff5500', glow: '#ff3300', core: '#ffcc00' }, // Laranja chapa
  { color: '#ff8800', glow: '#ff5500', core: '#ffea00' }, // Âmbar vivo
  { color: '#ffa600', glow: '#ff7700', core: '#ffffff' }, // Dourado incandescente
  { color: '#ffc300', glow: '#ff9900', core: '#ffffff' }, // Amarelo brasa viva
];

const SPARK_PALETTES = [
  { color: '#ffffff', glow: '#ffaa00', core: '#ffffff' }, // Faísca branca estalo
  { color: '#fff3b0', glow: '#ff6600', core: '#ffffff' }, // Ouro estalando
  { color: '#ffd166', glow: '#ff3300', core: '#ffffff' }, // Faísca óleo quente
  { color: '#ffe66d', glow: '#ff8800', core: '#ffffff' }, // Chapa fervente
];

export const EmbersBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    // Densidade ideal para cobertura rica da tela
    const maxParticles = Math.min(Math.floor(width / 7), 85);

    // Fábrica de partículas de brasa e fritura
    const createParticle = (
      type: ParticleType,
      spawnAnywhere = false,
      originX?: number,
      originY?: number,
      customVelocity?: { vx: number; vy: number }
    ): Particle => {
      const isSpawnAnywhere = spawnAnywhere && originX === undefined;
      const startX = originX !== undefined ? originX : Math.random() * width;
      const startY = originY !== undefined
        ? originY
        : isSpawnAnywhere
          ? Math.random() * height
          : height + 8 + Math.random() * 35;

      if (type === 'spark' || type === 'pop') {
        const palette = SPARK_PALETTES[Math.floor(Math.random() * SPARK_PALETTES.length)];
        const maxLife = type === 'pop' ? 25 + Math.random() * 35 : 45 + Math.random() * 65;
        const speedY = customVelocity ? customVelocity.vy : 2.5 + Math.random() * 4.2;
        const speedX = customVelocity ? customVelocity.vx : (Math.random() - 0.5) * 2.6;

        return {
          type,
          x: startX,
          y: startY,
          prevX: startX,
          prevY: startY,
          size: type === 'pop' ? 0.8 + Math.random() * 1.4 : 1.1 + Math.random() * 1.8,
          speedY,
          speedX,
          sway: 0.15 + Math.random() * 0.4,
          swaySpeed: 0.06 + Math.random() * 0.08,
          angle: Math.random() * Math.PI * 2,
          opacity: 0,
          maxOpacity: 0.85 + Math.random() * 0.15,
          color: palette.color,
          glowColor: palette.glow,
          coreColor: palette.core,
          life: isSpawnAnywhere ? Math.random() * maxLife : 0,
          maxLife,
          decayRate: 1,
          trailLength: 4 + Math.random() * 6,
        };
      }

      if (type === 'smoke') {
        const maxLife = 240 + Math.random() * 220;
        return {
          type: 'smoke',
          x: startX,
          y: startY,
          prevX: startX,
          prevY: startY,
          size: 28 + Math.random() * 48,
          speedY: 0.45 + Math.random() * 0.65,
          speedX: (Math.random() - 0.5) * 0.4,
          sway: 1.2 + Math.random() * 2.0,
          swaySpeed: 0.01 + Math.random() * 0.015,
          angle: Math.random() * Math.PI * 2,
          opacity: 0,
          maxOpacity: 0.035 + Math.random() * 0.03,
          color: '#421603',
          glowColor: '#ff4400',
          life: isSpawnAnywhere ? Math.random() * maxLife : 0,
          maxLife,
          decayRate: 1,
          trailLength: 0,
        };
      }

      // 'ember': Brasa incandescente rica com turbulência térmica
      const palette = EMBER_PALETTES[Math.floor(Math.random() * EMBER_PALETTES.length)];
      const maxLife = 180 + Math.random() * 260;
      return {
        type: 'ember',
        x: startX,
        y: startY,
        prevX: startX,
        prevY: startY,
        size: 1.8 + Math.random() * 3.2,
        speedY: 0.9 + Math.random() * 2.2,
        speedX: (Math.random() - 0.5) * 0.8,
        sway: 0.8 + Math.random() * 1.8,
        swaySpeed: 0.02 + Math.random() * 0.045,
        angle: Math.random() * Math.PI * 2,
        opacity: 0,
        maxOpacity: 0.65 + Math.random() * 0.35,
        color: palette.color,
        glowColor: palette.glow,
        coreColor: palette.core,
        life: isSpawnAnywhere ? Math.random() * maxLife : 0,
        maxLife,
        decayRate: 1,
        trailLength: 2,
      };
    };

    // População inicial distribuída uniformemente
    for (let i = 0; i < maxParticles; i++) {
      const rand = Math.random();
      const type: ParticleType = rand < 0.5 ? 'ember' : rand < 0.85 ? 'spark' : 'smoke';
      particles.push(createParticle(type, true));
    }

    // Micro-estalos periódicos de óleo e chapa fervente (sizzle burst)
    const triggerSizzleBurst = (x?: number, y?: number, count = 5) => {
      const burstX = x !== undefined ? x : Math.random() * width;
      const burstY = y !== undefined ? y : height + 5;
      for (let i = 0; i < count; i++) {
        if (particles.length < maxParticles + 30) {
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4; // Em leque para cima
          const speed = 2.8 + Math.random() * 4.5;
          const vx = Math.cos(angle) * speed;
          const vy = -Math.abs(Math.sin(angle) * speed);
          particles.push(createParticle('pop', false, burstX, burstY, { vx, vy }));
        }
      }
    };

    // Interatividade táctil: toques ou cliques na tela geram estalos térmicos de brasa!
    const handlePointerDown = (e: PointerEvent) => {
      triggerSizzleBurst(e.clientX, e.clientY, 8);
    };

    window.addEventListener('pointerdown', handlePointerDown);

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let frameCount = 0;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Efeito aditivo 'lighter' (Screen/Add blending) para incandescência realista de fogo
      ctx.globalCompositeOperation = 'lighter';

      // Estalos dinâmicos contínuos de fritura a cada 80-120 frames (aprox 1 a 2s)
      if (frameCount % 90 === 0 && Math.random() > 0.25) {
        triggerSizzleBurst(undefined, undefined, 4 + Math.floor(Math.random() * 6));
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += p.decayRate;
        p.angle += p.swaySpeed;

        p.prevX = p.x;
        p.prevY = p.y;

        // Física térmica orgânica: convecção vertical + oscilação lateral
        p.y -= p.speedY;
        p.x += Math.sin(p.angle) * p.sway + p.speedX;

        // Estalos perdem velocidade horizontal suavemente (arrasto do ar)
        if (p.type === 'pop' || p.type === 'spark') {
          p.speedX *= 0.98;
          p.speedY *= 0.99;
        }

        const progress = p.life / p.maxLife;

        // Curva de brilho e crepitação de fogo vivo
        if (progress < 0.12) {
          p.opacity = (progress / 0.12) * p.maxOpacity;
        } else if (progress > 0.68) {
          p.opacity = ((1 - progress) / 0.32) * p.maxOpacity;
        } else {
          // Crepitação viva de calor
          const flicker = Math.sin(p.life * 0.35 + p.angle) * 0.2;
          p.opacity = Math.max(0.1, Math.min(1, p.maxOpacity + flicker));
        }

        if (p.opacity > 0.01) {
          ctx.save();

          if (p.type === 'smoke') {
            // Fumaça térmica translúcida
            const smokeGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            smokeGrad.addColorStop(0, 'rgba(255, 90, 0, 0.09)');
            smokeGrad.addColorStop(0.5, 'rgba(210, 60, 10, 0.04)');
            smokeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = smokeGrad;
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'spark' || p.type === 'pop') {
            // Faísca rápida com rastro de luz incandescente (trail)
            ctx.globalAlpha = p.opacity;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size;
            ctx.lineCap = 'round';
            ctx.shadowColor = p.glowColor;
            ctx.shadowBlur = 10;

            ctx.beginPath();
            ctx.moveTo(p.prevX, p.prevY);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();

            // Ponto frontal brilhante
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.9, 0, Math.PI * 2);
            ctx.fillStyle = p.coreColor || '#ffffff';
            ctx.shadowBlur = 6;
            ctx.fill();
          } else {
            // Brasa flutuante com halo ardente e núcleo incandescente
            ctx.globalAlpha = p.opacity;
            ctx.shadowColor = p.glowColor;
            ctx.shadowBlur = p.size * 4.5;

            // Halo de cor
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            // Núcleo superaquecido branco/ouro
            if (p.size > 1.6) {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
              ctx.fillStyle = p.coreColor || '#ffffff';
              ctx.shadowBlur = 3;
              ctx.fill();
            }
          }

          ctx.restore();
        }

        // Renovação contínua de ciclo de vida
        if (p.y < -30 || p.life >= p.maxLife || p.x < -40 || p.x > width + 40) {
          if (particles.length > maxParticles) {
            particles.splice(i, 1);
          } else {
            const rand = Math.random();
            const nextType: ParticleType = rand < 0.5 ? 'ember' : rand < 0.85 ? 'spark' : 'smoke';
            particles[i] = createParticle(nextType, false);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* 1. Camada de Iluminação Térmica no Fundo (atrás dos cards) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      >
        {/* Brilho quente da chapa / brasa na base da tela */}
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-red-600/20 via-amber-500/10 to-transparent pointer-events-none" />

        {/* Linha incandescente viva no rodapé simulando grelha/chapa aquecida */}
        <div className="absolute inset-x-0 bottom-0 h-[2.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />

        {/* Pulsações de calor vivo nas laterais inferiores */}
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-flame/20 blur-3xl pointer-events-none animate-pulse duration-700" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl pointer-events-none animate-pulse duration-1000 delay-300" />
      </div>

      {/* 2. Camada Atmosférica de Faíscas & Brasas (flutuando livremente com profundidade visual) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-20 overflow-hidden select-none"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full pointer-events-none opacity-95"
        />
      </div>
    </>
  );
};
