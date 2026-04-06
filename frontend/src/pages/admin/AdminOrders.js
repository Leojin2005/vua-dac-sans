import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import API from "../../api/axios";
import { toast } from "react-toastify";

const statusMap = { pending: "Chờ xác nhận", confirmed: "Đã xác nhận", shipping: "Đang giao", completed: "Hoàn thành", cancelled: "Đã hủy", returned: "Trả hàng" };
const statusOptions = ["pending", "confirmed", "shipping", "completed", "cancelled", "returned"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");

  // ✅ FIX
  const load = async () => {
    try {
      const q = filter ? `?status=${filter}` : "";
      const res = await API.get(`/orders${q}`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được đơn hàng");
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      toast.success("Cập nhật thành công!");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: 32 }}>
        <h1 className="page-title">Quản lý đơn hàng</h1>

        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <button onClick={() => setFilter("")} className={filter === "" ? "btn-primary btn-sm" : "btn-secondary btn-sm"}>Tất cả</button>
          {statusOptions.map(s => (
            <button key={s} onClick={() => setFilter(s)} className={filter === s ? "btn-primary btn-sm" : "btn-secondary btn-sm"}>
              {statusMap[s]}
            </button>
          ))}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>SĐT</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id}>
                  <td>
                    <Link to={`/orders/${o._id}`} style={{ fontFamily: "monospace", fontSize: 13, color: "var(--primary)" }}>
                      #{o._id.slice(-8)}
                    </Link>
                  </td>
                  <td>{o.user?.name || o.shippingAddress?.fullName || "Khách"}</td>
                  <td>{o.user?.phone || o.shippingAddress?.phone || "-"}</td>
                  <td style={{ fontWeight: 600 }}>{o.totalPrice != null ? o.totalPrice.toLocaleString() + "đ" : "-"}</td>
                  <td>
                    <span className={`badge badge-${o.status}`}>
                      {statusMap[o.status] || o.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 13 }}>
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString("vi") : "-"}
                  </td>
                  <td>
                    <select
                      value={o.status}
                      onChange={e => updateStatus(o._id, e.target.value)}
                      style={{ padding: "4px 8px", fontSize: 13, width: 140 }}
                    >
                      {statusOptions.map(s => (
                        <option key={s} value={s}>
                          {statusMap[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}