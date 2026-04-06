const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  price: Number,
  quantity: { type: Number, required: true },
  image: String,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    note: String,
  },
  paymentMethod: { type: String, default: "COD" },
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  couponCode: { type: String, default: "" },
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipping", "completed", "cancelled", "returned"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);