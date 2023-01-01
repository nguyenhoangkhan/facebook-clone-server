const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const userAuth = require("../middlewares/userAuth.js");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/:username", userAuth, userController.getProfile);
router.patch("/picture-profile", userAuth, userController.uploadPictureProfile);

module.exports = router;
