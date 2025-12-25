import Review from "../models/review.model.js";
import Product from "../models/Product.model.js";

export const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.productId;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await Review.findOneAndUpdate(
    { product: productId, user: req.user._id },
    { rating, comment },
    { upsert: true, new: true }
  );

  const reviews = await Review.find({ product: productId });

  const avg =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  product.rating = avg.toFixed(1);
  product.numReviews = reviews.length;
  await product.save();

  res.status(201).json({ message: "Review saved" });
};

export const getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.json(reviews);
};
