import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const { token } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error("Mật khẩu không khớp");
    setLoading(true);
    try {
      const { data } = await API.post(`/auth/reset-password/${token}`, { password: form.password });
      setSuccess(true);
      toast.success(data.message);
      setTimeout(() => nav("/login"), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Liên kết không hợp lệ hoặc đã hết hạn");
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: 420, margin: "40px auto" }}>
      <div className="card" style={{ padding: 40 }}>
        <h1 style={{ textAlign: "center", marginBottom: 8, fontSize: 24, color: "var(--primary-dark)" }}>
          Đặt lại mật khẩu
        </h1>
        <p style={{ textAlign: "center", color: "#888", marginBottom: 28, fontSize: 14 }}>
          Nhập mật khẩu mới cho tài khoản của bạn
        </p>

        {success ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <p style={{ color: "#333", fontWeight: 600, marginBottom: 8 }}>Đặt lại mật khẩu thành công!</p>
            <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>
              Tự động chuyển hướng đến trang đăng nhập...
            </p>
            <Link to="/login" className="btn-primary" style={{ display: "block", padding: 12, fontSize: 15, textAlign: "center", textDecoration: "none" }}>
              Đăng nhập ngay
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Mật khẩu mới</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Tối thiểu 6 ký tự"
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label>Xác nhận mật khẩu mới</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Nhập lại mật khẩu"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", padding: 12, fontSize: 16 }}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#888" }}>
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>← Quay lại đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
