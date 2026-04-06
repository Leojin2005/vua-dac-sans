import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FiStar, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => { API.get(`/products/${id}`).then(r => setProduct(r.data)); }, [id]);

  const handleAdd = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, qty);
    toast.success("Đã thêm vào giỏ hàng!");
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/products/${id}/reviews`, { rating, comment });
      toast.success("Đã thêm đánh giá!");
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
      setComment("");
    } catch (err) { toast.error(err.response?.data?.message || "Lỗi"); }
  };

  if (!product) return <div className="loading">Đang tải...</div>;
  const p = product;

  return (
    <div className="container" style={{ marginTop: 20 }}>
      <div className="card" style={{ padding: 32 }}>
        <div className="grid-2">
          <div style={{ height: 400, background: "#f0f0f0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {p.image ? <img src={`http://localhost:5000${p.image}`} alt={p.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} /> : <span style={{ fontSize: 80 }}>🎁</span>}
          </div>
          <div>
            <div style={{ color: "var(--primary)", fontWeight: 600, fontSize: 14, marginBottom: 8 }}>📍 {p.region?.name}</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>{p.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              {[1,2,3,4,5].map(s => <FiStar key={s} size={16} fill={s <= p.avgRating ? "#faad14" : "none"} color={s <= p.avgRating ? "#faad14" : "#ddd"} />)}
              <span style={{ fontSize: 14, color: "#888" }}>({p.numReviews} đánh giá)</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--primary)", marginBottom: 16 }}>{p.price?.toLocaleString()}đ <span style={{ fontSize: 14, fontWeight: 400, color: "#888" }}>/ {p.unit}</span></div>
            <p style={{ color: "#555", lineHeight: 1.8, marginBottom: 20 }}>{p.description}</p>
            <div style={{ fontSize: 14, color: p.stock > 0 ? "var(--secondary)" : "#ff4d4f", marginBottom: 20, fontWeight: 600 }}>
              {p.stock > 0 ? `Còn ${p.stock} sản phẩm` : "Hết hàng"}
            </div>
            {p.stock > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: 8 }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: "10px 14px", background: "none" }}><FiMinus /></button>
                  <span style={{ padding: "0 16px", fontWeight: 600 }}>{qty}</span>
                  <button onClick={() => setQty(Math.min(p.stock, qty + 1))} style={{ padding: "10px 14px", background: "none" }}><FiPlus /></button>
                </div>
                <button onClick={handleAdd} className="btn-primary" style={{ padding: "12px 32px", fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <FiShoppingCart /> Thêm vào giỏ
                </button>
              </div>
            )}
            {p.category && <div style={{ marginTop: 16, fontSize: 13, color: "#888" }}>Danh mục: {p.category.name}</div>}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="card" style={{ marginTop: 24, padding: 32 }}>
        <h2 style={{ fontSize: 20, marginBottom: 20 }}>Đánh giá sản phẩm ({p.numReviews})</h2>
        {user && (
          <form onSubmit={handleReview} style={{ marginBottom: 24, padding: 20, background: "#fafafa", borderRadius: 8 }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontWeight: 500, fontSize: 14 }}>Đánh giá: </label>
              <select value={rating} onChange={e => setRating(Number(e.target.value))} style={{ width: 100, marginLeft: 8 }}>
                {[5,4,3,2,1].map(v => <option key={v} value={v}>{v} sao</option>)}
              </select>
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Viết nhận xét..." rows={3} style={{ marginBottom: 12 }} />
            <button type="submit" className="btn-primary btn-sm">Gửi đánh giá</button>
          </form>
        )}
        {p.ratings?.length === 0 ? <p style={{ color: "#888" }}>Chưa có đánh giá nào</p> : (
          <div>
            {p.ratings?.map((r, i) => (
              <div key={i} style={{ padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <strong style={{ fontSize: 14 }}>{r.user?.name || "Ẩn danh"}</strong>
                  <span style={{ fontSize: 12, color: "#888" }}>{new Date(r.createdAt).toLocaleDateString("vi")}</span>
                </div>
                <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
                  {[1,2,3,4,5].map(s => <FiStar key={s} size={12} fill={s <= r.rating ? "#faad14" : "none"} color={s <= r.rating ? "#faad14" : "#ddd"} />)}
                </div>
                <p style={{ fontSize: 14, color: "#555" }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
