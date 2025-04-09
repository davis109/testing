const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: false,
      default: "",
    },
    access_token: {
      type: String,
    },
    refresh_token: {
      type: String,
      expires: 3600,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
