/**
 * DOMAIN GUARD UTILITY
 * Determines if a query is related to furniture store operations
 */

export function isStoreRelated(text) {
  const lower = text.toLowerCase();

  // Furniture-related keywords
  const furnitureKeywords = [
    'furniture', 'sofa', 'chair', 'table', 'bed', 'wardrobe', 'cabinet',
    'desk', 'couch', 'mattress', 'drawer', 'shelf', 'storage', 'decor',
    'cushion', 'pillow', 'upholstery', 'wood', 'wooden', 'fabric', 'leather',
    'recliner', 'armchair', 'dining', 'coffee table', 'nightstand', 'dresser'
  ];

  // E-commerce/shopping keywords
  const shoppingKeywords = [
    'buy', 'purchase', 'order', 'shop', 'cart', 'checkout', 'payment',
    'delivery', 'shipping', 'track', 'return', 'refund', 'price', 'cost',
    'discount', 'offer', 'coupon', 'emi', 'installment', 'warranty'
  ];

  // Store/service keywords
  const storeKeywords = [
    'store', 'showroom', 'location', 'address', 'contact', 'support',
    'hours', 'timing', 'customer service', 'help', 'assistance',
    'assembly', 'installation', 'custom', 'made to order'
  ];

  // Interior design keywords
  const designKeywords = [
    'living room', 'bedroom', 'dining room', 'office', 'home',
    'interior', 'design', 'decor', 'style', 'modern', 'contemporary',
    'traditional', 'minimalist', 'space', 'comfort', 'ergonomic'
  ];

  // Check if text contains any relevant keywords
  const allKeywords = [
    ...furnitureKeywords,
    ...shoppingKeywords,
    ...storeKeywords,
    ...designKeywords
  ];

  const isRelated = allKeywords.some(keyword => lower.includes(keyword));

  // Additional patterns for common queries
  const relatedPatterns = [
    /what (kind|type) of/,
    /how (much|long|many)/,
    /where (can|is|are)/,
    /can (i|you|we)/,
    /do you (have|offer|provide|sell)/,
    /(show|find|search) (me|for)/,
    /looking for/,
    /interested in/,
    /tell me about/,
  ];

  const hasRelatedPattern = relatedPatterns.some(pattern => pattern.test(lower));

  return isRelated || hasRelatedPattern;
}

/**
 * Check if query is completely off-topic (should be rejected)
 */
export function isOffTopic(text) {
  const lower = text.toLowerCase();

  // Topics completely unrelated to furniture store
  const offTopicKeywords = [
    'recipe', 'cooking', 'food', 'restaurant',
    'movie', 'film', 'tv show', 'actor',
    'sports', 'football', 'cricket', 'basketball',
    'politics', 'election', 'government',
    'medical', 'disease', 'medicine', 'doctor',
    'stock market', 'crypto', 'bitcoin',
    'programming', 'code', 'software', 'app development',
    'math', 'calculation', 'equation',
    'weather', 'temperature', 'forecast',
    'news', 'current events', 'today',
  ];

  // Check for off-topic keywords
  const hasOffTopicKeyword = offTopicKeywords.some(keyword => 
    lower.includes(keyword)
  );

  // But if it also mentions furniture/shopping, it might be a comparison query
  const mentionsFurniture = isStoreRelated(text);

  return hasOffTopicKeyword && !mentionsFurniture;
}

/**
 * Get appropriate redirect message for off-topic queries
 */
export function getRedirectMessage() {
  return `I'm specialized in helping with furniture shopping! I can assist with:

🛋️ Finding products (sofas, chairs, tables, beds, etc.)
📦 Order tracking & status
🚚 Shipping & delivery information
↩️ Returns & refunds
💳 Payments & offers
📍 Store locations & contact

What would you like to know about our furniture?`;
}

/**
 * Check if query requires product database access
 */
export function needsProductData(text) {
  const lower = text.toLowerCase();

  const productQueryPatterns = [
    /show|display|list|browse/,
    /find|search|looking for/,
    /what.*available/,
    /best.*product|popular|trending/,
    /under ₹|under rs|price/,
    /(sofa|chair|table|bed|wardrobe)s?/,
  ];

  return productQueryPatterns.some(pattern => pattern.test(lower));
}

/**
 * Check if query requires order database access
 */
export function needsOrderData(text) {
  const lower = text.toLowerCase();

  const orderQueryPatterns = [
    /track|status|where is/,
    /order #|order number/,
    /when will.*arrive|delivery date/,
    /cancel|change address/,
  ];

  return orderQueryPatterns.some(pattern => pattern.test(lower));
}

/**
 * Determine response type based on query
 */
export function getResponseType(text) {
  if (needsProductData(text)) return "PRODUCT_SEARCH";
  if (needsOrderData(text)) return "ORDER_LOOKUP";
  if (isStoreRelated(text)) return "INFORMATIONAL";
  if (isOffTopic(text)) return "OFF_TOPIC";
  return "GENERAL";
}