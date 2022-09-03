const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const temp = req.header("Authorization");
    const token = temp.slice(7, temp.length);

    if (!token) {
      return res.status(401).json({ message: "Invalid Authorization" });
    }
    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
      if (err) {
        return res.status(403).json({ message: err.message });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: "Invalid token" });
  }
};
module.exports = userAuth;
