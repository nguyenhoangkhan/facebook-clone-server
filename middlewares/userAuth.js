const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const temp = req.header("Authorization");
    const token = temp.slice(7, temp.length);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Xác thực danh tính không thành công." });
    }
    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Người dùng không hợp lệ." });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: "Token không hợp lệ." });
  }
};

module.exports = userAuth;
