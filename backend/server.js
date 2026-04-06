const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const fs = require("fs");

dotenv.config();
connectDB();

// Tạo thư mục uploads nếu chưa có (fallback khi không dùng Cloudinary)
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/regions", require("./routes/regions"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/coupons", require("./routes/coupons"));
app.use("/api/dashboard", require("./routes/dashboard"));

app.get("/", (req, res) => res.send("Vua Đặc Sản API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
