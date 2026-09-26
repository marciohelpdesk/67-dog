import React from 'react';

interface DestaqueImageSkeletonProps {
  icon?: string;
  badgeText?: string;
  className?: string;
}

export const DestaqueImageSkeleton: React.FC<DestaqueImageSkeletonProps> = ({
  icon = 'fa-solid fa-hotdog',
  badgeText,
  className = '',
}) => {
  return (
    <div 
      className={`absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden destaque-skeleton-shimmer select-none ${className}`}
      aria-label="Carregando imagem do destaque"
    >
      {/* Ambient Warm Golden/Amber Core Glow */}
      <div className="absolute inset-0 bg-radial from-amber-500/15 via-transparent to-black/60 pointer-events-none" />

      {/* Top Badge Skeleton Placeholder */}
      <div className="absolute top-1.5 left-1.5 z-20 flex items-center gap-1 px-2 py-0.5 rounded bg-black/40 border border-amber-500/30 backdrop-blur-xs destaque-soft-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-amber-200/80">
          {badgeText || 'Destaque'}
        </span>
      </div>

      {/* Centered Pulsing Food Silhouette */}
      <div className="relative flex flex-col items-center justify-center gap-1.5 z-10">
        <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-400/25 flex items-center justify-center shadow-lg shadow-amber-950/40 destaque-soft-pulse">
          <i className={`${icon} text-lg text-amber-400/60`}></i>
        </div>
        
        {/* Soft Warm Status Indicator */}
        <div className="flex items-center gap-1 opacity-70">
          <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[9px] font-medium tracking-wide text-amber-100/70">
            Carregando...
          </span>
        </div>
      </div>

      {/* Diagonal Light Sweep for Depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-amber-300/[0.04] to-transparent" />
    </div>
  );
};

export const DestaqueCardSkeleton: React.FC = () => {
  return (
    <article 
      className="glass-card rounded-xl overflow-hidden flex flex-col justify-between border border-white/10 select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* Image Skeleton Box */}
      <div className="relative h-24 w-full overflow-hidden bg-neutral-900 destaque-skeleton-shimmer">
        <DestaqueImageSkeleton />
      </div>

      {/* Card Content Skeleton */}
      <div className="p-2.5 flex flex-col flex-1 justify-between gap-2 bg-[#1c0c04]">
        <div className="space-y-1.5">
          {/* Title line skeleton */}
          <div className="h-3 w-4/5 rounded bg-amber-500/20 destaque-soft-pulse" />
          {/* Subtitle line skeleton */}
          <div className="h-2.5 w-3/5 rounded bg-white/10 destaque-soft-pulse" />
          {/* Price pill skeleton */}
          <div className="h-3.5 w-14 rounded bg-amber-400/30 mt-1 destaque-soft-pulse" />
        </div>
        {/* Button skeleton */}
        <div className="h-7 w-full rounded-lg bg-red-600/30 border border-red-500/20 destaque-soft-pulse" />
      </div>
    </article>
  );
};
