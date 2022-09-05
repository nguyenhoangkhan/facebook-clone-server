const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const codeModel = new mongoose.Schema(
  {
    code: {
      type: Number,
      required: true,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Code", codeModel);
