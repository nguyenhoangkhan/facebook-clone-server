const express = require("express");
const router = express.Router();

const uploadImage = require("../middlewares/uploadImage");
const uploadController = require("../controllers/uploadController.js");

router.post("/", uploadImage, uploadController.index);

module.exports = router;
