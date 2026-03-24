import express from "express";
import {
  registerRequest,
  registerVerify,
  login,
} from "../controllers/auth.controller.js";
import {
  forgotPasswordRequest,
  forgotPasswordVerify,
} from "../controllers/auth.controller.js";

import User from "../models/User.model.js";
import { protect } from "../middleware/auth.middleware.js";
import { resendOtp } from "../controllers/auth.controller.js";
import { forgotPasswordResendOtp } from "../controllers/auth.controller.js";
import { googleLogin } from "../controllers/auth.controller.js";
import { createRateLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

const authRateLimiter = createRateLimiter({
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 20,
  message: "Too many authentication attempts. Please try again later.",
  keyGenerator: (req) => {
    const email = typeof req.body?.email === "string" ? req.body.email.toLowerCase().trim() : "";
    return `${email || "anonymous"}::${req.ip}`;
  },
});

router.post("/register-request", authRateLimiter, registerRequest);
router.post("/register-verify", authRateLimiter, registerVerify);
router.post("/login", authRateLimiter, login);
router.post("/resend-otp", authRateLimiter, resendOtp);
router.post("/forgot-password-request", authRateLimiter, forgotPasswordRequest);
router.post("/forgot-password-verify", authRateLimiter, forgotPasswordVerify);
router.post("/forgot-password-resend-otp", authRateLimiter, forgotPasswordResendOtp);
router.post("/google-login", authRateLimiter, googleLogin);

router.put("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.address = req.body.address;
  await user.save();
  res.json({ message: "Profile updated", address: user.address });
});

export default router;
