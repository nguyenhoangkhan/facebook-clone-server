const userRoute = require("./user.route");
const passwordRoute = require("./password.route");
const postRoute = require("./post.route");
const uploadImagesRoute = require("./uploadImages.route");
const friendRoute = require("./friend.route");

const router = (app) => {
  app.use("/password", passwordRoute);
  app.use("/post", postRoute);
  app.use("/uploadImages", uploadImagesRoute);
  app.use("/friends", friendRoute);
  app.use("/", userRoute);
};

module.exports = router;
