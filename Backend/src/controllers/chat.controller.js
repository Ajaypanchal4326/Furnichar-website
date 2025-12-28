import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";
import User from "../models/User.model.js";
import { detectIntent } from "../utils/intentFilter.js";
import { isStoreRelated } from "../utils/domainGuard.js";


export const chatHandler = async (req, res) => {
  try {
    const { message = "", lastIntent = null, conversationHistory = [], userId = null } = req.body;
    const text = message.toLowerCase().trim();

    if (!text) {
      return res.json({
        reply: "👋 Hi! I'm your furniture assistant. I can help you find products, track orders, answer questions about shipping, returns, and more!"
      });
    }

    console.log("🧠 Chat Input:", { message, lastIntent, userId });

    // ============================================
    // EXTRACT KEY INFORMATION FROM USER MESSAGE
    // ============================================
    const extractedInfo = extractUserIntent(text);
    const { priceLimit, category, color, material, style, orderIdentifier, dimensions } = extractedInfo;

    // ============================================
    // PRIORITY 1: HANDLE CONTINUATION FLOWS
    // ============================================
    if (lastIntent === "PRODUCT_CATEGORY") {
      return await handleCategorySelection(text, priceLimit, res);
    }

    if (lastIntent === "AWAITING_ORDER_IDENTIFIER") {
      return await handleOrderTracking(text, userId, res);
    }

    // ============================================
    // PRIORITY 2: DETECT PRIMARY INTENT
    // ============================================
    const intent = detectIntent(text);

    // ============================================
    // PRIORITY 3: ROUTE TO APPROPRIATE HANDLER
    // ============================================

    /* ===== PRODUCT DISCOVERY ===== */
    if (intent === "PRODUCT" || category || hasProductKeywords(text)) {
      return await handleProductQuery(text, extractedInfo, res);
    }

    /* ===== ORDER TRACKING & STATUS ===== */
    if (intent === "ORDER" || hasOrderKeywords(text)) {
      return await handleOrderQuery(text, orderIdentifier, userId, res);
    }

    /* ===== SHIPPING & DELIVERY ===== */
    if (hasShippingKeywords(text)) {
      return await handleShippingQuery(text, res);
    }

    /* ===== RETURNS & REFUNDS ===== */
    if (hasReturnKeywords(text)) {
      return await handleReturnQuery(text, res);
    }

    /* ===== PAYMENT & OFFERS ===== */
    if (hasPaymentKeywords(text)) {
      return await handlePaymentQuery(text, res);
    }

    /* ===== STORE INFORMATION ===== */
    if (hasStoreInfoKeywords(text)) {
      return await handleStoreInfoQuery(text, res);
    }

    /* ===== PRODUCT SPECIFICATIONS ===== */
    if (hasSpecificationKeywords(text)) {
      return await handleSpecificationQuery(text, res);
    }

    /* ===== AI-POWERED GENERAL QUESTIONS ===== */
    if (isStoreRelated(text)) {
      return await handleGeneralQuestion(message, conversationHistory, res);
    }

    // ============================================
    // FALLBACK: UNCLEAR REQUEST
    // ============================================
    return res.json({
      reply: `I'm here to help! You can ask me about:
🛋️ Products & browsing
📦 Order tracking
🚚 Shipping & delivery
↩️ Returns & refunds
💳 Payments & offers
📍 Store information

What would you like to know?`,
      intent: null
    });

  } catch (err) {
    console.error("❌ Chatbot Error:", err);
    return res.status(500).json({
      reply: "⚠️ I'm having trouble connecting right now. Please try again in a moment.",
      intent: null
    });
  }
};

// ============================================
// HANDLER FUNCTIONS
// ============================================

/**
 * Handle product-related queries
 */
