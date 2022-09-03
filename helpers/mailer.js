const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const oauth_link = "https://developers.google.com/oauthplayground";
const { EMAIL, MAILING_ID, MAILING_REFRESH, MAILING_SECRECT } = process.env;

const auth = new google.auth.OAuth2(
  MAILING_ID,
  MAILING_SECRECT,
  MAILING_REFRESH,
  oauth_link
);

class Mailer {
  sendCodeResetPassword(email, name, code) {
    auth.setCredentials({
      refresh_token: MAILING_REFRESH,
    });
    const accessToken = auth.getAccessToken();
    const stmp = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL,
        clientId: MAILING_ID,
        clientSecret: MAILING_SECRECT,
        refreshToken: MAILING_REFRESH,
        accessToken,
      },
    });
    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Mã xác nhận reset mật khẩu Facebook",
      html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#3b5998"><img src="https://res.cloudinary.com/dmhcnhtng/image/upload/v1645134414/logo_cs1si5.png" alt="" style="width:30px"><span>Action requise : Reset mật khẩu Facebook của bạn</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>Hello ${name}</span><div style="padding:20px 0"><span style="padding:1.5rem 0">Bạn đã yêu cầu đổi mật khẩu, dưới đây là mã xác nhận.</span></div><a style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none;font-weight:600">${code}</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">Facebook cho phép bạn giữ liên lạc với tất cả bạn bè của mình, sau khi đăng ký trên Facebook, bạn có thể chia sẻ ảnh, tổ chức sự kiện và hơn thế nữa.</span></div></div>`,
    };
    stmp.sendMail(mailOptions, (err, res) => {
      if (err) {
        return err;
      } else {
        return res;
      }
    });
  }
}

module.exports = new Mailer();
