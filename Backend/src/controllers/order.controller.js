import Order from "../models/Order.model.js";
import User from "../models/User.model.js";

/* ================= CREATE ORDER ================= */
export const createOrder = async (req, res) => {
  const { orderItems, paymentMethod, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  // GET USER WITH ADDRESS
  const user = await User.findById(req.user.id);

  if (!user.address || !user.address.address) {
    return res
      .status(400)
      .json({ message: "Please add delivery address in profile" });
  }

  const order = await Order.create({
    user: req.user.id,
    orderItems,
    shippingAddress: user.address, 
    paymentMethod,
    totalPrice,
  });

  res.status(201).json(order);
};

/* ================= USER ORDERS ================= */
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(orders);
};

/* ================= SINGLE ORDER ================= */
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
};

/* ================= ADMIN: ALL ORDERS ================= */
export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "name email");
  res.json(orders);
};

/* ================= ADMIN: UPDATE ORDER ================= */
export const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.orderStatus = req.body.status || order.orderStatus;
  order.paymentStatus = req.body.paymentStatus || order.paymentStatus;

  const updated = await order.save();
  res.json(updated);
};
