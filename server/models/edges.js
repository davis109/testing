const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EdgesSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    canvas_id: {
      type: Schema.Types.ObjectId,
      ref: "Canvas",
      required: true,
    },
    source: {
      type: Schema.Types.ObjectId,
      ref: "Nodes",
      required: true,
    },
    target: {
      type: Schema.Types.ObjectId,
      ref: "Nodes",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Edges", EdgesSchema);
