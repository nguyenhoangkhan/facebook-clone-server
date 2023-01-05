const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const reactModel = new mongoose.Schema(
  {
    react: {
      type: String,
      enum: ["like", "love", "haha", "wow", "sad", "angry"],
      required: true,
    },
    post: {
      type: ObjectId,
      ref: "Post",
    },
    reactBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// module.exports = mongoose.model("React", reactModel);
