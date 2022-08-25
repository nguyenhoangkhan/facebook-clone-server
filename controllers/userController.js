const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");

const validation = require("../helpers/validation.js");
const tokens = require("../helpers/tokens.js");
// const mailer = require("../helpers/mailer.js");

class registerController {
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
        return res.status(401).json({ message: "Invalid email." });
      }
      // Check exits email
      const checkExistEmail = await User.findOne({ email });
      // Handle when email is exist
      if (checkExistEmail) {
        return res
          .status(401)
          .json({ message: "This email address already exist." });
      }

      // Check first_name length
      if (!validation.length(first_name, 3, 30)) {
        return res.status(401).json({
          message:
            "First name must be at least 3 characters and less than 30 characters.",
        });
      }
      // Check last_name length
      if (!validation.length(last_name, 3, 30)) {
        return res.status(401).json({
          message:
            "Last name must be at least 3 characters and less than 30 characters.",
        });
      }
      // Check password length
      if (!validation.length(password, 6, 40)) {
        return res.status(401).json({
          message:
            "Password must be at least 3 characters and less than 30 characters.",
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

      // Send Email validation
      //   const emailVerification = tokens.generateToken(
      //     {
      //       id: user._id.toString(),
      //     },
      //     "5m"
      //   );
      //   const url = `${process.env.BASE_URL}/activate/${emailVerification}`;
      //   mailer.sendVerificationEmail(user.email, user.first_name, url);

      // Generate token to user._id
      const token = tokens.generateToken(
        {
          id: user._id.toString(),
        },
        "7d"
      );
      // Send information to frontend
      return res.send({
        id: user._id,
        username: user.username,
        picture: user.picture,
        first_name: user.first_name,
        last_name: user.last_name,
        token,
        message: "Register successfully!",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "The email you entered is not exist" });
      }
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        res
          .status(401)
          .json({ message: "The password you entered is incorrect" });
      }
      // Generate token to user._id
      const token = tokens.generateToken(
        {
          id: user._id.toString(),
        },
        "7d"
      );
      // Send information to frontend
      return res.send({
        id: user._id,
        username: user.username,
        picture: user.picture,
        first_name: user.first_name,
        last_name: user.last_name,
        token,
        message: "Login successfully!",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}
module.exports = new registerController();
