/**
 * INTENT DETECTION UTILITY
 * Identifies user intent from natural language input
 */

export function detectIntent(text) {
  const lower = text.toLowerCase().trim();

  // PRODUCT INTENT
  const productPatterns = [
    /show|display|find|search|looking for|want|need|browse/,
    /sofa|chair|table|bed|wardrobe|furniture|cabinet/,
    /product|item|collection|catalog/,
  ];
  if (productPatterns.some(pattern => pattern.test(lower))) {
    return "PRODUCT";
  }

  // ORDER INTENT
  const orderPatterns = [
    /order|track|status|shipped|dispatch/,
    /where is my|when will.*arrive/,
    /cancel.*order|change.*address/,
  ];
  if (orderPatterns.some(pattern => pattern.test(lower))) {
    return "ORDER";
  }

  // SHIPPING INTENT
  const shippingPatterns = [
    /deliver|shipping|freight|courier/,
    /assembly|installation|white.?glove/,
    /how long.*deliver|delivery time/,
  ];
  if (shippingPatterns.some(pattern => pattern.test(lower))) {
    return "SHIPPING";
  }

  // RETURN INTENT
  const returnPatterns = [
    /return|refund|exchange/,
    /damage|broken|defect|missing/,
    /warranty|guarantee/,
  ];
  if (returnPatterns.some(pattern => pattern.test(lower))) {
    return "RETURN";
  }

  // PAYMENT INTENT
  const paymentPatterns = [
    /payment|pay|emi|installment/,
    /offer|discount|coupon|promo/,
    /gst|invoice|bill/,
  ];
  if (paymentPatterns.some(pattern => pattern.test(lower))) {
    return "PAYMENT";
  }

  // STORE INFO INTENT
  const storePatterns = [
    /showroom|location|address/,
    /contact|phone|email|support/,
    /hours|timing|open|close/,
    /custom|personalized|made.?to.?order/,
  ];
  if (storePatterns.some(pattern => pattern.test(lower))) {
    return "STORE_INFO";
  }

  // SPECIFICATION INTENT
  const specPatterns = [
    /dimension|size|measurement/,
    /material|made of|fabric|wood/,
    /weight.*capacity|specification/,
    /care|clean|maintain/,
  ];
  if (specPatterns.some(pattern => pattern.test(lower))) {
    return "SPECIFICATION";
  }

  return "GENERAL";
}

/**
 * Extract specific entities from text
 */
export function extractEntities(text) {
  const entities = {};

  // Extract price
  const priceMatch = text.match(/(?:under|below|₹|rs\.?|less than|upto)\s?(\d{1,6})/i);
  if (priceMatch) {
    entities.price = parseInt(priceMatch[1]);
  }

  // Extract categories
  const categoryMap = {
    sofa: /sofa|couch|settee/i,
    chair: /chair|seat|stool|recliner|armchair/i,
    table: /table|desk|dining|coffee table|study table/i,
    bed: /bed|cot|mattress|bedroom/i,
    wardrobe: /wardrobe|closet|almirah|cupboard/i,
    storage: /cabinet|shelf|drawer|storage|rack/i,
    decor: /mirror|lamp|curtain|rug|decoration/i,
  };

  for (const [category, pattern] of Object.entries(categoryMap)) {
    if (pattern.test(text)) {
      entities.category = category;
      break;
    }
  }

  // Extract colors
  const colorPattern = /(black|white|brown|gray|grey|beige|blue|green|red|yellow|teak|oak|walnut|mahogany)/i;
  const colorMatch = text.match(colorPattern);
  if (colorMatch) {
    entities.color = colorMatch[1].toLowerCase();
  }

  // Extract materials
  const materialPattern = /(wood|wooden|metal|leather|fabric|plastic|glass|marble|granite|steel|iron)/i;
  const materialMatch = text.match(materialPattern);
  if (materialMatch) {
    entities.material = materialMatch[1].toLowerCase();
  }

  // Extract styles
  const stylePattern = /(modern|contemporary|traditional|rustic|minimalist|industrial|vintage|classic|scandinavian)/i;
  const styleMatch = text.match(stylePattern);
  if (styleMatch) {
    entities.style = styleMatch[1].toLowerCase();
  }

  // Extract order number
  const orderPattern = /(?:order|ord|#)\s?([A-Z0-9]{6,10})/i;
  const orderMatch = text.match(orderPattern);
  if (orderMatch) {
    entities.orderNumber = orderMatch[1].toUpperCase();
  }

  return entities;
}

/**
 * Check if query has sufficient information for direct action
 */
export function hasCompleteProductQuery(entities) {
  // Consider complete if has category OR (style + material) OR specific price range
  return !!(
    entities.category ||
    (entities.style && entities.material) ||
    (entities.price && entities.price < 100000)
  );
}

/**
 * Generate clarifying question based on incomplete query
 */
export function generateClarification(entities, intent) {
  if (intent === "PRODUCT") {
    if (!entities.category) {
      return "What type of furniture are you looking for? (Sofa, Chair, Table, Bed, etc.)";
    }
    if (!entities.price) {
      return "What's your budget range?";
    }
  }

  if (intent === "ORDER" && !entities.orderNumber) {
    return "Please provide your order number so I can track it for you.";
  }

  return "Could you provide a bit more detail?";
}