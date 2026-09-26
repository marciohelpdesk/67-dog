import React, { useState, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  aspectRatio?: string;
  customSkeleton?: React.ReactNode;
  minLoadingTime?: number;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  priority = false,
  aspectRatio,
  customSkeleton,
  minLoadingTime = 0,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoaded(false);
    setHasError(false);

    const startTime = Date.now();
    const img = new Image();
    img.src = src;

    const completeLoad = () => {
      if (!isMounted) return;
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minLoadingTime - elapsed);

      if (remaining > 0) {
        setTimeout(() => {
          if (isMounted) setIsLoaded(true);
        }, remaining);
      } else {
        setIsLoaded(true);
      }
    };

    if (img.complete && img.naturalWidth > 0) {
      completeLoad();
    } else {
      img.onload = completeLoad;
      img.onerror = () => {
        if (isMounted) setHasError(true);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [src, minLoadingTime]);

  return (
    <div 
      className={`relative overflow-hidden bg-neutral-900/80 ${containerClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Skeleton or Shimmer Placeholder with Smooth Warm Ambient Pulse while Loading */}
      {!isLoaded && !hasError && (
        customSkeleton ? (
          <div className="absolute inset-0 z-10 transition-opacity duration-500">
            {customSkeleton}
          </div>
        ) : (
          <div className="absolute inset-0 z-0 lazy-shimmer-placeholder flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin"></div>
          </div>
        )
      )}

      {/* The Actual Image with Progressive Blur-Up Dissolve */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'low'}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          setHasError(true);
          if (onError) onError(e);
        }}
        className={`w-full h-full object-cover ${
          isLoaded ? 'img-blur-loaded' : 'img-blur-loading'
        } ${className}`}
        {...props}
      />
    </div>
  );
};
