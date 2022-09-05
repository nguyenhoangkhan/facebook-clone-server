class PostController {
  // Create Post [POST]
  async index(req, res) {
    try {
      res.send("Ok post!");
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new PostController();
