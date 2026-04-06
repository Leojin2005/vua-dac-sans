import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    API.get("/products?limit=8").then(r => setProducts(r.data.products));
    API.get("/regions").then(r => setRegions(r.data));
  }, []);

  return (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #d4380d 0%, #ad2e0a 100%)", padding: "60px 0", color: "#fff", textAlign: "center" }}>
        <div className="container">
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>🏮 Vua Đặc Sản</h1>
          <p style={{ fontSize: 18, opacity: .9, maxWidth: 600, margin: "0 auto 24px" }}>
            Khám phá hương vị đặc sản vùng miền Việt Nam - Giao hàng tận nơi trên toàn quốc
          </p>
          <Link to="/products" className="btn-primary" style={{ background: "#fff", color: "var(--primary)", padding: "14px 36px", fontSize: 16, fontWeight: 700, borderRadius: 30 }}>
            Mua sắm ngay
          </Link>
        </div>
      </div>

      {/* Regions */}
      <div className="container" style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, textAlign: "center" }}>Đặc sản theo vùng miền</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 48 }}>
          {regions.map(r => (
            <Link key={r._id} to={`/products?region=${r._id}`} style={{
              padding: "10px 20px", background: "#fff", borderRadius: 20, boxShadow: "var(--shadow)",
              fontSize: 14, fontWeight: 500, color: "var(--primary-dark)", border: "1px solid var(--border)",
            }}>
              📍 {r.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Sản phẩm nổi bật</h2>
          <Link to="/products" style={{ color: "var(--primary)", fontWeight: 600, fontSize: 14 }}>Xem tất cả →</Link>
        </div>
        <div className="grid-4">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>

      {/* Why us */}
      <div className="container" style={{ marginTop: 60 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>Tại sao chọn Vua Đặc Sản?</h2>
        <div className="grid-3">
          {[
            { icon: "🛡️", title: "Chính gốc 100%", desc: "Cam kết sản phẩm đặc sản chính gốc từ các vùng miền" },
            { icon: "🚚", title: "Giao hàng toàn quốc", desc: "Miễn phí vận chuyển cho đơn hàng trên 500.000đ" },
            { icon: "💯", title: "Đổi trả dễ dàng", desc: "Đổi trả trong 7 ngày nếu sản phẩm không đúng mô tả" },
          ].map((i, idx) => (
            <div key={idx} className="card" style={{ padding: 32, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{i.icon}</div>
              <h3 style={{ marginBottom: 8, fontSize: 16 }}>{i.title}</h3>
              <p style={{ color: "#888", fontSize: 14 }}>{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
