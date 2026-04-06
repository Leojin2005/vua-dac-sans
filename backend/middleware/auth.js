const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "vuadacsan_secret_key_2026");
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (e) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
  }
  if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  res.status(403).json({ message: "Không có quyền truy cập" });
};

module.exports = { protect, admin };