import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { FiLock, FiUnlock, FiTrash2 } from "react-icons/fi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được danh sách người dùng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleLock = async (u) => {
    const status = u.status === "locked" ? "active" : "locked";
    try { await API.put(`/users/${u._id}`, { status }); toast.success(status === "locked" ? "Đã khóa" : "Đã mở khóa"); load(); }
    catch { toast.error("Lỗi"); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Xóa người dùng này?")) return;
    try { await API.delete(`/users/${id}`); toast.success("Đã xóa"); load(); } catch { toast.error("Lỗi"); }
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: 32 }}>
        <h1 className="page-title">Quản lý người dùng ({users.length})</h1>
        {isLoading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table>
          <thead><tr><th>Tên</th><th>Email</th><th>SĐT</th><th>Vai trò</th><th>Trạng thái</th><th>Ngày tạo</th><th>Thao tác</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td style={{ fontWeight: 500 }}>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone || "-"}</td>
                <td><span className={`badge ${u.role === "admin" ? "badge-shipping" : "badge-completed"}`}>{u.role === "admin" ? "Admin" : "Khách hàng"}</span></td>
                <td><span className={`badge badge-${u.status}`}>{u.status === "active" ? "Hoạt động" : u.status === "locked" ? "Bị khóa" : u.status}</span></td>
                <td style={{ fontSize: 13 }}>{new Date(u.createdAt).toLocaleDateString("vi")}</td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => toggleLock(u)} style={{ padding: 6, background: u.status === "locked" ? "#f6ffed" : "#fff7e6", borderRadius: 6, color: u.status === "locked" ? "#389e0d" : "#d48806" }}>
                      {u.status === "locked" ? <FiUnlock size={14} /> : <FiLock size={14} />}
                    </button>
                    {u.role !== "admin" && <button onClick={() => deleteUser(u._id)} style={{ padding: 6, background: "#fff1f0", borderRadius: 6, color: "#ff4d4f" }}><FiTrash2 size={14} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}