async function handleProductQuery(text, extractedInfo, res) {
  const { priceLimit, category, color, material, style } = extractedInfo;

  // If we have enough info to search, do it directly
  if (category || color || material || style) {
    const query = buildProductQuery(extractedInfo);
    const products = await Product.find(query)
      .select("title price image category description")
      .limit(6);

    if (products.length > 0) {
      let reply = "🛋️ Here's what I found for you:";
      if (priceLimit) reply += ` (under ₹${priceLimit})`;

      return res.json({
        reply,
        products,
        intent: null
      });
    } else {
      // No products found, offer AI-powered suggestions
      const aiSuggestion = await callGemini(`
        User searched for: ${text}
        No exact products found in database.
        Suggest 2-3 alternative furniture items they might like instead.
        Keep response under 50 words.
      `);

      return res.json({
        reply: `❌ I couldn't find exactly what you're looking for. ${aiSuggestion || 'Try browsing our catalog or ask about specific categories like sofas, chairs, tables, or beds.'}`,
        intent: null
      });
    }
  }

  // If user just said "show me products" or similar
  if (text.includes("show") || text.includes("list") || text.includes("browse")) {
    return res.json({
      reply: `🪑 I'd love to show you our furniture! Which category interests you?

- 🛋️ Sofas
- 🪑 Chairs  
- 🍽️ Tables (Dining, Coffee, Study)
- 🛏️ Beds & Mattresses
- 🗄️ Storage (Wardrobes, Cabinets)
- 🪞 Home Decor

You can also say things like "modern sofas under 30000" or "show me wooden dining tables"`,
      intent: "PRODUCT_CATEGORY"
    });
  }

  // Best sellers query
  if (text.includes("best") || text.includes("popular") || text.includes("trending")) {
    const products = await Product.find()
      .sort({ createdAt: -1 }) // Most recent or use any ranking field you have
      .select("title price image category")
      .limit(5);

    return res.json({
      reply: "⭐ Here are our popular items:",
      products: products.length > 0 ? products : undefined,
      intent: null
    });
  }

  // Generic product intent
  return res.json({
    reply: "🔍 What kind of furniture are you looking for? You can tell me the category, style, color, or budget!",
    intent: "PRODUCT_CATEGORY"
  });
}

/**
 * Handle category selection from previous prompt
 */
async function handleCategorySelection(text, priceLimit, res) {
  const categories = ["sofa", "chair", "table", "bed", "desk", "wardrobe", "cabinet", "storage"];
  const foundCategory = categories.find(cat => text.includes(cat));

  if (!foundCategory) {
    return res.json({
      reply: "🤔 I didn't catch that. Could you choose from: Sofa, Chair, Table, Bed, Wardrobe, or Cabinet?",
      intent: "PRODUCT_CATEGORY"
    });
  }

  const query = {
    category: { $regex: foundCategory, $options: "i" }
  };
  if (priceLimit) query.price = { $lte: priceLimit };

  const products = await Product.find(query)
    .select("title price image category")
    .limit(6);

  if (products.length === 0) {
    return res.json({
      reply: `❌ Sorry, we don't have any ${foundCategory}s ${priceLimit ? `under ₹${priceLimit}` : ''} right now. Would you like to see a different category?`,
      intent: null
    });
  }

  return res.json({
    reply: `🛋️ Here are our ${foundCategory}s${priceLimit ? ` under ₹${priceLimit}` : ''}:`,
    products,
    intent: null
  });
}

/**
 * Handle order-related queries
 * Works with your existing Order schema
 */
