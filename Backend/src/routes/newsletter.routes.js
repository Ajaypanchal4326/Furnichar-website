import express from "express";
import Newsletter from "../models/Newsletter.js";
import transporter from "../config/mailer.js";
import { createRateLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();
const newsletterRateLimiter = createRateLimiter({
  windowMs: Number(process.env.NEWSLETTER_RATE_LIMIT_WINDOW_MS) || 60 * 60 * 1000,
  max: Number(process.env.NEWSLETTER_RATE_LIMIT_MAX) || 5,
  message: "Too many subscribe attempts. Please try again later.",
  keyGenerator: (req) => {
    const email = typeof req.body?.email === "string" ? req.body.email.toLowerCase().trim() : "";
    return `${email || "anonymous"}::${req.ip}`;
  },
});

router.post("/subscribe", newsletterRateLimiter, async (req, res) => {
  try {
    const { email } = req.body;


    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    //Validate email 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Already subscribed" });
    }

    await Newsletter.create({ email });

    try {
      await transporter.sendMail({
        from: `"ShopEase" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to ShopEase Newsletter 🎉",
        html: `
          <h2>Welcome to ShopEase!</h2>
          <p>You’ll now receive:</p>
          <ul>
            <li>Exclusive offers</li>
            <li>New furniture arrivals</li>
            <li>Order updates</li>
          </ul>
        `,
      });
    } catch (mailError) {
      
      console.error("Email sending failed (ignored):", mailError.message);
    }

    
    return res.status(201).json({ message: "Subscribed successfully" });

  } catch (error) {
    console.error("Newsletter error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
