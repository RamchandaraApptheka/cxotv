import { Inter } from 'next/font/google';
import './index.css';
import { ReduxProvider } from './providers.js';
import GoToTop from "../(main)/components/GoToTop";




const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    // Add fallback fonts
    fallback: ['system-ui', 'arial'],
    // Optional: Preload the font to avoid timeout issues
    preload: true,
})

export default function CustomLayout({ children }) {
    return (
        <div className={inter.className}>
            <ReduxProvider>
                <section>{children}</section>
            </ReduxProvider>
            <GoToTop />
        </div>
    );
}