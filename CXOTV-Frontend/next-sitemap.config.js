/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://cxotv.techplusmedia.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
  exclude: [
    '/404',
    '/500',
    '/server-sitemap.xml', // Exclude server-side generated sitemap from the static one
    '/api/*', // Exclude all API routes
    '/robots.txt', // Exclude robots.txt from sitemap
    '/sitemap.xml', // Exclude sitemap self-reference
    '/news-search', // Exclude search results page
    '/news-search/*', // Exclude search results pages
  ],
  generateIndexSitemap: false,
  outDir: 'public',
  // Set proper priorities based on content type
  transform: async (config, path) => {
    let priority = 0.5; // Default priority
    let changefreq = 'weekly'; // Default change frequency

    // Homepage - highest priority
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    }
    // Regional pages - high priority
    else if (path.match(/^\/(india|apac|usa|emea)$/)) {
      priority = 0.9;
      changefreq = 'daily';
    }
    // Main category pages - high priority
    else if (path.match(/^\/(bfsi|health-technology|education-technology|cxo-speak|fintech|edtech)$/)) {
      priority = 0.8;
      changefreq = 'daily';
    }
    // Article pages - medium-high priority
    else if (path.includes('/') && path.split('/').length >= 3) {
      priority = 0.7;
      changefreq = 'weekly';
    }
    // Static pages - lower priority
    else if (path.match(/^\/(about-us|privacy-policy|t-&-c)$/)) {
      priority = 0.3;
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
}
