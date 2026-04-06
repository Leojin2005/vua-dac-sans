import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { FiShoppingCart, FiStar } from "react-icons/fi";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const p = product;

  const handleAdd = (e) => {
    e.preventDefault();
    if (p.stock <= 0) return toast.error("Sản phẩm hết hàng");
    addToCart(p);
    toast.success("Đã thêm vào giỏ hàng!");
  };

  return (
    <Link to={`/products/${p._id}`} className="card" style={{ transition: "transform .2s", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 200, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {p.image ? (
          <img src={`http://localhost:5000${p.image}`} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 48 }}>🎁</span>
        )}
      </div>
      <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, marginBottom: 4 }}>
          {p.region?.name || "Việt Nam"}
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 }}>{p.name}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <FiStar key={s} size={12} fill={s <= (p.avgRating || 0) ? "#faad14" : "none"} color={s <= (p.avgRating || 0) ? "#faad14" : "#ddd"} />
          ))}
          <span style={{ fontSize: 12, color: "#888", marginLeft: 4 }}>({p.numReviews || 0})</span>
        </div>
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "var(--primary)" }}>{p.price?.toLocaleString()}đ</span>
          <button onClick={handleAdd} className="btn-primary btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }} disabled={p.stock <= 0}>
            <FiShoppingCart size={14} /> {p.stock <= 0 ? "Hết hàng" : "Mua"}
          </button>
        </div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>Kho: {p.stock} {p.unit}</div>
      </div>
    </Link>
  );
}
