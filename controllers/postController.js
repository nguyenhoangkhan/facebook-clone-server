const Post = require("../models/post");
const User = require("../models/user");
class PostController {
  // Create Post [POST]
  async create(req, res) {
    try {
      const { type, background, text, images, user } = req.body;
      const post = await new Post({
        type,
        background,
        text,
        images,
        user,
      }).save();

      post.populate("user", "first_name last_name username gender");
      return res.status(200).json(post);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
  // Get All Posts [GET]
  async get(req, res) {
    try {
      const followingList = await User.findById(req.user.id).select(
        "following"
      );

      const followings = followingList.following;

      const promise = followings.map((user) => {
        return Post.find({ user })
          .populate("user", "first_name last_name username picture gender")
          .populate(
            "comments.commentBy",
            "last_name first_name username picture"
          )
          .sort({ createdAt: "desc" });
      });

      const followingPosts = (await Promise.all(promise)).flat();

      const currentUserPosts = await Post.find({ user: req.user.id })
        .populate("user", "first_name last_name username picture gender")
        .populate("comments.commentBy", "last_name first_name username picture")
        .sort({ createdAt: "desc" });

      const posts = followingPosts
        .concat(currentUserPosts)
        .sort((a, b) => b.createdAt - a.createdAt);

      return res.status(200).json(posts);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
  // SOFT DELETE POST [PATCH]
  async deletePost(req, res) {
    try {
      await Post.delete({ _id: req.body.postId });
      const posts = await Post.find({}).populate(
        "user",
        "first_name last_name username picture gender"
      );

      return res.status(200).json(posts);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
  // GET DELETED POSTS [GET]
  async getDeletedPosts(req, res) {
    try {
      const posts = await Post.findDeleted({ user: req.user.id })
        .populate("user", "-password")
        .sort({ deletedAt: "desc" });

      return res.status(200).json(posts);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
  // RESTORE DELETED POST [PATCH]
  async restore(req, res) {
    try {
      await Post.restore({ _id: req.body.postId });

      return res
        .status(200)
        .json({ message: "Ph???c h???i th??nh c??ng b??i vi???t " + req.body.postId });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
  // FORCE DELETE POST [DELETE]
  async forceDeletePost(req, res) {
    try {
      await Post.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        message: "???? x??a v??nh vi???n th??nh c??ng b??i vi???t " + req.params.id,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // SAVE POST [PATCH]
  async savePost(req, res) {
    try {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          savedPost: { post: req.body.postId, savedAt: new Date() },
        },
      });
      return res.status(200).json({
        message: `Th??m th??nh c??ng b??i vi???t ${req.user.id} v??o danh s??ch m???c l??u tr???`,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new PostController();
