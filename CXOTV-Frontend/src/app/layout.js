import { Fira_Sans_Condensed, Noto_Sans } from 'next/font/google';
import './(main)/globals.css';
import './(custom)/index.css'; // Add custom CSS
import Script from 'next/script';
import { AuthProvider } from './(main)/AuthProvider';
import ErrorBoundary from './(main)/components/ErrorBoundary';
import { FRONTEND_URL } from '@/utils/env';

const fira = Fira_Sans_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-fira',
  display: 'swap',
});

const noto = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || FRONTEND_URL),
  title: 'CXO TV : CIO 2026 Strategy on AI, Cloud, Cybersecurity & Digital Transformation',
  icons: {
    icon: '/favicon.ico',
  },
  description:
    'CXO TV is the global platform for CIOs, CTOs, and CISOs. Watch thought-leader interviews, industry news, cloud, AI, security insights, and enterprise tech trends shaping digital transformation.',
  openGraph: {
    title: 'CXO TV : CIO 2026 Strategy on AI, Cloud, Cybersecurity & Digital Transformation',
    description:
      'CXO TV is the global platform for CIOs, CTOs, and CISOs. Watch thought-leader interviews, industry news, cloud, AI, security insights, and enterprise tech trends shaping digital transformation.',
    siteName: 'CXO TV',
    type: 'website',
    url: FRONTEND_URL,
  },
  twitter: {
    title: 'CXO TV : CIO 2026 Strategy on AI, Cloud, Cybersecurity & Digital Transformation',
    description:
      'CXO TV is the global platform for CIOs, CTOs, and CISOs. Watch thought-leader interviews, industry news, cloud, AI, security insights, and enterprise tech trends shaping digital transformation.',
    card: 'summary_large_image',
    site: '@cxotv',
    creator: '@cxotv',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fira.variable} ${noto.variable}`}>
      <head>
        <meta name="google-site-verification" content="RhPGUy0uVfDi9DMhUfHcc5th5r9f3SKiqn6Vm76jj6U" />
        <meta name="application-name" content="CXO TV | Techplus Media" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect to S3/CloudFront CDN */}
        <link rel="preconnect" href="https://cdn.cxotv.techplusmedia.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.uatcxotv.techplusmedia.com" />
        <link rel="preconnect" href="https://apicxotv.techplusmedia.com" />
        <link rel="dns-prefetch" href="https://cdn.cxotv.techplusmedia.com" />
      </head>
      <body>
        <Script id="schema-website" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': 'CXO TV | Techplus Media',
            'alternateName': 'Techplus Media',
            'url': FRONTEND_URL,
            'description':
              'CXO TV is the global platform for CIOs, CTOs, and CISOs. Watch thought-leader interviews, industry news, cloud, AI, security insights, and enterprise tech trends shaping digital transformation.'
          })}
        </Script>
        <Script id="schema-organization" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'CXO TV',
            'alternateName': 'Techplus Media',
            'url': FRONTEND_URL,
            'logo': 'https://postimg.cc/Mc4LGZp7',
            'sameAs': [
              'https://www.facebook.com/cxotvnews',
              'https://x.com/cxotvnews',
              'https://www.instagram.com/cxotv_news/',
              'https://www.youtube.com/channel/UCNSQbKNLmJBhCBCIR0ZqqPA',
              'https://www.linkedin.com/company/cxotvnews/',
              FRONTEND_URL
            ]
          })}
        </Script>
        {/* SWG Basic: Only load in production — Google's CORS policy blocks localhost */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script src="https://news.google.com/swg/js/v1/swg-basic.js" strategy="afterInteractive" />
            <Script id="swg-basic-init" strategy="afterInteractive">
              {`
                (self.SWG_BASIC = self.SWG_BASIC || []).push(basicSubscriptions => {
                  basicSubscriptions.init({
                    type: "NewsArticle",
                    isPartOfType: ["Product"],
                    isPartOfProductId: "CAow-rC9DA:openaccess",
                    clientOptions: { theme: "light", lang: "en" },
                  });
                });
              `}
            </Script>
          </>
        )}
        <ErrorBoundary>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
