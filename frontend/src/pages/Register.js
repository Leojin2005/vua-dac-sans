import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error("Mật khẩu không khớp");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", {
        name: form.name, email: form.email, phone: form.phone, password: form.password,
      });
      setRegisteredEmail(form.email);
      setRegistered(true);
      toast.success(data.message || "Đăng ký thành công!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi đăng ký");
    }
    setLoading(false);
  };

  const update = (k, v) => setForm({ ...form, [k]: v });

  if (registered) {
    return (
      <div className="container" style={{ maxWidth: 480, margin: "40px auto" }}>
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📧</div>
          <h2 style={{ color: "var(--primary-dark)", marginBottom: 8 }}>Kiểm tra hộp thư của bạn!</h2>
          <p style={{ color: "#555", marginBottom: 8, fontSize: 15 }}>
            Chúng tôi đã gửi email xác minh đến:
          </p>
          <p style={{ color: "var(--primary)", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>
            {registeredEmail}
          </p>
          <p style={{ color: "#888", fontSize: 14, marginBottom: 28 }}>
            Nhấn vào liên kết trong email để kích hoạt tài khoản. Liên kết có hiệu lực trong <strong>24 giờ</strong>.
          </p>
          <Link
            to="/login"
            className="btn-primary"
            style={{ display: "inline-block", padding: "12px 32px", fontSize: 15, textDecoration: "none" }}
          >
            Đến trang đăng nhập
          </Link>
          <p style={{ marginTop: 16, fontSize: 13, color: "#aaa" }}>
            Không nhận được email? Kiểm tra thư mục spam hoặc{" "}
            <Link to="/login" style={{ color: "var(--primary)" }}>đăng nhập để gửi lại</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 420, margin: "40px auto" }}>
      <div className="card" style={{ padding: 40 }}>
        <h1 style={{ textAlign: "center", marginBottom: 8, fontSize: 24, color: "var(--primary-dark)" }}>Đăng ký</h1>
        <p style={{ textAlign: "center", color: "#888", marginBottom: 28, fontSize: 14 }}>Tạo tài khoản mới tại Vua Đặc Sản</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Họ tên</label><input value={form.name} onChange={e => update("name", e.target.value)} required /></div>
          <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => update("email", e.target.value)} required /></div>
          <div className="form-group"><label>Số điện thoại</label><input value={form.phone} onChange={e => update("phone", e.target.value)} /></div>
          <div className="form-group"><label>Mật khẩu</label><input type="password" value={form.password} onChange={e => update("password", e.target.value)} required minLength={6} /></div>
          <div className="form-group"><label>Xác nhận mật khẩu</label><input type="password" value={form.confirmPassword} onChange={e => update("confirmPassword", e.target.value)} required /></div>
          <button type="submit" className="btn-primary" style={{ width: "100%", padding: 12, fontSize: 16 }} disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#888" }}>
          Đã có tài khoản? <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
