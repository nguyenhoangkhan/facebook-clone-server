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
          react,
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
      const reactsArray = await React.find({
        post: req.params.postId,
      });

      // map value to get explain object contain value
      const mapReacts = reactsArray.reduce((group, react) => {
        let key = react["react"];

        if (!group[key]) {
          group[key] = [];
        }

        group[key].push(react);

        return group;
      }, {});

      const reacts = [
        {
          react: "like",
          count: mapReacts["like"] ? mapReacts["like"].length : 0,
        },
        {
          react: "love",
          count: mapReacts["love"] ? mapReacts["love"].length : 0,
        },
        {
          react: "sad",
          count: mapReacts["sad"] ? mapReacts["sad"].length : 0,
        },
        {
          react: "haha",
          count: mapReacts["haha"] ? mapReacts["haha"].length : 0,
        },
        {
          react: "wow",
          count: mapReacts["wow"] ? mapReacts["wow"].length : 0,
        },
        {
          react: "angry",
          count: mapReacts["angry"] ? mapReacts["angry"].length : 0,
        },
      ];

      const currentUserReact = await React.findOne({
        post: req.params.postId,
        reactBy: req.user.id,
      });

      return res.status(200).json({
        reacts,
        currentUserReact: currentUserReact?.react,
        total: reacts.reduce((acc, curr) => (acc += curr.count), 0),
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new ReactController();
