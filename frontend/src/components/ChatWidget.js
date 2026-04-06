import { useState, useRef, useEffect } from "react";

const FAQ_RESPONSES = [
  {
    keywords: ["xin chào", "hello", "hi", "chào"],
    answer: "Xin chào! Tôi là trợ lý ảo của Vua Đặc Sản. Tôi có thể giúp bạn tìm hiểu về sản phẩm, đơn hàng và các chính sách của chúng tôi. Bạn cần hỗ trợ gì ạ? 😊",
  },
  {
    keywords: ["giao hàng", "ship", "vận chuyển", "phí ship"],
    answer: "🚚 Chính sách giao hàng của chúng tôi:\n• Miễn phí ship cho đơn hàng từ 500.000đ\n• Phí ship 30.000đ cho đơn hàng dưới 500.000đ\n• Thời gian giao hàng: 2-5 ngày làm việc\n• Giao hàng toàn quốc",
  },
  {
    keywords: ["đổi trả", "hoàn tiền", "trả hàng", "hoàn hàng"],
    answer: "🔄 Chính sách đổi trả:\n• Đổi trả trong vòng 7 ngày kể từ khi nhận hàng\n• Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng\n• Lỗi do nhà sản xuất: đổi trả miễn phí\n• Liên hệ hotline để được hỗ trợ nhanh nhất",
  },
  {
    keywords: ["thanh toán", "trả tiền", "payment", "cod", "tiền mặt"],
    answer: "💳 Phương thức thanh toán:\n• Thanh toán khi nhận hàng (COD)\n• Chuyển khoản ngân hàng\n• Ví điện tử (Momo, ZaloPay)\n\nHiện tại chúng tôi hỗ trợ thanh toán COD cho tất cả đơn hàng.",
  },
  {
    keywords: ["mã giảm giá", "coupon", "khuyến mãi", "ưu đãi", "voucher"],
    answer: "🎁 Để sử dụng mã giảm giá:\n1. Thêm sản phẩm vào giỏ hàng\n2. Vào trang Thanh toán\n3. Nhập mã vào ô \"Mã giảm giá\"\n4. Nhấn Áp dụng\n\nTheo dõi fanpage của chúng tôi để nhận các ưu đãi mới nhất!",
  },
  {
    keywords: ["tài khoản", "đăng ký", "đăng nhập", "mật khẩu"],
    answer: "👤 Hỗ trợ tài khoản:\n• Quên mật khẩu: Nhấn \"Quên mật khẩu\" ở trang đăng nhập\n• Xác minh email: Kiểm tra hộp thư sau khi đăng ký\n• Cập nhật thông tin: Vào trang Hồ sơ cá nhân\n\nNếu vẫn gặp vấn đề, vui lòng liên hệ hotline để được hỗ trợ.",
  },
  {
    keywords: ["đơn hàng", "theo dõi", "trạng thái", "order"],
    answer: "📦 Theo dõi đơn hàng:\n• Đăng nhập vào tài khoản\n• Vào mục \"Đơn hàng của tôi\"\n• Xem trạng thái: Chờ xác nhận → Đã xác nhận → Đang giao → Hoàn thành\n\nBạn cũng có thể hủy đơn khi đơn hàng chưa được xác nhận.",
  },
  {
    keywords: ["sản phẩm", "đặc sản", "chất lượng", "xuất xứ", "nguồn gốc"],
    answer: "🌿 Về sản phẩm của chúng tôi:\n• 100% đặc sản từ các vùng miền Việt Nam\n• Nguồn gốc rõ ràng, có kiểm định chất lượng\n• Bảo quản đúng tiêu chuẩn an toàn thực phẩm\n• Đa dạng: miền Bắc, miền Trung, miền Nam và Tây Nguyên",
  },
  {
    keywords: ["liên hệ", "hotline", "điện thoại", "email", "hỗ trợ"],
    answer: "📞 Liên hệ với chúng tôi:\n• Hotline: 1800-xxxx (Miễn phí, 8h-22h)\n• Email: support@vuadacsan.vn\n• Facebook: facebook.com/vuadacsan\n• Địa chỉ: 123 Đường ABC, Hà Nội\n\nChúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.",
  },
];

