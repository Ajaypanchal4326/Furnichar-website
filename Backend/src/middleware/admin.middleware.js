import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";
import User from "../models/User.model.js";

/* ===============================
   ADMIN MIDDLEWARE
================================ */
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

/* ===============================
   ADMIN ANALYTICS CONTROLLER
================================ */
export const getAdminAnalytics = async (req, res) => {
  try {
    // Total products
    const totalProducts = await Product.countDocuments();

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Total revenue (only paid orders)
    const revenueAgg = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    // Total customers (non-admin users)
    const totalCustomers = await User.countDocuments({
      role: { $ne: "admin" },
    });

    // Recent orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
        totalCustomers,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    res.status(500).json({ message: "Analytics fetch failed" });
  }
};