async function handleOrderQuery(text, orderIdentifier, userId, res) {
  // Track order status
  if (text.includes("track") || text.includes("where is") || text.includes("status")) {

    // If user is logged in, show their orders
    if (userId && !orderIdentifier) {
      const userOrders = await Order.find({ user: userId })
        .populate('orderItems.product', 'title image')
        .sort({ createdAt: -1 })
        .limit(5);

      if (userOrders.length > 0) {
        const orderList = userOrders.map(order =>
          `📦 Order from ${new Date(order.createdAt).toLocaleDateString()}\nStatus: ${order.orderStatus}\nTotal: ₹${order.totalPrice}`
        ).join('\n\n');

        return res.json({
          reply: `📦 **Your Recent Orders**\n\n${orderList}\n\nYou can check detailed status in the **My Orders** section.`,
          orders: userOrders.map(o => ({
            id: o._id,
            date: o.createdAt,
            status: o.orderStatus,
            total: o.totalPrice,
            items: o.orderItems.length
          })),
          intent: null
        });
      } else {
        return res.json({
          reply: "📦 You don't have any orders yet. Start shopping to place your first order!",
          intent: null
        });
      }
    }

    // If order identifier provided but user might not be logged in
    if (orderIdentifier) {
      return res.json({
        reply: "📦 To track a specific order, please log in and visit the **My Orders** section where you can see all your order details and tracking information.",
        intent: null
      });
    }

    // Ask for login or order details
    return res.json({
      reply: "📦 To track your orders:\n\n1. **If logged in:** Visit **My Orders** section to see all your orders\n2. **If not logged in:** Please log in first to access your order history\n\nNeed help? Contact support at 1800-XXX-XXXX",
      intent: null
    });
  }

  // Cancel order
  if (text.includes("cancel")) {
    return res.json({
      reply: `To cancel an order:
      
1. Go to **My Orders**
2. Select the order you want to cancel
3. Click "Cancel Order"

⚠️ Note: Orders can only be cancelled if status is "processing". Once shipped, cancellation is not possible. You can request a return after delivery.`,
      intent: null
    });
  }

  // Change delivery address
  if (text.includes("change") && text.includes("address")) {
    return res.json({
      reply: `To change your delivery address:

1. Go to **My Orders**
2. Select the order
3. Click "Edit Delivery Address"

⚠️ Address changes are only possible when order status is "processing". Once shipped, address cannot be modified.`,
      intent: null
    });
  }

  // Check payment status
  if (text.includes("payment")) {
    return res.json({
      reply: `💳 **Payment Status**

To check your payment status:
1. Go to **My Orders**
2. Select your order
3. View payment details

Payment statuses:
- **Pending:** Awaiting payment
- **Paid:** Payment successful
- **Failed:** Payment unsuccessful (please retry)

For payment issues, contact support at 1800-XXX-XXXX`,
      intent: null
    });
  }

  // Generic order help
  return res.json({
    reply: `📦 **Order Help**

I can assist with:
- Viewing your order history
- Checking order status
- Cancellation requests  
- Changing delivery address
- Payment status

Visit **My Orders** section for detailed information, or ask me specific questions!`,
    intent: null
  });
}

/**
 * Handle order tracking with order identifier
 */
async function handleOrderTracking(orderInput, userId, res) {
  if (!userId) {
    return res.json({
      reply: "🔒 Please log in to track your orders. You can access order tracking in the **My Orders** section after logging in.",
      intent: null
    });
  }

  // Find user's orders
  const userOrders = await Order.find({ user: userId })
    .populate('orderItems.product', 'title image')
    .sort({ createdAt: -1 })
    .limit(5);

  if (userOrders.length === 0) {
    return res.json({
      reply: "📦 You don't have any orders yet. Browse our products to make your first purchase!",
      intent: null
    });
  }

  const orderList = userOrders.map((order, idx) =>
    `${idx + 1}. Order from ${new Date(order.createdAt).toLocaleDateString()}\n   Status: ${order.orderStatus} | Total: ₹${order.totalPrice}\n   Items: ${order.orderItems.length} product(s)`
  ).join('\n\n');

  return res.json({
    reply: `📦 **Your Orders**\n\n${orderList}\n\nFor detailed tracking, visit **My Orders** section.`,
    orders: userOrders.map(o => ({
      id: o._id,
      date: o.createdAt,
      status: o.orderStatus,
      paymentStatus: o.paymentStatus,
      total: o.totalPrice,
      items: o.orderItems.length
    })),
    intent: null
  });
}

/**
 * Handle shipping & delivery queries
 */
async function handleShippingQuery(text, res) {
  const aiResponse = await callGemini(`
    You are a furniture store shipping expert.
    User question: "${text}"
    
    Provide accurate info about:
    - Standard delivery: 5-7 business days for most items
    - Large furniture: 7-10 business days
    - Free shipping on orders above ₹15,000
    - Assembly service available (mention user should check at checkout)
    - Delivery scheduling available (call support to arrange)
    
    Keep answer under 80 words, be specific and helpful.
  `);

  return res.json({
    reply: aiResponse || `🚚 **Shipping & Delivery**

- **Standard Delivery:** 5-7 business days
- **Large Furniture:** 7-10 business days  
- **Free Shipping:** On orders ₹15,000+
- **Assembly Service:** Available (check at checkout)

Track your order anytime in **My Orders** section!`,
    intent: null
  });
}

