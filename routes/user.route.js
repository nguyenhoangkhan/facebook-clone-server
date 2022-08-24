const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController.js");

router.get("/", UserController.index);

module.exports = router;
