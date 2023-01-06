const Post = require("../models/post");
const User = require("../models/user");

class CommentController {
  async createComment(req, res) {
    try {
      const { comment, image, postId } = req.body;

      const newComment = await Post.findByIdAndUpdate(
        postId,
        {
          $push: {
            comments: {
              comment,
              image,
              commentBy: req.user.id,
            },
          },
        },
        {
          new: true,
        }
      ).populate("comments.commentBy", "first_name last_name username");

      return res.status(200).json(newComment.comments);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new CommentController();
