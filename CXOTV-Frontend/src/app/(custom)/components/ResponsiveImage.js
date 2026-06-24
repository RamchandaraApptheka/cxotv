'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { BACKEND_URL } from '@/utils/env';

export default function ResponsiveImage({ 
  src, 
  alt = '', 
  width, 
  height, 
  className = '',
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  style = {},
  ...props 
}) {
  const [imageSrc, setImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!src) {
      setError('No image source provided');
      return;
    }

    // Handle external URLs
    const isExternal = src.startsWith('http');
    const imgSrc = isExternal ? src : `${BACKEND_URL}${src}`;
    
    // Set up image loading state
    const img = new window.Image();
    img.src = imgSrc;
    
    img.onload = () => {
      setImageSrc(imgSrc);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setError('Failed to load image');
      setIsLoading(false);
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (error) {
    return (
      <div 
        className={`image-error ${className}`}
        style={{
          width: '100%',
          aspectRatio: width && height ? `${width}/${height}` : '16/9',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style
        }}
      >
        <span style={{ color: '#999' }}>Image not available</span>
      </div>
    );
  }


  if (!imageSrc) {
    return (
      <div 
        className={`image-loading ${className}`}
        style={{
          width: '100%',
          aspectRatio: width && height ? `${width}/${height}` : '16/9',
          backgroundColor: '#f5f5f5',
          ...style
        }}
      />
    );
  }

  return (
    <div 
      className={`image-container ${className}`} 
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: width && height ? `${width}/${height}` : '16/9',
        overflow: 'hidden',
        ...style
      }}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{ 
          objectFit: 'cover',
          transition: 'opacity 0.3s ease',
          opacity: isLoading ? 0 : 1
        }}
        onLoadingComplete={() => setIsLoading(false)}
        quality={80}
        loading={priority ? 'eager' : 'lazy'}
        {...props}
      />
      {isLoading && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}
