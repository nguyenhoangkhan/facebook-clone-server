const express = require("express");
const router = express.Router();

const friendController = require("../controllers/friendController.js");
const userAuth = require("../middlewares/userAuth.js");

router.patch("/add-friend/:id", userAuth, friendController.addFriend);
router.patch("/un-friend/:id", userAuth, friendController.unFriend);
router.patch(
  "/delete-friend-request/:id",
  userAuth,
  friendController.deleteFriendRequest
);
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
router.get(
  "/getFriendsPageInfos",
  userAuth,
  friendController.getFriendsPageInfos
);

module.exports = router;
