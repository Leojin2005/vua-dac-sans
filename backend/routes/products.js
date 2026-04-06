const router = require("express").Router();
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/auth");
const upload = require("../middleware/upload");

// GET all products (with search, filter)
router.get("/", async (req, res) => {
  try {
    const { search, region, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    let q = { status: { $ne: "discontinued" } };
    if (search) q.name = { $regex: search, $options: "i" };
    if (region) q.region = region;
    if (category) q.category = category;
    if (minPrice || maxPrice) {
      q.price = {};
      if (minPrice) q.price.$gte = Number(minPrice);
      if (maxPrice) q.price.$lte = Number(maxPrice);
    }
    let sortObj = { createdAt: -1 };
    if (sort === "price_asc") sortObj = { price: 1 };
    if (sort === "price_desc") sortObj = { price: -1 };
    if (sort === "name") sortObj = { name: 1 };
    if (sort === "rating") sortObj = { avgRating: -1 };

    const total = await Product.countDocuments(q);
    const products = await Product.find(q)
      .populate("region", "name")
      .populate("category", "name")
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const p = await Product.findById(req.params.id)
      .populate("region", "name")
      .populate("category", "name")
      .populate("ratings.user", "name");
    if (!p) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(p);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

const getImageUrl = (file) => {
  if (!file) return null;
  if (file.path && file.path.startsWith("http")) {
    // Đảm bảo luôn dùng https
    return file.path.replace("http://", "https://");
  }
  return `/uploads/${file.filename}`;
};

// POST create product (admin)
router.post("/", protect, admin, upload.single("image"), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = getImageUrl(req.file);
    const p = await Product.create(data);
    res.status(201).json(p);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT update product (admin)
router.put("/:id", protect, admin, upload.single("image"), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      console.log("FILE:", JSON.stringify(req.file));
      data.image = getImageUrl(req.file);
      console.log("IMAGE URL:", data.image);
    }
    const p = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(p);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE product (admin)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa sản phẩm" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST add review
router.post("/:id/reviews", protect, async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Không tìm thấy SP" });
    const already = p.ratings.find(r => r.user.toString() === req.user._id.toString());
    if (already) return res.status(400).json({ message: "Bạn đã đánh giá SP này" });
    p.ratings.push({ user: req.user._id, rating: Number(req.body.rating), comment: req.body.comment });
    p.numReviews = p.ratings.length;
    p.avgRating = p.ratings.reduce((a, r) => a + r.rating, 0) / p.numReviews;
    await p.save();
    res.status(201).json({ message: "Đã thêm đánh giá" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
