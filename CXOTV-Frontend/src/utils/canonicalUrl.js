import { FRONTEND_URL } from './env';
// Comprehensive canonical URL normalization
// Forces all article URLs to use clean base category pattern only

export function getCanonicalUrl(pathname, slug) {
  // If no slug provided, try to extract from pathname
  if (!slug && pathname) {
    const segments = pathname.split('/').filter(Boolean);
    slug = segments[segments.length - 1];
  }

  if (!slug) {
    return FRONTEND_URL;
  }

  // Extract base category from pathname, removing subcategories and prefixes
  const segments = pathname.split('/').filter(Boolean);

  // Remove prefix patterns (m, c, h, e) if present
  let baseCategory = segments[0];
  if (['m', 'c', 'h', 'e'].includes(baseCategory) && segments.length > 1) {
    baseCategory = segments[1];
  }

  // If we have more than 2 segments, we might have a subcategory to strip
  if (segments.length > 2 && !['m', 'c', 'h', 'e'].includes(segments[0])) {
    // For paths like /tech-thursday/subcategory/slug, use just tech-thursday
    baseCategory = segments[0];
  }

  // Category normalization - map subcategories to their parent categories
  const categoryMappings = {
    // Tech subcategories → main tech categories
    'fintech': 'tech-thursday',
    'insurtech': 'bfsi',
    'healthtech': 'health-technology',
    'edtech': 'education-technology',
    'ai-ml': 'technology',
    'blockchain': 'technology',
    'cloud-computing': 'technology',
    'cyber-security': 'technology',
    'rpa': 'al-ml-amp-rpa',
    'ar-vr': 'technology',
    'quantum-computing': 'technology',

    // Business subcategories
    'manufacturing': 'technology',
    'retail-ecommerce': 'technology',
    'telecommunication': 'technology',
    'energy-utility': 'technology',
    'transportation-logistics': 'technology',
    'government-public-sector': 'technology',
    'defense-aviation': 'technology',
    'media-entertainment': 'technology',
    'data-centre': 'technology',

    // Health subcategories
    'diagnostic': 'health-technology',
    'pharma': 'health-technology',
    'm-health': 'health-technology',

    // Education subcategories
    'digital-learning': 'education-technology',
    'skill-development': 'education-technology',
    'm-learning': 'education-technology',
  };

  // Apply category mapping if exists
  if (categoryMappings[baseCategory]) {
    baseCategory = categoryMappings[baseCategory];
  }

  // Region-based routes - keep them as is (highest priority)
  const regionRoutes = ['india', 'usa', 'emea', 'apac'];
  if (regionRoutes.includes(baseCategory)) {
    return `${FRONTEND_URL}/${baseCategory}/${slug}`;
  }

  // Always strip subcategories for tech categories
  const techCategories = ['5g', 'iot', 'al-ml-amp-rpa', 'tech-thursday'];
  if (techCategories.includes(baseCategory)) {
    return `${FRONTEND_URL}/${baseCategory}/${slug}`;
  }

  // Health categories
  const healthCategories = ['health-technology', 'health-interviews', 'healthcare-it-news', 'health-videos'];
  if (healthCategories.includes(baseCategory)) {
    return `${FRONTEND_URL}/${baseCategory}/${slug}`;
  }

  // Education categories
  const educationCategories = ['education-technology', 'education-news'];
  if (educationCategories.includes(baseCategory)) {
    return `${FRONTEND_URL}/${baseCategory}/${slug}`;
  }

  // Business/BFSI categories
  const businessCategories = ['bfsi', 'fintech', 'banking-it', 'nbfc'];
  if (businessCategories.includes(baseCategory)) {
    return `${FRONTEND_URL}/${baseCategory}/${slug}`;
  }

  // Default: use clean base category + slug pattern
  if (baseCategory && slug) {
    return `${FRONTEND_URL}/${baseCategory}/${slug}`;
  }

  // Final fallback
  return FRONTEND_URL;
}

// Helper to check if URL needs canonical tag
export function needsCanonicalTag(pathname) {
  // Always add canonical tag to article pages
  const segments = pathname.split('/').filter(Boolean);
  
  // Article pages typically have 2+ segments and slug pattern
  if (segments.length >= 2) {
    const lastSegment = segments[segments.length - 1];
    // Check if last segment looks like a slug (contains hyphen)
    return lastSegment.includes('-');
  }
  
  return false;
}