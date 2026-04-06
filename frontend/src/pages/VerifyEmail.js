import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/axios";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;
    API.get(`/auth/verify-email/${token}`)
      .then(({ data }) => {
        setStatus("success");
        setMessage(data.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Có lỗi xảy ra khi xác minh email");
      });
  }, [token]);

  return (
    <div className="container" style={{ maxWidth: 480, margin: "60px auto" }}>
      <div className="card" style={{ padding: 48, textAlign: "center" }}>
        {status === "loading" && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <h2 style={{ color: "var(--primary-dark)" }}>Đang xác minh email...</h2>
            <p style={{ color: "#888" }}>Vui lòng đợi trong giây lát.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
            <h2 style={{ color: "#27ae60", marginBottom: 8 }}>Xác minh thành công!</h2>
            <p style={{ color: "#555", marginBottom: 28, fontSize: 15 }}>{message}</p>
            <Link
              to="/login"
              className="btn-primary"
              style={{ display: "inline-block", padding: "12px 32px", fontSize: 15, textDecoration: "none" }}
            >
              Đăng nhập ngay
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ fontSize: 64, marginBottom: 16 }}>❌</div>
            <h2 style={{ color: "#e74c3c", marginBottom: 8 }}>Xác minh thất bại</h2>
            <p style={{ color: "#555", marginBottom: 24, fontSize: 15 }}>{message}</p>
            <ResendVerification />
          </>
        )}
      </div>
    </div>
  );
}

function ResendVerification() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/resend-verification", { email });
      setSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi gửi lại email");
    }
    setLoading(false);
  };

  if (sent) {
    return <p style={{ color: "#27ae60", fontWeight: 600 }}>Email xác minh đã được gửi lại! Vui lòng kiểm tra hộp thư.</p>;
  }

  return (
    <div style={{ marginTop: 8 }}>
      <p style={{ color: "#888", fontSize: 14, marginBottom: 12 }}>Gửi lại email xác minh:</p>
      <form onSubmit={handleResend} style={{ display: "flex", gap: 8 }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Nhập email của bạn"
          required
          style={{ flex: 1, padding: "10px 14px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14 }}
        />
        <button type="submit" className="btn-primary" style={{ padding: "10px 20px", fontSize: 14 }} disabled={loading}>
          {loading ? "..." : "Gửi lại"}
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14, color: "#888" }}>
        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>← Quay lại đăng nhập</Link>
      </p>
    </div>
  );
}
