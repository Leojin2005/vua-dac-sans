const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    family: 4,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendVerificationEmail = async (user, token) => {
  const transporter = createTransporter();
  const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email/${token}`;

  await transporter.sendMail({
    from: `"Vua Đặc Sản" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Xác minh email tài khoản - Vua Đặc Sản",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #e67e22; margin: 0;">🍜 Vua Đặc Sản</h1>
          <p style="color: #666; margin-top: 5px;">Thực phẩm đặc sản từ khắp mọi miền</p>
        </div>
        <div style="background: #f9f9f9; border-radius: 8px; padding: 30px;">
          <h2 style="color: #333; margin-top: 0;">Xác minh địa chỉ email</h2>
          <p style="color: #555;">Xin chào <strong>${user.name}</strong>,</p>
          <p style="color: #555;">Cảm ơn bạn đã đăng ký tài khoản tại Vua Đặc Sản. Vui lòng nhấn nút bên dưới để xác minh địa chỉ email của bạn.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #e67e22; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
              Xác minh Email
            </a>
          </div>
          <p style="color: #888; font-size: 14px;">Liên kết này có hiệu lực trong <strong>24 giờ</strong>.</p>
          <p style="color: #888; font-size: 14px;">Nếu bạn không đăng ký tài khoản này, hãy bỏ qua email này.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #aaa; font-size: 12px;">Hoặc copy đường dẫn: <a href="${verifyUrl}" style="color: #e67e22;">${verifyUrl}</a></p>
        </div>
      </div>
    `,
  });
};

const sendPasswordResetEmail = async (user, token) => {
  const transporter = createTransporter();
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${token}`;

  await transporter.sendMail({
    from: `"Vua Đặc Sản" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Đặt lại mật khẩu - Vua Đặc Sản",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #e67e22; margin: 0;">🍜 Vua Đặc Sản</h1>
          <p style="color: #666; margin-top: 5px;">Thực phẩm đặc sản từ khắp mọi miền</p>
        </div>
        <div style="background: #f9f9f9; border-radius: 8px; padding: 30px;">
          <h2 style="color: #333; margin-top: 0;">Đặt lại mật khẩu</h2>
          <p style="color: #555;">Xin chào <strong>${user.name}</strong>,</p>
          <p style="color: #555;">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nhấn nút bên dưới để tạo mật khẩu mới.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #e67e22; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
              Đặt lại mật khẩu
            </a>
          </div>
          <p style="color: #888; font-size: 14px;">Liên kết này có hiệu lực trong <strong>1 giờ</strong>.</p>
          <p style="color: #888; font-size: 14px;">Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này. Tài khoản của bạn vẫn an toàn.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #aaa; font-size: 12px;">Hoặc copy đường dẫn: <a href="${resetUrl}" style="color: #e67e22;">${resetUrl}</a></p>
        </div>
      </div>
    `,
  });
};

const sendCouponEmail = async (toEmail, toName, coupon) => {
  const transporter = createTransporter();
  const discountText = coupon.discountType === "percent"
    ? `${coupon.discountValue}%`
    : `${coupon.discountValue.toLocaleString("vi-VN")}đ`;
  const minOrderText = coupon.minOrder > 0
    ? `Đơn hàng tối thiểu <strong>${coupon.minOrder.toLocaleString("vi-VN")}đ</strong>`
    : "Không yêu cầu đơn tối thiểu";
  const expiresText = new Date(coupon.expiresAt).toLocaleDateString("vi-VN");

  await transporter.sendMail({
    from: `"Vua Đặc Sản" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `🎁 Mã giảm giá dành riêng cho bạn - Vua Đặc Sản`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #e67e22; margin: 0;">🍜 Vua Đặc Sản</h1>
          <p style="color: #666; margin-top: 5px;">Thực phẩm đặc sản từ khắp mọi miền</p>
        </div>
        <div style="background: linear-gradient(135deg, #e67e22, #d35400); border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 24px;">
          <p style="color: rgba(255,255,255,0.9); margin: 0 0 8px; font-size: 15px;">🎁 Ưu đãi đặc biệt dành riêng cho bạn</p>
          <div style="background: white; border-radius: 8px; padding: 16px 24px; display: inline-block; margin: 12px 0;">
            <p style="margin: 0; font-size: 13px; color: #999; letter-spacing: 1px;">MÃ GIẢM GIÁ</p>
            <p style="margin: 4px 0; font-size: 32px; font-weight: bold; color: #e67e22; letter-spacing: 4px; font-family: monospace;">${coupon.code}</p>
          </div>
          <p style="color: white; font-size: 22px; font-weight: bold; margin: 8px 0 0;">Giảm ${discountText}</p>
        </div>
        <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <h3 style="color: #333; margin: 0 0 12px;">Chi tiết ưu đãi:</h3>
          <ul style="color: #555; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>${minOrderText}</li>
            ${coupon.maxDiscount > 0 ? `<li>Giảm tối đa <strong>${coupon.maxDiscount.toLocaleString("vi-VN")}đ</strong></li>` : ""}
            <li>Có hiệu lực đến <strong>${expiresText}</strong></li>
          </ul>
        </div>
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/products"
             style="background-color: #e67e22; color: white; padding: 14px 36px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
            Mua sắm ngay
          </a>
        </div>
        <p style="color: #aaa; font-size: 12px; text-align: center;">
          Email này được gửi đến ${toEmail}. Mã giảm giá chỉ sử dụng được một lần.
        </p>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendCouponEmail };
