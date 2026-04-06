import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FiShoppingCart, FiUser, FiLogOut, FiMenu } from "react-icons/fi";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); nav("/"); };

  return (
    <nav style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.06)", position: "sticky", top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: "var(--primary)" }}>🏮</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: "var(--primary-dark)" }}>Vua Đặc Sản</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }} className="nav-links">
          <Link to="/products" style={{ fontWeight: 500, fontSize: 15 }}>Sản phẩm</Link>
          {user?.role === "admin" && <Link to="/admin" style={{ fontWeight: 500, fontSize: 15, color: "var(--primary)" }}>Quản trị</Link>}

          <Link to="/cart" style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <FiShoppingCart size={22} />
            {totalItems > 0 && (
              <span style={{ position: "absolute", top: -8, right: -10, background: "var(--primary)", color: "#fff", borderRadius: "50%", width: 20, height: 20, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link to={user.role === "admin" ? "/admin" : "/my-orders"} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500 }}>
                <FiUser size={18} /> {user.name}
              </Link>
              <button onClick={handleLogout} style={{ background: "none", padding: 4, color: "#888" }} title="Đăng xuất"><FiLogOut size={18} /></button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary btn-sm">Đăng nhập</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
