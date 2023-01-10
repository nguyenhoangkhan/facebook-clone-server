const User = require("../models/user.js");

class friendController {
  // Send Add Friend Request [PATCH]
  async addFriend(req, res) {
    try {
      if (req.user.id !== req.params.id) {
        const sender = await User.findById(req.user.id);
        const receiver = await User.findById(req.params.id);
        if (
          !receiver.request.includes(sender._id) &&
          !receiver.friends.includes(sender._id) &&
          !sender.friends.includes(receiver._id)
        ) {
          await receiver.update({
            $push: { followers: sender._id, request: sender._id },
          });
          await sender.updateOne({
            $push: { following: receiver._id },
          });
          return res.status(200).json({
            message: "Gửi yêu cầu kết bạn thành công",
          });
        } else {
          return res.status(400).json({
            message:
              "Yêu cầu kết bạn đã được gửi đi trước đó, hoặc các bạn đã là bạn bè",
          });
        }
      } else {
        return res.status(400).json({
          message: "Bạn không thể gửi yêu cầu kết bạn cho chính mình",
        });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  async unFriend(req, res) {
    try {
      if (req.user.id !== req.params.id) {
        const sender = await User.findById(req.user.id);
        const receiver = await User.findById(req.params.id);

        if (
          receiver.friends.includes(sender._id) &&
          sender.friends.includes(receiver._id)
        ) {
          await receiver.update({
            $pull: {
              friends: sender._id,
              following: sender._id,
              followers: sender._id,
            },
          });
          await sender.update({
            $pull: {
              friends: receiver._id,
              following: receiver._id,
              followers: receiver._id,
            },
          });

          return res.status(200).json({
            message: "Đã hủy kết bạn thành công",
          });
        } else {
          return res.status(400).json({
            message: "Người này không phải bạn bè của bạn",
          });
        }
      } else {
        return res.status(400).json({
          message: "Bạn không thể hủy kết bạn với chính mình",
        });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
  async deleteFriendRequest(req, res) {
    try {
      if (req.user.id !== req.params.id) {
        const sender = await User.findById(req.user.id);
        const receiver = await User.findById(req.params.id);

        if (receiver.request.includes(sender._id)) {
          await receiver.updateOne({
            $pull: { request: sender._id },
          });

          return res.status(200).json({
            message: "Đã hủy yêu cầu kết bạn thành công",
          });
        } else {
          return res.status(400).json({
            message: "Bạn chưa gửi yêu cầu kết bạn cho người này",
          });
        }
      } else {
        return res.status(400).json({
          message: "Bạn không thể xóa yêu cầu kết bạn với chính mình",
        });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  async acceptFriendRequest(req, res) {
    try {
      if (req.user.id !== req.params.id) {
        const receiver = await User.findById(req.user.id);
        const sender = await User.findById(req.params.id);

        if (receiver.request.includes(sender._id)) {
          await receiver.update({
            $pull: { request: sender._id },
          });

          await sender.update({
            $push: {
              friends: receiver._id,
              followers: receiver._id,
              following: receiver._id,
            },
          });
          await receiver.update({
            $push: {
              friends: sender._id,
              followers: sender._id,
              following: sender._id,
            },
          });

          return res.status(200).json({
            message: "Đã đồng ý yêu cầu kết bạn",
          });
        } else {
          return res.status(400).json({
            message: "Không có yêu cầu kết bạn",
          });
        }
      } else {
        return res.status(400).json({
          message: "Bạn không thể đồng ý yêu cầu kết bạn từ chính mình",
        });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  async cancelFriendRequest(req, res) {
    try {
      if (req.user.id !== req.params.id) {
        const receiver = await User.findById(req.user.id);
        const sender = await User.findById(req.params.id);

        if (receiver.request.includes(sender._id)) {
          await receiver.updateOne({
            $pull: { request: sender._id },
          });
          await receiver.updateOne({
            $pull: { followers: sender._id },
          });
          await sender.updateOne({
            $pull: { following: receiver._id },
          });
          return res.status(200).json({
            message: "Hủy yêu cầu kết bạn thành công",
          });
        } else {
          return res.status(400).json({
            message: "Yêu cầu kết bạn không tồn tại",
          });
        }
      } else {
        return res.status(400).json({
          message: "Bạn không thể hủy yêu cầu kết bạn từ chính mình",
        });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  async getFriendsPageInfos(req, res) {
    try {
      const user = await User.findById(req.user.id)
        .select("friends request")
        .populate("friends", "first_name last_name username picture")
        .populate("request", "first_name last_name username picture");

      const requestsSent = await User.find({
        request: req.user.id,
      });

      const result = {
        friends: user.friends,
        request: user.request,
        sent: requestsSent,
      };

      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new friendController();
