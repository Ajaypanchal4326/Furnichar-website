import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },

    // 🔥 DELIVERY DETAILS
    address: {
      address: String,
      city: String,
      postalCode: String,
      country: String,
      phone: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
