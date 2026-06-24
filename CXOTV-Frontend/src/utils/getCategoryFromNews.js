/**
 * Extract the correct category/subcategory path from news item
 * Returns the canonical URL path segment (category or subcategory)
 */
export function getCategoryFromNews(newsItem) {
  if (!newsItem?.attributes) {
    return null;
  }

  const attrs = newsItem.attributes;

  // Priority 1: Use subcategory if exists (most specific)
  if (attrs.subcategories?.data?.length > 0) {
    const subcategory = attrs.subcategories.data[0].attributes.name;
    return subcategory.toLowerCase().replace(/\s+/g, '-');
  }

  // Priority 2: Use category
  if (attrs.categories?.data?.length > 0) {
    const category = attrs.categories.data[0].attributes.name;
    return category.toLowerCase().replace(/\s+/g, '-');
  }

  return null;
}

/**
 * Validate if the current URL category matches the news item's actual category
 */
export function validateCategory(urlCategory, newsItem) {
  const correctCategory = getCategoryFromNews(newsItem);

  if (!correctCategory) {
    return { isValid: false, correctCategory: null };
  }

  // Normalize both for comparison
  const normalizedUrlCategory = urlCategory.toLowerCase().replace(/\s+/g, '-');
  const normalizedCorrectCategory = correctCategory.toLowerCase().replace(/\s+/g, '-');

  return {
    isValid: normalizedUrlCategory === normalizedCorrectCategory,
    correctCategory: correctCategory,
  };
}
