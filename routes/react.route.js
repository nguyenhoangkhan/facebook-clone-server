const express = require("express");
const router = express.Router();

const userAuth = require("../middlewares/userAuth.js");
const reactController = require("../controllers/reactController");

router.get("/:postId", userAuth, reactController.getReacts);
router.patch("/", userAuth, reactController.react);

module.exports = router;
