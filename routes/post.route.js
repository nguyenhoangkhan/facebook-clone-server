const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController.js");
const userAuth = require("../middlewares/userAuth");

router.post("/createPost", userAuth, postController.index);
router.get("/getAllPost", userAuth, postController.index);

module.exports = router;
