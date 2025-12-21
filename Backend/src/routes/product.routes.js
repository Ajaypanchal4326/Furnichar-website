import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// ================= PUBLIC =================
router.get("/", getProducts);
router.get("/:id", getProductById);

// ================= ADMIN =================

// CREATE PRODUCT (WITH IMAGE)
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"), // 🔥 REQUIRED
  createProduct
);

// UPDATE PRODUCT (OPTIONAL IMAGE UPDATE)
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"), // 🔥 OPTIONAL but RECOMMENDED
  updateProduct
);

// DELETE PRODUCT
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
