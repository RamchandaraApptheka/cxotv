// middleware.js
import { NextResponse } from 'next/server';
import { BACKEND_URL } from '@/utils/env';

// Note: All layout mappings are currently active as of June 6, 2026. Commented-out/deactivated 
// mappings (such as 'medical-technology') have been completely removed to keep the mapping clean.
const LAYOUT_MAPPING = {
    technology: 'm',
    business: 'c',
    science: 'm',
    finance: 'c',
    'emea-talks-with-kalpana': 'm',
    'emea-marketing-monday': 'm',
    'trending-news': 'm',
    'talks-with-kalpana': 'm',
    interviews: 'm',
    'marketing-mondays': 'm',
    'apac-talks-with-kalpana': 'm',
    'cxo-talk': 'm',
    'apac-marketing-monday': 'm',
    'ceo-talk': 'm',
    trending: 'm',
    'cfo-playbook': 'm',
    'tech-thursday': 'm',
    'tech-priorities': 'm',
    'cyber-security': 'm',
    policy: 'm',
    mobility: 'm',
    'cloud-computing': 'm',
    innovation: 'm',
    feature: 'h',
    'health-business': 'h',
    'health-interviews': 'h',
    'health-news': 'h',
    'health-webinars': 'h',
    pharma: 'h',
    diagnostic: 'h',
    'education-cxo-talk': 'e',
    'education-news': 'e',
    'digital-learning': 'e',
    'education-policy': 'e',
    'education-interview': 'e',
    'education-feature': 'e',
    'skill-development': 'e',
    'steam-career-education': 'e',
    'm-learning': 'e',
    manufacturing: 'm',
    'retail-ecommerce': 'm',
    telecommunication: 'm',
    'energy-utility': 'm',
    'transportation-logistics': 'm',
    'government-public-sector': 'm',
    'defense-aviation': 'm',
    'media-entertainment': 'm',
    'data-centre': 'm',
    rpa: 'm',
    'ar-vr': 'm',
    blockchain: 'm',
    data: 'm',
    'edge-computing': 'm',
    'quantum-computing': 'm',
    npl: 'm',
    developers: 'm',
    cyberwatch: 'm',
    "what's-popular": 'm',
    "editor's-choice": 'm',
    'search-definition': 'm',
    'budget-stories': 'm',
    'daily-news-capsule': 'm',
    'cxo-connect': 'm',
    'cio-agenda': 'm',
    'cxo-agenda': 'm',
    archive: 'm',
    'tech-connect': 'm',
    'm-health': 'h',
    'business-impact': 'm',
    'case-study': 'm',
    'tech-titans': 'm',
};

// The categories you asked to treat like APAC.
// Normalized to lowercase Set on module load to allow O(1) case-insensitive checks.
const SPECIAL_CATEGORIES = new Set([
    'apac',
    'bfsi',
    'budget 2023',
    'budget 2024',
    'business impact',
    'by cxo tv news',
    'ceo talk',
    'cfo playbook',
    'cio agenda',
    'cio agenda 2023',
    'cxo agenda series',
    'cxo alpha woman',
    'cxo connect',
    'cxo tech dialogue series',
    'case study',
    'chat series',
    'co-creation series',
    'co-solution series',
    'cyberwatch',
    'daily news capsule',
    'definition',
    'developers',
    'emea',
    'education technology',
    'entrepreneur',
    'health technology',
    'india',
    'industry',
    'it agenda 2020',
    'innovation',
    'insights',
    'interviews',
    'interviews paid',
    'marketing mondays',
    'playbook',
    'search definition',
    'start up pitches',
    'talks with kalpana',
    'tech priorities',
    'tech thursday',
    'tech titans',
    'tech connect',
    'technology',
    'trending news',
    'usa',
    'uncategorized',
    'videos',
    'webinar covid19',
    'webinars',
    'budget 2022',
    "editor's choice",
    'm health',
    "what's popular"
]);

