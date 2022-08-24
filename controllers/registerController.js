const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");

const validation = require("../helpers/validation.js");
const tokens = require("../helpers/tokens.js");
const mailer = require("../helpers/mailer.js");

class registerController {
  async index(req, res) {
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

      if (!validation.email(email)) {
        return res.status(401).json({ message: "Invalid email." });
      }
      // Check exits email
      const checkExistEmail = await User.findOne({ email });

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
      const emailVerification = tokens.generateToken(
        {
          id: user._id.toString(),
        },
        "5m"
      );
      const url = `${process.env.BASE_URL}/activate/${emailVerification}`;
      console.log(process.env.MAILING_REFRESH);
      mailer.sendVerificationEmail(user.email, user.first_name, url);

      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}
module.exports = new registerController();
