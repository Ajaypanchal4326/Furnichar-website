import User from "../models/User.model.js";

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.phone = req.body.phone || user.phone;
  user.address = req.body.address || user.address;
  user.city = req.body.city || user.city;
  user.state = req.body.state || user.state;
  user.pincode = req.body.pincode || user.pincode;

  await user.save();
  res.json(user);
};
