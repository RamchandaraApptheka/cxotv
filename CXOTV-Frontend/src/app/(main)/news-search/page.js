'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchNews from '../components/SearchNews';

export default function DefaultSearchPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // Only run client-side and protect access to sessionStorage
        try {
            const stored = sessionStorage.getItem('searchTerm');

            if (stored && stored.trim() !== '') {
                const encoded = encodeURIComponent(stored.trim());
                // replace so user doesn't get an extra history entry
                router.replace(`/news-search/${encoded}`);
                return;
            }
        } catch (err) {
            // sessionStorage may throw in some environments — ignore and continue
            // console.warn('sessionStorage access failed', err);
        } finally {
            // finished checking storage; allow component to render if not redirected
            setChecking(false);
        }
    }, [router]);

    // while we check sessionStorage, avoid rendering SearchNews to prevent flicker
    if (checking) return null;

    // If no stored term, render SearchNews with empty term (or you can let user type)
    return <SearchNews searchTerm={searchTerm} />;
}
