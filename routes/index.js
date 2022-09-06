const userRoute = require("./user.route");
const passwordRoute = require("./password.route");
const postRoute = require("./post.route");
const uploadImagesRoute = require("./uploadImages.route");

const router = (app) => {
  app.use("/password", passwordRoute);
  app.use("/post", postRoute);
  app.use("/uploadImages", uploadImagesRoute);
  app.use("/", userRoute);
};

module.exports = router;
