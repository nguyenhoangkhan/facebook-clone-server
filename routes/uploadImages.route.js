const express = require("express");
const router = express.Router();

const uploadImages = require("../middlewares/uploadImages");
const uploadController = require("../controllers/uploadController.js");

router.post("/", uploadImages, uploadController.index);

module.exports = router;
