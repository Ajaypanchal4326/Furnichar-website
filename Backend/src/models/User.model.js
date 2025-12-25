import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },

    otp: String,
otpExpiresAt: Date,
otpAttempts: { type: Number, default: 0 },
isVerified: { type: Boolean, default: false },

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
