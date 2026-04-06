export default function Footer() {
  return (
    <footer style={{ background: "#1a1a2e", color: "#ccc", padding: "40px 0 20px" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32, marginBottom: 32 }}>
          <div>
            <h3 style={{ color: "#fff", marginBottom: 12, fontSize: 18 }}>🏮 Vua Đặc Sản</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>Công ty TNHH Đức Quyền - Chuyên cung cấp đặc sản vùng miền chính gốc trên toàn quốc.</p>
          </div>
          <div>
            <h4 style={{ color: "#fff", marginBottom: 12 }}>Liên hệ</h4>
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>📍 Hà Nội, Việt Nam<br />📞 0912 345 678<br />✉️ contact@vuadacsan.vn</p>
          </div>
          <div>
            <h4 style={{ color: "#fff", marginBottom: 12 }}>Chính sách</h4>
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>Chính sách đổi trả<br />Chính sách vận chuyển<br />Bảo mật thông tin</p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #333", paddingTop: 16, textAlign: "center", fontSize: 13 }}>
          © 2026 Vua Đặc Sản - Bùi Đức Quyền. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
