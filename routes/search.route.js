const express = require("express");
const router = express.Router();

const searchController = require("../controllers/searchController");
const userAuth = require("../middlewares/userAuth.js");

router.get("/user", userAuth, searchController.searchUser);
router.patch("/user", userAuth, searchController.addSearchHistory);

module.exports = router;
