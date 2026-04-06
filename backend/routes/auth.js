const router = require("express").Router();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../utils/email");

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || "vuadacsan_secret_key_2026", { expiresIn: "30d" });

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email đã được sử dụng" });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const user = await User.create({
      name, email, phone, password,
      status: "pending",
      isEmailVerified: false,
      emailVerificationToken: hashToken(rawToken),
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    try {
      await sendVerificationEmail(user, rawToken);
    } catch (emailErr) {
      console.error("Lỗi gửi email xác minh:", emailErr.message);
    }

    res.status(201).json({
      message: "Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.",
      email: user.email,
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    if (user.status === "locked") return res.status(403).json({ message: "Tài khoản đã bị khóa" });
    // Cho phép đăng nhập dù chưa xác minh, trả về isEmailVerified để frontend hiển thị cảnh báo
    if (!user.isEmailVerified && user.status === "pending") {
      user.status = "active";
      await user.save();
    }
    res.json({
      _id: user._id, name: user.name, email: user.email, phone: user.phone,
      address: user.address, role: user.role, isEmailVerified: user.isEmailVerified,
      token: genToken(user._id),
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/auth/verify-email/:token
router.get("/verify-email/:token", async (req, res) => {
  try {
    const hashed = hashToken(req.params.token);
    const user = await User.findOne({
      emailVerificationToken: hashed,
      emailVerificationExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Liên kết xác minh không hợp lệ hoặc đã hết hạn" });

    user.isEmailVerified = true;
    user.status = "active";
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: "Xác minh email thành công! Bạn có thể đăng nhập ngay bây giờ." });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/auth/resend-verification
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản với email này" });
    if (user.isEmailVerified) return res.status(400).json({ message: "Email này đã được xác minh" });

    const rawToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = hashToken(rawToken);
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    try { await sendVerificationEmail(user, rawToken); } catch (e) { console.error("Email lỗi:", e.message); }
    res.json({ message: "Email xác minh đã được gửi lại. Vui lòng kiểm tra hộp thư." });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản với email này" });

    const rawToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = hashToken(rawToken);
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 giờ
    await user.save();

    try { await sendPasswordResetEmail(user, rawToken); } catch (e) { console.error("Email lỗi:", e.message); }
    // Luôn trả về thông báo thành công để không lộ thông tin tài khoản
    res.json({ message: "Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư." });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/auth/reset-password/:token
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6)
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });

    const hashed = hashToken(req.params.token);
    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn" });

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập ngay bây giờ." });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/auth/profile
router.get("/profile", protect, async (req, res) => {
  const u = await User.findById(req.user._id).select("-password");
  res.json(u);
});

// PUT /api/auth/profile
router.put("/profile", protect, async (req, res) => {
  try {
    const u = await User.findById(req.user._id);
    u.name = req.body.name || u.name;
    u.phone = req.body.phone || u.phone;
    u.address = req.body.address || u.address;
    if (req.body.password) u.password = req.body.password;
    const updated = await u.save();
    res.json({ _id: updated._id, name: updated.name, email: updated.email, phone: updated.phone, address: updated.address, role: updated.role });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