/**
 * Handle returns & refunds queries
 */
async function handleReturnQuery(text, res) {
  // Damaged/broken item
  if (text.includes("damage") || text.includes("broken") || text.includes("defect")) {
    return res.json({
      reply: `😟 Sorry to hear that! For damaged items:

1. Take photos of the damage
2. Go to **My Orders** → Select order → "Report Issue"
3. Upload photos and describe the problem
4. Our team will review within 24-48 hours

We'll arrange replacement or refund based on the issue. You can also contact support immediately at 1800-XXX-XXXX`,
      intent: null
    });
  }

  // Missing parts
  if (text.includes("missing") || text.includes("parts") || text.includes("screw")) {
    return res.json({
      reply: `🔧 Missing assembly parts?

1. Check the packaging thoroughly
2. Contact support with your order details
3. We'll ship the missing parts within 2-3 days (free of charge)

Call us at 1800-XXX-XXXX or email support@furniturestore.com`,
      intent: null
    });
  }

  // General return policy
  const aiResponse = await callGemini(`
    You are a furniture store return policy expert.
    User question: "${text}"
    
    Return Policy details:
    - 7-day return window from delivery
    - Items must be unused, in original packaging
    - Assembly voids return (except for defects)
    - Refunds processed within 7-10 business days
    - Free return pickup for large items
    - Mattresses: No return (hygiene policy) but 100-night trial with exchange
    
    Answer their specific question clearly in under 80 words.
  `);

  return res.json({
    reply: aiResponse || `↩️ **Return Policy**

- **Return Window:** 7 days from delivery
- **Condition:** Unused, original packaging
- **Refund Time:** 7-10 business days
- **Free Return Pickup:** Available

⚠️ Assembly voids returns (unless defective). Initiate returns through **My Orders** section.`,
    intent: null
  });
}

/**
 * Handle payment & offers queries
 */
async function handlePaymentQuery(text, res) {
  // Payment methods
  if (text.includes("payment") || text.includes("pay") || text.includes("method")) {
    return res.json({
      reply: `💳 **Payment Options**

We accept:
- Credit/Debit Cards (Visa, Mastercard, Amex)
- UPI (GPay, PhonePe, Paytm)
- Net Banking
- EMI options (3, 6, 9, 12 months)
- Cash on Delivery (COD) - Available
- Wallets (Paytm, Amazon Pay)

🔒 All payments are 100% secure (SSL encrypted)

You can select your preferred payment method at checkout!`,
      intent: null
    });
  }

  // Offers & discounts
  if (text.includes("offer") || text.includes("discount") || text.includes("coupon") || text.includes("sale")) {
    return res.json({
      reply: `🎉 **Current Offers**

- 🏷️ **FIRST10** - 10% off on first order
- 🏷️ **MEGA15** - 15% off on orders above ₹25,000
- 🎁 Free assembly on beds & wardrobes this month
- 💳 No-cost EMI on orders above ₹10,000

Check the **Offers** page for category-specific deals!
Coupons are automatically applied at checkout.`,
      intent: null
    });
  }

  // EMI options
  if (text.includes("emi") || text.includes("installment")) {
    return res.json({
      reply: `💰 **EMI Options**

Available on orders above ₹5,000:
- 3 months (0% interest)
- 6 months (0% interest)  
- 9 months (interest applicable)
- 12 months (interest applicable)

Supported Banks: HDFC, ICICI, SBI, Axis, Kotak

You'll see EMI options at checkout! Select your preferred tenure during payment.`,
      intent: null
    });
  }

  // Payment status
  if (text.includes("status") || text.includes("pending") || text.includes("failed")) {
    return res.json({
      reply: `💳 **Payment Status**

To check payment status:
1. Go to **My Orders**
2. Select your order
3. View payment details

Status types:
- **Pending:** Payment in process
- **Paid:** Payment successful ✅
- **Failed:** Please retry payment

For payment issues, contact: 1800-XXX-XXXX`,
      intent: null
    });
  }

  return res.json({
    reply: `💳 I can help with payments! Ask me about:
- Payment methods
- Current offers & coupons
- EMI options
- Payment status`,
    intent: null
  });
}

/**
 * Handle store information queries
 */