const DEFAULT_RESPONSE = "Cảm ơn bạn đã liên hệ! Tôi chưa có thông tin về vấn đề này. Vui lòng gọi hotline **1800-xxxx** hoặc email **support@vuadacsan.vn** để được hỗ trợ trực tiếp nhé! 🙏";

const QUICK_QUESTIONS = [
  "Chính sách giao hàng?",
  "Cách đổi trả hàng?",
  "Theo dõi đơn hàng?",
  "Mã giảm giá?",
];

function getBotResponse(input) {
  const lower = input.toLowerCase();
  for (const item of FAQ_RESPONSES) {
    if (item.keywords.some(k => lower.includes(k))) {
      return item.answer;
    }
  }
  return DEFAULT_RESPONSE;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào! Tôi là trợ lý ảo của **Vua Đặc Sản**. Tôi có thể giúp bạn về đơn hàng, giao hàng, đổi trả và nhiều hơn nữa. Bạn cần hỗ trợ gì? 😊" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setInput("");
    setMessages(prev => [...prev, { from: "user", text: userText }]);
    setTyping(true);
    setTimeout(() => {
      const reply = getBotResponse(userText);
      setMessages(prev => [...prev, { from: "bot", text: reply }]);
      setTyping(false);
    }, 800);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatText = (text) => {
    return text
      .split("\n")
      .map((line, i) => (
        <span key={i}>
          {line.replace(/\*\*(.*?)\*\*/g, "$1").split(/\*\*(.*?)\*\*/).map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      ));
  };

  return (
    <>
      {/* Nút chat */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 1000,
          width: 56, height: 56, borderRadius: "50%",
          background: "var(--primary, #e67e22)", color: "white",
          border: "none", cursor: "pointer", fontSize: 24,
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s",
        }}
        title="Hỗ trợ trực tuyến"
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Cửa sổ chat */}
      {open && (
        <div style={{
          position: "fixed", bottom: 90, right: 24, zIndex: 999,
          width: 340, height: 480,
          background: "#fff", borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          animation: "slideUp 0.2s ease",
        }}>
          {/* Header */}
          <div style={{
            background: "var(--primary, #e67e22)",
            color: "white", padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>🍜</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Vua Đặc Sản</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>Hỗ trợ trực tuyến • Phản hồi ngay</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", background: "#f8f8f8" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                marginBottom: 10,
              }}>
                {msg.from === "bot" && (
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "var(--primary, #e67e22)",
                    color: "white", fontSize: 14,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginRight: 8, flexShrink: 0, alignSelf: "flex-end",
                  }}>🍜</div>
                )}
                <div style={{
                  maxWidth: "78%",
                  background: msg.from === "user" ? "var(--primary, #e67e22)" : "#fff",
                  color: msg.from === "user" ? "#fff" : "#333",
                  padding: "9px 13px", borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  fontSize: 13.5, lineHeight: 1.5,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }}>
                  {formatText(msg.text)}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "var(--primary, #e67e22)", color: "white", fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>🍜</div>
                <div style={{
                  background: "#fff", padding: "9px 14px", borderRadius: "16px 16px 16px 4px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }}>
                  <span style={{ fontSize: 18, letterSpacing: 2 }}>•••</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          <div style={{ padding: "6px 10px", background: "#fff", borderTop: "1px solid #f0f0f0", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {QUICK_QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)} style={{
                fontSize: 11.5, padding: "4px 10px", borderRadius: 20,
                border: "1px solid var(--primary, #e67e22)",
                color: "var(--primary, #e67e22)", background: "#fff",
                cursor: "pointer", whiteSpace: "nowrap",
              }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: "10px 12px",
            background: "#fff", borderTop: "1px solid #eee",
            display: "flex", gap: 8,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Nhập câu hỏi..."
              style={{
                flex: 1, padding: "9px 14px",
                border: "1px solid #ddd", borderRadius: 20,
                fontSize: 13.5, outline: "none",
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim()}
              style={{
                width: 38, height: 38, borderRadius: "50%",
                background: input.trim() ? "var(--primary, #e67e22)" : "#ddd",
                color: "white", border: "none", cursor: input.trim() ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, flexShrink: 0,
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
