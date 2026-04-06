import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success("Đăng nhập thành công!");
      nav(data.role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi đăng nhập");
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: 420, margin: "40px auto" }}>
      <div className="card" style={{ padding: 40 }}>
        <h1 style={{ textAlign: "center", marginBottom: 8, fontSize: 24, color: "var(--primary-dark)" }}>Đăng nhập</h1>
        <p style={{ textAlign: "center", color: "#888", marginBottom: 28, fontSize: 14 }}>Chào mừng bạn quay lại Vua Đặc Sản</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Nhập email" required />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Nhập mật khẩu" required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%", padding: 12, fontSize: 16 }} disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
          <div style={{ textAlign: "right", marginTop: 10 }}>
            <Link to="/forgot-password" style={{ color: "var(--primary)", fontSize: 13 }}>Quên mật khẩu?</Link>
          </div>
        </form>
        <p style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: "#888" }}>
          Chưa có tài khoản? <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>Đăng ký</Link>
        </p>
      </div>
    </div>
  );
}
