const User = require("../models/user.js");
const Post = require("../models/post.js");
const bcrypt = require("bcrypt");

const validation = require("../helpers/validation.js");
const tokens = require("../helpers/tokens.js");

class userController {
  // register [POST]
  async register(req, res) {
    try {
      const {
        first_name,
        last_name,
        email,
        password,
        bYear,
        bMonth,
        bDay,
        gender,
      } = req.body;

      // Check valid email address
      if (!validation.email(email)) {
        return res.status(401).json({ message: "Địa chỉ Email không hợp lệ." });
      }
      // Check exits email
      const checkExistEmail = await User.findOne({ email });
      // Handle when email is exist
      if (checkExistEmail) {
        return res
          .status(401)
          .json({ message: "Địa chỉ Email đã tồn tại. Vui lòng thử lại!" });
      }

      // Check first_name length
      if (!validation.length(first_name, 3, 30)) {
        return res.status(401).json({
          message: "Tên phải có từ 3 đến 30 kí tự.",
        });
      }

      // Check last_name length
      if (!validation.length(last_name, 3, 30)) {
        return res.status(401).json({
          message: "Họ phải có từ 3 đến 30 kí tự.",
        });
      }

      // Check password length
      if (!validation.length(password, 6)) {
        return res.status(401).json({
          message: "Mật khẩu tối thiểu từ 6 ký tự.",
        });
      }

      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Validate Unique Username
      const tempUserName = first_name + last_name;
      const newUsername = await validation.username(tempUserName);

      // Create document user to db
      const user = await new User({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        username: newUsername,
        bYear,
        bMonth,
        bDay,
        gender,
      }).save();

      const token = tokens.generateToken(
        {
          id: user._id.toString(),
        },
        "7d"
      );
      // Send information to frontend
      return res.send({
        id: user._id,
        username: user.username,
        picture: user.picture,
        first_name: user.first_name,
        last_name: user.last_name,
        token,
        message: "Đăng ký tài khoản thành công!",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  // */login [POST]
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user && !password) {
        return res
          .status(400)
          .json({ message: "Bạn cần điền thông tin đăng nhập" });
      }
      if (!user) {
        return res.status(400).json({ message: "Địa chỉ Email không tồn tại" });
      }
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return res.status(401).json({
          message: "Mật khẩu bạn nhập không chính xác",
        });
      }
      // Generate token to user._id
      const token = tokens.generateToken(
        {
          id: user._id.toString(),
        },
        "7d"
      );
      // Send information to frontend

      return res.json({
        id: user._id,
        username: user.username,
        picture: user.picture,
        first_name: user.first_name,
        last_name: user.last_name,
        token,
        message: "Đăng nhập thành công!",
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  async getProfile(req, res) {
    try {
      const { username } = req.params;

      // User
      const user = await User.findById(req.user.id);

      // Current Profile
      const profile = await User.findOne({ username })
        .select("-password")
        .populate(
          "friends",
          "first_name last_name username picture friends following followers request"
        );

      const friendship = {
        isFriend: false,
        isFollowing: false,
        requestSent: false,
        requestReceived: false,
      };

      if (!profile) {
        return res
          .status(400)
          .json({ message: "Không tìm thấy trang cá nhân" });
      }

      const currentUserInFriendsListOfProfile = profile?.friends.filter(
        (item) => item._id.equals(user._id)
      );
      const currentUserInFollowersListOfProfile = profile?.followers.filter(
        (item) => item._id.equals(user._id)
      );
      const currentUserInRequestListOfProfile = profile?.request.filter(
        (item) => item._id.equals(user._id)
      );

      if (currentUserInFriendsListOfProfile.length) {
        if (
          user.friends.includes(profile._id) &&
          currentUserInFriendsListOfProfile[0]._id.equals(user._id)
        ) {
          friendship.isFriend = true;
        }
      }

      if (currentUserInFollowersListOfProfile.length) {
        if (
          user.following.includes(profile._id) ||
          currentUserInFollowersListOfProfile[0]._id.equals(user._id)
        ) {
          friendship.isFollowing = true;
        }
      }

      if (currentUserInRequestListOfProfile.length) {
        if (currentUserInRequestListOfProfile[0].equals(user._id)) {
          friendship.requestSent = true;
        }
      }

      if (user.request.includes(profile._id)) {
        friendship.requestReceived = true;
      }

      const post = await Post.find({ user: profile._id })
        .populate("user", "-password")
        .populate("comments.commentBy", "last_name first_name username picture")
        .sort({ createdAt: "desc" });

      return res.json({ ...profile.toObject(), post, friendship });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Search User [GET]
  async searchUser(req, res) {
    try {
      const { q } = req.query;
      const users = await User.find({});

      const result = users.filter(
        (user) =>
          user.username.toLowerCase().includes(q.toLowerCase()) ||
          user.first_name.toLowerCase().includes(q.toLowerCase()) ||
          user.last_name.toLowerCase().includes(q.toLowerCase()) ||
          user.email.toLowerCase().includes(q.toLowerCase())
      );

      return res.status(200).json(result);
    } catch {
      return res.status(500).json({ message: err.message });
    }
  }

  // User Avatar [PATCH]
  async uploadPictureProfile(req, res) {
    try {
      const { picture } = req.body;
      const userId = req.user.id;

      const data = await User.findByIdAndUpdate(
        userId,
        { picture },
        { new: true }
      );

      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // User Cover [PATCH]
  async uploadCoverProfile(req, res) {
    try {
      const { cover } = req.body;
      const userId = req.user.id;

      const data = await User.findByIdAndUpdate(
        userId,
        { cover },
        { new: true }
      );

      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // User Details [PATCH]
  async updateUserDetails(req, res) {
    try {
      const { details } = req.body;
      const userId = req.user.id;

      const data = await User.findByIdAndUpdate(
        userId,
        { details },
        { new: true }
      );
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  async follow(req, res) {
    try {
      if (req.user.id !== req.params.id) {
        const sender = await User.findById(req.user.id);
        const receiver = await User.findById(req.params.id);

        if (
          !receiver.followers.includes(sender._id) &&
          !sender.following.includes(receiver._id)
        ) {
          await receiver.updateOne({
            $push: { followers: sender._id },
          });
          await sender.updateOne({
            $push: { following: receiver._id },
          });
          return res.status(200).json({
            message: "Đã theo dõi thành công",
          });
        } else {
          return res.status(400).json({
            message: "Bạn đã theo dõi người này rồi",
          });
        }
      } else {
        return res.status(400).json({
          message: "Bạn không thể tự theo dõi chính mình",
        });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  async unFollow(req, res) {
    try {
      if (req.user.id !== req.params.id) {
        const sender = await User.findById(req.user.id);
        const receiver = await User.findById(req.params.id);

        if (
          !receiver.followers.includes(sender._id) &&
          !sender.following.includes(receiver._id)
        ) {
          await receiver.updateOne({
            $pull: { followers: sender._id },
          });
          await sender.updateOne({
            $pull: { following: receiver._id },
          });
          return res.status(200).json({
            message: "Bỏ theo dõi thành công",
          });
        } else {
          return res.status(400).json({
            message: "Bạn chưa theo dõi người này",
          });
        }
      } else {
        return res.status(400).json({
          message: "Bạn không thể tự bỏ theo dõi chính mình",
        });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}
module.exports = new userController();
