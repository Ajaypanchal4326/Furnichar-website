import express from "express";
import Newsletter from "../models/Newsletter.js";
import transporter from "../config/mailer.js";

const router = express.Router();

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Already subscribed" });
    }

    await Newsletter.create({ email });

    // Confirmation Email
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

    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
