import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const statusMap = { pending: "Chờ xác nhận", confirmed: "Đã xác nhận", shipping: "Đang giao", completed: "Hoàn thành", cancelled: "Đã hủy", returned: "Trả hàng" };

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { API.get("/orders/my").then(r => { setOrders(r.data); setLoading(false); }); }, []);

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="container">
      <h1 className="page-title">Đơn hàng của tôi</h1>
      {orders.length === 0 ? <div className="empty">Chưa có đơn hàng nào</div> : (
        <table>
          <thead><tr><th>Mã đơn</th><th>Ngày đặt</th><th>Sản phẩm</th><th>Tổng tiền</th><th>Trạng thái</th><th></th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td style={{ fontFamily: "monospace", fontSize: 13 }}>#{o._id.slice(-8)}</td>
                <td>{new Date(o.createdAt).toLocaleDateString("vi")}</td>
                <td>{o.items.length} sản phẩm</td>
                <td style={{ fontWeight: 600, color: "var(--primary)" }}>{o.totalPrice.toLocaleString()}đ</td>
                <td><span className={`badge badge-${o.status}`}>{statusMap[o.status]}</span></td>
                <td><Link to={`/orders/${o._id}`} style={{ color: "var(--primary)", fontWeight: 500, fontSize: 13 }}>Chi tiết</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
