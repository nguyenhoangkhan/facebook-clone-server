const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const userAuth = require("../middlewares/userAuth.js");

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/:username", userAuth, userController.getProfile);

router.patch("/picture-profile", userAuth, userController.uploadPictureProfile);
router.patch("/cover-profile", userAuth, userController.uploadCoverProfile);
router.patch("/details", userAuth, userController.updateUserDetails);

router.patch("/follow/:id", userAuth, userController.follow);
router.patch("/unFollow/:id", userAuth, userController.unFollow);

module.exports = router;
