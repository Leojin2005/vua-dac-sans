import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

const statusMap = { pending: "Chờ xác nhận", confirmed: "Đã xác nhận", shipping: "Đang giao", completed: "Hoàn thành", cancelled: "Đã hủy", returned: "Trả hàng" };

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => { API.get(`/orders/${id}`).then(r => setOrder(r.data)); }, [id]);

  const cancelOrder = async () => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng?")) return;
    try {
      const { data } = await API.put(`/orders/${id}/cancel`);
      setOrder(data);
      toast.success("Đã hủy đơn hàng");
    } catch (err) { toast.error(err.response?.data?.message || "Lỗi"); }
  };

  if (!order) return <div className="loading">Đang tải...</div>;

  return (
    <div className="container" style={{ maxWidth: 800 }}>
      <h1 className="page-title">Chi tiết đơn hàng</h1>
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <span style={{ fontFamily: "monospace", fontSize: 14, color: "#888" }}>#{order._id.slice(-8)}</span>
            <span style={{ marginLeft: 12 }} className={`badge badge-${order.status}`}>{statusMap[order.status]}</span>
          </div>
          <span style={{ fontSize: 13, color: "#888" }}>{new Date(order.createdAt).toLocaleString("vi")}</span>
        </div>

        <h3 style={{ marginBottom: 12 }}>Sản phẩm</h3>
        {order.items.map((i, idx) => (
          <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f0f0", fontSize: 14 }}>
            <span>{i.name} x{i.quantity}</span>
            <span style={{ fontWeight: 600 }}>{(i.price * i.quantity).toLocaleString()}đ</span>
          </div>
        ))}

        <div style={{ marginTop: 20, padding: 16, background: "#fafafa", borderRadius: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}><span>Tạm tính:</span><span>{order.subtotal.toLocaleString()}đ</span></div>
          {order.discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6, color: "green" }}><span>Giảm giá:</span><span>-{order.discount.toLocaleString()}đ</span></div>}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}><span>Phí vận chuyển:</span><span>{order.shippingFee === 0 ? "Miễn phí" : `${order.shippingFee.toLocaleString()}đ`}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, borderTop: "1px solid #ddd", paddingTop: 8, marginTop: 8 }}><span>Tổng:</span><span style={{ color: "var(--primary)" }}>{order.totalPrice.toLocaleString()}đ</span></div>
        </div>

        <div style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 8 }}>Địa chỉ giao hàng</h3>
          <p style={{ fontSize: 14, lineHeight: 1.8 }}>
            {order.shippingAddress?.fullName} - {order.shippingAddress?.phone}<br />
            {order.shippingAddress?.address}, {order.shippingAddress?.city}
            {order.shippingAddress?.note && <><br />Ghi chú: {order.shippingAddress.note}</>}
          </p>
        </div>

        {order.status === "pending" && (
          <button onClick={cancelOrder} className="btn-danger" style={{ marginTop: 20 }}>Hủy đơn hàng</button>
        )}
      </div>
    </div>
  );
}
