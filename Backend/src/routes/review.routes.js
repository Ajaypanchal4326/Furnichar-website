import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  addReview,
  getProductReviews,
} from "../controllers/review.controller.js";
import Review from "../models/review.model.js"; 

const router = express.Router();

/* ================= RANDOM REVIEW ================= */
router.get("/random", async (req, res) => {
  try {
    const count = await Review.countDocuments();

    if (count === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    const random = Math.floor(Math.random() * count);

    const review = await Review.findOne()
      .skip(random)
      .populate("user", "name avatar")
      .populate("product", "title image price category");

    res.json(review);
  } catch (error) {
    console.error("Random Review Error:", error);
    res.status(500).json({ message: "Failed to fetch random review" });
  }
});

/* ================= PRODUCT REVIEWS ================= */
router.get("/:productId", getProductReviews);
router.post("/:productId", protect, addReview);

export default router;
