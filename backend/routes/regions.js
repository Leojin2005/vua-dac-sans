const router = require("express").Router();
const Region = require("../models/Region");
const { protect, admin } = require("../middleware/auth");

router.get("/", async (req, res) => {
  const regions = await Region.find().sort("name");
  res.json(regions);
});

router.post("/", protect, admin, async (req, res) => {
  try {
    const r = await Region.create(req.body);
    res.status(201).json(r);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const r = await Region.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(r);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await Region.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa vùng miền" });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
