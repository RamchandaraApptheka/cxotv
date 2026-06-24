const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Base URL of your site
const siteUrl = process.env.SITE_URL || 'https://cxotv.techplusmedia.com';

// API endpoint to fetch all categories and news articles
const API_BASE_URL = 'https://apicxotv.techplusmedia.com/api/';

async function fetchCategories() {
  try {
    const response = await axios.get(`${API_BASE_URL}category-list`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    return [];
  }
}

async function fetchAllNewsArticles() {
  try {
    // This might need pagination if there are many articles
    const response = await axios.get(`${API_BASE_URL}latest-news?limit=100`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching news articles:', error.message);
    return [];
  }
}

async function generateDynamicUrlsFromApi() {
  const categories = await fetchCategories();
  const newsArticles = await fetchAllNewsArticles();
  
  const urls = [];
  
  // Add category pages
  categories.forEach(category => {
    if (category.slug) {
      urls.push(`/m/${category.slug}`);
    }
  });
  
  // Add news article pages
  newsArticles.forEach(article => {
    if (article.slug && article.category_slug) {
      urls.push(`/m/${article.category_slug}/${article.slug}`);
    }
  });
  
  // Add static definition terms we know about
  const definitionTerms = ['ai', 'ml', 'iot', 'cloud', 'saas', 'blockchain'];
  definitionTerms.forEach(term => {
    urls.push(`/search/definition/${term}`);
  });
  
  return urls;
}

// Static URLs in your application
const staticUrls = [
  '/',
  '/about-us',
  '/t-&-c',
  '/privacy-policy',
  '/advertising',
  '/search/definition'
];

async function generateSitemapXml() {
  try {
    const dynamicUrls = await generateDynamicUrlsFromApi();
    const allUrls = [...staticUrls, ...dynamicUrls];
    
    // Helper function to escape XML special characters
    function escapeXml(unsafe) {
      return unsafe.replace(/[&<>'"]/g, function(c) {
        switch (c) {
          case '&': return '&amp;';
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '\'': return '&apos;';
          case '"': return '&quot;';
          default: return c;
        }
      });
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    url => `  <url>
    <loc>${escapeXml(siteUrl + url)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === '/' ? '1.0' : '0.7'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(outputPath, sitemap);
    console.log(`Sitemap generated at ${outputPath}`);
    
    // Generate robots.txt if it doesn't exist
    const robotsContent = `# *
User-agent: *
Allow: /

# Host
Host: ${siteUrl}

# Sitemaps
Sitemap: ${siteUrl}/sitemap.xml`;
    
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    fs.writeFileSync(robotsPath, robotsContent);
    console.log(`robots.txt generated at ${robotsPath}`);
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemapXml();
