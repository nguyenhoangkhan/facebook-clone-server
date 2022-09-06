const bcrypt = require("bcrypt");

const mailer = require("../helpers/mailer.js");
const User = require("../models/user.js");
const Code = require("../models/code.js");
const { generateCode } = require("../helpers/generateCode.js");

class PasswordController {
  // Find User [POST]
  async findUser(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email }).select("-password");
      if (!user) {
        return res.status(400).json({ message: "Tài khoản không tồn tại" });
      }
      return res.status(200).json({
        email: user.email,
        picture: user.picture,
      });
    } catch {
      return res.status(500).json({ message: err.message });
    }
  }
  // Send Code Reset Password [POST]
  async sendCodeResetPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email }).select("-password");
      await Code.findOneAndDelete({ id: user._id });
      const code = generateCode(5);
      await new Code({
        code,
        user: user._id,
      }).save();
      mailer.sendCodeResetPassword(email, user.first_name, code);

      return res.status(200).json({
        message: "Mã reset mật khẩu đã được gửi vào Email, vui lòng kiểm tra.",
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
  // Verified Code Reset Password [POST]
  async verifiedCodeResetPassword(req, res) {
    try {
      const { email, code } = req.body;
      const user = await User.findOne({ email });
      const dbCode = await Code.findOne({ user: user._id });
      if (dbCode.code != code) {
        return res
          .status(400)
          .json({ message: "Mã xác nhận không chính xác." });
      }
      return res.status(200).json({ message: "Mã xác nhận chính xác." });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
  // Change Password [POST]
  async changePassword(req, res) {
    try {
      const { email, password } = req.body;
      const cryptedPassword = await bcrypt.hash(password, 12);
      await User.findOneAndUpdate({ email }, { password: cryptedPassword });
      return res.status(200).json({ message: "Đổi mật khẩu thành công!" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new PasswordController();
