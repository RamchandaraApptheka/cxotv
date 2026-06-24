'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function NonCriticalCSS({ href, media = 'all' }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Check if the stylesheet is already in the document
    const existingLink = document.querySelector(`link[href="${href}"]`);
    if (existingLink) {
      setIsLoaded(true);
      return;
    }

    // Create a new link element
    const link = document.createElement('link');
    link.href = href;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.media = media;
    
    // Set media to 'print' initially to prevent render blocking
    // Then change to 'all' once loaded
    link.media = 'print';
    link.onload = () => {
      link.media = media;
      setIsLoaded(true);
    };

    // Add to the document head
    document.head.appendChild(link);

    // Fallback in case onload doesn't fire
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        link.media = media;
        setIsLoaded(true);
      }
    }, 3000);

    // Clean up
    return () => {
      clearTimeout(timeout);
      if (link.parentNode === document.head) {
        document.head.removeChild(link);
      }
    };
  }, [href, media, isLoaded]);

  // For server-side rendering or if the stylesheet is already loaded
  if (isLoaded || typeof window === 'undefined') {
    return (
      <link 
        href={href} 
        rel="stylesheet" 
        type="text/css" 
        media={media} 
      />
    );
  }

  // Fallback for browsers that don't support the link.onload event
  return (
    <noscript>
      <link 
        href={href} 
        rel="stylesheet" 
        type="text/css" 
        media={media} 
      />
    </noscript>
  );
}
