const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Region", regionSchema);