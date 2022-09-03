const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController.js");
const userAuth = require("../middlewares/userAuth");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/auth", userAuth, UserController.auth);

module.exports = router;
