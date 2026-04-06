import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, subtotal } = useCart();

  if (cart.length === 0) return (
    <div className="container" style={{ textAlign: "center", padding: 80 }}>
      <span style={{ fontSize: 60 }}>🛒</span>
      <h2 style={{ margin: "16px 0" }}>Giỏ hàng trống</h2>
      <Link to="/products" className="btn-primary" style={{ display: "inline-block", marginTop: 12 }}>Mua sắm ngay</Link>
    </div>
  );

  return (
    <div className="container">
      <h1 className="page-title">Giỏ hàng ({cart.length} sản phẩm)</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
        <div>
          {cart.map(item => (
            <div key={item._id} className="card" style={{ display: "flex", gap: 16, padding: 16, marginBottom: 12 }}>
              <div style={{ width: 100, height: 100, background: "#f0f0f0", borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.image ? <img src={`http://localhost:5000${item.image}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} /> : <span style={{ fontSize: 32 }}>🎁</span>}
              </div>
              <div style={{ flex: 1 }}>
                <Link to={`/products/${item._id}`} style={{ fontWeight: 600, fontSize: 15 }}>{item.name}</Link>
                <div style={{ color: "var(--primary)", fontWeight: 700, fontSize: 16, margin: "6px 0" }}>{item.price?.toLocaleString()}đ</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ padding: 4, background: "#f0f0f0", borderRadius: 4 }}><FiMinus size={14} /></button>
                  <span style={{ fontWeight: 600, minWidth: 30, textAlign: "center" }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ padding: 4, background: "#f0f0f0", borderRadius: 4 }}><FiPlus size={14} /></button>
                  <button onClick={() => removeFromCart(item._id)} style={{ marginLeft: "auto", padding: 6, background: "none", color: "#ff4d4f" }}><FiTrash2 size={16} /></button>
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, whiteSpace: "nowrap" }}>{(item.price * item.quantity).toLocaleString()}đ</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 24, height: "fit-content", position: "sticky", top: 84 }}>
          <h3 style={{ marginBottom: 16 }}>Tổng đơn hàng</h3>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
            <span>Tạm tính:</span><span style={{ fontWeight: 600 }}>{subtotal.toLocaleString()}đ</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
            <span>Phí vận chuyển:</span><span style={{ fontWeight: 600 }}>{subtotal >= 500000 ? "Miễn phí" : "30.000đ"}</span>
          </div>
          <div style={{ borderTop: "2px solid var(--border)", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700 }}>
            <span>Tổng:</span><span style={{ color: "var(--primary)" }}>{(subtotal + (subtotal >= 500000 ? 0 : 30000)).toLocaleString()}đ</span>
          </div>
          <Link to="/checkout" className="btn-primary" style={{ display: "block", textAlign: "center", marginTop: 20, padding: 14, fontSize: 16 }}>Tiến hành đặt hàng</Link>
        </div>
      </div>
    </div>
  );
}
