import express from "express";
import { getMLRecommendations } from "../controllers/recommend.controller.js";

const router = express.Router();
router.get("/:productId", getMLRecommendations);

export default router;
