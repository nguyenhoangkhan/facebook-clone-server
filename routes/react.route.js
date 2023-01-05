const express = require("express");
const router = express.Router();

const userAuth = require("../middlewares/userAuth.js");
const reactController = require("../controllers/reactController");

router.patch("/", userAuth, reactController.react);

module.exports = router;