async function handleStoreInfoQuery(text, res) {
  // Showroom location
  if (text.includes("showroom") || text.includes("location") || text.includes("physical") || text.includes("visit")) {
    return res.json({
      reply: `📍 **Our Showrooms**

🏢 **Delhi Showroom**
Address: Sector 18, Noida, UP
Timings: 10 AM - 8 PM (All days)

🏢 **Mumbai Showroom**  
Address: Andheri West, Mumbai
Timings: 10 AM - 8 PM (All days)

Visit us to see our collection in person and get expert advice! Walk-ins welcome.`,
      intent: null
    });
  }

  // Contact support
  if (text.includes("contact") || text.includes("support") || text.includes("help") || text.includes("call")) {
    return res.json({
      reply: `📞 **Contact Us**

- **Phone:** 1800-XXX-XXXX (9 AM - 9 PM)
- **Email:** support@furniturestore.com
- **WhatsApp:** +91-XXXXX-XXXXX
- **Live Chat:** Available 24/7 (this chat!)

Average response time: Under 2 hours

How can I help you today?`,
      intent: null
    });
  }

  // Store hours
  if (text.includes("hours") || text.includes("timing") || text.includes("open")) {
    return res.json({
      reply: `🕒 **Store Hours**

- **Online Store:** 24/7 available
- **Physical Showrooms:** 10 AM - 8 PM (all days)
- **Customer Support:** 9 AM - 9 PM (phone), 24/7 (chat)

Shop anytime on our website!`,
      intent: null
    });
  }

  // Custom furniture
  if (text.includes("custom") || text.includes("made to order") || text.includes("personalized")) {
    return res.json({
      reply: `🛠️ **Custom Furniture**

Yes! We offer made-to-order furniture:

- Custom dimensions
- Choice of materials
- Color/finish customization
- Personalized designs

📞 Contact our design team at custom@furniturestore.com or call 1800-XXX-XXXX to discuss your requirements.

Lead time: 3-4 weeks`,
      intent: null
    });
  }

  return res.json({
    reply: `ℹ️ **Store Information**

Ask me about:
- Showroom locations
- Contact details  
- Store hours
- Custom furniture options`,
    intent: null
  });
}

/**
 * Handle product specification queries
 */
async function handleSpecificationQuery(text, res) {
  const aiResponse = await callGemini(`
    You are a furniture product specialist.
    User question: "${text}"
    
    If they're asking about dimensions, materials, weight capacity, care instructions, 
    or other specifications, provide helpful general information about furniture products.
    
    If it's about a specific product not in your knowledge, politely explain they can:
    1. Check the product page for full specifications
    2. Contact support for specific product details
    3. Visit a showroom to see it in person
    
    Keep response under 80 words, be helpful and professional.
  `);

  return res.json({
    reply: aiResponse || `🔍 **Product Specifications**

For detailed specs (dimensions, materials, weight capacity, etc.), please:

1. Check the product page - full details are listed there
2. Share the product name with me for specific info
3. Visit our showroom to see it in person

Need help with a specific product? Share its name!`,
    intent: null
  });
}

/**
 * Handle general furniture questions with AI
 */
