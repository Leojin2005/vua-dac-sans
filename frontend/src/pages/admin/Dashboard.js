import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import API from "../../api/axios";
import { FiUsers, FiBox, FiShoppingBag, FiDollarSign, FiClock } from "react-icons/fi";

const statusMap = { pending: "Chờ xác nhận", confirmed: "Đã xác nhận", shipping: "Đang giao", completed: "Hoàn thành", cancelled: "Đã hủy", returned: "Trả hàng" };

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { API.get("/dashboard/stats").then(r => setStats(r.data)).catch(() => {}); }, []);

  if (!stats) return <div style={{ display: "flex" }}><AdminSidebar /><div className="loading" style={{ flex: 1 }}>Đang tải...</div></div>;

  const cards = [
    { label: "Doanh thu", value: `${(stats.totalRevenue / 1000000).toFixed(1)}M đ`, icon: FiDollarSign, color: "#52c41a" },
    { label: "Đơn hàng", value: stats.totalOrders, icon: FiShoppingBag, color: "#1890ff" },
    { label: "Sản phẩm", value: stats.totalProducts, icon: FiBox, color: "#faad14" },
    { label: "Khách hàng", value: stats.totalUsers, icon: FiUsers, color: "#722ed1" },
    { label: "Chờ duyệt", value: stats.pendingOrders, icon: FiClock, color: "#d4380d" },
  ];

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: 32 }}>
        <h1 className="page-title">Dashboard</h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          {cards.map((c, i) => (
            <div key={i} className="card" style={{ padding: 24, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${c.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <c.icon size={24} color={c.color} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: "#888" }}>{c.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{typeof c.value === 'number' ? c.value.toLocaleString() : c.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Revenue Chart */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Doanh thu theo tháng</h3>
            {stats.monthly?.length === 0 ? <p style={{ color: "#888" }}>Chưa có dữ liệu</p> : (
              <div>
                {stats.monthly.map(m => (
                  <div key={m._id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <span style={{ width: 70, fontSize: 13, color: "#888" }}>{m._id}</span>
                    <div style={{ flex: 1, background: "#f0f0f0", borderRadius: 4, height: 24 }}>
                      <div style={{ background: "var(--primary)", borderRadius: 4, height: 24, width: `${Math.min(100, (m.revenue / (stats.totalRevenue || 1)) * 100 * 2)}%`, display: "flex", alignItems: "center", paddingLeft: 8 }}>
                        <span style={{ fontSize: 11, color: "#fff", fontWeight: 600, whiteSpace: "nowrap" }}>{(m.revenue / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: "#888", width: 50 }}>{m.count} đơn</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Đơn hàng gần đây</h3>
            {stats.recentOrders?.map(o => (
              <div key={o._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0f0f0", fontSize: 13 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{o.user?.name || "N/A"}</div>
                  <span style={{ color: "#888" }}>#{o._id.slice(-6)}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 600 }}>{o.totalPrice?.toLocaleString()}đ</div>
                  <span className={`badge badge-${o.status}`}>{statusMap[o.status]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        {stats.topProducts?.length > 0 && (
          <div className="card" style={{ padding: 24, marginTop: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Sản phẩm bán chạy</h3>
            <table>
              <thead><tr><th>#</th><th>Sản phẩm</th><th>Số lượng bán</th><th>Doanh thu</th></tr></thead>
              <tbody>
                {stats.topProducts.map((p, i) => (
                  <tr key={p._id}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td>{p.totalSold}</td>
                    <td style={{ fontWeight: 600, color: "var(--primary)" }}>{p.revenue?.toLocaleString()}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}