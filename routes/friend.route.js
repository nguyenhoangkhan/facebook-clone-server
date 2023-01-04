const express = require("express");
const router = express.Router();

const friendController = require("../controllers/friendController.js");
const userAuth = require("../middlewares/userAuth.js");

router.patch("/add-friend/:id", userAuth, friendController.addFriend);
router.patch("/un-friend/:id", userAuth, friendController.unFriend);
router.patch(
  "/accept-friend-request/:id",
  userAuth,
  friendController.acceptFriendRequest
);
router.patch(
  "/cancel-friend-request/:id",
  userAuth,
  friendController.cancelFriendRequest
);

module.exports = router;
