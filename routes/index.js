const userRoute = require("./user.route");
const passwordRoute = require("./password.route");
const postRoute = require("./post.route");
const uploadRoute = require("./upload.route");

const router = (app) => {
  app.use("/password", passwordRoute);
  app.use("/createPost", postRoute);
  app.use("/uploadImages", uploadRoute);
  app.use("/", userRoute);
};

module.exports = router;
