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

const router = express.Router();

router.post("/register-request", registerRequest);
router.post("/register-verify", registerVerify);
router.post("/login", login);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password-request", forgotPasswordRequest);
router.post("/forgot-password-verify", forgotPasswordVerify);
router.post("/forgot-password-resend-otp", forgotPasswordResendOtp);
router.post("/google-login", googleLogin);

router.put("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.address = req.body.address;
  await user.save();
  res.json({ message: "Profile updated", address: user.address });
});

export default router;
