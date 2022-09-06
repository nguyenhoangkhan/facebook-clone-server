const express = require("express");
const router = express.Router();

const uploadImages = require("../middlewares/uploadImages");
const uploadController = require("../controllers/uploadController.js");
const userAuth = require("../middlewares/userAuth");

router.post("/", userAuth, uploadImages, uploadController.index);

module.exports = router;
