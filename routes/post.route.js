const express = require("express");
const commentController = require("../controllers/commentController.js");
const router = express.Router();

const postController = require("../controllers/postController.js");
const userAuth = require("../middlewares/userAuth");

router.post("/createPost", userAuth, postController.create);

router.get("/getAllPosts", userAuth, postController.get);

router.get("/getDeletedPosts", userAuth, postController.getDeletedPosts);
router.patch("/restorePosts", userAuth, postController.restore);

router.patch("/comment", userAuth, commentController.createComment);

router.patch("/save", userAuth, postController.savePost);

router.patch("/", userAuth, postController.deletePost);
router.delete("/:id", userAuth, postController.forceDeletePost);

module.exports = router;
