const router = require("express").Router();
const User = require("../models/User");
const { protect, admin } = require("../middleware/auth");

// GET all users (admin)
router.get("/", protect, admin, async (req, res) => {
  const users = await User.find().select("-password").sort("-createdAt");
  res.json(users);
});

// PUT update user status (admin)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: "Không tìm thấy user" });
    u.role = req.body.role || u.role;
    u.status = req.body.status || u.status;
    u.name = req.body.name || u.name;
    const updated = await u.save();
    res.json(updated);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE user (admin)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa người dùng" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;