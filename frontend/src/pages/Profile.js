import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", address: user?.address || "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { name: form.name, phone: form.phone, address: form.address };
      if (form.password) data.password = form.password;
      await updateProfile(data);
      toast.success("Cập nhật thành công!");
      setForm({ ...form, password: "" });
    } catch (err) { toast.error(err.response?.data?.message || "Lỗi cập nhật"); }
    setLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: 500 }}>
      <h1 className="page-title">Thông tin cá nhân</h1>
      <div className="card" style={{ padding: 32 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Email</label><input value={user?.email} disabled style={{ background: "#f5f5f5" }} /></div>
          <div className="form-group"><label>Họ tên</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="form-group"><label>Số điện thoại</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="form-group"><label>Địa chỉ</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
          <div className="form-group"><label>Mật khẩu mới (để trống nếu không đổi)</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
          <button type="submit" className="btn-primary" style={{ width: "100%", padding: 12 }} disabled={loading}>{loading ? "Đang lưu..." : "Cập nhật"}</button>
        </form>
      </div>
    </div>
  );
}
