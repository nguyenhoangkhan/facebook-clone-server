const User = require("../models/user.js");
const bcrypt = require("bcrypt");

const validation = require("../helpers/validation.js");
const tokens = require("../helpers/tokens.js");

class registerController {
  // register [POST]
  async register(req, res) {
    try {
      const {
        first_name,
        last_name,
        email,
        password,
        bYear,
        bMonth,
        bDay,
        gender,
      } = req.body;

      // Check valid email address
      if (!validation.email(email)) {
        return res.status(401).json({ message: "Địa chỉ Email không hợp lệ." });
      }
      // Check exits email
      const checkExistEmail = await User.findOne({ email });
      // Handle when email is exist
      if (checkExistEmail) {
        return res
          .status(401)
          .json({ message: "Địa chỉ Email đã tồn tại. Vui lòng thử lại!" });
      }

      // Check first_name length
      if (!validation.length(first_name, 3, 30)) {
        return res.status(401).json({
          message: "Tên phải có từ 3 đến 30 kí tự.",
        });
      }

      // Check last_name length
      if (!validation.length(last_name, 3, 30)) {
        return res.status(401).json({
          message: "Họ phải có từ 3 đến 30 kí tự.",
        });
      }

      // Check password length
      if (!validation.length(password, 6)) {
        return res.status(401).json({
          message: "Mật khẩu tối thiểu từ 6 ký tự.",
        });
      }

      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Validate Unique Username
      const tempUserName = first_name + last_name;
      const newUsername = await validation.username(tempUserName);

      // Create document user to db
      const user = await new User({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        username: newUsername,
        bYear,
        bMonth,
        bDay,
        gender,
      }).save();

      const token = tokens.generateToken({
        id: user._id.toString(),
      });
      // Send information to frontend
      return res.send({
        id: user._id,
        username: user.username,
        picture: user.picture,
        first_name: user.first_name,
        last_name: user.last_name,
        token,
        message: "Đăng ký tài khoản thành công!",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  // */login [POST]
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user && !password) {
        return res
          .status(400)
          .json({ message: "Bạn cần điền thông tin đăng nhập" });
      }
      if (!user) {
        return res.status(400).json({ message: "Địa chỉ Email không tồn tại" });
      }
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return res.status(401).json({
          message: "Mật khẩu bạn nhập không chính xác",
        });
      }
      // Generate token to user._id
      const token = tokens.generateToken({
        id: user._id.toString(),
      });
      // Send information to frontend
      return res.send({
        id: user._id,
        username: user.username,
        picture: user.picture,
        first_name: user.first_name,
        last_name: user.last_name,
        token,
        message: "Đăng nhập thành công!",
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}
module.exports = new registerController();
