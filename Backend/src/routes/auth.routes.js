import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import User from "../models/User.model.js";
import { protect } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.id);

  user.address = req.body.address;
  await user.save();

  res.json({ message: "Profile updated", address: user.address });
});

export default router;
