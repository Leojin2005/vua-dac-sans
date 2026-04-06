import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editing, setEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ FIX: load async + useEffect đúng
  const load = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/categories");
      setItems(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được danh mục");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setForm({ name: "", description: "" });
    setEditing(null);
    setModal(true);
  };

  const openEdit = (c) => {
    setForm({ name: c.name, description: c.description });
    setEditing(c._id);
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/categories/${editing}`, form);
        toast.success("Cập nhật!");
      } else {
        await API.post("/categories", form);
        toast.success("Thêm thành công!");
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa danh mục này?")) return;
    try {
      await API.delete(`/categories/${id}`);
      toast.success("Đã xóa");
      load();
    } catch {
      toast.error("Lỗi");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: 32 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24
          }}
        >
          <h1 className="page-title" style={{ marginBottom: 0 }}>
            Quản lý danh mục ({items.length})
          </h1>
          <button
            onClick={openAdd}
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <FiPlus /> Thêm danh mục
          </button>
        </div>

        {isLoading ? (
          <p>Đang tải danh mục...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c._id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td>{c.description || "-"}</td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => openEdit(c)}
                      style={{
                        padding: 6,
                        background: "#e6f7ff",
                        borderRadius: 6,
                        color: "#1890ff"
                      }}
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      style={{
                        padding: 6,
                        background: "#fff1f0",
                        borderRadius: 6,
                        color: "#ff4d4f"
                      }}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}

        {modal && (
          <div
            className="modal-overlay"
            onClick={() => setModal(false)}
          >
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>
                {editing ? "Sửa danh mục" : "Thêm danh mục"}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Tên danh mục</label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description: e.target.value
                      })
                    }
                    rows={3}
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setModal(false)}
                    className="btn-secondary"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary">
                    {editing ? "Cập nhật" : "Thêm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}