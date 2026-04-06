const router = require("express").Router();
const Coupon = require("../models/Coupon");
const User = require("../models/User");
const { protect, admin } = require("../middleware/auth");
const { sendCouponEmail } = require("../utils/email");

router.get("/", protect, admin, async (req, res) => {
  const coupons = await Coupon.find().sort("-createdAt");
  res.json(coupons);
});

router.post("/", protect, admin, async (req, res) => {
  try {
    const c = await Coupon.create(req.body);
    res.status(201).json(c);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const c = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(c);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa mã giảm giá" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/coupons/:id/send — admin gửi mã cho khách hàng
router.post("/:id/send", protect, admin, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });

    const { sendTo, emails } = req.body;
    // sendTo: "all" | "selected"
    let recipients = [];

    if (sendTo === "all") {
      recipients = await User.find({ role: "customer", status: "active", isEmailVerified: true }).select("name email");
    } else if (sendTo === "selected" && emails?.length) {
      recipients = await User.find({ email: { $in: emails }, status: "active", isEmailVerified: true }).select("name email");
      // Thêm email không có tài khoản
      const existingEmails = recipients.map(u => u.email);
      emails.forEach(e => {
        if (!existingEmails.includes(e)) recipients.push({ name: "Khách hàng", email: e });
      });
    }

    if (!recipients.length) return res.status(400).json({ message: "Không có khách hàng nào để gửi" });

    let sent = 0, failed = 0;
    for (const r of recipients) {
      try {
        await sendCouponEmail(r.email, r.name, coupon);
        sent++;
        console.log("Gửi OK:", r.email);
      } catch (err) {
        failed++;
        console.error("Gửi FAIL:", r.email, err.message);
      }
    }

    res.json({ message: `Đã gửi thành công ${sent} email${failed ? `, thất bại ${failed}` : ""}`, sent, failed });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST validate coupon (public for logged in users)
router.post("/validate", protect, async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const cp = await Coupon.findOne({ code: code.toUpperCase(), isActive: true, expiresAt: { $gt: new Date() } });
    if (!cp) return res.status(404).json({ message: "Mã giảm giá không hợp lệ" });
    if (cp.usedCount >= cp.usageLimit) return res.status(400).json({ message: "Mã đã hết lượt sử dụng" });
    if (subtotal < cp.minOrder) return res.status(400).json({ message: `Đơn tối thiểu ${cp.minOrder.toLocaleString()}đ` });
    let discount = cp.discountType === "percent" ? subtotal * cp.discountValue / 100 : cp.discountValue;
    if (cp.maxDiscount > 0 && discount > cp.maxDiscount) discount = cp.maxDiscount;
    res.json({ discount, code: cp.code, discountType: cp.discountType, discountValue: cp.discountValue });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
