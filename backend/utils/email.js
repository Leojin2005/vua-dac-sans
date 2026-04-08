const https = require("https");

const sendBrevoEmail = ({ to, toName, subject, html }) => {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      sender: { name: "Vua Đặc Sản", email: "leomine2135@gmail.com" },
      to: [{ email: to, name: toName || to }],
      subject,
      htmlContent: html,
    });

    const req = https.request({
      hostname: "api.brevo.com",
      path: "/v3/smtp/email",
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(data);
        else reject(new Error(`Brevo API error ${res.statusCode}: ${data}`));
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
};

const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email/${token}`;
  await sendBrevoEmail({
    to: user.email,
    toName: user.name,
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
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${token}`;
  await sendBrevoEmail({
    to: user.email,
    toName: user.name,
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

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
