const Post = require("../models/post");

class PostController {
  // Create Post [POST]
  async index(req, res) {
    try {
      console.log("ok");
      const { type, background, text, images, user } = req.body;
      await new Post({
        type,
        background,
        text,
        images,
        user,
      }).save();
      return res.status(200).json({ message: "Create Post Successfully." });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new PostController();