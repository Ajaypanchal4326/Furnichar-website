import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/sendEmail.js";
import admin from "../config/firebase.js";

// REGISTER REQUEST (SEND OTP)
export const registerRequest = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt: Date.now() + 10 * 60 * 1000,
      otpAttempts: 0,
      isVerified: false,
    });

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Register Request Error:", err);
    res.status(500).json({ message: "OTP send failed" });
  }
};

// VERIFY OTP
export const registerVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // Too many attempts
    if (user.otpAttempts >= 5) {
      return res.status(403).json({
        message: "Too many attempts. Please resend OTP.",
      });
    }

    // Invalid or expired OTP
    if (
      user.otp !== otp ||
      !user.otpExpiresAt ||
      user.otpExpiresAt < Date.now()
    ) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // OTP is valid

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    user.otpAttempts = 0;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("OTP Verify Error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// RESEND OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, isVerified: false });
    if (!user) {
      return res.status(400).json({
        message: "User not found or already verified",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 min
    user.otpAttempts = 0;
    await user.save();

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error("Resend OTP Error:", err);
    res.status(500).json({ message: "Resend OTP failed" });
  }
};

// FORGOT PASSWORD – SEND OTP
export const forgotPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, isVerified: true });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    user.otpAttempts = 0;
    await user.save();

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Forgot password OTP error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// FORGOT PASSWORD – VERIFY OTP & RESET
export const forgotPasswordVerify = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otpAttempts >= 5) {
      return res.status(403).json({
        message: "Too many attempts. Please resend OTP",
      });
    }

    if (
      user.otp !== otp ||
      !user.otpExpiresAt ||
      user.otpExpiresAt < Date.now()
    ) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiresAt = null;
    user.otpAttempts = 0;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Password reset failed" });
  }
};


// FORGOT PASSWORD – RESEND OTP
export const forgotPasswordResendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, isVerified: true });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 min
    user.otpAttempts = 0;
    await user.save();

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error("Forgot resend OTP error:", err);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = await admin.auth().verifyIdToken(token);

    const { email, name } = decoded;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "GOOGLE_AUTH",
        isVerified: true,
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Google login error", err);
    res.status(401).json({ message: "Google authentication failed" });
  }
};
