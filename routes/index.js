const homeRoute = require("./home.route");
const userRoute = require("./user.route");
const registerRoute = require("./register.route");

const router = (app) => {
  app.use("/user", userRoute);
  app.use("/register", registerRoute);
  app.use("/", homeRoute);
};

module.exports = router;
