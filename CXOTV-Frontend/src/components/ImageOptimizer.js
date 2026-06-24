'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { createAspectRatioStyle } from '@/utils/layoutShiftUtils';

const ImageOptimizer = ({
  src,
  alt = '',
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  quality = 80,
  loading = 'lazy',
  style = {},
  objectFit = 'cover',
  objectPosition = 'center',
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [imageSrcSet, setImageSrcSet] = useState('');
  const [dimensions, setDimensions] = useState({ width, height });
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Generate responsive image sources
  const generateImageSources = useCallback(() => {
    if (!src) return { src: '', srcSet: '' };

    // For external images
    if (src.startsWith('http')) {
      const srcset = [];
      const multipliers = [1, 1.5, 2, 3];
      
      if (width && height) {
        multipliers.forEach(multiplier => {
          const w = Math.round(width * multiplier);
          const h = Math.round(height * multiplier);
          const params = new URLSearchParams({
            w: w.toString(),
            h: h.toString(),
            q: quality.toString(),
            fm: 'webp',
            auto: 'format,compress'
          });
          srcset.push(`${src}?${params} ${w}w`);
        });
      }
      
      return {
        src: src,
        srcSet: srcset.join(', ')
      };
    }
    
    // For local images
    return {
      src: src,
      srcSet: ''
    };
  }, [src, width, height, quality]);

  // Process image source and generate responsive versions
  const processImage = useCallback(async () => {
    if (!src) {
      setHasError(true);
      return;
    }

    try {
      const { src: processedSrc, srcSet } = generateImageSources();
      setImageSrc(processedSrc);
      setImageSrcSet(srcSet);
      
      // If we have dimensions, we can mark as loaded
      if (width && height) {
        setIsLoaded(true);
      } else {
        // Otherwise, load the image to get dimensions
        const img = new window.Image();
        img.src = processedSrc;
        img.onload = () => {
          setDimensions({
            width: width || img.naturalWidth,
            height: height || img.naturalHeight
          });
          setIsLoaded(true);
        };
        img.onerror = (e) => {
          console.error('Error loading image:', e);
          setHasError(true);
          if (onError) onError(e);
        };
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setHasError(true);
      if (onError) onError(error);
    }
  }, [src, width, height, onError, generateImageSources]);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // If IntersectionObserver is not supported, load the image immediately
      processImage();
      return;
    }

    if (imgRef.current && !isLoaded && !hasError) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              processImage();
              if (observerRef.current) {
                observerRef.current.disconnect();
              }
            }
          });
        },
        {
          rootMargin: '200px',
          threshold: 0.01,
        }
      );

      observer.observe(imgRef.current);
      observerRef.current = observer;

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }
  }, [isLoaded, hasError, processImage]);

  // Handle image load
  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  // Handle image error
  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  // Calculate aspect ratio for placeholder
  const aspectRatio = width && height ? `${(height / width) * 100}%` : '56.25%';

  // If no dimensions are provided, we need to wait until the image loads to avoid layout shifts
  const needsDimensions = !width || !height;

  // Calculate styles with memoization
  const wrapperStyle = useMemo(() => ({
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    ...(needsDimensions && !isLoaded ? { paddingTop: aspectRatio } : {}),
    ...style,
  }), [needsDimensions, isLoaded, aspectRatio, style]);

  const imageStyle = useMemo(() => ({
    position: needsDimensions ? 'absolute' : 'relative',
    top: 0,
    left: 0,
    width: '100%',
    height: needsDimensions ? '100%' : 'auto',
    objectFit,
    objectPosition,
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease',
  }), [needsDimensions, isLoaded, objectFit, objectPosition]);

  // Preload critical images
  useEffect(() => {
    if (priority && imageSrc) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imageSrc;
      if (imageSrcSet) {
        link.imagesrcset = imageSrcSet;
      }
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, imageSrc, imageSrcSet]);

  return (
    <div
      ref={imgRef}
      className={`image-wrapper ${className} ${!isLoaded ? 'image-loading' : ''}`}
      style={wrapperStyle}
      data-priority={priority ? 'true' : 'false'}
      data-loaded={isLoaded ? 'true' : 'false'}
    >
      {imageSrc && (
        <>
          {/* Preload for LCP images */}
          {priority && (
            <link 
              rel="preload" 
              as="image" 
              href={imageSrc} 
              imagesrcset={imageSrcSet || undefined}
              fetchpriority="high"
            />
          )}
          
          <Image
            src={imageSrc}
            alt={alt}
            width={dimensions.width}
            height={dimensions.height}
            className={`image-content ${isLoaded ? 'image-loaded' : ''}`}
            style={imageStyle}
            sizes={sizes}
            srcSet={imageSrcSet || undefined}
            loading={priority ? 'eager' : loading}
            priority={priority}
            quality={quality}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
        </>
      )}
      
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div 
          className="image-placeholder"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
          }}
        >
          <div className="spinner"></div>
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div 
          className="image-error"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            color: '#6c757d',
          }}
        >
          <span>Image not available</span>
        </div>
      )}
    </div>
  );
};

export default ImageOptimizer;