// Helper: normalize category name -> slug (lowercase, spaces/special -> hyphen)
function slugifyCategory(name) {
    if (!name || typeof name !== 'string') return '';
    return name
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/['"]/g, '')               // remove quotes
        .replace(/[^\w\s-]/g, '')           // remove all non-word chars except spaces and hyphens (Robust Fix)
        .replace(/[\s_-]+/g, '-')           // replace spaces, underscores and multiple hyphens with a single hyphen
        .replace(/^-+|-+$/g, '');           // trim leading/trailing hyphens
}

export async function middleware(request) {
    const { pathname, origin } = request.nextUrl;

    try {
        // Skip middleware for special paths / assets / API / files
        if (
            pathname.startsWith('/_next') ||
            pathname.startsWith('/api') ||
            pathname.startsWith('/static') ||
            pathname.includes('.') || // files with extensions
            pathname === '/' // homepage
        ) {
            return NextResponse.next();
        }

        // Normalize: if any uppercase exists in path, redirect to lowercase (SEO)
        if (pathname !== pathname.toLowerCase()) {
            const lowercaseUrl = new URL(`${origin}${pathname.toLowerCase()}`);
            return NextResponse.redirect(lowercaseUrl, 301);
        }

        const pathSegments = pathname.split('/').filter(Boolean);

        // --- Layout mapping ---
        if (pathSegments.length > 0) {
            const first = pathSegments[0];
            if (LAYOUT_MAPPING[first]) {
                const newUrl = new URL(`/${LAYOUT_MAPPING[first]}/${pathSegments.join('/')}`, request.url);
                return NextResponse.rewrite(newUrl);
            }
        }

        // --- Slug resolution with timeout ---
        if (pathSegments.length >= 2) {
            const maybeSlug = pathSegments[pathSegments.length - 1];

            if (maybeSlug.includes('-')) {
                const apiBase = process.env.STRAPI_API_URL || BACKEND_URL || 'https://uatapicxotv.techplusmedia.com';
                const apiUrl = `${apiBase}/api/news?populate=*&filters[slug][$eq]=${encodeURIComponent(maybeSlug)}`;

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                try {
                    const res = await fetch(apiUrl, { 
                        next: { revalidate: 60 },
                        signal: controller.signal 
                    });

                    if (res && res.ok) {
                        const json = await res.json();
                        const item = json?.data?.[0]?.attributes;
                        if (item) {
                            // 1) CanonicalPath check
                            const canonicalFromApi = item.canonicalPath;
                            if (canonicalFromApi) {
                                // Loop-guard: never redirect to self
                                if (canonicalFromApi === pathname) return NextResponse.next();
                                if (pathname !== canonicalFromApi) {
                                    const redirectUrl = new URL(origin);
                                    redirectUrl.pathname = canonicalFromApi;
                                    return NextResponse.redirect(redirectUrl.toString(), 308);
                                }
                                return NextResponse.next();
                            }

                            // 2) Special category matching
                            const categories = item?.categories?.data || [];

                            let matchedCategoryName = null;
                            for (const c of categories) {
                                const catName = c?.attributes?.name;
                                if (!catName) continue;
                                const normalizedCatName = String(catName).trim().toLowerCase();
                                if (SPECIAL_CATEGORIES.has(normalizedCatName)) {
                                    matchedCategoryName = String(catName).trim();
                                    break;
                                }
                            }

                            // 3) Subcategory fallback
                            const subcategories = item?.subcategories?.data || [];
                            let firstSubcategoryName = null;
                            if (!matchedCategoryName && subcategories.length > 0) {
                                const subAttrName = subcategories[0]?.attributes?.name;
                                if (subAttrName) {
                                    firstSubcategoryName = String(subAttrName).trim();
                                }
                            }

                            if (!matchedCategoryName && !firstSubcategoryName) {
                                return NextResponse.next();
                            }

                            const finalCategorySlug = matchedCategoryName
                                ? slugifyCategory(matchedCategoryName)
                                : slugifyCategory(firstSubcategoryName);

                            const target = `/${finalCategorySlug}/${maybeSlug}`;

                            // Loop-guard: never redirect to self
                            if (target === pathname) return NextResponse.next();

                            if (pathname !== target) {
                                const redirectUrl = new URL(origin);
                                redirectUrl.pathname = target;
                                return NextResponse.redirect(redirectUrl.toString(), 308);
                            }

                            return NextResponse.next();
                        }
                    }
                } catch (err) {
                    if (err.name === 'AbortError') {
                        console.error('Middleware: API fetch timed out after 5 seconds for slug:', maybeSlug);
                    } else {
                        console.error('Middleware: API fetch error:', err.message);
                    }
                } finally {
                    clearTimeout(timeoutId);
                }
            }
        }
    } catch (e) {
        console.error('Middleware: Unexpected error:', e);
    }

    return NextResponse.next();
}

export const config = {
    // Exclude static/crawler files from middleware execution
    matcher: [
        '/((?!_next|api|static|images|favicon\\.ico|robots\\.txt|sitemap.*\\.xml|manifest\\.json|\\.well-known).*)',
    ],
};
