import express from "express";
import { chatHandler } from "../controllers/chat.controller.js";
import { createRateLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();
const chatRateLimiter = createRateLimiter({
  windowMs: Number(process.env.CHAT_RATE_LIMIT_WINDOW_MS) || 60 * 1000,
  max: Number(process.env.CHAT_RATE_LIMIT_MAX) || 10,
  message: "Chat limit reached. Please wait a moment and try again.",
});

router.post("/chat", chatRateLimiter, chatHandler);

export default router;
