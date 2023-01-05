const React = require("../models/react");
const mongoose = require("mongoose");

class ReactController {
  async react(req, res) {
    try {
      const { postId, react } = req.body;

      const check = await React.findOne({
        post: postId,
        reactBy: mongoose.Types.ObjectId(req.user.id),
      });

      if (!check) {
        await new React({
          react: react,
          post: postId,
          reactBy: mongoose.Types.ObjectId(req.user.id),
        }).save();

        return res
          .status(200)
          .json({ message: "Bày tỏ cảm xúc với bài viết thành công" });
      }
      if (check.react === react) {
        await React.findByIdAndRemove(check._id);

        return res
          .status(200)
          .json({ message: "Hủy bỏ bày tỏ cảm xúc với bài viết thành công" });
      } else {
        await React.findByIdAndUpdate(check._id, {
          react,
        });

        return res.status(200).json({
          message: "Đã thay đổi bày tỏ cảm xúc với bài viết thành công",
        });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  async getReacts(req, res) {
    try {
      const reacts = await React.find({
        post: req.params.postId,
      });

      const currentUserReact = await React.findOne({
        post: req.params.postId,
        reactBy: req.user.id,
      });

      if (!reacts) {
        return res
          .status(400)
          .json({ message: "Không có lượt bày tỏ cảm xúc nào" });
      }

      return res
        .status(200)
        .json({ reacts, currentUserReact: currentUserReact.react });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new ReactController();
