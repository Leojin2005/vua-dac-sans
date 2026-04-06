import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

const empty = {
  name: "",
  description: "",
  price: "",
  stock: "",
  unit: "Hộp",
  region: "",
  category: "",
  status: "active"
};

const productStatusOptions = ["active", "hidden", "out_of_stock", "discontinued"];


export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // ✅ FIX toàn bộ API
  const load = async () => {
    try {
      const [pRes, rRes, cRes] = await Promise.all([
        API.get("/products?limit=100"),
        API.get("/regions"),
        API.get("/categories")
      ]);

      setProducts(pRes.data.products);
      setRegions(rRes.data);
      setCategories(cRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi tải dữ liệu");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setForm(empty);
    setEditing(null);
    setImageFile(null);
    setModal(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      unit: p.unit,
      region: p.region?._id || "",
      category: p.category?._id || "",
      status: p.status
    });
    setEditing(p._id);
    setImageFile(null);
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach(k => fd.append(k, form[k]));
    if (imageFile) fd.append("image", imageFile);

    try {
      if (editing) {
        await API.put(`/products/${editing}`, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Cập nhật thành công!");
      } else {
        await API.post("/products", fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Thêm sản phẩm thành công!");
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success("Đã xóa");
      load();
    } catch {
      toast.error("Lỗi xóa");
    }
  };

  const update = (k, v) => setForm({ ...form, [k]: v });

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 className="page-title" style={{ marginBottom: 0 }}>
            Quản lý sản phẩm ({products.length})
          </h1>
          <button onClick={openAdd} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FiPlus /> Thêm sản phẩm
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên SP</th>
                <th>Vùng miền</th>
                <th>Giá</th>
                <th>Kho</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>
                    <div style={{ width: 50, height: 50, background: "#f0f0f0", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      {p.image ? (
                        <img
                          src={`http://localhost:5000${p.image}`}
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : "🎁"}
                    </div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td>{p.region?.name || "-"}</td>
                  <td style={{ fontWeight: 600 }}>{p.price?.toLocaleString()}đ</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={`badge badge-${p.status === "active" ? "completed" : "cancelled"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEdit(p)}><FiEdit2 /></button>
                      <button onClick={() => handleDelete(p._id)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modal && (
          <div className="modal-overlay" onClick={() => setModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{editing ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Tên sản phẩm</label>
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label>Giá</label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => update("price", Number(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Kho</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => update("stock", Number(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Đơn vị</label>
                  <input
                    value={form.unit}
                    onChange={(e) => update("unit", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Vùng miền</label>
                  <select value={form.region} onChange={(e) => update("region", e.target.value)} required>
                    <option value="">Chọn vùng miền</option>
                    {regions.map((r) => (
                      <option key={r._id} value={r._id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Danh mục</label>
                  <select value={form.category} onChange={(e) => update("category", e.target.value)} required>
                    <option value="">Chọn danh mục</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Trạng thái</label>
                  <select value={form.status} onChange={(e) => update("status", e.target.value)}>
                    {productStatusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Ảnh</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setModal(false)} className="btn-secondary">Hủy</button>
                  <button type="submit" className="btn-primary">{editing ? "Cập nhật" : "Thêm"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
