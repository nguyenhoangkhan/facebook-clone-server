const express = require("express");
const router = express.Router();
const passwordController = require("../controllers/passwordController.js");

router.post("/findUser", passwordController.findUser);
router.post("/sendCodeResetPassword", passwordController.sendCodeResetPassword);
router.post(
  "/verifiedCodeResetPassword",
  passwordController.verifiedCodeResetPassword
);
router.post("/changepassword", passwordController.changePassword);
module.exports = router;
