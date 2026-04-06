const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image: { type: String, default: "" },
  region: { type: mongoose.Schema.Types.ObjectId, ref: "Region" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  unit: { type: String, default: "Hộp" },
  status: { type: String, enum: ["active", "hidden", "out_of_stock", "discontinued"], default: "active" },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  avgRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);