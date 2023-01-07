const User = require("../models/user");

class SearchController {
  // Search User [GET]
  async searchUser(req, res) {
    try {
      const { q } = req.query;
      const users = await User.find({});

      if (!users) {
        return res.status(400).json({ message: "Không tìm thấy người dùng" });
      }

      const result = users.filter(
        (user) =>
          user.username.toLowerCase().includes(q.toLowerCase()) ||
          user.first_name.toLowerCase().includes(q.toLowerCase()) ||
          user.last_name.toLowerCase().includes(q.toLowerCase()) ||
          user.email.toLowerCase().includes(q.toLowerCase())
      );
      return res.status(200).json(result.slice(0, 10));
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Add Search User History [PATCH]
  async addSearchUserHistory(req, res) {
    try {
      const { searchUser } = req.body;

      const user = await User.findById(req.user.id);

      const check = user.search.find((x) => x.user.equals(searchUser));

      if (!check) {
        const result = await User.findByIdAndUpdate(req.user.id, {
          $push: {
            search: { user: searchUser, createdAt: new Date() },
          },
        });
        return res.status(200).json(result);
      }

      const result = await User.updateOne(
        {
          _id: req.user.id,
          "search._id": check._id,
        },
        {
          $set: {
            "search.$.createdAt": new Date(),
          },
        }
      );
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Get Search User History [GET]
  async getSearchUserHistory(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.id }).populate(
        "search.user",
        "picture first_name last_name username"
      );
      const searchHistory = user.search;

      return res.status(200).json(searchHistory);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new SearchController();
