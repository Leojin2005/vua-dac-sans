const router = require("express").Router();
const Category = require("../models/Category");
const { protect, admin } = require("../middleware/auth");

router.get("/", async (req, res) => {
  const cats = await Category.find().sort("name");
  res.json(cats);
});

router.post("/", protect, admin, async (req, res) => {
  try {
    const c = await Category.create(req.body);
    res.status(201).json(c);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const c = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(c);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa danh mục" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;