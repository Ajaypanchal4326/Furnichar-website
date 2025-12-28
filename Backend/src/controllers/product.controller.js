import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.model.js";
import UserActivity from "../models/UserActivity.model.js";

/* ================= CREATE PRODUCT (ADMIN) ================= */
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
    );

    const product = await Product.create({
      title,
      description,
      price,
      stock,
      category,
      image: result.secure_url,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Product creation failed" });
  }
};

/* ================= GET ALL PRODUCTS ================= */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/* ================= GET SINGLE PRODUCT (WITH VIEW TRACKING) ================= */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ TRACK PRODUCT VIEW (ONLY IF USER LOGGED IN)
    if (req.user) {
      await UserActivity.create({
        userId: req.user._id,
        productId: product._id,
        action: "view",
      });
    }

    res.json(product);
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

/* ================= UPDATE PRODUCT (ADMIN) ================= */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      );
      product.image = result.secure_url;
    }

    product.title = req.body.title ?? product.title;
    product.description = req.body.description ?? product.description;
    product.price = req.body.price ?? product.price;
    product.stock = req.body.stock ?? product.stock;
    product.category = req.body.category ?? product.category;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Product update failed" });
  }
};

/* ================= DELETE PRODUCT (ADMIN) ================= */
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Product deletion failed" });
  }
};
