"use client";

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'portrait';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Generate responsive image URLs (in a real implementation, you'd use a service like Cloudinary)
const generateResponsiveUrls = (src: string) => {
  // For demo purposes, we'll use different size parameters from Unsplash
  const baseUrl = src.includes('unsplash.com') ? src : src;
  return {
    small: baseUrl.replace('w=800&h=400', 'w=400&h=200'),
    medium: baseUrl.replace('w=800&h=400', 'w=800&h=400'),
    large: baseUrl.replace('w=800&h=400', 'w=1200&h=600'),
    xlarge: baseUrl.replace('w=800&h=400', 'w=1600&h=800'),
  };
};

const aspectRatioClasses = {
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
  portrait: 'aspect-[3/4]'
};

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  aspectRatio,
  objectFit = 'cover',
  placeholder,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const responsiveUrls = generateResponsiveUrls(src);

  const srcSet = `
    ${responsiveUrls.small} 400w,
    ${responsiveUrls.medium} 800w,
    ${responsiveUrls.large} 1200w,
    ${responsiveUrls.xlarge} 1600w
  `;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden bg-gray-100',
        aspectRatio && aspectRatioClasses[aspectRatio],
        className
      )}
      style={
        !aspectRatio && width && height
          ? { width, height }
          : {}
      }
    >
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
        </div>
      )}

      {/* Placeholder */}
      {placeholder && !isInView && !priority && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-400 text-sm">{placeholder}</div>
        </div>
      )}

      {/* Main Image */}
      {(isInView || priority) && !hasError && (
        <img
          ref={imgRef}
          src={responsiveUrls.medium}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full transition-opacity duration-300',
            objectFit === 'cover' && 'object-cover',
            objectFit === 'contain' && 'object-contain',
            objectFit === 'fill' && 'object-fill',
            objectFit === 'none' && 'object-none',
            objectFit === 'scale-down' && 'object-scale-down',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-400">
            <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="text-xs">Error al cargar imagen</div>
          </div>
        </div>
      )}

      {/* Loading Indicator for Priority Images */}
      {priority && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}

// Hook for preloading critical images
export const useImagePreload = (urls: string[]) => {
  useEffect(() => {
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, [urls]);
};
