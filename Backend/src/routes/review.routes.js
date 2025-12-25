import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  addReview,
  getProductReviews,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/:productId", getProductReviews);
router.post("/:productId", protect, addReview);

export default router;
