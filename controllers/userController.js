class userController {
  index(req, res) {
    res.send("User!!");
  }
}

module.exports = new userController();
