const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController.js");
const userAuth = require("../middlewares/userAuth");

router.post("/", postController.index);

module.exports = router;
