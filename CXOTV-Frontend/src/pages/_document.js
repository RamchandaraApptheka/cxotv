import { Html, Head, Main, NextScript } from 'next/document';
import { BACKEND_URL } from '@/utils/env';

export default function Document() {
  return (
    <Html lang="en" className="no-js">
      <Head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href={BACKEND_URL} crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        
        {/* Note: Google Fonts are loaded via <link> in root layout.js with display=swap */}
        {/* Removed preload for /fonts/noto-sans-v27-latin-regular.woff2 — file does not exist */}
        
        {/* Favicon and app icons — only reference files that exist in public/ */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Removed preload for /images/logo.svg — file does not exist */}
        
        {/* Meta tags */}
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="theme-color" content="#0066cc" />
        
        {/* Preload critical API calls */}
        <link 
          rel="preload" 
          href={`${BACKEND_URL}/api/categories`} 
          as="fetch" 
          crossOrigin="anonymous"
        />
      </Head>
      <body className="loading">
        <Main />
        <NextScript />
        
        {/* Add a loading class that gets removed when JS loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.classList.remove('no-js');
              document.documentElement.classList.add('js');
              
              // Remove loading class when everything is loaded
              window.addEventListener('load', function() {
                document.body.classList.remove('loading');
              });
              
              // Fallback in case load event doesn't fire
              setTimeout(function() {
                document.body.classList.remove('loading');
              }, 3000);
            `,
          }}
        />
      </body>
    </Html>
  );
}
