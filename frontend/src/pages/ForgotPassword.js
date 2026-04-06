import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi gửi email");
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: 420, margin: "40px auto" }}>
      <div className="card" style={{ padding: 40 }}>
        <h1 style={{ textAlign: "center", marginBottom: 8, fontSize: 24, color: "var(--primary-dark)" }}>
          Quên mật khẩu
        </h1>
        <p style={{ textAlign: "center", color: "#888", marginBottom: 28, fontSize: 14 }}>
          Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu
        </p>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <p style={{ color: "#333", fontWeight: 600, marginBottom: 8 }}>Email đã được gửi!</p>
            <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>
              Vui lòng kiểm tra hộp thư của <strong>{email}</strong> và nhấn vào liên kết để đặt lại mật khẩu.
              Liên kết có hiệu lực trong 1 giờ.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="btn-primary"
              style={{ width: "100%", padding: 12, fontSize: 15 }}
            >
              Gửi lại email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Nhập email đã đăng ký"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", padding: 12, fontSize: 16 }}
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#888" }}>
          Nhớ mật khẩu rồi? <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
