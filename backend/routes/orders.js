const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect, admin, customerOnly } = require("../middleware/auth");

// POST create order
router.post("/", protect, customerOnly, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: "Giỏ hàng trống" });

    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const prod = await Product.findById(item.product);
      if (!prod) return res.status(404).json({ message: `SP ${item.product} không tồn tại` });
      if (prod.stock < item.quantity) return res.status(400).json({ message: `${prod.name} chỉ còn ${prod.stock} sản phẩm` });
      orderItems.push({ product: prod._id, name: prod.name, price: prod.price, quantity: item.quantity, image: prod.image });
      subtotal += prod.price * item.quantity;
      prod.stock -= item.quantity;
      if (prod.stock === 0) prod.status = "out_of_stock";
      await prod.save();
    }

    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const totalPrice = subtotal + shippingFee;

    const order = await Order.create({
      user: req.user._id, items: orderItems, shippingAddress, paymentMethod,
      subtotal, discount: 0, shippingFee, totalPrice,
    });
    res.status(201).json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET my orders
router.get("/my", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
  res.json(orders);
});

// GET all orders (admin)
router.get("/", protect, admin, async (req, res) => {
  const { status } = req.query;
  let q = {};
  if (status) q.status = status;
  const orders = await Order.find(q).populate("user", "name email phone").sort("-createdAt");
  res.json(orders);
});

// GET single order
router.get("/:id", protect, async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email phone");
  if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin")
    return res.status(403).json({ message: "Không có quyền" });
  res.json(order);
});

// PUT update order status (admin)
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    const prev = order.status;
    order.status = req.body.status;

    // Restore stock on cancel
    if (req.body.status === "cancelled" && prev !== "cancelled") {
      for (const item of order.items) {
        const prod = await Product.findById(item.product);
        if (prod) { prod.stock += item.quantity; prod.status = "active"; await prod.save(); }
      }
    }
    await order.save();
    res.json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT cancel order (customer - only pending)
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Không có quyền" });
    if (order.status !== "pending") return res.status(400).json({ message: "Chỉ hủy được đơn đang chờ xác nhận" });
    order.status = "cancelled";
    for (const item of order.items) {
      const prod = await Product.findById(item.product);
      if (prod) { prod.stock += item.quantity; prod.status = "active"; await prod.save(); }
    }
    await order.save();
    res.json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
