const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { protect, admin } = require("../middleware/auth");

router.get("/stats", protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "customer" });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.find({ status: "completed" });
    const totalRevenue = completedOrders.reduce((s, o) => s + o.totalPrice, 0);
    const pendingOrders = await Order.countDocuments({ status: "pending" });

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthly = await Order.aggregate([
      { $match: { status: "completed", createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, revenue: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Recent orders
    const recentOrders = await Order.find().populate("user", "name").sort("-createdAt").limit(5);

    // Top products
    const topProducts = await Order.aggregate([
      { $match: { status: "completed" } },
      { $unwind: "$items" },
      { $group: { _id: "$items.product", name: { $first: "$items.name" }, totalSold: { $sum: "$items.quantity" }, revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    res.json({ totalUsers, totalProducts, totalOrders, totalRevenue, pendingOrders, monthly, recentOrders, topProducts });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;