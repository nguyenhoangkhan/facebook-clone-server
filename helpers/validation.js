const User = require("../models/user");

class Validation {
  email(email) {
    return String(email)
      .toLowerCase()
      .match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
  }
  length(text, min, max) {
    if (text.length < min || text.length > max) {
      return false;
    }
    return true;
  }
  async username(username) {
    let valid = true;
    do {
      let check = await User.findOne({ username });
      if (check) {
        let randomString = (new Date().getTime() * Math.random())
          .toString()
          .substring(0, 1);
        username += randomString;
        valid = false;
      } else {
        valid = true;
      }
    } while (!valid);
    return username;
  }
}

module.exports = new Validation();