async function handleGeneralQuestion(message, conversationHistory, res) {
  const context = conversationHistory.slice(-3).map(msg =>
    `${msg.role}: ${msg.content}`
  ).join('\n');

  const prompt = `
You are an expert furniture store assistant with deep knowledge of:
- Furniture types, styles, and materials
- Interior design and space planning
- Furniture care and maintenance
- Industry trends and best practices

User question: "${message}"

${context ? `Recent conversation:\n${context}` : ''}

Provide a helpful, accurate answer in 2-3 sentences. Be conversational, friendly, and knowledgeable.
If the question is outside furniture/home decor, politely redirect to furniture topics.
`;

  const aiReply = await callGemini(prompt);

  return res.json({
    reply: aiReply || "I'm here to help with furniture questions! Could you rephrase that?",
    intent: null
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Extract structured information from user input
 */
function extractUserIntent(text) {
  // Price extraction
  const priceMatch = text.match(/(?:under|below|₹|less than|rs\.?|upto)\s?(\d+)/i);
  const priceLimit = priceMatch ? Number(priceMatch[1]) : null;

  // Category detection
  const categories = {
    sofa: ['sofa', 'couch', 'settee'],
    chair: ['chair', 'seat', 'stool', 'recliner'],
    table: ['table', 'desk', 'dining table', 'coffee table', 'study table'],
    bed: ['bed', 'cot', 'mattress'],
    wardrobe: ['wardrobe', 'closet', 'almirah'],
    storage: ['cabinet', 'shelf', 'drawer', 'storage'],
    decor: ['mirror', 'lamp', 'curtain', 'rug']
  };

  let category = null;
  for (const [cat, keywords] of Object.entries(categories)) {
    if (keywords.some(kw => text.includes(kw))) {
      category = cat;
      break;
    }
  }

  // Color extraction
  const colors = ['black', 'white', 'brown', 'gray', 'beige', 'blue', 'green', 'red', 'teak', 'oak', 'walnut'];
  const color = colors.find(c => text.includes(c));

  // Material extraction
  const materials = ['wood', 'wooden', 'metal', 'leather', 'fabric', 'plastic', 'glass', 'marble'];
  const material = materials.find(m => text.includes(m));

  // Style extraction
  const styles = ['modern', 'contemporary', 'traditional', 'rustic', 'minimalist', 'industrial', 'vintage'];
  const style = styles.find(s => text.includes(s));

  // Order identifier (could be ID or just any mention)
  const orderMatch = text.match(/(?:order|ord|#)\s?([A-Z0-9]{6,})/i);
  const orderIdentifier = orderMatch ? orderMatch[1] : (text.includes("order") ? "mentioned" : null);

  return { priceLimit, category, color, material, style, orderIdentifier };
}

/**
 * Build MongoDB query from extracted info
 */
function buildProductQuery(extractedInfo) {
  const { priceLimit, category, color, material, style } = extractedInfo;
  const query = { $or: [] };

  if (category) {
    query.$or.push(
      { category: { $regex: category, $options: "i" } },
      { title: { $regex: category, $options: "i" } }
    );
  }

  if (color) {
    query.$or.push({ title: { $regex: color, $options: "i" } });
  }

  if (material) {
    query.$or.push({ description: { $regex: material, $options: "i" } });
  }

  if (style) {
    query.$or.push({ description: { $regex: style, $options: "i" } });
  }

  // If no specific search terms, return empty $or
  if (query.$or.length === 0) {
    delete query.$or;
  }

  if (priceLimit) {
    query.price = { $lte: priceLimit };
  }

  return query;
}

/**
 * Keyword detection helpers
 */
function hasProductKeywords(text) {
  const keywords = ['show', 'find', 'search', 'looking for', 'want', 'need', 'buy', 'purchase', 'browse'];
  return keywords.some(kw => text.includes(kw));
}

function hasOrderKeywords(text) {
  const keywords = ['order', 'track', 'status', 'delivery', 'shipped', 'cancel', 'my order'];
  return keywords.some(kw => text.includes(kw));
}

function hasShippingKeywords(text) {
  const keywords = ['ship', 'deliver', 'freight', 'courier', 'dispatch', 'assembly', 'installation'];
  return keywords.some(kw => text.includes(kw));
}

function hasReturnKeywords(text) {
  const keywords = ['return', 'refund', 'exchange', 'damage', 'defect', 'broken', 'missing parts', 'warranty'];
  return keywords.some(kw => text.includes(kw));
}

function hasPaymentKeywords(text) {
  const keywords = ['payment', 'pay', 'emi', 'offer', 'discount', 'coupon', 'price', 'cost', 'cod'];
  return keywords.some(kw => text.includes(kw));
}

function hasStoreInfoKeywords(text) {
  const keywords = ['showroom', 'location', 'address', 'contact', 'phone', 'email', 'hours', 'timing', 'custom'];
  return keywords.some(kw => text.includes(kw));
}

function hasSpecificationKeywords(text) {
  const keywords = ['dimension', 'size', 'material', 'weight', 'capacity', 'specification', 'made of', 'fabric', 'care'];
  return keywords.some(kw => text.includes(kw));
}

/**
 * Call Gemini AI for intelligent responses
 */
async function callGemini(prompt) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          }
        })
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply?.trim() || null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
}