const express = require("express");
const router = express.Router();

const searchController = require("../controllers/searchController");
const userAuth = require("../middlewares/userAuth.js");

router.get("/user", userAuth, searchController.searchUser);

router.patch("/user", userAuth, searchController.addSearchUserHistory);
router.get("/user-history", userAuth, searchController.getSearchUserHistory);
router.delete(
  "/user-history/:historyId",
  userAuth,
  searchController.deleteSearchUserHistory
);

module.exports = router;
