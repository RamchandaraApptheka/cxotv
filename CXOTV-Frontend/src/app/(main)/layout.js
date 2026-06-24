
import { Inter } from 'next/font/google';
import './globals.css';
import ContentWrapper from "./components/ContentWrapper";
import GoToTop from './components/GoToTop';
import Script from 'next/script';
import { FRONTEND_URL } from '@/utils/env';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CXO TV | Techplus Media',
  icons: {
    icon: '/favicon.ico',
  },
  description: 'The Voice of CXOs Worldwide',
  keywords: 'recent tech news, tech articles, tech magazines, tech news today, technology articles, ai news, innovation ideas, science and technology, technology newsletter, trending tech news',
  authors: [{ name: 'CXO TV' }],
  openGraph: {
    title: 'CXO TV | Techplus Media',
    site_name: 'CXO TV | Techplus Media',
    type: 'website',
    url: FRONTEND_URL,
  },
  twitter: {
    title: 'CXO TV | Techplus Media'
  }
};

export default function MainLayout({ children }) {
  return (
    <div className={inter.className}>
      <ContentWrapper>
        <main>
          {children}
        </main>
      </ContentWrapper>
      <GoToTop />
    </div>
  );
}
