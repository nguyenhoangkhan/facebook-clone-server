const userRoute = require("./user.route");
const passwordRoute = require("./password.route");

const router = (app) => {
  app.use("/password", passwordRoute);
  app.use("/", userRoute);
};

module.exports = router;
