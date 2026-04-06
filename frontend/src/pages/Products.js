import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get("search") || "";
  const region = searchParams.get("region") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    API.get("/regions").then(r => setRegions(r.data));
    API.get("/categories").then(r => setCategories(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (region) params.set("region", region);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    params.set("page", page);
    API.get(`/products?${params.toString()}`).then(r => {
      setProducts(r.data.products);
      setTotal(r.data.total);
      setPages(r.data.pages);
      setLoading(false);
    });
  }, [search, region, category, sort, page]);

  const setParam = (k, v) => {
    const p = new URLSearchParams(searchParams);
    if (v) p.set(k, v); else p.delete(k);
    if (k !== "page") p.delete("page");
    setSearchParams(p);
  };

  return (
    <div className="container">
      <h1 className="page-title">Sản phẩm đặc sản</h1>
      {/* Filters */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <input placeholder="Tìm kiếm sản phẩm..." value={search} onChange={e => setParam("search", e.target.value)}
          style={{ flex: 1, minWidth: 200 }} />
        <select value={region} onChange={e => setParam("region", e.target.value)} style={{ width: 180 }}>
          <option value="">Tất cả vùng miền</option>
          {regions.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
        </select>
        <select value={category} onChange={e => setParam("category", e.target.value)} style={{ width: 180 }}>
          <option value="">Tất cả danh mục</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select value={sort} onChange={e => setParam("sort", e.target.value)} style={{ width: 160 }}>
          <option value="">Mới nhất</option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
          <option value="name">Tên A-Z</option>
          <option value="rating">Đánh giá cao</option>
        </select>
      </div>
      <p style={{ color: "#888", marginBottom: 16, fontSize: 14 }}>Hiển thị {products.length} / {total} sản phẩm</p>

      {loading ? <div className="loading">Đang tải...</div> : products.length === 0 ? (
        <div className="empty">Không tìm thấy sản phẩm nào</div>
      ) : (
        <>
          <div className="grid-4">{products.map(p => <ProductCard key={p._id} product={p} />)}</div>
          {pages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
              {Array.from({ length: pages }, (_, i) => (
                <button key={i} onClick={() => setParam("page", String(i + 1))}
                  style={{ padding: "8px 14px", borderRadius: 6, background: Number(page) === i + 1 ? "var(--primary)" : "#fff", color: Number(page) === i + 1 ? "#fff" : "#333", border: "1px solid var(--border)" }}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
