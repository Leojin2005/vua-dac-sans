import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { FiPlus, FiEdit2, FiTrash2, FiSend } from "react-icons/fi";

const emptyForm = {
  code: "",
  discountType: "percent",
  discountValue: "",
  minOrder: 0,
  maxDiscount: 0,
  usageLimit: 100,
  expiresAt: "",
  isActive: true
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [sendModal, setSendModal] = useState(null); // coupon đang chọn để gửi
  const [sendTo, setSendTo] = useState("all");
  const [emailInput, setEmailInput] = useState("");
  const [sending, setSending] = useState(false);

  // ✅ FIX: dùng async + useEffect đúng cách
  const load = async () => {
    try {
      const res = await API.get("/coupons");
      setCoupons(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được danh sách mã giảm giá");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditing(null);
    setModal(true);
  };

  const openEdit = (c) => {
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrder: c.minOrder,
      maxDiscount: c.maxDiscount,
      usageLimit: c.usageLimit,
      expiresAt: c.expiresAt?.slice(0, 10),
      isActive: c.isActive
    });
    setEditing(c._id);
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/coupons/${editing}`, form);
        toast.success("Cập nhật thành công!");
      } else {
        await API.post("/coupons", form);
        toast.success("Thêm thành công!");
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa mã giảm giá này?")) return;
    try {
      await API.delete(`/coupons/${id}`);
      toast.success("Đã xóa");
      load();
    } catch {
      toast.error("Lỗi");
    }
  };

  const update = (k, v) => setForm({ ...form, [k]: v });

  const openSend = (c) => {
    setSendModal(c);
    setSendTo("all");
    setEmailInput("");
  };

  const handleSend = async () => {
    setSending(true);
    try {
      const payload = sendTo === "all"
        ? { sendTo: "all" }
        : { sendTo: "selected", emails: emailInput.split(",").map(e => e.trim()).filter(Boolean) };
      const { data } = await API.post(`/coupons/${sendModal._id}/send`, payload);
      toast.success(data.message);
      setSendModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi gửi email");
    }
    setSending(false);
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
            Quản lý mã giảm giá ({coupons.length})
          </h1>
          <button
            onClick={openAdd}
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <FiPlus /> Thêm mã
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Loại</th>
              <th>Giá trị</th>
              <th>Đơn tối thiểu</th>
              <th>Đã dùng</th>
              <th>Hết hạn</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id}>
                <td style={{ fontWeight: 600, fontFamily: "monospace" }}>
                  {c.code}
                </td>
                <td>
                  {c.discountType === "percent"
                    ? "Phần trăm"
                    : "Cố định"}
                </td>
                <td style={{ fontWeight: 600 }}>
                  {c.discountType === "percent"
                    ? `${c.discountValue}%`
                    : `${c.discountValue?.toLocaleString()}đ`}
                </td>
                <td>{c.minOrder?.toLocaleString()}đ</td>
                <td>
                  {c.usedCount}/{c.usageLimit}
                </td>
                <td style={{ fontSize: 13 }}>
                  {new Date(c.expiresAt).toLocaleDateString("vi")}
                </td>
                <td>
                  <span
                    className={`badge badge-${
                      c.isActive ? "completed" : "cancelled"
                    }`}
                  >
                    {c.isActive ? "Hoạt động" : "Tắt"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => openSend(c)}
                      style={{ padding: 6, background: "#f6ffed", borderRadius: 6, color: "#52c41a" }}
                      title="Gửi mã cho khách hàng"
                    >
                      <FiSend size={14} />
                    </button>
                    <button
                      onClick={() => openEdit(c)}
                      style={{ padding: 6, background: "#e6f7ff", borderRadius: 6, color: "#1890ff" }}
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      style={{ padding: 6, background: "#fff1f0", borderRadius: 6, color: "#ff4d4f" }}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sendModal && (
          <div className="modal-overlay" onClick={() => setSendModal(null)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
              <h2>Gửi mã giảm giá</h2>
              <div style={{ background: "#f6ffed", border: "1px solid #b7eb8f", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
                <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 18, color: "#389e0d" }}>{sendModal.code}</span>
                <span style={{ color: "#555", marginLeft: 12, fontSize: 14 }}>
                  Giảm {sendModal.discountType === "percent" ? `${sendModal.discountValue}%` : `${sendModal.discountValue?.toLocaleString()}đ`}
                </span>
              </div>

              <div className="form-group">
                <label>Gửi đến</label>
                <select value={sendTo} onChange={e => setSendTo(e.target.value)}>
                  <option value="all">Tất cả khách hàng (đã xác minh)</option>
                  <option value="selected">Khách hàng cụ thể</option>
                </select>
              </div>

              {sendTo === "selected" && (
                <div className="form-group">
                  <label>Danh sách email (phân cách bằng dấu phẩy)</label>
                  <textarea
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    placeholder="email1@gmail.com, email2@gmail.com"
                    rows={3}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, resize: "vertical" }}
                  />
                </div>
              )}

              <div className="modal-actions">
                <button onClick={() => setSendModal(null)} className="btn-secondary">Hủy</button>
                <button onClick={handleSend} className="btn-primary" disabled={sending}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <FiSend size={14} /> {sending ? "Đang gửi..." : "Gửi email"}
                </button>
              </div>
            </div>
          </div>
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
                {editing
                  ? "Sửa mã giảm giá"
                  : "Thêm mã giảm giá"}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Mã code</label>
                  <input
                    value={form.code}
                    onChange={(e) =>
                      update("code", e.target.value.toUpperCase())
                    }
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label>Loại giảm</label>
                    <select
                      value={form.discountType}
                      onChange={(e) =>
                        update("discountType", e.target.value)
                      }
                    >
                      <option value="percent">
                        Phần trăm (%)
                      </option>
                      <option value="fixed">
                        Số tiền cố định
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Giá trị</label>
                    <input
                      type="number"
                      value={form.discountValue}
                      onChange={(e) =>
                        update("discountValue", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label>Đơn tối thiểu (đ)</label>
                    <input
                      type="number"
                      value={form.minOrder}
                      onChange={(e) =>
                        update("minOrder", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Giảm tối đa (đ)</label>
                    <input
                      type="number"
                      value={form.maxDiscount}
                      onChange={(e) =>
                        update("maxDiscount", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label>Giới hạn sử dụng</label>
                    <input
                      type="number"
                      value={form.usageLimit}
                      onChange={(e) =>
                        update("usageLimit", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Ngày hết hạn</label>
                    <input
                      type="date"
                      value={form.expiresAt}
                      onChange={(e) =>
                        update("expiresAt", e.target.value)
                      }
                      required
                    />
                  </div>
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
                    {editing ? "Cập nhật" : "Thêm mới"}
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