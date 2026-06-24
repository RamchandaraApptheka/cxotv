'use client';

import { useState } from 'react';
import Image from 'next/image';

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Calculate aspect ratio for CLS prevention
  const aspectRatio = width && height ? (height / width) * 100 : 56.25; // Default to 16:9

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        paddingBottom: `${aspectRatio}%`,
        backgroundColor: '#f0f0f0' // Placeholder background
      }}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 image-skeleton" />
      )}
      
      {/* Error fallback */}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
          <span>Image unavailable</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          priority={priority}
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
