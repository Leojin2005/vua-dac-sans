import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { toast } from "react-toastify";

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ fullName: user?.name || "", phone: user?.phone || "", address: user?.address || "", city: "", note: "" });
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal - discount + shippingFee;

  const applyCoupon = async () => {
    try {
      const { data } = await API.post("/coupons/validate", { code: couponCode, subtotal });
      setDiscount(data.discount);
      toast.success(`Áp dụng mã thành công! Giảm ${data.discount.toLocaleString()}đ`);
    } catch (err) { toast.error(err.response?.data?.message || "Mã không hợp lệ"); setDiscount(0); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error("Giỏ hàng trống");
    setLoading(true);
    try {
      const { data } = await API.post("/orders", {
        items: cart.map(i => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: form,
        paymentMethod: "COD",
        couponCode,
      });
      clearCart();
      toast.success("Đặt hàng thành công!");
      nav(`/orders/${data._id}`);
    } catch (err) { toast.error(err.response?.data?.message || "Lỗi đặt hàng"); }
    setLoading(false);
  };

  const update = (k, v) => setForm({ ...form, [k]: v });

  return (
    <div className="container">
      <h1 className="page-title">Đặt hàng</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
          <div>
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ marginBottom: 16 }}>Thông tin giao hàng</h3>
              <div className="form-group"><label>Họ tên</label><input value={form.fullName} onChange={e => update("fullName", e.target.value)} required /></div>
              <div className="form-group"><label>Số điện thoại</label><input value={form.phone} onChange={e => update("phone", e.target.value)} required /></div>
              <div className="form-group"><label>Địa chỉ</label><input value={form.address} onChange={e => update("address", e.target.value)} required /></div>
              <div className="form-group"><label>Thành phố</label><input value={form.city} onChange={e => update("city", e.target.value)} required /></div>
              <div className="form-group"><label>Ghi chú</label><textarea value={form.note} onChange={e => update("note", e.target.value)} rows={3} /></div>
            </div>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 16 }}>Sản phẩm đặt mua ({cart.length})</h3>
              {cart.map(i => (
                <div key={i._id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0", fontSize: 14 }}>
                  <span>{i.name} x{i.quantity}</span><span style={{ fontWeight: 600 }}>{(i.price * i.quantity).toLocaleString()}đ</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: 24, height: "fit-content", position: "sticky", top: 84 }}>
            <h3 style={{ marginBottom: 16 }}>Thanh toán</h3>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input placeholder="Mã giảm giá" value={couponCode} onChange={e => setCouponCode(e.target.value)} />
              <button type="button" onClick={applyCoupon} className="btn-secondary" style={{ whiteSpace: "nowrap" }}>Áp dụng</button>
            </div>
            <div style={{ fontSize: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span>Tạm tính:</span><span>{subtotal.toLocaleString()}đ</span></div>
              {discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "var(--secondary)" }}><span>Giảm giá:</span><span>-{discount.toLocaleString()}đ</span></div>}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span>Phí ship:</span><span>{shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString()}đ`}</span></div>
            </div>
            <div style={{ borderTop: "2px solid var(--border)", paddingTop: 12, marginTop: 8, display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 700 }}>
              <span>Tổng:</span><span style={{ color: "var(--primary)" }}>{total.toLocaleString()}đ</span>
            </div>
            <div style={{ marginTop: 16, padding: 12, background: "#f6ffed", borderRadius: 8, fontSize: 13, color: "#389e0d" }}>💰 Thanh toán khi nhận hàng (COD)</div>
            <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: 16, padding: 14, fontSize: 16 }} disabled={loading}>
              {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
