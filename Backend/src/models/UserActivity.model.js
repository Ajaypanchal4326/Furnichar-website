// models/UserActivity.model.js
import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    action: {
      type: String,
      enum: ["view", "cart", "buy"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserActivity", userActivitySchema);
