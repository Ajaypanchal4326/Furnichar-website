import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";
import User from "../models/User.model.js";

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

export const getAdminAnalytics = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const paidRevenueAgg = await Order.aggregate([
      {
        $match: {
          $or: [
            { isPaid: true },
            { paymentStatus: { $in: ["paid", "completed", "success", "successful"] } },
            { orderStatus: { $in: ["delivered", "completed"] } },
          ],
        },
      },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);

    let totalRevenue = paidRevenueAgg[0]?.totalRevenue || 0;

    // Fallback for COD-heavy stores where paymentStatus stays "pending"
    if (!totalRevenue) {
      const grossRevenueAgg = await Order.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
      ]);
      totalRevenue = grossRevenueAgg[0]?.totalRevenue || 0;
    }

    const totalCustomers = await User.countDocuments({
      role: { $ne: "admin" },
    });

    const lowStockProducts = await Product.countDocuments({
      stock: { $lte: 5 },
      isActive: true,
    });

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
        totalCustomers,
        lowStockProducts,
      },
      recentOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Analytics fetch failed" });
  }
};
