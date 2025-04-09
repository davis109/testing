const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NodesSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    canvas_id: {
      type: String,
      ref: "Canvas",
      required: true,
    },
    type: {
      type: Schema.Types.Mixed,
      default: null,
    },
    data: {
      label: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: false, // Making it optional since not all nodes might need an image
      },
      image_file: {
        type: Schema.Types.Mixed,
        required: false, // Making it optional since not all nodes might need an image
      },
    },
    image_path: {
      type: String,
      required: false,
    },
    position: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// // Index for efficient queries
// NodesSchema.index({ node_id: 1 });
// NodesSchema.index({ user_id: 1 });
// NodesSchema.index({ canvas_id: 1 });

module.exports = mongoose.model("Nodes", NodesSchema);
