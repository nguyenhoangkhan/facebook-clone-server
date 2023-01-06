const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "First Name is Required"],
      trim: true,
      text: true,
    },
    last_name: {
      type: String,
      required: [true, "Last Name is Required"],
      trim: true,
      text: true,
    },
    username: {
      type: String,
      required: [true, "UserName is Required"],
      trim: true,
      text: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    picture: {
      type: String,
      trim: true,
      default: "https://i.stack.imgur.com/l60Hf.png",
    },
    cover: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "Gender is Required"],
      trim: true,
    },
    bYear: {
      type: Number,
      required: true,
      trim: true,
    },
    bMonth: {
      type: Number,
      required: true,
      trim: true,
    },
    bDay: {
      type: Number,
      required: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: Schema.ObjectId,
        ref: "User",
      },
    ],
    request: [
      {
        type: Schema.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: Schema.ObjectId,
        ref: "User",
      },
    ],
    search: [
      {
        user: {
          type: Schema.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          required: true,
        },
      },
    ],
    details: {
      bio: {
        type: String,
      },
      otherName: {
        type: String,
      },
      workPlace: {
        type: String,
      },
      highSchool: {
        type: String,
      },
      college: {
        type: String,
      },
      currentCity: {
        type: String,
      },
      homeTown: {
        type: String,
      },
      relationship: {
        type: String,
        enum: ["Single", "In a Relationship", "Married", "Divorced"],
      },
      instagram: {
        type: String,
      },
    },
    savedPost: [
      {
        post: {
          type: Schema.ObjectId,
          ref: "Post",
        },
        savedAt: {
          type: Date,
          default: new Date(),
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
