const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CanvasSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      default: "Untitled Canvas",
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nodes: {
      type: Schema.Types.Mixed,
      required: false,
      default: [],
    },
    edges: {
      type: Schema.Types.Mixed,
      required: false,
      default: [],
    },
    last_modified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Canvas", CanvasSchema);
