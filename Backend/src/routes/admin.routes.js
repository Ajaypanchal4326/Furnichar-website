import express from "express";
import { protect} from "../middleware/auth.middleware.js";
import {adminOnly , getAdminAnalytics } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/analytics", protect, adminOnly, getAdminAnalytics);

export default router;
