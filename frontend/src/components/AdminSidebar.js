import { Link, useLocation } from "react-router-dom";
import { FiGrid, FiBox, FiShoppingBag, FiUsers, FiTag, FiMapPin, FiLayers, FiArrowLeft } from "react-icons/fi";

const links = [
  { to: "/admin", label: "Dashboard", icon: FiGrid },
  { to: "/admin/products", label: "Sản phẩm", icon: FiBox },
  { to: "/admin/orders", label: "Đơn hàng", icon: FiShoppingBag },
  { to: "/admin/users", label: "Người dùng", icon: FiUsers },
  { to: "/admin/coupons", label: "Mã giảm giá", icon: FiTag },
  { to: "/admin/regions", label: "Vùng miền", icon: FiMapPin },
  { to: "/admin/categories", label: "Danh mục", icon: FiLayers },
];

export default function AdminSidebar() {
  const { pathname } = useLocation();
  return (
    <div style={{ width: 240, background: "#1a1a2e", minHeight: "calc(100vh - 64px)", padding: "20px 0", flexShrink: 0 }}>
      <div style={{ padding: "0 20px 20px" }}>
        <Link to="/" style={{ color: "#8b8ba7", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
          <FiArrowLeft size={14} /> Về trang chủ
        </Link>
      </div>
      {links.map(({ to, label, icon: Icon }) => (
        <Link key={to} to={to} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "12px 24px", fontSize: 14,
          color: pathname === to ? "#fff" : "#8b8ba7", background: pathname === to ? "rgba(212,56,13,.3)" : "transparent",
          borderLeft: pathname === to ? "3px solid var(--primary)" : "3px solid transparent", fontWeight: pathname === to ? 600 : 400,
        }}>
          <Icon size={18} /> {label}
        </Link>
      ))}
    </div>
  );
}