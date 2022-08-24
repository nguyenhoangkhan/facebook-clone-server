const jwt = require("jsonwebtoken");

class Tokens {
  generateToken(payload, expired) {
    return jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN, {
      expiresIn: expired,
    });
  }
}
module.exports = new Tokens();
