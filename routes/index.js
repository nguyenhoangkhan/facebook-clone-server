const userRoute = require("./user.route");

const router = (app) => {
  app.use("/", userRoute);
};

module.exports = router;
